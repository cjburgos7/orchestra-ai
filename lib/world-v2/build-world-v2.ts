import type { StartupBrief } from "@/lib/types/startup";
import { WORLD_V2_VERSION } from "./config";
import { resolveCategoryV2 } from "./resolve-category-v2";
import { getRegistry } from "./registries";
import { assignSectionImages } from "./pick-images";
import { buildRetrievalTrace } from "./semantic-retrieval";
import { pickVariant, typographyFor } from "./variants";
import type { WorldV2Package } from "./types";

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return Math.abs(h);
}

function pickAccent(accents: string[], seed: string): string {
  return accents[hashSeed(seed) % accents.length];
}

/** Build isolated World V2 package — no legacy layout/imagery systems */
export function buildWorldV2(brief: StartupBrief, seed: string): WorldV2Package {
  const { key: category, label: categoryLabel } = resolveCategoryV2(brief);
  const registry = getRegistry(category);
  const variant = pickVariant(category, seed);
  const accentColor = pickAccent(registry.accents, seed);
  const secondaryColor = registry.mesh.to;

  const sectionDrafts = variant.sectionBlueprint.map((bp, i) => ({
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
    variant.motion,
    sectionDrafts
  );
  const imageRetrieval = buildRetrievalTrace(category, retrievalPicks, rejectedCount);
  const heroSection = sections.find((s) => s.type.includes("hero"));
  const heroImage =
    heroSection?.images[0] ??
    sections[0]?.images[0] ??
    assignSectionImages(category, brief, seed, variant.motion, [
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

  return {
    version: WORLD_V2_VERSION,
    category,
    categoryLabel,
    variantKey: variant.key,
    variantLabel: variant.label,
    accentColor,
    secondaryColor,
    background: variant.background,
    foreground: variant.foreground,
    meshFrom: variant.meshFrom,
    meshTo: variant.meshTo,
    typography: typographyFor(category, variant),
    motion: variant.motion,
    sections,
    heroImage,
    allImageIds,
    seed,
    imageRetrieval,
  };
}
