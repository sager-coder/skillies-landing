"use client";

import React, { useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * LessonPlayer
 * - If videoId is a Cloudflare Stream UID → embeds the player iframe.
 * - Otherwise → shows a placeholder card so lesson pages still render
 *   while videos are being recorded (Phase 1 launch state).
 *
 * On player events, marks lesson as completed (>= 90% watched).
 */
export default function LessonPlayer({
  videoId,
  lessonId,
  title,
}: {
  videoId: string | null;
  lessonId: string;
  title: string;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [completed, setCompleted] = useState(false);

  // Listen for Cloudflare Stream player events via postMessage.
  // The iframe sends 'play', 'pause', 'ended', 'timeupdate' events.
  useEffect(() => {
    if (!videoId) return;
    const onMessage = async (e: MessageEvent) => {
      // Stream sends data shaped like { event: "ended" } etc.
      const data = (e.data ?? {}) as { event?: string; currentTime?: number; duration?: number };
      if (data.event === "ended" && !completed) {
        setCompleted(true);
        await markComplete(lessonId);
      }
      if (data.event === "timeupdate" && data.currentTime && data.duration) {
        if (data.currentTime / data.duration > 0.9 && !completed) {
          setCompleted(true);
          await markComplete(lessonId);
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [videoId, lessonId, completed]);

  if (!videoId) {
    return (
      <div
        style={{
          aspectRatio: "16 / 9",
          background: "linear-gradient(135deg, #1A1A1A, #2D2D2D)",
          borderRadius: 18,
          display: "grid",
          placeItems: "center",
          color: "white",
          textAlign: "center",
          padding: 32,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 70% 30%, rgba(201,162,78,0.18), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(198,40,40,0.18), transparent 60%)",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#E6C178",
              marginBottom: 12,
            }}
          >
            Recording in progress
          </div>
          <div
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: 1.15,
              color: "#FAF5EB",
              maxWidth: 540,
            }}
          >
            &ldquo;{title}&rdquo;
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 16 }}>
            This lesson&apos;s video is being filmed. You&apos;ll get a WhatsApp ping when it lands.
          </div>
        </div>
      </div>
    );
  }

  const src = `https://customer-${process.env.NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE || "TBD"}.cloudflarestream.com/${videoId}/iframe?poster=https%3A%2F%2Fcustomer-${process.env.NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE || "TBD"}.cloudflarestream.com%2F${videoId}%2Fthumbnails%2Fthumbnail.jpg`;

  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "16 / 9",
        background: "#000",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
      }}
    >
      <iframe
        ref={ref}
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </div>
  );
}

async function markComplete(lessonId: string) {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("lesson_progress")
      .upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          last_watched_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" },
      );
  } catch {
    /* swallow — non-critical */
  }
}
