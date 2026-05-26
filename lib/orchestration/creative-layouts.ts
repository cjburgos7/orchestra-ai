import type { DirectionId, StartupBrief } from "@/lib/types/startup";
import type { ProductCategory } from "@/lib/types/startup";
import { detectProductCategory, getCategoryWorld, pickFromWorld, isImageryOnlyCategory } from "@/lib/orchestration/category-worlds";
import {
  DIRECTION_LAYOUTS,
  type CtaLayout,
  type DirectionLayout,
  type FeaturesLayout,
  type HeroLayout,
  type TestimonialLayout,
} from "@/lib/orchestration/direction-layouts";

export type BackgroundStyle =
  | "mesh"
  | "gradient-drift"
  | "aurora"
  | "space"
  | "soft"
  | "editorial"
  | "photo"
  | "none";

export type HeroImageryMode = "full" | "split" | "background" | "minimal" | "collage";

export type HomeSectionId =
  | "features"
  | "showcase"
  | "collections"
  | "promo"
  | "categories"
  | "story"
  | "sourcing"
  | "subscription"
  | "lifestyle"
  | "testimonials"
  | "pricing"
  | "faq"
  | "cta"
  | "analytics"
  | "platform"
  | "metrics"
  | "seasonal";

export type VisualEnergy = "calm" | "bold" | "cinematic" | "editorial";

export type CreativeLayout = DirectionLayout & {
  sectionOrder: HomeSectionId[];
  heroImagery: HeroImageryMode;
  showStory: boolean;
  showLifestyle: boolean;
  showShowcase: boolean;
  showCollections: boolean;
  showPromo: boolean;
  showCategories: boolean;
  imageFeatures: boolean;
  backgroundStyle: BackgroundStyle;
  typographyModifier: string;
  visualEnergy: VisualEnergy;
};

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: string, salt: string): T {
  return arr[hashSeed(`${seed}:${salt}`) % arr.length];
}

const BOLD_HERO: Record<ProductCategory, HeroLayout[]> = {
  pets: ["editorial-split", "fullscreen", "collage", "visual-first"],
  sports: ["fullscreen", "editorial-split", "collage", "immersive"],
  food: ["editorial-split", "fullscreen", "product-first", "collage"],
  floral: ["fullscreen", "editorial-split", "collage", "visual-first"],
  fitness: ["fullscreen", "immersive", "collage", "asymmetrical"],
  creator: ["fullscreen", "collage", "cinematic", "visual-first"],
  finance: ["cinematic", "editorial-split", "immersive", "split"],
  fashion: ["fullscreen", "editorial", "editorial-split", "collage"],
  edtech: ["visual-first", "split", "immersive", "fullscreen"],
  health: ["immersive", "editorial-split", "fullscreen", "visual-first"],
  saas: ["visual-first", "split", "cinematic", "fullscreen"],
  productivity: ["split", "visual-first", "immersive", "editorial-split"],
  ecommerce: ["fullscreen", "editorial-split", "product-first", "collage"],
  wellness: ["fullscreen", "immersive", "editorial", "editorial-split"],
  science: ["fullscreen", "cinematic", "immersive", "collage"],
  gaming: ["fullscreen", "collage", "cinematic", "immersive"],
  music: ["fullscreen", "collage", "cinematic", "visual-first"],
  luxury: ["editorial-split", "fullscreen", "editorial", "visual-first"],
  generic: ["fullscreen", "visual-first", "editorial-split", "collage"],
};

const CATEGORY_FEATURES: Record<ProductCategory, FeaturesLayout[]> = {
  pets: ["bento", "grid-2", "staggered"],
  sports: ["bento", "staggered", "grid-2"],
  food: ["bento", "grid-2", "staggered"],
  floral: ["bento", "grid-2", "staggered"],
  fitness: ["bento", "staggered", "grid-2"],
  creator: ["bento", "staggered", "grid-2"],
  finance: ["list", "grid-2", "bento"],
  fashion: ["bento", "staggered", "grid-2"],
  edtech: ["grid-2", "bento", "staggered"],
  health: ["grid-2", "bento", "list"],
  saas: ["bento", "grid-2", "staggered"],
  productivity: ["list", "grid-2", "bento"],
  ecommerce: ["bento", "grid-2", "staggered"],
  wellness: ["grid-2", "bento", "staggered"],
  science: ["bento", "staggered", "grid-2"],
  gaming: ["bento", "staggered", "grid-2"],
  music: ["bento", "staggered", "grid-2"],
  luxury: ["staggered", "bento", "grid-2"],
  generic: ["bento", "grid-2", "staggered"],
};

const CATEGORY_BG: Record<ProductCategory, BackgroundStyle[]> = {
  pets: ["photo", "soft", "editorial"],
  sports: ["photo", "gradient-drift", "editorial"],
  food: ["photo", "editorial", "soft"],
  floral: ["photo", "editorial", "soft"],
  fitness: ["gradient-drift", "photo", "aurora"],
  creator: ["gradient-drift", "aurora", "mesh"],
  finance: ["mesh", "editorial", "gradient-drift"],
  fashion: ["editorial", "photo", "soft"],
  edtech: ["soft", "mesh", "gradient-drift"],
  health: ["soft", "photo", "aurora"],
  saas: ["mesh", "gradient-drift", "editorial"],
  productivity: ["mesh", "soft", "gradient-drift"],
  ecommerce: ["photo", "editorial", "gradient-drift"],
  wellness: ["photo", "soft", "aurora"],
  science: ["space", "aurora", "mesh"],
  gaming: ["aurora", "space", "gradient-drift"],
  music: ["aurora", "gradient-drift", "space"],
  luxury: ["editorial", "photo", "soft"],
  generic: ["photo", "mesh", "gradient-drift"],
};

const SECTION_ORDERS: HomeSectionId[][] = [
  ["promo", "showcase", "collections", "categories", "sourcing", "story", "subscription", "features", "lifestyle", "testimonials", "pricing", "faq", "cta"],
  ["collections", "promo", "showcase", "categories", "story", "sourcing", "lifestyle", "subscription", "features", "testimonials", "pricing", "faq", "cta"],
  ["categories", "showcase", "promo", "collections", "lifestyle", "sourcing", "features", "story", "subscription", "testimonials", "pricing", "faq", "cta"],
  ["story", "sourcing", "showcase", "collections", "promo", "categories", "subscription", "features", "lifestyle", "testimonials", "pricing", "faq", "cta"],
  ["lifestyle", "promo", "showcase", "categories", "sourcing", "features", "collections", "subscription", "testimonials", "story", "pricing", "faq", "cta"],
  ["showcase", "categories", "promo", "sourcing", "features", "lifestyle", "collections", "subscription", "testimonials", "pricing", "faq", "cta"],
];

const TYPOGRAPHY: Record<ProductCategory, string[]> = {
  pets: ["font-bold tracking-tight", "font-semibold"],
  sports: ["font-black uppercase tracking-tight", "font-bold tracking-tight"],
  food: ["font-serif font-light tracking-wide", "font-light tracking-[0.06em]"],
  floral: ["font-serif font-light tracking-wide", "font-light tracking-[0.08em]", "font-serif"],
  fitness: ["font-black uppercase tracking-tight", "font-bold tracking-tight", "font-extrabold"],
  creator: ["font-black tracking-tight", "font-bold", "tracking-tight uppercase"],
  finance: ["font-light tracking-tight", "font-medium tracking-wide", "font-semibold"],
  fashion: ["font-serif font-light tracking-[0.06em]", "font-light uppercase tracking-[0.2em]", "font-serif"],
  edtech: ["font-semibold tracking-tight", "font-bold", "tracking-tight"],
  health: ["font-light tracking-wide", "font-medium", "font-light"],
  saas: ["font-semibold tracking-tight", "font-bold tracking-tight", "font-medium"],
  productivity: ["font-medium tracking-tight", "font-semibold", "tracking-tight"],
  ecommerce: ["font-serif font-light", "font-light tracking-wide", "font-semibold tracking-tight"],
  wellness: ["font-light tracking-wide", "font-serif font-light", "font-light"],
  science: ["font-light tracking-tight", "font-mono tracking-tight"],
  gaming: ["font-black uppercase tracking-tight"],
  music: ["font-black tracking-tight"],
  luxury: ["font-serif font-light tracking-[0.12em]"],
  generic: ["font-bold tracking-tight", "font-semibold"],
};

const ENERGY: Record<ProductCategory, VisualEnergy[]> = {
  pets: ["bold", "editorial", "calm"],
  sports: ["bold", "cinematic", "bold"],
  food: ["editorial", "cinematic", "bold"],
  floral: ["editorial", "cinematic", "bold"],
  fitness: ["bold", "cinematic", "bold"],
  creator: ["bold", "cinematic", "editorial"],
  finance: ["cinematic", "calm", "editorial"],
  fashion: ["editorial", "cinematic", "bold"],
  edtech: ["calm", "bold", "cinematic"],
  health: ["calm", "editorial", "cinematic"],
  saas: ["calm", "bold", "cinematic"],
  productivity: ["calm", "bold", "cinematic"],
  ecommerce: ["editorial", "bold", "cinematic"],
  wellness: ["calm", "editorial", "cinematic"],
  science: ["cinematic", "bold", "editorial"],
  gaming: ["bold", "cinematic", "bold"],
  music: ["bold", "cinematic", "editorial"],
  luxury: ["editorial", "cinematic", "calm"],
  generic: ["bold", "cinematic", "editorial"],
};

function orchestraLayout(brief: StartupBrief, seed: string): CreativeLayout {
  const category = detectProductCategory(brief);
  const world = getCategoryWorld(category);
  const base = DIRECTION_LAYOUTS.orchestra;

  if (world.imageryOnly) {
    return {
      ...base,
      hero: category === "food" || category === "floral" ? "fullscreen" : "fullscreen",
      sectionOrder:
        category === "food" || category === "floral"
          ? ["collections", "showcase", "sourcing", "story", "subscription", "lifestyle", "categories", "features", "testimonials", "pricing", "faq", "cta"]
          : ["collections", "showcase", "story", "lifestyle", "categories", "features", "testimonials", "pricing", "faq", "cta"],
      heroImagery: "background",
      showStory: true,
      showLifestyle: true,
      showShowcase: true,
      showCollections: true,
      showPromo: false,
      showCategories: true,
      imageFeatures: true,
      backgroundStyle: "photo",
      typographyModifier: pick(TYPOGRAPHY[category], seed, "typo"),
      visualEnergy: "editorial",
    };
  }

  return {
    ...base,
    sectionOrder: ["features", "testimonials", "pricing", "faq", "cta"],
    heroImagery: "split",
    showStory: false,
    showLifestyle: false,
    showShowcase: false,
    showCollections: false,
    showPromo: false,
    showCategories: false,
    imageFeatures: false,
    backgroundStyle: "soft",
    typographyModifier: "font-semibold tracking-tight",
    visualEnergy: "calm",
  };
}

function minimalLayout(brief: StartupBrief, seed: string): CreativeLayout {
  const category = detectProductCategory(brief);
  const world = getCategoryWorld(category);
  const base = DIRECTION_LAYOUTS["minimal-clean"];

  if (world.imageryOnly) {
    return {
      ...base,
      hero: "product-first",
      sectionOrder: ["showcase", "lifestyle", "story", "features", "testimonials", "pricing", "faq", "cta"],
      heroImagery: "full",
      showStory: true,
      showLifestyle: true,
      showShowcase: true,
      showCollections: false,
      showPromo: false,
      showCategories: false,
      imageFeatures: false,
      backgroundStyle: "none",
      typographyModifier: "font-light tracking-wide",
      visualEnergy: "calm",
    };
  }

  return {
    ...base,
    hero: "minimal",
    sectionOrder: ["features", "testimonials", "pricing", "faq", "cta"],
    heroImagery: "minimal",
    showStory: false,
    showLifestyle: false,
    showShowcase: false,
    showCollections: false,
    showPromo: false,
    showCategories: false,
    imageFeatures: false,
    backgroundStyle: "none",
    typographyModifier: pick(TYPOGRAPHY[category], seed, "typo"),
    visualEnergy: "calm",
  };
}

function heroImageryFor(hero: HeroLayout): HeroImageryMode {
  if (hero === "minimal") return "minimal";
  if (hero === "fullscreen" || hero === "editorial" || hero === "immersive") return "background";
  if (hero === "collage") return "collage";
  if (hero === "editorial-split" || hero === "product-first" || hero === "visual-first") return "full";
  if (hero === "asymmetrical") return "full";
  return "split";
}

function isVisualCategory(c: ProductCategory): boolean {
  return ["food", "floral", "ecommerce", "fashion", "wellness", "creator", "fitness"].includes(c);
}

type DirectionArchetype = {
  hero: HeroLayout;
  features: FeaturesLayout;
  backgroundStyle: BackgroundStyle;
  visualEnergy: VisualEnergy;
  typographyModifier: string;
  sectionOrder: HomeSectionId[];
  showPromo: boolean;
  showCategories: boolean;
  showCollections: boolean;
  showShowcase: boolean;
  showLifestyle: boolean;
  showStory: boolean;
  /** Direction-specific layout rhythm — makes templates visually distinct */
  heroPadding?: string;
  sectionGap?: string;
  headlineScale?: string;
  heroImagery?: HeroImageryMode;
};

/** Per-direction spacing and hierarchy — distinct creative studios, not recolored shells */
const DIRECTION_RHYTHM: Partial<
  Record<DirectionId, Pick<DirectionArchetype, "heroPadding" | "sectionGap" | "headlineScale" | "heroImagery">>
> = {
  "premium-dark": {
    heroPadding: "py-16 md:py-24",
    sectionGap: "py-14 md:py-20",
    headlineScale: "text-4xl md:text-6xl lg:text-7xl",
    heroImagery: "background",
  },
  "minimal-clean": {
    heroPadding: "py-20 md:py-32",
    sectionGap: "py-20 md:py-28",
    headlineScale: "text-3xl md:text-5xl lg:text-6xl",
    heroImagery: "full",
  },
  "bold-experimental": {
    heroPadding: "py-12 md:py-16",
    sectionGap: "py-12 md:py-16",
    headlineScale: "text-4xl md:text-6xl font-black uppercase",
    heroImagery: "collage",
  },
  "luxury-editorial": {
    heroPadding: "py-16 md:py-28",
    sectionGap: "py-18 md:py-24",
    headlineScale: "text-4xl md:text-6xl lg:text-7xl",
    heroImagery: "full",
  },
  "creator-playful": {
    heroPadding: "py-10 md:py-14",
    sectionGap: "py-12 md:py-18",
    headlineScale: "text-4xl md:text-5xl font-black",
    heroImagery: "collage",
  },
  "genz-vibrant": {
    heroPadding: "py-10 md:py-14",
    sectionGap: "py-12 md:py-16",
    headlineScale: "text-4xl md:text-6xl font-black uppercase",
    heroImagery: "collage",
  },
  orchestra: {
    heroPadding: "py-16 md:py-24",
    sectionGap: "py-16 md:py-24",
    headlineScale: "text-4xl md:text-6xl lg:text-7xl",
    heroImagery: "background",
  },
};

/** Each direction gets a distinct visual world — not recolored SaaS templates */
const DIRECTION_ARCHETYPES: Partial<Record<DirectionId, DirectionArchetype>> = {
  "premium-dark": {
    hero: "fullscreen",
    features: "staggered",
    backgroundStyle: "photo",
    visualEnergy: "cinematic",
    typographyModifier: "font-light tracking-tight",
    sectionOrder: ["showcase", "story", "lifestyle", "collections", "features", "testimonials", "pricing", "faq", "cta"],
    showPromo: false,
    showCategories: false,
    showCollections: true,
    showShowcase: true,
    showLifestyle: true,
    showStory: true,
  },
  "bold-experimental": {
    hero: "collage",
    features: "bento",
    backgroundStyle: "photo",
    visualEnergy: "bold",
    typographyModifier: "font-black uppercase tracking-tight",
    sectionOrder: ["promo", "showcase", "features", "lifestyle", "collections", "testimonials", "pricing", "faq", "cta"],
    showPromo: true,
    showCategories: true,
    showCollections: true,
    showShowcase: true,
    showLifestyle: true,
    showStory: false,
  },
  "luxury-editorial": {
    hero: "editorial-split",
    features: "staggered",
    backgroundStyle: "editorial",
    visualEnergy: "editorial",
    typographyModifier: "font-serif font-light tracking-[0.08em]",
    sectionOrder: ["collections", "showcase", "lifestyle", "sourcing", "story", "subscription", "features", "testimonials", "pricing", "faq", "cta"],
    showPromo: false,
    showCategories: true,
    showCollections: true,
    showShowcase: true,
    showLifestyle: true,
    showStory: true,
  },
  "glass-futuristic": {
    hero: "immersive",
    features: "bento",
    backgroundStyle: "aurora",
    visualEnergy: "cinematic",
    typographyModifier: "font-semibold tracking-tight",
    sectionOrder: ["showcase", "features", "lifestyle", "story", "testimonials", "pricing", "faq", "cta"],
    showPromo: false,
    showCategories: false,
    showCollections: false,
    showShowcase: true,
    showLifestyle: true,
    showStory: true,
  },
  "creator-playful": {
    hero: "collage",
    features: "bento",
    backgroundStyle: "gradient-drift",
    visualEnergy: "bold",
    typographyModifier: "font-black tracking-tight",
    sectionOrder: ["promo", "showcase", "lifestyle", "features", "categories", "testimonials", "pricing", "faq", "cta"],
    showPromo: true,
    showCategories: true,
    showCollections: false,
    showShowcase: true,
    showLifestyle: true,
    showStory: false,
  },
  "apple-modern": {
    hero: "visual-first",
    features: "grid-2",
    backgroundStyle: "soft",
    visualEnergy: "calm",
    typographyModifier: "font-semibold tracking-tight",
    sectionOrder: ["showcase", "features", "lifestyle", "testimonials", "pricing", "faq", "cta"],
    showPromo: false,
    showCategories: false,
    showCollections: false,
    showShowcase: true,
    showLifestyle: true,
    showStory: false,
  },
  "retro-tech": {
    hero: "asymmetrical",
    features: "list",
    backgroundStyle: "photo",
    visualEnergy: "bold",
    typographyModifier: "font-mono tracking-tight",
    sectionOrder: ["story", "features", "showcase", "testimonials", "pricing", "faq", "cta"],
    showPromo: false,
    showCategories: false,
    showCollections: false,
    showShowcase: true,
    showLifestyle: false,
    showStory: true,
  },
  "creative-agency": {
    hero: "collage",
    features: "staggered",
    backgroundStyle: "gradient-drift",
    visualEnergy: "bold",
    typographyModifier: "font-black uppercase tracking-tight",
    sectionOrder: ["promo", "showcase", "lifestyle", "features", "collections", "testimonials", "pricing", "faq", "cta"],
    showPromo: true,
    showCategories: false,
    showCollections: true,
    showShowcase: true,
    showLifestyle: true,
    showStory: false,
  },
  "fashion-ai": {
    hero: "fullscreen",
    features: "bento",
    backgroundStyle: "editorial",
    visualEnergy: "editorial",
    typographyModifier: "font-serif font-light tracking-[0.12em]",
    sectionOrder: ["collections", "showcase", "lifestyle", "categories", "story", "features", "testimonials", "pricing", "faq", "cta"],
    showPromo: true,
    showCategories: true,
    showCollections: true,
    showShowcase: true,
    showLifestyle: true,
    showStory: true,
  },
  "genz-vibrant": {
    hero: "collage",
    features: "bento",
    backgroundStyle: "photo",
    visualEnergy: "bold",
    typographyModifier: "font-black uppercase tracking-tight",
    sectionOrder: ["promo", "categories", "showcase", "lifestyle", "features", "collections", "subscription", "testimonials", "pricing", "faq", "cta"],
    showPromo: true,
    showCategories: true,
    showCollections: true,
    showShowcase: true,
    showLifestyle: true,
    showStory: false,
  },
  "cinematic-ai": {
    hero: "fullscreen",
    features: "staggered",
    backgroundStyle: "photo",
    visualEnergy: "cinematic",
    typographyModifier: "font-light tracking-[0.06em]",
    sectionOrder: ["story", "showcase", "sourcing", "lifestyle", "features", "collections", "subscription", "testimonials", "pricing", "faq", "cta"],
    showPromo: false,
    showCategories: false,
    showCollections: true,
    showShowcase: true,
    showLifestyle: true,
    showStory: true,
  },
  "minimal-luxury": {
    hero: "editorial-split",
    features: "grid-2",
    backgroundStyle: "editorial",
    visualEnergy: "editorial",
    typographyModifier: "font-serif font-light tracking-wide",
    sectionOrder: ["collections", "showcase", "lifestyle", "features", "story", "testimonials", "pricing", "faq", "cta"],
    showPromo: false,
    showCategories: true,
    showCollections: true,
    showShowcase: true,
    showLifestyle: true,
    showStory: true,
  },
  "minimal-clean": {
    hero: "product-first",
    features: "grid-2",
    backgroundStyle: "none",
    visualEnergy: "calm",
    typographyModifier: "font-light tracking-wide",
    sectionOrder: ["seasonal", "showcase", "features", "testimonials", "pricing", "faq", "cta"],
    showPromo: false,
    showCategories: false,
    showCollections: false,
    showShowcase: true,
    showLifestyle: false,
    showStory: false,
  },
};

/** Orchestra + minimal-clean stay restrained; all other directions become image-heavy worlds */
export function resolveCreativeLayout(
  brief: StartupBrief,
  direction: DirectionId,
  seed: string
): CreativeLayout {
  if (direction === "orchestra") return orchestraLayout(brief, seed);
  if (direction === "minimal-clean") return minimalLayout(brief, seed);

  const category = detectProductCategory(brief);
  const world = getCategoryWorld(category);
  const base = DIRECTION_LAYOUTS[direction] ?? DIRECTION_LAYOUTS.orchestra;
  const archetype = DIRECTION_ARCHETYPES[direction];

  const hero = archetype?.hero ?? pickFromWorld(world.heroes, seed, "hero");
  const features = archetype?.features ?? pickFromWorld(world.features, seed, "features");
  let backgroundStyle = archetype?.backgroundStyle ?? pickFromWorld(world.backgrounds, seed, "bg");
  if (isImageryOnlyCategory(category) && ["space", "aurora", "mesh", "gradient-drift"].includes(backgroundStyle)) {
    backgroundStyle = "photo";
  }
  const sectionOrder = archetype?.sectionOrder ?? world.sectionOrder;
  const typographyModifier =
    archetype?.typographyModifier ?? pickFromWorld(world.typography, seed, "typo");
  const visualEnergy = archetype?.visualEnergy ?? pickFromWorld(world.energy, seed, "energy");

  const showCollections = archetype?.showCollections ?? world.sections.collections;
  const showShowcase = archetype?.showShowcase ?? world.sections.showcase;
  const showLifestyle = archetype?.showLifestyle ?? world.sections.lifestyle;
  const showStory = archetype?.showStory ?? world.sections.story;
  const showPromo = archetype?.showPromo ?? world.sections.promo;
  const showCategories = archetype?.showCategories ?? world.sections.categories;
  const imageFeatures = world.sections.imageFeatures;

  const testimonialVariants: TestimonialLayout[] = ["featured", "grid", "minimal"];
  const ctaVariants: CtaLayout[] = ["banner", "block", "inline"];
  const rhythm = DIRECTION_RHYTHM[direction] ?? DIRECTION_RHYTHM.orchestra;

  return {
    ...base,
    hero,
    features,
    testimonials: pick(testimonialVariants, seed, "testimonials"),
    cta: pick(ctaVariants, seed, "cta"),
    sectionOrder,
    heroImagery: rhythm?.heroImagery ?? heroImageryFor(hero),
    showStory,
    showLifestyle,
    showShowcase,
    showCollections,
    showPromo,
    showCategories,
    imageFeatures,
    backgroundStyle,
    typographyModifier,
    visualEnergy,
    heroPadding: rhythm?.heroPadding ?? base.heroPadding,
    sectionGap: rhythm?.sectionGap ?? base.sectionGap,
    headlineScale: rhythm?.headlineScale ?? base.headlineScale,
  };
}

export function getResolvedLayout(
  brief: StartupBrief,
  direction: DirectionId,
  seed: string,
  stored?: CreativeLayout | null
): CreativeLayout {
  if (stored) return stored;
  return resolveCreativeLayout(brief, direction, seed);
}

/** Preview thumbnail layout — each direction gets a distinct visual composition */
export type PreviewComposition =
  | "orchestra-clean"
  | "minimal-clean"
  | "editorial-commerce"
  | "fullscreen-hero"
  | "dark-cinematic"
  | "bold-collage"
  | "luxury-editorial"
  | "glass-futuristic"
  | "creator-vibrant"
  | "product-grid"
  | "pet-lifestyle"
  | "sports-analytics";

export function resolvePreviewComposition(
  direction: DirectionId,
  category: ProductCategory,
  seed: string
): PreviewComposition {
  if (direction === "orchestra") return "orchestra-clean";
  if (direction === "minimal-clean") return "minimal-clean";
  if (direction === "premium-dark" || direction === "cinematic-ai") return "dark-cinematic";
  if (direction === "bold-experimental" || direction === "genz-vibrant" || direction === "creative-agency")
    return "bold-collage";
  if (direction === "luxury-editorial" || direction === "fashion-ai" || direction === "minimal-luxury")
    return "luxury-editorial";
  if (direction === "glass-futuristic" || direction === "retro-tech") return "glass-futuristic";
  if (direction === "creator-playful" || direction === "apple-modern") return "creator-vibrant";

  if (category === "floral" || category === "food" || category === "ecommerce" || category === "fashion") {
    return hashSeed(`${seed}:preview`) % 2 === 0 ? "editorial-commerce" : "product-grid";
  }
  if (category === "fitness" || category === "creator") return "fullscreen-hero";
  return pick(
    ["fullscreen-hero", "editorial-commerce", "product-grid", "bold-collage"] as PreviewComposition[],
    seed,
    "preview"
  );
}
