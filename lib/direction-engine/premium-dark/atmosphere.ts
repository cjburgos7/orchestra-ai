import type { AtmosphereLayer } from "../types";

/** Premium Dark atmosphere stack — composition-first depth layers */
export const PREMIUM_DARK_ATMOSPHERE: AtmosphereLayer[] = [
  {
    id: "hero-scrim",
    type: "scrim",
    zIndex: 2,
    opacity: 1,
    parallaxDepth: 0,
    motion: "static",
  },
  {
    id: "light-leak",
    type: "light-leak",
    zIndex: 3,
    opacity: 0.35,
    parallaxDepth: 0.15,
    motion: "drift",
  },
  {
    id: "orb-primary",
    type: "orb",
    zIndex: 4,
    opacity: 0.2,
    parallaxDepth: 0.45,
    motion: "drift",
  },
  {
    id: "orb-secondary",
    type: "orb",
    zIndex: 4,
    opacity: 0.12,
    parallaxDepth: 0.65,
    motion: "pulse",
  },
  {
    id: "vignette",
    type: "vignette",
    zIndex: 5,
    opacity: 0.85,
    parallaxDepth: 0,
    motion: "static",
  },
  {
    id: "grain",
    type: "grain",
    zIndex: 6,
    opacity: 0.4,
    parallaxDepth: 0,
    motion: "static",
  },
];
