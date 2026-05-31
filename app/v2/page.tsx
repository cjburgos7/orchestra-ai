"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { saveProject } from "@/lib/persistence/projects";
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
    image: "1558618666-fcd25c85cd64",
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

// ─── World variant data ───────────────────────────────────────────────────────

type VariantKey = "synthera" | "aurelia" | "lumina";

const VARIANTS = [
  {
    key: "synthera" as VariantKey,
    num: "01",
    name: "SYNTHERA",
    desc: "Deep · Premium · Metallic",
    accent: "#7c3aed",
    glow: "rgba(80,40,200,0.50)",
    cardBg: "#0c0918",
    objectSrc: "/hero-object.webp" as string | null,
  },
  {
    key: "aurelia" as VariantKey,
    num: "02",
    name: "AURELIA",
    desc: "Soft · Ethereal · Wellness",
    accent: "#a855f7",
    glow: "rgba(168,85,247,0.45)",
    cardBg: "#110820",
    objectSrc: null as string | null,
  },
  {
    key: "lumina" as VariantKey,
    num: "03",
    name: "LUMINA",
    desc: "Minimal · Heavenly · White",
    accent: "#7dd3fc",
    glow: "rgba(178,162,245,0.40)",
    cardBg: "#f0f7ff",
    objectSrc: null as string | null,
  },
] as const;

// ─── Theme ────────────────────────────────────────────────────────────────────

type Theme = "dark" | "light";

const DARK = C;
const LIGHT = {
  bg:         "#faf9fc",
  surface:    "#f2f0f8",
  surfaceHi:  "#e8e4f4",
  accent:     "#6d4ee6",
  accentSoft: "#8b72ee",
  gold:       "#7c5ef5",
  text:       "#1a1828",
  muted:      "rgba(26,24,40,0.52)",
  faint:      "rgba(26,24,40,0.2)",
  border:     "rgba(100,80,200,0.1)",
  borderHi:   "rgba(100,80,200,0.2)",
} as const;

const ThemeCtx = React.createContext<{ theme: Theme; toggle: () => void }>({ theme: "dark", toggle: () => {} });
const useTheme  = () => React.useContext(ThemeCtx);
const useTokens = () => { const { theme } = useTheme(); return theme === "dark" ? DARK : LIGHT; };

const GenerateCtx = React.createContext<{ openGenerate: () => void }>({ openGenerate: () => {} });
const useGenerate = () => React.useContext(GenerateCtx);

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

// ─── Jellyfish entity — cinematic bioluminescent creature ─────────────────────

function Jellyfish({
  x, y, size, delay = 0, accentColor = C.accentSoft,
}: {
  x: string; y: string; size: number; delay?: number; accentColor?: string;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x, top: y,
        width: size, height: size * 1.75,
        transform: "translateX(-50%)",
      }}
      animate={{ y: [0, -28, 0], rotateZ: [-2, 2, -2], scale: [0.97, 1.03, 0.97] }}
      transition={{ duration: 10 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {/* ── Vast outer environmental glow — creature as light source ── */}
      <motion.div
        style={{
          position: "absolute",
          top: "-55%", left: "-55%",
          width: "210%", height: "210%",
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 38%, ${accentColor}28 0%, ${accentColor}12 28%, ${accentColor}06 50%, transparent 68%)`,
        }}
        animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Mid-range luminescence halo */}
      <div style={{
        position: "absolute",
        top: "-22%", left: "-22%",
        width: "144%", height: "144%",
        borderRadius: "50%",
        background: `radial-gradient(circle at 50% 35%, ${accentColor}40 0%, ${accentColor}18 35%, transparent 58%)`,
      }} />

      {/* ── Outer translucent dome cap ── */}
      <div style={{
        position: "absolute",
        width: "106%", height: "56%",
        left: "-3%", top: 0,
        borderRadius: "50% 50% 44% 44%",
        background: `radial-gradient(ellipse at 44% 22%, ${accentColor}20 0%, ${accentColor}0a 48%, transparent 70%)`,
        border: `1px solid ${accentColor}22`,
      }} />

      {/* ── Main bell — photorealistic depth layers ── */}
      <motion.div
        style={{
          position: "absolute",
          width: "92%", height: "52%",
          left: "4%", top: "2%",
          borderRadius: "50% 50% 40% 40%",
          background: `
            radial-gradient(ellipse at 38% 22%,
              rgba(255,255,255,0.92) 0%,
              rgba(255,255,255,0.55) 5%,
              ${accentColor}ff 10%,
              ${accentColor}dd 20%,
              ${accentColor}88 38%,
              ${accentColor}40 58%,
              ${accentColor}18 72%,
              transparent 85%)
          `,
          border: `1px solid ${accentColor}75`,
          boxShadow: `
            0 0 ${size * 1.0}px ${accentColor}50,
            0 0 ${size * 0.55}px ${accentColor}40,
            0 0 ${size * 0.28}px ${accentColor}70,
            inset 0 0 ${size * 0.55}px ${accentColor}38
          `,
        }}
        animate={{ scaleX: [1, 0.95, 1], scaleY: [1, 1.06, 1] }}
        transition={{ duration: 3.4 + delay * 0.3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Bright inner luminescent core — white-hot heart ── */}
      <motion.div
        style={{
          position: "absolute",
          top: "4%", left: "24%",
          width: "52%", height: "28%",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at 46% 34%,
            rgba(255,255,255,1) 0%,
            rgba(255,255,255,0.85) 8%,
            ${accentColor}ff 18%,
            ${accentColor}cc 34%,
            ${accentColor}50 60%,
            transparent 78%)`,
          filter: `blur(${size * 0.008}px)`,
        }}
        animate={{ opacity: [0.78, 1, 0.78], scale: [0.86, 1.16, 0.86] }}
        transition={{ duration: 2.6 + delay * 0.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Bioluminescent spots — scattered interior nodes ── */}
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={`spot-${i}`}
          style={{
            position: "absolute",
            width: Math.max(3, size * 0.022),
            height: Math.max(3, size * 0.022),
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,255,255,0.95) 0%, ${accentColor} 50%, transparent 80%)`,
            left: `${12 + (i % 5) * 16 + (i > 4 ? 6 : 0)}%`,
            top: `${6 + Math.floor(i / 3) * 9}%`,
            boxShadow: `0 0 ${size * 0.04}px rgba(255,255,255,0.9), 0 0 ${size * 0.07}px ${accentColor}`,
          }}
          animate={{ opacity: [0.45, 1, 0.45], scale: [0.7, 1.4, 0.7] }}
          transition={{
            duration: 1.4 + i * 0.28,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.18 + delay,
          }}
        />
      ))}

      {/* ── Bell rib structure — internal radial ribs ── */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`rib-${i}`}
          style={{
            position: "absolute",
            width: 1,
            height: "24%",
            background: `linear-gradient(to bottom, transparent, ${accentColor}50, ${accentColor}28, transparent)`,
            left: `${18 + i * 14}%`,
            top: "14%",
            transformOrigin: "top center",
            transform: `rotate(${-16 + i * 8}deg)`,
          }}
        />
      ))}

      {/* ── Sub-umbrella / underdome fold ── */}
      <div style={{
        position: "absolute",
        top: "48%", left: "8%",
        width: "84%", height: "9%",
        borderRadius: "50%",
        background: `radial-gradient(ellipse, ${accentColor}60 0%, ${accentColor}30 45%, transparent 70%)`,
        filter: `blur(${size * 0.006}px)`,
      }} />

      {/* ── Oral arms — thick branching appendages ── */}
      {[0.18, 0.38, 0.62, 0.82].map((pos, i) => (
        <motion.div
          key={`arm-${i}`}
          style={{
            position: "absolute",
            width: Math.max(2, size * 0.022 - i * size * 0.003),
            height: size * (0.22 + i * 0.03),
            background: `linear-gradient(to bottom,
              ${accentColor}d0,
              ${accentColor}80,
              ${accentColor}38,
              ${accentColor}12,
              transparent)`,
            left: `${pos * 100}%`,
            top: "50%",
            transformOrigin: "top center",
            borderRadius: size * 0.01,
          }}
          animate={{
            rotateZ: [(-6 + i * 2), (6 - i * 2), (-6 + i * 2)],
            scaleY: [0.93, 1.07, 0.93],
          }}
          transition={{
            duration: 3.2 + i * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.35 + delay,
          }}
        />
      ))}

      {/* ── Tendril base glow pool ── */}
      <div style={{
        position: "absolute",
        top: "50%", left: "6%",
        width: "88%", height: "14%",
        background: `radial-gradient(ellipse, ${accentColor}45 0%, ${accentColor}20 50%, transparent 72%)`,
        filter: `blur(${size * 0.008}px)`,
      }} />

      {/* ── Tendrils — 20 fine bioluminescent filaments ── */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`t-${i}`}
          className="absolute"
          style={{
            width: Math.max(0.8, 1.2 + (i % 3) * 0.4),
            height: size * (0.30 + (i % 6) * 0.11),
            background: `linear-gradient(to bottom,
              ${accentColor}95,
              ${accentColor}60,
              ${accentColor}28,
              ${accentColor}0d,
              transparent)`,
            left: `${2 + i * 4.9}%`,
            top: "52%",
            transformOrigin: "top center",
            borderRadius: 2,
          }}
          animate={{
            rotateZ: [-13 + i * 1.3, 13 - i * 1.3, -13 + i * 1.3],
            scaleY: [0.84, 1.16, 0.84],
          }}
          transition={{
            duration: 2.1 + i * 0.32,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.11 + delay,
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
            background: `linear-gradient(to bottom, rgba(178,162,245,${0.32 + (i % 4) * 0.08}), rgba(208,196,255,0.10), transparent)`,
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
          background: "radial-gradient(ellipse, rgba(178,162,245,0.38) 0%, rgba(130,105,240,0.12) 55%, transparent 75%)",
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
          background: "radial-gradient(ellipse, rgba(130,105,240,0.28) 0%, rgba(180,165,245,0.08) 60%, transparent 78%)",
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
          : (i % 5 === 0 ? "rgba(130,105,240,0.45)"
           : i % 5 === 1 ? "rgba(178,162,245,0.40)"
           : i % 5 === 2 ? "rgba(120,195,255,0.35)"
           : "rgba(208,196,255,0.30)");
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

// ─── Orbital chrome sphere — premium object companion ────────────────────────

function HoverSphere({
  spherePx, left, top, period, initY = 0, isDark, graphite = false,
}: {
  spherePx: number; left: string; top: string;
  period: number; initY?: number; isDark: boolean; graphite?: boolean;
}) {
  const chrome = graphite
    ? "radial-gradient(circle at 32% 26%, rgba(222,222,238,0.97) 0%, rgba(148,148,170,0.86) 26%, rgba(60,60,82,0.90) 56%, rgba(14,12,26,0.99) 100%)"
    : "radial-gradient(circle at 30% 24%, rgba(255,255,255,1) 0%, rgba(240,240,255,0.96) 16%, rgba(188,185,222,0.78) 42%, rgba(78,70,130,0.62) 70%, rgba(10,8,22,0.98) 100%)";
  const haloSize = spherePx * 3.2;
  const haloOffset = (haloSize - spherePx) / 2;
  return (
    <motion.div
      style={{
        position: "absolute", left, top,
        width: spherePx, height: spherePx,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
      animate={{ y: [initY, initY - 8, initY] }}
      transition={{ duration: period, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Atmospheric halo */}
      {isDark && (
        <div style={{
          position: "absolute",
          left: -haloOffset, top: -haloOffset,
          width: haloSize, height: haloSize,
          borderRadius: "50%",
          background: graphite
            ? `radial-gradient(circle at 50% 50%, rgba(110,80,225,${spherePx > 60 ? 0.22 : 0.12}) 0%, rgba(68,44,190,${spherePx > 60 ? 0.10 : 0.05}) 45%, transparent 70%)`
            : `radial-gradient(circle at 50% 50%, rgba(140,110,255,${spherePx > 40 ? 0.16 : 0.09}) 0%, rgba(80,55,180,0.05) 50%, transparent 72%)`,
          filter: `blur(${spherePx * 0.55}px)`,
        }} />
      )}
      {/* Chrome sphere */}
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: "50%",
        background: chrome,
        boxShadow: isDark
          ? `0 0 ${spherePx * 2.2}px rgba(110,80,225,0.20), 0 ${spherePx * 0.65}px ${spherePx * 2.2}px rgba(0,0,0,0.82), inset 0 ${Math.max(1, spherePx / 28)}px 0 rgba(255,255,255,0.18)`
          : `0 0 ${spherePx * 2.2}px rgba(80,160,240,0.13), 0 ${spherePx * 0.55}px ${spherePx * 1.3}px rgba(0,0,0,0.22)`,
      }} />
    </motion.div>
  );
}

// ─── Nebula field — deep cosmic atmospheric volumes ───────────────────────────

function NebulaField({ isDark }: { isDark: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {isDark ? (
        <>
          {/* ── Primary purple/violet nebula mass — center-right ── */}
          <motion.div
            className="absolute"
            style={{
              width: "90%", height: "85%",
              top: "-10%", right: "-5%",
              background: `
                radial-gradient(ellipse 62% 55% at 50% 40%,
                  rgba(124,58,237,0.72) 0%,
                  rgba(109,40,217,0.52) 18%,
                  rgba(76,29,149,0.36) 35%,
                  rgba(139,92,246,0.20) 55%,
                  transparent 72%),
                radial-gradient(ellipse 45% 55% at 80% 55%,
                  rgba(167,139,250,0.45) 0%,
                  rgba(124,58,237,0.28) 35%,
                  transparent 62%)
              `,
              borderRadius: "44%",
              filter: "blur(2px)",
            }}
            animate={{ scale: [1, 1.04, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ── Deep violet secondary volume ── */}
          <motion.div
            className="absolute"
            style={{
              width: "65%", height: "78%",
              top: "5%", right: "2%",
              background: `radial-gradient(ellipse at 48% 36%,
                rgba(139,92,246,0.48) 0%,
                rgba(99,102,241,0.28) 28%,
                rgba(79,70,229,0.14) 52%,
                transparent 68%)`,
              borderRadius: "50%",
              filter: "blur(32px)",
            }}
            animate={{ opacity: [0.58, 0.92, 0.58], scale: [0.93, 1.07, 0.93] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          />

          {/* ── Cyan accent vein — upper left of nebula ── */}
          <motion.div
            className="absolute"
            style={{
              width: "48%", height: "50%",
              top: "18%", right: "28%",
              background: `radial-gradient(ellipse at 55% 40%,
                rgba(6,182,212,0.30) 0%,
                rgba(14,165,233,0.16) 40%,
                transparent 62%)`,
              borderRadius: "50%",
              filter: "blur(22px)",
            }}
            animate={{ opacity: [0.42, 0.72, 0.42] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 8 }}
          />

          {/* ── ORANGE/AMBER nebula accent — top right corner (matches reference) ── */}
          <motion.div
            className="absolute"
            style={{
              width: "50%", height: "52%",
              top: "-18%", right: "-12%",
              background: `
                radial-gradient(ellipse 62% 58% at 42% 48%,
                  rgba(251,146,60,0.42) 0%,
                  rgba(249,115,22,0.28) 22%,
                  rgba(234,88,12,0.16) 45%,
                  rgba(194,65,12,0.08) 62%,
                  transparent 78%)
              `,
              borderRadius: "38%",
              filter: "blur(28px)",
            }}
            animate={{ opacity: [0.65, 1, 0.65], scale: [0.94, 1.06, 0.94] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />

          {/* ── Warm amber secondary — top-right edge ── */}
          <motion.div
            className="absolute"
            style={{
              width: "35%", height: "38%",
              top: "-8%", right: "-5%",
              background: `radial-gradient(ellipse at 50% 50%,
                rgba(253,186,116,0.30) 0%,
                rgba(251,146,60,0.18) 35%,
                transparent 62%)`,
              filter: "blur(20px)",
            }}
            animate={{ opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />

          {/* ── Deep magenta haze — between purple and orange ── */}
          <motion.div
            className="absolute"
            style={{
              width: "38%", height: "42%",
              top: "0%", right: "22%",
              background: `radial-gradient(ellipse at 50% 50%,
                rgba(192,38,211,0.22) 0%,
                rgba(162,28,175,0.12) 45%,
                transparent 68%)`,
              filter: "blur(18px)",
            }}
            animate={{ opacity: [0.45, 0.78, 0.45] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
        </>
      ) : (
        <>
          {/* Light mode: luminous celestial volumes */}
          <motion.div
            className="absolute"
            style={{
              width: "100%", height: "85%",
              top: "-20%", left: "0",
              background: `
                radial-gradient(ellipse 78% 68% at 62% 32%,
                  rgba(208,196,255,0.72) 0%,
                  rgba(178,162,245,0.42) 28%,
                  rgba(232,227,255,0.18) 58%,
                  transparent 78%),
                radial-gradient(ellipse 58% 52% at 88% 52%,
                  rgba(232,227,255,0.62) 0%,
                  rgba(208,196,255,0.28) 42%,
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
                rgba(178,162,245,0.52) 0%,
                rgba(208,196,255,0.26) 38%,
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
                rgba(130,105,240,0.32) 0%,
                rgba(178,162,245,0.20) 20%,
                rgba(208,196,255,0.10) 40%,
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
                rgba(178,162,245,0.45) 0%,
                rgba(130,105,240,0.24) 30%,
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
                  rgba(208,196,255,${p.opacity * 0.7}) 18%,
                  rgba(178,162,245,${p.opacity}) 48%,
                  rgba(208,196,255,${p.opacity * 0.7}) 82%,
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

// ─── Floating world — planetary sphere entity ────────────────────────────────

function FloatingWorld({ x, y, size, accentColor, delay = 0 }: {
  x: string; y: string; size: number; accentColor: string; delay?: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x, top: y,
        width: size, height: size,
        transform: "translate(-50%, -50%)",
      }}
      animate={{ y: [0, -18, 0], rotateZ: [-1.5, 1.5, -1.5] }}
      transition={{ duration: 14 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {/* Vast outer atmospheric haze */}
      <div style={{
        position: "absolute",
        inset: `-${size * 0.8}px`,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accentColor}25 0%, ${accentColor}0e 32%, transparent 58%)`,
      }} />
      {/* Mid atmospheric glow */}
      <motion.div
        style={{
          position: "absolute",
          inset: `-${size * 0.38}px`,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}48 0%, ${accentColor}22 38%, transparent 65%)`,
        }}
        animate={{ scale: [0.88, 1.12, 0.88], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Planet sphere — photorealistic depth gradient */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: `
          radial-gradient(circle at 34% 26%,
            rgba(255,255,255,0.18) 0%,
            ${accentColor}ff 6%,
            ${accentColor}dd 18%,
            ${accentColor}99 32%,
            ${accentColor}55 50%,
            ${accentColor}28 68%,
            #0a0520 84%,
            #050310 100%)
        `,
        boxShadow: `
          0 0 ${size * 0.7}px ${accentColor}55,
          0 0 ${size * 0.35}px ${accentColor}42,
          inset -${size * 0.14}px -${size * 0.07}px ${size * 0.2}px rgba(0,0,0,0.75)
        `,
      }} />
      {/* Atmospheric rim glow */}
      <motion.div
        style={{
          position: "absolute",
          inset: `-${size * 0.04}px`,
          borderRadius: "50%",
          border: `${Math.max(1, size * 0.016)}px solid ${accentColor}78`,
          boxShadow: `
            0 0 ${size * 0.28}px ${accentColor}50,
            inset 0 0 ${size * 0.08}px ${accentColor}28
          `,
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Orbital ring — thin perspective ellipse */}
      <div style={{
        position: "absolute",
        width: "175%",
        height: "32%",
        left: "-37.5%",
        top: "34%",
        borderRadius: "50%",
        border: `1px solid ${accentColor}42`,
        boxShadow: `0 0 6px ${accentColor}28`,
        transform: "rotateX(76deg)",
      }} />
    </motion.div>
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

// ─── Generate Modal ───────────────────────────────────────────────────────────

const PHASE1_MSGS = [
  "Reading your idea…",
  "Naming your startup…",
  "Crafting your identity…",
  "Shaping your brand…",
];
const PHASE2_MSGS = [
  "Building your world…",
  "Composing your launch page…",
  "Rendering your universe…",
  "Almost ready to launch…",
];
const PLACEHOLDERS = [
  "A platform that helps freelancers find long-term clients.",
  "AI tools for independent restaurant owners.",
  "A marketplace for sustainable fashion brands.",
  "Software that automates legal contracts for startups.",
  "An app that turns your fitness data into a coaching plan.",
];

type GenPhase = "input" | "phase1" | "preview" | "phase2";

function V2GenerateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const T = useTokens();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [idea, setIdea] = useState("");
  const [phase, setPhase] = useState<GenPhase>("input");
  const [msgIdx, setMsgIdx] = useState(0);
  const [error, setError] = useState("");
  const [previewName, setPreviewName] = useState("");
  const [previewTagline, setPreviewTagline] = useState("");
  const [placeholder] = useState(() => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
  const [selectedFoundation, setSelectedFoundation] = useState<"foundation-1" | "foundation-2" | "foundation-3">(() => {
    if (typeof window === "undefined") return "foundation-1";
    const param = new URLSearchParams(window.location.search).get("foundation");
    if (param === "foundation-2") return "foundation-2";
    if (param === "foundation-3") return "foundation-3";
    return "foundation-1";
  });

  useEffect(() => {
    if (phase !== "phase1" && phase !== "phase2") return;
    const msgs = phase === "phase1" ? PHASE1_MSGS : PHASE2_MSGS;
    setMsgIdx(0);
    const id = setInterval(() => setMsgIdx((i) => (i + 1) % msgs.length), 1100);
    return () => clearInterval(id);
  }, [phase]);

  const handleClose = useCallback(() => {
    if (phase === "phase1" || phase === "phase2") return;
    setPhase("input");
    setIdea("");
    setError("");
    setPreviewName("");
    setPreviewTagline("");
    onClose();
  }, [phase, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = idea.trim() || placeholder;
    setError("");
    setPhase("phase1");

    let project: { id: string; slug: string; startupName: string; tagline: string; [key: string]: unknown } | null = null;
    let brief: unknown = null;

    try {
      const r1 = await fetch("/api/generate-startup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: text }),
      });
      const d1 = await r1.json();
      if (!r1.ok) { setError(d1.error ?? "Generation failed"); setPhase("input"); return; }
      project = d1.project;
      brief = d1.brief;
    } catch {
      setError("Could not reach the server."); setPhase("input"); return;
    }

    if (!project || !brief) { setError("Unexpected server response."); setPhase("input"); return; }

    setPreviewName(project.startupName as string);
    setPreviewTagline(project.tagline as string);
    setPhase("preview");

    // Small pause so the user sees the name before world generation starts
    await new Promise((r) => setTimeout(r, 800));
    setPhase("phase2");

    try {
      const r2 = await fetch("/api/generate-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, direction: "orchestra", seed: project.id, foundationId: selectedFoundation }),
      });
      const d2 = await r2.json();
      if (!r2.ok) { setError(d2.error ?? "World generation failed"); setPhase("input"); return; }

      // Assemble complete project
      const complete = {
        ...(project as Record<string, unknown>),
        generatedSections: d2.sections,
        selectedDirection: "orchestra",
        status: "complete",
        updatedAt: new Date().toISOString(),
      };

      // 1. Save to localStorage immediately — ensures routing works without Supabase
      saveProject(complete as Parameters<typeof saveProject>[0]);

      // 2. Also persist to Supabase (no-op if unconfigured, fire-and-forget)
      fetch("/api/save-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: complete }),
      }).catch(() => {});

      router.push(`/projects/${project!.slug}`);
    } catch {
      setError("World generation failed. Please try again."); setPhase("input");
    }
  }

  if (!open) return null;

  const msgs = phase === "phase1" ? PHASE1_MSGS : PHASE2_MSGS;
  const isLoading = phase === "phase1" || phase === "phase2" || phase === "preview";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="gen-modal"
          className="fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
        >
          {/* Atmospheric backdrop */}
          <div className="absolute inset-0" style={{
            background: isDark
              ? "radial-gradient(ellipse 120% 100% at 60% 40%, rgba(60,30,160,0.55) 0%, rgba(10,6,24,0.97) 55%)"
              : "rgba(8,6,20,0.88)",
            backdropFilter: "blur(16px)",
          }} />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-xl mx-4"
            style={{ maxHeight: "calc(100vh - 40px)", overflowY: "auto" }}
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
                  textTransform: "uppercase", color: T.accentSoft, opacity: 0.9,
                }}>
                  Orchestra · Startup Builder
                </span>
                <h2 style={{
                  fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800,
                  letterSpacing: "-0.04em", lineHeight: 1.15,
                  color: "#fff", marginTop: 6,
                }}>
                  {isLoading && previewName
                    ? <><span style={{ color: T.accentSoft }}>{previewName}</span></>
                    : "Describe your startup"}
                </h2>
              </div>
              {!isLoading && (
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 18, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* Loading state */}
            {isLoading ? (
              <div className="flex flex-col items-center py-10 gap-6">
                {/* Cinematic spinner */}
                <div style={{ position: "relative", width: 64, height: 64 }}>
                  <motion.div
                    style={{
                      position: "absolute", inset: 0, borderRadius: "50%",
                      border: "1.5px solid rgba(124,58,237,0.15)",
                      borderTop: `1.5px solid ${T.accent}`,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    style={{
                      position: "absolute", inset: 10, borderRadius: "50%",
                      border: "1px solid rgba(167,139,250,0.1)",
                      borderBottom: "1px solid rgba(167,139,250,0.5)",
                    }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2.1, repeat: Infinity, ease: "linear" }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: T.accent, opacity: 0.9,
                    }} />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${phase}-${msgIdx}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 500 }}
                  >
                    {phase === "preview"
                      ? previewTagline || "Your startup is forming…"
                      : msgs[msgIdx]}
                  </motion.p>
                </AnimatePresence>

                {phase === "phase2" && previewTagline && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      fontSize: 11, letterSpacing: "0.12em",
                      textTransform: "uppercase", color: T.accentSoft,
                      fontWeight: 600,
                    }}
                  >
                    Building world for {previewName}
                  </motion.p>
                )}
              </div>
            ) : (
              /* Input form */
              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{
                    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: 12, padding: "10px 14px", marginBottom: 16,
                    fontSize: 13, color: "rgba(252,165,165,0.9)",
                  }}>
                    {error}
                  </div>
                )}

                {/* Template picker — prominent */}
                <div style={{ marginBottom: 22 }}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.65)",
                    marginBottom: 12,
                  }}>
                    ✦ Choose your template
                  </p>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[
                      { id: "foundation-1" as const, label: "Aethera",   sub: "Minimal · editorial · serif", emoji: "◻" },
                      { id: "foundation-2" as const, label: "Cinematic", sub: "Dark · atmospheric · spatial", emoji: "✦" },
                      { id: "foundation-3" as const, label: "Future",    sub: "Video · typewriter · bold",   emoji: "▶" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedFoundation(opt.id)}
                        style={{
                          flex: 1, borderRadius: 14, padding: "14px 16px", textAlign: "left",
                          border: selectedFoundation === opt.id
                            ? `1.5px solid ${T.accent}`
                            : "1.5px solid rgba(255,255,255,0.15)",
                          background: selectedFoundation === opt.id
                            ? `${T.accent}22`
                            : "rgba(255,255,255,0.06)",
                          cursor: "pointer", transition: "all 0.18s",
                          boxShadow: selectedFoundation === opt.id
                            ? `0 0 0 3px ${T.accent}22`
                            : "none",
                        }}
                      >
                        <p style={{ fontSize: 16, marginBottom: 4, lineHeight: 1 }}>{opt.emoji}</p>
                        <p style={{
                          fontSize: 14, fontWeight: 700,
                          color: selectedFoundation === opt.id ? "#fff" : "rgba(255,255,255,0.75)",
                          marginBottom: 3,
                        }}>
                          {opt.label}
                        </p>
                        <p style={{
                          fontSize: 11, color: selectedFoundation === opt.id
                            ? T.accentSoft
                            : "rgba(255,255,255,0.4)",
                        }}>
                          {opt.sub}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 18, overflow: "hidden",
                  transition: "border-color 0.2s",
                }}>
                  <textarea
                    autoFocus
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    style={{
                      width: "100%", resize: "none",
                      background: "transparent",
                      border: "none", outline: "none",
                      padding: "20px 22px",
                      fontSize: 16, lineHeight: 1.6,
                      color: "#fff",
                      fontFamily: "inherit",
                    }}
                  />
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                  }}>
                    <span style={{
                      fontSize: 11, color: "rgba(255,255,255,0.3)",
                      fontWeight: 500, letterSpacing: "0.04em",
                    }}>
                      One sentence is enough
                    </span>
                    <motion.button
                      type="submit"
                      style={{
                        background: T.accent, color: "#fff",
                        border: "none", borderRadius: 30,
                        padding: "10px 24px", fontSize: 13,
                        fontWeight: 700, cursor: "pointer",
                        letterSpacing: "-0.01em",
                      }}
                      whileHover={{ scale: 1.04, y: -1, boxShadow: `0 8px 24px ${T.accent}55` }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      Launch my startup →
                    </motion.button>
                  </div>
                </div>

                <p style={{
                  marginTop: 14, fontSize: 11, color: "rgba(255,255,255,0.25)",
                  textAlign: "center", letterSpacing: "0.06em",
                }}>
                  Generates name · tagline · features · pricing · cinematic launch page
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function V2Nav() {
  const { theme, toggle } = useTheme();
  const T = useTokens();
  const isDark = theme === "dark";
  const { openGenerate } = useGenerate();
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
              ? isDark ? "rgba(5,5,10,0.84)" : "rgba(248,246,253,0.92)"
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
              onClick={openGenerate}
              className="px-4 py-2 rounded-full text-xs font-bold text-white"
              style={{ background: T.accent }}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              Launch Startup
            </motion.button>
          </motion.div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}

// ─── Section 1: Cinematic Hero — premium minimal object showcase ──────────────

function CinematicHero() {
  const { theme } = useTheme();
  const T = useTokens();
  const isDark = theme === "dark";
  const { openGenerate } = useGenerate();
  const router = useRouter();

  const heroRef = useRef<HTMLElement>(null);
  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 35, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 35, damping: 22 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const contentY    = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const contentFade = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const objMoveX    = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
  const objMoveY    = useTransform(smoothY, [-0.5, 0.5], [-12, 12]);

  const heroVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.55 } },
  };
  const item = {
    hidden:  { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: E.expo as any } },
  };

  const heroBg = isDark ? "#080c14" : "#f7f5fc";

  return (
    <motion.section
      ref={heroRef as React.RefObject<HTMLElement>}
      className="relative overflow-hidden"
      style={{ height: "100svh", minHeight: "640px", background: heroBg }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - r.left) / r.width - 0.5);
        mouseY.set((e.clientY - r.top)  / r.height - 0.5);
      }}
    >
      {/* ── Cinematic environment layers ──────────────────────────── */}

      {/* Studio depth — not pure flat black, subtle center lift */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 110% 100% at 58% 44%, rgba(14,18,32,1) 0%, rgba(8,12,20,0.6) 55%, rgba(3,5,10,1) 100%)"
        }} />
      )}

      {/* Environment light scatter — ambient bounce from object metallic surface */}
      {isDark && (
        <div className="absolute pointer-events-none" style={{
          right: "2%", top: "12%", width: "56%", height: "70%",
          background: "radial-gradient(ellipse 68% 75% at 50% 50%, rgba(68,46,188,0.16) 0%, rgba(36,22,112,0.08) 48%, transparent 72%)",
        }} />
      )}

      {/* Primary volumetric bloom — breathes slowly */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          right: "-5%", top: "0%", bottom: "0%", width: "72%",
          background: isDark
            ? "radial-gradient(ellipse 80% 88% at 60% 46%, rgba(46,30,140,0.80) 0%, rgba(24,16,72,0.44) 34%, rgba(14,9,38,0.20) 58%, transparent 80%)"
            : "radial-gradient(ellipse 80% 88% at 60% 46%, rgba(208,196,255,0.60) 0%, rgba(232,227,255,0.30) 50%, transparent 78%)",
        }}
        animate={{ opacity: [0.82, 1, 0.82] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary wide atmospheric diffuse */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: isDark
          ? "radial-gradient(ellipse 100% 85% at 55% 50%, rgba(28,18,90,0.34) 0%, rgba(14,9,44,0.16) 46%, transparent 70%)"
          : "radial-gradient(ellipse 100% 85% at 55% 50%, rgba(178,162,245,0.22) 0%, transparent 68%)",
      }} />

      {/* Key light suggestion — subtle upper-right studio light */}
      {isDark && (
        <div className="absolute pointer-events-none" style={{
          top: "-15%", right: "-8%", width: "55%", height: "65%",
          background: "radial-gradient(ellipse 65% 60% at 88% 18%, rgba(200,215,255,0.09) 0%, rgba(160,180,240,0.045) 35%, transparent 68%)",
        }} />
      )}

      {/* Deep corner void — upper-left pulls focus toward object */}
      {isDark && (
        <div className="absolute pointer-events-none" style={{
          top: "0", left: "0", width: "40%", height: "45%",
          background: "radial-gradient(ellipse 90% 90% at 0% 0%, rgba(2,3,8,0.70) 0%, transparent 72%)",
        }} />
      )}

      {/* Atmospheric haze horizon — subtle mid-scene depth plane */}
      {isDark && (
        <div className="absolute pointer-events-none" style={{
          top: "38%", left: "30%", right: "-2%", height: "28%",
          background: "radial-gradient(ellipse 100% 80% at 55% 50%, rgba(50,32,150,0.10) 0%, transparent 72%)",
          filter: "blur(40px)",
        }} />
      )}

      {/* Atmospheric ground fog — horizontal haze at lower third */}
      {isDark && (
        <div className="absolute pointer-events-none" style={{
          bottom: "0%", left: "28%", right: "0%", height: "38%",
          background: "linear-gradient(to top, rgba(4,6,14,0.88) 0%, rgba(8,10,20,0.42) 32%, transparent 68%)",
        }} />
      )}

      {/* ── Premium cinematic object ──────────────────────────────── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          right: "0%",
          top: "46%",
          translateY: "-50%",
          width: "min(78vw, 980px)",
          height: "min(78vw, 980px)",
          x: objMoveX,
          y: objMoveY,
          zIndex: 2,
        }}
      >
        {/* Wide primary bloom — breathes in sync with atmosphere */}
        <motion.div
          style={{
            position: "absolute", inset: "-22%", borderRadius: "50%",
            filter: "blur(55px)",
            background: isDark
              ? "radial-gradient(circle at 50% 48%, rgba(70,46,215,0.46) 0%, rgba(36,22,112,0.24) 40%, rgba(18,11,56,0.10) 62%, transparent 80%)"
              : "radial-gradient(circle at 50% 48%, rgba(178,162,245,0.36) 0%, rgba(208,196,255,0.18) 45%, transparent 68%)",
          }}
          animate={{ opacity: [0.82, 1, 0.82], scale: [0.97, 1, 0.97] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tight secondary bloom — hugs the object surface */}
        <div style={{
          position: "absolute", inset: "-6%", borderRadius: "50%",
          filter: "blur(22px)",
          background: isDark
            ? "radial-gradient(circle at 52% 46%, rgba(88,58,232,0.32) 0%, rgba(48,28,130,0.16) 46%, transparent 70%)"
            : "radial-gradient(circle at 52% 46%, rgba(178,162,245,0.24) 0%, transparent 65%)",
        }} />

        {/* Key light source — point of origin above the sphere cluster */}
        {isDark && (
          <motion.div
            style={{
              position: "absolute", left: "44%", top: "8%",
              width: 280, height: 180,
              transform: "translate(-50%, 0)",
              background: "radial-gradient(ellipse 60% 70% at 50% 10%, rgba(200,190,255,0.13) 0%, rgba(140,110,240,0.07) 45%, transparent 75%)",
              filter: "blur(12px)",
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Orbital sphere cluster — primary composition */}
        <HoverSphere spherePx={96} left="46%" top="46%" period={14}   initY={0}  isDark={isDark} graphite />
        <HoverSphere spherePx={56} left="70%" top="26%" period={10.5} initY={-4} isDark={isDark} />
        <HoverSphere spherePx={36} left="76%" top="62%" period={8}    initY={-6} isDark={isDark} />
        <HoverSphere spherePx={20} left="82%" top="18%" period={12}   initY={-2} isDark={isDark} />

        {/* Reflective floor plane — suggests physical ground */}
        <div style={{
          position: "absolute", bottom: "-4%", left: "10%", right: "10%",
          height: "24%", filter: "blur(16px)",
          background: isDark
            ? "radial-gradient(ellipse 90% 100% at 50% 0%, rgba(68,44,210,0.40) 0%, rgba(36,20,110,0.22) 45%, transparent 80%)"
            : "radial-gradient(ellipse 90% 100% at 50% 0%, rgba(178,162,245,0.20) 0%, transparent 70%)",
        }} />

        {/* Floor glint — premium specular line at ground plane */}
        {isDark && (
          <div style={{
            position: "absolute", bottom: "20%", left: "16%", right: "16%",
            height: 1.5, filter: "blur(3px)",
            background: "linear-gradient(to right, transparent 0%, rgba(120,96,255,0.20) 22%, rgba(168,145,255,0.46) 50%, rgba(120,96,255,0.20) 78%, transparent 100%)",
          }} />
        )}

        {/* Contact shadow — tight glow at object base */}
        <div style={{
          position: "absolute", bottom: "8%", left: "24%", right: "24%",
          height: 36, filter: "blur(12px)",
          background: isDark
            ? "radial-gradient(ellipse at 50% 100%, rgba(84,54,228,0.48) 0%, rgba(44,26,122,0.24) 52%, transparent 80%)"
            : "radial-gradient(ellipse at 50% 100%, rgba(178,162,245,0.28) 0%, transparent 70%)",
        }} />
      </motion.div>

      {/* Left text-readability vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: isDark
            ? "linear-gradient(to right, rgba(8,12,20,1) 0%, rgba(8,12,20,0.88) 30%, rgba(8,12,20,0.38) 54%, transparent 74%)"
            : `linear-gradient(to right, ${T.bg} 0%, ${T.bg}e8 28%, ${T.bg}55 52%, transparent 72%)`,
        }}
        aria-hidden
      />
      {/* Bottom vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: isDark
            ? "linear-gradient(to top, rgba(8,12,20,0.55) 0%, rgba(8,12,20,0.08) 24%, transparent 40%)"
            : `linear-gradient(to top, ${T.bg}80 0%, transparent 28%)`,
        }}
        aria-hidden
      />

      {/* Sparse ambient particles */}
      <Particles count={isDark ? 14 : 8} />

      {/* Film grain */}
      <Noise />

      {/* Typography — bottom-left */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end z-20"
        style={{ y: contentY, opacity: contentFade }}
      >
        <motion.div
          className="px-8 md:px-14 lg:px-20 pb-14 md:pb-20"
          style={{ maxWidth: "min(52%, 620px)" }}
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div variants={item} className="flex items-center gap-3 mb-7">
            <div className="h-px w-8" style={{ background: T.accentSoft }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: T.accentSoft }}>
              Collected V2 · Cinematic Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="mb-7"
            style={{
              fontFamily: '"Helvetica Neue", "Arial Black", sans-serif',
              fontWeight: 900,
              fontSize: "clamp(3.2rem, 6vw, 7rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.90,
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
          <motion.div variants={item} className="flex flex-col gap-6">
            <p style={{ color: T.muted, fontSize: "clamp(0.82rem, 1.25vw, 0.97rem)", lineHeight: 1.68, maxWidth: 370 }}>
              From idea to launch-ready startup — name, brand identity, cinematic world,
              and a complete business presence. Built in seconds.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.button
                onClick={openGenerate}
                className="px-6 py-3 rounded-full text-sm font-bold text-white flex items-center gap-2"
                style={{ background: T.accent }}
                whileHover={{ scale: 1.04, y: -2, boxShadow: `0 12px 32px ${T.accent}55` }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Launch Your Startup <span style={{ opacity: 0.85 }}>→</span>
              </motion.button>
              <motion.button
                onClick={() => router.push("/projects")}
                className="px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2"
                style={{ color: T.muted, border: `1px solid ${T.border}` }}
                whileHover={{ borderColor: T.borderHi, color: T.text, y: -1 }}
                transition={{ duration: 0.18 }}
              >
                See Examples <span style={{ opacity: 0.7 }}>→</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={item}
            className="flex items-center gap-7 mt-10 pt-8"
            style={{ borderTop: `1px solid ${T.border}` }}
          >
            {[
              { v: "15+", l: "World categories" },
              { v: "∞",   l: "Unique startups" },
              { v: "V2",  l: "Cinematic engine" },
            ].map(({ v, l }) => (
              <div key={l} className="flex flex-col">
                <span style={{ color: T.text, fontWeight: 800, fontSize: "1.35rem", letterSpacing: "-0.03em" }}>{v}</span>
                <span style={{ color: T.muted, fontSize: "0.67rem", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 2 }}>{l}</span>
              </div>
            ))}
            <div className="ml-auto hidden lg:flex flex-col items-end">
              <span style={{ color: T.muted, fontSize: "0.60rem", textTransform: "uppercase", letterSpacing: "0.20em" }}>Active World</span>
              <span style={{ color: T.accentSoft, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.06em" }}>SYNTHERA</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-10 flex flex-col items-center gap-2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <span style={{ color: T.muted, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", writingMode: "vertical-rl" }}>
          Scroll
        </span>
        <motion.div
          className="w-px"
          style={{ background: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)" }}
          animate={{ height: [18, 38, 18], opacity: [0.22, 0.50, 0.22] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.section>
  );
}

// ─── World Variants section ───────────────────────────────────────────────────

function VariantCard({
  variant, isActive, onClick,
}: {
  variant: typeof VARIANTS[number]; isActive: boolean; onClick: () => void;
}) {
  const { theme } = useTheme();
  const T = useTokens();
  const isLumina   = variant.key === "lumina";
  const textColor  = isLumina ? "rgba(20,20,40,0.88)"  : "rgba(255,255,255,0.90)";
  const mutedColor = isLumina ? "rgba(20,20,40,0.40)"  : "rgba(255,255,255,0.40)";
  const numColor   = isLumina ? "rgba(20,20,40,0.08)"  : "rgba(255,255,255,0.06)";

  return (
    <motion.div
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        height: 210,
        background: variant.cardBg,
        border: isActive ? `1px solid ${variant.accent}55` : `1px solid ${T.border}`,
        boxShadow: isActive ? `0 0 52px ${variant.accent}18, 0 0 100px ${variant.accent}0c` : "none",
      }}
      whileHover={{ scale: 1.025, y: -3 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
    >
      {/* Atmospheric glow */}
      <motion.div
        style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 85% 85% at 65% 50%, ${variant.glow} 0%, transparent 70%)`,
        }}
        animate={{ opacity: isActive ? 1 : 0.5 }}
        transition={{ duration: 0.5 }}
      />

      {/* Object preview */}
      {variant.objectSrc ? (
        <motion.div
          style={{ position: "absolute", right: "-8%", top: "50%", translateY: "-50%", width: "58%", height: "120%" }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src={variant.objectSrc} fill sizes="280px" className="object-contain" alt={variant.name} style={{ filter: "saturate(0.2) contrast(1.05)" }} />
        </motion.div>
      ) : (
        <motion.div
          style={{
            position: "absolute", right: "12%", top: "50%", translateY: "-50%",
            width: 90, height: 90, borderRadius: "50%",
            background: `radial-gradient(circle at 33% 30%, rgba(255,255,255,0.94) 0%, ${variant.accent}cc 40%, rgba(10,5,25,0.88) 80%)`,
            boxShadow: `0 0 50px ${variant.accent}50`,
          }}
          animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Number watermark */}
      <span style={{
        position: "absolute", top: 10, left: 14,
        fontSize: "3rem", fontWeight: 900, letterSpacing: "-0.06em",
        color: numColor, lineHeight: 1, userSelect: "none",
      }}>
        {variant.num}
      </span>

      {/* Labels */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 18px 16px" }}>
        <p style={{ color: textColor, fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
          {variant.name}
        </p>
        <p style={{ color: mutedColor, fontSize: "0.68rem", letterSpacing: "0.06em", marginTop: 2 }}>
          {variant.desc}
        </p>
      </div>

      {/* Active indicator dot */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{
              position: "absolute", top: 14, right: 14,
              width: 7, height: 7, borderRadius: "50%",
              background: variant.accent,
              boxShadow: `0 0 10px ${variant.accent}`,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function WorldVariants() {
  const { theme } = useTheme();
  const T = useTokens();
  const isDark = theme === "dark";
  const { openGenerate } = useGenerate();
  const [activeKey, setActiveKey] = useState<VariantKey>("synthera");

  return (
    <section style={{ background: isDark ? "#070710" : T.bg, borderTop: `1px solid ${T.border}`, padding: "44px 0 68px" }}>
      <div className="px-8 md:px-14 lg:px-20">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: E.expo as any }}
        >
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <div className="h-px w-6" style={{ background: T.accentSoft }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: T.accentSoft }}>
                World Variants
              </span>
            </div>
            <p style={{ color: T.muted, fontSize: 13, maxWidth: 340, lineHeight: 1.62 }}>
              Cinematically distinct startup visual universes. Each brand, a different world.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: `${T.accent}12`, border: `1px solid ${T.accent}28` }}>
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#22c55e" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span style={{ color: T.accentSoft, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Live Preview
              </span>
            </div>
            <motion.button
              onClick={openGenerate}
              className="px-4 py-2 rounded-full text-xs font-semibold"
              style={{ border: `1px solid ${T.borderHi}`, color: T.muted, background: "transparent" }}
              whileHover={{ borderColor: T.accent, color: T.text }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              Build My Startup →
            </motion.button>
          </div>
        </motion.div>

        {/* Variant cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: E.expo as any, delay: 0.1 }}
        >
          {VARIANTS.map((variant) => (
            <VariantCard
              key={variant.key}
              variant={variant as unknown as typeof VARIANTS[number]}
              isActive={activeKey === variant.key}
              onClick={() => setActiveKey(variant.key)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section 2: Horizontal world showcase ────────────────────────────────────

function WorldShowcase() {
  const T = useTokens();
  const stripRef     = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(-1400);
  const x = useMotionValue(0);
  const isDragging = useRef(false);
  const isHovered  = useRef(false);
  const rafRef     = useRef<number | null>(null);

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

  // Slow cinematic auto-drift — 0.35 px/frame ≈ very gentle
  React.useEffect(() => {
    const drift = () => {
      if (!isDragging.current && !isHovered.current) {
        const cur = x.get();
        const nxt = cur - 0.35;
        x.set(nxt < left ? 0 : nxt);
      }
      rafRef.current = requestAnimationFrame(drift);
    };
    rafRef.current = requestAnimationFrame(drift);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [left, x]);

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
          Real startups, built by Orchestra
        </span>
        <div className="h-px flex-1" style={{ background: T.border }} />
        <span style={{ color: T.muted, fontSize: 11 }}>Drag to explore · click to build</span>
      </motion.div>

      {/* Draggable strip */}
      <div
        ref={containerRef}
        className="overflow-hidden select-none"
        style={{ paddingLeft: "clamp(24px, 2.5vw, 64px)" }}
        onMouseEnter={() => { isHovered.current = true; }}
        onMouseLeave={() => { isHovered.current = false; }}
      >
        <motion.div
          ref={stripRef}
          className="flex gap-4"
          drag="x"
          dragConstraints={{ right: 0, left }}
          dragElastic={0.04}
          dragMomentum
          style={{ width: "max-content", cursor: "grab", x }}
          whileDrag={{ cursor: "grabbing" }}
          onDragStart={() => { isDragging.current = true; }}
          onDragEnd={() => { isDragging.current = false; }}
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
  const { openGenerate } = useGenerate();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [6, -6]);
  const rotateY = useTransform(mouseX, [-150, 150], [-6, 6]);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shrink-0 cursor-pointer"
      onClick={openGenerate}
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
        <div className="mt-3 flex items-center justify-between">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: world.accent }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
          />
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: world.fg, opacity: 0.4,
          }}>
            Build yours →
          </span>
        </div>
      </div>

      {/* Hover CTA overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{ background: `${world.accent}18`, backdropFilter: "blur(2px)" }}
      >
        <div style={{
          background: `${world.accent}ee`, color: "#fff",
          borderRadius: 30, padding: "10px 22px",
          fontSize: 12, fontWeight: 700, letterSpacing: "0.04em",
        }}>
          Launch my startup →
        </div>
      </motion.div>
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

// Remap near-white tool colors to readable values in light mode
const NEAR_WHITE_TOOLS = new Set(["#e8e8e8", "#c9d1d9", "#e4e4e7"]);
function resolveEcosystemColor(raw: string, theme: Theme): string {
  if (theme === "light" && NEAR_WHITE_TOOLS.has(raw.toLowerCase())) {
    return "#475569"; // slate-600 — readable on any light surface
  }
  return raw;
}

function EcosystemNode({
  tool, active, onClick,
}: {
  tool: ToolEntry; active: boolean; onClick: () => void;
}) {
  const { theme } = useTheme();
  const T = useTokens();
  const isDark = theme === "dark";
  const cx = tool.px;
  const cy = tool.py;
  const color = resolveEcosystemColor(tool.color, theme);

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
          background: isDark
            ? `radial-gradient(circle at 40% 40%, ${color}55 0%, ${color}22 60%, transparent)`
            : `rgba(255,255,255,0.72)`,
          border: `1.5px solid ${color}${active ? (isDark ? "aa" : "88") : (isDark ? "62" : "66")}`,
          boxShadow: active
            ? `0 0 24px ${color}66, 0 0 8px ${color}38`
            : isDark
              ? `0 0 12px ${color}32, 0 0 4px ${color}16`
              : `0 0 10px ${color}28, inset 0 0 8px ${color}10`,
          backdropFilter: isDark ? "none" : "blur(4px)",
        }}
        animate={
          active
            ? { boxShadow: [`0 0 24px ${color}55`, `0 0 44px ${color}78`, `0 0 24px ${color}55`] }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="font-black text-[8px] tracking-widest" style={{ color }}>
          {tool.tag}
        </span>
      </motion.div>
      <span
        className="text-[8px] font-semibold uppercase tracking-wide whitespace-nowrap"
        style={{
          color: active ? color : (isDark ? color : color),
          opacity: active ? 1 : (isDark ? 0.72 : 0.88),
        }}
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
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.94, 1, 1, 0.97]);

  return (
    <motion.section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative overflow-hidden flex items-center justify-center"
      style={{ background: T.bg, minHeight: "100svh" }}
    >
      {/* Scroll-reactive atmospheric glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: bgOpacity }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: isDark
            ? "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(80,40,200,0.18) 0%, transparent 70%)"
            : "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(178,162,245,0.15) 0%, transparent 70%)",
        }} />
        <Orb color={`${T.accent}30`} size={600} x="85%" y="15%" dur={16} />
        <Orb color={`${T.gold}18`}   size={420} x="8%"  y="80%" dur={20} delay={3} />
      </motion.div>
      <Noise />

      <motion.div
        className="relative z-10 px-6 md:px-10 lg:px-24 py-24 max-w-[1200px] mx-auto w-full"
        style={{ scale }}
      >
        <motion.div
          className="flex items-center gap-3 mb-14"
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
          viewport={{ once: true, margin: "-80px" }}
          initial="hidden"
          whileInView="visible"
        >
          {[
            { text: "Not another", accent: false },
            { text: "website builder.", accent: false },
            { text: "Your startup's", accent: false },
            { text: "creative director.", accent: true },
          ].map((line, li) => (
            <div key={li} className="overflow-hidden">
              <motion.p
                custom={li}
                variants={{
                  hidden: { y: "110%", opacity: 0 },
                  visible: (i: number) => ({
                    y: 0, opacity: 1,
                    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.14 },
                  }),
                }}
                style={{
                  fontFamily: '"Helvetica Neue", "Arial Black", sans-serif',
                  fontWeight: 900,
                  fontSize: "clamp(2.4rem, 5.5vw, 6.5rem)",
                  letterSpacing: "-0.045em",
                  lineHeight: 1.0,
                  color: line.accent ? T.accentSoft : T.text,
                  display: "block",
                }}
              >
                {line.text}
              </motion.p>
            </div>
          ))}
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
            Orchestra — Founder Operating System
          </span>
        </motion.div>
      </motion.div>
    </motion.section>
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
              Orchestra collapses the entire startup launch stack into one
              cinematic creative flow. Describe your idea and walk away with
              a launch-ready business identity — no code, no team, no months of work.
            </p>

            {[
              "Idea → launch-ready in seconds.",
              "Premium identity for any market.",
              "The whole launch stack, orchestrated.",
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
  const { openGenerate } = useGenerate();
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
                  onClick={openGenerate}
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
  const { openGenerate } = useGenerate();
  const router = useRouter();
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
          Everything founders usually stitch together over months —
          name, brand, launch page, business identity — orchestrated in seconds.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: E.expo as any, delay: 0.38 }}
        >
          <motion.button
            onClick={openGenerate}
            className="px-10 py-4 rounded-full text-sm font-bold text-white"
            style={{ background: T.accent, boxShadow: `0 0 40px ${T.accent}35` }}
            whileHover={{ scale: 1.05, y: -3, boxShadow: `0 16px 48px ${T.accent}55` }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Launch Your Startup →
          </motion.button>
          <motion.button
            onClick={() => router.push("/projects")}
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
  const [theme, setTheme] = useState<Theme>("light");
  const [generateOpen, setGenerateOpen] = useState(false);
  const T = theme === "dark" ? DARK : LIGHT;
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("generate") === "1") {
        setGenerateOpen(true);
        window.history.replaceState({}, "", "/app");
      }
    }
  }, []);

  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      <GenerateCtx.Provider value={{ openGenerate: () => setGenerateOpen(true) }}>
        {/* Scroll progress bar */}
        <motion.div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 1.5,
            zIndex: 9999,
            background: `linear-gradient(to right, ${T.accent}, ${T.accentSoft})`,
            scaleX,
            transformOrigin: "0%",
          }}
        />
        <V2GenerateModal open={generateOpen} onClose={() => setGenerateOpen(false)} />
        <motion.main
          style={{ overflowX: "hidden" }}
          animate={{ background: T.bg }}
          transition={{ duration: 0.5, ease: E.smooth as any }}
        >
          <V2Nav />
          <CinematicHero />
          <WorldVariants />
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
      </GenerateCtx.Provider>
    </ThemeCtx.Provider>
  );
}
