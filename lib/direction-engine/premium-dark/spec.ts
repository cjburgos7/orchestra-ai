import type { DirectionEngineSpec } from "../types";
import { PREMIUM_DARK_ATMOSPHERE } from "./atmosphere";

/**
 * Premium Dark — cinematic world spec.
 * Atmosphere drives layout: fullscreen opening, viewport pacing, asymmetric rhythm.
 */
export const PREMIUM_DARK_SPEC: DirectionEngineSpec = {
  id: "premium-dark",
  enabled: true,
  motionProfile: "cinematic",
  sectionOrder: [
    "story",
    "lifestyle",
    "showcase",
    "sourcing",
    "features",
    "collections",
    "testimonials",
    "pricing",
    "cta",
  ],
  layoutOverrides: {
    hero: "fullscreen",
    heroImagery: "background",
    backgroundStyle: "none",
    features: "staggered",
    showStory: true,
    showLifestyle: true,
    showShowcase: true,
    showCollections: true,
    showPromo: false,
    showCategories: false,
    imageFeatures: true,
    heroPadding: "py-0",
    sectionGap: "py-0",
    headlineScale: "text-5xl md:text-7xl lg:text-8xl",
    typographyModifier: "font-extralight tracking-[-0.03em]",
    visualEnergy: "cinematic",
  },
  atmosphere: PREMIUM_DARK_ATMOSPHERE,
  pacing: {
    heroMinVh: 1,
    sectionMinVh: {
      story: 0.85,
      lifestyle: 0.75,
      showcase: 0.9,
      sourcing: 0.7,
      features: 0.8,
      collections: 0.75,
      testimonials: 0.65,
      pricing: 0.7,
      cta: 0.55,
    },
    sectionGap: "py-0",
  },
  typography: {
    heroScale: "text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]",
    heroTracking: "tracking-[-0.04em]",
    heroWeight: "font-extralight",
    sectionScale: "text-3xl md:text-4xl lg:text-5xl",
    eyebrowTracking: "tracking-[0.35em]",
    align: "left",
  },
};
