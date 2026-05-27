"use client";

import type { CSSProperties } from "react";
import type { DirectionTheme } from "@/lib/orchestration/direction-themes";
import type { ImagerySet, StartupBrief } from "@/lib/types/startup";
import type { CinematicTypography } from "@/lib/direction-engine/types";
import type { AtmosphereLayer } from "@/lib/direction-engine/types";
import type { AtmosphereSpec } from "@/lib/world-intelligence";
import type { VisualDNA } from "@/lib/creative-direction";
import { heroAlignClass, heroContentMaxWidth, heroTextAlign } from "@/lib/creative-direction";
import SafeImage from "../../SafeImage";
import PremiumDarkAtmosphere from "./PremiumDarkAtmosphere";
import AtmosphereCanvas from "../AtmosphereCanvas";
import { useHeroParallax, parallaxTransform } from "../shared/useScrollParallax";

type Props = {
  brief: StartupBrief;
  sections: {
    hero: {
      eyebrow: string;
      headline: string;
      subheadline: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };
  };
  imagery: ImagerySet;
  theme: DirectionTheme;
  accent: string;
  category: string;
  seed: string;
  typography: CinematicTypography;
  atmosphere: AtmosphereLayer[];
  worldAtmosphere: AtmosphereSpec;
  visualDNA?: VisualDNA;
  heroMinVh: number;
  isPreview: boolean;
  categoryLabel?: string | null;
};

export default function PremiumDarkHero({
  brief,
  sections,
  imagery,
  theme,
  accent,
  category,
  seed,
  typography,
  atmosphere,
  worldAtmosphere,
  visualDNA,
  heroMinVh,
  isPreview,
  categoryLabel,
}: Props) {
  const heroOffset = useHeroParallax();
  const minHStyle = isPreview ? { minHeight: "520px" } : { minHeight: `${heroMinVh * 100}vh` };
  const concept = visualDNA?.concept;
  const alignClass = visualDNA ? heroAlignClass(visualDNA) : "items-end";
  const textAlign = visualDNA ? heroTextAlign(visualDNA) : "left";
  const maxW = visualDNA ? heroContentMaxWidth(visualDNA) : "640px";

  const displayStyle: CSSProperties | undefined = visualDNA
    ? {
        fontFamily: visualDNA.type.displayFamily,
        fontSize: visualDNA.type.displaySize,
        fontWeight: visualDNA.type.displayWeight,
        lineHeight: visualDNA.type.displayLineHeight,
        letterSpacing: visualDNA.type.displayTracking,
        color: visualDNA.type.colorPrimary,
      }
    : undefined;

  const subStyle: CSSProperties | undefined = visualDNA
    ? {
        fontFamily: visualDNA.type.displayFamily,
        fontSize: visualDNA.type.subSize,
        fontWeight: visualDNA.type.subWeight,
        lineHeight: visualDNA.type.subLineHeight,
        color: visualDNA.type.colorSecondary,
      }
    : undefined;

  const eyebrowStyle: CSSProperties | undefined = visualDNA
    ? visualDNA.type.eyebrowStyle === "mono-spaced"
      ? { fontFamily: "'Courier New', monospace", letterSpacing: "0.22em" }
      : visualDNA.type.eyebrowStyle === "impact-caps"
        ? { fontWeight: 700, letterSpacing: "0.08em" }
        : { letterSpacing: "0.28em", fontWeight: 300 }
    : undefined;

  const heroSubline = concept?.coreIdea ?? sections.hero.subheadline;
  const heroEyebrow = concept
    ? concept.heroMoment.split(".")[0]
    : `${categoryLabel ? `${categoryLabel} · ` : ""}${sections.hero.eyebrow}`;

  const parallaxStrength =
    visualDNA?.atmosphere.idleMotion === "kinetic"
      ? 0.5
      : visualDNA?.atmosphere.idleMotion === "parallax-subtle"
        ? 0.28
        : 0.35;

  return (
    <section
      id="section-hero"
      className={`relative overflow-hidden flex ${alignClass} ${theme.border} border-b border-white/[0.06]`}
      style={minHStyle}
      data-hero-composition={visualDNA?.layout.heroComposition}
    >
      <AtmosphereCanvas
        atmosphere={worldAtmosphere}
        direction="premium-dark"
        scrollLinked={visualDNA?.atmosphere.idleMotion !== "none"}
        className="z-[0]"
      />

      <div
        className="absolute inset-0 z-[1] will-change-transform"
        style={{ transform: parallaxTransform(parallaxStrength, heroOffset, 100) }}
      >
        <div
          className="absolute inset-0"
          style={{
            filter: visualDNA
              ? visualDNA.atmosphere.imageFilter.replace(/brightness\(0\.(\d+)\)/, (_, n) => {
                  const v = Math.max(parseInt(n, 10), 85);
                  return `brightness(0.${v})`;
                })
              : undefined,
          }}
        >
          <SafeImage
            src={imagery.hero}
            fallback={imagery.heroFallback}
            chain={imagery.heroChain}
            imagery={imagery}
            category={category}
            seed={`${seed}-pd-hero`}
            alt={imagery.heroAlt}
            className="absolute inset-0 scale-[1.08] orch-ken-burns"
            priority
          />
        </div>
      </div>

      {visualDNA && (
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background: visualDNA.color.imageOverlay,
            opacity: 0.72,
          }}
        />
      )}

      <PremiumDarkAtmosphere
        layers={atmosphere}
        accent={accent}
        meshFrom={imagery.meshFrom}
        meshTo={imagery.meshTo}
        heroOffset={heroOffset}
      />

      <div
        className={`relative z-[10] w-full px-6 md:px-12 lg:px-16 pb-12 md:pb-16 lg:pb-20 pt-32 ${
          textAlign === "center" ? "text-center" : ""
        }`}
      >
        <div style={{ maxWidth: maxW, margin: textAlign === "center" ? "0 auto" : undefined }}>
          <p
            className={`text-[10px] md:text-[11px] uppercase mb-5 md:mb-7 ${theme.heroSub} ${typography.eyebrowTracking}`}
            style={eyebrowStyle}
          >
            {heroEyebrow}
          </p>
          <h1
            className={
              visualDNA
                ? `mb-6 md:mb-8 ${theme.heroText}`
                : `${typography.heroScale} ${typography.heroTracking} ${typography.heroWeight} leading-[0.95] mb-6 md:mb-8 ${theme.heroText}`
            }
            style={displayStyle}
          >
            {sections.hero.headline}
          </h1>
          <p
            className={visualDNA ? `mb-8 md:mb-10 max-w-2xl ${textAlign === "center" ? "mx-auto" : ""}` : `text-base md:text-xl lg:text-2xl max-w-2xl leading-relaxed mb-8 md:mb-10 ${theme.heroSub}`}
            style={subStyle}
          >
            {heroSubline}
          </p>
          <div
            className={`flex flex-wrap items-center gap-4 ${
              textAlign === "center" ? "justify-center" : ""
            }`}
          >
            <span className={`text-sm font-semibold px-7 py-3.5 rounded-full ${theme.ctaPrimary}`}>
              {sections.hero.ctaPrimary}
            </span>
            <span className={`text-sm ${theme.ctaSecondary} underline underline-offset-4 decoration-white/20`}>
              {sections.hero.ctaSecondary} →
            </span>
          </div>
        </div>

        {!isPreview && visualDNA?.pacing.scrollFeel !== "stepped" && (
          <div className="absolute bottom-6 right-8 md:right-12 flex flex-col items-center gap-2 opacity-40">
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/70">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent pd-scroll-cue" />
          </div>
        )}
      </div>
    </section>
  );
}
