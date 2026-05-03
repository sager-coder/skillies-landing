/**
 * VerticalGrid · the 6 vertical cards on the homepage that link to
 * their dedicated /for/<vertical> page.
 *
 * Medical is intentionally not in the active grid (founder dropped it
 * for now per memory project_skillies_pivot decisions May 2026).
 */
import Link from "next/link";

const VERTICALS = [
  {
    href: "/for/real-estate",
    title: "Skillies for Real Estate",
    pain: "78% of buyers go with whoever replies first. Your team replies in 4 hours. Skillies replies in 4 seconds.",
    accent: "var(--sk-realestate-slate)",
    eyebrow: "DEVELOPERS · BROKERS",
  },
  {
    href: "/for/hajj",
    title: "Skillies for Hajj &amp; Umrah",
    pain: "Malayalam voice notes from older pilgrims at 1 a.m. The owner is in Makkah. Skillies replies before fajr.",
    accent: "var(--sk-hajj-forest)",
    eyebrow: "PILGRIMAGE OPERATORS",
  },
  {
    href: "/for/study-abroad",
    title: "Skillies for Study Abroad",
    pain: "A student inquires in February, converts in October. Counsellor change in between? Skillies remembers everything.",
    accent: "var(--sk-studyabroad-navy)",
    eyebrow: "CONSULTANTS",
  },
  {
    href: "/for/coaching",
    title: "Skillies for Coaching Institutes",
    pain: "Result day — 5,000 parents in 48 hours, in 4 languages. Counsellors burn out. Skillies books every demo.",
    accent: "var(--sk-coaching-indigo)",
    eyebrow: "NEET · UPSC · IELTS · JEE",
  },
  {
    href: "/for/interiors",
    title: "Skillies for Modular Kitchen",
    pain: "Customer sends a kitchen photo at midnight. Skillies suggests three rendered options and a booked visit.",
    accent: "var(--sk-interiors-terracotta)",
    eyebrow: "INTERIOR STUDIOS",
  },
  {
    href: "/for/retail",
    title: "Skillies for Retail &amp; Kirana",
    pain: "Saturday rush — 8 WhatsApp orders missed. They go next door. Skillies takes orders 24/7 in your language.",
    accent: "var(--sk-retail-saffron)",
    eyebrow: "SHOPS · SALONS · GYMS",
  },
];

export default function VerticalGrid() {
  return (
    <section
      className="sk-section"
      style={{ background: "var(--sk-cream-dark)" }}
    >
      <div className="sk-container">
        <div className="mb-12 max-w-[640px]">
          <p
            className="sk-font-meta mb-4"
            style={{ color: "var(--sk-ink60)" }}
          >
            BUILT PER VERTICAL
          </p>
          <h2
            className="sk-font-section"
            style={{ fontSize: "var(--sk-text-h2)", color: "var(--sk-ink)" }}
          >
            One product. Six different workers.
          </h2>
          <p
            className="sk-font-body mt-4 max-w-[58ch]"
            style={{ fontSize: "var(--sk-text-lead)", color: "var(--sk-ink60)" }}
          >
            A real-estate worker doesn&rsquo;t need to grade hairline photos. A
            Hajj operator doesn&rsquo;t need a RERA scraper. We build only what
            your vertical needs — and price only what you switch on.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VERTICALS.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className="group block rounded-2xl p-7 transition-all hover:-translate-y-1"
              style={{
                background: "var(--sk-cream)",
                border: "1px solid var(--sk-hairline)",
                borderTop: `2px solid ${v.accent}`,
              }}
            >
              <p
                className="sk-font-meta"
                style={{ color: v.accent }}
              >
                {v.eyebrow}
              </p>
              <h3
                className="sk-font-section mt-3"
                style={{
                  fontSize: "1.375rem",
                  color: "var(--sk-ink)",
                }}
                dangerouslySetInnerHTML={{ __html: v.title }}
              />
              <p
                className="sk-font-body mt-3"
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--sk-ink60)",
                  lineHeight: 1.5,
                }}
              >
                {v.pain}
              </p>
              <p
                className="sk-font-body mt-5"
                style={{
                  fontSize: "0.875rem",
                  color: "var(--sk-red)",
                  fontWeight: 500,
                }}
              >
                See the page →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
