/**
 * Server-side Flux image generation for World V2 hero images.
 *
 * Uses Replicate API directly with category-locked prompts built from
 * visual-universe.ts scene queries. Falls back silently to Unsplash when
 * REPLICATE_API_TOKEN is absent or the request times out.
 *
 * Only used server-side (generate-sections pipeline). Never imported
 * by client components or migration utilities.
 */

import type { StartupBrief } from "@/lib/types/startup";
import type { V2CategoryKey, V2ImageSlot, WorldIdentity, WorldV2Package } from "./types";
import type { ClaudeWorldSpec } from "./claude-world-architect";
import { getVisualUniverse } from "./visual-universe";

const ENDPOINT =
  "https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions";

// Synchronous generation with Replicate wait header.
// Flux 1.1 Pro: p50 ~18s, p95 ~40s. 50s covers the tail without hanging forever.
const WAIT_SECONDS = 50;
const ABORT_MS = (WAIT_SECONDS + 5) * 1000;

/** Build a cinematic prompt — worldAnchor is dominant; category universe provides style context only */
function buildPrompt(category: V2CategoryKey, worldAnchor: string, queryOffset = 0): string {
  const u = getVisualUniverse(category);
  const qi = queryOffset % u.sceneQueries.length;
  const li = queryOffset % u.lighting.length;
  const ci = queryOffset % u.compositions.length;
  const mi = queryOffset % u.moods.length;
  const ai = queryOffset % u.aesthetics.length;
  return [
    // Layer 0: product-specific world anchor — DOMINANT, never diluted
    // This contains the exact product/material from the startup brief (e.g. "ripe yellow bananas")
    worldAnchor,
    // Layer 1: one category scene query for style framing (not second generic query — avoid dilution)
    u.sceneQueries[qi],
    // Layer 2: lighting — from universe definition
    `${u.lighting[li] ?? "cinematic"} lighting`,
    // Layer 3: composition + mood
    `${u.compositions[ci] ?? "environmental"} composition`,
    `${u.moods[mi] ?? "atmospheric"} ${u.aesthetics[ai] ?? "editorial"} aesthetic`,
    // Layer 4: technical grade
    "shot on ARRI Alexa 35mm",
    "editorial campaign photography",
    "8K resolution",
    "subtle film grain",
    "no text overlays, no watermarks, no logos",
  ].join(", ");
}

/** Negative prompt: contamination tokens + universal rejects */
function buildNegative(category: V2CategoryKey): string {
  const u = getVisualUniverse(category);
  return [
    ...u.contaminationTokens,
    "text",
    "watermark",
    "logo",
    "signature",
    "low quality",
    "blurry",
    "jpeg artifacts",
    "cartoon",
    "illustration",
    "clipart",
  ].join(", ");
}

/**
 * Call Replicate Flux 1.1 Pro synchronously. Returns the CDN URL on success,
 * undefined on any failure (timeout, API error, missing token).
 */
export async function generateFluxHeroImage(
  category: V2CategoryKey,
  worldAnchor: string,
  queryOffset = 0,
): Promise<string | undefined> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return undefined;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ABORT_MS);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: `wait=${WAIT_SECONDS}`,
      },
      body: JSON.stringify({
        input: {
          prompt: buildPrompt(category, worldAnchor, queryOffset),
          negative_prompt: buildNegative(category),
          aspect_ratio: "16:9",
          output_format: "webp",
          output_quality: 85,
        },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      console.warn("[flux] Replicate error:", res.status, await res.text().catch(() => ""));
      return undefined;
    }

    const data = (await res.json()) as {
      status?: string;
      output?: string | string[];
      error?: string;
    };

    if (data.status !== "succeeded") {
      // Timed out server-side — prediction still processing
      console.warn("[flux] prediction not done:", data.status, data.error ?? "");
      return undefined;
    }

    const url = Array.isArray(data.output) ? data.output[0] : data.output;
    return typeof url === "string" && url.startsWith("http") ? url : undefined;
  } catch (err) {
    if ((err as Error)?.name !== "AbortError") {
      console.warn("[flux] request error:", (err as Error)?.message ?? err);
    }
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Map an image slot to a cinematic anchor string for Flux.
 * Priority: per-section imageSceneDescription (worldSpec) → role-level direction (worldIdentity) → category fallback
 */
function anchorForRole(
  role: V2ImageSlot["role"],
  isHeroSlot: boolean,
  sectionIdx: number,
  worldSpec: ClaudeWorldSpec | undefined,
  worldIdentity: WorldIdentity | undefined,
  category: string,
  variantKey: string,
): string {
  // PRIMARY: per-section image direction from Claude World Architect
  const specSection = worldSpec?.sections[sectionIdx];
  if (specSection?.imageSceneDescription) {
    return specSection.imageSceneDescription;
  }
  // SECONDARY: role-level direction from world identity
  if (worldIdentity) {
    if (isHeroSlot) return worldIdentity.heroSceneDirection;
    if (role === "feature") return worldIdentity.featureSceneDirection;
    return worldIdentity.editorialSceneDirection;
  }
  return isHeroSlot ? `${category} · ${variantKey}` : `${category} · ${role}`;
}

/**
 * Generate Flux images for every section image slot in parallel.
 * Priority for prompt anchors:
 *   1. worldSpec.sections[i].imageSceneDescription — per-section direction from Claude
 *   2. worldIdentity role directions — hero/feature/editorial from GPT world identity
 *   3. category + variantKey fallback
 * Falls back per-slot to the original Unsplash image if Flux fails for that slot.
 */
export async function injectFluxHero(
  world: WorldV2Package,
  brief: StartupBrief,
  options?: { worldSpec?: ClaudeWorldSpec; worldIdentity?: WorldIdentity },
): Promise<WorldV2Package> {
  const { worldSpec, worldIdentity } = options ?? {};

  // Build a flat job list — one entry per image slot across all sections
  type FluxJob = { sectionIdx: number; imgIdx: number; role: V2ImageSlot["role"] };
  const jobs: FluxJob[] = [];
  world.sections.forEach((section, si) => {
    section.images.forEach((img, ii) => {
      jobs.push({ sectionIdx: si, imgIdx: ii, role: img.role });
    });
  });

  if (jobs.length === 0) return world;

  // Launch all slots in parallel — each gets a unique queryOffset for visual variety
  const seedBase = world.seed.replace(/[^a-z0-9]/gi, "").slice(0, 10);
  const fluxUrls = await Promise.all(
    jobs.map((job, offset) => {
      const isHeroSlot =
        world.sections[job.sectionIdx].type.startsWith("hero") && job.imgIdx === 0;
      const anchor = anchorForRole(
        job.role,
        isHeroSlot,
        job.sectionIdx,
        worldSpec,
        worldIdentity,
        world.category,
        world.variantKey,
      );
      return generateFluxHeroImage(world.category, anchor, offset);
    }),
  );

  // Reconstruct sections — keep original slot if Flux failed for that slot
  const sections = world.sections.map((section, si) => {
    const isHeroSection = section.type.startsWith("hero");
    const newImages = section.images.map((img, ii) => {
      const jobIdx = jobs.findIndex((j) => j.sectionIdx === si && j.imgIdx === ii);
      const fluxUrl = fluxUrls[jobIdx];
      if (!fluxUrl) return img;
      const isHeroSlot = isHeroSection && ii === 0;
      return {
        id: isHeroSlot ? `flux-hero-${seedBase}` : `flux-${si}-${ii}-${img.role}`,
        url: fluxUrl,
        alt: `${world.categoryLabel} ${img.role}`,
        role: img.role,
      } as V2ImageSlot;
    });
    return { ...section, images: newImages };
  });

  const heroSection = sections.find((s) => s.type.startsWith("hero"));
  const heroImage = heroSection?.images[0] ?? world.heroImage;
  const allImageIds = [...new Set(sections.flatMap((s) => s.images.map((img) => img.id)))];

  return { ...world, sections, heroImage, allImageIds };
}
