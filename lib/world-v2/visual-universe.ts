/**
 * Visual universes — scene-level retrieval targets, NOT category nouns.
 * Answers: "What visual universe does this startup belong to?"
 */

import type { V2CategoryKey } from "./types";

export type VisualUniverse = {
  category: V2CategoryKey;
  label: string;
  /** Scene-level search phrases — moods, aesthetics, campaigns */
  sceneQueries: string[];
  moods: string[];
  aesthetics: string[];
  compositions: string[];
  lighting: string[];
  /** Tokens that MUST appear in image semantics for category purity */
  purityTokens: string[];
  /** Substrings that disqualify an image from this universe */
  contaminationTokens: string[];
  /** Regex patterns that reject an image outright */
  forbiddenInImage: RegExp[];
  minAcceptScore: number;
};

const GLOBAL_STOCK_REJECT =
  /recipe|blog|meme|clipart|cartoon|watermark|getty|shutterstock|istock|placeholder|mockup only|ecommerce grid|product catalog/i;

const GLOBAL_CONTAMINANTS = [
  "pizza",
  "pasta",
  "cat",
  "kitten",
  "dog",
  "puppy",
  "meme",
  "recipe",
  "blog post",
  "stock photo smile",
  "generic office",
];

export const VISUAL_UNIVERSES: Record<V2CategoryKey, VisualUniverse> = {
  fitness: {
    category: "fitness",
    label: "Athletic performance universe",
    sceneQueries: [
      "cinematic athlete training editorial",
      "high contrast gym photography",
      "luxury performance branding",
      "kinetic sports campaign",
      "premium athletic motion photography",
      "dramatic gym lighting",
      "strength culture aesthetic",
    ],
    moods: ["kinetic", "intense", "determined", "powerful"],
    aesthetics: ["campaign", "editorial", "performance", "athletic"],
    compositions: ["dynamic", "full-body", "environmental", "macro-detail"],
    lighting: ["dramatic", "rim-light", "high-contrast", "moody-gym"],
    purityTokens: ["athlete", "training", "gym", "workout", "fitness", "sport", "performance", "court", "arena"],
    contaminationTokens: ["fruit", "flower", "bouquet", "produce", "pizza", "food blog", "recipe", "cat", "finance dashboard"],
    forbiddenInImage: [/fruit|berry|citrus|bouquet|floral|pizza|pasta|recipe/i, GLOBAL_STOCK_REJECT],
    minAcceptScore: 52,
  },
  floral: {
    category: "floral",
    label: "Botanical luxury universe",
    sceneQueries: [
      "luxury floral editorial",
      "botanical still life",
      "soft organic composition",
      "elegant floral campaign photography",
      "premium botanical branding",
      "airy floral studio photography",
    ],
    moods: ["romantic", "organic", "elegant", "soft"],
    aesthetics: ["editorial", "botanical", "luxury", "still-life"],
    compositions: ["centered", "macro-petal", "studio-flat", "environmental-garden"],
    lighting: ["soft-diffused", "golden-hour", "studio-clean", "airy"],
    purityTokens: ["floral", "flower", "botanical", "bouquet", "bloom", "petal", "rose", "peony", "garden"],
    contaminationTokens: ["gym", "workout", "athlete", "pizza", "dashboard", "gym equipment", "fruit crate"],
    forbiddenInImage: [/gym|workout|athlete|pizza|dashboard|analytics|barbell/i, GLOBAL_STOCK_REJECT],
    minAcceptScore: 50,
  },
  finance: {
    category: "finance",
    label: "Intelligent fintech universe",
    sceneQueries: [
      "premium fintech dashboard aesthetic",
      "modern financial editorial",
      "intelligent workspace atmosphere",
      "executive clarity branding",
      "high-end SaaS campaign visuals",
      "data-driven premium workspace",
    ],
    moods: ["confident", "precise", "calm", "authoritative"],
    aesthetics: ["fintech", "executive", "minimal", "data-forward"],
    compositions: ["ui-forward", "workspace-wide", "detail-macro", "environmental"],
    lighting: ["clean", "cool-tone", "soft-office", "screen-glow"],
    purityTokens: ["finance", "financial", "dashboard", "data", "workspace", "analytics", "fintech", "chart", "metrics"],
    contaminationTokens: ["fruit", "flower", "gym", "athlete", "pizza", "recipe", "workout"],
    forbiddenInImage: [/fruit|flower|gym|workout|athlete|pizza|recipe|smoothie/i, GLOBAL_STOCK_REJECT],
    minAcceptScore: 50,
  },
  fashion: {
    category: "fashion",
    label: "Editorial fashion universe",
    sceneQueries: [
      "luxury fashion campaign editorial",
      "runway-inspired studio photography",
      "high fashion lookbook aesthetic",
      "premium apparel branding",
      "editorial portrait fashion",
      "streetwear campaign energy",
    ],
    moods: ["desire", "bold", "editorial", "confident"],
    aesthetics: ["couture", "lookbook", "campaign", "runway"],
    compositions: ["full-bleed", "portrait", "detail-textile", "street-dynamic"],
    lighting: ["studio-drama", "natural-editorial", "high-contrast"],
    purityTokens: ["fashion", "editorial", "runway", "apparel", "garment", "lookbook", "streetwear", "fabric"],
    contaminationTokens: ["fruit", "gym", "dashboard", "pizza", "recipe", "produce"],
    forbiddenInImage: [/fruit|produce|pizza|recipe|gym equipment/i, GLOBAL_STOCK_REJECT],
    minAcceptScore: 48,
  },
  food: {
    category: "food",
    label: "Culinary editorial universe",
    sceneQueries: [
      "premium food editorial photography",
      "farm-to-table campaign aesthetic",
      "sunlit produce still life",
      "chef-quality plating editorial",
      "artisan harvest branding",
      "gourmet market atmosphere",
    ],
    moods: ["appetizing", "fresh", "warm", "artisan"],
    aesthetics: ["culinary", "editorial", "farm-fresh", "still-life"],
    compositions: ["overhead-flat", "macro-ingredient", "market-environment"],
    lighting: ["natural-window", "golden-hour", "soft-studio"],
    purityTokens: ["produce", "fruit", "harvest", "farm", "food", "citrus", "market", "fresh", "culinary"],
    contaminationTokens: ["gym", "dashboard", "athlete", "bouquet", "finance"],
    forbiddenInImage: [/gym|workout|dashboard|analytics|bouquet only/i, GLOBAL_STOCK_REJECT],
    minAcceptScore: 48,
  },
  saas: {
    category: "saas",
    label: "Premium product launch universe",
    sceneQueries: [
      "premium SaaS product campaign",
      "modern startup launch aesthetic",
      "intelligent workspace editorial",
      "high-end software branding",
      "Apple-like product confidence",
      "agency-grade tech campaign",
    ],
    moods: ["confident", "clean", "innovative", "precise"],
    aesthetics: ["product-forward", "minimal", "campaign", "tech-editorial"],
    compositions: ["ui-hero", "workspace-context", "team-collaboration"],
    lighting: ["bright-clean", "soft-gradient", "screen-accent"],
    purityTokens: ["product", "dashboard", "workspace", "software", "saas", "team", "analytics", "interface", "tech"],
    contaminationTokens: ["fruit", "flower", "pizza", "gym", "recipe", "produce stand"],
    forbiddenInImage: [/fruit stand|bouquet|pizza|recipe blog|gym/i, GLOBAL_STOCK_REJECT],
    minAcceptScore: 48,
  },
  wellness: {
    category: "wellness",
    label: "Calm sanctuary universe",
    sceneQueries: [
      "wellness retreat editorial",
      "soft mindfulness campaign",
      "spa sanctuary atmosphere",
      "organic calm branding",
      "meditation landscape aesthetic",
      "premium wellness studio",
    ],
    moods: ["calm", "still", "organic", "restorative"],
    aesthetics: ["sanctuary", "editorial", "soft", "natural"],
    compositions: ["wide-landscape", "intimate-portrait", "ambient-texture"],
    lighting: ["soft-diffused", "dawn", "dusk", "natural"],
    purityTokens: ["wellness", "meditation", "spa", "calm", "yoga", "retreat", "mindfulness", "nature"],
    contaminationTokens: ["dashboard", "pizza", "gym intensity", "finance", "ecommerce"],
    forbiddenInImage: [/pizza|dashboard|barbell|stock ticker/i, GLOBAL_STOCK_REJECT],
    minAcceptScore: 46,
  },
  sports: {
    category: "sports",
    label: "Arena intelligence universe",
    sceneQueries: [
      "arena cinematic atmosphere",
      "sports analytics campaign",
      "game night editorial energy",
      "premium athletics branding",
      "stadium drama photography",
      "competitive performance aesthetic",
    ],
    moods: ["electric", "competitive", "intense", "strategic"],
    aesthetics: ["arena", "campaign", "analytics", "editorial"],
    compositions: ["wide-arena", "action-crop", "data-overlay-friendly"],
    lighting: ["arena-spotlight", "dramatic", "high-contrast"],
    purityTokens: ["arena", "court", "sport", "athletic", "game", "stadium", "analytics", "team"],
    contaminationTokens: ["fruit", "flower", "pizza", "recipe", "bouquet"],
    forbiddenInImage: [/fruit|bouquet|pizza|recipe/i, GLOBAL_STOCK_REJECT],
    minAcceptScore: 50,
  },
  travel: {
    category: "travel",
    label: "Departure desire universe",
    sceneQueries: [
      "luxury travel campaign editorial",
      "wanderlust landscape cinematic",
      "premium destination branding",
      "adventure expedition aesthetic",
      "golden hour journey photography",
      "hospitality editorial atmosphere",
    ],
    moods: ["wanderlust", "expansive", "luxurious", "adventurous"],
    aesthetics: ["cinematic", "editorial", "destination", "campaign"],
    compositions: ["landscape-wide", "window-view", "environmental"],
    lighting: ["golden-hour", "blue-hour", "natural-cinematic"],
    purityTokens: ["travel", "destination", "landscape", "journey", "adventure", "horizon", "vista"],
    contaminationTokens: ["dashboard", "gym", "pizza", "office stock"],
    forbiddenInImage: [/office cubicle|dashboard ui|pizza/i, GLOBAL_STOCK_REJECT],
    minAcceptScore: 46,
  },
  home: {
    category: "home",
    label: "Lived-in editorial interior universe",
    sceneQueries: [
      "interior design editorial campaign",
      "premium home living aesthetic",
      "warm residential atmosphere",
      "furniture lookbook photography",
      "modern living space branding",
      "cozy editorial interior",
    ],
    moods: ["warm", "lived-in", "refined", "inviting"],
    aesthetics: ["interior", "editorial", "residential", "lookbook"],
    compositions: ["wide-room", "detail-textile", "corner-vignette"],
    lighting: ["window-light", "tungsten-warm", "soft-natural"],
    purityTokens: ["interior", "living", "home", "furniture", "room", "decor", "residential"],
    contaminationTokens: ["gym", "fruit stand", "dashboard", "pizza"],
    forbiddenInImage: [/gym|fruit market|dashboard/i, GLOBAL_STOCK_REJECT],
    minAcceptScore: 46,
  },
  education: {
    category: "education",
    label: "Discovery learning universe",
    sceneQueries: [
      "premium education campaign",
      "focused learning editorial",
      "modern campus atmosphere",
      "knowledge discovery aesthetic",
      "student success branding",
      "intellectual workspace photography",
    ],
    moods: ["curious", "focused", "optimistic", "clear"],
    aesthetics: ["editorial", "academic", "modern", "campaign"],
    compositions: ["study-environment", "campus-wide", "desk-detail"],
    lighting: ["natural-desk", "library-soft", "bright-clean"],
    purityTokens: ["learn", "student", "education", "study", "campus", "knowledge", "workspace"],
    contaminationTokens: ["pizza", "gym", "fruit", "ecommerce"],
    forbiddenInImage: [/pizza|gym equipment|produce/i, GLOBAL_STOCK_REJECT],
    minAcceptScore: 46,
  },
  health: {
    category: "health",
    label: "Human care universe",
    sceneQueries: [
      "premium healthcare editorial",
      "compassionate clinical atmosphere",
      "medical technology campaign",
      "trust-building care aesthetic",
      "dignified wellness branding",
      "human-centered health photography",
    ],
    moods: ["trustworthy", "calm", "human", "professional"],
    aesthetics: ["clinical", "editorial", "care", "premium"],
    compositions: ["environmental-clinic", "intimate-care", "tech-detail"],
    lighting: ["soft-clinical", "warm-reassuring", "clean"],
    purityTokens: ["health", "medical", "care", "clinical", "patient", "wellness", "healing"],
    contaminationTokens: ["pizza", "gym marketing", "fruit", "fashion runway"],
    forbiddenInImage: [/pizza|fruit stand|runway/i, GLOBAL_STOCK_REJECT],
    minAcceptScore: 46,
  },
  creator: {
    category: "creator",
    label: "Creator studio universe",
    sceneQueries: [
      "creator studio campaign aesthetic",
      "content creation editorial",
      "premium influencer workspace",
      "social-native branding photography",
      "ring-light studio atmosphere",
      "creative entrepreneur campaign",
    ],
    moods: ["creative", "energetic", "authentic", "social"],
    aesthetics: ["studio", "creator", "campaign", "workspace"],
    compositions: ["desk-setup", "creator-portrait", "multi-screen"],
    lighting: ["ring-light", "window-mixed", "warm-led"],
    purityTokens: ["creator", "studio", "content", "workspace", "creative", "stream", "setup"],
    contaminationTokens: ["fruit", "pizza", "bouquet", "gym"],
    forbiddenInImage: [/fruit|bouquet|pizza/i, GLOBAL_STOCK_REJECT],
    minAcceptScore: 46,
  },
  music: {
    category: "music",
    label: "Live music and sound universe",
    sceneQueries: [
      "cinematic concert hall drama",
      "dark stage performance editorial",
      "music studio atmospheric",
      "festival crowd energy aerial",
      "premium audio culture branding",
      "underground venue intimate light",
    ],
    moods: ["electric", "immersive", "theatrical", "soulful"],
    aesthetics: ["concert", "editorial", "stage", "studio"],
    compositions: ["wide-venue", "performer-portrait", "crowd-aerial", "detail-instrument"],
    lighting: ["stage-spotlight", "concert-purple", "studio-warm", "neon-dramatic"],
    purityTokens: ["music", "concert", "stage", "audio", "band", "performance", "studio", "sound"],
    contaminationTokens: ["fruit", "pizza", "gym", "dashboard", "recipe", "produce"],
    forbiddenInImage: [/fruit|pizza|recipe|gym|dashboard/i, GLOBAL_STOCK_REJECT],
    minAcceptScore: 46,
  },
  science: {
    category: "science",
    label: "Scientific discovery universe",
    sceneQueries: [
      "space exploration cinematic editorial",
      "precision laboratory atmosphere",
      "scientific discovery branding",
      "deep space photography campaign",
      "clean room technology aesthetic",
      "research frontier photography",
    ],
    moods: ["wonder", "precise", "expansive", "pioneering"],
    aesthetics: ["scientific", "cinematic", "precision", "editorial"],
    compositions: ["landscape-space", "lab-detail", "wide-environment", "data-visualization"],
    lighting: ["deep-space-dark", "lab-fluorescent", "screen-glow", "dramatic-backlit"],
    purityTokens: ["science", "space", "lab", "research", "satellite", "telescope", "discovery", "data"],
    contaminationTokens: ["fruit", "pizza", "gym", "fashion", "recipe"],
    forbiddenInImage: [/fruit|pizza|recipe|gym|bouquet/i, GLOBAL_STOCK_REJECT],
    minAcceptScore: 46,
  },
};

export function getVisualUniverse(category: V2CategoryKey): VisualUniverse {
  return VISUAL_UNIVERSES[category];
}

/** Reject if brief suggests wrong universe contamination */
export function briefMatchesUniverse(briefText: string, universe: VisualUniverse): boolean {
  const lower = briefText.toLowerCase();
  return universe.purityTokens.some((t) => lower.includes(t)) || universe.sceneQueries.length > 0;
}

export { GLOBAL_CONTAMINANTS };
