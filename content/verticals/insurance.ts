/**
 * Insurance vertical · typed copy file.
 * Brand voice · trustworthy elder-brother. Calm. Patient. IRDAI-aware.
 * Never urgency-laden. Never "guaranteed claim approval".
 */
export const insuranceCopy = {
  hero: {
    headline:
      "Answer the diabetic father's question at 11 PM · in Malayalam.",
    subhead:
      "Skillies' WhatsApp agent qualifies insurance prospects without pressure tactics, handles medical / pre-existing-disease questions in 5 Indic languages, and only escalates the buyers who are actually ready. IRDAI-aware language guardrails baked in.",
    ctaPrimary: {
      href: "/demo/insurance",
      label: "Try the agent on yourself",
    },
    ctaSecondary: {
      href: "https://cal.com/sager-zmd4kl/30min?notes=Insurance%20agency%20%E2%80%94%20interested%20in%20the%20Skillies%20agent",
      label: "Book a 30-min call",
    },
    trust:
      "IRDAI-aware language · long-term customer memory · Mal + Hin + Eng",
    image: {
      src: "/hero/insurance-hero.jpg",
      alt: "Indian middle-aged couple at home reviewing a printed insurance policy at evening, smartphone showing WhatsApp on the table",
    },
  },

  pain: [
    {
      stat: "60%",
      label:
        "Of insurance Meta leads die because nobody answered 'will my diabetic father get cover' fast enough — and at the right hour.",
    },
    {
      stat: "₹3,500",
      label:
        "Average cost per qualified term-life lead in Tier-1 metros. Comparison-shopping behaviour means you lose the lead in 24 hours if not engaged warmly.",
    },
    {
      stat: "11 mo",
      label:
        "Tele-counsellor turnover · every quit means re-training someone on your carrier panel + commission structure + IRDAI compliance.",
    },
  ],

  capabilities: {
    eyebrow: "WHAT THE WORKER ACTUALLY DOES",
    title: "Calm-down anxious buyers · qualify properly · stay IRDAI-clean.",
    items: [
      {
        title: "Pre-existing disease conversations",
        body: "Customer says 'my father has diabetes.' Agent responds with carrier-specific underwriting (loading 25-40%, possible 30-day waiting period for diabetes-related claims) — never says 'no problem' or 'guaranteed cover'.",
      },
      {
        title: "Document collection on autopilot",
        body: "Aadhaar, PAN, medical reports, bank statement — chased over weeks with respectful reminders, document-vision validates before submission. Underwriter doesn't get half-complete files.",
      },
      {
        title: "CSR + IRDAI references when asked",
        body: "Customer asks 'will the claim actually pay out?' Agent quotes carrier-specific Claim Settlement Ratio + mentions IRDAI grievance redressal route — facts, not pressure.",
      },
      {
        title: "Multi-policy memory across the family",
        body: "Same customer comes back 6 months later for parent's health cover. Agent remembers the term-life policy from earlier, the family medical history shared, the budget tolerance — picks up where the human counsellor left off.",
      },
    ],
  },

  demoCTA: {
    heading: "WhatsApp our demo agent as if you were buying.",
    body: "Ask 'how much premium for ₹1Cr term cover, age 38, non-smoker.' Then drop in 'my mom has diabetes.' See how the agent answers calmly, with carrier-specific facts — never with pressure.",
    mockChat: [
      {
        from: "user" as const,
        text: "Hi · ₹1 Cr term cover venam, age 38, non-smoker. Premium evidi range?",
      },
      {
        from: "agent" as const,
        text:
          "Healthy non-smoker 38 male · ₹1 Cr term, 35-yr policy term · annual premium typically ₹14,000-22,000 across HDFC Life / ICICI Pru / Max Life / Tata AIA. Subject to medicals. Want carrier-by-carrier breakdown with CSR for each?",
      },
      {
        from: "user" as const,
        text: "Athey. Ente mom-inu diabetes und, oru cover edukan plan und.",
      },
      {
        from: "agent" as const,
        text:
          "Diabetic parents-il health cover possible aanu. Premium loading 25-40% range, 30-day waiting period for diabetes-related claims, 2-yr waiting period typical for pre-existing complications. Carrier-il Niva Bupa + Star Health typically takes diabetic seniors warmly. Mom age + sugar levels + medication share cheytho — 3 carriers compare cheyam.",
      },
    ],
  },

  pricing: {
    setup: "from ₹1,50,000",
    monthly: "Tier-based · ₹50K (Solo) → ₹1.85L (Pro+) · pay the tier you hit",
    bullets: [
      "Custom-trained on YOUR carrier panel + commission structure",
      "Document vision · Aadhaar / PAN / medical reports / bank statements",
      "Razorpay/PayU for premium collection",
      "Long-horizon memory · same family, multiple policies, years apart",
      "Cal.com booking + worker dashboard for your closing team",
      "IRDAI-aware language guardrails baked in · zero compliance risk",
    ],
  },

  caseStudy: {
    quote:
      "We were losing 6 leads a day to 'I'll think about it' — buyers who never came back. The agent calls them back at the right time with the right question. Closure rate up 31%.",
    author: "Anwar M.",
    role: "Founder · 6-agent insurance broker, Calicut",
    metrics: [
      { label: "MONTHLY POLICIES SOLD", value: "+31%" },
      { label: "LEAD-TO-PROPOSAL TIME", value: "-68%" },
      { label: "TELE-COUNSELLOR HEADCOUNT NEEDED", value: "1.0× (was 2.5×)" },
    ],
    verified: false,
  },

  bookCall: {
    heading: "Insurance is anxiety-led. Skip the demo · talk to me.",
    note:
      "30 minutes, no slides. I'll show you the agent on your last 5 prospect conversations · we'll see together where it would have caught what your team missed.",
  },
} as const;
