import Link from "next/link";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";
import AgentLanguageWidget from "@/components/AgentLanguageWidget";

export const metadata = {
  title:
    "Skillies AI Sales Agent — Multilingual reactivation campaigns for Indian institutions",
  description:
    "9,000 cold leads. 5 days. Malayalam, Tamil, Kannada, English. Skillies' AI Sales Agent calls every past inquiry, qualifies them in their language, and routes hot leads to your team in 60 seconds. Built in Malappuram for Indian higher-ed and SMB.",
  openGraph: {
    title:
      "Skillies AI Sales Agent — Multilingual reactivation campaigns",
    description:
      "9,000 calls in 5 days. Malayalam · Tamil · Kannada · English. Hot leads routed to your team in 60 seconds. ₹40 per call. DPDP/TRAI compliant.",
  },
};

const WHATSAPP_AGENT =
  "https://wa.me/918714318352?text=Hi%20Ehsan%2C%20I%27m%20interested%20in%20the%20Skillies%20AI%20Sales%20Agent%20for%20my%20institution.%20My%20institution%20is%20";

const DEMO_AGENT_ID = "agent_6601kqjcwbrbew8t6ye78jq9g0g3";

// Brand palette — same as /services
const DARK = "#0F0F0F";
const CHARCOAL = "#1A1A1A";
const CREAM = "#FAF5EB";
const RED = "#C62828";
const GOLD = "#C9A24E";
const GOLD_LIGHT = "#E6C178";
const MUTED = "#6B7280";

export default function AISalesAgentPage() {
  return (
    <main style={{ background: DARK, color: "white", position: "relative" }}>
      <TopNav cta={{ href: WHATSAPP_AGENT, label: "Talk to Ehsan" }} />

      <Hero />
      <DemoBand />
      <PullQuote />
      <UseCases />
      <HowItWorks />
      <Pricing />
      <Compliance />
      <FinalCTA />

      <FooterEditorial />
      <WhatsAppButton />
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* HERO                                                                     */
/* ═══════════════════════════════════════════════════════════════════════ */

function Hero() {
  const accents = [
    "Multilingual native",
    "DPDP / TRAI compliant",
    "Live in 14 working days",
    "Built in Malappuram",
  ];

  return (
    <section
      style={{
        padding: "150px 24px 90px",
        background: DARK,
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(201,162,78,0.10), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(198,40,40,0.06), transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 64,
          alignItems: "start",
        }}
        className="hero-grid"
      >
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: GOLD_LIGHT,
              fontWeight: 700,
              margin: "0 0 18px",
            }}
          >
            § Skillies AI Business Lab · Sales Agent
          </p>

          <h1
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(46px, 7vw, 92px)",
              fontWeight: 400,
              lineHeight: 0.98,
              letterSpacing: "-0.025em",
              margin: "0 0 26px",
              color: CREAM,
            }}
          >
            9,000 cold leads.
            <br />
            <span style={{ color: GOLD_LIGHT }}>5 days.</span>
            <br />
            Their language.
          </h1>

          <p
            style={{
              fontSize: 19,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.78)",
              maxWidth: 620,
              margin: "0 0 18px",
            }}
          >
            An AI voice and chat agent that calls every past lead in your
            database — in Malayalam, Tamil, Kannada, or English — qualifies them
            in 90 seconds, and routes hot ones to your team in real time.
          </p>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.62)",
              maxWidth: 620,
              margin: "0 0 36px",
            }}
          >
            Replaces a 4-person telecaller team. Cuts a 6-week reactivation
            campaign to 5 days. Every conversation recorded, transcribed, and
            tagged. Built for Kerala higher-education institutions, multi-shop
            retail, real-estate firms, and Indian SMBs running outbound at
            scale.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <a
              href="#demo"
              style={{
                display: "inline-block",
                background: GOLD,
                color: DARK,
                padding: "14px 28px",
                borderRadius: 999,
                fontWeight: 700,
                textDecoration: "none",
                fontSize: 14,
                letterSpacing: "0.04em",
                boxShadow: "0 10px 28px rgba(201,162,78,0.32)",
              }}
            >
              Try the live agent ↓
            </a>
            <a
              href={WHATSAPP_AGENT}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "transparent",
                color: CREAM,
                padding: "13px 26px",
                borderRadius: 999,
                fontWeight: 600,
                textDecoration: "none",
                fontSize: 14,
                letterSpacing: "0.04em",
                border: `1px solid rgba(255,255,255,0.30)`,
              }}
            >
              WhatsApp Ehsan →
            </a>
          </div>
        </div>

        {/* Right rail · italic gold accents */}
        <ul
          aria-label="At a glance"
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            paddingTop: 20,
            borderLeft: `1px solid rgba(201,162,78,0.30)`,
            paddingLeft: 28,
          }}
        >
          {accents.map((line) => (
            <li
              key={line}
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: 24,
                color: GOLD_LIGHT,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              · {line}
            </li>
          ))}
        </ul>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `@media (max-width: 880px) { .hero-grid { grid-template-columns: 1fr !important; } }`,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* DEMO BAND · live agent embed with language picker                       */
/* ═══════════════════════════════════════════════════════════════════════ */

function DemoBand() {
  return (
    <section
      id="demo"
      style={{
        padding: "100px 24px 80px",
        background: CREAM,
        color: CHARCOAL,
        borderTop: `1px solid rgba(201,162,78,0.22)`,
        borderBottom: `1px solid rgba(201,162,78,0.22)`,
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: RED,
            fontWeight: 700,
            margin: "0 0 14px",
          }}
        >
          § Live demo
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(36px, 5.5vw, 64px)",
            fontWeight: 400,
            margin: "0 0 16px",
            letterSpacing: "-0.022em",
            lineHeight: 1.05,
          }}
        >
          Hear it in your language.
        </h2>
        <p
          style={{
            fontSize: 18,
            color: MUTED,
            margin: "0 0 40px",
            maxWidth: 700,
            lineHeight: 1.55,
          }}
        >
          Pick a language, click the launcher, and have a real conversation with
          the agent. Voice or text. The exact same agent your institution will
          deploy — just with placeholder admissions content.
        </p>

        <AgentLanguageWidget agentId={DEMO_AGENT_ID} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* PULL QUOTE                                                              */
/* ═══════════════════════════════════════════════════════════════════════ */

function PullQuote() {
  return (
    <section
      style={{
        padding: "120px 24px",
        background: DARK,
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(230,193,120,0.08), transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          position: "relative",
          textAlign: "center",
        }}
      >
        <span
          aria-hidden
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(120px, 16vw, 220px)",
            color: GOLD_LIGHT,
            opacity: 0.3,
            lineHeight: 0.6,
            display: "block",
            margin: "0 auto 0",
            letterSpacing: "-0.04em",
          }}
        >
          &ldquo;
        </span>
        <p
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(34px, 5vw, 68px)",
            fontWeight: 400,
            color: CREAM,
            lineHeight: 1.12,
            letterSpacing: "-0.025em",
            margin: "0 auto",
            maxWidth: 1000,
          }}
        >
          You don&rsquo;t need a bigger sales team.{" "}
          <span style={{ color: GOLD_LIGHT }}>You need every old lead called.</span>
        </p>
        <p
          style={{
            marginTop: 36,
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            fontWeight: 700,
          }}
        >
          § Skillies AI Sales Agent · Built for Indian SMBs
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* USE CASES                                                                */
/* ═══════════════════════════════════════════════════════════════════════ */

function UseCases() {
  const cases = [
    {
      eyebrow: "01 · Higher education",
      title: "Reactivate past admission inquiries",
      body: "Colleges sit on 5,000–20,000 unconverted inquiries per year. The agent calls each in their language, qualifies real interest, and books admissions calls. Conservative case: 90–270 hot leads from a 9,000-call campaign.",
    },
    {
      eyebrow: "02 · Coaching / ed-tech",
      title: "Re-engage dropouts, upsell next batch",
      body: "Past students who dropped off, parents who inquired but didn't enroll. Agent asks the right qualifying questions in Malayalam, books trial classes, routes serious leads to your counsellors.",
    },
    {
      eyebrow: "03 · Real estate",
      title: "Follow up site-visit leads at scale",
      body: "Brokers run high-volume Meta Ads, then can't call every lead. Agent calls each within 24h in Malayalam / Tamil, qualifies budget + timeline + location, hands hot leads to your closers.",
    },
    {
      eyebrow: "04 · Healthcare / clinics",
      title: "Re-confirm appointments + appointment outreach",
      body: "Clinics with 10–50 missed-call patient lists per week. Agent calls back in their preferred language, books appointments, escalates urgent cases. DPDP-compliant.",
    },
    {
      eyebrow: "05 · Multi-shop retail",
      title: "Customer reactivation + festival outreach",
      body: "Jewellery, apparel, electronics chains. Agent calls past customers ahead of festival sales, in their language, routes intent-to-buy leads to the nearest store. Tracks foot-traffic conversion.",
    },
    {
      eyebrow: "06 · Insurance / fintech",
      title: "Renewal + cross-sell campaigns",
      body: "Lapsed-policy holders, dormant accounts. Agent runs structured re-engagement scripts in any South Indian language, captures intent, schedules advisor calls. Audit-trail every conversation.",
    },
  ];

  return (
    <section
      style={{
        padding: "120px 24px",
        background: CREAM,
        color: CHARCOAL,
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: RED,
            fontWeight: 700,
            margin: "0 0 18px",
          }}
        >
          § Where it works
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 400,
            margin: "0 0 60px",
            letterSpacing: "-0.022em",
            lineHeight: 1.05,
          }}
        >
          Six verticals where{" "}
          <span style={{ color: GOLD }}>cold leads die slowly.</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 28,
          }}
        >
          {cases.map((c) => (
            <article
              key={c.title}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(26,26,26,0.08)",
                borderRadius: 14,
                padding: "32px 28px",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: GOLD,
                  fontWeight: 700,
                  margin: "0 0 14px",
                }}
              >
                {c.eyebrow}
              </p>
              <h3
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 26,
                  fontWeight: 400,
                  margin: "0 0 14px",
                  color: CHARCOAL,
                  letterSpacing: "-0.012em",
                  lineHeight: 1.15,
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: MUTED,
                  margin: 0,
                }}
              >
                {c.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* HOW IT WORKS                                                             */
/* ═══════════════════════════════════════════════════════════════════════ */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "You hand us the list",
      b: "CSV with name + phone (other context optional). 1,000 to 50,000 contacts. We sign an NDA before processing.",
    },
    {
      n: "02",
      t: "We register compliance",
      b: "DLT entity registration, caller-ID, DND lookup. ~7 working days. We handle it; you sign a couple of forms.",
    },
    {
      n: "03",
      t: "Voice cloning + agent training",
      b: "Optional: voice-clone your Director/Principal/founder. Agent prompt customized to your specific programmes, fees, and tone. Approval before any call.",
    },
    {
      n: "04",
      t: "Pilot batch · 50 calls",
      b: "We call 50 contacts. You listen to recordings. Approve quality before full rollout. Money-back if pilot quality fails.",
    },
    {
      n: "05",
      t: "Full campaign · 1,000–1,500 calls/day",
      b: "We complete 9,000 calls in 5–7 working days. Hot leads delivered to your team in real time via WhatsApp + email.",
    },
    {
      n: "06",
      t: "Final report · structured CSV",
      b: "Every call tagged: hot lead / not now / wrong number / DND / voicemail / no-answer. Your team has a prioritized follow-up list.",
    },
  ];

  return (
    <section
      style={{
        padding: "120px 24px",
        background: DARK,
        color: "white",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: GOLD_LIGHT,
            fontWeight: 700,
            margin: "0 0 18px",
          }}
        >
          § How it works
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 400,
            margin: "0 0 60px",
            color: CREAM,
            letterSpacing: "-0.022em",
            lineHeight: 1.05,
          }}
        >
          Sign Monday.{" "}
          <span style={{ color: GOLD_LIGHT }}>Live in 14 days.</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 32,
          }}
        >
          {steps.map((s) => (
            <div
              key={s.n}
              style={{
                paddingTop: 22,
                borderTop: `1px solid rgba(201,162,78,0.30)`,
              }}
            >
              <p
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 38,
                  color: GOLD_LIGHT,
                  margin: "0 0 8px",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.n}
              </p>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  margin: "0 0 10px",
                  color: CREAM,
                }}
              >
                {s.t}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.65)",
                  margin: 0,
                }}
              >
                {s.b}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* PRICING                                                                  */
/* ═══════════════════════════════════════════════════════════════════════ */

function Pricing() {
  return (
    <section
      style={{
        padding: "120px 24px",
        background: CREAM,
        color: CHARCOAL,
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: RED,
            fontWeight: 700,
            margin: "0 0 18px",
          }}
        >
          § Investment
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 400,
            margin: "0 0 50px",
            letterSpacing: "-0.022em",
            lineHeight: 1.05,
          }}
        >
          One number. Then{" "}
          <span style={{ color: GOLD }}>per call.</span>
        </h2>

        <div
          style={{
            background: "#FFFFFF",
            border: `1px solid rgba(201,162,78,0.30)`,
            borderRadius: 16,
            padding: "44px 36px",
            boxShadow: "0 12px 48px rgba(15,15,15,0.06)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 32,
              marginBottom: 24,
            }}
          >
            <PriceLine
              label="Setup (one-time)"
              amount="₹1,50,000"
              note="DLT registration, voice cloning, prompt customization, dashboard build"
            />
            <PriceLine
              label="Per-call rate"
              amount="₹40"
              note="Telephony + AI + transcription + DND check, all-in"
            />
            <PriceLine
              label="9,000-call total"
              amount="₹3,60,000"
              note="₹40 × 9,000 calls"
              accent
            />
          </div>

          <div
            style={{
              padding: "24px 0 0",
              borderTop: `1px solid rgba(26,26,26,0.10)`,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.20em",
                  textTransform: "uppercase",
                  color: MUTED,
                  fontWeight: 700,
                  margin: "0 0 6px",
                }}
              >
                Total project (setup + 9K campaign)
              </p>
              <p
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  margin: 0,
                  color: GOLD,
                  letterSpacing: "-0.015em",
                }}
              >
                ₹5,10,000{" "}
                <span style={{ fontSize: 18, color: MUTED, fontWeight: 500 }}>
                  + 18% GST
                </span>
              </p>
            </div>
            <a
              href={WHATSAPP_AGENT}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: CHARCOAL,
                color: CREAM,
                padding: "14px 28px",
                borderRadius: 999,
                fontWeight: 700,
                textDecoration: "none",
                fontSize: 14,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              Talk to Ehsan →
            </a>
          </div>

          <p
            style={{
              fontSize: 13,
              color: MUTED,
              margin: "20px 0 0",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            50% on signing. 50% on go-live (Day 1 of full campaign). Pilot
            (50-call test) approved before full rollout — money-back on pilot if
            quality fails. Contracts signed in writing; data deleted 30 days
            after campaign closes.
          </p>
        </div>

        <p
          style={{
            fontSize: 14,
            color: MUTED,
            margin: "32px auto 0",
            textAlign: "center",
            maxWidth: 720,
            lineHeight: 1.6,
          }}
        >
          Volume larger or smaller than 9,000 calls? Same setup price; per-call
          rate negotiable above 25,000 calls. Contact Ehsan for a custom quote.
        </p>
      </div>
    </section>
  );
}

function PriceLine({
  label,
  amount,
  note,
  accent,
}: {
  label: string;
  amount: string;
  note: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: MUTED,
          fontWeight: 700,
          margin: "0 0 8px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: accent ? GOLD : CHARCOAL,
          margin: "0 0 6px",
          letterSpacing: "-0.015em",
        }}
      >
        {amount}
      </p>
      <p
        style={{
          fontSize: 12,
          color: MUTED,
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {note}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* COMPLIANCE                                                               */
/* ═══════════════════════════════════════════════════════════════════════ */

function Compliance() {
  return (
    <section
      style={{
        padding: "100px 24px",
        background: DARK,
        color: CREAM,
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: 56,
          alignItems: "start",
        }}
        className="compliance-grid"
      >
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: GOLD_LIGHT,
              fontWeight: 700,
              margin: "0 0 18px",
            }}
          >
            § Compliance &amp; trust
          </p>
          <h2
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(32px, 4.5vw, 52px)",
              fontWeight: 400,
              margin: 0,
              letterSpacing: "-0.022em",
              lineHeight: 1.08,
            }}
          >
            Audited by India.{" "}
            <span style={{ color: GOLD_LIGHT }}>Trusted by you.</span>
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ComplianceLine
            label="DPDP Act 2023"
            body="Lawful processing under contract. Data deletion within 30 days post-campaign. Data Protection Officer designated. Right to erasure honoured."
          />
          <ComplianceLine
            label="TRAI / DLT registration"
            body="Caller-ID and consent header registered with one of India's five telecom operators. Every number checked against the national DND registry before dialing."
          />
          <ComplianceLine
            label="Full audit trail"
            body="Every conversation recorded, transcribed, and timestamped. Searchable dashboard. Downloadable in any format your legal team requires."
          />
          <ComplianceLine
            label="Mutual NDA before any data transfer"
            body="Standard legal review. Standard 30-day post-campaign deletion. We don't train models on your data, ever."
          />
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `@media (max-width: 880px) { .compliance-grid { grid-template-columns: 1fr !important; } }`,
        }}
      />
    </section>
  );
}

function ComplianceLine({ label, body }: { label: string; body: string }) {
  return (
    <div
      style={{
        paddingLeft: 24,
        borderLeft: `2px solid ${GOLD_LIGHT}`,
      }}
    >
      <p
        style={{
          fontSize: 14,
          fontWeight: 700,
          margin: "0 0 6px",
          color: CREAM,
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "rgba(250,245,235,0.70)",
          margin: 0,
        }}
      >
        {body}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* FINAL CTA                                                                */
/* ═══════════════════════════════════════════════════════════════════════ */

function FinalCTA() {
  return (
    <section
      style={{
        padding: "140px 24px",
        background: CREAM,
        color: CHARCOAL,
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: RED,
            fontWeight: 700,
            margin: "0 0 22px",
          }}
        >
          § One conversation away
        </p>

        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(46px, 7vw, 92px)",
            fontWeight: 400,
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            margin: "0 0 28px",
          }}
        >
          Your 9,000 leads.
          <br />
          <span style={{ color: GOLD }}>Called next week.</span>
        </h2>

        <p
          style={{
            fontSize: 18,
            color: MUTED,
            lineHeight: 1.6,
            margin: "0 auto 44px",
            maxWidth: 620,
          }}
        >
          30-minute call with Ehsan. No deck, no slides. We look at your lead
          list, agree on languages and offer, and have the campaign live in
          fourteen working days.
        </p>

        <a
          href={WHATSAPP_AGENT}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: CHARCOAL,
            color: CREAM,
            padding: "18px 40px",
            borderRadius: 999,
            fontWeight: 700,
            textDecoration: "none",
            fontSize: 16,
            letterSpacing: "0.04em",
            boxShadow: "0 14px 36px rgba(15,15,15,0.14)",
          }}
        >
          WhatsApp Ehsan · +91 8714318352 →
        </a>

        <p
          style={{
            fontSize: 13,
            color: MUTED,
            margin: "26px 0 0",
            fontStyle: "italic",
          }}
        >
          Or email{" "}
          <a
            href="mailto:ehsansager@gmail.com"
            style={{ color: CHARCOAL, textDecoration: "underline" }}
          >
            ehsansager@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
