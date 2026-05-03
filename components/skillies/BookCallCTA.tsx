/**
 * BookCallCTA · the "Talk to Ehsan" / closing CTA.
 *
 * 2026-05-03 · founder asked us to NOT publish his personal WhatsApp
 * number on the site. All "Talk to Ehsan" CTAs route to Cal.com first ·
 * appointment booking is the funnel. Ehsan WhatsApps the prospect after
 * the slot is booked (he sees the booking + can choose to message).
 */
import Link from "next/link";

export type BookCallCTAProps = {
  /** Section heading */
  heading: string;
  /** Founder note (1–2 lines) */
  note: string;
  /** Cal.com URL */
  calHref?: string;
  /** Vertical key for context (used in metadata and pre-filled Cal.com fields) */
  verticalLabel?: string;
  /** "softer" variant for hajj — quieter */
  variant?: "default" | "soft";
  /** Optional Manglish line for Kerala-led verticals */
  manglishLine?: string;
};

const DEFAULT_CAL = "https://cal.com/sager-zmd4kl/30min";

export default function BookCallCTA({
  heading,
  note,
  calHref = DEFAULT_CAL,
  verticalLabel,
  variant = "default",
  manglishLine,
}: BookCallCTAProps) {
  const calWithVertical = verticalLabel
    ? `${calHref}?notes=${encodeURIComponent("Vertical · " + verticalLabel)}`
    : calHref;

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
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={calWithVertical}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
              style={{
                background: "var(--sk-ink)",
                color: "var(--sk-cream)",
              }}
            >
              Book a 30-min call with Ehsan
            </Link>
          </div>
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
              href={calWithVertical}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all hover:scale-[1.02]"
              style={{
                background: "var(--sk-red)",
                color: "var(--sk-cream)",
              }}
            >
              Book a 30-min call with Ehsan
            </Link>
          </div>
          <p
            className="sk-font-meta mt-6"
            style={{ color: "var(--sk-ink40)" }}
          >
            Free · 30 minutes · auto-confirmed · our team handles logistics
          </p>
        </div>
      </div>
    </section>
  );
}
