import Link from "next/link";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "The ChatGPT Business Playbook · Free Download · Skillies.AI",
  description:
    "How 5 people get ChatGPT Business for a month at near-zero cost. The exact domain → Google Workspace → ChatGPT Business flow. 7-page PDF from Skillies.AI. Free download.",
  openGraph: {
    title: "The ChatGPT Business Playbook · Free",
    description:
      "How 5 people get ChatGPT Business for a month at near-zero cost. 7-page PDF from Skillies.AI.",
  },
};

const PDF_HREF = "/chatgpt-business-playbook.pdf";

export default function ChatGPTBusinessPage() {
  return (
    <main style={{ background: "#0F0F0F", color: "white" }}>
      <TopNav cta={{ href: PDF_HREF, label: "Download PDF" }} />

      <Hero />
      <WhatsInside />
      <WhoThisHelps />
      <EthicsCallout />
      <ExploreSkillies />
      <FinalDownload />

      <FooterEditorial />
      <WhatsAppButton />
    </main>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* HERO                                                                     */
/* ────────────────────────────────────────────────────────────────────── */

function Hero() {
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
          § Playbook Vol. 02 · Free
          <span
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}
          />
          <span>4 pages · PDF</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontWeight: 900,
                fontSize: "clamp(44px, 5.5vw, 80px)",
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                color: "white",
              }}
            >
              The ChatGPT{" "}
              <em
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "#E6C178",
                }}
              >
                Business Playbook.
              </em>
            </h1>

            <p
              style={{
                fontSize: 19,
                color: "rgba(255,255,255,0.72)",
                maxWidth: 580,
                margin: "28px 0 36px",
                lineHeight: 1.65,
              }}
            >
              How 5 people get ChatGPT Business for a month — at near-zero
              cost. Short, straight, simple. Four steps. Total cost ~₹250.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={PDF_HREF}
                download
                style={{
                  padding: "18px 32px",
                  background: "#E6C178",
                  color: "#2a1f08",
                  textDecoration: "none",
                  borderRadius: 999,
                  fontSize: 17,
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  boxShadow: "0 20px 44px rgba(230,193,120,0.28)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download the PDF
              </a>
              <Link
                href="#inside"
                style={{
                  padding: "18px 28px",
                  background: "transparent",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 600,
                  border: "1.5px solid rgba(255,255,255,0.25)",
                }}
              >
                See what's inside
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
              Free · No email signup · 4 pages · Print-friendly
            </p>
          </div>

          {/* PDF "cover" card */}
          <div
            style={{
              position: "relative",
              aspectRatio: "8.5 / 11",
              borderRadius: 14,
              background:
                "linear-gradient(135deg, rgba(230,193,120,0.12), rgba(15,15,15,1)), #0F0F0F",
              border: "1px solid rgba(230,193,120,0.25)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(230,193,120,0.15)",
              overflow: "hidden",
              padding: 28,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: "#C9A24E",
              }}
            />
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#E6C178",
              }}
            >
              § Skillies.AI · Vol. 02
            </div>
            <div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 28,
                  color: "white",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.0,
                  marginBottom: 12,
                }}
              >
                The ChatGPT
                <br />
                Business Playbook.
              </div>
              <div
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 15,
                  color: "#E6C178",
                  lineHeight: 1.3,
                }}
              >
                How 5 people get ChatGPT Business for a month — at near-zero
                cost.
              </div>
              <div
                style={{
                  width: 60,
                  height: 2,
                  background: "#C9A24E",
                  marginTop: 16,
                }}
              />
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.45)",
                fontWeight: 600,
              }}
            >
              — Ehsan Asgar · Skillies.AI
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* WHAT'S INSIDE                                                            */
/* ────────────────────────────────────────────────────────────────────── */

const INSIDE: Array<{ n: string; title: string; body: string }> = [
  {
    n: "01",
    title: "Buy a cheap domain",
    body: "Any registrar. .com or .co. About ₹99–₹300 for the first year.",
  },
  {
    n: "02",
    title: "Get one Google Workspace email",
    body: "One mailbox on your domain — you@yourdomain.com. 14-day trial.",
  },
  {
    n: "03",
    title: "Sign up for ChatGPT with that email",
    body: "ChatGPT surfaces the Business trial option on business-domain emails. Click it.",
  },
  {
    n: "04",
    title: "Invite 4 teammates · any email",
    body: "Gmail, Yahoo, anything. No domain or Workspace needed for them. 5 seats done.",
  },
];

function WhatsInside() {
  return (
    <section
      id="inside"
      style={{
        padding: "120px 24px",
        background: "#FAF5EB",
        color: "#1A1A1A",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#C62828",
            marginBottom: 14,
          }}
        >
          § What's inside
        </div>
        <h2
          style={{
            fontSize: "clamp(40px, 5vw, 60px)",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            margin: "0 0 48px",
            maxWidth: 720,
          }}
        >
          Four steps,{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#C62828",
            }}
          >
            under 30 minutes.
          </em>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          {INSIDE.map((it) => (
            <div
              key={it.n}
              style={{
                padding: "24px 26px",
                borderRadius: 16,
                background: "white",
                border: "1px solid rgba(26,26,26,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  fontStyle: "italic",
                  color: "#C9A24E",
                  fontFamily: "Georgia, serif",
                  marginBottom: 10,
                }}
              >
                {it.n}
              </div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#1A1A1A",
                  margin: "0 0 8px",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {it.title}
              </h3>
              <p
                style={{
                  fontSize: 13.5,
                  color: "#6B7280",
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                {it.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* WHO THIS HELPS                                                           */
/* ────────────────────────────────────────────────────────────────────── */

function WhoThisHelps() {
  const items = [
    {
      h: "Students",
      b: "You want to learn with GPT-4 and Claude but ₹17,000+/mo isn't in the budget. Use the trial window to find which tool fits your workflow before you spend anything.",
    },
    {
      h: "Freelancers",
      b: "A ChatGPT Business seat is a tool, not a toy. Before you commit to a recurring cost, get 14–30 real working days to test it against your clients' actual work.",
    },
    {
      h: "Small teams",
      b: "Five people, one trial, two weeks. Enough time to prove whether collaborative AI access earns its keep — before anyone's card is charged.",
    },
  ];
  return (
    <section
      style={{
        padding: "120px 24px",
        background: "#0F0F0F",
        color: "white",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
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
          § Who this helps
        </div>
        <h2
          style={{
            fontSize: "clamp(40px, 5vw, 60px)",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            margin: "0 0 14px",
            maxWidth: 780,
          }}
        >
          Not a scheme.{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#E6C178",
            }}
          >
            A way to try before you buy.
          </em>
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "rgba(255,255,255,0.65)",
            maxWidth: 640,
            margin: "0 0 48px",
            lineHeight: 1.7,
          }}
        >
          Enterprise AI plans are priced for teams that know they want them.
          This guide is for the rest of us — who want to test the tool before
          agreeing to the monthly tax.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          {items.map((x) => (
            <div
              key={x.h}
              style={{
                padding: "28px 26px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "white",
                  marginBottom: 12,
                  letterSpacing: "-0.015em",
                }}
              >
                {x.h}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.65,
                }}
              >
                {x.b}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* ETHICS CALLOUT                                                           */
/* ────────────────────────────────────────────────────────────────────── */

function EthicsCallout() {
  return (
    <section
      style={{
        padding: "80px 24px",
        background: "#FAF5EB",
        color: "#1A1A1A",
      }}
    >
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "48px 40px",
          background: "white",
          border: "1px solid rgba(26,26,26,0.08)",
          borderRadius: 22,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 5,
            background: "#C62828",
            borderTopLeftRadius: 22,
            borderBottomLeftRadius: 22,
          }}
        />
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#C62828",
            margin: "0 0 14px",
          }}
        >
          § The honest disclaimer
        </p>
        <h3
          style={{
            fontSize: "clamp(26px, 3vw, 36px)",
            fontWeight: 800,
            color: "#1A1A1A",
            margin: "0 0 16px",
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
          }}
        >
          Trial terms change. Read the fine print — every time.
        </h3>
        <p
          style={{
            fontSize: 15,
            color: "#6B7280",
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          Google, OpenAI, and Anthropic update their trial durations, seat
          counts, and card-requirement rules regularly. What's 14 days today
          may be 7 next month. This guide captures the flow that's been
          working in 2026. Before you commit, verify the specific trial terms
          on each provider's pricing page. If you get real value, subscribe
          properly after — karma matters more than we pretend it does.
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* EXPLORE SKILLIES                                                          */
/* ────────────────────────────────────────────────────────────────────── */

function ExploreSkillies() {
  const products: Array<{
    tag: string;
    title: string;
    body: string;
    cta: string;
    href: string;
    accent: string;
  }> = [
    {
      tag: "Sundays in May",
      title: "Kerala Tour Workshop",
      body: "One-day in-person. Build a real Amazon KDP book in six hours. Malappuram · Calicut · Kochi.",
      cta: "From ₹999 · Book a seat",
      href: "/workshop",
      accent: "#C62828",
    },
    {
      tag: "50 days · live",
      title: "The KDP Mastery Cohort",
      body: "Everything I learned in two years, compressed into 50 days. Weekly live Q&A with me. Refund-backed.",
      cta: "₹35,000 · Enroll",
      href: "/#program",
      accent: "#C9A24E",
    },
    {
      tag: "3 founding slots",
      title: "Private Mentorship",
      body: "Six months · 1-on-1 · Amazon account audit · book-by-book reviews · direct WhatsApp line.",
      cta: "Founding ₹1,75,000 · Apply",
      href: "/mentorship",
      accent: "#E6C178",
    },
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
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#C62828",
            marginBottom: 14,
          }}
        >
          § One more thing
        </div>
        <h2
          style={{
            fontSize: "clamp(40px, 5vw, 60px)",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            margin: "0 0 14px",
            maxWidth: 720,
          }}
        >
          Access is the start.{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#C62828",
            }}
          >
            Shipping is the whole point.
          </em>
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "#6B7280",
            maxWidth: 640,
            margin: "0 0 48px",
            lineHeight: 1.7,
          }}
        >
          ChatGPT Business doesn't make you productive. Using it to actually
          ship — books, courses, businesses — does. That's what Skillies
          teaches at three price points:
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 18,
          }}
        >
          {products.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              style={{
                padding: "32px 28px",
                borderRadius: 18,
                background: "white",
                border: "1px solid rgba(26,26,26,0.08)",
                textDecoration: "none",
                color: "inherit",
                display: "block",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: p.accent,
                }}
              />
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: p.accent,
                  marginBottom: 12,
                }}
              >
                {p.tag}
              </div>
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#1A1A1A",
                  margin: "0 0 12px",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  lineHeight: 1.65,
                  margin: "0 0 22px",
                }}
              >
                {p.body}
              </p>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: p.accent,
                  letterSpacing: "0.02em",
                }}
              >
                {p.cta} →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/* FINAL DOWNLOAD                                                            */
/* ────────────────────────────────────────────────────────────────────── */

function FinalDownload() {
  return (
    <section
      style={{
        padding: "140px 24px",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(230,193,120,0.18), transparent 55%), #0F0F0F",
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
          § Free forever
        </div>
        <h2
          style={{
            fontSize: "clamp(44px, 6vw, 80px)",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
            margin: "0 0 22px",
          }}
        >
          Grab the playbook.
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
          Four pages. No email required. Print-friendly.
        </p>
        <a
          href={PDF_HREF}
          download
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "20px 40px",
            background: "#E6C178",
            color: "#2a1f08",
            textDecoration: "none",
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.01em",
            boxShadow: "0 20px 44px rgba(230,193,120,0.28)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download the PDF
        </a>
        <p
          style={{
            marginTop: 24,
            fontSize: 13,
            color: "rgba(255,255,255,0.45)",
            fontStyle: "italic",
            fontFamily: "Georgia, serif",
          }}
        >
          Questions? WhatsApp Ehsan · +91 87143 18352
        </p>
      </div>
    </section>
  );
}
