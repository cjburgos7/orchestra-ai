/**
 * Semantic image registry — scene-level metadata per asset, not noun tags.
 */

import type { V2CategoryKey, V2ImageSlot } from "./types";
import { getVisualUniverse } from "./visual-universe";
import { getRegistry, toImageSlot } from "./registries";

export type SemanticImageEntry = {
  id: string;
  role: V2ImageSlot["role"];
  alt: string;
  scenes: string[];
  moods: string[];
  aesthetics: string[];
  compositions: string[];
  lighting: string[];
  editorialQuality: number;
  premiumFeel: number;
  motionEnergy: number;
  colorHarmony: number;
  campaignFeel: number;
  compositionQuality: number;
  purityTokens: string[];
};

const QUALITY_OVERRIDES: Partial<
  Record<
    string,
    Pick<
      SemanticImageEntry,
      | "editorialQuality"
      | "premiumFeel"
      | "motionEnergy"
      | "campaignFeel"
      | "compositionQuality"
      | "colorHarmony"
      | "scenes"
    >
  >
> = {
  "1571019613454-1cb2f99b2d8b": {
    editorialQuality: 0.94,
    premiumFeel: 0.9,
    motionEnergy: 0.92,
    campaignFeel: 0.91,
    compositionQuality: 0.88,
    colorHarmony: 0.85,
    scenes: ["cinematic athlete training editorial", "premium athletic motion photography"],
  },
  "1490759847868-88d4476a2101": {
    editorialQuality: 0.93,
    premiumFeel: 0.95,
    motionEnergy: 0.3,
    campaignFeel: 0.92,
    compositionQuality: 0.9,
    colorHarmony: 0.88,
    scenes: ["luxury floral editorial", "elegant floral campaign photography"],
  },
  "1551288049-bebda4e38f71": {
    editorialQuality: 0.9,
    premiumFeel: 0.92,
    motionEnergy: 0.4,
    campaignFeel: 0.88,
    compositionQuality: 0.86,
    colorHarmony: 0.9,
    scenes: ["premium fintech dashboard aesthetic", "high-end SaaS campaign visuals"],
  },
  "1732959409019-b5979266d02d": {
    editorialQuality: 0.88,
    premiumFeel: 0.86,
    motionEnergy: 0.55,
    campaignFeel: 0.84,
    compositionQuality: 0.87,
    colorHarmony: 0.9,
    scenes: ["sunlit produce still life", "premium food editorial photography"],
  },
};

const ROLE_BASE: Record<
  V2ImageSlot["role"],
  Pick<
    SemanticImageEntry,
    "editorialQuality" | "premiumFeel" | "motionEnergy" | "campaignFeel" | "compositionQuality" | "colorHarmony"
  >
> = {
  hero: { editorialQuality: 0.88, premiumFeel: 0.85, motionEnergy: 0.7, campaignFeel: 0.86, compositionQuality: 0.84, colorHarmony: 0.82 },
  editorial: { editorialQuality: 0.9, premiumFeel: 0.88, motionEnergy: 0.55, campaignFeel: 0.88, compositionQuality: 0.86, colorHarmony: 0.84 },
  feature: { editorialQuality: 0.82, premiumFeel: 0.8, motionEnergy: 0.5, campaignFeel: 0.78, compositionQuality: 0.8, colorHarmony: 0.8 },
  detail: { editorialQuality: 0.78, premiumFeel: 0.76, motionEnergy: 0.45, campaignFeel: 0.72, compositionQuality: 0.85, colorHarmony: 0.78 },
  ambient: { editorialQuality: 0.75, premiumFeel: 0.74, motionEnergy: 0.4, campaignFeel: 0.7, compositionQuality: 0.78, colorHarmony: 0.82 },
};

function tokenizeAlt(alt: string): string[] {
  return alt.toLowerCase().split(/[\s,.-]+/).filter((t) => t.length > 3);
}

function enrichEntry(category: V2CategoryKey, entry: { id: string; role: V2ImageSlot["role"]; alt: string }, index: number): SemanticImageEntry {
  const universe = getVisualUniverse(category);
  const override = QUALITY_OVERRIDES[entry.id];
  const base = ROLE_BASE[entry.role];
  const q1 = universe.sceneQueries[index % universe.sceneQueries.length];
  const q2 = universe.sceneQueries[(index + 2) % universe.sceneQueries.length];

  return {
    id: entry.id,
    role: entry.role,
    alt: entry.alt,
    scenes: override?.scenes ?? [q1, q2],
    moods: [...universe.moods],
    aesthetics: [...universe.aesthetics],
    compositions: [...universe.compositions],
    lighting: [...universe.lighting],
    purityTokens: [...universe.purityTokens, ...tokenizeAlt(entry.alt)],
    editorialQuality: override?.editorialQuality ?? base.editorialQuality,
    premiumFeel: override?.premiumFeel ?? base.premiumFeel,
    motionEnergy: override?.motionEnergy ?? base.motionEnergy,
    colorHarmony: override?.colorHarmony ?? base.colorHarmony,
    campaignFeel: override?.campaignFeel ?? base.campaignFeel,
    compositionQuality: override?.compositionQuality ?? base.compositionQuality,
  };
}

const semanticCache = new Map<V2CategoryKey, SemanticImageEntry[]>();

/** Force-clear cache — call when registry data changes (e.g., dev hot-reload) */
export function clearSemanticCache(): void {
  semanticCache.clear();
}

export function getSemanticPool(category: V2CategoryKey): SemanticImageEntry[] {
  const cached = semanticCache.get(category);
  if (cached) return cached;

  const raw = getRegistry(category).images;
  const seen = new Set<string>();
  const pool: SemanticImageEntry[] = [];

  raw.forEach((entry, i) => {
    if (seen.has(entry.id)) return;
    seen.add(entry.id);
    pool.push(enrichEntry(category, entry, i));
  });

  semanticCache.set(category, pool);
  return pool;
}

export function semanticToSlot(entry: SemanticImageEntry, width = 1400, height?: number): V2ImageSlot {
  return toImageSlot(entry, width, height);
}
