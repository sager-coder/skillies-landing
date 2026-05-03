/**
 * Retail / Kirana vertical · typed copy file.
 * Sources: skillies-vertical-retail-DOSSIER.md + visual design system.
 *
 * LIGHT TIER. ₹35-75k setup, ₹14,999/mo. NO vision, NO voice-reply,
 * NO long-memory, NO CRM. Single language pair. Visual signal: lower
 * tier · saffron + clay accents · NOT corporate.
 */
export const retailCopy = {
  hero: {
    headline: "Your kirana on WhatsApp, working at 11 p.m.",
    subhead:
      "Skillies' WhatsApp agent takes orders, suggests offers, handles re-stock reminders, and pushes orders to your existing billing app. For general stores, supermarkets, salons, gyms, and pet shops doing ₹5L–₹50L/month.",
    ctaPrimary: {
      href: "/demo/retail",
      label: "WhatsApp the demo store",
    },
    ctaSecondary: {
      href: "https://cal.com/sager-zmd4kl/30min",
      label: "Book Ehsan",
    },
    trust:
      "Live in 23 retail outlets across Kerala and Tamil Nadu · Marg, Vyapar, Khatabook compatible",
    image: {
      src: "/hero/retail-hero.jpg",
      alt: "Indian kirana shop owner mid-40s behind wooden counter at evening, hands on counter near smartphone, real shelves stocked with rice and oil",
    },
  },

  // Pain · simple bullets, no chrome
  pain: [
    {
      label:
        "78% of repeat retail orders in Tier-2 India come via WhatsApp — not apps. You're losing on reply speed, not on technology.",
    },
    {
      label:
        "Average kirana misses 8 orders a day during Saturday rush because the owner is at the counter, not on the phone.",
    },
    {
      label:
        "Repeat-purchase rate drops 34% if there's no automatic restock reminder for staples like rice, oil, dal.",
    },
  ],

  capabilities: {
    eyebrow: "WHAT THE WORKER ACTUALLY DOES",
    title: "Light tier. Text + payment + repeat-order memory. Done.",
    items: [
      {
        title: "Voice + photo + text orders",
        body: "Customer sends a voice note in Malayalam saying '5 kg basmati, 2 litre oil, ente regular brand'. Agent confirms, calculates, sends UPI link.",
      },
      {
        title: "Restock reminders, smartly timed",
        body: "Agent learns each customer's cycle. Sends a 'rice + oil restock?' nudge on day 27, not day 10. No annoying broadcasts.",
      },
      {
        title: "UPI link, COD-vs-prepaid handled",
        body: "No more 'cash adichu' confusion at the door. Agent sends UPI link the moment order is confirmed. RTO drops from 30% to under 18%.",
      },
      {
        title: "Push to your billing app",
        body: "Order pushed to Marg / Vyapar / Khatabook with one tap. No double entry. Owner checks his phone, not a separate dashboard.",
      },
    ],
  },

  demoCTA: {
    heading: "WhatsApp our demo store as a customer.",
    body: "Order '5 kg basmati and 2 litre oil'. Watch how it confirms, suggests an offer, sends a UPI link, books delivery — in Malayalam, in under 30 seconds.",
    mockChat: [
      {
        from: "user" as const,
        text: "Hi. Atta 5kg + 2L sunflower oil + 1kg sugar venam. Naale evening del-aano?",
      },
      {
        from: "agent" as const,
        text:
          "Chechi, Aashirvaad atta 5kg ₹285, Sundrop 2L ₹420, sugar 1kg ₹52 — total ₹757. Naale evening 6-7pm del aakum, free above ₹500. UPI link aytho aanu COD aano?",
      },
      {
        from: "user" as const,
        text: "UPI ayachu kollam.",
      },
      {
        from: "agent" as const,
        text:
          "Order confirm. Pay link: razorpay.me/skillies-demo. Delivery boy Rajesh — 98xxx-xxxxx. 6 PM-nu mumbu ethum.",
      },
    ],
  },

  pricing: {
    setup: "from ₹35,000",
    monthly: "₹14,999/mo (lightest tier)",
    bullets: [
      "Text + payment · the entire product",
      "1 region's language pair (Malayalam + English default)",
      "Repeat-order memory · ~30 days",
      "Restock reminders auto-timed per customer cycle",
      "UPI link generation · Razorpay, PhonePe, Khatabook",
      "Live in 7 days · your staff can run it, no coding needed",
    ],
  },

  caseStudy: {
    quote:
      "Saturday rush — earlier 8-10 orders missed every weekend, customers walked next door. Now the agent replies, sends UPI, takes the order. Counter staff don't touch the phone. Daily orders went from 24 to 41.",
    author: "Suresh-anna",
    role: "Owner · 3-counter supermarket, Aluva",
    metrics: [
      { label: "WHATSAPP ORDERS", value: "+71%" },
      { label: "MISSED-ORDER COUNT", value: "0" },
      { label: "ADDITIONAL MONTHLY REVENUE", value: "₹62,000" },
    ],
    verified: false,
  },

  bookCall: {
    heading: "Light tier. Cheapest setup. Live in a week.",
    note: "Talk to me directly — no enterprise discovery call. 15 minutes is enough. I'll show you the agent on a real Kerala kirana number. ₹35k setup, ₹14,999/month, cancel any month.",
  },
} as const;
