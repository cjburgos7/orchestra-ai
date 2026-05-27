import type { HomeSectionId } from "@/lib/types/startup";
import type { VisualDNA } from "./engine";

export function heroMinVhFromDNA(vd: VisualDNA): number {
  const match = vd.layout.heroHeight.match(/^([\d.]+)vh$/);
  return match ? parseFloat(match[1]) / 100 : 1;
}

export function pacingForSection(vd: VisualDNA, sectionIndex: number): number {
  const beats = vd.pacing.sectionPattern;
  if (!beats.length) return 0.7;
  return beats[sectionIndex % beats.length].heightVH / 100;
}

export function sectionTransition(vd: VisualDNA): "rise" | "fade" | "none" {
  const enter = vd.pacing.enterAnimation;
  if (enter === "blur-reveal" || enter === "stagger-slow") return "fade";
  if (enter === "immediate") return "none";
  return "rise";
}

export function sectionEnterDurationMs(vd: VisualDNA): number {
  switch (vd.pacing.transitionSpeed) {
    case "glacial":
      return 1400;
    case "slow":
      return 1100;
    case "instant":
      return 350;
    default:
      return 900;
  }
}

export function heroContentMaxWidth(vd: VisualDNA): string {
  return vd.layout.contentMaxWidth;
}

export function heroAlignClass(vd: VisualDNA): string {
  switch (vd.layout.heroComposition) {
    case "type-over-bleed":
    case "collage-collision":
      return "items-center justify-center text-center";
    case "split-type-image":
      return "items-center";
    default:
      return "items-end";
  }
}

export function heroTextAlign(vd: VisualDNA): "left" | "center" {
  return vd.layout.heroComposition === "type-over-bleed" ? "center" : "left";
}

/** Map Orchestra section id → index in cinematic scroll rhythm */
export function sectionIndexForId(id: HomeSectionId, order: HomeSectionId[]): number {
  const idx = order.indexOf(id);
  return idx >= 0 ? idx : 0;
}
