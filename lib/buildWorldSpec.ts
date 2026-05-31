/**
 * buildWorldSpec — the single spec producer.
 *
 * Flow:
 *   1. selectFoundation(brief)  — pure logic, no API
 *   2. claudeContentCall        — ONE Claude call fills all text + imageSubject per section
 *   3. contaminationGuard       — strips/rejects imageSubjects containing banned words
 *   4. buildWorldV2             — maps foundation + spec → WorldV2Package (images via Flux)
 *   5. returns { worldV2, sections } — compatible with GeneratedWorldV2 renderer
 *
 * Replaces: 3× chatCompletionJSON (GPT) + callClaudeWorldArchitect
 */

import type { StartupBrief, GeneratedSections, Foundation1Slots } from "@/lib/types/startup";
import { claudeCompletionJSON } from "@/lib/orchestration/claude-client";
import { selectFoundation, getFoundation } from "@/lib/foundations";
import type { Foundation } from "@/lib/foundations";
import { buildWorldV2 } from "@/lib/world-v2/build-world-v2";
import { injectFluxHero, generateFluxHeroImage } from "@/lib/world-v2/flux-generation";
import { generateGPTImage } from "@/lib/world-v2/gpt-image-generation";
import type { V2CategoryKey } from "@/lib/world-v2/types";
import type { WorldV2Package, V2SectionType } from "@/lib/world-v2/types";
import type { ClaudeWorldSpec } from "@/lib/world-v2/claude-world-architect";
import { DEFAULT_F1_SLOTS } from "@/app/components/foundations/Foundation1";
import { fetchFromDallE, getProviderConfig } from "@/lib/image-providers";
import { DALLE_PROMPTS } from "@/lib/image-prompts";

// ─── Contamination guard ──────────────────────────────────────────────────────

const CONTAMINATION_WORDS = [
  "intelligence", "platform", "app", "data", "tech", "AI", "galaxy",
  "software", "algorithm", "machine learning", "neural", "digital",
  "analytics", "dashboard", "API", "cloud", "SaaS",
];

function isContaminated(imageSubject: string, startupName: string): boolean {
  const lower = imageSubject.toLowerCase();
  if (lower.includes(startupName.toLowerCase())) return true;
  return CONTAMINATION_WORDS.some((w) => lower.includes(w.toLowerCase()));
}

function stripContamination(imageSubject: string, startupName: string): string {
  let clean = imageSubject.replace(new RegExp(startupName, "gi"), "").trim();
  for (const word of CONTAMINATION_WORDS) {
    clean = clean.replace(new RegExp(`\\b${word}\\b`, "gi"), "").trim();
  }
  // Collapse multiple spaces
  return clean.replace(/\s{2,}/g, " ").trim();
}

// ─── System prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(foundation: Foundation): string {
  const sectionNames = foundation.sectionSequence.join(", ");
  return `You are Orchestra AI's content architect. You fill content slots for a startup's website.

The website structure is FIXED — it has these sections in this order: ${sectionNames}

You fill ONLY content: headlines, body copy, CTAs, testimonials, and an imageSubject for each section.

RULES FOR imageSubject (most critical):
- Describe a PHYSICAL SCENE: light quality, material surface, environment, texture, time of day
- NEVER mention: the startup name, product category nouns, or any of these words: intelligence, platform, app, data, tech, AI, galaxy, software, digital, analytics, dashboard, API, cloud, SaaS
- NEVER describe people or faces
- Good examples: "morning light diffracting through heavy glass onto worn oak", "empty concrete floor before dawn, single overhead beam, chalk dust in the air"
- Bad examples: "yoga studio with mats", "fitness platform interface", "AI dashboard screen"

RULES FOR headlines and body:
- Write from the startup's specific emotional truth — not from category conventions
- No generic phrases: "cutting-edge", "seamless", "game-changing", "world-class", "innovative"
- Body copy should feel like a human with conviction wrote it

Return ONLY valid JSON with this exact shape:
{
  "sections": {
    "[section-type]": { [contentSlotKey]: "value" }
  },
  "navbar": { "brandLabel": "string", "ctaLabel": "string" },
  "footer": { "tagline": "string" }
}

Valid section types for this foundation: ${sectionNames}`;
}

// ─── Content fetch ────────────────────────────────────────────────────────────

type SectionContent = Record<string, string>;
type SpecContent = {
  sections: Record<string, SectionContent>;
  navbar: { brandLabel: string; ctaLabel: string };
  footer: { tagline: string };
};

async function fetchSpecContent(
  brief: StartupBrief,
  foundation: Foundation
): Promise<SpecContent | undefined> {
  const slotSummary = foundation.sectionSequence.map((type) => {
    const slots = foundation.contentSlots[type] ?? [];
    const required = slots.filter((s) => s.required).map((s) => `${s.key} (max ${s.maxWords} words: ${s.description})`);
    return `${type}:\n${required.map((s) => `  - ${s}`).join("\n")}`;
  }).join("\n\n");

  const userContent = [
    `Startup: ${brief.name}`,
    `Tagline: ${brief.tagline}`,
    `Description: ${brief.description}`,
    brief.brandPersonality ? `Brand personality: ${brief.brandPersonality}` : null,
    brief.founderMission ? `Founder mission: ${brief.founderMission}` : null,
    brief.marketPositioning ? `Market positioning: ${brief.marketPositioning}` : null,
    brief.audience ? `Audience: ${brief.audience}` : null,
    brief.brandTone ? `Brand tone: ${brief.brandTone}` : null,
    `\nFill these content slots:\n${slotSummary}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const result = await claudeCompletionJSON<unknown>({
      temperature: 0.75,
      system: buildSystemPrompt(foundation),
      messages: [{ role: "user", content: userContent }],
    });

    if (!result || typeof result !== "object") return undefined;
    const obj = result as Record<string, unknown>;
    if (!obj.sections || !obj.navbar) return undefined;
    return result as SpecContent;
  } catch (err) {
    console.warn("[buildWorldSpec] content fetch failed:", (err as Error)?.message ?? err);
    return undefined;
  }
}

// ─── Map spec content → GeneratedSections ────────────────────────────────────

function specToSections(
  content: SpecContent,
  brief: StartupBrief,
  foundation: Foundation
): GeneratedSections {
  const s = content.sections;
  const heroType = foundation.sectionSequence[0];
  const heroContent = s[heroType] ?? {};

  // Gather features from feature-asymmetric sections
  const featureSections = foundation.sectionSequence
    .filter((t) => t === "feature-asymmetric")
    .map((t, i) => {
      const c = (Array.isArray(s[t]) ? (s[t] as unknown as SectionContent[])[i] : s[t]) ?? {};
      return {
        title: c.headline ?? `Feature ${i + 1}`,
        description: c.body ?? "",
      };
    });

  // Gather testimonials from testimonial-float or proof-gallery
  const testimonials: GeneratedSections["testimonials"] = [];
  const tfContent = s["testimonial-float"];
  if (tfContent?.quote) {
    testimonials.push({ quote: tfContent.quote, name: tfContent.name ?? "Customer", role: tfContent.role ?? "" });
  }
  const pgContent = s["proof-gallery"];
  if (pgContent) {
    for (let i = 1; i <= 3; i++) {
      if (pgContent[`quote${i}`]) {
        testimonials.push({
          quote: pgContent[`quote${i}`],
          name: pgContent[`name${i}`] ?? "Customer",
          role: pgContent[`role${i}`] ?? "",
        });
      }
    }
  }

  const ctaContent = s["cta-immersive"] ?? {};
  const statsContent = s["stats-band"] ?? {};

  return {
    navbar: {
      brandLabel: content.navbar?.brandLabel ?? brief.name,
      ctaLabel: content.navbar?.ctaLabel ?? "Get Started",
    },
    hero: {
      eyebrow: heroContent.eyebrow ?? heroContent.statLabel ?? "",
      headline: heroContent.headline ?? brief.tagline,
      subheadline: heroContent.subheadline ?? brief.description,
      ctaPrimary: heroContent.ctaPrimary ?? "Get Started",
      ctaSecondary: heroContent.ctaSecondary ?? "Learn More",
    },
    features: {
      sectionTitle: pgContent?.sectionTitle ?? "What we offer",
      items: featureSections.length > 0 ? featureSections : [
        { title: "Core feature", description: brief.description },
      ],
    },
    testimonials: testimonials.length > 0 ? testimonials : [
      { quote: "Exactly what we needed.", name: "A customer", role: "" },
    ],
    pricing: {
      sectionTitle: "Simple pricing",
      subtitle: "Everything you need, nothing you don't.",
    },
    faq: [
      { question: "How does it work?", answer: brief.description },
      { question: "Who is this for?", answer: brief.audience ?? "Anyone who needs this." },
      { question: "How do I get started?", answer: "Click the button above to begin." },
    ],
    cta: {
      headline: ctaContent.headline ?? "Ready to start?",
      subheadline: ctaContent.subheadline ?? "Join today.",
      buttonText: ctaContent.buttonText ?? "Get Started",
    },
    footer: {
      tagline: content.footer?.tagline ?? brief.tagline,
    },
  };
}

// ─── Map spec content → ClaudeWorldSpec (for Flux anchors) ───────────────────

function specToClaudeWorldSpec(
  content: SpecContent,
  foundation: Foundation,
  brief: StartupBrief
): ClaudeWorldSpec {
  const sections = foundation.sectionSequence.map((type, i) => {
    const c = content.sections[type] ?? {};
    let imageSubject = c.imageSubject ?? c.imageSubject1 ?? foundation.lightingModel;

    // Contamination guard — strip if needed
    if (isContaminated(imageSubject, brief.name)) {
      imageSubject = stripContamination(imageSubject, brief.name);
      console.warn(`[buildWorldSpec] contamination stripped from section ${i} (${type})`);
    }
    if (!imageSubject || imageSubject.length < 10) {
      imageSubject = foundation.lightingModel;
    }

    return {
      type,
      headline: c.headline ?? "",
      subtext: c.subheadline ?? c.body ?? "",
      imageSceneDescription: imageSubject,
      layoutHint: foundation.layoutArchetype,
    };
  });

  return {
    sections,
    visualIdentity: {
      mood: foundation.lightingModel.slice(0, 40),
      motionFeel: foundation.motion.scroll === "parallax" ? "cinematic"
        : foundation.motion.scroll === "drift" ? "editorial"
        : foundation.motion.enter === "slide-up" ? "energetic"
        : "calm",
      palette: foundation.palette,
      typographyPersonality: foundation.typographyPersonality,
      lightingModel: foundation.lightingModel,
    },
    worldStatement: `${brief.name} — ${brief.tagline}`,
    storyArcReasoning: `Foundation: ${foundation.name}. Section sequence chosen by brief signal scoring.`,
  };
}

// ─── Foundation #1 content generation ────────────────────────────────────────

// ─── Category → V2CategoryKey mapper ─────────────────────────────────────────

function briefToV2Category(brief: StartupBrief): V2CategoryKey {
  const text = [
    brief.name ?? "",
    brief.startupCategory ?? "",
    brief.description ?? "",
    brief.tagline ?? "",
    brief.brandTone ?? "",
  ].join(" ").toLowerCase();

  // Natural / physical world — must stay above tech to avoid "app" contamination
  if (/floral|flower|bouquet|bloom|botanical|florist/.test(text)) return "floral";
  if (/fitness|gym|workout|training|athlete|run|crossfit|weightlift/.test(text)) return "fitness";
  if (/fashion|style|cloth|apparel|wear|couture|garment|outfit/.test(text)) return "fashion";
  if (/wellness|spa|meditation|yoga|mindful|holistic/.test(text)) return "wellness";
  if (/travel|hotel|resort|adventure|journey|destination|tourism/.test(text)) return "travel";
  if (/home|interior|decor|furniture|architecture|real estate|property|renovation/.test(text)) return "home";
  if (/music|audio|sound|band|artist|record|concert|sonic|dj|playlist/.test(text)) return "music";
  if (/sport(?!s app)|athletic team|coaching|league/.test(text)) return "sports";

  // Food — explicit fruit/produce tokens first, then generic food
  if (/fruit|produce|harvest|berry|berri|citrus|orchard|mango|peach|grape|lemon|avocado/.test(text)) return "food";
  if (/food|restaurant|cafe|culinary|chef|dining|beverage|meal|recipe|grocery|catering/.test(text)) return "food";

  // Finance / legal / business
  if (/finance|invest|wealth|money|banking|fund|capital|fintech|payment|crypto|blockchain|nft|defi/.test(text)) return "finance";
  if (/legal|law|attorney|lawyer|contract|compliance|regulatory/.test(text)) return "education";

  // Health / medical
  if (/health|medical|clinic|doctor|therapy|mental health|telemedicine|biotech|pharma/.test(text)) return "health";

  // Education
  if (/education|learning|course|tutor|school|teach|academic|e-learning|upskill/.test(text)) return "education";

  // Space / astronomy / cosmology — map to science; covers stargazing AR apps
  if (/space|star(?:s|gazing|map)|galaxy|planet|cosmos|constellation|telescope|observatory|astronomy|astronaut|orbit|lunar|mars|nasa|celestial|solar system|planetarium|night sky/.test(text)) return "science";

  // Science & research (non-space)
  if (/science|research|lab|biotech|pharma|innovation|quantum|genomic|climate|energy|nuclear/.test(text)) return "science";

  // Creator / media
  if (/creator|podcast|video|content|influencer|media|studio|streaming|newsletter|social media/.test(text)) return "creator";

  // Technology / SaaS / mobile — broad catch-all for digital products
  if (/saas|software|platform|app|tech|ai\b|machine learning|data|cloud|api|developer|mobile|ar\b|vr\b|augmented|virtual reality|automation|robotics|iot/.test(text)) return "saas";

  // Default — "saas" gives a clean tech Pexels image, far better than "creator" for most unknowns
  return "saas";
}


async function generateF1HeroImage(brief: StartupBrief, category: V2CategoryKey): Promise<string | null> {
  try {
    const config = getProviderConfig();
    if (!config.openAiApiKey) return null;
    const prompt = DALLE_PROMPTS[category] ?? DALLE_PROMPTS.creator;
    const result = await fetchFromDallE(prompt, config);
    return result?.url ?? null;
  } catch (err) {
    console.warn("[buildWorldSpec] DALL-E hero generation failed:", (err as Error)?.message ?? err);
    return null;
  }
}

/** Curated Pexels photo IDs — [hero, editorial] — category-verified */
const F1_PHOTOS: Record<V2CategoryKey, [number, number]> = {
  floral:    [56866,   207518],   // roses close-up, pink wildflowers
  fitness:   [1552242, 416778],   // athlete training
  finance:   [351264,  3483098],  // financial charts / clean office
  fashion:   [1648377, 4202926],  // fashion editorial
  food:      [1640777, 3184291],  // artisan food spread
  wellness:  [3756165, 1279107],  // spa / calm wellness
  travel:    [346885,  1108101],  // dramatic landscape
  home:      [1571463, 3990562],  // Scandinavian interior
  education: [256490,  3393382],  // books / focused study
  health:    [4386467, 3786111],  // clean clinical / health tech
  creator:   [3062541, 3585798],  // camera / creative workspace
  sports:    [248547,  1552105],  // sports action
  music:     [164938,  1626481],  // vinyl / studio atmosphere
  science:   [1169754, 998641],   // Milky Way galaxy / space nebula
  saas:      [1181271, 3861969],  // laptop / minimal tech workspace
};

function pexelsUrl(id: number, w = 1920, h = 1080): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;
}

function getF1Images(category: V2CategoryKey): { heroUrl: string; editorialUrl: string } {
  const [heroId, editorialId] = F1_PHOTOS[category];
  return {
    heroUrl:      pexelsUrl(heroId),
    editorialUrl: pexelsUrl(editorialId, 1400, 900),
  };
}

// ─── Foundation #1 system prompt ─────────────────────────────────────────────

const F1_SYSTEM_PROMPT = `You are filling content for a full cinematic website. The layout is FIXED — white/black, Instrument Serif headings, clean minimal structure. You adapt the WORDS, TONE, and CONTENT to this specific business. Every business gets the same premium template; only content changes.

RULES:
- logoText: business name exactly. No extra words.
- navItems: 5 items. First is "Home" (muted: false). Other 4 are logical nav sections for THIS business type. All muted: true.
- navCtaLabel: 2–4 word action specific to this business ("Order Now", "Book a Call", "Get Started", "See Our Work").
- headline: 6–10 words. Poetic, emotional, specific to what this business REALLY does — not the product category. Must contain exactly 2 evocative fragments for italic emphasis.
- headlineItalicFragments: exactly 2 strings that are exact substrings of the headline (same casing, same punctuation).
- description: 2 sentences, 30–45 words. Specific emotional truth of this business. No platitudes.
- heroCtaLabel: 2–4 words. Same or variation of navCtaLabel.
- videoUrl: always "" — never invent a URL.
- imageUrl: always "".
- stats: exactly 3 objects. Each has value (a compelling metric: number, percentage, time, or award) and label (3–6 words describing it). Real-feeling numbers specific to this business type.
- process: exactly 3 objects. Each has step ("01", "02", "03"), title (3–5 words), body (20–30 words). The 3 core steps to work with or use this business. Specific and actionable.
- featuresTitle: 4–8 words introducing the features section.
- features: exactly 3 objects. Each has title (3–6 words) and body (25–40 words). Specific capabilities or value props. No generic filler.
- testimonials: exactly 2 objects. Each has quote (25–45 words, specific and emotional), name (first name + last initial), role (2–5 words).
- ctaHeadline: 5–9 words. The closing emotional invitation.
- ctaBody: 1–2 sentences, 20–35 words. What happens next.
- ctaButtonLabel: 2–4 words.

Return ONLY valid JSON:
{
  "logoText": "string",
  "navItems": [{ "label": "string", "href": "string", "muted": boolean }],
  "navCtaLabel": "string",
  "headline": "string",
  "headlineItalicFragments": ["string", "string"],
  "description": "string",
  "heroCtaLabel": "string",
  "videoUrl": "",
  "imageUrl": "",
  "stats": [{ "value": "string", "label": "string" }],
  "process": [{ "step": "string", "title": "string", "body": "string" }],
  "featuresTitle": "string",
  "features": [{ "title": "string", "body": "string" }],
  "testimonials": [{ "quote": "string", "name": "string", "role": "string" }],
  "ctaHeadline": "string",
  "ctaBody": "string",
  "ctaButtonLabel": "string"
}`;

// Category-locked 3D hero subjects for F2 (cosmic void) and F3 (obsidian surface)
// No raw description text — purely category-driven to prevent contamination
const F2_VOID_SUBJECT: Record<V2CategoryKey, string> = {
  science:   "NASA deep-space telescope suspended in a cosmic nebula void, volumetric stellar clouds and blue-violet aurora light rays, photon trails",
  saas:      "holographic crystal data sphere floating in infinite dark void, iridescent refracting light, geometric facets",
  finance:   "polished gold ingot and precision investment instrument suspended in deep financial void, cold blue rim light",
  fitness:   "carbon-fiber barbell floating weightless in dark void, motion blur trails, athletic energy",
  floral:    "single perfect orchid bloom suspended in liquid glass void, bioluminescent petals, ethereal atmospheric light",
  fashion:   "sculptural couture garment draped mid-air in fashion editorial void, silk in motion, deep negative space",
  food:      "one perfect culinary jewel — a precision-crafted dessert or molecular gastronomy sphere — floating in velvet void",
  wellness:  "polished obsidian wellness stone and white smoke wisps floating in serene dark atmospheric space",
  travel:    "antique brass compass and aged leather journal floating in cinematic journey void, golden light beams",
  home:      "Bauhaus architect's model floating in architectural void, warm amber light casting geometry shadows",
  education: "ancient leather-bound tome floating open in luminous void, golden light emanating from its pages",
  health:    "precision medical scanning device suspended in clinical blue void, electromagnetic energy field visualization",
  creator:   "Leica camera floating in studio void, lens flare catching the aperture, cinematic grain",
  sports:    "championship trophy or carbon-fiber helmet suspended in sports void, victory light halo",
  music:     "vintage vinyl record spinning in deep void, audio waveform visualization, amber warm reverb light",
};

const F3_OBSIDIAN_SUBJECT: Record<V2CategoryKey, string> = {
  science:   "ultra-precision telescope eyepiece or spacecraft navigation module on polished obsidian black surface, cold blue rim light from above",
  saas:      "sleek obsidian server blade or holographic circuit panel on matte black surface, electric blue trace light",
  finance:   "precision-milled gold ingot and titanium card on polished obsidian, single overhead dramatic beam",
  fitness:   "matte black titanium kettlebell on obsidian surface, aggressive directional lighting, power aesthetic",
  floral:    "single peony or calla lily on deep black lacquer surface, water droplets, rim light catching petals",
  fashion:   "haute couture shoe or luxury handbag on obsidian runway surface, fashion editorial drama lighting",
  food:      "black ceramic plate with single architectural plating on obsidian chef's surface, fine dining aesthetic",
  wellness:  "polished volcanic wellness stone set on dark spa slate, candle glow rim light",
  travel:    "premium leather passport holder and fountain pen on matte black travel surface, warm key light",
  home:      "Scandinavian design object — a matte ceramic or sculptural lamp — on dark architectural surface",
  education: "leather-bound notebook and gold pen on obsidian desk surface, focused reading light",
  health:    "clinical biometric sensor or wearable health device on matte black medical surface, precision rim light",
  creator:   "mirrorless camera body on obsidian studio surface, studio strobe rim light catching precision glass",
  sports:    "carbon-fiber sports equipment on dark performance surface, dynamic lighting setup",
  music:     "studio microphone or vintage vinyl on matte black acoustic surface, warm tungsten rim glow",
};

/**
 * Build a GPT Image 2 prompt for Foundation 2 — cosmic dark void aesthetic.
 * Category-locked: NO raw brief text — prevents description contamination.
 */
function buildF2FluxAnchor(_brief: StartupBrief, category: V2CategoryKey): string {
  const heroSubject = F2_VOID_SUBJECT[category] ?? F2_VOID_SUBJECT.saas;
  return `${heroSubject}. Singular hero object suspended in deep dark void, cinematic 3D CGI render, cold blue-violet rim light from upper-left, volumetric atmospheric haze, dramatic chiaroscuro lighting, ultra-premium quality, photorealistic PBR materials, cosmic depth, no people, no faces, no text, no logos, 8k, art direction by a luxury brand agency`;
}

/**
 * Build a GPT Image 2 prompt for Foundation 3 — dark cinematic 3D render aesthetic.
 * Category-locked: NO raw brief text — prevents description contamination.
 */
function buildF3FluxAnchor(_brief: StartupBrief, category: V2CategoryKey): string {
  const heroSubject = F3_OBSIDIAN_SUBJECT[category] ?? F3_OBSIDIAN_SUBJECT.saas;
  return `${heroSubject}. Singular hero object on polished obsidian black surface, sculpted rim lighting from above and behind, volumetric atmospheric haze, deep shadow gradients pooling at base, ultra-premium CGI quality, photorealistic PBR materials, shallow depth of field, no people, no faces, no text, no UI, award-winning product visualization, 8k`;
}

async function fetchFoundation1Content(
  brief: StartupBrief
): Promise<Foundation1Slots | undefined> {
  const userContent = [
    `Business: ${brief.name}`,
    `Tagline: ${brief.tagline}`,
    `Description: ${brief.description}`,
    brief.brandPersonality ? `Brand personality: ${brief.brandPersonality}` : null,
    brief.founderMission ? `Founder mission: ${brief.founderMission}` : null,
    brief.audience ? `Audience: ${brief.audience}` : null,
    brief.brandTone ? `Tone: ${brief.brandTone}` : null,
  ].filter(Boolean).join("\n");

  try {
    const result = await claudeCompletionJSON<Foundation1Slots>({
      temperature: 0.75,
      system: F1_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });
    if (!result || !result.headline || !result.logoText) return undefined;
    // Keep the default video URL since Claude won't have a real URL
    return { ...result, videoUrl: DEFAULT_F1_SLOTS.videoUrl };
  } catch (err) {
    console.warn("[buildWorldSpec] Foundation #1 content fetch failed:", (err as Error)?.message ?? err);
    return undefined;
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export type WorldSpec = {
  worldV2?: WorldV2Package;
  sections: GeneratedSections;
  foundationId: string;
};

export async function buildWorldSpec(
  brief: StartupBrief,
  seed: string,
  foundationOverride?: string
): Promise<WorldSpec> {
  // Foundation #1 is the universal template. Content adapts to every business type.
  // Pass a non-"foundation-1" foundationOverride explicitly to use a different foundation.
  const foundation = foundationOverride && foundationOverride !== "foundation-1"
    ? getFoundation(foundationOverride)
    : getFoundation("foundation-1");

  // ── Foundation #1 / #2 / #3 path: Claude fills content slots + Pexels hero ──
  if (foundation.componentId === "foundation-1" || foundationOverride === "foundation-2" || foundationOverride === "foundation-3") {
    const category = briefToV2Category(brief);
    const { heroUrl, editorialUrl } = getF1Images(category);

    // Run Claude text generation while we already have the Unsplash hero URL ready
    const f1Slots = await fetchFoundation1Content(brief);

    const slots = f1Slots ?? {
      ...DEFAULT_F1_SLOTS,
      logoText: brief.name,
      headline: brief.tagline,
      description: brief.description,
      featuresTitle: "What we offer",
      features: (brief.features ?? []).slice(0, 3).map((f) => ({ title: f, body: "" })),
      stats: DEFAULT_F1_SLOTS.stats,
      process: DEFAULT_F1_SLOTS.process,
      testimonials: [],
      ctaHeadline: "Ready to get started?",
      ctaBody: brief.description,
      ctaButtonLabel: "Begin",
    };

    // Always restore video from defaults; set image slots
    slots.videoUrl = DEFAULT_F1_SLOTS.videoUrl;
    slots.imageCategory = category;
    slots.editorialImageUrl = editorialUrl;

    // Foundation #1: topic-specific hero — GPT Image 2 with category-locked visual subject
    // NEVER include raw brief.description — it contaminates the image (e.g. "backyard" → food photo)
    // Visual subject is derived purely from the startup category, not the textual description.
    const CATEGORY_VISUAL_SUBJECT: Record<V2CategoryKey, string> = {
      floral:    "fresh flowers and botanical arrangement, petals with soft dew drops",
      fitness:   "premium athletic equipment and performance gear — barbell, kettlebell, or running shoes",
      finance:   "polished gold financial instrument on marble surface — credit card, coin stack, or briefcase",
      fashion:   "draped luxury fabric and haute couture garment, neutral tones",
      food:      "artisan culinary creation with gourmet ingredients, editorial plating",
      wellness:  "spa stones, essential oils, or bamboo on a calm zen surface",
      travel:    "premium travel luggage or passport and compass on aged leather",
      home:      "Scandinavian interior design object — a chair, lamp, or architectural detail",
      education: "premium hardcover books and a fountain pen, knowledge aesthetic",
      health:    "clean medical technology device — sleek stethoscope or digital health sensor",
      creator:   "mirrorless camera and prime lens on minimal studio backdrop",
      sports:    "high-performance sports equipment — cleats, helmet, or racket — dynamic angle",
      music:     "vintage vinyl record or premium studio headphones in warm amber light",
      science:   "telescope pointed at a star field, observatory dome silhouette, or Milky Way horizon",
      saas:      "sleek open laptop with abstract holographic interface, dark minimal desk",
    };
    const visualSubject = CATEGORY_VISUAL_SUBJECT[category] ?? `premium product representing ${brief.name}`;
    const noWrong = category !== "food" ? "no food, no vegetables, no fruit, no produce." : "";
    const f1GPTPrompt = [
      `Editorial product photography for "${brief.name}".`,
      `Visual subject: ${visualSubject}.`,
      `White minimal studio environment. Soft directional key light. Single hero composition centered on the subject. Clean shadow. Ultra-premium aesthetic. ${noWrong}`,
      "No people, no faces, no hands, no text, no watermarks, no logos. Shot on Hasselblad medium format. 8K resolution.",
    ].join(" ");
    const f1GptUrl = await generateGPTImage(f1GPTPrompt, { size: "1536x1024", quality: "medium" }).catch(() => undefined);
    slots.imageUrl = f1GptUrl ?? heroUrl;  // GPT Image 2 → curated Pexels fallback
    // Ensure stats and process are never empty
    if (!slots.stats?.length) slots.stats = DEFAULT_F1_SLOTS.stats;
    if (!slots.process?.length) slots.process = DEFAULT_F1_SLOTS.process;

    // Foundation #2: generate topic-specific hero image (gpt-image-2 → Flux fallback → Ken Burns animated in F2)
    // buildF2FluxAnchor uses category-locked subject only — no raw description contamination
    if (foundationOverride === "foundation-2") {
      const f2Anchor = buildF2FluxAnchor(brief, category);
      const gptUrl = await generateGPTImage(f2Anchor, { size: "1536x1024", quality: "medium" }).catch(() => undefined);
      if (gptUrl) {
        slots.imageUrl = gptUrl;
      } else {
        const fluxUrl = await generateFluxHeroImage(category as V2CategoryKey, f2Anchor, 0).catch(() => undefined);
        if (fluxUrl) slots.imageUrl = fluxUrl;
      }
    }

    // Foundation #3: generate topic-specific hero image (gpt-image-2 → Flux fallback → full-bleed cinematic)
    // buildF3FluxAnchor uses category-locked subject only — no raw description contamination
    if (foundationOverride === "foundation-3") {
      const f3Anchor = buildF3FluxAnchor(brief, category);
      const gptUrl = await generateGPTImage(f3Anchor, { size: "1536x1024", quality: "medium" }).catch(() => undefined);
      if (gptUrl) {
        slots.imageUrl = gptUrl;
      } else {
        const fluxUrl = await generateFluxHeroImage(category as V2CategoryKey, f3Anchor, 0).catch(() => undefined);
        if (fluxUrl) slots.imageUrl = fluxUrl;
      }
    }

    const resolvedFoundationId =
      foundationOverride === "foundation-2" ? "foundation-2" :
      foundationOverride === "foundation-3" ? "foundation-3" :
      foundation.id;
    const sections: GeneratedSections = {
      navbar: { brandLabel: slots.logoText, ctaLabel: slots.navCtaLabel },
      hero: {
        eyebrow: "",
        headline: slots.headline,
        subheadline: slots.description,
        ctaPrimary: slots.heroCtaLabel,
        ctaSecondary: "",
      },
      features: { sectionTitle: "", items: [] },
      testimonials: [],
      pricing: { sectionTitle: "", subtitle: "" },
      faq: [],
      cta: { headline: "", subheadline: "", buttonText: slots.navCtaLabel },
      footer: { tagline: brief.tagline },
      foundation1Slots: slots,
      foundationId: resolvedFoundationId,
    };
    return { sections, foundationId: resolvedFoundationId };
  }

  // ── WorldV2 path: existing Claude + Flux pipeline ──
  const content = await fetchSpecContent(brief, foundation);

  const worldSpec = content
    ? specToClaudeWorldSpec(content, foundation, brief)
    : undefined;

  const worldV2Base = buildWorldV2(brief, seed, worldSpec);
  const worldV2 = await injectFluxHero(worldV2Base, brief, { worldSpec });

  const sections = content
    ? specToSections(content, brief, foundation)
    : fallbackSections(brief, foundation);

  return { worldV2, sections, foundationId: foundation.id };
}

function fallbackSections(brief: StartupBrief, foundation: Foundation): GeneratedSections {
  return {
    navbar: { brandLabel: brief.name, ctaLabel: "Get Started" },
    hero: {
      eyebrow: foundation.name,
      headline: brief.tagline,
      subheadline: brief.description,
      ctaPrimary: "Get Started",
      ctaSecondary: "Learn More",
    },
    features: {
      sectionTitle: "What we offer",
      items: brief.features?.slice(0, 4).map((f) => ({ title: f, description: "" })) ?? [],
    },
    testimonials: [{ quote: "Outstanding.", name: "A customer", role: "" }],
    pricing: { sectionTitle: "Pricing", subtitle: "Simple and transparent." },
    faq: [{ question: "How does it work?", answer: brief.description }],
    cta: { headline: "Ready?", subheadline: "Start today.", buttonText: "Begin" },
    footer: { tagline: brief.tagline },
  };
}
