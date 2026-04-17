"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Scene3D />
      </div>

      {/* Subtle gradient overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-cream/70 via-cream/30 to-cream" />
      <div className="absolute bottom-0 left-0 right-0 h-32 z-[1] bg-gradient-to-t from-cream to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 border border-green/20 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
          <span className="text-green-dark font-medium text-sm tracking-wide">
            AI Skills That Generate Real Income
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-charcoal mb-6 leading-[0.9]"
        >
          SKILLIES
          <span className="text-red">.AI</span>
        </motion.h1>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mb-4"
        >
          <p className="text-xl md:text-3xl text-charcoal/80 font-light tracking-tight">
            Human Brain{" "}
            <span className="inline-block w-8 h-[2px] bg-red/50 align-middle mx-2" />
            {" "}AI Skills{" "}
            <span className="inline-block w-8 h-[2px] bg-red/50 align-middle mx-2" />
            {" "}<span className="text-red font-semibold">Real Income</span>
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="text-base md:text-lg text-gray max-w-xl mx-auto mb-12 leading-relaxed"
        >
          We teach practical AI skills that turn into actual earnings.
          Not theory. Not hype. Proof-backed systems that pay.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="https://wa.me/918089941131?text=Hi%20Ehsan%2C%20I%27m%20interested%20in%20the%20Skillies.AI%20KDP%20Mastery%20Program.%20I%27d%20like%20to%20know%20more."
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-red text-white font-semibold rounded-full hover:bg-red-dark transition-all duration-300 hover:scale-[1.03] shadow-xl shadow-red/15"
          >
            Start Your Journey
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#program"
            className="inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur border border-charcoal/10 text-charcoal font-medium rounded-full hover:border-red/30 hover:text-red transition-all duration-300"
          >
            See the Program
          </a>
        </motion.div>

        {/* Social proof ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 flex items-center justify-center gap-8 text-sm text-gray"
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red" />
            63 books published
          </span>
          <span className="w-px h-4 bg-charcoal/10" />
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green" />
            ₹8L+ earned
          </span>
          <span className="w-px h-4 bg-charcoal/10 hidden sm:block" />
          <span className="items-center gap-2 hidden sm:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24E]" />
            AI-powered
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-9 rounded-full border-2 border-charcoal/20 flex items-start justify-center p-1.5"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-red rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
