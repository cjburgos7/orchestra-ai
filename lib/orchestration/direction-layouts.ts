import type { DirectionId } from "@/lib/types/startup";

export type HeroLayout =
  | "centered"
  | "split"
  | "left"
  | "cinematic"
  | "minimal"
  | "asymmetrical"
  | "editorial"
  | "immersive"
  | "visual-first"
  | "fullscreen"
  | "collage"
  | "editorial-split"
  | "product-first";
export type FeaturesLayout = "grid-4" | "grid-2" | "list" | "bento" | "staggered";
export type TestimonialLayout = "grid" | "featured" | "minimal";
export type CtaLayout = "block" | "banner" | "inline";

export type DirectionLayout = {
  hero: HeroLayout;
  features: FeaturesLayout;
  testimonials: TestimonialLayout;
  cta: CtaLayout;
  heroPadding: string;
  sectionGap: string;
  headlineScale: string;
  ctaRounded: string;
};

export const DIRECTION_LAYOUTS: Record<DirectionId, DirectionLayout> = {
  orchestra: {
    hero: "centered",
    features: "grid-4",
    testimonials: "grid",
    cta: "block",
    heroPadding: "py-16 md:py-24",
    sectionGap: "py-16 md:py-20",
    headlineScale: "text-4xl md:text-5xl",
    ctaRounded: "rounded-xl",
  },
  "premium-dark": {
    hero: "left",
    features: "list",
    testimonials: "featured",
    cta: "inline",
    heroPadding: "py-20 md:py-32",
    sectionGap: "py-20",
    headlineScale: "text-4xl md:text-6xl font-light",
    ctaRounded: "rounded-full",
  },
  "bold-experimental": {
    hero: "split",
    features: "staggered",
    testimonials: "grid",
    cta: "banner",
    heroPadding: "py-12 md:py-20",
    sectionGap: "py-14 md:py-16",
    headlineScale: "text-4xl md:text-6xl font-black",
    ctaRounded: "rounded-lg",
  },
  "minimal-clean": {
    hero: "minimal",
    features: "list",
    testimonials: "minimal",
    cta: "inline",
    heroPadding: "py-20 md:py-28",
    sectionGap: "py-12 md:py-16",
    headlineScale: "text-3xl md:text-4xl font-medium",
    ctaRounded: "rounded-none",
  },
  "luxury-editorial": {
    hero: "centered",
    features: "grid-2",
    testimonials: "featured",
    cta: "block",
    heroPadding: "py-24 md:py-36",
    sectionGap: "py-20 md:py-28",
    headlineScale: "text-4xl md:text-5xl font-serif font-light",
    ctaRounded: "rounded-none",
  },
  "glass-futuristic": {
    hero: "split",
    features: "bento",
    testimonials: "grid",
    cta: "banner",
    heroPadding: "py-16 md:py-24",
    sectionGap: "py-16",
    headlineScale: "text-4xl md:text-5xl",
    ctaRounded: "rounded-2xl",
  },
  "creator-playful": {
    hero: "centered",
    features: "bento",
    testimonials: "grid",
    cta: "banner",
    heroPadding: "py-14 md:py-20",
    sectionGap: "py-14",
    headlineScale: "text-4xl md:text-5xl font-bold",
    ctaRounded: "rounded-2xl",
  },
  "apple-modern": {
    hero: "centered",
    features: "grid-2",
    testimonials: "minimal",
    cta: "block",
    heroPadding: "py-20 md:py-32",
    sectionGap: "py-16 md:py-24",
    headlineScale: "text-4xl md:text-6xl font-semibold tracking-tight",
    ctaRounded: "rounded-full",
  },
  "retro-tech": {
    hero: "left",
    features: "list",
    testimonials: "minimal",
    cta: "inline",
    heroPadding: "py-16 md:py-24",
    sectionGap: "py-12",
    headlineScale: "text-3xl md:text-4xl font-mono",
    ctaRounded: "rounded-md",
  },
  "creative-agency": {
    hero: "cinematic",
    features: "staggered",
    testimonials: "featured",
    cta: "banner",
    heroPadding: "py-16 md:py-28",
    sectionGap: "py-16",
    headlineScale: "text-5xl md:text-7xl font-black uppercase",
    ctaRounded: "rounded-none",
  },
  "fashion-ai": {
    hero: "minimal",
    features: "list",
    testimonials: "minimal",
    cta: "inline",
    heroPadding: "py-24 md:py-40",
    sectionGap: "py-20",
    headlineScale: "text-4xl md:text-5xl font-light tracking-tight",
    ctaRounded: "rounded-none",
  },
  "genz-vibrant": {
    hero: "cinematic",
    features: "bento",
    testimonials: "grid",
    cta: "banner",
    heroPadding: "py-12 md:py-20",
    sectionGap: "py-12",
    headlineScale: "text-4xl md:text-6xl font-black",
    ctaRounded: "rounded-none",
  },
  "cinematic-ai": {
    hero: "cinematic",
    features: "grid-2",
    testimonials: "featured",
    cta: "block",
    heroPadding: "py-20 md:py-32",
    sectionGap: "py-20",
    headlineScale: "text-4xl md:text-6xl font-light",
    ctaRounded: "rounded-xl",
  },
  "minimal-luxury": {
    hero: "centered",
    features: "grid-2",
    testimonials: "minimal",
    cta: "inline",
    heroPadding: "py-28 md:py-40",
    sectionGap: "py-20 md:py-28",
    headlineScale: "text-3xl md:text-5xl font-light",
    ctaRounded: "rounded-none",
  },
};

export function getDirectionLayout(id: DirectionId): DirectionLayout {
  return DIRECTION_LAYOUTS[id] ?? DIRECTION_LAYOUTS.orchestra;
}
