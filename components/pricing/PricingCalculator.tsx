/**
 * /pricing interactive calculator (v2.1).
 *
 * Pick vertical → live QC slider → capability checkboxes → live ₹ output.
 * Universal tier ladder (Solo → Pro+ → Scale), industry-varied setup,
 * human-team comparison scaled with actual QC volume.
 *
 * Powered by lib/pricing.ts (same engine the WhatsApp agent uses).
 *
 * Initial state can be seeded by URL params · ?vertical=real-estate.
 */
"use client";

import { useMemo, useState } from "react";
import {
  TIERS,
  MODULES,
  INDUSTRY_SETUP,
  DEFAULT_MODULES,
  DEFAULT_QC,
  VERTICAL_LABELS,
  calculateQuote,
  pickTier,
  formatINR,
  type VerticalKey,
  type ModuleKey,
} from "@/lib/pricing";

type Props = {
  initialVertical?: VerticalKey;
};

const QC_SLIDER_MAX = 8_000;
const QC_SLIDER_STEP = 100;

export default function PricingCalculator({ initialVertical }: Props) {
  const startVertical = initialVertical ?? "real-estate";
  const [vertical, setVertical] = useState<VerticalKey>(startVertical);
  const [monthlyQc, setMonthlyQc] = useState<number>(
    DEFAULT_QC[startVertical],
  );
  const [modules, setModules] = useState<ModuleKey[]>([
    ...DEFAULT_MODULES[startVertical],
  ]);
  const [workerSeats, setWorkerSeats] = useState<number>(3);

  function changeVertical(next: VerticalKey) {
    setVertical(next);
    setMonthlyQc(DEFAULT_QC[next]);
    setModules([...DEFAULT_MODULES[next]]);
  }

  function toggleModule(key: ModuleKey) {
    setModules((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key],
    );
  }

  const quote = useMemo(
    () => calculateQuote({ vertical, monthlyQc, modules, workerSeats }),
    [vertical, monthlyQc, modules, workerSeats],
  );

  const currentTier = pickTier(monthlyQc);
  const industry = INDUSTRY_SETUP[vertical];
  const allModuleKeys = Object.keys(MODULES) as ModuleKey[];
  const allVerticals = Object.keys(VERTICAL_LABELS) as VerticalKey[];

  return (
    <section className="sk-section">
      <div className="sk-container">
        <div className="grid gap-12 md:grid-cols-[1fr_minmax(0,420px)] md:gap-16">
          {/* Inputs */}
          <div>
            <p
              className="sk-font-meta mb-4"
              style={{ color: "var(--sk-ink60)" }}
            >
              CONFIGURE YOUR QUOTE
            </p>

            {/* Vertical picker */}
            <fieldset className="mb-10">
              <legend
                className="sk-font-section mb-2"
                style={{ fontSize: "1.25rem", color: "var(--sk-ink)" }}
              >
                1 · Pick your industry
              </legend>
              <p
                className="sk-font-body mb-4"
                style={{ fontSize: "0.9375rem", color: "var(--sk-ink60)" }}
              >
                Setup base varies with industry complexity — five insurers ×
                four categories takes more setup than a single-product retail
                catalogue.
              </p>
              <div className="flex flex-wrap gap-2">
                {allVerticals.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => changeVertical(v)}
                    className="rounded-full px-5 py-2 text-[14px] font-medium transition-colors"
                    style={{
                      background:
                        v === vertical ? "var(--sk-ink)" : "transparent",
                      color:
                        v === vertical ? "var(--sk-cream)" : "var(--sk-ink)",
                      border:
                        v === vertical
                          ? "1px solid var(--sk-ink)"
                          : "1px solid var(--sk-ink20)",
                    }}
                  >
                    {VERTICAL_LABELS[v]}
                  </button>
                ))}
              </div>
              <p
                className="sk-font-meta mt-3"
                style={{ color: "var(--sk-ink40)" }}
              >
                {industry.label} · setup base {formatINR(industry.base)} ·{" "}
                {industry.complexity}
              </p>
            </fieldset>

            {/* QC slider */}
            <fieldset className="mb-10">
              <legend
                className="sk-font-section mb-2"
                style={{ fontSize: "1.25rem", color: "var(--sk-ink)" }}
              >
                2 · How many active customer conversations per month?
              </legend>
              <p
                className="sk-font-body mb-5"
                style={{ fontSize: "0.9375rem", color: "var(--sk-ink60)" }}
              >
                A &ldquo;Qualified Conversation&rdquo; (QC) = a 24-hour session
                with ≥5 inbound user messages OR a sales action (booking,
                payment link, hot-lead handoff). Window-shoppers with one
                question don&rsquo;t count.
              </p>
              <div className="flex items-baseline gap-4">
                <div
                  className="sk-font-display"
                  style={{
                    fontSize: "2.5rem",
                    color: "var(--sk-ink)",
                    lineHeight: 1,
                  }}
                >
                  {monthlyQc.toLocaleString("en-IN")}
                </div>
                <span
                  className="sk-font-meta"
                  style={{ color: "var(--sk-ink60)" }}
                >
                  QCs / month
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={QC_SLIDER_MAX}
                step={QC_SLIDER_STEP}
                value={Math.min(Math.max(monthlyQc, 500), QC_SLIDER_MAX)}
                onChange={(e) => setMonthlyQc(parseInt(e.target.value, 10))}
                className="mt-4 w-full"
                style={{ accentColor: "var(--sk-red)" }}
              />
              <div
                className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1"
                style={{ fontSize: "0.875rem", color: "var(--sk-ink60)" }}
              >
                <span
                  className="sk-font-meta"
                  style={{
                    color: "var(--sk-red)",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  {currentTier.name.toUpperCase()} TIER
                </span>
                <span>·</span>
                <span>
                  up to{" "}
                  {currentTier.qcMax === Number.POSITIVE_INFINITY
                    ? "enterprise volume"
                    : `${currentTier.qcMax.toLocaleString("en-IN")} QCs/mo`}
                </span>
                {currentTier.perQc !== null ? (
                  <>
                    <span>·</span>
                    <span>~₹{currentTier.perQc}/QC implied</span>
                  </>
                ) : null}
              </div>
            </fieldset>

            {/* Capability modules */}
            <fieldset className="mb-10">
              <legend
                className="sk-font-section mb-2"
                style={{ fontSize: "1.25rem", color: "var(--sk-ink)" }}
              >
                3 · Which capabilities do you actually need?
              </legend>
              <p
                className="sk-font-body mb-5"
                style={{ fontSize: "0.9375rem", color: "var(--sk-ink60)" }}
              >
                Add or remove modules. The price updates live. We charge only
                for what you switch on.
              </p>
              <div className="space-y-3">
                {allModuleKeys.map((key) => {
                  const m = MODULES[key];
                  const checked = modules.includes(key);
                  return (
                    <label
                      key={key}
                      className="flex cursor-pointer gap-4 rounded-xl p-4 transition-colors"
                      style={{
                        background: checked
                          ? "var(--sk-cream-dark)"
                          : "transparent",
                        border: checked
                          ? "1px solid var(--sk-ink20)"
                          : "1px solid var(--sk-hairline)",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleModule(key)}
                        className="mt-1"
                        style={{ accentColor: "var(--sk-red)" }}
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span
                            className="sk-font-body"
                            style={{
                              fontSize: "1rem",
                              fontWeight: 500,
                              color: "var(--sk-ink)",
                            }}
                          >
                            {m.label}
                          </span>
                          <span
                            className="sk-font-meta"
                            style={{ color: "var(--sk-ink60)" }}
                          >
                            +{formatINR(m.setup)} setup ·{" "}
                            +{formatINR(m.monthly)}/mo
                          </span>
                        </div>
                        <p
                          className="sk-font-body mt-1"
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--sk-ink60)",
                          }}
                        >
                          {m.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Worker seats slider, only visible when workerDashboard is checked */}
            {modules.includes("workerDashboard") ? (
              <fieldset className="mb-10">
                <legend
                  className="sk-font-section mb-2"
                  style={{ fontSize: "1.125rem", color: "var(--sk-ink)" }}
                >
                  Worker Dashboard · how many staff seats?
                </legend>
                <div className="flex items-baseline gap-4">
                  <div
                    className="sk-font-display"
                    style={{
                      fontSize: "2rem",
                      color: "var(--sk-ink)",
                      lineHeight: 1,
                    }}
                  >
                    {workerSeats}
                  </div>
                  <span
                    className="sk-font-meta"
                    style={{ color: "var(--sk-ink60)" }}
                  >
                    seats × ₹2,500/mo
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={workerSeats}
                  onChange={(e) =>
                    setWorkerSeats(parseInt(e.target.value, 10))
                  }
                  className="mt-3 w-full"
                  style={{ accentColor: "var(--sk-red)" }}
                />
              </fieldset>
            ) : null}

            {/* Tier ladder reference */}
            <div className="mb-10">
              <p
                className="sk-font-meta mb-3"
                style={{ color: "var(--sk-ink60)" }}
              >
                THE LADDER · PAY THE TIER YOU ACTUALLY HIT
              </p>
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid var(--sk-hairline)" }}
              >
                {TIERS.map((t, i) => {
                  const active = t.name === currentTier.name;
                  return (
                    <div
                      key={t.name}
                      className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-3"
                      style={{
                        background: active
                          ? "var(--sk-cream-dark)"
                          : "transparent",
                        borderBottom:
                          i < TIERS.length - 1
                            ? "1px solid var(--sk-hairline)"
                            : "none",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontWeight: active ? 700 : 500,
                            color: "var(--sk-ink)",
                            fontSize: "0.9375rem",
                          }}
                        >
                          {t.name}
                        </span>
                        <span
                          className="ml-3"
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--sk-ink60)",
                          }}
                        >
                          {t.qcMax === Number.POSITIVE_INFINITY
                            ? "enterprise"
                            : `up to ${t.qcMax.toLocaleString("en-IN")} QCs`}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "0.9375rem",
                          fontVariantNumeric: "tabular-nums",
                          color: "var(--sk-ink)",
                          fontWeight: active ? 700 : 500,
                        }}
                      >
                        {t.monthly === null
                          ? "quoted monthly"
                          : `${formatINR(t.monthly)}/mo`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Why-AI benefits panel */}
            <div className="mb-10">
              <p
                className="sk-font-meta mb-3"
                style={{ color: "var(--sk-ink60)" }}
              >
                WHY AN AGENT BEATS THE EQUIVALENT HUMAN TEAM
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "Works 24/7 · no leaves, no sick days, no Sundays off",
                    body: "Your audience messages at 9pm and on Sundays. A salaried sales floor doesn't. That's where leads die — and where the agent picks them up.",
                  },
                  {
                    title: "Zero attrition risk · zero training overhead",
                    body: "Insurance/sales caller attrition runs 30-60%/year. Each new hire takes 4-6 weeks to learn your products. The agent doesn't quit, doesn't gossip, doesn't need re-training.",
                  },
                  {
                    title: "Self-improving · we review 500+ messages every month",
                    body: "Closed deals, dropped leads, your dashboard corrections feed a queue. We re-tune prompts and KB monthly with AI-assisted review. Humans don't get a monthly performance upgrade.",
                  },
                  {
                    title: "Lifelong per-customer memory",
                    body: "Same family returns 3 years later — agent picks up where you left off (kids' DOBs, prior policies, pain points). Humans take this institutional memory with them when they quit.",
                  },
                  {
                    title: "Vision · understands photos and documents in-thread",
                    body: "Customers send screenshots of competing quotes, ID/age proofs, medical reports, floor plans. The agent reads them and replies in context.",
                  },
                  {
                    title: "Auto Cal.com booking + Razorpay collection in-thread",
                    body: "The moment a buyer says yes, payment link or booking slot is in the WhatsApp thread. No manual follow-up, no lost momentum.",
                  },
                  {
                    title: "Custom dashboard for your team",
                    body: "Multi-seat (1 admin + N workers), per-policy/insurer/category reports, audit log, full transcripts exportable. Your data, always.",
                  },
                  {
                    title: "Fixed cost, not commission-linked",
                    body: "Every additional close adds margin to your P&L instead of paying the next caller's commission. Per-QC cost gets cheaper as you scale; humans' don't.",
                  },
                ].map((b) => (
                  <div
                    key={b.title}
                    className="rounded-xl p-4"
                    style={{ border: "1px solid var(--sk-hairline)" }}
                  >
                    <div
                      className="sk-font-body"
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: "var(--sk-ink)",
                      }}
                    >
                      {b.title}
                    </div>
                    <p
                      className="sk-font-body mt-1"
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--sk-ink60)",
                        lineHeight: 1.55,
                      }}
                    >
                      {b.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live quote */}
          <aside
            className="rounded-2xl p-7 md:p-8 md:sticky md:top-24 md:self-start"
            style={{
              background: "var(--sk-cream-dark)",
              border: "1px solid var(--sk-hairline)",
            }}
          >
            <p
              className="sk-font-meta mb-3"
              style={{ color: "var(--sk-ink60)" }}
            >
              YOUR LIVE QUOTE · {VERTICAL_LABELS[vertical].toUpperCase()} ·{" "}
              <span style={{ color: "var(--sk-red)" }}>
                {currentTier.name.toUpperCase()} TIER
              </span>
            </p>

            <div
              className="sk-font-display"
              style={{
                fontSize: "clamp(2rem, 3vw + 1rem, 2.75rem)",
                color: "var(--sk-ink)",
                lineHeight: 1,
              }}
            >
              {formatINR(quote.setupTotal)}
            </div>
            <p
              className="sk-font-body mt-1"
              style={{ fontSize: "0.9375rem", color: "var(--sk-ink60)" }}
            >
              one-time setup
            </p>

            <div
              className="sk-font-display mt-6"
              style={{
                fontSize: "clamp(2rem, 3vw + 1rem, 2.75rem)",
                color: "var(--sk-ink)",
                lineHeight: 1,
              }}
            >
              {currentTier.monthly === null
                ? "Custom"
                : formatINR(quote.monthlyTotal)}
            </div>
            <p
              className="sk-font-body mt-1"
              style={{ fontSize: "0.9375rem", color: "var(--sk-ink60)" }}
            >
              per month · all capabilities included · no overage
            </p>

            <div
              className="my-6"
              style={{ height: 1, background: "var(--sk-hairline)" }}
            />

            <p
              className="sk-font-meta mb-3"
              style={{ color: "var(--sk-ink60)" }}
            >
              YEAR 1 · VS HIRING THE EQUIVALENT HUMAN TEAM
            </p>
            <div className="space-y-3">
              <div className="flex justify-between gap-4">
                <span
                  className="sk-font-body"
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--sk-ink60)",
                  }}
                >
                  Skillies (year 1)
                </span>
                <span
                  className="sk-font-body"
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--sk-ink)",
                    fontWeight: 600,
                  }}
                >
                  {currentTier.monthly === null
                    ? "Custom"
                    : formatINR(quote.humanComparison.skilliesAnnual)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span
                  className="sk-font-body"
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--sk-ink60)",
                  }}
                >
                  {quote.humanComparison.description}
                </span>
                <span
                  className="sk-font-body"
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--sk-ink)",
                  }}
                >
                  {formatINR(quote.humanComparison.humanAnnual)}
                </span>
              </div>
              {quote.humanComparison.savings > 0 &&
              currentTier.monthly !== null ? (
                <div className="flex justify-between gap-4 pt-1">
                  <span
                    className="sk-font-meta"
                    style={{ color: "var(--sk-red)" }}
                  >
                    YOU SAVE
                  </span>
                  <span
                    className="sk-font-body"
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--sk-red)",
                      fontWeight: 700,
                    }}
                  >
                    {formatINR(quote.humanComparison.savings)}
                  </span>
                </div>
              ) : null}
            </div>

            <p
              className="sk-font-meta mt-4"
              style={{
                color: "var(--sk-ink40)",
                lineHeight: 1.55,
                fontSize: "0.75rem",
              }}
            >
              Plus the agent works 24/7, never takes leaves, never makes
              data-entry errors, remembers every customer for life, and
              improves monthly through human + AI review of conversations.
              Humans don&rsquo;t.
            </p>

            <a
              href="https://cal.com/sager-zmd4kl/30min"
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full text-[15px] font-medium"
              style={{
                background: "var(--sk-red)",
                color: "var(--sk-cream)",
              }}
            >
              Lock this quote · book a 30-min call
            </a>
            <p
              className="sk-font-meta mt-4"
              style={{
                color: "var(--sk-ink40)",
                textAlign: "center",
              }}
            >
              Plus Meta WhatsApp message charges (passed at-cost). No
              setup-fee surprises after this number.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
