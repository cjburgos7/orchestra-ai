import type { DirectionId, ImagerySet, StartupBrief } from "@/lib/types/startup";
import type { GeneratedSections } from "@/lib/types/startup";
import { resolveCategory } from "@/lib/orchestration/category-resolution";
import { getCategoryWorld, isImageryOnlyCategory } from "@/lib/orchestration/category-worlds";
import { resolveCreativeLayout } from "@/lib/orchestration/creative-layouts";
import { buildArtDirectedImagery } from "@/lib/imagery/art-directed-pipeline";
import { buildImageryFromPipeline } from "@/lib/imagery-from-pipeline";
import { compressLayoutForInventory } from "@/lib/slot-hydration";
import { generateLogo } from "@/lib/orchestration/generate-logo";
import {
  mergeSectionOrder,
  pickFeatureArchetypes,
  resolveWorldDNA,
  worldDNALLMContext,
} from "@/lib/orchestration/world-dna";
import type { CreativeLayoutConfig } from "@/lib/types/startup";

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return Math.abs(h);
}

function pickMotion(
  category: import("@/lib/types/startup").ProductCategory,
  direction: DirectionId,
  dnaMotion: import("@/lib/types/startup").MotionProfile
): import("@/lib/types/startup").MotionProfile {
  const world = getCategoryWorld(category);
  const cinematicDirs = new Set([
    "premium-dark",
    "cinematic-ai",
    "luxury-editorial",
    "minimal-luxury",
    "fashion-ai",
    "glass-futuristic",
  ]);
  const energeticDirs = new Set(["bold-experimental", "genz-vibrant", "creator-playful", "creative-agency"]);

  if (dnaMotion === "energetic" || energeticDirs.has(direction)) return "energetic";
  if (dnaMotion === "editorial") return "editorial";
  if (world.defaultMotion === "editorial") return "editorial";
  if (cinematicDirs.has(direction) || world.defaultMotion === "cinematic") return "cinematic";
  return world.defaultMotion;
}

function pickAccent(category: import("@/lib/types/startup").ProductCategory, seed: string): string {
  const pool = getCategoryWorld(category).accents;
  return pool[hashSeed(seed) % pool.length];
}

function applyWorldDNAToLayout(
  layout: CreativeLayoutConfig,
  dna: ReturnType<typeof resolveWorldDNA>
): CreativeLayoutConfig {
  const densityGap =
    dna.informationDensity === "dense"
      ? "py-16 md:py-20"
      : layout.sectionGap;

  const headlineScale =
    dna.informationDensity === "dense"
      ? "text-4xl md:text-5xl lg:text-6xl"
      : layout.headlineScale;

  return {
    ...layout,
    sectionOrder: mergeSectionOrder(dna.sectionArchetypes, layout.sectionOrder, dna.mode),
    sectionGap: densityGap,
    headlineScale,
    typographyModifier: dna.typographyBehavior || layout.typographyModifier,
    showShowcase: dna.showCommerceSections && layout.showShowcase,
    showCollections: dna.showCommerceSections && layout.showCollections,
    showCategories: dna.showCommerceSections && layout.showCategories,
    showPromo: dna.showCommerceSections && layout.showPromo,
    imageFeatures: dna.mode === "commerce-editorial" && layout.imageFeatures,
  };
}

function buildVisualsCore(
  brief: StartupBrief,
  seed: string,
  direction: DirectionId = "orchestra"
) {
  const resolution = resolveCategory(brief);
  const dna = resolveWorldDNA(brief, resolution);
  const productCategory = resolution.primary;
  const world = getCategoryWorld(productCategory);
  const accentColor = pickAccent(productCategory, seed);
  const motion = pickMotion(productCategory, direction, dna.motionStyle);
  let layout = resolveCreativeLayout(brief, direction, seed);
  layout = applyWorldDNAToLayout(layout, dna);

  return {
    productCategory,
    secondaryCategory: resolution.secondary,
    visualWorld: resolution.visualWorld,
    worldMode: dna.mode,
    worldDnaId: dna.id,
    imageryOnly: dna.imageryOnly,
    heroVisual: dna.heroVisual,
    secondaryVisual: dna.secondaryVisual,
    featureVisual: dna.featureVisual,
    dashboardStats: dna.dashboardStats,
    accentColor,
    motion,
    layout,
    logo: generateLogo(brief, direction, accentColor, seed),
    resolution,
    dna,
  };
}

function imagerySessionSeed(seed: string, direction: DirectionId): string {
  return seed.includes(":") ? seed : `${seed}:${direction}`;
}

export async function buildProductVisuals(
  brief: StartupBrief,
  seed: string,
  direction: DirectionId = "orchestra"
): Promise<import("@/lib/types/startup").SiteVisuals> {
  const core = buildVisualsCore(brief, seed, direction);
  const imagery = await buildImageryFromPipeline(
    brief,
    imagerySessionSeed(seed, direction),
    direction,
    core.accentColor
  );
  let layout = imagery.inventory
    ? compressLayoutForInventory(core.layout, imagery.inventory)
    : core.layout;

  const { resolution, dna, ...visuals } = core;
  return { ...visuals, layout, imagery };
}

export function buildProductVisualsSync(
  brief: StartupBrief,
  seed: string,
  direction: DirectionId = "orchestra"
): import("@/lib/types/startup").SiteVisuals {
  const core = buildVisualsCore(brief, seed, direction);
  const { imagery } = buildArtDirectedImagery(
    brief,
    imagerySessionSeed(seed, direction),
    direction,
    core.accentColor,
    core.resolution
  );
  let layout = imagery.inventory
    ? compressLayoutForInventory(core.layout, imagery.inventory)
    : core.layout;
  const { resolution, dna, ...visuals } = core;
  return { ...visuals, layout, imagery };
}

/** World-aware LLM context for section generation */
export function buildSectionGenerationContext(brief: StartupBrief): string {
  const resolution = resolveCategory(brief);
  const dna = resolveWorldDNA(brief, resolution);
  return worldDNALLMContext(dna, resolution, brief);
}

/** Category-native feature titles for fallbacks */
export function categoryFeatureFallbacks(brief: StartupBrief, count = 4) {
  const resolution = resolveCategory(brief);
  const dna = resolveWorldDNA(brief, resolution);
  return pickFeatureArchetypes(dna, count);
}

export { resolveCategory as detectProductCategory } from "@/lib/orchestration/category-resolution";

export function getVisualLabel(id: import("@/lib/types/startup").VisualId): string {
  const labels: Record<string, string> = {
    dashboard: "Overview",
    analytics: "Analytics",
    device: "Mobile app",
    workflow: "Workflow",
    creator: "Creator hub",
    onboarding: "Onboarding",
    "saas-panel": "Workspace",
    "fitness-tracker": "Activity tracking",
    "health-metrics": "Health metrics",
    "creator-timeline": "Content timeline",
    "creator-analytics": "Creator analytics",
    "finance-charts": "Financial overview",
    "fashion-editorial": "Editorial lookbook",
    "trend-dashboard": "Trend insights",
    "learning-progress": "Learning progress",
  };
  return labels[id] ?? "Product preview";
}

export { getCategoryLabel } from "@/lib/orchestration/category-worlds";
