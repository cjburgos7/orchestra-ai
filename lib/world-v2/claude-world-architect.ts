/**
 * Claude World Architect — primary structure and identity generator.
 *
 * Replaces generateWorldIdentity (GPT-4o-mini) as the structural driver.
 * Returns a ClaudeWorldSpec with:
 *   - ordered section sequence derived from the startup's visitor journey
 *   - per-section image scene direction, headline intent, layout hint
 *   - visual identity (palette, typography, motion, lighting)
 *
 * Reasoning is from the startup's specific brief signals — NOT from category.
 * Two startups in the same category will receive different specs if their
 * visitor journeys differ.
 *
 * Returns undefined on failure. All consumers fall back to variant defaults.
 */

import type { StartupBrief } from "@/lib/types/startup";
import { claudeCompletionJSON } from "@/lib/orchestration/claude-client";
import type { V2SectionType } from "./types";

export type ClaudeWorldSpec = {
  sections: Array<{
    type: V2SectionType;
    /** Narrative purpose of this section in the visitor journey */
    headline: string;
    /** Supporting intent — what this section must make the visitor believe */
    subtext: string;
    /** Cinematic scene direction for Flux image generation. No category nouns. */
    imageSceneDescription: string;
    /** Compositional hint for the renderer */
    layoutHint: string;
  }>;
  visualIdentity: {
    /** 5-8 words: precise mood of this world */
    mood: string;
    motionFeel: "calm" | "cinematic" | "energetic" | "editorial";
    palette: {
      background: string;
      foreground: string;
      accentColor: string;
      meshFrom: string;
      meshTo: string;
    };
    typographyPersonality: "editorial-serif" | "bold-sans" | "precision-mono" | "modern-sans";
    /** Quality of light that defines this brand's world */
    lightingModel: string;
  };
  /** One sentence: the emotional world this startup inhabits */
  worldStatement: string;
  /** Audit trail: WHY this sequence. Must cite visitor emotion + conversion goal. Must NOT cite category. */
  storyArcReasoning: string;
};

const SYSTEM_PROMPT = `You are Orchestra AI's world architect. Given a startup brief, you generate its complete cinematic world identity and website structure.

You make two decisions simultaneously:
1. WEBSITE STRUCTURE: the ordered section sequence that delivers this startup's visitor journey
2. WORLD IDENTITY: atmosphere, palette, typography, motion, and per-section image direction

Both must come from the startup's specific emotional truth and visitor journey — never from its category.

═══════════════════════════════════════════════
SECTION LIBRARY — storytelling instruments
═══════════════════════════════════════════════

hero-cinematic
  Use when the brand's emotional world must be felt before anything is explained.
  Visitor enters the world. Emotion precedes logic.

hero-editorial-luxury
  Use when brand voice and restraint are the hero, not the imagery.
  Text-dominant. Image is context. The anti-stock-photo opening.

hero-split-kinetic
  Use when two things must land simultaneously: product + aspiration, person + idea.
  Split composition. Dual-audience or founder-forward brands.

hero-athletic
  Use when raw performance energy must land in the first second.
  Full-bleed intensity. Transformation and ambition brands.

hero-product-saas
  Use when the product IS the proof. Showing beats describing.
  B2B tools, developer products, anything where the interface argues for itself.

stats-band
  Use when fast credibility is required before the visitor will engage with depth.
  B2B visitors and data-literate audiences need evidence first.

feature-asymmetric
  Use when a specific capability needs explanation depth.
  One feature per section. Alternating text/image. Persuades through detail.

editorial-mosaic
  Use when visual breadth is the argument — range, inventory, portfolio.
  Dense grid. Lifestyle and visual-first brands. Requires image density.

proof-gallery
  Use when adoption evidence is the conversion mechanism.
  Mixed testimonials and imagery. "Others like you trust this."

story-editorial
  Use when the founder's WHY is a genuine persuasion asset.
  Long-form narrative. High-trust purchases. Mission-driven brands.

testimonial-float
  Use when human voice is needed to break the brand's own register.
  Single quote. Emotional punctuation between sections.

cta-immersive
  Always last. Full-bleed conversion section.

═══════════════════════════════════════════════
REASONING FRAMEWORK — answer these before choosing sections
═══════════════════════════════════════════════

1. PRIMARY VISITOR EMOTION
   What must this visitor FEEL before they convert?
   Not what the brand wants to project — what the visitor needs to feel.

2. CONVERSION GOAL
   What single action is this website building toward?
   Different goals require different belief sequences.

3. BRAND-VISITOR RELATIONSHIP
   aspirational / transactional / communal / educational

4. BELIEF ARC
   What must the visitor believe, in what order?
   Example subscription: "This is beautiful → this fits my life → others live this → I should join"
   Example B2B tool: "This is real → this solves my problem → others use it → I should try it"

Then construct a section sequence that delivers that belief arc step by step.

═══════════════════════════════════════════════
CRITICAL: DO NOT REASON FROM CATEGORY
═══════════════════════════════════════════════

Category is NOT a valid input for structure decisions.

Same category, different structures:
- Flower subscription: belief arc is ritual belonging → story-editorial near top, no stats-band
- Wedding florist: belief arc is trust in vision → hero-editorial-luxury, editorial-mosaic, no story-editorial
- Floral marketplace: belief arc is discovery breadth → editorial-mosaic at position 2, no story-editorial

- Basketball analytics platform: B2B proof-first → hero-product-saas + stats-band + feature-asymmetric
- Basketball training: aspirational transformation → hero-athletic + story-editorial + testimonial-float

If your storyArcReasoning mentions the category or industry, you are producing a template, not a world.

═══════════════════════════════════════════════
SEQUENCE RULES
═══════════════════════════════════════════════

- Length: 4 to 7 sections
- First: must be one of the 5 hero types
- Last: must be cta-immersive
- stats-band: only if conversion requires fast B2B credibility
- story-editorial: only if the founder narrative is a genuine persuasion asset
- editorial-mosaic: only if visual breadth/range is a core argument
- feature-asymmetric: may repeat for multiple distinct features

═══════════════════════════════════════════════
VISUAL IDENTITY
═══════════════════════════════════════════════

Aesthetic reference: Interstellar · Apple cinematic product films · A24 atmosphere · luxury editorial · unseen.studio

Color philosophy:
- Dark backgrounds (#050505–#111827): cinematic depth, premium, intentional darkness
- Light backgrounds (#f7f6f3–#fafaf9): editorial clarity, restrained luxury
- Warm tones: craft, warmth, organic, human
- Cool tones: precision, intelligence, ambition
- Never choose generic blue/white/gray unless earned by this specific brand

Image scene direction rules:
- Describe the specific VISUAL WORLD this startup inhabits — not a generic category
- Use: the specific product/ingredient/material this brand is about, as an environmental element
- Use: quality of light, material texture, environment, time of day, atmosphere
- INCLUDE the exact product — e.g. for a banana brand: "ripe yellow bananas, plantation canopy, golden morning mist"
  For a coffee brand: "raw coffee cherries on ceramic, mountain mist at dawn, copper and earth tones"
  For a finance brand: "brushed titanium card on marble, low amber city light at dusk"
- Never use: generic category nouns ("food", "product", "service"), brand names, people, faces
- Write as a Flux/Midjourney image direction — 20-35 words, visually concrete, evocative
- Two startups in the same category MUST have different scene descriptions because their specific products differ

═══════════════════════════════════════════════
OUTPUT — return ONLY valid JSON with this exact shape
═══════════════════════════════════════════════

{
  "sections": [
    {
      "type": "one of the valid V2SectionType values",
      "headline": "narrative purpose of this section in the visitor journey — 8-15 words",
      "subtext": "what the visitor must believe after this section — 10-20 words",
      "imageSceneDescription": "20-35 words: cinematic scene. Include the specific product/material/ingredient. Light, environment, texture. No generic nouns like 'food' or 'product'.",
      "layoutHint": "brief compositional note: text-left image-right / full-bleed centered / edge-anchored / etc"
    }
  ],
  "visualIdentity": {
    "mood": "5-8 words: precise visual mood",
    "motionFeel": "calm | cinematic | energetic | editorial",
    "palette": {
      "background": "#hex",
      "foreground": "#hex",
      "accentColor": "#hex",
      "meshFrom": "#hex",
      "meshTo": "#hex"
    },
    "typographyPersonality": "editorial-serif | bold-sans | precision-mono | modern-sans",
    "lightingModel": "10-20 words: quality of light that defines this world"
  },
  "worldStatement": "one sentence: the emotional world this startup inhabits",
  "storyArcReasoning": "2-3 sentences. WHY this section sequence. Must reference visitor emotion and conversion goal. Must NOT reference category or industry."
}

Valid section type values (exact strings only):
hero-cinematic, hero-editorial-luxury, hero-split-kinetic, hero-athletic, hero-product-saas,
stats-band, feature-asymmetric, editorial-mosaic, proof-gallery, story-editorial,
testimonial-float, cta-immersive`;

const VALID_SECTION_TYPES: V2SectionType[] = [
  "hero-cinematic",
  "hero-editorial-luxury",
  "hero-split-kinetic",
  "hero-athletic",
  "hero-product-saas",
  "editorial-mosaic",
  "feature-asymmetric",
  "proof-gallery",
  "stats-band",
  "testimonial-float",
  "story-editorial",
  "cta-immersive",
];

const HERO_TYPES: V2SectionType[] = [
  "hero-cinematic",
  "hero-editorial-luxury",
  "hero-split-kinetic",
  "hero-athletic",
  "hero-product-saas",
];

const VALID_MOTION: ClaudeWorldSpec["visualIdentity"]["motionFeel"][] = [
  "calm",
  "cinematic",
  "energetic",
  "editorial",
];

const VALID_TYPOGRAPHY: ClaudeWorldSpec["visualIdentity"]["typographyPersonality"][] = [
  "editorial-serif",
  "bold-sans",
  "precision-mono",
  "modern-sans",
];

function isValidSectionEntry(
  s: unknown
): s is ClaudeWorldSpec["sections"][number] {
  if (!s || typeof s !== "object") return false;
  const obj = s as Record<string, unknown>;
  return (
    typeof obj.type === "string" &&
    VALID_SECTION_TYPES.includes(obj.type as V2SectionType) &&
    typeof obj.headline === "string" &&
    obj.headline.length > 0 &&
    typeof obj.subtext === "string" &&
    obj.subtext.length > 0 &&
    typeof obj.imageSceneDescription === "string" &&
    obj.imageSceneDescription.length > 0 &&
    typeof obj.layoutHint === "string"
  );
}

function isValidClaudeWorldSpec(raw: unknown): raw is ClaudeWorldSpec {
  if (!raw || typeof raw !== "object") return false;
  const obj = raw as Record<string, unknown>;

  if (!Array.isArray(obj.sections)) return false;
  if (obj.sections.length < 4 || obj.sections.length > 7) return false;
  if (!HERO_TYPES.includes((obj.sections[0] as Record<string, unknown>)?.type as V2SectionType))
    return false;
  const last = obj.sections[obj.sections.length - 1] as Record<string, unknown>;
  if (last?.type !== "cta-immersive") return false;
  if (!obj.sections.every(isValidSectionEntry)) return false;

  const vi = obj.visualIdentity as Record<string, unknown> | undefined;
  if (!vi) return false;
  if (typeof vi.mood !== "string" || !vi.mood) return false;
  if (!VALID_MOTION.includes(vi.motionFeel as ClaudeWorldSpec["visualIdentity"]["motionFeel"]))
    return false;
  if (
    !VALID_TYPOGRAPHY.includes(
      vi.typographyPersonality as ClaudeWorldSpec["visualIdentity"]["typographyPersonality"]
    )
  )
    return false;

  const palette = vi.palette as Record<string, unknown> | undefined;
  if (!palette) return false;
  for (const key of ["background", "foreground", "accentColor", "meshFrom", "meshTo"]) {
    if (typeof palette[key] !== "string" || !(palette[key] as string).startsWith("#")) return false;
  }

  if (typeof obj.worldStatement !== "string" || !obj.worldStatement) return false;
  if (typeof obj.storyArcReasoning !== "string" || !obj.storyArcReasoning) return false;

  return true;
}

export async function callClaudeWorldArchitect(
  brief: StartupBrief
): Promise<ClaudeWorldSpec | undefined> {
  try {
    const userContent = [
      `Startup: ${brief.name}`,
      `Tagline: ${brief.tagline}`,
      `Description: ${brief.description}`,
      brief.brandPersonality ? `Brand personality: ${brief.brandPersonality}` : null,
      brief.founderMission ? `Founder mission: ${brief.founderMission}` : null,
      brief.marketPositioning ? `Market positioning: ${brief.marketPositioning}` : null,
      brief.audience ? `Audience: ${brief.audience}` : null,
      brief.brandTone ? `Brand tone: ${brief.brandTone}` : null,
      brief.startupCategory
        ? `Category hint (use only for atmosphere, NOT for section selection): ${brief.startupCategory}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    const result = await claudeCompletionJSON<unknown>({
      temperature: 0.72,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    if (!isValidClaudeWorldSpec(result)) {
      console.warn("[claude-world-architect] invalid response shape — using fallback");
      return undefined;
    }

    return result;
  } catch (err) {
    console.warn(
      "[claude-world-architect] generation failed — using fallback:",
      (err as Error)?.message ?? err
    );
    return undefined;
  }
}
