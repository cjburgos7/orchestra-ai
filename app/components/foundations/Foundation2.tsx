"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import type { Foundation1Slots } from "@/lib/types/startup";

// Foundation #2 reuses Foundation1Slots for content — same data model, different visual treatment
export type Foundation2Slots = Foundation1Slots;

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4";
const CAPABILITIES_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4";

const SERIF = "var(--font-instrument-serif), 'Instrument Serif', serif";
const BODY  = "var(--font-inter), 'Barlow', Inter, sans-serif";

export const DEFAULT_F2_SLOTS: Foundation2Slots = {
  logoText: "Aethera®",
  navItems: [
    { label: "Home",         href: "#hero",         muted: false },
    { label: "Voyages",      href: "#capabilities",  muted: true  },
    { label: "Worlds",       href: "#features",      muted: true  },
    { label: "Innovation",   href: "#process",       muted: true  },
    { label: "Plan Launch",  href: "#cta",           muted: true  },
  ],
  navCtaLabel: "Claim a Spot",
  headline: "Venture Past Our Sky Across the Universe",
  headlineItalicFragments: ["Past Our Sky", "the Universe"],
  description: "Discover the universe in ways once unimaginable. Our pioneering vessels and breakthrough engineering bring deep-space exploration within reach — secure and extraordinary.",
  heroCtaLabel: "Start Your Voyage",
  videoUrl: HERO_VIDEO_URL,
  stats: [
    { value: "34.5 Min", label: "Average videos watch time" },
    { value: "2.8B+",    label: "Users across the globe" },
  ],
  process: [
    { step: "01", title: "Choose Your Mission", body: "Select from crewed expeditions, orbital stays, or deep-space voyages. Every journey is tailored to your timeline and ambition." },
    { step: "02", title: "Prepare for Launch", body: "Our crew guides you through immersive pre-flight training, health optimization, and mission briefing over 6 weeks." },
    { step: "03", title: "Experience the Infinite", body: "Launch aboard our next-generation vessel. Return changed by what only a fraction of humanity has ever witnessed." },
  ],
  featuresTitle: "Capabilities evolved",
  features: [
    { title: "AI Scenery", body: "AI analyzes your destination to create indistinguishable natural environments — from Icelandic craters to the surface of Mars." },
    { title: "Batch Production", body: "Style your entire mission in minutes. Unified visual identity for catalogues, briefings, and live social streams without weeks of retouching." },
    { title: "Smart Lighting", body: "Automatic lighting and material adjustment. Achieve flawless integration with realistic shadows and solar illumination in any orbit." },
  ],
  testimonials: [
    { quote: "The moment we cleared the atmosphere, I understood why the founders chose this path. Nothing on Earth prepares you for that perspective. Transformative doesn't begin to cover it.", name: "Elena M.", role: "Mission passenger · 2025" },
    { quote: "Aethera's engineering team is decades ahead. Every system redundancy, every comfort detail — it felt both impossibly advanced and completely inevitable. The future arrived.", name: "James K.", role: "Aerospace journalist" },
  ],
  ctaHeadline: "Your voyage awaits.",
  ctaBody: "Limited berths for the maiden crewed voyage. Reserve your seat before the roster closes.",
  ctaButtonLabel: "Claim a Spot",
};

// ─── FadingVideo component ───────────────────────────────────────────────────

interface FadingVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

function FadingVideo({ src, className, style }: FadingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef   = useRef<number>(0);
  const fadingOutRef = useRef(false);
  const FADE_MS = 500;
  const FADE_OUT_LEAD = 0.55;

  const fadeTo = useCallback((video: HTMLVideoElement, target: number, duration: number) => {
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const from  = parseFloat(video.style.opacity || "0");
    const step  = () => {
      const t = Math.min((performance.now() - start) / duration, 1);
      video.style.opacity = String(from + (target - from) * t);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      video.style.opacity = "0";
      video.play().catch(() => {});
      fadeTo(video, 1, FADE_MS);
    };
    const onTimeUpdate = () => {
      if (!video.duration) return;
      if (!fadingOutRef.current && video.duration - video.currentTime <= FADE_OUT_LEAD && video.duration - video.currentTime > 0) {
        fadingOutRef.current = true;
        fadeTo(video, 0, FADE_MS);
      }
    };
    const onEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        fadingOutRef.current = false;
        video.play().catch(() => {});
        fadeTo(video, 1, FADE_MS);
      }, 100);
    };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended",      onEnded);
    video.style.opacity = "0";

    return () => {
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended",      onEnded);
    };
  }, [fadeTo]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={className}
      style={{ ...style, opacity: 0 }}
    />
  );
}

// ─── BlurText component ───────────────────────────────────────────────────────

function BlurText({ text, className }: { text: string; className?: string }) {
  const ref    = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const words  = text.split(" ");

  return (
    <p ref={ref} className={className} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: "0.1em" }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={inView
            ? { filter: "blur(0px)", opacity: 1, y: 0 }
            : { filter: "blur(10px)", opacity: 0, y: 50 }}
          transition={{ duration: 0.7, delay: (i * 100) / 1000, ease: "easeOut" }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

// ─── Liquid glass CSS injected once ──────────────────────────────────────────

const LIQUID_GLASS_CSS = `
.lg { background: rgba(255,255,255,0.01); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); border: none; box-shadow: inset 0 1px 1px rgba(255,255,255,0.1); position: relative; overflow: hidden; }
.lg::before { content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1.4px; background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
.lgs { backdrop-filter: blur(50px); -webkit-backdrop-filter: blur(50px); box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15); }
.lgs::before { background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.2) 80%, rgba(255,255,255,0.5) 100%); }
@keyframes f2-ken-burns {
  0%   { transform: scale(1.0)  translate(0%,    0%);   }
  20%  { transform: scale(1.04) translate(-0.8%, -0.5%); }
  45%  { transform: scale(1.08) translate(-1.6%, -1%);  }
  70%  { transform: scale(1.05) translate(-0.8%, -0.5%); }
  100% { transform: scale(1.0)  translate(0%,    0%);   }
}
.f2-ken-burns {
  animation: f2-ken-burns 28s cubic-bezier(0.45,0,0.55,1) infinite;
  transform-origin: center center;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  will-change: transform;
}
`;

function LiquidGlassStyles() {
  return <style>{LIQUID_GLASS_CSS}</style>;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowUpRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

// Feature card icons
const FEATURE_ICONS = [
  // Image (scenery)
  <svg key="img" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z"/></svg>,
  // Movie
  <svg key="mov" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z"/></svg>,
  // Lightbulb
  <svg key="bulb" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z"/></svg>,
];

const FEATURE_TAGS = [
  ["Natural Context", "Photo Realism", "Infinite Settings", "Eco-Vibe"],
  ["Scale Fast", "Visual Consistency", "Time Saver", "Ready to Post"],
  ["Ray Tracing", "Physical Shadows", "Studio Quality", "Sunlight Sync"],
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function Foundation2({ slots = DEFAULT_F2_SLOTS }: { slots?: Foundation2Slots }) {
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id.replace("#", ""));
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const features     = slots.features     ?? [];
  const testimonials = slots.testimonials ?? [];
  const stats        = slots.stats        ?? DEFAULT_F2_SLOTS.stats;
  const process      = slots.process      ?? DEFAULT_F2_SLOTS.process;

  // Map generated nav items to real F2 section IDs (prevents broken scroll + pill overflow).
  // Skip "Home" (index 0, logo handles it). Take max 3 middle sections.
  const F2_ANCHORS = ["#capabilities", "#process", "#testimonials"];
  const navItems = slots.navItems
    .slice(1, 4)
    .map((item, i) => ({ ...item, href: F2_ANCHORS[i] ?? "#capabilities" }));

  const fadeUp = { initial: { filter: "blur(10px)", opacity: 0, y: 20 }, animate: { filter: "blur(0px)", opacity: 1, y: 0 } };

  return (
    <div style={{ fontFamily: BODY, background: "#000", color: "#fff", minHeight: "100vh" }}>
      <LiquidGlassStyles />

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section id="hero" style={{ position: "relative", minHeight: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* Hero background — Flux image (topic-specific, animated) or default Higgsfield video */}
        {slots.imageUrl ? (
          <>
            <div style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", width: "130%", height: "130%", zIndex: 0, overflow: "hidden" }}>
              <img src={slots.imageUrl} alt="" aria-hidden="true" className="f2-ken-burns" />
            </div>
            {/* Cinematic dark overlay for text legibility */}
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)", pointerEvents: "none" }} />
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)", pointerEvents: "none" }} />
          </>
        ) : (
          <FadingVideo
            src={HERO_VIDEO_URL}
            className="absolute"
            style={{ left: "50%", top: 0, transform: "translateX(-50%)", width: "120%", height: "120%", objectFit: "cover", objectPosition: "top", zIndex: 0 }}
          />
        )}

        {/* z-10 content layer */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", flex: 1, minHeight: "100vh" }}>

          {/* Navbar */}
          <nav style={{ position: "fixed", top: "1rem", left: 0, right: 0, zIndex: 50, padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ maxWidth: "72rem", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

              {/* Logo */}
              <button
                onClick={() => scrollTo("#hero")}
                className="lg"
                style={{ height: 40, borderRadius: "9999px", padding: "0 1rem", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
              >
                <span style={{ fontFamily: SERIF, fontSize: "1rem", fontStyle: "italic", lineHeight: 1, whiteSpace: "nowrap" }}>
                  {slots.logoText || "Aethera®"}
                </span>
              </button>

              {/* Nav links — capped at 3 items, mapped to real section IDs */}
              <div className="lg" style={{ borderRadius: "9999px", padding: "0.375rem 0.375rem", display: "flex", alignItems: "center", gap: "0", flexShrink: 0 }}>
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollTo(item.href)}
                    style={{ padding: "0.5rem 0.75rem", fontSize: "0.875rem", fontWeight: 500, color: "rgba(255,255,255,0.9)", background: "none", border: "none", cursor: "pointer", fontFamily: BODY, borderRadius: "9999px", whiteSpace: "nowrap" }}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => scrollTo("#cta")}
                  style={{ marginLeft: "0.25rem", padding: "0.5rem 1rem", borderRadius: "9999px", background: "#fff", color: "#000", fontSize: "0.875rem", fontWeight: 500, fontFamily: BODY, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", whiteSpace: "nowrap" }}
                >
                  {slots.navCtaLabel} <ArrowUpRight />
                </button>
              </div>

              {/* Back to Orchestra */}
              <Link
                href="/projects"
                style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", textDecoration: "none", letterSpacing: "0.01em", transition: "color 0.15s", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
              >
                ← Orchestra
              </Link>
            </div>
          </nav>

          {/* Hero content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6rem 1.5rem 0", textAlign: "center", paddingTop: "8rem" }}>

            {/* Badge */}
            <motion.div {...fadeUp} transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              className="lg"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", borderRadius: "9999px", padding: "0.375rem 0.75rem 0.375rem 0.375rem", marginBottom: "2rem" }}
            >
              <span style={{ background: "#fff", color: "#000", borderRadius: "9999px", padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: 600, fontFamily: BODY }}>New</span>
              <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.9)", fontFamily: BODY }}>Maiden Crewed Voyage to Mars Arrives 2026</span>
            </motion.div>

            {/* Headline */}
            <BlurText
              text={slots.headline}
              className="f2-headline"
            />
            <style>{`.f2-headline { font-family: ${SERIF}; font-style: italic; color: #fff; font-size: clamp(3rem, 7vw, 5.5rem); line-height: 0.8; letter-spacing: -4px; max-width: 44rem; margin: 0 auto; }`}</style>

            {/* Subheading */}
            <motion.p {...fadeUp} transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
              style={{ marginTop: "1.5rem", fontSize: "0.9375rem", color: "#fff", maxWidth: "38rem", fontFamily: BODY, fontWeight: 300, lineHeight: 1.6 }}
            >
              {slots.description}
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp} transition={{ delay: 1.1, duration: 0.6, ease: "easeOut" }}
              style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "2rem" }}
            >
              <button
                onClick={() => scrollTo("#cta")}
                className="lg lgs"
                style={{ borderRadius: "9999px", padding: "0.625rem 1.25rem", fontSize: "0.875rem", fontWeight: 500, color: "#fff", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: BODY }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {slots.heroCtaLabel} <ArrowUpRight />
              </button>
              <button
                onClick={() => scrollTo("#capabilities")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: "0.875rem", fontFamily: BODY, display: "flex", alignItems: "center", gap: "0.375rem" }}
              >
                View Liftoff <PlayIcon />
              </button>
            </motion.div>

            {/* Stats cards */}
            <motion.div {...fadeUp} transition={{ delay: 1.3, duration: 0.6, ease: "easeOut" }}
              style={{ display: "flex", alignItems: "stretch", gap: "1rem", marginTop: "2.5rem" }}
            >
              {stats.map((s, i) => (
                <div key={i} className="lg"
                  style={{ padding: "1.25rem", width: "220px", borderRadius: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    {i === 0
                      ? <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>
                      : <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>
                    }
                  </svg>
                  <p style={{ fontFamily: SERIF, fontSize: "2.25rem", fontStyle: "italic", color: "#fff", letterSpacing: "-1px", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: "0.75rem", color: "#fff", fontFamily: BODY, fontWeight: 300, marginTop: "0.25rem" }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Partners */}
          <motion.div {...fadeUp} transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", paddingBottom: "2.5rem", marginTop: "2rem" }}
          >
            <div className="lg" style={{ borderRadius: "9999px", padding: "0.25rem 0.875rem", fontSize: "0.75rem", fontWeight: 500, color: "#fff", fontFamily: BODY }}>
              Collaborating with top aerospace pioneers globally
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
              {["Aeon", "Vela", "Apex", "Orbit", "Zeno"].map((name) => (
                <span key={name} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.5rem", color: "#fff", letterSpacing: "-1px" }}>{name}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CAPABILITIES SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section id="capabilities" style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>

        <FadingVideo
          src={CAPABILITIES_VIDEO_URL}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />

        <div style={{ position: "relative", zIndex: 10, padding: "6rem 2rem 2.5rem", display: "flex", flexDirection: "column", minHeight: "100vh", maxWidth: "80rem", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: "auto" }}>
            <p style={{ fontSize: "0.875rem", fontFamily: BODY, color: "rgba(255,255,255,0.8)", marginBottom: "1.5rem" }}>// Capabilities</p>
            <h2 style={{ fontFamily: SERIF, fontStyle: "italic", color: "#fff", fontSize: "clamp(3.5rem, 8vw, 6rem)", lineHeight: 0.9, letterSpacing: "-3px" }}>
              {slots.featuresTitle || "Capabilities"}<br />evolved
            </h2>
          </div>

          {/* Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "4rem" }}>
            {features.map((f, i) => (
              <div key={i} className="lg"
                style={{ borderRadius: "1.25rem", padding: "1.5rem", minHeight: "360px", display: "flex", flexDirection: "column" }}
              >
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                  <div className="lg" style={{ width: 44, height: 44, borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                    {FEATURE_ICONS[i % FEATURE_ICONS.length]}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "0.375rem", maxWidth: "70%" }}>
                    {(FEATURE_TAGS[i % FEATURE_TAGS.length]).map((tag) => (
                      <span key={tag} className="lg"
                        style={{ borderRadius: "9999px", padding: "0.25rem 0.75rem", fontSize: "11px", color: "rgba(255,255,255,0.9)", fontFamily: BODY, whiteSpace: "nowrap" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Bottom */}
                <div style={{ marginTop: "1.5rem" }}>
                  <h3 style={{ fontFamily: SERIF, fontStyle: "italic", color: "#fff", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", letterSpacing: "-1px", lineHeight: 1 }}>
                    {f.title}
                  </h3>
                  <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.9)", fontFamily: BODY, fontWeight: 300, lineHeight: 1.55, maxWidth: "32ch" }}>
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PROCESS
      ═══════════════════════════════════════════════════════════ */}
      {process.length > 0 && (
        <section id="process" style={{ padding: "8rem 2rem", maxWidth: "80rem", margin: "0 auto" }}>
          <p style={{ fontSize: "0.875rem", fontFamily: BODY, color: "rgba(255,255,255,0.5)", marginBottom: "4rem" }}>// How it works</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {process.map((p, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "3rem", padding: "3rem 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "3rem", color: "rgba(255,255,255,0.15)", lineHeight: 1, letterSpacing: "-2px" }}>{p.step}</p>
                <div>
                  <h3 style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.75rem", color: "#fff", marginBottom: "1rem", lineHeight: 1 }}>{p.title}</h3>
                  <p style={{ fontFamily: BODY, fontSize: "0.9375rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: "40rem", fontWeight: 300 }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section id="testimonials" style={{ padding: "8rem 2rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
            <p style={{ fontSize: "0.875rem", fontFamily: BODY, color: "rgba(255,255,255,0.5)", marginBottom: "4rem" }}>// What they say</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "5rem" }}>
              {testimonials.map((t, i) => (
                <div key={i} style={{ textAlign: i % 2 === 0 ? "left" : "right", paddingLeft: i % 2 === 0 ? "0" : "4rem", paddingRight: i % 2 === 0 ? "4rem" : "0" }}>
                  <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(1.375rem, 2.5vw, 2rem)", color: "#fff", lineHeight: 1.4, marginBottom: "1.5rem" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "2rem", height: "1px", background: "rgba(255,255,255,0.4)" }} />
                    <p style={{ fontFamily: BODY, fontSize: "0.875rem", color: "#fff", fontWeight: 500 }}>{t.name}</p>
                    {t.role && <p style={{ fontFamily: BODY, fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>{t.role}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════════ */}
      {slots.ctaHeadline && (
        <section id="cta" style={{ padding: "10rem 2rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
            <h2 style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#fff", lineHeight: 1, letterSpacing: "-2px", marginBottom: "1.75rem" }}>
              {slots.ctaHeadline}
            </h2>
            {slots.ctaBody && (
              <p style={{ fontFamily: BODY, fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "3rem", fontWeight: 300 }}>
                {slots.ctaBody}
              </p>
            )}
            <button
              className="lg lgs"
              style={{ borderRadius: "9999px", padding: "1rem 3rem", fontSize: "1rem", fontWeight: 500, color: "#fff", background: "none", border: "none", cursor: "pointer", fontFamily: BODY }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {slots.ctaButtonLabel || slots.heroCtaLabel}
            </button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ padding: "2.5rem 2rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "80rem", margin: "0 auto" }}>
        <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1rem", color: "#fff" }}>{slots.logoText}</p>
        <p style={{ fontFamily: BODY, fontSize: "0.8125rem", color: "rgba(255,255,255,0.3)" }}>© {new Date().getFullYear()} — All rights reserved</p>
        <button onClick={() => scrollTo("#cta")} style={{ fontFamily: BODY, fontSize: "0.8125rem", color: "rgba(255,255,255,0.6)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
          {slots.navCtaLabel}
        </button>
      </footer>
    </div>
  );
}
