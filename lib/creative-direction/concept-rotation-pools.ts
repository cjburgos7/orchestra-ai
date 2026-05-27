/**
 * Rotation pools for every world-intelligence category × premium-dark.
 * Metadata (signals, section rhythm) lives here; concept copy in category-premium-dark-variants.ts.
 */

import type { HomeSectionId } from "@/lib/types/startup";
import type { CategoryKey } from "@/lib/world-intelligence";
import type { ConceptRotationEntry } from "./concept-rotation";

const TAIL: HomeSectionId[] = ["testimonials", "pricing"];

function order(...ids: HomeSectionId[]): HomeSectionId[] {
  const seen = new Set<HomeSectionId>();
  const out: HomeSectionId[] = [];
  for (const id of [...ids, ...TAIL]) {
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

type VariantDef = {
  suffix?: string;
  label: string;
  signals: RegExp[];
  sections: HomeSectionId[];
  motion?: ConceptRotationEntry["motionHint"];
};

function poolForDirection(
  category: CategoryKey,
  direction: string,
  variants: VariantDef[]
): ConceptRotationEntry[] {
  return variants.map((v) => ({
    conceptKey: v.suffix ? `${category}::${direction}-${v.suffix}` : `${category}::${direction}`,
    label: v.label,
    briefSignals: v.signals,
    sectionOrder: order(...v.sections),
    motionHint: v.motion,
  }));
}

function poolForCategory(category: CategoryKey, variants: VariantDef[]): ConceptRotationEntry[] {
  return poolForDirection(category, "premium-dark", variants);
}

const FRESH_PRODUCE = poolForCategory("fresh-produce", [
  { label: "Michelin reverence", signals: [/luxury|michelin|curator|premium|reverence/i], sections: ["story", "lifestyle", "sourcing", "showcase", "features", "cta", "collections"], motion: "editorial" },
  { suffix: "tropical", label: "Tropical vitality", signals: [/tropical|mango|papaya|exotic|miami|caribbean|vitality|beach/i], sections: ["lifestyle", "showcase", "story", "features", "cta", "collections"], motion: "energetic" },
  { suffix: "playful", label: "Playful smoothie culture", signals: [/smoothie|playful|fun|juice bar|gen z|colorful/i], sections: ["showcase", "lifestyle", "features", "story", "collections", "cta"], motion: "energetic" },
  { suffix: "futurist", label: "Biotech nutrition futurism", signals: [/biotech|lab|science|nutrition|clinical/i], sections: ["features", "showcase", "story", "lifestyle", "cta"], motion: "cinematic" },
  { suffix: "rustic", label: "Rustic organic nostalgia", signals: [/farm|orchard|rustic|organic|heritage|CSA|co-op/i], sections: ["story", "sourcing", "lifestyle", "showcase", "features", "collections", "cta"], motion: "editorial" },
  { suffix: "athletic", label: "Athletic wellness fuel", signals: [/gym|fitness|athletic|workout|protein|training/i], sections: ["showcase", "features", "lifestyle", "story", "cta"], motion: "energetic" },
  { suffix: "market", label: "Vibrant market abundance", signals: [/market|abundance|bounty|harvest festival|variety/i], sections: ["lifestyle", "collections", "showcase", "story", "sourcing", "features", "cta"], motion: "energetic" },
  { suffix: "orchard", label: "Cinematic orchard romance", signals: [/orchard|golden hour|romance|dusk|seasonal/i], sections: ["story", "lifestyle", "sourcing", "features", "showcase", "cta"], motion: "editorial" },
  { suffix: "minimal", label: "Minimal produce elegance", signals: [/minimal|zen|japanese|elegance|refined|sparse/i], sections: ["showcase", "story", "features", "lifestyle", "cta"], motion: "cinematic" },
]);

const SOFTWARE_SAAS = poolForCategory("software-saas", [
  { label: "Trusted platform", signals: [/enterprise|B2B|platform|workflow|team/i], sections: ["features", "showcase", "story", "testimonials", "cta"], motion: "cinematic" },
  { suffix: "enterprise", label: "Enterprise authority", signals: [/enterprise|SOC|compliance|Fortune|procurement/i], sections: ["features", "showcase", "story", "cta"], motion: "cinematic" },
  { suffix: "startup", label: "Startup momentum", signals: [/startup|founder|launch|YC|seed|Series/i], sections: ["showcase", "features", "story", "cta"], motion: "energetic" },
  { suffix: "ai", label: "AI intelligence layer", signals: [/AI|machine learning|LLM|automation|agent|copilot/i], sections: ["features", "showcase", "story", "lifestyle", "cta"], motion: "cinematic" },
  { suffix: "minimal", label: "Ruthless focus", signals: [/minimal|simple|one tool|focused|single/i], sections: ["showcase", "features", "story", "cta"], motion: "editorial" },
]);

const FINANCE_FINTECH = poolForCategory("finance-fintech", [
  { label: "Calm trust", signals: [/bank|trust|secure|savings|budget/i], sections: ["story", "features", "showcase", "testimonials", "cta"], motion: "editorial" },
  { suffix: "disruptor", label: "Fintech disruptor", signals: [/disrupt|neobank|crypto|DeFi|challenge|revolution/i], sections: ["showcase", "features", "story", "cta"], motion: "energetic" },
  { suffix: "wealth", label: "Wealth stewardship", signals: [/wealth|portfolio|invest|HNW|private|advisory/i], sections: ["story", "features", "showcase", "cta"], motion: "editorial" },
  { suffix: "consumer", label: "Consumer-friendly finance", signals: [/consumer|app|millennial|Gen Z|spending|goals/i], sections: ["showcase", "lifestyle", "features", "cta"], motion: "energetic" },
]);

const SPORTS_ANALYTICS = poolForCategory("sports-analytics", [
  { label: "Film room intelligence", signals: [/coach|analytics|dashboard|stats|scouting/i], sections: ["features", "showcase", "story", "cta"], motion: "cinematic" },
  { suffix: "arena", label: "Arena intensity", signals: [/arena|game night|championship|court|playoffs/i], sections: ["showcase", "features", "lifestyle", "story", "cta"], motion: "energetic" },
  { suffix: "film-room", label: "Coaching film room", signals: [/film room|breakdown|playbook|coaching staff|sideline/i], sections: ["features", "story", "showcase", "cta"], motion: "cinematic" },
  { suffix: "fan", label: "Fan energy", signals: [/fan|stadium|crowd|fantasy|community/i], sections: ["lifestyle", "showcase", "features", "story", "cta"], motion: "energetic" },
]);

const FASHION = poolForCategory("fashion-apparel", [
  { label: "Night desire", signals: [/luxury|couture|designer|runway|collection/i], sections: ["showcase", "lifestyle", "story", "collections", "cta"], motion: "editorial" },
  { suffix: "street", label: "Street kinetic", signals: [/street|sneaker|urban|drop|hype|skate/i], sections: ["showcase", "lifestyle", "collections", "features", "cta"], motion: "energetic" },
  { suffix: "couture", label: "Couture reverence", signals: [/couture|atelier|craft|handmade|heritage/i], sections: ["story", "showcase", "lifestyle", "collections", "cta"], motion: "editorial" },
  { suffix: "minimal", label: "Minimal wardrobe", signals: [/minimal|capsule|essentials|monochrome|basics/i], sections: ["showcase", "story", "features", "cta"], motion: "cinematic" },
]);

const CREATOR = poolForCategory("creator-tools", [
  { label: "Studio glow", signals: [/creator|content|youtube|podcast|stream|edit/i], sections: ["showcase", "features", "lifestyle", "story", "cta"], motion: "energetic" },
  { suffix: "analytics", label: "Creator analytics", signals: [/analytics|metrics|growth|monetize|dashboard/i], sections: ["features", "showcase", "story", "cta"], motion: "cinematic" },
  { suffix: "community", label: "Creator community", signals: [/community|collab|network|fans|membership/i], sections: ["lifestyle", "showcase", "features", "story", "cta"], motion: "energetic" },
]);

const WELLNESS = poolForCategory("wellness-mindfulness", [
  { label: "Radical stillness", signals: [/meditation|mindfulness|calm|stillness|breath/i], sections: ["story", "lifestyle", "features", "cta"], motion: "editorial" },
  { suffix: "modern", label: "Modern calm tech", signals: [/app|digital|sleep|stress|mental health/i], sections: ["showcase", "features", "story", "cta"], motion: "cinematic" },
  { suffix: "retreat", label: "Retreat editorial", signals: [/retreat|spa|sanctuary|nature|escape/i], sections: ["story", "lifestyle", "sourcing", "features", "cta"], motion: "editorial" },
]);

const FOOD_BEVERAGE = poolForCategory("food-beverage", [
  { label: "Dark dining theater", signals: [/restaurant|chef|fine dining|tasting|michelin/i], sections: ["story", "showcase", "lifestyle", "features", "cta"], motion: "editorial" },
  { suffix: "neighborhood", label: "Neighborhood warmth", signals: [/neighborhood|bistro|cafe|local|comfort/i], sections: ["story", "lifestyle", "showcase", "sourcing", "cta"], motion: "editorial" },
  { suffix: "nightlife", label: "Bar nightlife", signals: [/bar|cocktail|night|mixology|spirits/i], sections: ["lifestyle", "showcase", "story", "features", "cta"], motion: "energetic" },
]);

const HEALTH = poolForCategory("health-medical", [
  { label: "Dignified care", signals: [/clinic|patient|care|doctor|healthcare/i], sections: ["story", "features", "showcase", "testimonials", "cta"], motion: "editorial" },
  { suffix: "precision", label: "Precision medicine", signals: [/genomic|precision|diagnostic|lab|clinical trial/i], sections: ["features", "showcase", "story", "cta"], motion: "cinematic" },
  { suffix: "compassion", label: "Compassionate healing", signals: [/compassion|therapy|support|recovery|mental/i], sections: ["story", "lifestyle", "features", "cta"], motion: "editorial" },
]);

const EDUCATION = poolForCategory("education-learning", [
  { label: "Discovery learning", signals: [/learn|course|student|skill|tutorial/i], sections: ["features", "showcase", "story", "testimonials", "cta"], motion: "cinematic" },
  { suffix: "institutional", label: "Institutional credibility", signals: [/university|college|campus|degree|accredited/i], sections: ["story", "features", "showcase", "cta"], motion: "editorial" },
  { suffix: "playful", label: "Playful learning", signals: [/game|play|kids|fun|interactive|quiz/i], sections: ["showcase", "features", "lifestyle", "cta"], motion: "energetic" },
]);

const HOME = poolForCategory("home-living", [
  { label: "Lived-in editorial", signals: [/interior|living|furniture|home|decor/i], sections: ["story", "showcase", "lifestyle", "collections", "cta"], motion: "editorial" },
  { suffix: "modernist", label: "Modernist honesty", signals: [/modern|minimal|architecture|concrete|glass/i], sections: ["showcase", "story", "features", "cta"], motion: "cinematic" },
  { suffix: "cozy", label: "Cozy warmth", signals: [/cozy|hygge|textile|warm|comfort|blanket/i], sections: ["story", "lifestyle", "showcase", "collections", "cta"], motion: "editorial" },
]);

const TRAVEL = poolForCategory("travel-experience", [
  { label: "Departure desire", signals: [/travel|hotel|destination|journey|wanderlust/i], sections: ["story", "lifestyle", "showcase", "features", "cta"], motion: "editorial" },
  { suffix: "adventure", label: "Adventure kinetic", signals: [/adventure|hike|expedition|outdoor|trail|safari/i], sections: ["lifestyle", "showcase", "story", "features", "cta"], motion: "energetic" },
  { suffix: "luxury", label: "Luxury escape", signals: [/luxury|villa|private|exclusive|resort|concierge/i], sections: ["story", "showcase", "lifestyle", "cta"], motion: "editorial" },
]);

/** All rotation pools — keyed by `{CategoryKey}::{direction}` */
export const ALL_CONCEPT_ROTATION_POOLS: Record<string, ConceptRotationEntry[]> = {
  // ── Premium Modern (default Orchestra identity) ──
  "fresh-produce::orchestra": poolForDirection("fresh-produce", "orchestra", [
    { label: "Sunlit market", signals: [/subscription|delivery|fresh|weekly|box/i], sections: ["showcase", "lifestyle", "collections", "features", "story", "cta"], motion: "energetic" },
    { suffix: "farm", label: "Farm-to-door story", signals: [/farm|orchard|CSA|co-op|heritage|organic/i], sections: ["story", "sourcing", "lifestyle", "showcase", "collections", "cta"], motion: "editorial" },
    { suffix: "vibrant", label: "Vibrant produce energy", signals: [/tropical|mango|colorful|vibrant|exotic|miami/i], sections: ["lifestyle", "showcase", "collections", "features", "cta"], motion: "energetic" },
  ]),
  "software-saas::orchestra": poolForDirection("software-saas", "orchestra", [
    { label: "Product confidence", signals: [/platform|B2B|workflow|enterprise|team/i], sections: ["features", "showcase", "story", "testimonials", "cta"], motion: "cinematic" },
    { suffix: "launch", label: "Launch momentum", signals: [/startup|founder|launch|ship|Series|YC/i], sections: ["showcase", "features", "story", "cta"], motion: "energetic" },
    { suffix: "agency", label: "Agency craft", signals: [/design|agency|craft|portfolio|premium/i], sections: ["showcase", "story", "features", "lifestyle", "cta"], motion: "editorial" },
  ]),
  "finance-fintech::orchestra": poolForDirection("finance-fintech", "orchestra", [
    { label: "Clear trust", signals: [/bank|trust|secure|savings|budget/i], sections: ["story", "features", "showcase", "testimonials", "cta"], motion: "editorial" },
    { suffix: "consumer", label: "Consumer-friendly", signals: [/consumer|Gen Z|millennial|app|goals|spending/i], sections: ["showcase", "lifestyle", "features", "cta"], motion: "energetic" },
    { suffix: "wealth", label: "Wealth clarity", signals: [/wealth|portfolio|invest|advisory|private/i], sections: ["story", "features", "showcase", "cta"], motion: "editorial" },
  ]),
  "sports-analytics::orchestra": poolForDirection("sports-analytics", "orchestra", [
    { label: "Data intelligence", signals: [/analytics|coach|dashboard|stats|scouting/i], sections: ["features", "showcase", "story", "cta"], motion: "cinematic" },
    { suffix: "fan", label: "Fan energy", signals: [/fan|stadium|crowd|fantasy|community/i], sections: ["lifestyle", "showcase", "features", "story", "cta"], motion: "energetic" },
  ]),
  "fashion-apparel::orchestra": poolForDirection("fashion-apparel", "orchestra", [
    { label: "Editorial lookbook", signals: [/luxury|couture|designer|runway|collection/i], sections: ["showcase", "lifestyle", "story", "collections", "cta"], motion: "editorial" },
    { suffix: "street", label: "Street drop energy", signals: [/street|sneaker|urban|drop|hype|skate/i], sections: ["showcase", "lifestyle", "collections", "features", "cta"], motion: "energetic" },
  ]),
  "creator-tools::orchestra": poolForDirection("creator-tools", "orchestra", [
    { label: "Creator studio", signals: [/creator|content|youtube|podcast|stream|edit/i], sections: ["showcase", "features", "lifestyle", "story", "cta"], motion: "energetic" },
    { suffix: "community", label: "Creator network", signals: [/community|collab|network|fans|membership/i], sections: ["lifestyle", "showcase", "features", "story", "cta"], motion: "energetic" },
  ]),
  "wellness-mindfulness::orchestra": poolForDirection("wellness-mindfulness", "orchestra", [
    { label: "Designed calm", signals: [/meditation|mindfulness|calm|stillness|breath/i], sections: ["story", "lifestyle", "features", "cta"], motion: "editorial" },
    { suffix: "modern", label: "Modern wellness tech", signals: [/app|digital|sleep|stress|mental health/i], sections: ["showcase", "features", "story", "cta"], motion: "cinematic" },
  ]),
  "food-beverage::orchestra": poolForDirection("food-beverage", "orchestra", [
    { label: "Appetite-first", signals: [/restaurant|chef|dining|menu|tasting/i], sections: ["showcase", "story", "lifestyle", "features", "cta"], motion: "editorial" },
    { suffix: "neighborhood", label: "Neighborhood warmth", signals: [/neighborhood|bistro|cafe|local|comfort/i], sections: ["story", "lifestyle", "showcase", "sourcing", "cta"], motion: "editorial" },
  ]),
  "health-medical::orchestra": poolForDirection("health-medical", "orchestra", [
    { label: "Human care", signals: [/clinic|patient|care|doctor|healthcare/i], sections: ["story", "features", "showcase", "testimonials", "cta"], motion: "editorial" },
    { suffix: "compassion", label: "Compassionate healing", signals: [/compassion|therapy|support|recovery|mental/i], sections: ["story", "lifestyle", "features", "cta"], motion: "editorial" },
  ]),
  "education-learning::orchestra": poolForDirection("education-learning", "orchestra", [
    { label: "Discovery learning", signals: [/learn|course|student|skill|tutorial/i], sections: ["features", "showcase", "story", "testimonials", "cta"], motion: "cinematic" },
    { suffix: "playful", label: "Playful learning", signals: [/game|play|kids|fun|interactive|quiz/i], sections: ["showcase", "features", "lifestyle", "cta"], motion: "energetic" },
  ]),
  "home-living::orchestra": poolForDirection("home-living", "orchestra", [
    { label: "Lived-in editorial", signals: [/interior|living|furniture|home|decor/i], sections: ["story", "showcase", "lifestyle", "collections", "cta"], motion: "editorial" },
    { suffix: "cozy", label: "Cozy warmth", signals: [/cozy|hygge|textile|warm|comfort|blanket/i], sections: ["story", "lifestyle", "showcase", "collections", "cta"], motion: "editorial" },
  ]),
  "travel-experience::orchestra": poolForDirection("travel-experience", "orchestra", [
    { label: "Departure desire", signals: [/travel|hotel|destination|journey|wanderlust/i], sections: ["story", "lifestyle", "showcase", "features", "cta"], motion: "editorial" },
    { suffix: "adventure", label: "Adventure kinetic", signals: [/adventure|hike|expedition|outdoor|trail|safari/i], sections: ["lifestyle", "showcase", "story", "features", "cta"], motion: "energetic" },
  ]),

  // ── Premium Dark (optional cinematic flavor) ──
  "fresh-produce::premium-dark": FRESH_PRODUCE,
  "software-saas::premium-dark": SOFTWARE_SAAS,
  "finance-fintech::premium-dark": FINANCE_FINTECH,
  "sports-analytics::premium-dark": SPORTS_ANALYTICS,
  "fashion-apparel::premium-dark": FASHION,
  "creator-tools::premium-dark": CREATOR,
  "wellness-mindfulness::premium-dark": WELLNESS,
  "food-beverage::premium-dark": FOOD_BEVERAGE,
  "health-medical::premium-dark": HEALTH,
  "education-learning::premium-dark": EDUCATION,
  "home-living::premium-dark": HOME,
  "travel-experience::premium-dark": TRAVEL,
};

export const ROTATION_CATEGORY_DEFAULTS: Partial<Record<CategoryKey, string>> = {
  "fresh-produce": "fresh-produce::orchestra",
  "software-saas": "software-saas::orchestra",
  "finance-fintech": "finance-fintech::orchestra",
  "sports-analytics": "sports-analytics::orchestra",
  "fashion-apparel": "fashion-apparel::orchestra",
  "creator-tools": "creator-tools::orchestra",
  "wellness-mindfulness": "wellness-mindfulness::orchestra",
  "food-beverage": "food-beverage::orchestra",
  "health-medical": "health-medical::orchestra",
  "education-learning": "education-learning::orchestra",
  "home-living": "home-living::orchestra",
  "travel-experience": "travel-experience::orchestra",
};

/** Fallback concept keys when a specific direction pool is missing */
export const ROTATION_PREMIUM_DARK_DEFAULTS: Partial<Record<CategoryKey, string>> = {
  "fresh-produce": "fresh-produce::premium-dark",
  "software-saas": "software-saas::premium-dark",
  "finance-fintech": "finance-fintech::premium-dark",
  "sports-analytics": "sports-analytics::premium-dark",
  "fashion-apparel": "fashion-apparel::premium-dark",
  "creator-tools": "creator-tools::premium-dark",
  "wellness-mindfulness": "wellness-mindfulness::premium-dark",
  "food-beverage": "food-beverage::premium-dark",
  "health-medical": "health-medical::premium-dark",
  "education-learning": "education-learning::premium-dark",
  "home-living": "home-living::premium-dark",
  "travel-experience": "travel-experience::premium-dark",
};
