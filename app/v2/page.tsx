"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  bg:         "#05050a",
  surface:    "#0d0d18",
  surfaceHi:  "#12121f",
  accent:     "#7c3aed",
  accentSoft: "#a78bfa",
  gold:       "#c9a060",
  text:       "#f4f4f8",
  muted:      "rgba(244,244,248,0.5)",
  faint:      "rgba(244,244,248,0.18)",
  border:     "rgba(255,255,255,0.07)",
  borderHi:   "rgba(255,255,255,0.14)",
} as const;

const E = {
  expo:      [0.16, 1, 0.3, 1],
  cinematic: [0.22, 1, 0.36, 1],
  smooth:    [0.76, 0, 0.24, 1],
} as const;

// ─── World showcase data ──────────────────────────────────────────────────────

type WorldCard = {
  id:      string;
  label:   string;
  name:    string;
  tagline: string;
  accent:  string;
  image:   string;
  bg:      string;
  fg:      string;
  mesh:    string;
};

const WORLDS: WorldCard[] = [
  {
    id: "science",
    label: "Science",
    name: "OrbitalTech",
    tagline: "Aerospace intelligence platform",
    accent: "#06b6d4",
    image: "1462331940025-496dfbfc7564",
    bg: "#030b18",
    fg: "#e8f4f8",
    mesh: "rgba(6,182,212,0.12)",
  },
  {
    id: "fashion",
    label: "Fashion",
    name: "Maison Lumière",
    tagline: "Where editorial meets runway",
    accent: "#be185d",
    image: "1490481651871-ab68de25d43d",
    bg: "#fafafa",
    fg: "#0f0d0c",
    mesh: "rgba(190,24,93,0.08)",
  },
  {
    id: "fitness",
    label: "Fitness",
    name: "AthleteOS",
    tagline: "Performance amplified",
    accent: "#ef4444",
    image: "1571019613454-1cb2f99b2d8b",
    bg: "#0a0a0a",
    fg: "#fafafa",
    mesh: "rgba(239,68,68,0.1)",
  },
  {
    id: "music",
    label: "Music",
    name: "Soundscape",
    tagline: "Live music intelligence",
    accent: "#7c3aed",
    image: "1493225457124-a3eb161ffa5f",
    bg: "#06040f",
    fg: "#f0eeff",
    mesh: "rgba(124,58,237,0.14)",
  },
  {
    id: "floral",
    label: "Botanical",
    name: "PetalPost",
    tagline: "Luxury florals, delivered",
    accent: "#6b9080",
    image: "1490759847868-88d4476a2101",
    bg: "#faf9f7",
    fg: "#1c1917",
    mesh: "rgba(107,144,128,0.1)",
  },
  {
    id: "finance",
    label: "Fintech",
    name: "WealthSync",
    tagline: "Intelligent wealth platform",
    accent: "#2563eb",
    image: "1551288049-bebda4e38f71",
    bg: "#080e1a",
    fg: "#e8eef8",
    mesh: "rgba(37,99,235,0.12)",
  },
];

function img(id: string, w: number, h: number) {
  return `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${w}&h=${h}&q=85`;
}

// ─── Theme ────────────────────────────────────────────────────────────────────

type Theme = "dark" | "light";

const DARK = C;
const LIGHT = {
  bg:         "#f5f9fd",
  surface:    "#eaf3fa",
  surfaceHi:  "#d8eaf5",
  accent:     "#0ea5e9",
  accentSoft: "#38bdf8",
  gold:       "#0284c7",
  text:       "#0c1a2e",
  muted:      "rgba(12,26,46,0.62)",
  faint:      "rgba(12,26,46,0.30)",
  border:     "rgba(14,165,233,0.16)",
  borderHi:   "rgba(14,165,233,0.28)",
} as const;

const ThemeCtx = React.createContext<{ theme: Theme; toggle: () => void }>({ theme: "dark", toggle: () => {} });
const useTheme  = () => React.useContext(ThemeCtx);
const useTokens = () => { const { theme } = useTheme(); return theme === "dark" ? DARK : LIGHT; };

// ─── Atmospheric orbs ─────────────────────────────────────────────────────────

function Orb({ color, size, x, y, dur, delay = 0 }: {
  color: string; size: number; x: string; y: string; dur: number; delay?: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x, top: y, width: size, height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
        transform: "translate(-50%, -50%)",
        willChange: "transform, opacity",
      }}
      animate={{
        opacity: [0.35, 0.65, 0.42, 0.60, 0.35],
        scale:   [0.92, 1.10, 0.96, 1.06, 0.92],
        x:       [-24, 32, -10, 22, -24],
        y:       [-18, 12, -28, 8, -18],
      }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── Noise overlay ────────────────────────────────────────────────────────────

function Noise() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: 0.028,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        zIndex: 10,
      }}
    />
  );
}

// ─── Jellyfish entity ─────────────────────────────────────────────────────────

function Jellyfish({
  x, y, size, delay = 0, accentColor = C.accentSoft,
}: {
  x: string; y: string; size: number; delay?: number; accentColor?: string;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, width: size, height: size * 1.6 }}
      animate={{ y: [0, -30, 0], rotateZ: [-3, 3, -3], scale: [0.96, 1.04, 0.96] }}
      transition={{ duration: 9 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {/* Outer environmental glow — the creature as a light source */}
      <div
        style={{
          position: "absolute",
          top: "-30%",
          left: "-30%",
          width: "160%",
          height: "160%",
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 40%, ${accentColor}22 0%, ${accentColor}0a 45%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      {/* Bell */}
      <motion.div
        style={{
          width: "100%",
          height: "52%",
          borderRadius: "50% 50% 38% 38%",
          background: `radial-gradient(ellipse at 42% 32%, ${accentColor}cc 0%, ${accentColor}60 45%, ${accentColor}18 68%, transparent 80%)`,
          border: `1px solid ${accentColor}60`,
          boxShadow: `0 0 ${size * 0.7}px ${accentColor}55, 0 0 ${size * 0.35}px ${accentColor}30, inset 0 0 ${size * 0.4}px ${accentColor}28`,
        }}
        animate={{ scaleX: [1, 0.94, 1], scaleY: [1, 1.07, 1] }}
        transition={{ duration: 3.2 + delay * 0.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Inner luminescence — bright core */}
      <motion.div
        style={{
          position: "absolute",
          top: "6%",
          left: "18%",
          width: "64%",
          height: "34%",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at 48% 38%, ${accentColor}ee 0%, ${accentColor}88 30%, ${accentColor}22 65%, transparent 80%)`,
        }}
        animate={{ opacity: [0.7, 1, 0.7], scale: [0.88, 1.14, 0.88] }}
        transition={{ duration: 2.6 + delay * 0.3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Tendril base glow */}
      <div
        style={{
          position: "absolute",
          top: "46%",
          left: "10%",
          width: "80%",
          height: "20%",
          background: `radial-gradient(ellipse, ${accentColor}38 0%, transparent 70%)`,
        }}
      />
      {/* Tendrils */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: 1.5 + (i % 2) * 0.5,
            height: size * (0.42 + (i % 4) * 0.12),
            background: `linear-gradient(to bottom, ${accentColor}88, ${accentColor}38, ${accentColor}10, transparent)`,
            left: `${8 + i * 11}%`,
            top: "49%",
            transformOrigin: "top center",
            borderRadius: 2,
          }}
          animate={{
            rotateZ: [-12 + i * 2.5, 12 - i * 2.5, -12 + i * 2.5],
            scaleY: [0.85, 1.15, 0.85],
          }}
          transition={{
            duration: 2.4 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.16 + delay,
          }}
        />
      ))}
    </motion.div>
  );
}

// ─── Light rays (light mode atmospheric depth) ────────────────────────────────

function LightRays() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: `${1.2 + (i % 3) * 0.6}px`,
            height: "170%",
            background: `linear-gradient(to bottom, rgba(147,210,255,${0.32 + (i % 4) * 0.08}), rgba(186,230,253,0.10), transparent)`,
            top: "-35%",
            left: `${25 + i * 11}%`,
            transform: `rotate(${5 + i * 3.5}deg)`,
            transformOrigin: "top center",
          }}
          animate={{ opacity: [0.25, 0.55 + (i % 3) * 0.08, 0.25] }}
          transition={{ duration: 4 + i * 1.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.55 }}
        />
      ))}
      {/* Ambient cloud-like glow pools */}
      <motion.div
        className="absolute"
        style={{
          width: "60%",
          height: "40%",
          top: "5%",
          left: "35%",
          background: "radial-gradient(ellipse, rgba(147,210,255,0.38) 0%, rgba(56,189,248,0.12) 55%, transparent 75%)",
          borderRadius: "50%",
        }}
        animate={{ opacity: [0.5, 0.85, 0.5], scale: [0.9, 1.08, 0.9] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute"
        style={{
          width: "45%",
          height: "35%",
          top: "30%",
          right: "5%",
          background: "radial-gradient(ellipse, rgba(56,189,248,0.28) 0%, rgba(14,165,233,0.08) 60%, transparent 78%)",
          borderRadius: "50%",
        }}
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.12, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

// ─── Star field ───────────────────────────────────────────────────────────────

function StarField({ count = 90 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {Array.from({ length: count }).map((_, i) => {
        const left = `${(i * 41 + 7) % 100}%`;
        const top  = `${(i * 29 + 13) % 100}%`;
        const sz   = 0.8 + (i % 4) * 0.35;
        const op   = 0.12 + (i % 6) * 0.07;
        const dur  = 3 + (i % 5) * 1.4;
        const del  = (i * 0.11) % 4;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left, top, width: sz, height: sz, opacity: op }}
            animate={{ opacity: [op * 0.35, op, op * 0.55, op] }}
            transition={{ duration: dur, delay: del, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}
    </div>
  );
}

// ─── Floating particles ───────────────────────────────────────────────────────

function Particles({ count = 28 }: { count?: number }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 4 }}>
      {Array.from({ length: count }).map((_, i) => {
        const left  = `${(i * 37 + 11) % 100}%`;
        const top   = `${(i * 23 + 17) % 100}%`;
        const size  = 1 + (i % 3) * 0.5;
        const dur   = 10 + (i % 8) * 2.5;
        const del   = (i * 0.6) % 6;
        const color = isDark
          ? (i % 5 === 0 ? C.accentSoft
           : i % 5 === 1 ? C.gold
           : i % 5 === 2 ? "rgba(6,182,212,0.7)"
           : "rgba(255,255,255,0.4)")
          : (i % 5 === 0 ? "rgba(56,189,248,0.45)"
           : i % 5 === 1 ? "rgba(147,210,255,0.40)"
           : i % 5 === 2 ? "rgba(120,195,255,0.35)"
           : "rgba(186,230,253,0.30)");
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ left, top, width: size, height: size, background: color }}
            animate={{ y: [0, -110], opacity: [0, 0.75, 0.75, 0] }}
            transition={{ duration: dur, delay: del, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
    </div>
  );
}

// ─── Nebula field — deep cosmic atmospheric volumes ───────────────────────────

function NebulaField({ isDark }: { isDark: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {isDark ? (
        <>
          <motion.div
            className="absolute"
            style={{
              width: "95%", height: "88%",
              top: "-18%", right: "-8%",
              background: `
                radial-gradient(ellipse 60% 52% at 52% 36%,
                  rgba(124,58,237,0.58) 0%,
                  rgba(76,29,149,0.36) 22%,
                  rgba(6,182,212,0.16) 52%,
                  transparent 72%),
                radial-gradient(ellipse 48% 58% at 82% 58%,
                  rgba(6,182,212,0.30) 0%,
                  rgba(8,145,178,0.16) 38%,
                  transparent 65%)
              `,
              borderRadius: "42%",
            }}
            animate={{ scale: [1, 1.04, 1], opacity: [0.82, 1, 0.82] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute"
            style={{
              width: "62%", height: "72%",
              top: "8%", right: "4%",
              background: `radial-gradient(ellipse at 50% 38%,
                rgba(139,92,246,0.38) 0%,
                rgba(99,102,241,0.20) 32%,
                transparent 62%)`,
              borderRadius: "50%",
              filter: "blur(28px)",
            }}
            animate={{ opacity: [0.55, 0.88, 0.55], scale: [0.93, 1.07, 0.93] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          />
          <motion.div
            className="absolute"
            style={{
              width: "52%", height: "48%",
              top: "22%", right: "18%",
              background: `radial-gradient(ellipse at 58% 42%,
                rgba(6,182,212,0.26) 0%,
                rgba(14,165,233,0.13) 43%,
                transparent 63%)`,
              borderRadius: "50%",
              filter: "blur(20px)",
            }}
            animate={{ opacity: [0.45, 0.75, 0.45] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 8 }}
          />
        </>
      ) : (
        <>
          <motion.div
            className="absolute"
            style={{
              width: "100%", height: "85%",
              top: "-20%", left: "0",
              background: `
                radial-gradient(ellipse 78% 68% at 62% 32%,
                  rgba(186,230,253,0.72) 0%,
                  rgba(147,210,255,0.42) 28%,
                  rgba(224,242,254,0.18) 58%,
                  transparent 78%),
                radial-gradient(ellipse 58% 52% at 88% 52%,
                  rgba(224,242,254,0.62) 0%,
                  rgba(186,230,253,0.28) 42%,
                  transparent 66%)
              `,
              borderRadius: "40%",
            }}
            animate={{ scale: [1, 1.03, 1], opacity: [0.88, 1, 0.88] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute"
            style={{
              width: "58%", height: "64%",
              top: "4%", right: "0%",
              background: `radial-gradient(ellipse at 50% 28%,
                rgba(147,210,255,0.52) 0%,
                rgba(186,230,253,0.26) 38%,
                transparent 62%)`,
              filter: "blur(22px)",
            }}
            animate={{ opacity: [0.62, 0.92, 0.62] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />
        </>
      )}
    </div>
  );
}

// ─── Celestial glow — environmental halo at jellyfish position ────────────────

function CelestialGlow({ isDark }: { isDark: boolean }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 2 }}
      aria-hidden
    >
      {/* Vast outer atmospheric halo — jellyfish as light source */}
      <motion.div
        className="absolute"
        style={{
          width: 1400, height: 1400,
          left: "62%", top: "10%",
          transform: "translate(-50%, -50%)",
          background: isDark
            ? `radial-gradient(circle at center,
                rgba(124,58,237,0.30) 0%,
                rgba(139,92,246,0.18) 18%,
                rgba(6,182,212,0.10) 38%,
                transparent 60%)`
            : `radial-gradient(circle at center,
                rgba(56,189,248,0.32) 0%,
                rgba(147,210,255,0.20) 20%,
                rgba(186,230,253,0.10) 40%,
                transparent 62%)`,
          borderRadius: "50%",
        }}
        animate={{ scale: [0.90, 1.10, 0.90], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Mid-range luminescence halo */}
      <motion.div
        className="absolute"
        style={{
          width: 800, height: 800,
          left: "62%", top: "10%",
          transform: "translate(-50%, -50%)",
          background: isDark
            ? `radial-gradient(circle at center,
                rgba(167,139,250,0.38) 0%,
                rgba(124,58,237,0.22) 28%,
                transparent 58%)`
            : `radial-gradient(circle at center,
                rgba(147,210,255,0.45) 0%,
                rgba(56,189,248,0.24) 30%,
                transparent 58%)`,
          borderRadius: "50%",
        }}
        animate={{ scale: [1, 1.14, 1], opacity: [0.78, 1, 0.78] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
      />
    </div>
  );
}

// ─── Atmospheric fog — translucent depth planes ───────────────────────────────

function AtmosphericFog({ isDark }: { isDark: boolean }) {
  const planes = [
    { y: "58%", opacity: 0.16, delay: 0 },
    { y: "70%", opacity: 0.11, delay: 4 },
    { y: "82%", opacity: 0.19, delay: 9 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
      {planes.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: "140%",
            height: "18%",
            top: p.y,
            left: "-20%",
            background: isDark
              ? `linear-gradient(to right, transparent 0%,
                  rgba(124,58,237,${p.opacity * 0.5}) 18%,
                  rgba(6,182,212,${p.opacity}) 48%,
                  rgba(124,58,237,${p.opacity * 0.5}) 82%,
                  transparent 100%)`
              : `linear-gradient(to right, transparent 0%,
                  rgba(186,230,253,${p.opacity * 0.7}) 18%,
                  rgba(147,210,255,${p.opacity}) 48%,
                  rgba(186,230,253,${p.opacity * 0.7}) 82%,
                  transparent 100%)`,
            filter: "blur(32px)",
          }}
          animate={{
            x: ["-5%", "5%", "-5%"],
            opacity: [p.opacity * 0.55, p.opacity, p.opacity * 0.55],
          }}
          transition={{
            duration: 16 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

// ─── Safe world image with atmospheric fallback ───────────────────────────────

function WorldImage({
  world, w = 800, h = 1000, sizes = "33vw", priority = false,
}: {
  world: WorldCard; w?: number; h?: number; sizes?: string; priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${world.bg} 0%, ${world.accent}28 55%, ${world.bg} 100%)`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${world.accent}14 1px, transparent 1px), linear-gradient(90deg, ${world.accent}14 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>
    );
  }
  return (
    <Image
      src={img(world.image, w, h)}
      alt={world.name}
      fill
      className="object-cover"
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function V2Nav() {
  const { theme, toggle } = useTheme();
  const T = useTokens();
  const isDark = theme === "dark";
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setVisible(v < 60 || v < prev);
    setScrolled(v > 40);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          key="nav"
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: E.expo as any }}
          style={{
            backdropFilter: scrolled ? "blur(20px)" : "none",
            background: scrolled
              ? isDark ? "rgba(5,5,10,0.84)" : "rgba(250,248,245,0.92)"
              : "transparent",
            borderBottom: scrolled ? `1px solid ${T.border}` : "none",
          }}
        >
          {/* Brand */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: E.expo as any }}
          >
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: T.accent }}
            >
              <span style={{ color: "#fff", fontSize: 10, fontWeight: 900, letterSpacing: "-0.02em" }}>O</span>
            </div>
            <span style={{ color: T.text, fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em" }}>
              Orchestra
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest"
              style={{ background: `${T.accent}25`, color: T.accentSoft, border: `1px solid ${T.accent}35` }}
            >
              V2
            </span>
          </motion.div>

          {/* CTA + theme toggle */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: E.expo as any }}
          >
            <span style={{ color: T.muted, fontSize: 13, cursor: "pointer" }}>Explore</span>

            {/* Theme toggle */}
            <motion.button
              onClick={toggle}
              className="relative w-[34px] h-[34px] rounded-full flex items-center justify-center focus:outline-none"
              style={{ border: `1px solid ${T.borderHi}`, background: T.surface }}
              whileHover={{ scale: 1.08, borderColor: T.accent }}
              whileTap={{ scale: 0.94 }}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={{ duration: 0.22, ease: E.smooth as any }}
                  style={{ fontSize: 14, lineHeight: 1 }}
                >
                  {isDark ? "☀" : "◐"}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <motion.button
              className="px-4 py-2 rounded-full text-xs font-bold text-white"
              style={{ background: T.accent }}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              Generate World
            </motion.button>
          </motion.div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}

// ─── Section 1: Cinematic Hero — environment-dominant ─────────────────────────

function CinematicHero() {
  const { theme } = useTheme();
  const T = useTokens();
  const isDark = theme === "dark";

  const heroRef  = useRef<HTMLElement>(null);
  const mouseX   = useMotionValue(0);
  const mouseY   = useMotionValue(0);
  const smoothX  = useSpring(mouseX, { stiffness: 48, damping: 18 });
  const smoothY  = useSpring(mouseY, { stiffness: 48, damping: 18 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const [heroBgFailed, setHeroBgFailed] = useState(false);

  // Background parallax — deep, slow
  const bgY         = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgScale     = useTransform(scrollYProgress, [0, 1], [1.08, 1.0]);
  // Text lifts and fades on scroll
  const contentY    = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);
  const contentFade = useTransform(scrollYProgress, [0, 0.68], [1, 0]);
  // Mouse parallax — orbs move more, jellyfish moves subtly
  const orbMoveX    = useTransform(smoothX, [-0.5, 0.5], [-70, 70]);
  const orbMoveY    = useTransform(smoothY, [-0.5, 0.5], [-46, 46]);
  const jfMoveX     = useTransform(smoothX, [-0.5, 0.5], [-22, 22]);
  const jfMoveY     = useTransform(smoothY, [-0.5, 0.5], [-16, 16]);

  const heroVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14, delayChildren: 0.6 } },
  };
  const item = {
    hidden:  { opacity: 0, y: 52 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: E.expo as any } },
  };

  // Jellyfish colours adapt to mode
  const jfColors = isDark
    ? {
        primary:   C.accentSoft,
        secondary: "rgba(6,182,212,0.92)",
        tertiary:  C.gold,
        small:     `${C.accent}90`,
        tiny:      "rgba(6,182,212,0.60)",
      }
    : {
        primary:   "rgba(100,195,255,0.90)",
        secondary: "rgba(80,180,255,0.82)",
        tertiary:  "rgba(147,210,255,0.74)",
        small:     "rgba(56,189,248,0.62)",
        tiny:      "rgba(160,220,255,0.50)",
      };

  return (
    <motion.section
      ref={heroRef as React.RefObject<HTMLElement>}
      className="relative overflow-hidden"
      style={{ height: "100svh", minHeight: "640px" }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - r.left) / r.width  - 0.5);
        mouseY.set((e.clientY - r.top)  / r.height - 0.5);
      }}
    >
      {/* ── LAYER 1: Deep world background ─────────────────────────────────── */}
      {isDark ? (
        <motion.div
          className="absolute inset-0"
          style={{ y: bgY, scale: bgScale }}
        >
          {heroBgFailed ? (
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse 140% 95% at 68% 38%, rgba(124,58,237,0.72) 0%, rgba(76,29,149,0.42) 28%, transparent 55%),
                  radial-gradient(ellipse 85% 75% at 24% 72%, rgba(6,182,212,0.40) 0%, transparent 52%),
                  radial-gradient(ellipse 120% 110% at 92% 10%, rgba(139,92,246,0.38) 0%, rgba(99,102,241,0.20) 30%, transparent 55%),
                  radial-gradient(ellipse 70% 60% at 50% 88%, rgba(6,182,212,0.22) 0%, transparent 50%),
                  ${C.bg}
                `,
              }}
            />
          ) : (
            <Image
              src={img("1501386761775-a76d33ae7f94", 2400, 1600)}
              alt="Cinematic cosmos environment"
              fill
              className="object-cover"
              priority
              style={{ opacity: 0.60 }}
              onError={() => setHeroBgFailed(true)}
            />
          )}
        </motion.div>
      ) : (
        /* Light mode: celestial heavenly sky */
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 130% 80% at 65% 0%, rgba(186,230,253,0.90) 0%, rgba(147,210,255,0.55) 28%, transparent 55%),
                radial-gradient(ellipse 90% 100% at 90% 50%, rgba(224,242,254,0.80) 0%, rgba(186,230,253,0.40) 40%, transparent 65%),
                radial-gradient(ellipse 110% 70% at 15% 70%, rgba(240,249,255,0.60) 0%, rgba(224,242,254,0.28) 45%, transparent 68%),
                linear-gradient(to bottom, #f0f8ff 0%, #e8f4fc 38%, #f0f6ff 72%, #f5f8fd 100%)
              `,
            }}
          />
        </div>
      )}

      {/* ── LAYER 1.5: Nebula field — vast cosmic atmospheric depth ────────── */}
      <NebulaField isDark={isDark} />

      {/* ── LAYER 2: Star field (dark) / light rays (light) ─────────────────── */}
      {isDark ? <StarField count={140} /> : <LightRays />}

      {/* ── LAYER 3: Atmospheric glow orbs (mouse-reactive) ─────────────────── */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ x: orbMoveX, y: orbMoveY, zIndex: 1 }}
      >
        {isDark ? (
          <>
            <Orb color={`${C.accent}55`}       size={1000} x="18%"  y="30%"  dur={14} delay={0} />
            <Orb color="rgba(6,182,212,0.32)"  size={720}  x="75%"  y="12%"  dur={18} delay={2} />
            <Orb color="rgba(124,58,237,0.26)" size={520}  x="88%"  y="68%"  dur={12} delay={4} />
            <Orb color={`${C.gold}20`}          size={420}  x="46%"  y="85%"  dur={22} delay={1} />
            <Orb color="rgba(6,182,212,0.18)"  size={320}  x="55%"  y="5%"   dur={16} delay={5} />
          </>
        ) : (
          <>
            <Orb color="rgba(56,189,248,0.30)"   size={980}  x="22%"  y="20%"  dur={14} delay={0} />
            <Orb color="rgba(147,210,255,0.25)"  size={760}  x="74%"  y="8%"   dur={18} delay={2} />
            <Orb color="rgba(186,230,253,0.20)"  size={540}  x="88%"  y="62%"  dur={12} delay={4} />
            <Orb color="rgba(224,242,254,0.28)"  size={440}  x="40%"  y="80%"  dur={22} delay={1} />
          </>
        )}
      </motion.div>

      {/* ── LAYER 3.5: Celestial glow — environmental halo at world center ────── */}
      <CelestialGlow isDark={isDark} />

      {/* ── LAYER 4: GIANT jellyfish environment (subtle mouse parallax) ─────── */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ x: jfMoveX, y: jfMoveY, zIndex: 2 }}
      >
        {/* MASSIVE primary — dominant centerpiece, upper right */}
        <Jellyfish x="62%"  y="-14%" size={680} delay={0}   accentColor={jfColors.primary} />
        {/* Mid companion — meaningful scale, right side */}
        <Jellyfish x="86%"  y="42%"  size={260} delay={3.2} accentColor={jfColors.secondary} />
        {/* Lower ambient — left of center, subtle depth */}
        <Jellyfish x="40%"  y="60%"  size={148} delay={6.2} accentColor={jfColors.tertiary} />
        {/* Far-right whisper */}
        <Jellyfish x="95%"  y="5%"   size={92}  delay={1.6} accentColor={jfColors.small} />
        {/* Deep background — atmospheric layer */}
        <Jellyfish x="74%"  y="76%"  size={72}  delay={8.0} accentColor={jfColors.tiny} />
      </motion.div>

      {/* ── LAYER 4.5: Atmospheric fog — translucent depth planes ──────────── */}
      <AtmosphericFog isDark={isDark} />

      {/* ── LAYER 5: Cinematic depth gradient (edges in, bottom vignette) ────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, ${T.bg}ee 0%, ${T.bg}80 26%, ${T.bg}20 60%, transparent 100%),
            linear-gradient(to top, ${T.bg}e0 0%, ${T.bg}48 26%, transparent 50%),
            linear-gradient(to bottom, ${T.bg}55 0%, transparent 18%)
          `,
          zIndex: 5,
        }}
        aria-hidden
      />

      {/* ── LAYER 6: Architectural grid (dark only) ──────────────────────────── */}
      {isDark && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            opacity: 0.22,
            zIndex: 6,
          }}
          aria-hidden
        />
      )}

      {/* ── LAYER 7: Floating particles ─────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none" }}>
        <Particles count={isDark ? 32 : 20} />
      </div>

      {/* ── LAYER 8: Film grain ─────────────────────────────────────────────── */}
      <Noise />

      {/* ── LAYER 9: Typography — overlaid bottom zone ──────────────────────── */}
      <motion.div
        className="absolute inset-0 z-20 flex flex-col justify-end"
        style={{ y: contentY, opacity: contentFade }}
      >
        <motion.div
          className="px-8 md:px-14 lg:px-20 pb-14 md:pb-20 max-w-5xl"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div variants={item} className="flex items-center gap-3 mb-7">
            <div className="h-px w-8" style={{ background: T.accentSoft }} />
            <span
              className="text-[10px] font-bold uppercase tracking-[0.28em]"
              style={{ color: T.accentSoft }}
            >
              Orchestra V2 · Cinematic Platform
            </span>
          </motion.div>

          {/* Main headline — massive editorial scale */}
          <motion.h1
            variants={item}
            className="mb-8"
            style={{
              fontFamily: '"Helvetica Neue", "Arial Black", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(3.8rem, 9.5vw, 10.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.88,
              color: T.text,
            }}
          >
            Every startup
            <br />
            <span style={{ color: T.accentSoft }}>deserves</span>
            <br />
            its own world.
          </motion.h1>

          {/* Sub + CTAs */}
          <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end gap-7">
            <p
              className="max-w-md leading-relaxed"
              style={{ color: T.muted, fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)" }}
            >
              Orchestra generates immersive startup worlds. Each brand a distinct visual universe —
              cinematically composed, atmospherically alive, launch-ready.
            </p>
            <div className="flex flex-wrap gap-3 shrink-0">
              <motion.button
                className="px-7 py-3.5 rounded-full text-sm font-bold text-white"
                style={{ background: T.accent }}
                whileHover={{ scale: 1.04, y: -2, boxShadow: `0 12px 32px ${T.accent}55` }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Generate Your World
              </motion.button>
              <motion.button
                className="px-7 py-3.5 rounded-full text-sm font-medium"
                style={{
                  color: T.text,
                  border: `1px solid ${T.borderHi}`,
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                }}
                whileHover={{ borderColor: T.accentSoft, y: -1 }}
                transition={{ duration: 0.2 }}
              >
                See Examples ↓
              </motion.button>
            </div>
          </motion.div>

          {/* Micro stats */}
          <motion.div
            variants={item}
            className="flex items-center gap-8 mt-11 pt-8"
            style={{ borderTop: `1px solid ${T.border}` }}
          >
            {[
              { v: "15+", l: "World categories" },
              { v: "∞",   l: "Unique startups" },
              { v: "V2",  l: "Cinematic engine" },
            ].map(({ v, l }) => (
              <div key={l} className="flex flex-col">
                <span style={{ color: T.text, fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em" }}>
                  {v}
                </span>
                <span style={{ color: T.muted, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 2 }}>
                  {l}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — right edge */}
      <motion.div
        className="absolute bottom-8 right-10 flex flex-col items-center gap-2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
      >
        <span
          style={{
            color: T.muted,
            fontSize: 9,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
          }}
        >
          Scroll
        </span>
        <motion.div
          className="w-px"
          style={{ background: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.20)" }}
          animate={{ height: [20, 42, 20], opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.section>
  );
}

// ─── Section 2: Horizontal world showcase ────────────────────────────────────

function WorldShowcase() {
  const T = useTokens();
  const stripRef     = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(-1400);

  React.useEffect(() => {
    const calc = () => {
      if (stripRef.current && containerRef.current) {
        const pad = parseInt(getComputedStyle(containerRef.current).paddingLeft) || 0;
        setLeft(-(stripRef.current.scrollWidth - containerRef.current.clientWidth + pad));
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return (
    <section style={{ background: T.bg, paddingTop: 80, paddingBottom: 100 }}>
      {/* Header */}
      <motion.div
        className="px-6 md:px-10 lg:px-16 mb-10 flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: E.expo as any }}
      >
        <div className="h-px w-6" style={{ background: T.accentSoft }} />
        <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: T.accentSoft }}>
          Generated Worlds
        </span>
        <div className="h-px flex-1" style={{ background: T.border }} />
        <span style={{ color: T.muted, fontSize: 11 }}>Drag to explore →</span>
      </motion.div>

      {/* Draggable strip */}
      <div
        ref={containerRef}
        className="overflow-hidden select-none"
        style={{ paddingLeft: "clamp(24px, 2.5vw, 64px)" }}
      >
        <motion.div
          ref={stripRef}
          className="flex gap-4"
          drag="x"
          dragConstraints={{ right: 0, left }}
          dragElastic={0.04}
          dragMomentum
          style={{ width: "max-content", cursor: "grab" }}
          whileDrag={{ cursor: "grabbing" }}
        >
          {WORLDS.map((world, i) => (
            <ShowcaseCard key={world.id} world={world} index={i} />
          ))}
          <div style={{ width: 64, flexShrink: 0 }} />
        </motion.div>
      </div>
    </section>
  );
}

function ShowcaseCard({ world, index }: { world: WorldCard; index: number }) {
  const T = useTokens();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [6, -6]);
  const rotateY = useTransform(mouseX, [-150, 150], [-6, 6]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shrink-0 cursor-pointer"
      style={{
        width: "clamp(260px, 22vw, 340px)",
        height: "clamp(360px, 55vh, 520px)",
        border: `1px solid ${T.borderHi}`,
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        marginTop: index % 2 === 1 ? "4vh" : 0,
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      whileHover={{ scale: 1.025 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <WorldImage world={world} w={680} h={800} sizes="28vw" />
      </div>

      {/* Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${world.bg}f5 0%, ${world.bg}60 40%, transparent 70%)`,
        }}
      />

      {/* Accent wash */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${world.accent}22 0%, transparent 55%)` }}
      />

      {/* Top bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <span
          className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-white"
          style={{ background: `${world.accent}cc`, backdropFilter: "blur(8px)" }}
        >
          {world.label}
        </span>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((d) => (
            <div key={d} className="w-1.5 h-1.5 rounded-full" style={{ background: `${world.fg}40` }} />
          ))}
        </div>
      </div>

      {/* Bottom identity */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-5">
        <div className="h-px mb-4" style={{ background: `${world.accent}50` }} />
        <p style={{
          color: world.fg,
          fontWeight: 900,
          fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
        }}>
          {world.name}
        </p>
        <p style={{ color: world.fg, fontSize: 11, opacity: 0.55, marginTop: 4 }}>
          {world.tagline}
        </p>
        <motion.div
          className="mt-3 w-2 h-2 rounded-full"
          style={{ background: world.accent }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
        />
      </div>
    </motion.div>
  );
}

// ─── Tool Orchestration Ecosystem ────────────────────────────────────────────

const TOOLS = [
  { id: "openai",     name: "OpenAI",     tag: "LLM",   color: "#10a37f", ring: 0, angle: 0   },
  { id: "claude",     name: "Claude",     tag: "AI",    color: "#d97706", ring: 0, angle: 72  },
  { id: "vercel",     name: "Vercel",     tag: "EDGE",  color: "#e8e8e8", ring: 0, angle: 144 },
  { id: "supabase",   name: "Supabase",   tag: "DB",    color: "#3ecf8e", ring: 0, angle: 216 },
  { id: "github",     name: "GitHub",     tag: "VCS",   color: "#c9d1d9", ring: 0, angle: 288 },
  { id: "replicate",  name: "Replicate",  tag: "ML",    color: "#6366f1", ring: 1, angle: 36  },
  { id: "stripe",     name: "Stripe",     tag: "PAY",   color: "#635bff", ring: 1, angle: 108 },
  { id: "elevenlabs", name: "ElevenLabs", tag: "TTS",   color: "#f59e0b", ring: 1, angle: 180 },
  { id: "cursor",     name: "Cursor",     tag: "IDE",   color: "#a78bfa", ring: 1, angle: 252 },
  { id: "resend",     name: "Resend",     tag: "EMAIL", color: "#e4e4e7", ring: 1, angle: 324 },
] as const;

const RING_R = [172, 275] as const;

function ringXY(ring: 0 | 1, angle: number): { x: number; y: number } {
  const r = RING_R[ring];
  const rad = (angle * Math.PI) / 180;
  return {
    x: Math.round(r * Math.cos(rad) * 100) / 100,
    y: Math.round(r * Math.sin(rad) * 100) / 100,
  };
}

type ToolEntry = (typeof TOOLS)[number] & { px: number; py: number };
const TOOLS_POS: ToolEntry[] = TOOLS.map((tool) => {
  const { x, y } = ringXY(tool.ring, tool.angle);
  return { ...tool, px: x, py: y };
});

function EcosystemNode({
  tool, active, onClick,
}: {
  tool: ToolEntry; active: boolean; onClick: () => void;
}) {
  const T = useTokens();
  const cx = tool.px;
  const cy = tool.py;

  return (
    <motion.button
      className="absolute flex flex-col items-center gap-1.5 focus:outline-none"
      style={{
        left: `calc(50% + ${cx}px)`,
        top:  `calc(50% + ${cy}px)`,
        transform: "translate(-50%, -50%)",
      }}
      animate={{ y: [0, active ? 0 : -7, 0] }}
      transition={{
        duration: 4 + tool.ring * 2,
        delay: (tool.angle / 360) * 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      onClick={onClick}
      whileHover={{ scale: 1.18 }}
      whileTap={{ scale: 0.94 }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full"
        style={{
          width:  active ? 52 : 44,
          height: active ? 52 : 44,
          background: `radial-gradient(circle at 40% 40%, ${tool.color}42 0%, ${tool.color}14 60%, transparent)`,
          border: `1px solid ${tool.color}${active ? "80" : "35"}`,
          boxShadow: active
            ? `0 0 28px ${tool.color}55, 0 0 8px ${tool.color}28`
            : `0 0 6px ${tool.color}1c`,
        }}
        animate={
          active
            ? { boxShadow: [`0 0 28px ${tool.color}55`, `0 0 50px ${tool.color}78`, `0 0 28px ${tool.color}55`] }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="font-black text-[8px] tracking-widest" style={{ color: tool.color }}>
          {tool.tag}
        </span>
      </motion.div>
      <span
        className="text-[8px] font-semibold uppercase tracking-wide whitespace-nowrap"
        style={{ color: active ? tool.color : T.muted, opacity: active ? 1 : 0.6 }}
      >
        {tool.name}
      </span>
    </motion.button>
  );
}

function OrchestraEcosystem() {
  const T = useTokens();
  const [active, setActive] = useState<string | null>(null);
  const activeTool = TOOLS_POS.find((t) => t.id === active) ?? null;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: T.surface,
        borderTop:    `1px solid ${T.border}`,
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Orb color={`${T.accent}18`} size={1000} x="50%" y="50%" dur={30} />
      </div>
      <Noise />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: E.expo as any }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10" style={{ background: T.accentSoft }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: T.accentSoft }}>
              Orchestration Engine
            </span>
            <div className="h-px w-10" style={{ background: T.accentSoft }} />
          </div>
          <h2
            style={{
              fontFamily: '"Helvetica Neue", "Arial Black", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              color: T.text,
            }}
          >
            Many tools.
            <br />
            <span style={{ color: T.accentSoft }}>One intelligence.</span>
          </h2>
          <p className="mt-5 max-w-md mx-auto leading-relaxed" style={{ color: T.muted, fontSize: 15 }}>
            Orchestra conducts your entire toolchain — AI, infrastructure, payments, voice — into
            a single orchestrated creative engine.
          </p>
        </motion.div>

        {/* Orbital diagram */}
        <motion.div
          className="relative mx-auto"
          style={{ width: 620, height: 620, maxWidth: "calc(100vw - 48px)" }}
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: E.expo as any }}
        >
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: "100%", height: "100%" }}
            viewBox="-310 -310 620 620"
          >
            {RING_R.map((r, ri) => (
              <circle
                key={r}
                cx={0} cy={0} r={r}
                fill="none"
                stroke={T.accent}
                strokeWidth={0.5}
                strokeOpacity={ri === 0 ? 0.18 : 0.10}
                strokeDasharray="5 12"
              />
            ))}
            {TOOLS_POS.map((tool) => {
              const on = active === tool.id;
              return (
                <line
                  key={tool.id}
                  x1={0} y1={0} x2={tool.px} y2={tool.py}
                  stroke={on ? tool.color : T.accent}
                  strokeWidth={on ? 1.5 : 0.4}
                  strokeOpacity={on ? 0.75 : 0.16}
                  strokeDasharray={on ? undefined : "3 9"}
                />
              );
            })}
            {activeTool && (
              <motion.circle
                r={3}
                fill={activeTool.color}
                animate={{ cx: [0, activeTool.px, 0], cy: [0, activeTool.py, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </svg>

          {TOOLS_POS.map((tool) => (
            <EcosystemNode
              key={tool.id}
              tool={tool}
              active={active === tool.id}
              onClick={() => setActive(active === tool.id ? null : tool.id)}
            />
          ))}

          {/* Central Orchestra core */}
          <div
            className="absolute"
            style={{ width: 82, height: 82, left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${T.accent}50 0%, ${T.accent}18 55%, transparent)`,
                border: `1.5px solid ${T.accent}55`,
              }}
              animate={{
                boxShadow: [
                  `0 0 50px ${T.accent}35, 0 0 100px ${T.accent}15`,
                  `0 0 80px ${T.accent}58, 0 0 160px ${T.accent}28`,
                  `0 0 50px ${T.accent}35, 0 0 100px ${T.accent}15`,
                ],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 21, letterSpacing: "-0.04em", lineHeight: 1 }}>
                O
              </span>
              <span style={{ color: T.accentSoft, fontWeight: 700, fontSize: 6.5, letterSpacing: "0.22em", textTransform: "uppercase", marginTop: 1 }}>
                Orchestra
              </span>
            </div>
          </div>
        </motion.div>

        {/* Active tool callout */}
        <div className="mt-10 text-center" style={{ minHeight: 44 }}>
          <AnimatePresence mode="wait">
            {activeTool ? (
              <motion.div
                key={activeTool.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                <p className="text-sm font-semibold" style={{ color: activeTool.color }}>
                  {activeTool.name}
                </p>
                <p className="text-xs mt-1" style={{ color: T.muted }}>
                  Integrated into the Orchestra pipeline
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                className="text-[10px] uppercase tracking-widest"
                style={{ color: T.faint }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Click any node to explore the ecosystem
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Manifesto ────────────────────────────────────────────────────

function Manifesto() {
  const T = useTokens();
  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{ background: T.bg }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Orb color={`${T.accent}38`} size={500} x="90%" y="20%" dur={16} />
        <Orb color={`${T.gold}20`}   size={380} x="5%"  y="75%" dur={20} delay={3} />
      </div>
      <Noise />

      <div className="relative z-10 px-6 md:px-10 lg:px-24 py-16 max-w-[1200px] mx-auto w-full">
        <motion.div
          className="flex items-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: E.expo as any }}
        >
          <div className="h-px w-6" style={{ background: T.gold }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: T.gold }}>
            The Orchestral Philosophy
          </span>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: E.expo as any, delay: 0.1 }}
        >
          <p
            style={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(2rem, 4.5vw, 5rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: T.text,
            }}
          >
            "Not a template engine.
            <br />
            <span style={{ color: T.accentSoft }}>A world director.</span>
            <br />
            Each startup inhabits
            <br />
            its own visual universe."
          </p>
        </motion.blockquote>

        <motion.div
          className="mt-12 flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: E.expo as any, delay: 0.4 }}
        >
          <div className="w-12 h-px" style={{ background: T.gold }} />
          <span style={{ color: T.muted, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Orchestra — Cinematic Generation Engine
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section 4: Systems ───────────────────────────────────────────────────────

type SystemPillar = {
  num: string;
  title: string;
  desc: string;
  detail: string;
  accentColor: string;
};

function SystemsSection() {
  const T = useTokens();

  const PILLARS: SystemPillar[] = [
    {
      num:         "01",
      title:       "Category Intelligence",
      desc:        "World-locked image retrieval with semantic purity scoring. No cross-category contamination.",
      detail:      "15 visual universes with isolated imagery pools, contamination guards, and atmospheric purity tokens.",
      accentColor: T.accent,
    },
    {
      num:         "02",
      title:       "Cinematic Composition",
      desc:        "Section blueprints designed per-world. Every startup gets a different visual rhythm.",
      detail:      "Variant-driven section sequences. Fashion gets editorial mosaic. Science gets cinematic data-bands.",
      accentColor: "#06b6d4",
    },
    {
      num:         "03",
      title:       "Atmospheric Motion",
      desc:        "Framer Motion spring physics, scroll-driven parallax, and world-coherent hover interactions.",
      detail:      "Ken Burns on hero images, spotlight CTAs, staggered reveals, and floating environmental elements.",
      accentColor: T.gold,
    },
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}
    >
      <Noise />
      <div className="relative z-10 px-6 md:px-10 lg:px-16 py-28 max-w-[1440px] mx-auto">
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: E.expo as any }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-6" style={{ background: T.accentSoft }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: T.accentSoft }}>
              Core Systems
            </span>
          </div>
          <h2
            style={{
              fontFamily: '"Helvetica Neue", "Arial Black", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(2.2rem, 5vw, 5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              color: T.text,
            }}
          >
            Three engines.
            <br />
            One world.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: T.border }}>
          {PILLARS.map((p, i) => (
            <PillarCard key={p.num} pillar={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar, index }: { pillar: SystemPillar; index: number }) {
  const T = useTokens();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden p-8 md:p-10 flex flex-col"
      style={{ background: T.surface, minHeight: 340 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: E.expo as any, delay: index * 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: `radial-gradient(400px at 50% 0%, ${pillar.accentColor}15 0%, transparent 70%)` }}
          />
        )}
      </AnimatePresence>

      <span
        style={{
          fontFamily: '"Helvetica Neue", sans-serif',
          fontWeight: 900,
          fontSize: "4.5rem",
          letterSpacing: "-0.06em",
          color: `${pillar.accentColor}20`,
          lineHeight: 1,
          marginBottom: "1rem",
          display: "block",
        }}
      >
        {pillar.num}
      </span>

      <motion.div
        className="h-[2px] mb-6"
        style={{ background: pillar.accentColor }}
        initial={{ width: 0 }}
        whileInView={{ width: 32 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 + index * 0.1 }}
      />

      <h3
        className="mb-4"
        style={{
          fontFamily: '"Helvetica Neue", sans-serif',
          fontWeight: 800,
          fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
          letterSpacing: "-0.03em",
          color: T.text,
          lineHeight: 1.1,
        }}
      >
        {pillar.title}
      </h3>

      <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.65, marginBottom: "auto" }}>
        {pillar.desc}
      </p>

      <motion.p
        className="mt-6 text-xs leading-relaxed"
        style={{ color: `${pillar.accentColor}90` }}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
        transition={{ duration: 0.35 }}
      >
        {pillar.detail}
      </motion.p>
    </motion.div>
  );
}

// ─── Section 5: Live world atmosphere ────────────────────────────────────────

function AtmosphericShowcase() {
  const T = useTokens();
  const featured = WORLDS.filter((w) => ["science", "fashion", "music"].includes(w.id));

  return (
    <section className="relative overflow-hidden" style={{ background: T.bg }}>
      <div className="absolute inset-0 overflow-hidden">
        <Orb color={`${T.accent}32`} size={700} x="50%" y="50%" dur={22} />
      </div>
      <Noise />

      <div className="relative z-10 px-6 md:px-10 lg:px-16 py-28 max-w-[1440px] mx-auto">
        <motion.div
          className="flex items-center gap-3 mb-16 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: E.expo as any }}
        >
          <div className="h-px flex-1" style={{ background: T.border }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: T.muted }}>
            Each world, cinematically distinct
          </span>
          <div className="h-px flex-1" style={{ background: T.border }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featured.map((world, i) => (
            <motion.div
              key={world.id}
              className="relative overflow-hidden rounded-2xl"
              style={{
                aspectRatio: i === 1 ? "3/4" : "4/5",
                marginTop: i === 1 ? "6vh" : 0,
                border: `1px solid ${T.borderHi}`,
              }}
              initial={{ opacity: 0, y: 50 + i * 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.0, ease: E.expo as any, delay: i * 0.12 }}
              whileHover={{ scale: 1.015 }}
            >
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <WorldImage world={world} w={800} h={1000} sizes="33vw" />
              </motion.div>
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${world.bg}f0 0%, ${world.bg}50 40%, transparent 70%)`,
                }}
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${world.accent}18 0%, transparent 60%)` }}
              />
              <div className="absolute top-4 left-4">
                <span
                  className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest"
                  style={{ background: `${world.accent}dd`, color: "#fff" }}
                >
                  {world.label}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
                <div className="h-px mb-4" style={{ background: `${world.accent}55` }} />
                <p style={{
                  color: world.fg, fontWeight: 900,
                  fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
                  letterSpacing: "-0.03em", lineHeight: 1.1,
                }}>
                  {world.name}
                </p>
                <p style={{ color: world.fg, fontSize: 11, opacity: 0.5, marginTop: 4 }}>{world.tagline}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 6: Simplicity ────────────────────────────────────────────────────

const COMPLEXITY_STACK = [
  { name: "Frontend",      color: "#06b6d4" },
  { name: "Backend",       color: "#8b5cf6" },
  { name: "APIs",          color: "#10a37f" },
  { name: "Hosting",       color: "#f59e0b" },
  { name: "Payments",      color: "#635bff" },
  { name: "Database",      color: "#3ecf8e" },
  { name: "Deployment",    color: "#ef4444" },
  { name: "Branding",      color: "#ec4899" },
  { name: "Orchestration", color: "#a78bfa" },
] as const;

function SimplicitySection() {
  const T = useTokens();

  return (
    <section className="relative overflow-hidden" style={{ background: T.surface, borderTop: `1px solid ${T.border}` }}>
      <div className="absolute inset-0 overflow-hidden">
        <Orb color={`${T.accent}18`} size={700} x="20%" y="60%" dur={20} />
        <Orb color="rgba(6,182,212,0.10)" size={500} x="80%" y="30%" dur={26} delay={4} />
      </div>
      <Noise />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — complexity stack */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: E.expo as any }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-6" style={{ background: T.muted }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: T.muted }}>
                The normal way
              </span>
            </div>
            <p className="mb-8" style={{ color: T.muted, fontSize: 14, lineHeight: 1.7 }}>
              Launching a modern AI startup typically requires mastering:
            </p>

            <div className="flex flex-wrap gap-2">
              {COMPLEXITY_STACK.map((item, i) => (
                <motion.div
                  key={item.name}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold"
                  style={{
                    border: `1px solid ${item.color}40`,
                    color: item.color,
                    background: `${item.color}10`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: E.expo as any }}
                >
                  {item.name}
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-10 flex items-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                className="h-px flex-1"
                style={{ background: `linear-gradient(to right, ${T.border}, ${T.accent})`, transformOrigin: "left" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7, ease: E.expo as any }}
              />
              <span style={{ color: T.accent, fontWeight: 900, fontSize: 20 }}>→</span>
            </motion.div>
          </motion.div>

          {/* RIGHT — resolution */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: E.expo as any, delay: 0.15 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-6" style={{ background: T.accentSoft }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: T.accentSoft }}>
                The Orchestra way
              </span>
            </div>

            <h2
              className="mb-6"
              style={{
                fontFamily: '"Helvetica Neue", "Arial Black", sans-serif',
                fontWeight: 900,
                fontSize: "clamp(2.2rem, 4vw, 4rem)",
                letterSpacing: "-0.04em",
                lineHeight: 0.92,
                color: T.text,
              }}
            >
              One guided
              <br />
              <span style={{ color: T.accentSoft }}>creative experience.</span>
            </h2>

            <p className="mb-8 leading-relaxed" style={{ color: T.muted, fontSize: 15 }}>
              Orchestra collapses every layer of technical complexity into a single,
              cinematic creative flow. No code. No configuration. Just your vision,
              orchestrated into a live startup world.
            </p>

            {[
              "Any founder. Any idea.",
              "From concept to launched world.",
              "Zero technical expertise required.",
            ].map((feat, i) => (
              <motion.div
                key={feat}
                className="flex items-center gap-3 mb-3"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: E.expo as any }}
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: T.accentSoft }} />
                <span style={{ color: T.text, fontSize: 14, fontWeight: 500 }}>{feat}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing section ──────────────────────────────────────────────────────────

function PricingSection() {
  const T = useTokens();
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const PLANS = [
    {
      name:     "Founder",
      price:    "Free",
      period:   "forever",
      tagline:  "Start exploring worlds",
      features: ["3 world generations / month", "All 15 categories", "V2 cinematic engine", "Community export"],
      accent:   T.accent,
      cta:      "Start Building",
      featured: false,
    },
    {
      name:     "Studio",
      price:    "$29",
      period:   "/ month",
      tagline:  "Launch your world",
      features: [
        "Unlimited generations",
        "Custom domain deploy",
        "Brand export kit",
        "Priority generation",
        "Collaboration (3 seats)",
      ],
      accent:   T.accentSoft,
      cta:      "Launch Your World",
      featured: true,
    },
    {
      name:     "Ecosystem",
      price:    "$99",
      period:   "/ month",
      tagline:  "Full orchestration suite",
      features: [
        "Everything in Studio",
        "Tool orchestration pipeline",
        "Custom AI model routing",
        "White-label export",
        "Dedicated support",
      ],
      accent:   T.gold,
      cta:      "Orchestrate Everything",
      featured: false,
    },
  ];

  return (
    <section className="relative overflow-hidden" style={{ background: T.bg }}>
      <div className="absolute inset-0 overflow-hidden">
        <Orb color={`${T.accent}16`} size={900} x="50%" y="40%" dur={26} />
      </div>
      <Noise />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: E.expo as any }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8" style={{ background: T.accentSoft }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: T.accentSoft }}>
              Pricing
            </span>
            <div className="h-px w-8" style={{ background: T.accentSoft }} />
          </div>
          <h2
            style={{
              fontFamily: '"Helvetica Neue", "Arial Black", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              color: T.text,
            }}
          >
            Simple.
            <br />
            <span style={{ color: T.accentSoft }}>Founder-first.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => {
            const isHovered  = hoveredPlan === plan.name;
            const isFeatured = plan.featured;
            return (
              <motion.div
                key={plan.name}
                className="relative rounded-2xl p-8 flex flex-col"
                style={{
                  border:     `1px solid ${isFeatured ? plan.accent + "50" : T.borderHi}`,
                  background: isFeatured ? `${plan.accent}08` : T.surface,
                  marginTop:  isFeatured ? 0 : "1rem",
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: E.expo as any, delay: i * 0.1 }}
                onHoverStart={() => setHoveredPlan(plan.name)}
                onHoverEnd={() => setHoveredPlan(null)}
              >
                {isFeatured && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white"
                    style={{ background: plan.accent }}
                  >
                    Most Popular
                  </div>
                )}

                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ boxShadow: `0 0 60px ${plan.accent}25, inset 0 0 60px ${plan.accent}08` }}
                    />
                  )}
                </AnimatePresence>

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: plan.accent }}>
                  {plan.name}
                </p>

                <div className="mb-2">
                  <span
                    style={{
                      fontFamily: '"Helvetica Neue", sans-serif',
                      fontWeight: 900,
                      fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                      letterSpacing: "-0.04em",
                      color: T.text,
                    }}
                  >
                    {plan.price}
                  </span>
                  <span style={{ color: T.muted, fontSize: 13, marginLeft: 4 }}>{plan.period}</span>
                </div>

                <p className="mb-6" style={{ color: T.muted, fontSize: 13 }}>{plan.tagline}</p>

                <motion.div
                  className="h-px mb-6"
                  style={{ background: plan.accent, opacity: 0.4, transformOrigin: "left" }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                />

                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: T.muted }}>
                      <span style={{ color: plan.accent, flexShrink: 0, marginTop: 2, fontSize: 10 }}>◆</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.button
                  className="w-full py-3.5 rounded-full text-sm font-bold"
                  style={
                    isFeatured
                      ? { background: plan.accent, color: "#fff" }
                      : { border: `1px solid ${T.borderHi}`, color: T.text, background: "transparent" }
                  }
                  whileHover={
                    isFeatured
                      ? { scale: 1.03, boxShadow: `0 8px 32px ${plan.accent}50` }
                      : { borderColor: plan.accent, color: plan.accent }
                  }
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          className="text-center mt-12 text-xs uppercase tracking-widest"
          style={{ color: T.faint }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Trusted by founders worldwide · No credit card required to start
        </motion.p>
      </div>
    </section>
  );
}

// ─── Section 7: Epilogue CTA ──────────────────────────────────────────────────

function EpilogueSection() {
  const T = useTokens();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightBg = useMotionTemplate`radial-gradient(600px at ${mouseX}px ${mouseY}px, ${T.accent}32 0%, transparent 65%)`;

  return (
    <motion.section
      className="relative overflow-hidden flex items-center justify-center"
      style={{ background: T.bg, minHeight: "90vh" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Orb color={`${T.accent}45`}       size={800}  x="50%" y="50%" dur={18} />
        <Orb color="rgba(6,182,212,0.22)"  size={500}  x="20%" y="30%" dur={22} delay={3} />
        <Orb color={`${T.gold}22`}          size={400}  x="80%" y="70%" dur={16} delay={6} />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            opacity: 0.5,
          }}
        />
      </div>

      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: spotlightBg }} />
      <Noise />

      <div className="relative z-10 text-center px-6 py-20 max-w-5xl">
        <motion.div
          className="flex items-center justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: E.expo as any }}
        >
          <div className="h-px w-8" style={{ background: T.accentSoft }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: T.accentSoft }}>
            Begin
          </span>
          <div className="h-px w-8" style={{ background: T.accentSoft }} />
        </motion.div>

        <motion.h2
          className="mb-8"
          style={{
            fontFamily: '"Helvetica Neue", "Arial Black", sans-serif',
            fontWeight: 900,
            fontSize: "clamp(3.5rem, 9vw, 9rem)",
            letterSpacing: "-0.05em",
            lineHeight: 0.88,
            color: T.text,
          }}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: E.expo as any, delay: 0.1 }}
        >
          Build your
          <br />
          <span style={{ color: T.accentSoft }}>world.</span>
        </motion.h2>

        <motion.p
          className="mb-12 mx-auto max-w-md leading-relaxed"
          style={{ color: T.muted, fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: E.expo as any, delay: 0.25 }}
        >
          Orchestra generates your entire visual startup world in seconds.
          Cinematically composed. Atmospherically alive. Ready to launch.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: E.expo as any, delay: 0.38 }}
        >
          <motion.button
            className="px-10 py-4 rounded-full text-sm font-bold text-white"
            style={{ background: T.accent, boxShadow: `0 0 40px ${T.accent}35` }}
            whileHover={{ scale: 1.05, y: -3, boxShadow: `0 16px 48px ${T.accent}55` }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Generate Your World →
          </motion.button>
          <motion.button
            className="px-10 py-4 rounded-full text-sm font-medium"
            style={{ color: T.muted, border: `1px solid ${T.border}` }}
            whileHover={{ borderColor: T.borderHi, color: T.text, y: -1 }}
            transition={{ duration: 0.2 }}
          >
            View Live Demos
          </motion.button>
        </motion.div>

        <motion.p
          className="mt-16"
          style={{ color: T.faint, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Orchestra · Cinematic Platform · V2
        </motion.p>
      </div>
    </motion.section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function V2Footer() {
  const T = useTokens();
  return (
    <footer
      className="px-6 md:px-10 lg:px-16 py-10 flex items-center justify-between"
      style={{ background: T.surface, borderTop: `1px solid ${T.border}` }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{ background: T.accent }}
        >
          <span style={{ color: "#fff", fontSize: 9, fontWeight: 900 }}>O</span>
        </div>
        <span style={{ color: T.muted, fontWeight: 700, fontSize: 13, letterSpacing: "-0.02em" }}>
          Orchestra
        </span>
      </div>
      <p style={{ color: T.faint, fontSize: 11 }}>
        Cinematic startup world generation · V2
      </p>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function V2Page() {
  const [theme, setTheme] = useState<Theme>("dark");
  const T = theme === "dark" ? DARK : LIGHT;

  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      <motion.main
        style={{ overflowX: "hidden" }}
        animate={{ background: T.bg }}
        transition={{ duration: 0.5, ease: E.smooth as any }}
      >
        <V2Nav />
        <CinematicHero />
        <WorldShowcase />
        <OrchestraEcosystem />
        <Manifesto />
        <SystemsSection />
        <AtmosphericShowcase />
        <SimplicitySection />
        <PricingSection />
        <EpilogueSection />
        <V2Footer />
      </motion.main>
    </ThemeCtx.Provider>
  );
}
