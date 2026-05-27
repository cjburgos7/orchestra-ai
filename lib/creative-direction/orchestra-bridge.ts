import type { StartupBrief } from "@/lib/types/startup";
import { briefToRawInput } from "@/lib/world-intelligence";
import { resolveCategory } from "@/lib/world-intelligence/world-intelligence";
import { compileVisualDNA, CREATIVE_CONCEPTS } from "./engine";
import { resolveCreativeVariant } from "./concept-rotation";
import type { CreativeDirectionPackage } from "./premium-dark-bridge";
export type { CreativeDirectionPackage } from "./premium-dark-bridge";
export { creativeMotionProfile } from "./premium-dark-bridge";

/**
 * Premium Modern — default Orchestra creative direction.
 * Visually rich, interactive, image-led — NOT dark cinematic.
 */
export function buildOrchestraCreativeDirection(
  brief: StartupBrief,
  accentColor: string,
  seed: string
): CreativeDirectionPackage {
  const category = resolveCategory(briefToRawInput(brief));
  const variant = resolveCreativeVariant(brief, "orchestra", seed);

  let conceptKey = variant.conceptKey;
  if (!(conceptKey in CREATIVE_CONCEPTS)) {
    conceptKey = `${category}::orchestra`;
    if (!(conceptKey in CREATIVE_CONCEPTS)) {
      conceptKey = "software-saas::orchestra";
    }
  }

  const palette = [accentColor, "#FAFBFC", accentColor];
  const visualDNA = compileVisualDNA(conceptKey, palette);

  return {
    conceptKey,
    category,
    visualDNA,
    variantLabel: variant.label,
    sectionOrder: variant.sectionOrder,
    rotationScore: variant.rotationScore,
  };
}
