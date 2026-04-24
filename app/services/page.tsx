import Link from "next/link";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title:
    "Skillies AI Business Lab — Practical AI systems for Kerala businesses",
  description:
    "Your leads don't disappear. Your WhatsApp replies are fast. Your calls get answered. Your follow-ups happen. You get a daily report of what actually happened in your business today. Malayalam-first, DPDP-compliant AI systems from Skillies — built in Malappuram for Kerala MSMEs.",
  openGraph: {
    title:
      "Skillies AI Business Lab — Practical AI systems for Kerala businesses",
    description:
      "AI Front Desk for clinics, tuition centres, resorts, real estate, retail and more. Malayalam-first. DPDP-compliant. Built in Malappuram.",
  },
};

// CTA hrefs
const WHATSAPP_AUDIT =
  "https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%20want%20to%20book%20the%20Skillies%20AI%20Business%20Audit%20for%20my%20business.%20My%20business%20is%20";
const WHATSAPP_FRONTDESK =
  "https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20interested%20in%20the%20Skillies%20AI%20Front%20Desk.%20My%20business%20is%20";
const WHATSAPP_GENERIC =
  "https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20interested%20in%20Skillies%20AI%20services%20for%20my%20business.%20My%20business%20is%20";

// Brand palette
const DARK = "#0F0F0F";
const CHARCOAL = "#1A1A1A";
const CREAM = "#FAF5EB";
const RED = "#C62828";
const GOLD = "#C9A24E";
const GOLD_LIGHT = "#E6C178";
const FOREST = "#3D5A3D";
const MUTED = "#6B7280";

export default function ServicesPage() {
  return (
    <main style={{ background: DARK, color: "white" }}>
      <TopNav cta={{ href: WHATSAPP_AUDIT, label: "Book the Audit" }} />

      <Hero />
      <Wedge />
      <FrontDesk />
      <SevenServices />
      <IndustryPacks />
      <NinetyDayPlan />
      <WhySkillies />
      <Compliance />
      <Pricing />
      <FAQ />
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
  return (
    <section
      style={{
        position: "relative",
        padding: "140px 24px 100px",
        background: `radial-gradient(ellipse at 12% 22%, rgba(198,40,40,0.18), transparent 55%), radial-gradient(ellipse at 88% 78%, rgba(230,193,120,0.16), transparent 55%), ${DARK}`,
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 36,
            fontSize: 11,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            flexWrap: "wrap",
          }}
        >
          <span style={{ width: 44, height: 1, background: GOLD_LIGHT }} />
          <span>§ Skillies AI Business Lab</span>
          <span
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)", minWidth: 30 }}
          />
          <span>Malayalam-first · Malappuram</span>
        </div>

        <h1
          style={{
            margin: 0,
            fontWeight: 900,
            fontSize: "clamp(46px, 6.2vw, 92px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.96,
            color: "white",
            maxWidth: 1000,
          }}
        >
          Practical AI systems for{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontStyle: "italic",
              color: GOLD_LIGHT,
            }}
          >
            Kerala businesses.
          </em>
        </h1>

        <p
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.75)",
            maxWidth: 760,
            margin: "32px 0 20px",
            lineHeight: 1.6,
          }}
        >
          Your leads don&rsquo;t disappear. Your WhatsApp replies are fast. Your
          calls get answered. Your follow-ups happen on time. Your staff has
          systems. And you get a clean daily report of what actually happened
          in your business today.
        </p>

        <p
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: 24,
            color: GOLD_LIGHT,
            margin: "0 0 44px",
            lineHeight: 1.35,
            maxWidth: 760,
          }}
        >
          Kerala businesses need AI. They don&rsquo;t need confusion.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href={WHATSAPP_AUDIT}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "20px 36px",
              background: RED,
              color: "white",
              textDecoration: "none",
              borderRadius: 999,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: "0.02em",
              boxShadow: "0 20px 44px rgba(198,40,40,0.34)",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            Book your AI Business Audit · ₹4,999
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 8l4 4-4 4M3 12h18" />
            </svg>
          </a>
          <Link
            href="#front-desk"
            style={{
              padding: "20px 30px",
              background: "transparent",
              color: "white",
              textDecoration: "none",
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              border: "1.5px solid rgba(255,255,255,0.22)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            See the AI Front Desk →
          </Link>
        </div>

        {/* Trust row */}
        <div
          style={{
            marginTop: 56,
            padding: "22px 26px",
            borderRadius: 18,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
          className="skillies-services-trust"
        >
          {[
            { n: "Malayalam-first", l: "not generic ChatGPT English" },
            { n: "DPDP 2025", l: "compliant by default" },
            { n: "Outcome-backed", l: "before/after numbers" },
            { n: "Built in Kerala", l: "Malappuram → statewide" },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                borderLeft:
                  i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                paddingLeft: i === 0 ? 0 : 18,
              }}
            >
              <p
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 24,
                  fontWeight: 400,
                  color: "white",
                  margin: "0 0 4px",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.1,
                }}
              >
                {t.n}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  margin: 0,
                  letterSpacing: "0.02em",
                  lineHeight: 1.45,
                }}
              >
                {t.l}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 860px) {
              .skillies-services-trust {
                grid-template-columns: 1fr 1fr !important;
                gap: 14px !important;
              }
              .skillies-services-trust > div {
                border-left: none !important;
                padding-left: 0 !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* WEDGE — the sharpest positioning statement on the page                  */
/* ═══════════════════════════════════════════════════════════════════════ */

function Wedge() {
  return (
    <section
      style={{
        padding: "120px 24px",
        background: CREAM,
        color: CHARCOAL,
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: RED,
            fontWeight: 700,
            margin: "0 0 20px",
          }}
        >
          § The wedge
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.8vw, 80px)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.02,
            margin: "0 0 36px",
            color: CHARCOAL,
          }}
        >
          Your business doesn&rsquo;t need AI tools.
          <br />
          It needs{" "}
          <em style={{ fontStyle: "italic", color: RED }}>
            an AI front desk.
          </em>
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 36,
            marginTop: 48,
          }}
          className="skillies-wedge-grid"
        >
          <div>
            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#9CA3AF",
                fontWeight: 700,
                margin: "0 0 16px",
              }}
            >
              What agencies sell
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontSize: 15.5,
                color: "#9CA3AF",
                lineHeight: 1.55,
                textDecoration: "line-through",
                textDecorationColor: "rgba(156,163,175,0.4)",
              }}
            >
              <li>&ldquo;LLM-powered workflow automation&rdquo;</li>
              <li>&ldquo;Custom GPT + API integration&rdquo;</li>
              <li>&ldquo;AI transformation consulting&rdquo;</li>
              <li>&ldquo;End-to-end MLOps pipeline&rdquo;</li>
              <li>&ldquo;Enterprise-grade AI stack&rdquo;</li>
            </ul>
          </div>
          <div>
            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: RED,
                fontWeight: 700,
                margin: "0 0 16px",
              }}
            >
              What the owner actually needs
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontSize: 15.5,
                color: CHARCOAL,
                lineHeight: 1.55,
              }}
            >
              <li>&ldquo;My WhatsApp leads don&rsquo;t get missed.&rdquo;</li>
              <li>&ldquo;My phone gets answered even after 8pm.&rdquo;</li>
              <li>&ldquo;Every enquiry gets a follow-up in 2 days.&rdquo;</li>
              <li>&ldquo;My staff stops asking me the same 20 things.&rdquo;</li>
              <li>&ldquo;Every morning I see what happened yesterday.&rdquo;</li>
            </ul>
          </div>
        </div>

        <p
          style={{
            marginTop: 48,
            fontSize: 17,
            color: "#4B5563",
            lineHeight: 1.65,
            maxWidth: 780,
          }}
        >
          Most Kerala businesses already have the customers. What they&rsquo;re
          missing is a system that doesn&rsquo;t drop them. Skillies installs
          that system — the AI front desk — and trains your team to run it.
          You don&rsquo;t have to understand the tech. You just have to read
          the daily report.
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 760px) {
              .skillies-wedge-grid {
                grid-template-columns: 1fr !important;
                gap: 32px !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* AI FRONT DESK — the flagship offer                                      */
/* ═══════════════════════════════════════════════════════════════════════ */

function FrontDesk() {
  const inside = [
    "WhatsApp AI Assistant · answers FAQs, captures leads, books appointments",
    "AI Voice Receptionist · missed-call recovery, after-hours call handling",
    "CRM or Google Sheet · every enquiry logged and assigned automatically",
    "Automatic follow-ups · reminders, check-ins, quotation chasers",
    "Google review request engine · sent to happy customers on auto-pilot",
    "Daily owner report · one clean summary on WhatsApp every morning",
    "Staff SOP bot · the standard answers your team should know, in one place",
    "Full DPDP 2025 compliance · consent, opt-in, human handoff, data deletion",
  ];
  const bestFor = [
    "Clinics · dental · aesthetics · ayurveda · diagnostics",
    "Tuition centres · coaching · study abroad · schools",
    "Hotels · homestays · resorts · houseboats · tour operators",
    "Real estate agents · builders · interior designers",
    "Salons · spas · gyms · fitness studios",
    "Restaurants · cafés · bakeries · boutiques · retail shops",
  ];
  return (
    <section
      id="front-desk"
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
            "radial-gradient(ellipse at 80% 10%, rgba(230,193,120,0.1), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
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
          § Flagship offer
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(42px, 5.8vw, 80px)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.02,
            margin: "0 0 24px",
            maxWidth: 960,
          }}
        >
          The{" "}
          <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>
            AI Front Desk
          </em>{" "}
          — a complete upgrade for one flat price.
        </h2>
        <p
          style={{
            fontSize: 19,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 780,
            lineHeight: 1.65,
            margin: "0 0 64px",
          }}
        >
          WhatsApp, calls, leads, bookings, follow-ups, reviews, staff SOPs,
          and a daily owner report — all connected, all Malayalam-aware, all
          compliant. The simplest way to stop bleeding business in 2026.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 40,
          }}
          className="skillies-frontdesk-grid"
        >
          {/* LEFT — what's inside */}
          <div
            style={{
              padding: "38px 36px",
              borderRadius: 24,
              background: "rgba(230,193,120,0.04)",
              border: "1px solid rgba(230,193,120,0.25)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: GOLD_LIGHT,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              }}
            />
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: GOLD_LIGHT,
                fontWeight: 700,
                margin: "0 0 18px",
              }}
            >
              What&rsquo;s inside · 8 systems, 1 install
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {inside.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    fontSize: 15.5,
                    color: "rgba(255,255,255,0.9)",
                    lineHeight: 1.55,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontStyle: "italic",
                      fontSize: 22,
                      color: GOLD_LIGHT,
                      width: 28,
                      lineHeight: 1,
                      paddingTop: 2,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — best for + pricing + CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                padding: "28px 30px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                  fontWeight: 700,
                  margin: "0 0 14px",
                }}
              >
                Best for
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {bestFor.map((b, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.75)",
                      lineHeight: 1.5,
                      paddingLeft: 16,
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 9,
                        width: 8,
                        height: 1,
                        background: GOLD_LIGHT,
                      }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                padding: "28px 30px",
                borderRadius: 20,
                background: `linear-gradient(135deg, rgba(198,40,40,0.12), rgba(198,40,40,0.04))`,
                border: "1px solid rgba(198,40,40,0.3)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#EF6B6B",
                  fontWeight: 700,
                  margin: "0 0 8px",
                }}
              >
                Investment
              </p>
              <p
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 44,
                  fontWeight: 400,
                  color: "white",
                  margin: "0 0 4px",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
              >
                ₹75,000 setup
              </p>
              <p
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.7)",
                  margin: "0 0 14px",
                }}
              >
                + ₹15,000/month support (cancel any month)
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.55)",
                  fontStyle: "italic",
                  fontFamily: "'Instrument Serif', serif",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                30-day pilot. Not working for your business after 30 days?
                Pause without penalty — no questions.
              </p>
            </div>

            <a
              href={WHATSAPP_FRONTDESK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "20px 28px",
                background: RED,
                color: "white",
                textDecoration: "none",
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.02em",
                boxShadow: "0 20px 44px rgba(198,40,40,0.32)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                textAlign: "center",
              }}
            >
              Start the Front Desk conversation
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 8l4 4-4 4M3 12h18" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 960px) {
              .skillies-frontdesk-grid {
                grid-template-columns: 1fr !important;
                gap: 28px !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* 7 CORE SERVICES                                                         */
/* ═══════════════════════════════════════════════════════════════════════ */

type Svc = {
  n: string;
  name: string;
  kind: string;
  owner: string;
  bestFor: string;
  price: string;
  accent: string;
};

const SERVICES: Svc[] = [
  {
    n: "01",
    name: "AI Business Audit",
    kind: "Start here",
    owner:
      "We study your business end-to-end, find where leads are leaking, where time is wasted, where staff is stuck, and hand you a 30-day AI implementation roadmap.",
    bestFor: "Every business · the trust-builder before any big install",
    price: "₹4,999 quick · ₹14,999 detailed",
    accent: RED,
  },
  {
    n: "02",
    name: "WhatsApp AI Lead Assistant",
    kind: "Flagship standalone",
    owner:
      "Your WhatsApp stops being chaos. It answers FAQs, qualifies leads, sends packages, books appointments, chases follow-ups, and puts everything into your CRM automatically.",
    bestFor:
      "Clinics · salons · coaching centres · real estate · resorts · retail · service businesses",
    price: "₹30,000 – ₹90,000 setup · ₹7,500 – ₹25,000/mo",
    accent: GOLD,
  },
  {
    n: "03",
    name: "AI Voice Receptionist",
    kind: "Premium",
    owner:
      "Missed calls become zero. The AI answers in Malayalam or English, explains timings and services, collects details, books appointments, and escalates urgent cases to a human.",
    bestFor:
      "Clinics · hospitals · ayurveda centres · car service · schools · real estate · travel",
    price: "₹50,000 – ₹2,00,000 setup · ₹15,000 – ₹75,000/mo",
    accent: GOLD_LIGHT,
  },
  {
    n: "04",
    name: "AI CRM + Follow-Up Autopilot",
    kind: "Revenue defender",
    owner:
      "Every lead — from Instagram, ads, WhatsApp, calls, website — gets captured, assigned, reminded, and followed up automatically. You see conversions, drop-offs, and ROI in one dashboard.",
    bestFor:
      "Real estate · builders · interior designers · education institutes · B2B services · high-ticket retail",
    price: "₹50,000 – ₹2,50,000 setup · ₹10,000 – ₹50,000/mo",
    accent: FOREST,
  },
  {
    n: "05",
    name: "AI Local Growth Engine",
    kind: "Visibility + trust",
    owner:
      "Google Business Profile tuned, review requests automated, local search pages published, WhatsApp lead capture live, and a monthly performance report that&rsquo;s actually readable.",
    bestFor:
      "Restaurants · clinics · salons · boutiques · gyms · homestays · event businesses",
    price: "₹20,000 – ₹75,000 setup · ₹10,000 – ₹50,000/mo",
    accent: RED,
  },
  {
    n: "06",
    name: "AI Content Engine",
    kind: "Malayalam · Manglish · English",
    owner:
      "Not &ldquo;ChatGPT English captions.&rdquo; Real Malayalam hooks. Manglish tones. Gulf Malayali voice. Malabar voice. Kochi youth voice. Festival campaigns. Reels scripts. WhatsApp broadcasts. All approved before publishing.",
    bestFor:
      "Restaurants · coaches · teachers · clinics · ayurveda · boutiques · jewellery · creators",
    price: "₹15,000 – ₹60,000/mo (no setup)",
    accent: GOLD,
  },
  {
    n: "07",
    name: "Appointment + Reminder + Payment Automation",
    kind: "Operations",
    owner:
      "Customers book themselves. Calendars sync. Reminders go out. Payment links send. No-shows get followed up. Post-service, a review request lands on WhatsApp. All of it, automatic.",
    bestFor:
      "Clinics · salons · spas · ayurveda · tuition · consultants · fitness · photographers",
    price: "₹20,000 – ₹80,000 setup · ₹5,000 – ₹25,000/mo",
    accent: GOLD_LIGHT,
  },
];

function SevenServices() {
  return (
    <section
      style={{
        padding: "120px 24px",
        background: CREAM,
        color: CHARCOAL,
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
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
          § What&rsquo;s inside the Front Desk
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.5vw, 72px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 22px",
            color: CHARCOAL,
            maxWidth: 900,
          }}
        >
          Seven systems we install.{" "}
          <em style={{ fontStyle: "italic", color: RED }}>
            Pick one, pick all.
          </em>
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "#4B5563",
            maxWidth: 720,
            lineHeight: 1.65,
            margin: "0 0 56px",
          }}
        >
          Start with the Audit — that&rsquo;s the trust-builder. Then we
          install whatever the audit says matters most for your business.
          Most clients start with two or three and scale from there.
        </p>

        <div
          className="skillies-services-list"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {SERVICES.map((s) => (
            <article
              key={s.n}
              style={{
                padding: "32px 32px 32px 40px",
                borderRadius: 20,
                background: "white",
                border: "1px solid rgba(26,26,26,0.08)",
                boxShadow: "0 20px 48px rgba(0,0,0,0.03)",
                position: "relative",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "1fr 0.6fr",
                gap: 32,
                alignItems: "start",
              }}
              className="skillies-service-card"
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 5,
                  height: "100%",
                  background: s.accent,
                }}
              />
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 16,
                    marginBottom: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontSize: 28,
                      fontStyle: "italic",
                      color: s.accent,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.n}
                  </span>
                  <h3
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: CHARCOAL,
                      letterSpacing: "-0.01em",
                      margin: 0,
                    }}
                  >
                    {s.name}
                  </h3>
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: s.accent,
                      fontWeight: 700,
                      padding: "5px 12px",
                      borderRadius: 999,
                      background: `${s.accent}15`,
                    }}
                  >
                    {s.kind}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 15.5,
                    color: "#374151",
                    lineHeight: 1.65,
                    margin: "0 0 14px",
                  }}
                  dangerouslySetInnerHTML={{ __html: s.owner }}
                />
                <p
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  <span style={{ fontWeight: 700, color: s.accent }}>
                    Best for ·
                  </span>{" "}
                  {s.bestFor}
                </p>
              </div>
              <div
                style={{
                  padding: "20px 22px",
                  borderRadius: 14,
                  background: "#FAF5EB",
                  border: "1px dashed rgba(26,26,26,0.14)",
                  alignSelf: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "#9CA3AF",
                    fontWeight: 700,
                    margin: "0 0 8px",
                  }}
                >
                  Investment
                </p>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: CHARCOAL,
                    lineHeight: 1.45,
                    margin: 0,
                  }}
                >
                  {s.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 860px) {
              .skillies-service-card {
                grid-template-columns: 1fr !important;
                gap: 20px !important;
                padding: 28px 24px 28px 32px !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* INDUSTRY PACKS                                                          */
/* ═══════════════════════════════════════════════════════════════════════ */

type Pack = {
  name: string;
  tagline: string;
  inside: string[];
  accent: string;
};

const PACKS: Pack[] = [
  {
    name: "Clinic AI Pack",
    tagline: "Dental · aesthetics · ayurveda · diagnostics · specialty clinics",
    inside: [
      "AI receptionist + WhatsApp appointment bot",
      "Patient enquiry forms · treatment FAQs",
      "Lab report notification workflow",
      "Review request + missed-call recovery",
      "Daily front-desk report to the owner",
    ],
    accent: RED,
  },
  {
    name: "Tourism AI Concierge",
    tagline: "Hotels · homestays · resorts · houseboats · tour operators",
    inside: [
      "Guest FAQ bot · multilingual replies",
      "Room/package enquiry + itinerary generator",
      "Airport pickup + booking follow-up",
      "Review request · upsell messages",
      "Daily booking-enquiry report",
    ],
    accent: GOLD,
  },
  {
    name: "Education Institute AI Pack",
    tagline: "Tuition · coaching · study-abroad · schools · skill institutes",
    inside: [
      "Admission enquiry + course recommendation bot",
      "Fee reminder automation",
      "Parent FAQ + announcement broadcasts",
      "Teacher lesson-plan + worksheet assistant",
      "Admissions CRM with full lead lifecycle",
    ],
    accent: GOLD_LIGHT,
  },
  {
    name: "Real Estate AI Pack",
    tagline: "Brokers · builders · interior designers · NRI buyer desks",
    inside: [
      "Property enquiry + budget/location qualifier",
      "Site-visit booking · WhatsApp brochure sender",
      "AI-written property descriptions",
      "NRI buyer follow-up across time zones",
      "Lead scoring + owner dashboard",
    ],
    accent: FOREST,
  },
  {
    name: "Retail + Restaurant AI Pack",
    tagline: "Restaurants · cafés · bakeries · boutiques · jewellery · electronics",
    inside: [
      "Menu / catalog WhatsApp bot",
      "Offer broadcast + festival campaigns",
      "Product FAQ + order enquiry flow",
      "Instagram content engine",
      "Customer reactivation messages",
    ],
    accent: RED,
  },
  {
    name: "Ayurveda + Wellness AI Pack",
    tagline: "Ayurveda hospitals · wellness resorts · yoga retreats · spas",
    inside: [
      "Treatment package explainer · multilingual",
      "Guest intake forms · stay & package follow-up",
      "Doctor consultation booking",
      "Pre-arrival checklist + review request",
      "Trust-building content engine",
    ],
    accent: GOLD,
  },
  {
    name: "MSME + Manufacturing AI Pack",
    tagline: "Food processing · textiles · furniture · exporters · traditional industries",
    inside: [
      "Product catalog + quotation generator",
      "Distributor enquiry + B2B email assistant",
      "Export enquiry response",
      "Invoice / PO extraction",
      "Sales dashboard for the owner",
    ],
    accent: GOLD_LIGHT,
  },
  {
    name: "NRI Business Desk",
    tagline: "Kerala businesses that serve the diaspora — Gulf, UK, US, Canada",
    inside: [
      "NRI enquiry handling across time zones",
      "Document checklist automation",
      "Family-business reporting",
      "Malayalam ↔ English communication",
      "Secure follow-up (no legal/tax/visa advice)",
    ],
    accent: FOREST,
  },
];

function IndustryPacks() {
  return (
    <section
      style={{
        padding: "120px 24px",
        background: DARK,
        color: "white",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: GOLD_LIGHT,
            fontWeight: 700,
            margin: "0 0 16px",
          }}
        >
          § Industry packs
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.5vw, 72px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 22px",
            maxWidth: 900,
          }}
        >
          Pre-built for the{" "}
          <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>
            sectors that matter in Kerala.
          </em>
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.62)",
            maxWidth: 720,
            lineHeight: 1.65,
            margin: "0 0 56px",
          }}
        >
          Each pack is the Front Desk, but tuned for your industry&rsquo;s
          actual workflow — the questions your customers ask, the language
          they use, the compliance you need, the follow-up rhythm that
          converts.
        </p>

        <div
          className="skillies-packs-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          {PACKS.map((p) => (
            <article
              key={p.name}
              style={{
                padding: "30px 28px 32px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 2,
                  background: p.accent,
                  marginBottom: 18,
                }}
              />
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: "white",
                  margin: "0 0 6px",
                }}
              >
                {p.name}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.5,
                  margin: "0 0 18px",
                  fontStyle: "italic",
                  fontFamily: "'Instrument Serif', serif",
                }}
              >
                {p.tagline}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {p.inside.map((i, j) => (
                  <li
                    key={j}
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.78)",
                      lineHeight: 1.55,
                      paddingLeft: 18,
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 9,
                        width: 8,
                        height: 1,
                        background: p.accent,
                      }}
                    />
                    {i}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p
          style={{
            marginTop: 40,
            fontSize: 14,
            color: "rgba(255,255,255,0.5)",
            fontStyle: "italic",
            fontFamily: "'Instrument Serif', serif",
            textAlign: "center",
          }}
        >
          Also available · Professional Office pack (CA · legal · consultants)
          and Staff SOP + Internal Knowledge Bot. Ask on the call.
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 860px) {
              .skillies-packs-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* 90-DAY PLAN                                                             */
/* ═══════════════════════════════════════════════════════════════════════ */

function NinetyDayPlan() {
  const phases = [
    {
      span: "Days 1–15",
      title: "The Audit",
      body: "We sit with you (in person or Loom) for 90 minutes. We study how leads come in, how calls are handled, where drops happen, what staff actually do all day. You get a written roadmap and a recommendation — maybe small, maybe big.",
      out: "Written 30-day roadmap",
    },
    {
      span: "Days 16–45",
      title: "The Install",
      body: "We build your AI Front Desk (or whichever pieces you approved). We connect it to your existing WhatsApp, your CRM or Google Sheet, your calendar, your staff. We train your team — in Malayalam if that&rsquo;s how your team talks.",
      out: "Live Front Desk + trained staff",
    },
    {
      span: "Days 46–90",
      title: "The Proof",
      body: "We run the system alongside you. We refine with real data. At day 90 we sit again with hard numbers — leads recovered, hours saved, reviews collected, revenue moved — and decide what to scale next.",
      out: "Before / after receipts",
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
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
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
          § How it works
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.5vw, 72px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 22px",
            color: CHARCOAL,
            maxWidth: 900,
          }}
        >
          90 days from first call{" "}
          <em style={{ fontStyle: "italic", color: RED }}>
            to written proof.
          </em>
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "#4B5563",
            maxWidth: 720,
            lineHeight: 1.65,
            margin: "0 0 56px",
          }}
        >
          No 6-week discovery. No SOW theatre. Three phases, predictable
          dates, and at day 90 we hand you receipts — not slides.
        </p>

        <div
          className="skillies-plan-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {phases.map((p, i) => (
            <div
              key={i}
              style={{
                padding: "30px 28px 32px",
                borderRadius: 18,
                background: "white",
                border: "1px solid rgba(26,26,26,0.08)",
                boxShadow: "0 18px 44px rgba(0,0,0,0.03)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 28,
                  right: 28,
                  height: 3,
                  background: GOLD,
                  borderRadius: 999,
                }}
              />
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: GOLD,
                  fontWeight: 700,
                  margin: "14px 0 8px",
                }}
              >
                {p.span}
              </p>
              <h3
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 32,
                  fontWeight: 400,
                  letterSpacing: "-0.015em",
                  color: CHARCOAL,
                  margin: "0 0 14px",
                  lineHeight: 1.1,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: 14.5,
                  color: "#4B5563",
                  lineHeight: 1.65,
                  margin: "0 0 18px",
                }}
                dangerouslySetInnerHTML={{ __html: p.body }}
              />
              <p
                style={{
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: RED,
                  fontWeight: 700,
                  margin: 0,
                  paddingTop: 14,
                  borderTop: "1px dashed rgba(26,26,26,0.14)",
                }}
              >
                Deliverable · {p.out}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 860px) {
              .skillies-plan-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* WHY SKILLIES · 5 differentiators                                        */
/* ═══════════════════════════════════════════════════════════════════════ */

function WhySkillies() {
  const reasons = [
    {
      n: "01",
      title: "Malayalam-first",
      body: "Your customers don&rsquo;t type &ldquo;Hello sir, may I know your availability.&rsquo;&rdquo; They type &ldquo;vilayilla?&rdquo; We build for that.",
    },
    {
      n: "02",
      title: "Business-first, not tech-first",
      body: "We don&rsquo;t sell you LLMs. We sell you fewer missed leads, faster replies, a daily report. You won&rsquo;t hear the word &ldquo;API&rdquo; unless you ask.",
    },
    {
      n: "03",
      title: "Proof-first",
      body: "We built our own business this way — 63 books, ₹1,16,000/mo passive. We install the same rigor in yours. Numbers before theatre.",
    },
    {
      n: "04",
      title: "DPDP-compliant by default",
      body: "India&rsquo;s DPDP Rules 2025 are live. Every Skillies install ships with consent, opt-in, human handoff, and data-deletion — day one.",
    },
    {
      n: "05",
      title: "Locally trusted",
      body: "We&rsquo;re in Malappuram. We can drive to Kozhikode, Kochi, Thrissur, Trivandrum. On-site audits, on-site training, on-site hand-off.",
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
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: GOLD_LIGHT,
            fontWeight: 700,
            margin: "0 0 16px",
          }}
        >
          § Why Skillies
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.5vw, 72px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 22px",
            maxWidth: 900,
          }}
        >
          Kerala has agencies.{" "}
          <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>
            It has one Skillies.
          </em>
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.62)",
            maxWidth: 720,
            lineHeight: 1.65,
            margin: "0 0 56px",
          }}
        >
          Plenty of shops will sell you &ldquo;AI automation.&rdquo; Very few
          will sell you the outcome, in your language, with compliance built
          in, and proof at the end.
        </p>

        <div
          className="skillies-reasons-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 18,
          }}
        >
          {reasons.map((r) => (
            <div
              key={r.n}
              style={{
                padding: "26px 22px 28px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 32,
                  color: GOLD_LIGHT,
                  margin: "0 0 10px",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {r.n}
              </p>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "white",
                  margin: "0 0 10px",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.25,
                }}
              >
                {r.title}
              </h3>
              <p
                style={{
                  fontSize: 13.5,
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
                dangerouslySetInnerHTML={{ __html: r.body }}
              />
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 1100px) {
              .skillies-reasons-grid {
                grid-template-columns: 1fr 1fr 1fr !important;
              }
            }
            @media (max-width: 720px) {
              .skillies-reasons-grid {
                grid-template-columns: 1fr 1fr !important;
              }
            }
            @media (max-width: 480px) {
              .skillies-reasons-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* COMPLIANCE PANEL                                                        */
/* ═══════════════════════════════════════════════════════════════════════ */

function Compliance() {
  const doThings = [
    "Clear consent language on every customer form",
    "Explicit opt-in before any WhatsApp message",
    "Human handoff for medical, legal, tax, or sensitive topics",
    "Admin access control + monthly audit logs",
    "Monthly backups + documented data-deletion workflow",
    "Children&rsquo;s data handled separately (schools / tuition)",
  ];
  const dontThings = [
    "AI diagnosing, prescribing, or interpreting lab reports",
    "AI giving legal, tax, visa, or immigration advice",
    "Bulk WhatsApp spam or unconsented broadcasts",
    "Scraping personal data from other platforms",
    "Storing passwords, Aadhaar, or bank details",
    "Generic &ldquo;ask me anything&rdquo; chatbots on customer-facing lines",
  ];
  return (
    <section
      style={{
        padding: "120px 24px",
        background: CREAM,
        color: CHARCOAL,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
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
          § Built right · DPDP 2025 + Meta 2026
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.5vw, 72px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 22px",
            color: CHARCOAL,
            maxWidth: 900,
          }}
        >
          Responsible AI{" "}
          <em style={{ fontStyle: "italic", color: RED }}>
            isn&rsquo;t a checkbox — it&rsquo;s how we install.
          </em>
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "#4B5563",
            maxWidth: 780,
            lineHeight: 1.65,
            margin: "0 0 48px",
          }}
        >
          India&rsquo;s Digital Personal Data Protection Rules 2025 are in
          force. Meta&rsquo;s 2026 WhatsApp Business policy restricts
          general-purpose chatbots on customer lines. Both are fine — we
          build inside those rails from day one.
        </p>

        <div
          className="skillies-compliance-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          <div
            style={{
              padding: "32px 30px 34px",
              borderRadius: 18,
              background: "rgba(61,90,61,0.08)",
              border: "1px solid rgba(61,90,61,0.28)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#3D5A3D",
                fontWeight: 700,
                margin: "0 0 18px",
              }}
            >
              ✓ What we always do
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {doThings.map((d, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 14.5,
                    color: CHARCOAL,
                    lineHeight: 1.55,
                    paddingLeft: 22,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 1,
                      color: "#3D5A3D",
                      fontWeight: 800,
                    }}
                  >
                    ✓
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: d }} />
                </li>
              ))}
            </ul>
          </div>
          <div
            style={{
              padding: "32px 30px 34px",
              borderRadius: 18,
              background: "rgba(198,40,40,0.06)",
              border: "1px solid rgba(198,40,40,0.25)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: RED,
                fontWeight: 700,
                margin: "0 0 18px",
              }}
            >
              ✗ What we refuse to do
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {dontThings.map((d, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 14.5,
                    color: CHARCOAL,
                    lineHeight: 1.55,
                    paddingLeft: 22,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 1,
                      color: RED,
                      fontWeight: 800,
                    }}
                  >
                    ✗
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: d }} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 760px) {
              .skillies-compliance-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* PRICING LADDER                                                          */
/* ═══════════════════════════════════════════════════════════════════════ */

function Pricing() {
  const rows = [
    { pkg: "AI Business Audit", who: "Every business · the entry point", setup: "₹4,999 – ₹14,999", mo: "—" },
    { pkg: "Starter Automation", who: "Small shop / service business", setup: "₹25,000 – ₹50,000", mo: "₹5,000 – ₹12,000" },
    { pkg: "WhatsApp Lead Assistant", who: "Local lead-driven business", setup: "₹30,000 – ₹90,000", mo: "₹7,500 – ₹25,000" },
    { pkg: "AI Content Engine", who: "Creator · local brand · hospitality", setup: "none / ₹15,000", mo: "₹15,000 – ₹60,000" },
    { pkg: "CRM + Follow-Up Autopilot", who: "High-ticket · multi-channel", setup: "₹50,000 – ₹2,50,000", mo: "₹10,000 – ₹50,000" },
    { pkg: "AI Voice Receptionist", who: "Clinic · resort · school · real estate", setup: "₹50,000 – ₹2,00,000", mo: "₹15,000 – ₹75,000" },
    { pkg: "Industry AI Pack", who: "Clinic · tourism · education · retail", setup: "₹75,000 – ₹4,00,000", mo: "₹20,000 – ₹1,00,000" },
    { pkg: "AI Front Desk (flagship)", who: "Complete bundle · fastest wins", setup: "₹75,000", mo: "₹15,000" },
    { pkg: "AI Transformation Retainer", who: "Larger institutions · embedded", setup: "₹2,00,000+", mo: "₹75,000 – ₹3,00,000+" },
  ];
  return (
    <section
      style={{
        padding: "120px 24px",
        background: DARK,
        color: "white",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: GOLD_LIGHT,
            fontWeight: 700,
            margin: "0 0 16px",
          }}
        >
          § Pricing ladder · indicative
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.5vw, 72px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 22px",
            maxWidth: 900,
          }}
        >
          Transparent floors.{" "}
          <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>
            Exact scope on the audit.
          </em>
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.62)",
            maxWidth: 720,
            lineHeight: 1.65,
            margin: "0 0 56px",
          }}
        >
          You won&rsquo;t hear &ldquo;it depends&rdquo; from us. Here&rsquo;s
          the real ladder Kerala businesses pay on. The exact number for
          your business lands on your one-page scope, within 48 hours of the
          audit call.
        </p>

        <div
          style={{
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {/* header */}
          <div
            className="skillies-price-header skillies-price-row"
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1.6fr 1fr 1fr",
              padding: "18px 24px",
              background: "rgba(255,255,255,0.04)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
              fontWeight: 700,
            }}
          >
            <div>Package</div>
            <div>Best for</div>
            <div>Setup</div>
            <div>Monthly</div>
          </div>
          {rows.map((r, i) => (
            <div
              key={r.pkg}
              className="skillies-price-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1.6fr 1fr 1fr",
                padding: "20px 24px",
                borderBottom:
                  i === rows.length - 1
                    ? "none"
                    : "1px solid rgba(255,255,255,0.06)",
                alignItems: "center",
                background:
                  r.pkg === "AI Front Desk (flagship)"
                    ? "rgba(230,193,120,0.06)"
                    : "transparent",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color:
                    r.pkg === "AI Front Desk (flagship)" ? GOLD_LIGHT : "white",
                }}
              >
                {r.pkg}
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.5,
                }}
              >
                {r.who}
              </div>
              <div
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 17,
                  color: "white",
                  letterSpacing: "-0.01em",
                }}
              >
                {r.setup}
              </div>
              <div
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 17,
                  color: "white",
                  letterSpacing: "-0.01em",
                }}
              >
                {r.mo}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: 24,
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
            fontStyle: "italic",
            fontFamily: "'Instrument Serif', serif",
          }}
        >
          Every number above excludes direct WhatsApp Business API fees,
          third-party tool subscriptions (Twilio, OpenAI, etc.), and GST.
          Those pass through at cost on your monthly invoice.
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 860px) {
              .skillies-price-header { display: none !important; }
              .skillies-price-row {
                grid-template-columns: 1fr !important;
                gap: 6px !important;
                padding: 20px 20px !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* FAQ                                                                     */
/* ═══════════════════════════════════════════════════════════════════════ */

function FAQ() {
  const faqs = [
    {
      q: "Do you only work with Kerala businesses?",
      a: "Primarily, yes. We&rsquo;re built in Malappuram, the team speaks the language, and our playbooks are tuned for how Kerala customers actually message. We do take the occasional client from Bangalore, Dubai, and the UK — mostly Malayali founders running businesses abroad.",
    },
    {
      q: "Can this really work in Malayalam — not just English translation?",
      a: "Yes, that&rsquo;s the whole point. We write hooks, scripts, and replies in Malayalam and Manglish the way customers actually type — not the way Google Translate thinks they should. Manglish, Malabar tone, Gulf Malayali tone, Kochi youth tone — we tune for which one matches your audience.",
    },
    {
      q: "How is this different from a generic ChatGPT chatbot?",
      a: "Generic chatbots try to answer anything. They hallucinate, they embarrass you, and Meta&rsquo;s 2026 WhatsApp Business policy now restricts them on customer-facing lines. What we build is narrow and safe — a business-specific front desk that only does bookings, enquiries, follow-ups, and FAQs you&rsquo;ve approved. Everything else routes to a human.",
    },
    {
      q: "Is my customer data safe? What about DPDP 2025?",
      a: "India&rsquo;s DPDP Rules 2025 are now notified — consent, opt-in, breach notification, data-deletion timelines. Every Skillies install ships compliant on day one. We&rsquo;ll also help you write the consent notice your customers see on WhatsApp and on your forms.",
    },
    {
      q: "How fast will I see results?",
      a: "The Audit gives you clarity in 14 days. The Install runs days 16–45. By day 45 you&rsquo;re already seeing missed leads recovered and reply times drop. By day 90 we sit with you and read the numbers — hours saved, leads recovered, reviews collected, revenue moved.",
    },
    {
      q: "What if my staff can&rsquo;t use new technology?",
      a: "That&rsquo;s a great fit for us — not a problem. Our Staff SOP Bot answers your team&rsquo;s repeat questions in Malayalam. We train on-site. Most Skillies systems show the owner / staff exactly one dashboard and one daily WhatsApp message. Your team doesn&rsquo;t need to &ldquo;learn AI.&rdquo; They just read the message.",
    },
    {
      q: "What don&rsquo;t you do?",
      a: "We don&rsquo;t build medical-diagnosis bots, legal-advice bots, tax / visa / immigration bots, or &ldquo;ask me anything&rdquo; customer chatbots. We don&rsquo;t do bulk WhatsApp spam. We don&rsquo;t scrape other platforms for data. We don&rsquo;t train custom Malayalam LLMs from scratch — we use what&rsquo;s already great and layer your business logic on top.",
    },
    {
      q: "Why should I start with the Audit and not a full install?",
      a: "Because the Audit is the truth test. It tells you whether AI is worth installing in your business yet, and if so, which piece first. Most clients find they don&rsquo;t need the full Front Desk — they need 2 or 3 of the 7 services. The Audit saves you from buying things you don&rsquo;t need.",
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
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
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
          § Honest answers
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.5vw, 64px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 48px",
            color: CHARCOAL,
          }}
        >
          The questions Kerala business owners{" "}
          <em style={{ fontStyle: "italic", color: RED }}>
            actually ask on the call.
          </em>
        </h2>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {faqs.map((f, i) => (
            <details
              key={i}
              style={{
                padding: "22px 4px",
                borderTop: "1px solid rgba(26,26,26,0.1)",
                borderBottom:
                  i === faqs.length - 1
                    ? "1px solid rgba(26,26,26,0.1)"
                    : "none",
              }}
            >
              <summary
                style={{
                  listStyle: "none",
                  cursor: "pointer",
                  fontSize: 19,
                  fontWeight: 600,
                  color: CHARCOAL,
                  letterSpacing: "-0.01em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: f.q }} />
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 300,
                    color: RED,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              </summary>
              <p
                style={{
                  marginTop: 14,
                  fontSize: 15,
                  color: "#4B5563",
                  lineHeight: 1.7,
                }}
                dangerouslySetInnerHTML={{ __html: f.a }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* FINAL CTA                                                               */
/* ═══════════════════════════════════════════════════════════════════════ */

function FinalCTA() {
  return (
    <section
      style={{
        padding: "140px 24px",
        background: `radial-gradient(ellipse at 50% 50%, rgba(198,40,40,0.2), transparent 60%), ${CHARCOAL}`,
        color: "white",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: GOLD_LIGHT,
            fontWeight: 700,
            margin: "0 0 20px",
          }}
        >
          § Start here
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(48px, 6vw, 88px)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.0,
            margin: "0 0 28px",
          }}
        >
          Start with the{" "}
          <em style={{ fontStyle: "italic", color: "#EF4444" }}>
            Audit.
          </em>
        </h2>
        <p
          style={{
            fontSize: 19,
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.6,
            margin: "0 0 16px",
          }}
        >
          ₹4,999. No contracts. We sit with you for 90 minutes, study your
          business, and hand you a 30-day AI implementation roadmap.
        </p>
        <p
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.55)",
            fontStyle: "italic",
            fontFamily: "'Instrument Serif', serif",
            margin: "0 0 40px",
            lineHeight: 1.5,
          }}
        >
          If you hire us for the Front Desk after the audit, the ₹4,999 is
          credited against your install fee.
        </p>
        <a
          href={WHATSAPP_AUDIT}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "22px 40px",
            background: RED,
            color: "white",
            textDecoration: "none",
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.02em",
            boxShadow: "0 20px 50px rgba(198,40,40,0.4)",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          Book your AI Business Audit on WhatsApp
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 8l4 4-4 4M3 12h18" />
          </svg>
        </a>
        <p
          style={{
            marginTop: 28,
            fontSize: 14,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.05em",
          }}
        >
          Prefer to talk first?{" "}
          <a
            href={WHATSAPP_GENERIC}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: GOLD_LIGHT,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Send a message on WhatsApp
          </a>{" "}
          — no commitment.
        </p>
        <p
          style={{
            marginTop: 48,
            fontSize: 14,
            color: "rgba(255,255,255,0.45)",
            fontStyle: "italic",
            fontFamily: "'Instrument Serif', serif",
            lineHeight: 1.6,
          }}
        >
          — Ehsan Asgar · Skillies AI Business Lab · Malappuram, Kerala
          <br />
          <span style={{ fontSize: 13 }}>
            AI service venam engil Skillies. AI business-il implement cheyyanam
            engil Skillies.
          </span>
        </p>
      </div>
    </section>
  );
}
