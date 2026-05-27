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
import {
  createPipelineTrace,
  finalizePipelineTrace,
  type PipelineRejection,
  type PipelineSlotPick,
  type PipelineTrace,
  urlToId,
} from "@/lib/pipeline-trace";
import { paletteForBrief } from "@/lib/imagery-placeholder";
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
import {
  createWorldDNA,
  briefToRawInput,
  toDirectionKey,
  rankByWorldIntelligence,
  categorizedToMediaCandidate,
  passesWorldHardBlocklist,
  scoreCategorizedImage,
} from "@/lib/world-intelligence";
import type { MediaCandidate } from "@/lib/world-intelligence";
import { isVerifiedPhotoId } from "./verified-photos";

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

function hashSalt(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function pickForRoleTraced(
  registryId: RegistryId,
  slotKey: string,
  role: ImageRole,
  engine: DiversityEngine,
  rules: ReturnType<typeof getDirectionVisualRules>,
  salt: string,
  worldDna: ReturnType<typeof createWorldDNA>,
  dirKey: ReturnType<typeof toDirectionKey>,
  selectedMedia: MediaCandidate[]
): { image: CategorizedImage | null; pick: PipelineSlotPick } {
  const rejected: PipelineRejection[] = [];
  const registry = getCategoryRegistry(registryId);
  const rawPool = getImagesForRole(registry, role).filter((img) => isVerifiedPhotoId(registryId, img.id));
  const query = `${registryId}:${role}:${slotKey}`;

  for (const img of getImagesForRole(registry, role)) {
    if (!isVerifiedPhotoId(registryId, img.id)) {
      rejected.push({
        imageId: img.id,
        stage: "semantic-guard",
        reason: "Unverified/dead Unsplash URL (HTTP 404 probe)",
      });
      continue;
    }
    if (!validateImageSemanticFit(registryId, img)) {
      rejected.push({
        imageId: img.id,
        stage: "semantic-guard",
        reason: `Failed semantic fit for tags: ${img.tags.join(", ")}`,
      });
    }
  }

  const pool = filterSemanticallyValid(registryId, rawPool);
  const blocklistSafe = pool.filter((img) => {
    const ok = passesWorldHardBlocklist(worldDna, img);
    if (!ok) {
      rejected.push({ imageId: img.id, stage: "world-blocklist", reason: "World DNA hard blocklist" });
    }
    return ok;
  });

  for (const img of blocklistSafe) {
    const score = scoreCategorizedImage(img, worldDna, dirKey, selectedMedia);
    if (!score.passed) {
      rejected.push({
        imageId: img.id,
        stage: "world-score",
        reason: score.rejection ?? `Score ${score.total.toFixed(2)} below threshold`,
      });
    }
  }

  const worldRanked = rankByWorldIntelligence(blocklistSafe, worldDna, dirKey, selectedMedia);
  const ranked = rankCandidates(worldRanked.length ? worldRanked : blocklistSafe, rules);

  let picked: CategorizedImage | null = null;
  const rotated = rotateCandidates(ranked, salt);
  for (const img of rotated) {
    if (engine.canUse(img, true)) {
      engine.register(img);
      picked = img;
      break;
    }
    rejected.push({ imageId: img.id, stage: "diversity", reason: "Diversity engine rejected (duplicate/similar)" });
  }
  if (!picked) {
    for (const img of rotated) {
      if (engine.canUse(img, false)) {
        engine.register(img);
        picked = img;
        break;
      }
    }
  }

  const pick: PipelineSlotPick = {
    slot: slotKey,
    role,
    imageId: picked?.id ?? null,
    url: picked?.url ?? null,
    tags: picked?.tags ?? [],
    query,
    rejected,
  };

  if (picked) {
    selectedMedia.push(categorizedToMediaCandidate(picked));
    return {
      image: {
        ...picked,
        url: applyDirectionTreatment(picked.url, rules, hashSalt(salt)),
      },
      pick,
    };
  }

  return { image: null, pick };
}

function pickForSlot(
  registryId: RegistryId,
  slotKey: string,
  engine: DiversityEngine,
  rules: ReturnType<typeof getDirectionVisualRules>,
  sessionSalt: string,
  worldDna: ReturnType<typeof createWorldDNA>,
  dirKey: ReturnType<typeof toDirectionKey>,
  selectedMedia: MediaCandidate[],
  trace: PipelineTrace
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

  const { image, pick } = pickForRoleTraced(
    registryId,
    slotKey,
    role,
    engine,
    rules,
    `${sessionSalt}:${slotKey}`,
    worldDna,
    dirKey,
    selectedMedia
  );
  trace.slots.push(pick);
  if (image && !validateImageSemanticFit(registryId, image)) {
    pick.rejected.push({ imageId: image.id, stage: "slot-validate", reason: "Post-pick semantic validation failed" });
    return null;
  }
  return image;
}

function pickUniqueFromPools(
  registryId: RegistryId,
  roles: ImageRole[],
  engine: DiversityEngine,
  rules: ReturnType<typeof getDirectionVisualRules>,
  salt: string,
  usedUrls: Set<string>,
  worldDna: ReturnType<typeof createWorldDNA>,
  trace: PipelineTrace,
  label: string
): string {
  const rejected: PipelineRejection[] = [];
  for (const role of roles) {
    const rawPool = getImagesForRole(getCategoryRegistry(registryId), role);
    for (const img of rawPool) {
      if (!validateImageSemanticFit(registryId, img)) {
        rejected.push({
          imageId: img.id,
          stage: "semantic-guard",
          reason: `fill:${label} — semantic fit failed (${img.tags.join(", ")})`,
        });
      }
    }
    const pool = rotateCandidates(poolForRole(registryId, role), `${salt}:${role}`);
    for (const img of pool) {
      if (!passesWorldHardBlocklist(worldDna, img)) {
        rejected.push({ imageId: img.id, stage: "world-blocklist", reason: `fill:${label}` });
        continue;
      }
      if (engine.usedImageIds.has(img.id)) {
        rejected.push({ imageId: img.id, stage: "diversity", reason: `fill:${label} — already used` });
        continue;
      }
      const url = applyDirectionTreatment(img.url, rules, hashSalt(`${salt}:${img.id}`));
      if (!url.startsWith("http") || usedUrls.has(url)) continue;
      engine.register(img);
      usedUrls.add(url);
      trace.slots.push({
        slot: label,
        role,
        imageId: img.id,
        url,
        tags: img.tags,
        query: `${registryId}:fill:${role}:${label}`,
        rejected,
      });
      return url;
    }
  }
  trace.warnings.push(`pickUniqueFromPools exhausted for ${label} (roles: ${roles.join(", ")})`);
  if (rejected.length) {
    trace.slots.push({
      slot: label,
      role: roles[0] ?? "product",
      imageId: null,
      url: null,
      tags: [],
      query: `${registryId}:fill:failed:${label}`,
      rejected,
    });
  }
  return "";
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
  const rules = getDirectionVisualRules(direction);
  const densityRules = getLayoutDensityRules(rules);
  const motionLayers = resolveMotionLayers(direction, "energetic");
  const palette = paletteForBrief(brief, accentColor);
  const textureCss = categoryTextureCss(registryId, palette);
  const sessionSalt = `${seed}:${direction}`;
  const worldDna = createWorldDNA(brief.name, briefToRawInput(brief), sessionSalt);
  const dirKey = toDirectionKey(direction);
  const selectedMedia: MediaCandidate[] = [];
  const engine = new DiversityEngine();
  const storyFlow = getStoryFlow(registryId);
  const slotImages = new Map<string, CategorizedImage>();

  const trace = createPipelineTrace({
    briefName: brief.name,
    seed: sessionSalt,
    direction,
    registryId,
    category: resolved.primary,
    secondary: resolved.secondary,
  });

  for (const slotKey of SLOT_KEYS) {
    const img = pickForSlot(
      registryId,
      slotKey,
      engine,
      rules,
      sessionSalt,
      worldDna,
      dirKey,
      selectedMedia,
      trace
    );
    if (img) slotImages.set(slotKey, img);
  }

  const treat = (url: string, salt: number) => applyDirectionTreatment(url, rules, salt);
  const heroImg = slotImages.get("hero-0");
  let hero = guaranteeHeroUrl(registryId, heroImg?.url ?? "", sessionSalt, treat);
  const heroChain = buildHeroChain(registryId, hero, sessionSalt, treat, 6);
  if (!hero.startsWith("http") && heroChain[0]) hero = heroChain[0];

  const usedUrls = new Set<string>([hero, ...heroChain]);
  const lifestyleKeys = ["feature-0", "feature-1", "feature-2", "ambient-0", "ambient-1"] as const;

  let lifestyle = lifestyleKeys
    .map((key) => slotImages.get(key)?.url ?? "")
    .filter((u) => u.startsWith("http") && !usedUrls.has(u));

  lifestyle.forEach((u) => usedUrls.add(u));

  const inventory = buildInventoryMeta(
    Math.max(countHttpPhotos({ hero, heroChain, lifestyle, products: [] }), engine.selected.length, slotImages.size),
    slotImages.size
  );

  while (lifestyle.length < inventory.maxLifestyle) {
    const extra = pickUniqueFromPools(
      registryId,
      ["macro", "lifestyle", "ambient", "product"],
      engine,
      rules,
      `${sessionSalt}:lifestyle-${lifestyle.length}`,
      usedUrls,
      worldDna,
      trace,
      `lifestyle-fill-${lifestyle.length}`
    );
    if (!extra) break;
    lifestyle.push(extra);
  }

  const worldProducts = pickCategoryProducts(brief, resolved, seed, direction);
  const filledProducts: ProductCard[] = worldProducts.slice(0, inventory.maxProducts).map((meta, i) => {
    const img = slotImages.get(meta.slotKey);
    let url = img?.url ?? "";
    if (!url.startsWith("http")) {
      url = pickUniqueFromPools(
        registryId,
        ["product", "macro"],
        engine,
        rules,
        `${sessionSalt}:product-fill-${meta.slotKey}`,
        usedUrls,
        worldDna,
        trace,
        `product-fill-${meta.slotKey}`
      );
    }
    if (url) usedUrls.add(url);
    const imageChain = buildProductChain(registryId, url, sessionSalt, meta.slotKey, treat).filter(
      (u) => !usedUrls.has(u) || u === url
    );
    const image = url.startsWith("http") ? url : "";
    return {
      name: meta.name,
      price: meta.price,
      image,
      imageFallback: imageChain[1] ?? heroChain.find((u) => !usedUrls.has(u)) ?? heroChain[1] ?? hero,
      imageChain,
    };
  }).filter((p) => p.image.startsWith("http"));

  const photoCount = countHttpPhotos({ hero, heroChain, lifestyle, products: filledProducts });

  trace.finalUrls = {
    hero,
    heroChain,
    lifestyle,
    products: filledProducts.map((p) => ({ name: p.name, image: p.image, fallback: p.imageFallback })),
  };
  trace.httpPhotoCount = photoCount;
  finalizePipelineTrace(trace);

  const meta: ArtDirectedImageryMeta = {
    registryId,
    storyFlow,
    directionRules: rules,
    densityRules,
    motionLayers,
    selectedImageIds: engine.selected.map((i) => i.id),
    pipelineTrace: trace,
  };

  pipelineLog("art-directed-imagery", {
    registryId,
    selected: meta.selectedImageIds.length,
    uniqueIds: new Set(meta.selectedImageIds).size,
    products: filledProducts.length,
    lifestyle: lifestyle.length,
    photoCount,
    duplicates: trace.duplicateIds,
  });

  const imagery: ImagerySet = {
    hero,
    heroFallback: heroChain.find((u) => u !== hero && !usedUrls.has(u)) ?? heroChain[1] ?? hero,
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
      photoCount,
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
