"use client";

import type { AtmosphereLayer } from "@/lib/direction-engine/types";
import { parallaxTransform } from "../shared/useScrollParallax";

type Props = {
  layers: AtmosphereLayer[];
  accent: string;
  meshFrom: string;
  meshTo: string;
  heroOffset: number;
  className?: string;
};

export default function PremiumDarkAtmosphere({
  layers,
  accent,
  meshFrom,
  meshTo,
  heroOffset,
  className = "",
}: Props) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden>
      {layers.map((layer) => {
        const transform =
          layer.parallaxDepth > 0
            ? { transform: parallaxTransform(layer.parallaxDepth, heroOffset, 60) }
            : undefined;

        if (layer.type === "scrim") {
          return (
            <div
              key={layer.id}
              className="absolute inset-0 z-[2]"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.15) 68%, rgba(0,0,0,0.35) 100%)",
              }}
            />
          );
        }

        if (layer.type === "light-leak") {
          return (
            <div
              key={layer.id}
              className="absolute -top-1/4 -right-1/4 w-[70%] h-[70%] rounded-full blur-3xl pd-orb-drift"
              style={{
                opacity: layer.opacity,
                background: `radial-gradient(circle, ${accent}55 0%, transparent 68%)`,
                ...transform,
              }}
            />
          );
        }

        if (layer.type === "orb") {
          const isPrimary = layer.id.includes("primary");
          return (
            <div
              key={layer.id}
              className={`absolute rounded-full blur-3xl ${layer.motion === "pulse" ? "pd-orb-pulse" : "pd-orb-drift-reverse"}`}
              style={{
                opacity: layer.opacity,
                width: isPrimary ? "45%" : "30%",
                height: isPrimary ? "45%" : "30%",
                bottom: isPrimary ? "10%" : "35%",
                left: isPrimary ? "-8%" : "55%",
                background: isPrimary
                  ? `radial-gradient(circle, ${meshFrom}88 0%, transparent 70%)`
                  : `radial-gradient(circle, ${meshTo}66 0%, transparent 72%)`,
                ...transform,
              }}
            />
          );
        }

        if (layer.type === "vignette") {
          return (
            <div
              key={layer.id}
              className="absolute inset-0 z-[5] orch-vignette"
              style={{ opacity: layer.opacity }}
            />
          );
        }

        if (layer.type === "grain") {
          return (
            <div
              key={layer.id}
              className="absolute inset-0 z-[6] orch-film-grain"
              style={{ opacity: layer.opacity }}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
