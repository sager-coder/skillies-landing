import Link from "next/link";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "The Skillies Batch · 25 students · Malappuram",
  description:
    "One batch. 25 seats. ₹50,000 upfront. The remainder paid only when you earn ₹1,00,000+ a month. In-person in Malappuram. By application only.",
  openGraph: {
    title: "The Skillies Batch · 25 students · Malappuram",
    description:
      "₹50,000 upfront. ₹4,50,000 paid only when you earn ₹1L+/month. In-person training in Malappuram. By application only — 25 seats.",
  },
};

const WHATSAPP_APPLY =
  "https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27d%20like%20to%20apply%20for%20the%20Skillies%20Batch.%20My%20name%20is%20";
const WHATSAPP_WORKSHOP =
  "https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27d%20like%20to%20reserve%20an%20Early%20Bird%20%E2%82%B91%2C999%20seat%20for%20the%20May%2017%20Skillies%20Workshop%20in%20Malappuram.%20My%20name%20is%20";

const DARK = "#0F0F0F";
const CHARCOAL = "#1A1A1A";
const CREAM = "#FAF5EB";
const RED = "#C62828";
const GOLD = "#C9A24E";
const GOLD_LIGHT = "#E6C178";
const FOREST = "#3D5A3D";

export default function ProgramPage() {
  return (
    <main style={{ background: DARK, color: "white" }}>
      <TopNav cta={{ href: "/workshop", label: "Reserve · ₹1,999" }} />

      <Hero />
      <Wedge />
      <Model />
      <Selection />
      <Curriculum />
      <Earnings />
      <PricingLadder />
      <Fit />
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
          <span>§ The Skillies Batch · By Application</span>
          <span
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)", minWidth: 30 }}
          />
          <span>25 seats · Malappuram</span>
        </div>

        <h1
          style={{
            margin: 0,
            fontWeight: 900,
            fontSize: "clamp(48px, 6.4vw, 96px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.96,
            color: "white",
            maxWidth: 1040,
          }}
        >
          One batch.
          <br />
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontStyle: "italic",
              color: GOLD_LIGHT,
            }}
          >
            ₹50,000 to start.
          </em>
          <br />
          The rest only when you earn it.
        </h1>

        <p
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.75)",
            maxWidth: 760,
            margin: "36px 0 22px",
            lineHeight: 1.6,
          }}
        >
          Twenty-five students. One concurrent batch. In-person in Malappuram. You
          pay ₹50,000 upfront — the remaining ₹4,50,000 is collected only
          after you start earning ₹1,00,000+ a month from your own
          publishing business.
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
          We don&rsquo;t win unless you do. That&rsquo;s the whole pitch.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href="/workshop"
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
            Reserve workshop seat · ₹1,999
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
            href="#model"
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
            Read the full structure →
          </Link>
        </div>

        {/* Numbers row */}
        <div
          style={{
            marginTop: 64,
            padding: "24px 28px",
            borderRadius: 18,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 22,
          }}
          className="skillies-program-numbers"
        >
          {[
            { n: "20", l: "students per batch · ever" },
            { n: "₹50K", l: "to start · all you owe upfront" },
            { n: "₹1L+/mo", l: "earnings before ISA begins" },
            { n: "1+2", l: "months learning + earning ramp" },
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
            @media (max-width: 860px) {
              .skillies-program-numbers {
                grid-template-columns: 1fr 1fr !important;
                gap: 14px !important;
              }
              .skillies-program-numbers > div {
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
          § Why this exists
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.8vw, 78px)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.02,
            margin: "0 0 36px",
            color: CHARCOAL,
          }}
        >
          Every other course asks for the full fee upfront —
          <br />
          <em style={{ fontStyle: "italic", color: RED }}>
            and then hopes you earn it back.
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
              The standard course
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
              <li>₹35,000 – ₹2,00,000 upfront</li>
              <li>500+ students per batch · zoom-only</li>
              <li>Recorded videos you watch alone</li>
              <li>The school keeps your money whether you earn or not</li>
              <li>You graduate, you&rsquo;re on your own</li>
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
              The Skillies Batch
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
              <li>₹50,000 upfront · ₹4,50,000 only when you earn ₹1L+/mo</li>
              <li>25 students per batch · in-person Malappuram</li>
              <li>Live with Ehsan in the same room for 1 month</li>
              <li>If you don&rsquo;t hit ₹1L+/mo, you owe nothing more</li>
              <li>Alumni community for life · we keep helping</li>
            </ul>
          </div>
        </div>

        <p
          style={{
            marginTop: 56,
            fontSize: 17,
            color: "#4B5563",
            lineHeight: 1.7,
            maxWidth: 800,
          }}
        >
          We&rsquo;re not selling a course. We&rsquo;re partnering with you on
          a publishing business. Same outcome we built for ourselves — 63
          books, ₹1,16,000/month passive, automated — except now we hand you
          the compressed playbook and stay aligned with your success.
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
/* THE MODEL                                                                */
/* ═══════════════════════════════════════════════════════════════════════ */

function Model() {
  return (
    <section
      id="model"
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
            "radial-gradient(ellipse at 80% 10%, rgba(230,193,120,0.10), transparent 60%)",
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
          § How the money works
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(42px, 5.8vw, 78px)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.02,
            margin: "0 0 28px",
            maxWidth: 980,
          }}
        >
          ₹50,000 today.{" "}
          <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>
            ₹4,50,000 only after you earn it.
          </em>
        </h2>
        <p
          style={{
            fontSize: 19,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 800,
            lineHeight: 1.65,
            margin: "0 0 56px",
          }}
        >
          You pay ₹50,000 to enrol. After your training, you start publishing.
          Once your monthly KDP earnings cross ₹1,00,000 for the first time,
          the Income Share Agreement (ISA) activates — you pay back the
          remaining ₹4,50,000 in monthly instalments out of your earnings.
          Total cap: ₹5,00,000 ever. Nothing more.
        </p>

        <div
          className="skillies-model-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 22,
          }}
        >
          {/* ENROLMENT */}
          <article
            style={{
              padding: "32px 28px 36px",
              borderRadius: 20,
              background: "rgba(198,40,40,0.06)",
              border: "1px solid rgba(198,40,40,0.28)",
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
                background: RED,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            />
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#EF6B6B",
                fontWeight: 700,
                margin: "12px 0 12px",
              }}
            >
              Step 1 · At enrolment
            </p>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 48,
                fontWeight: 400,
                color: "white",
                margin: "0 0 6px",
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
              }}
            >
              ₹50,000
            </p>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.65)",
                margin: "0 0 16px",
                lineHeight: 1.55,
              }}
            >
              Paid in full when you sign the contract. Covers your seat in
              the batch, all training, materials, and account setup help.
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                fontStyle: "italic",
                fontFamily: "'Instrument Serif', serif",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Razorpay · UPI · NEFT all accepted.
            </p>
          </article>

          {/* THE EARNING WINDOW */}
          <article
            style={{
              padding: "32px 28px 36px",
              borderRadius: 20,
              background: "rgba(230,193,120,0.06)",
              border: "1px solid rgba(230,193,120,0.28)",
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
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            />
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: GOLD_LIGHT,
                fontWeight: 700,
                margin: "12px 0 12px",
              }}
            >
              Step 2 · The trigger
            </p>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 48,
                fontWeight: 400,
                color: "white",
                margin: "0 0 6px",
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
              }}
            >
              ₹1,00,000/mo
            </p>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.65)",
                margin: "0 0 16px",
                lineHeight: 1.55,
              }}
            >
              The ISA only activates after your monthly KDP royalties cross
              ₹1,00,000. Until then you pay nothing more.
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                fontStyle: "italic",
                fontFamily: "'Instrument Serif', serif",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Verified via your bank statements / KDP dashboard.
            </p>
          </article>

          {/* THE PAYBACK */}
          <article
            style={{
              padding: "32px 28px 36px",
              borderRadius: 20,
              background: "rgba(61,90,61,0.10)",
              border: "1px solid rgba(122,154,122,0.32)",
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
                background: "#7A9A7A",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            />
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#7A9A7A",
                fontWeight: 700,
                margin: "12px 0 12px",
              }}
            >
              Step 3 · After the trigger
            </p>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 48,
                fontWeight: 400,
                color: "white",
                margin: "0 0 6px",
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
              }}
            >
              ₹4,50,000
            </p>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.65)",
                margin: "0 0 16px",
                lineHeight: 1.55,
              }}
            >
              Paid back in monthly instalments over 24–36 months from your
              earnings. Hard cap of ₹4,50,000 — never a rupee more.
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                fontStyle: "italic",
                fontFamily: "'Instrument Serif', serif",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              ISA pauses if your earnings drop below ₹3L for 2+ months.
            </p>
          </article>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            marginTop: 36,
            padding: "20px 24px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.04)",
            border: "1px dashed rgba(255,255,255,0.18)",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.6,
              margin: 0,
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
            }}
          >
            The Income Share Agreement is a separate contract reviewed
            after the workshop selection and signed before enrolment. It includes
            hardship pause clauses, a 36-month maximum repayment window, and
            a hard cap at ₹4,50,000 ISA collection (₹5,00,000 total program
            fee, never more). Earnings are not guaranteed — but the ISA
            structure means you only pay the full fee if the program
            actually delivers for you.
          </p>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 860px) {
              .skillies-model-grid {
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
/* SELECTION                                                                */
/* ═══════════════════════════════════════════════════════════════════════ */

function Selection() {
  const steps = [
    {
      n: "01",
      title: "Reserve a workshop seat",
      body: "Reserve a seat at the May 17 Skillies Workshop in Malappuram. ₹1,999 early bird (first 25) or ₹2,499 regular (next 45). 70 seats total, no refunds. WhatsApp Ehsan, get a Razorpay link, lock your seat.",
      out: "₹1,999 · 70 seats",
    },
    {
      n: "02",
      title: "Show up · publish a book",
      body: "10 AM to 5 PM in the room with Ehsan. Niche → book → cover → upload, all live, your real KDP book published before sunset. We watch how you work, how you ask, how you ship.",
      out: "1 day · 1 book live",
    },
    {
      n: "03",
      title: "Selection · same day",
      body: "End of the day, Ehsan picks 25 of the 70 to be invited into the Batch. Selected attendees get a printed offer letter on the way out. Unselected attendees get the playbook PDF and the priority list for the next workshop.",
      out: "25 of 70 selected",
    },
    {
      n: "04",
      title: "Apply · enrol · sign",
      body: "If selected: 3 days to fill the formal pre-form and do a 30-min one-on-one with Ehsan. If both sides confirm — ₹50,000 enrolment + ISA contract signed (with time to read it, with your lawyer if you want). Batch starts within 3-4 weeks.",
      out: "₹50,000 · contract signed",
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
          § How you get in
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
            maxWidth: 920,
          }}
        >
          Four steps.{" "}
          <em style={{ fontStyle: "italic", color: RED }}>
            Both sides choose.
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
          We can&rsquo;t take everyone — there are only 25 seats per batch.
          The selection process is honest about that. We&rsquo;d rather say
          &ldquo;not yet&rdquo; to a serious applicant than pull in 20 people
          who shouldn&rsquo;t be here.
        </p>

        <div
          className="skillies-selection-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 22,
          }}
        >
          {steps.map((s) => (
            <div
              key={s.n}
              style={{
                padding: "30px 26px 32px",
                borderRadius: 18,
                background: "white",
                border: "1px solid rgba(26,26,26,0.08)",
                boxShadow: "0 18px 40px rgba(0,0,0,0.03)",
                position: "relative",
              }}
            >
              <p
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 32,
                  color: GOLD,
                  margin: "0 0 12px",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {s.n}
              </p>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  color: CHARCOAL,
                  margin: "0 0 12px",
                  lineHeight: 1.2,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#4B5563",
                  lineHeight: 1.65,
                  margin: "0 0 18px",
                }}
              >
                {s.body}
              </p>
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
                {s.out}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 48,
            padding: "26px 30px",
            borderRadius: 18,
            background: "white",
            border: "1px solid rgba(198,40,40,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: CHARCOAL,
                margin: "0 0 4px",
              }}
            >
              Application is one WhatsApp message away.
            </p>
            <p
              style={{
                fontSize: 14,
                color: "#6B7280",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Takes 2 minutes. Costs nothing. Reply within 48 hours.
            </p>
          </div>
          <a
            href={WHATSAPP_APPLY}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "14px 26px",
              background: RED,
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 999,
              textDecoration: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 12px 28px rgba(198,40,40,0.22)",
            }}
          >
            Apply on WhatsApp →
          </a>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 1024px) {
              .skillies-selection-grid {
                grid-template-columns: 1fr 1fr !important;
              }
            }
            @media (max-width: 560px) {
              .skillies-selection-grid {
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
/* CURRICULUM                                                               */
/* ═══════════════════════════════════════════════════════════════════════ */

function Curriculum() {
  const phases = [
    {
      tag: "Month 1 · In-person, Malappuram",
      title: "The intensive",
      body: "Every weekday, in the same room. We build your first 5 books together — not slides, not theory. By end of week 4, you have a stack of live KDP books earning royalties, your account fully set up, and the playbook to scale to 50+ titles solo.",
      bullets: [
        "Niche research that finds books that actually pay (Ehsan&rsquo;s framework, not generic SEO)",
        "Book creation pipeline: spot-the-difference, puzzles, coloring, low-content books",
        "Cover design — Amazon-thumbnail-optimised, the templates we use ourselves",
        "KDP upload, PAN/tax setup, royalty configuration, multi-region publishing",
        "Amazon ads decision — when it&rsquo;s worth it, when it isn&rsquo;t",
        "Your first 5 books published live before you go home",
      ],
    },
    {
      tag: "Months 2–3 · Async + check-ins",
      title: "The earning ramp",
      body: "You&rsquo;re back home, publishing on your own. Daily target: 2 books shipped. Weekly check-ins on WhatsApp. Monthly in-person catchup in Malappuram (optional). The goal: 30–50 books live by end of month 3, royalties compounding, your earnings climbing toward the ₹1L+/mo trigger.",
      bullets: [
        "Daily WhatsApp reviews of your books before publish",
        "Niche pivots based on real Amazon performance data",
        "Scaling from 1 → 30+ titles · the operational rhythm",
        "Cross-listing strategy (US, UK, India, AU stores)",
        "When to add categories · when to translate · when to expand to Etsy",
        "Multi-account scaling once you stabilize one",
      ],
    },
    {
      tag: "Months 4–12+ · Alumni",
      title: "The compounding phase",
      body: "Your earnings ramp to and past ₹1L+/mo. ISA payments begin. You stay in the alumni community for life — newer batches see you, you see them, the network compounds. Every new course Skillies launches (Etsy, Meta ads, agents, video), alumni get first access.",
      bullets: [
        "Lifetime alumni community access (current and future batches)",
        "First access to every new Skillies course",
        "Quarterly alumni-only meetups in Malappuram",
        "Continued WhatsApp support · Ehsan stays reachable",
        "Optional advanced track: Skillies imprint scaling",
      ],
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
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
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
          § What you actually learn
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
          1 month learning.{" "}
          <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>
            2 months earning.
          </em>{" "}
          A lifetime in the network.
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
          The 50-day cohort framework you&rsquo;ve seen elsewhere — except
          compressed, in-person, and accountable. We&rsquo;re not teaching a
          subject. We&rsquo;re partnering on a publishing business.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          {phases.map((p, i) => (
            <article
              key={i}
              style={{
                padding: "36px 36px 38px",
                borderRadius: 22,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "grid",
                gridTemplateColumns: "0.6fr 1.4fr",
                gap: 36,
              }}
              className="skillies-curriculum-card"
            >
              <div>
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: GOLD_LIGHT,
                    fontWeight: 700,
                    margin: "0 0 12px",
                  }}
                >
                  {p.tag}
                </p>
                <h3
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: "clamp(30px, 3.4vw, 44px)",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    color: "white",
                    margin: 0,
                    lineHeight: 1.05,
                  }}
                >
                  {p.title}
                </h3>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 16,
                    color: "rgba(255,255,255,0.78)",
                    lineHeight: 1.7,
                    margin: "0 0 22px",
                  }}
                >
                  {p.body}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {p.bullets.map((b, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: 14.5,
                        color: "rgba(255,255,255,0.72)",
                        lineHeight: 1.55,
                        paddingLeft: 22,
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 9,
                          width: 12,
                          height: 1,
                          background: GOLD_LIGHT,
                        }}
                      />
                      <span dangerouslySetInnerHTML={{ __html: b }} />
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 860px) {
              .skillies-curriculum-card {
                grid-template-columns: 1fr !important;
                gap: 18px !important;
                padding: 28px 24px !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* EARNINGS · honest                                                        */
/* ═══════════════════════════════════════════════════════════════════════ */

function Earnings() {
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
          § The honest part · earnings
        </p>
        <h2
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(40px, 5.5vw, 72px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 28px",
            color: CHARCOAL,
          }}
        >
          We don&rsquo;t guarantee earnings.{" "}
          <em style={{ fontStyle: "italic", color: RED }}>
            We share aligned skin in the game.
          </em>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 28,
            marginBottom: 36,
          }}
          className="skillies-earnings-grid"
        >
          <div
            style={{
              padding: "28px 28px 32px",
              borderRadius: 18,
              background: "white",
              border: "1px solid rgba(26,26,26,0.08)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 700,
                margin: "0 0 12px",
              }}
            >
              What we know · proof
            </p>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 38,
                fontWeight: 400,
                color: CHARCOAL,
                margin: "0 0 8px",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              ₹1,16,000/mo
            </p>
            <p
              style={{
                fontSize: 14.5,
                color: "#4B5563",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Ehsan&rsquo;s own KDP earnings · 63 books · automated · zero
              hours touching them. The same methodology you&rsquo;ll learn,
              just with a 2-year head start. Verifiable.
            </p>
          </div>

          <div
            style={{
              padding: "28px 28px 32px",
              borderRadius: 18,
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
                margin: "0 0 12px",
              }}
            >
              What we believe · the goal
            </p>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 38,
                fontWeight: 400,
                color: CHARCOAL,
                margin: "0 0 8px",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              ₹1,00,000+/mo
            </p>
            <p
              style={{
                fontSize: 14.5,
                color: "#4B5563",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              The trigger we&rsquo;ve set for the ISA. The programme is
              designed for graduates targeting this — but earnings depend
              on your effort, your niches, and Amazon&rsquo;s market.
              Not every student will hit it.
            </p>
          </div>
        </div>

        <div
          style={{
            padding: "24px 28px",
            borderRadius: 16,
            background: "rgba(198,40,40,0.06)",
            border: "1px solid rgba(198,40,40,0.18)",
          }}
        >
          <p
            style={{
              fontSize: 14.5,
              color: CHARCOAL,
              lineHeight: 1.7,
              margin: 0,
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
            }}
          >
            <strong style={{ color: RED, fontStyle: "normal", fontFamily: "inherit", letterSpacing: "0.01em" }}>
              Important:
            </strong>{" "}
            We don&rsquo;t promise specific earnings. We promise the
            methodology, the in-person training, the alumni network, and
            the ISA structure that aligns our outcome with yours. If you
            don&rsquo;t hit ₹1L+/mo, the ISA never activates and you owe
            nothing more — that&rsquo;s the only guarantee we make. We hand
            you the full ISA contract 3 days before enrolment so you can
            read it slowly.
          </p>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 760px) {
              .skillies-earnings-grid {
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
/* PRICING LADDER · totals at a glance                                      */
/* ═══════════════════════════════════════════════════════════════════════ */

function PricingLadder() {
  const rows = [
    {
      label: "Workshop · May 17",
      what: "1-day in-person Selection Day in Malappuram · 70 seats",
      cost: "₹1,999 – ₹2,499",
      note: "Early Bird (first 25) ₹1,999 · Regular ₹2,499 · no refund",
    },
    {
      label: "Enrolment fee",
      what: "Your seat in the batch · all training · materials · account help",
      cost: "₹50,000",
      note: "Paid at sign-up · Razorpay / UPI / NEFT",
    },
    {
      label: "ISA · only after ₹1L+/mo earnings",
      what: "Monthly instalments out of your earnings, capped at ₹4,50,000",
      cost: "₹4,50,000 max",
      note: "Pauses if earnings drop · 36-month max window",
    },
    {
      label: "Total programme cap",
      what: "Maximum you ever pay Skillies for the whole programme",
      cost: "₹5,00,000",
      note: "Never a rupee more · written into the ISA contract",
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
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
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
          § The whole money picture
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
          Every rupee, on{" "}
          <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>
            one page.
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
          No hidden fees. No tier-up upsells. No &ldquo;mastermind&rdquo;
          add-on. The four lines below are everything you&rsquo;ll ever pay
          Skillies for the entire programme — written into the ISA
          contract, capped, and final.
        </p>

        <div
          style={{
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {rows.map((r, i) => (
            <div
              key={r.label}
              className="skillies-pricing-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 2fr 1fr",
                padding: "26px 28px",
                borderBottom:
                  i === rows.length - 1
                    ? "none"
                    : "1px solid rgba(255,255,255,0.06)",
                alignItems: "center",
                gap: 24,
                background:
                  i === rows.length - 1
                    ? "rgba(230,193,120,0.06)"
                    : "transparent",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color:
                      i === rows.length - 1 ? GOLD_LIGHT : "white",
                    margin: "0 0 4px",
                  }}
                >
                  {r.label}
                </p>
                <p
                  style={{
                    fontSize: 12.5,
                    color: "rgba(255,255,255,0.55)",
                    margin: 0,
                    lineHeight: 1.5,
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                  }}
                >
                  {r.note}
                </p>
              </div>
              <div
                style={{
                  fontSize: 14.5,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.55,
                }}
              >
                {r.what}
              </div>
              <div
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 22,
                  color: i === rows.length - 1 ? GOLD_LIGHT : "white",
                  letterSpacing: "-0.01em",
                  textAlign: "right",
                  fontWeight: i === rows.length - 1 ? 600 : 400,
                }}
              >
                {r.cost}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 860px) {
              .skillies-pricing-row {
                grid-template-columns: 1fr !important;
                gap: 8px !important;
                padding: 24px 22px !important;
              }
              .skillies-pricing-row > div:last-child {
                text-align: left !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* FIT                                                                      */
/* ═══════════════════════════════════════════════════════════════════════ */

function Fit() {
  const right = [
    "You can give 1 full month of in-person attention to Malappuram, no excuses",
    "You have ₹50K to commit and treat as a real investment, not lose-it-don&rsquo;t-care money",
    "You&rsquo;ve been hunting for an income stream that compounds without trading time",
    "You&rsquo;re comfortable with English / Manglish · we mix both in the room",
    "You read contracts before signing them",
  ];
  const wrong = [
    "You want the cheapest course possible (this is not that)",
    "You&rsquo;re &ldquo;just curious&rdquo; about KDP and want to dabble",
    "You can&rsquo;t step out of your day job for one focused month",
    "You expect a guaranteed earnings number from a teacher",
    "You&rsquo;re looking for a way to learn online without travel",
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
          § Honest fit
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
            maxWidth: 920,
          }}
        >
          We&rsquo;re going to say no{" "}
          <em style={{ fontStyle: "italic", color: RED }}>
            to most applicants.
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
          Read both columns before applying. If you&rsquo;re honestly in the
          left column, send a WhatsApp. If you&rsquo;re in the right —
          that&rsquo;s OK, the free Skillies playbooks are still yours.
        </p>

        <div
          className="skillies-fit-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          <div
            style={{
              padding: "32px 30px 36px",
              borderRadius: 18,
              background: "rgba(61,90,61,0.08)",
              border: "1px solid rgba(122,154,122,0.32)",
            }}
          >
            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#3D5A3D",
                fontWeight: 700,
                margin: "0 0 18px",
              }}
            >
              ✓ Right fit
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
              {right.map((r, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 15,
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
                  <span dangerouslySetInnerHTML={{ __html: r }} />
                </li>
              ))}
            </ul>
          </div>
          <div
            style={{
              padding: "32px 30px 36px",
              borderRadius: 18,
              background: "rgba(198,40,40,0.06)",
              border: "1px solid rgba(198,40,40,0.25)",
            }}
          >
            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: RED,
                fontWeight: 700,
                margin: "0 0 18px",
              }}
            >
              ✗ Not yet · maybe later
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
              {wrong.map((w, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 15,
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
                  <span dangerouslySetInnerHTML={{ __html: w }} />
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
              .skillies-fit-grid {
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
      q: "What if I don&rsquo;t hit ₹1,00,000/month?",
      a: "Then the ISA never activates. You&rsquo;ve paid the ₹50,000 enrolment fee — that&rsquo;s it, ever. No collection, no debt, no chasing. You keep all training materials, alumni access, and the books you&rsquo;ve published. We absorbed the loss because we backed you. That&rsquo;s the deal.",
    },
    {
      q: "How is the ₹1,00,000 verified?",
      a: "Bank statements + KDP royalty reports, audited monthly once you&rsquo;re close to or above the trigger. The ISA contract makes this explicit — Skillies can request statements at any time, you&rsquo;re obligated to share. We don&rsquo;t pull your dashboard automatically; we trust you and audit when needed.",
    },
    {
      q: "Is this a loan?",
      a: "No. It&rsquo;s an Income Share Agreement — a contingent revenue-share contract reviewed by our legal counsel. You don&rsquo;t pay if you don&rsquo;t earn. There&rsquo;s no interest, no compounding, no debt collector. Total cap is ₹4,50,000 — that ceiling is in writing.",
    },
    {
      q: "Why so expensive? ₹5L is a lot.",
      a: "₹5L is the maximum you ever pay — and only if the programme works. ₹50,000 is what you actually risk upfront. Compare to a typical &ldquo;passive income course&rdquo; charging ₹2L upfront with no skin in the game — there, you lose ₹2L if it doesn&rsquo;t work. Here, you lose ₹50K. The cap is high because we&rsquo;re partners on the upside, not on the entry.",
    },
    {
      q: "Why only 25 students? Can&rsquo;t you take more?",
      a: "20 is the most Ehsan can mentor in person, in one room, daily, for a full month. Above that, the in-person promise breaks. Skillies isn&rsquo;t scaling for revenue — it&rsquo;s scaling for outcomes. 20 graduates earning ₹1L+/mo each is a much louder marketing engine than 200 students earning ₹0.",
    },
    {
      q: "Why only Malappuram? Can I do this online?",
      a: "Online cohorts are what every other school sells. We&rsquo;ve seen the completion rates (under 10%). In-person, daily, in one room — completion is closer to 100%. The room is the secret. If travelling to Malappuram for 1 month is a deal-breaker, this programme isn&rsquo;t for you, and that&rsquo;s OK.",
    },
    {
      q: "Where do I stay during the month in Malappuram?",
      a: "Malappuram has plenty of affordable accommodation — single rooms from ₹6,000/month, decent PGs from ₹4,000. We help with logistics if you&rsquo;re selected. NRI / out-of-state students often share rooms. Plan ₹15,000–₹25,000 total for accommodation + food for the month.",
    },
    {
      q: "What if Amazon bans my account or KDP changes the rules?",
      a: "It happens. We teach defensive practices (no AI-generated content slop, niche compliance, multi-account hygiene). If your primary account gets a strike outside your control, alumni get free re-onboarding to a new account. KDP rules will keep changing — we update the playbook for every batch.",
    },
    {
      q: "Can I back out after being selected?",
      a: "Yes. After selection at the workshop, you have 3 days to formally apply (pre-form + a 30-min one-on-one with Ehsan). If at any point either side wants to walk, no hard feelings. Once you&rsquo;ve paid the ₹50,000 enrolment fee and signed, the ISA contract has a 7-day cancellation clause — full refund of enrolment, contract voided, no questions.",
    },
    {
      q: "When does the next batch start?",
      a: "The first batch starts within 3-4 weeks of the May 17 workshop — exact date confirmed at selection. Future batches are typically 2/year — Q2 (May–July) and Q4 (Sep–Nov). The path in is always through a workshop · we don&rsquo;t take applications outside the workshop selection.",
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
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
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
            fontSize: "clamp(40px, 5.5vw, 64px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 48px",
          }}
        >
          The questions every applicant asks{" "}
          <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>
            before they sign.
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
                  fontSize: 19,
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
          § The next step
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
          One WhatsApp.{" "}
          <em style={{ fontStyle: "italic", color: "#EF4444" }}>
            That&rsquo;s the start.
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
          Send a 2-line message. We reply within 48 hours with details on
          the next workshop or any other questions.
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
          No commitment. No payment. No upsell. Just an honest read of fit.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href={WHATSAPP_APPLY}
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
            Apply on WhatsApp
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
            href="/workshop"
            style={{
              padding: "22px 32px",
              background: "transparent",
              color: "white",
              textDecoration: "none",
              borderRadius: 999,
              fontSize: 16,
              fontWeight: 600,
              border: "1.5px solid rgba(255,255,255,0.22)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Reserve workshop seat · ₹1,999 →
          </Link>
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
            We don&rsquo;t win unless you do. That&rsquo;s the whole pitch.
          </span>
        </p>
      </div>
    </section>
  );
}
