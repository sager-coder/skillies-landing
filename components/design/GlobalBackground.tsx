"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * GlobalBackground · Optimized persistent animated gradient system.
 * Uses hardware acceleration and spring smoothing to prevent flickering during scroll.
 */
export default function GlobalBackground() {
  const { scrollY } = useScroll();
  
  // Use springs to smooth out the scroll-based opacity transitions and prevent flickering
  const springConfig = { damping: 30, stiffness: 100, mass: 0.5 };
  
  const masterOpacity = useSpring(
    useTransform(scrollY, [0, 800, 1500], [1, 0.6, 0.3]),
    springConfig
  );

  return (
    <motion.div 
      className="fixed inset-0 pointer-events-none overflow-hidden -z-50" 
      style={{ 
        background: "var(--sk-cream)",
        opacity: masterOpacity,
        willChange: "opacity"
      }}
    >
      {/* Container for fluid motion blobs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Vibrant fluid red glow */}
        <motion.div 
          animate={{ 
            x: [0, 80, -40, 0],
            y: [0, -60, 100, 0],
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[5%] w-[100%] h-[100%] rounded-full bg-sk-red/8 blur-[140px]"
          style={{ willChange: "transform" }}
        />
        
        {/* Ochre glow */}
        <motion.div 
          animate={{ 
            x: [0, -100, 60, 0],
            y: [0, 50, -80, 0],
            scale: [1, 0.85, 1.15, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -left-[10%] w-[90%] h-[90%] rounded-full bg-sk-ochre/5 blur-[120px]"
          style={{ willChange: "transform" }}
        />
        
        {/* Pulsing center glow */}
        <motion.div 
          animate={{ 
            opacity: [0.03, 0.1, 0.03],
            scale: [0.8, 1.1, 0.8]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[30%] w-[50%] h-[50%] rounded-full bg-sk-red/5 blur-[100px]"
          style={{ willChange: "transform, opacity" }}
        />
      </div>
      
      {/* Persistent Grain Overlay */}
      <div className="absolute inset-0 sk-grain opacity-50" />
    </motion.div>
  );
}
