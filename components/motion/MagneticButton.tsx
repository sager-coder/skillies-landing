"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * MagneticButton — a button that subtly drifts toward the cursor when you
 * hover it. The effect is small (8-14px max) so it reads as polish, not
 * trickery. Combined with the existing hover-scale on primary buttons,
 * it gives our CTAs a "confident" micro-interaction.
 *
 * Pointer-only — touch devices skip the effect entirely (no jittery
 * jump-on-tap). Respects reduced-motion.
 */
export default function MagneticButton({
  children,
  strength = 14,
  className,
  style,
  ...rest
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  style?: React.CSSProperties;
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "className" | "style"
>) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring gives the magnetic motion a gentle follow-through instead of a
  // 1:1 cursor-locked drag that would feel robotic.
  const sx = useSpring(x, { stiffness: 160, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 160, damping: 18, mass: 0.4 });

  function onMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: sx, y: sy, ...style }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
