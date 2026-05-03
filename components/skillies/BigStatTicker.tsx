"use client";

/**
 * BigStatTicker · animated count-up for hero stats.
 *
 * When the component scrolls into view, it ramps a number from 0 to
 * `to` over `durationMs` using requestAnimationFrame and an ease-out
 * curve. One-shot — observer disconnects after first reveal.
 *
 * `format` controls how the number is rendered:
 *   - "indian-rupee" → en-IN INR currency, no decimals
 *   - "comma"        → en-IN comma-separated integer
 *   - "plain"        → bare integer string
 *
 * Optional `prefix` / `suffix` wrap the formatted number (e.g. "+",
 * "%", "x"). Optional `label` renders a smaller meta line below.
 */
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

export type BigStatTickerFormat = "indian-rupee" | "comma" | "plain";

export type BigStatTickerProps = {
  to: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  format?: BigStatTickerFormat;
  className?: string;
  label?: string;
};

function formatValue(value: number, format: BigStatTickerFormat): string {
  switch (format) {
    case "indian-rupee":
      return value.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      });
    case "comma":
      return value.toLocaleString("en-IN");
    case "plain":
    default:
      return String(value);
  }
}

// Standard ease-out-cubic — gentle landing on the final value.
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Initial value seed. If the user prefers reduced motion or the env
 * lacks IntersectionObserver, we render the final value immediately
 * — keeps SSR + no-motion snapshots correct without a state churn.
 */
// Always return `to` from the initializer so SSR and client first-render
// match (no hydration warning). The useEffect below resets to 0 and
// ramps up only when the element actually enters the viewport.
function getInitialValue(to: number): number {
  return to;
}

export default function BigStatTicker({
  to,
  durationMs = 1400,
  prefix,
  suffix,
  format = "plain",
  className = "",
  label,
}: BigStatTickerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [displayValue, setDisplayValue] = useState<number>(() =>
    getInitialValue(to),
  );
  const hasStartedRef = useRef<boolean>(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    // Reduced motion / no-IO path was seeded by getInitialValue, so we
    // simply opt out of starting the ramp.
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      hasStartedRef.current = true;
      return;
    }

    let rafId = 0;
    let startTimestamp: number | null = null;

    const tick = (timestamp: number) => {
      if (startTimestamp === null) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(1, elapsed / Math.max(1, durationMs));
      const eased = easeOutCubic(progress);
      // Always Math.round so React doesn't churn on subpixel values.
      setDisplayValue(Math.round(eased * to));
      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasStartedRef.current) {
            hasStartedRef.current = true;
            rafId = window.requestAnimationFrame(tick);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [to, durationMs]);

  const numberClassName = ["sk-num-display", className]
    .filter(Boolean)
    .join(" ");

  const labelStyle: CSSProperties = {
    color: "var(--sk-ink60)",
    marginTop: "0.5rem",
  };

  return (
    <div ref={rootRef}>
      <div className={numberClassName}>
        {prefix}
        {formatValue(displayValue, format)}
        {suffix}
      </div>
      {label ? (
        <div className="sk-font-meta" style={labelStyle}>
          {label}
        </div>
      ) : null}
    </div>
  );
}
