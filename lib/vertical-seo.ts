/**
 * Per-vertical SEO content — meta descriptions, keywords, buyer-intent FAQ,
 * social-share copy, and related-vertical links.
 *
 * GENERATED + adversarially fact-checked against content/verticals/*.ts via the
 * 'skillies-vertical-seo-content' workflow (claims softened to what the source
 * supports — e.g. "IRDAI-aware" not "IRDAI-compliant"). study-abroad authored by
 * hand from its source. Consumed by verticalMetadata(), <AgentFAQ/> (+ FAQPage
 * JSON-LD), the related-agents row, and the per-vertical OG image.
 */

export type VerticalSeoPack = {
  seoDescription: string;
  keywords: string[];
  faqs: { q: string; a: string }[];
  ogHeadline: string;
  ogSub: string;
  relatedSlugs: string[];
};

export const VERTICAL_SEO: Record<string, VerticalSeoPack> = {
  "real-estate": {
    "seoDescription": "AI sales agent for Real Estate on WhatsApp: replies to every Meta & 99acres lead in under 15 seconds, qualifies budget, books site visits. RERA-aware.",
    "keywords": [
      "AI sales agent for real estate",
      "real estate WhatsApp automation India",
      "99acres lead follow-up automation",
      "Meta ad lead qualification real estate",
      "RERA-aware WhatsApp chatbot",
      "real estate CRM lead routing LeadSquared Sell.do",
      "site visit booking WhatsApp agent",
      "Manglish real estate sales agent"
    ],
    "faqs": [
      {
        "q": "What does the Skillies real estate agent actually do?",
        "a": "It replies to every Meta and 99acres lead in under 15 seconds, qualifies budget and intent in about four messages, sends floor plans and brochures on demand, and books site visits into your CRM. It also runs a 30-day follow-up sequence on every lead instead of giving up at day 3."
      },
      {
        "q": "How much does it cost?",
        "a": "Setup starts from ₹1,25,000. Monthly is tier-based, from ₹50K (Solo) up to ₹1.85L (Pro+), and you pay the tier you actually hit. Every plan includes a custom-trained agent for your inventory, CRM lead routing, floor-plan auto-send, and the 30-day follow-up sequence."
      },
      {
        "q": "What languages can it handle?",
        "a": "Manglish, English, and Hindi. It code-switches mid-thread, so it can reply in Malayalam to a parent and English to the buyer in the same conversation, natively, not from rigid templates."
      },
      {
        "q": "Does it connect to my CRM and is it RERA-aware?",
        "a": "Yes. Hot leads route into Sell.do, LeadSquared, or Zoho, and the agent pushes site visits and lead details there directly. It also uses RERA-aware data handling and RERA-aware language guardrails."
      },
      {
        "q": "How long does setup take and am I left to figure it out alone?",
        "a": "No. The agent is custom-trained on your inventory before going live, and for the first 90 days the Skillies team monitors and tunes it daily. Builders typically use it to replace their post-Meta-ad first touch rather than hiring another telecaller."
      }
    ],
    "ogHeadline": "Stop losing leads to a cold WhatsApp.",
    "ogSub": "An AI sales agent that replies in under 15 seconds, qualifies budget, and books site visits. RERA-aware.",
    "relatedSlugs": [
      "interiors",
      "study-abroad"
    ]
  },
  "ecommerce": {
    "seoDescription": "AI sales agent for E-commerce on WhatsApp that recovers abandoned carts in 9 seconds, flips COD to prepaid, and auto-answers order-status DMs. Live in 7 days.",
    "keywords": [
      "whatsapp ai agent for ecommerce india",
      "abandoned cart recovery whatsapp",
      "cod to prepaid conversion shopify",
      "whatsapp automation for d2c brands",
      "shopify whatsapp order status bot",
      "rto reduction ecommerce india",
      "woocommerce razorpay whatsapp agent",
      "whatsapp cart recovery for indian stores"
    ],
    "faqs": [
      {
        "q": "What does the WhatsApp agent actually do for my store?",
        "a": "It recovers abandoned carts by DMing buyers in their language within seconds with a UPI link, flips COD orders to prepaid before they ship, and auto-answers 'where's my order?' DMs by reading Shiprocket or Delhivery in real time. It also nudges repeat purchases timed to each buyer's cycle."
      },
      {
        "q": "Does it integrate with Shopify, WooCommerce and Razorpay?",
        "a": "Yes. It syncs order, refund, address-change and cart events both ways with Shopify, WooCommerce and Razorpay, and reads Shiprocket and Delhivery for live tracking. No double entry — your team keeps working in Shopify while the agent handles WhatsApp."
      },
      {
        "q": "How much does it cost?",
        "a": "Setup starts at ₹35,000 with the monthly plan at ₹14,999, and you can cancel any month. Higher monthly tiers run from ₹50K (Solo) up to ₹1.85L (Pro+) — you pay the tier you actually hit."
      },
      {
        "q": "How fast can it go live, and do I need a developer?",
        "a": "You're live in 7 days, and no coding is needed — your existing support team can run it. It's the light tier built for D2C brands doing ₹10L–₹2Cr a month."
      },
      {
        "q": "What languages does it reply in?",
        "a": "It covers one region's language pair — English plus your regional language — so buyers get answers in their own language. Cart recovery, order ops and repeat-order memory are all included."
      }
    ],
    "ogHeadline": "Your store, replying in 9 seconds. At 2 a.m.",
    "ogSub": "A WhatsApp AI agent that recovers carts, flips COD to prepaid, and cuts RTO — for Shopify, Woo & Razorpay D2C brands.",
    "relatedSlugs": [
      "retail",
      "coaching"
    ]
  },
  "retail": {
    "seoDescription": "AI sales agent for Retail & Stores on WhatsApp: takes voice, photo & text orders, sends UPI links, times restock reminders, syncs to Marg & Vyapar.",
    "keywords": [
      "whatsapp ai agent for kirana store",
      "whatsapp order taking for retail india",
      "ai sales agent for supermarket whatsapp",
      "upi payment link whatsapp orders",
      "restock reminder whatsapp automation",
      "whatsapp agent malayalam retail",
      "marg vyapar khatabook whatsapp integration",
      "whatsapp ai for general store kerala"
    ],
    "faqs": [
      {
        "q": "How much does the Skillies retail agent cost?",
        "a": "It is our Light tier, the cheapest setup: ₹35k to set up and ₹14,999 a month, and you can cancel any month. Setup scales with what you need, and pricing follows the tier you land on as your order volume grows."
      },
      {
        "q": "Which languages does it speak?",
        "a": "It runs on one region's language pair, with Malayalam plus English as the default. A customer can send a voice note like '5 kg basmati, 2 litre oil, ente regular brand' and the agent confirms, calculates, and sends a UPI link."
      },
      {
        "q": "Will it work with my billing app?",
        "a": "Yes. Orders push to Marg, Vyapar, or Khatabook with one tap, so there is no double entry. You check your phone, not a separate dashboard."
      },
      {
        "q": "How long does setup take and do I need a developer?",
        "a": "You are live in 7 days, and your own staff can run it with no coding needed. It is a Light tier built to be simple: text plus payment is the entire product."
      },
      {
        "q": "What does the agent actually do?",
        "a": "It takes voice, photo, and text orders, suggests offers, sends UPI links and handles COD-vs-prepaid, and sends restock reminders timed to each customer's own cycle, not annoying broadcasts. Repeat-order memory runs about 30 days."
      }
    ],
    "ogHeadline": "Your kirana on WhatsApp, working at 11 p.m.",
    "ogSub": "Takes orders, sends UPI links, times restock reminders, pushes to your billing app.",
    "relatedSlugs": [
      "ecommerce",
      "coaching"
    ]
  },
  "study-abroad": {
    "seoDescription": "AI WhatsApp sales agent for study-abroad consultants: qualifies students by IELTS, country & budget, sends shortlists, recalls the full cycle. ICEF-aware.",
    "keywords": [
      "AI sales agent for study abroad",
      "study abroad WhatsApp automation India",
      "IELTS lead qualification WhatsApp",
      "study abroad consultant CRM Kerala",
      "university shortlist automation",
      "Manglish study abroad agent",
      "ICEF-aware WhatsApp agent",
      "overseas education lead follow-up"
    ],
    "faqs": [
      {
        "q": "What does the Skillies study-abroad agent actually do?",
        "a": "It qualifies each student by IELTS band, country, budget and intake in about five messages, sends the right brochure and a university shortlist from your existing partner list, and only escalates confirmed-intent students to your counsellors."
      },
      {
        "q": "Which languages does it handle?",
        "a": "Malayalam (including Manglish), English and Hindi. It handles a parent typing in Malayalam and the student typing in English in the same thread, code-switching mid-message without losing context."
      },
      {
        "q": "Does it remember students across the long application cycle?",
        "a": "Yes — it keeps 12–18 month memory. A student who enquires in February and converts in October keeps their IELTS score, target intake and family budget intact, even if the counsellor changes in between."
      },
      {
        "q": "How much does it cost?",
        "a": "Setup starts from ₹1,00,000. Monthly is tier-based, from ₹50K (Solo) up to ₹1.85L (Pro+), and you pay the tier you actually hit. It's custom-trained on your partner-university list, intake calendars and fees."
      },
      {
        "q": "Can it read documents, and how does compliance work?",
        "a": "It reads transcripts, IELTS scorecards and passports via document vision, and includes an EMI calculator and a counsellor dashboard with hand-off and an audit log per applicant. It's ICEF-aware and routes leads while your counsellors stay in control."
      }
    ],
    "ogHeadline": "Reply before they ghost.",
    "ogSub": "An AI WhatsApp agent that qualifies students by IELTS, country & budget — and remembers the whole cycle.",
    "relatedSlugs": [
      "coaching",
      "real-estate"
    ]
  },
  "coaching": {
    "seoDescription": "AI sales agent for Coaching & EdTech on WhatsApp: replies in under 15 seconds, qualifies by exam and score, books demo classes, absorbs result-day surges.",
    "keywords": [
      "AI sales agent for coaching institute",
      "WhatsApp automation for NEET coaching",
      "coaching lead qualification WhatsApp India",
      "demo class booking automation",
      "AI chatbot for edtech India",
      "NEET JEE coaching enquiry automation",
      "LeadSquared WhatsApp integration coaching",
      "result day lead management coaching"
    ],
    "faqs": [
      {
        "q": "What does the agent actually do for a coaching institute?",
        "a": "It replies to every WhatsApp enquiry in under 15 seconds, qualifies the student by exam, score and city, and answers parent questions about fees, hostel, faculty and batches. It also books demo classes with a Maps link and auto-reminders, and only escalates to a counsellor when the parent actually wants to enrol."
      },
      {
        "q": "Which languages does it handle?",
        "a": "It replies in the language the family enquired in — including Hindi, Malayalam and Tamil. On result day it can take parents pinging in different languages all at once without your counsellors burning out."
      },
      {
        "q": "What does it cost?",
        "a": "Setup starts from ₹75,000. Monthly is tier-based, from ₹50K (Solo) up to ₹1.85L (Pro+), and you pay the tier you actually hit."
      },
      {
        "q": "How long is setup, and what is it trained on?",
        "a": "The agent is custom-trained on your batches, fees, faculty, results and scholarships so it answers like your own counsellor. The fastest way to see it is to WhatsApp our demo agent as a parent would, or book a 30-minute call where we run it on your last 50 result-day conversations."
      },
      {
        "q": "Does it integrate with the tools we already use?",
        "a": "Yes — it connects with LeadSquared, Tagmango and Razorpay. It also keeps memory across exam cycles, so a NEET 2026 dropper retrying as NEET 2027 is the same lead, ready to re-engage in next year's batch."
      }
    ],
    "ogHeadline": "Don't lose a NEET aspirant to a 4-hour reply lag.",
    "ogSub": "An AI sales agent on WhatsApp that replies in 15 seconds, qualifies by score, and books the demo class.",
    "relatedSlugs": [
      "study-abroad",
      "insurance"
    ]
  },
  "interiors": {
    "seoDescription": "AI sales agent for Modular Kitchen & Interiors on WhatsApp: sends a quote range from a room photo, books designer site visits, and nurtures leads for 30 days.",
    "keywords": [
      "modular kitchen lead generation whatsapp",
      "AI sales agent for interior design studios india",
      "whatsapp agent for modular kitchen quotes",
      "interior design lead follow up automation",
      "modular kitchen quote from photo",
      "whatsapp ai for interior studios bangalore kerala mumbai",
      "designer site visit booking automation",
      "instagram lead to quote interior design"
    ],
    "faqs": [
      {
        "q": "What does the agent actually do for my modular kitchen or interiors studio?",
        "a": "It qualifies leads on WhatsApp, sends a personalized quote range from a customer's empty-room photo and described finish, suggests design photos from your past projects, and books a designer site visit. It then follows up for 30 days at day 7, 14, and 30 with finish samples, EMI options, and designer availability."
      },
      {
        "q": "How is the quote range generated — is it accurate to my pricing?",
        "a": "The agent is custom-trained on your own priced templates, finishes, and brands like Hettich and Hafele, so the range reflects your numbers, not a generic estimate. It gives a budget band from the customer photo and finish choice, then offers a site visit for the precise figure."
      },
      {
        "q": "What does it cost?",
        "a": "Setup is from ₹1,00,000, and the monthly is tier-based — ₹50K (Solo) up to ₹1.85L (Pro+), and you pay the tier you actually hit. It's built for studios doing ₹5L–₹50L jobs."
      },
      {
        "q": "Which channels and integrations does it work with?",
        "a": "It runs multi-channel across WhatsApp, Instagram DM, and your website. It integrates with Salesforce, Zoho, and LeadSquared, and pulls your past-project design photos straight from your Drive with no manual upload."
      },
      {
        "q": "How fast can it turn a lead into a quote?",
        "a": "Fast enough to compete with HomeLane and Livspace on speed — the demo gives a real quote in about 60 seconds from a photo, instead of the days a manual quote-prep cycle can take. The goal is to collapse time-to-first-quote from days to minutes."
      }
    ],
    "ogHeadline": "Quote a kitchen from one photo. In 60 seconds.",
    "ogSub": "A WhatsApp AI agent that qualifies interiors leads, books site visits, and nurtures for 30 days.",
    "relatedSlugs": [
      "real-estate",
      "ecommerce"
    ]
  },
  "hajj": {
    "seoDescription": "AI sales agent for Hajj & Umrah travel on WhatsApp: answers package queries in Malayalam, Urdu, Hindi & English, collects documents, handles family bookings.",
    "keywords": [
      "AI sales agent for Hajj operators",
      "WhatsApp agent for Umrah travel agency",
      "Hajj Umrah package inquiry automation",
      "Malayalam WhatsApp assistant for pilgrims",
      "Umrah document checklist automation",
      "AI agent for Kerala Hajj operators",
      "family group Umrah booking software",
      "voice note WhatsApp agent Umrah"
    ],
    "faqs": [
      {
        "q": "What does the agent actually do for my Hajj and Umrah business?",
        "a": "It answers package, document, and group-schedule questions on WhatsApp around the clock, trained on your own packages, embarkation cities and seasons. It collects the document checklist, routes family group bookings, and sends Razorpay deposit links so your staff can focus on sales."
      },
      {
        "q": "Which languages does it handle?",
        "a": "Malayalam, Urdu, Hindi and English, and it code-switches mid-thread when an elder types in Malayalam and the son replies in English. It also transcribes Malayalam and Urdu voice notes from older haji-mar and replies in text matched to the question."
      },
      {
        "q": "How much does it cost?",
        "a": "Setup is from Rs 75,000. Monthly is tier-based, from Rs 50K (Solo) up to Rs 1.85L (Pro+), and you pay the tier you actually hit."
      },
      {
        "q": "Does it integrate with Nusuk or the Saudi visa process?",
        "a": "We never claim Nusuk integration, which is run by the Saudi Ministry. The agent supports honest, manual, Hajj Committee India-aware workflows including a 23-step Saudi visa document checklist."
      },
      {
        "q": "Can it handle large family bookings where one person pays for everyone?",
        "a": "Yes. It handles one payer with multiple pilgrims and mixed family floors, tracking the cohort and surfacing only the right confirmation to the right person, with Razorpay deposit links for large family bookings."
      }
    ],
    "ogHeadline": "Answer every pilgrim, in their language, at 2 a.m.",
    "ogSub": "A WhatsApp agent for Hajj & Umrah operators — packages, documents, voice notes, family bookings.",
    "relatedSlugs": [
      "study-abroad",
      "insurance"
    ]
  },
  "insurance": {
    "seoDescription": "AI sales agent for Insurance on WhatsApp: qualifies prospects, handles pre-existing-disease queries in 5 languages, IRDAI-aware, books callbacks.",
    "keywords": [
      "AI sales agent for insurance on WhatsApp",
      "WhatsApp insurance lead qualification India",
      "IRDAI-aware WhatsApp chatbot for insurance agents",
      "term life lead follow-up automation India",
      "insurance agency WhatsApp agent Malayalam Hindi",
      "pre-existing disease insurance query bot",
      "insurance broker lead nurturing WhatsApp",
      "automated insurance document collection Aadhaar PAN"
    ],
    "faqs": [
      {
        "q": "How much does the Insurance WhatsApp agent cost?",
        "a": "Setup starts from Rupees 1,50,000, and monthly is tier-based, from Rupees 50K (Solo) up to Rupees 1.85L (Pro+) where you pay the tier you actually hit. Razorpay and PayU are built in for premium collection."
      },
      {
        "q": "Which languages does it handle?",
        "a": "The agent handles medical and pre-existing-disease questions in 5 Indic languages, with Malayalam, Hindi and English front-and-centre. So your diabetic father's 11 PM question gets answered calmly in his own language."
      },
      {
        "q": "Is it IRDAI-aware?",
        "a": "Yes. IRDAI-aware language guardrails are baked in, so the agent never says 'guaranteed cover' or 'no problem' on a pre-existing condition. When asked, it can quote a carrier's Claim Settlement Ratio and point to the IRDAI grievance redressal route, sharing facts rather than pressure."
      },
      {
        "q": "What does the agent actually do for my agency?",
        "a": "It qualifies prospects without pressure tactics, handles pre-existing-disease conversations with carrier-specific underwriting facts, chases Aadhaar, PAN, medical reports and bank statements with respectful reminders, and only escalates the buyers who are genuinely ready. It also remembers a family over time, so when a customer returns months or years later for a parent's health cover it picks up where the human counsellor left off."
      },
      {
        "q": "Does it train on my specific carrier panel and integrate with my tools?",
        "a": "Yes, it's custom-trained on your carrier panel and commission structure, with document vision that validates files before they reach the underwriter. It includes Cal.com booking, a worker dashboard for your closing team, and Razorpay/PayU for premium collection."
      }
    ],
    "ogHeadline": "Answer the diabetic father's 11 PM question. In Malayalam.",
    "ogSub": "An IRDAI-aware WhatsApp agent that qualifies insurance buyers calmly and only escalates the ready ones.",
    "relatedSlugs": [
      "real-estate",
      "study-abroad"
    ]
  }
};

export function seoFor(slug: string): VerticalSeoPack | undefined {
  return VERTICAL_SEO[slug];
}
