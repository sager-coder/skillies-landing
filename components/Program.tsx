"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const included = [
  "50 days of guided Amazon KDP publishing mentorship",
  "Step-by-step niche research using AI tools",
  "Complete book creation workflow with AI",
  "Professional cover design training",
  "KDP account setup & backend optimization",
  "All course materials, templates & resources",
  "Access to the Skillies.AI community",
];

export default function Program() {
  return (
    <section id="program" className="py-28 md:py-36 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-20">
            <p className="text-red tracking-[0.3em] uppercase text-xs font-semibold mb-4">
              Flagship Program
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-charcoal mb-6 tracking-tight">
              KDP Mastery — 50-Day Intensive
            </h2>
            <p className="text-lg text-gray max-w-2xl mx-auto leading-relaxed">
              In 50 days, you learn to publish books on Amazon using AI and
              build a passive income stream that pays you every month.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* What's included - spans 3 */}
          <AnimatedSection className="lg:col-span-3">
            <div className="p-8 md:p-10 rounded-3xl bg-cream border border-cream-dark h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-charcoal tracking-tight">
                  What&apos;s Included
                </h3>
              </div>
              <ul className="space-y-4">
                {included.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="flex items-start gap-3 group"
                  >
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green group-hover:scale-150 transition-transform" />
                    <span className="text-charcoal/70 text-[15px] leading-relaxed group-hover:text-charcoal transition-colors">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          {/* Pricing - spans 2 */}
          <AnimatedSection delay={0.2} className="lg:col-span-2">
            <div className="space-y-5">
              {/* Founding batch */}
              <div className="p-7 rounded-3xl border border-red/15 bg-gradient-to-br from-red/[0.03] to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-2xl tracking-wider">
                  FOUNDING
                </div>
                <p className="text-[11px] text-red font-semibold uppercase tracking-[0.2em] mb-3">
                  Workshop Attendees Only
                </p>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-4xl font-bold text-charcoal tracking-tight">₹45,000</span>
                  <span className="text-gray-light line-through text-lg">₹75,000</span>
                </div>
                <p className="text-xs text-gray mb-3">
                  Full upfront • 50 days • All inclusions
                </p>
                <div className="w-full h-px bg-red/10 my-4" />
                <p className="text-[11px] text-red/60 leading-relaxed">
                  Exclusive to workshop attendees. Will not be repeated.
                </p>
              </div>

              {/* Standard */}
              <motion.div
                whileHover={{ y: -3 }}
                className="p-7 rounded-3xl border-2 border-charcoal/10 bg-white relative overflow-hidden hover:border-red/30 transition-colors duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red via-[#C9A24E] to-green" />
                <p className="text-[11px] text-green font-semibold uppercase tracking-[0.2em] mb-3 mt-2">
                  Standard Enrollment
                </p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-charcoal tracking-tight">₹75,000</span>
                </div>
                <p className="text-xs text-gray mb-6">
                  Full upfront • 50 days • Everything included
                </p>
                <a
                  href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20interested%20in%20the%20Skillies.AI%20KDP%20Mastery%20Program%20at%20%E2%82%B975%2C000.%20I%27d%20like%20to%20enroll."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block w-full text-center px-6 py-3.5 bg-charcoal text-white font-semibold rounded-full hover:bg-red transition-all duration-300 text-sm"
                >
                  Enroll Now
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </motion.div>

              {/* Online */}
              <div className="p-5 rounded-2xl border border-dashed border-charcoal/10 text-center">
                <p className="text-xs text-gray">
                  Online batches launching soon.{" "}
                  <a
                    href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20notify%20me%20when%20the%20online%20batch%20launches."
                    className="text-red font-medium hover:underline underline-offset-2"
                  >
                    Get notified →
                  </a>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
