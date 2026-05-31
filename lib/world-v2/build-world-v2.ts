import type { StartupBrief } from "@/lib/types/startup";
import { WORLD_V2_VERSION } from "./config";
import { resolveCategoryV2 } from "./resolve-category-v2";
import { getRegistry } from "./registries";
import { assignSectionImages } from "./pick-images";
import { buildRetrievalTrace } from "./semantic-retrieval";
import { pickVariant, typographyFor } from "./variants";
import type { WorldIdentity, WorldV2Package, V2Typography, V2SectionType, V2Section, V2ImageSlot } from "./types";
import type { ClaudeWorldSpec } from "./claude-world-architect";

/** Map world identity typography intent to concrete CSS typography tokens */
function typographyFromIdentity(feel: WorldIdentity["typographyFeel"]): V2Typography {
  switch (feel) {
    case "editorial-serif":
      return {
        displayFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
        displayWeight: 400,
        displayTracking: "-0.03em",
        bodyFamily: "'Inter', system-ui, sans-serif",
        headlineScale: "clamp(4rem, 10vw, 8.5rem)",
      };
    case "bold-sans":
      return {
        displayFamily: "'Helvetica Neue', Arial, sans-serif",
        displayWeight: 900,
        displayTracking: "-0.04em",
        bodyFamily: "system-ui, sans-serif",
        headlineScale: "clamp(4rem, 12vw, 9.5rem)",
      };
    case "precision-mono":
      return {
        displayFamily: "'Helvetica Neue', Arial, sans-serif",
        displayWeight: 700,
        displayTracking: "-0.03em",
        bodyFamily: "'SF Mono', 'Fira Code', monospace",
        headlineScale: "clamp(3.5rem, 9vw, 7.5rem)",
      };
    case "modern-sans":
    default:
      return {
        displayFamily: "'Helvetica Neue', Arial, system-ui, sans-serif",
        displayWeight: 800,
        displayTracking: "-0.035em",
        bodyFamily: "system-ui, sans-serif",
        headlineScale: "clamp(3rem, 8vw, 6.5rem)",
      };
  }
}

/** Default heightVh per section type */
const SECTION_HEIGHT: Record<V2SectionType, number> = {
  "hero-cinematic": 100,
  "hero-editorial-luxury": 100,
  "hero-split-kinetic": 95,
  "hero-athletic": 100,
  "hero-product-saas": 95,
  "stats-band": 28,
  "feature-asymmetric": 68,
  "editorial-mosaic": 85,
  "proof-gallery": 72,
  "story-editorial": 62,
  "testimonial-float": 50,
  "cta-immersive": 58,
};

/** Default image roles per section type */
const SECTION_IMAGE_ROLES: Record<V2SectionType, V2ImageSlot["role"][]> = {
  "hero-cinematic": ["hero"],
  "hero-editorial-luxury": ["hero"],
  "hero-split-kinetic": ["hero", "detail"],
  "hero-athletic": ["hero", "detail"],
  "hero-product-saas": ["hero", "detail"],
  "stats-band": [],
  "feature-asymmetric": ["feature"],
  "editorial-mosaic": ["editorial", "feature", "detail"],
  "proof-gallery": ["editorial", "feature", "ambient"],
  "story-editorial": ["editorial"],
  "testimonial-float": ["ambient"],
  "cta-immersive": ["hero"],
};

/** Map worldIdentity motionFeel to section-level motion per section type */
function motionForSection(
  type: V2SectionType,
  motionFeel: WorldIdentity["motionFeel"]
): V2Section["motion"] {
  const isHero = type.startsWith("hero");
  switch (motionFeel) {
    case "energetic":
      return isHero ? "parallax" : "float";
    case "cinematic":
      return isHero ? "parallax" : type === "feature-asymmetric" ? "float" : "reveal";
    case "editorial":
      return isHero ? "reveal" : type === "cta-immersive" ? "parallax" : "drift";
    case "calm":
    default:
      return "reveal";
  }
}

/**
 * Build section drafts from worldIdentity.sectionSequence.
 * Motion, density, and imageRoles come from worldIdentity signals — not from category templates.
 */
function buildSectionDraftsFromIdentity(
  worldIdentity: WorldIdentity
): Array<{
  id: string;
  type: V2SectionType;
  heightVh: number;
  motion: V2Section["motion"];
  density: V2Section["density"];
  imageRoles: V2ImageSlot["role"][];
  featureIndex?: number;
}> {
  let featureCounter = 0;
  return worldIdentity.sectionSequence.map((type, i) => {
    const featureIndex = type === "feature-asymmetric" ? featureCounter++ : undefined;
    return {
      id: `v2-${i}-${type}`,
      type,
      heightVh: SECTION_HEIGHT[type],
      motion: motionForSection(type, worldIdentity.motionFeel),
      density: worldIdentity.sectionDensity,
      imageRoles: SECTION_IMAGE_ROLES[type],
      featureIndex,
    };
  });
}

/**
 * Build section drafts from a ClaudeWorldSpec.
 * PRIMARY structural driver — section sequence and motion come from the startup's brief,
 * not from any category template.
 */
function buildSectionDraftsFromSpec(
  worldSpec: ClaudeWorldSpec,
  motionFeel: V2Section["motion"] | WorldIdentity["motionFeel"]
): Array<{
  id: string;
  type: V2SectionType;
  heightVh: number;
  motion: V2Section["motion"];
  density: V2Section["density"];
  imageRoles: V2ImageSlot["role"][];
  featureIndex?: number;
}> {
  let featureCounter = 0;
  return worldSpec.sections.map((section, i) => {
    const type = section.type;
    const featureIndex = type === "feature-asymmetric" ? featureCounter++ : undefined;
    return {
      id: `v2-${i}-${type}`,
      type,
      heightVh: SECTION_HEIGHT[type],
      motion: motionForSection(type, motionFeel as WorldIdentity["motionFeel"]),
      density: "balanced" as const,
      imageRoles: SECTION_IMAGE_ROLES[type],
      featureIndex,
    };
  });
}

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return Math.abs(h);
}

function pickAccent(accents: string[], seed: string): string {
  return accents[hashSeed(seed) % accents.length];
}

/**
 * Build isolated World V2 package.
 *
 * Three-tier priority:
 *   1. worldSpec (ClaudeWorldSpec) — section sequence, palette, typography, scene directions
 *   2. worldIdentity (WorldIdentity from GPT) — section sequence, palette, typography (legacy)
 *   3. variant — category-based blueprint fallback
 *
 * worldSpec is the PRIMARY driver. When present, it fully determines structure and identity.
 * worldIdentity is a secondary fallback for existing projects generated before Claude architect.
 * variant is only used when both AI paths fail.
 */
export function buildWorldV2(
  brief: StartupBrief,
  seed: string,
  worldSpec?: ClaudeWorldSpec,
  worldIdentity?: WorldIdentity
): WorldV2Package {
  const { key: category, label: categoryLabel } = resolveCategoryV2(brief);
  const registry = getRegistry(category);
  const variant = pickVariant(category, seed);

  // Palette: worldSpec → worldIdentity → variant
  const accentColor =
    worldSpec?.visualIdentity.palette.accentColor ??
    worldIdentity?.accentColor ??
    pickAccent(registry.accents, seed);
  const secondaryColor =
    worldSpec?.visualIdentity.palette.meshTo ??
    worldIdentity?.meshTo ??
    registry.mesh.to;
  const effectiveMotion =
    worldSpec?.visualIdentity.motionFeel ??
    worldIdentity?.motionFeel ??
    variant.motion;

  // Structure: worldSpec → worldIdentity → variant
  const sectionDrafts = worldSpec?.sections
    ? buildSectionDraftsFromSpec(worldSpec, effectiveMotion)
    : worldIdentity?.sectionSequence
      ? buildSectionDraftsFromIdentity(worldIdentity)
      : variant.sectionBlueprint.map((bp, i) => ({
          id: `v2-${i}-${bp.type}`,
          type: bp.type,
          heightVh: bp.heightVh,
          motion: bp.motion,
          density: bp.density,
          featureIndex: bp.featureIndex,
          imageRoles: bp.imageRoles,
        }));

  const { sections, retrievalPicks, rejectedCount } = assignSectionImages(
    category,
    brief,
    seed,
    effectiveMotion,
    sectionDrafts
  );
  const imageRetrieval = buildRetrievalTrace(category, retrievalPicks, rejectedCount);
  const heroSection = sections.find((s) => s.type.includes("hero"));
  const heroImage =
    heroSection?.images[0] ??
    sections[0]?.images[0] ??
    assignSectionImages(category, brief, seed, effectiveMotion, [
      {
        id: "v2-fallback-hero",
        type: "hero-cinematic",
        heightVh: 100,
        motion: "parallax" as const,
        density: "sparse" as const,
        imageRoles: ["hero" as const],
      },
    ]).sections[0].images[0];

  const allImageIds = [...new Set(sections.flatMap((s) => s.images.map((img) => img.id)))];

  // Typography: worldSpec → worldIdentity → variant
  let typography: V2Typography;
  if (worldSpec) {
    typography = typographyFromIdentity(worldSpec.visualIdentity.typographyPersonality);
  } else if (worldIdentity) {
    typography = typographyFromIdentity(worldIdentity.typographyFeel);
  } else {
    typography = typographyFor(category, variant);
  }

  return {
    version: WORLD_V2_VERSION,
    category,
    categoryLabel,
    variantKey: variant.key,
    variantLabel: variant.label,
    accentColor,
    secondaryColor,
    background:
      worldSpec?.visualIdentity.palette.background ??
      worldIdentity?.background ??
      variant.background,
    foreground:
      worldSpec?.visualIdentity.palette.foreground ??
      worldIdentity?.foreground ??
      variant.foreground,
    meshFrom:
      worldSpec?.visualIdentity.palette.meshFrom ??
      worldIdentity?.meshFrom ??
      variant.meshFrom,
    meshTo:
      worldSpec?.visualIdentity.palette.meshTo ??
      worldIdentity?.meshTo ??
      variant.meshTo,
    typography,
    motion: effectiveMotion,
    sections,
    heroImage,
    allImageIds,
    seed,
    imageRetrieval,
  };
}
