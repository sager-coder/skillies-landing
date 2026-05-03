"use client";

import React, { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Wordmark } from "@/components/design/Primitives";

export default function LearnTopBar() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState<string>("");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.phone) setPhone(`+${data.user.phone}`);
    });
  }, []);

  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        padding: "14px 24px",
        background: "rgba(250,245,235,0.92)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(26,26,26,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <a href="/" style={{ textDecoration: "none" }}>
        <Wordmark size={20} />
      </a>
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px 6px 6px",
            borderRadius: 999,
            background: "white",
            border: "1px solid rgba(26,26,26,0.1)",
            cursor: "pointer",
            fontSize: 13,
            color: "#1A1A1A",
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              background: "linear-gradient(135deg, #C62828, #8B1A1A)",
              color: "white",
              display: "grid",
              placeItems: "center",
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            {phone ? phone.slice(-2) : "Me"}
          </span>
          <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12 }}>
            {phone || "Account"}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              minWidth: 200,
              padding: 6,
              background: "white",
              borderRadius: 14,
              border: "1px solid rgba(26,26,26,0.08)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
            }}
          >
            <a
              href="/"
              style={{
                display: "block",
                padding: "10px 12px",
                fontSize: 13,
                color: "#1A1A1A",
                textDecoration: "none",
                borderRadius: 10,
              }}
            >
              ← Marketing site
            </a>
            <a
              href="mailto:ehsan@skillies.ai"
              style={{
                display: "block",
                padding: "10px 12px",
                fontSize: 13,
                color: "#1A1A1A",
                textDecoration: "none",
                borderRadius: 10,
              }}
            >
              Email Ehsan
            </a>
            <button
              onClick={signOut}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 12px",
                fontSize: 13,
                color: "#C62828",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                borderRadius: 10,
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
