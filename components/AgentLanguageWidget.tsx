"use client";

/**
 * AgentLanguageWidget — language picker + ElevenLabs Convai widget.
 *
 * Visitor picks a language (Malayalam / Tamil / Kannada / English). The
 * picked language is passed to the agent as `user_language` dynamic
 * variable, which the agent's prompt reads to choose its opening line.
 *
 * Each language change forces a remount (via `key`) so the widget reloads
 * with the new dynamic-variables JSON. ElevenLabs's web component reads
 * dynamic-variables once per session start.
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

type Lang = "ml" | "ta" | "kn" | "en";

const LANGS: Array<{
  code: Lang;
  native: string;
  english: string;
  greeting: string;
}> = [
  { code: "ml", native: "മലയാളം", english: "Malayalam", greeting: "നമസ്കാരം" },
  { code: "ta", native: "தமிழ்", english: "Tamil", greeting: "வணக்கம்" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", greeting: "ನಮಸ್ಕಾರ" },
  { code: "en", native: "English", english: "English", greeting: "Hello" },
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
  forest: "#1F3A2E",
};

export default function AgentLanguageWidget({ agentId }: { agentId: string }) {
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
        borderRadius: 14,
        padding: "32px 28px",
        boxShadow: "0 12px 48px rgba(15, 15, 15, 0.06)",
      }}
    >
      {/* Status row */}
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
          Live · Multilingual voice + chat
        </span>
      </div>

      <h3
        style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontStyle: "italic",
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 400,
          margin: "0 0 10px",
          color: COLOR.ink,
          letterSpacing: "-0.01em",
          lineHeight: 1.1,
        }}
      >
        Pick a language to start.
      </h3>

      <p
        style={{
          fontSize: 15,
          color: COLOR.muted,
          margin: "0 0 28px",
          lineHeight: 1.55,
          maxWidth: 640,
        }}
      >
        The agent will open in your chosen language and switch automatically if
        you reply in another. Click the button, then either talk (allow mic) or
        type. The agent simulates a sample reactivation call for a hypothetical
        college admissions team.
      </p>

      {/* Language buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 12,
          marginBottom: 28,
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
                padding: "16px 18px",
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
                  ? "0 8px 24px rgba(15,15,15,0.20)"
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
                  fontFamily:
                    l.code === "ml"
                      ? "'Manjari', sans-serif"
                      : l.code === "ta"
                        ? "'Catamaran', sans-serif"
                        : l.code === "kn"
                          ? "'Anek Kannada', sans-serif"
                          : "'Inter', sans-serif",
                  letterSpacing: "-0.005em",
                }}
              >
                {l.native}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: selected ? "rgba(250,245,235,0.7)" : COLOR.muted,
                }}
              >
                {l.english} · &ldquo;{l.greeting}&rdquo;
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
            Agent will open in{" "}
            <strong style={{ color: COLOR.ink, fontStyle: "normal" }}>
              {LANGS.find((l) => l.code === lang)?.english}
            </strong>
            . Click the launcher below to start.
          </p>
          <elevenlabs-convai
            key={lang}
            agent-id={agentId}
            dynamic-variables={JSON.stringify({ user_language: lang })}
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
          ↑ Select a language above to begin
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
        }}
      >
        This is a live demo. The agent uses placeholder programme details (St.
        John&rsquo;s College in Kollam, UG admissions). For your institution every
        detail is configured to your real programmes, fee structures, and brand
        voice.
      </p>
    </div>
  );
}
