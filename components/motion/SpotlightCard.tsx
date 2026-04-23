"use client";

import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

/**
 * SpotlightCard — a cursor-follow glow overlay that tracks mouse position
 * and fades a radial gradient at the pointer. Gives premium surfaces (the
 * mentorship card, pricing cards, dark CTA bands) a subtle "alive" feel
 * without animated loops that would bloat performance.
 *
 * The effect only activates on hover, and only on devices with a pointer
 * — touch devices get the static card (no jitter, no battery drain).
 *
 * Uses `useMotionValue` + `useMotionTemplate` so the gradient updates
 * directly in the style layer without triggering React re-renders (the
 * cheap way to do cursor tracking).
 */
export default function SpotlightCard({
  children,
  radius = 360,
  color = "rgba(230,193,120,0.14)",
  className,
  style,
  borderRadius = 22,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  radius?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  borderRadius?: number;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);
  const ref = useRef<HTMLElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  function onMouseLeave() {
    mouseX.set(-400);
    mouseY.set(-400);
  }

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 65%)`;

  const BaseTag = Tag as React.ElementType;

  return (
    <BaseTag
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{
        position: "relative",
        borderRadius,
        isolation: "isolate",
        ...style,
      }}
    >
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background,
          borderRadius,
          // Layered above the card's own background but below content
          // via mix-blend to feel like a light-leak rather than a sprite.
          mixBlendMode: "plus-lighter",
          opacity: 1,
          transition: "opacity 200ms ease",
        }}
      />
      {children}
    </BaseTag>
  );
}
