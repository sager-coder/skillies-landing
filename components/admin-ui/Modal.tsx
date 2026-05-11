// Modal — controlled overlay dialog with a centered white card.
//
// Locks body scroll while `open`. Closes on ESC, click on backdrop, or click
// on the header close button. Uses framer-motion for a small fade/scale on
// mount (already a project dependency).
//
// Render it once near the consumer; toggle `open` to show/hide.

"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Modal heading rendered at the top of the card. */
  title: ReactNode;
  /** Body content. */
  children: ReactNode;
  /** Optional inline style override for the inner card. */
  cardStyle?: CSSProperties;
  /** Width of the card. Defaults to 480px. */
  width?: number;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  cardStyle,
  width = 480,
}: ModalProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Body scroll lock + ESC handler.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          aria-modal="true"
          role="dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(10,10,10,0.45)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            fontFamily:
              "var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif",
          }}
          onMouseDown={(e) => {
            // Close only when the backdrop itself is the click target (not the card).
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              width: "100%",
              maxWidth: width,
              maxHeight: "calc(100vh - 32px)",
              background: "#FFFFFF",
              border: "1px solid rgba(17,24,39,0.08)",
              borderRadius: 14,
              boxShadow:
                "0 24px 64px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              ...cardStyle,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "16px 20px",
                borderBottom: "1px solid rgba(17,24,39,0.06)",
              }}
            >
              <div
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "#0A0A0A",
                  lineHeight: 1.25,
                }}
              >
                {title}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="cursor-pointer transition-colors duration-150"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  background: "transparent",
                  border: "1px solid transparent",
                  borderRadius: 8,
                  color: "#525252",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(17,24,39,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M3 3L11 11M11 3L3 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div
              style={{
                padding: 20,
                overflowY: "auto",
                color: "#0A0A0A",
                fontSize: 14,
                lineHeight: 1.55,
              }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
