"use client";

/**
 * /for · hero block.
 *
 * Co-located with `page.tsx` (not in `components/skillies/`) because it's
 * the page-specific composition for the vertical chooser. 
 * 
 * Visual uplift (v4):
 *  - Fixed metric ticker overflow.
 *  - Standardized typography with the new Tech Sans system.
 *  - Refined spacing and layout.
 *  - Improved mobile responsiveness for the ticker.
 */

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BigStatTicker from "@/components/skillies/BigStatTicker";

/* ─────────────────────────── Typed code line ──────────────────── */

type Token = {
  text: string;
  color?: string;
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

function totalChars(tokens: Token[]): number {
  return tokens.reduce((acc, t) => acc + t.text.length, 0);
}

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
        padding: "1rem 1.25rem",
        borderRadius: "1rem",
        background: "color-mix(in srgb, var(--sk-ink) 4%, var(--sk-cream))",
        border: "1px solid var(--sk-hairline)",
        fontSize: "0.8125rem",
        color: "var(--sk-ink)",
        letterSpacing: "-0.01em",
        lineHeight: 1.6,
        maxWidth: "min(640px, 100%)",
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
      }}
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
      className="sk-glass"
      style={{
        display: "grid",
        // Switched to auto-fit with a reasonable min-width to trigger stacking on mobile
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        gap: "1.5rem",
        padding: "2rem",
        borderRadius: "2rem",
        border: "1px solid var(--sk-hairline)",
        background: "color-mix(in srgb, var(--sk-ochre) 5%, var(--sk-cream))",
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
    <div className="flex flex-col min-w-0">
      <div
        className="sk-font-display"
        style={{
          fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
          lineHeight: 1.0,
          letterSpacing: "-0.03em",
          whiteSpace: "nowrap", // Keep number on one line
        }}
      >
        <BigStatTicker to={to} format="comma" prefix={prefix} />
      </div>
      <div
        className="sk-font-meta"
        style={{
          color: "var(--sk-ink40)",
          fontSize: "0.6875rem",
          marginTop: "0.6rem",
          lineHeight: 1.2,
          letterSpacing: "0.05em",
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
      style={{ color: "var(--sk-ink40)", display: "inline-flex", alignItems: "center" }}
    >
      <span>PICK YOUR VERTICAL</span>
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          marginLeft: "0.5em",
          color: "var(--sk-red)",
          fontFamily: "monospace",
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
            gap: "3rem",
            alignItems: "end",
          }}
          className="sk-fh-grid"
        >
          <div>
            <EyebrowWithCursor />
            <motion.h1
              className="sk-font-display sk-text-balance"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "var(--sk-text-display)",
                color: "var(--sk-ink)",
                maxWidth: "18ch",
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
                maxWidth: "50ch",
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
            style={{ maxWidth: "600px", width: "100%" }}
          >
            <LiveStatTicker />
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .sk-fh-grid {
            grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
