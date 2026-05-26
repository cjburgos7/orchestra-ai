import type { DirectionId, ImagerySet, StartupBrief } from "@/lib/types/startup";
import { resolveCategory } from "@/lib/orchestration/category-resolution";
import { getCategoryWorld } from "@/lib/orchestration/category-worlds";
import { CATEGORY_VOCAB, resolveCategory as resolveVocabCategory } from "@/lib/category-vocab";
import { categoryTextureCss } from "@/lib/category-textures";

function categoryPromptFromBrief(brief: StartupBrief): string {
  return [
    brief.name,
    brief.tagline,
    brief.description,
    brief.startupCategory,
    ...(brief.features ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

export function paletteForBrief(brief: StartupBrief, accentColor: string): [string, string, string] {
  const prompt = categoryPromptFromBrief(brief);
  const resolved = resolveVocabCategory(prompt);
  const vocab = CATEGORY_VOCAB[resolved];
  if (vocab?.palette) return vocab.palette;

  const world = getCategoryWorld(resolveCategory(brief).primary);
  return [accentColor || world.mesh.from, world.mesh.to, "#F8FAFC"];
}

function gradientCss(brief: StartupBrief, accentColor: string): string {
  const prompt = categoryPromptFromBrief(brief);
  const category = resolveVocabCategory(prompt);
  const palette = paletteForBrief(brief, accentColor);
  return categoryTextureCss(category, palette);
}

export function buildGradientPlaceholderImagery(
  brief: StartupBrief,
  seed: string,
  direction: DirectionId,
  accentColor: string
): ImagerySet {
  const palette = paletteForBrief(brief, accentColor);
  const gradient = gradientCss(brief, accentColor);

  return {
    hero: "",
    heroFallback: gradient,
    heroChain: [],
    heroAlt: `${brief.name} — ${brief.tagline}`,
    lifestyle: [],
    lifestyleFallbacks: [],
    products: [],
    meshFrom: palette[0],
    meshTo: accentColor || palette[1],
    fallbackGradient: gradient,
    inventory: {
      photoCount: 0,
      hydratedSlots: 0,
      maxProducts: 0,
      maxLifestyle: 0,
      hidePromo: true,
      hideCollections: true,
      hideCategories: true,
      hideLifestyle: true,
      hideShowcase: true,
    },
  };
}

export { categoryPromptFromBrief };
