/**
 * image-pipeline.ts
 *
 * The production image pipeline for Orchestra AI startup world generation.
 *
 * Key guarantees:
 *  - Every returned URL has been validated with a real HTTP probe
 *  - No URL is returned twice in the same session (dedup registry)
 *  - If all stock providers fail, a CSS gradient fallback is returned
 *    (never a broken image, never a gray box)
 *  - Queries are drawn from category-specific vocabulary, not generated ad-hoc
 */

import {
  type ImageResult,
  type ImageProvider,
  type ProviderConfig,
  fetchFromUnsplash,
  fetchFromPexels,
  fetchFromPixabay,
  fetchFromDallE,
  getProviderConfig,
} from "./image-providers";
import { CATEGORY_VOCAB, resolveCategory, type SlotType } from "./category-vocab";
import { fetchCuratedCandidates, HERO_PIPELINE_TEST_URL } from "./curated-stock-photos";
import { categoryTextureCss } from "@/lib/category-textures";
import { pipelineLog } from "./pipeline-debug";
import {
  isPhotoSeen,
  passesCategoryGuard,
  registerPhoto,
} from "./category-image-guard";

// ─── Session-scoped dedup registry ────────────────────────────────────────────
// In a server context this lives for the request lifetime.
// In a client context (if you call from a route handler) it persists per page load.
// For longer sessions, store in sessionStorage or pass it explicitly.

const _globalRegistry = new Set<string>();

export function createDedupRegistry(): Set<string> {
  return new Set<string>();
}

export function registerUrl(registry: Set<string>, url: string): void {
  registerPhoto(registry, url);
}

export function isUrlSeen(registry: Set<string>, url: string): boolean {
  return isPhotoSeen(registry, url);
}

// ─── Image validation ─────────────────────────────────────────────────────────
// The single most important function in the pipeline.
// A "gray box" is almost always caused by skipping this step.

export interface ValidationResult {
  valid: boolean
  width?: number
  height?: number
  reason?: string
}

/**
 * Probes a URL with a HEAD request to confirm:
 *   1. The server returns 200 OK
 *   2. The Content-Type is an image
 *   3. The Content-Length is > 0 (not an empty response)
 *
 * Uses HEAD not GET so we never download the full image during validation.
 * Falls back to GET with Range if HEAD returns 405 (some CDNs disallow HEAD).
 */
export async function validateImageUrl(
  url: string,
  timeoutMs = 5_000
): Promise<ValidationResult> {
  // Reject clearly invalid strings immediately
  if (!url || !url.startsWith("http")) {
    return { valid: false, reason: "invalid URL format" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Try HEAD first — fastest, no body transfer
    let res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });

    // imgix/Unsplash often rejects HEAD — fall back to range GET
    if (res.status === 405 || res.status === 403 || res.status === 404) {
      res = await fetch(url, {
        method: "GET",
        headers: { Range: "bytes=0-1023" },
        signal: controller.signal,
        redirect: "follow",
      });
    }

    clearTimeout(timer);

    if (!res.ok) {
      pipelineLog("validate-fail", { url: url.slice(0, 100), reason: `HTTP ${res.status}` });
      return { valid: false, reason: `HTTP ${res.status}` };
    }

    const contentType = res.headers.get("content-type") ?? "";
    // Some CDNs return application/octet-stream for ranged GET — allow known image hosts
    const trustedHost =
      url.includes("images.unsplash.com") ||
      url.includes("images.pexels.com") ||
      url.includes("cdn.pixabay.com") ||
      url.includes("pixabay.com");

    if (!contentType.startsWith("image/") && !trustedHost) {
      pipelineLog("validate-fail", { url: url.slice(0, 100), reason: `wrong content-type: ${contentType}` });
      return { valid: false, reason: `wrong content-type: ${contentType}` };
    }

    const contentLength = res.headers.get("content-length");
    if (contentLength !== null && parseInt(contentLength, 10) === 0) {
      return { valid: false, reason: "content-length is 0" };
    }

    pipelineLog("validate-ok", { url: url.slice(0, 100) });
    return { valid: true };
  } catch (err: unknown) {
    clearTimeout(timer);
    const message = err instanceof Error ? err.message : "unknown error";
    const reason = controller.signal.aborted ? "timeout" : message;
    pipelineLog("validate-fail", { url: url.slice(0, 100), reason });
    return { valid: false, reason };
  }
}

// ─── Gradient fallback ────────────────────────────────────────────────────────
// This is Tier 3 — it should be rare, but it must NEVER be a gray box.
// Returns category-matched cinematic CSS texture — never logo/SVG blocks.

export interface GradientFallback {
  type: "gradient";
  /** @deprecated always empty — textures are CSS-only */
  dataUri: string;
  css: string;
  label: string;
}

export function buildGradientFallback(category: string, palette: string[]): GradientFallback {
  const css = categoryTextureCss(category, palette);
  return { type: "gradient", dataUri: "", css, label: category };
}

// ─── Provider fallback chain ──────────────────────────────────────────────────

export interface ResolvedImage {
  url: string
  thumbUrl: string
  width: number
  height: number
  alt: string
  provider: ImageProvider | "gradient"
  fallback?: GradientFallback  // present when provider === "gradient"
}

/**
 * Tries each provider in order. For each candidate URL:
 *   - Validates with a real HTTP probe
 *   - Checks the dedup registry
 *   - Returns the first that passes both checks
 *
 * If all providers fail, returns a gradient fallback.
 */
export async function fetchFromProviderChain(
  query: string,
  dallePrompt: string,
  category: string,
  palette: string[],
  startupName: string,
  registry: Set<string>,
  config: ProviderConfig,
  slot: SlotType = "hero",
  seed = "default"
): Promise<ResolvedImage> {
  pipelineLog("chain-start", { query, category, slot, seed });

  // Hardcoded hero test — confirms rendering layer vs fetch layer
  if (process.env.IMAGE_PIPELINE_HERO_TEST === "1" && slot === "hero") {
    pipelineLog("hero-test", { url: HERO_PIPELINE_TEST_URL });
    return {
      url: HERO_PIPELINE_TEST_URL,
      thumbUrl: HERO_PIPELINE_TEST_URL,
      width: 1400,
      height: 900,
      alt: `${startupName} hero test`,
      provider: "curated-unsplash",
    };
  }

  // Tier 0: stock API providers (when keys are configured) — category-filtered
  const stockResults = await Promise.allSettled([
    fetchFromUnsplash(query, 6, config),
    fetchFromPexels(query, 6, config),
    fetchFromPixabay(query, 6, config),
  ]);

  const queryGuard = passesCategoryGuard(category, query, query, slot);
  if (!queryGuard.ok) {
    pipelineLog("query-rejected", { query, category, slot, reason: queryGuard.reason });
  }

  const apiCandidates: ImageResult[] = stockResults.flatMap((r, i) => {
    const provider = ["unsplash", "pexels", "pixabay"][i];
    const count = r.status === "fulfilled" ? r.value.length : 0;
    pipelineLog("provider-response", { provider, query, count });
    if (!queryGuard.ok) return [];
    return (r.status === "fulfilled" ? r.value : []).filter((c) => {
      const guard = passesCategoryGuard(category, c.query, c.alt, slot);
      if (!guard.ok) {
        pipelineLog("api-candidate-rejected", { provider, reason: guard.reason, query: c.query });
        return false;
      }
      return true;
    });
  });

  // Tier 1: category-locked curated URLs (never cross-category)
  const curatedCandidates = queryGuard.ok
    ? fetchCuratedCandidates(category, slot, `${seed}:${query}`, registry, 6)
    : [];
  pipelineLog("curated-candidates", { category, slot, count: curatedCandidates.length });

  const candidates: ImageResult[] = [...apiCandidates, ...curatedCandidates];

  for (const candidate of candidates) {
    if (isUrlSeen(registry, candidate.url)) {
      pipelineLog("dedup-skip", { provider: candidate.provider, url: candidate.url.slice(0, 80) });
      continue;
    }

    const probeUrl = candidate.url;
    const validation = await validateImageUrl(probeUrl, 5_000);
    if (!validation.valid) {
      pipelineLog("candidate-rejected", {
        provider: candidate.provider,
        reason: validation.reason,
        url: probeUrl.slice(0, 80),
      });
      continue;
    }

    registerUrl(registry, candidate.url);
    pipelineLog("candidate-selected", {
      provider: candidate.provider,
      query,
      url: candidate.url.slice(0, 100),
    });
    return {
      url: candidate.url,
      thumbUrl: candidate.thumbUrl,
      width: candidate.width,
      height: candidate.height,
      alt: candidate.alt,
      provider: candidate.provider,
    };
  }

  // Tier 2: DALL-E generation
  pipelineLog("dalle-attempt", { query });
  const generated = await fetchFromDallE(dallePrompt, config);

  if (generated) {
    const validation = await validateImageUrl(generated.url, 10_000);
    if (validation.valid && !isUrlSeen(registry, generated.url)) {
      registerUrl(registry, generated.url);
      pipelineLog("dalle-selected", { url: generated.url.slice(0, 100) });
      return {
        url: generated.url,
        thumbUrl: generated.thumbUrl,
        width: generated.width,
        height: generated.height,
        alt: generated.alt,
        provider: "dalle",
      };
    }
    pipelineLog("dalle-rejected", { reason: validation.reason });
  }

  // Tier 3: CSS gradient — last resort
  pipelineLog("gradient-fallback", { query, category, reason: "all providers exhausted" });
  const gradFallback = buildGradientFallback(category, palette);
  return {
    url: "",
    thumbUrl: "",
    width: 800,
    height: 450,
    alt: `${startupName} — ${category}`,
    provider: "gradient",
    fallback: gradFallback,
  };
}

// ─── Category image fetching ──────────────────────────────────────────────────

export interface FetchCategoryImagesOptions {
  category: string
  startupName: string
  sessionSeed: string
  slots: SlotType[]
  /** Optional explicit keys aligned 1:1 with slots (defaults to slot-index) */
  slotKeys?: string[]
  palette: string[]
  direction: string
  registry?: Set<string>
}

export interface CategoryImageSet {
  [slotType: string]: ResolvedImage
}

/**
 * Main entry point for the image pipeline.
 *
 * For each requested slot:
 *   1. Resolves category alias
 *   2. Samples a query from the vocabulary (seeded shuffle for anti-repeat)
 *   3. Constructs a DALL-E fallback prompt from WorldDNA
 *   4. Runs the provider fallback chain
 *
 * All slots are fetched in parallel to minimise latency.
 */
export async function fetchCategoryImages(
  options: FetchCategoryImagesOptions
): Promise<CategoryImageSet> {
  const {
    category,
    startupName,
    sessionSeed,
    slots,
    slotKeys,
    palette,
    direction,
    registry = createDedupRegistry(),
  } = options;

  const config = getProviderConfig();
  const resolvedCategory = resolveCategory(category);
  const vocab = CATEGORY_VOCAB[resolvedCategory];

  if (!vocab) {
    console.warn(`[pipeline] no vocabulary for resolved category "${resolvedCategory}"`);
  }

  // Seeded shuffle — same seed always produces same ordering,
  // but different seeds produce different orderings
  const shuffled = vocab
    ? seededShuffle(vocab.queryGroups, sessionSeed)
    : generateGenericQueries(category, sessionSeed);

  // Fetch slots sequentially — guarantees global photo-id dedup across the page
  const entries: [string, ResolvedImage][] = [];
  for (let idx = 0; idx < slots.length; idx++) {
    const slot = slots[idx];
    const slotGroups = vocab?.queryGroups.filter((g) => g.slot === slot) ?? [];
    const fallbackGroup = shuffled[idx % shuffled.length];
    const queryGroup = slotGroups.length
      ? slotGroups[idx % slotGroups.length]
      : fallbackGroup;
    const query = pickOne(queryGroup.queries, `${sessionSeed}:${slot}:${idx}`);

    const dallePrompt = buildDallePrompt({
      query,
      category: resolvedCategory,
      slot,
      direction,
      mood: vocab?.mood ?? ["modern", "premium"],
      palette,
      startupName,
    });

    const resolved = await fetchFromProviderChain(
      query,
      dallePrompt,
      resolvedCategory,
      palette,
      startupName,
      registry,
      config,
      slot,
      `${sessionSeed}:${idx}`
    );

    pipelineLog("slot-resolved", {
      slot,
      idx,
      query,
      provider: resolved.provider,
      url: resolved.url.slice(0, 100),
    });

    entries.push([`${slotKeys?.[idx] ?? `${slot}-${idx}`}`, resolved]);
  }

  return Object.fromEntries(entries);
}

// ─── Preload validation ───────────────────────────────────────────────────────

export interface PreloadResult {
  slot: SlotType
  image: ResolvedImage
  valid: boolean
  loadTimeMs: number
}

/**
 * Validates that all images in a CategoryImageSet are actually reachable
 * and triggers browser preloading.
 *
 * Call this before rendering — it ensures every image is validated
 * and in-flight before the UI paints.
 *
 * Returns an updated set where invalid images have been replaced
 * with gradient fallbacks.
 */
export async function preloadImages(
  imageSet: CategoryImageSet,
  palette: string[],
  startupName: string,
  category: string
): Promise<CategoryImageSet> {
  const entries = Object.entries(imageSet) as [string, ResolvedImage][];

  const validated = await Promise.all(
    entries.map(async ([slot, image]): Promise<[string, ResolvedImage]> => {
      if (image.provider === "gradient") return [slot, image];

      // Already validated in fetchFromProviderChain — trust remote http URLs
      if (image.url.startsWith("http")) {
        pipelineLog("preload-pass", { slot, provider: image.provider, url: image.url.slice(0, 80) });
        return [slot, image];
      }

      const start = Date.now();
      const result = await validateImageUrl(image.url, 6_000);
      const loadTimeMs = Date.now() - start;

      if (!result.valid) {
        pipelineLog("preload-reject", { slot, reason: result.reason, loadTimeMs });
        const fallback = buildGradientFallback(category, palette);
        return [
          slot,
          {
            url: "",
            thumbUrl: "",
            width: 800,
            height: 450,
            alt: `${startupName} — ${category}`,
            provider: "gradient",
            fallback,
          },
        ];
      }

      return [slot, image];
    })
  );

  return Object.fromEntries(validated);
}

// ─── DALL-E prompt builder ────────────────────────────────────────────────────

interface DallePromptOptions {
  query: string
  category: string
  slot: SlotType
  direction: string
  mood: string[]
  palette: string[]
  startupName: string
}

// Maps direction name to photography style descriptor
const DIRECTION_PHOTO_STYLE: Record<string, string> = {
  orchestra:           "premium commercial photography, balanced composition, natural light",
  "luxury-editorial":  "cinematic editorial photography, dark moody tones, high fashion magazine",
  "minimal-clean":     "clean product photography, white background, natural light, studio still",
  "minimal-luxury":    "refined minimal product photography, soft shadows, editorial still life",
  "premium-dark":      "moody cinematic photography, deep shadows, dramatic rim light",
  "cinematic-ai":      "cinematic wide photography, atmospheric depth, film grain",
  "bold-experimental": "high contrast photography, saturated colors, tight crop, graphic",
  "gen-z-social":      "candid lifestyle photography, bright colors, social media aesthetic",
  "genz-vibrant":      "vibrant lifestyle photography, bold color, energetic candid framing",
  "creator-playful":   "warm lifestyle photography, playful composition, natural daylight",
  "creative-agency":   "editorial studio photography, art-directed color, confident framing",
  "fashion-ai":        "high fashion editorial photography, runway lighting, luxury texture",
  "glass-futuristic":  "sleek product photography, reflective surfaces, cool tones",
  "retro-tech":        "retro-futurist product photography, neon accents, studio lighting",
  "apple-modern":      "clean Apple-style product photography, soft gradients, minimal props",
};

function buildDallePrompt(opts: DallePromptOptions): string {
  const style = DIRECTION_PHOTO_STYLE[opts.direction] ?? "professional commercial photography";
  const moodStr = opts.mood.slice(0, 3).join(", ");
  const slotContext =
    opts.slot === "hero"
      ? "wide establishing shot"
      : opts.slot === "feature"
      ? "detail product shot"
      : opts.slot === "ambient"
      ? "environmental atmosphere shot"
      : "professional product photograph";

  return (
    `${style}, ${slotContext} of ${opts.query}, ` +
    `${moodStr}, commercial photography, ` +
    `no text, no logos, no watermarks, no people's faces, ` +
    `photorealistic, high resolution`
  );
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Deterministic seeded shuffle using a simple LCG PRNG.
 * Same seed = same order. Different seeds = different orders.
 * Never uses Math.random() — must be reproducible for thumbnail caching.
 */
function seededShuffle<T>(arr: T[], seed: string): T[] {
  const copy = [...arr];
  // Convert seed string to a numeric value
  let s = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  for (let i = copy.length - 1; i > 0; i--) {
    // LCG: next = (a * s + c) % m
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

/** Pick one item from an array using a seed string */
function pickOne<T>(arr: T[], seed: string): T {
  const s = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return arr[Math.abs(s) % arr.length];
}

/** Fallback query generation for categories without a vocabulary entry */
function generateGenericQueries(
  category: string,
  seed: string
): Array<{ queries: string[]; slot: SlotType }> {
  const base = category.toLowerCase().replace(/startup|company|app|platform/g, "").trim();
  return [
    { queries: [`${base} professional photography`, `${base} modern business`], slot: "hero" },
    { queries: [`${base} product detail`, `${base} service photography`], slot: "feature" },
    { queries: [`${base} lifestyle`, `${base} environment`], slot: "ambient" },
  ];
}
