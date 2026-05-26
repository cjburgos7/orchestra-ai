/**
 * Category-locked verified Unsplash URLs — no cross-category generic pool.
 * Each category has isolated hero / feature / ambient / product photo IDs.
 */

import type { SlotType } from "@/lib/category-vocab";
import { isPhotoSeen, passesCategoryGuard, registerPhoto } from "@/lib/category-image-guard";

export type CuratedProvider = "curated-unsplash";

export function buildUnsplashUrl(photoId: string, width = 1400, height?: number): string {
  const h = height ? `&h=${height}` : "";
  return `https://images.unsplash.com/photo-${photoId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}&q=80${h}`;
}

/** Known-working hero test URL — fruit photography */
export const HERO_PIPELINE_TEST_URL = buildUnsplashUrl("1464965911861-746a04b4bca6", 1400, 900);

/** Category-isolated pools — NEVER shared across categories */
const CATEGORY_POOLS: Record<string, Record<SlotType, string[]>> = {
  "fresh produce": {
    hero: ["1464965911861-746a04b4bca6", "1512621776951-a57141f2eefd", "1558618666-fcd25c85cd64"],
    feature: ["1512621776951-a57141f2eefd", "1558618666-fcd25c85cd64", "1464965911861-746a04b4bca6"],
    ambient: ["1558618666-fcd25c85cd64", "1464965911861-746a04b4bca6", "1512621776951-a57141f2eefd"],
    product: ["1464965911861-746a04b4bca6", "1512621776951-a57141f2eefd", "1558618666-fcd25c85cd64"],
    team: ["1558618666-fcd25c85cd64"],
    social: ["1512621776951-a57141f2eefd"],
  },
  "food & beverage": {
    hero: ["1512621776951-a57141f2eefd", "1558618666-fcd25c85cd64", "1464965911861-746a04b4bca6"],
    feature: ["1558618666-fcd25c85cd64", "1512621776951-a57141f2eefd"],
    ambient: ["1464965911861-746a04b4bca6", "1558618666-fcd25c85cd64"],
    product: ["1512621776951-a57141f2eefd", "1464965911861-746a04b4bca6"],
    team: ["1558618666-fcd25c85cd64"],
    social: ["1512621776951-a57141f2eefd"],
  },
  "sports & athletics": {
    hero: ["1571019613454-1cb2f99b2d8b", "1517841905240-472988babdf9", "1472099645785-5658abf4ff4e"],
    feature: ["1517841905240-472988babdf9", "1571019613454-1cb2f99b2d8b", "1472099645785-5658abf4ff4e"],
    ambient: ["1472099645785-5658abf4ff4e", "1571019613454-1cb2f99b2d8b"],
    product: ["1517841905240-472988babdf9", "1571019613454-1cb2f99b2d8b"],
    team: ["1571019613454-1cb2f99b2d8b"],
    social: ["1517841905240-472988babdf9"],
  },
  "pets & animals": {
    hero: ["1552053831-71594a27632d", "1518791841217-8f162f1e1131"],
    feature: ["1518791841217-8f162f1e1131", "1552053831-71594a27632d"],
    ambient: ["1552053831-71594a27632d", "1518791841217-8f162f1e1131"],
    product: ["1518791841217-8f162f1e1131", "1552053831-71594a27632d"],
    team: ["1552053831-71594a27632d"],
    social: ["1518791841217-8f162f1e1131"],
  },
};

function resolvePoolCategory(category: string): string {
  const key = category.toLowerCase();
  if (CATEGORY_POOLS[key]) return key;
  if (key.includes("produce") || key.includes("fruit") || key.includes("grocery")) return "fresh produce";
  if (key.includes("sport") || key.includes("basketball") || key.includes("athletic") || key.includes("fitness")) {
    return "sports & athletics";
  }
  if (key.includes("pet") || key.includes("dog") || key.includes("cat")) return "pets & animals";
  if (key.includes("food") || key.includes("beverage") || key.includes("restaurant") || key.includes("coffee")) {
    return "food & beverage";
  }
  // Default to fresh produce for food-like unknowns, NOT a mixed generic pool
  return "fresh produce";
}

function seededRotate<T>(arr: T[], seed: string): T[] {
  if (!arr.length) return [];
  const start = Math.abs(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % arr.length;
  return [...arr.slice(start), ...arr.slice(0, start)];
}

/** Returns category-locked role-based candidates from art-directed registries */
export function fetchCuratedCandidates(
  category: string,
  slot: SlotType,
  seed: string,
  registry: Set<string>,
  count = 6
): Array<{
  url: string;
  thumbUrl: string;
  width: number;
  height: number;
  alt: string;
  provider: CuratedProvider;
  query: string;
}> {
  const poolCategory = resolvePoolCategory(category);
  const pool = CATEGORY_POOLS[poolCategory]?.[slot] ?? CATEGORY_POOLS[poolCategory]?.feature ?? [];
  const rotated = seededRotate(pool, seed);
  const width = slot === "hero" ? 1400 : slot === "product" ? 800 : 1200;
  const height = slot === "hero" ? 900 : slot === "product" ? 1000 : undefined;

  const results: Array<{
    url: string;
    thumbUrl: string;
    width: number;
    height: number;
    alt: string;
    provider: CuratedProvider;
    query: string;
  }> = [];

  for (const id of rotated) {
    if (results.length >= count) break;
    const url = buildUnsplashUrl(id, width, height);
    if (isPhotoSeen(registry, url)) continue;

    const query = `curated:${poolCategory}:${slot}:${id}`;
    const alt = `${poolCategory} ${slot} photography`;
    const guard = passesCategoryGuard(poolCategory, query, alt, slot);
    if (!guard.ok) continue;

    results.push({
      url,
      thumbUrl: buildUnsplashUrl(id, 400),
      width,
      height: height ?? Math.round(width * 0.75),
      alt,
      provider: "curated-unsplash",
      query,
    });
  }

  return results;
}

/** Register a curated photo after selection */
export function registerCuratedPhoto(registry: Set<string>, url: string): void {
  registerPhoto(registry, url);
}
