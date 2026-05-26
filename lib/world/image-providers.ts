import type { WorldDNA } from "@/lib/world/world-dna";
import type { CategoryCluster } from "@/lib/world/category-vocab";
import {
  buildUnsplashPhotoUrl,
  lookupCuratedPhotoId,
} from "@/lib/world/curated-photo-registry";

export type ImageProviderName = "unsplash" | "pexels" | "pixabay" | "emergency";

export type ProviderFetchInput = {
  query: string;
  width: number;
  height: number;
  cropParams: string;
  worldDNA: WorldDNA;
  /** Primary noun extracted from query for curated lookup */
  noun: string;
  attempt: number;
};

export type ProviderFetchResult = {
  url: string;
  provider: ImageProviderName;
  width: number;
  height: number;
};

function env(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }
  return undefined;
}

/** Tier 1 — Unsplash search API when keyed, else curated photo registry */
export async function fetchFromUnsplash(input: ProviderFetchInput): Promise<ProviderFetchResult | null> {
  const accessKey = env("UNSPLASH_ACCESS_KEY");

  if (accessKey) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(input.query)}&per_page=5&page=${(input.attempt % 5) + 1}&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${accessKey}` } }
      );
      if (res.ok) {
        const data = (await res.json()) as {
          results?: { urls?: { regular?: string; raw?: string }; width?: number; height?: number }[];
        };
        const hit = data.results?.[input.attempt % (data.results?.length || 1)];
        const url = hit?.urls?.regular ?? hit?.urls?.raw;
        if (url) {
          return {
            url,
            provider: "unsplash",
            width: hit?.width ?? input.width,
            height: hit?.height ?? input.height,
          };
        }
      }
    } catch {
      /* fall through to curated */
    }
  }

  const cluster = input.worldDNA.categoryCluster as CategoryCluster;
  const photoId = lookupCuratedPhotoId(cluster, input.noun, input.attempt);
  return {
    url: buildUnsplashPhotoUrl(photoId, input.width, input.height, input.cropParams),
    provider: "unsplash",
    width: input.width,
    height: input.height,
  };
}

/** Tier 2 — Pexels search API */
export async function fetchFromPexels(input: ProviderFetchInput): Promise<ProviderFetchResult | null> {
  const apiKey = env("PEXELS_API_KEY");
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(input.query)}&per_page=5&page=${(input.attempt % 5) + 1}&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      photos?: { src?: { large2x?: string; large?: string }; width?: number; height?: number }[];
    };
    const hit = data.photos?.[input.attempt % (data.photos?.length || 1)];
    const url = hit?.src?.large2x ?? hit?.src?.large;
    if (!url) return null;
    return {
      url,
      provider: "pexels",
      width: hit?.width ?? input.width,
      height: hit?.height ?? input.height,
    };
  } catch {
    return null;
  }
}

/** Tier 3 — Pixabay search API */
export async function fetchFromPixabay(input: ProviderFetchInput): Promise<ProviderFetchResult | null> {
  const apiKey = env("PIXABAY_API_KEY");
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(input.query)}&image_type=photo&orientation=horizontal&per_page=5&page=${(input.attempt % 5) + 1}`
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      hits?: { largeImageURL?: string; imageWidth?: number; imageHeight?: number }[];
    };
    const hit = data.hits?.[input.attempt % (data.hits?.length || 1)];
    if (!hit?.largeImageURL) return null;
    return {
      url: hit.largeImageURL,
      provider: "pixabay",
      width: hit.imageWidth ?? input.width,
      height: hit.imageHeight ?? input.height,
    };
  } catch {
    return null;
  }
}

/** Tier 4 — Branded palette gradient (never gray skeleton) */
export function fetchEmergencyFallback(
  input: ProviderFetchInput
): ProviderFetchResult {
  const [a, b, c] = input.worldDNA.paletteHex;
  const primary = a ?? "#EA580C";
  const secondary = b ?? "#15803D";
  const accent = c ?? "#FEF9EE";
  const label = encodeURIComponent(input.noun.slice(0, 24));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${input.width}" height="${input.height}" viewBox="0 0 ${input.width} ${input.height}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primary}"/>
        <stop offset="50%" stop-color="${secondary}"/>
        <stop offset="100%" stop-color="${accent}"/>
      </linearGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="24"/></filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect width="100%" height="100%" fill="${primary}" opacity="0.15" filter="url(#blur)"/>
    <text x="50%" y="52%" text-anchor="middle" fill="white" fill-opacity="0.35" font-family="Georgia,serif" font-size="28">${label}</text>
  </svg>`;

  return {
    url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    provider: "emergency",
    width: input.width,
    height: input.height,
  };
}

export const PROVIDER_CHAIN: Array<
  (input: ProviderFetchInput) => Promise<ProviderFetchResult | null> | ProviderFetchResult
> = [fetchFromUnsplash, fetchFromPexels, fetchFromPixabay, fetchEmergencyFallback];
