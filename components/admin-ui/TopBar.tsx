"use client";

/**
 * Sticky top bar shown on every /admin page. Renders the section title
 * passed in and a compact "admin user" pill on the right (just the
 * phone number for now — drop-down menu can be added later).
 *
 * Title can also be derived from the current path if not provided.
 */
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/analytics": "Analytics",
  "/admin/users": "Users",
  "/admin/courses": "Courses",
};

export default function TopBar({ title }: { title?: string }) {
  const pathname = usePathname() || "";
  const resolved = title || TITLES[pathname] || "Admin";
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        if (user?.phone) {
          setPhone(`+${user.phone}`);
        }
      } catch {
        /* swallow */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        height: 64,
        padding: "0 32px",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(17,24,39,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily:
            "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
          fontWeight: 600,
          fontSize: 20,
          letterSpacing: "-0.01em",
          color: "#0A0A0A",
        }}
      >
        {resolved}
      </h1>

      {phone && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px 6px 6px",
            borderRadius: 999,
            background: "rgba(17,24,39,0.04)",
            border: "1px solid rgba(17,24,39,0.06)",
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 999,
              background: "linear-gradient(135deg, #C62828, #8B1A1A)",
              color: "white",
              display: "grid",
              placeItems: "center",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {phone.slice(-2)}
          </span>
          <span
            style={{
              fontFamily: "ui-monospace, Menlo, monospace",
              fontSize: 12,
              color: "#525252",
            }}
          >
            {phone}
          </span>
        </div>
      )}
    </header>
  );
}
