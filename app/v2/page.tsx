"use client";

import React, { useRef, useState, useEffect } from "react";
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
  bg:          "#05050a",
  surface:     "#0d0d18",
  surfaceHi:   "#12121f",
  accent:      "#7c3aed",
  accentSoft:  "#a78bfa",
  gold:        "#c9a060",
  text:        "#f4f4f8",
  muted:       "rgba(244,244,248,0.5)",
  faint:       "rgba(244,244,248,0.18)",
  border:      "rgba(255,255,255,0.07)",
  borderHi:    "rgba(255,255,255,0.14)",
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
  bg:         "#faf9f8",
  surface:    "#f0eeeb",
  surfaceHi:  "#e6e2dc",
  accent:     "#7c3aed",
  accentSoft: "#5b21b6",
  gold:       "#92400e",
  text:       "#1c1917",
  muted:      "rgba(28,25,23,0.50)",
  faint:      "rgba(28,25,23,0.20)",
  border:     "rgba(0,0,0,0.07)",
  borderHi:   "rgba(0,0,0,0.14)",
} as const;

const ThemeCtx = React.createContext<{ theme: Theme; toggle: () => void }>({ theme: "dark", toggle: () => {} });
const useTheme  = () => React.useContext(ThemeCtx);
const useTokens = () => { const { theme } = useTheme(); return theme === "dark" ? DARK : LIGHT; };

/** Precomputed ring positions — avoids SSR/client float drift on motion dots */
const HERO_RING_DOTS = [
  { top: "calc(50% + 0px)", left: "calc(50% + 210px)" },
  { top: "calc(50% + 181.87px)", left: "calc(50% - 105px)" },
  { top: "calc(50% - 181.87px)", left: "calc(50% - 105px)" },
] as const;

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
        opacity: [0.35, 0.65, 0.42, 0.6, 0.35],
        scale:   [0.92, 1.10, 0.96, 1.06, 0.92],
        x:       [-24, 32, -10, 22, -24],
        y:       [-18, 12, -28, 8, -18],
      }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── Noise overlay (subtle film grain) ────────────────────────────────────────

function Noise() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: 0.028,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        zIndex: 1,
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
      style={{ left: x, top: y, width: size, height: size * 1.5 }}
      animate={{ y: [0, -28, 0], rotateZ: [-3, 3, -3], scale: [0.96, 1.04, 0.96] }}
      transition={{ duration: 9 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {/* Bell */}
      <motion.div
        style={{
          width: "100%",
          height: "54%",
          borderRadius: "50% 50% 38% 38%",
          background: `radial-gradient(ellipse at 42% 32%, ${accentColor}65 0%, ${accentColor}20 55%, transparent 72%)`,
          border: `1px solid ${accentColor}38`,
          boxShadow: `0 0 ${size * 0.5}px ${accentColor}22, inset 0 0 ${size * 0.3}px ${accentColor}12`,
        }}
        animate={{ scaleX: [1, 0.94, 1], scaleY: [1, 1.06, 1] }}
        transition={{ duration: 3.2 + delay * 0.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Tendrils */}
      {Array.from({ length: 7 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: 1.5,
            height: size * (0.38 + (i % 3) * 0.14),
            background: `linear-gradient(to bottom, ${accentColor}45, transparent)`,
            left: `${10 + i * 12}%`,
            top: "50%",
            transformOrigin: "top center",
            borderRadius: 2,
          }}
          animate={{
            rotateZ: [-10 + i * 2, 10 - i * 2, -10 + i * 2],
            scaleY: [0.88, 1.12, 0.88],
          }}
          transition={{
            duration: 2.4 + i * 0.45,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.18 + delay,
          }}
        />
      ))}
    </motion.div>
  );
}

// ─── Star field ───────────────────────────────────────────────────────────────

function StarField({ count = 90 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

function Particles({ count = 30 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 4 }}>
      {Array.from({ length: count }).map((_, i) => {
        const left  = `${(i * 37 + 11) % 100}%`;
        const top   = `${(i * 23 + 17) % 100}%`;
        const size  = 1 + (i % 3) * 0.5;
        const dur   = 10 + (i % 8) * 2.5;
        const del   = (i * 0.6) % 6;
        const color = i % 5 === 0 ? C.accentSoft
                    : i % 5 === 1 ? C.gold
                    : i % 5 === 2 ? "rgba(6,182,212,0.7)"
                    : "rgba(255,255,255,0.4)";
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
  const T = theme === "dark" ? DARK : LIGHT;
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
            backdropFilter: scrolled ? "blur(18px)" : "none",
            background: scrolled ? "rgba(5,5,10,0.82)" : "transparent",
            borderBottom: scrolled ? `1px solid ${C.border}` : "none",
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
              style={{ background: C.accent }}
            >
              <span style={{ color: "#fff", fontSize: 10, fontWeight: 900, letterSpacing: "-0.02em" }}>O</span>
            </div>
            <span style={{ color: C.text, fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em" }}>
              Orchestra
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest"
              style={{ background: `${C.accent}30`, color: C.accentSoft, border: `1px solid ${C.accent}40` }}
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
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
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
                  {theme === "dark" ? "☀" : "◐"}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <motion.button
              className="px-4 py-2 rounded-full text-xs font-bold text-white"
              style={{ background: C.accent }}
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

// ─── Cinematic world frame (hero right panel) ─────────────────────────────────

function WorldFrame({ world }: { world: WorldCard }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl"
      style={{
        width: "100%",
        aspectRatio: "4/5",
        border: `1px solid ${C.borderHi}`,
        boxShadow: `0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px ${C.border}, inset 0 1px 0 ${C.borderHi}`,
        transformStyle: "preserve-3d",
      }}
      animate={{ y: [0, -16, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.02, rotateY: 3, rotateX: -2 }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <WorldImage world={world} w={800} h={1000} sizes="40vw" priority />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${world.bg}f0 0%, ${world.bg}80 35%, transparent 65%)`,
        }}
      />

      {/* Accent color wash */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${world.accent}20 0%, transparent 60%)` }}
      />

      {/* Mini nav bar */}
      <div
        className="absolute top-0 left-0 right-0 px-4 py-3 flex items-center justify-between"
        style={{ background: `linear-gradient(to bottom, ${world.bg}cc, transparent)` }}
      >
        <span style={{ color: world.fg, fontWeight: 800, fontSize: 12, opacity: 0.9 }}>{world.name}</span>
        <span
          className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase"
          style={{ background: world.accent, color: "#fff" }}
        >
          {world.label}
        </span>
      </div>

      {/* Bottom identity */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-8">
        <p style={{ color: world.fg, fontWeight: 900, fontSize: 18, letterSpacing: "-0.03em", lineHeight: 1.1, opacity: 0.95 }}>
          {world.name}
        </p>
        <p style={{ color: world.fg, fontSize: 11, opacity: 0.55, marginTop: 3 }}>{world.tagline}</p>
        <div className="mt-3 h-[2px] w-8" style={{ background: world.accent }} />
      </div>

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${world.fg}06 1px, transparent 1px), linear-gradient(90deg, ${world.fg}06 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </motion.div>
  );
}

// ─── Section 1: Cinematic Hero ────────────────────────────────────────────────

function CinematicHero() {
  const heroRef  = useRef<HTMLElement>(null);
  const mouseX   = useMotionValue(0);
  const mouseY   = useMotionValue(0);
  const smoothX  = useSpring(mouseX, { stiffness: 50, damping: 18 });
  const smoothY  = useSpring(mouseY, { stiffness: 50, damping: 18 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const [heroBgFailed, setHeroBgFailed] = useState(false);

  const bgY         = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgScale     = useTransform(scrollYProgress, [0, 1], [1.06, 1.0]);
  const contentY    = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const contentFade = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const bgMoveX     = useTransform(smoothX, [-0.5, 0.5], [-28, 28]);
  const bgMoveY     = useTransform(smoothY, [-0.5, 0.5], [-18, 18]);
  const orbMoveX    = useTransform(smoothX, [-0.5, 0.5], [-48, 48]);
  const orbMoveY    = useTransform(smoothY, [-0.5, 0.5], [-32, 32]);

  const heroVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } },
  };
  const item = {
    hidden:  { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: E.expo as any } },
  };

  return (
    <motion.section
      ref={heroRef as React.RefObject<HTMLElement>}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: C.bg }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - r.left) / r.width  - 0.5);
        mouseY.set((e.clientY - r.top)  / r.height - 0.5);
      }}
    >
      {/* ── Layer 1: Cinematic environment (deep scroll + mouse parallax) ── */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY, x: bgMoveX, scale: bgScale }}
      >
        {heroBgFailed ? (
          /* Cinematic gradient fallback — no broken image artifact */
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 120% 80% at 70% 40%, rgba(124,58,237,0.22) 0%, transparent 60%),
                radial-gradient(ellipse 80% 60% at 30% 70%, rgba(6,182,212,0.14) 0%, transparent 55%),
                radial-gradient(ellipse 100% 90% at 90% 10%, rgba(201,160,96,0.10) 0%, transparent 50%)
              `,
            }}
          />
        ) : (
          <Image
            src={img("1501386761775-a76d33ae7f94", 2400, 1600)}
            alt="Cinematic world environment"
            fill
            className="object-cover"
            priority
            style={{ opacity: 0.32 }}
            onError={() => setHeroBgFailed(true)}
          />
        )}
      </motion.div>

      {/* ── Star field (behind vignette for depth) ── */}
      <StarField />

      {/* ── Jellyfish entities — right-side cinematic environment ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <Jellyfish x="68%" y="10%" size={148} delay={0}   accentColor={C.accentSoft} />
        <Jellyfish x="83%" y="43%" size={94}  delay={3.2} accentColor="rgba(6,182,212,0.95)" />
        <Jellyfish x="56%" y="67%" size={66}  delay={5.8} accentColor={C.gold} />
      </div>

      {/* ── Layer 2: Gradient vignette ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to right, ${C.bg}f0 0%, ${C.bg}95 42%, ${C.bg}55 75%, ${C.bg}30 100%),
            linear-gradient(to top, ${C.bg}cc 0%, transparent 50%)
          `,
        }}
      />

      {/* ── Layer 3: Architectural grid ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          opacity: 0.35,
        }}
      />

      {/* ── Layer 4: Mouse-reactive atmospheric orbs ── */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ x: orbMoveX, y: orbMoveY }}
      >
        <Orb color={`${C.accent}55`}        size={700}  x="12%"  y="35%"  dur={14} delay={0} />
        <Orb color="rgba(6,182,212,0.32)"   size={520}  x="72%"  y="18%"  dur={18} delay={2} />
        <Orb color="rgba(124,58,237,0.25)"  size={380}  x="88%"  y="68%"  dur={12} delay={4} />
        <Orb color={`${C.gold}20`}           size={300}  x="42%"  y="82%"  dur={22} delay={1} />
        <Orb color="rgba(6,182,212,0.18)"   size={240}  x="55%"  y="8%"   dur={16} delay={5} />
      </motion.div>

      {/* ── Layer 5: Floating particles ── */}
      <Particles />

      {/* ── Layer 6: Film grain ── */}
      <Noise />

      <motion.div
        className="relative z-10 w-full px-6 md:px-10 lg:px-16 pt-28 pb-20"
        style={{ y: contentY, opacity: contentFade }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-6 items-center max-w-[1440px] mx-auto">

          {/* LEFT — Editorial headline */}
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {/* Eyebrow */}
            <motion.div variants={item} className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: C.accentSoft }} />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.28em]"
                style={{ color: C.accentSoft }}
              >
                Orchestra V2 · Cinematic Platform
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={item}
              className="mb-8"
              style={{
                fontFamily: '"Helvetica Neue", "Arial Black", sans-serif',
                fontWeight: 900,
                fontSize: "clamp(3.4rem, 8vw, 8.5rem)",
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                color: C.text,
              }}
            >
              Every startup
              <br />
              <span style={{ color: C.accentSoft }}>deserves</span>
              <br />
              its own world.
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={item}
              className="mb-10 max-w-lg leading-relaxed"
              style={{ color: C.muted, fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)" }}
            >
              Orchestra generates immersive startup worlds. Each brand a distinct visual universe —
              cinematically composed, atmospherically alive, launch-ready.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap gap-3">
              <motion.button
                className="px-7 py-3.5 rounded-full text-sm font-bold text-white"
                style={{ background: C.accent }}
                whileHover={{ scale: 1.04, y: -2, boxShadow: `0 12px 32px ${C.accent}60` }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Generate Your World
              </motion.button>
              <motion.button
                className="px-7 py-3.5 rounded-full text-sm font-medium flex items-center gap-2"
                style={{ color: C.text, border: `1px solid ${C.border}`, background: "transparent" }}
                whileHover={{ borderColor: C.borderHi, y: -1 }}
                transition={{ duration: 0.2 }}
              >
                See Examples
                <span style={{ opacity: 0.5 }}>↓</span>
              </motion.button>
            </motion.div>

            {/* Micro stats */}
            <motion.div
              variants={item}
              className="flex items-center gap-6 mt-12 pt-8"
              style={{ borderTop: `1px solid ${C.border}` }}
            >
              {[
                { v: "15+", l: "World categories" },
                { v: "∞",   l: "Unique startups" },
                { v: "V2",  l: "Cinematic engine" },
              ].map(({ v, l }) => (
                <div key={l} className="flex flex-col">
                  <span style={{ color: C.text, fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em" }}>
                    {v}
                  </span>
                  <span style={{ color: C.muted, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 2 }}>
                    {l}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — Floating world frame */}
          <motion.div
            className="relative hidden lg:flex justify-center items-center"
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.4, ease: E.expo as any, delay: 0.5 }}
          >
            {/* Glow behind the frame */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: 500,
                height: 500,
                background: `radial-gradient(circle, ${C.accent}30 0%, transparent 70%)`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Orbital accent rings */}
            {[340, 420, 500].map((size, i) => (
              <motion.div
                key={size}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: size,
                  height: size,
                  border: `1px solid ${C.accent}${i === 0 ? "30" : i === 1 ? "18" : "0c"}`,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 30 + i * 12, repeat: Infinity, ease: "linear" }}
              />
            ))}

            {/* Small floating accent dots on ring */}
            {HERO_RING_DOTS.map((pos, i) => (
              <motion.div
                key={`dot-${i}`}
                className="absolute pointer-events-none rounded-full"
                style={{
                  width: "6px",
                  height: "6px",
                  background: C.accent,
                  top: pos.top,
                  left: pos.left,
                  transform: "translate(-50%, -50%)",
                }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.4, 0.8] }}
                transition={{ duration: 2.5, delay: i * 0.8, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}

            <div className="w-full max-w-[320px] xl:max-w-[380px]">
              <WorldFrame world={WORLDS[0]} />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <motion.div
          className="w-px bg-white/20"
          animate={{ height: [20, 40, 20], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span style={{ color: C.muted, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase" }}>
          Scroll
        </span>
      </motion.div>
    </motion.section>
  );
}

// ─── Section 2: Horizontal world showcase ────────────────────────────────────

function WorldShowcase() {
  const stripRef     = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(-1400);

  useEffect(() => {
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
    <section style={{ background: C.bg, paddingTop: 80, paddingBottom: 100 }}>
      {/* Header */}
      <motion.div
        className="px-6 md:px-10 lg:px-16 mb-10 flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: E.expo as any }}
      >
        <div className="h-px w-6" style={{ background: C.accentSoft }} />
        <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: C.accentSoft }}>
          Generated Worlds
        </span>
        <div className="h-px flex-1" style={{ background: C.border }} />
        <span style={{ color: C.muted, fontSize: 11 }}>Drag to explore →</span>
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
        border: `1px solid ${C.borderHi}`,
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

        {/* Category indicator dot */}
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
type ToolEntry = typeof TOOLS[number];

function EcosystemNode({
  tool, active, onClick,
}: {
  tool: ToolEntry; active: boolean; onClick: () => void;
}) {
  const r   = RING_R[tool.ring];
  const rad = (tool.angle * Math.PI) / 180;
  const cx  = r * Math.cos(rad);
  const cy  = r * Math.sin(rad);

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
            ? {
                boxShadow: [
                  `0 0 28px ${tool.color}55`,
                  `0 0 50px ${tool.color}78`,
                  `0 0 28px ${tool.color}55`,
                ],
              }
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
        style={{ color: active ? tool.color : C.muted, opacity: active ? 1 : 0.6 }}
      >
        {tool.name}
      </span>
    </motion.button>
  );
}

function OrchestraEcosystem() {
  const [active, setActive] = useState<string | null>(null);
  const activeTool = TOOLS.find((t) => t.id === active) ?? null;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: C.surface,
        borderTop:    `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Orb color={`${C.accent}18`} size={1000} x="50%" y="50%" dur={30} />
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
            <div className="h-px w-10" style={{ background: C.accentSoft }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: C.accentSoft }}>
              Orchestration Engine
            </span>
            <div className="h-px w-10" style={{ background: C.accentSoft }} />
          </div>
          <h2
            style={{
              fontFamily: '"Helvetica Neue", "Arial Black", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              color: C.text,
            }}
          >
            Many tools.
            <br />
            <span style={{ color: C.accentSoft }}>One intelligence.</span>
          </h2>
          <p className="mt-5 max-w-md mx-auto leading-relaxed" style={{ color: C.muted, fontSize: 15 }}>
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
          {/* SVG rings + lines */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: "100%", height: "100%" }}
            viewBox="-310 -310 620 620"
          >
            {/* Orbital rings */}
            {RING_R.map((r, ri) => (
              <circle
                key={r}
                cx={0} cy={0} r={r}
                fill="none"
                stroke={C.accent}
                strokeWidth={0.5}
                strokeOpacity={ri === 0 ? 0.18 : 0.1}
                strokeDasharray="5 12"
              />
            ))}

            {/* Connection lines: core → each node */}
            {TOOLS.map((tool) => {
              const r   = RING_R[tool.ring];
              const rad = (tool.angle * Math.PI) / 180;
              const x2  = r * Math.cos(rad);
              const y2  = r * Math.sin(rad);
              const on  = active === tool.id;
              return (
                <line
                  key={tool.id}
                  x1={0} y1={0} x2={x2} y2={y2}
                  stroke={on ? tool.color : C.accent}
                  strokeWidth={on ? 1.5 : 0.4}
                  strokeOpacity={on ? 0.75 : 0.16}
                  strokeDasharray={on ? undefined : "3 9"}
                />
              );
            })}

            {/* Travelling pulse on active line */}
            {activeTool && (() => {
              const r   = RING_R[activeTool.ring];
              const rad = (activeTool.angle * Math.PI) / 180;
              const x2  = r * Math.cos(rad);
              const y2  = r * Math.sin(rad);
              return (
                <motion.circle
                  r={3}
                  fill={activeTool.color}
                  animate={{ cx: [0, x2, 0], cy: [0, y2, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              );
            })()}
          </svg>

          {/* Tool nodes */}
          {TOOLS.map((tool) => (
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
            style={{
              width: 82, height: 82,
              left: "50%", top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${C.accent}50 0%, ${C.accent}18 55%, transparent)`,
                border: `1.5px solid ${C.accent}55`,
              }}
              animate={{
                boxShadow: [
                  `0 0 50px ${C.accent}35, 0 0 100px ${C.accent}15`,
                  `0 0 80px ${C.accent}58, 0 0 160px ${C.accent}28`,
                  `0 0 50px ${C.accent}35, 0 0 100px ${C.accent}15`,
                ],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 21, letterSpacing: "-0.04em", lineHeight: 1 }}>
                O
              </span>
              <span style={{ color: C.accentSoft, fontWeight: 700, fontSize: 6.5, letterSpacing: "0.22em", textTransform: "uppercase", marginTop: 1 }}>
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
                <p className="text-xs mt-1" style={{ color: C.muted }}>
                  Integrated into the Orchestra pipeline
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                className="text-[10px] uppercase tracking-widest"
                style={{ color: C.faint }}
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
  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{ background: C.bg }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <Orb color={`${C.accent}40`} size={500} x="90%" y="20%" dur={16} />
        <Orb color="rgba(201,160,96,0.22)" size={380} x="5%" y="75%" dur={20} delay={3} />
      </div>
      <Noise />

      <div className="relative z-10 px-6 md:px-10 lg:px-24 py-16 max-w-[1200px] mx-auto w-full">
        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: E.expo as any }}
        >
          <div className="h-px w-6" style={{ background: C.gold }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: C.gold }}>
            The Orchestral Philosophy
          </span>
        </motion.div>

        {/* Main quote */}
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
              color: C.text,
            }}
          >
            "Not a template engine.
            <br />
            <span style={{ color: C.accentSoft }}>A world director.</span>
            <br />
            Each startup inhabits
            <br />
            its own visual universe."
          </p>
        </motion.blockquote>

        {/* Attribution rule */}
        <motion.div
          className="mt-12 flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: E.expo as any, delay: 0.4 }}
        >
          <div className="w-12 h-px" style={{ background: C.gold }} />
          <span style={{ color: C.muted, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>
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

const PILLARS: SystemPillar[] = [
  {
    num:         "01",
    title:       "Category Intelligence",
    desc:        "World-locked image retrieval with semantic purity scoring. No cross-category contamination.",
    detail:      "15 visual universes with isolated imagery pools, contamination guards, and atmospheric purity tokens.",
    accentColor: C.accent,
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
    accentColor: C.gold,
  },
];

function SystemsSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}
    >
      <Noise />
      <div className="relative z-10 px-6 md:px-10 lg:px-16 py-28 max-w-[1440px] mx-auto">
        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: E.expo as any }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-6" style={{ background: C.accentSoft }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: C.accentSoft }}>
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
              color: C.text,
            }}
          >
            Three engines.
            <br />
            One world.
          </h2>
        </motion.div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: C.border }}>
          {PILLARS.map((p, i) => (
            <PillarCard key={p.num} pillar={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({ pillar, index }: { pillar: SystemPillar; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden p-8 md:p-10 flex flex-col"
      style={{ background: C.surface, minHeight: 340 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: E.expo as any, delay: index * 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Hover glow */}
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

      {/* Number */}
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

      {/* Accent line */}
      <motion.div
        className="h-[2px] mb-6"
        style={{ background: pillar.accentColor }}
        initial={{ width: 0 }}
        whileInView={{ width: 32 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 + index * 0.1 }}
      />

      {/* Title */}
      <h3
        className="mb-4"
        style={{
          fontFamily: '"Helvetica Neue", sans-serif',
          fontWeight: 800,
          fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
          letterSpacing: "-0.03em",
          color: C.text,
          lineHeight: 1.1,
        }}
      >
        {pillar.title}
      </h3>

      {/* Desc */}
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65, marginBottom: "auto" }}>
        {pillar.desc}
      </p>

      {/* Detail — reveals on hover */}
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
  const featured = WORLDS.filter((w) => ["science", "fashion", "music"].includes(w.id));

  return (
    <section className="relative overflow-hidden" style={{ background: C.bg }}>
      <div className="absolute inset-0 overflow-hidden">
        <Orb color={`${C.accent}35`} size={700} x="50%" y="50%" dur={22} />
      </div>
      <Noise />

      <div className="relative z-10 px-6 md:px-10 lg:px-16 py-28 max-w-[1440px] mx-auto">
        {/* Label */}
        <motion.div
          className="flex items-center gap-3 mb-16 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: E.expo as any }}
        >
          <div className="h-px flex-1" style={{ background: C.border }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: C.muted }}>
            Each world, cinematically distinct
          </span>
          <div className="h-px flex-1" style={{ background: C.border }} />
        </motion.div>

        {/* Staggered large frames */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featured.map((world, i) => (
            <motion.div
              key={world.id}
              className="relative overflow-hidden rounded-2xl"
              style={{
                aspectRatio: i === 1 ? "3/4" : "4/5",
                marginTop: i === 1 ? "6vh" : 0,
                border: `1px solid ${C.borderHi}`,
              }}
              initial={{ opacity: 0, y: 50 + i * 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.0, ease: E.expo as any, delay: i * 0.12 }}
              whileHover={{ scale: 1.015 }}
            >
              {/* Image with hover scale */}
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <WorldImage world={world} w={800} h={1000} sizes="33vw" />
              </motion.div>

              {/* Overlay */}
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

              {/* Label top */}
              <div className="absolute top-4 left-4">
                <span
                  className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest"
                  style={{ background: `${world.accent}dd`, color: "#fff" }}
                >
                  {world.label}
                </span>
              </div>

              {/* Identity bottom */}
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

// ─── Section 6: Epilogue CTA ──────────────────────────────────────────────────

function EpilogueSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightBg = useMotionTemplate`radial-gradient(600px at ${mouseX}px ${mouseY}px, ${C.accent}35 0%, transparent 65%)`;

  return (
    <motion.section
      className="relative overflow-hidden flex items-center justify-center"
      style={{ background: C.bg, minHeight: "90vh" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }}
    >
      {/* Atmospheric depth */}
      <div className="absolute inset-0 overflow-hidden">
        <Orb color={`${C.accent}50`}       size={800}  x="50%" y="50%" dur={18} />
        <Orb color="rgba(6,182,212,0.25)"  size={500}  x="20%" y="30%" dur={22} delay={3} />
        <Orb color={`${C.gold}25`}          size={400}  x="80%" y="70%" dur={16} delay={6} />
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Mouse spotlight */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: spotlightBg }} />
      <Noise />

      {/* Content */}
      <div className="relative z-10 text-center px-6 py-20 max-w-5xl">
        <motion.div
          className="flex items-center justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: E.expo as any }}
        >
          <div className="h-px w-8" style={{ background: C.accentSoft }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: C.accentSoft }}>
            Begin
          </span>
          <div className="h-px w-8" style={{ background: C.accentSoft }} />
        </motion.div>

        <motion.h2
          className="mb-8"
          style={{
            fontFamily: '"Helvetica Neue", "Arial Black", sans-serif',
            fontWeight: 900,
            fontSize: "clamp(3.5rem, 9vw, 9rem)",
            letterSpacing: "-0.05em",
            lineHeight: 0.88,
            color: C.text,
          }}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: E.expo as any, delay: 0.1 }}
        >
          Build your
          <br />
          <span style={{ color: C.accentSoft }}>world.</span>
        </motion.h2>

        <motion.p
          className="mb-12 mx-auto max-w-md leading-relaxed"
          style={{ color: C.muted, fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)" }}
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
            style={{ background: C.accent, boxShadow: `0 0 40px ${C.accent}40` }}
            whileHover={{ scale: 1.05, y: -3, boxShadow: `0 16px 48px ${C.accent}60` }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Generate Your World →
          </motion.button>
          <motion.button
            className="px-10 py-4 rounded-full text-sm font-medium"
            style={{ color: C.muted, border: `1px solid ${C.border}` }}
            whileHover={{ borderColor: C.borderHi, color: C.text, y: -1 }}
            transition={{ duration: 0.2 }}
          >
            View Live Demos
          </motion.button>
        </motion.div>

        {/* Bottom micro text */}
        <motion.p
          className="mt-16"
          style={{ color: C.faint, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}
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

// ─── Simplicity section ───────────────────────────────────────────────────────

const COMPLEXITY_STACK = [
  { name: "Frontend",     color: "#06b6d4" },
  { name: "Backend",      color: "#8b5cf6" },
  { name: "APIs",         color: "#10a37f" },
  { name: "Hosting",      color: "#f59e0b" },
  { name: "Payments",     color: "#635bff" },
  { name: "Database",     color: "#3ecf8e" },
  { name: "Deployment",   color: "#ef4444" },
  { name: "Branding",     color: "#ec4899" },
  { name: "Orchestration",color: "#a78bfa" },
] as const;

function SimplicitySection() {
  return (
    <section className="relative overflow-hidden" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
      <div className="absolute inset-0 overflow-hidden">
        <Orb color={`${C.accent}20`} size={700} x="20%" y="60%" dur={20} />
        <Orb color="rgba(6,182,212,0.12)" size={500} x="80%" y="30%" dur={26} delay={4} />
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
              <div className="h-px w-6" style={{ background: C.muted }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: C.muted }}>
                The normal way
              </span>
            </div>
            <p className="mb-8" style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>
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

            {/* Converge arrow */}
            <motion.div
              className="mt-10 flex items-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                className="h-px flex-1"
                style={{ background: `linear-gradient(to right, ${C.border}, ${C.accent})`, transformOrigin: "left" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7, ease: E.expo as any }}
              />
              <span style={{ color: C.accent, fontWeight: 900, fontSize: 20 }}>→</span>
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
              <div className="h-px w-6" style={{ background: C.accentSoft }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: C.accentSoft }}>
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
                color: C.text,
              }}
            >
              One guided
              <br />
              <span style={{ color: C.accentSoft }}>creative experience.</span>
            </h2>

            <p className="mb-8 leading-relaxed" style={{ color: C.muted, fontSize: 15 }}>
              Orchestra collapses every layer of technical complexity into a single,
              cinematic creative flow. No code. No configuration. Just your vision,
              orchestrated into a live startup world.
            </p>

            {/* Feature pills */}
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
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: C.accentSoft }} />
                <span style={{ color: C.text, fontSize: 14, fontWeight: 500 }}>{feat}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing section ──────────────────────────────────────────────────────────

const PLANS = [
  {
    name:     "Founder",
    price:    "Free",
    period:   "forever",
    tagline:  "Start exploring worlds",
    features: ["3 world generations / month", "All 15 categories", "V2 cinematic engine", "Community export"],
    accent:   C.accent,
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
    accent:   C.accentSoft,
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
    accent:   C.gold,
    cta:      "Orchestrate Everything",
    featured: false,
  },
] as const;

function PricingSection() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden" style={{ background: C.bg }}>
      <div className="absolute inset-0 overflow-hidden">
        <Orb color={`${C.accent}18`} size={900} x="50%" y="40%" dur={26} />
      </div>
      <Noise />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: E.expo as any }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8" style={{ background: C.accentSoft }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: C.accentSoft }}>
              Pricing
            </span>
            <div className="h-px w-8" style={{ background: C.accentSoft }} />
          </div>
          <h2
            style={{
              fontFamily: '"Helvetica Neue", "Arial Black", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              color: C.text,
            }}
          >
            Simple.
            <br />
            <span style={{ color: C.accentSoft }}>Founder-first.</span>
          </h2>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => {
            const isHovered  = hoveredPlan === plan.name;
            const isFeatured = plan.featured;
            return (
              <motion.div
                key={plan.name}
                className="relative rounded-2xl p-8 flex flex-col"
                style={{
                  border:     `1px solid ${isFeatured ? plan.accent + "50" : C.borderHi}`,
                  background: isFeatured ? `${plan.accent}08` : C.surface,
                  marginTop:  isFeatured ? 0 : "1rem",
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: E.expo as any, delay: i * 0.1 }}
                onHoverStart={() => setHoveredPlan(plan.name)}
                onHoverEnd={() => setHoveredPlan(null)}
              >
                {/* Featured badge */}
                {isFeatured && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white"
                    style={{ background: plan.accent }}
                  >
                    Most Popular
                  </div>
                )}

                {/* Hover glow */}
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

                {/* Plan name */}
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: plan.accent }}>
                  {plan.name}
                </p>

                {/* Price */}
                <div className="mb-2">
                  <span
                    style={{
                      fontFamily: '"Helvetica Neue", sans-serif',
                      fontWeight: 900,
                      fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                      letterSpacing: "-0.04em",
                      color: C.text,
                    }}
                  >
                    {plan.price}
                  </span>
                  <span style={{ color: C.muted, fontSize: 13, marginLeft: 4 }}>{plan.period}</span>
                </div>

                <p className="mb-6" style={{ color: C.muted, fontSize: 13 }}>{plan.tagline}</p>

                {/* Accent rule */}
                <motion.div
                  className="h-px mb-6"
                  style={{ background: plan.accent, opacity: 0.4, transformOrigin: "left" }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                />

                {/* Features */}
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: C.muted }}>
                      <span style={{ color: plan.accent, flexShrink: 0, marginTop: 2, fontSize: 10 }}>◆</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.button
                  className="w-full py-3.5 rounded-full text-sm font-bold"
                  style={
                    isFeatured
                      ? { background: plan.accent, color: "#fff" }
                      : { border: `1px solid ${C.borderHi}`, color: C.text, background: "transparent" }
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

        {/* Social proof */}
        <motion.p
          className="text-center mt-12 text-xs uppercase tracking-widest"
          style={{ color: C.faint }}
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

// ─── Footer ───────────────────────────────────────────────────────────────────

function V2Footer() {
  return (
    <footer
      className="px-6 md:px-10 lg:px-16 py-10 flex items-center justify-between"
      style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{ background: C.accent }}
        >
          <span style={{ color: "#fff", fontSize: 9, fontWeight: 900 }}>O</span>
        </div>
        <span style={{ color: C.muted, fontWeight: 700, fontSize: 13, letterSpacing: "-0.02em" }}>
          Orchestra
        </span>
      </div>
      <p style={{ color: C.faint, fontSize: 11 }}>
        Cinematic startup world generation · V2
      </p>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function V2Page() {
  const [theme, setTheme] = useState<Theme>("dark");

  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      <motion.main
        style={{ overflowX: "hidden" }}
        animate={{ background: theme === "dark" ? C.bg : LIGHT.bg }}
        transition={{ duration: 0.55, ease: E.smooth as any }}
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
