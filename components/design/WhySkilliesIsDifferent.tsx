"use client";

/**
 * WhySkilliesIsDifferent · the 8-capability section that justifies why
 * Skillies is priced higher than template-based WhatsApp tools.
 * 
 * Visual uplift (v4):
 *  - Refined card styling with high-performance glassmorphism on hover.
 *  - Staggered entrance animations using a custom spring for smoothness.
 *  - Interactive number reveal and typography improvements.
 */

import { motion } from "framer-motion";

const FEATURES = [
  {
    eyebrow: "ALWAYS LEARNING",
    title: "Self-auditing behavior",
    body: "Every 100 messages, the agent runs a self-audit — which prospects ghosted, what was the last thing it said, where did the script break? Behavior updates every week based on real outcomes.",
    metric: "↑ 12-30% closure / month",
  },
  {
    eyebrow: "MEMORY · WEEKS, MONTHS",
    title: "Perfect patient recall",
    body: "A study-abroad student inquires in Feb, returns in Oct. Skillies remembers IELTS scores, family budget, and last objections. Counsellor turnover stops costing you the lead.",
    metric: "18 mo cross-cycle recall",
  },
  {
    eyebrow: "VISION · IMAGES + DOCS",
    title: "Visual Intelligence",
    body: "Floor plan → square footage + price-band. Empty kitchen → 3 rendered options. Aadhaar/PAN → field-validated. Most bots say 'I received your image.' Skillies reads it.",
    metric: "Vision + OCR built-in",
  },
  {
    eyebrow: "WORKER DASHBOARD",
    title: "Operations, not just Chat",
    body: "Per-staff login, role-based access, hot-lead auto-assignment, and daily performance summaries. AiSensy gives you a shared inbox. We give you an operations system.",
    metric: "Role-based routing system",
  },
  {
    eyebrow: "LEAD ROUTING",
    title: "Intelligent Forwarding",
    body: "Lead qualification scoring decides the route. Hot lead → directly to your senior sales head's WhatsApp. Cold lead → 30-day nurture. Routing rules are yours.",
    metric: "Score-based assignment",
  },
  {
    eyebrow: "CAL.COM + GOOGLE MEET",
    title: "Calendar Fulfillment",
    body: "Agent opens your calendar, finds a slot, books it, and sends Google Meet links + Maps + reminders. Customer's calendar invite goes out before they end the chat.",
    metric: "Zero double-booking",
  },
  {
    eyebrow: "RAZORPAY DIRECT",
    title: "Closing in-thread",
    body: "Once the prospect says yes, Razorpay/UPI link generates inside the thread. No 'I'll send you the invoice tomorrow.' Cash collected before they leave the chat.",
    metric: "RTO drops by 40%",
  },
  {
    eyebrow: "COMPLEX SKU TUNING",
    title: "Deep Domain Logic",
    body: "Modular kitchens with variable sqft rates, insurance with carrier-specific loading, or real-estate with floor PLC. Skillies handles SKU complexity that templates fail at.",
    metric: "Logic-tuned onboarding",
  },
];

export default function WhySkilliesIsDifferent() {
  return (
    <section id="why-different" className="sk-section sk-grain border-b border-sk-hairline" style={{ background: "var(--sk-cream)" }}>
      <div className="sk-container">
        <div className="max-w-3xl mb-16 md:mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sk-font-meta text-sk-red font-black tracking-widest uppercase mb-4"
          >
            The Moat
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="sk-font-section text-sk-ink sk-text-balance"
            style={{ fontSize: "var(--sk-text-h2)", lineHeight: 1.1 }}
          >
            Eight things every <br />
            <span className="sk-font-display-italic text-sk-red">WhatsApp tool can&rsquo;t do.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="sk-font-body mt-6 text-sk-ink60"
            style={{ fontSize: "var(--sk-text-lead)", maxWidth: "58ch" }}
          >
            AiSensy is ₹3,200/month. We&rsquo;re ₹40,000+/month. You&rsquo;re not paying 
            for a tool; you&rsquo;re paying for a moat. Each capability below is why 
            Skillies is a worker, not a router.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {FEATURES.map((f, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -30px 0px" }}
              transition={{ 
                duration: 0.5, 
                delay: (i % 4) * 0.05, 
                ease: [0.22, 1, 0.36, 1] as const
              }}
              className="group relative rounded-[2rem] p-8 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_30px_60px_rgba(20,20,20,0.06)] overflow-hidden will-change-transform"
              style={{
                background: "white",
                border: "1px solid var(--sk-hairline)",
              }}
            >
              {/* Animated hover background */}
              <div className="absolute inset-0 bg-sk-red opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500 pointer-events-none" />
              
              <div className="flex flex-col h-full relative z-10">
                <span
                  className="sk-font-display text-5xl text-sk-red opacity-[0.08] group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 mb-6 block origin-left"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="sk-font-meta text-sk-ink40 text-[9px] font-black tracking-widest uppercase mb-2">
                  {f.eyebrow}
                </p>
                <h3 className="sk-font-section text-xl text-sk-ink leading-tight mb-4 group-hover:text-sk-red transition-colors duration-300">
                  {f.title}
                </h3>
                <p className="sk-font-body text-sm text-sk-ink60 leading-relaxed mb-8 flex-1">
                  {f.body}
                </p>
                <div className="pt-6 border-t border-sk-hairline">
                  <p className="sk-font-meta text-[10px] text-sk-red font-bold uppercase tracking-tight">
                    {f.metric}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="sk-font-body text-sk-ink20 text-sm max-w-xl mx-auto">
            We don&rsquo;t sell software. We sell sales workers. Templates don&rsquo;t ship 
            like this — agencies do — and we&rsquo;re priced like neither.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
