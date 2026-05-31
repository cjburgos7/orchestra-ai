import type { MotionProfile } from "@/lib/types/startup";

export type V2CategoryKey =
  | "fitness"
  | "floral"
  | "finance"
  | "fashion"
  | "food"
  | "saas"
  | "wellness"
  | "travel"
  | "home"
  | "education"
  | "health"
  | "creator"
  | "sports"
  | "music"
  | "science";

export type V2SectionType =
  | "hero-cinematic"
  | "hero-split-kinetic"
  | "hero-editorial-luxury"   // Motion Sites DNA: text-dominant, image below fold, Instrument Serif
  | "hero-athletic"           // Sports/Fitness: stats-first hierarchy, raw full-bleed image, hard edge
  | "hero-product-saas"       // SaaS/Science: product frame right, feature tags below
  | "editorial-mosaic"
  | "feature-asymmetric"
  | "proof-gallery"
  | "stats-band"
  | "testimonial-float"
  | "story-editorial"
  | "cta-immersive";

export type V2ImageSlot = {
  id: string;
  url: string;
  alt: string;
  role: "hero" | "feature" | "ambient" | "detail" | "editorial";
};

export type V2Section = {
  id: string;
  type: V2SectionType;
  heightVh: number;
  motion: "parallax" | "float" | "reveal" | "drift";
  density: "sparse" | "balanced" | "dense";
  images: V2ImageSlot[];
  /** Feature index when section maps to a feature card */
  featureIndex?: number;
};

export type V2Typography = {
  displayFamily: string;
  displayWeight: number;
  displayTracking: string;
  bodyFamily: string;
  headlineScale: string;
};

export type V2VariantProfile = {
  key: string;
  label: string;
  motion: MotionProfile;
  background: string;
  foreground: string;
  meshFrom: string;
  meshTo: string;
  sectionBlueprint: Array<{
    type: V2SectionType;
    heightVh: number;
    motion: V2Section["motion"];
    density: V2Section["density"];
    imageRoles: V2ImageSlot["role"][];
    featureIndex?: number;
  }>;
};

export type SemanticRetrievalPick = {
  id: string;
  role: V2ImageSlot["role"];
  score: number;
  matchedScenes: string[];
  sceneQuery: string;
};

export type SemanticRetrievalTrace = {
  universe: string;
  sceneQueries: string[];
  picks: SemanticRetrievalPick[];
  rejectedCount: number;
};

/**
 * World identity — generated from startup brief by orchestra-world-design.
 * Drives atmosphere, palette, typography, image direction, AND section structure.
 * All fields consumed by buildWorldV2 and injectFluxHero.
 *
 * sectionSequence replaces variant.sectionBlueprint as the structural driver.
 * It must be derived from the startup's visitor journey, not from its category.
 */
export type WorldIdentity = {
  atmosphere: string;
  visualMood: string;
  background: string;
  foreground: string;
  accentColor: string;
  meshFrom: string;
  meshTo: string;
  typographyFeel: "editorial-serif" | "bold-sans" | "precision-mono" | "modern-sans";
  motionFeel: "calm" | "cinematic" | "energetic" | "editorial";
  heroSceneDirection: string;
  featureSceneDirection: string;
  editorialSceneDirection: string;
  /** Ordered section sequence — the startup's storytelling arc. Drives structure. */
  sectionSequence: V2SectionType[];
  /** Overall density for all sections */
  sectionDensity: "sparse" | "balanced" | "dense";
  /** The visitor journey archetype for this specific startup */
  storyArc: "emotion-first" | "proof-first" | "product-first" | "brand-first";
  /** WHY this startup received this sequence — must not reference category */
  storyArcReasoning: string;
};

export type WorldV2Package = {
  version: typeof import("./config").WORLD_V2_VERSION;
  category: V2CategoryKey;
  categoryLabel: string;
  variantKey: string;
  variantLabel: string;
  accentColor: string;
  secondaryColor: string;
  background: string;
  foreground: string;
  meshFrom: string;
  meshTo: string;
  typography: V2Typography;
  motion: MotionProfile;
  sections: V2Section[];
  heroImage: V2ImageSlot;
  allImageIds: string[];
  seed: string;
  imageRetrieval: SemanticRetrievalTrace;
};
