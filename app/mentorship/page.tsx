import Link from "next/link";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Private Mentorship · 3 Founding Slots · Skillies.AI",
  description:
    "Six months of 1-on-1 KDP mentorship with Ehsan. Amazon account audit, book-by-book review, direct WhatsApp access. Founding price ₹1,75,000 (regular ₹2,50,000). Three slots only.",
};

// WhatsApp pre-filled message for mentorship applications.
// Going to the public Skillies number — Ehsan's personal inbox.
const APPLY_HREF =
  "https://wa.me/918089941131?text=" +
  encodeURIComponent(
    "MENTORSHIP — I'd like to apply for one of the 3 founding slots at ₹1,75,000. My name is ",
  );

export default function MentorshipPage() {
  return (
    <main style={{ background: "#0F0F0F", color: "white" }}>
      <TopNav cta={{ href: "#apply", label: "Apply · 3 slots" }} />

      <MentorshipHero />
      <ValueStack />
      <WhatYouGet />
      <WhoThisIsFor />
      <FoundingPriceBlock />
      <Timeline />
      <FounderBlock />
      <ApplySection />
      <MentorshipFAQ />

      <FooterEditorial />
      <WhatsAppButton />
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* HERO — dark, premium, the price leads                                      */
/* -------------------------------------------------------------------------- */

function MentorshipHero() {
  return (
    <section
      style={{
        position: "relative",
        padding: "140px 24px 100px",
        background:
          "radial-gradient(ellipse at 10% 20%, rgba(230,193,120,0.18), transparent 55%), radial-gradient(ellipse at 90% 80%, rgba(198,40,40,0.14), transparent 55%), #0F0F0F",
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
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 44, height: 1, background: "#E6C178" }} />
          § Private Mentorship · Vol. 01
          <span
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}
          />
          <span>3 founding slots</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.9fr",
            gap: 56,
            alignItems: "start",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontWeight: 900,
                fontSize: "clamp(52px, 7vw, 104px)",
                letterSpacing: "-0.045em",
                lineHeight: 0.92,
                color: "white",
              }}
            >
              Six months.{" "}
              <em
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "#E6C178",
                }}
              >
                One-on-one.
              </em>
              <br />
              Three seats.
            </h1>

            <p
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.72)",
                maxWidth: 580,
                margin: "28px 0 36px",
                lineHeight: 1.7,
              }}
            >
              I&rsquo;m an English teacher in Kerala. Amazon pays me more than
              my school does &mdash; <strong style={{ color: "white" }}>₹1,16,000</strong> last
              month, from sixty-three books I wrote with AI. For the next six
              months, I&rsquo;m personally guiding three people through the
              exact same system.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  fontSize: "clamp(44px, 5vw, 64px)",
                  fontWeight: 900,
                  color: "white",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                ₹1,75,000
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.45)",
                  textDecoration: "line-through",
                  fontSize: 22,
                  fontWeight: 500,
                }}
              >
                ₹2,50,000
              </span>
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#E6C178",
                  border: "1px solid rgba(230,193,120,0.4)",
                  padding: "6px 12px",
                  borderRadius: 999,
                }}
              >
                Founding · 3 slots only
              </span>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={APPLY_HREF}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "16px 28px",
                  background: "#E6C178",
                  color: "#2a1f08",
                  textDecoration: "none",
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  boxShadow: "0 16px 36px rgba(230,193,120,0.25)",
                }}
              >
                Apply on WhatsApp →
              </a>
              <Link
                href="#what-you-get"
                style={{
                  padding: "16px 26px",
                  background: "transparent",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 600,
                  border: "1.5px solid rgba(255,255,255,0.25)",
                }}
              >
                See what you get
              </Link>
            </div>

            <p
              style={{
                marginTop: 22,
                fontSize: 12,
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.02em",
              }}
            >
              Closes Monday April 28, 8 PM IST &middot; or earlier if filled.
            </p>
          </div>

          {/* Right: the ticket / scarcity card */}
          <div
            style={{
              padding: "28px 30px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(230,193,120,0.22)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#E6C178",
                marginBottom: 14,
              }}
            >
              Why this exists
            </div>
            <p
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: 22,
                lineHeight: 1.35,
                color: "white",
                margin: "0 0 18px",
                letterSpacing: "-0.01em",
              }}
            >
              &ldquo;I&rsquo;ve taught 500+ people to publish books. The ones who
              move fastest are the ones I spend time with one-on-one. So I&rsquo;m
              opening three seats for that &mdash; nothing more.&rdquo;
            </p>
            <div
              style={{
                paddingTop: 18,
                borderTop: "1px dashed rgba(255,255,255,0.15)",
                display: "grid",
                gap: 10,
                fontSize: 13,
                color: "rgba(255,255,255,0.72)",
              }}
            >
              <Row label="Duration" value="6 months" />
              <Row label="Start" value="May 5, 2026" />
              <Row label="Format" value="Zoom + WhatsApp" />
              <Row label="Language" value="English" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#E6C178",
        }}
      >
        {label}
      </span>
      <span style={{ color: "white", fontWeight: 600 }}>{value}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* VALUE STACK                                                                 */
/* -------------------------------------------------------------------------- */

const STACK: Array<[string, string]> = [
  ["1-on-1 mentorship (6 months)", "₹2,50,000"],
  ["Video course (lifetime access)", "₹7,500"],
  ["2 group cohort batches (live + replay)", "₹70,000"],
  ["Book reviews (up to 10 books)", "₹50,000"],
];

function ValueStack() {
  return (
    <section
      style={{
        padding: "100px 24px",
        background: "#FAF5EB",
        color: "#1A1A1A",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 28,
            fontSize: 11,
            color: "#6B7280",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 44, height: 1, background: "#C62828" }} />
          § The Math
          <span style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }} />
        </div>
        <h2
          style={{
            fontSize: "clamp(36px, 4.5vw, 56px)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            margin: "0 0 32px",
            maxWidth: 720,
          }}
        >
          ₹3,77,500 of coaching,{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#C62828",
            }}
          >
            bundled for ₹1,75,000.
          </em>
        </h2>

        <div
          style={{
            background: "white",
            border: "1px solid rgba(26,26,26,0.08)",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {STACK.map(([label, price], i) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "20px 28px",
                borderTop: i === 0 ? "none" : "1px solid rgba(26,26,26,0.06)",
              }}
            >
              <span style={{ fontSize: 16, color: "#1A1A1A" }}>{label}</span>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#6B7280",
                  fontFamily: "ui-monospace, Menlo, monospace",
                }}
              >
                {price}
              </span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "20px 28px",
              background: "rgba(26,26,26,0.04)",
              borderTop: "1px solid rgba(26,26,26,0.08)",
            }}
          >
            <span style={{ fontSize: 15, color: "#6B7280", fontWeight: 600 }}>
              Standalone value
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#6B7280",
                textDecoration: "line-through",
                fontFamily: "ui-monospace, Menlo, monospace",
              }}
            >
              ₹3,77,500
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "24px 28px",
              background: "#1A1A1A",
              color: "white",
            }}
          >
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#E6C178",
              }}
            >
              Founding price · you pay
            </span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              ₹1,75,000
            </span>
          </div>
        </div>
        <p
          style={{
            fontSize: 13,
            color: "#6B7280",
            margin: "16px 0 0",
            lineHeight: 1.55,
          }}
        >
          That&rsquo;s <strong style={{ color: "#1A1A1A" }}>54% off</strong> the
          a-la-carte price. It only works for the first three applicants &mdash; after
          that, the program opens at the full ₹2,50,000 with no discount.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* WHAT YOU GET                                                                */
/* -------------------------------------------------------------------------- */

const DELIVERABLES: Array<{ title: string; desc: string; spec: string }> = [
  {
    title: "KDP account audit",
    desc: "At kickoff, a 45-min Zoom where I go through your entire Amazon setup — existing books, niches, covers, taxes, bank setup — and tell you exactly what to fix first.",
    spec: "1 session · 45 min · Week 1",
  },
  {
    title: "Bi-weekly 1-on-1 calls",
    desc: "Every two weeks, a 30-min Zoom with just me. Book strategy, niche decisions, cover reviews, publishing timing. You bring questions, I bring answers.",
    spec: "12 sessions · 30 min each · 6 months",
  },
  {
    title: "Direct WhatsApp access",
    desc: "My personal WhatsApp. Send questions any weekday — audio, text, screenshots. I respond within 48 hours, Monday to Friday. This is the highest-leverage benefit in the program.",
    spec: "Mon–Fri · 48-hour SLA",
  },
  {
    title: "Book-by-book reviews",
    desc: "Send me up to 10 books in progress. Niche pick, manuscript, interior, cover. I reply with written feedback — what to keep, what to fix, what to scrap.",
    spec: "10 books · written feedback",
  },
  {
    title: "Cohort access (live + replays)",
    desc: "Join both upcoming group cohort batches live (Aug–Oct + Nov–Jan). Every weekly Q&A Zoom, every replay, for life. Your mentorship pairs perfectly with the cohort energy.",
    spec: "2 batches · live + lifetime replays",
  },
  {
    title: "Full video course (lifetime)",
    desc: "The 50-lesson self-paced course — niche research, AI book creation, cover design, KDP upload, scaling. Yours forever, plus every future update.",
    spec: "50 videos · lifetime · all updates",
  },
];

function WhatYouGet() {
  return (
    <section
      id="what-you-get"
      style={{
        padding: "120px 24px",
        background: "#0F0F0F",
        color: "white",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 28,
            fontSize: 11,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 44, height: 1, background: "#E6C178" }} />
          § What you get
          <span
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}
          />
          <span>6 deliverables</span>
        </div>
        <h2
          style={{
            fontSize: "clamp(44px, 5.5vw, 72px)",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
            margin: "0 0 48px",
            maxWidth: 780,
          }}
        >
          Six deliverables,{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#E6C178",
            }}
          >
            written in the contract.
          </em>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {DELIVERABLES.map((d, i) => (
            <div
              key={d.title}
              style={{
                padding: "28px 26px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#E6C178",
                  marginBottom: 12,
                }}
              >
                {String(i + 1).padStart(2, "0")} · {d.spec}
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "white",
                  margin: "0 0 10px",
                  letterSpacing: "-0.015em",
                }}
              >
                {d.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* WHO THIS IS FOR / NOT FOR                                                   */
/* -------------------------------------------------------------------------- */

function WhoThisIsFor() {
  const forList = [
    "You can commit 10+ hours a week for 6 months",
    "You'll publish at least 5 books during the program",
    "You treat this like a business, not a lottery ticket",
    "Teachers, housewives, side-hustlers, government employees — all welcome",
  ];
  const notForList = [
    'You want "passive income" without doing the work',
    "You expect ₹1 lakh in month 1 (it took me 14 months)",
    "You want to argue about the system instead of running it",
    "You're not ready to ship a book with your name on it",
  ];
  return (
    <section
      style={{
        padding: "120px 24px",
        background: "#FAF5EB",
        color: "#1A1A1A",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          <div
            style={{
              padding: "36px 32px",
              borderRadius: 22,
              background: "white",
              border: "1.5px solid rgba(91,123,91,0.3)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#3D5A3D",
                marginBottom: 14,
              }}
            >
              ✓ Who this is for
            </div>
            <h3
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#1A1A1A",
                margin: "0 0 20px",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              People ready to put in the reps.
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
              {forList.map((x) => (
                <li
                  key={x}
                  style={{
                    display: "flex",
                    gap: 10,
                    fontSize: 15,
                    color: "#1A1A1A",
                    lineHeight: 1.55,
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#5B7B5B"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, marginTop: 3 }}
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div
            style={{
              padding: "36px 32px",
              borderRadius: 22,
              background: "white",
              border: "1.5px solid rgba(198,40,40,0.25)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#C62828",
                marginBottom: 14,
              }}
            >
              ✗ Who this is NOT for
            </div>
            <h3
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#1A1A1A",
                margin: "0 0 20px",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Save your money if —
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
              {notForList.map((x) => (
                <li
                  key={x}
                  style={{
                    display: "flex",
                    gap: 10,
                    fontSize: 15,
                    color: "#1A1A1A",
                    lineHeight: 1.55,
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C62828"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, marginTop: 3 }}
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* FOUNDING PRICE BLOCK                                                        */
/* -------------------------------------------------------------------------- */

function FoundingPriceBlock() {
  return (
    <section
      style={{
        padding: "120px 24px",
        background: "#0F0F0F",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          display: "grid",
          gap: 28,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#E6C178",
          }}
        >
          § Why founding price
        </div>
        <h2
          style={{
            fontSize: "clamp(40px, 5vw, 64px)",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.0,
            margin: 0,
          }}
        >
          ₹75,000 off.{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#E6C178",
            }}
          >
            In exchange for two things.
          </em>
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.7,
            margin: 0,
            maxWidth: 640,
          }}
        >
          You&rsquo;re helping me prove the private-mentorship model works. That&rsquo;s
          worth real money to me, which is why I&rsquo;m willing to give up
          ₹75,000 on the first three seats.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              k: "01",
              title: "Written testimonial · month 3",
              body:
                "A few honest paragraphs about what's working and what's not. I use it on the public page.",
            },
            {
              k: "02",
              title: "2-min video review · month 6",
              body:
                "Only if you're genuinely happy. If you're not, you owe me nothing beyond the mentorship itself.",
            },
          ].map((x) => (
            <div
              key={x.k}
              style={{
                padding: "22px 24px",
                borderRadius: 16,
                background: "rgba(230,193,120,0.06)",
                border: "1px solid rgba(230,193,120,0.28)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#E6C178",
                  marginBottom: 8,
                }}
              >
                {x.k}
              </div>
              <h4
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "white",
                  margin: "0 0 8px",
                }}
              >
                {x.title}
              </h4>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.65)",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {x.body}
              </p>
            </div>
          ))}
        </div>
        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
            margin: "8px 0 0",
            fontStyle: "italic",
            fontFamily: "'Instrument Serif', serif",
          }}
        >
          After these 3 slots close, the next mentorship batch opens at ₹2,50,000 &mdash; no
          discount, no exceptions.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* TIMELINE                                                                    */
/* -------------------------------------------------------------------------- */

function Timeline() {
  const phases = [
    { when: "Week 1", what: "Kickoff call · KDP account audit · 90-day plan" },
    { when: "Month 1", what: "First book in progress · niche locked · cover direction set" },
    { when: "Month 2", what: "First book live on Amazon · second book drafted" },
    { when: "Month 3", what: "Written testimonial due · 3 books live · group cohort starts" },
    { when: "Month 4–5", what: "Scale window · 5–8 books live · KDP A+ content learned" },
    { when: "Month 6", what: "2-min video review · graduation · affiliate offer if fit" },
  ];
  return (
    <section
      style={{
        padding: "120px 24px",
        background: "#FAF5EB",
        color: "#1A1A1A",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 28,
            fontSize: 11,
            color: "#6B7280",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 44, height: 1, background: "#C62828" }} />
          § Six months · six milestones
          <span style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }} />
          <span>May 5 → Nov 5, 2026</span>
        </div>
        <h2
          style={{
            fontSize: "clamp(36px, 4.5vw, 56px)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            margin: "0 0 44px",
            maxWidth: 760,
          }}
        >
          What the six months{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#C62828",
            }}
          >
            actually look like.
          </em>
        </h2>
        <div
          style={{
            background: "white",
            border: "1px solid rgba(26,26,26,0.08)",
            borderRadius: 22,
            overflow: "hidden",
          }}
        >
          {phases.map((p, i) => (
            <div
              key={p.when}
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr",
                gap: 24,
                padding: "22px 28px",
                borderTop: i === 0 ? "none" : "1px solid rgba(26,26,26,0.06)",
                alignItems: "baseline",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#C62828",
                }}
              >
                {p.when}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "#1A1A1A",
                  lineHeight: 1.55,
                }}
              >
                {p.what}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* FOUNDER BLOCK                                                               */
/* -------------------------------------------------------------------------- */

function FounderBlock() {
  return (
    <section
      style={{
        padding: "120px 24px",
        background: "#0F0F0F",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        <div
          style={{
            aspectRatio: "4/5",
            background:
              "linear-gradient(135deg, rgba(230,193,120,0.12), rgba(198,40,40,0.08)), #1A1A1A",
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            placeItems: "center",
            color: "rgba(255,255,255,0.3)",
            fontSize: 12,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Ehsan Asgar
        </div>
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#E6C178",
              marginBottom: 14,
            }}
          >
            § Who&rsquo;s mentoring you
          </div>
          <h2
            style={{
              fontSize: "clamp(36px, 4.5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 1.0,
              margin: "0 0 24px",
            }}
          >
            Ehsan Asgar.{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#E6C178",
              }}
            >
              English teacher.
            </em>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.75,
              margin: "0 0 16px",
            }}
          >
            I teach English at a government school in Malappuram, Kerala. In
            the last 18 months, the books I published on Amazon KDP &mdash; with a lot
            of help from AI &mdash; have paid me more than my school salary. Last
            month alone, ₹1,16,000.
          </p>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.75,
              margin: "0 0 16px",
            }}
          >
            I&rsquo;m on sabbatical for the whole of 2026 to teach this system
            full-time. The mentorship is how I help three people shortcut
            the two years it took me.
          </p>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.45)",
              fontStyle: "italic",
              fontFamily: "'Instrument Serif', serif",
              margin: 0,
            }}
          >
            I still reply personally. That&rsquo;s not a marketing line &mdash; it&rsquo;s
            why I&rsquo;m capping this at three.
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* APPLY SECTION                                                               */
/* -------------------------------------------------------------------------- */

function ApplySection() {
  return (
    <section
      id="apply"
      style={{
        padding: "140px 24px",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(230,193,120,0.16), transparent 55%), #0F0F0F",
        color: "white",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#E6C178",
            marginBottom: 14,
          }}
        >
          § Apply
        </div>
        <h2
          style={{
            fontSize: "clamp(48px, 6vw, 88px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 0.96,
            margin: "0 0 20px",
          }}
        >
          Three seats.{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#E6C178",
            }}
          >
            One week.
          </em>
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.7,
            margin: "0 auto 36px",
            maxWidth: 560,
          }}
        >
          WhatsApp me with the word <strong style={{ color: "white" }}>&ldquo;MENTORSHIP&rdquo;</strong> and
          your name. I&rsquo;ll send a short 5-question application form. If
          you&rsquo;re a fit, I&rsquo;ll send a payment link the same day.
        </p>
        <a
          href={APPLY_HREF}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "20px 36px",
            background: "#E6C178",
            color: "#2a1f08",
            textDecoration: "none",
            borderRadius: 999,
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: "0.01em",
            boxShadow: "0 20px 44px rgba(230,193,120,0.28)",
          }}
        >
          Apply on WhatsApp →
        </a>
        <p
          style={{
            marginTop: 24,
            fontSize: 12,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.02em",
          }}
        >
          Closes Monday April 28, 8 PM IST &middot; or earlier if filled &middot;
          No sales calls unless you ask.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                         */
/* -------------------------------------------------------------------------- */

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Is the ₹1,75,000 refundable?",
    a: "Once the kickoff audit call happens, the mentorship is non-refundable — you&rsquo;ve already received real advice on your account. Before the kickoff call (within 7 days of payment), full refund, no questions.",
  },
  {
    q: "Can I pay in instalments?",
    a: "Yes. Either one payment of ₹1,75,000, or three instalments of ₹62,500 each (month 1, month 3, month 5). Ask about instalments on WhatsApp.",
  },
  {
    q: "What if I already have books on Amazon?",
    a: "Even better. The audit is most valuable when there's existing data to read. We'll start by fixing what's underperforming, then build up from there.",
  },
  {
    q: "Do I need to be in Kerala / India?",
    a: "No. The whole program is Zoom + WhatsApp. Mentorship students in the GCC, UK, US — all welcome. Calls get scheduled around your timezone.",
  },
  {
    q: "What language is this in?",
    a: "English. I teach English for a living. If Malayalam is your stronger language, you're still welcome — the WhatsApp channel can run bilingual.",
  },
  {
    q: "Why only three slots?",
    a: "Because bi-weekly calls + WhatsApp + book reviews is real time. Three students = roughly 30–40 hours of my month. More than that and the quality drops — and the point of founding price is that quality stays high.",
  },
];

function MentorshipFAQ() {
  return (
    <section
      style={{
        padding: "128px 24px",
        background: "#FAF5EB",
        color: "#1A1A1A",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 28,
            fontSize: 11,
            color: "#6B7280",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <span style={{ width: 44, height: 1, background: "#C62828" }} />
          § Q &amp; A
          <span style={{ flex: 1, height: 1, background: "rgba(26,26,26,0.08)" }} />
          <span>Six questions, straight answers.</span>
        </div>
        <h2
          style={{
            fontSize: "clamp(44px, 5.5vw, 72px)",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
            margin: "0 0 44px",
            maxWidth: 760,
          }}
        >
          Before you apply,{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#C62828",
            }}
          >
            the honest column.
          </em>
        </h2>
        <div
          style={{
            borderTop: "2px solid #1A1A1A",
            borderBottom: "2px solid #1A1A1A",
          }}
        >
          {FAQ.map((item, i) => (
            <article
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(220px, 0.9fr) 1.4fr",
                gap: 48,
                padding: "36px 0",
                borderTop: i === 0 ? "none" : "1px solid rgba(26,26,26,0.10)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#C62828",
                    marginBottom: 10,
                  }}
                >
                  Q · {String(i + 1).padStart(2, "0")}
                </div>
                <h3
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontWeight: 400,
                    fontSize: "clamp(22px, 2.2vw, 30px)",
                    letterSpacing: "-0.015em",
                    lineHeight: 1.2,
                    color: "#1A1A1A",
                    margin: 0,
                  }}
                >
                  &ldquo;{item.q}&rdquo;
                </h3>
              </div>
              <p
                style={{
                  fontSize: 16,
                  color: "#3f3f46",
                  lineHeight: 1.75,
                  margin: 0,
                  maxWidth: 580,
                }}
                dangerouslySetInnerHTML={{ __html: item.a }}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
