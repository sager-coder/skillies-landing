"use client";

import React, { useEffect, useState } from "react";
import { Wordmark } from "./Primitives";

type Link = { href: string; label: string };

const LINKS: Link[] = [
  { href: "/workshop", label: "Workshop" },
  { href: "/mentorship", label: "Mentorship" },
  { href: "/courses", label: "Courses" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/#program", label: "Program" },
];

/* Note: workshop route also renders an in-page "#pay" anchor
   (the PaymentDetails section). Its top-nav still shows "Reserve"
   as the primary CTA pointing to WhatsApp — the anchor is a
   secondary path for people who scrolled past. */

export default function TopNav({
  cta = { href: "/workshop", label: "Reserve · ₹999" },
}: {
  cta?: { href: string; label: string };
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Escape + lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const closeAnd =
    (fn?: () => void) =>
    () => {
      setOpen(false);
      fn?.();
    };

  return (
    <>
      <nav
        className="skillies-topnav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          padding: scrolled ? "10px 24px" : "18px 24px",
          background:
            scrolled || open
              ? "rgba(250,245,235,0.96)"
              : "rgba(250,245,235,0.55)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom:
            scrolled || open
              ? "1px solid rgba(26,26,26,0.08)"
              : "1px solid transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          transition: "padding .25s, background .25s, border-color .25s",
        }}
      >
        <a
          href="/"
          aria-label="Skillies.AI — home"
          style={{ textDecoration: "none" }}
          onClick={closeAnd()}
        >
          <Wordmark size={22} />
        </a>

        <div
          className="skillies-topnav-links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            fontSize: 13,
            color: "#1A1A1A",
            fontWeight: 500,
          }}
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                color: "inherit",
                textDecoration: "none",
                transition: "color .2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C62828")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#1A1A1A")}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a
            href="/login"
            onClick={closeAnd()}
            className="skillies-topnav-signin"
            style={{
              fontSize: 13,
              color: "#6B7280",
              textDecoration: "none",
              fontWeight: 500,
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
              transition: "color .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1A1A1A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
            onFocus={(e) => (e.currentTarget.style.color = "#1A1A1A")}
            onBlur={(e) => (e.currentTarget.style.color = "#6B7280")}
          >
            Sign in
          </a>
          <a
            href={cta.href}
            target={cta.href.startsWith("http") ? "_blank" : undefined}
            rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
            onClick={closeAnd()}
            style={{
              padding: "9px 18px",
              background: "#C62828",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 999,
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(198,40,40,0.20)",
              transition: "background .2s, transform .2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#8B1A1A";
              e.currentTarget.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#C62828";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {cta.label} →
          </a>

          <button
            type="button"
            className="skillies-topnav-hamburger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="skillies-mobile-drawer"
            onClick={() => setOpen((v) => !v)}
            style={{
              width: 40,
              height: 40,
              padding: 0,
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "1px solid rgba(26,26,26,0.12)",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            <span
              aria-hidden
              style={{
                position: "relative",
                width: 18,
                height: 14,
                display: "inline-block",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "#1A1A1A",
                  borderRadius: 2,
                  top: open ? 6 : 0,
                  transform: open ? "rotate(45deg)" : "none",
                  transition: "transform .2s, top .2s, opacity .2s",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "#1A1A1A",
                  borderRadius: 2,
                  top: 6,
                  opacity: open ? 0 : 1,
                  transition: "opacity .15s",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "#1A1A1A",
                  borderRadius: 2,
                  top: open ? 6 : 12,
                  transform: open ? "rotate(-45deg)" : "none",
                  transition: "transform .2s, top .2s",
                }}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer — full-height sheet below the nav */}
      <div
        id="skillies-mobile-drawer"
        className="skillies-topnav-drawer"
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 55,
          display: open ? "flex" : "none",
          flexDirection: "column",
          paddingTop: scrolled ? 60 : 74,
          background: "rgba(250,245,235,0.98)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "28px 24px 36px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            overflowY: "auto",
          }}
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={closeAnd()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 6px",
                color: "#1A1A1A",
                textDecoration: "none",
                fontSize: 24,
                fontFamily: "'Instrument Serif', Georgia, serif",
                letterSpacing: "-0.01em",
                borderBottom: "1px dashed rgba(26,26,26,0.12)",
              }}
            >
              <span>{l.label}</span>
              <span aria-hidden style={{ color: "#C62828", fontSize: 18 }}>
                →
              </span>
            </a>
          ))}

          <a
            href="/login"
            onClick={closeAnd()}
            style={{
              marginTop: 20,
              padding: "16px 20px",
              background: "rgba(26,26,26,0.04)",
              border: "1px solid rgba(26,26,26,0.12)",
              color: "#1A1A1A",
              textDecoration: "none",
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.02em",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Sign in · Student portal</span>
            <span aria-hidden>→</span>
          </a>

          <a
            href="https://wa.me/918089941131"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeAnd()}
            style={{
              marginTop: 10,
              padding: "16px 20px",
              background: "rgba(37, 211, 102, 0.12)",
              border: "1px solid rgba(37,211,102,0.35)",
              color: "#1A6E3F",
              textDecoration: "none",
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.02em",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Message Ehsan on WhatsApp</span>
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </>
  );
}
