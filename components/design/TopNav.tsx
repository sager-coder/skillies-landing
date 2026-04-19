"use client";

import React, { useEffect, useState } from "react";
import { Wordmark } from "./Primitives";

type Link = { href: string; label: string };

const LINKS: Link[] = [
  { href: "/workshop", label: "Workshop" },
  { href: "/courses", label: "Courses" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/#program", label: "Program" },
];

export default function TopNav({
  cta = { href: "/workshop", label: "Reserve · ₹1,999" },
}: {
  cta?: { href: string; label: string };
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav
      className="skillies-topnav"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        padding: scrolled ? "10px 24px" : "18px 24px",
        background: scrolled ? "rgba(250,245,235,0.92)" : "rgba(250,245,235,0.55)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: scrolled
          ? "1px solid rgba(26,26,26,0.08)"
          : "1px solid transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        transition: "padding .25s, background .25s, border-color .25s",
      }}
    >
      <a href="/" aria-label="Skillies.AI — home" style={{ textDecoration: "none" }}>
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
      <a
        href={cta.href}
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
    </nav>
  );
}
