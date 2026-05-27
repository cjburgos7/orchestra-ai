import { buildUnsplashUrl } from "@/lib/curated-stock-photos";
import type {
  CategorizedImage,
  CategoryImageRegistry,
  ImageOrientation,
  ImageRole,
  RegistryId,
} from "./image-types";
import type { CategoryResolution } from "@/lib/orchestration/category-resolution";
import type { StartupBrief } from "@/lib/types/startup";
import { resolveWorldDNA } from "@/lib/orchestration/world-dna";

type ImageDef = {
  id: string;
  role: ImageRole;
  tags: string[];
  orientation: ImageOrientation;
  mood: string[];
  dominantColor?: string;
  composition?: string;
  w?: number;
  h?: number;
};

function defineImage(category: string, def: ImageDef): CategorizedImage {
  const w = def.w ?? (def.role === "hero" ? 1600 : def.role === "product" ? 800 : 1200);
  const h =
    def.h ??
    (def.role === "hero" ? 900 : def.role === "product" ? 1000 : def.orientation === "portrait" ? 1400 : 800);

  return {
    id: def.id,
    url: buildUnsplashUrl(def.id, w, h),
    category,
    role: def.role,
    tags: def.tags,
    orientation: def.orientation,
    mood: def.mood,
    source: "curated-unsplash",
    dominantColor: def.dominantColor,
    composition: def.composition,
  };
}

function buildRegistry(category: string, defs: ImageDef[]): CategoryImageRegistry {
  const registry: CategoryImageRegistry = {
    hero: [],
    product: [],
    editorial: [],
    ambient: [],
    macro: [],
    background: [],
    lifestyle: [],
    motion: [],
    texture: [],
  };

  for (const def of defs) {
    const pool = registry[def.role as keyof CategoryImageRegistry];
    if (pool) pool.push(defineImage(category, def));
  }

  return registry;
}

/** Fruit-native dataset — HTTP-verified Unsplash IDs only (May 2026 probe) */
export const FRUIT_REGISTRY: CategoryImageRegistry = buildRegistry("fruit", [
  { id: "1732959409019-b5979266d02d", role: "hero", tags: ["oranges", "citrus", "market baskets"], orientation: "landscape", mood: ["warm", "cinematic"], dominantColor: "ea580c", composition: "wide" },
  { id: "1498579397066-22750a3cb424", role: "hero", tags: ["produce stand", "market", "harvest"], orientation: "landscape", mood: ["vibrant", "fresh"], dominantColor: "65a30d", composition: "wide" },
  { id: "1565299624946-b28f40a0ae38", role: "hero", tags: ["produce", "fruit assortment", "farm"], orientation: "landscape", mood: ["golden", "seasonal"], dominantColor: "ca8a04", composition: "wide" },
  { id: "1487376480913-24046456a727", role: "hero", tags: ["citrus", "flat lay", "produce"], orientation: "landscape", mood: ["editorial", "colorful"], dominantColor: "facc15", composition: "wide" },
  { id: "1560761098-21f5722ecb14", role: "hero", tags: ["fruit display", "market", "colorful"], orientation: "landscape", mood: ["vivid", "fresh"], dominantColor: "dc2626", composition: "wide" },
  { id: "1628689469838-524a4a973b8e", role: "product", tags: ["fruit basket", "assortment", "crate"], orientation: "portrait", mood: ["premium", "clean"], dominantColor: "92400e", composition: "tight" },
  { id: "1619566636858-adf3ef46400b", role: "product", tags: ["apples", "produce basket", "farm box"], orientation: "square", mood: ["colorful", "product"], dominantColor: "84cc16", composition: "tight" },
  { id: "1518791841217-8f162f1e1131", role: "product", tags: ["fruit box", "packaging", "subscription box"], orientation: "portrait", mood: ["fresh", "healthy"], dominantColor: "15803d", composition: "tight" },
  { id: "1416879595882-3373a0480b5b", role: "product", tags: ["berries", "produce", "packaging"], orientation: "portrait", mood: ["bright", "product"], dominantColor: "b91c1c", composition: "tight" },
  { id: "1658431618300-a69b07fb5782", role: "product", tags: ["fruit plate", "assortment", "produce"], orientation: "portrait", mood: ["premium", "clean"], dominantColor: "fde047", composition: "tight" },
  { id: "1464965911861-746a04b4bca6", role: "macro", tags: ["strawberry", "berries", "macro"], orientation: "square", mood: ["intimate", "vivid"], dominantColor: "b91c1c", composition: "detail" },
  { id: "1512621776951-a57141f2eefd", role: "macro", tags: ["citrus", "orange", "slice"], orientation: "square", mood: ["bright", "juicy"], dominantColor: "f97316", composition: "detail" },
  { id: "1558618666-fcd25c85cd64", role: "macro", tags: ["apple", "harvest", "macro"], orientation: "portrait", mood: ["rustic", "natural"], dominantColor: "84cc16", composition: "detail" },
  { id: "1610832958506-aa56368176cf", role: "macro", tags: ["citrus", "oranges", "macro"], orientation: "square", mood: ["rich", "detail"], dominantColor: "ea580c", composition: "detail" },
  { id: "1631209121750-a9f656d28f46", role: "macro", tags: ["grapes", "banana", "macro"], orientation: "square", mood: ["vivid", "fresh"], dominantColor: "7c3aed", composition: "detail" },
  { id: "1511546865855-fe4788edf4b6", role: "editorial", tags: ["produce flat lay", "assortment", "farm"], orientation: "landscape", mood: ["editorial", "colorful"], dominantColor: "facc15", composition: "wide" },
  { id: "1535227798054-e4373ef3795a", role: "editorial", tags: ["fruit slices", "produce", "editorial"], orientation: "landscape", mood: ["editorial", "fresh"], dominantColor: "f97316", composition: "wide" },
  { id: "1542838132-92c53300491e", role: "lifestyle", tags: ["fruit bowl", "breakfast", "morning"], orientation: "landscape", mood: ["calm", "wellness"], dominantColor: "fef3c7", composition: "wide" },
  { id: "1580691155297-c6dfa3ca61c4", role: "lifestyle", tags: ["berries", "strawberries", "wellness"], orientation: "portrait", mood: ["bright", "healthy"], dominantColor: "86efac", composition: "tight" },
  { id: "1517260739337-6799d239ce83", role: "lifestyle", tags: ["sliced fruit", "breakfast", "table"], orientation: "landscape", mood: ["calm", "wellness"], dominantColor: "fde68a", composition: "wide" },
  { id: "1665589048355-579bc80169d1", role: "lifestyle", tags: ["fruit plate", "wellness", "morning"], orientation: "portrait", mood: ["bright", "healthy"], dominantColor: "fca5a5", composition: "tight" },
  { id: "1552053831-71594a27632d", role: "lifestyle", tags: ["produce spread", "table", "colorful"], orientation: "landscape", mood: ["editorial", "warm"], dominantColor: "fde68a", composition: "wide" },
  { id: "1635774855717-0aec182f92cc", role: "ambient", tags: ["produce basket", "market", "ambient"], orientation: "landscape", mood: ["atmospheric", "soft"], dominantColor: "fde68a", composition: "wide" },
  { id: "1641642399576-487909d0ddbc", role: "ambient", tags: ["cut fruit", "produce", "ambient"], orientation: "landscape", mood: ["cinematic", "dreamy"], dominantColor: "fdba74", composition: "wide" },
]);

/** Basketball analytics dataset */
export const BASKETBALL_ANALYTICS_REGISTRY: CategoryImageRegistry = buildRegistry("basketball-analytics", [
  { id: "1574623452841-47d1422096b9", role: "hero", tags: ["basketball court", "arena", "overhead"], orientation: "landscape", mood: ["cinematic", "dramatic"], dominantColor: "ea580c", composition: "wide" },
  { id: "1546519638-828a4eca42b7", role: "hero", tags: ["basketball", "player", "action"], orientation: "landscape", mood: ["kinetic", "competitive"], dominantColor: "1e3a5f", composition: "wide" },
  { id: "1511407617-872519128c22", role: "hero", tags: ["court", "hardwood", "arena lights"], orientation: "landscape", mood: ["moody", "cinematic"], dominantColor: "0f172a", composition: "wide" },
  { id: "1571019613454-1cb2f99b2d8b", role: "product", tags: ["analytics", "stats", "dashboard"], orientation: "landscape", mood: ["tech", "data"], dominantColor: "2563eb", composition: "tight" },
  { id: "1517841905240-472988babdf9", role: "product", tags: ["player tracking", "performance"], orientation: "portrait", mood: ["focused", "athletic"], dominantColor: "dc2626", composition: "tight" },
  { id: "1472099645785-5658abf4ff4e", role: "product", tags: ["team", "coaching", "sideline"], orientation: "landscape", mood: ["strategic", "team"], dominantColor: "334155", composition: "wide" },
  { id: "1461896836932-ffe607005bea", role: "editorial", tags: ["arena", "game night", "atmosphere"], orientation: "landscape", mood: ["electric", "editorial"], dominantColor: "f59e0b", composition: "wide" },
  { id: "1577223533437-68b5977d51b8", role: "editorial", tags: ["scoreboard", "arena", "broadcast"], orientation: "landscape", mood: ["dramatic", "cinematic"], dominantColor: "1e40af", composition: "wide" },
  { id: "1571909809596-4117b7f4465e", role: "macro", tags: ["basketball", "leather", "texture"], orientation: "square", mood: ["tactile", "macro"], dominantColor: "ea580c", composition: "detail" },
  { id: "1551958219-ac7e8c2a0a0a", role: "macro", tags: ["sneakers", "court", "detail"], orientation: "portrait", mood: ["kinetic", "sharp"], dominantColor: "ef4444", composition: "detail" },
  { id: "1552674020-e9e9edfa3e0e", role: "lifestyle", tags: ["training", "athlete", "practice"], orientation: "landscape", mood: ["determined", "grit"], dominantColor: "64748b", composition: "wide" },
  { id: "1576678926808-4b39654d5990", role: "lifestyle", tags: ["team huddle", "locker room"], orientation: "landscape", mood: ["intense", "team"], dominantColor: "0f172a", composition: "wide" },
  { id: "1519861536420-5b1504f5a0a5", role: "ambient", tags: ["arena blur", "lights", "bokeh"], orientation: "landscape", mood: ["atmospheric", "dark"], dominantColor: "312e81", composition: "wide" },
  { id: "1459860784380-1d1bb626a9f9", role: "ambient", tags: ["court lines", "hardwood texture"], orientation: "landscape", mood: ["minimal", "moody"], dominantColor: "92400e", composition: "wide" },
]);

export const SPORTS_ATHLETICS_REGISTRY: CategoryImageRegistry = buildRegistry("sports-athletics", [
  { id: "1571019613454-1cb2f99b2d8b", role: "hero", tags: ["athlete", "training"], orientation: "landscape", mood: ["bold"], dominantColor: "2563eb", composition: "wide" },
  { id: "1517841905240-472988babdf9", role: "product", tags: ["gear", "training"], orientation: "portrait", mood: ["product"], dominantColor: "dc2626", composition: "tight" },
  { id: "1472099645785-5658abf4ff4e", role: "product", tags: ["team", "performance"], orientation: "landscape", mood: ["team"], dominantColor: "334155", composition: "wide" },
  { id: "1546519638-828a4eca42b7", role: "editorial", tags: ["basketball", "game"], orientation: "landscape", mood: ["dynamic"], dominantColor: "1e3a5f", composition: "wide" },
  { id: "1574623452841-47d1422096b9", role: "lifestyle", tags: ["court", "arena"], orientation: "landscape", mood: ["cinematic"], dominantColor: "ea580c", composition: "wide" },
  { id: "1511407617-872519128c22", role: "ambient", tags: ["court", "ambient"], orientation: "landscape", mood: ["moody"], dominantColor: "0f172a", composition: "wide" },
]);

export const PETS_REGISTRY: CategoryImageRegistry = buildRegistry("pets", [
  { id: "158730019-474c3a6a2f5a", role: "hero", tags: ["dog", "pet"], orientation: "landscape", mood: ["warm"], dominantColor: "d97706", composition: "wide" },
  { id: "1548199973-03cce0cbc710", role: "product", tags: ["pet toy", "accessory"], orientation: "square", mood: ["playful"], dominantColor: "f59e0b", composition: "tight" },
  { id: "1516738901171-8eb4fc13bd20", role: "product", tags: ["collar", "product"], orientation: "portrait", mood: ["clean"], dominantColor: "78716c", composition: "tight" },
  { id: "1530284520547-3ffa630fa651", role: "editorial", tags: ["pet owner", "park"], orientation: "landscape", mood: ["editorial"], dominantColor: "fef3c7", composition: "wide" },
  { id: "1450778869180-41d6031a2b0c", role: "lifestyle", tags: ["cat", "cozy"], orientation: "landscape", mood: ["calm"], dominantColor: "92400e", composition: "wide" },
  { id: "1583512603405-09989976d522", role: "macro", tags: ["pet fur", "macro"], orientation: "square", mood: ["intimate"], dominantColor: "a8a29e", composition: "detail" },
]);

const REGISTRIES: Record<RegistryId, CategoryImageRegistry> = {
  fruit: FRUIT_REGISTRY,
  "basketball-analytics": BASKETBALL_ANALYTICS_REGISTRY,
  "sports-athletics": SPORTS_ATHLETICS_REGISTRY,
  pets: PETS_REGISTRY,
};

function isAnalyticsBrief(text: string): boolean {
  return /\b(analytics|heatmap|scouting|stats|dashboard|player tracking|shot chart|AI coaching)\b/i.test(text);
}

function briefText(brief: StartupBrief): string {
  return [brief.name, brief.tagline, brief.description, brief.startupCategory, ...(brief.features ?? [])]
    .filter(Boolean)
    .join(" ");
}

export function resolveRegistryId(brief: StartupBrief, resolution: CategoryResolution): RegistryId {
  const text = briefText(brief);
  const dna = resolveWorldDNA(brief, resolution);

  if (dna.id.includes("basketball") || (resolution.secondary === "basketball" && isAnalyticsBrief(text))) {
    return "basketball-analytics";
  }
  if (resolution.primary === "sports" && isAnalyticsBrief(text)) {
    return "basketball-analytics";
  }
  if (
    resolution.primary === "food" ||
    resolution.secondary === "fruit" ||
    resolution.secondary === "produce" ||
    /\b(fruit|orchard|produce|farm box|subscription box)\b/i.test(text)
  ) {
    return "fruit";
  }
  if (resolution.primary === "pets" || resolution.secondary === "dogs" || resolution.secondary === "cats") {
    return "pets";
  }
  if (resolution.primary === "sports" || resolution.secondary === "basketball" || resolution.secondary === "soccer") {
    return "sports-athletics";
  }
  return "fruit";
}

export function getCategoryRegistry(id: RegistryId): CategoryImageRegistry {
  return REGISTRIES[id];
}

export function getImagesForRole(registry: CategoryImageRegistry, role: ImageRole): CategorizedImage[] {
  if (role === "hero") return registry.hero;
  if (role === "product") return registry.product;
  if (role === "editorial") return registry.editorial;
  if (role === "ambient") return registry.ambient;
  if (role === "macro") return registry.macro;
  if (role === "background") return registry.background;
  if (role === "lifestyle") return registry.lifestyle;
  if (role === "motion") return registry.motion;
  return registry.texture;
}

export function allRegistryImages(registry: CategoryImageRegistry): CategorizedImage[] {
  return [
    ...registry.hero,
    ...registry.product,
    ...registry.editorial,
    ...registry.ambient,
    ...registry.macro,
    ...registry.background,
    ...registry.lifestyle,
    ...registry.motion,
    ...registry.texture,
  ];
}
