import type { CategorizedImage } from "@/lib/imagery/image-types";
import type { DirectionKey, MediaCandidate, MediaScore, WorldDNA } from "./world-intelligence";
import { scoreMediaCandidate } from "./world-intelligence";

export function categorizedToMediaCandidate(image: CategorizedImage): MediaCandidate {
  return {
    url: image.url,
    thumbUrl: image.url,
    width: 1200,
    height: 800,
    altText: [image.category, image.role, ...image.tags, ...image.mood].join(" "),
    tags: image.tags,
    dominantColors: image.dominantColor ? [`#${image.dominantColor}`] : undefined,
  };
}

export function passesWorldHardBlocklist(dna: WorldDNA, image: CategorizedImage): boolean {
  const text = [image.category, image.role, ...image.tags, ...image.mood].join(" ").toLowerCase();
  for (const blocked of dna.semanticField.hardBlocklist) {
    if (text.includes(blocked.toLowerCase())) return false;
  }
  return true;
}

export function scoreCategorizedImage(
  image: CategorizedImage,
  dna: WorldDNA,
  direction: DirectionKey,
  alreadySelected: MediaCandidate[]
): MediaScore {
  return scoreMediaCandidate(
    categorizedToMediaCandidate(image),
    dna,
    direction,
    alreadySelected
  );
}

export function rankByWorldIntelligence(
  candidates: CategorizedImage[],
  dna: WorldDNA,
  direction: DirectionKey,
  alreadySelected: MediaCandidate[]
): CategorizedImage[] {
  const scored = candidates
    .filter((img) => passesWorldHardBlocklist(dna, img))
    .map((img) => ({
      img,
      score: scoreCategorizedImage(img, dna, direction, alreadySelected),
    }))
    .filter(({ score }) => score.passed)
    .sort((a, b) => b.score.total - a.score.total);

  return scored.map((s) => s.img);
}
