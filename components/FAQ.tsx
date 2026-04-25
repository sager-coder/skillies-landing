"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const faqs = [
  {
    q: "What is Amazon KDP?",
    a: "Amazon Kindle Direct Publishing (KDP) is Amazon's self-publishing platform. Anyone can publish paperback and digital books on Amazon and earn royalties every time someone buys a copy. You don't need a publisher, an agent, or even writing experience — especially when you use AI.",
  },
  {
    q: "Do I need writing skills or experience?",
    a: "No. The Skillies.AI method uses AI tools to handle content creation. What you need is discipline, consistency, and the ability to follow a process. If you can commit 5 hours a day, you can do this.",
  },
  {
    q: "How much time do I need to invest daily?",
    a: "A minimum of 5 hours per day for the duration of the program. This is not a side hobby — it's a real business. The students who put in the hours are the ones who see real results.",
  },
  {
    q: "Is the alignment real? What if I don't earn?",
    a: "Yes. The Skillies Batch model means you pay ₹50,000 upfront — and the remaining ₹4,50,000 is collected only after your KDP earnings cross ₹1,00,000/month. If you don't hit that trigger, the ISA never activates, you owe nothing more, and you keep all training, materials, and alumni access. The structure is in the signed ISA contract, with a hard cap at ₹4,50,000 ISA collection (₹5,00,000 total programme fee, never more).",
  },
  {
    q: "What if Amazon bans my account?",
    a: "We teach original content creation using AI. If you follow our process, account bans are extremely unlikely. However, if your account is banned due to copyright violations or policy breaches on your end, that's not covered under our guarantee. We teach the right way — follow it.",
  },
  {
    q: "Can I really earn ₹1 lakh per month?",
    a: "With enough books in the right niches, absolutely. KDP income compounds — each book is an asset that earns every month. 60+ books following our methodology can realistically generate ₹50,000 to ₹1,00,000+ per month in passive royalties. But it takes time, effort, and patience.",
  },
  {
    q: "Is Skillies.AI just about KDP books?",
    a: "No — KDP is the entry. The Skillies Batch teaches the publishing business end-to-end — niche research, books, covers, KDP scaling, then later Etsy printables, AI-assisted marketing, agent-built software. Alumni get every future track first. We also have a separate AI services arm building AI systems for Kerala businesses (clinics, schools, real estate, retail, hospitality). KDP is the proof point: 63 books, ₹1,16,000 last month, automated.",
  },
  {
    q: "Why you? Why this school?",
    a: "I'm a working English teacher in Malappuram and a quiet researcher on the side. I've been testing AI income workflows since 2020 — uHRS (Microsoft), then KDP, now video and agents. I don't dress up numbers. I build the tools I teach with. If you want polished guru-branding, I'm the wrong school. If you want a teacher who still shows their working, I'm your guy.",
  },
  {
    q: "What happens after the in-person month?",
    a: "You go home and start publishing daily for 2 months — that's the earning ramp. Weekly WhatsApp check-ins with Ehsan, monthly optional in-person catchups in Malappuram. Once your earnings cross ₹1L+/month, ISA activates. Lifetime alumni community access — when the next Skillies course drops (Etsy, Meta ads, agents), alumni get first access.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-cream-dark last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-base md:text-lg font-medium text-charcoal group-hover:text-red transition-colors pr-4">
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-cream flex items-center justify-center text-red text-xl font-light"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="py-24 md:py-32 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <p className="text-green tracking-[0.3em] uppercase text-sm font-medium mb-4">
              Questions
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal">
              Frequently Asked
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="bg-cream/50 rounded-2xl p-6 md:p-8">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
