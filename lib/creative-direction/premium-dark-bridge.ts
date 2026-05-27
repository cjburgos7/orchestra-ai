import type { StartupBrief } from "@/lib/types/startup";
import type { HomeSectionId } from "@/lib/types/startup";
import type { MotionProfile } from "@/lib/types/startup";
import { briefToRawInput } from "@/lib/world-intelligence";
import { resolveCategory } from "@/lib/world-intelligence/world-intelligence";
import { compileVisualDNA, CREATIVE_CONCEPTS } from "./engine";
import type { VisualDNA } from "./engine";
import { resolveCreativeVariant } from "./concept-rotation";

export type CreativeDirectionPackage = {
  conceptKey: string;
  category: string;
  visualDNA: VisualDNA;
  /** Human-readable variant label for diagnostics */
  variantLabel: string;
  /** Seed-selected section rhythm — overrides world-DNA arc when present */
  sectionOrder: HomeSectionId[];
  rotationScore: number;
};

function motionFromVisualDNA(vd: VisualDNA, hint?: "cinematic" | "energetic" | "editorial"): MotionProfile {
  if (hint === "energetic" || vd.atmosphere.idleMotion === "kinetic") return "energetic";
  if (hint === "editorial" || vd.pacing.transitionSpeed === "glacial") return "editorial";
  if (vd.pacing.scrollFeel === "stepped") return "cinematic";
  return "cinematic";
}

export function creativeMotionProfile(pkg: CreativeDirectionPackage): MotionProfile {
  const hint =
    pkg.visualDNA.atmosphere.idleMotion === "kinetic"
      ? "energetic"
      : pkg.visualDNA.pacing.transitionSpeed === "glacial"
        ? "editorial"
        : "cinematic";
  return motionFromVisualDNA(pkg.visualDNA, hint);
}

/**
 * Premium Dark — seed + brief rotate among crafted concept variants, then compile visual DNA.
 */
export function buildPremiumDarkCreativeDirection(
  brief: StartupBrief,
  accentColor: string,
  seed: string
): CreativeDirectionPackage {
  const category = resolveCategory(briefToRawInput(brief));
  const variant = resolveCreativeVariant(brief, "premium-dark", seed);

  let conceptKey = variant.conceptKey;
  if (!(conceptKey in CREATIVE_CONCEPTS)) {
    conceptKey = `${category}::premium-dark`;
    if (!(conceptKey in CREATIVE_CONCEPTS)) {
      conceptKey = "software-saas::premium-dark";
    }
  }

  const palette = [accentColor, "#080808", accentColor];
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
