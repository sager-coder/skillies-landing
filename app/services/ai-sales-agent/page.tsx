import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";
import AgentLanguageWidget from "@/components/AgentLanguageWidget";

export const metadata = {
  title:
    "Skillies AI Sales Agent — Multilingual sales automation for Indian businesses",
  description:
    "Every old lead called. In their language. Skillies AI Sales Agent runs inbound and outbound sales conversations in Malayalam, Tamil, Kannada, Hindi, and English — for clinics, real estate, jewellery, D2C, hospitality, and any Indian business losing revenue to missed calls and dormant leads. DPDP / TRAI compliant. ₹40 per call.",
  openGraph: {
    title:
      "Skillies AI Sales Agent — Every old lead called. In their language.",
    description:
      "Multilingual AI agent for Indian SMBs. Real estate, healthcare, D2C, retail, hospitality. ₹40 per call. ₹5.1L for 9,000-call campaigns. DPDP/TRAI compliant.",
  },
};

const WHATSAPP_AGENT =
  "https://wa.me/918714318352?text=Hi%20Ehsan%2C%20I%27m%20interested%20in%20the%20Skillies%20AI%20Sales%20Agent.%20My%20business%20is%20";

const DARK = "#0F0F0F";
const CHARCOAL = "#1A1A1A";
const CREAM = "#FAF5EB";
const RED = "#C62828";
const GOLD = "#C9A24E";
const GOLD_LIGHT = "#E6C178";
const MUTED = "#6B7280";
const FOREST = "#1F3A2E";

export default function AISalesAgentPage() {
  return (
    <main style={{ background: DARK, color: "white", position: "relative" }}>
      <TopNav cta={{ href: WHATSAPP_AGENT, label: "Talk to Ehsan" }} />

      {/* Magazine spine — same motif as /services */}
      <div
        aria-hidden
        className="skillies-spine"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 32,
          width: 1,
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(201,162,78,0.0) 6%, rgba(201,162,78,0.18) 14%, rgba(201,162,78,0.28) 50%, rgba(201,162,78,0.18) 86%, rgba(201,162,78,0.0) 96%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <Hero />
      <NotAWhatsAppToolBand />
      <DemoBand />
      <PullQuoteOne />
      <Verticals />
      <PainPoints />
      <PullQuoteTwo />
      <HowItWorks />
      <Pricing />
      <Compliance />
      <FinalCTA />

      <FooterEditorial />
      <WhatsAppButton />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 760px) {
              .skillies-spine { left: 14px !important; }
            }
            @media (max-width: 880px) {
              .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
              .compliance-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
              .stats-grid { grid-template-columns: 1fr !important; }
            }
          `,
        }}
      />
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* HERO                                                                     */
/* ═══════════════════════════════════════════════════════════════════════ */

function Hero() {
  const accents = [
    "5 South Indian + Hindi · native script",
    "₹40 per call · ₹25K/mo inbound",
    "DPDP & TRAI compliant by design",
    "Live in 14 working days",
    "Built in Malappuram",
  ];

  return (
    <section
      style={{
        padding: "150px 24px 100px",
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
            "radial-gradient(ellipse at 15% 20%, rgba(201,162,78,0.12), transparent 50%), radial-gradient(ellipse at 85% 85%, rgba(198,40,40,0.06), transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="hero-grid"
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 72,
          alignItems: "start",
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: GOLD_LIGHT,
              fontWeight: 700,
              margin: "0 0 22px",
            }}
          >
            § Skillies AI Business Lab · Sales Agent
          </p>

          <h1
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(48px, 7.4vw, 100px)",
              fontWeight: 400,
              lineHeight: 0.96,
              letterSpacing: "-0.028em",
              margin: "0 0 30px",
              color: CREAM,
            }}
          >
            Every old lead{" "}
            <span style={{ color: GOLD_LIGHT }}>called.</span>
            <br />
            In their{" "}
            <span style={{ fontStyle: "italic" }}>language.</span>
          </h1>

          <p
            style={{
              fontSize: 19,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.80)",
              maxWidth: 640,
              margin: "0 0 18px",
            }}
          >
            An autonomous voice + chat AI agent that runs inbound and outbound
            sales conversations for your Indian business — in{" "}
            <strong style={{ color: GOLD_LIGHT }}>
              Malayalam, Tamil, Kannada, Hindi, or English
            </strong>
            . The customer&rsquo;s native language, not yours.
          </p>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.62)",
              maxWidth: 640,
              margin: "0 0 36px",
            }}
          >
            For real estate, healthcare, jewellery, D2C, insurance, hospitality,
            and any business where leads die slowly because the phone rings
            after office hours and nobody calls them back.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <a
              href="#demo"
              style={{
                display: "inline-block",
                background: GOLD,
                color: DARK,
                padding: "15px 30px",
                borderRadius: 999,
                fontWeight: 700,
                textDecoration: "none",
                fontSize: 14,
                letterSpacing: "0.04em",
                boxShadow: "0 12px 32px rgba(201,162,78,0.32)",
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
                padding: "14px 28px",
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

        {/* Right rail accents */}
        <ul
          aria-label="At a glance"
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            paddingTop: 30,
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

          {/* Compact stat strip */}
          <li
            style={{
              listStyle: "none",
              marginTop: 36,
              paddingTop: 28,
              borderTop: "1px solid rgba(201,162,78,0.30)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                fontWeight: 700,
                margin: "0 0 10px",
              }}
            >
              Industry benchmarks
            </p>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.78)",
                margin: "0 0 6px",
                lineHeight: 1.45,
              }}
            >
              <strong style={{ color: CREAM }}>62%</strong> of unanswered
              business calls go to a competitor.
            </p>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.78)",
                margin: 0,
                lineHeight: 1.45,
              }}
            >
              <strong style={{ color: CREAM }}>27%+</strong> abandoned-cart
              recovery on voice AI vs 2-4% on SMS.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* NOT-A-WHATSAPP-TOOL DISAMBIGUATION BAND                                 */
/* Catches prospects arriving with WhatsApp-tool mental model              */
/* (AiSensy / WATI / WhatChimp etc.) and reframes the category before      */
/* they anchor on ₹1-3K/mo messaging-tool prices.                          */
/* ═══════════════════════════════════════════════════════════════════════ */

function NotAWhatsAppToolBand() {
  const rows: Array<[string, string, string]> = [
    [
      "What it is",
      "WhatsApp dashboard you operate yourself",
      "AI agent that talks to your customers, in their voice",
    ],
    [
      "Who does the work",
      "Your team logs in, types replies, sends broadcasts",
      "Skillies builds it, deploys it, tunes it. You read the report.",
    ],
    [
      "Voice / phone calls",
      "❌ Text only",
      "✅ Voice + text · 5 language-locked agents",
    ],
    [
      "Multilingual",
      "Translation in inbox; templates only",
      "Real conversations in Malayalam, Tamil, Kannada, Hindi, English",
    ],
    [
      "Outbound to old leads",
      "❌ Bulk broadcast (most go to spam)",
      "✅ Calls every old lead in their language, qualifies, routes",
    ],
    [
      "Setup",
      "Self-serve, sign up in minutes",
      "Managed deploy, 14 working days · DLT registered for you",
    ],
    [
      "Pricing model",
      "₹1-5K/month dashboard + you pay Meta per message",
      "₹40/call (campaigns) or ₹25K/mo (inbound retainer)",
    ],
    [
      "What you're buying",
      "A tool",
      "An outcome",
    ],
  ];

  return (
    <section
      style={{
        padding: "100px 24px",
        background: CREAM,
        color: CHARCOAL,
        borderTop: `1px solid rgba(201,162,78,0.22)`,
        borderBottom: `1px solid rgba(201,162,78,0.22)`,
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
          § Different category
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(38px, 5.6vw, 64px)",
            fontWeight: 400,
            margin: "0 0 22px",
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            maxWidth: 920,
          }}
        >
          Skillies isn&rsquo;t a WhatsApp tool. It&rsquo;s an{" "}
          <span style={{ color: GOLD }}>AI agent</span> that uses WhatsApp.
        </h2>
        <p
          style={{
            fontSize: 18,
            color: MUTED,
            margin: "0 0 48px",
            maxWidth: 760,
            lineHeight: 1.6,
          }}
        >
          If you&rsquo;ve been comparing AiSensy, WATI, Interakt, WhatChimp,
          DoubleTick — those are messaging dashboards. ₹1-3K/month, you
          operate them, you write the messages. Skillies is something different:
          a voice + chat AI that talks to your customers itself, in five Indian
          languages, with no team logging in.
        </p>

        {/* Comparison table — visual emphasis */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(26,26,26,0.10)",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(15,15,15,0.06)",
          }}
        >
          {/* Header */}
          <div
            className="cmp-row cmp-header"
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1.4fr 1.6fr",
              gap: 0,
              borderBottom: `2px solid ${GOLD}`,
            }}
          >
            <div
              style={{
                padding: "20px 28px",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: MUTED,
                background: "rgba(26,26,26,0.03)",
              }}
            >
              Dimension
            </div>
            <div
              style={{
                padding: "20px 24px",
                fontSize: 14,
                fontWeight: 700,
                color: CHARCOAL,
                borderLeft: "1px solid rgba(26,26,26,0.08)",
              }}
            >
              WhatsApp messaging tools
              <br />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: MUTED,
                  letterSpacing: "0.04em",
                }}
              >
                AiSensy · WATI · WhatChimp · Interakt
              </span>
            </div>
            <div
              style={{
                padding: "20px 24px",
                fontSize: 14,
                fontWeight: 700,
                color: GOLD,
                borderLeft: "1px solid rgba(26,26,26,0.08)",
                background: "rgba(201,162,78,0.06)",
              }}
            >
              Skillies AI Sales Agent
              <br />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: MUTED,
                  letterSpacing: "0.04em",
                }}
              >
                Voice + chat · managed · India-native
              </span>
            </div>
          </div>

          {/* Rows */}
          {rows.map(([dim, them, us], i) => (
            <div
              key={dim}
              className="cmp-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 1.4fr 1.6fr",
                gap: 0,
                borderTop: i === 0 ? "none" : "1px solid rgba(26,26,26,0.06)",
              }}
            >
              <div
                style={{
                  padding: "18px 28px",
                  fontSize: 13,
                  fontWeight: 700,
                  color: CHARCOAL,
                  background: "rgba(26,26,26,0.025)",
                  letterSpacing: "0.02em",
                }}
              >
                {dim}
              </div>
              <div
                style={{
                  padding: "18px 24px",
                  fontSize: 14,
                  color: MUTED,
                  borderLeft: "1px solid rgba(26,26,26,0.08)",
                  lineHeight: 1.5,
                }}
              >
                {them}
              </div>
              <div
                style={{
                  padding: "18px 24px",
                  fontSize: 14,
                  color: CHARCOAL,
                  borderLeft: "1px solid rgba(26,26,26,0.08)",
                  background: "rgba(201,162,78,0.04)",
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                {us}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            fontSize: 13,
            color: MUTED,
            margin: "32px auto 0",
            textAlign: "center",
            maxWidth: 720,
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          If you only need to broadcast WhatsApp coupons or run template
          messages, those tools are the right fit. Skillies is for businesses
          that want an AI agent <strong>making the call</strong> — not just
          sending the message.
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `@media (max-width: 760px) {
            .cmp-row { grid-template-columns: 1fr !important; }
            .cmp-row > div {
              border-left: none !important;
              border-top: 1px solid rgba(26,26,26,0.08) !important;
            }
            .cmp-header > div { padding: 14px 20px !important; }
          }`,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* DEMO BAND                                                                */
/* ═══════════════════════════════════════════════════════════════════════ */

function DemoBand() {
  return (
    <section
      id="demo"
      style={{
        padding: "100px 24px 90px",
        background: CREAM,
        color: CHARCOAL,
        borderTop: `1px solid rgba(201,162,78,0.22)`,
        borderBottom: `1px solid rgba(201,162,78,0.22)`,
        position: "relative",
        zIndex: 2,
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
            margin: "0 0 16px",
          }}
        >
          § Live demo · Five language-locked agents
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(38px, 5.8vw, 68px)",
            fontWeight: 400,
            margin: "0 0 16px",
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
          }}
        >
          Hear it in your{" "}
          <span style={{ color: GOLD }}>customer&rsquo;s</span> language.
        </h2>
        <p
          style={{
            fontSize: 18,
            color: MUTED,
            margin: "0 0 44px",
            maxWidth: 720,
            lineHeight: 1.55,
          }}
        >
          Each language has its own dedicated agent — Malayalam-only,
          Tamil-only, Kannada-only, Hindi-only, English-only. No mixing, no
          confusion. Pick a language, click the launcher, and have a real
          90-second conversation about your business.
        </p>

        <AgentLanguageWidget />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* PULL QUOTE 1                                                             */
/* ═══════════════════════════════════════════════════════════════════════ */

function PullQuoteOne() {
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
          <span style={{ color: GOLD_LIGHT }}>
            You need every old lead called.
          </span>
        </p>
        <div
          aria-hidden
          style={{
            margin: "48px auto 0",
            width: 80,
            height: 1,
            background: GOLD_LIGHT,
            opacity: 0.5,
          }}
        />
        <p
          style={{
            marginTop: 22,
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            fontWeight: 700,
          }}
        >
          § Skillies AI Business Lab · Built for Indian SMBs
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* VERTICALS · 10 industry-specific use cases                               */
/* ═══════════════════════════════════════════════════════════════════════ */

function Verticals() {
  const cases = [
    {
      n: "01",
      vertical: "Real estate",
      headline: "Every site-visit lead, called within an hour.",
      body: "Industry baseline lead-to-site-visit conversion is 2-8%. Personalized AI follow-up calls drive 312% increase in confirmed bookings; 65% of weekend no-shows are recoverable with a confirmation call. Your closers only talk to people who actually want to buy.",
      kpi: "65%",
      kpiLabel: "no-show recovery",
    },
    {
      n: "02",
      vertical: "Healthcare · clinics + hospitals",
      headline: "No-shows drop from 22% to 12%.",
      body: "Mid-sized hospital networks with 8,000 OPD/week save ₹40-70 lakh/month by cutting no-shows with 24h + 2h confirmation calls in patient&rsquo;s native language. UPI co-pay collection inline. DPDP-compliant audit trail.",
      kpi: "₹40-70L",
      kpiLabel: "monthly recovery",
    },
    {
      n: "03",
      vertical: "Insurance · life, health, motor",
      headline: "Lapsed-policy reactivation that actually works.",
      body: "5L-policy book with 25% lapse rate. Voice AI in Hindi/regional brings it to 12% — that&rsquo;s ₹100 crore retained annually at ₹15K avg premium. Rural policyholders unreachable in English now reach you in their language.",
      kpi: "₹100 Cr",
      kpiLabel: "retained / yr",
    },
    {
      n: "04",
      vertical: "D2C e-commerce",
      headline: "Abandoned-cart recovery that beats SMS 7x.",
      body: "SMS recovers 2-4% of abandoned carts. Voice AI hits 18-27%. One Indian D2C brand recovered ₹1+ crore across 100K+ calls. The agent calls in the customer&rsquo;s preferred language, confirms intent, sends a fresh checkout link via WhatsApp.",
      kpi: "27%+",
      kpiLabel: "cart recovery",
    },
    {
      n: "05",
      vertical: "BFSI · lending, NBFC, fintech",
      headline: "Collections without the 100% attrition.",
      body: "Indian collections teams turn over 80-120% annually. AI handles routine EMI reminders, KYC follow-ups, status inquiries — at ₹12-25 per resolved contact vs ₹40-120 for humans. Your team focuses on the 5% that actually need human judgement.",
      kpi: "5x",
      kpiLabel: "cost reduction",
    },
    {
      n: "06",
      vertical: "Multi-shop retail · jewellery, apparel, electronics",
      headline: "Festival outreach + customer reactivation.",
      body: "Re-acquired customers spend 30-50% more than first-timers — most SMBs assume the opposite. AI calls every past customer before Akshaya Tritiya, Onam, Dhanteras in their language, books store visits, routes intent to nearest location.",
      kpi: "30-50%",
      kpiLabel: "AOV uplift",
    },
    {
      n: "07",
      vertical: "Automotive · dealerships, service centers",
      headline: "Test-drive bookings + service reminders.",
      body: "Showroom calls miss 40%+ of inquiries during peak. SMS service-reminders get 8% response. AI in Malayalam/Tamil/Hindi books test drives, sends Razorpay deposit links, confirms service appointments. One closed sale (₹6L-40L) pays a year of agent fees.",
      kpi: "1 sale",
      kpiLabel: "= years of ROI",
    },
    {
      n: "08",
      vertical: "Hospitality · resorts, hotels, restaurants",
      headline: "Pre-arrival upsell + booking confirmation.",
      body: "Inbound calls dropped during peak season cost ₹5,000-30,000 per missed booking. AI handles 70-90% of routine inquiries without human assistance, books rooms, upsells spa/transfers, manages cancellation recovery. ₹18,000/mo cost vs ₹50K+ call-center.",
      kpi: "70-90%",
      kpiLabel: "calls automated",
    },
    {
      n: "09",
      vertical: "Beauty · salons, spas, dental, derm",
      headline: "Bookings while you&rsquo;re with clients.",
      body: "Solo and small-team operators miss 40%+ of calls during service hours. Re-bookings drive 60% of revenue — most die on missed calls. AI handles the inbound, books appointments, runs WhatsApp follow-ups in customer&rsquo;s language.",
      kpi: "40%",
      kpiLabel: "rebooking lift",
    },
    {
      n: "10",
      vertical: "Logistics · last-mile, B2B services",
      headline: "Address checks + NDR cut by half.",
      body: "30-40% failed deliveries are recoverable with a morning-of confirmation call in the consignee&rsquo;s native language. Most consignees don&rsquo;t speak Hindi or English fluently. AI calls in Tamil, Malayalam, Kannada — cheaper than re-attempt fees.",
      kpi: "30-40%",
      kpiLabel: "delivery save",
    },
  ];

  return (
    <section
      style={{
        padding: "130px 24px",
        background: CREAM,
        color: CHARCOAL,
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
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
          § Where it earns its keep
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(40px, 6vw, 76px)",
            fontWeight: 400,
            margin: "0 0 30px",
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            maxWidth: 920,
          }}
        >
          Ten Indian businesses where{" "}
          <span style={{ color: GOLD }}>cold leads quietly bleed money.</span>
        </h2>
        <p
          style={{
            fontSize: 18,
            color: MUTED,
            margin: "0 0 64px",
            maxWidth: 760,
            lineHeight: 1.6,
          }}
        >
          The data below is from production deployments across 2025-2026
          benchmarks — Bolna, Gnani, Caller Digital, Convin, Squadstack and
          others operating in India. Skillies&rsquo; positioning is the same
          stack, India-native ops, ₹40 per call.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          {cases.map((c) => (
            <article
              key={c.n}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(26,26,26,0.08)",
                borderRadius: 16,
                padding: "30px 28px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 18,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: GOLD,
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {c.n} · {c.vertical}
                </p>
              </div>

              <h3
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 24,
                  fontWeight: 400,
                  margin: "0 0 14px",
                  color: CHARCOAL,
                  letterSpacing: "-0.012em",
                  lineHeight: 1.18,
                }}
              >
                {c.headline}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: MUTED,
                  margin: "0 0 22px",
                }}
              >
                {c.body}
              </p>
              <div
                style={{
                  paddingTop: 18,
                  borderTop: "1px solid rgba(26,26,26,0.08)",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: 32,
                    fontWeight: 400,
                    color: GOLD,
                    letterSpacing: "-0.015em",
                    lineHeight: 1,
                  }}
                >
                  {c.kpi}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: MUTED,
                    fontWeight: 600,
                  }}
                >
                  {c.kpiLabel}
                </span>
              </div>
            </article>
          ))}
        </div>

        <p
          style={{
            fontSize: 13,
            color: MUTED,
            margin: "48px auto 0",
            textAlign: "center",
            maxWidth: 760,
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          Don&rsquo;t see your vertical? The same agent works for
          legal/professional services, coaching, consulting, FMCG wholesale,
          travel agents, repair services, agriculture supply, pet care, and
          most Indian SMB models. WhatsApp Ehsan with your business — he&rsquo;ll
          tell you whether it fits.
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* PAIN POINTS                                                              */
/* ═══════════════════════════════════════════════════════════════════════ */

function PainPoints() {
  const points = [
    {
      stat: "62%",
      title: "Unanswered calls go to your competitor.",
      body: "Globally, only 37.8% of inbound business calls are answered. 85% of unanswered callers never try again. 62% immediately call a competitor. Indian SMB call-tracking data suggests we&rsquo;re no better. The phone ringing at 8 PM is revenue dying.",
    },
    {
      stat: "35%",
      title: "Customers in their native language buy more.",
      body: "Customers interacting in their mother tongue show 35% higher purchase intent and 40% better brand recall. Tamil voice agents on e-commerce cut sales-cycle length by 58%. Your customer doesn&rsquo;t want English. They want Malayalam. Or Tamil. Or Hindi.",
    },
    {
      stat: "100%",
      title: "Your inside-sales team turns over every year.",
      body: "Indian inside-sales, collections, and NDR teams see 80-120% annual attrition. The entire headcount turns over yearly. Hiring is selective in 2026 — SMBs can&rsquo;t outbid enterprises for telecaller talent. AI doesn&rsquo;t quit, ask for raises, or take leave.",
    },
    {
      stat: "5x",
      title: "Per-call cost is 5x with humans.",
      body: "Human telecallers fully loaded cost ₹40-120 per resolved contact. AI does the same conversation at ₹12-25. The bigger gain isn&rsquo;t cost — it&rsquo;s consistency. Every call follows your script, no telecaller having a bad day, no quality variance killing the funnel.",
    },
    {
      stat: "May 2027",
      title: "DPDP enforcement is real. Build the architecture now.",
      body: "DPDPA Rules notified Nov 2025. Full enforcement May 2027. Tamper-proof consent logs, 1-year audit retention, dual TRAI/DPDPA tracking. RBI requires 2-year complaint-call retention. IRDAI requires recorded insurance sales calls. Human teams cannot produce this consistently. AI does it natively.",
    },
  ];

  return (
    <section
      style={{
        padding: "120px 24px",
        background: DARK,
        color: "white",
        borderTop: "1px solid rgba(201,162,78,0.22)",
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
          § Why this exists
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(40px, 6vw, 76px)",
            fontWeight: 400,
            margin: "0 0 60px",
            color: CREAM,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            maxWidth: 920,
          }}
        >
          Five problems Indian SMBs{" "}
          <span style={{ color: GOLD_LIGHT }}>silently pay for.</span>
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {points.map((p, i) => (
            <div
              key={p.title}
              style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                gap: 36,
                padding: "36px 0",
                borderTop:
                  i === 0
                    ? `1px solid rgba(201,162,78,0.30)`
                    : `1px solid rgba(201,162,78,0.18)`,
                borderBottom:
                  i === points.length - 1
                    ? `1px solid rgba(201,162,78,0.30)`
                    : "none",
              }}
              className="painpoint-row"
            >
              <p
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(48px, 6vw, 80px)",
                  color: GOLD_LIGHT,
                  margin: 0,
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                }}
              >
                {p.stat}
              </p>
              <div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    margin: "0 0 12px",
                    color: CREAM,
                    letterSpacing: "-0.005em",
                    lineHeight: 1.25,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.72)",
                    margin: 0,
                    maxWidth: 720,
                  }}
                >
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `@media (max-width: 760px) {
              .painpoint-row { grid-template-columns: 1fr !important; gap: 14px !important; }
            }`,
          }}
        />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* PULL QUOTE 2                                                             */
/* ═══════════════════════════════════════════════════════════════════════ */

function PullQuoteTwo() {
  return (
    <section
      style={{
        padding: "100px 24px",
        background: CREAM,
        color: CHARCOAL,
        textAlign: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(28px, 4.2vw, 48px)",
            fontWeight: 400,
            color: CHARCOAL,
            lineHeight: 1.25,
            letterSpacing: "-0.018em",
            margin: 0,
          }}
        >
          Re-acquired customers spend{" "}
          <span style={{ color: GOLD }}>30-50% more</span> than first-timers.
          <br />
          Most Indian SMBs assume the opposite.
        </p>
        <p
          style={{
            marginTop: 32,
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: MUTED,
            fontWeight: 700,
          }}
        >
          § The dataset most SMB owners haven&rsquo;t seen
        </p>
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
      t: "Talk to Ehsan",
      b: "30-minute call. We look at your business, your existing leads, the languages you need, your offer. No deck, no slides. We agree on scope and sign.",
    },
    {
      n: "02",
      t: "Compliance setup",
      b: "DLT entity registration with one of India&rsquo;s telecom operators. Caller-ID and consent header registered. DND lookup wired in. ~7 working days. We handle it.",
    },
    {
      n: "03",
      t: "Voice cloning + prompt customization",
      b: "Optional: voice-clone your founder, director, or whoever the brand voice is. Agent prompt customized to your specific offerings, fees, tone. You approve before any call goes out.",
    },
    {
      n: "04",
      t: "Pilot test · 50 calls",
      b: "We run 50 real calls. You listen to recordings. Approve quality. Pilot money-back if quality fails — your real exposure is the ₹1.5L setup, not the campaign.",
    },
    {
      n: "05",
      t: "Full campaign or live inbound",
      b: "Outbound: 1,000-1,500 calls/day until done. Inbound: agent goes live on your WhatsApp / web chat / phone line, 24/7. Hot leads delivered to your team in real time.",
    },
    {
      n: "06",
      t: "Final report + ongoing",
      b: "Every conversation tagged: hot lead / not now / wrong number / DND / voicemail / no-answer. Your team has a prioritized follow-up list. For inbound, we tune the agent monthly based on transcripts.",
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
            letterSpacing: "-0.025em",
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
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
          }}
        >
          Two ways to{" "}
          <span style={{ color: GOLD }}>buy.</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: 24,
          }}
        >
          {/* Plan A · Outbound campaign */}
          <article
            style={{
              background: "#FFFFFF",
              border: `1px solid rgba(201,162,78,0.32)`,
              borderRadius: 16,
              padding: "38px 32px",
              boxShadow: "0 12px 40px rgba(15,15,15,0.06)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 700,
                margin: "0 0 12px",
              }}
            >
              Plan A · Outbound campaign
            </p>
            <h3
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: 28,
                fontWeight: 400,
                margin: "0 0 24px",
                color: CHARCOAL,
                letterSpacing: "-0.015em",
              }}
            >
              For reactivation campaigns &amp; lead lists.
            </h3>

            <PriceLine
              label="Setup (one-time)"
              amount="₹1,50,000"
              note="DLT registration, voice cloning, prompt training, dashboard"
            />
            <PriceLine
              label="Per-call rate"
              amount="₹40 / call"
              note="Telephony + AI + transcription + DND check, all-in"
            />
            <PriceLine
              label="9,000-call campaign"
              amount="₹3,60,000"
              note="₹40 × 9,000 calls"
            />

            <div
              style={{
                marginTop: 28,
                paddingTop: 22,
                borderTop: "1px solid rgba(26,26,26,0.10)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: MUTED,
                  fontWeight: 700,
                  margin: "0 0 6px",
                }}
              >
                Total project (9K calls)
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
                ₹5,10,000
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: MUTED,
                  margin: "6px 0 0",
                }}
              >
                Plus 18% GST. 50% on signing, 50% on go-live.
              </p>
            </div>
          </article>

          {/* Plan B · Inbound retainer */}
          <article
            style={{
              background: CHARCOAL,
              color: CREAM,
              border: `1px solid rgba(201,162,78,0.32)`,
              borderRadius: 16,
              padding: "38px 32px",
              boxShadow: "0 12px 40px rgba(15,15,15,0.18)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: GOLD_LIGHT,
                fontWeight: 700,
                margin: "0 0 12px",
              }}
            >
              Plan B · Inbound retainer
            </p>
            <h3
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: 28,
                fontWeight: 400,
                margin: "0 0 24px",
                color: CREAM,
                letterSpacing: "-0.015em",
              }}
            >
              For 24/7 WhatsApp + web + phone agent.
            </h3>

            <PriceLineDark
              label="Setup (one-time)"
              amount="₹50,000"
              note="Voice cloning, prompt training, WhatsApp/CRM integration"
            />
            <PriceLineDark
              label="Monthly retainer"
              amount="₹25,000 / mo"
              note="Up to 1,500 conversations · ₹4 / extra"
            />
            <PriceLineDark
              label="Larger volumes"
              amount="₹40K-₹1L+ / mo"
              note="Growth and Scale tiers, see plan ladder"
            />

            <div
              style={{
                marginTop: 28,
                paddingTop: 22,
                borderTop: "1px solid rgba(250,245,235,0.18)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(250,245,235,0.6)",
                  fontWeight: 700,
                  margin: "0 0 6px",
                }}
              >
                Year 1 (Starter)
              </p>
              <p
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  margin: 0,
                  color: GOLD_LIGHT,
                  letterSpacing: "-0.015em",
                }}
              >
                ₹3,50,000
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(250,245,235,0.6)",
                  margin: "6px 0 0",
                }}
              >
                Setup + 12 months of retainer. Plus GST.
              </p>
            </div>
          </article>
        </div>

        <p
          style={{
            fontSize: 14,
            color: MUTED,
            margin: "44px auto 0",
            textAlign: "center",
            maxWidth: 760,
            lineHeight: 1.6,
          }}
        >
          For volumes &gt; 25,000 calls/month or multi-location enterprise
          deployments — custom pricing. Talk to Ehsan.
        </p>
      </div>
    </section>
  );
}

function PriceLine({
  label,
  amount,
  note,
}: {
  label: string;
  amount: string;
  note: string;
}) {
  return (
    <div
      style={{
        marginBottom: 18,
        paddingBottom: 16,
        borderBottom: "1px solid rgba(26,26,26,0.06)",
      }}
    >
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: MUTED,
          fontWeight: 700,
          margin: "0 0 4px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: CHARCOAL,
          margin: "0 0 4px",
          letterSpacing: "-0.01em",
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

function PriceLineDark({
  label,
  amount,
  note,
}: {
  label: string;
  amount: string;
  note: string;
}) {
  return (
    <div
      style={{
        marginBottom: 18,
        paddingBottom: 16,
        borderBottom: "1px solid rgba(250,245,235,0.10)",
      }}
    >
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "rgba(250,245,235,0.55)",
          fontWeight: 700,
          margin: "0 0 4px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: CREAM,
          margin: "0 0 4px",
          letterSpacing: "-0.01em",
        }}
      >
        {amount}
      </p>
      <p
        style={{
          fontSize: 12,
          color: "rgba(250,245,235,0.55)",
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
        className="compliance-grid"
        style={{
          maxWidth: 980,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: 56,
          alignItems: "start",
        }}
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
            India-native by{" "}
            <span style={{ color: GOLD_LIGHT }}>design.</span>
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ComplianceLine
            label="DPDP Act 2023 · enforcement May 2027"
            body="Lawful processing under contract. Data deletion within 30 days post-campaign. Tamper-proof consent logs. 1-year audit-trail retention. Right to erasure honoured. Architecture built for the May 2027 deadline."
          />
          <ComplianceLine
            label="TRAI / DLT registered"
            body="Caller-ID and consent header registered with one of India&rsquo;s five telecom operators. Every number checked against the national DND registry before dialing. Sector-specific overlays (RBI, IRDAI) handled per vertical."
          />
          <ComplianceLine
            label="Full audit trail · every conversation"
            body="Every call recorded, transcribed, timestamped. Searchable dashboard with structured tags. Downloadable in any format your legal team requires. RBI 2-year, IRDAI 6-month, CERT-In 180-day retention all met."
          />
          <ComplianceLine
            label="Mutual NDA before any data transfer"
            body="Standard legal review. Standard 30-day post-campaign deletion. We don&rsquo;t train models on your data, ever. Optional clauses for sectors with strict data residency requirements."
          />
        </div>
      </div>
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
          lineHeight: 1.65,
          color: "rgba(250,245,235,0.72)",
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
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
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
            fontSize: "clamp(46px, 7vw, 96px)",
            fontWeight: 400,
            lineHeight: 0.98,
            letterSpacing: "-0.028em",
            margin: "0 0 28px",
          }}
        >
          Your customers.
          <br />
          <span style={{ color: GOLD }}>Their language.</span>
          <br />
          Live next week.
        </h2>

        <p
          style={{
            fontSize: 18,
            color: MUTED,
            lineHeight: 1.6,
            margin: "0 auto 44px",
            maxWidth: 640,
          }}
        >
          30-minute call with Ehsan. No deck. We look at your business, your
          leads, your offer — and have your agent live within fourteen working
          days. WhatsApp him directly.
        </p>

        <a
          href={WHATSAPP_AGENT}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: CHARCOAL,
            color: CREAM,
            padding: "18px 44px",
            borderRadius: 999,
            fontWeight: 700,
            textDecoration: "none",
            fontSize: 16,
            letterSpacing: "0.04em",
            boxShadow: "0 16px 40px rgba(15,15,15,0.16)",
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
