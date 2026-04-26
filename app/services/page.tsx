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
const WHATSAPP_CONTENT =
  "https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20interested%20in%20the%20Skillies%20AI%20Content%20Engine.%20My%20business%20is%20";
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
      <ContentEngine />
      <Proof />
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
          Two systems. One operator. Built for{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontStyle: "italic",
              color: GOLD_LIGHT,
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
            See the two systems →
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
                padding: "28px 30px",
                borderRadius: 20,
                background: `linear-gradient(135deg, rgba(198,40,40,0.08), rgba(198,40,40,0.02))`,
                border: "1px solid rgba(198,40,40,0.22)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: RED,
                  fontWeight: 700,
                  margin: "0 0 8px",
                }}
              >
                The unfair part
              </p>
              <p
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 26,
                  fontWeight: 400,
                  color: CHARCOAL,
                  margin: "0 0 10px",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.2,
                }}
              >
                <em style={{ fontStyle: "italic" }}>
                  90 reels a month — without you ever opening a timeline.
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
  type Tier = {
    name: string;
    note: string;
    setup: string;
    monthly: string;
    monthlyLabel: string;
    blurb: string;
    inside: string[];
    accent: string;
    featured: boolean;
  };
  const tiers: Tier[] = [
    {
      name: "Base Pack",
      note: "Two systems · low-mid volume",
      setup: "₹70,000",
      monthly: "₹25,000",
      monthlyLabel: "/ month",
      blurb:
        "Front Desk + Content Engine, fully installed. The floor — the only number we put a sticker on.",
      inside: [
        "AI Front Desk · WhatsApp, calls, follow-ups, daily owner report",
        "AI Content Engine · 3 reels per day, in your voice",
        "Setup, training, and 30-day pilot included",
        "Cancel maintenance any month, no penalty",
      ],
      accent: GOLD_LIGHT,
      featured: true,
    },
    {
      name: "Growth",
      note: "Two systems · scaling volume",
      setup: "Custom quote",
      monthly: "Custom quote",
      monthlyLabel: "",
      blurb:
        "Same two systems — priced for higher conversation volume on the Front Desk and bigger content output (more languages, more clips, paid-ad-ready).",
      inside: [
        "Higher WhatsApp / call concurrency",
        "Multi-language content (Malayalam + English + Manglish)",
        "Ad-ready clip cuts + thumbnails",
        "Weekly reporting cadence",
      ],
      accent: GOLD,
      featured: false,
    },
    {
      name: "Operator",
      note: "Multi-location · multi-founder",
      setup: "Custom quote",
      monthly: "Custom quote",
      monthlyLabel: "",
      blurb:
        "For groups running multiple branches or multiple founders on the Content Engine. Embedded support and a dedicated operator on our side.",
      inside: [
        "Multiple locations / multiple WhatsApp lines",
        "Multiple founder voice models",
        "Dedicated Skillies operator",
        "Quarterly business review",
      ],
      accent: RED,
      featured: false,
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
          § Pricing · two systems, one base pack
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
          One floor.{" "}
          <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>
            Scales with the work.
          </em>
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.62)",
            maxWidth: 760,
            lineHeight: 1.65,
            margin: "0 0 56px",
          }}
        >
          The Base Pack is{" "}
          <strong style={{ color: "white" }}>₹70,000 setup</strong> +{" "}
          <strong style={{ color: "white" }}>₹25,000 / month</strong> — both
          systems, fully installed and maintained. The monthly is a floor.
          As your conversation volume on the Front Desk and your content
          volume on the Engine grow, maintenance scales up. We&rsquo;ll
          quote that exactly when we know your numbers.
        </p>

        <div
          className="skillies-pricing-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {tiers.map((t) => (
            <article
              key={t.name}
              style={{
                padding: "34px 30px 32px",
                borderRadius: 22,
                background: t.featured
                  ? "rgba(230,193,120,0.06)"
                  : "rgba(255,255,255,0.03)",
                border: t.featured
                  ? "1px solid rgba(230,193,120,0.35)"
                  : "1px solid rgba(255,255,255,0.08)",
                position: "relative",
                boxShadow: t.featured
                  ? "0 30px 60px rgba(0,0,0,0.35)"
                  : "0 18px 40px rgba(0,0,0,0.18)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: t.accent,
                  borderTopLeftRadius: 22,
                  borderTopRightRadius: 22,
                }}
              />
              {t.featured && (
                <span
                  style={{
                    position: "absolute",
                    top: -12,
                    right: 22,
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: DARK,
                    background: GOLD_LIGHT,
                    padding: "5px 12px",
                    borderRadius: 999,
                    fontWeight: 800,
                  }}
                >
                  Start here
                </span>
              )}
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: t.accent,
                  fontWeight: 700,
                  margin: "0 0 10px",
                }}
              >
                {t.note}
              </p>
              <h3
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: "white",
                  margin: "0 0 18px",
                }}
              >
                {t.name}
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  marginBottom: 18,
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 700,
                      marginRight: 10,
                    }}
                  >
                    Setup
                  </span>
                  <span
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontSize: 26,
                      fontWeight: 400,
                      color: "white",
                      letterSpacing: "-0.015em",
                      lineHeight: 1.1,
                    }}
                  >
                    {t.setup}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 700,
                      marginRight: 10,
                    }}
                  >
                    Maintenance
                  </span>
                  <span
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontSize: 26,
                      fontWeight: 400,
                      color: "white",
                      letterSpacing: "-0.015em",
                      lineHeight: 1.1,
                    }}
                  >
                    {t.monthly}
                  </span>
                  {t.monthlyLabel && (
                    <span
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.55)",
                        marginLeft: 4,
                      }}
                    >
                      {t.monthlyLabel}
                    </span>
                  )}
                </div>
              </div>

              <p
                style={{
                  fontSize: 14.5,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.6,
                  margin: "0 0 18px",
                  fontStyle: "italic",
                  fontFamily: "'Instrument Serif', serif",
                }}
              >
                {t.blurb}
              </p>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  flex: 1,
                }}
              >
                {t.inside.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 13.5,
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
                        background: t.accent,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href={WHATSAPP_GENERIC}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "16px 22px",
                  background: t.featured ? RED : "transparent",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: 999,
                  fontSize: 14.5,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  border: t.featured
                    ? "none"
                    : "1.5px solid rgba(255,255,255,0.22)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  textAlign: "center",
                  boxShadow: t.featured
                    ? "0 16px 36px rgba(198,40,40,0.32)"
                    : "none",
                }}
              >
                {t.featured ? "Start with the Base Pack" : "Get a custom quote"}
                <svg
                  width="14"
                  height="14"
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
            </article>
          ))}
        </div>

        <p
          style={{
            marginTop: 32,
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
            fontStyle: "italic",
            fontFamily: "'Instrument Serif', serif",
            maxWidth: 800,
            lineHeight: 1.6,
          }}
        >
          Every number above excludes direct WhatsApp Business API fees,
          third-party tool subscriptions (Twilio, OpenAI, content-tooling
          credits, etc.), and GST. Those pass through at cost on your
          monthly invoice.
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 960px) {
              .skillies-pricing-grid {
                grid-template-columns: 1fr !important;
                gap: 18px !important;
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
      a: "The Base Pack ships with a 30-day pilot. If after 30 days the systems aren&rsquo;t earning their keep for your business, you can pause maintenance without penalty — no questions, no contract trap. The ₹70K setup is non-refundable once the install is live, but you keep what we built.",
    },
    {
      q: "Do I have to do both systems? Can I take only the Front Desk?",
      a: "The Base Pack is priced as the two together because that&rsquo;s the unfair combination — answers in front, content out back. If you only want one, we&rsquo;ll quote it standalone, but the per-system economics are different. Talk to us about what fits.",
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
