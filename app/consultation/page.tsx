import Link from "next/link";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Book your consultation · Skillies Batch · ₹4,999",
  description:
    "90 minutes in person with Ehsan in Malappuram. ₹4,999 — credited toward the ₹50,000 enrolment if you join. The selection step before the Skillies Batch.",
  openGraph: {
    title: "Book your consultation · Skillies Batch · ₹4,999",
    description:
      "90 minutes in person with Ehsan in Malappuram. ₹4,999, credited toward enrolment.",
  },
};

const WHATSAPP_BOOK =
  "https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27d%20like%20to%20book%20the%20%E2%82%B94%2C999%20consultation%20for%20the%20Skillies%20Batch.%20My%20name%20is%20";

const DARK = "#0F0F0F";
const CHARCOAL = "#1A1A1A";
const CREAM = "#FAF5EB";
const RED = "#C62828";
const GOLD = "#C9A24E";
const GOLD_LIGHT = "#E6C178";

export default function ConsultationPage() {
  return (
    <main style={{ background: DARK, color: "white" }}>
      <TopNav cta={{ href: WHATSAPP_BOOK, label: "Book on WhatsApp" }} />

      <Hero />
      <Whats />
      <Process />
      <Logistics />
      <FinalCTA />

      <FooterEditorial />
      <WhatsAppButton />
    </main>
  );
}

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
      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative" }}>
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
          <span>§ The selection step</span>
          <span
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)", minWidth: 30 }}
          />
          <span>90 min · Malappuram</span>
        </div>

        <h1
          style={{
            margin: 0,
            fontWeight: 900,
            fontSize: "clamp(46px, 6vw, 90px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.96,
            color: "white",
            maxWidth: 980,
          }}
        >
          90 minutes.{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontStyle: "italic",
              color: GOLD_LIGHT,
            }}
          >
            One room. One decision.
          </em>
        </h1>

        <p
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.75)",
            maxWidth: 720,
            margin: "32px 0 22px",
            lineHeight: 1.6,
          }}
        >
          The Skillies Batch is by application only. The consultation is
          where Ehsan decides if you&rsquo;re the right fit — and where you
          see the full programme before committing to anything bigger.
        </p>

        <p
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: 22,
            color: GOLD_LIGHT,
            margin: "0 0 40px",
            lineHeight: 1.4,
            maxWidth: 720,
          }}
        >
          ₹4,999. Credited toward your ₹50,000 enrolment if you join.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href={WHATSAPP_BOOK}
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
            Book on WhatsApp · ₹4,999
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
            Read the programme structure first →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Whats() {
  const items = [
    {
      n: "01",
      title: "First 15 minutes · we listen",
      body: "Where you are now. Why you want this. What you&rsquo;ve tried. What&rsquo;s stuck. We don&rsquo;t pitch — we ask, and we listen.",
    },
    {
      n: "02",
      title: "Middle 60 minutes · the full picture",
      body: "Ehsan walks you through the entire programme: curriculum, daily rhythm, what month 1 looks like, the ISA contract, the maths, the realistic outcomes, the risks. Nothing held back.",
    },
    {
      n: "03",
      title: "Last 15 minutes · honest decision",
      body: "Both sides decide if it&rsquo;s a fit. Ehsan offers a seat or doesn&rsquo;t. You ask anything else you need. Then you go home and think for 48 hours — no pressure, no on-the-spot signature.",
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
          § What 90 minutes looks like
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.5vw, 68px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 48px",
            color: CHARCOAL,
          }}
        >
          Not a sales call.{" "}
          <em style={{ fontStyle: "italic", color: RED }}>
            A selection interview · both ways.
          </em>
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {items.map((it) => (
            <article
              key={it.n}
              style={{
                padding: "28px 32px",
                borderRadius: 18,
                background: "white",
                border: "1px solid rgba(26,26,26,0.08)",
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 24,
                alignItems: "start",
              }}
            >
              <span
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 44,
                  color: GOLD,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {it.n}
              </span>
              <div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: CHARCOAL,
                    margin: "0 0 8px",
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section
      style={{
        padding: "120px 24px",
        background: DARK,
        color: "white",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
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
          § How booking works
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.5vw, 64px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 36px",
          }}
        >
          A WhatsApp message,{" "}
          <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>
            then a date.
          </em>
        </h2>

        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            counterReset: "step",
          }}
        >
          {[
            "Send a WhatsApp message saying you want to book the consultation. Include your name, where you&rsquo;re travelling from, and what dates work for you.",
            "Ehsan replies within 48 hours with available slots. Most consultations happen Tuesday – Saturday, 11 AM or 3 PM.",
            "Once a date is locked, Ehsan sends a Razorpay payment link for ₹4,999. Payment confirms the slot.",
            "You travel to Malappuram. Address shared after payment. Coffee + 90 minutes + an honest decision both ways.",
          ].map((step, i) => (
            <li
              key={i}
              style={{
                padding: "22px 26px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 22,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 28,
                  color: GOLD_LIGHT,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  width: 30,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p
                style={{
                  fontSize: 15.5,
                  color: "rgba(255,255,255,0.78)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
                dangerouslySetInnerHTML={{ __html: step }}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Logistics() {
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
          § Practical bits
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(36px, 5vw, 58px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 40px",
            color: CHARCOAL,
          }}
        >
          Logistics, refunds, what to bring.
        </h2>

        <div
          className="skillies-logistics-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 22,
          }}
        >
          {[
            {
              t: "Travel",
              b: "Malappuram is 1.5 hr from Calicut, 1 hr from Kondotty / Karipur airport, 3 hr from Kochi. Train station at Tirur. Most consultations are scheduled to allow same-day travel back.",
            },
            {
              t: "Address",
              b: "Shared on WhatsApp after payment. We meet either at our space in Malappuram town or a quiet café — Ehsan picks based on your travel pattern.",
            },
            {
              t: "Refund policy",
              b: "If Ehsan reschedules or cancels, full refund within 24 hours. If you cancel more than 48 hours before the slot, full refund. Less than 48 hours, refund is at Ehsan&rsquo;s discretion.",
            },
            {
              t: "What to bring",
              b: "A notebook, your laptop if you have one, and 2-3 honest questions you need answered before committing. That&rsquo;s it. No need to prepare a pitch deck — we&rsquo;re selecting fit, not skill.",
            },
            {
              t: "Language",
              b: "Malayalam, Manglish, or English — whichever you&rsquo;re comfortable with. Ehsan switches naturally.",
            },
            {
              t: "After the call",
              b: "48-hour cooling-off window. If we both say yes after that, you pay ₹50,000 enrolment fee, sign the ISA contract (with time to read it), and the batch start date is locked.",
            },
          ].map((it) => (
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
              .skillies-logistics-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

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
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
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
          § Book it
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(44px, 5.6vw, 80px)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.0,
            margin: "0 0 28px",
          }}
        >
          ₹4,999.{" "}
          <em style={{ fontStyle: "italic", color: "#EF4444" }}>
            One sit-down. Real clarity.
          </em>
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.6,
            margin: "0 0 12px",
          }}
        >
          Send a WhatsApp message. Get a slot within a week. Walk out
          knowing whether the Skillies Batch is for you.
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
          Credited toward your ₹50,000 enrolment if you join. Refunded if
          we reschedule.
        </p>
        <a
          href={WHATSAPP_BOOK}
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
          Book on WhatsApp
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
            marginTop: 56,
            fontSize: 14,
            color: "rgba(255,255,255,0.45)",
            fontStyle: "italic",
            fontFamily: "'Instrument Serif', serif",
            lineHeight: 1.6,
          }}
        >
          — Ehsan Asgar · Skillies · Malappuram, Kerala
        </p>
      </div>
    </section>
  );
}
