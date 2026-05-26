/**
 * Art-directed imagery pipeline — role pools, semantic guard, diversity engine,
 * direction rules, and cinematic story flow.
 */

import type { DirectionId, ImagerySet, ProductCard, StartupBrief } from "@/lib/types/startup";
import type { CategoryResolution } from "@/lib/orchestration/category-resolution";
import { resolveCategory } from "@/lib/orchestration/category-resolution";
import { pickCategoryProducts } from "@/lib/category-commerce";
import { categoryTextureCss } from "@/lib/category-textures";
import { pipelineLog } from "@/lib/pipeline-debug";
import { paletteForBrief, categoryPromptFromBrief } from "@/lib/imagery-placeholder";
import { compressLayoutForInventory, buildInventoryMeta } from "@/lib/slot-hydration";
import {
  buildHeroChain,
  buildProductChain,
  countHttpPhotos,
  guaranteeHeroUrl,
  poolForRole,
} from "./photo-chains";

import type { ArtDirectedImageryMeta, CategorizedImage, ImageRole, RegistryId } from "./image-types";
import {
  getCategoryRegistry,
  getImagesForRole,
  resolveRegistryId,
} from "./category-registries";
import { filterSemanticallyValid, validateImageSemanticFit } from "./semantic-guard";
import { DiversityEngine, pickDiverseImage, calculateImageSimilarity, rotateCandidates } from "./diversity-engine";
import {
  applyDirectionTreatment,
  getDirectionVisualRules,
  scoreImageForDirection,
} from "./direction-visual-rules";
import { getStoryFlow, storyRoleForSlot } from "./story-flow";
import { getLayoutDensityRules } from "./layout-density";
import { resolveMotionLayers } from "./motion-layers";

const SLOT_KEYS = [
  "hero-0",
  "product-0",
  "product-1",
  "product-2",
  "feature-0",
  "feature-1",
  "feature-2",
  "ambient-0",
  "ambient-1",
] as const;

function rankCandidates(
  candidates: CategorizedImage[],
  rules: ReturnType<typeof getDirectionVisualRules>
): CategorizedImage[] {
  return [...candidates].sort(
    (a, b) => scoreImageForDirection(b, rules) - scoreImageForDirection(a, rules)
  );
}

function pickForRole(
  registryId: RegistryId,
  role: ImageRole,
  engine: DiversityEngine,
  rules: ReturnType<typeof getDirectionVisualRules>,
  salt: string
): CategorizedImage | null {
  const registry = getCategoryRegistry(registryId);
  const pool = filterSemanticallyValid(registryId, getImagesForRole(registry, role));
  const ranked = rankCandidates(pool, rules);
  const picked = pickDiverseImage(ranked, engine, {
    excludeHeroIds: role !== "hero",
    salt,
  });
  if (!picked) return null;
  return {
    ...picked,
    url: applyDirectionTreatment(picked.url, rules, hashSalt(salt)),
  };
}

function hashSalt(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function pickForSlot(
  registryId: RegistryId,
  slotKey: string,
  engine: DiversityEngine,
  rules: ReturnType<typeof getDirectionVisualRules>,
  sessionSalt: string
): CategorizedImage | null {
  const story = storyRoleForSlot(registryId, slotKey);
  const role =
    story?.role ??
    (slotKey.startsWith("hero")
      ? "hero"
      : slotKey.startsWith("product")
        ? "product"
        : slotKey.startsWith("ambient")
          ? "ambient"
          : "editorial");
  return pickForRole(registryId, role, engine, rules, `${sessionSalt}:${slotKey}`);
}

export function buildArtDirectedImagery(
  brief: StartupBrief,
  seed: string,
  direction: DirectionId,
  accentColor: string,
  resolution?: CategoryResolution
): { imagery: ImagerySet; meta: ArtDirectedImageryMeta } {
  const resolved = resolution ?? resolveCategory(brief);
  const registryId = resolveRegistryId(brief, resolved);
  const registry = getCategoryRegistry(registryId);
  const rules = getDirectionVisualRules(direction);
  const densityRules = getLayoutDensityRules(rules);
  const motionLayers = resolveMotionLayers(direction, "energetic");
  const palette = paletteForBrief(brief, accentColor);
  const textureCss = categoryTextureCss(registryId, palette);
  const sessionSalt = `${seed}:${direction}`;
  const engine = new DiversityEngine();
  const storyFlow = getStoryFlow(registryId);
  const slotImages = new Map<string, CategorizedImage>();

  for (const slotKey of SLOT_KEYS) {
    const img = pickForSlot(registryId, slotKey, engine, rules, sessionSalt);
    if (img && validateImageSemanticFit(registryId, img)) {
      slotImages.set(slotKey, img);
    }
  }

  const heroImg = slotImages.get("hero-0");
  const treat = (url: string, salt: number) => applyDirectionTreatment(url, rules, salt);
  let hero = guaranteeHeroUrl(registryId, heroImg?.url ?? "", sessionSalt, treat);

  const heroChain = buildHeroChain(registryId, hero, sessionSalt, treat, 6);
  if (!hero.startsWith("http") && heroChain[0]) hero = heroChain[0];

  const lifestyleKeys = ["feature-0", "feature-1", "feature-2", "ambient-0", "ambient-1"] as const;
  const photoCount = countHttpPhotos({
    hero,
    heroChain,
    lifestyle: lifestyleKeys.map((key) => slotImages.get(key)?.url ?? "").filter((u) => u.startsWith("http")),
    products: [],
  });
  const inventory = buildInventoryMeta(Math.max(photoCount, engine.selected.length, slotImages.size), slotImages.size);

  let lifestyle = lifestyleKeys
    .slice(0, inventory.maxLifestyle)
    .map((key) => slotImages.get(key)?.url ?? "")
    .filter((u) => u.startsWith("http"));

  if (lifestyle.length < inventory.maxLifestyle) {
    const editorial = poolForRole(registryId, "editorial");
    const extras = rotateCandidates(editorial, `${sessionSalt}:lifestyle`)
      .map((img) => treat(img.url, hashSalt(img.id)))
      .filter((u) => u.startsWith("http") && u !== hero && !lifestyle.includes(u));
    lifestyle = [...lifestyle, ...extras].slice(0, inventory.maxLifestyle);
  }

  const worldProducts = pickCategoryProducts(brief, resolved, seed, direction);
  const filledProducts: ProductCard[] = worldProducts.slice(0, inventory.maxProducts).map((meta, i) => {
    const img = slotImages.get(meta.slotKey);
    let url = img?.url ?? "";
    if (!url.startsWith("http")) {
      url = lifestyle[i] ?? heroChain[i + 1] ?? hero;
    }
    const imageChain = buildProductChain(registryId, url, sessionSalt, meta.slotKey, treat);
    const image = imageChain[0] ?? url;
    return {
      name: meta.name,
      price: meta.price,
      image: image.startsWith("http") ? image : "",
      imageFallback: imageChain[1] ?? heroChain[2] ?? hero,
      imageChain,
    };
  }).filter((p) => p.image.startsWith("http"));

  const meta: ArtDirectedImageryMeta = {
    registryId,
    storyFlow,
    directionRules: rules,
    densityRules,
    motionLayers,
    selectedImageIds: engine.selected.map((i) => i.id),
  };

  pipelineLog("art-directed-imagery", {
    registryId,
    selected: meta.selectedImageIds.length,
    uniqueIds: new Set(meta.selectedImageIds).size,
    products: filledProducts.length,
    lifestyle: lifestyle.length,
    storySections: storyFlow.map((s) => s.section).join("→"),
  });

  const imagery: ImagerySet = {
    hero,
    heroFallback: heroChain[1] ?? hero,
    heroChain,
    heroAlt: `${brief.name} — ${brief.tagline}`,
    lifestyle,
    lifestyleFallbacks: lifestyle.map((_, i) => lifestyle[i + 1] ?? heroChain[i + 2] ?? hero),
    products: filledProducts,
    meshFrom: palette[0] ?? accentColor,
    meshTo: accentColor || palette[1] || palette[0],
    fallbackGradient: textureCss,
    inventory: {
      ...inventory,
      photoCount: countHttpPhotos({ hero, heroChain, lifestyle, products: filledProducts }),
    },
    artDirection: meta,
  };

  return { imagery, meta };
}

export {
  validateImageSemanticFit,
  calculateImageSimilarity,
  DiversityEngine,
  getCategoryRegistry,
  resolveRegistryId,
  getDirectionVisualRules,
  getStoryFlow,
  getLayoutDensityRules,
  resolveMotionLayers,
};
