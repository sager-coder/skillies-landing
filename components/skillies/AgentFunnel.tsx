"use client";

/**
 * AgentFunnel — high-fidelity editorial visualization.
 * Minimal AI Bulb Core + Distributed Market + Sales Grid
 * CONCURRENT Data Flow: Multiple leads traveling simultaneously.
 */

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useEffect, useCallback } from "react";

const VB_W = 1000;
const VB_H = 480;

// Composition
const MARKET_CX = 240;
const MARKET_CY = 210;
const AGENT_CX = 560;
const AGENT_CY = 210;
const CLOSER_CX = 860;
const CLOSER_CY = 210;

const CLOSERS = [
  { id: 0, x: -50, y: -60 },
  { id: 1, x: 50, y: -60 },
  { id: 2, x: -50, y: 60 },
  { id: 3, x: 50, y: 60 },
];

const PLATFORMS = [
  { id: "google", ring: 2, angle: -1.8, icon: "google" },
  { id: "meta", ring: 3, angle: -0.6, icon: "meta" },
  { id: "instagram", ring: 2, angle: 0.6, icon: "instagram" },
  { id: "whatsapp", ring: 2, angle: 1.8, icon: "whatsapp" },
  { id: "web", ring: 2, angle: 3.14, icon: "web" },
];

interface MarketDot {
  id: string;
  x: number;
  y: number;
  radius: number;
  opacity: number;
  isOchre: boolean;
}

interface ConstellationLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  op: number;
}

type Traveler = {
  id: string;
  pIdx: number;
  cIdx: number;
  stage: "market-to-agent" | "processing" | "agent-to-team";
};

function buildMarket() {
  const dots: MarketDot[] = [];
  const rings = [
    { r: 40, n: 8 },
    { r: 85, n: 16 },
    { r: 130, n: 24 },
    { r: 175, n: 32 },
    { r: 215, n: 40 },
  ];
  rings.forEach((ring, ri) => {
    for (let i = 0; i < ring.n; i++) {
      const angle = (i / ring.n) * Math.PI * 2;
      dots.push({
        id: `d-${ri}-${i}`,
        x: MARKET_CX + Math.cos(angle + (Math.random()-0.5)*0.1) * (ring.r + (Math.random()-0.5)*15),
        y: MARKET_CY + Math.sin(angle + (Math.random()-0.5)*0.1) * (ring.r + (Math.random()-0.5)*15),
        radius: 1.5 + Math.random() * 2,
        opacity: 0.4 + Math.random() * 0.5,
        isOchre: Math.random() > 0.8,
      });
    }
  });
  return { dots, rings };
}

function buildConstellations(dots: MarketDot[]) {
  const lines: ConstellationLine[] = [];
  for (let i = 0; i < dots.length; i++) {
    const a = dots[i];
    let count = 0;
    for (let j = i + 1; j < dots.length && count < 2; j++) {
      const b = dots[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 40 && dist > 10) {
        lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, op: 0.45 * (1 - dist / 40) });
        count++;
      }
    }
  }
  return lines;
}

export default function AgentFunnel() {
  const reduced = useReducedMotion();
  const { dots, rings } = useMemo(() => buildMarket(), []);
  const constellations = useMemo(() => buildConstellations(dots), [dots]);

  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [jolts, setJolts] = useState<Record<number, boolean>>({});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  const platformPos = useMemo(() => {
    return PLATFORMS.map(p => {
      const r = rings[p.ring].r;
      return {
        x: MARKET_CX + Math.cos(p.angle) * r,
        y: MARKET_CY + Math.sin(p.angle) * r
      };
    });
  }, [rings]);

  // Traveler Lifecycle Management
  const spawnTraveler = useCallback(() => {
    const pIdx = Math.floor(Math.random() * PLATFORMS.length);
    const cIdx = Math.floor(Math.random() * CLOSERS.length);
    const id = Math.random().toString(36).substr(2, 9);

    const newT: Traveler = { id, pIdx, cIdx, stage: "market-to-agent" };
    setTravelers(prev => [...prev, newT]);

    // Stage Transitions
    setTimeout(() => {
      setTravelers(prev => prev.map(t => t.id === id ? { ...t, stage: "processing" } : t));
      setTimeout(() => {
        setTravelers(prev => prev.map(t => t.id === id ? { ...t, stage: "agent-to-team" } : t));
        
        // Handoff Success
        setTimeout(() => {
          setJolts(prev => ({ ...prev, [cIdx]: true }));
          setTravelers(prev => prev.filter(t => t.id !== id));
          setTimeout(() => {
            setJolts(prev => ({ ...prev, [cIdx]: false }));
          }, 600);
        }, 800);
      }, 800);
    }, 800);
  }, [platformPos.length]);

  useEffect(() => {
    if (reduced) return;
    const intervalTime = isMobile ? 3500 : 1800; // Slower spawn rate on mobile
    const interval = setInterval(spawnTraveler, intervalTime);
    return () => clearInterval(interval);
  }, [spawnTraveler, reduced, isMobile]);

  // Path Builders (Cubic Bézier for more organic "S" curves)
  const getMarketPath = (pIdx: number) => {
    const pos = platformPos[pIdx];
    const dx = AGENT_CX - pos.x;
    // Control points to create a smooth sweeping entrance
    const cp1x = pos.x + dx * 0.5;
    const cp1y = pos.y;
    const cp2x = AGENT_CX - dx * 0.2;
    const cp2y = AGENT_CY;
    return `M ${pos.x} ${pos.y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${AGENT_CX} ${AGENT_CY}`;
  };

  const getTeamPath = (cIdx: number) => {
    const targetX = CLOSER_CX + CLOSERS[cIdx].x;
    const targetY = CLOSER_CY + CLOSERS[cIdx].y;
    const dx = targetX - AGENT_CX;
    // Control points for a smooth exit to the sales team
    const cp1x = AGENT_CX + dx * 0.2;
    const cp1y = AGENT_CY;
    const cp2x = targetX - dx * 0.5;
    const cp2y = targetY;
    return `M ${AGENT_CX} ${AGENT_CY} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${targetX} ${targetY}`;
  };

  const isProcessing = travelers.some(t => t.stage === "processing");

  return (
    <div 
      className="relative w-full aspect-[1.5/1] md:aspect-[1.8/1] lg:aspect-[2.2/1] overflow-visible group/funnel"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
    >
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 w-full h-full pointer-events-none origin-center scale-[0.85] md:scale-100">
        <defs>
          <linearGradient id="marketPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--sk-ochre)" stopOpacity="0.3" />
            <stop offset="60%" stopColor="var(--sk-red)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--sk-red)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="teamPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--sk-red)" stopOpacity="1" />
            <stop offset="40%" stopColor="var(--sk-red)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--sk-ink)" stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id="travelerGradient">
            <stop offset="20%" stopColor="white" />
            <stop offset="100%" stopColor="var(--sk-red)" />
          </radialGradient>
        </defs>

        {/* ── Market Radial Field ── */}
        <motion.g 
          animate={{ x: mousePos.x * 20, y: mousePos.y * 20 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          {/* Structural Rings */}
          {rings.map((r, i) => (
            <circle key={i} cx={MARKET_CX} cy={MARKET_CY} r={r.r} fill="none" stroke="var(--sk-red)" strokeWidth="0.5" strokeOpacity="0.05" strokeDasharray="4 4" />
          ))}
          
          <g opacity="0.8">
            {constellations.map((l, i) => (
              <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--sk-red)" strokeWidth="0.8" strokeOpacity={l.op * 0.4} />
            ))}
            {dots.map(d => (
              <circle key={d.id} cx={d.x} cy={d.y} r={d.radius} fill={d.isOchre ? "var(--sk-ochre)" : "var(--sk-red)"} opacity={d.opacity * 0.8} />
            ))}
          </g>
        </motion.g>

        {/* ── Connecting Flow Lines ── */}
        <g>
          {platformPos.map((pos, i) => {
            const path = getMarketPath(i);
            return (
              <g key={`m-p-group-${i}`}>
                {/* Pulsing Underglow */}
                <motion.path
                  d={path} stroke="url(#marketPathGradient)" strokeWidth="6" fill="none"
                  animate={isMobile ? { opacity: 0.1 } : { opacity: [0.08, 0.18, 0.08] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                />
                {/* Animated Energy Core */}
                <motion.path
                  d={path} stroke="url(#marketPathGradient)" strokeWidth="1.5" fill="none"
                  strokeDasharray="12 16"
                  animate={{ strokeDashoffset: [-60, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  opacity="0.8"
                />
              </g>
            );
          })}
          {CLOSERS.map((c, i) => {
            const path = getTeamPath(i);
            return (
              <g key={`c-p-group-${i}`}>
                {/* Pulsing Underglow */}
                <motion.path
                  d={path} stroke="url(#teamPathGradient)" strokeWidth="6" fill="none"
                  animate={isMobile ? { opacity: 0.1 } : { opacity: [0.08, 0.18, 0.08] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                />
                {/* Animated Energy Core */}
                <motion.path
                  d={path} stroke="url(#teamPathGradient)" strokeWidth="1.5" fill="none"
                  strokeDasharray="12 16"
                  animate={{ strokeDashoffset: [-60, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  opacity="0.8"
                />
              </g>
            );
          })}
        </g>

        {/* ── Concurrent Travelers ── */}
        <AnimatePresence>
          {travelers.map(t => (
            <g key={t.id}>
              {t.stage === "market-to-agent" && (
                <g>
                  {/* Trail Particles */}
                  {[0.1, 0.2, 0.3].map((delay, idx) => (
                    <motion.circle
                      key={`trail-${idx}`}
                      r={3 - idx} fill="var(--sk-red)" fillOpacity={0.2 / (idx + 1)}
                      initial={{ offsetDistance: "0%" }}
                      animate={{ offsetDistance: "100%" }}
                      transition={{ duration: 0.8, ease: "easeInOut", delay: delay * -1 }}
                      style={{ offsetPath: `path("${getMarketPath(t.pIdx)}")` }}
                    />
                  ))}
                  <motion.circle
                    r={6} fill="var(--sk-red)" fillOpacity="0.3"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ offsetPath: `path("${getMarketPath(t.pIdx)}")` }}
                  />
                  <motion.circle
                    r={3} fill="url(#travelerGradient)"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ offsetPath: `path("${getMarketPath(t.pIdx)}")` }}
                  />
                </g>
              )}
              {t.stage === "agent-to-team" && (
                <g>
                   {/* Trail Particles */}
                   {[0.1, 0.2, 0.3].map((delay, idx) => (
                    <motion.circle
                      key={`trail-${idx}`}
                      r={3 - idx} fill="var(--sk-red)" fillOpacity={0.2 / (idx + 1)}
                      initial={{ offsetDistance: "0%" }}
                      animate={{ offsetDistance: "100%" }}
                      transition={{ duration: 0.8, ease: "easeInOut", delay: delay * -1 }}
                      style={{ offsetPath: `path("${getTeamPath(t.cIdx)}")` }}
                    />
                  ))}
                  <motion.circle
                    r={6} fill="var(--sk-red)" fillOpacity="0.3"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ offsetPath: `path("${getTeamPath(t.cIdx)}")` }}
                  />
                  <motion.circle
                    r={3} fill="url(#travelerGradient)"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ offsetPath: `path("${getTeamPath(t.cIdx)}")` }}
                  />
                </g>
              )}
            </g>
          ))}
        </AnimatePresence>

        {/* ── Agent Halos ── */}
        <g transform={`translate(${AGENT_CX}, ${AGENT_CY})`}>
          <circle r="70" fill="white" fillOpacity="0.05" stroke="var(--sk-red)" strokeOpacity="0.05" strokeWidth="1" />
          {[1, 2, 3].map(i => (
            <motion.circle
              key={i} r={70 + (i * 25)}
              fill="none" stroke={i === 1 ? "var(--sk-red)" : "var(--sk-ochre)"} strokeWidth="1.2" strokeOpacity={0.1 / i}
              animate={isMobile ? {} : { scale: [1, 1.05, 1], opacity: [0.03, 0.1, 0.03] }}
              transition={{ duration: 5, repeat: Infinity, delay: i * 0.7 }}
            />
          ))}
        </g>
      </svg>

      {/* ── Platform Icons ── */}
      {PLATFORMS.map((p, i) => (
        <div key={p.id} className="absolute" style={{ top: `${(platformPos[i].y / VB_H) * 100}%`, left: `${(platformPos[i].x / VB_W) * 100}%`, transform: "translate(-50%, -50%)" }}>
          <motion.div 
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-2xl flex items-center justify-center border border-sk-ink/5 p-1.5 md:p-2"
            animate={travelers.some(t => t.pIdx === i && t.stage === "market-to-agent") ? { scale: [1, 1.3, 1], borderColor: ["#eee", "var(--sk-red)", "#eee"] } : {}}
          >
            <PlatformIcon type={p.icon as any} />
          </motion.div>
        </div>
      ))}

      {/* ── Minimal AI Bulb Core ── */}
      <div className="absolute" style={{ top: "43.5%", left: "56%", transform: "translate(-50%, -50%)" }}>
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center scale-90 md:scale-100">
          <motion.div 
            className="absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(217,52,43,0.15) 0%, transparent 70%)" }}
            animate={isProcessing ? { scale: [1.2, 1.4, 1.2], opacity: [0.5, 1, 0.5] } : { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 0.8 }}
          />
          
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-white shadow-[0_0_50px_rgba(198,40,40,0.15)] border border-sk-red/10 overflow-hidden">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-sk-red fill-none stroke-current stroke-[1.5] overflow-visible">
               {/* Robot Head */}
               <rect x="5" y="6" width="14" height="12" rx="3" />
               <path d="M9 22v-4M15 22v-4" />
               <path d="M2 13h3M19 13h3" />
               <path d="M12 6V2" />
               
               {/* Animated Eyes / Processing Bar */}
               <motion.g
                 animate={isProcessing ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.6 }}
                 transition={{ duration: 0.8, repeat: Infinity }}
               >
                 <path d="M8 11h2M14 11h2" strokeWidth="2.5" strokeLinecap="round" />
               </motion.g>

            </svg>
            <div className="absolute inset-0 border-2 border-dashed border-sk-red/5 rounded-full scale-[0.88]" />
          </div>

          <div className="absolute -top-16 left-1/2 -translate-x-1/2 rounded-full px-5 py-1.5 bg-sk-red text-white text-[10px] font-black tracking-[0.3em] uppercase shadow-xl whitespace-nowrap border-2 border-white">
            Skillies AI
          </div>
        </div>
      </div>

      {/* ── Sales Team ── */}
      <div className="absolute" style={{ top: "43.5%", left: "86%", transform: "translate(-50%, -50%)" }}>
        <div className="grid grid-cols-2 gap-4 md:gap-10 scale-[0.7] md:scale-100 origin-center">
          {CLOSERS.map((c, i) => (
            <div key={i} className="relative">
              <motion.div 
                className="w-16 h-16 rounded-full bg-sk-red border-2 border-white shadow-xl flex items-center justify-center overflow-hidden"
                animate={jolts[i] ? { scale: [1, 1.15, 1], boxShadow: "0 0 25px rgba(217,52,43,0.5)" } : {}}
              >
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current opacity-90">
                  <circle cx="12" cy="9" r="3.6" />
                  <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7v1H4v-1z" />
                </svg>
              </motion.div>
              <AnimatePresence>
                {jolts[i] && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: -25 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-2xl border border-sk-ink/5 flex items-center gap-2"
                  >
                    <span className="text-[10px] font-bold text-sk-red whitespace-nowrap">Sale Closed</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section Labels ── */}
      <div className="absolute bottom-[-8%] left-[24%] -translate-x-1/2 whitespace-nowrap">
        <p className="sk-font-meta text-[10px] text-sk-ink20 font-black tracking-[0.3em] uppercase">Your Market</p>
      </div>

      <div className="absolute bottom-[-8%] left-[56%] -translate-x-1/2 whitespace-nowrap">
        <p className="sk-font-meta text-[10px] text-sk-red/40 font-black tracking-[0.3em] uppercase">Skillies AI Agent</p>
      </div>

      <div className="absolute bottom-[-8%] left-[86%] -translate-x-1/2 whitespace-nowrap">
        <p className="sk-font-meta text-[10px] text-sk-ink20 font-black tracking-[0.3em] uppercase">Your Closers</p>
      </div>
    </div>
  );
}

function PlatformIcon({ type }: { type: "google" | "meta" | "instagram" | "whatsapp" | "web" }) {
  switch (type) {
    case "google":
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      );
    case "meta":
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="#0668E1">
          <path d="M17.153 6.002c-1.574 0-2.906.852-3.87 2.128-.865 1.144-1.442 2.532-1.442 2.532s-.577-1.388-1.443-2.532c-.963-1.276-2.295-2.128-3.87-2.128C4.01 6.002 2 8.356 2 11.233c0 2.876 2.01 5.23 4.528 5.23 1.575 0 2.907-.852 3.87-2.127.866-1.145 1.443-2.533 1.443-2.533s.577 1.388 1.442 2.533c.964 1.275 2.296 2.127 3.87 2.127 2.518 0 4.528-2.354 4.528-5.23 0-2.877-2.01-5.231-4.528-5.231zm-10.625 9.21c-1.734 0-3.14-1.854-3.14-4.131 0-2.277 1.406-4.13 3.14-4.13 1.01 0 1.905.626 2.51 1.503.738 1.07 1.246 2.627 1.246 2.627s-.508 1.558-1.246 2.628c-.605.877-1.5 1.503-2.51 1.503zm10.625 0c-1.01 0-1.905-.626-2.51-1.503-.738-1.07-1.246-2.627-1.246-2.627s.508-1.558 1.246-2.628c.605-.877 1.5-1.503 2.51-1.503 1.734 0 3.14 1.854 3.14 4.131.001 2.276-1.405 4.13-3.14 4.13z"/>
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#E4405F]">
          <path d="M12 2c2.717 0 3.056.01 4.122.058 1.066.048 1.79.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.637.417 1.361.465 2.427.048 1.066.058 1.405.058 4.123s-.01 3.057-.058 4.123c-.048 1.066-.218 1.79-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.637.247-1.361.417-2.427.465-1.066.048-1.405.058-4.123.058s-3.057-.01-4.123-.058c-1.066-.048-1.79-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.637-.417-1.361-.465-2.427-.048-1.066-.058-1.405-.058-4.123s.01-3.057.058-4.123c.048-1.066.218-1.79.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.523c.637-.247 1.361-.417 2.427-.465C8.943 2.01 9.283 2 12 2zm0 1.8c-2.67 0-2.987.01-4.042.059-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.371-.058 4.042s.01 2.987.058 4.042c.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.042.058s2.987-.01 4.042-.058c.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.371.058-4.042s-.01-2.987-.058-4.042c-.045-.975-.207-1.504-.344-1.857-.182-.467-.398-.8-.748-1.15-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344C14.987 3.81 14.67 3.8 12 3.8zm0 4.037a4.163 4.163 0 100 8.326 4.163 4.163 0 000-8.326zM12 14.3a2.363 2.363 0 110-4.726 2.363 2.363 0 010 4.726zm4.327-7.601a.972.972 0 100 1.944.972.972 0 000-1.944z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-[#25D366]">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      );
    case "web":
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-sk-ink opacity-70">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
  }
}
