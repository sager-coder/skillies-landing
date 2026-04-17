"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import AnimatedSection from "./AnimatedSection";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function Promise() {
  return (
    <section className="py-24 md:py-32 px-6 bg-charcoal text-white">
      <div className="max-w-5xl mx-auto text-center">
        <AnimatedSection>
          <p className="text-green-light tracking-[0.3em] uppercase text-sm font-medium mb-8">
            The Skillies.AI Promise
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
            We don&apos;t teach AI for fun.
            <br />
            <span className="text-red-light">We teach it for income.</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-16">
            Every program at Skillies.AI is built around one question:
            can you make real money with this skill? If the answer is no,
            we don&apos;t teach it.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatedSection delay={0.3}>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-4xl md:text-5xl font-bold text-red-light mb-2">
                <Counter target={800000} suffix="+" />
              </p>
              <p className="text-white/50 text-sm uppercase tracking-wider">
                Rupees earned from KDP
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-4xl md:text-5xl font-bold text-green-light mb-2">
                <Counter target={63} />
              </p>
              <p className="text-white/50 text-sm uppercase tracking-wider">
                Books published with AI
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.5}>
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                <Counter target={1} />
              </p>
              <p className="text-white/50 text-sm uppercase tracking-wider">
                Person. One Laptop. AI.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
