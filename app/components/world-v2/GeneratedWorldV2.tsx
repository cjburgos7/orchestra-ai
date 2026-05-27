"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { GeneratedSections, StartupBrief } from "@/lib/types/startup";
import type { WorldV2Package, V2Section, V2ImageSlot } from "@/lib/world-v2";
import { useHeroParallax, parallaxTransform } from "../direction-engine/shared/useScrollParallax";

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
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: "600px", color: "#fff" }}>
      {/* Full-bleed photo with parallax */}
      <div className="absolute inset-0" style={{ transform: parallaxTransform(0.55, parallax, 100) }}>
        <V2Image image={img} priority overlay="strong" meshFrom={world.meshFrom} meshTo={world.meshTo} className="absolute inset-0" />
      </div>

      {/* Accent color wash at top */}
      <div
        className="absolute inset-x-0 top-0 h-64 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, ${world.accentColor}28 0%, transparent 100%)` }}
        aria-hidden
      />

      {/* Bottom editorial text block */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-6 md:px-14 pb-12 md:pb-16">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-5">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.22em] px-3 py-1 rounded-full"
            style={{ background: world.accentColor, color: "#fff" }}
          >
            {world.categoryLabel}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest opacity-60">{sections.hero.eyebrow}</span>
        </div>

        {/* Main headline — editorial scale */}
        <h1
          className="v2-reveal mb-5 max-w-5xl"
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
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-end gap-6 v2-reveal v2-reveal-delay-1">
          <p className="text-sm md:text-base max-w-sm opacity-80 leading-relaxed">
            {sections.hero.subheadline}
          </p>
          <div className="flex gap-3 shrink-0">
            <span
              className="text-sm font-bold px-6 py-3 rounded-full"
              style={{ background: world.accentColor, color: "#fff" }}
            >
              {sections.hero.ctaPrimary}
            </span>
            <span className="text-sm font-medium px-6 py-3 rounded-full border border-white/30 text-white/90">
              {sections.hero.ctaSecondary}
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 right-8 z-10 opacity-50 hidden md:flex flex-col items-center gap-1">
        <span className="text-white text-[9px] uppercase tracking-widest" style={{ writingMode: "vertical-rl" }}>Scroll</span>
        <div className="w-px h-10 bg-white/50" />
      </div>
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
          <p
            className="text-[10px] font-bold uppercase tracking-[0.25em] mb-6"
            style={{ color: world.accentColor }}
          >
            {world.categoryLabel} · {world.variantLabel}
          </p>

          {/* Headline — breaks large */}
          <h1
            className="mb-8 v2-reveal"
            style={{
              fontFamily: world.typography.displayFamily,
              fontWeight: world.typography.displayWeight,
              letterSpacing: world.typography.displayTracking,
              fontSize: world.typography.headlineScale,
              lineHeight: "1.0",
              color: world.foreground,
            }}
          >
            {sections.hero.headline}
          </h1>

          {/* Thin rule */}
          <div className="w-12 h-px mb-6" style={{ background: world.accentColor }} />

          <p className="text-sm md:text-base opacity-65 max-w-xs mb-10 leading-relaxed v2-reveal v2-reveal-delay-1">
            {sections.hero.subheadline}
          </p>

          <div className="flex flex-wrap gap-3 v2-reveal v2-reveal-delay-2">
            <span
              className="text-sm font-bold px-6 py-3 rounded-full text-white"
              style={{ background: world.accentColor }}
            >
              {sections.hero.ctaPrimary}
            </span>
            <span
              className="text-sm font-medium px-6 py-3 rounded-full border"
              style={{ borderColor: `${world.foreground}20`, color: world.foreground }}
            >
              {sections.hero.ctaSecondary}
            </span>
          </div>
        </div>

        {/* Photo panel — right, 58%, full-bleed no padding */}
        <div className="relative min-h-[60vw] lg:min-h-full order-1 lg:order-2 overflow-hidden">
          <div className="absolute inset-0" style={{ transform: parallaxTransform(0.3, parallax) }}>
            <V2Image
              image={imgs[0]}
              priority
              overlay="none"
              meshFrom={world.meshFrom}
              meshTo={world.meshTo}
              className="absolute inset-0"
            />
          </div>
          {/* Blend toward text panel on desktop */}
          <div
            className="absolute inset-y-0 left-0 w-20 hidden lg:block pointer-events-none"
            style={{ background: `linear-gradient(to right, ${world.background}, transparent)` }}
            aria-hidden
          />
          {/* Floating secondary image if present */}
          {imgs[1] && (
            <div
              className="absolute bottom-12 left-8 w-[36%] aspect-[4/5] overflow-hidden shadow-2xl v2-float hidden md:block"
              style={{
                transform: parallaxTransform(-0.2, parallax, 30),
                border: `2px solid ${world.accentColor}40`,
                borderRadius: "12px",
              }}
            >
              <V2Image image={imgs[1]} overlay="light" meshFrom={world.meshFrom} meshTo={world.meshTo} className="absolute inset-0" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Stats band — editorial number display, NOT a uniform 3-column grid */
function StatsBand({ world, brief }: { world: WorldV2Package; brief: StartupBrief }) {
  const primary = brief.pricing.tiers[0]?.price ?? "$29";
  return (
    <section
      className="overflow-hidden"
      style={{ background: world.accentColor, color: "#fff" }}
    >
      <div className="px-6 md:px-14 py-8 md:py-10 flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/20">
        {/* Primary stat — very large */}
        <div className="flex flex-col pr-0 md:pr-16 pb-6 md:pb-0">
          <span
            className="font-black leading-none"
            style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)", letterSpacing: "-0.03em" }}
          >
            12k+
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-70 mt-1">Active users</span>
        </div>

        {/* Secondary stats — medium */}
        <div className="flex gap-12 pl-0 md:pl-16 pt-6 md:pt-0">
          <div>
            <span
              className="font-black leading-none block"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.03em" }}
            >
              4.9★
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-70 mt-1 block">Satisfaction</span>
          </div>
          <div>
            <span
              className="font-black leading-none block"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.03em" }}
            >
              {primary}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-70 mt-1 block">Starting price</span>
          </div>
        </div>
      </div>
    </section>
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
    <section
      style={{ background: sectionBg, color: world.foreground }}
    >
      <div className={`grid grid-cols-1 lg:grid-cols-2`} style={{ minHeight: "70vh" }}>
        {/* Image — full-bleed, no border-radius */}
        <div
          className={`relative min-h-[55vw] lg:min-h-full ${flip ? "lg:order-2" : "lg:order-1"} overflow-hidden`}
        >
          <V2Image
            image={img}
            overlay="light"
            meshFrom={world.meshFrom}
            meshTo={world.meshTo}
            className="absolute inset-0"
          />
          {/* Accent strip at the bottom edge */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
            style={{ background: world.accentColor, opacity: 0.6 }}
            aria-hidden
          />
        </div>

        {/* Text — generous padding, editorial scale */}
        <div
          className={`flex flex-col justify-center px-8 md:px-14 py-16 md:py-20 ${flip ? "lg:order-1" : "lg:order-2"}`}
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
        </div>
      </div>
    </section>
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
    <section className="overflow-hidden" style={{ background: world.background }}>
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
    </section>
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

      {/* Scroll strip — edge to edge */}
      <div className="flex gap-[3px] overflow-x-auto pb-0 snap-x snap-mandatory scrollbar-none pl-6 md:pl-14">
        {allImages.map((img, i) => (
          <div
            key={`${img.id}-${i}`}
            className="snap-start shrink-0 overflow-hidden"
            style={{ width: "clamp(260px, 55vw, 420px)", aspectRatio: "3/4" }}
          >
            <V2Image
              image={img}
              overlay="light"
              meshFrom={world.meshFrom}
              meshTo={world.meshTo}
              className="h-full w-full"
            />
          </div>
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
    <section
      className="grid grid-cols-1 md:grid-cols-[60%_40%]"
      style={{ background: world.background, color: world.foreground, minHeight: "55vh" }}
    >
      {/* Image — no border-radius, bleeds full height */}
      <div className="relative min-h-[50vw] md:min-h-full overflow-hidden">
        <V2Image image={img} overlay="light" meshFrom={world.meshFrom} meshTo={world.meshTo} className="absolute inset-0" />
      </div>

      {/* Text — editorial pull-quote treatment */}
      <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-14">
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
        <div className="mt-8 h-px w-12" style={{ background: world.accentColor }} />
      </div>
    </section>
  );
}

/** Testimonial — image at 40% opacity full-bleed, LARGE quote typography */
function TestimonialFloat({ world, sections, section }: { world: WorldV2Package; sections: GeneratedSections; section: V2Section }) {
  const t = sections.testimonials[0];
  if (!t?.quote) return null;
  const bg = section.images[0];

  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{ background: world.meshFrom, color: world.foreground, minHeight: "52vh" }}
    >
      {/* Background photo at low opacity */}
      {bg && (
        <div className="absolute inset-0">
          <V2Image image={bg} overlay="none" meshFrom={world.meshFrom} meshTo={world.meshTo} className="absolute inset-0" />
          <div className="absolute inset-0" style={{ background: world.meshFrom, opacity: 0.78 }} />
        </div>
      )}

      <blockquote className="relative z-10 px-8 md:px-20 py-16 max-w-4xl mx-auto">
        {/* Large opening quotation mark */}
        <div
          className="leading-none mb-4 select-none font-black"
          style={{ fontSize: "clamp(4rem, 10vw, 8rem)", color: world.accentColor, opacity: 0.4, lineHeight: 1 }}
          aria-hidden
        >
          &ldquo;
        </div>
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
      </blockquote>
    </section>
  );
}

/** CTA — true full-bleed, no margin or rounding, vertical centering, left-aligned text */
function CtaImmersive({ world, sections, section }: { world: WorldV2Package; sections: GeneratedSections; section: V2Section }) {
  const img = section.images[0] ?? world.heroImage;
  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{ minHeight: "60vh" }}
    >
      {/* Full-bleed photo */}
      <V2Image image={img} overlay="strong" meshFrom={world.meshFrom} meshTo={world.meshTo} className="absolute inset-0" />

      {/* Accent color wash from left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${world.accentColor}50 0%, transparent 55%)` }}
        aria-hidden
      />

      {/* Text — left-aligned, editorial */}
      <div className="relative z-10 px-8 md:px-14 py-16 max-w-2xl text-white">
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
        <span
          className="inline-block text-sm font-bold px-8 py-4 rounded-full"
          style={{ background: world.accentColor }}
        >
          {sections.cta.buttonText}
        </span>
      </div>
    </section>
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
}: {
  world: WorldV2Package;
  sections: GeneratedSections;
  floating?: boolean;
}) {
  const isDark =
    world.background.startsWith("#0") ||
    world.background === "#0a0a0a" ||
    world.background === "#0f172a";

  if (floating) {
    return (
      <nav
        className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-14 py-6"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)" }}
        aria-label="site navigation"
      >
        <span
          className="text-sm font-black tracking-tight"
          style={{ color: "#fff", textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
        >
          {sections.navbar.brandLabel}
        </span>
        <span
          className="text-xs font-bold px-5 py-2 rounded-full"
          style={{ background: world.accentColor, color: "#fff" }}
        >
          {sections.navbar.ctaLabel}
        </span>
      </nav>
    );
  }

  return (
    <nav
      className="flex items-center justify-between px-6 md:px-14 py-5 border-b"
      style={{
        background: world.background,
        borderColor: `${world.foreground}10`,
        color: world.foreground,
      }}
      aria-label="site navigation"
    >
      <span className="text-sm font-black tracking-tight" style={{ color: isDark ? "#fff" : world.foreground }}>
        {sections.navbar.brandLabel}
      </span>
      <div className="flex items-center gap-8">
        <span className="text-xs opacity-50 hidden md:block" style={{ letterSpacing: "0.05em" }}>Features</span>
        <span className="text-xs opacity-50 hidden md:block" style={{ letterSpacing: "0.05em" }}>Pricing</span>
        <span
          className="text-xs font-bold px-5 py-2 rounded-full"
          style={{ background: world.accentColor, color: "#fff" }}
        >
          {sections.navbar.ctaLabel}
        </span>
      </div>
    </nav>
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
              <WorldNav world={world} sections={sections} floating={true} />
              {rendered}
            </div>
          );
        }
        if (section.type === "hero-split-kinetic" && rendered) {
          return (
            <div key={section.id}>
              <WorldNav world={world} sections={sections} floating={false} />
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
