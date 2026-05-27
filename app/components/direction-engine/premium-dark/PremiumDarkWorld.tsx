"use client";

import { useMemo, type CSSProperties } from "react";
import type { DirectionId, GeneratedSections, HomeSectionId, StartupBrief, StartupLogo } from "@/lib/types/startup";
import type { DirectionTheme } from "@/lib/orchestration/direction-themes";
import { PREMIUM_DARK_SPEC } from "@/lib/direction-engine/premium-dark/spec";
import { createWorldDNA, briefToRawInput } from "@/lib/world-intelligence";
import type { VisualDNA } from "@/lib/creative-direction";
import {
  heroMinVhFromDNA,
  pacingForSection,
  sectionEnterDurationMs,
  sectionIndexForId,
  sectionTransition,
} from "@/lib/creative-direction";
import { getCategoryLabel } from "@/lib/orchestration/product-visuals";
import { resolveCreativeLayout } from "@/lib/orchestration/creative-layouts";
import {
  LifestyleSection,
  ProductShowcaseSection,
  StorySection,
  CollectionSection,
  SourcingSection,
} from "../../CreativeSections";
import { ImageFeatureCards } from "../../CreativeImagery";
import { MotionRoot, Reveal, HoverLift } from "../../VisualMotion";
import PremiumDarkHero from "./PremiumDarkHero";
import PremiumDarkSection from "./PremiumDarkSection";
import { PremiumDarkMotionStyles } from "./PremiumDarkMotionStyles";
import PipelineDebugMount from "../../PipelineDebugMount";

type Props = {
  brief: StartupBrief;
  sections: GeneratedSections;
  theme: DirectionTheme;
  direction: DirectionId;
  isPreview: boolean;
  accentColor: string;
  logo?: StartupLogo | null;
  seed?: string;
};

export default function PremiumDarkWorld({
  brief,
  sections,
  theme,
  isPreview,
  accentColor,
  seed = brief.name,
}: Props) {
  const spec = PREMIUM_DARK_SPEC;
  const visuals = sections.visuals;
  const imagery = visuals?.imagery;
  const visualDNA = visuals?.creativeDirection?.visualDNA;
  const concept = visualDNA?.concept;
  const layout = visuals?.layout ?? resolveCreativeLayout(brief, "premium-dark", seed);
  const productCategory = visuals?.productCategory ?? "generic";
  const categoryLabel = visuals ? getCategoryLabel(visuals.productCategory) : null;
  const pacing = spec.pacing.sectionMinVh;
  const sectionOrder = (
    layout.sectionOrder?.length ? layout.sectionOrder : spec.sectionOrder
  ).filter((id) => id !== "faq");

  const worldDna = useMemo(
    () => createWorldDNA(brief.name, briefToRawInput(brief), `${seed}:premium-dark`),
    [brief, seed]
  );

  const sectionMinVh = (id: HomeSectionId) => {
    if (!visualDNA) return pacing[id as keyof typeof pacing] ?? 0.7;
    const idx = sectionIndexForId(id, sectionOrder);
    return pacingForSection(visualDNA, idx);
  };

  const sectionMotion = (id: HomeSectionId) => {
    if (!visualDNA) return "rise" as const;
    return sectionTransition(visualDNA);
  };

  const enterMs = visualDNA ? sectionEnterDurationMs(visualDNA) : 900;

  if (!imagery) {
    return null;
  }

  const img = imagery;

  const innerPad = isPreview ? "px-6 py-10" : "px-6 md:px-12 lg:px-16 py-16 md:py-24 lg:py-28";

  function FeaturesCinematic() {
    if (layout.imageFeatures) {
      return (
        <PremiumDarkSection id="features" minVh={sectionMinVh("features")} transition={sectionMotion("features")} enterDurationMs={enterMs}>
          <div className={innerPad}>
            <p className={`text-[10px] uppercase tracking-[0.35em] mb-4 ${theme.heroSub}`} style={eyebrowStyle(visualDNA)}>
              {concept ? concept.tension.force1 : "Capabilities"}
            </p>
            <h2 className={`${spec.typography.sectionScale} font-extralight tracking-tight mb-10 ${theme.heroText}`} style={displayStyle(visualDNA, "section")}>
              {sections.features.sectionTitle}
            </h2>
            <div style={visualDNA ? { filter: visualDNA.atmosphere.imageFilter } : undefined}>
              <ImageFeatureCards
                items={sections.features.items}
                imagery={img}
                theme={theme}
                accent={accentColor}
                category={productCategory}
              />
            </div>
          </div>
        </PremiumDarkSection>
      );
    }

    return (
      <PremiumDarkSection id="features" minVh={sectionMinVh("features")} transition={sectionMotion("features")} enterDurationMs={enterMs}>
        <div className={`${innerPad} max-w-6xl`}>
          <p className={`text-[10px] uppercase tracking-[0.35em] mb-4 ${theme.heroSub}`} style={eyebrowStyle(visualDNA)}>
            {concept ? concept.tension.force2 : "Capabilities"}
          </p>
          <h2 className={`${spec.typography.sectionScale} font-extralight tracking-tight mb-12 md:mb-16 ${theme.heroText}`} style={displayStyle(visualDNA, "section")}>
            {sections.features.sectionTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-x-16">
            {sections.features.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <div
                  className={`py-8 md:py-10 border-t ${theme.border} ${i % 2 === 1 ? "md:mt-16" : ""}`}
                >
                  <span className={`text-xs font-mono opacity-30 ${theme.cardBody}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={`text-xl md:text-2xl font-light mt-3 mb-3 ${theme.cardTitle}`}>{item.title}</h3>
                  <p className={`text-sm md:text-base leading-relaxed max-w-md ${theme.cardBody}`}>{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </PremiumDarkSection>
    );
  }

  function TestimonialsCinematic() {
    return (
      <PremiumDarkSection id="testimonials" minVh={sectionMinVh("testimonials")} transition={sectionMotion("testimonials")} enterDurationMs={enterMs}>
        <div className={`${innerPad} max-w-4xl mx-auto text-center`}>
          <p className={`text-[10px] uppercase tracking-[0.35em] mb-8 ${theme.heroSub}`}>Voices</p>
          <blockquote className={`text-2xl md:text-3xl lg:text-4xl font-extralight leading-snug mb-8 ${theme.heroText}`}>
            &ldquo;{sections.testimonials[0]?.quote}&rdquo;
          </blockquote>
          <p className={`text-sm ${theme.cardTitle}`}>{sections.testimonials[0]?.name}</p>
          <p className={`text-xs ${theme.cardBody}`}>{sections.testimonials[0]?.role}</p>
        </div>
      </PremiumDarkSection>
    );
  }

  function PricingCinematic() {
    return (
      <PremiumDarkSection id="pricing" minVh={sectionMinVh("pricing")} transition={sectionMotion("pricing")} enterDurationMs={enterMs}>
        <div className={innerPad}>
          <div className="max-w-xl mb-12">
            <p className={`text-[10px] uppercase tracking-[0.35em] mb-4 ${theme.heroSub}`}>Access</p>
            <h2 className={`${spec.typography.sectionScale} font-extralight ${theme.heroText}`}>
              {sections.pricing.sectionTitle}
            </h2>
            <p className={`text-base mt-3 ${theme.cardBody}`}>{sections.pricing.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl">
            {brief.pricing.tiers.map((tier, i) => (
              <HoverLift key={tier.name}>
                <div
                  className={`rounded-2xl p-8 h-full border ${
                    i === 1 ? theme.pricingHighlight : theme.pricingDefault
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2">{tier.name}</p>
                  <p className="text-3xl md:text-4xl font-extralight mb-3">{tier.price}</p>
                  <p className="text-sm opacity-70 leading-relaxed">{tier.detail}</p>
                </div>
              </HoverLift>
            ))}
          </div>
        </div>
      </PremiumDarkSection>
    );
  }

  function CtaCinematic() {
    return (
      <PremiumDarkSection id="cta" minVh={sectionMinVh("cta")} transition={sectionMotion("cta")} enterDurationMs={enterMs}>
        <div className={`${innerPad} flex flex-col md:flex-row md:items-end md:justify-between gap-8 max-w-6xl`}>
          <div className="max-w-2xl">
            <h2 className={`text-3xl md:text-5xl font-extralight leading-tight mb-4 ${theme.heroText}`}>
              {sections.cta.headline}
            </h2>
            <p className={`text-base md:text-lg ${theme.cardBody}`}>{sections.cta.subheadline}</p>
          </div>
          <span className={`inline-flex text-sm font-semibold px-8 py-4 rounded-full shrink-0 ${theme.ctaPrimary}`}>
            {sections.cta.buttonText}
          </span>
        </div>
      </PremiumDarkSection>
    );
  }

  function renderSection(id: HomeSectionId) {
    const gap = innerPad;

    switch (id) {
      case "story":
        return layout.showStory ? (
          <PremiumDarkSection key="story" id="story" minVh={sectionMinVh("story")} transition={sectionMotion("story")} enterDurationMs={enterMs}>
            <StorySection
              brief={brief}
              sections={sections}
              theme={theme}
              gap={gap}
              accent={accentColor}
              imagery={img}
              category={productCategory}
            />
          </PremiumDarkSection>
        ) : null;
      case "lifestyle":
        return layout.showLifestyle ? (
          <PremiumDarkSection key="lifestyle" id="lifestyle" minVh={sectionMinVh("lifestyle")} transition={sectionMotion("lifestyle")} enterDurationMs={enterMs}>
            <LifestyleSection
              imagery={img}
              theme={theme}
              gap={gap}
              accent={accentColor}
              compact={isPreview}
              category={productCategory}
              direction="premium-dark"
            />
          </PremiumDarkSection>
        ) : null;
      case "showcase":
        return layout.showShowcase ? (
          <PremiumDarkSection key="showcase" id="showcase" minVh={sectionMinVh("showcase")} transition={sectionMotion("showcase")} enterDurationMs={enterMs}>
            <ProductShowcaseSection
              imagery={img}
              theme={theme}
              gap={gap}
              accent={accentColor}
              category={productCategory}
            />
          </PremiumDarkSection>
        ) : null;
      case "sourcing":
        return layout.sectionOrder.includes("sourcing") ? (
          <PremiumDarkSection key="sourcing" id="sourcing" minVh={sectionMinVh("sourcing")} transition={sectionMotion("sourcing")} enterDurationMs={enterMs}>
            <SourcingSection
              imagery={img}
              theme={theme}
              gap={gap}
              accent={accentColor}
              brief={brief}
              category={productCategory}
            />
          </PremiumDarkSection>
        ) : null;
      case "collections":
        return layout.showCollections ? (
          <PremiumDarkSection key="collections" id="collections" minVh={sectionMinVh("collections")} transition={sectionMotion("collections")} enterDurationMs={enterMs}>
            <CollectionSection
              imagery={img}
              theme={theme}
              gap={gap}
              accent={accentColor}
              brief={brief}
              category={productCategory}
            />
          </PremiumDarkSection>
        ) : null;
      case "features":
        return <FeaturesCinematic key="features" />;
      case "testimonials":
        return <TestimonialsCinematic key="testimonials" />;
      case "pricing":
        return <PricingCinematic key="pricing" />;
      case "cta":
        return <CtaCinematic key="cta" />;
      default:
        return null;
    }
  }

  const sectionOrderFiltered = sectionOrder;

  return (
    <div
      style={visualDNA ? { background: visualDNA.color.background, color: visualDNA.color.foreground } : undefined}
      data-creative-concept-key={visuals?.creativeDirection?.conceptKey}
      data-creative-variant={visuals?.creativeDirection?.variantLabel}
      data-creative-emotion={concept?.emotion}
      data-creative-core-idea={concept?.coreIdea}
    >
      <MotionRoot profile={spec.motionProfile} className="pd-world">
      <PremiumDarkMotionStyles />
      <PipelineDebugMount imagery={img} label="cinematic-world" />
      {concept && (
        <div className="sr-only" aria-hidden>
          Creative direction: {concept.coreIdea}. Hero moment: {concept.heroMoment}
        </div>
      )}
      <PremiumDarkHero
        brief={brief}
        sections={sections}
        imagery={img}
        theme={theme}
        accent={accentColor}
        category={productCategory}
        seed={seed}
        typography={spec.typography}
        atmosphere={spec.atmosphere}
        worldAtmosphere={worldDna.atmosphere}
        visualDNA={visualDNA}
        heroMinVh={visualDNA ? heroMinVhFromDNA(visualDNA) : spec.pacing.heroMinVh}
        isPreview={isPreview}
        categoryLabel={categoryLabel}
      />
      {sectionOrderFiltered.map((id) => renderSection(id))}
      </MotionRoot>
    </div>
  );
}

function eyebrowStyle(vd?: VisualDNA): CSSProperties | undefined {
  if (!vd) return undefined;
  if (vd.type.eyebrowStyle === "mono-spaced") {
    return { fontFamily: "'Courier New', monospace", letterSpacing: "0.22em" };
  }
  if (vd.type.eyebrowStyle === "impact-caps") {
    return { fontWeight: 700, letterSpacing: "0.08em" };
  }
  if (vd.type.eyebrowStyle === "thin-tracked") {
    return { letterSpacing: "0.28em", fontWeight: 300 };
  }
  return undefined;
}

function displayStyle(vd?: VisualDNA, scale: "hero" | "section" = "hero"): CSSProperties | undefined {
  if (!vd) return undefined;
  return {
    fontFamily: vd.type.displayFamily,
    fontSize: scale === "hero" ? vd.type.displaySize : `clamp(28px, 3.5vw, 52px)`,
    fontWeight: vd.type.displayWeight,
    lineHeight: vd.type.displayLineHeight,
    letterSpacing: vd.type.displayTracking,
    color: vd.type.colorPrimary,
  };
}
