"use client";

/**
 * Admin sidebar — fixed, full-height, dark cream surface with subtle
 * hairline divider. Active route gets a soft red tint + bold weight.
 * Renders the Skillies wordmark at the top, navigation in the middle,
 * and Logout pinned to the bottom.
 *
 * Reads the current pathname client-side so the active item updates on
 * client navigations without a server round-trip.
 */
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const NAV: NavItem[] = [
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 4 3 5-7" />
      </svg>
    ),
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/admin/courses",
    label: "Courses",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname() || "";
  const [signingOut, setSigningOut] = useState(false);

  const onLogout = async () => {
    setSigningOut(true);
    try {
      const supabase = createSupabaseBrowserClient();
      // Skip the network call to /auth/v1/logout (it can hang). Local
      // session clear + cookie wipe is enough.
      await Promise.race([
        supabase.auth.signOut({ scope: "local" }),
        new Promise<void>((r) => setTimeout(r, 1500)),
      ]);
    } catch {
      /* swallow */
    }
    try {
      for (const part of document.cookie.split(";")) {
        const name = part.trim().split("=")[0];
        if (name && name.startsWith("sb-")) {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
      }
    } catch {
      /* swallow */
    }
    window.location.href = "/login";
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: 240,
        background: "#FAF9F7",
        borderRight: "1px solid rgba(17,24,39,0.08)",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        zIndex: 40,
      }}
    >
      {/* Brand */}
      <a
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 8px 24px",
          textDecoration: "none",
          color: "#0A0A0A",
          fontFamily: "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: "-0.01em",
        }}
      >
        <span style={{ color: "#0A0A0A" }}>SKILLIES</span>
        <span style={{ color: "#C62828" }}>.AI</span>
      </a>

      {/* Eyebrow */}
      <div
        style={{
          padding: "0 8px 12px",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#A3A3A3",
        }}
      >
        Admin
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                fontFamily:
                  "var(--font-inter), 'Inter', system-ui, sans-serif",
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? "#C62828" : "#525252",
                background: active ? "rgba(198,40,40,0.08)" : "transparent",
                textDecoration: "none",
                transition: "background 160ms ease, color 160ms ease",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "rgba(0,0,0,0.03)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  color: active ? "#C62828" : "#A3A3A3",
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Logout pinned bottom */}
      <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid rgba(17,24,39,0.06)" }}>
        <button
          type="button"
          onClick={onLogout}
          disabled={signingOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: "#525252",
            background: "transparent",
            border: "none",
            cursor: signingOut ? "wait" : "pointer",
            textAlign: "left",
            transition: "background 160ms ease",
          }}
          onMouseEnter={(e) => {
            if (!signingOut) e.currentTarget.style.background = "rgba(220,38,38,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#A3A3A3" }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {signingOut ? "Logging out…" : "Logout"}
        </button>
      </div>
    </aside>
  );
}
