/**
 * WhySkilliesIsDifferent · the 8-capability section that justifies why
 * Skillies is priced higher than AiSensy/WATI/Interakt.
 *
 * Each row is a moat that no template-WhatsApp tool can copy without
 * becoming a services firm. Designed as a half-photo / half-text rhythm
 * so the section reads dense and product-real, not editorial-restrained.
 */
const FEATURES = [
  {
    eyebrow: "ALWAYS LEARNING",
    title: "Reads its own conversations · gets better every week",
    body: "Every 100 messages, the agent runs a self-audit · which prospects ghosted, what was the last thing it said, where did the script break? The next week's behavior reflects what didn't work last week. AiSensy templates can't do this.",
    metric: "↑ 12-30% closure / month after week 4",
  },
  {
    eyebrow: "MEMORY · WEEKS, MONTHS",
    title: "Same customer comes back in October · agent remembers February",
    body: "A study-abroad student inquires in February, returns in October. A real-estate buyer ghosts and reappears 3 months later. Skillies remembers IELTS scores, family budget, last objections. Counsellor turnover stops costing you the lead.",
    metric: "12–18 mo memory · cross-cycle recall",
  },
  {
    eyebrow: "VISION · IMAGES + DOCS",
    title: "Customer sends a photo · agent reads it",
    body: "Hairline photo → Norwood stage. Floor plan → square footage + RERA carpet + price-band. Empty kitchen + Pinterest reference → 3 rendered options. Aadhaar/PAN → field-validated. Most bots say 'I received your image.' Skillies says what's in it.",
    metric: "Floor plans · medical photos · documents · room shots",
  },
  {
    eyebrow: "WORKER DASHBOARD",
    title: "Your sales team lives inside Skillies · not in WhatsApp chaos",
    body: "Per-staff login, role-based access, conversation queue, hot-lead auto-assignment by zone or skill, daily/weekly performance summary per worker, audit log. AiSensy gives you a shared inbox. We give you an operations system.",
    metric: "Per-seat seats · routing rules · audit log",
  },
  {
    eyebrow: "LEAD ROUTING",
    title: "Hot leads forwarded to the right human · automatically",
    body: "Lead qualification scoring decides the route. Hot lead → directly to your senior sales head's WhatsApp. Mid-tier → to assigned junior. Cold → 30-day nurture. Routing rules are yours · per zone, language, deal size.",
    metric: "Per-zone · per-skill · per-shift assignment",
  },
  {
    eyebrow: "CAL.COM + GOOGLE MEET",
    title: "Site visits, demos, consults · booked into your real calendar",
    body: "Agent doesn't say 'we'll get back to you.' It opens your calendar, finds a slot, books it, sends Google Meet link + Maps + 1-hour-before reminder. Customer's calendar invite goes out before they end the chat.",
    metric: "Live calendar sync · zero double-booking",
  },
  {
    eyebrow: "RAZORPAY DIRECT",
    title: "Closing the deal in chat · payment link, not a callback",
    body: "Once the prospect says yes, Razorpay/UPI link generates inside the same WhatsApp thread. No 'I'll send you the invoice tomorrow.' No follow-up needed. Cash collected before the prospect leaves the chat.",
    metric: "RTO drops 30% → 18%",
  },
  {
    eyebrow: "COMPLEX SKU TUNING",
    title: "10+ price tiers, conditional pricing, EMI math · all handled",
    body: "Modular kitchens with marine ply vs HDHMR vs acrylic vs PU finish, each at different sqft rate. Insurance with carrier-specific premium loading by age + condition. Real-estate with floor PLC + corner premium + parking variations. Skillies handles SKU complexity that template tools fail at.",
    metric: "Master-tuning during onboarding · then automatic",
  },
];

export default function WhySkilliesIsDifferent() {
  return (
    <section className="sk-section relative" style={{ background: "var(--sk-cream-dark)" }}>
      <div className="sk-container">
        <div className="mb-16 max-w-[640px]">
          <p
            className="sk-font-meta mb-4"
            style={{ color: "var(--sk-red)" }}
          >
            WHY SKILLIES IS PRICIER · AND WHY IT&rsquo;S WORTH IT
          </p>
          <h2
            className="sk-font-section"
            style={{
              fontSize: "var(--sk-text-h2)",
              color: "var(--sk-ink)",
            }}
          >
            Eight things every WhatsApp tool can&rsquo;t do.
          </h2>
          <p
            className="sk-font-body mt-4 max-w-[58ch]"
            style={{
              fontSize: "var(--sk-text-lead)",
              color: "var(--sk-ink60)",
            }}
          >
            AiSensy is ₹3,200/month. We&rsquo;re ₹40,000+/month. Here&rsquo;s
            exactly what you&rsquo;re paying for · capability by capability.
            Each one is a moat. Each one is what makes Skillies a worker
            instead of a router.
          </p>
        </div>

        <div className="space-y-3">
          {FEATURES.map((f, i) => (
            <article
              key={i}
              className="rounded-2xl p-7 md:p-9 transition-all"
              style={{
                background: "var(--sk-cream)",
                border: "1px solid var(--sk-hairline)",
              }}
            >
              <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-baseline md:gap-12">
                <div className="flex items-center gap-4 md:block">
                  <span
                    className="sk-font-display"
                    style={{
                      fontSize: "clamp(2rem, 2.5vw + 1rem, 2.75rem)",
                      color: "var(--sk-red)",
                      lineHeight: 1,
                      display: "inline-block",
                      minWidth: "2ch",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    className="sk-font-meta"
                    style={{ color: "var(--sk-ink60)" }}
                  >
                    {f.eyebrow}
                  </p>
                </div>
                <div>
                  <h3
                    className="sk-font-section"
                    style={{
                      fontSize: "1.5rem",
                      color: "var(--sk-ink)",
                      marginBottom: 8,
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="sk-font-body"
                    style={{
                      fontSize: "1rem",
                      color: "var(--sk-ink60)",
                      lineHeight: 1.55,
                      maxWidth: "60ch",
                    }}
                  >
                    {f.body}
                  </p>
                </div>
                <div className="md:text-right md:max-w-[180px]">
                  <p
                    className="sk-font-meta mt-3 md:mt-0"
                    style={{
                      color: "var(--sk-red)",
                      letterSpacing: "0.04em",
                      lineHeight: 1.4,
                    }}
                  >
                    {f.metric}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p
          className="sk-font-body mt-12 text-center max-w-[60ch] mx-auto"
          style={{ fontSize: "1rem", color: "var(--sk-ink60)" }}
        >
          We don&rsquo;t sell a tool. We sell a sales worker. Templates don&rsquo;t
          ship like this · agencies do · and we&rsquo;re priced like neither.
        </p>
      </div>
    </section>
  );
}
