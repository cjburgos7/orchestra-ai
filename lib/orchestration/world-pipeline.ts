/**
 * Category-locked startup world pipeline.
 * Resolution happens first; direction modifies presentation + unique imagery indices.
 */

import type { DirectionId, ImagerySet, ProductCategory, StartupBrief } from "@/lib/types/startup";
import type { PreviewComposition } from "@/lib/orchestration/creative-layouts";
import type { CategoryResolution } from "@/lib/orchestration/category-resolution";
import { resolveCategory, resolutionCopyContext } from "@/lib/orchestration/category-resolution";
import { getCategoryWorld, pickFromWorld } from "@/lib/orchestration/category-worlds";
import { buildArtDirectedImagery } from "@/lib/imagery/art-directed-pipeline";
import { resolveWorldDNA } from "@/lib/orchestration/world-dna";

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return Math.abs(h);
}

function pickAccent(primary: ProductCategory, seed: string): string {
  const pool = getCategoryWorld(primary).accents;
  return pool[hashSeed(seed) % pool.length];
}

export type StartupWorldPackage = {
  resolution: CategoryResolution;
  category: ProductCategory;
  imagery: ImagerySet;
  accentColor: string;
  seed: string;
  direction: DirectionId;
};

/** Build world — direction produces unique imagery while category identity stays locked */
export function buildStartupWorld(
  brief: StartupBrief,
  seed: string,
  direction: DirectionId = "orchestra"
): StartupWorldPackage {
  const resolution = resolveCategory(brief);
  const accentColor = pickAccent(resolution.primary, seed);
  const sessionSeed = `${seed}:${direction}`;
  const { imagery } = buildArtDirectedImagery(brief, sessionSeed, direction, accentColor, resolution);
  return {
    resolution,
    category: resolution.primary,
    imagery,
    accentColor,
    seed,
    direction,
  };
}

export function resolveWorldPreview(
  resolution: CategoryResolution,
  direction: DirectionId,
  seed: string,
  brief?: StartupBrief
): PreviewComposition {
  // Category-specific compositions that override direction (analytics / creator worlds only)
  if (brief) {
    const dna = resolveWorldDNA(brief, resolution);
    if (dna.thumbnailComposition === "sports-analytics") return "sports-analytics";
    if (dna.thumbnailComposition === "creator-vibrant") return "creator-vibrant";
  }

  const world = getCategoryWorld(resolution.primary);

  // Core directions always get distinct thumbnail layouts
  if (direction === "orchestra") {
    if (world.imageryOnly) return "editorial-commerce";
    return "orchestra-clean";
  }
  if (direction === "minimal-clean") return "minimal-clean";
  if (direction === "premium-dark" || direction === "cinematic-ai") return "dark-cinematic";
  if (direction === "bold-experimental" || direction === "genz-vibrant" || direction === "creative-agency")
    return "bold-collage";
  if (direction === "luxury-editorial" || direction === "fashion-ai" || direction === "minimal-luxury")
    return "luxury-editorial";
  if (direction === "glass-futuristic" || direction === "retro-tech") return "glass-futuristic";
  if (direction === "creator-playful" || direction === "apple-modern") return "creator-vibrant";

  const base = world.thumbnailBase as PreviewComposition;

  if (resolution.secondary === "basketball" || resolution.secondary === "soccer" || resolution.secondary === "running") {
    return "fullscreen-hero";
  }

  if (resolution.secondary === "dogs" || resolution.secondary === "cats") {
    if (direction === "premium-dark") return "dark-cinematic";
    return "pet-lifestyle";
  }

  if (world.imageryOnly) {
    return base === "product-grid" ? "editorial-commerce" : base;
  }

  return pickFromWorld(
    [base, "editorial-commerce", "product-grid", "fullscreen-hero"] as PreviewComposition[],
    seed,
    "preview"
  );
}

export function worldNavLabel(resolution: CategoryResolution): string {
  if (resolution.secondary === "basketball" || resolution.secondary === "soccer") return "Train";
  if (resolution.primary === "pets") return "Shop";
  if (resolution.primary === "food" || resolution.primary === "floral") return "Shop";
  if (resolution.primary === "gaming") return "Play";
  return getCategoryWorld(resolution.primary).merchMode === "saas-product" ? "Get started" : "Explore";
}

export function worldHeroEyebrow(resolution: CategoryResolution): string {
  return resolution.visualWorld.split("·")[0]?.trim() ?? getCategoryWorld(resolution.primary).label;
}

export { resolveCategory, resolutionCopyContext, pickFromWorld };
export { getCategoryWorld } from "@/lib/orchestration/category-worlds";

/** @deprecated use resolveCategory().primary */
export function detectProductCategory(brief: StartupBrief): ProductCategory {
  return resolveCategory(brief).primary;
}
