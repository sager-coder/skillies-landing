/**
 * Skillies pricing engine · single source of truth (v3 · founding tiers).
 *
 * Used by:
 *   1. /pricing interactive calculator UI (client + server)
 *   2. WhatsApp scoping agent's calculate_quote() webhook tool
 *
 * Model (founder ruling, Jun 2026):
 *   - 3 conversation-volume tiers: Starter ₹9,999 (3k) · Growth ₹19,999 (5k) ·
 *     Pro ₹34,999 (10k); above 10k = custom. All features in all plans.
 *   - Uniform ₹25,000 setup across every vertical (presented as ₹1.2L value).
 *
 * Setup_total  = ₹25,000 (uniform; modules included at ₹0)
 * Monthly_total = TIER.monthly (picked from conversation volume)
 * Year-1        = setup + 12 × monthly
 *
 * Human comparison scales with QC volume using Kerala benchmarks
 * (1 caller @ ₹20K handles ~625 QC/month; +1 manager per ~8 callers).
 */

// ─── Universal QC tier ladder ─────────────────────────────────────────────────
// Pay the tier that matches your actual QC volume each month.
// QC = 24-hour customer-initiated thread with ≥5 inbound messages OR a sales action.
export const TIERS = [
  {
    name: "Starter",
    qcMax: 3_000,
    monthly: 9_999,
    perQc: 3,
    humanEquivalent: "less than half a telecaller's salary · 24/7 + memory",
  },
  {
    name: "Growth",
    qcMax: 5_000,
    monthly: 19_999,
    perQc: 4,
    humanEquivalent: "one telecaller's salary · three shifts of work",
  },
  {
    name: "Pro",
    qcMax: 10_000,
    monthly: 34_999,
    perQc: 3,
    humanEquivalent: "replaces a 4-person enquiry desk (~₹64K/mo, one shift)",
  },
  {
    name: "Custom",
    qcMax: Number.POSITIVE_INFINITY,
    monthly: null, // above 10k conversations · custom quote
    perQc: null,
    humanEquivalent: "Enterprise — custom quote",
  },
] as const;

export type TierName = (typeof TIERS)[number]["name"];

export function pickTier(monthlyQc: number) {
  return TIERS.find((t) => monthlyQc <= t.qcMax) ?? TIERS[TIERS.length - 1];
}

// ─── Setup · uniform founding-client price (v3) ──────────────────────────────
// Uniform ₹25,000 setup across every vertical (founder ruling, no per-industry
// gating). Presented as a ₹1,20,000 build value, founding-client price ₹25,000.
const SETUP_BASE = 25_000;
export const INDUSTRY_SETUP = {
  retail: {
    base: SETUP_BASE,
    label: "Retail / Kirana",
    complexity: "Single-product catalogue, simple flows",
  },
  hajj: {
    base: SETUP_BASE,
    label: "Travels",
    complexity: "Package variants + group bookings + Mahram rules",
  },
  coaching: {
    base: SETUP_BASE,
    label: "Coaching / Edtech",
    complexity: "Batch + faculty + fee-quote logic",
  },
  "study-abroad": {
    base: SETUP_BASE,
    label: "Study Abroad",
    complexity: "Multi-country + counselling + document workflow",
  },
  interiors: {
    base: SETUP_BASE,
    label: "Modular Kitchen / Interior",
    complexity: "Vision-heavy + quote complexity + measurement",
  },
  "real-estate": {
    base: SETUP_BASE,
    label: "Real Estate",
    complexity: "Multi-project KB + RERA + floor-plan vision + CRM",
  },
  insurance: {
    base: SETUP_BASE,
    label: "Insurance (multi-insurer)",
    complexity: "5 insurers × 4 categories + IRDAI + KYC vision",
  },
} as const;

export type VerticalKey = keyof typeof INDUSTRY_SETUP;

export const VERTICAL_LABELS: Record<VerticalKey, string> = {
  retail: "Retail / Kirana",
  hajj: "Travels",
  coaching: "Coaching / Edtech",
  "study-abroad": "Study Abroad",
  interiors: "Modular Kitchen / Interior",
  "real-estate": "Real Estate",
  insurance: "Insurance",
};

// ─── Capabilities · ALL included in every plan (v3 · no feature paywalls) ─────
// Founder ruling: every plan ships the full feature set. The only gates are
// volume (tier), support level, and the founder-voice-clone. Modules are kept
// here as the feature list (priced at ₹0 — included); per-use variables on
// vision/voice still apply and are billed as overage, not setup/monthly.
export const MODULES = {
  payment: {
    label: "Payment links (Razorpay / UPI)",
    setup: 0,
    monthly: 0,
    description: "Auto-generated payment links per order, Razorpay or UPI. Included.",
  },
  vision: {
    label: "Image / vision understanding",
    setup: 0,
    monthly: 0,
    description: "Customer photos, floor plans, room images. Included (per-image overage ₹15/image).",
  },
  voice: {
    label: "Voice note transcription + understanding",
    setup: 0,
    monthly: 0,
    description: "Indic voice notes from older customers, transcribed and answered. Included (overage ₹5/voice note).",
  },
  multilingual: {
    label: "Multilingual support (5 languages)",
    setup: 0,
    monthly: 0,
    description: "Text + voice replies across 5 languages. Included.",
  },
  memory: {
    label: "Lifelong per-customer memory",
    setup: 0,
    monthly: 0,
    description: "Customer returns 3 years later, agent remembers everything. Family composition, prior policies, kids' DOBs. Included.",
  },
  calendar: {
    label: "Calendar booking (Cal.com / Google)",
    setup: 0,
    monthly: 0,
    description: "Site visits, demos, consultations booked into your calendar. Included.",
  },
  multichannel: {
    label: "Multichannel (IG DM / Email / Web)",
    setup: 0,
    monthly: 0,
    description: "Same agent across multiple inbound channels. Included.",
  },
  workerDashboard: {
    label: "Worker Dashboard (per-staff login + queue UI)",
    setup: 0,
    monthly: 0,
    perSeat: 0,
    description: "Role-based access for your sales team. Hot-lead routing, performance reports, audit log. Included.",
  },
  industryCustom: {
    label: "Industry-custom integration (RERA, EMR, IATA, etc.)",
    setup: 0,
    monthly: 0,
    description: "Bespoke integrations specific to your vertical. Included in setup; deep custom work quoted case-by-case.",
  },
} as const;

export type ModuleKey = keyof typeof MODULES;

// ─── Human-equivalent comparison · scales with QC volume ─────────────────────
// Kerala benchmarks: 1 caller @ ₹20K base handles ~625 QC/month.
// Add 1 manager (₹50K loaded) per ~8 callers; 1 manager when ≥3 callers.
const KERALA_CALLER_MONTHLY = 20_000;
const QC_PER_CALLER = 625;
const MANAGER_MONTHLY = 50_000;
const CALLERS_PER_MANAGER = 8;

export function humanEquivalentCost(monthlyQc: number): {
  callers: number;
  managers: number;
  monthlyCost: number;
  description: string;
} {
  const callers = Math.max(1, Math.ceil(monthlyQc / QC_PER_CALLER));
  const managers =
    callers >= 5
      ? Math.ceil(callers / CALLERS_PER_MANAGER)
      : callers >= 3
        ? 1
        : 0;
  const monthlyCost = callers * KERALA_CALLER_MONTHLY + managers * MANAGER_MONTHLY;
  const parts = [`${callers} caller${callers === 1 ? "" : "s"} (₹20K each)`];
  if (managers > 0) parts.push(`${managers} manager${managers === 1 ? "" : "s"}`);
  return {
    callers,
    managers,
    monthlyCost,
    description: parts.join(" + "),
  };
}

// ─── Calculator function · used by both UI and WhatsApp agent ────────────────
export type QuoteInput = {
  vertical: VerticalKey;
  /** Active customer conversations (QC) per month */
  monthlyQc: number;
  /** Selected capability modules */
  modules: ModuleKey[];
  /** Worker seats (only relevant if `workerDashboard` in modules) */
  workerSeats?: number;
};

export type QuoteOutput = {
  vertical: VerticalKey;
  tierName: string;
  setupTotal: number;
  monthlyTotal: number;
  twelveMonthTotal: number;
  /** Per-line breakdown for transparency */
  breakdown: {
    label: string;
    setup: number;
    monthly: number;
  }[];
  /** Equivalent human team cost, scaled with QC volume */
  humanComparison: {
    callers: number;
    managers: number;
    humanMonthly: number;
    humanAnnual: number;
    skilliesAnnual: number;
    savings: number;
    description: string;
  };
};

export function calculateQuote(input: QuoteInput): QuoteOutput {
  const tier = pickTier(input.monthlyQc);
  const industry = INDUSTRY_SETUP[input.vertical];
  const breakdown: QuoteOutput["breakdown"] = [];

  // Industry setup base
  breakdown.push({
    label: `${industry.label} · setup`,
    setup: industry.base,
    monthly: 0,
  });

  // Tier monthly fee
  if (tier.monthly !== null) {
    breakdown.push({
      label: `${tier.name} tier · up to ${tier.qcMax.toLocaleString("en-IN")} QC/month`,
      setup: 0,
      monthly: tier.monthly,
    });
  } else {
    breakdown.push({
      label: `${tier.name} tier · enterprise · custom quote`,
      setup: 0,
      monthly: 0,
    });
  }

  // Modules
  for (const moduleKey of input.modules) {
    const m = MODULES[moduleKey];
    let monthly = m.monthly;
    let label = m.label;
    if (
      moduleKey === "workerDashboard" &&
      input.workerSeats &&
      input.workerSeats > 0
    ) {
      const seatCost =
        input.workerSeats * (m as typeof MODULES.workerDashboard).perSeat;
      monthly += seatCost;
      label += ` (${input.workerSeats} seats)`;
    }
    breakdown.push({
      label,
      setup: m.setup,
      monthly,
    });
  }

  const setupTotal = breakdown.reduce((sum, b) => sum + b.setup, 0);
  const monthlyTotal = breakdown.reduce((sum, b) => sum + b.monthly, 0);
  const twelveMonthTotal = setupTotal + monthlyTotal * 12;

  // Human comparison (scaled with QC volume)
  const human = humanEquivalentCost(input.monthlyQc);

  return {
    vertical: input.vertical,
    tierName: tier.name,
    setupTotal,
    monthlyTotal,
    twelveMonthTotal,
    breakdown,
    humanComparison: {
      callers: human.callers,
      managers: human.managers,
      humanMonthly: human.monthlyCost,
      humanAnnual: human.monthlyCost * 12,
      skilliesAnnual: twelveMonthTotal,
      savings: human.monthlyCost * 12 - twelveMonthTotal,
      description: human.description,
    },
  };
}

// ─── Default capabilities per vertical (calculator opens with sensible state) ──
export const DEFAULT_MODULES: Record<VerticalKey, ModuleKey[]> = {
  retail: ["payment"],
  hajj: ["voice", "calendar", "multilingual", "payment"],
  coaching: ["calendar", "payment"],
  "study-abroad": ["vision", "calendar", "memory", "multilingual"],
  interiors: ["vision", "calendar", "memory", "multichannel"],
  "real-estate": ["vision", "voice", "calendar", "memory", "industryCustom"],
  insurance: ["vision", "memory", "voice", "payment", "calendar", "industryCustom"],
};

// Default monthly QC volume per vertical (sensible mid-size client)
export const DEFAULT_QC: Record<VerticalKey, number> = {
  retail: 1_500, // high-volume but cheap conversations
  hajj: 800,
  coaching: 1_500,
  "study-abroad": 1_200,
  interiors: 1_000,
  "real-estate": 2_500,
  insurance: 3_000, // brokers see steady high-volume across motor + health + life
};

// ─── Formatting helpers ─────────────────────────────────────────────────────
export function formatINR(amount: number): string {
  // Indian numbering · ₹1,99,000 not ₹199,000
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}
