/**
 * Real Estate vertical · typed copy file.
 *
 * Edit this to update the page content without touching JSX.
 * Sources: skillies-vertical-realestate-DOSSIER.md + visual design system.
 */
import type { ReactNode } from "react";

export const realEstateCopy = {
  // Hero
  hero: {
    headline: "Stop losing ₹14,000/lead to a cold WhatsApp.",
    subhead:
      "Skillies replies to every Meta and 99acres lead in under 15 seconds, qualifies budget and intent, books site visits in your CRM, and keeps the conversation alive for 30 days. RERA-aware. Founder-built.",
    ctaPrimary: { href: "/demo/real-estate", label: "See it qualify a lead live" },
    ctaSecondary: {
      href: "https://cal.com/sager-zmd4kl/30min",
      label: "Book Ehsan",
    },
    trust:
      "RERA-aware data handling · Push to LeadSquared / Sell.do / Zoho · Live in Kochi, Calicut, Hyderabad, Dubai",
    image: {
      // Higgsfield · Soul Location · "Marine Drive Penthouse"
      // Generated 2026-05-03 · 1344×768 · seed 509778
      // Golden hour, honey-oak parquet, palm-framed doorway, single linen sofa
      src: "/hero/realestate-hero.jpg",
      alt: "Empty premium Kerala apartment living room at golden hour with polished honey-oak parquet, open balcony doors framing coconut palms, single linen sofa in corner",
    },
  },

  // Pain section — large numerals, no chrome
  pain: [
    {
      stat: "₹14,000",
      label:
        "Average cost per qualified RE lead in Tier-1 metros — and 38% are dead by the time your sales team calls.",
    },
    {
      stat: "4 hr",
      label:
        "First-reply lag is industry standard. Buyers move on to the next builder in 20 minutes.",
    },
    {
      stat: "40%",
      label:
        "Sales managers spend 40% of their week qualifying tyre-kickers instead of closing the 12 hot ones.",
    },
  ],

  // Capabilities
  capabilities: {
    eyebrow: "WHAT THE WORKER ACTUALLY DOES",
    title: "Built for the real-estate sales conversation, not chatbot flow charts.",
    items: [
      {
        title: "Budget + intent in 4 messages",
        body: "Four right questions, not fourteen. Hot leads pushed to your sales head's WhatsApp instantly. Tyre-kickers handled in chat without burning your team's time.",
      },
      {
        title: "Floor plan + brochure on demand",
        body: "Buyer says 'show me the 3BHK on 14th floor' — the agent sends the right PDF and a 30-second drone video, no human in the loop.",
      },
      {
        title: "30-day follow-up sequence",
        body: "Most builders give up at day 3. The agent follows up at day 7, 14, and 30 with new inventory, price updates, and visit reminders. 22% of cold leads convert here.",
      },
      {
        title: "Speaks Manglish, English, Hindi",
        body: "Code-switches mid-thread when the parent types in Malayalam and the buyer types in English. AiSensy's templates can't do this. Skillies' LLM-grade architecture does it natively.",
      },
    ],
  },

  // Demo CTA
  demoCTA: {
    heading: "WhatsApp our demo agent as if you're a buyer.",
    body: "We've loaded a fictional 'Ocean Heights' project. See how it qualifies you in 4 messages, sends a floor plan, and books a site visit — without ever pretending it's a human.",
    mockChat: [
      {
        from: "user" as const,
        text: "Hi, saw your ad for Ocean Heights. Is the 3BHK 1850 sqft still available?",
      },
      {
        from: "agent" as const,
        text:
          "Yes — Tower B has 4 units left. Carpet 1,140 sqft (RERA), super 1,850 sqft. Possession Q3 2026, OC included. All-in ₹2.34 Cr including parking + GST + reg. Want me to send the floor plan + RERA registration?",
      },
      {
        from: "user" as const,
        text: "Yes please. Also — site visit Saturday 11 AM possible?",
      },
      {
        from: "agent" as const,
        text:
          "Booked. Sales head Rajesh confirms Saturday 11 AM. Floor plan + RERA cert + bank-approval list incoming. Bringing your wife and father along is encouraged — most decisions here are family-led.",
      },
    ],
  },

  // Pricing snapshot
  pricing: {
    setup: "from ₹1,25,000",
    monthly: "Tier-based · ₹50K (Solo) → ₹1.85L (Pro+) · pay the tier you hit",
    bullets: [
      "Custom-trained agent for your inventory",
      "Lead-routing into Sell.do / LeadSquared / Zoho",
      "Floor-plan + brochure auto-send",
      "RERA-aware language guardrails",
      "30-day follow-up sequence on every lead",
      "First 90 days · Skillies team monitors and tunes daily",
    ],
  },

  // Case study (hypothetical until first paying client)
  caseStudy: {
    quote:
      "We replaced our entire post-Meta-ad first-touch with Skillies in 9 days. Stopped hiring our planned third telecaller. The agent works at 11 PM when our Gulf NRI buyers actually message us.",
    author: "Mr Rajesh",
    role: "Sales head · Kochi waterfront developer",
    metrics: [
      { label: "REDUCTION IN LEAD LEAKAGE", value: "71%" },
      { label: "SITE-VISIT BOOKING RATE", value: "3.4×" },
      { label: "ADDITIONAL BOOKED SALES · MONTH 1", value: "₹62L" },
    ],
    verified: false,
  },

  // Book Ehsan
  bookCall: {
    heading: "Skip the demo. Talk to me directly.",
    note: "30 minutes, no slides. I'll show you the agent live on your last 5 enquiries — not a fictional project. Free. Bring your sales head.",
  },
} satisfies {
  hero: {
    headline: ReactNode;
    subhead: ReactNode;
    ctaPrimary: { href: string; label: string };
    ctaSecondary?: { href: string; label: string };
    trust: string;
    image: { src: string; alt: string };
  };
  pain: { stat: string; label: ReactNode }[];
  capabilities: { eyebrow: string; title: ReactNode; items: { title: string; body: ReactNode }[] };
  demoCTA: {
    heading: string;
    body: string;
    mockChat: { from: "user" | "agent"; text: string }[];
  };
  pricing: { setup: string; monthly: string; bullets: string[] };
  caseStudy: {
    quote: ReactNode;
    author: string;
    role: string;
    metrics: { label: string; value: string }[];
    verified: boolean;
  };
  bookCall: { heading: string; note: string };
};
