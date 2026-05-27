/**
 * media-v2 config — Phase A flags only.
 * Runtime generation remains disabled until Phase B.
 */

export const MEDIA_V2_PHASE = "A" as const;

/** Phase B will gate actual API calls; always false in Phase A */
export const MEDIA_V2_RUNTIME_ENABLED = false;

/** Primary still-image model target (Replicate) — reference for skills & future provider */
export const MEDIA_V2_FLUX_MODEL_PRO = "black-forest-labs/flux-1.1-pro" as const;
export const MEDIA_V2_FLUX_MODEL_DRAFT = "black-forest-labs/flux-schnell" as const;

/** Primary motion model targets (Phase C) — documented only */
export const MEDIA_V2_VIDEO_MODEL_HAILUO = "minimax/hailuo-2.3" as const;
export const MEDIA_V2_VIDEO_MODEL_SEEDANCE = "bytedance/seedance-2.0" as const;
