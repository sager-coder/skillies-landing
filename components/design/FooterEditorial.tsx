"use client";

/**
 * FooterEditorial · the closing information block.
 * 
 * Visual uplift (v4):
 *  - Refined dark theme with subtle grain and radial gradients.
 *  - Modernized typography using brand tokens.
 *  - Improved grid layout for links and better hover states.
 *  - Premium "Hero CTA" block with shimmering buttons.
 */

import React from "react";
import { Grain } from "./Primitives";
import Link from "next/link";
import { motion } from "framer-motion";

type Col = { kicker: string; items: Array<[string, string]> };

const COLUMNS: Col[] = [
  {
    kicker: "For Business",
    items: [
      ["Skillies for Real Estate", "/for/real-estate"],
      ["Skillies for Hajj & Umrah", "/for/hajj"],
      ["Skillies for Study Abroad", "/for/study-abroad"],
      ["Skillies for Coaching", "/for/coaching"],
      ["Skillies for Modular Kitchen", "/for/interiors"],
      ["Skillies for Retail / Kirana", "/for/retail"],
    ],
  },
  {
    kicker: "Pricing & Demos",
    items: [
      ["Interactive pricing calculator", "/pricing"],
      ["Vertical chooser", "/for"],
      ["Book a 30-min call", "https://cal.com/sager-zmd4kl/30min"],
    ],
  },
  {
    kicker: "Skillies School",
    items: [
      ["Amazon KDP methodology", "/skillies-school"],
      ["₹8.7L from 63 books · the proof", "/skillies-school#proof"],
      ["Sign in · Alumni portal", "/login"],
    ],
  },
  {
    kicker: "Company",
    items: [
      ["Built in Malappuram, Kerala", "/"],
      ["Talk to Ehsan", "https://cal.com/sager-zmd4kl/30min"],
      ["WhatsApp · ehsan@skillies.ai", "mailto:ehsan@skillies.ai"],
    ],
  },
  {
    kicker: "Legal",
    items: [
      ["Privacy Policy", "/privacy"],
      ["User Data Deletion", "/data-deletion"],
      ["Refund & Cancellation", "/refund"],
      ["Terms of Service", "/terms"],
    ],
  },
];

const SOCIAL: Array<[string, string]> = [
  ["Instagram · @skillies.ai", "https://instagram.com/skillies.ai"],
  ["Book a 30-min call with Ehsan", "https://cal.com/sager-zmd4kl/30min"],
  ["Email · ehsan@skillies.ai", "mailto:ehsan@skillies.ai"],
];

export default function FooterEditorial() {
  return (
    <footer className="relative overflow-hidden bg-[#121212] py-24 md:py-32 px-6">
      <Grain opacity={0.05} />
      
      {/* Background Glow */}
      <div
        aria-hidden
        className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(217,52,43,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="sk-container relative z-10">
        {/* Final CTA block */}
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sk-font-meta text-sk-red font-black tracking-[0.3em] uppercase mb-6"
          >
            § FINAL · READY TO SHIP?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="sk-font-display text-white leading-[0.95] mb-8"
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
          >
            Tools don&rsquo;t sell. <br />
            <span className="sk-font-display-italic text-sk-red">Workers do.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="sk-font-body text-white/60 text-lg md:text-xl max-w-xl mb-12 leading-relaxed"
          >
            A 30-minute scoping call with Ehsan. No slides, no sales pressure. 
            Just a clear route to your first AI worker.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="https://cal.com/sager-zmd4kl/30min"
              target="_blank"
              className="sk-shimmer group relative inline-flex h-14 items-center gap-3 rounded-full bg-sk-red px-8 text-sm font-bold text-white shadow-xl shadow-sk-red/20 transition-all hover:scale-105"
            >
              Book a 30-min call
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-14 items-center rounded-full bg-white/5 border border-white/10 px-8 text-sm font-bold text-white transition-all hover:bg-white/10"
            >
              See pricing calculator
            </Link>
          </motion.div>
        </div>

        {/* Links Divider */}
        <div className="my-24 md:my-32 h-[1px] bg-white/5" />

        {/* Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 md:gap-8">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="sk-font-display text-2xl text-white font-black tracking-tighter block mb-6">
              SKILLIES<span className="text-sk-red">.AI</span>
            </Link>
            <p className="sk-font-body text-xs text-white/40 leading-relaxed mb-6 max-w-xs">
              We build AI workers for high-growth verticals and teach the next generation of 
              AI-native students. Built with pride in Malappuram, Kerala.
            </p>
            <div className="space-y-2">
              {SOCIAL.map(([label, href]) => (
                <Link 
                  key={href} 
                  href={href} 
                  className="block sk-font-meta text-[10px] text-white/30 font-black uppercase tracking-widest hover:text-sk-red transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.kicker}>
              <p className="sk-font-meta text-[10px] text-sk-red font-black tracking-[0.2em] uppercase mb-6">
                {col.kicker}
              </p>
              <ul className="space-y-3">
                {col.items.map(([label, href]) => (
                  <li key={href + label}>
                    <Link 
                      href={href} 
                      className="sk-font-body text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Strip */}
        <div className="mt-24 md:mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="sk-font-meta text-[10px] text-white/20 font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Skillies.AI · Kerala, India
          </p>
          <p className="sk-font-display-italic text-white/30 text-sm">
            Earn while you sleep.
          </p>
        </div>
      </div>
    </footer>
  );
}
