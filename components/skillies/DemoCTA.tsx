/**
 * DemoCTA · invites the prospect to experience the agent.
 * Two paths · (a) try it live on WhatsApp (the same Skillies WhatsApp
 * Business line that sells customers — eat-our-own-dogfood proof), or
 * (b) tap the embedded voice demo on the vertical page.
 *
 * The Skillies WhatsApp Business number is +91 80899 41131. This is a
 * legitimate operational/product CTA — it's the agent itself. "Talk to
 * Ehsan personally" CTAs route through Cal.com instead (see BookCallCTA).
 *
 * One emoji rule applies — keep this text-clean.
 */
import Link from "next/link";

export type DemoCTAProps = {
  /** Demo URL — typically /demo/<vertical> */
  demoHref: string;
  /** WhatsApp link · defaults to Skillies' WhatsApp Business line. Override
   *  per-vertical to pre-fill the message text. */
  waHref?: string;
  /** Section heading */
  heading: string;
  /** Body copy under heading (1–2 sentences) */
  body: string;
  /** Primary CTA label */
  ctaLabel?: string;
  /** Optional mock chat-preview lines */
  mockChat?: readonly { from: "user" | "agent"; text: string }[];
};

const DEFAULT_WA =
  "https://wa.me/918089941131?text=Hi%2C%20I%20want%20to%20try%20the%20Skillies%20AI%20agent%20on%20WhatsApp.%20My%20business%20is%20";

export default function DemoCTA({
  demoHref,
  waHref = DEFAULT_WA,
  heading,
  body,
  ctaLabel = "Try the agent on WhatsApp",
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
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all hover:scale-[1.02]"
              style={{
                background: "var(--sk-red)",
                color: "var(--sk-cream)",
              }}
            >
              {ctaLabel}
            </Link>
            <Link
              href={demoHref}
              className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
              style={{
                border: "1px solid var(--sk-ink20)",
                color: "var(--sk-ink)",
              }}
            >
              See the live demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
