import type { DirectionId, ImagerySet, StartupBrief } from "@/lib/types/startup";
import type { CategoryResolution } from "@/lib/orchestration/category-resolution";
import { resolveCategory } from "@/lib/orchestration/category-resolution";
import { buildArtDirectedImagery } from "@/lib/imagery/art-directed-pipeline";
import { pipelineLog } from "@/lib/pipeline-debug";
import {
  buildGradientPlaceholderImagery,
  categoryPromptFromBrief,
  paletteForBrief,
} from "@/lib/imagery-placeholder";

/** @deprecated use art-directed slot manifest — kept for API route compatibility */
export const IMAGERY_SLOT_MANIFEST = [
  { key: "hero-0", slot: "hero" as const },
  { key: "feature-0", slot: "feature" as const },
  { key: "feature-1", slot: "feature" as const },
  { key: "feature-2", slot: "feature" as const },
  { key: "ambient-0", slot: "ambient" as const },
  { key: "ambient-1", slot: "ambient" as const },
  { key: "product-0", slot: "product" as const },
  { key: "product-1", slot: "product" as const },
  { key: "product-2", slot: "product" as const },
];

export function mapPipelineToImagerySet(
  _images: unknown,
  brief: StartupBrief,
  resolution: CategoryResolution,
  seed: string,
  direction: DirectionId,
  accentColor: string,
  _categoryKey: string
): ImagerySet {
  return buildArtDirectedImagery(brief, seed, direction, accentColor, resolution).imagery;
}

export async function buildImageryFromPipeline(
  brief: StartupBrief,
  seed: string,
  direction: DirectionId,
  accentColor: string
): Promise<ImagerySet> {
  const resolution = resolveCategory(brief);
  const { imagery } = buildArtDirectedImagery(brief, seed, direction, accentColor, resolution);

  pipelineLog("imagery-set-built", {
    registry: imagery.artDirection?.registryId,
    hero: imagery.hero.slice(0, 100),
    heroIsHttp: imagery.hero.startsWith("http"),
    uniqueImages: imagery.artDirection?.selectedImageIds.length,
    lifestyleHttp: imagery.lifestyle.filter((u) => u.startsWith("http")).length,
    productsHttp: imagery.products.filter((p) => p.image.startsWith("http")).length,
    inventory: imagery.inventory,
  });

  return imagery;
}

export { buildGradientPlaceholderImagery, categoryPromptFromBrief, paletteForBrief };
