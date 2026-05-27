/**
 * Category-world system — single source of truth for generation coherence.
 * Each category locks imagery, products, sections, layout, and copy tone together.
 * Nothing outside a world's allowed pools may appear in a generation.
 */

import type {
  BackgroundStyle,
  HomeSectionId,
  MotionProfile,
  ProductCategory,
  StartupBrief,
  VisualId,
  VisualEnergy,
} from "@/lib/types/startup";
import { resolveCategory } from "@/lib/orchestration/category-resolution";
import type { FeaturesLayout, HeroLayout } from "@/lib/orchestration/direction-layouts";

export type MerchMode =
  | "editorial-commerce"
  | "luxury-editorial"
  | "saas-product"
  | "cinematic-story"
  | "creator-media";

export type WorldProduct = {
  name: string;
  price: string;
  /** Index into world.imagery.products — keeps product ↔ photo paired */
  imageIndex: number;
};

export type ThumbnailBase =
  | "editorial-commerce"
  | "fullscreen-hero"
  | "product-grid"
  | "pet-lifestyle"
  | "luxury-editorial";

export type CategoryWorld = {
  id: ProductCategory;
  label: string;
  detect: RegExp;
  /** Semantic guardrails for copy + validation */
  allowedImagery?: string[];
  forbiddenImagery?: string[];
  /** Category-locked thumbnail composition — direction only styles the shell */
  thumbnailBase?: ThumbnailBase;
  copyTone: string;
  merchMode: MerchMode;
  /** When true, never overlay SaaS dashboard/device mockups on heroes */
  imageryOnly: boolean;
  accents: string[];
  mesh: { from: string; to: string };
  palette: { a: string; b: string; c: string; accent: string };
  /** Curated Unsplash photo IDs only — no random Picsum */
  imagery: {
    hero: string[];
    lifestyle: string[];
    products: string[];
  };
  productSets: WorldProduct[][];
  collectionLabels: string[];
  categoryBrowseLabels: string[];
  sectionOrder: HomeSectionId[];
  sections: {
    promo: boolean;
    categories: boolean;
    collections: boolean;
    showcase: boolean;
    lifestyle: boolean;
    story: boolean;
    imageFeatures: boolean;
  };
  heroes: HeroLayout[];
  features: FeaturesLayout[];
  backgrounds: BackgroundStyle[];
  typography: string[];
  energy: VisualEnergy[];
  heroVisual: VisualId;
  secondaryVisual: VisualId;
  featureVisual: VisualId;
  dashboardStats: { label: string; value: string; change: string }[];
  defaultMotion: MotionProfile;
};

/** Detection priority — more specific worlds first */
const WORLDS_ORDER: ProductCategory[] = [
  "pets",
  "food",
  "floral",
  "gaming",
  "music",
  "luxury",
  "fashion",
  "sports",
  "fitness",
  "creator",
  "science",
  "wellness",
  "health",
  "finance",
  "edtech",
  "productivity",
  "saas",
  "ecommerce",
  "generic",
];

const EDITORIAL_SECTIONS: HomeSectionId[] = [
  "promo",
  "showcase",
  "collections",
  "categories",
  "lifestyle",
  "story",
  "features",
  "testimonials",
  "pricing",
  "faq",
  "cta",
];

const WORLDS: Record<ProductCategory, CategoryWorld> = {
  pets: {
    id: "pets",
    label: "Pets",
    detect:
      /\b(pet|pets|dog|dogs|puppy|puppies|cat|cats|kitten|kittens|grooming|adoption|pet food|pet care|pet toy|collar|leash|veterinar|animal companion)\b/i,
    allowedImagery: ["dogs", "cats", "pet owners", "pet lifestyle", "pet accessories", "playful interiors", "grooming"],
    forbiddenImagery: ["gym", "weightlifting", "fitness equipment", "rocks", "architecture", "space", "abstract gradients", "office"],
    thumbnailBase: "pet-lifestyle",
    copyTone:
      "Warm, playful, emotionally friendly. Focus on pet love, care, adoption, grooming, and companionship. Never reference gym, fitness, or unrelated human products.",
    merchMode: "editorial-commerce",
    imageryOnly: true,
    accents: ["#d97706", "#ea580c", "#f59e0b", "#92400e", "#78716c"],
    mesh: { from: "#fef3c7", to: "#d97706" },
    palette: { a: "#fffbeb", b: "#d97706", c: "#fbbf24", accent: "#92400e" },
    imagery: {
      hero: [
        "158730019-474c3a6a2f5a",
        "1548199973-03cce0cbc710",
        "1516738901171-8eb4fc13bd20",
        "1530284520547-3ffa630fa651",
      ],
      lifestyle: [
        "1548199973-03cce0cbc710",
        "1530284520547-3ffa630fa651",
        "1450778869180-41d6031a2b0c",
        "158730019-474c3a6a2f5a",
      ],
      products: [
        "1583512603405-09989976d522",
        "158730019-474c3a6a2f5a",
        "1548199973-03cce0cbc710",
        "1516738901171-8eb4fc13bd20",
        "1450778869180-41d6031a2b0c",
        "1530284520547-3ffa630fa651",
      ],
    },
    productSets: [
      [
        { name: "Premium Collar", price: "$34", imageIndex: 0 },
        { name: "Grooming Kit", price: "$48", imageIndex: 1 },
        { name: "Organic Treat Box", price: "$29", imageIndex: 2 },
      ],
      [
        { name: "Monthly Food Plan", price: "$59/mo", imageIndex: 3 },
        { name: "Plush Toy Bundle", price: "$24", imageIndex: 4 },
        { name: "Pet Wellness Box", price: "$42", imageIndex: 5 },
      ],
    ],
    collectionLabels: ["Adoption ready", "Grooming essentials", "Toy shop"],
    categoryBrowseLabels: ["Food", "Toys", "Grooming", "Subscriptions"],
    sectionOrder: EDITORIAL_SECTIONS,
    sections: {
      promo: true,
      categories: true,
      collections: true,
      showcase: true,
      lifestyle: true,
      story: true,
      imageFeatures: true,
    },
    heroes: ["editorial-split", "fullscreen", "collage", "visual-first"],
    features: ["bento", "grid-2", "staggered"],
    backgrounds: ["photo", "soft", "editorial"],
    typography: ["font-bold tracking-tight", "font-semibold"],
    energy: ["bold", "editorial", "calm"],
    heroVisual: "fashion-editorial",
    secondaryVisual: "device",
    featureVisual: "onboarding",
    dashboardStats: [
      { label: "Happy pets", value: "12k+", change: "+18%" },
      { label: "Adoptions", value: "840", change: "+22%" },
      { label: "Pet rating", value: "4.9", change: "★★★★★" },
    ],
    defaultMotion: "editorial",
  },

  food: {
    id: "food",
    label: "Food & Produce",
    detect:
      /\b(fruit|fruits|produce|juice|smoothie|organic food|farm box|farmbox|orchard|harvest|grocery|farmers market|vegetable|veggie|berry|berries|citrus|apple orchard|meal kit|fresh box|basket subscription)\b/i,
    allowedImagery: ["produce", "fruit baskets", "juice", "orchards", "farmers market", "lifestyle food photography", "fresh ingredients"],
    forbiddenImagery: ["rocks", "fitness equipment", "gym", "architecture", "space", "abstract gradients", "weightlifting", "office"],
    thumbnailBase: "editorial-commerce",
    copyTone:
      "Warm, organic, farm-to-table. Speak about freshness, seasonality, flavor, and delivery. Never mention software dashboards or SaaS features.",
    merchMode: "editorial-commerce",
    imageryOnly: true,
    accents: ["#c2410c", "#ca8a04", "#65a30d", "#15803d", "#92400e"],
    mesh: { from: "#fef3c7", to: "#c2410c" },
    palette: { a: "#fef9ee", b: "#ea580c", c: "#65a30d", accent: "#15803d" },
    imagery: {
      hero: [
        "1610837524703-040399967cf0",
        "1566385101042-f4671190a963",
        "1487700174473-bd5a8d0b4723",
        "1540423133010-7117160ca44c",
      ],
      lifestyle: [
        "1519996529221-4a0f8c4d7d6e",
        "1619560669181-d72360947df1",
        "1498837167922-ddd27545d399",
        "1546548970-f6a0c97ca1e6",
      ],
      products: [
        "1610879246508-63206585852",
        "1566385101042-f4671190a963",
        "1487700174473-bd5a8d0b4723",
        "1540423133010-7117160ca44c",
        "1610837524703-040399967cf0",
        "1619560669181-d72360947df1",
      ],
    },
    productSets: [
      [
        { name: "Seasonal Fruit Box", price: "$42", imageIndex: 0 },
        { name: "Cold-Pressed Juice", price: "$18", imageIndex: 1 },
        { name: "Organic Berry Mix", price: "$28", imageIndex: 2 },
      ],
      [
        { name: "Citrus Harvest Crate", price: "$54", imageIndex: 3 },
        { name: "Green Smoothie Pack", price: "$24", imageIndex: 4 },
        { name: "Farm Stand Bundle", price: "$36", imageIndex: 5 },
      ],
    ],
    collectionLabels: ["Summer harvest", "Citrus season", "Berry collection"],
    categoryBrowseLabels: ["Fresh fruit", "Juices", "Produce boxes", "Seasonal picks"],
    sectionOrder: EDITORIAL_SECTIONS,
    sections: {
      promo: true,
      categories: true,
      collections: true,
      showcase: true,
      lifestyle: true,
      story: true,
      imageFeatures: true,
    },
    heroes: ["editorial-split", "fullscreen", "product-first", "collage"],
    features: ["bento", "grid-2", "staggered"],
    backgrounds: ["photo", "editorial", "soft"],
    typography: ["font-serif font-light tracking-wide", "font-light tracking-[0.06em]"],
    energy: ["editorial", "cinematic", "bold"],
    heroVisual: "fashion-editorial",
    secondaryVisual: "device",
    featureVisual: "onboarding",
    dashboardStats: [
      { label: "Boxes delivered", value: "2.1k", change: "+24%" },
      { label: "Farm partners", value: "48", change: "+6 new" },
      { label: "Freshness rating", value: "4.9", change: "★★★★★" },
    ],
    defaultMotion: "editorial",
  },

  floral: {
    id: "floral",
    label: "Floral",
    detect: /\b(flower|floral|florist|bouquet|bloom|garden|petal|rose|plant shop|arrangement|peony|orchid)\b/i,
    allowedImagery: ["flowers", "bouquets", "botanical", "garden", "floral arrangements"],
    forbiddenImagery: ["gym", "rocks", "fitness", "space", "abstract gradients", "office"],
    thumbnailBase: "editorial-commerce",
    copyTone:
      "Soft luxury, botanical, romantic. Speak about craftsmanship, occasions, and seasonal blooms. Never mention software or dashboards.",
    merchMode: "luxury-editorial",
    imageryOnly: true,
    accents: ["#6b9080", "#52796f", "#a4c3b2", "#354f52"],
    mesh: { from: "#cce3de", to: "#6b9080" },
    palette: { a: "#e8f3ef", b: "#6b9080", c: "#cce3de", accent: "#52796f" },
    imagery: {
      hero: [
        "1490759847868-88d4476a2101",
        "1462275646964-a0e3380e5e53",
        "1519378058454-4c037754bdbd",
        "1561181286-5df0e41f7b99",
      ],
      lifestyle: [
        "1462275646964-a0e3380e5e53",
        "1519378058454-4c037754bdbd",
        "1490759847868-88d4476a2101",
        "1561181286-5df0e41f7b99",
      ],
      products: [
        "1490759847868-88d4476a2101",
        "1462275646964-a0e3380e5e53",
        "1519378058454-4c037754bdbd",
        "1561181286-5df0e41f7b99",
        "1490759847868-88d4476a2101",
        "1462275646964-a0e3380e5e53",
      ],
    },
    productSets: [
      [
        { name: "Rose Bouquet", price: "$68", imageIndex: 0 },
        { name: "Peony Arrangement", price: "$94", imageIndex: 1 },
        { name: "Orchid Collection", price: "$120", imageIndex: 2 },
      ],
      [
        { name: "Spring Mix", price: "$54", imageIndex: 3 },
        { name: "Luxury Garden", price: "$128", imageIndex: 4 },
        { name: "Daily Bloom", price: "$42", imageIndex: 5 },
      ],
    ],
    collectionLabels: ["Valentine's", "Wedding season", "Everyday blooms"],
    categoryBrowseLabels: ["Bouquets", "Arrangements", "Plants", "Seasonal"],
    sectionOrder: EDITORIAL_SECTIONS,
    sections: {
      promo: true,
      categories: true,
      collections: true,
      showcase: true,
      lifestyle: true,
      story: true,
      imageFeatures: true,
    },
    heroes: ["editorial-split", "fullscreen", "collage", "visual-first"],
    features: ["bento", "grid-2", "staggered"],
    backgrounds: ["photo", "editorial", "soft"],
    typography: ["font-serif font-light tracking-wide", "font-light tracking-[0.08em]"],
    energy: ["editorial", "cinematic", "bold"],
    heroVisual: "fashion-editorial",
    secondaryVisual: "device",
    featureVisual: "onboarding",
    dashboardStats: [
      { label: "Orders today", value: "847", change: "+22%" },
      { label: "Bouquets delivered", value: "2.4k", change: "+18%" },
      { label: "Customer rating", value: "4.9", change: "★★★★★" },
    ],
    defaultMotion: "editorial",
  },

  fashion: {
    id: "fashion",
    label: "Fashion",
    detect: /\b(fashion|style|luxury|beauty|wear|clothing|boutique|apparel|runway|lookbook|designer)\b/i,
    copyTone:
      "Editorial, aspirational, high-fashion. Focus on craft, silhouette, and collection drops. No SaaS or dashboard language.",
    merchMode: "luxury-editorial",
    imageryOnly: true,
    accents: ["#0f0f0f", "#be185d", "#78716c", "#fafaf9"],
    mesh: { from: "#78716c", to: "#be185d" },
    palette: { a: "#1c1917", b: "#78716c", c: "#be185d", accent: "#fafaf9" },
    imagery: {
      hero: [
        "1515886657613-9f3515b0c78f",
        "1483986768404-267d3f66a780",
        "1469334031218-e8a3771781f5",
        "1490481651871-ab68de25d43d",
      ],
      lifestyle: [
        "1469334031218-e8a3771781f5",
        "1483986768404-267d3f66a780",
        "1515886657613-9f3515b0c78f",
        "1490481651871-ab68de25d43d",
      ],
      products: [
        "1515886657613-9f3515b0c78f",
        "1483986768404-267d3f66a780",
        "1469334031218-e8a3771781f5",
        "1490481651871-ab68de25d43d",
        "1515886657613-9f3515b0c78f",
        "1483986768404-267d3f66a780",
      ],
    },
    productSets: [
      [
        { name: "Silk Blazer", price: "$420", imageIndex: 0 },
        { name: "Tailored Trouser", price: "$280", imageIndex: 1 },
        { name: "Leather Tote", price: "$650", imageIndex: 2 },
      ],
      [
        { name: "Evening Gown", price: "$890", imageIndex: 3 },
        { name: "Cashmere Wrap", price: "$340", imageIndex: 4 },
        { name: "Statement Heel", price: "$520", imageIndex: 5 },
      ],
    ],
    collectionLabels: ["New season", "Essentials", "Evening edit"],
    categoryBrowseLabels: ["Ready-to-wear", "Accessories", "Shoes", "Collections"],
    sectionOrder: [
      "collections",
      "showcase",
      "lifestyle",
      "categories",
      "story",
      "features",
      "testimonials",
      "pricing",
      "faq",
      "cta",
    ],
    sections: {
      promo: true,
      categories: true,
      collections: true,
      showcase: true,
      lifestyle: true,
      story: true,
      imageFeatures: true,
    },
    heroes: ["fullscreen", "editorial", "editorial-split", "collage"],
    features: ["bento", "staggered", "grid-2"],
    backgrounds: ["editorial", "photo", "soft"],
    typography: ["font-serif font-light tracking-[0.06em]", "font-light uppercase tracking-[0.2em]"],
    energy: ["editorial", "cinematic", "bold"],
    heroVisual: "fashion-editorial",
    secondaryVisual: "trend-dashboard",
    featureVisual: "device",
    dashboardStats: [
      { label: "Trending styles", value: "128", change: "+14 new" },
      { label: "Lookbook views", value: "94k", change: "+28%" },
      { label: "Conversion", value: "4.8%", change: "+0.6%" },
    ],
    defaultMotion: "editorial",
  },

  creator: {
    id: "creator",
    label: "Creator",
    detect: /\b(creator|video|social|content|youtube|tiktok|influencer|stream|edit|podcast|media studio)\b/i,
    copyTone:
      "Energetic, community-first, platform-native. Focus on audience, content, and monetization — not enterprise SaaS.",
    merchMode: "creator-media",
    imageryOnly: true,
    accents: ["#db2777", "#7c3aed", "#ea580c"],
    mesh: { from: "#db2777", to: "#7c3aed" },
    palette: { a: "#4c0519", b: "#db2777", c: "#7c3aed", accent: "#ea580c" },
    imagery: {
      hero: [
        "1611162616475-9bc9dcdc2a1a",
        "1492691527719-9d1e07256c48",
        "1616530947822-4b676653247e",
        "1574717024650-f8e0d8a4b4f4",
      ],
      lifestyle: [
        "1492691527719-9d1e07256c48",
        "1616530947822-4b676653247e",
        "1611162616475-9bc9dcdc2a1a",
        "1574717024650-f8e0d8a4b4f4",
      ],
      products: [
        "1611162616475-9bc9dcdc2a1a",
        "1492691527719-9d1e07256c48",
        "1616530947822-4b676653247e",
        "1574717024650-f8e0d8a4b4f4",
        "1611162616475-9bc9dcdc2a1a",
        "1492691527719-9d1e07256c48",
      ],
    },
    productSets: [
      [
        { name: "Pro Preset Pack", price: "$29", imageIndex: 0 },
        { name: "Creator Toolkit", price: "$49", imageIndex: 1 },
        { name: "Studio LUTs", price: "$39", imageIndex: 2 },
      ],
      [
        { name: "Analytics Pro", price: "$19/mo", imageIndex: 3 },
        { name: "Edit Suite", price: "$79", imageIndex: 4 },
        { name: "Brand Kit", price: "$99", imageIndex: 5 },
      ],
    ],
    collectionLabels: ["Creator tools", "Preset drops", "Studio essentials"],
    categoryBrowseLabels: ["Presets", "Templates", "Analytics", "Brand kits"],
    sectionOrder: [
      "promo",
      "showcase",
      "lifestyle",
      "features",
      "categories",
      "testimonials",
      "pricing",
      "faq",
      "cta",
    ],
    sections: {
      promo: true,
      categories: true,
      collections: false,
      showcase: true,
      lifestyle: true,
      story: false,
      imageFeatures: true,
    },
    heroes: ["collage", "fullscreen", "cinematic", "visual-first"],
    features: ["bento", "staggered", "grid-2"],
    backgrounds: ["gradient-drift", "aurora", "mesh"],
    typography: ["font-black tracking-tight", "font-bold uppercase"],
    energy: ["bold", "cinematic", "editorial"],
    heroVisual: "creator-timeline",
    secondaryVisual: "creator-analytics",
    featureVisual: "saas-panel",
    dashboardStats: [
      { label: "Total views", value: "1.2M", change: "+34%" },
      { label: "Engagement rate", value: "8.4%", change: "+2.1%" },
      { label: "Revenue", value: "$18.4k", change: "+12%" },
    ],
    defaultMotion: "energetic",
  },

  science: {
    id: "science",
    label: "Science & Space",
    detect: /\b(science|space|research|lab|quantum|astro|frontier|biotech|deep tech|satellite|cosmos|orbit|mission)\b/i,
    copyTone:
      "Cinematic, visionary, atmospheric. Focus on discovery, data, and the frontier — not ecommerce product grids.",
    merchMode: "cinematic-story",
    imageryOnly: true,
    accents: ["#312e81", "#0891b2", "#6366f1"],
    mesh: { from: "#312e81", to: "#0891b2" },
    palette: { a: "#030712", b: "#312e81", c: "#0891b2", accent: "#6366f1" },
    imagery: {
      hero: [
        "1451187583691-34ca1684c9b6",
        "1446776811953-b4dadb1c7639",
        "1614726365727-4a44a21f5f9f",
        "1419243703954-46cb79b55624",
      ],
      lifestyle: [
        "1446776811953-b4dadb1c7639",
        "1614726365727-4a44a21f5f9f",
        "1451187583691-34ca1684c9b6",
        "1419243703954-46cb79b55624",
      ],
      products: [
        "1451187583691-34ca1684c9b6",
        "1446776811953-b4dadb1c7639",
        "1614726365727-4a44a21f5f9f",
        "1419243703954-46cb79b55624",
        "1451187583691-34ca1684c9b6",
        "1446776811953-b4dadb1c7639",
      ],
    },
    productSets: [
      [
        { name: "Lab Suite", price: "$499", imageIndex: 0 },
        { name: "Data Pipeline", price: "$199", imageIndex: 1 },
        { name: "Research API", price: "$999", imageIndex: 2 },
      ],
      [
        { name: "Mission Control", price: "$299", imageIndex: 3 },
        { name: "Analytics Core", price: "$149", imageIndex: 4 },
        { name: "Explorer Pro", price: "$79/mo", imageIndex: 5 },
      ],
    ],
    collectionLabels: ["Mission data", "Research tools", "Explorer tier"],
    categoryBrowseLabels: ["Analytics", "API access", "Mission ops", "Research"],
    sectionOrder: [
      "story",
      "showcase",
      "lifestyle",
      "features",
      "testimonials",
      "pricing",
      "faq",
      "cta",
    ],
    sections: {
      promo: false,
      categories: false,
      collections: false,
      showcase: true,
      lifestyle: true,
      story: true,
      imageFeatures: true,
    },
    heroes: ["fullscreen", "cinematic", "immersive", "collage"],
    features: ["bento", "staggered", "grid-2"],
    backgrounds: ["space", "aurora", "mesh"],
    typography: ["font-light tracking-tight", "font-mono tracking-tight"],
    energy: ["cinematic", "bold", "editorial"],
    heroVisual: "analytics",
    secondaryVisual: "workflow",
    featureVisual: "finance-charts",
    dashboardStats: [
      { label: "Experiments run", value: "2,847", change: "+14%" },
      { label: "Data processed", value: "48TB", change: "+22%" },
      { label: "Accuracy", value: "99.2%", change: "+0.4%" },
    ],
    defaultMotion: "cinematic",
  },

  sports: {
    id: "sports",
    label: "Sports",
    detect: /\b(sport|sports|athlete|team sport|basketball|soccer|coaching)\b/i,
    thumbnailBase: "fullscreen-hero",
    copyTone: "Competitive, team-driven, athletic. Focus on performance, training, and sports culture. Never reference video games or esports.",
    merchMode: "editorial-commerce",
    imageryOnly: true,
    accents: ["#ea580c", "#dc2626", "#2563eb", "#0f172a"],
    mesh: { from: "#fed7aa", to: "#ea580c" },
    palette: { a: "#fff7ed", b: "#ea580c", c: "#2563eb", accent: "#0f172a" },
    imagery: {
      hero: ["1546519638-828a4eca42b7", "1574623452841-47d1422096b9", "1577223533437-68b5977d51b8"],
      lifestyle: ["1511407617-872519128c22", "1461896836932-ffe607005bea", "1574623452841-47d1422096b9"],
      products: ["1546519638-828a4eca42b7", "1574623452841-47d1422096b9", "1511407617-872519128c22"],
    },
    productSets: [[
      { name: "Skills Training Plan", price: "$29/mo", imageIndex: 0 },
      { name: "Pro Drills Pack", price: "$48", imageIndex: 1 },
      { name: "Team Analytics", price: "$79/mo", imageIndex: 2 },
    ]],
    collectionLabels: ["Training", "Team gear", "Performance"],
    categoryBrowseLabels: ["Training", "Gear", "Analytics", "Teams"],
    sectionOrder: EDITORIAL_SECTIONS,
    sections: { promo: true, categories: true, collections: true, showcase: true, lifestyle: true, story: true, imageFeatures: true },
    heroes: ["fullscreen", "editorial-split", "collage", "immersive"],
    features: ["bento", "staggered", "grid-2"],
    backgrounds: ["photo", "gradient-drift", "editorial"],
    typography: ["font-black uppercase tracking-tight", "font-bold tracking-tight"],
    energy: ["bold", "cinematic", "bold"],
    heroVisual: "fitness-tracker",
    secondaryVisual: "health-metrics",
    featureVisual: "onboarding",
    dashboardStats: [
      { label: "Athletes training", value: "18k", change: "+24%" },
      { label: "Sessions logged", value: "420k", change: "+18%" },
      { label: "Team rating", value: "4.9", change: "★★★★★" },
    ],
    defaultMotion: "energetic",
  },

  fitness: {
    id: "fitness",
    label: "Fitness",
    detect: /\b(fitness|workout|gym|exercise|crossfit|strength training|fitness app|personal trainer)\b/i,
    copyTone: "Bold, motivational, performance-driven. Focus on training, recovery, and results.",
    merchMode: "editorial-commerce",
    imageryOnly: true,
    accents: ["#059669", "#10b981", "#0891b2"],
    mesh: { from: "#059669", to: "#0891b2" },
    palette: { a: "#064e3b", b: "#10b981", c: "#0891b2", accent: "#059669" },
    imagery: {
      hero: ["1571019613454-829cb2de8382", "1517836357463-d25dfeac3438", "1534438327276-14e5300c3a48"],
      lifestyle: ["1517836357463-d25dfeac3438", "1534438327276-14e5300c3a48", "1571019613454-829cb2de8382"],
      products: ["1571019613454-829cb2de8382", "1517836357463-d25dfeac3438", "1534438327276-14e5300c3a48"],
    },
    productSets: [
      [
        { name: "Pro Band Set", price: "$49", imageIndex: 0 },
        { name: "Recovery Kit", price: "$79", imageIndex: 1 },
        { name: "Smart Bottle", price: "$39", imageIndex: 2 },
      ],
    ],
    collectionLabels: ["Training gear", "Recovery", "Performance"],
    categoryBrowseLabels: ["Equipment", "Apparel", "Recovery", "Plans"],
    sectionOrder: ["showcase", "lifestyle", "features", "promo", "testimonials", "pricing", "faq", "cta"],
    sections: { promo: true, categories: true, collections: true, showcase: true, lifestyle: true, story: false, imageFeatures: true },
    heroes: ["fullscreen", "immersive", "collage", "asymmetrical"],
    features: ["bento", "staggered", "grid-2"],
    backgrounds: ["gradient-drift", "photo", "aurora"],
    typography: ["font-black uppercase tracking-tight", "font-bold tracking-tight"],
    energy: ["bold", "cinematic", "bold"],
    heroVisual: "fitness-tracker",
    secondaryVisual: "health-metrics",
    featureVisual: "onboarding",
    dashboardStats: [
      { label: "Workouts this week", value: "12", change: "+3" },
      { label: "Calories burned", value: "4.2k", change: "+18%" },
      { label: "Active streak", value: "24d", change: "Personal best" },
    ],
    defaultMotion: "energetic",
  },

  wellness: {
    id: "wellness",
    label: "Wellness",
    detect: /\b(wellness|mindful|meditation|yoga|self-care|calm|spa|holistic|ritual)\b/i,
    copyTone: "Calm, restorative, sensory. Focus on rituals, balance, and wellbeing.",
    merchMode: "editorial-commerce",
    imageryOnly: true,
    accents: ["#0891b2", "#059669", "#a7f3d0"],
    mesh: { from: "#a7f3d0", to: "#0891b2" },
    palette: { a: "#ecfdf5", b: "#a7f3d0", c: "#0891b2", accent: "#059669" },
    imagery: {
      hero: ["1544367567-0f2fcb009e0b", "1506126613408-eca07ce68773", "1512621776951-a57141f2eefd"],
      lifestyle: ["1506126613408-eca07ce68773", "1512621776951-a57141f2eefd", "1544367567-0f2fcb009e0b"],
      products: ["1544367567-0f2fcb009e0b", "1506126613408-eca07ce68773", "1512621776951-a57141f2eefd"],
    },
    productSets: [
      [
        { name: "Calm Kit", price: "$68", imageIndex: 0 },
        { name: "Ritual Set", price: "$94", imageIndex: 1 },
        { name: "Sleep Blend", price: "$42", imageIndex: 2 },
      ],
    ],
    collectionLabels: ["Daily ritual", "Rest & restore", "Mindful living"],
    categoryBrowseLabels: ["Rituals", "Skincare", "Aromatherapy", "Sets"],
    sectionOrder: ["lifestyle", "showcase", "collections", "story", "features", "testimonials", "pricing", "faq", "cta"],
    sections: { promo: false, categories: true, collections: true, showcase: true, lifestyle: true, story: true, imageFeatures: true },
    heroes: ["fullscreen", "immersive", "editorial", "editorial-split"],
    features: ["grid-2", "bento", "staggered"],
    backgrounds: ["photo", "soft", "aurora"],
    typography: ["font-light tracking-wide", "font-serif font-light"],
    energy: ["calm", "editorial", "cinematic"],
    heroVisual: "health-metrics",
    secondaryVisual: "fitness-tracker",
    featureVisual: "onboarding",
    dashboardStats: [
      { label: "Sessions completed", value: "840", change: "+24%" },
      { label: "Calm score", value: "94%", change: "+6%" },
      { label: "Streak", value: "32d", change: "Record" },
    ],
    defaultMotion: "calm",
  },

  health: {
    id: "health",
    label: "Health",
    detect: /\b(health|medical|patient|clinical|hospital|care|diagnos|telehealth|vitals)\b/i,
    copyTone: "Trustworthy, clinical, human-centered. Focus on care outcomes and patient experience.",
    merchMode: "saas-product",
    imageryOnly: false,
    accents: ["#0891b2", "#059669", "#6366f1"],
    mesh: { from: "#0891b2", to: "#6366f1" },
    palette: { a: "#0e7490", b: "#0891b2", c: "#6366f1", accent: "#059669" },
    imagery: {
      hero: ["1576091160399-112ba8d25d1f", "1579684385127-1ef15d508118", "1631217868264-e5b165cc02ba"],
      lifestyle: ["1579684385127-1ef15d508118", "1631217868264-e5b165cc02ba", "1576091160399-112ba8d25d1f"],
      products: ["1576091160399-112ba8d25d1f", "1579684385127-1ef15d508118", "1631217868264-e5b165cc02ba"],
    },
    productSets: [
      [
        { name: "Care Monitor", price: "$199", imageIndex: 0 },
        { name: "Wellness Plan", price: "$49/mo", imageIndex: 1 },
        { name: "Health Kit", price: "$89", imageIndex: 2 },
      ],
    ],
    collectionLabels: ["Patient care", "Monitoring", "Recovery"],
    categoryBrowseLabels: ["Devices", "Plans", "Telehealth", "Kits"],
    sectionOrder: ["features", "showcase", "lifestyle", "testimonials", "pricing", "faq", "cta"],
    sections: { promo: false, categories: false, collections: false, showcase: true, lifestyle: true, story: false, imageFeatures: true },
    heroes: ["immersive", "editorial-split", "fullscreen", "visual-first"],
    features: ["grid-2", "bento", "list"],
    backgrounds: ["soft", "photo", "aurora"],
    typography: ["font-light tracking-wide", "font-medium"],
    energy: ["calm", "editorial", "cinematic"],
    heroVisual: "health-metrics",
    secondaryVisual: "fitness-tracker",
    featureVisual: "onboarding",
    dashboardStats: [
      { label: "Patients monitored", value: "1,240", change: "+8%" },
      { label: "Avg. response", value: "4m", change: "-12%" },
      { label: "Care score", value: "97%", change: "+2%" },
    ],
    defaultMotion: "calm",
  },

  finance: {
    id: "finance",
    label: "Finance",
    detect: /\b(finance|fintech|bank|invest|trading|portfolio|enterprise|accounting|ledger|wealth)\b/i,
    copyTone: "Confident, precise, institutional. Focus on trust, data, and performance.",
    merchMode: "saas-product",
    imageryOnly: false,
    accents: ["#1e40af", "#0f172a", "#0891b2"],
    mesh: { from: "#1e40af", to: "#0f172a" },
    palette: { a: "#0f172a", b: "#1e40af", c: "#334155", accent: "#0891b2" },
    imagery: {
      hero: ["1551288049-bebda4e38f71", "1460925895917-afdab827c52f", "1553729459-efe14ef6055d"],
      lifestyle: ["1460925895917-afdab827c52f", "1553729459-efe14ef6055d", "1551288049-bebda4e38f71"],
      products: ["1551288049-bebda4e38f71", "1460925895917-afdab827c52f", "1553729459-efe14ef6055d"],
    },
    productSets: [
      [
        { name: "Portfolio Pro", price: "$99/mo", imageIndex: 0 },
        { name: "Risk Analytics", price: "$199", imageIndex: 1 },
        { name: "Reports API", price: "$499", imageIndex: 2 },
      ],
    ],
    collectionLabels: ["Wealth", "Analytics", "Enterprise"],
    categoryBrowseLabels: ["Investing", "Reports", "API", "Enterprise"],
    sectionOrder: ["features", "story", "testimonials", "pricing", "faq", "cta"],
    sections: { promo: false, categories: false, collections: false, showcase: false, lifestyle: false, story: true, imageFeatures: false },
    heroes: ["cinematic", "editorial-split", "immersive", "split"],
    features: ["list", "grid-2", "bento"],
    backgrounds: ["mesh", "editorial", "gradient-drift"],
    typography: ["font-light tracking-tight", "font-medium tracking-wide"],
    energy: ["cinematic", "calm", "editorial"],
    heroVisual: "finance-charts",
    secondaryVisual: "analytics",
    featureVisual: "workflow",
    dashboardStats: [
      { label: "Portfolio value", value: "$2.4M", change: "+6.2%" },
      { label: "Risk score", value: "Low", change: "Stable" },
      { label: "Reports generated", value: "847", change: "+22%" },
    ],
    defaultMotion: "cinematic",
  },

  edtech: {
    id: "edtech",
    label: "EdTech",
    detect: /\b(edtech|learn|tutor|education|student|course|school|study|curriculum|classroom)\b/i,
    copyTone: "Encouraging, clear, progress-focused. Focus on learning outcomes and student success.",
    merchMode: "saas-product",
    imageryOnly: false,
    accents: ["#2563eb", "#7c3aed", "#059669"],
    mesh: { from: "#2563eb", to: "#7c3aed" },
    palette: { a: "#1e3a8a", b: "#2563eb", c: "#7c3aed", accent: "#059669" },
    imagery: {
      hero: ["1523240795612-9a054b0db644", "1503676260728-1c00da094a0b", "1434030216411-6b793f109b23"],
      lifestyle: ["1503676260728-1c00da094a0b", "1434030216411-6b793f109b23", "1523240795612-9a054b0db644"],
      products: ["1523240795612-9a054b0db644", "1503676260728-1c00da094a0b", "1434030216411-6b793f109b23"],
    },
    productSets: [
      [
        { name: "Course Bundle", price: "$49", imageIndex: 0 },
        { name: "Study Pro", price: "$19/mo", imageIndex: 1 },
        { name: "Cert Prep", price: "$99", imageIndex: 2 },
      ],
    ],
    collectionLabels: ["Courses", "Certifications", "Study tools"],
    categoryBrowseLabels: ["Courses", "Tutoring", "Certs", "Bundles"],
    sectionOrder: ["features", "showcase", "story", "testimonials", "pricing", "faq", "cta"],
    sections: { promo: false, categories: true, collections: false, showcase: true, lifestyle: false, story: true, imageFeatures: true },
    heroes: ["visual-first", "split", "immersive", "fullscreen"],
    features: ["grid-2", "bento", "staggered"],
    backgrounds: ["soft", "mesh", "gradient-drift"],
    typography: ["font-semibold tracking-tight", "font-bold"],
    energy: ["calm", "bold", "cinematic"],
    heroVisual: "learning-progress",
    secondaryVisual: "onboarding",
    featureVisual: "analytics",
    dashboardStats: [
      { label: "Lessons completed", value: "342", change: "+45" },
      { label: "Study streak", value: "18d", change: "+3d" },
      { label: "Mastery score", value: "92%", change: "+8%" },
    ],
    defaultMotion: "calm",
  },

  productivity: {
    id: "productivity",
    label: "Productivity",
    detect: /\b(productivity|workflow|automation|task|project manage|notion|collab|focus app)\b/i,
    copyTone: "Clear, efficient, team-oriented. Focus on speed, clarity, and getting work done.",
    merchMode: "saas-product",
    imageryOnly: false,
    accents: ["#6366f1", "#2563eb", "#0f172a"],
    mesh: { from: "#6366f1", to: "#0f172a" },
    palette: { a: "#312e81", b: "#6366f1", c: "#0f172a", accent: "#2563eb" },
    imagery: {
      hero: ["1484480974693-677ca27cb38d", "1551434678-e076c223a692", "1498050108023-c5249f4df085"],
      lifestyle: ["1551434678-e076c223a692", "1498050108023-c5249f4df085", "1484480974693-677ca27cb38d"],
      products: ["1484480974693-677ca27cb38d", "1551434678-e076c223a692", "1498050108023-c5249f4df085"],
    },
    productSets: [
      [
        { name: "Focus Pro", price: "$12/mo", imageIndex: 0 },
        { name: "Team Sync", price: "$29", imageIndex: 1 },
        { name: "Automation", price: "$49", imageIndex: 2 },
      ],
    ],
    collectionLabels: ["Focus", "Teams", "Automation"],
    categoryBrowseLabels: ["Personal", "Teams", "Automations", "Enterprise"],
    sectionOrder: ["features", "testimonials", "pricing", "faq", "cta"],
    sections: { promo: false, categories: false, collections: false, showcase: false, lifestyle: false, story: false, imageFeatures: false },
    heroes: ["split", "visual-first", "immersive", "editorial-split"],
    features: ["list", "grid-2", "bento"],
    backgrounds: ["mesh", "soft", "gradient-drift"],
    typography: ["font-medium tracking-tight", "font-semibold"],
    energy: ["calm", "bold", "cinematic"],
    heroVisual: "workflow",
    secondaryVisual: "saas-panel",
    featureVisual: "onboarding",
    dashboardStats: [
      { label: "Tasks completed", value: "18.4k", change: "+8%" },
      { label: "Time saved", value: "340h", change: "+24%" },
      { label: "Team velocity", value: "+31%", change: "This sprint" },
    ],
    defaultMotion: "calm",
  },

  saas: {
    id: "saas",
    label: "SaaS",
    detect: /\b(saas|b2b|platform|software|api|cloud|startup tool|devtools)\b/i,
    copyTone: "Professional, confident, outcome-driven B2B SaaS copy.",
    merchMode: "saas-product",
    imageryOnly: false,
    accents: ["#2563eb", "#7c3aed", "#0891b2"],
    mesh: { from: "#2563eb", to: "#0891b2" },
    palette: { a: "#1e3a8a", b: "#2563eb", c: "#0891b2", accent: "#7c3aed" },
    imagery: {
      hero: ["1551434678-e076c223a692", "1498050108023-c5249f4df085", "1522071820081-009f0129c71c"],
      lifestyle: ["1498050108023-c5249f4df085", "1522071820081-009f0129c71c", "1551434678-e076c223a692"],
      products: ["1551434678-e076c223a692", "1498050108023-c5249f4df085", "1522071820081-009f0129c71c"],
    },
    productSets: [
      [
        { name: "Starter", price: "$29/mo", imageIndex: 0 },
        { name: "Growth", price: "$79/mo", imageIndex: 1 },
        { name: "Enterprise", price: "Custom", imageIndex: 2 },
      ],
    ],
    collectionLabels: ["Starter", "Growth", "Enterprise"],
    categoryBrowseLabels: ["Starter", "Teams", "Enterprise", "API"],
    sectionOrder: ["features", "testimonials", "pricing", "faq", "cta"],
    sections: { promo: false, categories: false, collections: false, showcase: false, lifestyle: false, story: false, imageFeatures: false },
    heroes: ["visual-first", "split", "cinematic", "fullscreen"],
    features: ["bento", "grid-2", "staggered"],
    backgrounds: ["mesh", "gradient-drift", "editorial"],
    typography: ["font-semibold tracking-tight", "font-bold tracking-tight"],
    energy: ["calm", "bold", "cinematic"],
    heroVisual: "saas-panel",
    secondaryVisual: "analytics",
    featureVisual: "workflow",
    dashboardStats: [
      { label: "Active users", value: "2,847", change: "+12%" },
      { label: "MRR", value: "$48k", change: "+9%" },
      { label: "NPS", value: "72", change: "+4" },
    ],
    defaultMotion: "calm",
  },

  ecommerce: {
    id: "ecommerce",
    label: "E-commerce",
    detect: /\b(ecommerce|e-commerce|shop|store|marketplace|merch|product catalog|cart|retail brand)\b/i,
    thumbnailBase: "product-grid",
    copyTone: "Merchandising-forward, lifestyle-driven retail.",
    merchMode: "editorial-commerce",
    imageryOnly: true,
    accents: ["#78716c", "#ea580c", "#0f172a"],
    mesh: { from: "#78716c", to: "#ea580c" },
    palette: { a: "#44403c", b: "#78716c", c: "#ea580c", accent: "#fafaf9" },
    imagery: {
      hero: ["1441986300917-6466bd776357", "1472851294608-062f8241c779", "1523275335684-37898b6baf30"],
      lifestyle: ["1472851294608-062f8241c779", "1523275335684-37898b6baf30", "1441986300917-6466bd776357"],
      products: ["1523275335684-37898b6baf30", "1472851294608-062f8241c779", "1441986300917-6466bd776357"],
    },
    productSets: [[
      { name: "Essential Tee", price: "$48", imageIndex: 0 },
      { name: "Premium Hoodie", price: "$98", imageIndex: 1 },
      { name: "Studio Sneaker", price: "$120", imageIndex: 2 },
    ]],
    collectionLabels: ["New arrivals", "Best sellers", "Limited edit"],
    categoryBrowseLabels: ["New in", "Apparel", "Home", "Accessories"],
    sectionOrder: EDITORIAL_SECTIONS,
    sections: { promo: true, categories: true, collections: true, showcase: true, lifestyle: true, story: true, imageFeatures: true },
    heroes: ["fullscreen", "editorial-split", "product-first", "collage"],
    features: ["bento", "grid-2", "staggered"],
    backgrounds: ["photo", "editorial", "gradient-drift"],
    typography: ["font-serif font-light", "font-light tracking-wide"],
    energy: ["editorial", "bold", "cinematic"],
    heroVisual: "device",
    secondaryVisual: "analytics",
    featureVisual: "saas-panel",
    dashboardStats: [
      { label: "Products sold", value: "12.4k", change: "+18%" },
      { label: "Conversion", value: "4.2%", change: "+0.8%" },
      { label: "Avg. order", value: "$86", change: "+12%" },
    ],
    defaultMotion: "editorial",
  },

  gaming: {
    id: "gaming",
    label: "Gaming",
    detect: /\b(video game|videogame|esports|e-sports|playstation|xbox|nintendo|twitch streamer|fps game|rpg game|game studio)\b/i,
    thumbnailBase: "fullscreen-hero",
    copyTone: "Energetic, competitive, community-driven gaming culture.",
    merchMode: "creator-media",
    imageryOnly: true,
    accents: ["#7c3aed", "#db2777", "#0891b2"],
    mesh: { from: "#4c1d95", to: "#db2777" },
    palette: { a: "#0f0720", b: "#7c3aed", c: "#db2777", accent: "#22d3ee" },
    imagery: {
      hero: ["1542751371-adc38448a05e", "1493711668535-e49d8a12619f", "1511511419751-e720554ff2ec"],
      lifestyle: ["1493711668535-e49d8a12619f", "1511511419751-e720554ff2ec", "1542751371-adc38448a05e"],
      products: ["1511511419751-e720554ff2ec", "1542751371-adc38448a05e", "1493711668535-e49d8a12619f"],
    },
    productSets: [[
      { name: "Pro Controller", price: "$79", imageIndex: 0 },
      { name: "Streamer Kit", price: "$149", imageIndex: 1 },
      { name: "Elite Headset", price: "$129", imageIndex: 2 },
    ]],
    collectionLabels: ["Pro gear", "Streamer setup", "New releases"],
    categoryBrowseLabels: ["Hardware", "Merch", "Subscriptions", "Esports"],
    sectionOrder: ["promo", "showcase", "lifestyle", "features", "testimonials", "pricing", "faq", "cta"],
    sections: { promo: true, categories: true, collections: true, showcase: true, lifestyle: true, story: false, imageFeatures: true },
    heroes: ["fullscreen", "collage", "cinematic", "immersive"],
    features: ["bento", "staggered", "grid-2"],
    backgrounds: ["aurora", "space", "gradient-drift"],
    typography: ["font-black uppercase tracking-tight"],
    energy: ["bold", "cinematic", "bold"],
    heroVisual: "creator-timeline",
    secondaryVisual: "creator-analytics",
    featureVisual: "saas-panel",
    dashboardStats: [
      { label: "Active players", value: "48k", change: "+32%" },
      { label: "Hours played", value: "1.2M", change: "+18%" },
      { label: "Community", value: "9.4k", change: "+24%" },
    ],
    defaultMotion: "energetic",
  },

  music: {
    id: "music",
    label: "Music",
    detect: /\b(music|musician|artist|audio|spotify|studio|concert|festival|vinyl|producer|song|playlist)\b/i,
    thumbnailBase: "fullscreen-hero",
    copyTone: "Expressive, rhythmic, artist-first music culture.",
    merchMode: "creator-media",
    imageryOnly: true,
    accents: ["#db2777", "#7c3aed", "#ea580c"],
    mesh: { from: "#831843", to: "#7c3aed" },
    palette: { a: "#1a0a14", b: "#db2777", c: "#7c3aed", accent: "#fbbf24" },
    imagery: {
      hero: ["1511379936477-cc88bdf6827e", "1493225457124-a3eb161ffa5f", "1516286737714-aa376389d5aa"],
      lifestyle: ["1493225457124-a3eb161ffa5f", "1516286737714-aa376389d5aa", "1511379936477-cc88bdf6827e"],
      products: ["1516286737714-aa376389d5aa", "1511379936477-cc88bdf6827e", "1493225457124-a3eb161ffa5f"],
    },
    productSets: [[
      { name: "Studio Pass", price: "$19/mo", imageIndex: 0 },
      { name: "Vinyl Collection", price: "$48", imageIndex: 1 },
      { name: "Producer Pack", price: "$79", imageIndex: 2 },
    ]],
    collectionLabels: ["New releases", "Live sessions", "Artist merch"],
    categoryBrowseLabels: ["Streaming", "Merch", "Tickets", "Tools"],
    sectionOrder: ["showcase", "lifestyle", "promo", "features", "testimonials", "pricing", "faq", "cta"],
    sections: { promo: true, categories: true, collections: true, showcase: true, lifestyle: true, story: true, imageFeatures: true },
    heroes: ["fullscreen", "collage", "cinematic", "visual-first"],
    features: ["bento", "staggered", "grid-2"],
    backgrounds: ["aurora", "gradient-drift", "space"],
    typography: ["font-black tracking-tight"],
    energy: ["bold", "cinematic", "editorial"],
    heroVisual: "creator-timeline",
    secondaryVisual: "creator-analytics",
    featureVisual: "onboarding",
    dashboardStats: [
      { label: "Listeners", value: "240k", change: "+28%" },
      { label: "Streams", value: "4.2M", change: "+14%" },
      { label: "Artists", value: "1.8k", change: "+42" },
    ],
    defaultMotion: "energetic",
  },

  luxury: {
    id: "luxury",
    label: "Luxury E-commerce",
    detect: /\b(luxury ecommerce|luxury shop|high-end retail|designer shop|premium boutique|luxury brand|haute|artisan luxury)\b/i,
    thumbnailBase: "luxury-editorial",
    copyTone: "Refined, premium, understated opulence.",
    merchMode: "luxury-editorial",
    imageryOnly: true,
    accents: ["#0f0f0f", "#78716c", "#fafaf9"],
    mesh: { from: "#44403c", to: "#78716c" },
    palette: { a: "#fafaf9", b: "#78716c", c: "#a8a29e", accent: "#0f0f0f" },
    imagery: {
      hero: ["1515886657613-9f3515b0c78f", "1483986768404-267d3f66a780", "1490481651871-ab68de25d43d"],
      lifestyle: ["1483986768404-267d3f66a780", "1490481651871-ab68de25d43d", "1515886657613-9f3515b0c78f"],
      products: ["1469334031218-e8a3771781f5", "1483986768404-267d3f66a780", "1515886657613-9f3515b0c78f"],
    },
    productSets: [[
      { name: "Signature Collection", price: "$890", imageIndex: 0 },
      { name: "Artisan Edition", price: "$1,240", imageIndex: 1 },
      { name: "Private Client Box", price: "$2,400", imageIndex: 2 },
    ]],
    collectionLabels: ["Signature", "Limited edition", "Private client"],
    categoryBrowseLabels: ["Collections", "Accessories", "Gifts", "Private"],
    sectionOrder: EDITORIAL_SECTIONS,
    sections: { promo: true, categories: true, collections: true, showcase: true, lifestyle: true, story: true, imageFeatures: true },
    heroes: ["editorial-split", "fullscreen", "editorial", "visual-first"],
    features: ["staggered", "bento", "grid-2"],
    backgrounds: ["editorial", "photo", "soft"],
    typography: ["font-serif font-light tracking-[0.12em]"],
    energy: ["editorial", "cinematic", "calm"],
    heroVisual: "fashion-editorial",
    secondaryVisual: "trend-dashboard",
    featureVisual: "device",
    dashboardStats: [
      { label: "Private clients", value: "840", change: "+12%" },
      { label: "Avg. order", value: "$1.2k", change: "+8%" },
      { label: "Sell-through", value: "94%", change: "+3%" },
    ],
    defaultMotion: "editorial",
  },

  generic: {
    id: "generic",
    label: "Startup",
    detect: /.^/,
    copyTone: "Professional startup copy. Match the product described — avoid unrelated metaphors.",
    merchMode: "saas-product",
    imageryOnly: false,
    accents: ["#2563eb", "#7c3aed", "#0891b2", "#059669"],
    mesh: { from: "#2563eb", to: "#7c3aed" },
    palette: { a: "#1e3a8a", b: "#2563eb", c: "#7c3aed", accent: "#0891b2" },
    imagery: {
      hero: ["1551434678-e076c223a692", "1498050108023-c5249f4df085", "1522071820081-009f0129c71c"],
      lifestyle: ["1498050108023-c5249f4df085", "1522071820081-009f0129c71c", "1551434678-e076c223a692"],
      products: ["1551434678-e076c223a692", "1498050108023-c5249f4df085", "1522071820081-009f0129c71c"],
    },
    productSets: [
      [
        { name: "Starter", price: "$29", imageIndex: 0 },
        { name: "Pro", price: "$79", imageIndex: 1 },
        { name: "Enterprise", price: "$199", imageIndex: 2 },
      ],
    ],
    collectionLabels: ["Starter", "Pro", "Enterprise"],
    categoryBrowseLabels: ["Features", "Pricing", "Teams", "Enterprise"],
    sectionOrder: ["features", "showcase", "testimonials", "pricing", "faq", "cta"],
    sections: { promo: false, categories: false, collections: false, showcase: true, lifestyle: false, story: false, imageFeatures: true },
    heroes: ["visual-first", "editorial-split", "split", "fullscreen"],
    features: ["bento", "grid-2", "staggered"],
    backgrounds: ["mesh", "gradient-drift", "photo"],
    typography: ["font-bold tracking-tight", "font-semibold"],
    energy: ["bold", "cinematic", "editorial"],
    heroVisual: "dashboard",
    secondaryVisual: "analytics",
    featureVisual: "onboarding",
    dashboardStats: [
      { label: "Active users", value: "2,847", change: "+12%" },
      { label: "Tasks completed", value: "18.4k", change: "+8%" },
      { label: "Time saved", value: "340h", change: "+24%" },
    ],
    defaultMotion: "calm",
  },
};

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return Math.abs(h);
}

export function getCategoryWorld(category: ProductCategory): CategoryWorld {
  const w = WORLDS[category] ?? WORLDS.generic;
  const thumbFallbacks: Partial<Record<ProductCategory, ThumbnailBase>> = {
    fashion: "luxury-editorial",
    science: "fullscreen-hero",
    fitness: "fullscreen-hero",
    creator: "fullscreen-hero",
  };
  return {
    ...w,
    allowedImagery: w.allowedImagery ?? ["category lifestyle photography"],
    forbiddenImagery: w.forbiddenImagery ?? ["gym equipment", "random abstract", "unrelated stock photos"],
    thumbnailBase: w.thumbnailBase ?? thumbFallbacks[category] ?? "editorial-commerce",
  };
}

export function getCategoryLabel(category: ProductCategory): string {
  const aliases: Partial<Record<ProductCategory, string>> = {
    finance: "Fintech",
    edtech: "Education",
    food: "Food & Produce",
  };
  return aliases[category] ?? getCategoryWorld(category).label;
}

export function detectProductCategory(brief: StartupBrief): ProductCategory {
  return resolveCategory(brief).primary;
}

export function pickWorldProducts(category: ProductCategory, seed: string): WorldProduct[] {
  const world = getCategoryWorld(category);
  const sets = world.productSets;
  return sets[hashSeed(seed) % sets.length];
}

export function worldImageId(
  category: ProductCategory,
  slot: "hero" | "lifestyle" | "product",
  index: number
): string {
  const pool = getCategoryWorld(category).imagery[slot === "product" ? "products" : slot];
  return pool[index % pool.length];
}

export function worldCopyContext(brief: StartupBrief): string {
  const category = detectProductCategory(brief);
  const world = getCategoryWorld(category);
  const products = pickWorldProducts(category, brief.name).map((p) => p.name).join(", ");
  return `Category world: ${world.label}
Tone: ${world.copyTone}
Merchandising mode: ${world.merchMode}
Allowed imagery themes: ${(world.allowedImagery ?? []).join(", ")}
FORBIDDEN imagery/themes: ${(world.forbiddenImagery ?? []).join(", ")}
Allowed product types ONLY: ${products}
Direction modifies presentation style only — category identity must stay intact.
Do NOT reference unrelated industries, forbidden themes, or generic SaaS dashboards unless this is a SaaS category.`;
}

export function isImageryOnlyCategory(category: ProductCategory): boolean {
  return getCategoryWorld(category).imageryOnly;
}

export function pickFromWorld<T>(arr: T[], seed: string, salt: string): T {
  return arr[hashSeed(`${seed}:${salt}`) % arr.length];
}
