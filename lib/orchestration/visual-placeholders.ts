import type { ProductCategory, DirectionId, StartupBrief } from "@/lib/types/startup";
import { resolveCategory } from "@/lib/orchestration/category-resolution";
import { placeholderSet as photoPlaceholderSet, resolveImageChain } from "@/lib/orchestration/image-sources";

function briefStub(category: ProductCategory, seed: string): StartupBrief {
  return {
    name: seed,
    tagline: category,
    description: category,
    features: [],
    pricing: { summary: "", tiers: [{ name: "Starter", price: "$0", detail: "" }] },
  };
}

/** Literal photo placeholder — no abstract/SVG art */
export function categoryPlaceholder(
  brief: Pick<StartupBrief, "name" | "tagline" | "description">,
  seed: string,
  width = 1200,
  height = 800,
  direction: DirectionId = "orchestra"
): string {
  const resolution = resolveCategory(brief as StartupBrief);
  return resolveImageChain(resolution, seed, direction, "hero", width, height, 0).url;
}

export function illustrationSet(category: ProductCategory, seed: string, direction: DirectionId = "orchestra") {
  const resolution = resolveCategory(briefStub(category, seed));
  return photoPlaceholderSet(resolution, seed, direction);
}

export { photoPlaceholderSet as placeholderSet };
