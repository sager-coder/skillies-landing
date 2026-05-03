/**
 * Study Abroad vertical · typed copy file.
 * Sources: skillies-vertical-studyabroad-DOSSIER.md + visual design system.
 *
 * NOTE · compliance flags · NEVER claim "authorized agent" of any country
 * (ICEF + CCPA risk). Acceptable: ICEF-accredited, British Council UK Agent
 * Training graduate, [University X] official representative. Don't promise
 * IDP-CRM integration unless client has IDP partner status.
 */
export const studyAbroadCopy = {
  hero: {
    headline: "Reply to every UK, Canada, Germany enquiry before they ghost.",
    subhead:
      "Skillies' WhatsApp agent qualifies students by IELTS band + country + budget + intake, sends the right brochure in Manglish or English, and only escalates serious enquiries to your counsellors. Mone, naale call cheyyam — but only if they're real.",
    ctaPrimary: {
      href: "/demo/study-abroad",
      label: "Talk to the agent like a student",
    },
    ctaSecondary: {
      href: "https://cal.com/sager-zmd4kl/30min",
      label: "Book Ehsan",
    },
    trust:
      "Used by counsellors placing students in UK, Canada, Germany, Australia · ICEF-aware",
    image: {
      src: "/hero/studyabroad-hero.jpg",
      alt: "Indian student late 20s at sunlit study table with laptop and document folder, looking at out-of-focus older mentor figure, warm afternoon light",
    },
  },

  pain: [
    {
      stat: "47%",
      label:
        "Of Kerala study-abroad leads have no IELTS, no funds, no real intent — but they tie up your counsellors all the same.",
    },
    {
      stat: "6+ hr",
      label:
        "Counsellors spend daily answering 'what's the IELTS score for Canada' — the same WhatsApp message, repeated.",
    },
    {
      stat: "30%",
      label:
        "Of qualified students switch to a competitor within 72 hours if you don't reply same day.",
    },
  ],

  capabilities: {
    eyebrow: "WHAT THE WORKER ACTUALLY DOES",
    title: "Long-cycle, multi-language, parent + student in the same thread.",
    items: [
      {
        title: "Score + budget + intent in 5 messages",
        body: "Handles 'ente IELTS score 6.5 aanu, UK pokaam ennund' without missing a beat. Forwards only confirmed-intent leads to your counsellors.",
      },
      {
        title: "University shortlist on demand",
        body: "Student says 'MS in Data Science, ₹25L budget, 2-year course'. Agent sends a curated 6-university shortlist with intake dates from your existing partner list.",
      },
      {
        title: "12-month memory across the cycle",
        body: "Student inquires in February, converts in October. Counsellor change in between? Agent remembers the IELTS score, the target intake, the family budget — every detail intact.",
      },
      {
        title: "Parent + student dual-thread voice",
        body: "Mother types in Malayalam, daughter types in English — same chat, agent handles both registers without losing context.",
      },
    ],
  },

  demoCTA: {
    heading: "WhatsApp our demo agent and pretend you want MS in Canada.",
    body: "Start the conversation in Malayalam — it'll continue in Malayalam. Switch to English mid-message — it follows. Ask about IELTS, budget, scholarships. See how it qualifies you in 5 turns.",
    mockChat: [
      {
        from: "user" as const,
        text:
          "Hi. MS in Canada plan und. ente IELTS overall 6.5 aanu, Writing 5.5.",
      },
      {
        from: "agent" as const,
        text:
          "Overall 6.5 nallathaanu — most Canadian universities accept. Pakshe Writing 5.5 visa-il problem aakum (SDS-il band-balance vendam). 2 options: (a) re-test 4-6 weeks prep, (b) some universities pre-sessional English allow cheyyum. Cost ariyaam, ipo decision veno?",
      },
      {
        from: "user" as const,
        text: "Budget ₹25L per year mathram aanu. Tier-2 universities show cheyyamo?",
      },
      {
        from: "agent" as const,
        text:
          "Atharam — 6-university shortlist anuppi: Trent, Brock, Ontario Tech, UNB, Memorial, Lakehead. Tuition ₹15-22L/yr range, scholarship-eligible undenkil more. Intake September 2026 / January 2027 — ningalkku eth match aakum?",
      },
    ],
  },

  pricing: {
    setup: "from ₹1,35,000",
    monthly: "₹39,999/mo + capabilities",
    bullets: [
      "Custom-trained on your partner-university list, intake calendars, fees",
      "12-18 month memory · student returns 6 months later, agent remembers",
      "Document vision · transcripts, IELTS scorecards, passports",
      "Parent + student dual-thread · Mal + Eng + Hin",
      "EMI calculator · Leap, Avanse, Auxilo, Prodigy comparisons",
      "CRM sync · Zoho / HubSpot / LeadSquared · NOT IDP-CRM unless you have partner status",
    ],
  },

  caseStudy: {
    quote:
      "September UK intake — we used to lose 40% of leads because counsellors couldn't keep up with the surge. With Skillies, the agent qualified everyone, fed only IELTS-ready students to my team. We didn't hire the 4 counsellors I had budgeted for.",
    author: "Anwar",
    role: "Founder · Calicut study abroad consultancy",
    metrics: [
      { label: "COUNSELLOR PRODUCTIVITY", value: "4.1×" },
      { label: "RISE IN IELTS-QUALIFIED SHORTLIST", value: "38%" },
      { label: "SAVED ON HIRING", value: "₹14L" },
    ],
    verified: false,
  },

  bookCall: {
    heading: "Skip the demo. Talk to me directly.",
    note: "30 minutes, no slides. I'll show you the agent on your last 5 student conversations — not a fictional one. From one Malappuram founder to another. Free.",
  },
} as const;
