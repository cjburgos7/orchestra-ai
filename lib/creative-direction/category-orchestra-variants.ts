/**
 * Premium Modern concept variants — ALL categories.
 * Default Orchestra identity: visually rich, interactive, image-led, alive — NOT dark cinematic.
 */

import type { CreativeConcept } from "./engine";

type VariantConcepts = Record<string, CreativeConcept>;

const SOFTWARE_SAAS: VariantConcepts = {
  "software-saas::orchestra": {
    coreIdea: "Great software deserves a launch site as confident as the product itself.",
    emotion: "trust",
    tension: { force1: "complex capability", force2: "effortless clarity" },
    heroMoment: "Product UI floating in bright space — one metric climbing, everything else crisp.",
    typeAttitude: "Apple keynote confidence. Clean sans, generous scale, never shouty.",
    imageTreatmentRule: "Bright studio light, real product in context, saturated but controlled color.",
    pacingMetaphor: "Scrolling an elite startup launch — each beat reveals capability.",
    densityFeeling: "Image-rich hero, dynamic feature bands, proof without clutter.",
  },
  "software-saas::orchestra-launch": {
    coreIdea: "Ship day energy — the site moves as fast as the team.",
    emotion: "creative hunger",
    tension: { force1: "startup velocity", force2: "premium polish" },
    heroMoment: "Split hero — bold headline left, animated product mosaic right.",
    typeAttitude: "Mixed scale headlines. Momentum in every scroll.",
    imageTreatmentRule: "Warm natural light, real desks, UI detail macros, film grain optional.",
    pacingMetaphor: "The first hour of a productive session — fast handoffs.",
    densityFeeling: "Packed visual rhythm with surprise every third section.",
  },
  "software-saas::orchestra-agency": {
    coreIdea: "Agency-grade craft — every pixel earns its place.",
    emotion: "precision",
    tension: { force1: "design ambition", force2: "product truth" },
    heroMoment: "Full-bleed product film still — interface as hero, environment secondary.",
    typeAttitude: "Tracked caps eyebrows, large display, editorial restraint.",
    imageTreatmentRule: "Cinematic but bright — golden hour offices, macro UI, layered depth.",
    pacingMetaphor: "Walking a premium portfolio — stop when compelled.",
    densityFeeling: "Viewport choreography — one big moment per screen.",
  },
};

const FINANCE_FINTECH: VariantConcepts = {
  "finance-fintech::orchestra": {
    coreIdea: "Money apps should feel as clear as the numbers they show.",
    emotion: "trust",
    tension: { force1: "financial complexity", force2: "human simplicity" },
    heroMoment: "Dashboard on white — green accent, one graph climbing, calm confidence.",
    typeAttitude: "Stable, accessible, premium without stiffness.",
    imageTreatmentRule: "Clean UI-forward, soft gradients, no cash clichés.",
    pacingMetaphor: "Onboarding that respects your time.",
    densityFeeling: "Trust hero, dense proof mid-scroll, gentle CTA.",
  },
  "finance-fintech::orchestra-consumer": {
    coreIdea: "Finance for people who hate finance apps — finally.",
    emotion: "joyful ownership",
    tension: { force1: "money anxiety", force2: "playful control" },
    heroMoment: "Phone showing savings goal — confetti implied through color, not clipart.",
    typeAttitude: "Friendly lowercase moments, celebration without cringe.",
    imageTreatmentRule: "Bright UI, warm accents, lifestyle context shots.",
    pacingMetaphor: "Scrolling a feed that actually helps you.",
    densityFeeling: "Card-rich, short beats, forward motion.",
  },
  "finance-fintech::orchestra-wealth": {
    coreIdea: "Wealth deserves clarity — not marble lobby cosplay.",
    emotion: "contemplation",
    tension: { force1: "generational capital", force2: "modern access" },
    heroMoment: "Portfolio overview — elegant typography, soft light, one golden accent line.",
    typeAttitude: "Serif display with modern sans body. Quiet authority.",
    imageTreatmentRule: "Editorial light, architectural interiors, abstract finance textures.",
    pacingMetaphor: "A long read that rewards patience.",
    densityFeeling: "Sparse luxury beats with dense proof pockets.",
  },
};

const SPORTS_ANALYTICS: VariantConcepts = {
  "sports-analytics::orchestra": {
    coreIdea: "The game was always in the data — now the site shows it beautifully.",
    emotion: "controlled intensity",
    tension: { force1: "athletic power", force2: "analytical clarity" },
    heroMoment: "Arena at golden hour — data overlay composited naturally, not pasted on.",
    typeAttitude: "Stats as display type. Labels as whispers.",
    imageTreatmentRule: "Bright arena photography, environment-first, data in-world.",
    pacingMetaphor: "Watching game film — pause, rewind, decide.",
    densityFeeling: "Atmospheric hero, data-dense mid-scroll, kinetic CTA.",
  },
  "sports-analytics::orchestra-fan": {
    coreIdea: "Fans feel the game — the site matches that energy.",
    emotion: "visceral excitement",
    tension: { force1: "crowd energy", force2: "personal insight" },
    heroMoment: "Stadium panorama — scoreboard sharp, crowd as color wash.",
    typeAttitude: "Bold sans, high energy, team color as accent only.",
    imageTreatmentRule: "Saturated team colors, motion blur, crowd atmosphere — bright.",
    pacingMetaphor: "Fast breaks between beats.",
    densityFeeling: "Colliding image sections, no dead air.",
  },
};

const FASHION: VariantConcepts = {
  "fashion-apparel::orchestra": {
    coreIdea: "Fashion online should feel like opening a lookbook — not a catalog.",
    emotion: "desire",
    tension: { force1: "the garment", force2: "the scroll" },
    heroMoment: "Full-bleed editorial — model in motion, headline minimal, image dominates.",
    typeAttitude: "Tall thin serif or bold sans — one line, maximum impact.",
    imageTreatmentRule: "Editorial daylight, studio drama without black voids, motion implied.",
    pacingMetaphor: "Walking through a museum — stop when compelled.",
    densityFeeling: "One image per viewport rhythm with collection grids.",
  },
  "fashion-apparel::orchestra-street": {
    coreIdea: "Drop culture moves fast — the site keeps up.",
    emotion: "visceral excitement",
    tension: { force1: "street energy", force2: "premium craft" },
    heroMoment: "Sneaker mid-air, concrete and sky — flash photography, not moody alley.",
    typeAttitude: "Impact caps, collage energy, mixed scale.",
    imageTreatmentRule: "High contrast daylight, urban texture, saturated accents.",
    pacingMetaphor: "Fast breaks through a drop.",
    densityFeeling: "Grid-breaking density, drops as rhythm.",
  },
};

const CREATOR: VariantConcepts = {
  "creator-tools::orchestra": {
    coreIdea: "Creators deserve tools that look as good as their content.",
    emotion: "creative hunger",
    tension: { force1: "the grind", force2: "the payoff" },
    heroMoment: "Creator setup in natural light — window light on, analytics climbing.",
    typeAttitude: "Conversational warmth, bold CTAs, social-native hierarchy.",
    imageTreatmentRule: "Real setups, warm LED optional, authentic environments.",
    pacingMetaphor: "First hour of flow state.",
    densityFeeling: "Visual pops every third section.",
  },
  "creator-tools::orchestra-community": {
    coreIdea: "Creators grow together — the site feels like a network, not a tool.",
    emotion: "joyful ownership",
    tension: { force1: "solo craft", force2: "shared momentum" },
    heroMoment: "Grid of creator moments — diverse, mid-laugh, same platform glow.",
    typeAttitude: "Social-native, feels like a great DM thread.",
    imageTreatmentRule: "Warm, authentic, slightly overexposed, lifestyle-first.",
    pacingMetaphor: "Scrolling a great grid at 2am.",
    densityFeeling: "Packed social proof, fast handoffs.",
  },
};

const WELLNESS: VariantConcepts = {
  "wellness-mindfulness::orchestra": {
    coreIdea: "Calm technology — the app disappears, the feeling stays.",
    emotion: "permission",
    tension: { force1: "modern urgency", force2: "designed stillness" },
    heroMoment: "Figure small in vast landscape — lifted whites, soft green accent.",
    typeAttitude: "Thin, tracked, generous leading. Every sentence a breath.",
    imageTreatmentRule: "Outdoor dawn light, desaturated calm, never clinical.",
    pacingMetaphor: "Meditation — the pause is the product.",
    densityFeeling: "Radical sparsity with one dense proof section.",
  },
  "wellness-mindfulness::orchestra-modern": {
    coreIdea: "Mental health apps should feel like opening a window.",
    emotion: "trust",
    tension: { force1: "digital noise", force2: "designed silence" },
    heroMoment: "Phone showing timer — infinite white space around it.",
    typeAttitude: "Light weight, soft confidence, rounded warmth.",
    imageTreatmentRule: "Clean product in context, soft gradients, natural light.",
    pacingMetaphor: "Breathing in. Breathing out.",
    densityFeeling: "Barely anything on screen at once.",
  },
};

const FOOD_BEVERAGE: VariantConcepts = {
  "food-beverage::orchestra": {
    coreIdea: "Food is visual — the site should make you hungry before you read.",
    emotion: "desire",
    tension: { force1: "chef craft", force2: "accessible delivery" },
    heroMoment: "Plated dish in natural window light — steam, color, appetite.",
    typeAttitude: "Serif elegance meets modern sans. Menu as poetry.",
    imageTreatmentRule: "Bright food photography, shallow depth, no dark void plating.",
    pacingMetaphor: "Course by course — unhurried but vivid.",
    densityFeeling: "Image-heavy sections with menu rhythm.",
  },
  "food-beverage::orchestra-neighborhood": {
    coreIdea: "Your corner spot — elevated but never pretentious.",
    emotion: "organic warmth",
    tension: { force1: "neighborhood soul", force2: "modern delivery" },
    heroMoment: "Bistro window glow — daylight warmth, community visible.",
    typeAttitude: "Warm serif, conversational copy.",
    imageTreatmentRule: "Warm grain, amber light, candid dining.",
    pacingMetaphor: "Sunday morning before crowds.",
    densityFeeling: "Story and sourcing woven together.",
  },
};

const HEALTH: VariantConcepts = {
  "health-medical::orchestra": {
    coreIdea: "Healthcare deserves dignity — bright, human, trustworthy.",
    emotion: "trust",
    tension: { force1: "medical complexity", force2: "human reassurance" },
    heroMoment: "Clean clinic corridor — light at the end, calm not sterile.",
    typeAttitude: "Stable, accessible, never alarming.",
    imageTreatmentRule: "Soft clinical, real environments, diverse patients implied.",
    pacingMetaphor: "Breathing in. Breathing out.",
    densityFeeling: "Trust first, proof dense, CTA gentle.",
  },
  "health-medical::orchestra-compassion": {
    coreIdea: "Healing is human connection first.",
    emotion: "permission",
    tension: { force1: "vulnerability", force2: "professional care" },
    heroMoment: "Hands holding — warm light, intimate not stock.",
    typeAttitude: "Soft, slow, generous line height.",
    imageTreatmentRule: "Intimate, warm daylight, no staged smiles.",
    pacingMetaphor: "Meditation pace.",
    densityFeeling: "Sparse emotional beats.",
  },
};

const EDUCATION: VariantConcepts = {
  "education-learning::orchestra": {
    coreIdea: "Learning should feel like discovery — bright, curious, alive.",
    emotion: "creative hunger",
    tension: { force1: "curiosity", force2: "structured path" },
    heroMoment: "Student lit by laptop — notes everywhere, focus absolute, warm desk lamp.",
    typeAttitude: "Encouraging, clear, momentum-building.",
    imageTreatmentRule: "Real study environments, warm desk light, colorful accents ok.",
    pacingMetaphor: "First hour of flow state.",
    densityFeeling: "Feature rhythm with social proof pockets.",
  },
  "education-learning::orchestra-playful": {
    coreIdea: "Learning is play for people who forgot it's allowed.",
    emotion: "joyful ownership",
    tension: { force1: "game energy", force2: "real skill" },
    heroMoment: "Gamified progress hitting 100% — bright UI, implied celebration.",
    typeAttitude: "Mixed scale, fun without childish.",
    imageTreatmentRule: "Bright UI accents, colorful illustrations welcome.",
    pacingMetaphor: "Instagram grid energy.",
    densityFeeling: "Short beats, constant reward.",
  },
};

const HOME: VariantConcepts = {
  "home-living::orchestra": {
    coreIdea: "Home is the ultimate editorial — lived in, beautifully lit.",
    emotion: "contemplation",
    tension: { force1: "designed perfection", force2: "authentic living" },
    heroMoment: "Living room at golden hour — one lamp, long shadows, inviting.",
    typeAttitude: "Serif quiet, magazine pacing.",
    imageTreatmentRule: "Interior editorial, warm tungsten, wide shots, bright windows.",
    pacingMetaphor: "Walking through a showroom you'd actually live in.",
    densityFeeling: "One room per screen rhythm.",
  },
  "home-living::orchestra-cozy": {
    coreIdea: "Cozy is a design decision — warmth engineered.",
    emotion: "organic warmth",
    tension: { force1: "hygge texture", force2: "modern commerce" },
    heroMoment: "Knit throw, window light, coffee steam — tactile close-up.",
    typeAttitude: "Soft serif, invitation not sales.",
    imageTreatmentRule: "Warm grain, amber daylight, macro textiles.",
    pacingMetaphor: "Sunday morning market.",
    densityFeeling: "Story-led, sourcing woven in.",
  },
};

const TRAVEL: VariantConcepts = {
  "travel-experience::orchestra": {
    coreIdea: "Travel is transformation — the site should feel like departure.",
    emotion: "desire",
    tension: { force1: "wanderlust", force2: "curated ease" },
    heroMoment: "Airplane window — clouds below, golden hour, infinite horizon.",
    typeAttitude: "Serif wanderlust. Evocative, not brochure.",
    imageTreatmentRule: "Landscape cinematic, golden hour, no tourist crowds.",
    pacingMetaphor: "Long read in a quiet room.",
    densityFeeling: "Atmospheric dominates, proof sparse.",
  },
  "travel-experience::orchestra-adventure": {
    coreIdea: "Adventure is the point — comfort is how you recover.",
    emotion: "visceral excitement",
    tension: { force1: "raw terrain", force2: "expert guidance" },
    heroMoment: "Cliff edge trail — boots forward, valley infinite, bright sky.",
    typeAttitude: "Bold sans, action verbs.",
    imageTreatmentRule: "Wide landscape, motion, saturated nature in daylight.",
    pacingMetaphor: "Fast breaks between vistas.",
    densityFeeling: "Kinetic collage of destinations.",
  },
};

const FRESH_PRODUCE: VariantConcepts = {
  "fresh-produce::orchestra": {
    coreIdea: "Produce this fresh deserves sunlight — not a black void.",
    emotion: "joyful ownership",
    tension: { force1: "natural abundance", force2: "modern delivery" },
    heroMoment: "Market flat lay in morning light — color as hero, juice catching sun.",
    typeAttitude: "Clean bold sans. Fresh, confident, appetizing.",
    imageTreatmentRule: "Natural light, high saturation, white or warm wood surfaces.",
    pacingMetaphor: "Sunday morning farmers market before crowds.",
    densityFeeling: "Image-heavy grids with collection rhythm.",
  },
  "fresh-produce::orchestra-farm": {
    coreIdea: "From farm to door — the journey is the brand.",
    emotion: "organic warmth",
    tension: { force1: "agricultural rawness", force2: "curated boxes" },
    heroMoment: "Farmer hands holding harvest — golden hour, dirt and all.",
    typeAttitude: "Warm serif, story-first headlines.",
    imageTreatmentRule: "Documentary golden hour, landscape format, environment visible.",
    pacingMetaphor: "A long read in a quiet room.",
    densityFeeling: "Story and sourcing alternate with product grids.",
  },
  "fresh-produce::orchestra-vibrant": {
    coreIdea: "Fruit is the original aesthetic — loud, juicy, alive.",
    emotion: "tropical vitality",
    tension: { force1: "sun-drenched chaos", force2: "clean modern delivery" },
    heroMoment: "Mango halves on white marble — juice catching light like gems.",
    typeAttitude: "Bold sans confidence. Headlines feel energetic not whispered.",
    imageTreatmentRule: "High saturation, bright exposure, warm highlights.",
    pacingMetaphor: "Scrolling through a market at golden hour.",
    densityFeeling: "Image-heavy sections stacked tight.",
  },
};

export const CATEGORY_ORCHESTRA_VARIANTS: VariantConcepts = {
  ...SOFTWARE_SAAS,
  ...FINANCE_FINTECH,
  ...SPORTS_ANALYTICS,
  ...FASHION,
  ...CREATOR,
  ...WELLNESS,
  ...FOOD_BEVERAGE,
  ...HEALTH,
  ...EDUCATION,
  ...HOME,
  ...TRAVEL,
  ...FRESH_PRODUCE,
};
