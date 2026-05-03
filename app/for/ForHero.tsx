"use client";

/**
 * /for · hero block.
 *
 * Co-located with `page.tsx` (not in `components/skillies/`) because it's
 * the page-specific composition for the vertical chooser. Three moving
 * parts:
 *
 *   1. Eyebrow "PICK YOUR VERTICAL" with a tiny pulsing terminal cursor
 *   2. The headline ("Skillies for *your business*.")
 *   3. A code-flavored line that types itself out on first viewport entry
 *      using Framer Motion's `useInView`
 *   4. A subtle live-stat ticker on the right (verticals · agents · convos)
 *      driven by `BigStatTicker`
 *
 * All motion respects `prefers-reduced-motion` via Framer's
 * `useReducedMotion`.
 */

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BigStatTicker from "@/components/skillies/BigStatTicker";

/* ─────────────────────────── Typed code line ──────────────────── */

/**
 * A short code-flavored line that types itself on first viewport entry.
 * Tokens carry their own color so the keyword + string stand out without
 * a real syntax-highlighter dependency.
 */
type Token = {
  text: string;
  /** Foreground color for this token */
  color?: string;
  /** Whether to render as italic (for placeholder values) */
  italic?: boolean;
};

const CODE_TOKENS: Token[] = [
  { text: "> ", color: "var(--sk-red)" },
  { text: "skillies" },
  { text: "." },
  { text: "deploy", color: "var(--sk-red)" },
  { text: "({ vertical: " },
  { text: "\"_your_pick_\"", color: "var(--sk-ochre)", italic: true },
  { text: ", language: " },
  { text: "\"Mal+Eng\"", color: "var(--sk-ochre)" },
  { text: ", memory: " },
  { text: "\"lifelong\"", color: "var(--sk-ochre)" },
  { text: " })" },
];

/** Total characters across the line — drives the typing schedule. */
function totalChars(tokens: Token[]): number {
  return tokens.reduce((acc, t) => acc + t.text.length, 0);
}

/** Slice the tokens up to `n` characters, preserving per-token color. */
function sliceTokens(tokens: Token[], n: number): Token[] {
  if (n <= 0) return [];
  let remaining = n;
  const out: Token[] = [];
  for (const t of tokens) {
    if (remaining <= 0) break;
    if (t.text.length <= remaining) {
      out.push(t);
      remaining -= t.text.length;
    } else {
      out.push({ ...t, text: t.text.slice(0, remaining) });
      remaining = 0;
    }
  }
  return out;
}

function TypedCodeLine() {
  const reducedMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  const total = totalChars(CODE_TOKENS);
  const [chars, setChars] = useState<number>(reducedMotion ? total : 0);

  useEffect(() => {
    if (reducedMotion) {
      // Defer to a microtask so we're not setting state synchronously
      // in the effect body (lint rule: react-hooks/set-state-in-effect).
      const id = window.setTimeout(() => setChars(total), 0);
      return () => window.clearTimeout(id);
    }
    if (!inView) return;
    let cancelled = false;
    let i = 0;
    const stepMs = 18;
    const tick = () => {
      if (cancelled) return;
      i += 1;
      setChars(i);
      if (i < total) {
        window.setTimeout(tick, stepMs);
      }
    };
    const start = window.setTimeout(tick, 320);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
    };
  }, [inView, reducedMotion, total]);

  const visible = sliceTokens(CODE_TOKENS, chars);
  const done = chars >= total;

  return (
    <div
      ref={ref}
      className="font-mono"
      style={{
        marginTop: "1.5rem",
        padding: "0.85rem 1rem",
        borderRadius: "0.625rem",
        background: "color-mix(in srgb, var(--sk-ink) 6%, var(--sk-cream))",
        border: "1px solid var(--sk-hairline)",
        fontSize: "0.8125rem",
        color: "var(--sk-ink)",
        letterSpacing: "-0.005em",
        lineHeight: 1.55,
        maxWidth: "min(640px, 100%)",
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
      }}
      aria-label="Code preview: skillies.deploy({ vertical, language, memory })"
    >
      {visible.map((t, i) => (
        <span
          key={i}
          style={{
            color: t.color ?? "var(--sk-ink)",
            fontStyle: t.italic ? "italic" : "normal",
          }}
        >
          {t.text}
        </span>
      ))}
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "0.55ch",
          marginLeft: "0.1em",
          color: "var(--sk-red)",
          opacity: done ? 1 : 0.85,
          animation: reducedMotion
            ? "none"
            : "sk-fh-blink 1.05s steps(2, start) infinite",
        }}
      >
        |
      </span>
    </div>
  );
}

/* ─────────────────────────── Live-stat ticker ─────────────────── */

function LiveStatTicker() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "1rem",
        padding: "1.25rem",
        borderRadius: "0.875rem",
        border: "1px solid var(--sk-hairline)",
        background:
          "color-mix(in srgb, var(--sk-ochre) 5%, var(--sk-cream))",
      }}
      aria-label="Live Skillies status"
    >
      <StatCell to={7} label="verticals active" />
      <StatCell to={16} label="agents online" />
      <StatCell to={2400} label="convos this hour" prefix="~" />
    </div>
  );
}

function StatCell({
  to,
  label,
  prefix,
}: {
  to: number;
  label: string;
  prefix?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: "clamp(1.5rem, 1.5vw + 1rem, 2.25rem)",
          lineHeight: 1.0,
        }}
      >
        <BigStatTicker to={to} format="comma" prefix={prefix} />
      </div>
      <div
        className="sk-font-meta"
        style={{
          color: "var(--sk-ink60)",
          fontSize: "0.6875rem",
          marginTop: "0.4rem",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────── Eyebrow w/ cursor ────────────────── */

function EyebrowWithCursor() {
  const reducedMotion = useReducedMotion() ?? false;
  return (
    <p
      className="sk-font-meta mb-6"
      style={{ color: "var(--sk-ink60)", display: "inline-flex", alignItems: "center" }}
    >
      <span>PICK YOUR VERTICAL</span>
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          marginLeft: "0.5em",
          color: "var(--sk-red)",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          fontWeight: 700,
          animation: reducedMotion
            ? "none"
            : "sk-fh-blink 1.05s steps(2, start) infinite",
        }}
      >
        ▍
      </span>
    </p>
  );
}

/* ─────────────────────────── Section ──────────────────────────── */

export default function ForHero() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section className="sk-section pt-32 md:pt-40" style={{ paddingBottom: "3rem" }}>
      {/* Local keyframes — scoped to this hero. */}
      <style>{`
        @keyframes sk-fh-blink {
          0%, 49%   { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>

      <div className="sk-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "2.5rem",
            alignItems: "end",
          }}
          className="sk-fh-grid"
        >
          <div>
            <EyebrowWithCursor />
            <motion.h1
              className="sk-font-display"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "var(--sk-text-display)",
                color: "var(--sk-ink)",
                maxWidth: "20ch",
              }}
            >
              Skillies for{" "}
              <span
                className="sk-font-display-italic"
                style={{ color: "var(--sk-red)" }}
              >
                your business
              </span>
              .
            </motion.h1>
            <motion.p
              className="sk-font-body mt-6"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "var(--sk-text-lead)",
                color: "var(--sk-ink60)",
                maxWidth: "54ch",
              }}
            >
              Seven vertical-specific AI sales workers. Pick the one closest
              to your business — each has its own pain, demo, and price.
            </motion.p>
            <TypedCodeLine />
          </div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: "560px" }}
          >
            <LiveStatTicker />
          </motion.div>
        </div>
      </div>

      {/* Two-column grid above ~840px — single column below. */}
      <style>{`
        @media (min-width: 900px) {
          .sk-fh-grid {
            grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
