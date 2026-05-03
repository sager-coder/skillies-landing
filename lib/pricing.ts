/**
 * Skillies pricing engine · single source of truth (v2.1).
 *
 * Used by:
 *   1. /pricing interactive calculator UI (client + server)
 *   2. WhatsApp scoping agent's calculate_quote() webhook tool
 *
 * Model:
 *   - Universal QC-volume tier ladder (Solo → Squad → Floor → Pro → Pro+ → Scale)
 *   - Per-industry setup base (varies with complexity, not flat)
 *   - Capability modules add to setup + monthly
 *
 * Setup_total  = INDUSTRY_SETUP[vertical].base + Σ MODULES[m].setup
 * Monthly_total = TIER.monthly (picked from QC volume) + Σ MODULES[m].monthly
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
    qcMax: 500,
    monthly: 30_000,
    perQc: 60,
    humanEquivalent: "~1 caller, but 24/7 + memory",
  },
  {
    name: "Solo",
    qcMax: 1_000,
    monthly: 50_000,
    perQc: 50,
    humanEquivalent: "~1.5 callers + manager share",
  },
  {
    name: "Squad",
    qcMax: 2_500,
    monthly: 85_000,
    perQc: 34,
    humanEquivalent: "3–4 callers + manager share",
  },
  {
    name: "Floor",
    qcMax: 4_000,
    monthly: 1_20_000,
    perQc: 30,
    humanEquivalent: "5–6 callers + 1 manager",
  },
  {
    name: "Pro",
    qcMax: 6_000,
    monthly: 1_55_000,
    perQc: 26,
    humanEquivalent: "8–9 callers + 1 manager",
  },
  {
    name: "Pro+",
    qcMax: 8_000,
    monthly: 1_85_000,
    perQc: 23,
    humanEquivalent: "10–12 callers + 2 managers (~₹2.5 L/mo human cost)",
  },
  {
    name: "Scale",
    qcMax: Number.POSITIVE_INFINITY,
    monthly: null, // quoted custom
    perQc: null,
    humanEquivalent: "Enterprise — custom quote",
  },
] as const;

export type TierName = (typeof TIERS)[number]["name"];

export function pickTier(monthlyQc: number) {
  return TIERS.find((t) => monthlyQc <= t.qcMax) ?? TIERS[TIERS.length - 1];
}

// ─── Per-industry setup base (varies with complexity) ────────────────────────
// Industry complexity drives KB ingestion depth, integration count, training time.
export const INDUSTRY_SETUP = {
  retail: {
    base: 50_000,
    label: "Retail / Kirana",
    complexity: "Low · single-product catalogue, simple flows",
  },
  hajj: {
    base: 75_000,
    label: "Hajj / Umrah",
    complexity: "Medium · package variants + group bookings + Mahram rules",
  },
  coaching: {
    base: 75_000,
    label: "Coaching / Edtech",
    complexity: "Medium · batch + faculty + fee-quote logic",
  },
  "study-abroad": {
    base: 1_00_000,
    label: "Study Abroad",
    complexity: "Medium-high · multi-country + counselling + document workflow",
  },
  interiors: {
    base: 1_00_000,
    label: "Modular Kitchen / Interior",
    complexity: "Medium-high · vision-heavy + quote complexity + measurement",
  },
  "real-estate": {
    base: 1_25_000,
    label: "Real Estate",
    complexity: "High · multi-project KB + RERA + floor-plan vision + CRM",
  },
  insurance: {
    base: 1_50_000,
    label: "Insurance (multi-insurer)",
    complexity: "High · 5 insurers × 4 categories + IRDAI + KYC vision",
  },
} as const;

export type VerticalKey = keyof typeof INDUSTRY_SETUP;

export const VERTICAL_LABELS: Record<VerticalKey, string> = {
  retail: "Retail / Kirana",
  hajj: "Hajj / Umrah",
  coaching: "Coaching / Edtech",
  "study-abroad": "Study Abroad",
  interiors: "Modular Kitchen / Interior",
  "real-estate": "Real Estate",
  insurance: "Insurance",
};

// ─── Capability modules · add-ons ────────────────────────────────────────────
export const MODULES = {
  payment: {
    label: "Payment links (Razorpay / UPI)",
    setup: 7_500,
    monthly: 2_500,
    description: "Auto-generated payment links per order, Razorpay or UPI.",
  },
  vision: {
    label: "Image / vision understanding",
    setup: 15_000,
    monthly: 7_500,
    description: "Customer photos, floor plans, room images. Per-image variable also applies (₹15/image).",
  },
  voice: {
    label: "Voice note transcription + understanding",
    setup: 10_000,
    monthly: 4_999,
    description: "Indic voice notes from older customers, transcribed and answered. ₹8/voice variable also applies.",
  },
  multilingual: {
    label: "Extra Indic language (per language)",
    setup: 12_500,
    monthly: 3_500,
    description: "English + 1 Indic is base; this adds Mal / Hin / Tam / Kan / Tel / Urdu etc.",
  },
  memory: {
    label: "Lifelong per-customer memory",
    setup: 5_000,
    monthly: 2_500,
    description: "Customer returns 3 years later, agent remembers everything. Family composition, prior policies, kids' DOBs.",
  },
  calendar: {
    label: "Calendar booking (Cal.com / Google)",
    setup: 7_500,
    monthly: 2_500,
    description: "Site visits, demos, consultations booked into your calendar.",
  },
  multichannel: {
    label: "Extra channel (per channel: IG DM / Email / Web)",
    setup: 10_000,
    monthly: 3_500,
    description: "Same agent across multiple inbound channels.",
  },
  workerDashboard: {
    label: "Worker Dashboard (per-staff login + queue UI)",
    setup: 35_000,
    monthly: 9_999,
    perSeat: 2_500,
    description: "Role-based access for your sales team. Hot-lead routing, performance reports, audit log.",
  },
  metaAds: {
    label: "Meta Ads conversion service (creative + targeting + tracking)",
    setup: 50_000,
    monthly: 25_000,
    description: "End-to-end Meta Ads management. 8% of ad-spend managed (capped at ₹50k/mo fee).",
  },
  industryCustom: {
    label: "Industry-custom integration (RERA, EMR, IATA, etc.)",
    setup: 50_000,
    monthly: 12_500,
    description: "Bespoke integrations specific to your vertical. Quoted case-by-case.",
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
