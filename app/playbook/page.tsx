import Link from "next/link";
import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "The AI Avatar Video Playbook · Free Download · Skillies.AI",
  description:
    "Make videos of yourself in any language — from just a voice recording. 7-page PDF guide from Ehsan Asgar (Skillies.AI). Free download. No email required.",
  openGraph: {
    title: "The AI Avatar Video Playbook · Free",
    description:
      "Make videos of yourself in any language — from just a voice recording. 7-page PDF from Skillies.AI.",
  },
};

const PDF_HREF = "/ai-avatar-playbook.pdf";

export default function PlaybookPage() {
  return (
    <main style={{ background: "#0F0F0F", color: "white" }}>
      <TopNav cta={{ href: PDF_HREF, label: "Download PDF" }} />

      <Hero />
      <WhatsInside />
      <WhoThisHelps />
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
          § Playbook Vol. 01 · Free
          <span
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}
          />
          <span>7 pages · PDF</span>
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
                fontSize: "clamp(48px, 6vw, 88px)",
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                color: "white",
              }}
            >
              The AI Avatar{" "}
              <em
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "#E6C178",
                }}
              >
                Video Playbook.
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
              Make videos of yourself in any language — from just a voice
              recording. No camera. No studio. A 7-page guide with the exact
              HeyGen workflow, tool plans, and seven pro tips.
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
              Free · No email signup · ~200 KB · Print-friendly
            </p>
          </div>

          {/* PDF "cover" card on the right */}
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
            {/* Top gold strip */}
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
              § Skillies.AI · Vol. 01
            </div>
            <div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 32,
                  color: "white",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.0,
                  marginBottom: 12,
                }}
              >
                The AI Avatar
                <br />
                Video Playbook.
              </div>
              <div
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: 16,
                  color: "#E6C178",
                  lineHeight: 1.3,
                }}
              >
                Make videos of yourself in any language — from just a voice
                recording.
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
    title: "The setup — what the reel didn't tell you",
    body: "The honest two-step workflow. No voice cloning needed.",
  },
  {
    n: "02",
    title: "The big picture · one hour of setup",
    body: "Four-stage diagram. Three minutes per video after the initial setup.",
  },
  {
    n: "03",
    title: "Step 01 · Sign up + plan comparison",
    body: "Creator $29 vs Team $89 vs Enterprise. Which one you actually need.",
  },
  {
    n: "04",
    title: "Step 02 · Train your avatar (one time)",
    body: "Four-part checklist: record, light, upload, wait. Done for life.",
  },
  {
    n: "05",
    title: "Step 03 · Record audio → upload → generate",
    body: "The only step you repeat. Phone voice memo + HeyGen.",
  },
  {
    n: "06",
    title: "Seven pro tips I wish someone told me",
    body: "Length, lighting, Malayalam-specific pacing, captions, the long game.",
  },
  {
    n: "07",
    title: "What to build next",
    body: "Where AI avatars fit in the broader AI creator playbook.",
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
          Seven chapters,{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#C62828",
            }}
          >
            no filler.
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
      h: "Teachers",
      b: "You're great at explaining things on paper, but filming takes hours you don't have. Record audio between classes. Ship video content daily.",
    },
    {
      h: "Writers & creators",
      b: "You've been putting off video because you don't own a camera setup. Your voice is all you need.",
    },
    {
      h: "Business owners",
      b: "You want to post daily, but you hate being on camera. Avatar takes over — you still sound like you.",
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
          Not a content farm.{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#E6C178",
            }}
          >
            A shortcut for people with something to say.
          </em>
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "rgba(255,255,255,0.65)",
            maxWidth: 620,
            margin: "0 0 48px",
            lineHeight: 1.7,
          }}
        >
          If you freeze on camera — or don't own one — but you're perfectly fine
          recording a voice note, this is for you.
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
          HeyGen is one tool.{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#C62828",
            }}
          >
            The full playbook is live in Kerala.
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
          The real system — niche research, AI book creation, cover design,
          Amazon KDP uploads, scaling to passive income — I teach at three price
          points:
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
/* FINAL DOWNLOAD PROMPT                                                     */
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
          Seven pages. No email required. Print-friendly.
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
