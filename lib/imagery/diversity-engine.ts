import type { CategorizedImage } from "./image-types";

const SIMILARITY_THRESHOLD = 0.65;

function hashSalt(salt: string): number {
  let h = 0;
  for (let i = 0; i < salt.length; i++) h = (h << 5) - h + salt.charCodeAt(i);
  return Math.abs(h);
}

function tagOverlap(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const setB = new Set(b.map((t) => t.toLowerCase()));
  const shared = a.filter((t) => setB.has(t.toLowerCase())).length;
  return shared / Math.max(a.length, b.length);
}

export function calculateImageSimilarity(a: CategorizedImage, b: CategorizedImage): number {
  if (a.id === b.id) return 1;

  let score = 0;
  let weights = 0;

  score += tagOverlap(a.tags, b.tags) * 0.35;
  weights += 0.35;

  score += tagOverlap(a.mood, b.mood) * 0.15;
  weights += 0.15;

  if (a.composition && b.composition && a.composition === b.composition) {
    score += 0.15;
    weights += 0.15;
  }

  if (a.dominantColor && b.dominantColor && a.dominantColor === b.dominantColor) {
    score += 0.15;
    weights += 0.15;
  }

  return weights > 0 ? score / weights : 0;
}

export function rotateCandidates(candidates: CategorizedImage[], salt: string): CategorizedImage[] {
  if (candidates.length <= 1) return candidates;
  const start = hashSalt(salt) % candidates.length;
  return [...candidates.slice(start), ...candidates.slice(0, start)];
}

export class DiversityEngine {
  usedImageIds = new Set<string>();
  usedPrimaryTags = new Set<string>();
  selected: CategorizedImage[] = [];

  canUse(image: CategorizedImage, strict = true): boolean {
    if (this.usedImageIds.has(image.id)) return false;

    const primaryTag = image.tags[0]?.toLowerCase();
    if (strict && primaryTag && this.usedPrimaryTags.has(primaryTag)) {
      return false;
    }

    if (strict) {
      for (const prev of this.selected) {
        if (calculateImageSimilarity(image, prev) > SIMILARITY_THRESHOLD) {
          return false;
        }
      }
    }

    return true;
  }

  register(image: CategorizedImage): void {
    this.usedImageIds.add(image.id);
    const primaryTag = image.tags[0]?.toLowerCase();
    if (primaryTag) this.usedPrimaryTags.add(primaryTag);
    this.selected.push(image);
  }

  isHeroId(id: string): boolean {
    return this.selected.some((img) => img.id === id && img.role === "hero");
  }
}

export function pickDiverseImage(
  candidates: CategorizedImage[],
  engine: DiversityEngine,
  options?: { excludeHeroIds?: boolean; salt?: string }
): CategorizedImage | null {
  const rotated = options?.salt ? rotateCandidates(candidates, options.salt) : candidates;

  for (const img of rotated) {
    if (options?.excludeHeroIds && engine.isHeroId(img.id)) continue;
    if (engine.canUse(img, true)) {
      engine.register(img);
      return img;
    }
  }

  // Relaxed fallback — never reuse same photo id, allow shared tags
  for (const img of rotated) {
    if (options?.excludeHeroIds && engine.isHeroId(img.id)) continue;
    if (engine.canUse(img, false)) {
      engine.register(img);
      return img;
    }
  }

  return null;
}
