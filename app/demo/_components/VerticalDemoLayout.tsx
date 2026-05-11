/**
 * VerticalDemoLayout · shared layout for all 6 generic vertical demo pages
 * at /demo/<vertical>. Open access (no password gate).
 *
 * Embeds DemoBrandedChat with the per-vertical agent_id and brand voice.
 * Uses the new Skillies B2B visual frame · cream bg, Fraunces section type,
 * vertical-specific accent on the header strip.
 */
import Link from "next/link";
import DemoBrandedChat from "./DemoBrandedChat";
import FooterEditorial from "@/components/design/FooterEditorial";

export type VerticalDemoConfig = {
  agentId: string;
  /** "Skillies for Real Estate" — shown in header */
  vertical: string;
  /** Hex color string for the accent strip */
  accent: string;
  /** 2-char monogram for the chat avatar */
  avatar: string;
  /** Footer line under the chat input */
  chatFooter: string;
  /** Link back to the marketing landing page */
  marketingHref: string;
};

export default function VerticalDemoLayout({ config }: { config: VerticalDemoConfig }) {
  return (
    <main
      className="vertical-demo"
      style={{ background: "var(--sk-cream)", minHeight: "100vh" }}
    >
      {/* Hide the floating Skillies chat widget — this page IS the chat */}
      <style>{`
        .vertical-demo ~ button[class*="fixed"],
        .vertical-demo ~ div[class*="fixed"] {
          display: none !important;
        }
      `}</style>

      {/* Mini sticky top bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(250,245,235,0.94)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid var(--sk-hairline)`,
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-space-grotesk), Georgia, serif",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--sk-ink)",
              textDecoration: "none",
            }}
          >
            SKILLIES<span style={{ color: "var(--sk-red)" }}>.AI</span>
          </Link>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "var(--sk-ink60)",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: config.accent,
                display: "inline-block",
              }}
            />
            <span>Live demo · {config.vertical}</span>
          </div>
          <Link
            href={config.marketingHref}
            style={{
              fontSize: 13,
              color: "var(--sk-ink60)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            ← Back to {config.vertical}
          </Link>
        </div>
      </header>

      {/* Hero strip */}
      <section
        className="sk-container"
        style={{ paddingTop: 48, paddingBottom: 32 }}
      >
        <p
          className="sk-font-meta"
          style={{ color: config.accent, marginBottom: 12 }}
        >
          DEMO · TRY THE AGENT ON YOURSELF
        </p>
        <h1
          className="sk-font-display"
          style={{
            fontSize: "clamp(2rem, 3vw + 1rem, 3rem)",
            color: "var(--sk-ink)",
            maxWidth: "22ch",
          }}
        >
          {config.vertical}
        </h1>
        <p
          className="sk-font-body"
          style={{
            marginTop: 16,
            color: "var(--sk-ink60)",
            fontSize: "1.0625rem",
            maxWidth: "60ch",
          }}
        >
          The agent below is a generic-but-vertical-tuned version. Production
          agents train on YOUR business knowledge, integrate with YOUR CRM, and
          operate on YOUR WhatsApp Business API. Same engine, your data.
        </p>
      </section>

      {/* Chat embed */}
      <section
        className="sk-container"
        style={{ paddingBottom: 80 }}
      >
        <div
          style={{
            border: "1px solid var(--sk-hairline)",
            borderRadius: 16,
            overflow: "hidden",
            background: "var(--sk-cream)",
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          <DemoBrandedChat
            agentId={config.agentId}
            avatar={config.avatar}
            label={config.vertical}
            footer={config.chatFooter}
          />
        </div>
      </section>

      <FooterEditorial />
    </main>
  );
}
