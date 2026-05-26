import { resolveCategoryAlias } from "@/lib/world/category-aliases";
import {
  getCategoryVocabulary,
  type CategoryCluster,
  type CategoryVocabulary,
} from "@/lib/world/category-vocab";

export interface WorldDNA {
  sessionSeed: string;

  categoryRaw: string;
  categoryCluster: string;

  imageryPrimary: string[];
  imagerySecondary: string[];
  imageryAmbient: string[];

  paletteHex: string[];

  moodWords: string[];
  photographyStyle: string;

  imageURLRegistry: Set<string>;
  layoutFingerprints: Set<string>;
}

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Deterministic seeded shuffle — same seed produces same order */
function seededShuffle<T>(items: readonly T[], seed: string, salt: string): T[] {
  const arr = [...items];
  let state = hashSeed(`${seed}:${salt}`);

  for (let i = arr.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1103515245) + 12345) >>> 0;
    const j = state % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function buildSessionSeed(): string {
  return `${Date.now()}-${crypto.randomUUID()}`;
}

function materializeFromVocabulary(
  vocab: CategoryVocabulary,
  sessionSeed: string
): Pick<
  WorldDNA,
  | "imageryPrimary"
  | "imagerySecondary"
  | "imageryAmbient"
  | "paletteHex"
  | "moodWords"
  | "photographyStyle"
> {
  return {
    imageryPrimary: seededShuffle(vocab.imageryPrimary, sessionSeed, "primary"),
    imagerySecondary: seededShuffle(vocab.imagerySecondary, sessionSeed, "secondary"),
    imageryAmbient: seededShuffle(vocab.imageryAmbient, sessionSeed, "ambient"),
    paletteHex: seededShuffle(vocab.paletteHex, sessionSeed, "palette"),
    moodWords: seededShuffle(vocab.moodWords, sessionSeed, "mood"),
    photographyStyle: vocab.photographyStyle,
  };
}

/**
 * Build a structured WorldDNA object from a startup prompt.
 * Alias resolution → vocabulary lookup → seeded array randomization.
 * No AI, no image fetching, no UI.
 */
export function buildWorldDNA(startupPrompt: string, sessionSeed?: string): WorldDNA {
  const seed = sessionSeed ?? buildSessionSeed();
  const { categoryRaw, categoryCluster } = resolveCategoryAlias(startupPrompt);
  const vocab = getCategoryVocabulary(categoryCluster as CategoryCluster);
  const imagery = materializeFromVocabulary(vocab, seed);

  return {
    sessionSeed: seed,
    categoryRaw,
    categoryCluster,
    ...imagery,
    imageURLRegistry: new Set<string>(),
    layoutFingerprints: new Set<string>(),
  };
}

/** Rebuild imagery arrays from an existing seed + cluster (deterministic) */
export function rebuildWorldDNAImagery(dna: WorldDNA): WorldDNA {
  const vocab = getCategoryVocabulary(dna.categoryCluster as CategoryCluster);
  const imagery = materializeFromVocabulary(vocab, dna.sessionSeed);

  return {
    ...dna,
    ...imagery,
  };
}
