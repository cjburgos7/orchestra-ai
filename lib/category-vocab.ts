/**
 * category-vocab.ts
 *
 * Pre-authored vocabulary maps for each supported startup category.
 *
 * IMPORTANT: These queries are authored by humans, not generated at runtime.
 * Runtime query generation is what causes gaming imagery for basketball startups.
 *
 * Rules for query strings:
 *   - Every query must be photographable (you can hire a photographer and shoot it)
 *   - No abstract nouns: "innovation", "technology", "growth" are banned
 *   - No symbols or metaphors: "circles", "nodes", "network" are banned
 *   - Each query must be specific enough to return category-correct results
 *   - Minimum 3 queries per group for dedup headroom
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type SlotType =
  | "hero"        // above-the-fold hero image — widest, most impactful
  | "feature"     // feature section cards — product detail or action
  | "ambient"     // background / atmosphere — texture, environment
  | "product"     // isolated product photography
  | "team"        // people / human element
  | "social"      // social-proof / UGC style

export interface QueryGroup {
  queries: string[]   // 3+ specific query strings for this group
  slot: SlotType
}

export interface CategoryVocab {
  // Ordered by slot priority — hero first
  queryGroups: QueryGroup[]

  // DALL-E fallback components
  mood: string[]         // 3–5 adjectives describing the visual feel
  photographyStyle: string  // e.g. "lifestyle editorial", "studio still life"

  // WorldDNA palette suggestion (used for gradient fallbacks)
  palette: [string, string, string]  // [primary, secondary, accent]
}

// ─── Alias map ────────────────────────────────────────────────────────────────
// Maps raw user input → canonical category key
// Add new aliases as you discover user inputs that misfire

const CATEGORY_ALIASES: Record<string, string> = {
  // Produce / food
  "fruit":                "fresh produce",
  "fruit company":        "fresh produce",
  "fruit startup":        "fresh produce",
  "fruit delivery":       "fresh produce",
  "fresh fruit":          "fresh produce",
  "produce":              "fresh produce",
  "farm to table":        "fresh produce",
  "vegetable":            "fresh produce",
  "grocery":              "fresh produce",
  "food delivery":        "food & beverage",
  "restaurant":           "food & beverage",
  "meal kit":             "food & beverage",
  "coffee":               "food & beverage",

  // Sports
  "basketball":           "sports & athletics",
  "basketball startup":   "sports & athletics",
  "sports":               "sports & athletics",
  "fitness":              "sports & athletics",
  "gym":                  "sports & athletics",
  "training":             "sports & athletics",
  "soccer":               "sports & athletics",
  "football":             "sports & athletics",
  "running":              "sports & athletics",
  "yoga":                 "wellness & mindfulness",

  // Tech
  "ai startup":           "software & ai",
  "saas":                 "software & ai",
  "software":             "software & ai",
  "developer tools":      "software & ai",
  "api":                  "software & ai",

  // Fashion
  "fashion":              "fashion & apparel",
  "clothing":             "fashion & apparel",
  "streetwear":           "fashion & apparel",
  "shoes":                "fashion & apparel",
  "sneakers":             "fashion & apparel",

  // Finance
  "fintech":              "finance & payments",
  "banking":              "finance & payments",
  "payments":             "finance & payments",
  "investing":            "finance & payments",

  // Health
  "health":               "health & wellness",
  "healthcare":           "health & wellness",
  "medical":              "health & wellness",
  "mental health":        "wellness & mindfulness",
  "meditation":           "wellness & mindfulness",

  // Education
  "edtech":               "education & learning",
  "education":            "education & learning",
  "learning":             "education & learning",
  "tutoring":             "education & learning",

  // Travel
  "travel":               "travel & experiences",
  "hospitality":          "travel & experiences",
  "hotel":                "travel & experiences",

  // Home
  "home":                 "home & living",
  "interior":             "home & living",
  "furniture":            "home & living",
  "real estate":          "home & living",

  // Pets
  "pet":                  "pets & animals",
  "pets":                 "pets & animals",
  "dog":                  "pets & animals",
  "dogs":                 "pets & animals",
  "dog startup":          "pets & animals",
  "cat":                  "pets & animals",
  "cats":                 "pets & animals",
  "pet care":             "pets & animals",
  "pet food":             "pets & animals",
};

/**
 * Resolves a raw category string to a canonical category key.
 * Performs: lowercase → trim → alias lookup → direct lookup → fuzzy match
 */
export function resolveCategory(raw: string): string {
  const normalized = raw.toLowerCase().trim();

  // Direct alias lookup
  if (CATEGORY_ALIASES[normalized]) return CATEGORY_ALIASES[normalized];

  // Check if any alias key is contained in the raw string
  for (const [alias, canonical] of Object.entries(CATEGORY_ALIASES)) {
    if (normalized.includes(alias)) return canonical;
  }

  // Fall through — return normalized string, pipeline will use generic queries
  return normalized;
}

// ─── Vocabulary maps ──────────────────────────────────────────────────────────

export const CATEGORY_VOCAB: Record<string, CategoryVocab> = {

  // ── Fresh Produce ──────────────────────────────────────────────────────────
  "fresh produce": {
    queryGroups: [
      {
        slot: "hero",
        queries: [
          "farmers market fruit stall morning light",
          "colorful fruit arrangement wood table",
          "apple orchard rows harvest sunny",
          "tropical fruit flat lay overhead",
          "fresh strawberries bowl summer",
        ],
      },
      {
        slot: "feature",
        queries: [
          "ripe orange half cross section macro",
          "cold press juice bottle glass",
          "wooden fruit crate market rustic",
          "fresh cherries bowl macro",
          "mango sliced yellow bright",
        ],
      },
      {
        slot: "ambient",
        queries: [
          "orchard sunrise golden light rows",
          "produce market stall colorful fruit",
          "morning dew strawberry leaf macro",
          "harvest basket wicker outdoor fruit",
          "vineyard grape row autumn light",
        ],
      },
      {
        slot: "product",
        queries: [
          "premium fruit gift box packaging",
          "juice bottle white background studio",
          "organic fruit label close up",
          "fruit smoothie glass condensation",
        ],
      },
    ],
    mood: ["abundant", "sun-warmed", "artisanal", "seasonal", "honest"],
    photographyStyle: "lifestyle editorial",
    palette: ["#E8490F", "#F5A623", "#3D7A3D"],
  },

  // ── Sports & Athletics ────────────────────────────────────────────────────
  "sports & athletics": {
    queryGroups: [
      {
        slot: "hero",
        queries: [
          "basketball court overhead arena lights",
          "athlete running track stadium",
          "sports training facility gym wide",
          "basketball hoop sunset silhouette court",
          "arena crowd game night energy",
        ],
      },
      {
        slot: "feature",
        queries: [
          "basketball player dribbling action blur",
          "sneakers basketball court closeup",
          "athletic hands holding basketball leather texture",
          "player jump shot three point arc",
          "training cones drill floor gym",
        ],
      },
      {
        slot: "ambient",
        queries: [
          "hardwood basketball court floor reflection",
          "stadium lights beam night game",
          "locker room team gear equipment",
          "scoreboard digital glow arena",
          "sports bench sideline game",
        ],
      },
      {
        slot: "product",
        queries: [
          "basketball jersey closeup number fabric",
          "sports equipment bag court side",
          "athlete water bottle hydration",
          "sneaker sole basketball shoe",
        ],
      },
    ],
    mood: ["competitive", "kinetic", "aspirational", "team-driven"],
    photographyStyle: "documentary sports",
    palette: ["#C8501A", "#1B3A5C", "#F5C842"],
  },

  // ── Food & Beverage ───────────────────────────────────────────────────────
  "food & beverage": {
    queryGroups: [
      {
        slot: "hero",
        queries: [
          "restaurant dining room modern interior",
          "food plating chef restaurant fine dining",
          "coffee shop morning atmosphere light",
          "meal kit ingredients flat lay",
          "kitchen cooking steam action",
        ],
      },
      {
        slot: "feature",
        queries: [
          "coffee latte art overhead closeup",
          "burger food photography dark moody",
          "salad bowl healthy ingredients overhead",
          "pasta dish restaurant table setting",
          "cocktail bar drinks colorful",
        ],
      },
      {
        slot: "ambient",
        queries: [
          "restaurant kitchen pass window service",
          "wine cellar bottles rack dark",
          "market street food vendors crowd",
          "barista coffee machine espresso pull",
        ],
      },
      {
        slot: "product",
        queries: [
          "food packaging premium box design table",
          "sauce bottle label kitchen counter",
          "meal prep containers stack overhead",
        ],
      },
    ],
    mood: ["indulgent", "artisanal", "warm", "inviting"],
    photographyStyle: "food editorial",
    palette: ["#C0392B", "#E67E22", "#F39C12"],
  },

  // ── Software & AI ─────────────────────────────────────────────────────────
  "software & ai": {
    queryGroups: [
      {
        slot: "hero",
        queries: [
          "developer laptop code screen coffee desk",
          "tech startup office modern open plan",
          "person working laptop window light",
          "software team collaboration whiteboard",
          "computer monitor code dark mode",
        ],
      },
      {
        slot: "feature",
        queries: [
          "hands typing keyboard closeup",
          "dual monitor developer setup desk",
          "laptop screen dashboard data",
          "team meeting screen presentation",
        ],
      },
      {
        slot: "ambient",
        queries: [
          "tech office plant modern minimal",
          "server room blue light rows",
          "startup office city view window",
          "coffee desk notebook morning work",
        ],
      },
      {
        slot: "product",
        queries: [
          "iphone app screen mockup hand",
          "laptop mockup coffee table",
          "tablet screen dashboard hand holding",
        ],
      },
    ],
    mood: ["focused", "efficient", "modern", "purposeful"],
    photographyStyle: "commercial lifestyle",
    palette: ["#3B82F6", "#8B5CF6", "#1E293B"],
  },

  // ── Fashion & Apparel ─────────────────────────────────────────────────────
  "fashion & apparel": {
    queryGroups: [
      {
        slot: "hero",
        queries: [
          "fashion model street style editorial",
          "clothing rack store interior minimal",
          "fashion flat lay overhead editorial",
          "model wearing outfit urban street",
          "fashion lookbook studio portrait",
        ],
      },
      {
        slot: "feature",
        queries: [
          "fabric texture closeup weave detail",
          "sneaker detail sole stitching",
          "clothing tag label closeup quality",
          "hands folding sweater cashmere",
          "jacket lapel detail fashion",
        ],
      },
      {
        slot: "ambient",
        queries: [
          "clothing store interior modern minimal light",
          "fashion studio natural light white wall",
          "wardrobe open organized clothing",
          "fashion week backstage mirror",
        ],
      },
      {
        slot: "product",
        queries: [
          "shirt folded white background studio",
          "sneakers white background product",
          "bag leather white background studio",
        ],
      },
    ],
    mood: ["effortless", "considered", "elevated", "authentic"],
    photographyStyle: "fashion editorial",
    palette: ["#1A1A1A", "#D4AF37", "#F5F5F5"],
  },

  // ── Finance & Payments ────────────────────────────────────────────────────
  "finance & payments": {
    queryGroups: [
      {
        slot: "hero",
        queries: [
          "business professional office city view",
          "laptop finance dashboard charts screen",
          "person phone banking app",
          "credit card payment tap terminal",
          "financial advisor meeting client",
        ],
      },
      {
        slot: "feature",
        queries: [
          "hands phone mobile payment app",
          "credit card gold premium closeup",
          "bank statement chart growth",
          "meeting boardroom business professionals",
        ],
      },
      {
        slot: "ambient",
        queries: [
          "financial district city skyline",
          "modern bank office interior",
          "laptop desk morning finance work",
        ],
      },
      {
        slot: "product",
        queries: [
          "premium black credit card mockup",
          "finance app iphone screen",
          "bank card wallet leather",
        ],
      },
    ],
    mood: ["trustworthy", "precise", "premium", "confident"],
    photographyStyle: "corporate commercial",
    palette: ["#0F172A", "#1D4ED8", "#F8FAFC"],
  },

  // ── Health & Wellness ─────────────────────────────────────────────────────
  "health & wellness": {
    queryGroups: [
      {
        slot: "hero",
        queries: [
          "doctor patient consultation modern clinic",
          "wellness center bright interior natural",
          "healthy lifestyle morning routine",
          "nurse hospital corridor modern",
          "health clinic reception bright",
        ],
      },
      {
        slot: "feature",
        queries: [
          "medical device closeup professional",
          "health tracking app wearable wrist",
          "vitamin supplement bottles clean",
          "stethoscope medical professional closeup",
        ],
      },
      {
        slot: "ambient",
        queries: [
          "hospital corridor modern architecture",
          "medical lab equipment professional",
          "pharmacy shelf products organized",
        ],
      },
      {
        slot: "product",
        queries: [
          "supplement bottle white background",
          "health app iphone screen clean",
          "medical kit clean white",
        ],
      },
    ],
    mood: ["trustworthy", "caring", "clean", "hopeful"],
    photographyStyle: "clinical commercial",
    palette: ["#0891B2", "#10B981", "#F0FDFA"],
  },

  // ── Wellness & Mindfulness ────────────────────────────────────────────────
  "wellness & mindfulness": {
    queryGroups: [
      {
        slot: "hero",
        queries: [
          "yoga class sunrise studio light",
          "meditation garden outdoor morning",
          "person meditating peaceful room light",
          "wellness retreat pool mountains",
          "yoga pose outdoor nature",
        ],
      },
      {
        slot: "feature",
        queries: [
          "yoga mat candle minimal room",
          "herbal tea cup morning light",
          "meditation cushion minimal floor",
          "essential oil bottle natural light",
        ],
      },
      {
        slot: "ambient",
        queries: [
          "spa interior candle warm light",
          "nature forest path morning light",
          "calm water reflection minimal",
        ],
      },
      {
        slot: "product",
        queries: [
          "wellness product packaging minimal",
          "meditation app iphone screen",
          "yoga block strap minimal white",
        ],
      },
    ],
    mood: ["serene", "grounding", "soft", "intentional"],
    photographyStyle: "soft lifestyle editorial",
    palette: ["#86EFAC", "#FDE68A", "#F9FAFB"],
  },

  // ── Education & Learning ──────────────────────────────────────────────────
  "education & learning": {
    queryGroups: [
      {
        slot: "hero",
        queries: [
          "student laptop studying campus",
          "library books modern interior bright",
          "classroom students learning engaged",
          "person reading book coffee morning",
          "university campus outdoor students",
        ],
      },
      {
        slot: "feature",
        queries: [
          "student notebook writing study",
          "teacher whiteboard classroom explanation",
          "online class laptop video call",
          "book stack desk study lamp",
        ],
      },
      {
        slot: "ambient",
        queries: [
          "library interior architecture high ceiling",
          "study room minimal desk lamp",
          "campus walkway students morning",
        ],
      },
      {
        slot: "product",
        queries: [
          "learning app tablet screen student",
          "educational book cover design",
          "study planner notebook pen",
        ],
      },
    ],
    mood: ["curious", "encouraging", "warm", "empowering"],
    photographyStyle: "editorial lifestyle",
    palette: ["#F59E0B", "#3B82F6", "#FFFBEB"],
  },

  // ── Travel & Experiences ──────────────────────────────────────────────────
  "travel & experiences": {
    queryGroups: [
      {
        slot: "hero",
        queries: [
          "travel destination aerial landscape stunning",
          "hotel lobby luxury interior design",
          "traveler luggage airport departure terminal",
          "scenic viewpoint mountain sunset hiker",
          "beach resort infinity pool ocean view",
        ],
      },
      {
        slot: "feature",
        queries: [
          "passport travel ticket boarding pass",
          "hotel room interior premium bed",
          "city street travel explore local",
          "airplane window seat cloud view",
        ],
      },
      {
        slot: "ambient",
        queries: [
          "airport terminal architecture modern light",
          "city skyline travel golden hour",
          "map notebook pen travel planning",
        ],
      },
      {
        slot: "product",
        queries: [
          "travel bag luggage premium leather",
          "travel app phone map navigation",
          "hotel key card premium",
        ],
      },
    ],
    mood: ["adventurous", "expansive", "premium", "free"],
    photographyStyle: "travel editorial",
    palette: ["#0EA5E9", "#F97316", "#F0F9FF"],
  },

  // ── Home & Living ─────────────────────────────────────────────────────────
  "home & living": {
    queryGroups: [
      {
        slot: "hero",
        queries: [
          "modern living room interior design light",
          "kitchen interior minimal white modern",
          "bedroom interior design natural light",
          "apartment interior Scandinavian design",
          "home office desk setup minimal",
        ],
      },
      {
        slot: "feature",
        queries: [
          "furniture detail wood texture closeup",
          "interior lamp design modern",
          "plant home interior light",
          "kitchen counter minimal organized",
        ],
      },
      {
        slot: "ambient",
        queries: [
          "home exterior architecture modern",
          "neighborhood street residential warm",
          "interior architectural detail window light",
        ],
      },
      {
        slot: "product",
        queries: [
          "home product packaging minimal",
          "furniture catalog product white background",
          "home decor object minimal studio",
        ],
      },
    ],
    mood: ["calm", "considered", "warm", "elevated"],
    photographyStyle: "interior editorial",
    palette: ["#D97706", "#78716C", "#FAFAF9"],
  },

  // ── Pets & Animals ────────────────────────────────────────────────────────
  "pets & animals": {
    queryGroups: [
      {
        slot: "hero",
        queries: [
          "golden retriever running park sunny",
          "dog owner walking dog city street",
          "happy dog portrait natural light outdoor",
          "puppy playing grass closeup",
          "cat lounging window sunlight home",
        ],
      },
      {
        slot: "feature",
        queries: [
          "dog food bowl premium kibble closeup",
          "pet leash and collar flat lay",
          "dog grooming brush fur detail",
          "cat playing toy indoor lifestyle",
          "veterinary checkup dog gentle hands",
        ],
      },
      {
        slot: "ambient",
        queries: [
          "dog park community morning light",
          "pet store shelves products colorful",
          "home living room dog bed cozy",
          "backyard dog playing fetch",
          "cat tree window perch sunlight",
        ],
      },
      {
        slot: "product",
        queries: [
          "premium dog food packaging studio",
          "pet supplement bottle white background",
          "dog toy product photography minimal",
          "pet grooming kit product flat lay",
        ],
      },
    ],
    mood: ["warm", "trustworthy", "playful", "caring"],
    photographyStyle: "lifestyle pet editorial",
    palette: ["#D97706", "#92400E", "#FFFBEB"],
  },
};
