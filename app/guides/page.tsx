import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Free Guides · Skillies.AI",
  description:
    "Free, no-email-required playbooks from the Skillies workshop. Short, editorial PDFs you can download in one click.",
};

type Guide = {
  slug: string;
  file: string;
  no: string;
  category: string;
  title: string;
  subtitle: string;
  blurb: string;
  pages: string;
  updated: string;
};

const GUIDES: Guide[] = [
  {
    slug: "claude-watch-skill",
    file: "/skillies-claude-watch-guide.pdf",
    no: "No. 01",
    category: "AI Workflow",
    title: "Make Claude watch any video for you.",
    subtitle:
      "A 5-minute setup that turns Claude Code into a video research engine.",
    blurb:
      "Hours-long YouTube lectures, Instagram reels, Looms, MP4s — Claude watches the frames, reads the transcript, and hands you the takeaways while you make coffee. Free, runs locally, ~$1 per video.",
    pages: "7 pages",
    updated: "May 2026",
  },
];

export default function GuidesPage() {
  return (
    <main style={{ background: "#FAF5EB", minHeight: "100vh" }}>
      <TopNav />

      <section
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "120px 24px 28px",
          color: "#1A1A1A",
        }}
      >
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
          § FREE · NO EMAIL REQUIRED
        </p>
        <h1
          style={{
            fontSize: "clamp(44px, 6vw, 72px)",
            fontWeight: 900,
            color: "#1A1A1A",
            margin: "0 0 18px",
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
          }}
        >
          Free guides from{" "}
          <span
            style={{
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#C62828",
            }}
          >
            the Skillies workshop
          </span>
          .
        </h1>
        <p
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(18px, 2.2vw, 22px)",
            lineHeight: 1.4,
            color: "#4A4A4A",
            margin: "0 0 48px",
            maxWidth: 720,
          }}
        >
          Short, editorial PDFs we hand out at our workshops. Real workflows,
          not opt-in fluff. Click, download, use it tonight.
        </p>
      </section>

      <section
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 24,
          }}
        >
          {GUIDES.map((g) => (
            <article
              key={g.slug}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8DEC8",
                borderRadius: 16,
                padding: "32px clamp(24px, 4vw, 44px)",
                display: "grid",
                gap: 18,
              }}
            >
              <header
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#6B7280",
                }}
              >
                <span style={{ color: "#1A1A1A" }}>{g.no}</span>
                <span style={{ color: "#E8DEC8" }}>·</span>
                <span
                  style={{
                    background: "#FAF5EB",
                    color: "#1F3A2E",
                    padding: "4px 12px",
                    borderRadius: 999,
                    letterSpacing: "0.14em",
                  }}
                >
                  {g.category}
                </span>
                <span style={{ color: "#E8DEC8" }}>·</span>
                <span>{g.pages}</span>
                <span style={{ color: "#E8DEC8" }}>·</span>
                <span>{g.updated}</span>
              </header>

              <h2
                style={{
                  fontSize: "clamp(28px, 3.5vw, 40px)",
                  fontWeight: 900,
                  color: "#1A1A1A",
                  margin: 0,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.04,
                }}
              >
                {g.title}
              </h2>

              <p
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "clamp(16px, 1.8vw, 20px)",
                  lineHeight: 1.4,
                  color: "#4A4A4A",
                  margin: 0,
                }}
              >
                {g.subtitle}
              </p>

              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: "#1A1A1A",
                  margin: 0,
                }}
              >
                {g.blurb}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 6,
                }}
              >
                <a
                  href={g.file}
                  download
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#C62828",
                    color: "#FFFFFF",
                    textDecoration: "none",
                    padding: "14px 28px",
                    borderRadius: 999,
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: "0.01em",
                  }}
                >
                  Download PDF ↓
                </a>
                <a
                  href={g.file}
                  target="_blank"
                  rel="noopener"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "transparent",
                    color: "#1A1A1A",
                    textDecoration: "none",
                    padding: "14px 24px",
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 15,
                    border: "1.5px solid #1A1A1A",
                  }}
                >
                  Preview in browser →
                </a>
              </div>
            </article>
          ))}
        </div>

        <p
          style={{
            marginTop: 56,
            padding: "20px 0 0",
            borderTop: "1px solid #E8DEC8",
            fontSize: 14,
            color: "#6B7280",
            lineHeight: 1.7,
          }}
        >
          More guides drop here as we run new workshops. Want one on a specific
          workflow? Email{" "}
          <a
            href="mailto:hi@skillies.ai"
            style={{ color: "#C62828", fontWeight: 600 }}
          >
            hi@skillies.ai
          </a>
          .
        </p>
      </section>

      <FooterEditorial />
      <WhatsAppButton />
    </main>
  );
}
