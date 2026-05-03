/**
 * BookCallCTA · the "Talk to Ehsan" / closing CTA.
 *
 * Defaults to a Cal.com link (cal.com/sager-zmd4kl/30min) and includes a
 * note about email-as-fallback. Hajj variant pulls in a softer headline
 * ("A conversation, not a sales call") and email-only CTA.
 */
import Link from "next/link";

export type BookCallCTAProps = {
  /** Section heading */
  heading: string;
  /** Founder note (1–2 lines) */
  note: string;
  /** Cal.com URL */
  calHref?: string;
  /** Email — shown as alternate */
  email?: string;
  /** "softer" variant for hajj — email-led, no Cal.com CTA */
  variant?: "default" | "soft";
  /** Optional Manglish line for Kerala-led verticals */
  manglishLine?: string;
};

const DEFAULT_CAL = "https://cal.com/sager-zmd4kl/30min";
const DEFAULT_EMAIL = "ehsan@skillies.ai";

export default function BookCallCTA({
  heading,
  note,
  calHref = DEFAULT_CAL,
  email = DEFAULT_EMAIL,
  variant = "default",
  manglishLine,
}: BookCallCTAProps) {
  if (variant === "soft") {
    return (
      <section className="sk-section text-center">
        <div className="sk-container">
          <p
            className="sk-font-meta mb-6"
            style={{ color: "var(--sk-ink60)" }}
          >
            A CONVERSATION, NOT A SALES CALL
          </p>
          <h2
            className="sk-font-display-italic mx-auto"
            style={{
              fontSize: "clamp(1.75rem, 2.5vw + 1rem, 2.5rem)",
              maxWidth: "28ch",
              color: "var(--sk-ink)",
            }}
          >
            {heading}
          </h2>
          <p
            className="sk-font-body mt-5 max-w-[52ch] mx-auto"
            style={{ fontSize: "1rem", color: "var(--sk-ink60)" }}
          >
            {note}
          </p>
          <a
            href={`mailto:${email}`}
            className="sk-font-body mt-8 inline-block"
            style={{
              color: "var(--sk-ink)",
              textDecoration: "underline",
              textUnderlineOffset: "0.4em",
            }}
          >
            {email}
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="sk-section">
      <div className="sk-container">
        <div className="mx-auto max-w-[680px] text-center">
          <p
            className="sk-font-meta mb-6"
            style={{ color: "var(--sk-ink60)" }}
          >
            TALK TO EHSAN
          </p>
          <h2
            className="sk-font-section"
            style={{
              fontSize: "var(--sk-text-h2)",
              color: "var(--sk-ink)",
              maxWidth: "20ch",
              margin: "0 auto",
            }}
          >
            {heading}
          </h2>
          <p
            className="sk-font-body mt-5 max-w-[56ch] mx-auto"
            style={{ fontSize: "var(--sk-text-lead)", color: "var(--sk-ink60)" }}
          >
            {note}
          </p>
          {manglishLine ? (
            <p
              className="font-ml mt-3 max-w-[56ch] mx-auto"
              style={{ fontSize: "1rem", color: "var(--sk-ink60)" }}
            >
              {manglishLine}
            </p>
          ) : null}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href={calHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all hover:scale-[1.02]"
              style={{
                background: "var(--sk-red)",
                color: "var(--sk-cream)",
              }}
            >
              Book a 30-min call
            </Link>
            <a
              href={`mailto:${email}`}
              className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
              style={{
                border: "1px solid var(--sk-ink20)",
                color: "var(--sk-ink)",
              }}
            >
              {email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
