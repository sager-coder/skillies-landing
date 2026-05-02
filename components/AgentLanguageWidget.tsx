"use client";

/**
 * AgentLanguageWidget — language picker that mounts a different
 * language-locked ElevenLabs Convai agent per button.
 *
 * Each language has its own agent on ElevenLabs (one prompt locked to that
 * language only — no detection, no switching). The visitor picks a button,
 * the widget mounts that specific agent. Switching language ends the
 * current session and starts a fresh one with a different agent_id.
 */

import { useEffect, useState } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "agent-id": string;
          "dynamic-variables"?: string;
          variant?: string;
          "avatar-image-url"?: string;
        },
        HTMLElement
      >;
    }
  }
}

type Lang = "ml" | "ta" | "kn" | "hi" | "en";

// One language-locked agent per language. Each agent's prompt strictly
// holds it to that language only.
const AGENT_BY_LANG: Record<Lang, string> = {
  ml: "agent_3101kqkgqn5memgtek3wcvfs6dcp",
  ta: "agent_3301kqkgqp4vft1sxe3decgwkqm8",
  kn: "agent_2901kqkgqq3dfc5rkwmqn35an4xb",
  hi: "agent_0701kqkgqqznfsq942zpa5ay3vkz",
  en: "agent_3101kqkgqs0ee1c92y509t5a5bqd",
};

const LANGS: Array<{
  code: Lang;
  native: string;
  english: string;
  greeting: string;
  fontFamily: string;
}> = [
  { code: "ml", native: "മലയാളം", english: "Malayalam", greeting: "നമസ്കാരം", fontFamily: "'Manjari', sans-serif" },
  { code: "ta", native: "தமிழ்", english: "Tamil", greeting: "வணக்கம்", fontFamily: "'Catamaran', sans-serif" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", greeting: "ನಮಸ್ಕಾರ", fontFamily: "'Anek Kannada', sans-serif" },
  { code: "hi", native: "हिन्दी", english: "Hindi", greeting: "नमस्ते", fontFamily: "'Tiro Devanagari Hindi', serif" },
  { code: "en", native: "English", english: "English", greeting: "Hello", fontFamily: "'Inter', sans-serif" },
];

const SCRIPT_SRC = "https://elevenlabs.io/convai-widget/index.js";
const SCRIPT_ID = "elevenlabs-convai-script";

const COLOR = {
  cream: "#FAF5EB",
  ink: "#1A1A1A",
  muted: "#6B7280",
  gold: "#C9A24E",
  goldLight: "#E6C178",
  red: "#C62828",
};

export default function AgentLanguageWidget() {
  const [lang, setLang] = useState<Lang | null>(null);

  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
  }, []);

  return (
    <div
      style={{
        background: COLOR.cream,
        border: `1px solid rgba(201,162,78,0.30)`,
        borderRadius: 16,
        padding: "36px 32px",
        boxShadow: "0 16px 56px rgba(15, 15, 15, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: "#10B981",
            boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.18)",
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.20em",
            textTransform: "uppercase",
            color: COLOR.muted,
          }}
        >
          Live · Language-locked agents
        </span>
      </div>

      <h3
        style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontStyle: "italic",
          fontSize: "clamp(28px, 4vw, 42px)",
          fontWeight: 400,
          margin: "0 0 12px",
          color: COLOR.ink,
          letterSpacing: "-0.01em",
          lineHeight: 1.08,
        }}
      >
        Pick a language. Talk or type.
      </h3>

      <p
        style={{
          fontSize: 15,
          color: COLOR.muted,
          margin: "0 0 32px",
          lineHeight: 1.6,
          maxWidth: 660,
        }}
      >
        Each button starts an agent that speaks only that language —
        Malayalam-only, Tamil-only, Kannada-only, Hindi-only, English-only.
        No mixing. The agent will ask what business you run and demo how it
        could work for you.
      </p>

      {/* Language buttons — 5 across on desktop, wraps on mobile */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
          marginBottom: 32,
        }}
      >
        {LANGS.map((l) => {
          const selected = lang === l.code;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setLang(l.code)}
              style={{
                padding: "18px 18px",
                background: selected ? COLOR.ink : "#FFFFFF",
                color: selected ? COLOR.cream : COLOR.ink,
                border: selected
                  ? `1px solid ${COLOR.ink}`
                  : `1px solid rgba(26,26,26,0.16)`,
                borderRadius: 12,
                cursor: "pointer",
                textAlign: "left",
                transition: "all .18s",
                boxShadow: selected
                  ? "0 10px 28px rgba(15,15,15,0.22)"
                  : "0 2px 8px rgba(15,15,15,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
              onMouseEnter={(e) => {
                if (!selected) {
                  e.currentTarget.style.borderColor = COLOR.gold;
                  e.currentTarget.style.background = "rgba(250,245,235,0.7)";
                }
              }}
              onMouseLeave={(e) => {
                if (!selected) {
                  e.currentTarget.style.borderColor = "rgba(26,26,26,0.16)";
                  e.currentTarget.style.background = "#FFFFFF";
                }
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  fontFamily: l.fontFamily,
                  letterSpacing: "-0.005em",
                  lineHeight: 1.1,
                }}
              >
                {l.native}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: selected ? "rgba(250,245,235,0.7)" : COLOR.muted,
                  marginTop: 4,
                }}
              >
                {l.english}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontFamily: l.fontFamily,
                  color: selected ? "rgba(250,245,235,0.85)" : "#1A1A1A99",
                  marginTop: 2,
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                &ldquo;{l.greeting}&rdquo;
              </span>
            </button>
          );
        })}
      </div>

      {/* Widget mount area */}
      {lang ? (
        <div style={{ minHeight: 320 }}>
          <p
            style={{
              fontSize: 13,
              color: COLOR.muted,
              margin: "0 0 14px",
              fontStyle: "italic",
            }}
          >
            Active language:{" "}
            <strong style={{ color: COLOR.ink, fontStyle: "normal" }}>
              {LANGS.find((l) => l.code === lang)?.english}
            </strong>{" "}
            · Click the launcher to start. The agent will only respond in this language.
          </p>
          <elevenlabs-convai
            key={lang}
            agent-id={AGENT_BY_LANG[lang]}
          />
        </div>
      ) : (
        <div
          style={{
            minHeight: 120,
            background: "rgba(26,26,26,0.03)",
            border: "1px dashed rgba(26,26,26,0.18)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLOR.muted,
            fontSize: 14,
            fontStyle: "italic",
          }}
        >
          ↑ Pick a language above to begin
        </div>
      )}

      <p
        style={{
          fontSize: 11,
          color: COLOR.muted,
          marginTop: 22,
          paddingTop: 16,
          borderTop: "1px solid rgba(26,26,26,0.08)",
          fontStyle: "italic",
          letterSpacing: "0.02em",
          lineHeight: 1.55,
        }}
      >
        The agent demonstrates with placeholder use cases (real estate, healthcare, D2C, jewellery, hospitality, etc.). For your business, every detail is configured — voice cloned to your brand, prompt tuned to your offerings, integrated with your existing WhatsApp / CRM / calendar.
      </p>
    </div>
  );
}
