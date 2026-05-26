import type { DirectionVisualRules, LayoutDensityRules } from "./image-types";

export function getLayoutDensityRules(rules: DirectionVisualRules): LayoutDensityRules {
  switch (rules.spacingStyle) {
    case "airy":
      return { minVisualCoverage: 0.55, maxEmptyVerticalSpace: 120, sectionSpacingScale: 1.15 };
    case "dense":
      return { minVisualCoverage: 0.82, maxEmptyVerticalSpace: 48, sectionSpacingScale: 0.75 };
    case "layered":
      return { minVisualCoverage: 0.88, maxEmptyVerticalSpace: 32, sectionSpacingScale: 0.7 };
    default:
      return { minVisualCoverage: 0.72, maxEmptyVerticalSpace: 72, sectionSpacingScale: 0.9 };
  }
}

export function applyDensityToSectionGap(baseGap: string, density: LayoutDensityRules): string {
  if (density.sectionSpacingScale <= 0.75) {
    return "py-14 md:py-18";
  }
  if (density.sectionSpacingScale >= 1.1) {
    return "py-20 md:py-28";
  }
  return baseGap;
}
