"use client";

import { motion } from "framer-motion";

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://cal.com/sager-zmd4kl/30min"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 200 }}
      className="fixed bottom-6 left-6 z-50 h-14 px-5 bg-[#C62828] rounded-full flex items-center gap-2 shadow-lg shadow-[#C62828]/30 hover:scale-105 transition-transform text-white"
      aria-label="Book a 30-minute call with Ehsan"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 fill-none stroke-white"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      <span className="text-sm font-semibold tracking-tight">Book a call</span>
    </motion.a>
  );
}
