"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * FadeInUp — the workhorse scroll-triggered entrance. Content slides up
 * 24px and fades in once, when the user scrolls it past the viewport
 * entry line. Uses whileInView for passive behaviour (doesn't require a
 * ref) and a conservative margin so items show up early enough that the
 * reader rarely sees them pop in.
 *
 * Stagger children by passing different `delay` values, or use the
 * standard 0.08-0.12s ladder between siblings.
 */
export default function FadeInUp({
  children,
  delay = 0,
  distance = 24,
  duration = 0.7,
  className,
  style,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: "div" | "section" | "article" | "li";
}) {
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
}
