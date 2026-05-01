import TopNav from "@/components/design/TopNav";
import FooterEditorial from "@/components/design/FooterEditorial";
import DemoConvaiWidget from "@/components/DemoConvaiWidget";

export const metadata = {
  title: "Live Demo · AI College Admissions Reactivation Agent · Skillies.AI",
  description:
    "Try Skillies' AI Sales Agent live. Multilingual (Malayalam, Tamil, Kannada, English). Built for higher-education institutions running outbound reactivation campaigns. Talk or text — anyone can test it.",
  openGraph: {
    title: "Live Demo · AI College Admissions Reactivation Agent",
    description:
      "Talk or text our AI agent live. Multilingual reactivation campaigns built for Indian higher-education institutions. ₹5L for 9,000-call campaigns.",
  },
};

const CREAM = "#FAF5EB";
const INK = "#1A1A1A";
const MUTED = "#595959";
const ACCENT = "#0F766E";
const RED = "#C62828";
const GOLD = "#C9A24E";

export default function DemoPage() {
  return (
    <main style={{ background: CREAM, minHeight: "100vh", color: INK }}>
      <TopNav />

      {/* HIDE THE GLOBAL FLOATING CHAT WIDGET ON THIS PAGE — the inline demo agent
          replaces it. The global widget is mounted in app/layout.tsx and uses
          the production agent_4301; on this route we want the demo agent
          (agent_1901…) running in the inline panel below instead. The CSS
          targets the floating launcher button by its container class. */}
      <style>{`
        body > [data-skillies-chat-launcher],
        body > div[class*="chat-launcher"],
        body > #skillies-chat-root {
          display: none !important;
        }
      `}</style>

      <article
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "120px 24px 80px",
        }}
      >
        {/* ── EYEBROW ───────────────────────────────────────────── */}
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: ACCENT,
            margin: "0 0 18px",
          }}
        >
          Live Demo · AI Sales Agent
        </p>

        {/* ── HEADLINE ─────────────────────────────────────────── */}
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(38px, 6vw, 64px)",
            lineHeight: 1.05,
            fontWeight: 400,
            margin: "0 0 24px",
            letterSpacing: "-0.01em",
          }}
        >
          Hear what your reactivation campaign sounds like.
        </h1>

        <p
          style={{
            fontSize: 19,
            lineHeight: 1.55,
            color: MUTED,
            margin: "0 0 12px",
            maxWidth: 720,
          }}
        >
          This is a live AI voice and chat agent built for Indian higher-education
          institutions. It speaks <strong style={{ color: INK }}>Malayalam, Tamil, Kannada, and English</strong> — and switches mid-conversation as the caller prefers.
        </p>

        <p
          style={{
            fontSize: 19,
            lineHeight: 1.55,
            color: MUTED,
            margin: "0 0 40px",
            maxWidth: 720,
          }}
        >
          Click the button below to talk to it, or type your messages.
          The agent will run a sample reactivation conversation — exactly what your
          past inquiries would experience in a real production campaign.
        </p>

        {/* ── DEMO PANEL ───────────────────────────────────────── */}
        <section
          aria-label="Live AI agent"
          style={{
            background: "#FFFFFF",
            border: `1px solid ${ACCENT}33`,
            borderRadius: 16,
            padding: "32px 28px",
            boxShadow: "0 10px 40px rgba(15, 118, 110, 0.08)",
            margin: "0 0 56px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#10B981",
                boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.18)",
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              Live · Multilingual
            </span>
          </div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 600,
              margin: "0 0 8px",
              color: INK,
            }}
          >
            Skillies Reactivation Agent
          </h2>
          <p
            style={{
              fontSize: 15,
              color: MUTED,
              margin: "0 0 24px",
              lineHeight: 1.55,
            }}
          >
            Click the launcher to start. Allow mic access if you want to talk;
            otherwise just type. The agent will open in Malayalam by default and
            switch as you reply.
          </p>

          {/* The actual ElevenLabs web component embed */}
          <DemoConvaiWidget agentId="agent_6601kqjcwbrbew8t6ye78jq9g0g3" />

          <p
            style={{
              fontSize: 12,
              color: MUTED,
              marginTop: 20,
              fontStyle: "italic",
              borderTop: "1px solid #E7E5E4",
              paddingTop: 16,
            }}
          >
            This is a demo. The agent uses placeholder programme details
            (St. John&apos;s College in Kollam, UG admissions). In production for your
            institution, every detail would be configured to your real programmes,
            fee structures, and brand voice.
          </p>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────── */}
        <section style={{ margin: "0 0 56px" }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 600,
              margin: "0 0 28px",
              color: INK,
            }}
          >
            What this agent would do for your institution
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            <Card
              num="01"
              title="Calls every past inquiry"
              body="Up to 9,000 contacts in 5–7 working days. Same script, same quality, every call. No telecaller fatigue."
            />
            <Card
              num="02"
              title="Speaks their language"
              body="Auto-detects and switches between Malayalam, Tamil, Kannada, and English mid-conversation. Native-quality voice."
            />
            <Card
              num="03"
              title="Routes hot leads in 60 seconds"
              body="Serious prospects delivered to your admissions team via WhatsApp + email instantly — name, language, programme, callback time."
            />
            <Card
              num="04"
              title="DND/TRAI compliant"
              body="Every number checked against the national DND registry. Caller ID and consent header registered with telecom DLT. Zero compliance risk."
            />
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────── */}
        <section
          style={{
            background: "#FFFFFF",
            border: `1px solid ${ACCENT}22`,
            borderRadius: 16,
            padding: "32px 28px",
            margin: "0 0 56px",
          }}
        >
          <h2
            style={{
              fontSize: 24,
              fontWeight: 600,
              margin: "0 0 16px",
              color: INK,
            }}
          >
            Investment for a 9,000-call campaign
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              alignItems: "baseline",
              margin: "0 0 16px",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: MUTED,
                  margin: "0 0 4px",
                  fontWeight: 600,
                }}
              >
                Setup (one-time)
              </p>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  margin: 0,
                  color: INK,
                }}
              >
                ₹1,50,000
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: MUTED,
                  margin: "0 0 4px",
                  fontWeight: 600,
                }}
              >
                Per-call rate
              </p>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  margin: 0,
                  color: INK,
                }}
              >
                ₹40
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: MUTED,
                  margin: "0 0 4px",
                  fontWeight: 600,
                }}
              >
                9,000-call total
              </p>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  margin: 0,
                  color: ACCENT,
                }}
              >
                ₹5,10,000
              </p>
            </div>
          </div>
          <p
            style={{
              fontSize: 14,
              color: MUTED,
              margin: 0,
            }}
          >
            Plus 18% GST. 50% on signing, 50% on go-live. Live within 14 working days.
          </p>
        </section>

        {/* ── CONTACT ─────────────────────────────────────────── */}
        <section
          style={{
            textAlign: "center",
            margin: "80px 0 0",
            padding: "40px 24px",
            background: "#0F0F0F",
            color: "#FAF5EB",
            borderRadius: 16,
          }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: GOLD,
              margin: "0 0 14px",
            }}
          >
            Ready to deploy
          </p>
          <h3
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 400,
              margin: "0 0 16px",
              letterSpacing: "-0.01em",
            }}
          >
            For your institution. In your brand voice.
          </h3>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: "#D1D5DB",
              margin: "0 auto 28px",
              maxWidth: 540,
            }}
          >
            Talk to Ehsan personally. 30-minute call walks you through deployment
            for your specific programmes, fees, and lead lists.
          </p>
          <a
            href="https://wa.me/918714318352?text=I'd%20like%20to%20talk%20about%20the%20AI%20Reactivation%20Agent%20demo"
            style={{
              display: "inline-block",
              background: GOLD,
              color: "#0F0F0F",
              padding: "14px 32px",
              borderRadius: 8,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 15,
              letterSpacing: "0.04em",
            }}
          >
            WhatsApp Ehsan · +91 8714318352
          </a>
          <p
            style={{
              fontSize: 13,
              color: "#9CA3AF",
              margin: "20px 0 0",
            }}
          >
            Or email{" "}
            <a
              href="mailto:ehsansager@gmail.com"
              style={{ color: "#FAF5EB", textDecoration: "underline" }}
            >
              ehsansager@gmail.com
            </a>
          </p>
        </section>
      </article>

      <FooterEditorial />
    </main>
  );
}

// ── Card component ───────────────────────────────────────────
function Card({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E7E5E4",
        borderRadius: 12,
        padding: "24px 22px",
      }}
    >
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.18em",
          fontWeight: 700,
          color: ACCENT,
          margin: "0 0 12px",
        }}
      >
        {num}
      </p>
      <h3
        style={{
          fontSize: 17,
          fontWeight: 600,
          margin: "0 0 8px",
          color: INK,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.55,
          color: MUTED,
          margin: 0,
        }}
      >
        {body}
      </p>
    </div>
  );
}
