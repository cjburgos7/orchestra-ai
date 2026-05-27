/**
 * media-v2 types — Phase A placeholders only.
 * Isolated from legacy image-pipeline and world-v2 runtime.
 * No production generation wired yet.
 */

import type { V2CategoryKey } from "@/lib/world-v2/types";

/** Where in a generated startup world this asset belongs */
export type MediaGenerationRole =
  | "hero-environment"
  | "hero-subject"
  | "editorial-mosaic"
  | "feature-environment"
  | "ambient-layer"
  | "motion-background"
  | "proof-gallery"
  | "cta-atmosphere";

/** Compiled cinematic prompt ready for Flux / img2video providers */
export type ScenePrompt = {
  /** Source category lock */
  category: V2CategoryKey;
  role: MediaGenerationRole;
  /** Primary scene-level phrase from VisualUniverse (not a noun keyword) */
  sceneQuery: string;
  /** Full Flux-ready positive prompt */
  positive: string;
  /** Optional negative / rejection guidance */
  negative?: string;
  /** Recommended aspect ratio for the role */
  aspectRatio: "16:9" | "4:5" | "3:4" | "1:1" | "9:16";
  /** Cinematic lighting vocabulary */
  lighting: string[];
  /** Composition intent */
  composition: string[];
  /** Mood tags for scoring / trace */
  moods: string[];
  /** Category purity tokens that must be honored semantically */
  purityTokens: string[];
  /** Contamination tokens to avoid in generation */
  contaminationTokens: string[];
  /** Optional motion hint for future img2video (Hailuo, Seedance) */
  motionHint?: string;
  /** Brief context snippet (name, tagline) — never the whole brief */
  briefAnchor?: string;
};

/** DNA bundle describing a world's cinematic media identity */
export type WorldMediaDNA = {
  category: V2CategoryKey;
  universeLabel: string;
  sceneQueries: string[];
  moods: string[];
  aesthetics: string[];
  compositions: string[];
  lighting: string[];
  purityTokens: string[];
  contaminationTokens: string[];
  /** Default roles this universe emphasizes */
  preferredRoles: MediaGenerationRole[];
};

/** Output shape for a future generated asset (Phase B+) */
export type GeneratedMediaAsset = {
  id: string;
  category: V2CategoryKey;
  role: MediaGenerationRole;
  kind: "image" | "video" | "skybox";
  url: string;
  prompt: ScenePrompt;
  provider: "replicate-flux" | "replicate-hailuo" | "replicate-seedance" | "blockade-skybox" | "curated-fallback";
  modelId?: string;
  seed?: number;
  width?: number;
  height?: number;
  durationSec?: number;
  /** Trace for debugging — mirrors world-v2 imageRetrieval pattern */
  trace?: {
    compiledAt: string;
    sceneQuery: string;
    rejectedReasons?: string[];
  };
};

/** Batch job descriptor for dev-time / future API (not executed in Phase A) */
export type MediaGenerationJob = {
  jobId: string;
  prompts: ScenePrompt[];
  status: "draft" | "queued" | "running" | "completed" | "failed";
  assets: GeneratedMediaAsset[];
};
