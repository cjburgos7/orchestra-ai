import type { DirectionId } from "@/lib/types/startup";
import type { CreativeLayoutConfig } from "@/lib/types/startup";
import type { DirectionEngineSpec } from "./types";
import { PREMIUM_DARK_SPEC } from "./premium-dark/spec";

const SPECS: Partial<Record<DirectionId, DirectionEngineSpec>> = {
  "premium-dark": PREMIUM_DARK_SPEC,
};

export function getDirectionEngineSpec(direction: DirectionId): DirectionEngineSpec | null {
  const spec = SPECS[direction];
  return spec?.enabled ? spec : null;
}

export function hasDirectionEngine(direction: DirectionId): boolean {
  return getDirectionEngineSpec(direction) !== null;
}

/** Merge direction-engine layout overrides into pipeline-generated layout */
export function applyDirectionEngineLayout(
  direction: DirectionId,
  layout: CreativeLayoutConfig
): CreativeLayoutConfig {
  const spec = getDirectionEngineSpec(direction);
  if (!spec) return layout;

  return {
    ...layout,
    ...spec.layoutOverrides,
    sectionOrder: spec.sectionOrder,
  };
}

export { PREMIUM_DARK_SPEC };
