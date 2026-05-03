/**
 * Hajj / Umrah vertical · typed copy file.
 * Sources: skillies-vertical-hajj-DOSSIER.md + visual design system.
 *
 * NOTE · this is the most fragile vertical. Italic typography across hero.
 * No urgency timers. No "limited time" language. No Kaaba imagery as decor.
 * Religious phrases (InshaAllah / Mashallah) used naturally, never as marketing.
 * Never claim Nusuk API integration.
 */
import type { ReactNode } from "react";

export const hajjCopy = {
  hero: {
    headline: "Answer every pilgrim's question, in their language, at 2 a.m.",
    subhead:
      "An always-on assistant trained on your packages, document checklists, and group schedules. Built carefully, by a Malappuram founder. We do not promise Nusuk integration — only honest, manual, Hajj Committee India-aware workflows.",
    ctaPrimary: { href: "/demo/hajj", label: "WhatsApp the demo agent" },
    ctaSecondary: {
      href: "https://cal.com/sager-zmd4kl/30min",
      label: "Book Ehsan",
    },
    trust:
      "For licensed Hajj and Umrah operators serving Kerala and the Gulf",
    image: {
      src: "/hero/hajj-hero.jpg",
      alt: "Older Indian Muslim man's hands holding worn prayer beads in soft window light, contemplative still life",
    },
  },

  // Pain · 3 quotes (NOT statistics)
  pain: [
    {
      quote:
        "Hotel-il ninnu Haram-leku 200 metre ennu paranju, ennaal 15 minute nadakkanam. Ennum ee vidham photo-il vyajamaano?",
      attribution: "Pilgrim · Malappuram",
    },
    {
      quote:
        "Ummakku 68 vayassayi, BP-um sugar-um undu. Wheelchair vendi varumo? Aziziyah-il chenna mathi avarkku nadakkan kazhiyumo?",
      attribution: "Daughter of pilgrim · Calicut",
    },
    {
      quote:
        "Owner-de WhatsApp number busy aanu Ramadan-il, 4 staff document chase cheyyunnu. Pulse messages ozhukkunnu — reply varunnilla.",
      attribution: "Operator's family member",
    },
  ],

  capabilities: {
    eyebrow: "WHAT THE WORKER ACTUALLY DOES",
    title: "Built for the pilgrim's actual conversation, not a brochure dump.",
    items: [
      {
        title: "Speaks the pilgrim's language naturally",
        body: "Malayalam, Urdu, Hindi, English — code-switches mid-thread when the elder types in Malayalam and the son types in English. No template translations.",
      },
      {
        title: "Voice notes from older haji-mar",
        body: "Pilgrims over 60 type rarely. They send 25-second voice notes. The agent transcribes Malayalam and Urdu fluently and replies in text matched to the question.",
      },
      {
        title: "Document checklist, no nagging",
        body: "Passport, vaccination, mahram declaration, blocked-account proof — collected over weeks with respectful reminders, not nagging follow-ups.",
      },
      {
        title: "Family group bookings handled",
        body: "One payer, multiple pilgrims, mixed family floors. The agent tracks the cohort and surfaces only the right confirmation to the right person.",
      },
    ],
  },

  demoCTA: {
    heading: "WhatsApp our demo agent in Malayalam or English.",
    body: "Ask about a 2026 December Umrah package, send a photo of an old passport, request a Mahram clarification — see how it handles you. Reverently, in your dialect.",
    mockChat: [
      {
        from: "user" as const,
        text:
          "Assalamu alaikum. Umrah package undo December-il? Family of 6 — vappakku 71, ummakku 68.",
      },
      {
        from: "agent" as const,
        text:
          "Walaikum assalam. Family of 6 December Umrah — Green Zone (Ajyad) package recommend cheyyunnu. Vappakku BP/sugar undenkil hotel Haram-leku 600 metre nadakkan mathi, AC bus available. Total ekarakshena ₹3.6L per person. Itinerary PDF ayachu tharatte?",
      },
      {
        from: "user" as const,
        text: "Athey. Ennaal Madinah ethra night?",
      },
      {
        from: "agent" as const,
        text:
          "6 night Madinah include cheythittund — Movenpick Anwar, walking distance to Masjid an-Nabawi. Ningal randu rooms recommend cheyyunnu (vappa+umma + 4 makkalkku). Mu'allim Mecca + Madinah onnichu undakum, InshaAllah. Itinerary + payment terms PDF anuppi.",
      },
    ],
  },

  pricing: {
    setup: "from ₹1,25,000",
    monthly: "₹24,999/mo + capabilities",
    bullets: [
      "Custom-trained on your packages, embarkation cities, seasons",
      "Voice note transcription · Malayalam + Urdu + Hindi + English",
      "Family group routing · one payer, multiple pilgrims",
      "Document checklist · 23-step Saudi visa workflow",
      "Razorpay deposit links · large family bookings handled",
      "Quiet during 5 prayer times · auto-suppress promotional broadcasts",
    ],
  },

  caseStudy: {
    quote:
      "Last Umrah season my 4 staff did nothing but chase passport copies. This year, the agent handled documents, language, group routing. Staff did sales. We added 23 family bookings.",
    author: "Janab Abdul Rahiman",
    role: "Founder · Malappuram Hajj operator",
    metrics: [
      { label: "PILGRIM ENQUIRY CAPACITY", value: "4.6×" },
      { label: "REPEAT-QUESTION TIME SAVED", value: "70%" },
      { label: "ADDITIONAL BOOKINGS · ONE SEASON", value: "₹2.2 Cr" },
    ],
    verified: false,
  },

  bookCall: {
    heading: "If this resonates, write to me directly.",
    note: "30 minutes, no slides. Inshallah, you'll close more bookings without losing the reverent voice your business is known for. Nusuk is run by Saudi Ministry — we work with it, never around it.",
  },
} as const;
