/**
 * /pricing interactive calculator.
 *
 * Picks vertical → live QC slider → capability checkboxes → live ₹ output.
 * Powered by lib/pricing.ts (same engine the WhatsApp agent uses).
 *
 * Initial state can be seeded by URL params · ?vertical=real-estate
 * (vertical pages link here with ?vertical=<key>).
 */
"use client";

import { useMemo, useState } from "react";
import {
  TIERS,
  MODULES,
  DEFAULT_MODULES,
  DEFAULT_QC,
  VERTICAL_LABELS,
  calculateQuote,
  formatINR,
  type VerticalKey,
  type ModuleKey,
} from "@/lib/pricing";

type Props = {
  initialVertical?: VerticalKey;
};

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

  // When vertical changes, reset modules + QC to that vertical's defaults
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

  const tier = TIERS[vertical];
  const allModuleKeys = Object.keys(MODULES) as ModuleKey[];

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
                className="sk-font-section mb-4"
                style={{ fontSize: "1.25rem", color: "var(--sk-ink)" }}
              >
                1 · Pick your vertical
              </legend>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(TIERS) as VerticalKey[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => changeVertical(v)}
                    className="rounded-full px-5 py-2 text-[14px] font-medium transition-colors"
                    style={{
                      background:
                        v === vertical
                          ? "var(--sk-ink)"
                          : "transparent",
                      color:
                        v === vertical
                          ? "var(--sk-cream)"
                          : "var(--sk-ink)",
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
                  {monthlyQc}
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
                min={50}
                max={3000}
                step={50}
                value={monthlyQc}
                onChange={(e) => setMonthlyQc(parseInt(e.target.value, 10))}
                className="mt-4 w-full"
                style={{
                  accentColor: "var(--sk-red)",
                }}
              />
              <p
                className="sk-font-meta mt-3"
                style={{ color: "var(--sk-ink40)" }}
              >
                Tier includes {tier.qcIncluded} QCs · ₹{tier.perQcOverage}{" "}
                per extra QC
              </p>
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
                  onChange={(e) => setWorkerSeats(parseInt(e.target.value, 10))}
                  className="mt-3 w-full"
                  style={{ accentColor: "var(--sk-red)" }}
                />
              </fieldset>
            ) : null}
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
              YOUR LIVE QUOTE · {VERTICAL_LABELS[vertical].toUpperCase()}
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
              {formatINR(quote.monthlyTotal)}
            </div>
            <p
              className="sk-font-body mt-1"
              style={{ fontSize: "0.9375rem", color: "var(--sk-ink60)" }}
            >
              per month · all capabilities included
            </p>

            <div
              className="my-6"
              style={{
                height: 1,
                background: "var(--sk-hairline)",
              }}
            />

            <p
              className="sk-font-meta mb-3"
              style={{ color: "var(--sk-ink60)" }}
            >
              YEAR 1 TOTAL · COMPARE
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
                    fontWeight: 500,
                  }}
                >
                  {formatINR(quote.sdrComparison.skilliesAnnualCost)}
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
                  2 Kerala SDRs (year 1)
                </span>
                <span
                  className="sk-font-body"
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--sk-ink)",
                  }}
                >
                  {formatINR(quote.sdrComparison.sdrAnnualCost)}
                </span>
              </div>
              {quote.sdrComparison.savingsVsTwoSdrs > 0 ? (
                <div className="flex justify-between gap-4">
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
                      fontWeight: 600,
                    }}
                  >
                    {formatINR(quote.sdrComparison.savingsVsTwoSdrs)}
                  </span>
                </div>
              ) : null}
            </div>

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
              style={{ color: "var(--sk-ink40)", textAlign: "center" }}
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
