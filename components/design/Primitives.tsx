"use client";

import React, { CSSProperties, ReactNode } from "react";

type Tone = "red" | "green" | "gold" | "green-light";

export function Kicker({
  children,
  tone = "red",
  className = "",
  style,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  style?: CSSProperties;
}) {
  const colors: Record<Tone, string> = {
    red: "#C62828",
    green: "#5B7B5B",
    gold: "#C9A24E",
    "green-light": "#7A9A7A",
  };
  return (
    <p
      className={className}
      style={{
        fontSize: 12,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.3em",
        color: colors[tone],
        margin: 0,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

export function KickerPill({
  children,
  tone = "green",
}: {
  children: ReactNode;
  tone?: "green" | "red" | "gold";
}) {
  const palettes = {
    green: {
      bg: "rgba(91,123,91,0.10)",
      bd: "rgba(91,123,91,0.25)",
      fg: "#3D5A3D",
      dot: "#5B7B5B",
    },
    red: {
      bg: "rgba(198,40,40,0.08)",
      bd: "rgba(198,40,40,0.25)",
      fg: "#C62828",
      dot: "#C62828",
    },
    gold: {
      bg: "rgba(201,162,78,0.10)",
      bd: "rgba(201,162,78,0.30)",
      fg: "#8a6a1f",
      dot: "#C9A24E",
    },
  };
  const p = palettes[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        borderRadius: 999,
        background: p.bg,
        border: `1px solid ${p.bd}`,
        color: p.fg,
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      <span
        style={{ width: 8, height: 8, borderRadius: 999, background: p.dot }}
      />
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  href = "#",
  onClick,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "14px 28px",
        borderRadius: 999,
        background: "#C62828",
        color: "white",
        fontWeight: 600,
        fontSize: 15,
        boxShadow: "0 12px 40px rgba(198,40,40,0.15)",
        textDecoration: "none",
        transition: "all .25s cubic-bezier(.22,1,.36,1)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#8B1A1A";
        e.currentTarget.style.transform = "scale(1.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#C62828";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 8l4 4-4 4M3 12h18" />
      </svg>
    </a>
  );
}

export function SecondaryButton({
  children,
  href = "#",
  onClick,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "14px 28px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(26,26,26,0.10)",
        color: "#1A1A1A",
        fontWeight: 500,
        fontSize: 15,
        textDecoration: "none",
        cursor: "pointer",
        transition: "all .25s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(198,40,40,0.3)";
        e.currentTarget.style.color = "#C62828";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(26,26,26,0.10)";
        e.currentTarget.style.color = "#1A1A1A";
      }}
    >
      {children}
    </a>
  );
}

export function Wordmark({
  size = 48,
  dark = false,
}: {
  size?: number;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        fontWeight: 900,
        fontSize: size,
        letterSpacing: "-0.04em",
        color: dark ? "white" : "#1A1A1A",
        lineHeight: 1,
      }}
    >
      SKILLIES
      <span style={{ color: dark ? "#EF4444" : "#C62828" }}>.AI</span>
    </div>
  );
}

export function Grain({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
        mixBlendMode: "multiply",
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='5'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
      }}
    />
  );
}
