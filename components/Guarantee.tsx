"use client";

import AnimatedSection from "./AnimatedSection";

export default function Guarantee() {
  return (
    <section className="py-24 md:py-32 px-6 bg-cream">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="p-8 md:p-12 rounded-3xl border-2 border-red/30 bg-white relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-red/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-green/5 rounded-full blur-3xl" />

            <div className="relative">
              <p className="text-red tracking-[0.3em] uppercase text-sm font-medium mb-4">
                Our Guarantee
              </p>

              <h2 className="text-2xl md:text-4xl font-bold text-charcoal mb-6 leading-tight">
                Show up. Ship the work.
                <br />
                <span className="text-red">If your royalties don’t hit ₹35,000, we refund you.</span>
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green/10 flex items-center justify-center text-green text-sm font-bold">
                    ✓
                  </span>
                  <p className="text-charcoal/80">
                    Finish the 50-day cohort — every assignment, every check-in
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green/10 flex items-center justify-center text-green text-sm font-bold">
                    ✓
                  </span>
                  <p className="text-charcoal/80">
                    Follow the exact Skillies.AI workflow we teach — no shortcuts, no skipped steps
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green/10 flex items-center justify-center text-green text-sm font-bold">
                    ✓
                  </span>
                  <p className="text-charcoal/80">
                    Keep publishing in the six months after — minimum 2 hrs a day, every day
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-red/10 flex items-center justify-center text-red text-sm font-bold">
                    →
                  </span>
                  <p className="text-charcoal font-semibold">
                    If after those six months your KDP royalties haven’t reached
                    ₹35,000 total (the cohort fee), we refund the program fee
                    minus whatever Amazon has already paid you.
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray italic">
                We’re the first cohort and we’re still growing. This offer
                stays on the table because I’ve done it solo — so has every
                student who put in the hours. Show up. Ship. We’ll stand behind it.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
