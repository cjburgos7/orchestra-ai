/**
 * Orchestra media-v2 — cinematic AI media layer (Phase A scaffold).
 * Isolated from lib/image-pipeline.ts and lib/world-v2 runtime.
 */

export {
  MEDIA_V2_PHASE,
  MEDIA_V2_RUNTIME_ENABLED,
  MEDIA_V2_FLUX_MODEL_PRO,
  MEDIA_V2_FLUX_MODEL_DRAFT,
  MEDIA_V2_VIDEO_MODEL_HAILUO,
  MEDIA_V2_VIDEO_MODEL_SEEDANCE,
} from "./config";

export type {
  ScenePrompt,
  GeneratedMediaAsset,
  WorldMediaDNA,
  MediaGenerationRole,
  MediaGenerationJob,
} from "./types";

export { compileScenePromptPlaceholder } from "./prompts";
export { PROVIDERS_READY } from "./providers";
