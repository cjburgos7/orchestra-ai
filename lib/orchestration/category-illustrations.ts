/**
 * @deprecated Abstract SVG placeholders removed.
 * Use literal photography via image-sources.ts / category-imagery.ts.
 */

import type { ProductCategory, DirectionId } from "@/lib/types/startup";
import { resolveCategory } from "@/lib/orchestration/category-resolution";
import { resolveImageChain, placeholderSet } from "@/lib/orchestration/image-sources";

/** Returns a literal photo URL — never abstract SVG */
export function categoryIllustration(
  category: ProductCategory,
  seed: string,
  width = 1200,
  height = 800,
  variant = 0,
  direction: DirectionId = "orchestra"
): string {
  const resolution = resolveCategory({
    name: seed,
    tagline: category,
    description: category,
    features: [],
    pricing: { summary: "", tiers: [{ name: "Starter", price: "$0", detail: "" }] },
  });
  return resolveImageChain(resolution, seed, direction, "hero", width, height, variant).url;
}

export function illustrationSet(category: ProductCategory, seed: string, direction: DirectionId = "orchestra") {
  const resolution = resolveCategory({
    name: seed,
    tagline: category,
    description: category,
    features: [],
    pricing: { summary: "", tiers: [{ name: "Starter", price: "$0", detail: "" }] },
  });
  return placeholderSet(resolution, seed, direction);
}
