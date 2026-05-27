/**
 * Creative Direction Engine — concept-first visual DNA derivation.
 * Orchestration layer above direction engines / world intelligence.
 */

import { FRESH_PRODUCE_PREMIUM_DARK_VARIANTS } from "./fresh-produce-variants";
import { CATEGORY_PREMIUM_DARK_VARIANTS } from "./category-premium-dark-variants";
import { CATEGORY_ORCHESTRA_VARIANTS } from "./category-orchestra-variants";

export interface CreativeConcept {
  // The irreducible idea — one declarative sentence
  coreIdea: string;

  // The emotional territory — single word
  emotion: string;

  // Visual tension — what two opposing forces create the drama
  tension: { force1: string; force2: string };

  // The single dominant visual moment — what you remember
  heroMoment: string;

  // Typography attitude — how the words behave
  typeAttitude: string;

  // The image treatment rule — how every photo is treated
  imageTreatmentRule: string;

  // Pacing — how the scroll feels
  pacingMetaphor: string;

  // Density instruction — not a number, a feeling
  densityFeeling: string;
}

// Pre-authored concepts per category × direction.
// These are NOT generated at runtime — they are crafted.
// The quality of these concepts IS the quality of the worlds.

export type ConceptKey = `${string}::${string}`;

export const CREATIVE_CONCEPTS: Record<ConceptKey, CreativeConcept> = {

  // ── FRESH PRODUCE ─────────────────────────────────────────────────────────

  "fresh-produce::premium-dark": {
    coreIdea: "Fruit is nature's original luxury, and we're its first real curators.",
    emotion: "reverence",
    tension: { force1: "raw abundance", force2: "extreme restraint" },
    heroMoment: "A single halved blood orange on black — the interior geometry revealed like a secret.",
    typeAttitude: "Serif type that moves like honey. Heavy weight, wide breathing room. Never hurried.",
    imageTreatmentRule: "Every image shot as if for a Michelin-starred menu. Dark backgrounds, single subject, rim lighting. The produce is the hero, always centered, always alone.",
    pacingMetaphor: "The pace of someone who knows exactly what they're about to eat.",
    densityFeeling: "Sparse sections that feel FULL because each image earns its space.",
  },

  "fresh-produce::minimal-clean": {
    coreIdea: "The best produce needs nothing added. Neither does good design.",
    emotion: "clarity",
    tension: { force1: "natural imperfection", force2: "designed perfection" },
    heroMoment: "A basket of produce on white. Perfect natural light. Nothing else. You want to reach through the screen.",
    typeAttitude: "Type so clean it disappears. The product does the talking.",
    imageTreatmentRule: "Studio-clean white or near-white backgrounds. Natural light. No filters. The product's actual color is the brand color.",
    pacingMetaphor: "A Sunday morning farmers market before the crowds arrive.",
    densityFeeling: "More space than content. The whitespace is the premium signal.",
  },

  "fresh-produce::bold-experimental": {
    coreIdea: "Fruit is violent and beautiful. We refuse to sanitize it.",
    emotion: "visceral excitement",
    tension: { force1: "organic chaos", force2: "graphic brutalism" },
    heroMoment: "A watermelon smashed open, seeds mid-air, pulp exploding — photographed at 1/8000 shutter.",
    typeAttitude: "Impact weight, all caps, set too large. It bleeds off the edges. That's intentional.",
    imageTreatmentRule: "Extreme crops. Never show the whole fruit. Show the interior — the seeds, the flesh, the juice. Contrast cranked hard. Hue amplified.",
    pacingMetaphor: "Biting into something cold and ripe.",
    densityFeeling: "Overwhelming. Images collide. There is no comfortable negative space.",
  },

  "fresh-produce::luxury-editorial": {
    coreIdea: "Every piece of fruit has a provenance worth knowing.",
    emotion: "contemplation",
    tension: { force1: "agricultural rawness", force2: "editorial refinement" },
    heroMoment: "A full-spread image: gnarled hands of a farmer holding three blood oranges. No words needed.",
    typeAttitude: "Tall, thin serif. Wide tracking on subheads. Line spacing so generous it feels like a magazine from 1992.",
    imageTreatmentRule: "Documentary photography style. Golden hour or blue hour only. Landscape format. Subject always part of environment, never isolated.",
    pacingMetaphor: "A long read in a quiet room. You don't rush it.",
    densityFeeling: "Alternating: one section of pure image → one section of pure text. Never both at once.",
  },

  "fresh-produce::genz-vibrant": {
    coreIdea: "Fresh fruit is the original aesthetic. We just finally made it downloadable.",
    emotion: "joyful ownership",
    tension: { force1: "internet energy", force2: "genuine freshness" },
    heroMoment: "A still life of fruit arranged like a flat lay for an Instagram post — except shot on film, slightly overexposed, and the caption is lowercase.",
    typeAttitude: "Mixed scale. One word massive. Next line tiny. Hierarchy breaks are the style.",
    imageTreatmentRule: "Film grain. Slightly overexposed. Close crops. Shot on a surface (marble, concrete, wood) with strong color contrast. Always feels like you could have taken it.",
    pacingMetaphor: "Scrolling through a great Instagram grid at 2am.",
    densityFeeling: "Packed cards, short sections, constant movement. Never lets you settle.",
  },

  // ── SPORTS ANALYTICS ──────────────────────────────────────────────────────

  "sports-analytics::premium-dark": {
    coreIdea: "The game was always won in the data. You just couldn't see it until now.",
    emotion: "controlled intensity",
    tension: { force1: "raw athletic power", force2: "cold analytical precision" },
    heroMoment: "An empty arena at 2am. Court lights on. One analyst at a laptop. The score overlaid in data.",
    typeAttitude: "Display numbers as large as headlines. Stat values dominate. Labels are footnotes.",
    imageTreatmentRule: "Arena photography with data overlays composited in. Never stock athlete photography. Always the environment — the court, the scoreboard, the bench — not the player's face.",
    pacingMetaphor: "Watching game film. You can pause, rewind, see what others missed.",
    densityFeeling: "Data-dense sections punctuated by single atmospheric images. The density IS the product.",
  },

  "sports-analytics::bold-experimental": {
    coreIdea: "Every play leaves a scar on the data. We read them all.",
    emotion: "aggression",
    tension: { force1: "kinetic violence of sport", force2: "static precision of data" },
    heroMoment: "A heatmap of a basketball court — zones of hot red and cold blue — rendered so large it becomes abstract art.",
    typeAttitude: "ALL CAPS. Numbers as display type. Font weight 900. Everything is a stat.",
    imageTreatmentRule: "High contrast. Extreme crops. Athlete silhouettes with data overlaid. The image and the data are the same layer — not image + UI on top of image.",
    pacingMetaphor: "Fast breaks. Zero transition. Immediate.",
    densityFeeling: "Information overload as a design choice. Prove you have the data.",
  },

  // ── FASHION & APPAREL ─────────────────────────────────────────────────────

  "fashion-apparel::luxury-editorial": {
    coreIdea: "Clothing is the only art form you live in.",
    emotion: "desire",
    tension: { force1: "the body", force2: "the garment" },
    heroMoment: "A model, back to camera, wearing a coat. Just the coat. Entire page. No headline.",
    typeAttitude: "One or two words. Tall thin serif. Placed with extreme care. Often bottom-left. Never centered.",
    imageTreatmentRule: "Full-bleed editorial. Dark studio or dramatic outdoor light. Never catalog. Never product-on-white. The garment is always in motion or in relationship to a body.",
    pacingMetaphor: "Walking through a museum. You stop at what compels you.",
    densityFeeling: "One image per screen. Sometimes just text. The silence is the luxury.",
  },

  "fashion-apparel::minimal-clean": {
    coreIdea: "Less is not a compromise. It's the whole point.",
    emotion: "precision",
    tension: { force1: "absence", force2: "desire" },
    heroMoment: "A white shirt on a white background. Only the shadows tell you it's there.",
    typeAttitude: "Light weight body, medium weight headers. Maximum leading. Tracking on all caps. Never bolded.",
    imageTreatmentRule: "White or off-white background always. The garment is the only color in the frame. Natural window light. No drama.",
    pacingMetaphor: "Getting dressed slowly because you know you look good.",
    densityFeeling: "One product. One sentence. One color. Repeat.",
  },

  // ── CREATOR TOOLS ─────────────────────────────────────────────────────────

  "creator-tools::genz-vibrant": {
    coreIdea: "Your creative tools should feel as good as your best work.",
    emotion: "creative hunger",
    tension: { force1: "the grind", force2: "the payoff" },
    heroMoment: "A creator mid-shoot, ring light blazing, completely in their zone. The screen shows the analytics going up.",
    typeAttitude: "Conversational. Lowercase subheads. Bold CTAs. Feels like a DM, not an ad.",
    imageTreatmentRule: "Real creator environments. Actual setups — the cable management, the equipment, the notebooks. Film grain. Warm LED glow.",
    pacingMetaphor: "The first hour of a productive session. Energy builds and doesn't stop.",
    densityFeeling: "Medium density with visual pops. Every third section surprises you.",
  },

  // ── WELLNESS ─────────────────────────────────────────────────────────────

  "wellness-mindfulness::luxury-editorial": {
    coreIdea: "Stillness is the most radical act in a loud world.",
    emotion: "permission",
    tension: { force1: "modern urgency", force2: "ancient slowness" },
    heroMoment: "A single person sitting, back to camera, facing a misty valley at dawn. The image takes the full width. There are no words for 8 seconds of scroll.",
    typeAttitude: "Thin. Widely tracked. Never urgent. Every sentence is a breath.",
    imageTreatmentRule: "Always outdoor, always natural light, always morning or evening. No harsh shadows. Desaturated slightly, lifted blacks. The subject is small within the landscape.",
    pacingMetaphor: "Meditation. The discomfort of the pause is the product.",
    densityFeeling: "Radical sparsity. Three sections of almost-nothing, then one dense proof section, then back to stillness.",
  },

  "wellness-mindfulness::minimal-clean": {
    coreIdea: "The app disappears. The calm stays.",
    emotion: "trust",
    tension: { force1: "technology", force2: "nature" },
    heroMoment: "A phone screen showing a meditation timer. Around it: nothing. White space as far as the eye can see.",
    typeAttitude: "Extremely light weight. Generous line height. The text feels like breath.",
    imageTreatmentRule: "Single subject, clean backgrounds. Warm but controlled. The product (app) shown in context, never isolated.",
    pacingMetaphor: "Breathing in. Breathing out.",
    densityFeeling: "Barely anything on screen at once. You feel the calm.",
  },

  ...FRESH_PRODUCE_PREMIUM_DARK_VARIANTS,
  ...CATEGORY_PREMIUM_DARK_VARIANTS,
  ...CATEGORY_ORCHESTRA_VARIANTS,
};

// ─── VISUAL DNA DERIVATION ────────────────────────────────────────────────────
// Derives ALL visual decisions from the creative concept.
// This replaces the template selection step.

export interface VisualDNA {
  concept: CreativeConcept;

  // Derived typographic decisions
  type: {
    displaySize: string;         // CSS clamp
    displayWeight: number;
    displayFamily: string;
    displayLineHeight: number;
    displayTracking: string;
    subSize: string;
    subWeight: number;
    subLineHeight: number;
    eyebrowStyle: "mono-spaced" | "thin-tracked" | "impact-caps" | "none";
    colorPrimary: string;
    colorSecondary: string;
  };

  // Derived layout decisions
  layout: {
    heroHeight: string;
    heroComposition: "full-bleed-single" | "split-type-image" | "type-over-bleed" | "type-only-atmospheric" | "collage-collision";
    contentMaxWidth: string;
    sectionSpacing: string;
    imageDominance: number;     // 0–1, how much images vs type dominate
    gridBreaking: boolean;
    asymmetry: "none" | "subtle" | "aggressive";
  };

  // Derived atmosphere decisions
  atmosphere: {
    heroApproach: "photographic-full-bleed" | "css-atmospheric" | "image-plus-overlay" | "pure-type";
    overlayTreatment: string;    // CSS gradient for overlay
    imageFilter: string;         // CSS filter applied to all images
    depthLayers: number;
    idleMotion: "none" | "slow-drift" | "parallax-subtle" | "kinetic";
  };

  // Derived pacing decisions
  pacing: {
    sectionPattern: DensityBeat[];
    transitionSpeed: "instant" | "medium" | "slow" | "glacial";
    enterAnimation: "immediate" | "stagger-fast" | "stagger-slow" | "blur-reveal" | "slam";
    scrollFeel: "continuous" | "stepped" | "snap";
  };

  // Derived color decisions
  color: {
    background: string;
    foreground: string;
    accent: string;
    secondaryAccent: string;
    imageOverlay: string;
  };
}

export interface DensityBeat {
  type: "vacuum" | "atmospheric" | "editorial" | "dense" | "sparse" | "maximal";
  heightVH: number;
  mediaPresence: "none" | "ambient" | "supporting" | "dominant" | "overwhelming";
  emotionalRole: string;
}

// ─── CONCEPT-TO-VISUAL-DNA COMPILER ──────────────────────────────────────────

export function compileVisualDNA(
  conceptKey: string,
  categoryPalette: string[]
): VisualDNA {
  const concept = CREATIVE_CONCEPTS[conceptKey as ConceptKey];
  const [primary = "#E8490F", secondary = "#1A1A2E", accent = "#F0EFFF"] = categoryPalette;

  if (!concept) {
    return buildDefaultVisualDNA(primary, secondary, accent);
  }

  // Derive from emotion
  const emotionDNA = EMOTION_TO_VISUAL[concept.emotion] || EMOTION_TO_VISUAL["clarity"];

  // Derive from tension
  const tensionDNA = deriveTensionVisuals(concept.tension);

  // Derive from pacing metaphor
  const pacingDNA = derivePacingFromMetaphor(concept.pacingMetaphor);

  // Derive from density feeling
  const densityDNA = deriveDensityBeats(concept.densityFeeling, concept.emotion);
  const base = buildDefaultVisualDNA(primary, secondary, accent);

  return {
    concept,
    type: {
      ...base.type,
      ...(emotionDNA.type ?? {}),
      colorPrimary: accent,
      colorSecondary: `${accent}70`,
    },
    layout: {
      ...base.layout,
      ...(emotionDNA.layout ?? {}),
      ...(tensionDNA.layout ?? {}),
    },
    atmosphere: {
      ...base.atmosphere,
      ...(emotionDNA.atmosphere ?? {}),
      overlayTreatment: buildOverlay(concept.emotion, primary, secondary),
      imageFilter: buildImageFilter(concept.imageTreatmentRule),
    },
    pacing: {
      sectionPattern: densityDNA,
      transitionSpeed: pacingDNA.speed,
      enterAnimation: pacingDNA.enter,
      scrollFeel: pacingDNA.scroll,
    },
    color: {
      ...base.color,
      ...(emotionDNA.color ?? {}),
      accent: primary,
      secondaryAccent: secondary,
      imageOverlay: buildOverlay(concept.emotion, primary, secondary),
    },
  };
}

// Maps emotion words to visual decisions
const EMOTION_TO_VISUAL: Record<string, Partial<VisualDNA>> = {
  "reverence": {
    type: {
      displaySize: "clamp(52px, 6.5vw, 96px)", displayWeight: 700,
      displayFamily: "'Georgia', 'Times New Roman', serif",
      displayLineHeight: 0.94, displayTracking: "-0.03em",
      subSize: "clamp(14px, 1.2vw, 17px)", subWeight: 300, subLineHeight: 1.85,
      eyebrowStyle: "mono-spaced",
      colorPrimary: "#F0EFEE", colorSecondary: "rgba(240,239,238,0.45)",
    },
    layout: {
      heroHeight: "100vh", heroComposition: "type-only-atmospheric",
      contentMaxWidth: "540px", sectionSpacing: "20vh",
      imageDominance: 0.85, gridBreaking: false, asymmetry: "subtle",
    },
    atmosphere: {
      heroApproach: "photographic-full-bleed",
      imageFilter: "brightness(0.75) contrast(1.1) saturate(0.9)",
      depthLayers: 3, idleMotion: "slow-drift",
      overlayTreatment: "",
    },
    color: {
      background: "#080808", foreground: "#F0EFEE",
      accent: "", secondaryAccent: "",
      imageOverlay: "linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.3) 45%, rgba(8,8,8,0.1) 100%)",
    },
  },

  "clarity": {
    type: {
      displaySize: "clamp(36px, 4.5vw, 68px)", displayWeight: 300,
      displayFamily: "'Georgia', serif",
      displayLineHeight: 1.1, displayTracking: "-0.025em",
      subSize: "clamp(14px, 1.1vw, 16px)", subWeight: 400, subLineHeight: 1.75,
      eyebrowStyle: "thin-tracked",
      colorPrimary: "#111110", colorSecondary: "rgba(17,17,16,0.45)",
    },
    layout: {
      heroHeight: "90vh", heroComposition: "split-type-image",
      contentMaxWidth: "480px", sectionSpacing: "16vh",
      imageDominance: 0.5, gridBreaking: false, asymmetry: "none",
    },
    atmosphere: {
      heroApproach: "css-atmospheric",
      imageFilter: "none",
      depthLayers: 1, idleMotion: "none",
      overlayTreatment: "",
    },
    color: {
      background: "#FAFAF8", foreground: "#111110",
      accent: "", secondaryAccent: "",
      imageOverlay: "rgba(0,0,0,0.04)",
    },
  },

  "visceral excitement": {
    type: {
      displaySize: "clamp(64px, 10vw, 148px)", displayWeight: 900,
      displayFamily: "'Impact', 'Arial Black', sans-serif",
      displayLineHeight: 0.86, displayTracking: "-0.01em",
      subSize: "clamp(11px, 1vw, 14px)", subWeight: 400, subLineHeight: 1.5,
      eyebrowStyle: "impact-caps",
      colorPrimary: "#FFFFFF", colorSecondary: "rgba(255,255,255,0.4)",
    },
    layout: {
      heroHeight: "100vh", heroComposition: "collage-collision",
      contentMaxWidth: "640px", sectionSpacing: "8vh",
      imageDominance: 0.9, gridBreaking: true, asymmetry: "aggressive",
    },
    atmosphere: {
      heroApproach: "image-plus-overlay",
      imageFilter: "contrast(1.25) saturate(1.3) brightness(1.05)",
      depthLayers: 2, idleMotion: "kinetic",
      overlayTreatment: "",
    },
    color: {
      background: "#0D0D0D", foreground: "#FFFFFF",
      accent: "", secondaryAccent: "",
      imageOverlay: "rgba(13,13,13,0.15)",
    },
  },

  "contemplation": {
    type: {
      displaySize: "clamp(40px, 5.2vw, 80px)", displayWeight: 400,
      displayFamily: "'Georgia', 'Palatino Linotype', serif",
      displayLineHeight: 1.05, displayTracking: "-0.02em",
      subSize: "clamp(13px, 1vw, 16px)", subWeight: 300, subLineHeight: 2.0,
      eyebrowStyle: "thin-tracked",
      colorPrimary: "#1A1612", colorSecondary: "rgba(26,22,18,0.45)",
    },
    layout: {
      heroHeight: "100vh", heroComposition: "full-bleed-single",
      contentMaxWidth: "500px", sectionSpacing: "22vh",
      imageDominance: 0.75, gridBreaking: false, asymmetry: "subtle",
    },
    atmosphere: {
      heroApproach: "photographic-full-bleed",
      imageFilter: "brightness(0.88) saturate(0.85) sepia(0.08)",
      depthLayers: 2, idleMotion: "none",
      overlayTreatment: "",
    },
    color: {
      background: "#F7F4EF", foreground: "#1A1612",
      accent: "", secondaryAccent: "",
      imageOverlay: "linear-gradient(to top, rgba(247,244,239,0.88) 0%, rgba(247,244,239,0.2) 60%, rgba(247,244,239,0.0) 100%)",
    },
  },

  "controlled intensity": {
    type: {
      displaySize: "clamp(48px, 6vw, 92px)", displayWeight: 800,
      displayFamily: "'Georgia', serif",
      displayLineHeight: 0.95, displayTracking: "-0.03em",
      subSize: "clamp(12px, 1.1vw, 15px)", subWeight: 300, subLineHeight: 1.7,
      eyebrowStyle: "mono-spaced",
      colorPrimary: "#F0EFFF", colorSecondary: "rgba(240,239,255,0.4)",
    },
    layout: {
      heroHeight: "100vh", heroComposition: "type-only-atmospheric",
      contentMaxWidth: "580px", sectionSpacing: "14vh",
      imageDominance: 0.7, gridBreaking: false, asymmetry: "subtle",
    },
    atmosphere: {
      heroApproach: "css-atmospheric",
      imageFilter: "brightness(0.7) contrast(1.15) saturate(0.8)",
      depthLayers: 4, idleMotion: "slow-drift",
      overlayTreatment: "",
    },
    color: {
      background: "#070710", foreground: "#F0EFFF",
      accent: "", secondaryAccent: "",
      imageOverlay: "linear-gradient(to top, rgba(7,7,16,0.95) 0%, rgba(7,7,16,0.5) 50%, rgba(7,7,16,0.1) 100%)",
    },
  },

  "desire": {
    type: {
      displaySize: "clamp(40px, 5vw, 76px)", displayWeight: 400,
      displayFamily: "'Georgia', 'Palatino Linotype', serif",
      displayLineHeight: 1.06, displayTracking: "-0.02em",
      subSize: "clamp(13px, 1vw, 15px)", subWeight: 300, subLineHeight: 2.1,
      eyebrowStyle: "none",
      colorPrimary: "#0A0806", colorSecondary: "rgba(10,8,6,0.4)",
    },
    layout: {
      heroHeight: "100vh", heroComposition: "full-bleed-single",
      contentMaxWidth: "440px", sectionSpacing: "24vh",
      imageDominance: 0.9, gridBreaking: false, asymmetry: "subtle",
    },
    atmosphere: {
      heroApproach: "photographic-full-bleed",
      imageFilter: "brightness(0.82) contrast(1.08) saturate(0.95)",
      depthLayers: 2, idleMotion: "none",
      overlayTreatment: "",
    },
    color: {
      background: "#F5F2ED", foreground: "#0A0806",
      accent: "", secondaryAccent: "",
      imageOverlay: "linear-gradient(to top, rgba(245,242,237,0.85) 0%, transparent 55%)",
    },
  },

  "aggression": {
    type: {
      displaySize: "clamp(60px, 9vw, 128px)", displayWeight: 900,
      displayFamily: "'Impact', sans-serif",
      displayLineHeight: 0.88, displayTracking: "0",
      subSize: "clamp(10px, 0.9vw, 13px)", subWeight: 700, subLineHeight: 1.4,
      eyebrowStyle: "impact-caps",
      colorPrimary: "#FFFFFF", colorSecondary: "rgba(255,255,255,0.35)",
    },
    layout: {
      heroHeight: "100vh", heroComposition: "type-over-bleed",
      contentMaxWidth: "600px", sectionSpacing: "6vh",
      imageDominance: 0.8, gridBreaking: true, asymmetry: "aggressive",
    },
    atmosphere: {
      heroApproach: "image-plus-overlay",
      imageFilter: "contrast(1.3) saturate(0.6) brightness(0.85)",
      depthLayers: 2, idleMotion: "kinetic",
      overlayTreatment: "",
    },
    color: {
      background: "#050505", foreground: "#FFFFFF",
      accent: "", secondaryAccent: "",
      imageOverlay: "rgba(5,5,5,0.45)",
    },
  },

  "permission": {
    type: {
      displaySize: "clamp(32px, 4vw, 62px)", displayWeight: 300,
      displayFamily: "'Georgia', serif",
      displayLineHeight: 1.18, displayTracking: "-0.01em",
      subSize: "clamp(14px, 1.2vw, 17px)", subWeight: 300, subLineHeight: 2.2,
      eyebrowStyle: "thin-tracked",
      colorPrimary: "#1A1612", colorSecondary: "rgba(26,22,18,0.4)",
    },
    layout: {
      heroHeight: "100vh", heroComposition: "full-bleed-single",
      contentMaxWidth: "460px", sectionSpacing: "28vh",
      imageDominance: 0.85, gridBreaking: false, asymmetry: "none",
    },
    atmosphere: {
      heroApproach: "photographic-full-bleed",
      imageFilter: "brightness(0.9) saturate(0.75) sepia(0.12)",
      depthLayers: 2, idleMotion: "none",
      overlayTreatment: "",
    },
    color: {
      background: "#F6F3EE", foreground: "#1A1612",
      accent: "", secondaryAccent: "",
      imageOverlay: "linear-gradient(to bottom, rgba(246,243,238,0.0) 0%, rgba(246,243,238,0.7) 70%, rgba(246,243,238,0.95) 100%)",
    },
  },

  "trust": {
    type: {
      displaySize: "clamp(34px, 4.2vw, 64px)", displayWeight: 300,
      displayFamily: "'Georgia', serif",
      displayLineHeight: 1.14, displayTracking: "-0.02em",
      subSize: "clamp(14px, 1.1vw, 16px)", subWeight: 400, subLineHeight: 1.9,
      eyebrowStyle: "thin-tracked",
      colorPrimary: "#111", colorSecondary: "rgba(17,17,17,0.45)",
    },
    layout: {
      heroHeight: "90vh", heroComposition: "split-type-image",
      contentMaxWidth: "480px", sectionSpacing: "15vh",
      imageDominance: 0.45, gridBreaking: false, asymmetry: "none",
    },
    atmosphere: {
      heroApproach: "css-atmospheric",
      imageFilter: "none",
      depthLayers: 1, idleMotion: "none",
      overlayTreatment: "",
    },
    color: {
      background: "#FAFAF8", foreground: "#111",
      accent: "", secondaryAccent: "",
      imageOverlay: "rgba(250,250,248,0.1)",
    },
  },

  "joyful ownership": {
    type: {
      displaySize: "clamp(38px, 5vw, 72px)", displayWeight: 700,
      displayFamily: "'Georgia', sans-serif",
      displayLineHeight: 1.0, displayTracking: "-0.02em",
      subSize: "clamp(13px, 1.1vw, 16px)", subWeight: 400, subLineHeight: 1.65,
      eyebrowStyle: "none",
      colorPrimary: "#FFFFFF", colorSecondary: "rgba(255,255,255,0.65)",
    },
    layout: {
      heroHeight: "100vh", heroComposition: "type-over-bleed",
      contentMaxWidth: "520px", sectionSpacing: "10vh",
      imageDominance: 0.7, gridBreaking: false, asymmetry: "subtle",
    },
    atmosphere: {
      heroApproach: "photographic-full-bleed",
      imageFilter: "brightness(1.05) saturate(1.15)",
      depthLayers: 2, idleMotion: "parallax-subtle",
      overlayTreatment: "",
    },
    color: {
      background: "#1A0E08", foreground: "#FFFFFF",
      accent: "", secondaryAccent: "",
      imageOverlay: "linear-gradient(to top, rgba(26,14,8,0.85) 0%, rgba(26,14,8,0.25) 55%, rgba(26,14,8,0) 100%)",
    },
  },

  "tropical vitality": {
    type: {
      displaySize: "clamp(44px, 5.8vw, 88px)", displayWeight: 800,
      displayFamily: "'Helvetica Neue', 'Arial', sans-serif",
      displayLineHeight: 0.96, displayTracking: "-0.025em",
      subSize: "clamp(14px, 1.15vw, 17px)", subWeight: 500, subLineHeight: 1.55,
      eyebrowStyle: "impact-caps",
      colorPrimary: "#FFF8F0", colorSecondary: "rgba(255,248,240,0.6)",
    },
    layout: {
      heroHeight: "100vh", heroComposition: "type-over-bleed",
      contentMaxWidth: "580px", sectionSpacing: "9vh",
      imageDominance: 0.82, gridBreaking: true, asymmetry: "subtle",
    },
    atmosphere: {
      heroApproach: "photographic-full-bleed",
      imageFilter: "brightness(1.08) saturate(1.35) contrast(1.05)",
      depthLayers: 3, idleMotion: "kinetic",
      overlayTreatment: "",
    },
    color: {
      background: "#0A1628", foreground: "#FFF8F0",
      accent: "", secondaryAccent: "",
      imageOverlay: "linear-gradient(to top, rgba(10,22,40,0.72) 0%, rgba(10,22,40,0.18) 50%, rgba(10,22,40,0) 100%)",
    },
  },

  "organic warmth": {
    type: {
      displaySize: "clamp(40px, 5vw, 76px)", displayWeight: 400,
      displayFamily: "'Georgia', 'Palatino Linotype', serif",
      displayLineHeight: 1.04, displayTracking: "-0.02em",
      subSize: "clamp(14px, 1.1vw, 16px)", subWeight: 300, subLineHeight: 1.9,
      eyebrowStyle: "thin-tracked",
      colorPrimary: "#F5EDE0", colorSecondary: "rgba(245,237,224,0.5)",
    },
    layout: {
      heroHeight: "100vh", heroComposition: "full-bleed-single",
      contentMaxWidth: "500px", sectionSpacing: "18vh",
      imageDominance: 0.78, gridBreaking: false, asymmetry: "subtle",
    },
    atmosphere: {
      heroApproach: "photographic-full-bleed",
      imageFilter: "brightness(0.92) saturate(1.05) sepia(0.12)",
      depthLayers: 2, idleMotion: "slow-drift",
      overlayTreatment: "",
    },
    color: {
      background: "#14100A", foreground: "#F5EDE0",
      accent: "", secondaryAccent: "",
      imageOverlay: "linear-gradient(to top, rgba(20,16,10,0.78) 0%, rgba(20,16,10,0.28) 55%, rgba(20,16,10,0) 100%)",
    },
  },

  "creative hunger": {
    type: {
      displaySize: "clamp(40px, 5.5vw, 80px)", displayWeight: 700,
      displayFamily: "'Georgia', sans-serif",
      displayLineHeight: 0.98, displayTracking: "-0.025em",
      subSize: "clamp(13px, 1.1vw, 15px)", subWeight: 400, subLineHeight: 1.6,
      eyebrowStyle: "none",
      colorPrimary: "#FFFFFF", colorSecondary: "rgba(255,255,255,0.55)",
    },
    layout: {
      heroHeight: "100vh", heroComposition: "split-type-image",
      contentMaxWidth: "560px", sectionSpacing: "12vh",
      imageDominance: 0.65, gridBreaking: false, asymmetry: "subtle",
    },
    atmosphere: {
      heroApproach: "photographic-full-bleed",
      imageFilter: "brightness(0.9) saturate(1.1) warmth(1.1)",
      depthLayers: 3, idleMotion: "parallax-subtle",
      overlayTreatment: "",
    },
    color: {
      background: "#0C0808", foreground: "#FFFFFF",
      accent: "", secondaryAccent: "",
      imageOverlay: "linear-gradient(to top, rgba(12,8,8,0.9) 0%, rgba(12,8,8,0.4) 50%, rgba(12,8,8,0.1) 100%)",
    },
  },

  "precision": {
    type: {
      displaySize: "clamp(32px, 4vw, 60px)", displayWeight: 300,
      displayFamily: "'Georgia', serif",
      displayLineHeight: 1.1, displayTracking: "-0.02em",
      subSize: "clamp(13px, 1vw, 15px)", subWeight: 400, subLineHeight: 1.8,
      eyebrowStyle: "thin-tracked",
      colorPrimary: "#0A0A0A", colorSecondary: "rgba(10,10,10,0.4)",
    },
    layout: {
      heroHeight: "85vh", heroComposition: "split-type-image",
      contentMaxWidth: "440px", sectionSpacing: "18vh",
      imageDominance: 0.5, gridBreaking: false, asymmetry: "none",
    },
    atmosphere: {
      heroApproach: "css-atmospheric",
      imageFilter: "none",
      depthLayers: 1, idleMotion: "none",
      overlayTreatment: "",
    },
    color: {
      background: "#FAFAFA", foreground: "#0A0A0A",
      accent: "", secondaryAccent: "",
      imageOverlay: "transparent",
    },
  },
};

// ─── TENSION VISUAL DERIVATION ────────────────────────────────────────────────
// The creative tension (two opposing forces) determines composition behavior.

function deriveTensionVisuals(tension: CreativeConcept["tension"]): Partial<VisualDNA> {
  const rawAbundanceVsRestraint = tension.force1.includes("abundance") || tension.force2.includes("restraint");
  const rawVsPolished = tension.force1.includes("raw") || tension.force2.includes("perfect");
  const dataVsPhysical = tension.force1.includes("data") || tension.force1.includes("analytic");

  return {
    layout: {
      heroHeight: "100vh",
      heroComposition: rawAbundanceVsRestraint ? "type-only-atmospheric" :
                        dataVsPhysical ? "split-type-image" :
                        "full-bleed-single",
      contentMaxWidth: "520px",
      sectionSpacing: rawAbundanceVsRestraint ? "20vh" : "12vh",
      imageDominance: rawAbundanceVsRestraint ? 0.85 : 0.6,
      gridBreaking: tension.force1.includes("chaos") || tension.force2.includes("brutal"),
      asymmetry: rawVsPolished ? "subtle" : "none",
    },
  };
}

// ─── PACING METAPHOR DERIVATION ───────────────────────────────────────────────

function derivePacingFromMetaphor(metaphor: string): {
  speed: VisualDNA["pacing"]["transitionSpeed"];
  enter: VisualDNA["pacing"]["enterAnimation"];
  scroll: VisualDNA["pacing"]["scrollFeel"];
} {
  const m = metaphor.toLowerCase();

  if (m.includes("honey") || m.includes("glacial") || m.includes("museum") || m.includes("meditation"))
    return { speed: "glacial", enter: "blur-reveal", scroll: "continuous" };

  if (m.includes("fast") || m.includes("breaking") || m.includes("bite") || m.includes("immediate"))
    return { speed: "instant", enter: "slam", scroll: "continuous" };

  if (m.includes("morning") || m.includes("sunday") || m.includes("breath"))
    return { speed: "slow", enter: "stagger-slow", scroll: "continuous" };

  if (m.includes("scroll") || m.includes("instagram") || m.includes("film"))
    return { speed: "medium", enter: "stagger-fast", scroll: "stepped" };

  return { speed: "medium", enter: "stagger-slow", scroll: "continuous" };
}

// ─── DENSITY BEAT DERIVATION ──────────────────────────────────────────────────

function deriveDensityBeats(densityFeeling: string, emotion: string): DensityBeat[] {
  const f = densityFeeling.toLowerCase();

  if (f.includes("sparse") || f.includes("almost nothing") || f.includes("radical spars")) {
    return [
      { type: "vacuum",      heightVH: 100, mediaPresence: "dominant",    emotionalRole: "world-opening" },
      { type: "sparse",      heightVH: 80,  mediaPresence: "ambient",     emotionalRole: "idea-introduction" },
      { type: "atmospheric", heightVH: 90,  mediaPresence: "dominant",    emotionalRole: "world-deepening" },
      { type: "editorial",   heightVH: 70,  mediaPresence: "supporting",  emotionalRole: "proof" },
      { type: "sparse",      heightVH: 60,  mediaPresence: "none",        emotionalRole: "conversion" },
    ];
  }

  if (f.includes("overwhelming") || f.includes("collide") || f.includes("overload")) {
    return [
      { type: "maximal",     heightVH: 100, mediaPresence: "overwhelming", emotionalRole: "world-opening" },
      { type: "dense",       heightVH: 80,  mediaPresence: "dominant",     emotionalRole: "capability-proof" },
      { type: "editorial",   heightVH: 70,  mediaPresence: "supporting",   emotionalRole: "social-proof" },
      { type: "maximal",     heightVH: 80,  mediaPresence: "overwhelming", emotionalRole: "desire-creation" },
      { type: "dense",       heightVH: 50,  mediaPresence: "none",         emotionalRole: "conversion" },
    ];
  }

  if (f.includes("one image per screen") || f.includes("one product")) {
    return [
      { type: "atmospheric", heightVH: 100, mediaPresence: "dominant",    emotionalRole: "world-opening" },
      { type: "vacuum",      heightVH: 100, mediaPresence: "dominant",    emotionalRole: "product-reveal" },
      { type: "sparse",      heightVH: 70,  mediaPresence: "none",        emotionalRole: "idea" },
      { type: "atmospheric", heightVH: 100, mediaPresence: "dominant",    emotionalRole: "proof" },
      { type: "sparse",      heightVH: 60,  mediaPresence: "none",        emotionalRole: "conversion" },
    ];
  }

  // Default: balanced editorial rhythm
  return [
    { type: "atmospheric", heightVH: 100, mediaPresence: "dominant",   emotionalRole: "world-opening" },
    { type: "editorial",   heightVH: 80,  mediaPresence: "supporting", emotionalRole: "capability" },
    { type: "dense",       heightVH: 70,  mediaPresence: "supporting", emotionalRole: "proof" },
    { type: "editorial",   heightVH: 70,  mediaPresence: "supporting", emotionalRole: "social-proof" },
    { type: "sparse",      heightVH: 60,  mediaPresence: "none",       emotionalRole: "conversion" },
  ];
}

// ─── OVERLAY AND FILTER BUILDERS ──────────────────────────────────────────────

function buildOverlay(emotion: string, primary: string, secondary: string): string {
  const darkEmotions = ["reverence", "controlled intensity", "aggression", "creative hunger", "joyful ownership", "tropical vitality"];
  const lightEmotions = ["clarity", "trust", "precision"];
  const warmEmotions = ["contemplation", "desire", "permission", "organic warmth"];

  if (darkEmotions.includes(emotion)) {
    return `linear-gradient(to top, rgba(8,8,12,0.92) 0%, rgba(8,8,12,0.5) 45%, rgba(8,8,12,0.08) 100%)`;
  }
  if (lightEmotions.includes(emotion)) {
    return `rgba(250,250,248,0.08)`;
  }
  if (warmEmotions.includes(emotion)) {
    return `linear-gradient(to top, rgba(247,244,239,0.88) 0%, rgba(247,244,239,0.15) 55%, rgba(247,244,239,0.0) 100%)`;
  }
  return `linear-gradient(to top, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.3) 50%, rgba(8,8,8,0.0) 100%)`;
}

function buildImageFilter(treatmentRule: string): string {
  const r = treatmentRule.toLowerCase();
  if (r.includes("dark background") || r.includes("rim lighting"))
    return "brightness(0.78) contrast(1.12) saturate(0.92)";
  if (r.includes("sepia") || r.includes("film"))
    return "brightness(0.88) contrast(1.05) saturate(0.75) sepia(0.1)";
  if (r.includes("contrast cranked") || r.includes("hue amplified"))
    return "brightness(1.05) contrast(1.28) saturate(1.35)";
  if (r.includes("no filters") || r.includes("product's actual color"))
    return "none";
  if (r.includes("desaturated") || r.includes("lifted blacks"))
    return "brightness(0.92) saturate(0.72) contrast(0.98)";
  return "brightness(0.85) contrast(1.08)";
}

function buildDefaultVisualDNA(primary: string, secondary: string, accent: string): VisualDNA {
  return {
    concept: {
      coreIdea: "Built for people who care about getting it right.",
      emotion: "trust",
      tension: { force1: "ambition", force2: "simplicity" },
      heroMoment: "A product doing exactly what it promises.",
      typeAttitude: "Clear, warm, unhurried.",
      imageTreatmentRule: "Natural light. Real people. No stock photo energy.",
      pacingMetaphor: "A confident pitch from someone who knows their product cold.",
      densityFeeling: "Enough to prove it. Not so much that you doubt it.",
    },
    type: {
      displaySize: "clamp(42px, 5.5vw, 80px)", displayWeight: 500,
      displayFamily: "'Georgia', serif",
      displayLineHeight: 1.05, displayTracking: "-0.025em",
      subSize: "clamp(14px, 1.2vw, 17px)", subWeight: 300, subLineHeight: 1.75,
      eyebrowStyle: "mono-spaced",
      colorPrimary: "#F0EFEE", colorSecondary: "rgba(240,239,238,0.45)",
    },
    layout: {
      heroHeight: "100vh", heroComposition: "split-type-image",
      contentMaxWidth: "540px", sectionSpacing: "15vh",
      imageDominance: 0.65, gridBreaking: false, asymmetry: "subtle",
    },
    atmosphere: {
      heroApproach: "css-atmospheric",
      overlayTreatment: `linear-gradient(to top, rgba(8,8,12,0.9) 0%, rgba(8,8,12,0.4) 50%, rgba(8,8,12,0.05) 100%)`,
      imageFilter: "brightness(0.82) contrast(1.08)",
      depthLayers: 3, idleMotion: "slow-drift",
    },
    pacing: {
      sectionPattern: [
        { type: "atmospheric", heightVH: 100, mediaPresence: "dominant",   emotionalRole: "world-opening" },
        { type: "editorial",   heightVH: 75,  mediaPresence: "supporting", emotionalRole: "capability" },
        { type: "dense",       heightVH: 65,  mediaPresence: "none",       emotionalRole: "proof" },
        { type: "sparse",      heightVH: 60,  mediaPresence: "none",       emotionalRole: "conversion" },
      ],
      transitionSpeed: "medium", enterAnimation: "stagger-slow", scrollFeel: "continuous",
    },
    color: {
      background: "#080810", foreground: "#F0EFEE",
      accent: primary, secondaryAccent: secondary,
      imageOverlay: `linear-gradient(to top, rgba(8,8,16,0.92) 0%, rgba(8,8,16,0.45) 45%, rgba(8,8,16,0.08) 100%)`,
    },
  };
}

// ─── CONCEPT KEY RESOLVER ─────────────────────────────────────────────────────
// Maps category + direction → conceptKey, with fallback chain

export function resolveConceptKey(category: string, direction: string): string {
  const key = `${category}::${direction}` as ConceptKey;
  if (CREATIVE_CONCEPTS[key]) return key;

  // Try with just the category's default direction
  const defaultDirectionMap: Record<string, string> = {
    "fresh-produce": "premium-dark",
    "sports-analytics": "premium-dark",
    "fashion-apparel": "luxury-editorial",
    "creator-tools": "genz-vibrant",
    "wellness-mindfulness": "luxury-editorial",
    "food-beverage": "premium-dark",
    "software-saas": "minimal-clean",
    "finance-fintech": "minimal-clean",
    "health-medical": "minimal-clean",
    "education-learning": "minimal-clean",
    "home-living": "luxury-editorial",
    "travel-experience": "luxury-editorial",
  };

  const fallbackDirection = defaultDirectionMap[category] || "minimal-clean";
  const fallbackKey = `${category}::${fallbackDirection}` as ConceptKey;
  if (CREATIVE_CONCEPTS[fallbackKey]) return fallbackKey;

  return `fresh-produce::minimal-clean`; // ultimate fallback
}
