"use client";

import AnimatedSection from "./AnimatedSection";

export default function Footer() {
  return (
    <section className="py-24 md:py-32 px-6 bg-charcoal text-white">
      <div className="max-w-4xl mx-auto text-center">
        <AnimatedSection>
          <p className="text-green-light tracking-[0.3em] uppercase text-sm font-medium mb-6">
            Ready?
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Your first book could be
            <br />
            <span className="text-red-light">live on Amazon in 7 days.</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
            One message. That&apos;s all it takes to start.
            No commitment until you&apos;re ready.
          </p>
          <a
            href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20interested%20in%20the%20Skillies.AI%20KDP%20Mastery%20Program.%20I%27d%20like%20to%20know%20more."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-5 bg-red text-white font-semibold rounded-full hover:bg-red-light transition-all duration-300 hover:scale-105 shadow-lg shadow-red/30 text-lg"
          >
            Message Ehsan on WhatsApp →
          </a>
        </AnimatedSection>

        {/* Footer bar */}
        <div className="mt-24 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xl font-bold tracking-wider">
              SKILLIES<span className="text-red-light">.AI</span>
            </p>
            <p className="text-sm text-white/30">
              Malappuram, Kerala, India
            </p>
            <p className="text-sm text-white/30">
              © {new Date().getFullYear()} Skillies.AI — All rights reserved
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
