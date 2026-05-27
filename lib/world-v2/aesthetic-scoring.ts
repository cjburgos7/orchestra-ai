/**
 * Aesthetic scoring — ranks images by editorial/campaign quality, not nouns.
 */

import type { MotionProfile } from "@/lib/types/startup";
import type { SemanticImageEntry } from "./semantic-registry";
import type { VisualUniverse } from "./visual-universe";
import type { V2ImageSlot } from "./types";

export type ImageScoreResult = {
  score: number;
  rejected: boolean;
  reason?: string;
  matchedScenes: string[];
  breakdown: {
    editorial: number;
    premium: number;
    campaign: number;
    composition: number;
    sceneMatch: number;
    briefAlign: number;
    roleFit: number;
    motionFit: number;
    diversity: number;
  };
};

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return Math.abs(h);
}

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[\s,.-]+/).filter((t) => t.length > 2);
}

function tokenOverlap(a: string, b: string): number {
  const ta = tokenize(a);
  const tb = new Set(tokenize(b));
  return ta.filter((t) => tb.has(t)).length;
}

export function scoreSemanticImage(
  entry: SemanticImageEntry,
  ctx: {
    universe: VisualUniverse;
    briefText: string;
    role: V2ImageSlot["role"];
    seed: string;
    usedIds: Set<string>;
    variantMotion: MotionProfile;
  }
): ImageScoreResult {
  const emptyBreakdown = {
    editorial: 0,
    premium: 0,
    campaign: 0,
    composition: 0,
    sceneMatch: 0,
    briefAlign: 0,
    roleFit: 0,
    motionFit: 0,
    diversity: 0,
  };

  if (ctx.usedIds.has(entry.id)) {
    return { score: -1, rejected: true, reason: "duplicate", matchedScenes: [], breakdown: emptyBreakdown };
  }

  const semanticHay = `${entry.alt} ${entry.scenes.join(" ")} ${entry.moods.join(" ")}`.toLowerCase();

  for (const re of ctx.universe.forbiddenInImage) {
    if (re.test(semanticHay)) {
      return { score: -1, rejected: true, reason: `forbidden: ${re.source}`, matchedScenes: [], breakdown: emptyBreakdown };
    }
  }

  for (const contam of ctx.universe.contaminationTokens) {
    if (semanticHay.includes(contam.toLowerCase())) {
      return { score: -1, rejected: true, reason: `contamination: ${contam}`, matchedScenes: [], breakdown: emptyBreakdown };
    }
  }

  const purityOk = ctx.universe.purityTokens.some((t) => semanticHay.includes(t.toLowerCase()));
  if (!purityOk) {
    return { score: -1, rejected: true, reason: "category purity failed", matchedScenes: [], breakdown: emptyBreakdown };
  }

  const breakdown = { ...emptyBreakdown };
  breakdown.editorial = entry.editorialQuality * 28;
  breakdown.premium = entry.premiumFeel * 22;
  breakdown.campaign = entry.campaignFeel * 18;
  breakdown.composition = entry.compositionQuality * 12;

  if (ctx.variantMotion === "energetic") {
    breakdown.motionFit = entry.motionEnergy * 12;
  } else if (ctx.variantMotion === "editorial") {
    breakdown.motionFit = (1 - Math.abs(entry.motionEnergy - 0.35)) * 10;
  } else {
    breakdown.motionFit = entry.colorHarmony * 8;
  }

  if (entry.role === ctx.role) breakdown.roleFit = 14;
  else if (ctx.role === "hero" && (entry.role === "editorial" || entry.role === "hero")) breakdown.roleFit = 10;
  else if (ctx.role === "feature" && entry.role === "detail") breakdown.roleFit = 6;

  const matchedScenes: string[] = [];
  const briefLower = ctx.briefText.toLowerCase();

  for (const query of ctx.universe.sceneQueries) {
    for (const scene of entry.scenes) {
      const overlap = tokenOverlap(scene, query);
      if (overlap >= 2) {
        breakdown.sceneMatch += 16;
        if (!matchedScenes.includes(scene)) matchedScenes.push(scene);
      } else if (overlap === 1) {
        breakdown.sceneMatch += 8;
      }
    }
    if (tokenOverlap(briefLower, query) >= 2) breakdown.briefAlign += 12;
  }

  for (const mood of entry.moods) {
    if (briefLower.includes(mood)) breakdown.briefAlign += 6;
  }

  breakdown.diversity = hashSeed(`${ctx.seed}:${entry.id}`) % 14;

  const score = Object.values(breakdown).reduce((a, b) => a + b, 0);

  if (score < ctx.universe.minAcceptScore) {
    return { score, rejected: true, reason: "below aesthetic threshold", matchedScenes, breakdown };
  }

  return { score, rejected: false, matchedScenes, breakdown };
}

export function rankSemanticImages(
  entries: SemanticImageEntry[],
  ctx: Parameters<typeof scoreSemanticImage>[1]
): Array<{ entry: SemanticImageEntry; result: ImageScoreResult }> {
  return entries
    .map((entry) => ({ entry, result: scoreSemanticImage(entry, ctx) }))
    .filter((r) => !r.result.rejected)
    .sort((a, b) => b.result.score - a.result.score);
}
