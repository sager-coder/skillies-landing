"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

/**
 * CountUp — animates a number from 0 (or `from`) to the target `value` the
 * first time it scrolls into view. Respects reduced-motion.
 *
 * Used for the big ₹1,16,000 / 63 / 8,71,982 stats in the hero + proof
 * sections so the numbers feel earned instead of static. Intentionally
 * one-shot (no re-trigger on scroll back up) — repeating animations read
 * as gimmicky.
 *
 * Formatting defaults to the Indian comma grouping (1,16,000 not 116,000)
 * since everything on this site is INR.
 */
export default function CountUp({
  value,
  from = 0,
  duration = 1.6,
  prefix = "",
  suffix = "",
  decimals = 0,
  locale = "en-IN",
  className,
  style,
}: {
  value: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  locale?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    if (!inView) return;

    // Respect reduced-motion — skip the tween, just set the final value.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    const controls = animate(from, value, {
      duration,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo — punchy initial, gentle landing
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, from, value, duration]);

  const formatted = display.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
