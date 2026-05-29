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
import type { V2CategoryKey, V2ImageSlot, WorldV2Package } from "./types";
import { getVisualUniverse } from "./visual-universe";

const ENDPOINT =
  "https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions";

// Synchronous generation with Replicate wait header.
// Flux 1.1 Pro: p50 ~18s, p95 ~40s. 50s covers the tail without hanging forever.
const WAIT_SECONDS = 50;
const ABORT_MS = (WAIT_SECONDS + 5) * 1000;

/** Build a 5-layer cinematic prompt from the category's visual universe */
function buildPrompt(category: V2CategoryKey): string {
  const u = getVisualUniverse(category);
  return [
    // Layer 1: scene (2 queries for richness)
    u.sceneQueries.slice(0, 2).join(", "),
    // Layer 2: category-pure subject anchors
    u.purityTokens.slice(0, 3).join(", "),
    // Layer 3: lighting from universe definition
    `${u.lighting[0] ?? "cinematic"} lighting`,
    // Layer 4: composition + mood
    `${u.compositions[0] ?? "environmental"} composition`,
    `${u.moods[0] ?? "atmospheric"} ${u.aesthetics[0] ?? "editorial"} aesthetic`,
    // Layer 5: technical grade
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
  _brief: StartupBrief,
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
          prompt: buildPrompt(category),
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
 * Replace the hero section's primary image with a Flux-generated URL.
 * All other section images remain as Unsplash fallbacks.
 * Returns the original world unchanged if Flux fails.
 */
export async function injectFluxHero(
  world: WorldV2Package,
  brief: StartupBrief,
): Promise<WorldV2Package> {
  const fluxUrl = await generateFluxHeroImage(world.category, brief);
  if (!fluxUrl) return world;

  const fluxId = `flux-hero-${world.seed.replace(/[^a-z0-9]/gi, "").slice(0, 10)}`;
  const fluxSlot: V2ImageSlot = {
    id: fluxId,
    url: fluxUrl,
    alt: `${world.categoryLabel} cinematic hero`,
    role: "hero",
  };

  const sections = world.sections.map((s) => {
    if (!s.type.startsWith("hero")) return s;
    return { ...s, images: [fluxSlot, ...s.images.slice(1)] };
  });

  return {
    ...world,
    sections,
    heroImage: fluxSlot,
    allImageIds: [...new Set([fluxId, ...world.allImageIds])],
  };
}
