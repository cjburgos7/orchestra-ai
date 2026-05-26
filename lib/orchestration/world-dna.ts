/**
 * WORLD_DNA — structured identity for every generated startup world.
 * Drives section archetypes, copy tone, layout density, motion, and UI motifs.
 */

import type {
  HomeSectionId,
  MotionProfile,
  ProductCategory,
  StartupBrief,
  VisualId,
} from "@/lib/types/startup";
import type { CategoryResolution, SecondaryCategory } from "@/lib/orchestration/category-resolution";
import { getCategoryWorld } from "@/lib/orchestration/category-worlds";

export type WorldMode =
  | "commerce-editorial"
  | "analytics-platform"
  | "creator-platform"
  | "saas-product";

export type InformationDensity = "sparse" | "balanced" | "dense";
export type WorldPacing = "slow" | "moderate" | "kinetic";

export type FeatureArchetype = {
  title: string;
  descriptionHint: string;
};

export type WorldDNA = {
  id: string;
  mode: WorldMode;
  visualLanguage: string;
  pacing: WorldPacing;
  informationDensity: InformationDensity;
  motionStyle: MotionProfile;
  typographyBehavior: string;
  uiMotifs: string[];
  sectionArchetypes: HomeSectionId[];
  featureArchetypes: FeatureArchetype[];
  emotionalTone: string;
  culturalReferences: string[];
  heroVisual: VisualId;
  secondaryVisual: VisualId;
  featureVisual: VisualId;
  imageryOnly: boolean;
  showCommerceSections: boolean;
  dashboardStats: { label: string; value: string; change: string }[];
  thumbnailComposition: string;
};

function briefText(brief: StartupBrief): string {
  return [
    brief.name,
    brief.tagline,
    brief.description,
    brief.startupCategory,
    brief.audience,
    ...(brief.features ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

function isAnalyticsBrief(text: string): boolean {
  return /\b(analytics|heatmap|scouting|scout report|player tracking|shot chart|shot accuracy|game prediction|AI coaching|performance data|stat overlay|recruit discovery|team comparison|season trend|live data|sports intelligence|computer vision|tracking camera)\b/i.test(
    text
  );
}

function isCreatorBrief(text: string): boolean {
  return /\b(creator|influencer|audience growth|engagement|monetization|content studio|social native|tiktok|youtube|subscribers|followers|brand deals)\b/i.test(
    text
  );
}

const BASKETBALL_ANALYTICS_DNA: WorldDNA = {
  id: "basketball-analytics",
  mode: "analytics-platform",
  visualLanguage:
    "Arena lighting, scoreboard UI, stat-heavy layouts, sharp contrast, court photography, heatmap overlays, scouting cards, ESPN/NBA/Nike Sports visual energy",
  pacing: "kinetic",
  informationDensity: "dense",
  motionStyle: "energetic",
  typographyBehavior: "Bold condensed headlines, monospace stat labels, high-contrast numerals",
  uiMotifs: [
    "shot heatmaps",
    "player comparison cards",
    "live scoreboard strips",
    "scouting report panels",
    "performance trend charts",
    "court overlay grids",
    "team stat tables",
  ],
  sectionArchetypes: [
    "analytics",
    "platform",
    "metrics",
    "features",
    "testimonials",
    "pricing",
    "faq",
    "cta",
  ],
  featureArchetypes: [
    { title: "Live player tracking", descriptionHint: "Real-time positional data and movement analytics on court" },
    { title: "Shot accuracy dashboard", descriptionHint: "Heatmaps showing make/miss zones and efficiency by distance" },
    { title: "Recruit discovery engine", descriptionHint: "AI-powered prospect identification from game film and stats" },
    { title: "Game prediction model", descriptionHint: "Win probability and matchup forecasting from historical performance" },
    { title: "AI scouting reports", descriptionHint: "Automated player breakdowns with strengths, weaknesses, and comps" },
    { title: "Team comparison stats", descriptionHint: "Side-by-side team metrics across pace, efficiency, and defense" },
    { title: "Performance heatmaps", descriptionHint: "Visual shot charts and defensive coverage maps" },
    { title: "Season trend analysis", descriptionHint: "Longitudinal player and team performance over the season" },
  ],
  emotionalTone: "Competitive, data-driven, elite sports intelligence — like a funded sports-tech company",
  culturalReferences: ["ESPN", "NBA App", "Second Spectrum", "Hudl", "Apple Sports", "Nike Training Club"],
  heroVisual: "analytics",
  secondaryVisual: "dashboard",
  featureVisual: "saas-panel",
  imageryOnly: false,
  showCommerceSections: false,
  dashboardStats: [
    { label: "Shots tracked", value: "2.4M", change: "+31%" },
    { label: "Scouting reports", value: "18k", change: "+22%" },
    { label: "Prediction accuracy", value: "94.2%", change: "Live" },
  ],
  thumbnailComposition: "sports-analytics",
};

const FRUIT_COMMERCE_DNA: WorldDNA = {
  id: "fruit-commerce",
  mode: "commerce-editorial",
  visualLanguage:
    "Organic produce photography, orchard freshness, seasonal storytelling, calm editorial pacing, natural textures, farm-to-table warmth",
  pacing: "slow",
  informationDensity: "balanced",
  motionStyle: "editorial",
  typographyBehavior: "Serif headlines, soft tracking, editorial product labels",
  uiMotifs: ["seasonal badges", "orchard sourcing cards", "nutrition callouts", "recipe tiles", "subscription tiers"],
  sectionArchetypes: [
    "seasonal",
    "showcase",
    "sourcing",
    "subscription",
    "features",
    "lifestyle",
    "testimonials",
    "pricing",
    "faq",
    "cta",
  ],
  featureArchetypes: [
    { title: "Seasonal fruit drops", descriptionHint: "Curated boxes timed to peak harvest windows" },
    { title: "Orchard sourcing", descriptionHint: "Direct relationships with regional growers and co-ops" },
    { title: "Subscription plans", descriptionHint: "Flexible weekly or bi-weekly delivery cadences" },
    { title: "Nutrition insights", descriptionHint: "Macro and micronutrient breakdowns per box" },
    { title: "Smoothie collections", descriptionHint: "Chef-designed recipes using box ingredients" },
    { title: "Produce bundles", descriptionHint: "Mix-and-match crates for families and offices" },
  ],
  emotionalTone: "Fresh, wholesome, trustworthy — like a premium farm subscription brand",
  culturalReferences: ["Farmbox", "Imperfect Foods", "Blue Apron produce", "Erewhon", "Bon Appétit"],
  heroVisual: "fashion-editorial",
  secondaryVisual: "device",
  featureVisual: "onboarding",
  imageryOnly: true,
  showCommerceSections: true,
  dashboardStats: [
    { label: "Farms partnered", value: "140+", change: "+12" },
    { label: "Weekly boxes", value: "8.2k", change: "+19%" },
    { label: "Freshness rating", value: "4.9", change: "★★★★★" },
  ],
  thumbnailComposition: "editorial-commerce",
};

const CREATOR_PLATFORM_DNA: WorldDNA = {
  id: "creator-platform",
  mode: "creator-platform",
  visualLanguage:
    "Social-native layouts, creator cards, engagement metrics, audience growth systems, vibrant gradients, TikTok/Notion/Raycast influence",
  pacing: "kinetic",
  informationDensity: "dense",
  motionStyle: "energetic",
  typographyBehavior: "Bold sans headlines, metric-forward labels, playful accent colors",
  uiMotifs: ["creator profile cards", "engagement graphs", "audience growth charts", "content calendar tiles", "revenue badges"],
  sectionArchetypes: [
    "platform",
    "metrics",
    "features",
    "showcase",
    "testimonials",
    "pricing",
    "faq",
    "cta",
  ],
  featureArchetypes: [
    { title: "Audience growth dashboard", descriptionHint: "Track followers, reach, and engagement across platforms" },
    { title: "Content performance analytics", descriptionHint: "See what posts drive saves, shares, and conversions" },
    { title: "Brand deal pipeline", descriptionHint: "Manage inbound offers and campaign deliverables" },
    { title: "Creator monetization hub", descriptionHint: "Subscriptions, tips, and digital product sales in one place" },
    { title: "Cross-platform scheduling", descriptionHint: "Plan and publish content across TikTok, IG, and YouTube" },
    { title: "Engagement intelligence", descriptionHint: "AI insights on best posting times and content themes" },
  ],
  emotionalTone: "Energetic, creator-first, growth-obsessed — like a funded creator economy SaaS",
  culturalReferences: ["Notion", "Raycast", "TikTok Creator Portal", "Patreon", "Beacons"],
  heroVisual: "creator-analytics",
  secondaryVisual: "creator-timeline",
  featureVisual: "creator",
  imageryOnly: false,
  showCommerceSections: false,
  dashboardStats: [
    { label: "Creators onboarded", value: "24k", change: "+28%" },
    { label: "Avg. engagement lift", value: "+34%", change: "90 days" },
    { label: "Revenue tracked", value: "$12M", change: "+41%" },
  ],
  thumbnailComposition: "creator-vibrant",
};

function defaultDNA(resolution: CategoryResolution): WorldDNA {
  const world = getCategoryWorld(resolution.primary);
  return {
    id: `${resolution.primary}-default`,
    mode: world.imageryOnly ? "commerce-editorial" : "saas-product",
    visualLanguage: world.copyTone,
    pacing: world.defaultMotion === "energetic" ? "kinetic" : world.defaultMotion === "editorial" ? "slow" : "moderate",
    informationDensity: world.imageryOnly ? "balanced" : "dense",
    motionStyle: world.defaultMotion,
    typographyBehavior: world.typography[0] ?? "font-semibold tracking-tight",
    uiMotifs: world.collectionLabels,
    sectionArchetypes: world.sectionOrder,
    featureArchetypes: world.productSets[0]?.map((p) => ({
      title: p.name,
      descriptionHint: `Premium ${world.label.toLowerCase()} offering aligned to ${p.name}`,
    })) ?? [],
    emotionalTone: world.copyTone,
    culturalReferences: [world.label],
    heroVisual: world.heroVisual,
    secondaryVisual: world.secondaryVisual,
    featureVisual: world.featureVisual,
    imageryOnly: world.imageryOnly,
    showCommerceSections: world.sections.showcase || world.sections.collections,
    dashboardStats: world.dashboardStats,
    thumbnailComposition: world.thumbnailBase ?? "orchestra-clean",
  };
}

function resolveBySecondary(
  secondary: SecondaryCategory,
  text: string,
  resolution: CategoryResolution
): WorldDNA | null {
  if (
    (secondary === "basketball" || /\b(basketball|hoops|nba|court)\b/i.test(text)) &&
    isAnalyticsBrief(text)
  ) {
    return BASKETBALL_ANALYTICS_DNA;
  }

  if (secondary === "fruit" || secondary === "produce") {
    if (/\b(subscription|box|delivery|orchard|farm|produce|harvest)\b/i.test(text)) {
      return FRUIT_COMMERCE_DNA;
    }
  }

  if (secondary === "creator-media" || (resolution.primary === "creator" && isCreatorBrief(text))) {
    return CREATOR_PLATFORM_DNA;
  }

  return null;
}

/** Resolve WORLD_DNA for a startup brief — the core identity contract for generation */
export function resolveWorldDNA(brief: StartupBrief, resolution: CategoryResolution): WorldDNA {
  const text = briefText(brief);

  const specialized = resolveBySecondary(resolution.secondary, text, resolution);
  if (specialized) return specialized;

  if (resolution.primary === "sports" && isAnalyticsBrief(text)) {
    return BASKETBALL_ANALYTICS_DNA;
  }

  if (resolution.primary === "saas" && isAnalyticsBrief(text) && /\b(sport|basketball|athlete|team|game)\b/i.test(text)) {
    return BASKETBALL_ANALYTICS_DNA;
  }

  if (resolution.primary === "creator" && isCreatorBrief(text)) {
    return CREATOR_PLATFORM_DNA;
  }

  if ((resolution.primary === "food" || resolution.primary === "floral") && /\b(subscription|box|delivery|farm)\b/i.test(text)) {
    return FRUIT_COMMERCE_DNA;
  }

  return defaultDNA(resolution);
}

/** LLM context block injected into section generation prompts */
export function worldDNALLMContext(dna: WorldDNA, resolution: CategoryResolution, brief: StartupBrief): string {
  const features = dna.featureArchetypes
    .slice(0, 6)
    .map((f) => `- ${f.title}: ${f.descriptionHint}`)
    .join("\n");

  const sections = dna.sectionArchetypes.join(" → ");

  return `
WORLD DNA — ${dna.id}
Mode: ${dna.mode}
Visual language: ${dna.visualLanguage}
Emotional tone: ${dna.emotionalTone}
Pacing: ${dna.pacing} | Density: ${dna.informationDensity}
Cultural references: ${dna.culturalReferences.join(", ")}
UI motifs: ${dna.uiMotifs.join(", ")}
Section flow: ${sections}

Category-native feature archetypes (use these titles and adapt descriptions to ${brief.name}):
${features}

Visual world: ${resolution.visualWorld}
Primary category: ${resolution.primary} | Secondary: ${resolution.secondary}

RULES:
- Write copy that feels like a real ${dna.mode.replace("-", " ")} company — NOT a generic SaaS template
- Use category-specific nouns from the visual world above
- Feature titles MUST align with the archetypes listed — do not invent generic "Simple setup" or "Smart automation"
- Testimonials should reference realistic roles (e.g. head coach, GM, performance director for sports analytics)
- Never describe unrelated industries or imagery
`.trim();
}

export function pickFeatureArchetypes(dna: WorldDNA, count = 4): FeatureArchetype[] {
  return dna.featureArchetypes.slice(0, count);
}

const ANALYTICS_SECTIONS = new Set<HomeSectionId>(["analytics", "platform", "metrics"]);
const SEASONAL_SECTIONS = new Set<HomeSectionId>(["seasonal"]);

function filterSectionsForMode(sections: HomeSectionId[], mode: WorldMode): HomeSectionId[] {
  return sections.filter((id) => {
    if (ANALYTICS_SECTIONS.has(id) && mode !== "analytics-platform" && mode !== "creator-platform") {
      return false;
    }
    if (SEASONAL_SECTIONS.has(id) && mode !== "commerce-editorial") {
      return false;
    }
    return true;
  });
}

export function mergeSectionOrder(
  dnaSections: HomeSectionId[],
  layoutSections: HomeSectionId[],
  mode?: WorldMode
): HomeSectionId[] {
  const dnaFiltered = mode ? filterSectionsForMode(dnaSections, mode) : dnaSections;
  const layoutFiltered = mode ? filterSectionsForMode(layoutSections, mode) : layoutSections;
  const tail = ["pricing", "faq", "cta"] as HomeSectionId[];
  const merged: HomeSectionId[] = [];
  const seen = new Set<HomeSectionId>();

  for (const id of dnaFiltered) {
    if (!seen.has(id)) {
      seen.add(id);
      merged.push(id);
    }
  }

  for (const id of layoutFiltered) {
    if (!seen.has(id) && !tail.includes(id)) {
      seen.add(id);
      merged.push(id);
    }
  }

  for (const id of tail) {
    if (!seen.has(id)) merged.push(id);
  }

  return merged;
}
