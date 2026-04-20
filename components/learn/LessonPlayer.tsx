"use client";

import React, { useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * LessonPlayer
 * - If videoId is a Cloudflare Stream UID → embeds the player iframe.
 * - Otherwise → shows a placeholder card so lesson pages still render
 *   while videos are being recorded (Phase 1 launch state).
 *
 * Every loaded video has a personalised watermark overlaid on top: the
 * student's masked phone number, drifting position every ~25s. It's
 * baked into any screen recording the student makes, so a leaked
 * recording can be traced back to the account that leaked it — the
 * Netflix / Loom approach.
 *
 * On player events, marks lesson as completed (>= 90% watched).
 */
export default function LessonPlayer({
  videoId,
  lessonId,
  title,
  watermark,
}: {
  videoId: string | null;
  lessonId: string;
  title: string;
  /** Rendered on top of the iframe, usually the student's masked phone. */
  watermark?: string | null;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [completed, setCompleted] = useState(false);
  const [wmPos, setWmPos] = useState<{ x: number; y: number; align: "L" | "R" }>({
    x: 6,
    y: 8,
    align: "L",
  });

  // Drift the watermark around the corners + midpoints of the frame so a
  // screen recorder can't just crop one corner off. Moves every ~25s.
  useEffect(() => {
    if (!videoId) return;
    const positions: { x: number; y: number; align: "L" | "R" }[] = [
      { x: 6, y: 8, align: "L" },
      { x: 6, y: 50, align: "L" },
      { x: 6, y: 88, align: "L" },
      { x: 94, y: 8, align: "R" },
      { x: 94, y: 50, align: "R" },
      { x: 94, y: 88, align: "R" },
    ];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % positions.length;
      setWmPos(positions[i]);
    }, 25_000);
    return () => clearInterval(id);
  }, [videoId]);

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
            This lesson’s video is being filmed. You’ll get a WhatsApp ping when it lands.
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

      {/* Per-user watermark — drifts between 6 positions every 25s. Baked
          into any screen recording the student makes. pointer-events off so
          clicks go through to the player. */}
      {watermark && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: `${wmPos.y}%`,
              [wmPos.align === "L" ? "left" : "right"]: `${
                wmPos.align === "L" ? wmPos.x : 100 - wmPos.x
              }%`,
              transform: `translateY(-50%) ${
                wmPos.align === "R" ? "translateX(0)" : ""
              }`,
              padding: "4px 10px",
              borderRadius: 6,
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              color: "rgba(255,255,255,0.6)",
              fontSize: 11,
              fontFamily: "ui-monospace, Menlo, monospace",
              letterSpacing: "0.08em",
              mixBlendMode: "overlay",
              transition: "top 1.2s ease-in-out, left 1.2s ease-in-out, right 1.2s ease-in-out",
              userSelect: "none",
            }}
          >
            SKILLIES.AI · {watermark}
          </div>
        </div>
      )}
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
