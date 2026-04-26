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

// CTA hrefs — every general "talk to us" button on this page goes through
// the AI front desk on WhatsApp. The system itself qualifies + scopes + books.
const WHATSAPP_GENERIC =
  "https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20interested%20in%20Skillies%20AI%20services%20for%20my%20business.%20My%20business%20is%20";
// System-specific deep links keep their pre-filled context for in-section CTAs.
const WHATSAPP_FRONTDESK =
  "https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20interested%20in%20the%20Skillies%20AI%20Front%20Desk.%20My%20business%20is%20";
const WHATSAPP_CONTENT =
  "https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20interested%20in%20the%20Skillies%20AI%20Content%20Engine.%20My%20business%20is%20";

// Display-friendly version of the bot's number — shown in the TalkToTheBot
// section so visitors can dial / paste it without touching the wa.me URL.
const BOT_NUMBER_DISPLAY = "+91 80899 41131";

// Brand palette · DARK / CHARCOAL / CREAM / RED / GOLD / GOLD_LIGHT
// (FOREST #3D5A3D and MUTED #6B7280 are also brand colors but used as literals
// inside the Compliance / Wedge sections — no constant needed.)
const DARK = "#0F0F0F";
const CHARCOAL = "#1A1A1A";
const CREAM = "#FAF5EB";
const RED = "#C62828";
const GOLD = "#C9A24E";
const GOLD_LIGHT = "#E6C178";

export default function ServicesPage() {
  return (
    <main style={{ background: DARK, color: "white", position: "relative" }}>
      <TopNav cta={{ href: WHATSAPP_GENERIC, label: "Talk to the bot" }} />

      {/* Magazine spine · vertical gold hairline running down the entire page.
          Pure cosmetic. Pointer-events off so it never blocks anything. */}
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
      <Wedge />
      <PullQuoteOne />
      <FrontDesk />
      <ContentEngine />
      <Proof />
      <WhySkillies />
      <Compliance />
      <TalkToTheBot />
      <FAQ />
      <FinalCTA />

      <FooterEditorial />
      <WhatsAppButton />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 760px) {
              .skillies-spine { left: 14px !important; }
            }
          `,
        }}
      />
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* PULL-QUOTE BAND · full-bleed editorial moment between sections          */
/* ═══════════════════════════════════════════════════════════════════════ */

function PullQuoteOne() {
  return (
    <section
      className="skillies-pullquote"
      style={{
        padding: "120px 24px",
        background: DARK,
        color: "white",
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid rgba(201,162,78,0.22)`,
        borderBottom: `1px solid rgba(201,162,78,0.22)`,
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
            fontSize: "clamp(36px, 5.4vw, 76px)",
            fontWeight: 400,
            color: CREAM,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            margin: "0 auto",
            maxWidth: 1000,
          }}
        >
          Skillies isn&rsquo;t an agency.{" "}
          <span style={{ color: GOLD_LIGHT }}>It&rsquo;s a system.</span>
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
          § Skillies AI Business Lab · Malappuram
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* HERO                                                                     */
/* ═══════════════════════════════════════════════════════════════════════ */

function Hero() {
  // Right-rail accents · italic gold-cap lines that anchor the asymmetry.
  const accents = [
    "Made in Malappuram",
    "DPDP-2025 ready",
    "WhatsApp-first",
    "Malayalam-aware",
  ];
  return (
    <section
      className="skillies-services-hero"
      style={{
        position: "relative",
        padding: "160px 24px 100px",
        background: `radial-gradient(ellipse at 12% 22%, rgba(198,40,40,0.18), transparent 55%), radial-gradient(ellipse at 88% 78%, rgba(230,193,120,0.16), transparent 55%), ${DARK}`,
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
        <div
          className="skillies-services-eyebrow"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 36,
            fontSize: 10,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            flexWrap: "wrap",
          }}
        >
          <span style={{ width: 44, height: 1, background: GOLD_LIGHT }} />
          <span style={{ fontSize: 11 }}>§ Skillies AI Business Lab</span>
          <span
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)", minWidth: 30 }}
          />
          <span>Malayalam-first · Malappuram</span>
        </div>

        {/* Asymmetric hero · headline left, vertical accent rail right */}
        <div
          className="skillies-hero-asym"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 220px",
            gap: 60,
            alignItems: "start",
          }}
        >
          {/* LEFT — headline + body + CTA */}
          <div>
            <h1
              style={{
                margin: 0,
                fontWeight: 900,
                fontSize: "clamp(46px, 6.6vw, 104px)",
                letterSpacing: "-0.045em",
                lineHeight: 0.94,
                color: "white",
                maxWidth: 980,
              }}
            >
              Two systems. One operator. Built for{" "}
              <em
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: GOLD_LIGHT,
                  letterSpacing: "-0.02em",
                }}
              >
                Kerala.
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
              A Front Desk that answers every WhatsApp message, every call, every
              enquiry — Malayalam and English, all day, every day. And a Content
              Engine that ships three reels a day under your name, in your voice,
              without burning you out.
            </p>

            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: 30,
                color: GOLD_LIGHT,
                margin: "0 0 56px",
                lineHeight: 1.3,
                maxWidth: 760,
                letterSpacing: "-0.02em",
              }}
            >
              Kerala businesses need AI. They don&rsquo;t need confusion.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={WHATSAPP_GENERIC}
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
                Talk to our AI front desk
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
                See the two systems →
              </Link>
            </div>
          </div>

          {/* RIGHT — vertical accent rail. Tiny gold caps + thin gold rules. */}
          <aside
            className="skillies-hero-rail"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 26,
              paddingTop: 12,
              borderLeft: `1px solid rgba(230,193,120,0.22)`,
              paddingLeft: 26,
            }}
          >
            {accents.map((a, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.36em",
                    textTransform: "uppercase",
                    color: GOLD_LIGHT,
                    fontWeight: 700,
                  }}
                >
                  {String(i + 1).padStart(2, "0")} —
                </span>
                <span
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: 22,
                    color: "white",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                  }}
                >
                  {a}
                </span>
                <span
                  aria-hidden
                  style={{
                    width: 28,
                    height: 1,
                    background: "rgba(230,193,120,0.4)",
                  }}
                />
              </div>
            ))}
          </aside>
        </div>

        {/* Trust row — kept for structural balance */}
        <div
          style={{
            marginTop: 80,
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
            @media (max-width: 980px) {
              .skillies-hero-asym {
                grid-template-columns: 1fr !important;
                gap: 36px !important;
              }
              .skillies-hero-rail {
                flex-direction: row !important;
                flex-wrap: wrap !important;
                border-left: none !important;
                padding-left: 0 !important;
                border-top: 1px solid rgba(230,193,120,0.22) !important;
                padding-top: 28px !important;
                gap: 22px !important;
              }
              .skillies-hero-rail > div {
                flex: 1 1 140px !important;
              }
            }
            @media (max-width: 860px) {
              .skillies-services-hero {
                padding: 80px 20px 80px !important;
              }
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
      className="skillies-services-wedge"
      style={{
        padding: "140px 24px 130px",
        background: CREAM,
        color: CHARCOAL,
        borderTop: `1px solid rgba(201,162,78,0.18)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
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
            maxWidth: 1000,
          }}
        >
          Your business doesn&rsquo;t need AI tools.
          <br />
          It needs{" "}
          <em style={{ fontStyle: "italic", color: RED }}>
            an AI front desk.
          </em>
        </h2>

        {/* Before / After comparison — red-tinted vs gold-tinted columns,
            each headed by a giant outline italic word and a thin rule. */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            marginTop: 64,
            position: "relative",
            border: `1px solid rgba(201,162,78,0.32)`,
            borderRadius: 22,
            overflow: "hidden",
          }}
          className="skillies-wedge-grid"
        >
          {/* Centre rule */}
          <div
            aria-hidden
            className="skillies-wedge-divider"
            style={{
              position: "absolute",
              top: 32,
              bottom: 32,
              left: "50%",
              width: 1,
              background:
                "linear-gradient(to bottom, transparent, rgba(201,162,78,0.5), transparent)",
              pointerEvents: "none",
            }}
          />

          {/* WITHOUT — red-tinted */}
          <div
            style={{
              padding: "44px 40px 50px",
              background:
                "linear-gradient(180deg, rgba(198,40,40,0.05) 0%, rgba(198,40,40,0.02) 100%)",
              position: "relative",
            }}
          >
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.34em",
                textTransform: "uppercase",
                color: RED,
                fontWeight: 700,
                margin: "0 0 8px",
              }}
            >
              Without Skillies
            </p>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(48px, 7vw, 96px)",
                color: RED,
                opacity: 0.85,
                margin: "0 0 24px",
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
              }}
            >
              Before.
            </p>
            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.28em",
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
                margin: "0 0 28px",
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
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: 18,
                color: "#7B1F1F",
                margin: 0,
                letterSpacing: "-0.01em",
                lineHeight: 1.4,
              }}
            >
              DMs missed. Calls dropped. Owner burnt out.
            </p>
          </div>

          {/* WITH — gold-tinted */}
          <div
            style={{
              padding: "44px 40px 50px",
              background:
                "linear-gradient(180deg, rgba(201,162,78,0.06) 0%, rgba(201,162,78,0.02) 100%)",
              position: "relative",
            }}
          >
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.34em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 700,
                margin: "0 0 8px",
              }}
            >
              With Skillies
            </p>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(48px, 7vw, 96px)",
                color: GOLD,
                margin: "0 0 24px",
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
              }}
            >
              After.
            </p>
            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.28em",
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
                margin: "0 0 28px",
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
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: 18,
                color: CHARCOAL,
                margin: 0,
                letterSpacing: "-0.01em",
                lineHeight: 1.4,
              }}
            >
              Replies in seconds. Reports every morning. Owner reads, not runs.
            </p>
          </div>
        </div>

        {/* The numbers that tell the story · gigantic editorial typography */}
        <div
          className="skillies-wedge-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 28,
            marginTop: 88,
            paddingTop: 36,
            borderTop: `1px solid rgba(201,162,78,0.32)`,
          }}
        >
          {[
            { big: "63", unit: "books", line: "shipped through Pageboo · the engine that proves the model", small: false },
            { big: "₹1,16K", unit: "/month", line: "passive recurring · what one operator + Skillies systems produce", small: true },
            { big: "30", unit: "day pilot", line: "not earning its keep? Pause without penalty · no questions", small: false },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: s.small
                    ? "clamp(48px, 5.6vw, 92px)"
                    : "clamp(64px, 8vw, 132px)",
                  color: GOLD,
                  margin: 0,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.85,
                  whiteSpace: "nowrap",
                }}
              >
                {s.big}
                <span
                  style={{
                    fontSize: "0.32em",
                    color: CHARCOAL,
                    marginLeft: 6,
                    fontStyle: "normal",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.unit}
                </span>
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#4B5563",
                  lineHeight: 1.5,
                  margin: 0,
                  maxWidth: 240,
                }}
              >
                {s.line}
              </p>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: 64,
            fontSize: 18,
            color: "#4B5563",
            lineHeight: 1.7,
            maxWidth: 820,
          }}
        >
          Most Kerala businesses already have the customers. What they&rsquo;re
          missing is a system that doesn&rsquo;t drop them. Skillies installs
          that system — the AI front desk — and trains your team to run it.
          You don&rsquo;t have to understand the tech.{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              color: CHARCOAL,
              fontSize: "1.15em",
              letterSpacing: "-0.01em",
            }}
          >
            You just have to read the daily report.
          </em>
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 760px) {
              .skillies-wedge-grid {
                grid-template-columns: 1fr !important;
                gap: 0 !important;
              }
              .skillies-wedge-divider {
                display: none !important;
              }
              .skillies-wedge-stats {
                grid-template-columns: 1fr !important;
                gap: 36px !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* PROCESS FLOW · 5-step bot pipeline                                      */
/* ═══════════════════════════════════════════════════════════════════════ */

function ProcessFlow() {
  const steps = [
    { n: "01", t: "Customer message", s: "WhatsApp · call · DM" },
    { n: "02", t: "AI Front Desk", s: "qualifies · scopes · replies" },
    { n: "03", t: "Hot leads booked", s: "into your calendar" },
    { n: "04", t: "Cold ones nurtured", s: "follow-ups · check-ins" },
    { n: "05", t: "Daily owner report", s: "one WhatsApp every morning" },
  ];
  return (
    <div
      style={{
        marginBottom: 80,
        padding: "40px 32px 44px",
        borderRadius: 22,
        background: "rgba(230,193,120,0.04)",
        border: "1px solid rgba(230,193,120,0.18)",
        position: "relative",
        overflow: "hidden",
      }}
      className="skillies-flow"
    >
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: GOLD_LIGHT,
          fontWeight: 700,
          margin: "0 0 8px",
        }}
      >
        How it runs · the pipeline
      </p>
      <p
        style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontStyle: "italic",
          fontSize: 26,
          color: "white",
          margin: "0 0 36px",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          maxWidth: 740,
        }}
      >
        One message in.{" "}
        <span style={{ color: GOLD_LIGHT }}>
          Five things happen automatically.
        </span>
      </p>

      <div
        className="skillies-flow-row"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 0,
          alignItems: "start",
          position: "relative",
        }}
      >
        {steps.map((step, i) => (
          <div
            key={step.n}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "0 8px",
              position: "relative",
              textAlign: "center",
            }}
          >
            {/* Connector arrow · sits between each step. Drawn as a gold
                hairline + a small chevron. Hidden after the last step. */}
            {i < steps.length - 1 && (
              <svg
                aria-hidden
                className="skillies-flow-arrow"
                width="100%"
                height="14"
                viewBox="0 0 100 14"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  top: 14,
                  left: "50%",
                  width: "100%",
                  height: 14,
                  pointerEvents: "none",
                }}
              >
                <line
                  x1="6"
                  y1="7"
                  x2="94"
                  y2="7"
                  stroke={GOLD_LIGHT}
                  strokeWidth="1"
                  strokeDasharray="2 4"
                  opacity="0.5"
                />
                <path
                  d="M 92 3 L 96 7 L 92 11"
                  fill="none"
                  stroke={GOLD_LIGHT}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}

            {/* Gold dot */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background:
                  i === 0
                    ? "rgba(198,40,40,0.18)"
                    : "rgba(230,193,120,0.12)",
                border: `1.5px solid ${i === 0 ? RED : GOLD_LIGHT}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: i === 0 ? "#EF6B6B" : GOLD_LIGHT,
                marginBottom: 16,
                position: "relative",
                zIndex: 2,
              }}
            >
              {step.n}
            </div>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: 18,
                color: "white",
                margin: "0 0 6px",
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
                maxWidth: 160,
              }}
            >
              {step.t}
            </p>
            <p
              style={{
                fontSize: 11.5,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.45,
                margin: 0,
                letterSpacing: "0.02em",
                maxWidth: 150,
              }}
            >
              {step.s}
            </p>
          </div>
        ))}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 880px) {
              .skillies-flow-row {
                grid-template-columns: 1fr 1fr !important;
                gap: 28px 18px !important;
              }
              .skillies-flow-arrow { display: none !important; }
            }
            @media (max-width: 480px) {
              .skillies-flow-row {
                grid-template-columns: 1fr !important;
              }
            }
          `,
        }}
      />
    </div>
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
        borderTop: `1px solid rgba(201,162,78,0.18)`,
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

        {/* Process diagram · 5-step horizontal flow showing the bot pipeline.
            Customer message → AI Front Desk → Hot leads booked → Cold ones
            nurtured → Owner gets daily report. Pure SVG dots & arrows. */}
        <ProcessFlow />

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
                  margin: "0 0 12px",
                }}
              >
                Investment
              </p>
              <p
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 28,
                  fontWeight: 400,
                  color: "white",
                  margin: "0 0 12px",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                  fontStyle: "italic",
                }}
              >
                Priced to your volume.
              </p>
              <p
                style={{
                  fontSize: 14.5,
                  color: "rgba(255,255,255,0.78)",
                  lineHeight: 1.6,
                  margin: "0 0 12px",
                }}
              >
                Setup + monthly maintenance scale with your conversation volume
                and content output. Message the AI front desk — it&rsquo;ll
                scope your business and quote you on the spot.
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
/* AI CONTENT ENGINE — System 02                                           */
/* ═══════════════════════════════════════════════════════════════════════ */

function ContentEngine() {
  const features = [
    {
      n: "01",
      title: "Voice in, video out",
      body:
        "Record a 3–5 minute voice note in Manglish, Malayalam, or English. Stop thinking about lighting, scripts, edits, captions, hooks. We do the rest.",
    },
    {
      n: "02",
      title: "Trained on your style",
      body:
        "We build an AI model on your face, voice, mannerisms. Every video sounds like you on a good day — never like a stock template.",
    },
    {
      n: "03",
      title: "3 reels per day, automated",
      body:
        "Monday morning to Sunday night. No skipped weeks. Hooks, captions, motion, music — all in your brand grammar.",
    },
    {
      n: "04",
      title: "Founder-led, written-content option",
      body:
        "Prefer English-only? Send written points. We turn them into a fully-edited video with motion, b-roll, captions.",
    },
    {
      n: "05",
      title: "Consistency without burnout",
      body:
        "The reason most founders&rsquo; content dies in week 3 isn&rsquo;t ideas. It&rsquo;s the production cost of every reel. We remove that cost.",
    },
  ];
  const bestFor = [
    "Founders · operators · solo experts who want to be the brand",
    "Coaches · creators · educators · consultants",
    "Clinics · salons · resorts with a face-of-brand owner",
    "Real estate · NRI desks · hospitality founders",
    "MSME owners building a personal-brand moat",
  ];
  return (
    <section
      id="content-engine"
      style={{
        padding: "120px 24px",
        background: CREAM,
        color: CHARCOAL,
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid rgba(201,162,78,0.22)`,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 15% 90%, rgba(198,40,40,0.07), transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
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
          § System 02 · AI Content Engine
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
            color: CHARCOAL,
          }}
        >
          <strong style={{ fontFamily: "inherit", fontWeight: 700 }}>
            You speak.
          </strong>{" "}
          <em style={{ fontStyle: "italic", color: GOLD }}>We ship.</em>
        </h2>
        <p
          style={{
            fontSize: 19,
            color: "#4B5563",
            maxWidth: 800,
            lineHeight: 1.65,
            margin: "0 0 64px",
          }}
        >
          Founders shouldn&rsquo;t have to direct, edit, and post. The Content
          Engine does that. You just record voice notes — or write the script
          if your audience prefers English — and three finished videos go
          live every day under your name.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 40,
          }}
          className="skillies-content-grid"
        >
          {/* LEFT — feature cards */}
          <div
            style={{
              padding: "38px 36px",
              borderRadius: 24,
              background: "white",
              border: "1px solid rgba(26,26,26,0.08)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.06)",
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
                background: GOLD,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              }}
            />
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 700,
                margin: "0 0 22px",
              }}
            >
              How it works · 5 moving parts, 0 effort from you
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 22,
              }}
            >
              {features.map((f) => (
                <li
                  key={f.n}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 18,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontStyle: "italic",
                      fontSize: 28,
                      color: GOLD,
                      width: 38,
                      lineHeight: 1,
                      paddingTop: 2,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {f.n}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: CHARCOAL,
                        margin: "0 0 6px",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                      }}
                    >
                      {f.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 14.5,
                        color: "#4B5563",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                      dangerouslySetInnerHTML={{ __html: f.body }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — best for + the wedge + CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                padding: "28px 30px",
                borderRadius: 20,
                background: "rgba(26,26,26,0.04)",
                border: "1px solid rgba(26,26,26,0.1)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#6B7280",
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
                      color: "#374151",
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
                        background: GOLD,
                      }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                padding: "32px 30px 30px",
                borderRadius: 20,
                background: `linear-gradient(135deg, rgba(198,40,40,0.08), rgba(198,40,40,0.02))`,
                border: "1px solid rgba(198,40,40,0.22)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: RED,
                  fontWeight: 700,
                  margin: "0 0 4px",
                }}
              >
                The unfair part
              </p>
              {/* Gigantic stat · 90 reels/month as the design element */}
              <p
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(80px, 9vw, 140px)",
                  color: GOLD,
                  margin: "8px 0 0",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.85,
                }}
              >
                90
                <span
                  style={{
                    fontSize: "0.22em",
                    color: CHARCOAL,
                    marginLeft: 8,
                    fontStyle: "normal",
                    letterSpacing: "0.01em",
                  }}
                >
                  reels/mo
                </span>
              </p>
              <p
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 22,
                  fontWeight: 400,
                  color: CHARCOAL,
                  margin: "12px 0 12px",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.25,
                }}
              >
                <em style={{ fontStyle: "italic" }}>
                  &mdash; without you ever opening a timeline.
                </em>
              </p>
              <p
                style={{
                  fontSize: 14,
                  color: "#4B5563",
                  fontStyle: "italic",
                  fontFamily: "'Instrument Serif', serif",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                Your face, your voice, your business. Every day, on
                auto-pilot.
              </p>
            </div>

            <a
              href={WHATSAPP_CONTENT}
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
              Start the Content Engine conversation
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
              .skillies-content-grid {
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
/* PROOF · two real reels produced by the systems above                    */
/* ═══════════════════════════════════════════════════════════════════════ */

function Proof() {
  const reels = [
    {
      src: "/proof/skillies-cinematic.mp4",
      poster: "/proof/skillies-cinematic-poster.jpg",
      label: "01 · CINEMATIC BRAND REEL",
      title: "Founder voice in. Cinematic reel out.",
      body: "Footage, music, motion, captions, brand grammar · all stitched by the Content Engine. The founder recorded a script. The system delivered this on the same day.",
    },
    {
      src: "/proof/meta-update-reel.mp4",
      poster: "/proof/meta-update-reel-poster.jpg",
      label: "02 · META UPDATE REEL",
      title: "Same-day news brief · ready to post.",
      body: "Topical, edited, on-brand. The kind of reel a founder would have to skip on a busy week · except now it ships every time, on the same day.",
    },
  ];

  return (
    <section
      style={{
        position: "relative",
        padding: "120px 24px",
        background: CREAM,
        color: CHARCOAL,
        borderTop: `1px solid rgba(0,0,0,0.06)`,
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
        {/* Eyebrow rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 28,
            fontSize: 11,
            color: "rgba(26,26,26,0.5)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            flexWrap: "wrap",
          }}
        >
          <span style={{ width: 44, height: 1, background: GOLD }} />
          <span>§ Proof · live outputs</span>
          <span
            style={{
              flex: 1,
              height: 1,
              background: "rgba(0,0,0,0.08)",
              minWidth: 30,
            }}
          />
          <span>Both 9:16 · 60-second cuts</span>
        </div>

        {/* Title */}
        <h2
          style={{
            margin: 0,
            fontWeight: 900,
            fontSize: "clamp(40px, 5.4vw, 76px)",
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
            color: CHARCOAL,
            maxWidth: 920,
          }}
        >
          What ships out the{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontStyle: "italic",
              color: GOLD,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            other end.
          </em>
        </h2>

        <p
          style={{
            marginTop: 24,
            fontSize: 19,
            lineHeight: 1.55,
            color: "rgba(26,26,26,0.7)",
            maxWidth: 720,
          }}
        >
          Two real reels produced by the Skillies stack · no actor, no editor,
          no reshoots. Tap to play with sound.
        </p>

        {/* Reel grid · two portrait cards */}
        <div
          style={{
            marginTop: 64,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 36,
            alignItems: "start",
          }}
        >
          {reels.map((r) => (
            <article
              key={r.src}
              style={{
                position: "relative",
                background: CHARCOAL,
                borderRadius: 18,
                overflow: "hidden",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.08), 0 24px 60px -20px rgba(0,0,0,0.35)",
              }}
            >
              {/* portrait video frame · 9:16 */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "9 / 16",
                  background: "#000",
                }}
              >
                <video
                  src={r.src}
                  poster={r.poster}
                  controls
                  preload="none"
                  playsInline
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    background: "#000",
                  }}
                />
              </div>

              {/* caption block */}
              <div style={{ padding: "22px 22px 26px" }}>
                <div
                  style={{
                    fontSize: 10,
                    color: GOLD_LIGHT,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  {r.label}
                </div>
                <h3
                  style={{
                    margin: "10px 0 10px",
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontWeight: 400,
                    fontStyle: "italic",
                    fontSize: 26,
                    lineHeight: 1.15,
                    color: CREAM,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {r.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14.5,
                    lineHeight: 1.55,
                    color: "rgba(250,245,235,0.72)",
                  }}
                  dangerouslySetInnerHTML={{ __html: r.body }}
                />
              </div>
            </article>
          ))}
        </div>

        {/* Tag line */}
        <p
          style={{
            marginTop: 44,
            fontSize: 13,
            color: "rgba(26,26,26,0.55)",
            fontStyle: "italic",
            maxWidth: 720,
          }}
        >
          Both reels were produced for skillies.ai itself · the AI Business Lab
          runs the same stack we install for clients. Founder records voice,
          system ships finished reel.
        </p>
      </div>
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
      kerala: true,
    },
  ];
  return (
    <section
      style={{
        padding: "140px 24px",
        background: DARK,
        color: "white",
        borderTop: `1px solid rgba(201,162,78,0.18)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
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
            fontSize: "clamp(40px, 5.8vw, 84px)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.0,
            margin: "0 0 22px",
            maxWidth: 1000,
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
            margin: "0 0 72px",
          }}
        >
          Plenty of shops will sell you &ldquo;AI automation.&rdquo; Very few
          will sell you the outcome, in your language, with compliance built
          in, and proof at the end.
        </p>

        {/* Editorial list · 5 horizontal rows. Massive italic gold number on
            the left, title + description on the right. Magazine, not SaaS. */}
        <ol
          className="skillies-why-list"
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {reasons.map((r, i) => (
            <li
              key={r.n}
              className="skillies-why-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(140px, 200px) 1fr",
                gap: 32,
                padding: "44px 0",
                borderTop: `1px solid rgba(201,162,78,0.22)`,
                borderBottom:
                  i === reasons.length - 1
                    ? `1px solid rgba(201,162,78,0.22)`
                    : "none",
                alignItems: "start",
                position: "relative",
              }}
            >
              <span
                className="skillies-why-num"
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(72px, 10vw, 132px)",
                  color: GOLD_LIGHT,
                  margin: 0,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.85,
                  display: "block",
                }}
              >
                {r.n}
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  paddingTop: 18,
                  position: "relative",
                }}
              >
                <h3
                  style={{
                    fontSize: "clamp(22px, 2.4vw, 32px)",
                    fontWeight: 700,
                    color: "white",
                    margin: 0,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                  }}
                >
                  {r.title}
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.65,
                    margin: 0,
                    maxWidth: 720,
                  }}
                  dangerouslySetInnerHTML={{ __html: r.body }}
                />
                {/* Kerala silhouette ornament · only on the last row */}
                {r.kerala && <KeralaSilhouette />}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .skillies-why-row { transition: background 220ms ease; }
            .skillies-why-row:hover .skillies-why-num { color: ${RED}; }
            .skillies-why-row:hover { background: rgba(255,255,255,0.015); }
            @media (max-width: 760px) {
              .skillies-why-row {
                grid-template-columns: 1fr !important;
                gap: 8px !important;
                padding: 32px 0 !important;
              }
              .skillies-why-num {
                font-size: clamp(56px, 14vw, 88px) !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* Stylised Kerala coastline · thin gold line drawing. Geographic accuracy
   is not required — it should read as Kerala silhouette to a Keralite. */
function KeralaSilhouette() {
  return (
    <div
      aria-hidden
      className="skillies-kerala"
      style={{
        position: "absolute",
        top: -10,
        right: 0,
        width: 110,
        height: 180,
        opacity: 0.55,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 110 180"
        width="110"
        height="180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stylised Kerala outline — long, narrow, coastal. The west coast
            (left) is wavy (Arabian Sea), the east (right) follows the Western
            Ghats. Top is Kasaragod, bottom is Thiruvananthapuram. */}
        <path
          d="M 60 4
             C 48 8, 40 16, 38 26
             C 36 34, 30 36, 26 42
             C 22 48, 24 56, 22 64
             C 18 72, 14 78, 16 88
             C 18 96, 14 104, 12 114
             C 10 122, 14 128, 12 136
             C 8 144, 10 154, 18 162
             C 28 172, 38 174, 46 170
             C 56 166, 60 158, 66 152
             C 72 146, 78 142, 80 132
             C 82 124, 86 120, 88 112
             C 90 100, 92 92, 94 84
             C 96 76, 100 68, 98 58
             C 96 48, 94 40, 88 34
             C 82 26, 76 18, 70 10
             C 66 6, 62 4, 60 4 Z"
          stroke={GOLD_LIGHT}
          strokeWidth="1.2"
          strokeLinejoin="round"
          fill="rgba(230,193,120,0.04)"
        />
        {/* Malappuram dot · roughly the lat/long position on the silhouette */}
        <circle cx="46" cy="64" r="3" fill={RED} />
        <text
          x="56"
          y="68"
          fill={GOLD_LIGHT}
          fontSize="9"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          letterSpacing="0.04em"
        >
          Malappuram
        </text>
      </svg>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 760px) {
              .skillies-kerala {
                position: static !important;
                margin-top: 16px !important;
              }
            }
          `,
        }}
      />
    </div>
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
        borderTop: `1px solid rgba(201,162,78,0.22)`,
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

        {/* Split-screen visual · two big vertical columns separated by a
            thin gold dividing line. Each item gets generous breathing room. */}
        <div
          className="skillies-compliance-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            position: "relative",
            paddingTop: 8,
          }}
        >
          {/* Centre rule */}
          <div
            aria-hidden
            className="skillies-compliance-divider"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              width: 1,
              background:
                "linear-gradient(to bottom, transparent, rgba(201,162,78,0.55) 12%, rgba(201,162,78,0.55) 88%, transparent)",
              pointerEvents: "none",
            }}
          />

          {/* DO column */}
          <div style={{ padding: "12px 56px 12px 0" }} className="skillies-comp-col">
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#3D5A3D",
                fontWeight: 700,
                margin: "0 0 6px",
              }}
            >
              Always
            </p>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(38px, 5vw, 60px)",
                color: "#3D5A3D",
                margin: "0 0 32px",
                letterSpacing: "-0.025em",
                lineHeight: 0.95,
              }}
            >
              What we do.
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 22,
              }}
            >
              {doThings.map((d, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 16,
                    color: CHARCOAL,
                    lineHeight: 1.55,
                    paddingLeft: 36,
                    position: "relative",
                    paddingBottom: 22,
                    borderBottom:
                      i === doThings.length - 1
                        ? "none"
                        : "1px dashed rgba(61,90,61,0.18)",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: -2,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "rgba(61,90,61,0.12)",
                      border: "1px solid rgba(61,90,61,0.4)",
                      color: "#3D5A3D",
                      fontWeight: 800,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✓
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: d }} />
                </li>
              ))}
            </ul>
          </div>

          {/* DON'T column */}
          <div style={{ padding: "12px 0 12px 56px" }} className="skillies-comp-col">
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: RED,
                fontWeight: 700,
                margin: "0 0 6px",
              }}
            >
              Never
            </p>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(38px, 5vw, 60px)",
                color: RED,
                margin: "0 0 32px",
                letterSpacing: "-0.025em",
                lineHeight: 0.95,
              }}
            >
              What we refuse.
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 22,
              }}
            >
              {dontThings.map((d, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 16,
                    color: CHARCOAL,
                    lineHeight: 1.55,
                    paddingLeft: 36,
                    position: "relative",
                    paddingBottom: 22,
                    borderBottom:
                      i === dontThings.length - 1
                        ? "none"
                        : "1px dashed rgba(198,40,40,0.18)",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: -2,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "rgba(198,40,40,0.1)",
                      border: "1px solid rgba(198,40,40,0.4)",
                      color: RED,
                      fontWeight: 800,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
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
                gap: 56px !important;
              }
              .skillies-compliance-divider {
                display: none !important;
              }
              .skillies-comp-col {
                padding: 0 !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* TALK TO THE BOT · the WhatsApp number is the next step                  */
/* ═══════════════════════════════════════════════════════════════════════ */

function TalkToTheBot() {
  return (
    <section
      style={{
        padding: "160px 24px 140px",
        background: CHARCOAL,
        color: "white",
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid rgba(201,162,78,0.18)`,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 18% 22%, rgba(230,193,120,0.18), transparent 55%), radial-gradient(ellipse at 82% 80%, rgba(198,40,40,0.14), transparent 55%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 28,
            fontSize: 11,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            flexWrap: "wrap",
          }}
        >
          <span style={{ width: 44, height: 1, background: GOLD_LIGHT }} />
          <span>§ Talk to our AI front desk · the same one we install for clients</span>
          <span
            style={{
              flex: 1,
              height: 1,
              background: "rgba(255,255,255,0.1)",
              minWidth: 30,
            }}
          />
        </div>

        <h2
          style={{
            margin: 0,
            fontWeight: 900,
            fontSize: "clamp(44px, 5.8vw, 84px)",
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
            color: "white",
            maxWidth: 920,
          }}
        >
          Pricing? Scope? Timing?{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontStyle: "italic",
              color: GOLD_LIGHT,
            }}
          >
            Ask the bot.
          </em>
        </h2>

        <p
          style={{
            marginTop: 28,
            fontSize: 19,
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.72)",
            maxWidth: 780,
          }}
        >
          The fastest way to know if Skillies fits your business is to chat
          with the system we&rsquo;d install. It already qualifies, scopes, and
          books calls. Pricing depends on your conversation volume + content
          output — the bot will tell you what your business will likely need.
        </p>

        {/* Museum-piece phone display · the page's #1 conversion moment.
            Gigantic italic Instrument Serif number, framed top + bottom by
            thin gold double-rules, with a soft gold radial glow behind. */}
        <div
          className="skillies-bot-museum"
          style={{
            marginTop: 80,
            position: "relative",
            textAlign: "center",
            paddingTop: 64,
            paddingBottom: 64,
          }}
        >
          {/* Gold radial glow */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(230,193,120,0.20), rgba(230,193,120,0) 65%)",
              pointerEvents: "none",
            }}
          />

          {/* Top double-rule */}
          <div
            aria-hidden
            style={{
              position: "relative",
              maxWidth: 720,
              margin: "0 auto 36px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: 1,
                background: GOLD_LIGHT,
                opacity: 0.7,
              }}
            />
            <div
              style={{
                width: "100%",
                height: 1,
                background: GOLD_LIGHT,
                opacity: 0.35,
                marginTop: 4,
              }}
            />
          </div>

          {/* Caption above number */}
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: GOLD_LIGHT,
              fontWeight: 700,
              margin: "0 0 18px",
              position: "relative",
            }}
          >
            WhatsApp · live now
          </p>

          {/* The number itself · 110-130pt italic Instrument Serif */}
          <p
            className="skillies-bot-number"
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(56px, 11vw, 130px)",
              color: "white",
              margin: 0,
              letterSpacing: "-0.025em",
              lineHeight: 1.0,
              position: "relative",
              textShadow: "0 0 80px rgba(230,193,120,0.25)",
            }}
          >
            {BOT_NUMBER_DISPLAY}
          </p>

          {/* Italic single-line below number */}
          <p
            style={{
              marginTop: 28,
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(17px, 1.6vw, 22px)",
              color: GOLD_LIGHT,
              letterSpacing: "-0.01em",
              lineHeight: 1.5,
              position: "relative",
              maxWidth: 720,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            replies in seconds · Malayalam-aware · books your call only if you fit
          </p>

          {/* Bottom double-rule */}
          <div
            aria-hidden
            style={{
              position: "relative",
              maxWidth: 720,
              margin: "44px auto 0",
            }}
          >
            <div
              style={{
                width: "100%",
                height: 1,
                background: GOLD_LIGHT,
                opacity: 0.35,
              }}
            />
            <div
              style={{
                width: "100%",
                height: 1,
                background: GOLD_LIGHT,
                opacity: 0.7,
                marginTop: 4,
              }}
            />
          </div>

          {/* Big red CTA */}
          <a
            href={WHATSAPP_GENERIC}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: 48,
              padding: "24px 44px",
              background: RED,
              color: "white",
              textDecoration: "none",
              borderRadius: 999,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "0.02em",
              boxShadow:
                "0 30px 70px rgba(198,40,40,0.55), 0 6px 18px rgba(198,40,40,0.45)",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              position: "relative",
            }}
          >
            Open chat on WhatsApp
            <svg
              width="20"
              height="20"
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

        {/* Lower line · boardroom alternative */}
        <p
          style={{
            marginTop: 56,
            fontSize: 14,
            color: "rgba(255,255,255,0.55)",
            fontStyle: "italic",
            fontFamily: "'Instrument Serif', serif",
            lineHeight: 1.6,
            maxWidth: 720,
            margin: "56px auto 0",
            textAlign: "center",
          }}
        >
          Boardroom alternative · save{" "}
          <span style={{ color: GOLD_LIGHT, fontStyle: "normal" }}>
            {BOT_NUMBER_DISPLAY}
          </span>{" "}
          and message us when you&rsquo;re ready. The bot reads context from
          your first message — give it your business name and the problem
          you&rsquo;re trying to solve.
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 760px) {
              .skillies-bot-museum {
                padding-top: 40px !important;
                padding-bottom: 40px !important;
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
      a: "Setup runs in the first 30 days — your Front Desk goes live, your voice model trains, the first reels start shipping. From day 30 onwards both systems run daily. You&rsquo;ll see missed leads recovered, reply times drop, and three reels going live every day under your name.",
    },
    {
      q: "What&rsquo;s the refund or pause policy?",
      a: "Every install ships with a 30-day pilot. If the systems aren&rsquo;t earning their keep for your business, you can pause maintenance without penalty — no questions, no contract trap. The setup fee is non-refundable once the install is live, but you keep what we built. Specifics depend on your scope — the AI front desk will walk you through exact terms before you commit.",
    },
    {
      q: "Do I have to do both systems? Can I take only the Front Desk?",
      a: "The two together is the unfair combination — answers in front, content out back. If you only want one, we&rsquo;ll quote it standalone, but the per-system economics are different. Easiest path: message the AI front desk and tell it which system you&rsquo;re interested in. It&rsquo;ll ask three questions and quote you on the spot.",
    },
    {
      q: "What if my staff can&rsquo;t use new technology?",
      a: "That&rsquo;s a great fit for us — not a problem. We train on-site. Most Skillies systems show the owner / staff exactly one dashboard and one daily WhatsApp message. Your team doesn&rsquo;t need to &ldquo;learn AI.&rdquo; They just read the message.",
    },
    {
      q: "What don&rsquo;t you do?",
      a: "We don&rsquo;t build medical-diagnosis bots, legal-advice bots, tax / visa / immigration bots, or &ldquo;ask me anything&rdquo; customer chatbots. We don&rsquo;t do bulk WhatsApp spam. We don&rsquo;t scrape other platforms for data. We don&rsquo;t train custom Malayalam LLMs from scratch — we use what&rsquo;s already great and layer your business logic on top.",
    },
  ];
  return (
    <section
      style={{
        padding: "120px 24px",
        background: CREAM,
        color: CHARCOAL,
        borderTop: `1px solid rgba(201,162,78,0.22)`,
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

        <div className="skillies-faq-list" style={{ display: "flex", flexDirection: "column" }}>
          {faqs.map((f, i) => (
            <details
              key={i}
              className="skillies-faq-row"
              style={{
                padding: "30px 4px",
                borderTop: `1px solid rgba(201,162,78,0.28)`,
                borderBottom:
                  i === faqs.length - 1
                    ? `1px solid rgba(201,162,78,0.28)`
                    : "none",
                transition: "background 200ms ease",
              }}
            >
              <summary
                style={{
                  listStyle: "none",
                  cursor: "pointer",
                  display: "grid",
                  gridTemplateColumns: "minmax(78px, 14%) 1fr auto",
                  alignItems: "baseline",
                  gap: 28,
                }}
              >
                <span
                  className="skillies-faq-num"
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 56,
                    color: GOLD,
                    letterSpacing: "-0.03em",
                    lineHeight: 0.9,
                    transition: "color 220ms ease, font-size 220ms ease, transform 220ms ease",
                    transformOrigin: "left center",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="skillies-faq-q"
                  style={{
                    fontSize: 21,
                    fontWeight: 600,
                    color: CHARCOAL,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                    transition: "color 220ms ease",
                  }}
                  dangerouslySetInnerHTML={{ __html: f.q }}
                />
                <span
                  className="skillies-faq-mark"
                  style={{
                    fontSize: 30,
                    fontWeight: 300,
                    color: RED,
                    lineHeight: 1,
                    flexShrink: 0,
                    transition: "transform 240ms ease",
                  }}
                >
                  +
                </span>
              </summary>
              <p
                className="skillies-faq-a"
                style={{
                  marginTop: 18,
                  marginLeft: "calc(14% + 28px)",
                  fontSize: 15.5,
                  color: "#4B5563",
                  lineHeight: 1.75,
                  maxWidth: 720,
                }}
                dangerouslySetInnerHTML={{ __html: f.a }}
              />
            </details>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .skillies-faq-row:hover { background: rgba(26,26,26,0.025); }
            .skillies-faq-row:hover .skillies-faq-num {
              color: ${RED};
              transform: scale(1.08);
            }
            .skillies-faq-row:hover .skillies-faq-q { color: ${RED}; }
            .skillies-faq-row[open] .skillies-faq-mark { transform: rotate(45deg); }
            .skillies-faq-row[open] .skillies-faq-num { color: ${RED}; }
            @media (max-width: 640px) {
              .skillies-faq-row summary { grid-template-columns: 56px 1fr auto !important; gap: 14px !important; }
              .skillies-faq-row .skillies-faq-num { font-size: 36px !important; }
              .skillies-faq-row .skillies-faq-q { font-size: 17px !important; }
              .skillies-faq-row .skillies-faq-a { margin-left: 70px !important; }
            }
          `,
        }}
      />
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
        padding: "180px 24px 160px",
        background: `radial-gradient(ellipse at 50% 50%, rgba(198,40,40,0.2), transparent 60%), ${CHARCOAL}`,
        color: "white",
        textAlign: "center",
        borderTop: `1px solid rgba(201,162,78,0.18)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>
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
          § One door in
        </p>

        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(56px, 7.4vw, 116px)",
            fontWeight: 400,
            letterSpacing: "-0.035em",
            lineHeight: 0.95,
            margin: "0 auto 32px",
            maxWidth: 980,
          }}
        >
          Two systems.{" "}
          <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>
            One operator.
          </em>
        </h2>

        <p
          style={{
            fontSize: 19,
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.65,
            margin: "0 auto 56px",
            maxWidth: 820,
          }}
        >
          The next step is to talk to the AI front desk on WhatsApp. It will
          scope your business, quote you, and book the install call with Ehsan
          if you&rsquo;re a fit. Same system we install for clients.
        </p>

        {/* Big-number stat band · the page's closing argument as design.
            Lifted from existing copy: 25 students, 1 month, 10+ books. */}
        <div
          className="skillies-final-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            margin: "0 auto 72px",
            maxWidth: 920,
            padding: "40px 0",
            borderTop: `1px solid rgba(201,162,78,0.32)`,
            borderBottom: `1px solid rgba(201,162,78,0.32)`,
          }}
        >
          {[
            { big: "1", unit: "month", line: "to live · pilot starts day one" },
            { big: "3", unit: "reels/day", line: "shipped · automated · in your voice" },
            { big: "₹1L", unit: "guarantee", line: "outcome-backed · pause without penalty" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                borderLeft:
                  i === 0
                    ? "none"
                    : "1px solid rgba(201,162,78,0.22)",
              }}
              className="skillies-final-stat"
            >
              <p
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(56px, 7vw, 110px)",
                  color: GOLD_LIGHT,
                  margin: 0,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.9,
                }}
              >
                {s.big}
                <span
                  style={{
                    fontSize: "0.28em",
                    color: "rgba(255,255,255,0.7)",
                    marginLeft: 6,
                    fontStyle: "normal",
                    letterSpacing: "0.01em",
                  }}
                >
                  {s.unit}
                </span>
              </p>
              <p
                style={{
                  fontSize: 12.5,
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.5,
                  margin: "10px auto 0",
                  maxWidth: 220,
                  letterSpacing: "0.02em",
                }}
              >
                {s.line}
              </p>
            </div>
          ))}
        </div>

        <a
          href={WHATSAPP_GENERIC}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "26px 48px",
            background: RED,
            color: "white",
            textDecoration: "none",
            borderRadius: 999,
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: "0.02em",
            boxShadow:
              "0 30px 70px rgba(198,40,40,0.55), 0 6px 18px rgba(198,40,40,0.45)",
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          Open chat on WhatsApp · {BOT_NUMBER_DISPLAY}
          <svg
            width="20"
            height="20"
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

        {/* gold ornament under the CTA */}
        <div
          aria-hidden
          style={{
            margin: "56px auto 0",
            width: 96,
            height: 1,
            background: `linear-gradient(to right, transparent, ${GOLD_LIGHT}, transparent)`,
          }}
        />
        <p
          style={{
            marginTop: 28,
            fontSize: 14,
            color: "rgba(255,255,255,0.5)",
            fontStyle: "italic",
            fontFamily: "'Instrument Serif', serif",
            lineHeight: 1.6,
            letterSpacing: "-0.005em",
          }}
        >
          — Ehsan Asgar · Skillies AI Business Lab · Malappuram, Kerala
          <br />
          <span
            style={{
              fontSize: 14,
              color: GOLD_LIGHT,
              opacity: 0.85,
            }}
          >
            AI service venam engil Skillies. AI business-il implement cheyyanam
            engil Skillies.
          </span>
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 760px) {
              .skillies-final-stats {
                grid-template-columns: 1fr !important;
                gap: 32px !important;
                padding: 32px 0 !important;
              }
              .skillies-final-stat {
                border-left: none !important;
                padding-bottom: 28px;
                border-bottom: 1px solid rgba(201,162,78,0.18);
              }
              .skillies-final-stat:last-child {
                border-bottom: none;
                padding-bottom: 0;
              }
            }
          `,
        }}
      />
    </section>
  );
}
