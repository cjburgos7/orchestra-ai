"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
import type { GeneratedSections, StartupBrief } from "@/lib/types/startup";
import type { WorldV2Package, V2Section, V2ImageSlot } from "@/lib/world-v2";
import { useHeroParallax, parallaxTransform } from "../direction-engine/shared/useScrollParallax";

// Premium easing curves from 21st.dev patterns
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;

type Props = {
  brief: StartupBrief;
  sections: GeneratedSections;
  world: WorldV2Package;
  isPreview?: boolean;
};

function V2Image({
  image,
  className = "",
  priority = false,
  overlay = "cinematic",
  meshFrom,
  meshTo,
}: {
  image: V2ImageSlot;
  className?: string;
  priority?: boolean;
  overlay?: "cinematic" | "light" | "strong" | "none";
  meshFrom: string;
  meshTo: string;
}) {
  const [failed, setFailed] = useState(false);
  const overlayStyle = {
    cinematic: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)",
    light: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)",
    strong: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
    none: "none",
  }[overlay];

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${meshFrom}, ${meshTo})` }}
    >
      {!failed && (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          className="object-cover"
          priority={priority}
          sizes="(max-width: 768px) 100vw, 80vw"
          onError={() => setFailed(true)}
        />
      )}
      {overlay !== "none" && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: overlayStyle }} aria-hidden />
      )}
    </div>
  );
}

/** True full-viewport cinematic hero — photo fills the world, text is editorial */
function HeroCinematic({ world, sections, parallax }: { world: WorldV2Package; sections: GeneratedSections; parallax: number }) {
  const img = world.sections.find((s) => s.type === "hero-cinematic")?.images[0] ?? world.heroImage;

  const heroText = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
  };
  const heroItem = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: EASE_OUT_EXPO } },
  };

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: "600px", color: "#fff" }}>
      {/* Ken Burns entrance + scroll parallax on image */}
      <div className="absolute inset-0" style={{ transform: parallaxTransform(0.55, parallax, 100) }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
        >
          <V2Image image={img} priority overlay="strong" meshFrom={world.meshFrom} meshTo={world.meshTo} className="absolute inset-0" />
        </motion.div>
      </div>

      {/* Accent color wash at top */}
      <motion.div
        className="absolute inset-x-0 top-0 h-64 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.1 }}
        style={{ background: `linear-gradient(to bottom, ${world.accentColor}28 0%, transparent 100%)` }}
        aria-hidden
      />

      {/* Bottom editorial text block — staggered reveal */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 px-6 md:px-14 pb-12 md:pb-16"
        variants={heroText}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.div variants={heroItem} className="flex items-center gap-3 mb-5">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.22em] px-3 py-1 rounded-full"
            style={{ background: world.accentColor, color: "#fff" }}
          >
            {world.categoryLabel}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest opacity-60">{sections.hero.eyebrow}</span>
        </motion.div>

        {/* Main headline — editorial scale */}
        <motion.h1
          variants={heroItem}
          className="mb-5 max-w-5xl"
          style={{
            fontFamily: world.typography.displayFamily,
            fontWeight: world.typography.displayWeight,
            letterSpacing: world.typography.displayTracking,
            fontSize: world.typography.headlineScale,
            lineHeight: "0.95",
            color: "#fff",
          }}
        >
          {sections.hero.headline}
        </motion.h1>

        <motion.div variants={heroItem} className="flex flex-col sm:flex-row sm:items-end gap-6">
          <p className="text-sm md:text-base max-w-sm opacity-80 leading-relaxed">
            {sections.hero.subheadline}
          </p>
          <div className="flex gap-3 shrink-0">
            <motion.span
              className="text-sm font-bold px-6 py-3 rounded-full cursor-pointer"
              style={{ background: world.accentColor, color: "#fff" }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {sections.hero.ctaPrimary}
            </motion.span>
            <span className="text-sm font-medium px-6 py-3 rounded-full border border-white/30 text-white/90">
              {sections.hero.ctaSecondary}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 right-8 z-10 hidden md:flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span className="text-white text-[9px] uppercase tracking-widest" style={{ writingMode: "vertical-rl" }}>Scroll</span>
        <motion.div
          className="w-px bg-white/50"
          initial={{ height: 0 }}
          animate={{ height: 40 }}
          transition={{ delay: 1.8, duration: 0.6, ease: "easeOut" }}
        />
      </motion.div>
    </section>
  );
}

/** Split hero: image-dominant 60/40, text panel with accent border, large headline */
function HeroSplitKinetic({ world, sections, parallax }: { world: WorldV2Package; sections: GeneratedSections; parallax: number }) {
  const sec = world.sections.find((s) => s.type === "hero-split-kinetic");
  const imgs = sec?.images.length ? sec.images : [world.heroImage];

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: world.background, color: world.foreground, minHeight: "100svh" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[42%_58%] h-full" style={{ minHeight: "100svh" }}>
        {/* Text panel — left, 42% */}
        <div className="relative flex flex-col justify-center px-8 md:px-12 py-24 lg:py-16 order-2 lg:order-1">
          {/* Left accent rule */}
          <div
            className="absolute left-0 top-1/4 bottom-1/4 w-[3px] hidden lg:block"
            style={{ background: `linear-gradient(to bottom, transparent, ${world.accentColor}, transparent)` }}
            aria-hidden
          />

          {/* Category eyebrow */}
          <motion.p
            className="text-[10px] font-bold uppercase tracking-[0.25em] mb-6"
            style={{ color: world.accentColor }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.1 }}
          >
            {world.categoryLabel} · {world.variantLabel}
          </motion.p>

          {/* Headline — breaks large */}
          <motion.h1
            className="mb-8"
            style={{
              fontFamily: world.typography.displayFamily,
              fontWeight: world.typography.displayWeight,
              letterSpacing: world.typography.displayTracking,
              fontSize: world.typography.headlineScale,
              lineHeight: "1.0",
              color: world.foreground,
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: EASE_OUT_EXPO, delay: 0.2 }}
          >
            {sections.hero.headline}
          </motion.h1>

          {/* Thin rule */}
          <motion.div
            className="h-px mb-6"
            style={{ background: world.accentColor }}
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
          />

          <motion.p
            className="text-sm md:text-base opacity-65 max-w-xs mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.35 }}
          >
            {sections.hero.subheadline}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.48 }}
          >
            <motion.span
              className="text-sm font-bold px-6 py-3 rounded-full text-white cursor-pointer"
              style={{ background: world.accentColor }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {sections.hero.ctaPrimary}
            </motion.span>
            <span
              className="text-sm font-medium px-6 py-3 rounded-full border"
              style={{ borderColor: `${world.foreground}20`, color: world.foreground }}
            >
              {sections.hero.ctaSecondary}
            </span>
          </motion.div>
        </div>

        {/* Photo panel — right, 58%, full-bleed no padding */}
        <div className="relative min-h-[60vw] lg:min-h-full order-1 lg:order-2 overflow-hidden">
          <div className="absolute inset-0" style={{ transform: parallaxTransform(0.3, parallax) }}>
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1.0 }}
              transition={{ duration: 2.0, ease: "easeOut" }}
            >
              <V2Image
                image={imgs[0]}
                priority
                overlay="none"
                meshFrom={world.meshFrom}
                meshTo={world.meshTo}
                className="absolute inset-0"
              />
            </motion.div>
          </div>
          {/* Blend toward text panel on desktop */}
          <div
            className="absolute inset-y-0 left-0 w-20 hidden lg:block pointer-events-none"
            style={{ background: `linear-gradient(to right, ${world.background}, transparent)` }}
            aria-hidden
          />
          {/* Floating secondary image — FM float animation */}
          {imgs[1] && (
            <motion.div
              className="absolute bottom-12 left-8 w-[36%] aspect-[4/5] overflow-hidden shadow-2xl hidden md:block"
              style={{
                transform: parallaxTransform(-0.2, parallax, 30),
                border: `2px solid ${world.accentColor}40`,
                borderRadius: "12px",
              }}
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.6 }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <V2Image image={imgs[1]} overlay="light" meshFrom={world.meshFrom} meshTo={world.meshTo} className="absolute inset-0" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * HERO: Editorial Luxury — Motion Sites DNA
 * Text dominates. Image lives below the fold as a teaser.
 * Instrument Serif at massive scale. Color-split headline. Staggered fade-rise.
 * Used by: floral, fashion, wellness.
 */
function HeroEditorialLuxury({ world, sections, parallax }: { world: WorldV2Package; sections: GeneratedSections; parallax: number }) {
  const img = world.sections.find((s) => s.type === "hero-editorial-luxury")?.images[0] ?? world.heroImage;
  const words = sections.hero.headline.split(" ");
  const pivotIdx = Math.max(1, Math.ceil(words.length * 0.55));

  return (
    <section
      style={{
        background: world.background,
        color: world.foreground,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Centered editorial text block — takes priority in the viewport */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          flex: "0 0 auto",
          padding: "calc(8rem - 75px) 2rem 4rem",
          textAlign: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Category eyebrow — horizontal rule + label */}
        <motion.div
          style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "3rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.15 }}
        >
          <div style={{ width: 40, height: 1, background: `${world.accentColor}60` }} />
          <span style={{
            fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.3em", color: world.accentColor,
          }}>
            {world.categoryLabel}
          </span>
          <div style={{ width: 40, height: 1, background: `${world.accentColor}60` }} />
        </motion.div>

        {/* Massive headline — Instrument Serif, color-split */}
        <motion.h1
          style={{
            fontFamily: world.typography.displayFamily,
            fontWeight: world.typography.displayWeight,
            fontSize: world.typography.headlineScale,
            letterSpacing: "-0.025em",
            lineHeight: 0.95,
            maxWidth: "900px",
            marginBottom: "2.5rem",
            color: world.foreground,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: EASE_OUT_EXPO, delay: 0.25 }}
        >
          {/* First half — full foreground */}
          <span>{words.slice(0, pivotIdx).join(" ")}</span>
          {/* Second half — accent tint for editorial art direction */}
          {words.length > pivotIdx && (
            <span style={{ color: world.accentColor }}>{" "}{words.slice(pivotIdx).join(" ")}</span>
          )}
        </motion.h1>

        {/* Thin decorative rule */}
        <motion.div
          style={{ height: 1, background: `${world.foreground}25`, marginBottom: "2rem" }}
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.68 }}
        />

        {/* Subheadline */}
        <motion.p
          style={{
            fontSize: "1rem", lineHeight: 1.75, maxWidth: "40ch",
            opacity: 0.55, marginBottom: "2.75rem", color: world.foreground,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.4 }}
        >
          {sections.hero.subheadline}
        </motion.p>

        {/* CTAs — editorial: outlined primary, text secondary */}
        <motion.div
          style={{ display: "flex", gap: "1rem", alignItems: "center" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.52 }}
        >
          <motion.span
            style={{
              fontSize: "0.875rem", fontWeight: 500, padding: "0.9rem 2.75rem",
              borderRadius: "9999px", border: `1.5px solid ${world.foreground}`,
              cursor: "pointer", color: world.foreground, display: "inline-block",
            }}
            whileHover={{ background: world.foreground, color: world.background }}
            transition={{ duration: 0.2 }}
          >
            {sections.hero.ctaPrimary}
          </motion.span>
          <span style={{ fontSize: "0.875rem", opacity: 0.4, color: world.foreground }}>
            {sections.hero.ctaSecondary}
          </span>
        </motion.div>
      </div>

      {/* Image — below the text, visible as a teaser. This is NOT background. */}
      <motion.div
        style={{
          position: "relative",
          height: "52vh",
          overflow: "hidden",
          flex: "0 0 auto",
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, ease: EASE_OUT_EXPO, delay: 0.6 }}
      >
        {/* Top edge fade into background */}
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
            background: `linear-gradient(to bottom, ${world.background} 0%, transparent 28%)`,
          }}
          aria-hidden
        />
        <div style={{ transform: parallaxTransform(0.3, parallax, 60) }} className="absolute inset-0">
          <V2Image image={img} overlay="light" meshFrom={world.meshFrom} meshTo={world.meshTo} className="absolute inset-0" />
        </div>
      </motion.div>
    </section>
  );
}

/**
 * HERO: Athletic — Sports/Fitness specific
 * Stats-first hierarchy. Raw full-bleed image on the right with NO gradient blend.
 * Left panel: performance metrics at top, then headline, then CTA.
 * Hard architectural edge between panels — not a soft split.
 * Used by: sports, fitness.
 */
function HeroAthletic({ world, sections, parallax, brief }: { world: WorldV2Package; sections: GeneratedSections; parallax: number; brief: StartupBrief }) {
  const sec = world.sections.find((s) => s.type === "hero-athletic");
  const imgs = sec?.images.length ? sec.images : [world.heroImage];
  const price = brief.pricing.tiers[0]?.price ?? "$29";
  const featureCount = brief.features?.length ?? 4;

  return (
    <section
      style={{
        background: world.background,
        color: world.foreground,
        minHeight: "100svh",
        display: "grid",
        gridTemplateColumns: "45% 55%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* LEFT PANEL — stats-first */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "7rem 3rem 5rem 3.5rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Performance stats row — at the TOP, before the headline */}
        <motion.div
          style={{ display: "flex", gap: "2rem", marginBottom: "2.5rem" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.1 }}
        >
          {[
            { val: `${featureCount * 3}k+`, label: "Athletes" },
            { val: price, label: "Starting" },
            { val: `${85 + featureCount}%`, label: "Win rate" },
          ].map((stat, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: i === 0 ? world.accentColor : world.foreground,
                  lineHeight: 1,
                }}
              >
                {stat.val}
              </div>
              <div style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.18em", opacity: 0.45, marginTop: "0.25rem" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Accent divider */}
        <motion.div
          style={{ width: "100%", height: 1, background: `${world.foreground}18`, marginBottom: "1.75rem" }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        />

        {/* Headline — bold, large, tight tracking */}
        <motion.h1
          style={{
            fontFamily: world.typography.displayFamily,
            fontWeight: world.typography.displayWeight,
            letterSpacing: world.typography.displayTracking,
            fontSize: world.typography.headlineScale,
            lineHeight: 1.0,
            color: world.foreground,
            marginBottom: "1.5rem",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.2 }}
        >
          {sections.hero.headline}
        </motion.h1>

        <motion.p
          style={{ fontSize: "0.9rem", opacity: 0.5, maxWidth: "34ch", lineHeight: 1.65, marginBottom: "2.5rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.38 }}
        >
          {sections.hero.subheadline}
        </motion.p>

        <motion.div
          style={{ display: "flex", gap: "0.75rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.5 }}
        >
          <motion.span
            style={{
              fontSize: "0.875rem", fontWeight: 700, padding: "0.85rem 2rem",
              borderRadius: "6px", background: world.accentColor, color: "#fff",
              cursor: "pointer", display: "inline-block", letterSpacing: "0.02em",
            }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {sections.hero.ctaPrimary}
          </motion.span>
          <span
            style={{
              fontSize: "0.875rem", fontWeight: 500, padding: "0.85rem 1.5rem",
              borderRadius: "6px", border: `1px solid ${world.foreground}25`,
              color: world.foreground, display: "inline-block",
            }}
          >
            {sections.hero.ctaSecondary}
          </span>
        </motion.div>
      </div>

      {/* RIGHT PANEL — full-bleed image, NO gradient blend into text */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ transform: parallaxTransform(0.25, parallax) }} className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 2.0, ease: "easeOut" }}
          >
            <V2Image
              image={imgs[0]}
              priority
              overlay="none"
              meshFrom={world.meshFrom}
              meshTo={world.meshTo}
              className="absolute inset-0"
            />
          </motion.div>
        </div>
        {/* Accent bar on left edge of image — architectural seam marker */}
        <div
          style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
            background: world.accentColor, zIndex: 5,
          }}
          aria-hidden
        />
      </div>

      {/* Category label — vertical, bottom right */}
      <motion.div
        style={{
          position: "absolute", bottom: "2.5rem", right: "2rem", zIndex: 10,
          writingMode: "vertical-rl", textOrientation: "mixed",
          fontSize: "9px", fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.2em", opacity: 0.35, color: "#fff",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 1.2, duration: 0.7 }}
      >
        {world.categoryLabel} · {sections.hero.eyebrow}
      </motion.div>
    </section>
  );
}

/**
 * HERO: Product SaaS — Information-dense, product-frame right, feature tags below
 * Two-column: headline/sub/CTA left, stylized product frame right.
 * Feature capability tags below the main content.
 * Used by: saas (launch variant), education.
 */
function HeroProductSaaS({ world, sections, brief }: { world: WorldV2Package; sections: GeneratedSections; brief: StartupBrief }) {
  const img = world.sections.find((s) => s.type === "hero-product-saas")?.images[0] ?? world.heroImage;
  const featureTags = (brief.features ?? []).slice(0, 4);

  return (
    <section
      style={{
        background: world.background,
        color: world.foreground,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "6rem 3.5rem 4rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid background */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(${world.foreground}06 1px, transparent 1px), linear-gradient(90deg, ${world.foreground}06 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
        aria-hidden
      />

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "52% 48%",
          gap: "3rem",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Left: text */}
        <div>
          <motion.div
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: `${world.accentColor}15`, border: `1px solid ${world.accentColor}35`,
              borderRadius: "9999px", padding: "0.35rem 0.85rem",
              marginBottom: "2rem",
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: world.accentColor }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: world.accentColor, letterSpacing: "0.05em" }}>
              {world.categoryLabel}
            </span>
          </motion.div>

          <motion.h1
            style={{
              fontFamily: world.typography.displayFamily,
              fontWeight: world.typography.displayWeight,
              letterSpacing: world.typography.displayTracking,
              fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
              lineHeight: 1.05,
              color: world.foreground,
              marginBottom: "1.5rem",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.2 }}
          >
            {sections.hero.headline}
          </motion.h1>

          <motion.p
            style={{
              fontSize: "1rem", lineHeight: 1.7, opacity: 0.58,
              maxWidth: "42ch", marginBottom: "2.5rem",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.32 }}
          >
            {sections.hero.subheadline}
          </motion.p>

          <motion.div
            style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.44 }}
          >
            <motion.span
              style={{
                fontSize: "0.875rem", fontWeight: 700, padding: "0.8rem 2rem",
                borderRadius: "8px", background: world.accentColor, color: "#fff",
                cursor: "pointer",
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {sections.hero.ctaPrimary}
            </motion.span>
            <span
              style={{
                fontSize: "0.875rem", fontWeight: 500, padding: "0.8rem 1.75rem",
                borderRadius: "8px", border: `1px solid ${world.foreground}20`,
                color: world.foreground,
              }}
            >
              {sections.hero.ctaSecondary}
            </span>
          </motion.div>

          {/* Feature capability tags */}
          {featureTags.length > 0 && (
            <motion.div
              style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "2.5rem" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
            >
              {featureTags.map((f, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "11px", fontWeight: 500,
                    padding: "0.3rem 0.75rem", borderRadius: "9999px",
                    background: `${world.foreground}08`,
                    border: `1px solid ${world.foreground}14`,
                    color: world.foreground, opacity: 0.7,
                  }}
                >
                  {typeof f === "string" ? f.split(":")[0]?.split(" ").slice(0, 3).join(" ") : `Feature ${i + 1}`}
                </span>
              ))}
            </motion.div>
          )}
        </div>

        {/* Right: product frame — stylized, not a real screenshot */}
        <motion.div
          style={{ position: "relative" }}
          initial={{ opacity: 0, x: 40, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.0, ease: EASE_OUT_EXPO, delay: 0.35 }}
        >
          {/* Browser chrome frame */}
          <div
            style={{
              borderRadius: "14px",
              overflow: "hidden",
              border: `1px solid ${world.foreground}18`,
              boxShadow: `0 24px 80px ${world.foreground}14, 0 8px 24px ${world.foreground}08`,
            }}
          >
            {/* Browser titlebar */}
            <div
              style={{
                padding: "0.65rem 1rem",
                background: `${world.foreground}06`,
                borderBottom: `1px solid ${world.foreground}10`,
                display: "flex", alignItems: "center", gap: "0.4rem",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              <div
                style={{
                  flex: 1, margin: "0 1rem", height: 22, borderRadius: "6px",
                  background: `${world.foreground}08`, border: `1px solid ${world.foreground}10`,
                }}
              />
            </div>
            {/* Product content area — image or mesh gradient */}
            <div style={{ aspectRatio: "16/10", position: "relative", overflow: "hidden" }}>
              <V2Image image={img} overlay="none" meshFrom={world.meshFrom} meshTo={world.meshTo} className="absolute inset-0" />
              {/* UI overlay elements */}
              <div style={{ position: "absolute", bottom: "1rem", left: "1rem", right: "1rem", display: "flex", gap: "0.5rem" }}>
                {[40, 60, 80].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      height: "4px", width: `${w}px`, borderRadius: "9999px",
                      background: i === 0 ? world.accentColor : `${world.foreground}20`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Floating metric badge */}
          <motion.div
            style={{
              position: "absolute", top: "-1rem", right: "-1rem",
              background: world.accentColor, color: "#fff",
              borderRadius: "10px", padding: "0.6rem 1rem",
              fontSize: "12px", fontWeight: 700,
              boxShadow: `0 8px 24px ${world.accentColor}50`,
            }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {brief.pricing.tiers[0]?.price ?? "$29"}/mo
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function nameHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function deriveStats(brief: StartupBrief, world: WorldV2Package) {
  const h = nameHash(brief.name ?? "startup");
  const price = brief.pricing.tiers[0]?.price ?? "$29";
  type S = [string, string, string, string];
  const map: Partial<Record<string, S>> = {
    fitness:   [`${8  + (h % 24)}k+`,    "Members",           `${78 + (h % 20)}%`,          "Retention"],
    floral:    [`${10 + (h % 50)}k+`,    "Orders delivered",  `${h % 2 ? "4.9" : "4.8"}★`,  "Avg rating"],
    finance:   [`$${1 + (h % 14)}M+`,    "Assets managed",    `+${20 + (h % 28)}%`,          "Avg return"],
    fashion:   [`${15 + (h % 65)}k+`,    "Items sold",        `${150 + (h % 300)}+`,         "Brands"],
    food:      [`${50 + (h % 180)}k+`,   "Orders",            `${200 + (h % 600)}+`,         "Restaurants"],
    saas:      [`${2  + (h % 18)}k+`,    "Teams active",      `99.${h % 2 ? "9" : "8"}%`,   "Uptime"],
    wellness:  [`${5  + (h % 22)}k+`,    "Sessions",          `${82 + (h % 16)}%`,           "Client retention"],
    sports:    [`${2  + (h % 15)}k+`,    "Athletes",          `${200 + (h % 400)}+`,         "Teams"],
    travel:    [`${5  + (h % 45)}k+`,    "Trips booked",      `${60 + (h % 120)}+`,          "Destinations"],
    home:      [`${3  + (h % 14)}k+`,    "Projects",          `${h % 2 ? "4.9" : "4.8"}★`,  "Avg rating"],
    education: [`${8  + (h % 42)}k+`,    "Students",          `${78 + (h % 20)}%`,           "Completion rate"],
    health:    [`${5  + (h % 15)}k+`,    "Patients",          `${85 + (h % 12)}%`,           "Positive outcomes"],
    creator:   [`${2  + (h % 18)}k+`,    "Creators",          `${100 + (h % 400)}k+`,        "Downloads"],
    music:     [`${200 + (h % 800)}k+`,  "Streams",           `${50 + (h % 200)}+`,          "Artists"],
    science:   [`${500 + (h % 4500)}+`,  "Experiments run",   `${15 + (h % 65)}+`,           "Research labs"],
  };
  const [primaryVal, primaryLabel, secondaryVal, secondaryLabel] =
    map[world.category] ?? [`${5 + (h % 20)}k+`, "Users", `${h % 2 ? "4.9" : "4.8"}★`, "Rating"];
  return { primaryVal, primaryLabel, secondaryVal, secondaryLabel, tertiaryVal: price };
}

/** Stats band — editorial number display, category-derived so each startup differs */
function StatsBand({ world, brief }: { world: WorldV2Package; brief: StartupBrief }) {
  const { primaryVal, primaryLabel, secondaryVal, secondaryLabel, tertiaryVal } = deriveStats(brief, world);
  const statVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.7, ease: EASE_OUT_EXPO },
    }),
  };

  return (
    <motion.section
      className="overflow-hidden"
      style={{ background: world.accentColor, color: "#fff" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <div className="px-6 md:px-14 py-8 md:py-10 flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/20">
        <motion.div className="flex flex-col pr-0 md:pr-16 pb-6 md:pb-0" custom={0} variants={statVariants}>
          <span
            className="font-black leading-none"
            style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)", letterSpacing: "-0.03em" }}
          >
            {primaryVal}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-70 mt-1">{primaryLabel}</span>
        </motion.div>

        <div className="flex gap-12 pl-0 md:pl-16 pt-6 md:pt-0">
          <motion.div custom={1} variants={statVariants}>
            <span
              className="font-black leading-none block"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.03em" }}
            >
              {secondaryVal}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-70 mt-1 block">{secondaryLabel}</span>
          </motion.div>
          <motion.div custom={2} variants={statVariants}>
            <span
              className="font-black leading-none block"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.03em" }}
            >
              {tertiaryVal}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-70 mt-1 block">Starting price</span>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

/** Feature section — full-bleed image bleeds to edge, editorial headline scale, no card containers */
function FeatureAsymmetric({
  world,
  section,
  feature,
  index,
}: {
  world: WorldV2Package;
  section: V2Section;
  feature: { title: string; description: string };
  index: number;
}) {
  const flip = index % 2 === 1;
  const img = section.images[0];
  const hasImage = !!img;
  const sectionBg = index % 2 === 0
    ? world.background
    : `linear-gradient(160deg, ${world.meshFrom}80, ${world.background} 60%)`;

  // Text-only layout when no image available — avoids repeating heroImage everywhere
  if (!hasImage) {
    return (
      <section style={{ background: sectionBg, color: world.foreground }}>
        <div className="px-8 md:px-20 py-20 md:py-28 max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-5" style={{ color: world.accentColor }}>
            Feature {String(index + 1).padStart(2, "0")}
          </p>
          <h2
            className="mb-6 leading-[1.05]"
            style={{
              fontFamily: world.typography.displayFamily,
              fontWeight: world.typography.displayWeight,
              letterSpacing: world.typography.displayTracking,
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              color: world.foreground,
            }}
          >
            {feature.title}
          </h2>
          <div className="w-10 h-[2px] mb-6" style={{ background: world.accentColor }} />
          <p className="text-base leading-relaxed" style={{ opacity: 0.65, maxWidth: "50ch" }}>
            {feature.description}
          </p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      style={{ background: sectionBg, color: world.foreground }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
    >
      <div className={`grid grid-cols-1 lg:grid-cols-2`} style={{ minHeight: "70vh" }}>
        {/* Image — full-bleed with hover scale */}
        <motion.div
          className={`relative min-h-[55vw] lg:min-h-full ${flip ? "lg:order-2" : "lg:order-1"} overflow-hidden`}
          whileHover="hover"
        >
          <motion.div
            className="absolute inset-0"
            variants={{
              hover: { scale: 1.04, transition: { duration: 0.7, ease: EASE_IN_OUT_QUART } },
            }}
          >
            <V2Image
              image={img}
              overlay="light"
              meshFrom={world.meshFrom}
              meshTo={world.meshTo}
              className="absolute inset-0"
            />
          </motion.div>
          {/* Accent strip at the bottom edge */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
            style={{ background: world.accentColor, opacity: 0.6 }}
            aria-hidden
          />
        </motion.div>

        {/* Text — generous padding, editorial scale */}
        <motion.div
          className={`flex flex-col justify-center px-8 md:px-14 py-16 md:py-20 ${flip ? "lg:order-1" : "lg:order-2"}`}
          initial={{ opacity: 0, x: flip ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.15 }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.25em] mb-5"
            style={{ color: world.accentColor }}
          >
            Feature {String(index + 1).padStart(2, "0")}
          </p>
          <h2
            className="mb-6 leading-[1.05]"
            style={{
              fontFamily: world.typography.displayFamily,
              fontWeight: world.typography.displayWeight,
              letterSpacing: world.typography.displayTracking,
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              color: world.foreground,
            }}
          >
            {feature.title}
          </h2>
          <div className="w-10 h-[2px] mb-6" style={{ background: world.accentColor }} />
          <p className="text-base leading-relaxed" style={{ opacity: 0.65, maxWidth: "38ch" }}>
            {feature.description}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}

/** Editorial mosaic — full-bleed, tight gaps, dominant first image */
function EditorialMosaic({ world, section }: { world: WorldV2Package; section: V2Section }) {
  if (section.images.length === 0) return null;
  const base = section.images.slice(0, 3);
  // Fill out to 3 by cycling from available images — no heroImage fallback
  const imgs = [
    base[0],
    base[1] ?? base[0],
    base[2] ?? base[0],
  ];

  return (
    <motion.section
      className="overflow-hidden"
      style={{ background: world.background }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7 }}
    >
      {/* Full-bleed grid, no padding */}
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: "63% 37%", gridTemplateRows: "auto auto" }}>
        {/* Large primary image — spans 2 rows */}
        <div className="row-span-2 overflow-hidden" style={{ minHeight: "clamp(280px, 65vh, 800px)" }}>
          <V2Image
            image={imgs[0]}
            overlay="light"
            meshFrom={world.meshFrom}
            meshTo={world.meshTo}
            className="h-full"
          />
        </div>
        {/* Secondary — top right */}
        <div className="overflow-hidden" style={{ minHeight: "clamp(140px, 32vh, 400px)" }}>
          <V2Image
            image={imgs[1] ?? imgs[0]}
            overlay="light"
            meshFrom={world.meshFrom}
            meshTo={world.meshTo}
            className="h-full"
          />
        </div>
        {/* Tertiary + caption — bottom right */}
        <div className="relative overflow-hidden" style={{ minHeight: "clamp(140px, 32vh, 400px)" }}>
          <V2Image
            image={imgs[2] ?? imgs[0]}
            overlay="cinematic"
            meshFrom={world.meshFrom}
            meshTo={world.meshTo}
            className="absolute inset-0"
          />
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <p className="text-white text-[10px] font-medium uppercase tracking-widest opacity-80">
              {world.categoryLabel}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/** Proof gallery — wide cards, full bleed scroll */
function ProofGallery({ world, section, title }: { world: WorldV2Package; section: V2Section; title: string }) {
  if (section.images.length === 0) return null;
  const allImages = section.images;

  return (
    <section
      className="pt-16 md:pt-20 pb-10 overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${world.meshFrom}60, ${world.background})`, color: world.foreground }}
    >
      {/* Label */}
      <div className="px-6 md:px-14 mb-8 flex items-center gap-4">
        <div className="flex-1 h-px" style={{ background: `${world.foreground}18` }} />
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-50 shrink-0">{title}</p>
        <div className="flex-1 h-px" style={{ background: `${world.foreground}18` }} />
      </div>

      {/* Scroll strip — staggered entrance, edge to edge */}
      <div className="flex gap-[3px] overflow-x-auto pb-0 snap-x snap-mandatory scrollbar-none pl-6 md:pl-14">
        {allImages.map((img, i) => (
          <motion.div
            key={`${img.id}-${i}`}
            className="snap-start shrink-0 overflow-hidden"
            style={{ width: "clamp(260px, 55vw, 420px)", aspectRatio: "3/4" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.08, duration: 0.7, ease: EASE_OUT_EXPO }}
            whileHover={{ scale: 1.02, y: -6, transition: { duration: 0.4, ease: EASE_IN_OUT_QUART } }}
          >
            <V2Image
              image={img}
              overlay="light"
              meshFrom={world.meshFrom}
              meshTo={world.meshTo}
              className="h-full w-full"
            />
          </motion.div>
        ))}
        {/* Trailing spacer */}
        <div className="shrink-0 w-6 md:w-14" aria-hidden />
      </div>
    </section>
  );
}

/** Story editorial — 60/40 image/text, pull-quote scale */
function StoryEditorial({ world, section, brief }: { world: WorldV2Package; section: V2Section; brief: StartupBrief }) {
  const img = section.images[0] ?? world.heroImage;
  return (
    <motion.section
      className="grid grid-cols-1 md:grid-cols-[60%_40%]"
      style={{ background: world.background, color: world.foreground, minHeight: "55vh" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7 }}
    >
      {/* Image — hover scale */}
      <motion.div
        className="relative min-h-[50vw] md:min-h-full overflow-hidden"
        whileHover="hover"
      >
        <motion.div
          className="absolute inset-0"
          variants={{ hover: { scale: 1.03, transition: { duration: 0.7, ease: EASE_IN_OUT_QUART } } }}
        >
          <V2Image image={img} overlay="light" meshFrom={world.meshFrom} meshTo={world.meshTo} className="absolute inset-0" />
        </motion.div>
      </motion.div>

      {/* Text — editorial pull-quote treatment */}
      <motion.div
        className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-14"
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.15 }}
      >
        <p className="text-[10px] uppercase tracking-[0.22em] mb-6" style={{ color: world.accentColor, fontWeight: 700 }}>
          Our story
        </p>
        <p
          className="leading-relaxed"
          style={{
            fontFamily: world.typography.displayFamily,
            fontSize: "clamp(1.15rem, 2.2vw, 1.6rem)",
            fontStyle: world.typography.displayFamily.includes("Georgia") ? "italic" : "normal",
            fontWeight: 400,
            opacity: 0.85,
          }}
        >
          {brief.description}
        </p>
        <motion.div
          className="mt-8 h-px"
          style={{ background: world.accentColor }}
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        />
      </motion.div>
    </motion.section>
  );
}

/** Testimonial — image at 40% opacity full-bleed, LARGE quote typography */
function TestimonialFloat({ world, sections, section }: { world: WorldV2Package; sections: GeneratedSections; section: V2Section }) {
  const t = sections.testimonials[0];
  if (!t?.quote) return null;
  const bg = section.images[0];

  return (
    <motion.section
      className="relative overflow-hidden flex items-center"
      style={{ background: world.meshFrom, color: world.foreground, minHeight: "52vh" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Background photo at low opacity */}
      {bg && (
        <div className="absolute inset-0">
          <V2Image image={bg} overlay="none" meshFrom={world.meshFrom} meshTo={world.meshTo} className="absolute inset-0" />
          <div className="absolute inset-0" style={{ background: world.meshFrom, opacity: 0.78 }} />
        </div>
      )}

      <motion.blockquote
        className="relative z-10 px-8 md:px-20 py-16 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.1 }}
      >
        {/* Large opening quotation mark */}
        <motion.div
          className="leading-none mb-4 select-none font-black"
          style={{ fontSize: "clamp(4rem, 10vw, 8rem)", color: world.accentColor, lineHeight: 1 }}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 0.4, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          aria-hidden
        >
          &ldquo;
        </motion.div>
        <p
          className="leading-tight mb-8"
          style={{
            fontFamily: world.typography.displayFamily,
            fontStyle: world.typography.displayFamily.includes("Georgia") ? "italic" : "normal",
            fontSize: "clamp(1.5rem, 3.5vw, 2.6rem)",
            fontWeight: world.typography.displayFamily.includes("Georgia") ? 400 : 600,
          }}
        >
          {t?.quote}
        </p>
        <footer className="flex items-center gap-3">
          <div className="w-8 h-[2px]" style={{ background: world.accentColor }} />
          <span className="text-sm font-semibold opacity-80">{t?.name}</span>
          <span className="text-sm opacity-40">·</span>
          <span className="text-sm opacity-60">{t?.role}</span>
        </footer>
      </motion.blockquote>
    </motion.section>
  );
}

/** CTA — true full-bleed, mouse spotlight, cinematic accent */
function CtaImmersive({ world, sections, section }: { world: WorldV2Package; sections: GeneratedSections; section: V2Section }) {
  const img = section.images[0] ?? world.heroImage;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightBg = useMotionTemplate`radial-gradient(500px at ${mouseX}px ${mouseY}px, ${world.accentColor}45 0%, transparent 70%)`;

  return (
    <motion.section
      className="relative overflow-hidden flex items-center"
      style={{ minHeight: "60vh" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Full-bleed photo with entrance scale */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.06 }}
        whileInView={{ scale: 1.0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      >
        <V2Image image={img} overlay="strong" meshFrom={world.meshFrom} meshTo={world.meshTo} className="absolute inset-0" />
      </motion.div>

      {/* Static accent wash from left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${world.accentColor}50 0%, transparent 55%)` }}
        aria-hidden
      />

      {/* Mouse-tracking spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: spotlightBg }}
        aria-hidden
      />

      {/* Text — left-aligned, staggered */}
      <motion.div
        className="relative z-10 px-8 md:px-14 py-16 max-w-2xl text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.2 }}
      >
        <h2
          className="mb-6 leading-[1.0]"
          style={{
            fontFamily: world.typography.displayFamily,
            fontWeight: world.typography.displayWeight,
            letterSpacing: world.typography.displayTracking,
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
          }}
        >
          {sections.cta.headline}
        </h2>
        <p className="text-sm md:text-base opacity-80 max-w-sm mb-8 leading-relaxed">
          {sections.cta.subheadline}
        </p>
        <motion.span
          className="inline-block text-sm font-bold px-8 py-4 rounded-full cursor-pointer"
          style={{ background: world.accentColor }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {sections.cta.buttonText}
        </motion.span>
      </motion.div>
    </motion.section>
  );
}

/** Pricing — editorial treatment with featured tier prominent */
function PricingV2({ world, brief, sections }: { world: WorldV2Package; brief: StartupBrief; sections: GeneratedSections }) {
  return (
    <section
      id="section-pricing"
      className="px-6 md:px-14 py-20 md:py-28 scroll-mt-28"
      style={{ background: world.background, color: world.foreground }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header — left aligned */}
        <div className="mb-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: world.accentColor }}>
            Pricing
          </p>
          <h2
            className="leading-tight"
            style={{
              fontFamily: world.typography.displayFamily,
              fontWeight: world.typography.displayWeight,
              letterSpacing: world.typography.displayTracking,
              fontSize: "clamp(2rem, 5vw, 4rem)",
            }}
          >
            {sections.pricing.sectionTitle}
          </h2>
          <p className="mt-3 opacity-55 max-w-sm">{sections.pricing.subtitle}</p>
        </div>

        {/* Tiers — varied visual weight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {brief.pricing.tiers.map((tier, i) => {
            const isFeatured = i === 1;
            return (
              <div
                key={tier.name}
                className="relative overflow-hidden"
                style={{
                  padding: isFeatured ? "2.5rem" : "2rem",
                  background: isFeatured ? world.accentColor : `${world.foreground}06`,
                  color: isFeatured ? "#fff" : world.foreground,
                  border: isFeatured ? "none" : `1px solid ${world.foreground}12`,
                  borderRadius: "16px",
                }}
              >
                {isFeatured && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: "rgba(255,255,255,0.4)" }}
                    aria-hidden
                  />
                )}
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ opacity: isFeatured ? 0.75 : 0.5 }}>
                  {tier.name}
                </p>
                <p
                  className="font-black leading-none mb-2"
                  style={{ fontSize: isFeatured ? "3.5rem" : "2.5rem", letterSpacing: "-0.03em" }}
                >
                  {tier.price}
                </p>
                <p className="text-sm leading-relaxed mt-3" style={{ opacity: isFeatured ? 0.8 : 0.55 }}>
                  {tier.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function renderSection(
  section: V2Section,
  world: WorldV2Package,
  brief: StartupBrief,
  sections: GeneratedSections,
  parallax: number,
  featureIndex: number
) {
  switch (section.type) {
    case "hero-cinematic":
      return <HeroCinematic key={section.id} world={world} sections={sections} parallax={parallax} />;
    case "hero-split-kinetic":
      return <HeroSplitKinetic key={section.id} world={world} sections={sections} parallax={parallax} />;
    case "hero-editorial-luxury":
      return <HeroEditorialLuxury key={section.id} world={world} sections={sections} parallax={parallax} />;
    case "hero-athletic":
      return <HeroAthletic key={section.id} world={world} sections={sections} parallax={parallax} brief={brief} />;
    case "hero-product-saas":
      return <HeroProductSaaS key={section.id} world={world} sections={sections} brief={brief} />;
    case "stats-band":
      return <StatsBand key={section.id} world={world} brief={brief} />;
    case "feature-asymmetric": {
      const fi = section.featureIndex ?? featureIndex;
      const feature = sections.features.items[fi];
      if (!feature) return null;
      return <FeatureAsymmetric key={section.id} world={world} section={section} feature={feature} index={fi} />;
    }
    case "editorial-mosaic":
      if (section.images.length === 0) return null;
      return <EditorialMosaic key={section.id} world={world} section={section} />;
    case "proof-gallery":
      if (section.images.length === 0) return null;
      return <ProofGallery key={section.id} world={world} section={section} title={sections.features.sectionTitle} />;
    case "story-editorial":
      return <StoryEditorial key={section.id} world={world} section={section} brief={brief} />;
    case "testimonial-float":
      return <TestimonialFloat key={section.id} world={world} sections={sections} section={section} />;
    case "cta-immersive":
      return <CtaImmersive key={section.id} world={world} sections={sections} section={section} />;
    default:
      return null;
  }
}

function WorldNav({
  world,
  sections,
  floating = true,
  isPreview = false,
}: {
  world: WorldV2Package;
  sections: GeneratedSections;
  floating?: boolean;
  isPreview?: boolean;
}) {
  const isDark =
    world.background.startsWith("#0") ||
    world.background === "#0a0a0a" ||
    world.background === "#0f172a";

  const { scrollY } = useScroll();
  const [navVisible, setNavVisible] = useState(true);

  useMotionValueEvent(scrollY, "change", (current) => {
    if (isPreview) return;
    const prev = scrollY.getPrevious() ?? 0;
    // Always show near top; show on scroll-up, hide on scroll-down
    setNavVisible(current < 60 || current < prev);
  });

  if (floating) {
    // Cinematic hero — floating nav with scroll-direction hide/show
    return (
      <AnimatePresence>
        {navVisible && (
          <motion.nav
            key="floating-nav"
            className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-14 py-6"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)" }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            aria-label="site navigation"
          >
            <motion.span
              className="text-sm font-black tracking-tight"
              style={{ color: "#fff", textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {sections.navbar.brandLabel}
            </motion.span>
            <motion.span
              className="text-xs font-bold px-5 py-2 rounded-full cursor-pointer"
              style={{ background: world.accentColor, color: "#fff" }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              {sections.navbar.ctaLabel}
            </motion.span>
          </motion.nav>
        )}
      </AnimatePresence>
    );
  }

  // Split-kinetic: non-floating nav with entrance animation
  return (
    <motion.nav
      className="flex items-center justify-between px-6 md:px-14 py-5 border-b"
      style={{
        background: world.background,
        borderColor: `${world.foreground}10`,
        color: world.foreground,
      }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      aria-label="site navigation"
    >
      <span className="text-sm font-black tracking-tight" style={{ color: isDark ? "#fff" : world.foreground }}>
        {sections.navbar.brandLabel}
      </span>
      <div className="flex items-center gap-8">
        <span className="text-xs opacity-50 hidden md:block" style={{ letterSpacing: "0.05em" }}>Features</span>
        <span className="text-xs opacity-50 hidden md:block" style={{ letterSpacing: "0.05em" }}>Pricing</span>
        <motion.span
          className="text-xs font-bold px-5 py-2 rounded-full cursor-pointer"
          style={{ background: world.accentColor, color: "#fff" }}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {sections.navbar.ctaLabel}
        </motion.span>
      </div>
    </motion.nav>
  );
}

function WorldFooter({ world, sections }: { world: WorldV2Package; sections: GeneratedSections }) {
  return (
    <footer
      className="px-6 md:px-14 py-12 border-t flex items-center justify-between"
      style={{ borderColor: `${world.foreground}10`, background: world.background, color: world.foreground }}
    >
      <span className="text-sm font-bold opacity-80">{sections.navbar.brandLabel}</span>
      <p className="text-xs opacity-35">{sections.footer.tagline}</p>
    </footer>
  );
}

export default function GeneratedWorldV2({ brief, sections, world, isPreview = false }: Props) {
  const parallax = useHeroParallax();
  let featureCounter = 0;

  useEffect(() => {
    document.documentElement.style.setProperty("--v2-accent", world.accentColor);
  }, [world.accentColor]);

  return (
    <div
      className={`v2-world ${isPreview ? "text-[13px]" : ""} relative`}
      style={{ background: world.background, color: world.foreground }}
      data-world-v2
      data-v2-category={world.category}
      data-v2-variant={world.variantKey}
    >
      <style jsx global>{`
        @keyframes v2-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes v2-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -8px); }
        }
        @keyframes v2-reveal-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .v2-float { animation: v2-float 6s ease-in-out infinite; }
        .v2-drift { animation: v2-drift 10s ease-in-out infinite; }
        .v2-drift-slow { animation: v2-drift 14s ease-in-out infinite; }
        .v2-reveal { animation: v2-reveal-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .v2-reveal-delay-1 { animation-delay: 0.12s; }
        .v2-reveal-delay-2 { animation-delay: 0.24s; }
        .v2-reveal-delay-3 { animation-delay: 0.4s; }
        .scrollbar-none { scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>

      {world.sections.map((section) => {
        if (section.type === "feature-asymmetric") featureCounter++;
        const rendered = renderSection(section, world, brief, sections, parallax, featureCounter - 1);
        if (section.type === "hero-cinematic" && rendered) {
          return (
            <div key={section.id} className="relative">
              <WorldNav world={world} sections={sections} floating={true} isPreview={isPreview} />
              {rendered}
            </div>
          );
        }
        if (section.type === "hero-split-kinetic" && rendered) {
          return (
            <div key={section.id}>
              <WorldNav world={world} sections={sections} floating={false} isPreview={isPreview} />
              {rendered}
            </div>
          );
        }
        if (section.type === "hero-editorial-luxury" && rendered) {
          return (
            <div key={section.id} className="relative">
              <WorldNav world={world} sections={sections} floating={false} isPreview={isPreview} />
              {rendered}
            </div>
          );
        }
        if ((section.type === "hero-athletic" || section.type === "hero-product-saas") && rendered) {
          return (
            <div key={section.id} className="relative">
              <WorldNav world={world} sections={sections} floating={true} isPreview={isPreview} />
              {rendered}
            </div>
          );
        }
        return rendered;
      })}

      <PricingV2 world={world} brief={brief} sections={sections} />
      <WorldFooter world={world} sections={sections} />
    </div>
  );
}
