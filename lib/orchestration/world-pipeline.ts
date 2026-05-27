/**
 * Category-locked startup world pipeline.
 * Resolution happens first; direction modifies presentation + unique imagery indices.
 */

import type { DirectionId, ImagerySet, ProductCategory, StartupBrief } from "@/lib/types/startup";
import type { CategoryResolution } from "@/lib/orchestration/category-resolution";
import { resolveCategory, resolutionCopyContext } from "@/lib/orchestration/category-resolution";
import { getCategoryWorld } from "@/lib/orchestration/category-worlds";
import { buildArtDirectedImagery } from "@/lib/imagery/art-directed-pipeline";

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

export { resolveCategory, resolutionCopyContext };
export { getCategoryWorld } from "@/lib/orchestration/category-worlds";

/** @deprecated use resolveCategory().primary */
export function detectProductCategory(brief: StartupBrief): ProductCategory {
  return resolveCategory(brief).primary;
}
