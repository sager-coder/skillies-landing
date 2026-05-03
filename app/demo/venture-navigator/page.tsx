import { cookies } from "next/headers";
import Link from "next/link";

import FooterEditorial from "@/components/design/FooterEditorial";
import DemoBrandedChat from "../_components/DemoBrandedChat";
import PasswordGate from "./PasswordGate";
import { cookieNameFor, verifyToken } from "@/lib/demo-auth";

// Private demo URL for Vivek M V (@venture_navigator) · Kerala startup
// accelerator. Configured for founder-applicant screening, not B2C sales.
// Agent: agent_9401kqkyg1g3ejcsdke3x602jw2s · spun up 2 May 2026.
//
// Access · password-gated via DEMO_VENTURE_NAVIGATOR_PASSWORD env var.
// Cookie set after correct entry, valid 7 days, scoped to this slug.

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
const DARK = "#1F3A2E";
const GOLD = "#C9A24E";

const VENTURE_NAVIGATOR_AGENT_ID = "agent_9401kqkyg1g3ejcsdke3x602jw2s";

export default async function VentureNavigatorDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ demo_error?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieNameFor(SLUG))?.value;
  if (!verifyToken(SLUG, token)) {
    const params = await searchParams;
    return <PasswordGate slug={SLUG} initialError={mapDemoError(params.demo_error)} />;
  }

  return (
    <main
      className="vn-demo-page"
      style={{ background: CREAM, minHeight: "100vh", color: INK }}
    >
      {/* Aggressive global-widget hide: SkilliesChatWidget renders a
          motion.button with aria-label="Open Skillies chat" and the panel
          has aria-label="Skillies chat". Both are fixed-positioned siblings
          of <main>. Hiding by aria-label catches them deterministically. */}
      <style>{`
        body > button[aria-label="Open Skillies chat"],
        body > div[aria-label="Skillies chat"],
        body > [data-skillies-chat-launcher],
        body > #skillies-chat-root {
          display: none !important;
        }
        /* Belt-and-suspenders: any fixed-positioned launcher that renders
           outside our main · scoped tightly so we don't nuke unrelated UI. */
        .vn-demo-page ~ button[class*="fixed"],
        .vn-demo-page ~ div[class*="fixed"] {
          display: none !important;
        }
      `}</style>

      {/* ───────────────────── MINI TOP BAR ───────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(250,245,235,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${ACCENT}14`,
        }}
      >
        <div
          className="vn-topbar"
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: INK,
              fontWeight: 800,
              letterSpacing: "0.01em",
              fontSize: 17,
              flexShrink: 0,
            }}
          >
            SKILLIES<span style={{ color: RED }}>.AI</span>
          </Link>
          <span
            className="vn-topbar-tag"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: MUTED,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Private demo · For Vivek M V
          </span>
          <a
            href="https://cal.com/sager-zmd4kl/30min?notes=Vivek%20%E2%80%94%20saw%20the%20Venture%20Navigator%20demo%2C%20booking%20the%2030-min%20call"
            target="_blank"
            rel="noopener noreferrer"
            className="vn-topbar-cta"
            style={{
              background: ACCENT,
              color: "white",
              padding: "8px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(15,118,110,0.20)",
              flexShrink: 0,
            }}
          >
            Book the call →
          </a>
        </div>
        <style>{`
          /* The middle "private demo" badge is decorative; on narrow
             screens the logo + CTA need the room. Below 720px the badge
             hides entirely (the hero says the same thing 60px below it),
             so logo + CTA stay on one line at any width. */
          @media (max-width: 720px) {
            .vn-topbar-tag { display: none !important; }
            .vn-topbar { padding: 10px 14px !important; gap: 8px !important; }
            .vn-topbar-cta { padding: 7px 14px !important; font-size: 12px !important; }
          }
        `}</style>
      </header>

      {/* ───────────────────── HERO ───────────────────── */}
      <section
        style={{
          position: "relative",
          background:
            "radial-gradient(1200px 600px at 80% -100px, rgba(15,118,110,0.15), transparent 60%), radial-gradient(900px 500px at 0% 0%, rgba(201,162,78,0.12), transparent 60%), " + CREAM,
          paddingTop: 64,
          paddingBottom: 56,
          borderBottom: `1px solid ${ACCENT}1f`,
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 24px",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
            gap: 48,
            alignItems: "center",
          }}
          className="vn-hero-grid"
        >
          <div>
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
            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(36px, 5vw, 58px)",
                lineHeight: 1.04,
                fontWeight: 400,
                margin: "0 0 18px",
                letterSpacing: "-0.015em",
              }}
            >
              130 founders apply daily.{" "}
              <em
                style={{
                  fontStyle: "italic",
                  color: RED,
                  fontWeight: 400,
                }}
              >
                One screens them all.
              </em>
            </h1>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.55,
                color: MUTED,
                margin: "0 0 14px",
                maxWidth: 540,
              }}
            >
              Built for Venture Navigator. Captures{" "}
              <strong style={{ color: INK }}>idea, traction, team, ask, runway, location</strong>{" "}
              from every applicant in three minutes — English or Malayalam, with
              images, while you sleep.
            </p>

            {/* Quick-stat strip */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 14,
                margin: "26px 0 30px",
                maxWidth: 540,
              }}
            >
              <Stat n="~130" sub="founder applications/day · self-reported" />
              <Stat n="<60s" sub="hot lead → your phone" />
              <Stat n="5" sub="Indian languages, native script" />
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="#chat"
                style={{
                  background: RED,
                  color: CREAM,
                  padding: "12px 22px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  boxShadow: "0 8px 22px rgba(196,40,40,0.28)",
                }}
              >
                Open the agent ↓
              </a>
              <a
                href="#pricing"
                style={{
                  background: "transparent",
                  color: INK,
                  padding: "12px 22px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  border: `1px solid ${INK}33`,
                  letterSpacing: "0.02em",
                }}
              >
                See the price
              </a>
            </div>
          </div>

          {/* Hero visual: a stylized "before vs after" */}
          <div
            style={{
              background: "white",
              border: `1px solid ${ACCENT}26`,
              borderRadius: 18,
              padding: 22,
              boxShadow: "0 28px 56px rgba(31, 58, 46, 0.10)",
            }}
            className="vn-hero-card"
          >
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: MUTED,
                margin: "0 0 10px",
              }}
            >
              Your inbox right now
            </p>
            <BeforeAfterBlock
              label="Before"
              tone="bad"
              lines={[
                "👋 hi",
                "Sir, please review my pitch",
                "Sir, when can we discuss?",
                "Sir, I sent the deck again 🙏",
              ]}
              footer="3 days · 0 replies · founder churned to next accelerator"
            />
            <div
              style={{
                margin: "16px 0",
                fontSize: 11,
                fontWeight: 700,
                color: ACCENT,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              ↓ With Skillies
            </div>
            <BeforeAfterBlock
              label="After"
              tone="good"
              lines={[
                "👋 hi",
                "Hi! I'm Vivek's screening agent. Quick 6 questions before he reviews — what's your startup?",
                "Building a Malayalam-first farm-input marketplace…",
                "Got it. Traction so far — revenue, signups, MoUs?",
              ]}
              footer="3 minutes · application captured · Vivek pinged for the hot ones"
            />
          </div>
        </div>
      </section>

      <article
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "60px 24px 80px",
        }}
      >
        {/* ───────────────────── DEMO PANEL ───────────────────── */}
        <section id="chat" style={{ scrollMarginTop: 80, marginBottom: 64 }}>
          <SectionHeader
            eyebrow="Live demo · talk or type"
            title="Try it as if you were a founder applying."
            sub="Type or talk. Default is English; switches to formal Malayalam script if the applicant writes in Malayalam. Reads Manglish input but never replies in Manglish — vendor evaluation deserves polish. Voice is the founder's actual cloned voice."
          />
          <DemoBrandedChat
            agentId={VENTURE_NAVIGATOR_AGENT_ID}
            avatar="VN"
            label="Venture Navigator · Founder Screener"
            footer="Powered by Skillies.AI · For Vivek M V"
          />
          <p
            style={{
              fontSize: 12,
              color: "#9CA3AF",
              fontStyle: "italic",
              textAlign: "center",
              margin: "14px 0 0",
            }}
          >
            Demo agent · won't reveal system internals or vendors. The
            production agent connects directly to your WhatsApp Business
            Account, routes hot leads to your phone, and learns from your
            decisions over time.
          </p>
        </section>

        {/* ──────────── COMPETITOR DIFFERENTIATION CHART ───────────── */}
        <section style={{ marginBottom: 64 }}>
          <SectionHeader
            eyebrow="The differentiation"
            title="Why this — not AiSensy, WATI, Interakt, or a junior salesperson."
            sub="Most options on the market are either broadcast tools that still need a human to reply, voice agents for outbound calling, or the human itself. Here's what each gives you for the same money."
          />
          <CompetitorTable />
        </section>

        {/* ──────────── HOW IT FITS YOUR FLOW ──────────── */}
        <section style={{ marginBottom: 64 }}>
          <SectionHeader
            eyebrow="What it replaces in your flow"
            title="Every leak, plugged."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            <FlowCard
              num="01"
              title="The 130 daily applications"
              body="Captures the six screener fields from every founder DM-ing you, in their language, in under 3 minutes. No Google Forms, no copy-paste."
            />
            <FlowCard
              num="02"
              title="The 'no reply' problem"
              body="Every applicant gets a real conversation in 5 seconds — not a 'we'll get back' template. The complaint on your last reel goes away."
            />
            <FlowCard
              num="03"
              title="Triage, instant"
              body="Hot founders (concrete traction, real ask, Kerala-based) ping your phone in 60 seconds. The rest stays queued for your schedule."
            />
            <FlowCard
              num="04"
              title="Audit + memory"
              body="Every conversation logged + summarised. 9am email digest of overnight applicants. Returning founders are remembered. DPDP-compliant."
            />
          </div>
        </section>

        {/* ──────────── PRICING (visual) ──────────── */}
        <section id="pricing" style={{ scrollMarginTop: 80, marginBottom: 64 }}>
          <SectionHeader
            eyebrow="Pricing · sized to your volume"
            title="Growth tier. ₹49,999 setup + ₹39,999/mo."
            sub="Sized to ~130 applications/day. Sits inside the Growth band (1,000–1,499 conversations/month after the AI handles bulk screening). No commission. No annual lock-in. Meta WhatsApp API costs are pass-through to your own WABA."
          />
          <PricingCard />
        </section>

        {/* ──────────── NEXT STEP CTA ──────────── */}
        <section
          style={{
            textAlign: "center",
            margin: "0",
            padding: "48px 28px",
            background: DARK,
            color: CREAM,
            borderRadius: 18,
            boxShadow: "0 24px 56px rgba(31, 58, 46, 0.18)",
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
              fontSize: "clamp(28px, 4vw, 42px)",
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
              maxWidth: 560,
            }}
          >
            30 minutes on Zoom · live screen-share, dashboard tour, walk
            through how this plugs into your application pipeline. Lock terms
            on the same call if you're in.
          </p>
          <a
            href="https://cal.com/sager-zmd4kl/30min?notes=Vivek%20%E2%80%94%20Venture%20Navigator%20demo%2C%20booking%20the%2030-min%20call"
            style={{
              display: "inline-block",
              background: GOLD,
              color: "#0F0F0F",
              padding: "14px 32px",
              borderRadius: 999,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 15,
              letterSpacing: "0.03em",
              boxShadow: "0 8px 22px rgba(201,162,78,0.30)",
            }}
          >
            Book the 30-min call →
          </a>
          <p
            style={{
              fontSize: 12,
              color: "#9CA3AF",
              margin: "20px 0 0",
            }}
          >
            Auto-confirmed · 30-min Zoom · Skillies founder Ehsan + the team handle logistics
          </p>
        </section>
      </article>

      <FooterEditorial />

      {/* Mobile responsiveness */}
      <style>{`
        @media (max-width: 880px) {
          .vn-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .vn-hero-card {
            order: -1;
          }
        }
      `}</style>
    </main>
  );
}

// Maps the demo_error query param (set by the form-fallback path on auth
// failure) into a human-readable message for PasswordGate to render.
function mapDemoError(code: string | undefined): string | null {
  if (!code) return null;
  const map: Record<string, string> = {
    wrong_password: "That access code didn't match. Try again.",
    missing_password: "Please enter the access code.",
    demo_not_configured: "This demo isn't active right now. Message Ehsan.",
    unknown_slug: "This demo link is invalid. Message Ehsan.",
  };
  return map[code] ?? null;
}

// ──────────────────────────────────────────────────────────────────────────
// Components
// ──────────────────────────────────────────────────────────────────────────

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: ACCENT,
          margin: "0 0 12px",
        }}
      >
        {eyebrow}
      </p>
      <h2
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: "clamp(26px, 3.4vw, 38px)",
          lineHeight: 1.1,
          fontWeight: 400,
          margin: "0 0 14px",
          letterSpacing: "-0.01em",
          color: INK,
        }}
      >
        {title}
      </h2>
      {sub ? (
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.55,
            color: MUTED,
            margin: 0,
            maxWidth: 760,
          }}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
}

function Stat({ n, sub }: { n: string; sub: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(8px)",
        border: `1px solid ${ACCENT}1f`,
        borderRadius: 12,
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          fontFamily: "'Instrument Serif', serif",
          color: INK,
          lineHeight: 1.0,
          letterSpacing: "-0.01em",
        }}
      >
        {n}
      </div>
      <div
        style={{
          fontSize: 11,
          color: MUTED,
          marginTop: 4,
          lineHeight: 1.35,
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function BeforeAfterBlock({
  label,
  tone,
  lines,
  footer,
}: {
  label: string;
  tone: "good" | "bad";
  lines: string[];
  footer: string;
}) {
  return (
    <div
      style={{
        background: tone === "good" ? "#F1FAF6" : "#FAF5EB",
        border: `1px solid ${tone === "good" ? "#10B98133" : "#D1D5DB"}`,
        borderRadius: 12,
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.18em",
          fontWeight: 700,
          color: tone === "good" ? "#0F766E" : "#9CA3AF",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {lines.map((line, i) => {
          const isFounder = i % 2 === 0;
          return (
            <div
              key={i}
              style={{
                alignSelf: isFounder ? "flex-start" : "flex-end",
                background: isFounder ? "white" : "#1F3A2E",
                color: isFounder ? INK : CREAM,
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 12,
                borderTopLeftRadius: isFounder ? 4 : 12,
                borderBottomRightRadius: isFounder ? 12 : 4,
                maxWidth: "90%",
                border: isFounder ? "1px solid #E5E7EB" : "none",
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
      <div
        style={{
          fontSize: 11,
          color: tone === "good" ? "#0F766E" : RED,
          marginTop: 10,
          fontStyle: "italic",
        }}
      >
        {footer}
      </div>
    </div>
  );
}

function FlowCard({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <div
      style={{
        background: "white",
        border: `1px solid ${ACCENT}1f`,
        borderRadius: 14,
        padding: "22px 22px",
        boxShadow: "0 4px 14px rgba(15, 118, 110, 0.05)",
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
          letterSpacing: "-0.005em",
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

// ──────────── Competitor table ────────────
type Capability = {
  label: string;
  skillies: boolean | string;
  aisensy: boolean | string;
  wati: boolean | string;
  human: boolean | string;
};

const CAPABILITIES: Capability[] = [
  {
    label: "AI replies in 5 Indian languages (native script)",
    skillies: true,
    aisensy: false,
    wati: false,
    human: "1–2 max",
  },
  {
    label: "Per-customer memory across weeks",
    skillies: true,
    aisensy: false,
    wati: false,
    human: false,
  },
  {
    label: "Reads images (decks, screenshots, IDs)",
    skillies: true,
    aisensy: false,
    wati: false,
    human: true,
  },
  {
    label: "Voice note transcription (inbound)",
    skillies: true,
    aisensy: false,
    wati: false,
    human: true,
  },
  {
    label: "Self-improving (corrects its own answers)",
    skillies: true,
    aisensy: false,
    wati: false,
    human: false,
  },
  {
    label: "24/7 · zero-second reply",
    skillies: true,
    aisensy: "broadcast only",
    wati: "broadcast only",
    human: false,
  },
  {
    label: "Hot-lead routing to your phone",
    skillies: true,
    aisensy: false,
    wati: "manual",
    human: true,
  },
  {
    label: "DPDP / TRAI compliant by design",
    skillies: true,
    aisensy: "retrofitted",
    wati: "retrofitted",
    human: "depends",
  },
  {
    label: "Monthly cost (Kerala, 130 apps/day)",
    skillies: "₹39,999",
    aisensy: "₹3,200 + a human",
    wati: "₹4,500 + a human",
    human: "₹25–30K",
  },
];

type ColDef = {
  key: "skillies" | "aisensy" | "wati" | "human";
  label: string;
  short: string;
  highlight?: boolean;
};

const COLS: ColDef[] = [
  { key: "skillies", label: "Skillies", short: "Skillies", highlight: true },
  { key: "aisensy", label: "AiSensy", short: "AiSensy" },
  { key: "wati", label: "WATI", short: "WATI" },
  { key: "human", label: "Junior salesperson", short: "Junior staff" },
];

// Skillies has a clear advantage on every row: true checkmarks on the
// boolean rows, and the lowest-cost-per-capability on the cost row.
// So the chip reads "9 of 9".
const SKILLIES_WINS = CAPABILITIES.length;

function CompetitorTable() {
  return (
    <div className="vn-comp">
      {/* Top summary strip */}
      <div className="vn-comp-summary">
        <span className="vn-comp-badge">
          Skillies leads on {SKILLIES_WINS} of {CAPABILITIES.length}
        </span>
        <span className="vn-comp-tag">
          For the <strong>same money or less</strong> than the alternatives.
        </span>
      </div>

      {/* DESKTOP table header (hidden on mobile) */}
      <div className="vn-comp-thead">
        <div className="vn-comp-thead-cap">Capability</div>
        {COLS.map((c) => (
          <div
            key={c.key}
            className={`vn-comp-thead-vendor ${c.highlight ? "is-skillies" : ""}`}
          >
            {c.label}
          </div>
        ))}
      </div>

      {/* Rows · same markup, CSS swaps layout at 760px */}
      {CAPABILITIES.map((cap, i) => (
        <div className="vn-comp-row" key={i}>
          <div className="vn-comp-rowlabel">{cap.label}</div>
          <div className="vn-comp-cells">
            {COLS.map((c) => {
              const v = cap[c.key];
              const isCheck = v === true;
              const isDash = v === false;
              const variant = c.highlight
                ? "skillies"
                : isCheck
                  ? "ok"
                  : isDash
                    ? "no"
                    : "text";
              return (
                <div
                  key={c.key}
                  className={`vn-comp-cell vn-comp-cell--${variant}`}
                  data-vendor={c.key}
                >
                  <span className="vn-comp-cell-vendor">{c.short}</span>
                  <span className="vn-comp-cell-value">
                    {isCheck ? (
                      <span className="vn-comp-check" aria-label="Yes">
                        ✓
                      </span>
                    ) : isDash ? (
                      <span className="vn-comp-no" aria-label="No">
                        —
                      </span>
                    ) : (
                      <span className="vn-comp-text">{v}</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="vn-comp-foot">
        Tools sell software · Skillies sells the work that software replaces.
      </div>

      <style>{`
        .vn-comp {
          background: white;
          border: 1px solid ${ACCENT}1f;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(15, 118, 110, 0.06);
        }
        .vn-comp-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          padding: 14px 18px;
          background: linear-gradient(135deg, ${DARK} 0%, #142821 100%);
          color: ${CREAM};
        }
        .vn-comp-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: ${ACCENT};
          color: white;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .vn-comp-tag {
          font-size: 12px;
          color: rgba(250, 245, 235, 0.75);
          letter-spacing: 0.02em;
        }
        .vn-comp-tag strong {
          color: ${GOLD};
          font-weight: 700;
        }

        /* ===== MOBILE LAYOUT (< 760px) ===============================
           For each capability we show:
             1. Capability label (top)
             2. A prominent Skillies "win" pill (full width, teal)
             3. A single compact strip with the three other vendors
                rendered as small dim pills · the user instantly sees
                "Skillies has it · others don't" without scanning a 2x2 grid.
        */
        .vn-comp-thead {
          display: none;
        }
        .vn-comp-row {
          display: block;
          padding: 16px 16px 14px;
          border-top: 1px solid ${ACCENT}1a;
          background: #FAF5EB;
        }
        .vn-comp-rowlabel {
          font-size: 14px;
          font-weight: 600;
          color: ${INK};
          margin-bottom: 12px;
          line-height: 1.35;
        }
        .vn-comp-cells {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .vn-comp-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        /* Skillies pill · prominent, full-width, teal-tinted. The "winner". */
        .vn-comp-cell--skillies {
          flex: 1 0 100%;
          padding: 10px 14px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(15,118,110,0.12) 0%, rgba(15,118,110,0.06) 100%);
          border: 1.5px solid ${ACCENT}66;
          justify-content: space-between;
        }
        .vn-comp-cell--skillies .vn-comp-cell-vendor {
          font-size: 11px;
          color: ${ACCENT};
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 800;
        }
        .vn-comp-cell--skillies .vn-comp-cell-value {
          font-size: 14px;
          font-weight: 700;
          color: ${ACCENT};
        }
        /* Others · inline compact strip (one row, three pills). */
        .vn-comp-cell:not(.vn-comp-cell--skillies) {
          flex: 1 1 calc((100% - 12px) / 3);
          min-width: 0;
          padding: 8px 10px;
          border-radius: 10px;
          background: white;
          border: 1px solid rgba(0,0,0,0.06);
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }
        .vn-comp-cell:not(.vn-comp-cell--skillies) .vn-comp-cell-vendor {
          font-size: 9px;
          color: #9CA3AF;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .vn-comp-cell:not(.vn-comp-cell--skillies) .vn-comp-cell-value {
          font-size: 13px;
          font-weight: 600;
          color: ${INK};
        }
        .vn-comp-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: ${ACCENT};
          color: white;
          font-size: 13px;
          font-weight: 700;
        }
        .vn-comp-cell:not(.vn-comp-cell--skillies) .vn-comp-check {
          width: 18px;
          height: 18px;
          font-size: 11px;
          background: #D1D5DB;
        }
        .vn-comp-no {
          color: #D1D5DB;
          font-weight: 700;
          font-size: 16px;
          line-height: 1;
        }
        .vn-comp-text {
          font-size: 11px;
          font-weight: 600;
          color: ${INK};
          line-height: 1.2;
        }
        .vn-comp-cell--skillies .vn-comp-text {
          font-size: 14px;
          color: ${ACCENT};
        }
        .vn-comp-foot {
          padding: 12px 16px;
          font-size: 12px;
          color: #6B7280;
          text-align: center;
          font-style: italic;
          border-top: 1px solid ${ACCENT}1a;
          background: #FAF5EB;
        }

        @media (min-width: 760px) {
          .vn-comp-thead {
            display: grid;
            grid-template-columns: minmax(0, 1.5fr) repeat(4, minmax(0, 1fr));
            background: ${DARK};
            color: ${CREAM};
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.04em;
          }
          .vn-comp-thead-cap {
            padding: 14px 16px;
          }
          .vn-comp-thead-vendor {
            padding: 14px 12px;
            text-align: center;
            border-left: 1px solid rgba(250, 245, 235, 0.08);
          }
          .vn-comp-thead-vendor.is-skillies {
            background: ${ACCENT};
            color: white;
            font-weight: 700;
          }
          .vn-comp-row {
            display: grid;
            grid-template-columns: minmax(0, 1.5fr) repeat(4, minmax(0, 1fr));
            padding: 0;
            background: white;
          }
          .vn-comp-row:nth-child(odd) {
            background: #FAF5EB;
          }
          .vn-comp-rowlabel {
            padding: 14px 16px;
            margin: 0;
            display: flex;
            align-items: center;
            font-size: 14px;
          }
          .vn-comp-cells {
            display: contents;
          }
          .vn-comp-cell {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 14px 10px;
            border: none;
            border-left: 1px solid ${ACCENT}1a;
            border-radius: 0;
            gap: 0;
            background: transparent;
          }
          .vn-comp-cell--skillies {
            background: rgba(15, 118, 110, 0.05);
          }
          .vn-comp-cell-vendor {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

// ──────────── Pricing card (visual) ────────────
function PricingCard() {
  return (
    <div
      style={{
        background: "white",
        border: `1px solid ${ACCENT}26`,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 18px 44px rgba(15, 118, 110, 0.08)",
      }}
    >
      {/* Top stripe with tier name */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DARK} 0%, #142821 100%)`,
          color: CREAM,
          padding: "20px 28px",
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.24em",
              fontWeight: 700,
              color: GOLD,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Recommended for Venture Navigator
          </div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Growth tier</div>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(250,245,235,0.7)",
          }}
        >
          1,000–1,499 conversations/mo · sized for ~130 applications/day
        </div>
      </div>

      {/* Numbers grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <PriceTile
          label="Setup (one-time)"
          value="₹49,999"
          sub="Live in 14 working days · payable on go-live"
        />
        <PriceTile
          label="Monthly"
          value="₹39,999"
          sub="No commission · no annual lock-in"
          accent
        />
        <PriceTile
          label="Founding-partner offer"
          value="Setup waived"
          sub="In exchange for case study + testimonial reel + 3 peer intros"
          highlight
        />
      </div>

      {/* Whats included */}
      <div
        style={{
          padding: "22px 28px",
          background: "#FAF5EB",
          borderTop: `1px solid ${ACCENT}1f`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: ACCENT,
            margin: "0 0 12px",
          }}
        >
          What's inside the monthly
        </div>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 10,
          }}
        >
          {[
            "AI replies on every WhatsApp message · 5 Indian languages",
            "Inbound voice-note transcription (Whisper)",
            "Image understanding (decks, screenshots, IDs)",
            "Per-customer memory across all conversations",
            "Hot-lead alerts to your phone in 60 seconds",
            "Daily 9am email digest of overnight applicants",
            "Self-improving prompt that fixes its own answers",
            "DPDP / TRAI compliance baked in",
          ].map((line) => (
            <li
              key={line}
              style={{
                fontSize: 13,
                color: INK,
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                lineHeight: 1.45,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: ACCENT,
                  color: "white",
                  fontSize: 11,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                ✓
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pass-through note */}
      <div
        style={{
          padding: "14px 28px",
          background: "white",
          borderTop: `1px solid ${ACCENT}1a`,
          fontSize: 12,
          color: MUTED,
          lineHeight: 1.5,
        }}
      >
        + 18% GST. Meta WhatsApp API costs are{" "}
        <strong style={{ color: INK }}>pass-through</strong> · you connect
        your own WABA, Meta bills you directly. Most inbound is free
        (service conversations); only marketing broadcasts cost paise per
        message.
      </div>
    </div>
  );
}

function PriceTile({
  label,
  value,
  sub,
  accent,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        padding: "22px 24px",
        background: highlight ? "rgba(201,162,78,0.10)" : "white",
        borderRight: `1px solid ${ACCENT}1a`,
        borderBottom: `1px solid ${ACCENT}1a`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: highlight ? GOLD : MUTED,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: accent ? ACCENT : INK,
          letterSpacing: "-0.01em",
          lineHeight: 1.05,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          color: MUTED,
          marginTop: 6,
          lineHeight: 1.4,
        }}
      >
        {sub}
      </div>
    </div>
  );
}
