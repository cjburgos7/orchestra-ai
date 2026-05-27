/**
 * world-intelligence.ts
 *
 * The Startup World Intelligence layer for Orchestra AI.
 *
 * This is NOT a template system. It is a world simulation spec.
 * Every generated startup has a WorldDNA that locks:
 *   - category semantic field (what things ARE in this world)
 *   - imagery vocabulary (what CAN be shown, with whitelist/blacklist)
 *   - atmosphere physics (how the world FEELS)
 *   - identity propagation rules (how the brand coherence spreads)
 *   - direction-aware composition (how each visual direction renders the world)
 *   - semantic scoring (how to rank every media candidate)
 *
 * The key rule: NOTHING is generic. Every field is category-native.
 */

// ─── CORE TYPES ───────────────────────────────────────────────────────────────

export type CategoryKey =
  | "fresh-produce"
  | "sports-analytics"
  | "fashion-apparel"
  | "creator-tools"
  | "wellness-mindfulness"
  | "food-beverage"
  | "software-saas"
  | "finance-fintech"
  | "health-medical"
  | "education-learning"
  | "home-living"
  | "travel-experience";

export type DirectionKey =
  | "premium-dark"
  | "minimal-clean"
  | "bold-experimental"
  | "luxury-editorial"
  | "genz-vibrant"
  | "orchestra-style";

export type SlotRole =
  | "hero-atmosphere"   // sets the world — dominates full viewport
  | "hero-focal"        // the single subject of the hero
  | "feature-card"      // product/feature illustration
  | "ambient-texture"   // background texture/environment
  | "social-proof"      // human context / lifestyle
  | "product-hero"      // isolated product against clean bg
  | "editorial-spread"  // large format editorial image

// ─── SEMANTIC FIELD ───────────────────────────────────────────────────────────
// What things ARE in this startup's world.
// Used for query construction AND for scoring incoming media.

interface SemanticField {
  // Concrete subjects — must be literally photographable
  primarySubjects: string[];     // exactly these things, specific nouns
  secondarySubjects: string[];   // supporting world elements
  ambientElements: string[];     // environmental/textural elements

  // Hard blocklist — these should NEVER appear regardless of query results
  // This is the primary fix for VR headset in fruit startup
  hardBlocklist: string[];

  // Soft blocklist — deprioritize, only use as last resort
  softBlocklist: string[];

  // Lighting signature — used to score atmosphere fit
  lightingProfile: {
    temperature: "warm" | "cool" | "neutral" | "dramatic-contrast";
    quality: "golden-hour" | "studio-clean" | "moody-low" | "bright-natural" | "neon-synthetic";
    environment: "outdoor-natural" | "indoor-controlled" | "studio" | "urban-night" | "abstract";
  };

  // Color signature — used for palette generation and media scoring
  colorSignature: {
    dominants: string[];   // hex values dominant in category-correct imagery
    rejects: string[];     // hex values that signal wrong category
  };
}

// ─── ATMOSPHERE SPEC ─────────────────────────────────────────────────────────
// How the world FEELS, independent of content.
// This drives the canvas renderer directly.

export interface AtmosphereSpec {
  // Base canvas rendering
  baseColor: string;
  glows: Array<{
    color: string;
    x: string; y: string;
    radius: string;
    opacity: number;
    animationPhase: number;
  }>;
  noiseOpacity: number;
  vignetteStrength: number;

  // Direction-specific overrides
  directionOverrides: Partial<Record<DirectionKey, Partial<AtmosphereSpec>>>;
}

// ─── IDENTITY SYSTEM ─────────────────────────────────────────────────────────
// How the brand coherence propagates across the entire world.

interface IdentitySystem {
  // Typography — category-native choices
  displayFont: string;       // the headline font
  bodyFont: string;
  monoFont: string;          // for labels/eyebrows

  // Voice — how the copy sounds
  copyVoice: {
    tone: "warm-expert" | "cool-minimal" | "energetic-bold" | "refined-editorial" | "playful-direct";
    headlinePattern: string;   // e.g. "[Verb] the [Category Noun]" or "[Adjective] [Noun]."
    maxHeadlineWords: number;
    usesAllCaps: boolean;
    punctuationStyle: "none" | "period" | "em-dash" | "ellipsis";
  };

  // Spacing rhythm — how generous the layout feels
  spacingRhythm: "tight-dense" | "balanced" | "airy" | "ultra-generous";

  // Navigation style
  navStyle: "minimal-transparent" | "solid-branded" | "editorial-serif" | "utility-mono";
}

// ─── WORLD DNA ────────────────────────────────────────────────────────────────
// The complete specification for a generated startup world.

export interface WorldDNA {
  // Identity
  startupName: string;
  category: CategoryKey;
  rawInput: string;          // what the user actually typed
  sessionSeed: string;       // entropy for anti-repetition

  // World systems
  semanticField: SemanticField;
  atmosphere: AtmosphereSpec;
  identity: IdentitySystem;

  // Direction rendering specs (one per direction)
  directionSpecs: Record<DirectionKey, DirectionWorldSpec>;

  // Thumbnail specs (pre-generated, not screenshots)
  thumbnailSpecs: Record<DirectionKey, ThumbnailSpec>;
}

// ─── DIRECTION WORLD SPEC ─────────────────────────────────────────────────────
// How a specific direction renders THIS specific startup world.
// This is where category + direction combine.

export interface DirectionWorldSpec {
  // Hero construction
  hero: {
    mediaApproach: "css-atmospheric" | "single-focal" | "full-bleed-editorial" | "collage-grid" | "illustrated";
    compositionRule: "left-type-right-image" | "centered-isolated" | "type-over-full-bleed" | "editorial-split" | "grid-collision";
    atmosphereIntensity: number;  // 0–1, how dominant the canvas layer is
    focalImageRole: "dominant" | "supporting" | "absent";
    typographyScale: "massive-80vw" | "large-display" | "editorial-medium" | "refined-small";
  };

  // Section story arc — category-native beats
  storyArc: Array<{
    beatName: string;
    sectionType: "vacuum" | "editorial" | "dense" | "maximal" | "sparse";
    mediaRole: "dominant" | "supporting" | "absent";
    densityLayer: "atmosphere" | "product" | "proof" | "cta";
  }>;

  // Media instructions per slot
  slotInstructions: Record<SlotRole, SlotInstruction>;
}

interface SlotInstruction {
  queryTemplate: string;       // parameterized query, e.g. "{{subject}} {{lighting}} {{style}}"
  requiredElements: string[];  // must appear in the image
  forbiddenElements: string[]; // must not appear
  compositionHint: "center-subject" | "rule-of-thirds" | "full-bleed-texture" | "isolated-product" | "environmental";
  aspectRatio: "16/9" | "3/2" | "1/1" | "4/5" | "2/3";
  lightingMatch: "warm" | "cool" | "dramatic" | "clean" | "any";
}

// ─── THUMBNAIL SPEC ───────────────────────────────────────────────────────────
// Each thumbnail is a designed composition, not a screenshot.
// This is the primary fix for identical-looking direction cards.

export interface ThumbnailSpec {
  // Layout — each direction gets a structurally different composition
  composition: ThumbnailComposition;

  // Content layers
  layers: ThumbnailLayer[];

  // Typography identity in the thumbnail
  type: {
    startupName: string;
    tagline: string;
    categoryLabel: string;
    nameStyle: "large-display" | "all-caps-mono" | "editorial-serif" | "minimal-sans";
    namePlacement: "bottom-left" | "center" | "top-left" | "bottom-right" | "diagonal";
  };

  // Color atmosphere
  palette: {
    background: string;
    accent: string;
    text: string;
    overlay: string;   // rgba for overlay on images
  };
}

type ThumbnailComposition =
  | "full-bleed-hero"          // Premium Dark: atmospheric full-bleed, type at bottom
  | "product-isolated"         // Minimal Clean: white bg, single product centered
  | "editorial-split-diagonal" // Luxury Editorial: diagonal image split, serif type
  | "grid-collage-energy"      // Bold Experimental: 3-image grid collision, bold type
  | "feed-card-stack"          // Gen-Z Vibrant: social card stack, bright colors
  | "layered-depth"            // Orchestra Style: layered parallax depth, gradient

type ThumbnailLayer =
  | { type: "atmosphere-gradient"; gradient: string; opacity: number }
  | { type: "image-slot"; role: SlotRole; position: string; size: string; borderRadius: string }
  | { type: "color-block"; color: string; position: string; size: string }
  | { type: "noise-overlay"; opacity: number }
  | { type: "vignette"; strength: number }
  | { type: "text-element"; content: string; style: string; position: string }
  | { type: "rule-line"; color: string; position: string }
  | { type: "brand-mark"; content: string; position: string }

// ─── CATEGORY REGISTRY ────────────────────────────────────────────────────────
// The complete semantic world for each category.
// This is the anti-leakage system — built by humans, not generated at runtime.

export const CATEGORY_REGISTRY: Record<CategoryKey, SemanticField> = {
  "fresh-produce": {
    primarySubjects: [
      "ripe oranges halved on wood surface",
      "strawberry field close harvest morning",
      "farmers market fruit stall colorful",
      "apple orchard rows golden light",
      "tropical fruit flat lay overhead",
      "cherry branch close macro",
      "peach tree ripe fruit",
      "watermelon slice summer natural light",
      "blueberry farm morning dew",
      "mango halved yellow warm light",
      "grape vineyard aerial golden hour",
      "lemon grove mediterranean light",
    ],
    secondarySubjects: [
      "cold press juice glass bottle condensation",
      "wooden fruit crate market stall",
      "premium fruit gift box packaging white",
      "organic farm label jar glass",
      "fruit smoothie bowl overhead",
      "wicker harvest basket outdoor",
    ],
    ambientElements: [
      "orchard sunrise soft golden light rows",
      "soil texture close organic farm",
      "dew on leaf macro morning",
      "hands sorting fruit market",
      "sunlight through orchard canopy",
    ],
    // THE FIX: hard blocklist prevents any of these appearing regardless of query
    hardBlocklist: [
      "VR headset", "virtual reality", "gaming", "esports", "tech office",
      "laptop computer", "server rack", "code screen", "data center",
      "cryptocurrency", "blockchain", "metaverse", "robot", "drone technology",
      "factory industrial", "construction", "medical equipment", "pills medication",
      "gym weights", "sports arena", "basketball court", "football field",
      "fashion model", "runway", "luxury car", "yacht", "jet",
      "businessman", "business woman", "office worker", "headshot", "portrait",
      "selfie", "stock photo smile", "random man", "random woman",
    ],
    softBlocklist: [
      "generic lifestyle", "stock photo smile", "handshake business",
      "meeting room", "whiteboard", "coffee laptop",
    ],
    lightingProfile: {
      temperature: "warm",
      quality: "golden-hour",
      environment: "outdoor-natural",
    },
    colorSignature: {
      dominants: ["#E8490F", "#F5A623", "#3D7A3D", "#FFF8F0", "#C8A06A"],
      rejects: ["#0D0D2B", "#1A1A2E", "#FF0040", "#00FF88"],
    },
  },

  "sports-analytics": {
    primarySubjects: [
      "basketball court overhead arena lights",
      "NBA arena crowd game night energy",
      "player dunking dramatic light",
      "hardwood court floor reflection empty",
      "athlete training close action blur",
      "basketball leather texture macro",
      "hoop net swish moment",
      "scoreboard digital glow arena",
      "sneakers court close laces",
      "coach whiteboard play diagram",
    ],
    secondarySubjects: [
      "sports data visualization dashboard screen",
      "tablet screen stats overlay courtside",
      "athlete heart rate monitor wrist",
      "team jersey number close fabric",
      "sports clipboard play diagram",
    ],
    ambientElements: [
      "arena light beams empty court",
      "locker room preparation atmosphere",
      "sports bench sideline game blur",
      "stadium exterior night glow",
    ],
    hardBlocklist: [
      "fruit", "food", "cooking", "kitchen", "restaurant",
      "fashion model", "runway", "luxury goods",
      "medical hospital", "pills", "meditation yoga",
      "gaming esports PC setup", "VR headset",
      "office meeting room", "whiteboard startup",
    ],
    softBlocklist: [
      "generic athlete smiling", "stock handshake",
    ],
    lightingProfile: {
      temperature: "dramatic-contrast",
      quality: "moody-low",
      environment: "indoor-controlled",
    },
    colorSignature: {
      dominants: ["#C8501A", "#1B3A5C", "#F5C842", "#F5F0E8", "#2D2D2D"],
      rejects: ["#90EE90", "#FFB6C1", "#F5A623"],
    },
  },

  "fashion-apparel": {
    primarySubjects: [
      "fashion editorial model street asymmetric crop",
      "clothing rack store interior minimal light",
      "fashion lookbook studio portrait dramatic",
      "fabric texture close weave detail",
      "sneaker detail sole stitching macro",
      "jacket lapel detail close",
      "model silhouette backlit dramatic",
      "wardrobe organized editorial flat lay",
    ],
    secondarySubjects: [
      "clothing tag label quality close",
      "hands folding cashmere sweater",
      "packaging box premium unboxing",
      "fashion studio natural light white wall",
    ],
    ambientElements: [
      "fashion studio diffused natural light",
      "changing room mirror reflection",
      "fashion week backstage atmosphere",
      "fabric swatches editorial arrangement",
    ],
    hardBlocklist: [
      "fruit food cooking", "sports court arena",
      "tech office laptop code", "medical hospital",
      "construction factory", "gaming esports",
    ],
    softBlocklist: ["stock photo generic smile", "catalog pose stiff"],
    lightingProfile: {
      temperature: "cool",
      quality: "studio-clean",
      environment: "studio",
    },
    colorSignature: {
      dominants: ["#1A1A1A", "#D4AF37", "#F5F5F5", "#E8E0D8", "#C0B090"],
      rejects: ["#FF6B35", "#00FF88", "#0055FF"],
    },
  },

  "creator-tools": {
    primarySubjects: [
      "creator studio setup camera ring light",
      "content creator filming phone tripod",
      "podcast microphone home studio warm",
      "youtube creator editing screen laptop",
      "influencer filming outdoor golden hour",
      "creative workspace dual monitor plants",
      "video editing timeline screen dark",
    ],
    secondarySubjects: [
      "camera gear lens close macro",
      "analytics dashboard creator metrics screen",
      "social media feed phone scroll",
      "creator merch packaging unboxing",
    ],
    ambientElements: [
      "LED ring light glow portrait",
      "home studio acoustic foam warm",
      "creative desk organized aesthetic",
    ],
    hardBlocklist: [
      "sports court arena", "food cooking fruit",
      "medical hospital", "industrial factory",
      "luxury fashion runway",
    ],
    softBlocklist: ["generic office", "whiteboard meeting"],
    lightingProfile: {
      temperature: "warm",
      quality: "golden-hour",
      environment: "indoor-controlled",
    },
    colorSignature: {
      dominants: ["#FF6B35", "#FFD700", "#1A1A1A", "#F0F0F0", "#FF3366"],
      rejects: ["#90EE90", "#87CEEB"],
    },
  },

  "wellness-mindfulness": {
    primarySubjects: [
      "yoga class sunrise studio light beam",
      "meditation garden outdoor morning mist",
      "person meditating peaceful room natural light",
      "wellness retreat infinity pool mountain view",
      "yoga pose outdoor nature serene",
      "herbal tea cup morning light steam",
    ],
    secondarySubjects: [
      "yoga mat candle minimal room",
      "essential oil bottle natural light macro",
      "meditation cushion minimal floor",
      "journal pen morning ritual",
    ],
    ambientElements: [
      "spa interior candle warm atmospheric",
      "nature forest path morning golden",
      "calm water reflection minimal",
    ],
    hardBlocklist: [
      "sports arena", "basketball court", "tech office laptop",
      "food restaurant cooking", "fashion runway",
      "gaming esports", "industrial construction",
    ],
    softBlocklist: ["gym weights aggressive"],
    lightingProfile: {
      temperature: "warm",
      quality: "bright-natural",
      environment: "outdoor-natural",
    },
    colorSignature: {
      dominants: ["#86EFAC", "#FDE68A", "#F9FAFB", "#D4C8B0", "#7FB069"],
      rejects: ["#FF0040", "#0D0D2B", "#FF6B35"],
    },
  },

  "food-beverage": {
    primarySubjects: [
      "restaurant dining room modern evening light",
      "chef plating fine dining dramatic light",
      "coffee latte art overhead macro",
      "cocktail bar drinks atmospheric dark",
      "meal kit ingredients editorial overhead",
      "burger food photography dark moody",
    ],
    secondarySubjects: [
      "food packaging premium table",
      "barista espresso pull close",
      "menu card minimal design",
    ],
    ambientElements: [
      "restaurant kitchen pass window service",
      "wine cellar bottles rack dark",
      "market street food crowd atmosphere",
    ],
    hardBlocklist: [
      "sports court", "fashion runway", "tech office",
      "medical hospital", "gaming", "construction",
    ],
    softBlocklist: ["generic food stock flat"],
    lightingProfile: {
      temperature: "warm",
      quality: "moody-low",
      environment: "indoor-controlled",
    },
    colorSignature: {
      dominants: ["#C0392B", "#E67E22", "#F39C12", "#2C1810", "#F5F0EB"],
      rejects: ["#0055FF", "#00FF88"],
    },
  },

  "software-saas": {
    primarySubjects: [
      "developer laptop code screen dark mode coffee",
      "tech startup office modern open plan window",
      "person working laptop morning window light",
      "dual monitor setup dark mode developer",
      "team collaboration whiteboard modern",
    ],
    secondarySubjects: [
      "phone app screen hand holding",
      "dashboard data screen close",
      "keyboard hands typing close macro",
    ],
    ambientElements: [
      "tech office plant minimal window view",
      "startup office city view glass",
      "coffee desk notebook morning work",
    ],
    hardBlocklist: [
      "fruit food cooking", "sports arena", "fashion runway",
      "medical hospital", "construction factory",
    ],
    softBlocklist: ["stock photo handshake", "generic team smiling"],
    lightingProfile: {
      temperature: "cool",
      quality: "bright-natural",
      environment: "indoor-controlled",
    },
    colorSignature: {
      dominants: ["#3B82F6", "#8B5CF6", "#1E293B", "#F8FAFC"],
      rejects: ["#FF6B35", "#F5A623", "#90EE90"],
    },
  },

  "finance-fintech": {
    primarySubjects: [
      "financial professional office city view glass",
      "phone banking app hand dark background",
      "credit card premium gold macro close",
      "trading screen data charts green glow",
      "business meeting modern boardroom",
    ],
    secondarySubjects: [
      "premium black card wallet leather",
      "laptop finance dashboard chart",
      "calculator document minimal desk",
    ],
    ambientElements: [
      "financial district city skyline night",
      "modern bank interior minimal",
      "glass building reflection financial",
    ],
    hardBlocklist: [
      "fruit food cooking", "sports court", "fashion runway",
      "gaming esports", "medical hospital", "yoga meditation",
    ],
    softBlocklist: ["generic handshake meeting"],
    lightingProfile: {
      temperature: "cool",
      quality: "studio-clean",
      environment: "indoor-controlled",
    },
    colorSignature: {
      dominants: ["#0F172A", "#1D4ED8", "#F8FAFC", "#D4AF37"],
      rejects: ["#FF6B35", "#90EE90", "#F5A623"],
    },
  },

  "health-medical": {
    primarySubjects: [
      "doctor patient consultation modern clinic natural",
      "health clinic bright minimal reception",
      "nurse hospital corridor modern architecture",
      "wellness center bright interior natural light",
    ],
    secondarySubjects: [
      "medical device professional close",
      "health tracking wearable wrist",
      "stethoscope professional close minimal",
    ],
    ambientElements: [
      "hospital corridor modern clean architecture",
      "medical lab equipment professional",
      "pharmacy shelf organized clean",
    ],
    hardBlocklist: [
      "sports arena basketball", "fashion runway", "gaming esports",
      "food restaurant cooking", "construction",
    ],
    softBlocklist: ["stock photo generic doctor smile"],
    lightingProfile: {
      temperature: "cool",
      quality: "bright-natural",
      environment: "indoor-controlled",
    },
    colorSignature: {
      dominants: ["#0891B2", "#10B981", "#F0FDFA", "#FFFFFF"],
      rejects: ["#FF6B35", "#C8501A", "#0D0D2B"],
    },
  },

  "education-learning": {
    primarySubjects: [
      "student laptop studying campus natural light",
      "library books modern interior bright architecture",
      "classroom students learning engaged",
      "person reading book coffee morning light",
      "teacher explaining whiteboard engaged students",
    ],
    secondarySubjects: [
      "student notebook writing study lamp",
      "online class laptop video call",
      "book stack desk organized",
    ],
    ambientElements: [
      "library interior high ceiling architecture",
      "campus walkway students morning",
      "study room minimal desk lamp",
    ],
    hardBlocklist: [
      "sports arena", "fashion runway", "gaming esports",
      "food restaurant", "medical hospital", "construction",
    ],
    softBlocklist: ["generic classroom boring"],
    lightingProfile: {
      temperature: "warm",
      quality: "bright-natural",
      environment: "indoor-controlled",
    },
    colorSignature: {
      dominants: ["#F59E0B", "#3B82F6", "#FFFBEB", "#1E293B"],
      rejects: ["#FF0040", "#0D0D2B"],
    },
  },

  "home-living": {
    primarySubjects: [
      "modern living room interior design natural light",
      "kitchen interior minimal white clean modern",
      "bedroom Scandinavian design natural light",
      "apartment interior editorial composition",
      "home office desk setup minimal organized",
    ],
    secondarySubjects: [
      "furniture detail wood texture macro",
      "interior lamp design modern close",
      "plant home interior window light",
    ],
    ambientElements: [
      "home exterior architecture modern residential",
      "interior architectural window light dramatic",
      "neighborhood street warm golden residential",
    ],
    hardBlocklist: [
      "sports arena", "tech office startup", "medical hospital",
      "construction industrial", "gaming esports",
    ],
    softBlocklist: ["catalog pose stiff"],
    lightingProfile: {
      temperature: "warm",
      quality: "golden-hour",
      environment: "indoor-controlled",
    },
    colorSignature: {
      dominants: ["#D97706", "#78716C", "#FAFAF9", "#E7E5E4"],
      rejects: ["#0055FF", "#FF0040", "#00FF88"],
    },
  },

  "travel-experience": {
    primarySubjects: [
      "travel destination aerial landscape cinematic",
      "hotel lobby luxury interior design",
      "scenic mountain viewpoint sunset dramatic",
      "beach resort infinity pool ocean view",
      "ancient city architecture travel editorial",
    ],
    secondarySubjects: [
      "passport travel boarding pass close",
      "hotel room interior premium bed",
      "airplane window cloud view golden",
    ],
    ambientElements: [
      "airport terminal architecture modern light",
      "city skyline golden hour travel",
      "map notebook pen planning close",
    ],
    hardBlocklist: [
      "tech office laptop code", "medical hospital", "gaming esports",
      "sports court arena", "construction factory",
    ],
    softBlocklist: ["generic tourist crowded stock"],
    lightingProfile: {
      temperature: "warm",
      quality: "golden-hour",
      environment: "outdoor-natural",
    },
    colorSignature: {
      dominants: ["#0EA5E9", "#F97316", "#F0F9FF", "#1E3A5F"],
      rejects: ["#FF0040", "#00FF88"],
    },
  },
};

// ─── SEMANTIC SCORING ENGINE ──────────────────────────────────────────────────
// Scores an image candidate against the world DNA.
// Score 0–1. Anything below 0.35 is rejected.

export interface MediaCandidate {
  url: string;
  thumbUrl: string;
  width: number;
  height: number;
  altText: string;       // from provider
  tags?: string[];       // if provider returns tags
  dominantColors?: string[];  // if available
}

export interface MediaScore {
  total: number;           // 0–1, weighted aggregate
  passed: boolean;         // total >= threshold
  rejection?: string;      // reason if failed
  breakdown: {
    semantic: number;      // does this match the category?
    atmospheric: number;   // does the lighting/mood match the direction?
    blocklist: number;     // 0 = blocked, 1 = clean
    quality: number;       // technical quality signals
    uniqueness: number;    // distance from already-selected images in session
  };
}

export function scoreMediaCandidate(
  candidate: MediaCandidate,
  dna: WorldDNA,
  direction: DirectionKey,
  alreadySelected: MediaCandidate[]
): MediaScore {
  const field = dna.semanticField;
  const alt = candidate.altText.toLowerCase();
  const tags = (candidate.tags || []).map(t => t.toLowerCase());
  const allText = [alt, ...tags].join(" ");

  // ── Blocklist check (hard gate — immediate rejection)
  for (const blocked of field.hardBlocklist) {
    if (allText.includes(blocked.toLowerCase())) {
      return {
        total: 0, passed: false,
        rejection: `Hard-blocked term "${blocked}" found in: "${candidate.altText}"`,
        breakdown: { semantic: 0, atmospheric: 0, blocklist: 0, quality: 0, uniqueness: 0 },
      };
    }
  }

  // ── Soft blocklist (penalize, don't reject)
  let softPenalty = 0;
  for (const soft of field.softBlocklist) {
    if (allText.includes(soft.toLowerCase())) softPenalty += 0.2;
  }

  // ── Semantic score: how many primary/secondary subjects appear?
  let semanticScore = 0;
  const allSubjects = [...field.primarySubjects, ...field.secondarySubjects];
  for (const subject of allSubjects) {
    const subjectWords = subject.toLowerCase().split(" ");
    const matchCount = subjectWords.filter(w => w.length > 3 && allText.includes(w)).length;
    const matchRatio = matchCount / subjectWords.length;
    if (matchRatio > semanticScore) semanticScore = matchRatio;
  }

  // Boost if ambient elements match
  for (const ambient of field.ambientElements) {
    const words = ambient.toLowerCase().split(" ");
    const match = words.filter(w => w.length > 3 && allText.includes(w)).length / words.length;
    if (match > 0.4) semanticScore = Math.min(1, semanticScore + 0.1);
  }

  // ── Atmospheric score: does the lighting match the direction's needs?
  const directionAtmosphereNeeds: Record<DirectionKey, typeof field.lightingProfile.quality[]> = {
    "premium-dark":       ["moody-low"],
    "minimal-clean":      ["studio-clean", "bright-natural"],
    "bold-experimental":  ["moody-low", "neon-synthetic"],
    "luxury-editorial":   ["studio-clean", "golden-hour"],
    "genz-vibrant":       ["bright-natural", "neon-synthetic"],
    "orchestra-style":    ["golden-hour", "bright-natural"],
  };

  const neededLighting = directionAtmosphereNeeds[direction];
  const categoryLighting = field.lightingProfile.quality;
  const atmosphericScore =
    neededLighting == null
      ? 0.7
      : neededLighting.includes(categoryLighting)
        ? 0.9
        : 0.4;

  // ── Quality signals
  const qualityScore =
    (candidate.width >= 800 ? 0.3 : 0.1) +
    (candidate.height >= 600 ? 0.3 : 0.1) +
    (candidate.altText.length > 10 ? 0.2 : 0.05) +
    (!candidate.altText.toLowerCase().includes("stock photo") ? 0.2 : 0.05);

  // ── Uniqueness: perceptual distance from already selected
  let uniquenessScore = 1.0;
  if (alreadySelected.length > 0 && candidate.dominantColors) {
    for (const selected of alreadySelected) {
      if (selected.dominantColors && candidate.dominantColors) {
        const colorDist = colorspaceDistance(candidate.dominantColors, selected.dominantColors);
        if (colorDist < 0.15) uniquenessScore = Math.min(uniquenessScore, colorDist * 4);
      }
    }
  }

  // ── Weighted aggregate
  const total = Math.max(0, Math.min(1,
    semanticScore * 0.40 +
    atmosphericScore * 0.25 +
    1 * 0.15 +              // blocklist passed = full weight
    qualityScore * 0.12 +
    uniquenessScore * 0.08 -
    softPenalty
  ));

  return {
    total,
    passed: total >= 0.35,
    breakdown: {
      semantic: semanticScore,
      atmospheric: atmosphericScore,
      blocklist: 1,
      quality: qualityScore,
      uniqueness: uniquenessScore,
    },
  };
}

// Simple perceptual color distance (average hex distance in RGB space)
function colorspaceDistance(colorsA: string[], colorsB: string[]): number {
  if (!colorsA.length || !colorsB.length) return 1;
  const toRgb = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255,
  });
  let minDist = 1;
  for (const a of colorsA) {
    for (const b of colorsB) {
      try {
        const ra = toRgb(a), rb = toRgb(b);
        const d = Math.sqrt(
          (ra.r - rb.r) ** 2 + (ra.g - rb.g) ** 2 + (ra.b - rb.b) ** 2
        ) / Math.sqrt(3);
        if (d < minDist) minDist = d;
      } catch { /* skip malformed hex */ }
    }
  }
  return minDist;
}

// ─── DIRECTION STORY ARCS ─────────────────────────────────────────────────────
// Category-native story beats per direction.
// These replace generic "features / testimonials / pricing" sections.

export const STORY_ARCS: Record<CategoryKey, Record<DirectionKey, DirectionWorldSpec["storyArc"]>> = {
  "fresh-produce": {
    "premium-dark": [
      { beatName: "The Harvest Moment", sectionType: "vacuum", mediaRole: "dominant", densityLayer: "atmosphere" },
      { beatName: "What We Grow", sectionType: "editorial", mediaRole: "dominant", densityLayer: "product" },
      { beatName: "The Numbers", sectionType: "dense", mediaRole: "absent", densityLayer: "proof" },
      { beatName: "Join the Season", sectionType: "sparse", mediaRole: "supporting", densityLayer: "cta" },
    ],
    "minimal-clean": [
      { beatName: "The Product", sectionType: "sparse", mediaRole: "dominant", densityLayer: "product" },
      { beatName: "How It's Grown", sectionType: "editorial", mediaRole: "supporting", densityLayer: "atmosphere" },
      { beatName: "From Farm to You", sectionType: "editorial", mediaRole: "dominant", densityLayer: "proof" },
      { beatName: "Start Fresh", sectionType: "sparse", mediaRole: "absent", densityLayer: "cta" },
    ],
    "bold-experimental": [
      { beatName: "NATURE UNLEASHED", sectionType: "maximal", mediaRole: "dominant", densityLayer: "atmosphere" },
      { beatName: "THE HARVEST", sectionType: "dense", mediaRole: "dominant", densityLayer: "product" },
      { beatName: "REAL FARMS REAL FAST", sectionType: "dense", mediaRole: "supporting", densityLayer: "proof" },
      { beatName: "ORDER NOW", sectionType: "sparse", mediaRole: "absent", densityLayer: "cta" },
    ],
    "luxury-editorial": [
      { beatName: "", sectionType: "vacuum", mediaRole: "dominant", densityLayer: "atmosphere" },
      { beatName: "The Orchard", sectionType: "editorial", mediaRole: "dominant", densityLayer: "atmosphere" },
      { beatName: "Provenance", sectionType: "editorial", mediaRole: "supporting", densityLayer: "proof" },
      { beatName: "The Collection", sectionType: "sparse", mediaRole: "dominant", densityLayer: "cta" },
    ],
    "genz-vibrant": [
      { beatName: "ok but this fruit is EVERYTHING", sectionType: "maximal", mediaRole: "dominant", densityLayer: "atmosphere" },
      { beatName: "what's in your box rn", sectionType: "dense", mediaRole: "dominant", densityLayer: "product" },
      { beatName: "join the farm fam", sectionType: "editorial", mediaRole: "supporting", densityLayer: "proof" },
      { beatName: "get yours", sectionType: "sparse", mediaRole: "absent", densityLayer: "cta" },
    ],
    "orchestra-style": [
      { beatName: "Seasonal Intelligence", sectionType: "editorial", mediaRole: "dominant", densityLayer: "atmosphere" },
      { beatName: "What's Growing", sectionType: "dense", mediaRole: "dominant", densityLayer: "product" },
      { beatName: "The Farms", sectionType: "editorial", mediaRole: "supporting", densityLayer: "proof" },
      { beatName: "Get Started", sectionType: "sparse", mediaRole: "absent", densityLayer: "cta" },
    ],
  },
  "sports-analytics": {
    "premium-dark": [
      { beatName: "The Arena", sectionType: "vacuum", mediaRole: "dominant", densityLayer: "atmosphere" },
      { beatName: "The Intelligence", sectionType: "dense", mediaRole: "absent", densityLayer: "product" },
      { beatName: "Built With Coaches", sectionType: "editorial", mediaRole: "supporting", densityLayer: "proof" },
      { beatName: "Request Access", sectionType: "sparse", mediaRole: "absent", densityLayer: "cta" },
    ],
    "minimal-clean": [
      { beatName: "The Platform", sectionType: "sparse", mediaRole: "dominant", densityLayer: "product" },
      { beatName: "Key Metrics", sectionType: "editorial", mediaRole: "absent", densityLayer: "proof" },
      { beatName: "For Teams", sectionType: "editorial", mediaRole: "supporting", densityLayer: "proof" },
      { beatName: "Get a Demo", sectionType: "sparse", mediaRole: "absent", densityLayer: "cta" },
    ],
    "bold-experimental": [
      { beatName: "GAME INTELLIGENCE", sectionType: "maximal", mediaRole: "dominant", densityLayer: "atmosphere" },
      { beatName: "THE DATA", sectionType: "dense", mediaRole: "absent", densityLayer: "product" },
      { beatName: "12 NBA TEAMS", sectionType: "dense", mediaRole: "supporting", densityLayer: "proof" },
      { beatName: "JOIN THE GAME", sectionType: "sparse", mediaRole: "absent", densityLayer: "cta" },
    ],
    "luxury-editorial": [
      { beatName: "", sectionType: "vacuum", mediaRole: "dominant", densityLayer: "atmosphere" },
      { beatName: "The Science of Play", sectionType: "editorial", mediaRole: "dominant", densityLayer: "product" },
      { beatName: "The Evidence", sectionType: "editorial", mediaRole: "supporting", densityLayer: "proof" },
      { beatName: "The Partnership", sectionType: "sparse", mediaRole: "absent", densityLayer: "cta" },
    ],
    "genz-vibrant": [
      { beatName: "your stats are mid. fix it.", sectionType: "maximal", mediaRole: "dominant", densityLayer: "atmosphere" },
      { beatName: "the dashboard built for ballers", sectionType: "dense", mediaRole: "dominant", densityLayer: "product" },
      { beatName: "coaches are obsessed", sectionType: "editorial", mediaRole: "supporting", densityLayer: "proof" },
      { beatName: "get on the team", sectionType: "sparse", mediaRole: "absent", densityLayer: "cta" },
    ],
    "orchestra-style": [
      { beatName: "Performance Intelligence", sectionType: "editorial", mediaRole: "dominant", densityLayer: "atmosphere" },
      { beatName: "The Analytics Suite", sectionType: "dense", mediaRole: "absent", densityLayer: "product" },
      { beatName: "Proven Results", sectionType: "editorial", mediaRole: "supporting", densityLayer: "proof" },
      { beatName: "Start Winning", sectionType: "sparse", mediaRole: "absent", densityLayer: "cta" },
    ],
  },
  // ... remaining categories follow same pattern
  "fashion-apparel": { "premium-dark": [], "minimal-clean": [], "bold-experimental": [], "luxury-editorial": [], "genz-vibrant": [], "orchestra-style": [] },
  "creator-tools": { "premium-dark": [], "minimal-clean": [], "bold-experimental": [], "luxury-editorial": [], "genz-vibrant": [], "orchestra-style": [] },
  "wellness-mindfulness": { "premium-dark": [], "minimal-clean": [], "bold-experimental": [], "luxury-editorial": [], "genz-vibrant": [], "orchestra-style": [] },
  "food-beverage": { "premium-dark": [], "minimal-clean": [], "bold-experimental": [], "luxury-editorial": [], "genz-vibrant": [], "orchestra-style": [] },
  "software-saas": { "premium-dark": [], "minimal-clean": [], "bold-experimental": [], "luxury-editorial": [], "genz-vibrant": [], "orchestra-style": [] },
  "finance-fintech": { "premium-dark": [], "minimal-clean": [], "bold-experimental": [], "luxury-editorial": [], "genz-vibrant": [], "orchestra-style": [] },
  "health-medical": { "premium-dark": [], "minimal-clean": [], "bold-experimental": [], "luxury-editorial": [], "genz-vibrant": [], "orchestra-style": [] },
  "education-learning": { "premium-dark": [], "minimal-clean": [], "bold-experimental": [], "luxury-editorial": [], "genz-vibrant": [], "orchestra-style": [] },
  "home-living": { "premium-dark": [], "minimal-clean": [], "bold-experimental": [], "luxury-editorial": [], "genz-vibrant": [], "orchestra-style": [] },
  "travel-experience": { "premium-dark": [], "minimal-clean": [], "bold-experimental": [], "luxury-editorial": [], "genz-vibrant": [], "orchestra-style": [] },
};

// ─── CATEGORY ALIAS RESOLVER ──────────────────────────────────────────────────
// Maps raw user input to canonical CategoryKey.
// This is the primary defense against wrong-category media.

const ALIAS_MAP: [RegExp, CategoryKey][] = [
  [/\bfruit|produce|farm|orchard|harvest|berry|vegetable|organic food\b/i, "fresh-produce"],
  [/\bbasketball|sports|athlete|athletic|fitness|gym|training|soccer|football|running\b/i, "sports-analytics"],
  [/\bfashion|clothing|apparel|streetwear|shoes|sneakers|wear\b/i, "fashion-apparel"],
  [/\bcreator|content|youtube|podcast|influencer|streaming|media\b/i, "creator-tools"],
  [/\bwellness|meditation|yoga|mindfulness|mental health|spiritual\b/i, "wellness-mindfulness"],
  [/\brestaurant|food|beverage|coffee|meal|dining|cuisine|drink\b/i, "food-beverage"],
  [/\bsaas|software|app|platform|tool|developer|api|tech|ai startup|startup\b/i, "software-saas"],
  [/\bfinance|fintech|banking|payments|investment|money|crypto\b/i, "finance-fintech"],
  [/\bhealth|medical|healthcare|doctor|clinic|hospital|pharma\b/i, "health-medical"],
  [/\beducation|learning|school|course|tutoring|edtech|teaching\b/i, "education-learning"],
  [/\bhome|interior|furniture|living|real estate|property|decor\b/i, "home-living"],
  [/\btravel|hotel|tourism|hospitality|vacation|trip|destination\b/i, "travel-experience"],
];

export function resolveCategory(rawInput: string): CategoryKey {
  for (const [pattern, key] of ALIAS_MAP) {
    if (pattern.test(rawInput)) return key;
  }
  return "software-saas"; // default
}

// ─── THUMBNAIL SPEC GENERATOR ─────────────────────────────────────────────────
// Generates structurally different thumbnail compositions per direction.
// The key: each direction has a DIFFERENT STRUCTURAL LAYOUT, not just different colors.

export function generateThumbnailSpec(
  dna: Pick<WorldDNA, "startupName" | "category" | "semanticField">,
  direction: DirectionKey
): ThumbnailSpec {
  const field = dna.semanticField;
  const palette = field.colorSignature.dominants;
  const [primary, secondary, tertiary] = palette;

  const specs: Record<DirectionKey, ThumbnailSpec> = {
    // ── Premium Dark: atmospheric full-bleed, type emerges from darkness
    "premium-dark": {
      composition: "full-bleed-hero",
      layers: [
        { type: "atmosphere-gradient", gradient: `radial-gradient(ellipse at 30% 60%, ${primary}30 0%, #080810 55%, #050508 100%)`, opacity: 1 },
        { type: "image-slot", role: "hero-atmosphere", position: "inset: 0", size: "100%", borderRadius: "0" },
        { type: "atmosphere-gradient", gradient: `linear-gradient(to top, #050508 0%, transparent 50%)`, opacity: 1 },
        { type: "noise-overlay", opacity: 0.04 },
        { type: "text-element", content: dna.startupName, style: "large white serif bottom-left", position: "bottom: 20px; left: 20px" },
        { type: "text-element", content: dna.category.replace("-", " ").toUpperCase(), style: "tiny mono top-left", position: "top: 16px; left: 16px" },
      ],
      type: { startupName: dna.startupName, tagline: "", categoryLabel: dna.category, nameStyle: "large-display", namePlacement: "bottom-left" },
      palette: { background: "#080810", accent: primary, text: "#F0EFFF", overlay: "rgba(5,5,8,0.6)" },
    },

    // ── Minimal Clean: white space + single isolated product, extreme restraint
    "minimal-clean": {
      composition: "product-isolated",
      layers: [
        { type: "atmosphere-gradient", gradient: "#FAFAF8", opacity: 1 },
        { type: "image-slot", role: "product-hero", position: "top: 15%; left: 50%; transform: translateX(-50%)", size: "60% auto", borderRadius: "8px" },
        { type: "rule-line", color: "rgba(0,0,0,0.08)", position: "bottom: 40px; left: 20px; right: 20px; height: 1px" },
        { type: "text-element", content: dna.startupName, style: "small sans light bottom-left", position: "bottom: 18px; left: 20px" },
      ],
      type: { startupName: dna.startupName, tagline: "", categoryLabel: dna.category, nameStyle: "minimal-sans", namePlacement: "bottom-left" },
      palette: { background: "#FAFAF8", accent: "#111110", text: "#111110", overlay: "transparent" },
    },

    // ── Luxury Editorial: diagonal image split, serif letterpress feel
    "luxury-editorial": {
      composition: "editorial-split-diagonal",
      layers: [
        { type: "atmosphere-gradient", gradient: "#F7F4EF", opacity: 1 },
        { type: "color-block", color: "#E8DDD0", position: "right: 0; top: 0; bottom: 0; width: 42%", size: "42% 100%" },
        { type: "image-slot", role: "editorial-spread", position: "right: 0; top: 0; bottom: 0; width: 42%", size: "100%", borderRadius: "0" },
        { type: "atmosphere-gradient", gradient: `linear-gradient(to right, #F7F4EF 0%, transparent 100%)`, opacity: 0.6 },
        { type: "text-element", content: dna.startupName.toUpperCase(), style: "mono spaced tiny top", position: "top: 16px; left: 20px" },
        { type: "text-element", content: "I", style: "large serif display left", position: "bottom: 40px; left: 20px" },
        { type: "noise-overlay", opacity: 0.025 },
      ],
      type: { startupName: dna.startupName, tagline: "", categoryLabel: dna.category, nameStyle: "editorial-serif", namePlacement: "bottom-left" },
      palette: { background: "#F7F4EF", accent: "#C8A96E", text: "#1A1612", overlay: "rgba(247,244,239,0.5)" },
    },

    // ── Bold Experimental: grid collision, aggressive type
    "bold-experimental": {
      composition: "grid-collage-energy",
      layers: [
        { type: "atmosphere-gradient", gradient: "#0D0D0D", opacity: 1 },
        // 3 image tiles in a grid-breaking arrangement
        { type: "image-slot", role: "hero-focal", position: "top: 12%; left: 8%; width: 45%; height: 48%", size: "100%", borderRadius: "3px" },
        { type: "image-slot", role: "feature-card", position: "top: 8%; right: 6%; width: 34%; height: 38%", size: "100%", borderRadius: "3px" },
        { type: "image-slot", role: "ambient-texture", position: "bottom: 18%; left: 28%; width: 38%; height: 30%", size: "100%", borderRadius: "3px" },
        // Color accent block overlapping
        { type: "color-block", color: secondary || "#FF3366", position: "top: 50%; left: 55%; width: 16%; height: 22%", size: "100%" },
        { type: "text-element", content: dna.startupName.toUpperCase(), style: "bold impact large bottom", position: "bottom: 14px; left: 12px" },
        { type: "noise-overlay", opacity: 0.06 },
      ],
      type: { startupName: dna.startupName, tagline: "", categoryLabel: dna.category, nameStyle: "all-caps-mono", namePlacement: "bottom-left" },
      palette: { background: "#0D0D0D", accent: "#FF3366", text: "#FFFFFF", overlay: "rgba(13,13,13,0.3)" },
    },

    // ── Gen-Z Vibrant: social card energy, bright saturated
    "genz-vibrant": {
      composition: "feed-card-stack",
      layers: [
        { type: "atmosphere-gradient", gradient: `linear-gradient(135deg, ${primary}CC 0%, ${secondary || "#FF6B35"}AA 100%)`, opacity: 1 },
        { type: "image-slot", role: "social-proof", position: "top: 10%; left: 10%; width: 80%; height: 55%", size: "100%", borderRadius: "12px" },
        { type: "atmosphere-gradient", gradient: `linear-gradient(to top, ${primary}FF 0%, transparent 50%)`, opacity: 0.85 },
        { type: "text-element", content: dna.startupName, style: "bold sans white bottom", position: "bottom: 16px; left: 16px" },
      ],
      type: { startupName: dna.startupName, tagline: "", categoryLabel: dna.category, nameStyle: "minimal-sans", namePlacement: "bottom-left" },
      palette: { background: primary, accent: secondary || "#FF6B35", text: "#FFFFFF", overlay: `rgba(0,0,0,0.25)` },
    },

    // ── Orchestra Style: layered depth, gradient authority
    "orchestra-style": {
      composition: "layered-depth",
      layers: [
        { type: "atmosphere-gradient", gradient: `linear-gradient(145deg, #0A0A14 0%, #141428 60%, #0A0A14 100%)`, opacity: 1 },
        { type: "atmosphere-gradient", gradient: `radial-gradient(ellipse at 40% 50%, ${primary}25 0%, transparent 60%)`, opacity: 1 },
        { type: "image-slot", role: "hero-atmosphere", position: "top: 0; right: 0; width: 55%; height: 70%", size: "100%", borderRadius: "0 0 0 12px" },
        { type: "atmosphere-gradient", gradient: `linear-gradient(to right, #0A0A14 20%, transparent 100%)`, opacity: 1 },
        { type: "atmosphere-gradient", gradient: `linear-gradient(to top, #0A0A14 0%, transparent 50%)`, opacity: 1 },
        { type: "text-element", content: dna.startupName, style: "medium white sans bottom-left", position: "bottom: 20px; left: 18px" },
      ],
      type: { startupName: dna.startupName, tagline: "", categoryLabel: dna.category, nameStyle: "minimal-sans", namePlacement: "bottom-left" },
      palette: { background: "#0A0A14", accent: primary, text: "#FFFFFF", overlay: "rgba(10,10,20,0.6)" },
    },
  };

  return specs[direction];
}

// ─── WORLD DNA FACTORY ────────────────────────────────────────────────────────
// Creates a complete WorldDNA from user input.
// This is called once per startup generation.

export function createWorldDNA(
  startupName: string,
  rawInput: string,
  sessionSeed: string
): WorldDNA {
  const category = resolveCategory(rawInput);
  const semanticField = CATEGORY_REGISTRY[category];

  // Generate thumbnail specs for all directions
  const thumbnailSpecs = {} as Record<DirectionKey, ThumbnailSpec>;
  const directions: DirectionKey[] = ["premium-dark", "minimal-clean", "bold-experimental", "luxury-editorial", "genz-vibrant", "orchestra-style"];
  for (const dir of directions) {
    thumbnailSpecs[dir] = generateThumbnailSpec({ startupName, category, semanticField }, dir);
  }

  return {
    startupName,
    category,
    rawInput,
    sessionSeed,
    semanticField,
    atmosphere: buildAtmosphereSpec(category, semanticField),
    identity: buildIdentitySystem(category),
    directionSpecs: buildDirectionSpecs(category, semanticField),
    thumbnailSpecs,
  };
}

function buildAtmosphereSpec(category: CategoryKey, field: SemanticField): AtmosphereSpec {
  const [primary, secondary] = field.colorSignature.dominants;
  const isWarm = field.lightingProfile.temperature === "warm";

  return {
    baseColor: isWarm ? "#0C0A08" : "#080810",
    glows: [
      { color: primary, x: "28%", y: "65%", radius: "50%", opacity: 0.18, animationPhase: 0 },
      { color: secondary || primary, x: "75%", y: "25%", radius: "38%", opacity: 0.11, animationPhase: 2.1 },
    ],
    noiseOpacity: 0.035,
    vignetteStrength: 0.6,
    directionOverrides: {
      "minimal-clean": { baseColor: "#FAFAF8", noiseOpacity: 0.015, vignetteStrength: 0 },
      "luxury-editorial": { baseColor: "#F7F4EF", noiseOpacity: 0.022, vignetteStrength: 0.2 },
    },
  };
}

function buildIdentitySystem(category: CategoryKey): IdentitySystem {
  const systems: Partial<Record<CategoryKey, IdentitySystem>> = {
    "fresh-produce": {
      displayFont: "'Georgia', 'Times New Roman', serif",
      bodyFont: "'Georgia', serif",
      monoFont: "'Courier New', monospace",
      copyVoice: { tone: "warm-expert", headlinePattern: "[Verb] the [Season] [Noun]", maxHeadlineWords: 6, usesAllCaps: false, punctuationStyle: "period" },
      spacingRhythm: "airy",
      navStyle: "minimal-transparent",
    },
    "sports-analytics": {
      displayFont: "'Georgia', serif",
      bodyFont: "'Georgia', serif",
      monoFont: "'Courier New', monospace",
      copyVoice: { tone: "cool-minimal", headlinePattern: "[AI noun] for [Sport]", maxHeadlineWords: 5, usesAllCaps: false, punctuationStyle: "none" },
      spacingRhythm: "tight-dense",
      navStyle: "solid-branded",
    },
    "fashion-apparel": {
      displayFont: "'Georgia', 'Palatino Linotype', serif",
      bodyFont: "'Georgia', serif",
      monoFont: "'Courier New', monospace",
      copyVoice: { tone: "refined-editorial", headlinePattern: "[One or two words max]", maxHeadlineWords: 3, usesAllCaps: false, punctuationStyle: "none" },
      spacingRhythm: "ultra-generous",
      navStyle: "editorial-serif",
    },
  };

  return systems[category] || {
    displayFont: "'Georgia', serif",
    bodyFont: "'Georgia', serif",
    monoFont: "'Courier New', monospace",
    copyVoice: { tone: "cool-minimal", headlinePattern: "[Verb] [Noun]", maxHeadlineWords: 6, usesAllCaps: false, punctuationStyle: "none" },
    spacingRhythm: "balanced",
    navStyle: "minimal-transparent",
  };
}

function buildDirectionSpecs(
  category: CategoryKey,
  field: SemanticField
): Record<DirectionKey, DirectionWorldSpec> {
  // Build specs for all 6 directions
  const directions: DirectionKey[] = ["premium-dark", "minimal-clean", "bold-experimental", "luxury-editorial", "genz-vibrant", "orchestra-style"];
  const specs = {} as Record<DirectionKey, DirectionWorldSpec>;

  for (const dir of directions) {
    specs[dir] = buildSingleDirectionSpec(dir, category, field);
  }
  return specs;
}

function buildSingleDirectionSpec(
  direction: DirectionKey,
  category: CategoryKey,
  field: SemanticField
): DirectionWorldSpec {
  const primaryQuery = field.primarySubjects[0];

  const heroConfigs: Record<DirectionKey, DirectionWorldSpec["hero"]> = {
    "premium-dark": {
      mediaApproach: "css-atmospheric",
      compositionRule: "left-type-right-image",
      atmosphereIntensity: 0.85,
      focalImageRole: "supporting",
      typographyScale: "large-display",
    },
    "minimal-clean": {
      mediaApproach: "single-focal",
      compositionRule: "centered-isolated",
      atmosphereIntensity: 0.1,
      focalImageRole: "dominant",
      typographyScale: "editorial-medium",
    },
    "bold-experimental": {
      mediaApproach: "collage-grid",
      compositionRule: "grid-collision",
      atmosphereIntensity: 0.4,
      focalImageRole: "dominant",
      typographyScale: "massive-80vw",
    },
    "luxury-editorial": {
      mediaApproach: "full-bleed-editorial",
      compositionRule: "editorial-split",
      atmosphereIntensity: 0.2,
      focalImageRole: "dominant",
      typographyScale: "editorial-medium",
    },
    "genz-vibrant": {
      mediaApproach: "collage-grid",
      compositionRule: "type-over-full-bleed",
      atmosphereIntensity: 0.5,
      focalImageRole: "dominant",
      typographyScale: "large-display",
    },
    "orchestra-style": {
      mediaApproach: "css-atmospheric",
      compositionRule: "left-type-right-image",
      atmosphereIntensity: 0.65,
      focalImageRole: "supporting",
      typographyScale: "large-display",
    },
  };

  return {
    hero: heroConfigs[direction],
    storyArc: STORY_ARCS[category]?.[direction] || [],
    slotInstructions: {
      "hero-atmosphere": {
        queryTemplate: `${field.ambientElements[0]} ${field.lightingProfile.quality}`,
        requiredElements: field.primarySubjects.slice(0, 2),
        forbiddenElements: field.hardBlocklist.slice(0, 5),
        compositionHint: "full-bleed-texture",
        aspectRatio: "16/9",
        lightingMatch: field.lightingProfile.temperature === "warm" ? "warm" : "cool",
      },
      "hero-focal": {
        queryTemplate: `${field.primarySubjects[0]} ${field.lightingProfile.quality}`,
        requiredElements: [field.primarySubjects[0]],
        forbiddenElements: field.hardBlocklist.slice(0, 8),
        compositionHint: "center-subject",
        aspectRatio: "3/2",
        lightingMatch: field.lightingProfile.temperature === "warm" ? "warm" : "cool",
      },
      "feature-card": {
        queryTemplate: `${field.secondarySubjects[0]} clean background`,
        requiredElements: field.secondarySubjects.slice(0, 1),
        forbiddenElements: field.hardBlocklist.slice(0, 5),
        compositionHint: "isolated-product",
        aspectRatio: "1/1",
        lightingMatch: "clean",
      },
      "ambient-texture": {
        queryTemplate: `${field.ambientElements[0]}`,
        requiredElements: [],
        forbiddenElements: field.hardBlocklist.slice(0, 5),
        compositionHint: "full-bleed-texture",
        aspectRatio: "16/9",
        lightingMatch: "any",
      },
      "social-proof": {
        queryTemplate: `${field.primarySubjects[2] || field.primarySubjects[0]} person lifestyle`,
        requiredElements: [],
        forbiddenElements: field.hardBlocklist,
        compositionHint: "environmental",
        aspectRatio: "3/2",
        lightingMatch: "any",
      },
      "product-hero": {
        queryTemplate: `${field.secondarySubjects[0]} white background studio`,
        requiredElements: [],
        forbiddenElements: field.hardBlocklist.slice(0, 5),
        compositionHint: "isolated-product",
        aspectRatio: "1/1",
        lightingMatch: "clean",
      },
      "editorial-spread": {
        queryTemplate: `${field.primarySubjects[1] || field.primarySubjects[0]} editorial`,
        requiredElements: [],
        forbiddenElements: field.hardBlocklist.slice(0, 8),
        compositionHint: "rule-of-thirds",
        aspectRatio: "2/3",
        lightingMatch: field.lightingProfile.temperature === "warm" ? "warm" : "cool",
      },
    },
  };
}
