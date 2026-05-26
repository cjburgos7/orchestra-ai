import type { DirectionId, ImagerySet, StartupBrief } from "@/lib/types/startup";
import type { CategoryResolution } from "@/lib/orchestration/category-resolution";
import { resolveCategory } from "@/lib/orchestration/category-resolution";
import { getCategoryWorld } from "@/lib/orchestration/category-worlds";
import { buildArtDirectedImagery } from "@/lib/imagery/art-directed-pipeline";

function imagerySessionSeed(seed: string, direction: DirectionId): string {
  return seed.includes(":") ? seed : `${seed}:${direction}`;
}

function pickAccent(seed: string, resolution: CategoryResolution): string {
  const pool = getCategoryWorld(resolution.primary).accents;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return pool[Math.abs(h) % pool.length];
}

function buildDirectedImagery(
  brief: StartupBrief,
  seed: string,
  direction: DirectionId,
  accentColor?: string
): ImagerySet {
  const resolution = resolveCategory(brief);
  const accent = accentColor ?? pickAccent(seed, resolution);
  const sessionSeed = imagerySessionSeed(seed, direction);
  return buildArtDirectedImagery(brief, sessionSeed, direction, accent, resolution).imagery;
}

export function buildImagerySet(
  brief: StartupBrief,
  resolution: CategoryResolution,
  seed: string,
  accentColor: string,
  direction: DirectionId = "orchestra"
): ImagerySet {
  const sessionSeed = imagerySessionSeed(seed, direction);
  return buildArtDirectedImagery(brief, sessionSeed, direction, accentColor, resolution).imagery;
}

export function buildImageryFromBrief(
  brief: StartupBrief,
  seed: string,
  accentColor: string,
  direction: DirectionId = "orchestra"
): ImagerySet {
  return buildDirectedImagery(brief, seed, direction, accentColor);
}

export { getCategoryLabel } from "@/lib/orchestration/category-worlds";

/** Rehydrate missing slots with real category photography — never gradient placeholders */
export function ensureImageryComplete(
  imagery: ImagerySet,
  brief: StartupBrief,
  seed: string,
  direction: DirectionId = "orchestra"
): ImagerySet {
  const hasHero = imagery.hero?.startsWith("http");
  const hasProducts = imagery.products.some((p) => p.image.startsWith("http"));
  const hasLifestyle = imagery.lifestyle.some((u) => u.startsWith("http"));

  if (hasHero && hasProducts && hasLifestyle) {
    return imagery;
  }

  const rebuilt = buildDirectedImagery(brief, seed, direction);
  return {
    ...rebuilt,
    ...imagery,
    hero: hasHero ? imagery.hero : rebuilt.hero,
    heroChain: hasHero ? imagery.heroChain : rebuilt.heroChain,
    products: hasProducts ? imagery.products : rebuilt.products,
    lifestyle: hasLifestyle ? imagery.lifestyle : rebuilt.lifestyle,
    inventory: rebuilt.inventory ?? imagery.inventory,
  };
}

export function getWorldCollectionLabels(resolution: CategoryResolution, brief: StartupBrief): string[] {
  const world = getCategoryWorld(resolution.primary);
  if (brief.features.length >= 3) {
    return brief.features.slice(0, 3).map((f) => f.split(" ").slice(0, 3).join(" "));
  }
  return world.collectionLabels;
}

export function getWorldCategoryLabels(resolution: CategoryResolution, brief: StartupBrief): string[] {
  const world = getCategoryWorld(resolution.primary);
  if (brief.features.length >= 4) {
    return brief.features.slice(0, 4);
  }
  return world.categoryBrowseLabels;
}
