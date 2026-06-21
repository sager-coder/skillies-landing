/**
 * Single source of truth for the live Skillies verticals.
 *
 * The vertical list had drifted in three places (homepage grid, the For-Business
 * grid, the sitemap) — each missing or mislabelling different verticals. This is
 * the canonical list: keep it in sync with content/verticals/*.ts and app/for/*.
 *
 * Each vertical maps to one of the three core agentic jobs (lead / order / ecom)
 * and carries the 4-step workflow rendered by <AgentWorkflow/>.
 */

export type Capability = "lead" | "order" | "ecom";

export const CAPABILITY_META: Record<
  Capability,
  { label: string; accent: string }
> = {
  lead: { label: "Lead Capture", accent: "#D9342B" },
  order: { label: "Order Capture", accent: "#C9A06B" },
  ecom: { label: "E-commerce", accent: "#141414" },
};

export type WorkflowStep = { title: string; desc: string };

export type Vertical = {
  /** Route slug under /for and /demo. */
  slug: string;
  /** Card / hero title. */
  title: string;
  /** Short label for pills + breadcrumbs. */
  label: string;
  /** Audience eyebrow, e.g. "DEVELOPERS · BROKERS". */
  eyebrow: string;
  capability: Capability;
  /** Per-vertical accent (brand-aligned). */
  accent: string;
  /** One-line pain/value used on the For-Business card. */
  pain: string;
  /** Short one-liner for the homepage card grid. */
  cardDesc: string;
  /** The 4 steps the agent runs, start → finish. */
  workflow: [WorkflowStep, WorkflowStep, WorkflowStep, WorkflowStep];
};

export const VERTICALS: Vertical[] = [
  {
    slug: "real-estate",
    title: "Skillies for Real Estate",
    label: "Real Estate",
    eyebrow: "DEVELOPERS · BROKERS",
    capability: "lead",
    accent: "#5C6670",
    cardDesc: "Replies instantly to property inquiries and books serious site visits.",
    pain: "78% of buyers go with whoever replies first. Skillies replies in seconds, qualifies budget, and books the site visit.",
    workflow: [
      { title: "Capture the lead", desc: "Replies to every Meta / 99acres enquiry in under 15 seconds." },
      { title: "Qualify budget & intent", desc: "Four right questions sort hot buyers from tyre-kickers." },
      { title: "Book the site visit", desc: "Slots it into your CRM and confirms with the sales head." },
      { title: "Follow up 30 days", desc: "Nudges at day 7, 14, 30 with new inventory and price updates." },
    ],
  },
  {
    slug: "ecommerce",
    title: "Skillies for E-commerce",
    label: "E-commerce",
    eyebrow: "D2C · ONLINE STORES",
    capability: "ecom",
    accent: "#D9342B",
    cardDesc: "Recovers abandoned carts, captures orders, and upsells inside the chat.",
    pain: "Carts get abandoned at 2 a.m. Skillies recovers them, captures the order, and upsells — right inside the chat.",
    workflow: [
      { title: "Engage the shopper", desc: "Answers product and sizing questions instantly, 24/7." },
      { title: "Recover the cart", desc: "Wins back 22–31% of abandoned carts with a nudge." },
      { title: "Capture order & payment", desc: "Takes the order in-chat and flips COD to prepaid." },
      { title: "Track & re-engage", desc: "Handles 'where's my order?' and brings buyers back." },
    ],
  },
  {
    slug: "retail",
    title: "Skillies for Retail & Stores",
    label: "Retail & Stores",
    eyebrow: "SHOPS · SALONS · GYMS",
    capability: "order",
    accent: "#E0A656",
    cardDesc: "Takes orders, answers stock questions, and nudges customers to reorder.",
    pain: "Saturday rush, missed orders. Skillies takes orders 24/7 in your language and reminds customers to reorder.",
    workflow: [
      { title: "Take the order", desc: "Accepts voice, photo and text orders in any language." },
      { title: "Confirm the items", desc: "Reads back the cart and totals before locking it in." },
      { title: "Collect payment", desc: "Auto-generates a UPI link and confirms on receipt." },
      { title: "Restock reminder", desc: "Nudges repeat customers to reorder at the right time." },
    ],
  },
  {
    slug: "study-abroad",
    title: "Skillies for Study Abroad",
    label: "Study Abroad",
    eyebrow: "CONSULTANTS · COUNSELLORS",
    capability: "lead",
    accent: "#1E2A44",
    cardDesc: "Nurtures students through long decision cycles and books counselling.",
    pain: "A student enquires in Feb, converts in Oct. Skillies nurtures the whole cycle and books the counselling call.",
    workflow: [
      { title: "Capture the enquiry", desc: "Replies before the student ghosts to the next consultant." },
      { title: "Qualify country & profile", desc: "Sorts by destination, budget and academic fit." },
      { title: "Book counselling", desc: "Schedules the call and loops in the parent thread." },
      { title: "Nurture to admission", desc: "12–18 month memory across the whole application cycle." },
    ],
  },
  {
    slug: "coaching",
    title: "Skillies for Coaching & EdTech",
    label: "Coaching & EdTech",
    eyebrow: "INSTITUTES · BATCHES",
    capability: "lead",
    accent: "#3D4A6B",
    cardDesc: "Qualifies students and books demo sessions automatically.",
    pain: "Result day — 5,000 parents in 48 hours. Skillies qualifies and books every demo class while you breathe.",
    workflow: [
      { title: "Capture the enquiry", desc: "Absorbs result-day surges without dropping a message." },
      { title: "Qualify student & parent", desc: "Dual-persona handling for the kid and the decision-maker." },
      { title: "Book the demo class", desc: "Schedules the trial session straight into your calendar." },
      { title: "Follow up to enrol", desc: "Chases the fee deadline so counsellors don't have to." },
    ],
  },
  {
    slug: "interiors",
    title: "Skillies for Modular Kitchen & Interiors",
    label: "Modular Kitchen & Interiors",
    eyebrow: "STUDIOS · DESIGNERS",
    capability: "lead",
    accent: "#B5613D",
    cardDesc: "Turns showroom inquiries into booked design consultations.",
    pain: "Customer sends a photo at midnight. Skillies returns a quote range and books the design consultation.",
    workflow: [
      { title: "Capture the enquiry", desc: "Reads the room photo and Pinterest reference instantly." },
      { title: "Estimate a quote range", desc: "Returns a ballpark and a design suggestion in 60 seconds." },
      { title: "Book the site visit", desc: "Locks the design consultation with your studio." },
      { title: "Follow up to close", desc: "Keeps ₹5L–₹50L jobs warm until the contract is signed." },
    ],
  },
  {
    slug: "hajj",
    title: "Skillies for Hajj & Umrah Travel",
    label: "Hajj & Umrah Travel",
    eyebrow: "PILGRIMAGE OPERATORS",
    capability: "order",
    accent: "#1F3A2E",
    cardDesc: "Handles package inquiries and documents, then confirms bookings 24/7.",
    pain: "Malayalam voice notes at 1 a.m. Skillies handles package questions, documents, and confirms the booking.",
    workflow: [
      { title: "Handle the enquiry", desc: "Understands voice notes from older pilgrims, day or night." },
      { title: "Share packages & docs", desc: "Sends the right package and the document checklist." },
      { title: "Confirm the booking", desc: "Routes the family group and locks the seats." },
      { title: "Pre-trip reminders", desc: "Nudges for pending documents without nagging." },
    ],
  },
  {
    slug: "insurance",
    title: "Skillies for Insurance",
    label: "Insurance",
    eyebrow: "BROKERS · AGENTS",
    capability: "lead",
    accent: "#1B2E4B",
    cardDesc: "Explains plans, collects leads, and schedules callbacks.",
    pain: "Anxious 11 p.m. queries about coverage. Skillies explains plans calmly, collects the lead, and books a callback.",
    workflow: [
      { title: "Capture the lead", desc: "Answers the late-night query before the buyer cools off." },
      { title: "Explain the plans", desc: "Calm, accurate answers — IRDAI-aware, no pressure." },
      { title: "Qualify the need", desc: "Handles pre-existing-disease questions in 5 languages." },
      { title: "Book the callback", desc: "Schedules the human call once the lead is warm." },
    ],
  },
];

export function getVertical(slug: string): Vertical | undefined {
  return VERTICALS.find((v) => v.slug === slug);
}
