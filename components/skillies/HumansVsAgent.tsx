"use client";

/**
 * HumansVsAgent · split-screen "Same job. Different physics." comparison.
 *
 * Editorial-feeling side-by-side: human team economics on the left
 * (red-tinted, X-bullets, rotating issue ticker), Skillies agent on
 * the right (ochre-tinted, check-bullets, animated counters).
 *
 * Designed to mount on both / and /pricing — both props are optional.
 * Uses Framer Motion for column entrance + counter animation, and
 * AnimatePresence for the human-team failure-mode ticker.
 */

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import { useRef } from "react";

export type HumansVsAgentProps = {
  headline?: string;
  subhead?: string;
};

const DEFAULT_HEADLINE = "Same job. Different physics.";
const DEFAULT_SUBHEAD =
  "Hire 10 callers + 2 managers in Kerala for ~₹2.5 L/month. Or ship one agent that doesn't take leaves, doesn't make data-entry errors, and remembers every customer for life.";

const HUMAN_STATS: readonly string[] = [
  "10 callers + 2 managers",
  "4–6 weeks training per hire",
  "30–60% annual attrition",
  "9-to-7 working hours",
  "Weekends + festivals off",
  "Weekly sick days",
  "Errors compound silently",
];

const AGENT_STATS: readonly string[] = [
  "1 agent",
  "24 / 7 / 365",
  "0 attrition",
  "0 sick days",
  "Vision + voice + memory built-in",
  "Improves monthly",
  "IRDAI-compliant",
  "Scales with you",
];

const TICKER_ITEMS: readonly string[] = [
  "Caller called in sick — 47 messages backed up",
  "Manager left — onboarding 2 new hires",
  "Voice note in Mal — caller asked for help",
  "Customer waited 6 hrs for reply",
  "Wrong premium quoted — refund and apology",
];

/* ---------- Inline icons ---------- */

function XIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, marginTop: 6 }}
    >
      <path
        d="M3 3L11 11M11 3L3 11"
        stroke="var(--sk-red)"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, marginTop: 6 }}
    >
      <path
        d="M2.5 7.5L5.5 10.5L11.5 3.5"
        stroke="var(--sk-ink)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- Counter ---------- */

type CounterProps = {
  to: number;
  inView: boolean;
  formatter?: (n: number) => string;
};

function Counter({ to, inView, formatter }: CounterProps) {
  // Start at target so SSR / no-JS / crawlers see the real number.
  // When the section enters the viewport we reset to 0 and animate up.
  const value = useMotionValue(to);
  const display = useTransform(value, (latest) =>
    formatter ? formatter(latest) : Math.round(latest).toLocaleString("en-IN"),
  );

  useEffect(() => {
    if (!inView) return;
    value.set(0);
    const controls = animate(value, to, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, to, value]);

  return <motion.span>{display}</motion.span>;
}

/* ---------- Component ---------- */

export default function HumansVsAgent({
  headline = DEFAULT_HEADLINE,
  subhead = DEFAULT_SUBHEAD,
}: HumansVsAgentProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15% 0px" });

  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((i) => (i + 1) % TICKER_ITEMS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const inrFormatter = (n: number) =>
    `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <section
      id="humans-vs-agent"
      ref={sectionRef}
      className="sk-section"
      style={{ background: "var(--sk-cream)" }}
    >
      <div className="sk-container">
        {/* Heading block */}
        <div className="max-w-[860px] mb-14 md:mb-20">
          <p
            className="sk-font-meta mb-5"
            style={{ color: "var(--sk-red)" }}
          >
            The math
          </p>
          <h2
            className="sk-font-display"
            style={{
              fontSize: "var(--sk-text-h2)",
              color: "var(--sk-ink)",
            }}
          >
            {(() => {
              // If the headline has two sentences, italicize the second
              // for editorial pop ("Same job. Different physics.").
              // Otherwise italicize the trailing fragment after the last
              // period, falling back to italicizing nothing.
              const match = headline.match(/^(.+?[.!?])\s+(.+)$/);
              if (match) {
                return (
                  <>
                    <span>{match[1]} </span>
                    <span className="sk-font-display-italic">{match[2]}</span>
                  </>
                );
              }
              return <span className="sk-font-display-italic">{headline}</span>;
            })()}
          </h2>
          <p
            className="sk-font-body mt-5"
            style={{
              fontSize: "var(--sk-text-lead)",
              color: "var(--sk-ink60)",
              maxWidth: "62ch",
            }}
          >
            {subhead}
          </p>
        </div>

        {/* Two-column grid */}
        <div
          className="grid gap-6 md:gap-0"
          style={{
            gridTemplateColumns: "1fr",
          }}
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: "1fr",
            }}
          >
            <div
              className="md:grid"
              style={{
                gridTemplateColumns: "1fr 1px 1fr",
                display: "grid",
                gap: 0,
              }}
            >
              {/* LEFT — Without Skillies */}
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  background: "rgba(217, 52, 43, 0.05)",
                  padding: "clamp(28px, 4vw, 56px)",
                  borderRadius: "2px",
                }}
              >
                <p
                  className="sk-font-meta"
                  style={{ color: "var(--sk-red)", marginBottom: 28 }}
                >
                  Without Skillies
                </p>

                <div
                  className="sk-font-display"
                  style={{
                    fontSize: "clamp(3rem, 4.2vw + 1rem, 4.75rem)",
                    color: "var(--sk-ink)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.025em",
                  }}
                >
                  <Counter to={250000} inView={inView} formatter={inrFormatter} />
                </div>
                <p
                  className="sk-font-meta"
                  style={{
                    color: "var(--sk-ink60)",
                    marginTop: 10,
                    marginBottom: 36,
                  }}
                >
                  / month operating cost
                </p>

                <ul
                  className="space-y-3"
                  style={{ listStyle: "none", padding: 0, margin: 0 }}
                >
                  {HUMAN_STATS.map((stat, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-10% 0px" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.3 + i * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="sk-font-body flex gap-3"
                      style={{
                        fontSize: "var(--sk-text-body)",
                        color: "var(--sk-ink)",
                        lineHeight: 1.45,
                      }}
                    >
                      <XIcon />
                      <span>{stat}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Issue ticker */}
                <div
                  style={{
                    marginTop: 36,
                    padding: "16px 18px",
                    background: "rgba(20, 20, 20, 0.04)",
                    border: "1px solid var(--sk-hairline)",
                    borderRadius: "2px",
                    minHeight: 78,
                    position: "relative",
                    overflow: "hidden",
                  }}
                  aria-live="polite"
                >
                  <div
                    className="sk-font-meta"
                    style={{
                      color: "var(--sk-ink40)",
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--sk-red)",
                      }}
                    />
                    Live issues
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={tickerIndex}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="sk-font-body"
                      style={{
                        fontSize: "0.9375rem",
                        color: "var(--sk-ink)",
                        lineHeight: 1.4,
                        margin: 0,
                      }}
                    >
                      {TICKER_ITEMS[tickerIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Vertical divider (desktop only) */}
              <div
                aria-hidden="true"
                className="hidden md:block"
                style={{
                  width: 1,
                  background: "var(--sk-hairline)",
                  margin: "0 clamp(16px, 3vw, 36px)",
                }}
              />

              {/* Mobile divider */}
              <div
                aria-hidden="true"
                className="block md:hidden"
                style={{
                  textAlign: "center",
                  padding: "8px 0",
                }}
              >
                <span
                  className="sk-font-meta"
                  style={{
                    color: "var(--sk-ink40)",
                    letterSpacing: "0.18em",
                  }}
                >
                  &darr; vs &darr;
                </span>
              </div>

              {/* RIGHT — With Skillies */}
              <motion.div
                initial={{ opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  background: "rgba(201, 160, 107, 0.07)",
                  padding: "clamp(28px, 4vw, 56px)",
                  borderRadius: "2px",
                }}
              >
                <p
                  className="sk-font-meta"
                  style={{ color: "var(--sk-ink)", marginBottom: 28 }}
                >
                  With Skillies
                </p>

                <div
                  className="sk-font-display"
                  style={{
                    fontSize: "clamp(3rem, 4.2vw + 1rem, 4.75rem)",
                    color: "var(--sk-ink)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.025em",
                  }}
                >
                  <Counter to={155000} inView={inView} formatter={inrFormatter} />
                </div>
                <p
                  className="sk-font-meta"
                  style={{
                    color: "var(--sk-ink60)",
                    marginTop: 10,
                    marginBottom: 36,
                  }}
                >
                  / month all-in (Pro tier &middot; same QC capacity)
                </p>

                <ul
                  className="space-y-3"
                  style={{ listStyle: "none", padding: 0, margin: 0 }}
                >
                  {AGENT_STATS.map((stat, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-10% 0px" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.5 + i * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="sk-font-body flex gap-3"
                      style={{
                        fontSize: "var(--sk-text-body)",
                        color: "var(--sk-ink)",
                        lineHeight: 1.45,
                      }}
                    >
                      <CheckIcon />
                      <span>{stat}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Live counter strip */}
                <div
                  style={{
                    marginTop: 36,
                    padding: "20px 22px",
                    background: "rgba(20, 20, 20, 0.04)",
                    border: "1px solid var(--sk-hairline)",
                    borderRadius: "2px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                  aria-live="polite"
                >
                  <CounterRow
                    label="Conversations handled this month"
                    value={47892}
                    inView={inView}
                  />
                  <CounterRow
                    label="Customers remembered forever"
                    value={12847}
                    inView={inView}
                  />
                  <CounterRow
                    label="Languages spoken"
                    value={5}
                    inView={inView}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{
            duration: 0.7,
            delay: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            marginTop: "clamp(48px, 6vw, 96px)",
            textAlign: "center",
            maxWidth: "780px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <p
            className="sk-font-display-italic"
            style={{
              fontSize: "clamp(1.375rem, 1.6vw + 1rem, 2rem)",
              color: "var(--sk-ink)",
              lineHeight: 1.3,
            }}
          >
            &ldquo;You won&rsquo;t replace your team. You&rsquo;ll free them to
            do work humans actually do well.&rdquo;
          </p>
          <p
            className="sk-font-meta"
            style={{
              color: "var(--sk-ink40)",
              marginTop: 16,
            }}
          >
            &mdash; Ehsan, founder &middot; Skillies.ai
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Subcomponent for the live counter strip ---------- */

type CounterRowProps = {
  label: string;
  value: number;
  inView: boolean;
};

function CounterRow({ label, value, inView }: CounterRowProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 12,
      }}
    >
      <span
        className="sk-font-body"
        style={{
          fontSize: "0.9375rem",
          color: "var(--sk-ink60)",
          flex: 1,
          minWidth: 0,
        }}
      >
        {label}
      </span>
      <span
        className="sk-font-display"
        style={{
          fontSize: "1.25rem",
          color: "var(--sk-ink)",
          letterSpacing: "-0.015em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <Counter to={value} inView={inView} />
      </span>
    </div>
  );
}
