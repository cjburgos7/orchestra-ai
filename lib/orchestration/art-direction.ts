/**
 * Direction-specific photo art direction — composition, scrims, typography rhythm.
 * Direction modifies presentation; category identity stays locked elsewhere.
 */

import type { DirectionId } from "@/lib/types/startup";

export type PhotoTreatment = {
  scrim: "cinematic" | "editorial" | "bold" | "minimal" | "dark";
  meshOpacity: number;
  blackOverlay: number;
  vignette: boolean;
  grain: boolean;
  kenBurns: boolean;
  heroMinHeight: string;
  headlineTracking: string;
  ctaStyle: "pill" | "underline" | "solid";
};

const TREATMENTS: Partial<Record<DirectionId, PhotoTreatment>> = {
  orchestra: {
    scrim: "editorial",
    meshOpacity: 0.08,
    blackOverlay: 0.35,
    vignette: true,
    grain: false,
    kenBurns: true,
    heroMinHeight: "min-h-[68vh] md:min-h-[78vh]",
    headlineTracking: "tracking-tight",
    ctaStyle: "pill",
  },
  "minimal-clean": {
    scrim: "minimal",
    meshOpacity: 0,
    blackOverlay: 0.25,
    vignette: false,
    grain: false,
    kenBurns: false,
    heroMinHeight: "min-h-[55vh]",
    headlineTracking: "tracking-normal",
    ctaStyle: "underline",
  },
  "premium-dark": {
    scrim: "dark",
    meshOpacity: 0.05,
    blackOverlay: 0.55,
    vignette: true,
    grain: true,
    kenBurns: true,
    heroMinHeight: "min-h-[72vh] md:min-h-[82vh]",
    headlineTracking: "tracking-[0.04em]",
    ctaStyle: "solid",
  },
  "bold-experimental": {
    scrim: "bold",
    meshOpacity: 0.12,
    blackOverlay: 0.4,
    vignette: false,
    grain: false,
    kenBurns: true,
    heroMinHeight: "min-h-[65vh]",
    headlineTracking: "tracking-tight uppercase",
    ctaStyle: "solid",
  },
  "luxury-editorial": {
    scrim: "editorial",
    meshOpacity: 0.06,
    blackOverlay: 0.3,
    vignette: true,
    grain: true,
    kenBurns: true,
    heroMinHeight: "min-h-[70vh] md:min-h-[80vh]",
    headlineTracking: "tracking-[0.08em]",
    ctaStyle: "pill",
  },
  "minimal-luxury": {
    scrim: "editorial",
    meshOpacity: 0.04,
    blackOverlay: 0.28,
    vignette: true,
    grain: true,
    kenBurns: true,
    heroMinHeight: "min-h-[68vh]",
    headlineTracking: "tracking-wide",
    ctaStyle: "pill",
  },
  "fashion-ai": {
    scrim: "editorial",
    meshOpacity: 0.05,
    blackOverlay: 0.32,
    vignette: true,
    grain: true,
    kenBurns: true,
    heroMinHeight: "min-h-[75vh]",
    headlineTracking: "tracking-[0.12em]",
    ctaStyle: "pill",
  },
  "genz-vibrant": {
    scrim: "bold",
    meshOpacity: 0.18,
    blackOverlay: 0.45,
    vignette: false,
    grain: false,
    kenBurns: true,
    heroMinHeight: "min-h-[60vh]",
    headlineTracking: "tracking-tight uppercase",
    ctaStyle: "solid",
  },
  "creator-playful": {
    scrim: "bold",
    meshOpacity: 0.15,
    blackOverlay: 0.38,
    vignette: false,
    grain: false,
    kenBurns: true,
    heroMinHeight: "min-h-[58vh]",
    headlineTracking: "tracking-tight",
    ctaStyle: "pill",
  },
  "cinematic-ai": {
    scrim: "cinematic",
    meshOpacity: 0.06,
    blackOverlay: 0.5,
    vignette: true,
    grain: true,
    kenBurns: true,
    heroMinHeight: "min-h-[75vh] md:min-h-[85vh]",
    headlineTracking: "tracking-[0.06em]",
    ctaStyle: "solid",
  },
  "apple-modern": {
    scrim: "minimal",
    meshOpacity: 0.04,
    blackOverlay: 0.22,
    vignette: false,
    grain: false,
    kenBurns: false,
    heroMinHeight: "min-h-[62vh]",
    headlineTracking: "tracking-tight",
    ctaStyle: "pill",
  },
  "creative-agency": {
    scrim: "bold",
    meshOpacity: 0.14,
    blackOverlay: 0.42,
    vignette: false,
    grain: false,
    kenBurns: true,
    heroMinHeight: "min-h-[64vh]",
    headlineTracking: "tracking-tight uppercase",
    ctaStyle: "solid",
  },
  "glass-futuristic": {
    scrim: "dark",
    meshOpacity: 0.1,
    blackOverlay: 0.48,
    vignette: true,
    grain: false,
    kenBurns: true,
    heroMinHeight: "min-h-[70vh]",
    headlineTracking: "tracking-tight",
    ctaStyle: "solid",
  },
};

const DEFAULT: PhotoTreatment = {
  scrim: "editorial",
  meshOpacity: 0.1,
  blackOverlay: 0.35,
  vignette: true,
  grain: false,
  kenBurns: true,
  heroMinHeight: "min-h-[65vh] md:min-h-[72vh]",
  headlineTracking: "tracking-tight",
  ctaStyle: "pill",
};

export function resolvePhotoTreatment(direction: DirectionId): PhotoTreatment {
  return TREATMENTS[direction] ?? DEFAULT;
}

export function scrimGradient(treatment: PhotoTreatment, accent: string): string {
  if (treatment.scrim === "minimal") {
    return `linear-gradient(to top, rgba(0,0,0,${treatment.blackOverlay}) 0%, transparent 55%)`;
  }
  if (treatment.scrim === "dark" || treatment.scrim === "cinematic") {
    return `linear-gradient(to top, rgba(0,0,0,${Math.min(treatment.blackOverlay + 0.15, 0.85)}) 0%, rgba(0,0,0,0.25) 45%, transparent 100%)`;
  }
  if (treatment.scrim === "bold") {
    return `linear-gradient(135deg, rgba(0,0,0,0.15) 0%, ${accent}44 35%, rgba(0,0,0,${treatment.blackOverlay}) 100%)`;
  }
  return `linear-gradient(to top, rgba(0,0,0,${treatment.blackOverlay}) 0%, rgba(0,0,0,0.1) 42%, transparent 100%)`;
}
