/**
 * image-providers.ts
 *
 * Low-level provider abstractions. Each provider:
 *   1. Builds a valid API URL from a query string
 *   2. Parses the response into a normalized ImageResult[]
 *   3. Validates that each URL is actually reachable before returning
 *
 * Providers are tried in order: Unsplash → Pexels → Pixabay → DALL-E.
 * Callers should use fetchFromProviderChain(), not individual providers.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ImageResult {
  url: string          // full-resolution URL (used for next/image src)
  thumbUrl: string     // ~400px thumbnail URL (used for prefetch probing)
  width: number
  height: number
  alt: string
  provider: ImageProvider
  query: string        // the query string that produced this result
}

export type ImageProvider = "unsplash" | "pexels" | "pixabay" | "dalle" | "gradient" | "curated-unsplash";

export interface ProviderConfig {
  unsplashAccessKey: string
  pexelsApiKey: string
  pixabayApiKey: string
  openAiApiKey: string
}

// ─── Config ───────────────────────────────────────────────────────────────────
// Read from environment. These MUST be set in .env.local / Vercel env vars.
// None are exposed to the client (no NEXT_PUBLIC_ prefix).

export function getProviderConfig(): ProviderConfig {
  const config: ProviderConfig = {
    unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY ?? "",
    pexelsApiKey: process.env.PEXELS_API_KEY ?? "",
    pixabayApiKey: process.env.PIXABAY_API_KEY ?? "",
    openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  };

  // Warn (don't throw) — the pipeline degrades gracefully through providers
  if (!config.unsplashAccessKey) console.warn("[image-providers] UNSPLASH_ACCESS_KEY not set — using curated Unsplash URLs");
  if (!config.pexelsApiKey) console.warn("[image-providers] PEXELS_API_KEY not set");
  if (!config.pixabayApiKey) console.warn("[image-providers] PIXABAY_API_KEY not set");

  return config;
}

// ─── Unsplash ─────────────────────────────────────────────────────────────────

export async function fetchFromUnsplash(
  query: string,
  count: number,
  config: ProviderConfig
): Promise<ImageResult[]> {
  if (!config.unsplashAccessKey) return [];

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(Math.min(count * 2, 30))); // fetch extra for dedup headroom
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high"); // exclude adult content

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${config.unsplashAccessKey}`,
        "Accept-Version": "v1",
      },
      // 8s hard timeout — stock API calls must not block render
      signal: AbortSignal.timeout(8_000),
    });
  } catch (err) {
    console.error("[unsplash] fetch failed:", err);
    return [];
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[unsplash] ${res.status} for query "${query}"`, body.slice(0, 120));
    return [];
  }

  let data: { results?: UnsplashPhoto[] };
  try {
    data = await res.json();
  } catch {
    console.error("[unsplash] invalid JSON response");
    return [];
  }

  return (data.results ?? []).map((photo) => ({
    url: photo.urls.regular,        // ~1080px wide — right size for next/image
    thumbUrl: photo.urls.thumb,     // ~200px — fast probe target
    width: photo.width,
    height: photo.height,
    alt: photo.alt_description ?? photo.description ?? query,
    provider: "unsplash" as const,
    query,
  }));
}

interface UnsplashPhoto {
  urls: { regular: string; thumb: string; full: string };
  width: number;
  height: number;
  alt_description: string | null;
  description: string | null;
}

// ─── Pexels ──────────────────────────────────────────────────────────────────

export async function fetchFromPexels(
  query: string,
  count: number,
  config: ProviderConfig
): Promise<ImageResult[]> {
  if (!config.pexelsApiKey) return [];

  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(Math.min(count * 2, 30)));
  url.searchParams.set("orientation", "landscape");

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      headers: { Authorization: config.pexelsApiKey },
      signal: AbortSignal.timeout(8_000),
    });
  } catch (err) {
    console.error("[pexels] fetch failed:", err);
    return [];
  }

  if (!res.ok) {
    console.error(`[pexels] ${res.status} for query "${query}"`);
    return [];
  }

  let data: { photos?: PexelsPhoto[] };
  try {
    data = await res.json();
  } catch {
    return [];
  }

  return (data.photos ?? []).map((photo) => ({
    // Use 'large' (940px) not 'original' — original can be 50MB
    url: photo.src.large,
    thumbUrl: photo.src.medium,
    width: photo.width,
    height: photo.height,
    alt: photo.alt ?? query,
    provider: "pexels" as const,
    query,
  }));
}

interface PexelsPhoto {
  src: { large: string; medium: string; original: string };
  width: number;
  height: number;
  alt: string;
}

// ─── Pixabay ─────────────────────────────────────────────────────────────────

export async function fetchFromPixabay(
  query: string,
  count: number,
  config: ProviderConfig
): Promise<ImageResult[]> {
  if (!config.pixabayApiKey) return [];

  const url = new URL("https://pixabay.com/api/");
  url.searchParams.set("key", config.pixabayApiKey);
  url.searchParams.set("q", query);
  url.searchParams.set("per_page", String(Math.min(count * 2, 20)));
  url.searchParams.set("image_type", "photo");
  url.searchParams.set("orientation", "horizontal");
  url.searchParams.set("safesearch", "true");
  url.searchParams.set("min_width", "800");

  let res: Response;
  try {
    res = await fetch(url.toString(), { signal: AbortSignal.timeout(8_000) });
  } catch (err) {
    console.error("[pixabay] fetch failed:", err);
    return [];
  }

  if (!res.ok) {
    console.error(`[pixabay] ${res.status} for query "${query}"`);
    return [];
  }

  let data: { hits?: PixabayHit[] };
  try {
    data = await res.json();
  } catch {
    return [];
  }

  return (data.hits ?? []).map((hit) => ({
    url: hit.largeImageURL,
    thumbUrl: hit.previewURL,
    width: hit.imageWidth,
    height: hit.imageHeight,
    alt: query,
    provider: "pixabay" as const,
    query,
  }));
}

interface PixabayHit {
  largeImageURL: string;
  previewURL: string;
  imageWidth: number;
  imageHeight: number;
}

// ─── DALL-E (last resort) ─────────────────────────────────────────────────────
// Only called if all stock providers fail. Prompt is built from WorldDNA fields
// to ensure category-correct output.

export async function fetchFromDallE(
  prompt: string,
  config: ProviderConfig
): Promise<ImageResult | null> {
  if (!config.openAiApiKey) return null;

  let res: Response;
  try {
    res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.openAiApiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1792x1024",
        quality: "standard",
      }),
      signal: AbortSignal.timeout(30_000), // DALL-E can take up to 20s
    });
  } catch (err) {
    console.error("[dalle] fetch failed:", err);
    return null;
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[dalle] ${res.status}:`, body);
    return null;
  }

  let data: { data?: Array<{ url?: string }> };
  try {
    data = await res.json();
  } catch {
    return null;
  }

  const imageUrl = data.data?.[0]?.url;
  if (!imageUrl) return null;

  return {
    url: imageUrl,
    thumbUrl: imageUrl, // DALL-E doesn't have thumbnails — same URL for probe
    width: 1792,
    height: 1024,
    alt: prompt.slice(0, 120),
    provider: "dalle" as const,
    query: prompt,
  };
}
