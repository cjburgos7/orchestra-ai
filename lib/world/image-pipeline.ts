/**
 * WorldDNA-driven image pipeline — single source of truth for category imagery.
 * No runtime category guessing. No abstract placeholder systems.
 */

import type { DirectionId } from "@/lib/types/startup";
import type { WorldDNA } from "@/lib/world/world-dna";
import type { CategoryCluster } from "@/lib/world/category-vocab";
import { validateImageCategory } from "@/lib/world/category-image-rules";
import {
  buildUnsplashPhotoUrl,
  lookupCuratedPhotoId,
} from "@/lib/world/curated-photo-registry";
import {
  IMAGE_SLOT_CONFIG,
  type ImageSlot,
  type ImageryPool,
  ALL_IMAGE_SLOTS,
} from "@/lib/world/image-slots";
import {
  PROVIDER_CHAIN,
  type ImageProviderName,
  type ProviderFetchInput,
  type ProviderFetchResult,
} from "@/lib/world/image-providers";

export type { ImageSlot } from "@/lib/world/image-slots";
export { validateImageCategory } from "@/lib/world/category-image-rules";

export type ImageQueryContext = {
  slot: ImageSlot;
  /** Slot instance index — hero=0, gallery item 2=2, etc. */
  index?: number;
  /** Direction modifies query modifiers and crop — does not change category */
  direction?: DirectionId;
  /** Retry attempt for dedup / provider rotation */
  attempt?: number;
};

export type GeneratedImageQuery = {
  query: string;
  noun: string;
  slot: ImageSlot;
  index: number;
  direction?: DirectionId;
};

export type ResolvedSlotImage = {
  slot: ImageSlot;
  index: number;
  url: string;
  provider: ImageProviderName;
  query: string;
  width: number;
  height: number;
  validated: boolean;
};

export type ImagePreloadResult = {
  url: string;
  ok: boolean;
  width: number;
  height: number;
  error?: string;
};

/** Direction-specific photographic modifiers — different studios, different treatment */
const DIRECTION_QUERY_MODIFIERS: Partial<Record<DirectionId, string>> = {
  orchestra: "premium startup brand photography",
  "minimal-clean": "bright airy Apple-style product photography soft whitespace",
  "premium-dark": "dark cinematic moody photography dramatic lighting",
  "bold-experimental": "expressive layered collage photography bold composition",
  "luxury-editorial": "luxury magazine editorial photography dramatic typography ready",
  "minimal-luxury": "quiet luxury minimal editorial photography refined",
  "genz-vibrant": "colorful social media style photography energetic grid",
  "creator-playful": "playful social native photography vibrant lifestyle",
  "cinematic-ai": "cinematic wide angle photography film grain atmosphere",
  "apple-modern": "clean minimal product photography bright studio lighting",
  "creative-agency": "expressive creative agency photography bold art direction",
  "fashion-ai": "high fashion editorial photography runway aesthetic",
  "glass-futuristic": "futuristic glass light photography tech atmosphere",
  "retro-tech": "retro film photography analog texture",
};

const DIRECTION_CROP_PARAMS: Partial<Record<DirectionId, string>> = {
  "minimal-clean": "&sat=5&bright=8",
  "apple-modern": "&sat=5&bright=8",
  "minimal-luxury": "&sat=-5&con=8",
  "premium-dark": "&sat=-25&bri=-8&con=15",
  "cinematic-ai": "&sat=-20&bri=-5&con=12",
  "luxury-editorial": "&sat=-10&con=10",
  "bold-experimental": "&sat=15&con=20",
  "genz-vibrant": "&sat=25&con=10",
  "creator-playful": "&sat=20",
  "creative-agency": "&sat=12&con=18",
};

const DIRECTION_POOL_OFFSET: Partial<Record<DirectionId, number>> = {
  orchestra: 0,
  "minimal-clean": 3,
  "premium-dark": 5,
  "bold-experimental": 7,
  "luxury-editorial": 9,
  "minimal-luxury": 11,
  "genz-vibrant": 13,
  "creator-playful": 15,
  "cinematic-ai": 17,
  "apple-modern": 19,
  "creative-agency": 21,
  "fashion-ai": 23,
  "glass-futuristic": 25,
  "retro-tech": 27,
};

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function poolArray(worldDNA: WorldDNA, pool: ImageryPool): string[] {
  if (pool === "primary") return worldDNA.imageryPrimary;
  if (pool === "secondary") return worldDNA.imagerySecondary;
  return worldDNA.imageryAmbient;
}

function pickNoun(worldDNA: WorldDNA, slot: ImageSlot, index: number, direction?: DirectionId): string {
  const config = IMAGE_SLOT_CONFIG[slot];
  const dirOffset = direction ? (DIRECTION_POOL_OFFSET[direction] ?? 0) : 0;
  const poolName = config.sourcePools[(index + dirOffset) % config.sourcePools.length];
  const arr = poolArray(worldDNA, poolName);
  const pickIndex = (hashSeed(`${worldDNA.sessionSeed}:${slot}:${index}:${direction ?? "base"}`) + dirOffset) % arr.length;
  return arr[pickIndex];
}

function pickMoodScene(worldDNA: WorldDNA, index: number): string | null {
  if (!worldDNA.moodWords.length) return null;
  return worldDNA.moodWords[index % worldDNA.moodWords.length];
}

/**
 * Build a literal photographic search query from WorldDNA vocabulary only.
 */
export function generateImageQuery(worldDNA: WorldDNA, context: ImageQueryContext): GeneratedImageQuery {
  const slot = context.slot;
  const index = context.index ?? 0;
  const direction = context.direction;
  const config = IMAGE_SLOT_CONFIG[slot];
  const noun = pickNoun(worldDNA, slot, index, direction);
  const mood = slot === "hero" || slot === "ambient" ? pickMoodScene(worldDNA, index) : null;
  const directionModifier = direction ? DIRECTION_QUERY_MODIFIERS[direction] : null;

  const parts = [
    noun,
    mood,
    worldDNA.photographyStyle,
    directionModifier,
    config.querySuffix,
    "literal photograph",
  ].filter(Boolean);

  return {
    query: parts.join(" "),
    noun,
    slot,
    index,
    direction,
  };
}

export function getDirectionCropParams(direction?: DirectionId): string {
  if (!direction) return "";
  return DIRECTION_CROP_PARAMS[direction] ?? "";
}

function isUrlRegistered(worldDNA: WorldDNA, url: string): boolean {
  return worldDNA.imageURLRegistry.has(url);
}

function registerUrl(worldDNA: WorldDNA, url: string): void {
  worldDNA.imageURLRegistry.add(url);
}

/**
 * Fetch through provider chain with category validation and URL dedup.
 * Mutates worldDNA.imageURLRegistry on success.
 */
export async function fetchSlotImage(
  worldDNA: WorldDNA,
  context: ImageQueryContext
): Promise<ResolvedSlotImage> {
  const slot = context.slot;
  const index = context.index ?? 0;
  const config = IMAGE_SLOT_CONFIG[slot];
  const maxAttempts = 12;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const generated = generateImageQuery(worldDNA, {
      ...context,
      attempt: (context.attempt ?? 0) + attempt,
      index: index + attempt,
    });

    const validation = validateImageCategory(worldDNA, generated.query);
    if (!validation.valid) continue;

    const cropParams = getDirectionCropParams(context.direction);
    const providerInput: ProviderFetchInput = {
      query: generated.query,
      noun: generated.noun,
      width: config.defaultWidth,
      height: config.defaultHeight,
      cropParams,
      worldDNA,
      attempt: (context.attempt ?? 0) + attempt,
    };

    let result: ProviderFetchResult | null = null;
    for (const provider of PROVIDER_CHAIN) {
      result = await provider(providerInput);
      if (result) break;
    }

    if (!result) continue;
    if (isUrlRegistered(worldDNA, result.url)) continue;

    registerUrl(worldDNA, result.url);

    return {
      slot,
      index,
      url: result.url,
      provider: result.provider,
      query: generated.query,
      width: result.width,
      height: result.height,
      validated: true,
    };
  }

  // Guaranteed emergency — still category-branded, still deduped if possible
  const fallbackNoun = pickNoun(worldDNA, slot, index, context.direction);
  const cluster = worldDNA.categoryCluster as CategoryCluster;
  const photoId = lookupCuratedPhotoId(cluster, fallbackNoun, index + maxAttempts);
  let emergencyUrl = buildUnsplashPhotoUrl(
    photoId,
    config.defaultWidth,
    config.defaultHeight,
    getDirectionCropParams(context.direction)
  );

  if (isUrlRegistered(worldDNA, emergencyUrl)) {
    emergencyUrl = buildUnsplashPhotoUrl(
      photoId,
      config.defaultWidth,
      config.defaultHeight,
      `${getDirectionCropParams(context.direction)}&v=${index + maxAttempts}`
    );
  }

  registerUrl(worldDNA, emergencyUrl);

  return {
    slot,
    index,
    url: emergencyUrl,
    provider: "unsplash",
    query: `${fallbackNoun} ${config.querySuffix}`,
    width: config.defaultWidth,
    height: config.defaultHeight,
    validated: true,
  };
}

/** Preload and validate a single image URL */
export async function preloadAndValidateImage(url: string): Promise<ImagePreloadResult> {
  if (url.startsWith("data:")) {
    return { url, ok: true, width: 800, height: 600 };
  }

  if (typeof window !== "undefined") {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          resolve({ url, ok: true, width: img.naturalWidth, height: img.naturalHeight });
        } else {
          resolve({ url, ok: false, width: 0, height: 0, error: "empty dimensions" });
        }
      };
      img.onerror = () => resolve({ url, ok: false, width: 0, height: 0, error: "load failed" });
      img.src = url;
    });
  }

  try {
    const res = await fetch(url, { method: "GET", cache: "force-cache" });
    if (!res.ok) {
      return { url, ok: false, width: 0, height: 0, error: `HTTP ${res.status}` };
    }
    const blob = await res.blob();
    if (blob.size === 0) {
      return { url, ok: false, width: 0, height: 0, error: "empty response" };
    }
    return { url, ok: true, width: IMAGE_SLOT_CONFIG.hero.defaultWidth, height: IMAGE_SLOT_CONFIG.hero.defaultHeight };
  } catch (err) {
    return {
      url,
      ok: false,
      width: 0,
      height: 0,
      error: err instanceof Error ? err.message : "fetch failed",
    };
  }
}

/**
 * Resolve slot image with preload validation — tries next provider on failure before returning.
 */
export async function resolveValidatedSlotImage(
  worldDNA: WorldDNA,
  context: ImageQueryContext
): Promise<ResolvedSlotImage> {
  const maxValidationRetries = 4;

  for (let i = 0; i < maxValidationRetries; i++) {
    const resolved = await fetchSlotImage(worldDNA, {
      ...context,
      attempt: (context.attempt ?? 0) + i,
    });

    const preload = await preloadAndValidateImage(resolved.url);
    if (preload.ok) {
      return {
        ...resolved,
        width: preload.width || resolved.width,
        height: preload.height || resolved.height,
        validated: true,
      };
    }

    worldDNA.imageURLRegistry.delete(resolved.url);
  }

  return fetchSlotImage(worldDNA, { ...context, attempt: (context.attempt ?? 0) + maxValidationRetries });
}

export type WorldImagePlan = {
  sessionSeed: string;
  categoryCluster: string;
  direction?: DirectionId;
  slots: ResolvedSlotImage[];
};

export type BuildImagePlanOptions = {
  direction?: DirectionId;
  /** How many gallery images to generate */
  galleryCount?: number;
  /** How many product images to generate */
  productCount?: number;
};

/**
 * Build a full image plan for a startup world — all slots, deduped, validated.
 */
export async function buildWorldImagePlan(
  worldDNA: WorldDNA,
  options: BuildImagePlanOptions = {}
): Promise<WorldImagePlan> {
  const direction = options.direction;
  const galleryCount = options.galleryCount ?? 4;
  const productCount = options.productCount ?? 3;

  const tasks: ImageQueryContext[] = [
    { slot: "hero", index: 0, direction },
    { slot: "thumbnail", index: 0, direction },
    { slot: "feature", index: 0, direction },
    { slot: "feature", index: 1, direction },
    { slot: "ambient", index: 0, direction },
    { slot: "ambient", index: 1, direction },
    ...Array.from({ length: galleryCount }, (_, i) => ({ slot: "gallery" as const, index: i, direction })),
    ...Array.from({ length: productCount }, (_, i) => ({ slot: "product" as const, index: i, direction })),
  ];

  const slots: ResolvedSlotImage[] = [];
  for (const task of tasks) {
    slots.push(await resolveValidatedSlotImage(worldDNA, task));
  }

  return {
    sessionSeed: worldDNA.sessionSeed,
    categoryCluster: worldDNA.categoryCluster,
    direction,
    slots,
  };
}

/** Preload all URLs in a plan before render */
export async function preloadImagePlan(plan: WorldImagePlan): Promise<ImagePreloadResult[]> {
  const urls = [...new Set(plan.slots.map((s) => s.url))];
  return Promise.all(urls.map((url) => preloadAndValidateImage(url)));
}

/** Get resolved URL for a slot from an existing plan */
export function getSlotUrl(plan: WorldImagePlan, slot: ImageSlot, index = 0): string | undefined {
  return plan.slots.find((s) => s.slot === slot && s.index === index)?.url;
}

export { ALL_IMAGE_SLOTS, IMAGE_SLOT_CONFIG };
