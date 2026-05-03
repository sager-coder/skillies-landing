/**
 * Skillies pricing engine · single source of truth.
 *
 * Used by:
 *   1. /pricing interactive calculator UI (client + server)
 *   2. WhatsApp scoping agent's calculate_quote() tool call
 *
 * Source · skillies-MASTER-PLAN.md (founder-locked May 2026).
 *
 * Formula:
 *   Total Month-1 = Setup + Monthly_Base
 *                 + max(0, QC_handled − QC_included) × Per_QC_overage
 *                 + Σ Capability_Module_fees (setup + monthly)
 *                 + Pass-through (Meta WA charges, billed at-cost)
 */

// ─── Tier table · per-vertical anchor (typical setup, monthly base) ──────────
export const TIERS = {
  retail: {
    name: "Retail · Light",
    setup: 49_999,
    monthlyBase: 14_999,
    qcIncluded: 50,
    perQcOverage: 49,
  },
  hajj: {
    name: "Standard · Hajj/Umrah",
    setup: 1_25_000,
    monthlyBase: 24_999,
    qcIncluded: 150,
    perQcOverage: 99,
  },
  coaching: {
    name: "Standard · Coaching",
    setup: 85_000,
    monthlyBase: 24_999,
    qcIncluded: 150,
    perQcOverage: 99,
  },
  "study-abroad": {
    name: "Growth · Study Abroad",
    setup: 1_35_000,
    monthlyBase: 39_999,
    qcIncluded: 300,
    perQcOverage: 149,
  },
  interiors: {
    name: "Growth · Modular Kitchen / Interior",
    setup: 1_15_000,
    monthlyBase: 39_999,
    qcIncluded: 300,
    perQcOverage: 149,
  },
  "real-estate": {
    name: "Scale · Real Estate",
    setup: 1_99_000,
    monthlyBase: 49_999,
    qcIncluded: 500,
    perQcOverage: 199,
  },
  insurance: {
    name: "Standard · Insurance",
    setup: 1_15_000,
    monthlyBase: 29_999,
    qcIncluded: 250,
    perQcOverage: 119,
  },
} as const;

export type VerticalKey = keyof typeof TIERS;

export const VERTICAL_LABELS: Record<VerticalKey, string> = {
  retail: "Retail / Kirana",
  hajj: "Hajj / Umrah",
  coaching: "Coaching / Edtech",
  "study-abroad": "Study Abroad",
  interiors: "Modular Kitchen / Interior",
  "real-estate": "Real Estate",
  insurance: "Insurance",
};

// ─── Capability modules · add-ons ───────────────────────────────────────────
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
    label: "Long-horizon memory (weeks/months)",
    setup: 5_000,
    monthly: 2_500,
    description: "Customer returns 6 months later, agent remembers full thread.",
  },
  calendar: {
    label: "Calendar booking (Cal.com / Google)",
    setup: 7_500,
    monthly: 2_500,
    description: "Site visits, demos, consultations booked into your calendar.",
  },
  crm: {
    label: "CRM sync (Sell.do / LeadSquared / Zoho)",
    setup: 25_000,
    monthly: 4_999,
    description: "Push qualified leads into your existing CRM with full conversation history.",
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
  /** Anchor against Kerala SDR salary */
  sdrComparison: {
    sdrAnnualCost: number;
    skilliesAnnualCost: number;
    savingsVsTwoSdrs: number;
  };
};

const KERALA_SDR_MONTHLY_LOADED = 35_000; // ₹35k/mo loaded cost per SDR (salary + ESI + PF)

export function calculateQuote(input: QuoteInput): QuoteOutput {
  const tier = TIERS[input.vertical];
  const breakdown: QuoteOutput["breakdown"] = [];

  // Base tier
  breakdown.push({
    label: tier.name + " · base",
    setup: tier.setup,
    monthly: tier.monthlyBase,
  });

  // QC overage
  const qcOverage = Math.max(0, input.monthlyQc - tier.qcIncluded);
  const qcOverageCost = qcOverage * tier.perQcOverage;
  if (qcOverageCost > 0) {
    breakdown.push({
      label: `QC overage · ${qcOverage} × ₹${tier.perQcOverage}`,
      setup: 0,
      monthly: qcOverageCost,
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
      const seatCost = input.workerSeats * (m as typeof MODULES.workerDashboard).perSeat;
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

  return {
    vertical: input.vertical,
    tierName: tier.name,
    setupTotal,
    monthlyTotal,
    twelveMonthTotal,
    breakdown,
    sdrComparison: {
      sdrAnnualCost: KERALA_SDR_MONTHLY_LOADED * 2 * 12, // 2 SDRs for fairness
      skilliesAnnualCost: twelveMonthTotal,
      savingsVsTwoSdrs: KERALA_SDR_MONTHLY_LOADED * 2 * 12 - twelveMonthTotal,
    },
  };
}

// ─── Default capabilities per vertical (so the calculator opens with sensible state) ──
export const DEFAULT_MODULES: Record<VerticalKey, ModuleKey[]> = {
  retail: ["payment"],
  hajj: ["voice", "calendar", "multilingual", "payment"],
  coaching: ["calendar", "crm", "payment"],
  "study-abroad": ["vision", "calendar", "crm", "memory", "multilingual"],
  interiors: ["vision", "calendar", "memory", "multichannel"],
  "real-estate": ["vision", "voice", "calendar", "crm", "memory", "industryCustom"],
  insurance: ["vision", "crm", "memory", "multilingual", "payment", "industryCustom"],
};

// Default monthly QC volume per vertical (sensible mid-size client)
export const DEFAULT_QC: Record<VerticalKey, number> = {
  retail: 800, // high-volume but cheap
  hajj: 250,
  coaching: 600, // result-day spikes amortized
  "study-abroad": 400,
  interiors: 300,
  "real-estate": 600,
  insurance: 500, // brokers see steady high-volume across motor + health + life
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
