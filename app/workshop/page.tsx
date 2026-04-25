import Link from "next/link";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

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

const WHATSAPP_RESERVE_EARLY =
  "https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27d%20like%20to%20reserve%20an%20Early%20Bird%20%E2%82%B91%2C999%20seat%20for%20the%20May%2017%20Skillies%20Workshop%20in%20Malappuram.%20My%20name%20is%20";
const WHATSAPP_RESERVE_REGULAR =
  "https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27d%20like%20to%20reserve%20a%20Regular%20%E2%82%B92%2C499%20seat%20for%20the%20May%2017%20Skillies%20Workshop%20in%20Malappuram.%20My%20name%20is%20";

const DARK = "#0F0F0F";
const CHARCOAL = "#1A1A1A";
const CREAM = "#FAF5EB";
const RED = "#C62828";
const GOLD = "#C9A24E";
const GOLD_LIGHT = "#E6C178";

export default function WorkshopPage() {
  return (
    <main style={{ background: DARK, color: "white" }}>
      <TopNav cta={{ href: "#reserve", label: "Reserve · ₹1,999" }} />

      <Hero />
      <Wedge />
      <DayStructure />
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
          <span>§ The Skillies Workshop</span>
          <span
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)", minWidth: 30 }}
          />
          <span>Sun · May 17 · Malappuram Expo · 70 seats</span>
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
          One day. ₹1,999.
          <br />
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontStyle: "italic",
              color: GOLD_LIGHT,
            }}
          >
            The selection day
          </em>
          <br />
          for the Skillies Batch.
        </h1>

        <p
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.75)",
            maxWidth: 760,
            margin: "32px 0 22px",
            lineHeight: 1.6,
          }}
        >
          70 people. Six hours. Live with Ehsan in one room. You publish a
          real KDP book before the day ends — and at sunset, 25 of you walk
          out invited to apply for the Skillies Batch (₹50,000 + ISA).
        </p>

        <p
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: 22,
            color: GOLD_LIGHT,
            margin: "0 0 40px",
            lineHeight: 1.4,
            maxWidth: 760,
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
            See what the Batch actually is →
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
  const blocks = [
    {
      time: "10:00 – 11:30",
      title: "Niche · The first hour",
      body: "We open Amazon together. You see live which niches actually pay in 2026 and which are saturated. By the end of 90 minutes you&rsquo;ve picked a niche with proven demand for your first book.",
    },
    {
      time: "11:30 – 13:00",
      title: "Book + Cover · Build it in the room",
      body: "Claude generates the spot-the-difference scenes. Canva lays them out. You curate. We&rsquo;re reviewing each others&rsquo; books in real time. By 1 PM you have a ready-to-upload paperback.",
    },
    {
      time: "13:00 – 14:00",
      title: "Lunch · Included",
      body: "Skillies hosts. Food, conversation, you start meeting the others in the room. Some of these people will be in the Batch with you.",
    },
    {
      time: "14:00 – 15:30",
      title: "KDP · Upload + Publish",
      body: "PAN setup, royalty preferences, pricing, keywords, categories — live screen-share with Ehsan. Before 3:30 PM, your book is uploaded and queued for Amazon&rsquo;s review.",
    },
    {
      time: "15:30 – 16:30",
      title: "Q&A · Open table",
      body: "Bring every question you&rsquo;ve been holding. Ehsan answers everything: niches that work in 2026, scaling from 1 to 100 books, account safety, taxes, multi-region publishing, the Batch model in detail.",
    },
    {
      time: "16:30 – 17:00",
      title: "Selection · The 25",
      body: "Closed door. Ehsan reviews who&rsquo;s in the room and selects up to 25 people he wants to take into the Batch. Selected attendees get a printed offer letter on the way out. Unselected attendees get the alumni playbook PDF and an email when the next workshop is announced.",
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
                padding: "26px 0",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                borderBottom:
                  i === blocks.length - 1
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "none",
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                gap: 32,
                alignItems: "start",
              }}
              className="skillies-day-row"
            >
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
              <div>
                <h3
                  style={{
                    fontSize: 21,
                    fontWeight: 700,
                    color: "white",
                    margin: "0 0 8px",
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
                >
                  {b.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 760px) {
              .skillies-day-row {
                grid-template-columns: 1fr !important;
                gap: 8px !important;
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
          believes he can take past ₹3L+/mo within the year. Some
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
            <a
              href={WHATSAPP_RESERVE_EARLY}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "16px 24px",
                background: GOLD_LIGHT,
                color: "#2a1f08",
                textAlign: "center",
                textDecoration: "none",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: "0.02em",
                boxShadow: "0 16px 36px rgba(230,193,120,0.22)",
              }}
            >
              Grab Early Bird · ₹1,999
            </a>
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
            <a
              href={WHATSAPP_RESERVE_REGULAR}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "16px 24px",
                background: "transparent",
                color: "white",
                textAlign: "center",
                textDecoration: "none",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.02em",
                border: "1.5px solid rgba(255,255,255,0.3)",
              }}
            >
              Reserve Regular · ₹2,499
            </a>
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
      b: "WhatsApp Ehsan with your name and tier (Early Bird ₹1,999 or Regular ₹2,499). He sends a Razorpay link. Pay → seat is yours · receipt in your inbox.",
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
          <a
            href={WHATSAPP_RESERVE_EARLY}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "20px 32px",
              background: RED,
              color: "white",
              textDecoration: "none",
              borderRadius: 999,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: "0.02em",
              boxShadow: "0 20px 50px rgba(198,40,40,0.4)",
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
          <a
            href={WHATSAPP_RESERVE_REGULAR}
            target="_blank"
            rel="noopener noreferrer"
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
            Reserve Regular · ₹2,499
          </a>
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
