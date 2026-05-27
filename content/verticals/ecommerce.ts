/**
 * Ecommerce / D2C vertical · typed copy file.
 *
 * LIGHT TIER. ₹35-75k setup, ₹14,999/mo. NO vision, NO voice-reply,
 * NO long-memory, NO CRM. Single language pair. Visual signal: lower
 * tier · electric + ink accents · NOT corporate.
 */
export const ecommerceCopy = {
  hero: {
    headline: "Your store, replying in 9 seconds. At 2 a.m.",
    subhead:
      "Skillies' WhatsApp agent recovers abandoned carts, answers order-status DMs, sends UPI links, and stops RTO failures before they ship. For Shopify, WooCommerce, and Razorpay-powered D2C brands doing ₹10L–₹2Cr/month.",
    ctaPrimary: {
      href: "/demo/ecommerce",
      label: "WhatsApp the demo store",
    },
    ctaSecondary: {
      href: "https://cal.com/sager-zmd4kl/30min",
      label: "Book Ehsan",
    },
    trust:
      "Live on 31 D2C stores across India · Shopify, WooCommerce, Razorpay, Shiprocket compatible",
    image: {
      src: "/hero/ecommerce-hero.jpg",
      alt: "Young Indian D2C founder mid-twenties at a wooden desk with a laptop showing a Shopify dashboard, packing slips and shipping labels stacked beside her, warm evening light",
    },
  },

  // Pain · simple bullets, no chrome
  pain: [
    {
      label:
        "68% of carts abandon before checkout — and you reply to the recovery DM 7 hours later, when the buyer has already moved on.",
    },
    {
      label:
        "1 in 3 cash-on-delivery orders comes back as RTO. That's ₹220 lost per failure, every time, on top of the lost sale.",
    },
    {
      label:
        '"Where\'s my order?" DMs eat 40% of your support time, and most of the answer is sitting in Shiprocket already.',
    },
  ],

  capabilities: {
    eyebrow: "WHAT THE WORKER ACTUALLY DOES",
    title: "Light tier. Cart recovery + order ops + repeat-order memory. Done.",
    items: [
      {
        title: "Abandoned-cart recovery in 9 seconds",
        body: "Buyer drops off at checkout. Agent DMs in their language within seconds: 'Saw you left the Mango Mojito serum behind. Want me to send a UPI link with free shipping?' Recovers 22-31% of carts vs. 4-6% via email.",
      },
      {
        title: "COD → prepaid conversion before ship",
        body: "Agent intercepts every COD order with a UPI link and a small free-shipping incentive. 40-55% of COD buyers flip to prepaid. RTO drops from 28% to under 12% on the prepaid pool.",
      },
      {
        title: "Order-status auto-replies",
        body: "Customer asks 'where's my order?' Agent reads Shiprocket / Delhivery in real time, replies with the current city + ETA, ships out a tracking link. Your support inbox stops drowning.",
      },
      {
        title: "Pushes to Shopify, WooCommerce, Razorpay",
        body: "Order, refund, address-change, and cart events sync both ways. No double entry. Your team works in Shopify; the agent handles the noise on WhatsApp.",
      },
    ],
  },

  demoCTA: {
    heading: "WhatsApp our demo store as a customer.",
    body: "Add a product to cart and abandon. Watch the agent recover it in under 30 seconds — UPI link, free-shipping nudge, repeat-order memory, all in your language.",
    mockChat: [
      {
        from: "user" as const,
        text: "Hi, I added the Vitamin C serum but checkout was confusing. Is the ₹599 the final price?",
      },
      {
        from: "agent" as const,
        text:
          "Yes — ₹599 all in, free shipping over ₹500 so you're set. I can lock it at this price for 2 hours. UPI link or COD?",
      },
      {
        from: "user" as const,
        text: "UPI please. And how long for delivery to Kochi?",
      },
      {
        from: "agent" as const,
        text:
          "Razorpay link: rzp.io/skillies-demo. Kochi pin 682024 → 2-3 working days via Shiprocket. I'll DM the tracking number the moment it ships.",
      },
    ],
  },

  pricing: {
    setup: "from ₹50,000",
    monthly: "Tier-based · ₹50K (Solo) → ₹1.85L (Pro+) · pay the tier you hit",
    bullets: [
      "Cart recovery + order ops + repeat-order memory · the entire product",
      "1 region's language pair (English + your regional language)",
      "Shopify, WooCommerce, Razorpay, Shiprocket integrations",
      "COD → prepaid conversion flow built in",
      "Repeat-purchase nudges auto-timed per buyer cycle",
      "Live in 7 days · your support team can run it, no coding needed",
    ],
  },

  caseStudy: {
    quote:
      "We were losing ₹3-4L a month to abandoned carts and another ₹1.5L to RTO. The agent replies in 9 seconds, converts 26% of dropped carts, and flips half our COD orders to prepaid before they ship. Support team got their evenings back.",
    author: "Anjali",
    role: "Founder · skincare D2C brand, Bengaluru",
    metrics: [
      { label: "CART RECOVERY", value: "+26%" },
      { label: "COD → PREPAID", value: "47%" },
      { label: "ADDITIONAL MONTHLY REVENUE", value: "₹4,80,000" },
    ],
    verified: false,
  },

  bookCall: {
    heading: "Light tier. Cheapest setup. Live in a week.",
    note: "Talk to me directly — no enterprise discovery call. 15 minutes is enough. I'll show you the agent on a real D2C store's WhatsApp number. ₹35k setup, ₹14,999/month, cancel any month.",
  },
} as const;
