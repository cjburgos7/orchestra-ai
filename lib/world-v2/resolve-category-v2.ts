/**
 * Absolute category lock — NO shared pools, NO fruit fallback.
 */

import type { StartupBrief } from "@/lib/types/startup";
import type { V2CategoryKey } from "./types";

type Rule = {
  key: V2CategoryKey;
  label: string;
  weight: number;
  patterns: RegExp[];
};

const RULES: Rule[] = [
  {
    key: "fitness",
    label: "Fitness & Training",
    weight: 100,
    patterns: [
      /\b(gym|fitness|workout|training|crossfit|HIIT|personal trainer|weightlifting|strength|cardio|athlete|bodybuilding|exercise|physical)\b/i,
    ],
  },
  {
    key: "floral",
    label: "Floral & Botanical",
    weight: 100,
    patterns: [
      /\b(flower|floral|florist|bouquet|bloom|rose|peony|orchid|botanical|petal|garden arrangement)\b/i,
    ],
  },
  {
    key: "finance",
    label: "Finance & Fintech",
    weight: 100,
    patterns: [
      /\b(fintech|neobank|bank|finance|invest|wealth|portfolio|payment|budget|savings|crypto|trading|stock|fund|loan|mortgage|insurance)\b/i,
    ],
  },
  {
    key: "fashion",
    label: "Fashion & Apparel",
    weight: 100,
    patterns: [/\b(fashion|apparel|clothing|streetwear|sneaker|runway|couture|wardrobe|style brand|outfit|wear|dress)\b/i],
  },
  {
    key: "food",
    label: "Food & Produce",
    weight: 95,
    patterns: [
      /\b(fruit|produce|farm|orchard|grocery|smoothie|juice|harvest|CSA|organic box|meal kit|restaurant|chef|food|recipe|beverage|drink|eat|cook|culinary|ingredient)\b/i,
      /foodtech|food-tech|agritech/i,
    ],
  },
  {
    key: "wellness",
    label: "Wellness & Mindfulness",
    weight: 92,
    patterns: [
      /\b(wellness|meditation|mindfulness|yoga|spa|retreat|mental health|calm|sleep|breathe|relax|stress|anxiety|wellbeing|mindful)\b/i,
      /wellnesstech|mentalhealth/i,
    ],
  },
  {
    key: "sports",
    label: "Sports & Analytics",
    weight: 90,
    patterns: [/\b(basketball|soccer|football|baseball|sports analytics|arena|stadium|coaching|scouting|game film|athlete performance|team performance)\b/i],
  },
  {
    key: "travel",
    label: "Travel & Experience",
    weight: 88,
    patterns: [/\b(travel|hotel|destination|adventure|safari|resort|wanderlust|expedition|trip|vacation|tourism|flight|booking|itinerary)\b/i],
  },
  {
    key: "home",
    label: "Home & Living",
    weight: 88,
    patterns: [/\b(interior|furniture|home decor|living room|hygge|textile|homeware|interior design|room|apartment|house|proptech)\b/i],
  },
  {
    key: "health",
    label: "Health & Medical",
    weight: 88,
    patterns: [
      /\b(healthcare|medical|clinic|patient|doctor|telehealth|diagnostic|therapy|hospital|nurse|treatment|drug|pharma|chronic|symptom|health|wellness care)\b/i,
      /healthtech|health-tech|medtech|med-tech|digital health/i,
    ],
  },
  {
    key: "education",
    label: "Education & Learning",
    weight: 85,
    patterns: [
      /\b(education|learning|course|student|university|tutorial|skill|edtech|teacher|tutor|lesson|study|academic|school|college|classroom|quiz|exam|knowledge)\b/i,
      /edtech|ed-tech|legaltech/i,
    ],
  },
  {
    key: "creator",
    label: "Creator Tools",
    weight: 85,
    patterns: [
      /\b(creator|youtube|podcast|streaming|content creator|influencer|monetize|newsletter|subscriber|audience|video|channel|broadcast)\b/i,
      /creatortech|creator economy/i,
    ],
  },
  {
    key: "music",
    label: "Music & Audio",
    weight: 90,
    patterns: [
      /\b(music|musician|artist|band|concert|album|track|audio|sound|playlist|streaming music|label|record|studio|singer|DJ|festival|live music|genre|song|beat|producer|vinyl|podcast music)\b/i,
      /musictech|music-tech|audiotech|soundcloud|spotify-like/i,
    ],
  },
  {
    key: "science",
    label: "Science & Technology",
    weight: 88,
    patterns: [
      /\b(space|satellite|telescope|rocket|orbit|NASA|aerospace|propulsion|astronomy|quantum|biotech|genomics|laboratory|lab|research|scientific|physics|chemistry|biology|molecule|CRISPR|clinical trial|R&D|deep tech|hardware)\b/i,
      /deeptech|deep-tech|spacetech|biotech|medtech-science/i,
    ],
  },
  {
    key: "saas",
    label: "Software & SaaS",
    weight: 20,
    patterns: [
      /\b(saas|software|B2B|workflow|automation|enterprise|dashboard)\b/i,
    ],
  },
];

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

export function resolveCategoryV2(brief: StartupBrief): { key: V2CategoryKey; label: string; score: number } {
  const text = briefText(brief);
  let best: { key: V2CategoryKey; label: string; score: number } = {
    key: "saas",
    label: "Software & SaaS",
    score: 0,
  };

  for (const rule of RULES) {
    let score = 0;
    for (const p of rule.patterns) {
      if (p.test(text)) score += rule.weight;
    }
    if (score > best.score) {
      best = { key: rule.key, label: rule.label, score };
    }
  }

  return best;
}

/** Hard boundary — throws if image category !== world category */
export function assertCategoryLock(worldCategory: V2CategoryKey, imageCategory: V2CategoryKey): void {
  if (worldCategory !== imageCategory) {
    throw new Error(`Category lock violation: ${worldCategory} cannot use ${imageCategory} imagery`);
  }
}
