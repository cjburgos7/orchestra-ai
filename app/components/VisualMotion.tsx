"use client";

import type { ReactNode } from "react";
import type { MotionProfile } from "@/lib/types/startup";

const MOTION_CLASS: Record<MotionProfile, string> = {
  calm: "orch-motion-calm",
  cinematic: "orch-motion-cinematic",
  energetic: "orch-motion-energetic",
  editorial: "orch-motion-editorial",
};

export function MotionRoot({
  profile = "calm",
  children,
  className = "",
}: {
  profile?: MotionProfile;
  /** @deprecated never applied to page root — causes layout drift */
  layers?: unknown;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${MOTION_CLASS[profile]} relative w-full max-w-full overflow-x-hidden ${className}`}>
      {children}
    </div>
  );
}

export function StaggerSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`orch-stagger ${className}`}>{children}</div>;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`orch-reveal ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function HoverLift({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`orch-hover-lift ${className}`}>{children}</div>;
}

/** Animated stat display — parses numeric values for count-up effect */
export function StatCounter({ value, className = "" }: { value: string; className?: string }) {
  return <span className={`orch-stat-counter tabular-nums ${className}`}>{value}</span>;
}

/** Subtle parallax band — hover only, no page-level transforms */
export function ParallaxBand({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`relative ${className}`}>{children}</div>;
}

export function ScoreboardStrip({
  items,
  accent,
  className = "",
}: {
  items: { label: string; value: string }[];
  accent: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs font-bold"
        >
          <span className="opacity-60 uppercase tracking-wider text-[10px]">{item.label}</span>
          <span style={{ color: accent }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ProjectMotionStyles() {
  return (
    <style>{`
      @keyframes orch-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      @keyframes orch-reveal-up {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes orch-bar-rise {
        from { transform: scaleY(0); transform-origin: bottom; }
        to { transform: scaleY(1); transform-origin: bottom; }
      }
      @keyframes orch-pulse-soft {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
      .orch-reveal {
        animation: orch-reveal-up 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .orch-stagger > .orch-reveal:nth-child(1) { animation-delay: 0ms; }
      .orch-stagger > .orch-reveal:nth-child(2) { animation-delay: 80ms; }
      .orch-stagger > .orch-reveal:nth-child(3) { animation-delay: 160ms; }
      .orch-stagger > .orch-reveal:nth-child(4) { animation-delay: 240ms; }
      .orch-hover-lift {
        transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
      }
      .orch-hover-lift:hover {
        transform: translateY(-3px);
      }
      .orch-animate-float {
        animation: orch-float 5s ease-in-out infinite;
      }
      .orch-motion-cinematic .orch-animate-float { animation-duration: 7s; }
      .orch-motion-energetic .orch-animate-float { animation-duration: 3.5s; }
      .orch-motion-editorial .orch-reveal { animation-duration: 0.85s; }
      .orch-motion-editorial .orch-hover-lift:hover { transform: translateY(-5px); }
      .orch-motion-cinematic .orch-reveal { animation-duration: 0.75s; }
      .orch-bar-animate {
        animation: orch-bar-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .orch-glow-pulse {
        animation: orch-pulse-soft 3s ease-in-out infinite;
      }
      @keyframes orch-ken-burns {
        0%, 100% { transform: scale(1.02) translate(0, 0); }
        50% { transform: scale(1.08) translate(-1%, -1%); }
      }
      @keyframes orch-gradient-drift {
        0%, 100% { opacity: 0.85; }
        50% { opacity: 1; }
      }
      @keyframes orch-aurora-drift {
        0%, 100% { transform: translateX(0) translateY(0); }
        50% { transform: translateX(5%) translateY(-3%); }
      }
      @keyframes orch-float-orb {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(20px, -15px); }
      }
      @keyframes orch-twinkle {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.5); }
      }
      @keyframes orch-mesh-drift {
        0%, 100% { transform: scale(1); opacity: 0.35; }
        50% { transform: scale(1.05); opacity: 0.45; }
      }
      .orch-ken-burns { animation: orch-ken-burns 18s ease-in-out infinite; }
      .orch-gradient-drift { animation: orch-gradient-drift 20s ease-in-out infinite; }
      /* Background-only drift — must live inside overflow-hidden absolute layers, never on page root */
      .orch-aurora-drift { animation: orch-aurora-drift 14s ease-in-out infinite; }
      .orch-aurora-drift-reverse { animation: orch-aurora-drift 18s ease-in-out infinite reverse; }
      .orch-float-orb { animation: orch-float-orb 12s ease-in-out infinite; }
      .orch-float-orb-reverse { animation: orch-float-orb 16s ease-in-out infinite reverse; }
      .orch-mesh-drift { animation: orch-mesh-drift 15s ease-in-out infinite; }
      .orch-twinkle { animation: orch-twinkle 3s ease-in-out infinite; }
      .orch-vignette {
        background: radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.45) 100%);
      }
      .orch-film-grain {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
        background-size: 180px 180px;
        mix-blend-mode: overlay;
      }
      .orch-parallax-slow { will-change: transform; transition: transform 0.1s linear; }
      @keyframes orch-scoreboard-flash {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      .orch-scoreboard-live {
        animation: orch-scoreboard-flash 2s ease-in-out infinite;
      }
      .orch-parallax-band {
        /* static — no transform on section containers */
      }
      .orch-motion-energetic .orch-parallax-band:hover {
        /* disabled — hover shifts caused layout instability */
      }
      .orch-stat-counter {
        display: inline-block;
        letter-spacing: -0.02em;
      }
    `}</style>
  );
}
