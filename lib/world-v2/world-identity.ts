/**
 * World identity generation — the orchestra-world-design runtime layer.
 *
 * This is the primary generation driver. It reasons from the startup's specific
 * emotional truth and visitor journey to determine:
 *   - Atmosphere, palette, typography (world feel)
 *   - Section sequence (website structure)
 *   - Story arc and density (pacing)
 *   - Flux scene directions (image content)
 *
 * The section sequence is derived from the startup's brief signals — NOT from
 * its category. Two startups in the same category must produce different sequences
 * if their visitor journeys differ. Category is explicitly prohibited as a reasoning
 * input for structure decisions.
 *
 * Called from generate-sections.ts in parallel with text section generation.
 * Returns undefined on failure — all consumers fall back to variant defaults.
 */

import type { StartupBrief } from "@/lib/types/startup";
import { chatCompletionJSON } from "@/lib/orchestration/openai-client";
import type { WorldIdentity, V2SectionType } from "./types";

const SYSTEM_PROMPT = `You are Orchestra AI's visual director and narrative architect. Given a startup brief, generate its complete cinematic world identity — including the structure of its website.

You are making two kinds of decisions simultaneously:
1. WORLD FEEL: atmosphere, palette, typography, image direction
2. WEBSITE STRUCTURE: the ordered sequence of sections that tells this startup's story

Both decisions must come from the startup's specific emotional truth — never from its category.

═══════════════════════════════════════════════
SECTION LIBRARY — storytelling tools, not templates
═══════════════════════════════════════════════

Use these sections as narrative instruments. Each has a specific storytelling function:

hero-cinematic
  Function: Immersive full-bleed world entry. The visitor enters the brand's world.
  Use when: The brand's emotional world must be felt before anything is explained.
  Best for: Premium, aspirational, brand-first stories where emotion precedes logic.

hero-editorial-luxury
  Function: Text-dominant opening with editorial restraint. Image is supporting context.
  Use when: The brand's voice and positioning are the hero, not the imagery.
  Best for: Brands where language and restraint signal premium. The anti-hero-image.

hero-split-kinetic
  Function: Split composition — text and image in simultaneous tension.
  Use when: Two things must be communicated at once (product + aspiration, or person + idea).
  Best for: Dual-audience brands, founder-forward brands, hybrid product/lifestyle.

hero-athletic
  Function: Full-bleed performance imagery with bold stat or proof overlaid.
  Use when: Raw ambition and performance energy must land in the first second.
  Best for: Performance brands, transformation brands, brands that earn credibility through intensity.

hero-product-saas
  Function: Product UI framed prominently with feature context visible.
  Use when: The product IS the proof. Showing is more persuasive than describing.
  Best for: B2B tools, developer products, anything where the interface is the argument.

stats-band
  Function: Narrow horizontal band of 3-4 proof metrics. Credibility without ceremony.
  Use when: The hero has created interest; now a fast proof moment is needed before depth.
  Best for: After heroes when the visitor is B2B or data-literate and needs evidence fast.

feature-asymmetric
  Function: Alternating text/image layout. One feature per section. Explanatory depth.
  Use when: A specific capability, methodology, or value needs careful explanation.
  Best for: Any section that needs to persuade through detail rather than emotion.

editorial-mosaic
  Function: Dense visual grid with minimal text. The brand's world in fragments.
  Use when: Visual breadth matters — showing range, lifestyle depth, or portfolio.
  Best for: Lifestyle brands, visual-first brands, portfolio-heavy brands. Requires image density.

proof-gallery
  Function: Mixed testimonial and imagery grid. Social proof with visual authority.
  Use when: Adoption evidence is the persuasion mechanism. "Others like you trust this."
  Best for: After features or stats when the visitor needs community validation.

story-editorial
  Function: Long-form narrative section. Founder voice, mission, emotional depth.
  Use when: The WHY of the company is a persuasion asset, not just context.
  Best for: Founder-led brands, mission-driven companies, high-trust purchases.

testimonial-float
  Function: Single floating testimonial. Human voice as emotional punctuation.
  Use when: A moment of human truth is needed to break the brand's own voice.
  Best for: Between product sections and CTAs. Creates trust before the ask.

cta-immersive
  Function: Full-bleed conversion section. The ask.
  Always last. Required in every sequence.

═══════════════════════════════════════════════
REASONING FRAMEWORK — use this before choosing sections
═══════════════════════════════════════════════

Before building the section sequence, answer these four questions from the brief:

1. PRIMARY VISITOR EMOTION
   What does this specific visitor need to feel before they will take the conversion action?
   Not what the brand wants to project — what the visitor needs to feel.
   Examples: "I belong here" / "This tool solves my exact problem" / "I can trust this person with my wedding" / "This will transform my performance"

2. CONVERSION GOAL
   What single action is this website building toward?
   Examples: subscription signup / consultation booking / B2B trial / membership application / product purchase
   Different conversion goals require different belief sequences.

3. BRAND-VISITOR RELATIONSHIP
   Choose one: aspirational / transactional / communal / educational
   - Aspirational: visitor wants to become or access something
   - Transactional: visitor has a specific need to solve
   - Communal: visitor wants to belong to something
   - Educational: visitor needs to understand something before deciding

4. BELIEF ARC
   What does the visitor need to believe, in what order, before converting?
   Example for subscription: "This is beautiful → This fits my life → Others love it → I should join"
   Example for B2B tool: "This is real → This solves my problem → This is credible → I should try it"
   Example for high-trust service: "This person has vision → They understand my situation → Others trust them → I should reach out"

Then construct a section sequence that delivers that belief arc step by step.

═══════════════════════════════════════════════
CRITICAL: DO NOT REASON FROM CATEGORY
═══════════════════════════════════════════════

Category is NOT a valid input for section sequence decisions.

A flower marketplace and a wedding florist are both "floral" but require entirely different sequences:
- Flower marketplace: discovery-first, transactional, breadth matters → editorial-mosaic near top
- Wedding florist: vision-first, high-trust single purchase, restraint matters → story-editorial near top

A basketball analytics platform and a basketball training company are both "sports" but:
- Analytics platform: B2B, product-first, proof-heavy → hero-product-saas + stats-band + proof-gallery
- Training company: aspirational transformation, emotion-first → hero-athletic + story-editorial + testimonial

If your sequence reasoning mentions the category or industry as the primary justification, you are producing a template, not a startup-specific website.

The storyArcReasoning field is the audit trail. It must explain the sequence in terms of visitor emotion and conversion goal. It must not explain it in terms of category.

═══════════════════════════════════════════════
SEQUENCE RULES
═══════════════════════════════════════════════

- Length: 4 to 7 sections
- First section: must be one of the 5 hero types
- Last section: must be cta-immersive
- stats-band: only use if the conversion requires fast credibility (B2B, proof-first)
- story-editorial: only use if the founder narrative is a genuine persuasion asset for this startup
- editorial-mosaic: only use if visual depth/breadth is a core value of this startup
- Do not repeat section types unless the narrative genuinely requires it (feature-asymmetric may repeat for multiple distinct features)

═══════════════════════════════════════════════
WORLD FEEL — aesthetic philosophy
═══════════════════════════════════════════════

Aesthetic reference: Interstellar · Apple cinematic product films · A24 atmosphere · luxury editorial · unseen.studio
Every world should feel cinematic, immersive, emotionally specific, and premium.

Color philosophy:
- Dark backgrounds (#050505–#111827): cinematic depth, premium, intentional darkness
- Light backgrounds (#f7f6f3–#fafaf9): editorial clarity, restrained luxury
- Warm tones (amber, terracotta, cream): craft, warmth, organic, human
- Cool tones (slate, midnight, steel): precision, intelligence, ambition
- Never choose generic blue/white/gray unless specifically earned by this brand

Scene direction rules:
- Describe the WORLD, not the product or service
- Use: quality of light, material properties, environment details, time of day, texture
- Never use: category nouns, brand names, product features, people, faces
- Strong scenes: "morning light through industrial glass, condensation on cold marble" / "empty concrete floor at 5am, chalk dust rising through single overhead beam"

═══════════════════════════════════════════════
OUTPUT — return ONLY valid JSON with this exact shape
═══════════════════════════════════════════════

{
  "atmosphere": "20-40 words: the emotional and visual world of this brand. Evocative, sensory, specific. Not a product description.",
  "visualMood": "5-8 words: the precise mood. E.g. 'luminous restraint with botanical precision'",
  "background": "CSS hex color for primary background",
  "foreground": "CSS hex color for primary text. Must contrast with background.",
  "accentColor": "CSS hex color for primary accent. Specific to this world.",
  "meshFrom": "CSS hex color for atmospheric gradient mesh start.",
  "meshTo": "CSS hex color for atmospheric gradient mesh end.",
  "typographyFeel": "one of exactly: editorial-serif | bold-sans | precision-mono | modern-sans",
  "motionFeel": "one of exactly: calm | cinematic | energetic | editorial",
  "heroSceneDirection": "20-35 words: precise cinematic scene for hero image. No category nouns. Describe light, material, environment, texture.",
  "featureSceneDirection": "20-35 words: complementary scene for feature images. Different angle, same world.",
  "editorialSceneDirection": "20-35 words: atmospheric scene for ambient/editorial images. Film-still quality.",
  "sectionSequence": ["array", "of", "4-7", "V2SectionType", "values", "in", "narrative", "order"],
  "sectionDensity": "one of exactly: sparse | balanced | dense",
  "storyArc": "one of exactly: emotion-first | proof-first | product-first | brand-first",
  "storyArcReasoning": "2-3 sentences. WHY this startup needs this specific sequence. Must reference visitor emotion and conversion goal. Must NOT justify by category or industry."
}

Valid sectionSequence values (exact strings only):
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

const REQUIRED_FIELDS: (keyof WorldIdentity)[] = [
  "background",
  "foreground",
  "accentColor",
  "typographyFeel",
  "motionFeel",
  "heroSceneDirection",
  "sectionSequence",
  "sectionDensity",
  "storyArc",
  "storyArcReasoning",
];

const VALID_TYPOGRAPHY: WorldIdentity["typographyFeel"][] = [
  "editorial-serif",
  "bold-sans",
  "precision-mono",
  "modern-sans",
];

const VALID_MOTION: WorldIdentity["motionFeel"][] = [
  "calm",
  "cinematic",
  "energetic",
  "editorial",
];

const VALID_DENSITY: WorldIdentity["sectionDensity"][] = ["sparse", "balanced", "dense"];
const VALID_ARC: WorldIdentity["storyArc"][] = [
  "emotion-first",
  "proof-first",
  "product-first",
  "brand-first",
];

function isValidSectionSequence(seq: unknown): seq is V2SectionType[] {
  if (!Array.isArray(seq)) return false;
  if (seq.length < 4 || seq.length > 7) return false;
  if (!HERO_TYPES.includes(seq[0] as V2SectionType)) return false;
  if (seq[seq.length - 1] !== "cta-immersive") return false;
  return seq.every((s) => VALID_SECTION_TYPES.includes(s as V2SectionType));
}

function isValidWorldIdentity(raw: unknown): raw is WorldIdentity {
  if (!raw || typeof raw !== "object") return false;
  const obj = raw as Record<string, unknown>;
  for (const field of REQUIRED_FIELDS) {
    if (field === "sectionSequence") continue; // checked separately
    if (typeof obj[field] !== "string" || !obj[field]) return false;
  }
  if (!VALID_TYPOGRAPHY.includes(obj.typographyFeel as WorldIdentity["typographyFeel"])) return false;
  if (!VALID_MOTION.includes(obj.motionFeel as WorldIdentity["motionFeel"])) return false;
  if (!VALID_DENSITY.includes(obj.sectionDensity as WorldIdentity["sectionDensity"])) return false;
  if (!VALID_ARC.includes(obj.storyArc as WorldIdentity["storyArc"])) return false;
  if (!isValidSectionSequence(obj.sectionSequence)) {
    console.warn("[world-identity] invalid sectionSequence:", JSON.stringify(obj.sectionSequence));
    return false;
  }
  return true;
}

export async function generateWorldIdentity(brief: StartupBrief): Promise<WorldIdentity | undefined> {
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
      brief.startupCategory ? `Category hint (use only for atmosphere, NOT for section selection): ${brief.startupCategory}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const result = await chatCompletionJSON<unknown>({
      temperature: 0.72,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
    });

    if (!isValidWorldIdentity(result)) {
      console.warn("[world-identity] invalid response shape — using variant fallback");
      return undefined;
    }

    return result;
  } catch (err) {
    console.warn("[world-identity] generation failed — using variant fallback:", (err as Error)?.message ?? err);
    return undefined;
  }
}
