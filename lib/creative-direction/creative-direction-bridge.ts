import type { DirectionId, StartupBrief } from "@/lib/types/startup";
import { isOrchestraDirection, isPremiumDarkDirection } from "@/lib/cinematic";
import { buildPremiumDarkCreativeDirection } from "./premium-dark-bridge";
import { buildOrchestraCreativeDirection } from "./orchestra-bridge";
import type { CreativeDirectionPackage } from "./premium-dark-bridge";

/**
 * Route creative direction by stylistic flavor.
 * Default: orchestra (premium modern). Opt-in: premium-dark (cinematic mood).
 */
export function buildCreativeDirection(
  brief: StartupBrief,
  direction: DirectionId,
  accentColor: string,
  seed: string
): CreativeDirectionPackage | undefined {
  if (isPremiumDarkDirection(direction)) {
    return buildPremiumDarkCreativeDirection(brief, accentColor, seed);
  }
  if (isOrchestraDirection(direction)) {
    return buildOrchestraCreativeDirection(brief, accentColor, seed);
  }
  return undefined;
}
