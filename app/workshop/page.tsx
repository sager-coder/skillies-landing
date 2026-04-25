import Link from "next/link";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";
import WorkshopReserveButton from "@/components/workshop/WorkshopReserveButton";
import { DEFAULT_WORKSHOP } from "@/components/workshop/workshops";

export const metadata = {
  title: "The Skillies Workshop · May 17 · Malappuram · 70 seats",
  description:
    "One day. Malappuram Expo. ₹1,999 early bird · ₹2,499 regular. Live KDP walkthrough with Ehsan + selection day for the 25-student Skillies Batch. 70 seats only. Sunday, May 17, 2026.",
  openGraph: {
    title: "The Skillies Workshop · May 17 · Malappuram",
    description:
      "₹1,999 early bird · ₹2,499 regular · 70 seats. Live KDP day in Malappuram. Selection event for the 25-student Skillies Batch.",
  },
};

// Razorpay reservation lives inside <WorkshopReserveButton>. WhatsApp
// fallback is still available via the floating button on every page —
// useful for users who hit a payment issue or want to ask a question
// before paying.

const DARK = "#0F0F0F";
const CHARCOAL = "#1A1A1A";
const CREAM = "#FAF5EB";
const RED = "#C62828";
const GOLD = "#C9A24E";
const GOLD_LIGHT = "#E6C178";

/* ═══════════════════════════════════════════════════════════════════════ */
/* PREMIUM ICON SET · custom inline SVG · no third-party dependency        */
/* Each icon: 24x24 viewBox · 1.5px stroke · stroke-currentColor           */
/* Replace ALL emoji on the page with these for a sharper editorial look.  */
/* ═══════════════════════════════════════════════════════════════════════ */

type IconName =
  | "book"
  | "layout"
  | "fork"
  | "frame"
  | "chat"
  | "ticket"
  | "books"
  | "star"
  | "stamp";

function Icon({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth = 1.5,
}: {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const baseProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "book":
      // Open book · two pages
      return (
        <svg {...baseProps} aria-hidden>
          <path d="M3 4.5h7a3 3 0 0 1 3 3v13.5" />
          <path d="M21 4.5h-7a3 3 0 0 0-3 3v13.5" />
          <path d="M3 4.5v14a1.5 1.5 0 0 0 1.5 1.5H10" />
          <path d="M21 4.5v14a1.5 1.5 0 0 1-1.5 1.5H14" />
        </svg>
      );
    case "layout":
      // Two-column layout grid
      return (
        <svg {...baseProps} aria-hidden>
          <rect x="3.5" y="3.5" width="7" height="17" rx="1.5" />
          <rect x="13.5" y="3.5" width="7" height="9" rx="1.5" />
          <rect x="13.5" y="14.5" width="7" height="6" rx="1.5" />
        </svg>
      );
    case "fork":
      // Fork + knife crossed
      return (
        <svg {...baseProps} aria-hidden>
          <path d="M7 3v8a2 2 0 0 0 2 2v8" />
          <path d="M9 3v8" />
          <path d="M11 3v8" />
          <path d="M16.5 3c-1.5 1.5-2 4-2 6.5 0 1.5 1 2.5 2 2.5v9" />
        </svg>
      );
    case "frame":
      // Picture frame with inner image marks (mountains)
      return (
        <svg {...baseProps} aria-hidden>
          <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
          <circle cx="8.5" cy="9" r="1.5" />
          <path d="M3.5 17l5-5 4 4 5-5 3 3" />
        </svg>
      );
    case "chat":
      // Speech bubble
      return (
        <svg {...baseProps} aria-hidden>
          <path d="M21 12a8 8 0 0 1-12.5 6.6L3.5 20l1.4-5A8 8 0 1 1 21 12z" />
          <circle cx="9" cy="12" r="0.6" fill={color} stroke="none" />
          <circle cx="12" cy="12" r="0.6" fill={color} stroke="none" />
          <circle cx="15" cy="12" r="0.6" fill={color} stroke="none" />
        </svg>
      );
    case "ticket":
      // Admission ticket with center perforation
      return (
        <svg {...baseProps} aria-hidden>
          <path d="M3 9a2 2 0 0 0 0 4v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0 0-4V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
          <path d="M13 5v3" />
          <path d="M13 11v3" />
          <path d="M13 17v3" />
        </svg>
      );
    case "books":
      // Stack of three books
      return (
        <svg {...baseProps} aria-hidden>
          <rect x="3.5" y="6.5" width="4" height="14" rx="1" />
          <rect x="9" y="3.5" width="4" height="17" rx="1" />
          <path d="M14.5 8l4-1 2 12.5-4 1z" />
          <path d="M5.5 10h0M11 7h0M16 11l3-0.7" stroke={color} />
        </svg>
      );
    case "star":
      // 4-point compass star · sharper than the standard 5-point
      return (
        <svg {...baseProps} aria-hidden>
          <path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z" fill={color} />
        </svg>
      );
    case "stamp":
      // Hexagonal seal/stamp with star center
      return (
        <svg {...baseProps} aria-hidden>
          <path d="M12 2l8.66 5v10L12 22l-8.66-5V7z" />
          <path d="M12 8l1.5 3 3 0.5-2.25 2 0.5 3.25L12 15l-2.75 1.75 0.5-3.25L7.5 11.5l3-0.5z" fill={color} />
        </svg>
      );
  }
}

export default function WorkshopPage() {
  return (
    <main style={{ background: DARK, color: "white" }}>
      <TopNav cta={{ href: "#reserve", label: "Reserve · ₹1,999" }} />

      <Hero />
      <TicketStub />
      <BookGallery />
      <Outcomes />
      <Wedge />
      <DayStructure />
      <Proof />
      <Selection />
      <Pricing />
      <Logistics />
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
        background: `radial-gradient(ellipse at 12% 22%, rgba(198,40,40,0.18), transparent 55%), radial-gradient(ellipse at 88% 78%, rgba(230,193,120,0.14), transparent 55%), ${DARK}`,
        overflow: "hidden",
      }}
    >
      {/* Subtle grain · adds texture without dominating */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          mixBlendMode: "overlay",
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='13'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        }}
      />

      {/* Massive decorative "70" numeral · sits behind everything */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-2%",
          top: "30%",
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontStyle: "italic",
          fontSize: "clamp(280px, 40vw, 580px)",
          fontWeight: 400,
          color: "rgba(230,193,120,0.04)",
          letterSpacing: "-0.05em",
          lineHeight: 0.85,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        70
      </div>

      {/* Decorative line ornament · top-left */}
      <svg
        aria-hidden
        width="180"
        height="180"
        viewBox="0 0 180 180"
        style={{
          position: "absolute",
          left: -40,
          top: 80,
          opacity: 0.18,
          pointerEvents: "none",
        }}
      >
        <circle cx="90" cy="90" r="80" stroke={GOLD} strokeWidth="0.5" fill="none" />
        <circle cx="90" cy="90" r="60" stroke={GOLD} strokeWidth="0.5" fill="none" />
        <circle cx="90" cy="90" r="40" stroke={GOLD} strokeWidth="0.5" fill="none" />
      </svg>

      <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
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
          <span>§ The Skillies Workshop</span>
          <span
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)", minWidth: 30 }}
          />
          <span>Sun · May 17 · Malappuram Expo · 70 seats</span>
        </div>

        <div
          className="skillies-hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr 1fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          {/* LEFT · headline + copy */}
          <div>
            <h1
              style={{
                margin: 0,
                fontWeight: 900,
                fontSize: "clamp(56px, 8vw, 128px)",
                letterSpacing: "-0.045em",
                lineHeight: 0.92,
                color: "white",
              }}
            >
              One day.
              <br />
              <em
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: GOLD_LIGHT,
                  display: "inline-block",
                  marginTop: "0.04em",
                }}
              >
                Selection day.
              </em>
            </h1>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(22px, 2.4vw, 32px)",
                color: "rgba(255,255,255,0.7)",
                margin: "20px 0 0",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              For the Skillies Batch ·{" "}
              <span style={{ color: "white", fontStyle: "normal", fontFamily: "Arial, sans-serif", fontWeight: 800 }}>
                ₹1,999
              </span>
            </p>

            <p
              style={{
                fontSize: 19,
                color: "rgba(255,255,255,0.75)",
                margin: "32px 0 22px",
                lineHeight: 1.6,
                maxWidth: 580,
              }}
            >
              70 people. Six hours. Live with Ehsan in one room. You build a
              real KDP book + cover before the day ends — and at sunset, 25 of you
              walk out invited to apply for the Skillies Batch (₹50,000 + ISA).
            </p>

            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: 22,
                color: GOLD_LIGHT,
                margin: "0 0 40px",
                lineHeight: 1.4,
                maxWidth: 580,
              }}
            >
              Even the 45 we don&rsquo;t pick walk out with a published book and
              the playbook. Nobody loses their day.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="#reserve"
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
                Reserve Early Bird · ₹1,999
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
                href="/program"
                style={{
                  padding: "20px 28px",
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
                See the Batch →
              </Link>
            </div>
          </div>

          {/* RIGHT · stylised book stack visual */}
          <BookStackVisual />
        </div>

        {/* Numbers row */}
        <div
          style={{
            marginTop: 80,
            padding: "26px 30px",
            borderRadius: 18,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 22,
          }}
          className="skillies-workshop-numbers"
        >
          {[
            { n: "70", l: "seats · only · ever for May 17" },
            { n: "₹1,999", l: "early bird · first 25 seats" },
            { n: "1 book", l: "live published · before you leave" },
            { n: "25", l: "selected for the Batch · same day" },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                borderLeft:
                  i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                paddingLeft: i === 0 ? 0 : 20,
              }}
            >
              <p
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 30,
                  fontWeight: 400,
                  color: "white",
                  margin: "0 0 4px",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.05,
                }}
              >
                {t.n}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.55)",
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
            @media (max-width: 960px) {
              .skillies-hero-grid {
                grid-template-columns: 1fr !important;
                gap: 48px !important;
              }
            }
            @media (max-width: 860px) {
              .skillies-workshop-numbers {
                grid-template-columns: 1fr 1fr !important;
                gap: 14px !important;
              }
              .skillies-workshop-numbers > div {
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
/* WEDGE                                                                    */
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
          § What this is · what it isn&rsquo;t
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.6vw, 76px)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.02,
            margin: "0 0 36px",
            color: CHARCOAL,
          }}
        >
          This isn&rsquo;t a course.
          <br />
          <em style={{ fontStyle: "italic", color: RED }}>
            It&rsquo;s the door to the Batch.
          </em>
        </h2>

        <p
          style={{
            fontSize: 18,
            color: "#4B5563",
            lineHeight: 1.7,
            margin: "0 0 36px",
            maxWidth: 800,
          }}
        >
          We don&rsquo;t sell ₹999 weekend workshops anymore. The May 17 day
          isn&rsquo;t a product — it&rsquo;s the way we choose the 25 people
          we&rsquo;ll partner with for the next 6 months. You come, you
          learn, you publish a real book, you show us how you work — and
          we either offer you a Batch seat by sunset or we don&rsquo;t.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 36,
          }}
          className="skillies-workshop-wedge"
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
              What this isn&rsquo;t
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
              <li>A complete &ldquo;learn KDP in one day&rdquo; course</li>
              <li>An online watch-along webinar</li>
              <li>A pitch session for an upsell course</li>
              <li>Refundable</li>
              <li>Repeated · just attend a future date if you miss</li>
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
              What this is
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
              <li>An honest 6-hour day · live, in-person, in Malappuram</li>
              <li>Your first real published KDP book before sunset</li>
              <li>The selection day for 25 Batch seats</li>
              <li>Yours: the playbook + book, regardless of selection</li>
              <li>One-shot · no refund · no rescheduling guaranteed</li>
            </ul>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 760px) {
              .skillies-workshop-wedge {
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
/* DAY STRUCTURE                                                            */
/* ═══════════════════════════════════════════════════════════════════════ */

function DayStructure() {
  const blocks: { time: string; icon: IconName; title: string; body: string }[] = [
    {
      time: "10:00 – 11:30",
      icon: "book",
      title: "Build the book · Part 1",
      body: "We open Claude together. You see exactly the prompts Ehsan uses to generate spot-the-difference scenes for a real KDP book. By 11:30 the interior is taking shape on your laptop.",
    },
    {
      time: "11:30 – 13:00",
      icon: "layout",
      title: "Build the book · Part 2",
      body: "Canva for layout. We arrange the scenes, fix margins, set page count, and you walk into lunch with a print-ready paperback interior on your screen.",
    },
    {
      time: "13:00 – 14:00",
      icon: "fork",
      title: "Lunch · Included",
      body: "Skillies hosts. Food, conversation, you start meeting the others in the room. Some of these people will be in the Batch with you.",
    },
    {
      time: "14:00 – 15:30",
      icon: "frame",
      title: "Cover · Designed in the room",
      body: "AI image prompts for the front cover. Canva for typography and back cover. We work cover by cover, table by table — Ehsan reviewing yours alongside the others until each one looks Amazon-thumbnail-good.",
    },
    {
      time: "15:30 – 16:30",
      icon: "chat",
      title: "Q&A · Open table",
      body: "Bring every question you&rsquo;ve been holding. Ehsan answers everything live: scaling from 1 book to 100, account safety, royalties, multi-region publishing, what the Batch actually looks like.",
    },
    {
      time: "16:30 – 17:00",
      icon: "ticket",
      title: "Selection · The 25",
      body: "Closed-door review. Ehsan picks up to 25 people for the Batch based on the work he saw, the questions you asked, and the fit he felt. Selected attendees get a printed offer letter on the way out. Unselected attendees get the playbook PDF and the priority list for the next workshop.",
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
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
          § The day · 10 AM to 5 PM
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.5vw, 72px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 22px",
            maxWidth: 920,
          }}
        >
          Six hours of real work.{" "}
          <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>
            One book at the end.
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
          We don&rsquo;t do slides. We don&rsquo;t do &ldquo;module
          theory.&rdquo; We do the work, with you, in the room. Bring your
          laptop. Bring your PAN card. Bring your patience.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {blocks.map((b, i) => (
            <article
              key={i}
              style={{
                padding: "32px 0",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                borderBottom:
                  i === blocks.length - 1
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
                display: "grid",
                gridTemplateColumns: "70px 200px 1fr",
                gap: 28,
                alignItems: "start",
              }}
              className="skillies-day-row"
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: "rgba(230,193,120,0.08)",
                  border: "1px solid rgba(230,193,120,0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: GOLD_LIGHT,
                }}
              >
                <Icon name={b.icon} size={26} strokeWidth={1.4} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.45)",
                    fontWeight: 700,
                    margin: "0 0 6px",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} of 06
                </p>
                <p
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: 22,
                    color: GOLD_LIGHT,
                    margin: 0,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.1,
                  }}
                >
                  {b.time}
                </p>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "white",
                    margin: "0 0 10px",
                    letterSpacing: "-0.015em",
                  }}
                >
                  {b.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                  dangerouslySetInnerHTML={{ __html: b.body }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 860px) {
              .skillies-day-row {
                grid-template-columns: auto 1fr !important;
                gap: 18px !important;
                align-items: center !important;
              }
              .skillies-day-row > div:nth-child(2) {
                grid-column: 2 !important;
              }
              .skillies-day-row > div:nth-child(3) {
                grid-column: 1 / -1 !important;
                margin-top: 4px !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* SELECTION                                                                */
/* ═══════════════════════════════════════════════════════════════════════ */

function Selection() {
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
            margin: "0 0 16px",
          }}
        >
          § What happens after the day
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.5vw, 68px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 32px",
            color: CHARCOAL,
          }}
        >
          25 of you get the offer.{" "}
          <em style={{ fontStyle: "italic", color: RED }}>
            45 of you keep the playbook.
          </em>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
          className="skillies-selection-paths"
        >
          <article
            style={{
              padding: "32px 30px 36px",
              borderRadius: 18,
              background: "rgba(61,90,61,0.08)",
              border: "1px solid rgba(122,154,122,0.32)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#3D5A3D",
                fontWeight: 700,
                margin: "0 0 14px",
              }}
            >
              ✓ If selected (25 of 70)
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                fontSize: 15,
                color: CHARCOAL,
                lineHeight: 1.6,
              }}
            >
              <li>
                Printed offer letter handed to you before you leave the room
              </li>
              <li>
                3 days to apply formally — pre-form + 30-min one-on-one with Ehsan
              </li>
              <li>
                If both sides confirm: ₹50,000 enrolment + ISA contract signed
              </li>
              <li>
                Batch starts within 3-4 weeks · 1 month intensive in-person, 2 months earning ramp
              </li>
              <li>
                Lifetime alumni community · first access to every future Skillies course
              </li>
            </ul>
          </article>

          <article
            style={{
              padding: "32px 30px 36px",
              borderRadius: 18,
              background: "rgba(255,255,255,0.65)",
              border: "1px solid rgba(26,26,26,0.10)",
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
              · If not selected (45 of 70)
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                fontSize: 15,
                color: CHARCOAL,
                lineHeight: 1.6,
              }}
            >
              <li>
                Your published KDP book is yours · royalties yours forever
              </li>
              <li>
                The full Skillies playbook PDF · niche, book, cover, upload
              </li>
              <li>
                Priority email list for the next workshop
              </li>
              <li>
                Honest one-line note from Ehsan on why you weren&rsquo;t the fit this time
              </li>
              <li>
                You can apply again at the next workshop — many will
              </li>
            </ul>
          </article>
        </div>

        <p
          style={{
            marginTop: 36,
            fontSize: 14,
            color: "#6B7280",
            fontStyle: "italic",
            fontFamily: "'Instrument Serif', serif",
            lineHeight: 1.7,
            maxWidth: 720,
          }}
        >
          Selection isn&rsquo;t about &ldquo;best&rdquo; vs &ldquo;not good enough.&rdquo;
          It&rsquo;s about who&rsquo;s ready to dedicate one focused month to
          this, who&rsquo;s a fit for the room dynamic, and who Ehsan
          believes he can take past ₹1L+/mo within the year. Some
          excellent humans don&rsquo;t make sense for this Batch — that&rsquo;s OK.
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 760px) {
              .skillies-selection-paths {
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
/* PRICING                                                                  */
/* ═══════════════════════════════════════════════════════════════════════ */

function Pricing() {
  return (
    <section
      id="reserve"
      style={{
        padding: "120px 24px",
        background: DARK,
        color: "white",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: GOLD_LIGHT,
            fontWeight: 700,
            margin: "0 0 16px",
            textAlign: "center",
          }}
        >
          § Reserve your seat · 70 only
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(42px, 5.5vw, 72px)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.02,
            margin: "0 0 24px",
            textAlign: "center",
          }}
        >
          Pick your seat.{" "}
          <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>
            Pay. Show up.
          </em>
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "rgba(255,255,255,0.65)",
            margin: "0 auto 56px",
            maxWidth: 640,
            lineHeight: 1.65,
            textAlign: "center",
          }}
        >
          Once 70 seats are filled, we close registration. No waitlist for
          this date — if it sells out, the next workshop is the next chance.
        </p>

        <div
          className="skillies-pricing-cards"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 22,
            maxWidth: 880,
            margin: "0 auto",
          }}
        >
          {/* EARLY BIRD */}
          <article
            style={{
              padding: "36px 32px 38px",
              borderRadius: 22,
              background:
                "linear-gradient(135deg, rgba(230,193,120,0.12), rgba(230,193,120,0.04))",
              border: "1.5px solid rgba(230,193,120,0.45)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: GOLD_LIGHT,
                color: "#2a1f08",
                fontSize: 10,
                fontWeight: 800,
                padding: "6px 14px",
                borderBottomLeftRadius: 14,
                letterSpacing: "0.22em",
              }}
            >
              FIRST 25
            </div>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: GOLD_LIGHT,
                fontWeight: 700,
                margin: "10px 0 16px",
              }}
            >
              Early bird
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                margin: "0 0 8px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 56,
                  fontWeight: 400,
                  color: "white",
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                }}
              >
                ₹1,999
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "line-through",
                  fontSize: 16,
                }}
              >
                ₹2,499
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.6,
                margin: "0 0 24px",
              }}
            >
              First 25 seats. Same workshop, same room, same selection
              pool — at ₹500 less.
            </p>
            <WorkshopReserveButton
              tier="workshop-early"
              priceLabel="₹1,999"
              label="Grab Early Bird · ₹1,999"
              workshop={DEFAULT_WORKSHOP}
              style={{
                display: "block",
                width: "100%",
                padding: "16px 24px",
                background: GOLD_LIGHT,
                color: "#2a1f08",
                textAlign: "center",
                border: "none",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: "0.02em",
                boxShadow: "0 16px 36px rgba(230,193,120,0.22)",
                cursor: "pointer",
              }}
            />
          </article>

          {/* REGULAR */}
          <article
            style={{
              padding: "36px 32px 38px",
              borderRadius: 22,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.10)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "rgba(255,255,255,0.92)",
                color: CHARCOAL,
                fontSize: 10,
                fontWeight: 800,
                padding: "6px 14px",
                borderBottomLeftRadius: 14,
                letterSpacing: "0.22em",
              }}
            >
              NEXT 45
            </div>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
                fontWeight: 700,
                margin: "10px 0 16px",
              }}
            >
              Regular
            </p>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 56,
                fontWeight: 400,
                color: "white",
                letterSpacing: "-0.025em",
                lineHeight: 1,
                margin: "0 0 8px",
              }}
            >
              ₹2,499
            </p>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.6,
                margin: "0 0 24px",
              }}
            >
              Once Early Bird sells out. Same room, same day, same
              selection. No difference except the price.
            </p>
            <WorkshopReserveButton
              tier="workshop-regular"
              priceLabel="₹2,499"
              label="Reserve Regular · ₹2,499"
              workshop={DEFAULT_WORKSHOP}
              style={{
                display: "block",
                width: "100%",
                padding: "16px 24px",
                background: "transparent",
                color: "white",
                textAlign: "center",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.02em",
                border: "1.5px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
              }}
            />
          </article>
        </div>

        <div
          style={{
            marginTop: 36,
            padding: "20px 24px",
            borderRadius: 14,
            background: "rgba(198,40,40,0.06)",
            border: "1px dashed rgba(198,40,40,0.32)",
            maxWidth: 880,
            margin: "36px auto 0",
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.7,
              margin: 0,
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
            }}
          >
            <strong
              style={{
                color: "#EF6B6B",
                fontStyle: "normal",
                fontFamily: "inherit",
                letterSpacing: "0.02em",
              }}
            >
              No-refund policy:
            </strong>{" "}
            Once your seat is paid for, it&rsquo;s yours and only yours.
            We don&rsquo;t refund cancellations, no-shows, or last-minute
            schedule conflicts. If something genuinely emergency happens,
            we&rsquo;ll discuss transferring your seat to the next workshop —
            but it&rsquo;s discretionary, not a guarantee. Reserve only if
            you&rsquo;re committed.
          </p>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 760px) {
              .skillies-pricing-cards {
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
/* LOGISTICS                                                                */
/* ═══════════════════════════════════════════════════════════════════════ */

function Logistics() {
  const items = [
    {
      t: "Date",
      b: "Sunday · May 17, 2026 · 10 AM – 5 PM (lunch included)",
    },
    {
      t: "Venue",
      b: "Malappuram Expo · address shared on WhatsApp 48 hours before · easy parking · A/C hall",
    },
    {
      t: "Travel",
      b: "Malappuram is 1.5 hr from Calicut, 1 hr from Kondotty / Karipur airport, 3 hr from Kochi. Tirur railway station is 30 min away.",
    },
    {
      t: "What to bring",
      b: "Laptop · PAN card (for KDP setup) · phone · notebook · ₹200 cash for parking / chai",
    },
    {
      t: "Lunch",
      b: "Included in your ticket · Kerala-style sadhya · vegetarian + non-veg options · let us know dietary needs when you reserve",
    },
    {
      t: "Language",
      b: "Workshop runs in Manglish — natural switching between English and Malayalam. Slides + materials in English.",
    },
    {
      t: "Reservation flow",
      b: "Click Reserve · fill name, WhatsApp number, email · pay via Razorpay (UPI / cards / net-banking) · printable ticket on screen + email receipt. Done in under 2 minutes.",
    },
    {
      t: "Capacity & cutoff",
      b: "70 seats · hard cap. Once full, registration closes. We don&rsquo;t squeeze in &ldquo;just one more&rdquo; — the room limit is real.",
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
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
          § Logistics · everything you need
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(38px, 5vw, 60px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 48px",
            color: CHARCOAL,
          }}
        >
          The practical bits.
        </h2>

        <div
          className="skillies-workshop-logistics"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 22,
          }}
        >
          {items.map((it) => (
            <div
              key={it.t}
              style={{
                padding: "26px 28px",
                borderRadius: 16,
                background: "white",
                border: "1px solid rgba(26,26,26,0.08)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: RED,
                  fontWeight: 700,
                  margin: "0 0 10px",
                }}
              >
                {it.t}
              </p>
              <p
                style={{
                  fontSize: 14.5,
                  color: "#4B5563",
                  lineHeight: 1.7,
                  margin: 0,
                }}
                dangerouslySetInnerHTML={{ __html: it.b }}
              />
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 760px) {
              .skillies-workshop-logistics {
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
/* FAQ                                                                      */
/* ═══════════════════════════════════════════════════════════════════════ */

function FAQ() {
  const faqs = [
    {
      q: "What if I don&rsquo;t get selected for the Batch?",
      a: "Then you walk away with: a real KDP book that earns royalties for life, the playbook PDF, alumni email list, and an honest reason from Ehsan on the fit. The day still pays for itself — most ₹35,000 online courses don&rsquo;t teach you to publish a real book in 6 hours.",
    },
    {
      q: "What if I do get selected?",
      a: "You&rsquo;re handed a printed offer letter before you leave. 3 days to apply formally — a short pre-form + a 30-min one-on-one with Ehsan to confirm both sides. If we both say yes, ₹50,000 enrolment fee + ISA contract gets signed. Batch starts within 3-4 weeks.",
    },
    {
      q: "Can I attend without intending to apply for the Batch?",
      a: "Yes. About 1 in 4 attendees come purely for the workshop content — they want to publish their first book and learn the playbook, not commit to 1 month in Malappuram. That&rsquo;s honestly fine. You still get the book, the lunch, the room, the Q&A. Just say so when you reserve.",
    },
    {
      q: "Is the no-refund policy strict?",
      a: "Yes — once paid, your seat is locked in. We don&rsquo;t refund no-shows, last-minute cancellations, or schedule conflicts. The only exception is genuine emergencies, and even then we&rsquo;d discuss transferring your seat to a future workshop · not a refund. Reserve only if you&rsquo;re committed.",
    },
    {
      q: "Do I need a laptop?",
      a: "Yes — bring your own laptop. We&rsquo;re publishing a real book in the room, you&rsquo;ll need to use Claude, Canva, and KDP&rsquo;s upload form. Phone-only won&rsquo;t work for the upload step.",
    },
    {
      q: "Will you publish the same niche / book for everyone?",
      a: "No — we work on YOUR niche, picked from your interests during the morning session. Each attendee leaves with a different book in a different niche. We don&rsquo;t do cookie-cutter — that&rsquo;s why this is in person.",
    },
    {
      q: "Is the workshop recorded?",
      a: "No. This isn&rsquo;t a course — it&rsquo;s a working day. We don&rsquo;t record because the value is in the room, not the playback. The book you publish + the playbook PDF are your takeaways.",
    },
    {
      q: "What language is the workshop in?",
      a: "Manglish — natural switching between English and Malayalam. About 70% English, 30% Malayalam expressions for clarity. Slides, materials, and the playbook PDF are in English.",
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
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
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
          § Honest answers
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5vw, 60px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 48px",
          }}
        >
          What people ask{" "}
          <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>
            before reserving.
          </em>
        </h2>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {faqs.map((f, i) => (
            <details
              key={i}
              style={{
                padding: "22px 4px",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                borderBottom:
                  i === faqs.length - 1
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "none",
              }}
            >
              <summary
                style={{
                  listStyle: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "white",
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
                    color: GOLD_LIGHT,
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
                  color: "rgba(255,255,255,0.65)",
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
/* FINAL CTA                                                                */
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
          § One Sunday · 70 seats · forever changing
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(46px, 5.8vw, 80px)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.0,
            margin: "0 0 28px",
          }}
        >
          Sunday · May 17.{" "}
          <em style={{ fontStyle: "italic", color: "#EF4444" }}>
            Be in the room.
          </em>
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.6,
            margin: "0 0 12px",
          }}
        >
          ₹1,999 if you&rsquo;re in the first 25. ₹2,499 if you&rsquo;re in
          the next 45. Above 70 — see you next workshop.
        </p>
        <p
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.55)",
            fontStyle: "italic",
            fontFamily: "'Instrument Serif', serif",
            margin: "0 0 40px",
            lineHeight: 1.5,
          }}
        >
          Once paid, your seat is locked in · no refunds · come ready to publish.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <WorkshopReserveButton
            tier="workshop-early"
            priceLabel="₹1,999"
            label="Reserve Early Bird · ₹1,999 →"
            workshop={DEFAULT_WORKSHOP}
            style={{
              padding: "20px 32px",
              background: RED,
              color: "white",
              border: "none",
              borderRadius: 999,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: "0.02em",
              boxShadow: "0 20px 50px rgba(198,40,40,0.4)",
              cursor: "pointer",
            }}
          />
          <WorkshopReserveButton
            tier="workshop-regular"
            priceLabel="₹2,499"
            label="Reserve Regular · ₹2,499"
            workshop={DEFAULT_WORKSHOP}
            style={{
              padding: "20px 28px",
              background: "transparent",
              color: "white",
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              border: "1.5px solid rgba(255,255,255,0.22)",
              cursor: "pointer",
            }}
          />
        </div>

        <p
          style={{
            marginTop: 56,
            fontSize: 14,
            color: "rgba(255,255,255,0.45)",
            fontStyle: "italic",
            fontFamily: "'Instrument Serif', serif",
            lineHeight: 1.6,
          }}
        >
          — Ehsan Asgar · Skillies · Malappuram, Kerala
          <br />
          <span style={{ fontSize: 13 }}>
            Sunday · May 17 · 10 AM at Malappuram Expo · 70 seats
          </span>
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* BOOK STACK · hero side visual                                            */
/* ═══════════════════════════════════════════════════════════════════════ */

function BookStackVisual() {
  // Three stylised book covers stacked at slight angles, suggesting
  // "the books you'll publish." Pure CSS / SVG · no external assets.
  return (
    <div
      className="skillies-book-stack"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        maxWidth: 460,
        marginLeft: "auto",
      }}
      aria-hidden
    >
      {/* Glow behind */}
      <div
        style={{
          position: "absolute",
          inset: "10%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(230,193,120,0.35), transparent 60%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Back-most cover · gold-spine edition */}
      <BookCover
        position={{ left: "5%", top: "10%", rotate: -9, z: 1 }}
        width="56%"
        opacity={0.78}
        theme={{
          bg: "linear-gradient(135deg, #2A1F08 0%, #5A3F1A 60%, #3D2C12 100%)",
          ink: "#F0E0B5",
          accent: GOLD_LIGHT,
          border: "rgba(230,193,120,0.32)",
        }}
        kicker="Vol. 02 · Skillies Press"
        title="Coastal Animal Encounters"
        subtitle="Spot the Difference · 50 puzzles"
        author="A Skillies Production"
        seal="No. 42"
      />

      {/* Middle cover · red edition */}
      <BookCover
        position={{ right: "8%", top: "7%", rotate: 8, z: 2 }}
        width="56%"
        opacity={0.88}
        theme={{
          bg: "linear-gradient(135deg, #1A0606 0%, #5C1818 60%, #2C0A0A 100%)",
          ink: "#FCE0E0",
          accent: "#EF6B6B",
          border: "rgba(239,107,107,0.42)",
        }}
        kicker="Vol. 03 · Skillies Press"
        title="The Forest Detective"
        subtitle="Hidden Animals · Easy + Hard"
        author="A Skillies Production"
        seal="No. 51"
      />

      {/* Flagship · cream cover · "Your Book 01" */}
      <BookCover
        position={{ left: "20%", top: "20%", rotate: -2, z: 3 }}
        width="62%"
        opacity={1}
        theme={{
          bg:
            "linear-gradient(135deg, #FCF6E5 0%, #FAF5EB 50%, #EDE2C7 100%)",
          ink: "#1A1A1A",
          accent: RED,
          border: "rgba(26,26,26,0.16)",
        }}
        kicker="Vol. 01 · Skillies Press"
        title="Your Book"
        subtitle="Published live · May 17, 2026"
        author="By you · printed under your name"
        seal="No. 01"
        flagship
      />

      {/* Premium seal · circular embossed-feel stamp */}
      <div
        style={{
          position: "absolute",
          right: "0%",
          bottom: "8%",
          width: 116,
          height: 116,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, #F5DC9A, #D4A65A 60%, #A37226)",
          color: "#2a1f08",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          transform: "rotate(-12deg)",
          boxShadow:
            "0 14px 36px rgba(0,0,0,0.45), inset 0 0 0 2px rgba(255,255,255,0.18), inset 0 0 0 4px rgba(122,72,16,0.5)",
          textAlign: "center",
          fontFamily: "'Instrument Serif', Georgia, serif",
        }}
      >
        <Icon name="stamp" size={22} color="#2a1f08" strokeWidth={1.4} />
        <p
          style={{
            fontSize: 9,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 800,
            margin: "4px 0 0",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Live
        </p>
        <p
          style={{
            fontSize: 9,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 800,
            margin: 0,
            fontFamily: "Arial, sans-serif",
          }}
        >
          Royalties
        </p>
      </div>
    </div>
  );
}

type BookPosition = {
  left?: string;
  right?: string;
  top: string;
  rotate: number;
  z: number;
};

type BookTheme = {
  bg: string;
  ink: string;
  accent: string;
  border: string;
};

/**
 * Premium book-cover element. Three of these stacked at angles compose
 * the hero visual on /workshop. Each cover renders like a real KDP
 * paperback — with kicker, display-serif title, ornament, byline, and
 * edition seal — instead of a placeholder card.
 */
function BookCover({
  position,
  width,
  opacity = 1,
  theme,
  kicker,
  title,
  subtitle,
  author,
  seal,
  flagship = false,
}: {
  position: BookPosition;
  width: string;
  opacity?: number;
  theme: BookTheme;
  kicker: string;
  title: string;
  subtitle: string;
  author: string;
  seal: string;
  flagship?: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: position.left,
        right: position.right,
        top: position.top,
        width,
        aspectRatio: "5 / 7",
        transform: `rotate(${position.rotate}deg)`,
        zIndex: position.z,
        opacity,
        borderRadius: 6,
        background: theme.bg,
        color: theme.ink,
        border: `1px solid ${theme.border}`,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        boxShadow: flagship
          ? "0 60px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(230,193,120,0.18)"
          : "0 32px 60px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}
    >
      {/* Inner double-line frame · classic book-cover ornament */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "10px",
          border: `1px solid ${flagship ? "rgba(26,26,26,0.14)" : "rgba(255,255,255,0.12)"}`,
          borderRadius: 3,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "13px",
          border: `1px solid ${flagship ? "rgba(26,26,26,0.08)" : "rgba(255,255,255,0.06)"}`,
          borderRadius: 2,
          pointerEvents: "none",
        }}
      />

      {/* Top kicker · imprint */}
      <p
        style={{
          fontSize: 9,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: theme.accent,
          fontWeight: 700,
          margin: "8px 0 0",
          position: "relative",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {kicker}
      </p>

      {/* Body · title + subtitle */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
        {/* Decorative ornament · fleur-style center motif */}
        <div
          aria-hidden
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            margin: "0 0 14px",
            opacity: flagship ? 0.7 : 0.55,
          }}
        >
          <span
            style={{
              flex: 1,
              height: 1,
              background: theme.accent,
              maxWidth: 32,
              opacity: 0.5,
            }}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="1.4" strokeLinecap="round">
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" />
          </svg>
          <span
            style={{
              flex: 1,
              height: 1,
              background: theme.accent,
              maxWidth: 32,
              opacity: 0.5,
            }}
          />
        </div>

        <h3
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: flagship ? 26 : 19,
            fontWeight: 400,
            color: theme.ink,
            margin: "0 0 10px",
            letterSpacing: "-0.015em",
            lineHeight: 1.05,
            textAlign: "center",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: flagship ? 11 : 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: flagship ? "rgba(26,26,26,0.55)" : "rgba(255,255,255,0.55)",
            fontWeight: 600,
            margin: 0,
            textAlign: "center",
            lineHeight: 1.4,
            fontFamily: "Arial, sans-serif",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Bottom · byline + seal */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 10,
          borderTop: `1px solid ${flagship ? "rgba(26,26,26,0.12)" : "rgba(255,255,255,0.10)"}`,
          position: "relative",
        }}
      >
        <p
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: flagship ? 11 : 9,
            color: theme.ink,
            opacity: 0.7,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {author}
        </p>
        <span
          style={{
            fontSize: 8,
            letterSpacing: "0.22em",
            color: theme.accent,
            fontWeight: 800,
            fontFamily: "ui-monospace, Menlo, monospace",
            padding: "3px 7px",
            border: `1px solid ${theme.accent}`,
            borderRadius: 999,
            opacity: flagship ? 0.95 : 0.75,
          }}
        >
          {seal}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* OUTCOMES · what you walk out with                                        */
/* ═══════════════════════════════════════════════════════════════════════ */

function Outcomes() {
  const items: { n: string; icon: IconName; title: string; body: string; accent: string }[] = [
    {
      n: "01",
      icon: "book",
      title: "A real published book",
      body: "Built in the room with your hands. Live on Amazon KDP under your name. Earning royalties from day one. Yours forever — even if you don&rsquo;t get the Batch offer.",
      accent: GOLD,
    },
    {
      n: "02",
      icon: "ticket",
      title: "A shot at the Batch",
      body: "25 of 70 attendees walk out invited to apply for the Skillies Batch · ₹50,000 + ISA · 1 month intensive in Malappuram. The path Ehsan picks for the people he&rsquo;ll partner with for 6 months.",
      accent: RED,
    },
    {
      n: "03",
      icon: "books",
      title: "The full Skillies playbook",
      body: "The exact book + cover system Ehsan uses to earn ₹1,16,000/month from 63 books. PDF, prompts, Canva templates, KDP setup walkthrough. Yours to keep, regardless of selection.",
      accent: "#7A9A7A",
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
            margin: "0 0 16px",
            textAlign: "center",
          }}
        >
          § By 5 PM on May 17 · you walk out with
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.5vw, 68px)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            margin: "0 auto 56px",
            color: CHARCOAL,
            textAlign: "center",
            maxWidth: 880,
          }}
        >
          Three things every attendee leaves with.{" "}
          <em style={{ fontStyle: "italic", color: RED }}>
            Two are the prize.
          </em>{" "}
          One is the door.
        </h2>

        <div
          className="skillies-outcomes-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 22,
          }}
        >
          {items.map((it) => (
            <article
              key={it.n}
              style={{
                position: "relative",
                padding: "32px 30px 36px",
                borderRadius: 22,
                background: "white",
                border: "1px solid rgba(26,26,26,0.08)",
                boxShadow: "0 28px 56px rgba(0,0,0,0.04)",
                overflow: "hidden",
              }}
            >
              {/* Top accent bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: it.accent,
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 22,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: "rgba(26,26,26,0.04)",
                    border: "1px solid rgba(26,26,26,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: it.accent,
                  }}
                >
                  <Icon name={it.icon} size={26} strokeWidth={1.5} />
                </div>
                <span
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: 36,
                    color: it.accent,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {it.n}
                </span>
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: CHARCOAL,
                  letterSpacing: "-0.015em",
                  margin: "0 0 12px",
                  lineHeight: 1.2,
                }}
              >
                {it.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: "#4B5563",
                  lineHeight: 1.7,
                  margin: 0,
                }}
                dangerouslySetInnerHTML={{ __html: it.body }}
              />
            </article>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 880px) {
              .skillies-outcomes-grid {
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
/* PROOF · Ehsan's own KDP receipt                                          */
/* ═══════════════════════════════════════════════════════════════════════ */

function Proof() {
  return (
    <section
      style={{
        padding: "120px 24px",
        background: CREAM,
        color: CHARCOAL,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative accent */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(201,162,78,0.12), transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(198,40,40,0.06), transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative" }}>
        <div
          className="skillies-proof-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 0.85fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          {/* LEFT · the quote */}
          <div>
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
              § Why I built this · Ehsan
            </p>
            <h2
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "clamp(34px, 4.6vw, 60px)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: "0 0 24px",
                color: CHARCOAL,
              }}
            >
              &ldquo;I&rsquo;ve published 63 books on Amazon. They paid me{" "}
              <em style={{ fontStyle: "italic", color: RED }}>
                ₹1,16,000 last month — without me touching them.
              </em>{" "}
              I&rsquo;m teaching the same exact method.&rdquo;
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "#4B5563",
                lineHeight: 1.7,
                margin: "0 0 8px",
              }}
            >
              Two years of research. 63 books published. ₹8,71,982 earned to
              date. Same prompts, same Canva templates, same cover system —
              compressed into one Sunday in Malappuram.
            </p>
            <p
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: 16,
                color: GOLD,
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              You&rsquo;ll leave with one book live on Amazon. The ones we
              pick for the Batch leave with the path to all 63.
            </p>
          </div>

          {/* RIGHT · receipt-style card */}
          <div
            style={{
              position: "relative",
              padding: "30px 32px 32px",
              borderRadius: 22,
              background: "white",
              border: "1.5px dashed rgba(201,162,78,0.45)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
                paddingBottom: 16,
                borderBottom: "1px dashed rgba(26,26,26,0.15)",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#9CA3AF",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Last month · KDP receipt
              </p>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  fontWeight: 700,
                  color: "#9CA3AF",
                  fontFamily: "ui-monospace, Menlo, monospace",
                  margin: 0,
                }}
              >
                MAR · 2026
              </p>
            </div>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontWeight: 400,
                fontSize: 64,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: CHARCOAL,
                margin: "0 0 8px",
              }}
            >
              ₹1,16,000
            </p>
            <p
              style={{
                fontSize: 14,
                color: "#6B7280",
                margin: "0 0 22px",
                lineHeight: 1.55,
              }}
            >
              63 books · zero new publishes in 6 months · all royalties
              automated · Indian bank account · INR direct deposit
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                paddingTop: 18,
                borderTop: "1px dashed rgba(26,26,26,0.15)",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "#9CA3AF",
                    fontWeight: 700,
                    margin: "0 0 4px",
                  }}
                >
                  Total earned
                </p>
                <p
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: 22,
                    color: CHARCOAL,
                    margin: 0,
                    letterSpacing: "-0.01em",
                  }}
                >
                  ₹8,71,982
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "#9CA3AF",
                    fontWeight: 700,
                    margin: "0 0 4px",
                  }}
                >
                  Hours worked
                </p>
                <p
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: 22,
                    color: "#3D5A3D",
                    margin: 0,
                    letterSpacing: "-0.01em",
                  }}
                >
                  ~ 0
                </p>
              </div>
            </div>

            <p
              style={{
                marginTop: 20,
                fontSize: 11,
                color: "#9CA3AF",
                fontStyle: "italic",
                fontFamily: "'Instrument Serif', serif",
                lineHeight: 1.5,
              }}
            >
              Verifiable. We open the dashboard live in the room.
            </p>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 880px) {
              .skillies-proof-grid {
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
/* TICKET STUB · perforated event-ticket strip below hero                  */
/* ═══════════════════════════════════════════════════════════════════════ */

function TicketStub() {
  return (
    <section
      style={{
        background: DARK,
        padding: "0 24px 80px",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          className="skillies-ticket"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1.5fr auto 1fr auto 1fr",
            alignItems: "stretch",
            background:
              "linear-gradient(135deg, #FCF6E5 0%, #FAF5EB 50%, #F0E0B5 100%)",
            color: CHARCOAL,
            borderRadius: 14,
            padding: "28px 36px",
            gap: 28,
            boxShadow:
              "0 50px 100px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(201,162,78,0.35)",
            overflow: "hidden",
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: -14,
              top: "50%",
              transform: "translateY(-50%)",
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: DARK,
              border: "1px solid rgba(201,162,78,0.35)",
            }}
          />
          <span
            aria-hidden
            style={{
              position: "absolute",
              right: -14,
              top: "50%",
              transform: "translateY(-50%)",
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: DARK,
              border: "1px solid rgba(201,162,78,0.35)",
            }}
          />

          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: RED,
                fontWeight: 800,
                margin: "0 0 8px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Admit One · Skillies Workshop
            </p>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "clamp(28px, 3.4vw, 44px)",
                fontWeight: 400,
                color: CHARCOAL,
                margin: 0,
                letterSpacing: "-0.015em",
                lineHeight: 1,
              }}
            >
              Sunday · May 17, 2026
            </p>
            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#6B7280",
                margin: "10px 0 0",
                fontWeight: 700,
                fontFamily: "Arial, sans-serif",
              }}
            >
              Malappuram Expo · Kerala
            </p>
          </div>

          <Perforation />

          <div style={{ alignSelf: "center" }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#9CA3AF",
                fontWeight: 700,
                margin: "0 0 6px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Doors open
            </p>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(22px, 2.6vw, 36px)",
                fontWeight: 400,
                color: CHARCOAL,
                margin: 0,
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              10:00 AM
            </p>
            <p
              style={{
                fontSize: 11,
                color: "#6B7280",
                margin: "6px 0 0",
                fontFamily: "Arial, sans-serif",
              }}
            >
              ends 5:00 PM
            </p>
          </div>

          <Perforation />

          <div style={{ alignSelf: "center", textAlign: "right" }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#9CA3AF",
                fontWeight: 700,
                margin: "0 0 6px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Seat
            </p>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(22px, 2.6vw, 36px)",
                fontWeight: 400,
                color: RED,
                margin: 0,
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              ₹1,999
            </p>
            <p
              style={{
                fontSize: 11,
                color: "#6B7280",
                margin: "6px 0 0",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Early Bird · 25 of 70
            </p>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 860px) {
              .skillies-ticket {
                grid-template-columns: 1fr !important;
                gap: 18px !important;
                padding: 26px 24px !important;
                text-align: left !important;
              }
              .skillies-ticket > div:last-child {
                text-align: left !important;
              }
              .skillies-ticket-perf {
                display: none !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

function Perforation() {
  return (
    <div
      aria-hidden
      className="skillies-ticket-perf"
      style={{
        width: 1,
        background:
          "repeating-linear-gradient(to bottom, rgba(26,26,26,0.4) 0 4px, transparent 4px 9px)",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* BOOK GALLERY · 6 stylised covers across · "what students publish"        */
/* ═══════════════════════════════════════════════════════════════════════ */

function BookGallery() {
  const covers: {
    kicker: string;
    title: string;
    subtitle: string;
    author: string;
    seal: string;
    theme: BookTheme;
  }[] = [
    {
      kicker: "Vol. 04",
      title: "Animal Hide & Seek",
      subtitle: "50 puzzles · ages 6+",
      author: "By a Skillies graduate",
      seal: "BS",
      theme: {
        bg: "linear-gradient(135deg, #2C1810 0%, #5A3018 60%, #2C1810 100%)",
        ink: "#F5E6C8",
        accent: "#E6C178",
        border: "rgba(230,193,120,0.32)",
      },
    },
    {
      kicker: "Vol. 05",
      title: "The Ocean Detective",
      subtitle: "Spot the Difference",
      author: "By a Skillies graduate",
      seal: "BS",
      theme: {
        bg: "linear-gradient(135deg, #0A1F2E 0%, #1E4A6E 60%, #0A1F2E 100%)",
        ink: "#D8EAF5",
        accent: "#7AB8E0",
        border: "rgba(122,184,224,0.4)",
      },
    },
    {
      kicker: "Vol. 06",
      title: "Mandala Maze",
      subtitle: "Geometric mazes · 80 pp",
      author: "By a Skillies graduate",
      seal: "BS",
      theme: {
        bg: "linear-gradient(135deg, #1A0A2E 0%, #4B1F6E 60%, #1A0A2E 100%)",
        ink: "#E8DDF5",
        accent: "#B98AE0",
        border: "rgba(185,138,224,0.4)",
      },
    },
    {
      kicker: "Vol. 07",
      title: "Festival Coloring",
      subtitle: "100 pages · all ages",
      author: "By a Skillies graduate",
      seal: "BS",
      theme: {
        bg: "linear-gradient(135deg, #FCF6E5 0%, #F4E4B8 60%, #E8C879 100%)",
        ink: "#3A2A0A",
        accent: "#A37226",
        border: "rgba(163,114,38,0.4)",
      },
    },
    {
      kicker: "Vol. 08",
      title: "The Forest Riddle",
      subtitle: "Hidden objects · 60 scenes",
      author: "By a Skillies graduate",
      seal: "BS",
      theme: {
        bg: "linear-gradient(135deg, #0E2218 0%, #1F4A36 60%, #0E2218 100%)",
        ink: "#D5EAD8",
        accent: "#7DBA8C",
        border: "rgba(125,186,140,0.4)",
      },
    },
    {
      kicker: "Vol. 09",
      title: "Sufi Tales",
      subtitle: "Picture stories · vol. 1",
      author: "By a Skillies graduate",
      seal: "BS",
      theme: {
        bg: "linear-gradient(135deg, #1A0606 0%, #5C1818 60%, #1A0606 100%)",
        ink: "#FCE0E0",
        accent: "#EF6B6B",
        border: "rgba(239,107,107,0.42)",
      },
    },
  ];

  return (
    <section
      style={{
        background: DARK,
        padding: "120px 24px",
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
            "radial-gradient(ellipse at 20% 50%, rgba(230,193,120,0.06), transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(198,40,40,0.06), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 56,
            gap: 32,
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 720 }}>
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
              § Skillies Press · Volume range
            </p>
            <h2
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: "clamp(40px, 5.5vw, 76px)",
                fontWeight: 400,
                letterSpacing: "-0.025em",
                lineHeight: 1.0,
                margin: 0,
                color: "white",
              }}
            >
              The kind of books{" "}
              <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>
                you walk out publishing.
              </em>
            </h2>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.55)",
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              maxWidth: 320,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Six covers from Skillies graduates · all live on Amazon ·
            different niches, same playbook.
          </p>
        </div>

        <div
          className="skillies-gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 18,
          }}
        >
          {covers.map((c, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                aspectRatio: "5 / 7",
                transform: i % 2 === 0 ? "rotate(-1deg)" : "rotate(1.2deg)",
              }}
            >
              <BookCover
                position={{ left: "0", top: "0", rotate: 0, z: 1 }}
                width="100%"
                opacity={0.95}
                theme={c.theme}
                kicker={`${c.kicker} · Skillies Press`}
                title={c.title}
                subtitle={c.subtitle}
                author={c.author}
                seal={c.seal}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 64,
            padding: "24px 28px",
            borderRadius: 16,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            gap: 20,
            alignItems: "center",
          }}
          className="skillies-gallery-stats"
        >
          <Stat label="Books built same way" value="63" />
          <Sep />
          <Stat label="Royalties last month" value="₹1,16,000" />
          <Sep />
          <Stat label="Hours touched" value="~ 0" />
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 1100px) {
              .skillies-gallery-grid {
                grid-template-columns: repeat(3, 1fr) !important;
              }
            }
            @media (max-width: 640px) {
              .skillies-gallery-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 14px !important;
              }
              .skillies-gallery-stats {
                grid-template-columns: 1fr !important;
                gap: 16px !important;
                text-align: center !important;
              }
              .skillies-gallery-stats .skillies-stat-sep {
                display: none !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          fontWeight: 700,
          margin: "0 0 6px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: 28,
          fontWeight: 400,
          color: GOLD_LIGHT,
          margin: 0,
          letterSpacing: "-0.015em",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function Sep() {
  return (
    <div
      aria-hidden
      className="skillies-stat-sep"
      style={{
        width: 1,
        height: 36,
        background: "rgba(255,255,255,0.1)",
      }}
    />
  );
}
