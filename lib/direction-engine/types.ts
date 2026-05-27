import type { DirectionId, HomeSectionId, MotionProfile } from "@/lib/types/startup";
import type { CreativeLayoutConfig } from "@/lib/types/startup";

/** Atmospheric depth layer — drives composition, not decoration-only */
export type AtmosphereLayer = {
  id: string;
  type: "mesh" | "vignette" | "grain" | "orb" | "scrim" | "light-leak";
  zIndex: number;
  opacity: number;
  parallaxDepth: number;
  motion?: "drift" | "pulse" | "static";
};

export type ViewportPacing = {
  /** Section id → min viewport height fraction (0–1) */
  sectionMinVh: Partial<Record<HomeSectionId, number>>;
  /** Default vertical rhythm between sections */
  sectionGap: string;
  heroMinVh: number;
};

export type CinematicTypography = {
  heroScale: string;
  heroTracking: string;
  heroWeight: string;
  sectionScale: string;
  eyebrowTracking: string;
  align: "left" | "center";
};

export type DirectionEngineSpec = {
  id: DirectionId;
  /** When true, LayoutHomePage delegates to direction-specific world renderer */
  enabled: boolean;
  motionProfile: MotionProfile;
  sectionOrder: HomeSectionId[];
  layoutOverrides: Partial<CreativeLayoutConfig>;
  atmosphere: AtmosphereLayer[];
  pacing: ViewportPacing;
  typography: CinematicTypography;
};

export type DirectionEngineContext = {
  accentColor: string;
  scrollProgress: number;
};
