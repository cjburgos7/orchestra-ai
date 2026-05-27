/**
 * Seed + brief-driven creative concept rotation — prevents category-level collapse.
 */

import type { HomeSectionId } from "@/lib/types/startup";
import type { StartupBrief } from "@/lib/types/startup";
import { CREATIVE_CONCEPTS } from "./engine";
import { briefToRawInput } from "@/lib/world-intelligence";
import { resolveCategory } from "@/lib/world-intelligence/world-intelligence";
import type { CategoryKey } from "@/lib/world-intelligence";
import {
  ALL_CONCEPT_ROTATION_POOLS,
  ROTATION_CATEGORY_DEFAULTS,
  ROTATION_PREMIUM_DARK_DEFAULTS,
} from "./concept-rotation-pools";

export type ConceptRotationEntry = {
  conceptKey: string;
  label: string;
  briefSignals: RegExp[];
  sectionOrder: HomeSectionId[];
  motionHint?: "cinematic" | "energetic" | "editorial";
};

/** @deprecated Use ALL_CONCEPT_ROTATION_POOLS — kept for imports that expect this name */
export const CONCEPT_ROTATION_POOLS = ALL_CONCEPT_ROTATION_POOLS;

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return Math.abs(h);
}

function briefText(brief: StartupBrief): string {
  return [
    brief.name,
    brief.tagline,
    brief.description,
    brief.startupCategory,
    brief.audience,
    ...(brief.features ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

const EDITORIAL_COMMERCE_TAIL: HomeSectionId[] = ["testimonials", "pricing"];

function order(...ids: HomeSectionId[]): HomeSectionId[] {
  const seen = new Set<HomeSectionId>();
  const out: HomeSectionId[] = [];
  for (const id of [...ids, ...EDITORIAL_COMMERCE_TAIL]) {
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

function categoryFallbackConceptKey(category: CategoryKey, direction: string): string {
  if (direction === "premium-dark" || direction === "cinematic-ai") {
    return ROTATION_PREMIUM_DARK_DEFAULTS[category] ?? `${category}::premium-dark`;
  }
  return ROTATION_CATEGORY_DEFAULTS[category] ?? `${category}::orchestra`;
}

export type ResolvedCreativeVariant = ConceptRotationEntry & {
  poolKey: string;
  rotationScore: number;
};

export function resolveCreativeVariant(
  brief: StartupBrief,
  direction: string,
  seed: string
): ResolvedCreativeVariant {
  const category = resolveCategory(briefToRawInput(brief));
  const poolKey = `${category}::${direction}`;
  const fallbackKey = categoryFallbackConceptKey(category, direction);
  const pool = ALL_CONCEPT_ROTATION_POOLS[poolKey] ?? ALL_CONCEPT_ROTATION_POOLS[fallbackKey] ?? [];
  const text = briefText(brief).toLowerCase();

  const scored = pool
    .filter((entry) => entry.conceptKey in CREATIVE_CONCEPTS)
    .map((entry) => {
      let score = hashSeed(`${seed}:${entry.conceptKey}`) % 100;
      for (const sig of entry.briefSignals) {
        if (sig.test(text)) score += 250;
      }
      return { ...entry, poolKey, rotationScore: score };
    })
    .sort((a, b) => b.rotationScore - a.rotationScore);

  if (!scored.length) {
    return {
      conceptKey: fallbackKey,
      label: "Category fallback",
      briefSignals: [],
      sectionOrder: order("story", "showcase", "features", "cta"),
      poolKey,
      rotationScore: 0,
    };
  }

  // Top tier within 40 points of max — seed picks among them for variety
  const top = scored[0].rotationScore;
  const tier = scored.filter((s) => s.rotationScore >= top - 40);
  return tier[hashSeed(seed) % tier.length];
}

export function listConceptPool(poolKey: string): string[] {
  return (ALL_CONCEPT_ROTATION_POOLS[poolKey] ?? []).map((e) => e.conceptKey);
}
