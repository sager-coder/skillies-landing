"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const steps = [
  {
    num: "01",
    title: "Research with AI",
    desc: "Use AI to find profitable book niches that people are already buying on Amazon.",
    gradient: "from-red/10 to-red/5",
    border: "border-red/20",
    accent: "bg-red",
    hoverBorder: "hover:border-red/40",
  },
  {
    num: "02",
    title: "Create with AI",
    desc: "Build complete books using AI-powered tools. No writing talent needed — just the right process.",
    gradient: "from-green/10 to-green/5",
    border: "border-green/20",
    accent: "bg-green",
    hoverBorder: "hover:border-green/40",
  },
  {
    num: "03",
    title: "Publish & Earn",
    desc: "List on Amazon KDP. Readers buy your books. Amazon pays you royalties. Every single month.",
    gradient: "from-[#C9A24E]/10 to-[#C9A24E]/5",
    border: "border-[#C9A24E]/20",
    accent: "bg-[#C9A24E]",
    hoverBorder: "hover:border-[#C9A24E]/40",
  },
];

export default function WhatIsKDP() {
  return (
    <section className="py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-20">
            <p className="text-red tracking-[0.3em] uppercase text-xs font-semibold mb-4">
              How It Works
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-charcoal mb-6 tracking-tight">
              AI + Amazon = Passive Income
            </h2>
            <p className="text-lg text-gray max-w-2xl mx-auto leading-relaxed">
              Amazon KDP lets anyone publish books and earn royalties.
              We teach you to use AI to do it faster, smarter, and at scale.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {steps.map((step, i) => (
            <AnimatedSection key={step.num} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className={`relative p-8 rounded-3xl bg-gradient-to-br ${step.gradient} border ${step.border} ${step.hoverBorder} transition-all duration-500 group cursor-default h-full`}
              >
                {/* Step number */}
                <div className={`w-10 h-10 rounded-xl ${step.accent} flex items-center justify-center mb-6`}>
                  <span className="text-white text-sm font-bold">{step.num}</span>
                </div>

                <h3 className="text-xl font-bold text-charcoal mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-gray leading-relaxed text-[15px]">{step.desc}</p>

                {/* Connector arrow */}
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-cream-dark items-center justify-center z-10">
                    <svg className="w-3 h-3 text-charcoal/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4}>
          <div className="relative text-center p-10 rounded-3xl bg-white border border-cream-dark overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-red via-green to-[#C9A24E] rounded-b-full" />
            <p className="text-lg md:text-xl text-charcoal leading-relaxed">
              You don&apos;t need to be a writer. You don&apos;t need a degree.
              <br />
              <span className="font-semibold text-green-dark">
                You bring the brain. AI handles the heavy lifting.
              </span>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
