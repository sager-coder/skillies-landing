"use client";

/**
 * /for · "Don't see your vertical?" callout.
 *
 * A dark editor-style card that reads like a JSON config + a "Run" button
 * that books a 30-min call with Ehsan. Lives next to `page.tsx` because
 * it's a page-level composition piece, not a reusable primitive.
 *
 * The cursor at the end of the last comment blinks unless the user has
 * reduced motion turned on.
 */

import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const EDITOR_BG = "var(--sk-ink)";
const EDITOR_FG = "color-mix(in srgb, var(--sk-cream) 92%, transparent)";
const EDITOR_DIM = "color-mix(in srgb, var(--sk-cream) 55%, transparent)";
const KEYWORD = "var(--sk-red)";
const STRING = "var(--sk-ochre)";
const COMMENT = "color-mix(in srgb, var(--sk-cream) 45%, transparent)";

const CAL_HREF = "https://cal.com/sager-zmd4kl/30min";

type Line = { kind: "comment" | "code" | "blank"; tokens: TokenSpan[] };
type TokenSpan = { text: string; color?: string; italic?: boolean };

const LINES: Line[] = [
  {
    kind: "comment",
    tokens: [{ text: "// Don't see your vertical?", color: COMMENT, italic: true }],
  },
  {
    kind: "code",
    tokens: [
      { text: "const ", color: KEYWORD },
      { text: "yourBusiness " },
      { text: "= ", color: KEYWORD },
      { text: "await ", color: KEYWORD },
      { text: "skillies." },
      { text: "scope", color: KEYWORD },
      { text: "({" },
    ],
  },
  {
    kind: "code",
    tokens: [
      { text: "  audience: " },
      { text: "\"your customers\"", color: STRING },
      { text: "," },
    ],
  },
  {
    kind: "code",
    tokens: [
      { text: "  languages: " },
      { text: "detect", color: KEYWORD },
      { text: "()," },
    ],
  },
  {
    kind: "code",
    tokens: [
      { text: "  integrations: [" },
      { text: "\"your CRM\"", color: STRING },
      { text: ", " },
      { text: "\"your billing\"", color: STRING },
      { text: "]," },
    ],
  },
  {
    kind: "code",
    tokens: [
      { text: "  timeline: " },
      { text: "\"2 weeks\"", color: STRING },
    ],
  },
  { kind: "code", tokens: [{ text: "});" }] },
  { kind: "blank", tokens: [] },
  {
    kind: "comment",
    tokens: [
      { text: "// → Book a 30-min call. We build.", color: COMMENT, italic: true },
    ],
  },
];

export default function ScopeCallout() {
  const reducedMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.25, once: true });

  return (
    <section
      className="sk-section"
      style={{ background: "var(--sk-cream)", paddingTop: "2rem" }}
    >
      <style>{`
        @keyframes sk-sc-blink {
          0%, 49%   { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes sk-sc-traffic {
          0%, 100% { opacity: 0.85; }
          50%      { opacity: 0.55; }
        }
      `}</style>

      <div className="sk-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "2rem",
            alignItems: "center",
          }}
          className="sk-sc-grid"
        >
          {/* Left rail — small intro copy */}
          <div>
            <p
              className="sk-font-meta"
              style={{ color: "var(--sk-ink60)" }}
            >
              SCOPE A NEW VERTICAL
            </p>
            <h2
              className="sk-font-section mt-3"
              style={{
                fontSize: "var(--sk-text-h3)",
                color: "var(--sk-ink)",
                lineHeight: 1.08,
              }}
            >
              Your vertical isn&rsquo;t in the grid?{" "}
              <span
                className="sk-font-display-italic"
                style={{ color: "var(--sk-red)" }}
              >
                We build.
              </span>
            </h2>
            <p
              className="sk-font-body mt-4"
              style={{
                fontSize: "var(--sk-text-lead)",
                color: "var(--sk-ink60)",
                maxWidth: "44ch",
              }}
            >
              30-min scope call, then a working agent in your stack inside
              two weeks. Same engine. Same memory. Your customers&rsquo;
              language and your tools.
            </p>
          </div>

          {/* Right rail — the editor card */}
          <motion.div
            ref={ref}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: "0.875rem",
              overflow: "hidden",
              background: EDITOR_BG,
              border: "1px solid color-mix(in srgb, var(--sk-cream) 12%, transparent)",
              boxShadow: "0 30px 60px -30px rgba(20,20,20,0.45)",
            }}
          >
            {/* Editor titlebar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1rem",
                borderBottom:
                  "1px solid color-mix(in srgb, var(--sk-cream) 10%, transparent)",
                background:
                  "color-mix(in srgb, var(--sk-cream) 4%, var(--sk-ink))",
              }}
            >
              <TrafficLight color="#FF5F56" delay="0s" reduced={reducedMotion} />
              <TrafficLight color="#FFBD2E" delay="0.4s" reduced={reducedMotion} />
              <TrafficLight color="#27C93F" delay="0.8s" reduced={reducedMotion} />
              <span
                className="font-mono"
                style={{
                  marginLeft: "0.5rem",
                  fontSize: "0.6875rem",
                  color: EDITOR_DIM,
                  letterSpacing: "0.04em",
                }}
              >
                scope.your-vertical.ts
              </span>
            </div>

            {/* Editor body */}
            <pre
              className="font-mono"
              style={{
                margin: 0,
                padding: "1.25rem 1rem 1.25rem 0.5rem",
                fontSize: "0.8125rem",
                lineHeight: 1.7,
                color: EDITOR_FG,
                overflowX: "auto",
                whiteSpace: "pre",
              }}
            >
              {LINES.map((line, idx) => (
                <CodeRow
                  key={idx}
                  line={line}
                  num={idx + 1}
                  isLast={idx === LINES.length - 1}
                  reducedMotion={reducedMotion}
                />
              ))}
            </pre>

            {/* "Run" button row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                padding: "0.85rem 1rem",
                borderTop:
                  "1px solid color-mix(in srgb, var(--sk-cream) 10%, transparent)",
                background:
                  "color-mix(in srgb, var(--sk-cream) 3%, var(--sk-ink))",
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: "0.6875rem",
                  color: EDITOR_DIM,
                  letterSpacing: "0.04em",
                }}
              >
                ready · press Run to book
              </span>
              <Link
                href={CAL_HREF}
                target="_blank"
                rel="noreferrer"
                className="font-mono inline-flex items-center"
                style={{
                  gap: "0.5rem",
                  padding: "0.45rem 0.85rem",
                  borderRadius: "0.5rem",
                  background: "var(--sk-red)",
                  color: "var(--sk-cream)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  textDecoration: "none",
                  transition: "transform 180ms ease",
                }}
              >
                <span aria-hidden="true">▶</span>
                Run · book Ehsan
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .sk-sc-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────── Sub-components ───────────────────── */

function TrafficLight({
  color,
  delay,
  reduced,
}: {
  color: string;
  delay: string;
  reduced: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: 999,
        background: color,
        animation: reduced
          ? "none"
          : `sk-sc-traffic 3.6s ease-in-out ${delay} infinite`,
      }}
    />
  );
}

function CodeRow({
  line,
  num,
  isLast,
  reducedMotion,
}: {
  line: Line;
  num: number;
  isLast: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "2.25rem",
          textAlign: "right",
          paddingRight: "0.85rem",
          color: "color-mix(in srgb, var(--sk-cream) 28%, transparent)",
          fontSize: "0.6875rem",
          flex: "0 0 auto",
          userSelect: "none",
        }}
      >
        {num}
      </span>
      <span style={{ display: "inline-block" }}>
        {line.kind === "blank" ? (
          <span> </span>
        ) : (
          line.tokens.map((t, i) => (
            <span
              key={i}
              style={{
                color: t.color ?? EDITOR_FG,
                fontStyle: t.italic ? "italic" : "normal",
              }}
            >
              {t.text}
            </span>
          ))
        )}
        {isLast ? (
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "0.55ch",
              marginLeft: "0.25em",
              color: "var(--sk-red)",
              animation: reducedMotion
                ? "none"
                : "sk-sc-blink 1.05s steps(2, start) infinite",
            }}
          >
            |
          </span>
        ) : null}
      </span>
    </div>
  );
}
