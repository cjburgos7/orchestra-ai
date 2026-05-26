import type { DirectionId } from "@/lib/types/startup";
import type { MotionLayer } from "./image-types";
import type { MotionProfile } from "@/lib/types/startup";

export function resolveMotionLayers(direction: DirectionId, motion: MotionProfile): MotionLayer[] {
  const layers: MotionLayer[] = [{ type: "gradient", intensity: 0.15 }];

  if (direction === "premium-dark" || direction === "cinematic-ai" || motion === "cinematic") {
    layers.push({ type: "parallax", intensity: 0.35 });
    layers.push({ type: "gradient", intensity: 0.25 });
    return layers;
  }

  if (direction === "bold-experimental" || direction === "genz-vibrant" || motion === "energetic") {
    layers.push({ type: "particle", intensity: 0.4 });
    layers.push({ type: "parallax", intensity: 0.5 });
    return layers;
  }

  if (direction === "minimal-clean" || motion === "calm") {
    return [{ type: "gradient", intensity: 0.08 }];
  }

  if (motion === "editorial") {
    layers.push({ type: "parallax", intensity: 0.2 });
  }

  return layers;
}

export function motionLayerClassNames(layers: MotionLayer[]): string {
  return layers
    .map((l) => {
      if (l.type === "parallax") return "orch-parallax-band";
      if (l.type === "gradient") return "orch-gradient-drift";
      if (l.type === "particle") return "orch-glow-pulse";
      return "";
    })
    .filter(Boolean)
    .join(" ");
}
