/**
 * DemoCTA · invites the prospect to experience the agent live and book a call.
 * Shows a faux chat preview + the live demo CTA + a Cal.com booking CTA.
 *
 * Public CTAs MUST funnel through Cal.com — never expose personal WhatsApp.
 * One emoji rule applies — keep this text-clean.
 */
import Link from "next/link";

export type DemoCTAProps = {
  /** Demo URL — typically /demo/<vertical> */
  demoHref: string;
  /** Booking link · defaults to Ehsan's Cal.com 30-min slot */
  bookHref?: string;
  /** Section heading */
  heading: string;
  /** Body copy under heading (1–2 sentences) */
  body: string;
  /** Primary CTA label */
  ctaLabel?: string;
  /** Optional mock chat-preview lines */
  mockChat?: readonly { from: "user" | "agent"; text: string }[];
};

const DEFAULT_BOOK = "https://cal.com/sager-zmd4kl/30min";

export default function DemoCTA({
  demoHref,
  bookHref = DEFAULT_BOOK,
  heading,
  body,
  ctaLabel = "Try the live demo",
  mockChat,
}: DemoCTAProps) {
  return (
    <section className="sk-section">
      <div className="sk-container">
        <div className="mx-auto max-w-[820px]">
          <h2
            className="sk-font-section"
            style={{
              fontSize: "var(--sk-text-h2)",
              color: "var(--sk-ink)",
              maxWidth: "20ch",
            }}
          >
            {heading}
          </h2>
          <p
            className="sk-font-body mt-5 max-w-[60ch]"
            style={{ fontSize: "var(--sk-text-lead)", color: "var(--sk-ink60)" }}
          >
            {body}
          </p>

          {mockChat && mockChat.length > 0 ? (
            <div
              className="mt-10 rounded-2xl p-6 sm:p-8"
              style={{
                border: "1px solid var(--sk-ink10)",
                background: "var(--sk-cream)",
              }}
            >
              <div className="space-y-3">
                {mockChat.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[80%] rounded-2xl px-4 py-3 sk-font-body ${
                      m.from === "agent" ? "ml-auto" : ""
                    }`}
                    style={{
                      fontSize: "0.9375rem",
                      background:
                        m.from === "agent" ? "var(--sk-cream-dark)" : "var(--sk-ink)",
                      color:
                        m.from === "agent" ? "var(--sk-ink)" : "var(--sk-cream)",
                    }}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={demoHref}
              className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all hover:scale-[1.02]"
              style={{
                background: "var(--sk-red)",
                color: "var(--sk-cream)",
              }}
            >
              {ctaLabel}
            </Link>
            <Link
              href={bookHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
              style={{
                border: "1px solid var(--sk-ink20)",
                color: "var(--sk-ink)",
              }}
            >
              Book a 30-min call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
