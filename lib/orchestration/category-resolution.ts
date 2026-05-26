/**
 * Hard category resolution — literal startup-world intelligence.
 * Secondary category dominates imagery; primary drives layout/products.
 */

import type { ProductCategory, StartupBrief } from "@/lib/types/startup";

export type SecondaryCategory =
  | "basketball"
  | "soccer"
  | "gym-fitness"
  | "running"
  | "dogs"
  | "cats"
  | "fruit"
  | "produce"
  | "flowers"
  | "fashion-apparel"
  | "luxury-retail"
  | "esports"
  | "video-games"
  | "music-artist"
  | "creator-media"
  | "science-space"
  | "fintech"
  | "education"
  | "wellness-ritual"
  | "healthcare"
  | "saas-tool"
  | "ecommerce-retail"
  | "generic";

export type CategoryResolution = {
  primary: ProductCategory;
  secondary: SecondaryCategory;
  visualWorld: string;
  visualWorldKeywords: string[];
};

type SecondaryRule = {
  secondary: SecondaryCategory;
  primary: ProductCategory;
  pattern: RegExp;
  visualWorld: string;
  keywords: string[];
};

const SECONDARY_RULES: SecondaryRule[] = [
  {
    secondary: "basketball",
    primary: "sports",
    pattern: /\b(basketball|hoops|nba|wnba|dunk|three-pointer|basketball court|ball handling|pickup basketball|shot chart|player analytics|sports analytics|scouting|heatmap)\b/i,
    visualWorld: "Courts · basketballs · arena lighting · shot heatmaps · scouting dashboards · player analytics · team stats · coaching systems",
    keywords: ["basketball court", "basketball player", "arena", "sports analytics dashboard", "basketball game", "coaching", "team sport", "athlete performance"],
  },
  {
    secondary: "soccer",
    primary: "sports",
    pattern: /\b(soccer|football pitch|fútbol|premier league|world cup|striker|midfielder)\b/i,
    visualWorld: "Pitch · cleats · team play · match energy · training drills",
    keywords: ["soccer field", "soccer player", "cleats", "team sport", "match", "training"],
  },
  {
    secondary: "running",
    primary: "sports",
    pattern: /\b(running app|marathon|jogging|run club|5k|10k|trail run|runners)\b/i,
    visualWorld: "Runners · trails · race energy · endurance · outdoor movement",
    keywords: ["runner", "marathon", "trail running", "athletic", "endurance"],
  },
  {
    secondary: "gym-fitness",
    primary: "fitness",
    pattern: /\b(gym|workout|weightlifting|crossfit|strength training|fitness app|personal trainer)\b/i,
    visualWorld: "Gym · weights · training · athletic performance · recovery",
    keywords: ["gym", "workout", "weights", "fitness training", "athlete"],
  },
  {
    secondary: "dogs",
    primary: "pets",
    pattern: /\b(dog|dogs|puppy|puppies|canine|golden retriever|labrador|grooming dog)\b/i,
    visualWorld: "Dogs · pet owners · parks · grooming · toys · warm homes",
    keywords: ["dogs", "pet owners", "grooming", "toys", "pet lifestyle", "parks"],
  },
  {
    secondary: "cats",
    primary: "pets",
    pattern: /\b(cat|cats|kitten|kittens|feline|cat food|cat toy)\b/i,
    visualWorld: "Cats · cozy homes · play · grooming · pet care",
    keywords: ["cats", "kittens", "pet lifestyle", "grooming", "pet care"],
  },
  {
    secondary: "fruit",
    primary: "food",
    pattern: /\b(fruit|fruits|berry|berries|citrus|orchard|apple orchard|smoothie|juice bar)\b/i,
    visualWorld: "Produce · orchards · farmers market · juice · food styling · baskets",
    keywords: ["fruit photography", "orchards", "produce", "farmers market", "juice", "food styling"],
  },
  {
    secondary: "produce",
    primary: "food",
    pattern: /\b(produce|vegetable|veggie|farm box|farmbox|harvest|organic food|meal kit|farmers market)\b/i,
    visualWorld: "Fresh produce · farm harvest · seasonal ingredients · farm-to-table",
    keywords: ["produce", "vegetables", "farm harvest", "organic food", "farmers market"],
  },
  {
    secondary: "flowers",
    primary: "floral",
    pattern: /\b(flower|floral|florist|bouquet|bloom|rose|peony|orchid|arrangement)\b/i,
    visualWorld: "Botanical · bouquets · seasonal blooms · studio florals",
    keywords: ["flowers", "bouquets", "botanical", "floral arrangement"],
  },
  {
    secondary: "fashion-apparel",
    primary: "fashion",
    pattern: /\b(fashion|apparel|clothing|boutique|runway|lookbook|streetwear|designer wear)\b/i,
    visualWorld: "Editorial fashion · lookbooks · luxury apparel · studio photography",
    keywords: ["fashion editorial", "apparel", "lookbook", "luxury fashion"],
  },
  {
    secondary: "luxury-retail",
    primary: "luxury",
    pattern: /\b(luxury ecommerce|luxury shop|designer shop|premium boutique|haute|artisan luxury)\b/i,
    visualWorld: "Premium retail · designer objects · editorial luxury · craft",
    keywords: ["luxury products", "designer retail", "premium materials"],
  },
  {
    secondary: "esports",
    primary: "gaming",
    pattern: /\b(esports|e-sports|competitive gaming|tournament|pro gamer|league of legends|valorant)\b/i,
    visualWorld: "Esports · competitive play · tournaments · gaming arenas",
    keywords: ["esports", "competitive gaming", "tournament", "gaming team"],
  },
  {
    secondary: "video-games",
    primary: "gaming",
    pattern: /\b(video game|videogame|playstation|xbox|nintendo|steam game|game studio|fps game|rpg game|indie game)\b/i,
    visualWorld: "Video games · controllers · game worlds · player communities",
    keywords: ["video games", "gaming setup", "game controller", "game art"],
  },
  {
    secondary: "music-artist",
    primary: "music",
    pattern: /\b(music|musician|artist|concert|festival|vinyl|producer|spotify|audio platform)\b/i,
    visualWorld: "Studios · live performance · instruments · artist culture",
    keywords: ["music studio", "concert", "vinyl", "headphones", "live performance"],
  },
  {
    secondary: "creator-media",
    primary: "creator",
    pattern: /\b(creator|youtube|tiktok|influencer|content creator|streamer|podcast host)\b/i,
    visualWorld: "Creator studio · content · community · social video",
    keywords: ["creator studio", "video content", "social media", "community"],
  },
  {
    secondary: "science-space",
    primary: "science",
    pattern: /\b(space|nasa|satellite|astro|cosmos|orbit|quantum|research lab|biotech)\b/i,
    visualWorld: "Space · research · discovery · cinematic science · deep tech",
    keywords: ["space", "research", "laboratory", "cosmos", "technology"],
  },
  {
    secondary: "fintech",
    primary: "finance",
    pattern: /\b(fintech|finance|banking|invest|trading|portfolio|wealth|payments)\b/i,
    visualWorld: "Finance · data · trust · institutional precision",
    keywords: ["finance", "banking", "investing", "financial data"],
  },
  {
    secondary: "education",
    primary: "edtech",
    pattern: /\b(edtech|education|learning|course|student|tutor|curriculum|school)\b/i,
    visualWorld: "Learning · classrooms · progress · student success",
    keywords: ["education", "learning", "students", "courses"],
  },
  {
    secondary: "wellness-ritual",
    primary: "wellness",
    pattern: /\b(wellness|meditation|yoga|spa|mindful|self-care|holistic|ritual)\b/i,
    visualWorld: "Calm · rituals · restoration · sensory wellbeing",
    keywords: ["wellness", "meditation", "spa", "self-care"],
  },
  {
    secondary: "healthcare",
    primary: "health",
    pattern: /\b(health|medical|patient|clinical|hospital|telehealth|diagnosis)\b/i,
    visualWorld: "Healthcare · care · clinical trust · patient outcomes",
    keywords: ["healthcare", "medical", "patient care", "clinical"],
  },
  {
    secondary: "saas-tool",
    primary: "saas",
    pattern: /\b(saas|b2b|platform|software|api|cloud tool|devtools|workspace app)\b/i,
    visualWorld: "Software · productivity · teams · modern work",
    keywords: ["software", "workspace", "technology", "business tools"],
  },
  {
    secondary: "ecommerce-retail",
    primary: "ecommerce",
    pattern: /\b(ecommerce|e-commerce|online shop|marketplace|retail brand|product catalog)\b/i,
    visualWorld: "Retail · merchandising · lifestyle shopping · product grids",
    keywords: ["ecommerce", "retail", "product photography", "shopping"],
  },
];

const PRIMARY_RULES: {
  primary: ProductCategory;
  secondary: SecondaryCategory;
  pattern: RegExp;
  visualWorld: string;
  keywords: string[];
}[] = [
  { primary: "pets", secondary: "dogs", pattern: /\b(pet|pets|pet care|pet shop|animal companion)\b/i, visualWorld: "Pets · companions · care · lifestyle", keywords: ["pets", "pet care"] },
  { primary: "food", secondary: "produce", pattern: /\b(food|grocery|fresh box|subscription box)\b/i, visualWorld: "Food · fresh · delivery · ingredients", keywords: ["food", "fresh ingredients"] },
  { primary: "sports", secondary: "basketball", pattern: /\b(sport|sports|athlete|team sport|sports training)\b/i, visualWorld: "Sports · athletes · team energy · training", keywords: ["sports", "athlete", "training"] },
  { primary: "fitness", secondary: "gym-fitness", pattern: /\b(training app|coach app|athletic performance)\b/i, visualWorld: "Fitness · movement · performance", keywords: ["fitness", "training"] },
  { primary: "productivity", secondary: "saas-tool", pattern: /\b(productivity|workflow|automation|task manager|notion)\b/i, visualWorld: "Productivity · focus · workflows", keywords: ["productivity", "workflow"] },
];

export function resolveCategory(brief: StartupBrief): CategoryResolution {
  const text = [
    brief.startupCategory,
    brief.description,
    brief.name,
    brief.tagline,
    brief.audience,
    ...brief.features,
  ]
    .filter(Boolean)
    .join(" ");

  for (const rule of SECONDARY_RULES) {
    if (rule.pattern.test(text)) {
      return {
        primary: rule.primary,
        secondary: rule.secondary,
        visualWorld: rule.visualWorld,
        visualWorldKeywords: rule.keywords,
      };
    }
  }

  for (const rule of PRIMARY_RULES) {
    if (rule.pattern.test(text)) {
      return {
        primary: rule.primary,
        secondary: rule.secondary,
        visualWorld: rule.visualWorld,
        visualWorldKeywords: rule.keywords,
      };
    }
  }

  return {
    primary: "generic",
    secondary: "generic",
    visualWorld: "Modern startup · intentional brand · focused product",
    visualWorldKeywords: ["startup", "product", "brand"],
  };
}

export function detectPrimaryCategory(brief: StartupBrief): ProductCategory {
  return resolveCategory(brief).primary;
}

export function resolutionCopyContext(resolution: CategoryResolution): string {
  return `PRIMARY category: ${resolution.primary}
SECONDARY category (dominates imagery): ${resolution.secondary}
Visual world: ${resolution.visualWorld}
Approved visual themes: ${resolution.visualWorldKeywords.join(", ")}
Imagery MUST match the secondary category literally. Never use adjacent category aesthetics.`;
}
