/**
 * app/api/generate-images/route.ts
 *
 * Server-side API route that runs the full image pipeline.
 *
 * WHY THIS EXISTS:
 *   - Unsplash, Pexels, Pixabay API keys must never be exposed to the client
 *   - HTTP probing (validateImageUrl) must run server-side to avoid CORS issues
 *   - All AbortSignal/fetch calls are Node.js — not browser-compatible
 *
 * The client calls this route, receives validated URLs, then renders with
 * next/image. The client never touches the provider APIs directly.
 *
 * REQUEST:
 *   POST /api/generate-images
 *   Body: GenerateImagesRequest
 *
 * RESPONSE:
 *   GenerateImagesResponse — all URLs are validated and deduplicated
 */

import { NextRequest, NextResponse } from "next/server";
import {
  fetchCategoryImages,
  preloadImages,
  createDedupRegistry,
  type CategoryImageSet,
} from "@/lib/image-pipeline";
import type { SlotType } from "@/lib/category-vocab";
import { pipelineLog } from "@/lib/pipeline-debug";

// ─── Request / Response types ─────────────────────────────────────────────────

interface GenerateImagesRequest {
  category: string        // raw user-entered category, e.g. "fruit company"
  startupName: string     // e.g. "Orchard & Grove"
  sessionSeed: string     // WorldDNA entropy seed — deterministic per world
  slots: SlotType[]       // which image slots are needed
  palette: string[]       // WorldDNA palette — [primary, secondary, accent]
  direction: string       // creative direction ID — affects DALL-E prompts
}

interface GenerateImagesResponse {
  images: SerializedImageSet
  error?: string
}

// Serialized form of CategoryImageSet — safe to send over the wire
interface SerializedImageSet {
  [slot: string]: {
    url: string
    thumbUrl: string
    width: number
    height: number
    alt: string
    provider: string
    // Gradient fallback CSS — used by SafeImage while loading
    fallbackGradient?: string
    fallbackLabel?: string
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse<GenerateImagesResponse>> {
  let body: GenerateImagesRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { images: {}, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // ── Validate input ─────────────────────────────────────────────────────────
  const { category, startupName, sessionSeed, slots, palette, direction } = body;

  if (!category || !startupName || !sessionSeed || !slots?.length) {
    return NextResponse.json(
      { images: {}, error: "Missing required fields: category, startupName, sessionSeed, slots" },
      { status: 400 }
    );
  }

  // ── Run pipeline ───────────────────────────────────────────────────────────
  try {
    const registry = createDedupRegistry();

    // Step 1: Fetch images from provider chain
    const rawImageSet: CategoryImageSet = await fetchCategoryImages({
      category,
      startupName,
      sessionSeed,
      slots,
      palette: palette?.length >= 3 ? palette : ["#3B82F6", "#8B5CF6", "#F8FAFC"],
      direction: direction ?? "minimal-clean",
      registry,
    });

    // Step 2: Preload validation — replace any invalid URLs with gradient fallbacks
    // This is the step that was most likely missing and causing gray boxes.
    const validatedImageSet: CategoryImageSet = await preloadImages(
      rawImageSet,
      palette,
      startupName,
      category
    );

    // Step 3: Serialize for wire transport
    const serialized: SerializedImageSet = {};

    for (const [slot, image] of Object.entries(validatedImageSet)) {
      const gradientCss =
        image.fallback?.css ??
        buildDefaultGradient(palette);

      serialized[slot] = {
        url: image.url,
        thumbUrl: image.thumbUrl,
        width: image.width,
        height: image.height,
        alt: image.alt,
        provider: image.provider,
        fallbackGradient: gradientCss,
        fallbackLabel: startupName,
      };
    }

    const httpCount = Object.values(serialized).filter((i) => i.url.startsWith("http")).length;
    const gradientCount = Object.values(serialized).filter((i) => i.provider === "gradient").length;
    pipelineLog("generate-images-response", {
      slots: Object.keys(serialized).length,
      httpCount,
      gradientCount,
      providers: Object.fromEntries(
        Object.entries(serialized).map(([k, v]) => [k, { provider: v.provider, url: v.url.slice(0, 80) }])
      ),
    });

    return NextResponse.json({ images: serialized });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown pipeline error";
    console.error("[generate-images] pipeline error:", message);

    return NextResponse.json(
      { images: {}, error: message },
      { status: 500 }
    );
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildDefaultGradient(palette: string[]): string {
  const [p = "#3B82F6", s = "#8B5CF6"] = palette;
  return `linear-gradient(135deg, ${p} 0%, ${s} 100%)`;
}

// ─── Client-side hook ─────────────────────────────────────────────────────────
// Use this in your StartupWorldPreview component or wherever images are needed.
// Paste this into a separate file: hooks/useStartupImages.ts

export const CLIENT_HOOK_TEMPLATE = `
"use client";

import { useState, useEffect } from "react";
import type { SlotType } from "@/lib/category-vocab";

interface ImageData {
  url: string;
  thumbUrl: string;
  width: number;
  height: number;
  alt: string;
  provider: string;
  fallbackGradient?: string;
  fallbackLabel?: string;
}

interface UseStartupImagesOptions {
  category: string;
  startupName: string;
  sessionSeed: string;
  slots: SlotType[];
  palette: string[];
  direction: string;
}

export function useStartupImages(options: UseStartupImagesOptions) {
  const [images, setImages] = useState<Record<string, ImageData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchImages() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/generate-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(options),
        });

        if (!res.ok) {
          throw new Error(\`API error: \${res.status}\`);
        }

        const data = await res.json();

        if (!cancelled) {
          setImages(data.images ?? {});
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchImages();
    return () => { cancelled = true; };
  }, [
    options.category,
    options.startupName,
    options.sessionSeed,
    options.direction,
    // slots and palette are arrays — serialize them to avoid reference equality issues
    JSON.stringify(options.slots),
    JSON.stringify(options.palette),
  ]);

  return { images, loading, error };
}
`.trim();
