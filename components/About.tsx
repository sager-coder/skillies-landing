"use client";

import AnimatedSection from "./AnimatedSection";

export default function About() {
  return (
    <section className="py-24 md:py-32 px-6 bg-charcoal text-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Photo placeholder */}
          <AnimatedSection>
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-red/20 to-green/10 border border-white/10 flex items-center justify-center overflow-hidden">
                {/* Replace this div with an actual image later */}
                <div className="text-center">
                  <p className="text-6xl mb-4">📚</p>
                  <p className="text-white/30 text-sm">Photo coming soon</p>
                </div>
              </div>
              {/* Accent elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-red/30 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-green/10 rounded-2xl -z-10" />
            </div>
          </AnimatedSection>

          {/* Bio */}
          <AnimatedSection delay={0.2}>
            <div>
              <p className="text-green-light tracking-[0.3em] uppercase text-sm font-medium mb-4">
                Your Mentor
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ehsan Asgar P
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  I published my first book on Amazon KDP using AI. Then another.
                  Then another. 63 books later, I had earned over ₹8,00,000 in
                  royalties — from one laptop, in one room, using AI tools that
                  most people don&apos;t even know exist.
                </p>
                <p>
                  But publishing books was never the end goal.
                  The goal was to prove that <span className="text-white font-semibold">ordinary people can use AI
                  to build real income streams</span> — not by becoming developers
                  or data scientists, but by learning practical AI skills that
                  the market will pay for.
                </p>
                <p>
                  Skillies.AI is that proof turned into a platform.
                  I&apos;m now teaching the founding batch — personally mentoring
                  each student to replicate what I built, and go beyond it.
                </p>
              </div>

              <div className="mt-8 flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-light">63</p>
                  <p className="text-xs text-white/40 uppercase tracking-wider">
                    Books
                  </p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-light">₹8L+</p>
                  <p className="text-xs text-white/40 uppercase tracking-wider">
                    Royalties
                  </p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">AI</p>
                  <p className="text-xs text-white/40 uppercase tracking-wider">
                    Powered
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
