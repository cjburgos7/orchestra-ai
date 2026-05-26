import type { DirectionId } from "@/lib/types/startup";
import type { CategoryResolution } from "@/lib/orchestration/category-resolution";
import {
  directionImageParams,
  selectPhotoIds,
  type ImageSlot,
} from "@/lib/orchestration/category-imagery";

export function unsplashUrl(id: string, width = 1200, height?: number, params = ""): string {
  const h = height ? `&h=${height}` : "";
  return `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}&q=80${h}${params}`;
}

export type ResolvedImage = {
  url: string;
  chain: string[];
  fallback: string;
};

const CHAIN_DEPTH = 10;

/**
 * Literal photo chain — multiple real photographs only, never SVG/abstract fallbacks.
 */
export function resolveImageChain(
  resolution: CategoryResolution,
  seed: string,
  direction: DirectionId,
  slot: ImageSlot,
  width: number,
  height: number,
  index = 0
): ResolvedImage {
  const params = directionImageParams(direction);
  const ids = selectPhotoIds(resolution, slot, seed, direction, index, CHAIN_DEPTH);
  const urls = ids.map((id) => unsplashUrl(id, width, height, params));
  return {
    url: urls[0],
    chain: urls.slice(1),
    fallback: urls[urls.length - 1] ?? urls[0],
  };
}

export function placeholderSet(
  resolution: CategoryResolution,
  seed: string,
  direction: DirectionId = "orchestra"
) {
  const hero = resolveImageChain(resolution, seed, direction, "hero", 1400, 900, 0);
  return {
    hero: hero.fallback,
    lifestyle: [0, 1, 2, 3, 4, 5].map((i) =>
      resolveImageChain(resolution, seed, direction, "lifestyle", 900, 1100, i).url
    ),
    products: [0, 1, 2].map((i) =>
      resolveImageChain(resolution, seed, direction, "product", 600, 750, i + 2).url
    ),
  };
}
