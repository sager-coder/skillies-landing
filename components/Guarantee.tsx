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
                Publish 60 books. Follow the process.
                <br />
                <span className="text-red">If it doesn&apos;t work, we refund you.</span>
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green/10 flex items-center justify-center text-green text-sm font-bold">
                    ✓
                  </span>
                  <p className="text-charcoal/80">
                    Complete all assignments and follow the exact Skillies.AI methodology
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green/10 flex items-center justify-center text-green text-sm font-bold">
                    ✓
                  </span>
                  <p className="text-charcoal/80">
                    Publish a minimum of 60 books on Amazon KDP in the format taught
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green/10 flex items-center justify-center text-green text-sm font-bold">
                    ✓
                  </span>
                  <p className="text-charcoal/80">
                    Put in minimum 5 hours daily for 6 months
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-red/10 flex items-center justify-center text-red text-sm font-bold">
                    →
                  </span>
                  <p className="text-charcoal font-semibold">
                    If after 6 months your KDP royalties haven&apos;t reached ₹45,000
                    or ₹20,000/month — we refund the program fee minus what you&apos;ve
                    already earned from Amazon.
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray italic">
                That&apos;s how confident we are in this process. No other program in India
                offers this.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
