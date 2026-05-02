import { cookies } from "next/headers";
import Link from "next/link";

import FooterEditorial from "@/components/design/FooterEditorial";
import DemoBrandedChat from "../_components/DemoBrandedChat";
import PasswordGate from "../venture-navigator/PasswordGate";
import { cookieNameFor, verifyToken } from "@/lib/demo-auth";

// Private demo URL for Agasthyam Kalaripayattu (Gurukkal Dr. S. Mahesh,
// Thiruvananthapuram). 130-year lineage · 6 offline centres · IKS-recognised.
// Configured for program-inquiry triage (classes / residentials / TTC /
// therapy / corporate / online).
//
// Agent: agent_7301kqmeqyppewjtf6fqx8xf2yg8 · spun up 2 May 2026.
//
// Access · password-gated via DEMO_AGASTHYAM_PASSWORD env var.
// Cookie set after correct entry, valid 7 days, scoped to slug "agasthyam".

const SLUG = "agasthyam";

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

const AGASTHYAM_AGENT_ID = "agent_7301kqmeqyppewjtf6fqx8xf2yg8";

export default async function AgasthyamDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ demo_error?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieNameFor(SLUG))?.value;
  if (!verifyToken(SLUG, token)) {
    const params = await searchParams;
    return (
      <PasswordGate slug={SLUG} initialError={mapDemoError(params.demo_error)} />
    );
  }

  return (
    <main
      className="vn-demo-page"
      style={{ background: CREAM, minHeight: "100vh", color: INK }}
    >
      <style>{`
        body > button[aria-label="Open Skillies chat"],
        body > div[aria-label="Skillies chat"],
        body > [data-skillies-chat-launcher],
        body > #skillies-chat-root {
          display: none !important;
        }
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
            Private demo · For Gurukkal Dr. Mahesh
          </span>
          <a
            href="https://wa.me/918714318352?text=Gurukkal%20%E2%80%94%20saw%20the%20Agasthyam%20demo%2C%20let%E2%80%99s%20do%20the%2030-min%20call"
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
              Private Demo · For Gurukkal Dr. S. Mahesh
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
              Six centres. One number.{" "}
              <em
                style={{
                  fontStyle: "italic",
                  color: RED,
                  fontWeight: 400,
                }}
              >
                Every inquiry, met.
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
              Built for Agasthyam Kalaripayattu's intake flow. Receives every
              caller — local, Indian, international — captures their{" "}
              <strong style={{ color: INK }}>programme, dates, experience, and any health detail</strong>{" "}
              respectfully, in English or Malayalam, then routes the right
              inquiry to the right person on the team.
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
              <Stat n="130 yrs" sub="lineage · since 1896 · Thekkan Sampradayam" />
              <Stat n="6+" sub="centres · TVM · plus global online" />
              <Stat n="9" sub="countries · 5,000+ international students" />
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

          {/* Hero visual */}
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
                "Hello, I want join Kalari for fitness",
                "Sir please send fees",
                "Hello any reply?",
                "Sir TTC dates?",
              ]}
              footer="3 channels · 1 phone · 80–120 inquiries/day · most lose interest by day 2"
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
                "Hello, I want join Kalari for fitness",
                "Namaskaram. Welcome to Agasthyam. Are you looking for our daily Tejas track or the BALAM intensive?",
                "Tejas. I'm based in Trivandrum.",
                "Thank you. May I ask your fitness background and which centre is closest to you?",
              ]}
              footer="3 minutes · programme captured · routed to the team handling Tejas inquiries"
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
            title="Try it as if you were a new applicant."
            sub="Type or talk. Default is English; switches to formal Malayalam script if the applicant writes in Malayalam. Tone is calibrated to the institution — calm, respectful, never casual. Voice is the founder of Skillies' cloned voice."
          />
          <DemoBrandedChat
            agentId={AGASTHYAM_AGENT_ID}
            avatar="AG"
            label="Agasthyam · Inquiry Coordinator"
            footer="Powered by Skillies.AI · For Gurukkal Dr. Mahesh"
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
            Account, routes TTC + international inquiries to the senior team
            in real time, and learns from each handoff over time.
          </p>
        </section>

        {/* ──────────── COMPETITOR DIFFERENTIATION CHART ───────────── */}
        <section style={{ marginBottom: 64 }}>
          <SectionHeader
            eyebrow="Why Skillies, not the alternatives"
            title="Why this — not AiSensy, WATI, or a part-time admin."
            sub="The cheaper tools on the market are broadcast utilities — they don't reply on their own and don't know which programme an applicant is asking about. The other option is hiring an admin, which still misses overnight + international + Malayalam inquiries. Here's what each gives you for the same money."
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
              title="The 80–120 daily inquiries"
              body="Every caller, DM, and form-fill triaged into the right programme bucket — daily class, residential, TTC, therapy, corporate. No more 'send fees' messages going un-replied."
            />
            <FlowCard
              num="02"
              title="The international + overnight gap"
              body="A founder in Berlin or Singapore inquires at 3am IST. The agent answers, captures their TTC fit, and the team has a complete brief by morning. No 8-hour gap."
            />
            <FlowCard
              num="03"
              title="The right-person routing"
              body="TTC + international applicants get flagged urgent and pinged to the senior team's WhatsApp in 60 seconds. Daily class inquiries flow to the standard intake queue."
            />
            <FlowCard
              num="04"
              title="The lineage continuity"
              body="Returning students are remembered across years. Every inquiry logged, summarised, and searchable. Daily 9am email digest of overnight inquiries. Respect for the Gurukkal's time."
            />
          </div>
        </section>

        {/* ──────────── PRICING (visual) ──────────── */}
        <section id="pricing" style={{ scrollMarginTop: 80, marginBottom: 64 }}>
          <SectionHeader
            eyebrow="Pricing · sized to your scale"
            title="Scale tier. ₹99,999 setup + ₹99,999/mo."
            sub="Sized to ~80–120 inquiries/day across 6 centres + global online + multi-vertical programme catalogue. Includes 15,000 conversations/month before overage. No commission. No annual lock-in. Meta WhatsApp API costs are pass-through to your own WABA."
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
            through how this plugs into Agasthyam's intake pipeline.
            Lock terms on the same call if it's a fit.
          </p>
          <a
            href="https://wa.me/918714318352?text=Gurukkal%20%E2%80%94%20saw%20the%20Agasthyam%20demo%2C%20let%E2%80%99s%20do%20the%2030-min%20call"
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
            WhatsApp Ehsan · book the 30 min →
          </a>
          <p
            style={{
              fontSize: 12,
              color: "#9CA3AF",
              margin: "20px 0 0",
            }}
          >
            Or reply to this WhatsApp thread · Ehsan, Skillies founder, +91 87143 18352
          </p>
        </section>
      </article>

      <FooterEditorial />

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
// Components (mirrored from the venture-navigator page; identical visual
// language across all prospect demos for consistency).
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
          const isApplicant = i % 2 === 0;
          return (
            <div
              key={i}
              style={{
                alignSelf: isApplicant ? "flex-start" : "flex-end",
                background: isApplicant ? "white" : "#1F3A2E",
                color: isApplicant ? INK : CREAM,
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 12,
                borderTopLeftRadius: isApplicant ? 4 : 12,
                borderBottomRightRadius: isApplicant ? 12 : 4,
                maxWidth: "90%",
                border: isApplicant ? "1px solid #E5E7EB" : "none",
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
    label: "AI replies in English + Malayalam (native script)",
    skillies: true,
    aisensy: false,
    wati: false,
    human: "1 language",
  },
  {
    label: "Knows the difference between TTC, residential, class, therapy",
    skillies: true,
    aisensy: false,
    wati: false,
    human: true,
  },
  {
    label: "Per-applicant memory across weeks/months",
    skillies: true,
    aisensy: false,
    wati: false,
    human: false,
  },
  {
    label: "Reads images (IDs, photos, deck slides)",
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
    label: "International + overnight inquiries answered live",
    skillies: true,
    aisensy: "broadcast only",
    wati: "broadcast only",
    human: false,
  },
  {
    label: "Routes TTC + intl. to senior team in 60s",
    skillies: true,
    aisensy: false,
    wati: "manual",
    human: "shift-bound",
  },
  {
    label: "Self-improving (corrects its own answers)",
    skillies: true,
    aisensy: false,
    wati: false,
    human: false,
  },
  {
    label: "Monthly cost (Trivandrum, ~100/day)",
    skillies: "₹99,999",
    aisensy: "₹3,200 + admin",
    wati: "₹4,500 + admin",
    human: "₹20–25K admin",
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
  { key: "human", label: "Part-time admin", short: "Admin" },
];

const SKILLIES_WINS = CAPABILITIES.length;

function CompetitorTable() {
  return (
    <div className="vn-comp">
      <div className="vn-comp-summary">
        <span className="vn-comp-badge">
          Skillies leads on {SKILLIES_WINS} of {CAPABILITIES.length}
        </span>
        <span className="vn-comp-tag">
          For the <strong>same money or less</strong> than the alternatives.
        </span>
      </div>

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
                      <span className="vn-comp-check" aria-label="Yes">✓</span>
                    ) : isDash ? (
                      <span className="vn-comp-no" aria-label="No">—</span>
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

        /* MOBILE LAYOUT */
        .vn-comp-thead { display: none; }
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
          .vn-comp-thead-cap { padding: 14px 16px; }
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
          .vn-comp-row:nth-child(odd) { background: #FAF5EB; }
          .vn-comp-rowlabel {
            padding: 14px 16px;
            margin: 0;
            display: flex;
            align-items: center;
            font-size: 14px;
          }
          .vn-comp-cells { display: contents; }
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
          .vn-comp-cell-vendor { display: none; }
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
            Recommended for Agasthyam
          </div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Scale tier</div>
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(250,245,235,0.7)",
          }}
        >
          15,000 conversations/mo · multi-centre · multi-vertical · multi-language
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <PriceTile
          label="Setup (one-time)"
          value="₹99,999"
          sub="Live in 14 working days · payable on go-live"
        />
        <PriceTile
          label="Monthly"
          value="₹99,999"
          sub="No commission · no annual lock-in · 12-month term"
          accent
        />
        <PriceTile
          label="Founding-partner offer"
          value="Setup waived"
          sub="In exchange for case study + Gurukkal video testimonial + 3 peer intros"
          highlight
        />
      </div>

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
            "AI replies on every WhatsApp + DM · English + Malayalam",
            "Programme-aware triage (class / TTC / therapy / corp / online)",
            "Inbound voice-note transcription (Whisper)",
            "Image understanding (IDs, deck slides, photos)",
            "Per-applicant memory across all conversations",
            "Hot-lead alerts (TTC + international) to senior team in 60s",
            "Daily 9am email digest of overnight inquiries",
            "Self-improving prompt that fixes its own answers",
            "DPDP / TRAI compliance baked in",
            "15,000 conversations/mo · ₹2/conv overage",
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
        <strong style={{ color: INK }}>pass-through</strong> · Agasthyam
        connects its own WABA, Meta bills Agasthyam directly. Most inbound is
        free (service conversations); only marketing broadcasts cost paise per
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
