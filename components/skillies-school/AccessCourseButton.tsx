"use client";

import React, { useState } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * The 3-branch button on every course card.
 *
 *   Not logged in           → /login?next=<this course>
 *   Logged in, NOT enrolled → WhatsApp deeplink to admin
 *   Logged in, enrolled     → "Open Course" → /learn/<courseId>
 *
 * The parent decides which state we're in via the `state` prop. The
 * button is then just a styled link or button; no extra fetches.
 */

type State =
  | { kind: "anon"; courseId: string; courseTitle: string }
  | { kind: "not-enrolled"; courseTitle: string; phone?: string | null }
  | { kind: "enrolled"; courseId: string };

export default function AccessCourseButton({
  state,
  variant = "primary",
  fullWidth = false,
}: {
  state: State;
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
}) {
  const [hover, setHover] = useState(false);

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 22px",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    transition: "transform 160ms ease, box-shadow 160ms ease, background 160ms ease",
    width: fullWidth ? "100%" : undefined,
    boxShadow:
      variant === "primary"
        ? hover
          ? "0 14px 34px rgba(198,40,40,0.30)"
          : "0 10px 24px rgba(198,40,40,0.20)"
        : undefined,
    transform: hover ? "translateY(-1px)" : undefined,
  };

  const primary: React.CSSProperties = {
    ...baseStyle,
    background: hover ? "#B22020" : "#C62828",
    color: "white",
  };

  const ghost: React.CSSProperties = {
    ...baseStyle,
    background: hover ? "rgba(26,26,26,0.06)" : "transparent",
    color: "#1A1A1A",
    border: "1.5px solid rgba(26,26,26,0.12)",
  };

  const style = variant === "primary" ? primary : ghost;

  if (state.kind === "anon") {
    const next = `/skillies-school/courses/${encodeURIComponent(state.courseId)}`;
    return (
      <a
        href={`/login?next=${encodeURIComponent(next)}`}
        style={style}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <LockIcon /> Access Course
      </a>
    );
  }

  if (state.kind === "not-enrolled") {
    const href = buildWhatsAppUrl({
      courseTitle: state.courseTitle,
      phone: state.phone ?? undefined,
    });
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={style}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <WhatsAppIcon /> Access Course
      </a>
    );
  }

  // enrolled
  return (
    <a
      href={`/learn/${encodeURIComponent(state.courseId)}`}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <PlayIcon /> Open Course
    </a>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="11"
        width="16"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 11V8a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.2 0 1.3.9 2.5 1 2.7.1.2 1.8 2.7 4.3 3.8 1.5.6 2.1.7 2.9.5.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
