/**
 * Semantic visual retrieval — scene/aesthetic-aware, NOT noun keyword matching.
 */

import type { StartupBrief } from "@/lib/types/startup";
import type { MotionProfile } from "@/lib/types/startup";
import type { V2CategoryKey, V2ImageSlot, SemanticRetrievalPick, SemanticRetrievalTrace } from "./types";
import { getVisualUniverse } from "./visual-universe";
import { getSemanticPool, semanticToSlot } from "./semantic-registry";
import { rankSemanticImages, scoreSemanticImage } from "./aesthetic-scoring";

export type RetrievalPick = SemanticRetrievalPick;

export type { SemanticRetrievalTrace };

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

export function retrieveSemanticImages(
  category: V2CategoryKey,
  brief: StartupBrief,
  seed: string,
  role: V2ImageSlot["role"],
  count: number,
  usedIds: Set<string>,
  variantMotion: MotionProfile,
  trace: RetrievalPick[]
): V2ImageSlot[] {
  const universe = getVisualUniverse(category);
  const pool = getSemanticPool(category);
  const text = briefText(brief);

  const rolePool =
    pool.filter((e) => e.role === role || (role === "hero" && e.role === "editorial")).length > 0
      ? pool.filter((e) => e.role === role || (role === "hero" && e.role === "editorial"))
      : pool;

  const ranked = rankSemanticImages(rolePool, {
    universe,
    briefText: text,
    role,
    seed,
    usedIds,
    variantMotion,
  });

  const out: V2ImageSlot[] = [];
  for (const { entry, result } of ranked) {
    if (out.length >= count) break;
    usedIds.add(entry.id);
    out.push(semanticToSlot(entry));
    trace.push({
      id: entry.id,
      role: entry.role,
      score: Math.round(result.score),
      matchedScenes: result.matchedScenes,
      sceneQuery: result.matchedScenes[0] ?? universe.sceneQueries[0],
    });
  }

  return out;
}

export function buildRetrievalTrace(
  category: V2CategoryKey,
  picks: RetrievalPick[],
  rejectedCount: number
): SemanticRetrievalTrace {
  const universe = getVisualUniverse(category);
  return {
    universe: universe.label,
    sceneQueries: universe.sceneQueries,
    picks,
    rejectedCount,
  };
}

export function countRejected(category: V2CategoryKey, brief: StartupBrief, seed: string, variantMotion: MotionProfile): number {
  const universe = getVisualUniverse(category);
  const pool = getSemanticPool(category);
  const text = briefText(brief);
  const used = new Set<string>();
  let rejected = 0;
  for (const entry of pool) {
    const r = scoreSemanticImage(entry, {
      universe,
      briefText: text,
      role: entry.role,
      seed,
      usedIds: used,
      variantMotion,
    });
    if (r.rejected) rejected++;
  }
  return rejected;
}
