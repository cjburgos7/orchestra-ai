/**
 * Slot hydration — fills every imagery slot from inventory with priority ordering,
 * smart crop reuse, and layout compression. Never exposes empty or logo placeholders.
 */

import type {
  CreativeLayoutConfig,
  DirectionId,
  ImageryInventoryMeta,
  ImagerySet,
  HomeSectionId,
  ProductCard,
  StartupBrief,
} from "@/lib/types/startup";
import type { CategoryResolution } from "@/lib/orchestration/category-resolution";
import type { CategoryImageSet, ResolvedImage } from "@/lib/image-pipeline";
import { extractPhotoId } from "@/lib/category-image-guard";
import { categoryTextureCss } from "@/lib/category-textures";
import { pickCategoryProducts } from "@/lib/category-commerce";
import { pipelineLog } from "@/lib/pipeline-debug";

export type CropVariant = "hero" | "product" | "feature" | "ambient" | "cinematic";

export type ImageryInventory = ImageryInventoryMeta;

type SlotAssignment = {
  key: string;
  priority: number;
  crop: CropVariant;
};

/** Lower number = higher priority */
const SLOT_PLAN: SlotAssignment[] = [
  { key: "hero-0", priority: 1, crop: "hero" },
  { key: "product-0", priority: 2, crop: "product" },
  { key: "product-1", priority: 3, crop: "product" },
  { key: "product-2", priority: 4, crop: "product" },
  { key: "feature-0", priority: 5, crop: "feature" },
  { key: "feature-1", priority: 6, crop: "feature" },
  { key: "feature-2", priority: 7, crop: "feature" },
  { key: "ambient-0", priority: 8, crop: "ambient" },
  { key: "ambient-1", priority: 9, crop: "ambient" },
];

const CROP_PARAMS: Record<CropVariant, { w: number; h?: number; extra?: string }> = {
  hero: { w: 1600, h: 900, extra: "crop=entropy" },
  product: { w: 720, h: 900, extra: "crop=focalpoint&fp-y=0.45" },
  feature: { w: 1100, h: 800, extra: "crop=entropy" },
  ambient: { w: 1400, h: 700, extra: "crop=entropy&blur=12" },
  cinematic: { w: 1400, h: 800, extra: "crop=entropy&sat=-15&bri=-10&con=12" },
};

function basePhotoUrl(url: string): string {
  const match = url.match(/(https:\/\/images\.unsplash\.com\/photo-[\d]+-[a-f0-9]+)/i);
  return match ? match[1] : url.split("?")[0];
}

/** Same photo, different crop — visually distinct reuse */
export function buildCropVariant(baseUrl: string, variant: CropVariant, salt = 0): string {
  if (!baseUrl.startsWith("http")) return baseUrl;

  const base = basePhotoUrl(baseUrl);
  const params = CROP_PARAMS[variant];
  const parts = [
    "ixlib=rb-4.0.3",
    "auto=format",
    "fit=crop",
    `w=${params.w + (salt % 3) * 40}`,
    params.h ? `h=${params.h}` : "",
    params.extra ?? "",
    "q=80",
  ].filter(Boolean);

  return `${base}?${parts.join("&")}`;
}

function collectSourcePhotos(images: CategoryImageSet): string[] {
  const seen = new Set<string>();
  const photos: string[] = [];

  for (const slot of SLOT_PLAN) {
    const img = images[slot.key];
    if (img?.url?.startsWith("http")) {
      const id = extractPhotoId(img.url);
      if (!seen.has(id)) {
        seen.add(id);
        photos.push(img.url);
      }
    }
  }

  // Also scan any other http entries
  for (const img of Object.values(images)) {
    if (img?.url?.startsWith("http")) {
      const id = extractPhotoId(img.url);
      if (!seen.has(id)) {
        seen.add(id);
        photos.push(img.url);
      }
    }
  }

  return photos;
}

function pickSourcePhoto(sources: string[], slotIndex: number, salt: number): string {
  if (!sources.length) return "";
  return sources[(slotIndex + salt) % sources.length];
}

function assignSlotUrl(
  sources: string[],
  assignment: SlotAssignment,
  slotIndex: number,
  usedVariants: Set<string>
): string {
  if (!sources.length) return "";

  for (let attempt = 0; attempt < sources.length * 2; attempt++) {
    const source = pickSourcePhoto(sources, slotIndex, attempt);
    const url = buildCropVariant(source, assignment.crop, attempt + slotIndex);
    const variantKey = `${extractPhotoId(source)}:${assignment.crop}:${attempt}`;
    if (usedVariants.has(variantKey)) continue;
    usedVariants.add(variantKey);
    return url;
  }

  // Last resort — allow duplicate crop if needed (better than empty)
  const source = pickSourcePhoto(sources, slotIndex, 0);
  return buildCropVariant(source, assignment.crop, slotIndex + 99);
}

export function buildInventoryMeta(photoCount: number, hydrated: number): ImageryInventory {
  if (photoCount >= 6) {
    return {
      photoCount,
      hydratedSlots: hydrated,
      maxProducts: 3,
      maxLifestyle: 5,
      hidePromo: false,
      hideCollections: false,
      hideCategories: false,
      hideLifestyle: false,
      hideShowcase: false,
    };
  }
  if (photoCount >= 4) {
    return {
      photoCount,
      hydratedSlots: hydrated,
      maxProducts: 3,
      maxLifestyle: 4,
      hidePromo: false,
      hideCollections: false,
      hideCategories: false,
      hideLifestyle: false,
      hideShowcase: false,
    };
  }
  if (photoCount >= 2) {
    return {
      photoCount,
      hydratedSlots: hydrated,
      maxProducts: 2,
      maxLifestyle: 2,
      hidePromo: true,
      hideCollections: true,
      hideCategories: true,
      hideLifestyle: true,
      hideShowcase: false,
    };
  }
  return {
    photoCount,
    hydratedSlots: hydrated,
    maxProducts: Math.min(photoCount, 1),
    maxLifestyle: photoCount > 0 ? 1 : 0,
    hidePromo: true,
    hideCollections: true,
    hideCategories: true,
    hideLifestyle: true,
    hideShowcase: true,
  };
}

const SECTIONS_TO_HIDE: Partial<Record<keyof ImageryInventoryMeta, HomeSectionId[]>> = {
  hidePromo: ["promo"],
  hideCollections: ["collections"],
  hideCategories: ["categories"],
  hideLifestyle: ["lifestyle"],
  hideShowcase: ["showcase"],
};

export function compressLayoutForInventory(
  layout: CreativeLayoutConfig,
  inventory: ImageryInventory
): CreativeLayoutConfig {
  const hideSections = new Set<HomeSectionId>();
  for (const [flag, sections] of Object.entries(SECTIONS_TO_HIDE)) {
    if (inventory[flag as keyof ImageryInventoryMeta]) {
      sections?.forEach((s) => hideSections.add(s));
    }
  }
  if (inventory.maxProducts === 0) {
    hideSections.add("showcase");
  }

  const sectionOrder = layout.sectionOrder.filter((id) => !hideSections.has(id));
  const gapBoost = inventory.photoCount < 4 ? "py-24 md:py-32" : layout.sectionGap;
  const headlineScale =
    inventory.photoCount < 3 ? "text-4xl md:text-6xl lg:text-7xl" : layout.headlineScale;

  return {
    ...layout,
    sectionOrder,
    sectionGap: gapBoost,
    headlineScale,
    showPromo: !inventory.hidePromo && layout.showPromo,
    showCollections: !inventory.hideCollections && layout.showCollections,
    showCategories: !inventory.hideCategories && layout.showCategories,
    showLifestyle: !inventory.hideLifestyle && layout.showLifestyle,
    showShowcase: !inventory.hideShowcase && inventory.maxProducts > 0 && layout.showShowcase,
    imageFeatures: inventory.photoCount >= 3 && layout.imageFeatures,
  };
}

/** Products safe to render — must have a real http image */
export function hydratedProducts(products: ProductCard[]): ProductCard[] {
  return products.filter((p) => p.image.startsWith("http"));
}

export function hydrateImagerySet(
  images: CategoryImageSet,
  brief: StartupBrief,
  resolution: CategoryResolution,
  seed: string,
  direction: DirectionId,
  accentColor: string,
  palette: string[],
  categoryKey: string
): { imagery: ImagerySet; inventory: ImageryInventory } {
  const textureCss = categoryTextureCss(categoryKey, palette);
  const sources = collectSourcePhotos(images);
  const usedVariants = new Set<string>();
  const hydrated = new Map<string, string>();

  SLOT_PLAN.forEach((assignment, idx) => {
    const existing = images[assignment.key];
    if (existing?.url?.startsWith("http")) {
      const url = buildCropVariant(existing.url, assignment.crop, idx);
      hydrated.set(assignment.key, url);
      usedVariants.add(`${extractPhotoId(existing.url)}:${assignment.crop}:0`);
      return;
    }
    if (sources.length) {
      hydrated.set(assignment.key, assignSlotUrl(sources, assignment, idx, usedVariants));
    }
  });

  const heroUrl = hydrated.get("hero-0") ?? (sources[0] ? buildCropVariant(sources[0], "hero", 0) : "");
  const lifestyleKeys = ["feature-0", "feature-1", "feature-2", "ambient-0", "ambient-1"];
  const inventory = buildInventoryMeta(sources.length, hydrated.size);

  const lifestyle = lifestyleKeys
    .slice(0, inventory.maxLifestyle)
    .map((key) => hydrated.get(key) ?? "")
    .filter((u) => u.startsWith("http"));

  const worldProducts = pickCategoryProducts(brief, resolution, seed, direction);
  const products: ProductCard[] = worldProducts
    .slice(0, inventory.maxProducts)
    .map((meta) => {
      const url = hydrated.get(meta.slotKey) ?? "";
      const httpUrl = url.startsWith("http") ? url : sources[0] ? buildCropVariant(sources[0], "product", meta.slotKey.length) : "";
      return {
        name: meta.name,
        price: meta.price,
        image: httpUrl,
        imageFallback: textureCss,
        imageChain: httpUrl ? [httpUrl] : [],
      };
    })
    .filter((p) => p.image.startsWith("http"));

  pipelineLog("hydration", {
    sources: sources.length,
    hydrated: hydrated.size,
    products: products.length,
    lifestyle: lifestyle.length,
    inventory,
  });

  const hero =
    heroUrl.startsWith("http")
      ? heroUrl
      : sources[0]
        ? buildCropVariant(sources[0], "hero", 0)
        : "";

  const imagery: ImagerySet = {
    hero,
    heroFallback: textureCss,
    heroChain: hero.startsWith("http") ? [hero] : [],
    heroAlt: `${brief.name} — ${brief.tagline}`,
    lifestyle,
    lifestyleFallbacks: lifestyle.map(() => textureCss),
    products,
    meshFrom: palette[0] ?? accentColor,
    meshTo: accentColor || palette[1] || palette[0],
    fallbackGradient: textureCss,
    inventory,
  };

  return { imagery, inventory };
}
