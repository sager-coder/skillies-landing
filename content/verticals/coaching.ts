/**
 * Coaching / Edtech vertical · typed copy file.
 * Sources: skillies-vertical-coaching-DOSSIER.md + visual design system.
 *
 * Highest competitive friction (AiSensy + WATI saturated). Lead messaging
 * with conversation depth, not feature presence.
 */
export const coachingCopy = {
  hero: {
    headline: "Don't lose a NEET aspirant to a 4-hour reply lag.",
    subhead:
      "Skillies replies to every coaching enquiry in under 15 seconds, qualifies the student by exam, score and city, and handles parent objections about fees, hostel and demo class — all on WhatsApp, in the language they enquired in.",
    ctaPrimary: {
      href: "/demo/coaching",
      label: "Try it like a parent enquiring",
    },
    ctaSecondary: {
      href: "https://cal.com/sager-zmd4kl/30min",
      label: "Book Ehsan",
    },
    trust:
      "Built for NEET, JEE, IELTS, UPSC, CA institutes · LeadSquared + Tagmango integrations",
    image: {
      src: "/hero/coaching-hero.jpg",
      alt: "Indian mother and teen son in school uniform at warm-lit kitchen table, mother looking at son's smartphone screen, intimate evening moment",
    },
  },

  pain: [
    {
      stat: "5,000",
      label:
        "Result-day surge — parents pinging in Hindi, Malayalam, Tamil all at once. Your counsellors burn out by hour 6.",
    },
    {
      stat: "41%",
      label:
        "Demo class no-show rate when reminders are manual. The single biggest pre-conversion drop.",
    },
    {
      stat: "4 hr",
      label:
        "Reply lag on result day = lost lead. Aakash, Allen, PW reply in 60 seconds. You don't.",
    },
  ],

  capabilities: {
    eyebrow: "WHAT THE WORKER ACTUALLY DOES",
    title:
      "Result-day spikes, dual-persona threads, exam-cycle memory across years.",
    items: [
      {
        title: "Parent FAQ on autopilot",
        body: "Fees, hostel, doubt sessions, faculty, batches — answered before a human picks up. Counsellors only see the parents who actually want to enrol.",
      },
      {
        title: "Score-conditioned routing",
        body: "NEET 580 → senior counsellor for AIIMS-track. NEET 320 → foundation batch counsellor. Neither waits 4 hours, neither gets the wrong call back.",
      },
      {
        title: "Demo class booking + reminders",
        body: "Books the slot, sends Maps link + 'what to expect' message, reminds 24h and 1h before. No-show rate drops 60%.",
      },
      {
        title: "Memory across exam cycles",
        body: "NEET 2026 dropper retrying as NEET 2027 = same lead in agent's memory. Re-engages with 'Hi Aarav, ALLEN dropper batch starts April 15. Last time you scored 480, ready to talk?'",
      },
    ],
  },

  demoCTA: {
    heading: "WhatsApp our demo agent as a parent would.",
    body: "Ask about NEET coaching fees, demo classes, hostel, faculty. We've loaded a fictional Aakash-style brochure. See how it answers in your language, books the demo, and only escalates if you actually want to enrol.",
    mockChat: [
      {
        from: "user" as const,
        text:
          "Hi mera beta NEET 2027 ke liye coaching dhoondh raha hai. Fee structure bhej do.",
      },
      {
        from: "agent" as const,
        text:
          "Beta ka Class 12 result aaya hai? Kitne marks aaye hain — agar bata sakte hain to main exact batch (Foundation / Pinnacle / Dropper) ke fee aur faculty dono bhej deta hu, comparison ke saath.",
      },
      {
        from: "user" as const,
        text: "489 marks. Drop year sochte hain. Kota ya yahan home se?",
      },
      {
        from: "agent" as const,
        text:
          "489 — strong dropper candidate. Pinnacle Dropper batch best fit hoga (Phase-1 Kohinoor, 38 students, Sandeep sir IIT-Kanpur 11 yrs NEET). Fee ₹3.45L total — ₹1.25L year-1 + ₹85k hostel + ₹35k material. EMI Propelld se ₹14,800/mo over 24 months. Demo class Saturday 11 AM book karu?",
      },
    ],
  },

  pricing: {
    setup: "from ₹85,000",
    monthly: "₹24,999/mo + capabilities",
    bullets: [
      "Custom-trained on your batches, fees, faculty, results, scholarships",
      "Dual-persona handling · parent + student in the same thread",
      "Result-day spike absorption · 5,000 messages in 48 hours, no degradation",
      "Demo class booking + Maps link + auto-reminders",
      "LeadSquared / Tagmango / Razorpay integrations",
      "Exam-cycle memory · re-engage failed attempts in next year's batch",
    ],
  },

  caseStudy: {
    quote:
      "Result day 2026 — my 3-person tele-counselling team usually quits after that week. This year, the agent handled the spike. They did sales calls, not WhatsApp triage. Demo show-up went from 41% to 78%.",
    author: "Faisal sir",
    role: "Director · Calicut NEET coaching institute",
    metrics: [
      { label: "DEMO-CLASS SHOW-UP RATE", value: "2.7×" },
      { label: "MONTHLY SAVINGS · TELE-COUNSELLING", value: "₹1.1L" },
      { label: "ADMISSION-FORM COMPLETIONS", value: "+32%" },
    ],
    verified: false,
  },

  bookCall: {
    heading: "Skip the demo. Talk to me before result day.",
    note: "30 minutes, no slides. I'll show you the agent on your last 50 result-day conversations — and project what it would have caught. Free. AiSensy and WATI route messages; we have conversations.",
  },
} as const;
