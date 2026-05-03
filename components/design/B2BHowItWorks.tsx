/**
 * B2BHowItWorks · 3-step explainer for the new homepage.
 *
 * Step 1 → DM the demo (experience the agent on yourself)
 * Step 2 → 30-min call (Ehsan walks through your version)
 * Step 3 → Live in 7-14 days (built and operated by Skillies)
 */
import Link from "next/link";

const STEPS = [
  {
    n: "01",
    title: "Try the agent on yourself",
    body: "DM our public WhatsApp or open a vertical demo. The agent qualifies you the way it'll qualify your customers — image understanding, voice notes, language switching, the works.",
  },
  {
    n: "02",
    title: "30 minutes with Ehsan",
    body: "Founder-led discovery call. We scope your vertical, your KB, your integrations, your QC volumes. You leave with a Razorpay link and a build start date.",
  },
  {
    n: "03",
    title: "Live in 7–14 days",
    body: "We build, train, and operate your agent on your WhatsApp Business API number. You don't write prompts. You don't manage a chatbot. You run your business.",
  },
];

export default function B2BHowItWorks() {
  return (
    <section className="sk-section">
      <div className="sk-container">
        <div className="mb-12 max-w-[640px]">
          <p
            className="sk-font-meta mb-4"
            style={{ color: "var(--sk-ink60)" }}
          >
            HOW IT WORKS
          </p>
          <h2
            className="sk-font-section"
            style={{ fontSize: "var(--sk-text-h2)", color: "var(--sk-ink)" }}
          >
            Three steps. No DIY.
            <br />
            <span style={{ color: "var(--sk-ink60)" }}>
              We build it. You run your business.
            </span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <article
              key={s.n}
              className="rounded-2xl p-7"
              style={{
                background: "var(--sk-cream)",
                border: "1px solid var(--sk-hairline)",
              }}
            >
              <p
                className="sk-font-display"
                style={{
                  fontSize: "2.5rem",
                  color: "var(--sk-red)",
                  lineHeight: 1,
                }}
              >
                {s.n}
              </p>
              <h3
                className="sk-font-section mt-4"
                style={{ fontSize: "1.375rem", color: "var(--sk-ink)" }}
              >
                {s.title}
              </h3>
              <p
                className="sk-font-body mt-3"
                style={{ fontSize: "0.9375rem", color: "var(--sk-ink60)" }}
              >
                {s.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="https://cal.com/sager-zmd4kl/30min"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium"
            style={{ background: "var(--sk-red)", color: "var(--sk-cream)" }}
          >
            Book Ehsan · 30 min
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium"
            style={{
              border: "1px solid var(--sk-ink20)",
              color: "var(--sk-ink)",
            }}
          >
            See pricing →
          </Link>
        </div>
      </div>
    </section>
  );
}
