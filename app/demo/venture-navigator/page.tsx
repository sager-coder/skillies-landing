import { cookies } from "next/headers";

import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import DemoConvaiWidget from "@/components/DemoConvaiWidget";
import PasswordGate from "./PasswordGate";
import { cookieNameFor, verifyToken } from "@/lib/demo-auth";

// Private demo URL for Vivek M V (@venture_navigator) · Kerala startup
// accelerator. Configured for founder-applicant screening, not B2C sales.
// Agent: agent_9401kqkyg1g3ejcsdke3x602jw2s · spun up 2 May 2026.
//
// Access · password-gated via DEMO_VENTURE_NAVIGATOR_PASSWORD env var.
// Cookie set after correct entry, valid 7 days, scoped to this slug.
//
// Language design: English default, auto-switches to formal Malayalam
// script when applicant types in Malayalam. Reads Manglish input but
// never produces Manglish output.

const SLUG = "venture-navigator";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Private Demo · Skillies.AI",
  description: "Access-coded demo.",
  robots: "noindex, nofollow",
};

const CREAM = "#FAF5EB";
const INK = "#1A1A1A";
const MUTED = "#595959";
const ACCENT = "#0F766E";
const RED = "#C62828";
const GOLD = "#C9A24E";

const VENTURE_NAVIGATOR_AGENT_ID = "agent_9401kqkyg1g3ejcsdke3x602jw2s";

export default async function VentureNavigatorDemoPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieNameFor(SLUG))?.value;
  if (!verifyToken(SLUG, token)) {
    return <PasswordGate slug={SLUG} />;
  }

  return (
    <main style={{ background: CREAM, minHeight: "100vh", color: INK }}>
      <TopNav />

      {/* Hide the global floating chat widget · this page has its own embed. */}
      <style>{`
        body > [data-skillies-chat-launcher],
        body > div[class*="chat-launcher"],
        body > #skillies-chat-root {
          display: none !important;
        }
      `}</style>

      <article
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: "120px 24px 80px",
        }}
      >
        {/* ── EYEBROW ───────────────────────────────────────────── */}
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: ACCENT,
            margin: "0 0 18px",
          }}
        >
          Private Demo · For Vivek M V
        </p>

        {/* ── HEADLINE ─────────────────────────────────────────── */}
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(34px, 5vw, 54px)",
            lineHeight: 1.05,
            fontWeight: 400,
            margin: "0 0 22px",
            letterSpacing: "-0.01em",
          }}
        >
          Venture Navigator Founder Screener
        </h1>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.55,
            color: MUTED,
            margin: "0 0 14px",
            maxWidth: 720,
          }}
        >
          Vivek — this is Skillies AI Sales Agent configured for your founder-applicant
          screening flow. It captures the six things you'd ask any applicant before
          you take the call yourself: idea, traction, team, ask, runway, location.
        </p>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.55,
            color: MUTED,
            margin: "0 0 12px",
            maxWidth: 720,
          }}
        >
          Click the launcher below. Type or talk. The agent defaults to English and
          auto-switches to formal Malayalam script if the applicant writes in Malayalam.
          It reads Manglish input but never replies in Manglish — vendor evaluation
          deserves polish.
        </p>

        <p
          style={{
            fontSize: 14,
            lineHeight: 1.55,
            color: "#7B7B7B",
            margin: "0 0 40px",
            maxWidth: 720,
            fontStyle: "italic",
          }}
        >
          What you're hearing is a demo. In production for Venture Navigator,
          this would integrate with your WhatsApp Business Account, route hot
          founders to your phone in 60 seconds, and learn from your decisions
          over time. Same engine.
        </p>

        {/* ── DEMO PANEL ───────────────────────────────────────── */}
        <section
          aria-label="Live AI agent · Venture Navigator demo"
          style={{
            background: "#FFFFFF",
            border: `1px solid ${ACCENT}33`,
            borderRadius: 16,
            padding: "32px 28px",
            boxShadow: "0 10px 40px rgba(15, 118, 110, 0.08)",
            margin: "0 0 56px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#10B981",
                boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.18)",
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              Live · Configured for Venture Navigator
            </span>
          </div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 600,
              margin: "0 0 8px",
              color: INK,
            }}
          >
            Talk or text the screening agent
          </h2>
          <p
            style={{
              fontSize: 15,
              color: MUTED,
              margin: "0 0 24px",
              lineHeight: 1.55,
            }}
          >
            Try writing as if you were a founder applying. Throw in Malayalam
            or Manglish to see the language switching live.
          </p>

          <DemoConvaiWidget agentId={VENTURE_NAVIGATOR_AGENT_ID} />
        </section>

        {/* ── WHAT THIS REPLACES ────────────────────────────────── */}
        <section style={{ margin: "0 0 56px" }}>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 600,
              margin: "0 0 24px",
              color: INK,
            }}
          >
            What this replaces in your current flow
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 18,
            }}
          >
            <Card
              num="01"
              title="The 130 daily applications"
              body="Captures the six screener fields from every founder DM-ing you, in their language, in under 3 minutes. No Google Forms, no copy-paste."
            />
            <Card
              num="02"
              title="The 'no reply' problem"
              body="Every applicant gets a real conversation in 5 seconds — not a 'we'll get back to you' template. The complaint on your last reel goes away."
            />
            <Card
              num="03"
              title="The triage decision"
              body="Hot founders (concrete traction, real ask, Kerala-based) ping your phone in 60 seconds. Everyone else stays in a queue you review on your schedule."
            />
            <Card
              num="04"
              title="The audit trail"
              body="Every conversation logged, summarised, and searchable. Daily 9am email digest of overnight applicants. DPDP-compliant by design."
            />
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────── */}
        <section
          style={{
            background: "#FFFFFF",
            border: `1px solid ${ACCENT}22`,
            borderRadius: 16,
            padding: "32px 28px",
            margin: "0 0 56px",
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 600,
              margin: "0 0 12px",
              color: INK,
            }}
          >
            Investment · Growth tier
          </h2>
          <p
            style={{
              fontSize: 14,
              color: MUTED,
              margin: "0 0 22px",
              lineHeight: 1.55,
            }}
          >
            Sized to your ~130 applications/day · ~3,900/month inbound volume.
            Sits inside the Growth band (1,000 to 1,499 actively-converted
            conversations/month after the AI handles bulk screening).
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              alignItems: "baseline",
              margin: "0 0 14px",
            }}
          >
            <Tile label="Setup (one-time)" value="₹49,999" sub="Live in 14 working days" />
            <Tile label="Monthly" value="₹39,999" sub="No commission · no annual lock-in" accent />
            <Tile
              label="Founding-partner offer"
              value="Setup waived"
              sub="In exchange for a case study + a testimonial reel + 3 peer intros"
            />
          </div>
          <p style={{ fontSize: 14, color: MUTED, margin: 0, lineHeight: 1.55 }}>
            Plus 18% GST. Meta WhatsApp API costs are pass-through (you connect your own WABA · most inbound is free, only marketing broadcasts cost paise per message).
          </p>
        </section>

        {/* ── NEXT STEP ─────────────────────────────────────────── */}
        <section
          style={{
            textAlign: "center",
            margin: "60px 0 0",
            padding: "40px 24px",
            background: "#0F0F0F",
            color: "#FAF5EB",
            borderRadius: 16,
          }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: GOLD,
              margin: "0 0 14px",
            }}
          >
            Next step · 30 minutes
          </p>
          <h3
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(28px, 4vw, 38px)",
              fontWeight: 400,
              margin: "0 0 16px",
              letterSpacing: "-0.01em",
            }}
          >
            Walk through it on a call.
          </h3>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: "#D1D5DB",
              margin: "0 auto 28px",
              maxWidth: 540,
            }}
          >
            30 minutes on Zoom · live screen-share, dashboard tour, walk through
            how this plugs into your application pipeline. We lock terms on the
            same call if you're in.
          </p>
          <a
            href="https://wa.me/918714318352?text=Vivek%20here%20—%20saw%20the%20Venture%20Navigator%20demo,%20let's%20do%20the%20call"
            style={{
              display: "inline-block",
              background: GOLD,
              color: "#0F0F0F",
              padding: "14px 32px",
              borderRadius: 8,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 15,
              letterSpacing: "0.04em",
            }}
          >
            WhatsApp Ehsan · book the 30 min
          </a>
        </section>
      </article>

      <FooterEditorial />
    </main>
  );
}

function Card({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E7E5E4",
        borderRadius: 12,
        padding: "24px 22px",
      }}
    >
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.18em",
          fontWeight: 700,
          color: ACCENT,
          margin: "0 0 12px",
        }}
      >
        {num}
      </p>
      <h3
        style={{
          fontSize: 17,
          fontWeight: 600,
          margin: "0 0 8px",
          color: INK,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.55,
          color: MUTED,
          margin: 0,
        }}
      >
        {body}
      </p>
    </div>
  );
}

function Tile({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: 12,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: MUTED,
          margin: "0 0 4px",
          fontWeight: 600,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 28,
          fontWeight: 700,
          margin: 0,
          color: accent ? ACCENT : INK,
        }}
      >
        {value}
      </p>
      {sub ? (
        <p
          style={{
            fontSize: 12,
            color: MUTED,
            margin: "4px 0 0",
            lineHeight: 1.4,
          }}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
}
