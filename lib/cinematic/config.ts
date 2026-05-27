import type { DirectionId } from "@/lib/types/startup";

/**
 * Orchestra's primary generation mode: premium modern, image-led, interactive worlds.
 * Dark cinematic (premium-dark) is an optional stylistic variant — not the default identity.
 */
export const DEFAULT_DIRECTION: DirectionId = "orchestra";

/** @deprecated Use DEFAULT_DIRECTION — kept for imports that referenced cinematic default */
export const CINEMATIC_DIRECTION: DirectionId = "premium-dark";

/** When false, direction selection is honored; premium-dark is opt-in only */
export const CINEMATIC_ENGINE_ONLY = false;

export function resolveRenderDirection(requested?: DirectionId | null): DirectionId {
  if (CINEMATIC_ENGINE_ONLY) return CINEMATIC_DIRECTION;
  return requested ?? DEFAULT_DIRECTION;
}

/** True when the brief explicitly chose a dark cinematic flavor */
export function isPremiumDarkDirection(direction: DirectionId): boolean {
  return direction === "premium-dark" || direction === "cinematic-ai";
}

/** Primary modern engine — orchestra direction with concept rotation + rich layout */
export function isOrchestraDirection(direction: DirectionId): boolean {
  return direction === "orchestra";
}

export function usesCreativeDirectionEngine(direction: DirectionId): boolean {
  return isOrchestraDirection(direction) || isPremiumDarkDirection(direction);
}

/** @deprecated Prefer isPremiumDarkDirection(direction) */
export function isCinematicEngineActive(): boolean {
  return CINEMATIC_ENGINE_ONLY;
}
