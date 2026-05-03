/**
 * Modular Kitchen / Interior Design vertical · typed copy file.
 * Sources: skillies-vertical-interiors-DOSSIER.md + visual design system.
 *
 * Brand voice · "warm-expert · competent friend-of-a-friend"
 * Italic accent on the keyword "kitchens" or "interior" in the headline.
 */
export const interiorsCopy = {
  hero: {
    headline: "Convert your Sunday-morning Instagram leads — before they call HomeLane.",
    subhead:
      "Skillies' WhatsApp agent qualifies modular kitchen and full-home interior leads, sends a personalized quote range from a customer's empty-room photo, books a designer site visit, and follows up for 30 days. Built for studios doing ₹5L–₹50L jobs.",
    ctaPrimary: {
      href: "/demo/interiors",
      label: "WhatsApp the demo agent",
    },
    ctaSecondary: {
      href: "https://cal.com/sager-zmd4kl/30min",
      label: "Book Ehsan",
    },
    trust:
      "Used by interior studios in Kerala, Bangalore, Mumbai · Salesforce / Zoho / LeadSquared integrations",
    image: {
      src: "/hero/interiors-hero.jpg",
      alt: "Premium Indian modular kitchen at golden hour with polished granite countertop, fresh produce, brass cabinet handles on dark walnut shutters, no people",
    },
  },

  pain: [
    {
      stat: "₹6,800",
      label:
        "Average cost per modular kitchen Meta lead in Tier-1 metros — and 52% never get a quote because the studio is 'preparing one'.",
    },
    {
      stat: "3.5 days",
      label:
        "Average quote turnaround. HomeLane and Livspace turn one around in 90 minutes. You're losing on speed, not skill.",
    },
    {
      stat: "70%",
      label:
        "Drop-off after the customer sends a photo + Pinterest reference and the designer types 'we'll send someone tomorrow.'",
    },
  ],

  capabilities: {
    eyebrow: "WHAT THE WORKER ACTUALLY DOES",
    title:
      "Photo of empty kitchen. Three rendered options. Booked site visit. 60 seconds.",
    items: [
      {
        title: "Quote range from a customer photo",
        body: "Customer sends 'L-shaped kitchen, 9x10 ft, marine ply with acrylic finish'. Agent gives ₹4.2L–₹5.6L band based on YOUR priced template, then offers a site visit for the precise number.",
      },
      {
        title: "Pinterest-style design suggestions",
        body: "Agent sends 3 photos from your past projects that match the customer's described style. Photos pulled from your Drive, no manual upload needed.",
      },
      {
        title: "Site visit booking with designer name",
        body: "Books your free designer for the right slot, sends Google Maps + 'what to expect' 1h before. The conversion event isn't lost in scheduling chaos.",
      },
      {
        title: "30-day post-visit nurture",
        body: "Most studios go quiet after the first quote. The agent follows up at day 7, 14, 30 with finish samples, EMI options, designer availability — converting cold leads at 22%.",
      },
    ],
  },

  demoCTA: {
    heading: "WhatsApp our demo agent as if you're planning a 1.5BHK Bangalore flat.",
    body: "Send a photo of an empty kitchen, drop in 2-3 Pinterest screenshots, ask for a budget range. See how fast you get a real quote — not a 'we'll get back to you'.",
    mockChat: [
      {
        from: "user" as const,
        text: "Hi. Just got 2BHK in Whitefield. Need full kitchen + 2 wardrobes. Budget around ₹5L.",
      },
      {
        from: "agent" as const,
        text:
          "Got it. Could you send a photo of the empty kitchen + bedroom? L-shape vs U-shape changes the quote a lot. Also — finish preference: laminate (₹3.8-4.2L), acrylic (₹4.5-5.2L), or PU (₹5.5-6.5L)?",
      },
      {
        from: "user" as const,
        text: "[photo of empty kitchen] · acrylic preferred · also Pinterest reference attached",
      },
      {
        from: "agent" as const,
        text:
          "L-shape, ~9x10 ft, window on left wall — got it. Acrylic with brass handles like your Pinterest ref: ₹4.6-5.0L for kitchen, ₹1.2L for 2 wardrobes. 3 of our past project photos matching this style coming below. Designer Priya available Saturday 11 AM or Sunday 4 PM — book?",
      },
    ],
  },

  pricing: {
    setup: "from ₹1,15,000",
    monthly: "₹39,999/mo + capabilities",
    bullets: [
      "Vision module · room photos, floor plans, Pinterest references",
      "Custom-trained on your priced templates, finishes, brands (Hettich/Hafele)",
      "EMI calculator · Bajaj, HDFC, no-cost month options",
      "Designer site-visit booking + Maps + 'what to expect' messaging",
      "30-day post-visit nurture sequence · 22% cold-lead conversion",
      "Multi-channel · WhatsApp + Instagram DM + website",
    ],
  },

  caseStudy: {
    quote:
      "Time-to-first-quote dropped from 2.8 days to 4 minutes. My designers stopped doing measurement-visit-then-quote-prep on every lead. They only see customers who've already self-qualified on budget and scope.",
    author: "Sneha",
    role: "Founder · Bangalore interior studio",
    metrics: [
      { label: "SITE-VISIT BOOKING RATE", value: "3.2×" },
      { label: "DEAL CLOSURE LIFT", value: "+24%" },
      { label: "PIPELINE ADDED · QUARTER ONE", value: "₹1.4 Cr" },
    ],
    verified: false,
  },

  bookCall: {
    heading: "Skip the demo. Show me your last 5 leads.",
    note: "30 minutes, no slides. I'll run the agent on your actual last 5 customer photos and budget questions — you'll see exactly what your team would do differently. Free.",
  },
} as const;
