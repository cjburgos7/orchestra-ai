/**
 * Orchestra Foundation Library.
 *
 * Six authored design foundations derived from studied premium design principles
 * (editorial spacing hierarchy, cinematic motion timing, luxury typography scale,
 * product-forward layout logic, trust-building section pacing).
 *
 * No verbatim layouts, code, or prompts from any external source. These foundations
 * are authored from first principles and tested aesthetic judgment.
 *
 * selectFoundation(brief) scores each foundation against brief signals
 * and returns the highest match. Foundation supplies ALL structure/motion/spacing;
 * Claude supplies content only.
 */

import type { Foundation } from "./types";
import type { StartupBrief } from "@/lib/types/startup";

// ─── Foundation 1: luxury-editorial ──────────────────────────────────────────
// Atmosphere-first. Emotion precedes logic. Restraint as premium signal.
// Studied from: editorial magazine pacing, premium subscription brands, slow-living aesthetics.
const luxuryEditorial: Foundation = {
  id: "luxury-editorial",
  name: "Luxury Editorial",
  bestFor: [
    "lifestyle", "subscription", "wellness", "ritual", "artisan", "botanical",
    "slow living", "seasonal", "craft", "beauty", "floral", "organic", "curated",
    "membership", "skincare", "spa", "tea", "candle", "linen", "ceramics",
  ],
  layoutArchetype: "editorial-dominant",
  typographyPersonality: "editorial-serif",
  lightingModel: "diffused morning light through linen, warm shadow pooling on matte surfaces, natural imperfection visible in texture, unhurried golden warmth",
  palette: {
    background: "#0c0a09",
    foreground: "#f5f0ea",
    accentColor: "#c9a87c",
    meshFrom: "#1a1410",
    meshTo: "#0c0a09",
  },
  motion: {
    enter: "fade-up",
    duration: 0.9,
    stagger: 0.15,
    scroll: "drift",
  },
  spacing: {
    sectionGap: 140,
    contentMax: 780,
    rhythm: 8,
  },
  sectionSequence: [
    "hero-cinematic",
    "story-editorial",
    "feature-asymmetric",
    "testimonial-float",
    "cta-immersive",
  ],
  contentSlots: {
    "hero-cinematic": [
      { key: "eyebrow", description: "Category-defining phrase, 3-5 words", maxWords: 5, required: false },
      { key: "headline", description: "Atmospheric emotional entry, 5-8 words, no product nouns", maxWords: 8, required: true },
      { key: "subheadline", description: "Sensory promise, 15-25 words", maxWords: 25, required: true },
      { key: "ctaPrimary", description: "Invitation, not command. 2-4 words", maxWords: 4, required: true },
      { key: "imageSubject", description: "Physical scene only — light, surface, material, atmosphere. No category nouns.", maxWords: 35, required: true },
    ],
    "story-editorial": [
      { key: "headline", description: "Founder belief as statement, 8-12 words", maxWords: 12, required: true },
      { key: "body", description: "First-person founder voice, 50-80 words, specific and personal", maxWords: 80, required: true },
      { key: "imageSubject", description: "Physical scene — hands, material, process. No faces.", maxWords: 35, required: true },
    ],
    "feature-asymmetric": [
      { key: "headline", description: "One thing this does or is, 6-10 words", maxWords: 10, required: true },
      { key: "body", description: "Specific, sensory description, 20-35 words", maxWords: 35, required: true },
      { key: "imageSubject", description: "Physical scene complementary to the feature. No category nouns.", maxWords: 35, required: true },
    ],
    "testimonial-float": [
      { key: "quote", description: "Real-feeling customer voice, 20-40 words, specific and personal", maxWords: 40, required: true },
      { key: "name", description: "First name or first + last initial", maxWords: 4, required: true },
      { key: "role", description: "2-5 word description of who they are", maxWords: 5, required: false },
    ],
    "cta-immersive": [
      { key: "headline", description: "The ask as emotional invitation, 6-10 words", maxWords: 10, required: true },
      { key: "subheadline", description: "What happens next, reassuring, 15-25 words", maxWords: 25, required: true },
      { key: "buttonText", description: "Action word + context, 2-4 words", maxWords: 4, required: true },
      { key: "imageSubject", description: "Full-bleed atmospheric closing scene. Same world as hero.", maxWords: 35, required: true },
    ],
    // unused section types in this foundation — empty slots required by type
    "hero-editorial-luxury": [],
    "hero-split-kinetic": [],
    "hero-athletic": [],
    "hero-product-saas": [],
    "stats-band": [],
    "editorial-mosaic": [],
    "proof-gallery": [],
  },
};

// ─── Foundation 2: product-saas ──────────────────────────────────────────────
// Proof before depth. Product as the argument. Precision as trust signal.
// Studied from: B2B SaaS landing page hierarchy, developer tool clarity, data-forward credibility patterns.
const productSaas: Foundation = {
  id: "product-saas",
  name: "Product SaaS",
  bestFor: [
    "SaaS", "B2B", "analytics", "dashboard", "developer", "platform", "API",
    "enterprise", "software", "data", "tracking", "automation", "tool", "workflow",
    "productivity", "reporting", "intelligence", "coaching platform", "fintech",
  ],
  layoutArchetype: "product-forward",
  typographyPersonality: "bold-sans",
  lightingModel: "cold blue-white ambient, institutional precision, high-contrast edges, technical surfaces under fluorescent cool light",
  palette: {
    background: "#080c10",
    foreground: "#e0e4e8",
    accentColor: "#4f8ef7",
    meshFrom: "#0d1520",
    meshTo: "#080c10",
  },
  motion: {
    enter: "fade",
    duration: 0.5,
    stagger: 0.08,
    scroll: "reveal",
  },
  spacing: {
    sectionGap: 96,
    contentMax: 1080,
    rhythm: 6,
  },
  sectionSequence: [
    "hero-product-saas",
    "stats-band",
    "feature-asymmetric",
    "feature-asymmetric",
    "proof-gallery",
    "cta-immersive",
  ],
  contentSlots: {
    "hero-product-saas": [
      { key: "eyebrow", description: "Category + audience in 3-5 words", maxWords: 5, required: false },
      { key: "headline", description: "Specific capability claim, 5-8 words, direct", maxWords: 8, required: true },
      { key: "subheadline", description: "Who it's for and what changes, 15-25 words", maxWords: 25, required: true },
      { key: "ctaPrimary", description: "Trial/demo action, 2-4 words", maxWords: 4, required: true },
      { key: "ctaSecondary", description: "Lower-friction alternative, 2-4 words", maxWords: 4, required: false },
      { key: "imageSubject", description: "Physical environment of the user — desk, screen glow, working posture. No UI elements described literally.", maxWords: 35, required: true },
    ],
    "stats-band": [
      { key: "stat1Value", description: "Number or metric", maxWords: 3, required: true },
      { key: "stat1Label", description: "What it measures, 2-4 words", maxWords: 4, required: true },
      { key: "stat2Value", description: "Number or metric", maxWords: 3, required: true },
      { key: "stat2Label", description: "What it measures, 2-4 words", maxWords: 4, required: true },
      { key: "stat3Value", description: "Number or metric", maxWords: 3, required: true },
      { key: "stat3Label", description: "What it measures, 2-4 words", maxWords: 4, required: true },
      { key: "stat4Value", description: "Number or metric", maxWords: 3, required: false },
      { key: "stat4Label", description: "What it measures, 2-4 words", maxWords: 4, required: false },
    ],
    "feature-asymmetric": [
      { key: "headline", description: "Specific capability, 6-10 words, practitioner language", maxWords: 10, required: true },
      { key: "body", description: "What it does and why it matters, 25-40 words", maxWords: 40, required: true },
      { key: "imageSubject", description: "Physical environment or material correlating to this capability. No tech nouns.", maxWords: 35, required: true },
    ],
    "proof-gallery": [
      { key: "sectionTitle", description: "Who uses it, 5-8 words", maxWords: 8, required: true },
      { key: "quote1", description: "Testimonial, 20-35 words, specific result or insight", maxWords: 35, required: true },
      { key: "name1", description: "First name + last initial", maxWords: 4, required: true },
      { key: "role1", description: "Title + company type, 4-6 words", maxWords: 6, required: true },
      { key: "quote2", description: "Different angle than quote1", maxWords: 35, required: true },
      { key: "name2", description: "First name + last initial", maxWords: 4, required: true },
      { key: "role2", description: "Title + company type, 4-6 words", maxWords: 6, required: true },
      { key: "quote3", description: "Third testimonial, different angle", maxWords: 35, required: false },
      { key: "name3", description: "First name + last initial", maxWords: 4, required: false },
      { key: "role3", description: "Title + company type", maxWords: 6, required: false },
    ],
    "cta-immersive": [
      { key: "headline", description: "The decision moment, direct, 6-10 words", maxWords: 10, required: true },
      { key: "subheadline", description: "What trial/onboarding looks like, 15-25 words", maxWords: 25, required: true },
      { key: "buttonText", description: "Start action, 2-4 words", maxWords: 4, required: true },
      { key: "imageSubject", description: "Physical scene: focused work environment, late-night clarity, early-morning start. No tech nouns.", maxWords: 35, required: true },
    ],
    "hero-cinematic": [],
    "hero-editorial-luxury": [],
    "hero-split-kinetic": [],
    "hero-athletic": [],
    "story-editorial": [],
    "editorial-mosaic": [],
    "testimonial-float": [],
  },
};

// ─── Foundation 3: kinetic-bold ──────────────────────────────────────────────
// Energy before explanation. Ambition as the product. Transformation as the promise.
// Studied from: performance brand hierarchy, athletic campaign typography, transformation narrative pacing.
const kineticBold: Foundation = {
  id: "kinetic-bold",
  name: "Kinetic Bold",
  bestFor: [
    "fitness", "gym", "training", "performance", "athlete", "sports", "strength",
    "transformation", "coaching", "competition", "endurance", "martial arts",
    "crossfit", "running", "cycling", "nutrition", "supplement",
  ],
  layoutArchetype: "kinetic-statement",
  typographyPersonality: "bold-sans",
  lightingModel: "dramatic single overhead beam, harsh concrete shadow, raw industrial floor, sweat-heavy air, pre-dawn urgency",
  palette: {
    background: "#0a0a0a",
    foreground: "#f0f0f0",
    accentColor: "#e8ff4d",
    meshFrom: "#111111",
    meshTo: "#0a0a0a",
  },
  motion: {
    enter: "slide-up",
    duration: 0.4,
    stagger: 0.06,
    scroll: "parallax",
  },
  spacing: {
    sectionGap: 80,
    contentMax: 1200,
    rhythm: 6,
  },
  sectionSequence: [
    "hero-athletic",
    "stats-band",
    "feature-asymmetric",
    "testimonial-float",
    "cta-immersive",
  ],
  contentSlots: {
    "hero-athletic": [
      { key: "statValue", description: "The most compelling proof number", maxWords: 3, required: true },
      { key: "statLabel", description: "What it measures, 3-5 words", maxWords: 5, required: true },
      { key: "headline", description: "Ambition statement, 4-7 words, bold, active", maxWords: 7, required: true },
      { key: "subheadline", description: "Who it's for and what changes, 15-20 words", maxWords: 20, required: true },
      { key: "ctaPrimary", description: "Action verb + context, 2-4 words", maxWords: 4, required: true },
      { key: "imageSubject", description: "Physical training environment — surface, light, equipment texture, atmosphere. No people.", maxWords: 35, required: true },
    ],
    "stats-band": [
      { key: "stat1Value", description: "Key performance or adoption metric", maxWords: 3, required: true },
      { key: "stat1Label", description: "2-4 words", maxWords: 4, required: true },
      { key: "stat2Value", description: "Transformation or outcome metric", maxWords: 3, required: true },
      { key: "stat2Label", description: "2-4 words", maxWords: 4, required: true },
      { key: "stat3Value", description: "Time or intensity metric", maxWords: 3, required: true },
      { key: "stat3Label", description: "2-4 words", maxWords: 4, required: true },
    ],
    "feature-asymmetric": [
      { key: "headline", description: "What this trains, builds, or transforms, 6-10 words", maxWords: 10, required: true },
      { key: "body", description: "What you get and how it works, 20-35 words", maxWords: 35, required: true },
      { key: "imageSubject", description: "Physical equipment or environment that embodies this feature. No people. No tech nouns.", maxWords: 35, required: true },
    ],
    "testimonial-float": [
      { key: "quote", description: "Transformation result in athlete's own words, 20-40 words", maxWords: 40, required: true },
      { key: "name", description: "First name", maxWords: 3, required: true },
      { key: "role", description: "Sport or context, 2-5 words", maxWords: 5, required: false },
    ],
    "cta-immersive": [
      { key: "headline", description: "The commitment moment, 5-8 words, urgent but earned", maxWords: 8, required: true },
      { key: "subheadline", description: "What starting looks like, 15-20 words", maxWords: 20, required: true },
      { key: "buttonText", description: "Start action, 2-4 words", maxWords: 4, required: true },
      { key: "imageSubject", description: "Pre-dawn training environment — empty, anticipatory, raw. No people.", maxWords: 35, required: true },
    ],
    "hero-cinematic": [],
    "hero-editorial-luxury": [],
    "hero-split-kinetic": [],
    "hero-product-saas": [],
    "story-editorial": [],
    "editorial-mosaic": [],
    "proof-gallery": [],
  },
};

// ─── Foundation 4: local-trust ────────────────────────────────────────────────
// Community before conversion. Warmth as the differentiator. Story before sell.
// Studied from: local business website patterns, neighborhood service trust signals, community-forward layout pacing.
const localTrust: Foundation = {
  id: "local-trust",
  name: "Local Trust",
  bestFor: [
    "local", "restaurant", "café", "bakery", "salon", "barbershop", "dentist",
    "contractor", "plumber", "electrician", "real estate", "school", "tutoring",
    "community", "neighborhood", "family business", "service", "repair", "cleaning",
    "landscaping", "childcare", "veterinary", "physical therapy",
  ],
  layoutArchetype: "editorial-dominant",
  typographyPersonality: "modern-sans",
  lightingModel: "golden hour window light, worn wood surfaces, community warmth, familiar neighborhood textures, morning coffee steam",
  palette: {
    background: "#faf8f5",
    foreground: "#1a1714",
    accentColor: "#c67c3e",
    meshFrom: "#f5f1ea",
    meshTo: "#faf8f5",
  },
  motion: {
    enter: "fade-up",
    duration: 0.7,
    stagger: 0.12,
    scroll: "reveal",
  },
  spacing: {
    sectionGap: 120,
    contentMax: 920,
    rhythm: 8,
  },
  sectionSequence: [
    "hero-split-kinetic",
    "story-editorial",
    "proof-gallery",
    "testimonial-float",
    "cta-immersive",
  ],
  contentSlots: {
    "hero-split-kinetic": [
      { key: "eyebrow", description: "Location + what you do, 3-5 words", maxWords: 5, required: false },
      { key: "headline", description: "What the neighborhood gets from you, 5-8 words, warm and specific", maxWords: 8, required: true },
      { key: "subheadline", description: "Your specific offer, location, and what makes you different, 15-25 words", maxWords: 25, required: true },
      { key: "ctaPrimary", description: "Book/call/visit action, 2-4 words", maxWords: 4, required: true },
      { key: "imageSubject", description: "Physical interior or exterior detail — texture, light, the space itself. No people. No product items literally.", maxWords: 35, required: true },
    ],
    "story-editorial": [
      { key: "headline", description: "Why this business exists, 8-12 words, personal and specific", maxWords: 12, required: true },
      { key: "body", description: "Founder or family story, neighborhood connection, 50-80 words. Warm and specific.", maxWords: 80, required: true },
      { key: "imageSubject", description: "Behind-the-scenes physical space — workspace, tools, early morning setup. No people.", maxWords: 35, required: true },
    ],
    "proof-gallery": [
      { key: "sectionTitle", description: "What the community says, 5-8 words", maxWords: 8, required: true },
      { key: "quote1", description: "Neighbor review, specific and warm, 20-35 words", maxWords: 35, required: true },
      { key: "name1", description: "First name", maxWords: 3, required: true },
      { key: "role1", description: "Neighborhood identifier, 2-4 words", maxWords: 4, required: false },
      { key: "quote2", description: "Different angle, specific result", maxWords: 35, required: true },
      { key: "name2", description: "First name", maxWords: 3, required: true },
      { key: "role2", description: "Neighborhood identifier", maxWords: 4, required: false },
      { key: "quote3", description: "Third voice, different situation", maxWords: 35, required: false },
      { key: "name3", description: "First name", maxWords: 3, required: false },
      { key: "role3", description: "Neighborhood identifier", maxWords: 4, required: false },
    ],
    "testimonial-float": [
      { key: "quote", description: "The review that captures the feeling of the place, 20-40 words", maxWords: 40, required: true },
      { key: "name", description: "First name", maxWords: 3, required: true },
      { key: "role", description: "Regular, neighbor, customer for X years, 2-5 words", maxWords: 5, required: false },
    ],
    "cta-immersive": [
      { key: "headline", description: "The invitation, warm and specific, 5-8 words", maxWords: 8, required: true },
      { key: "subheadline", description: "How to reach you, hours, next step, 15-25 words", maxWords: 25, required: true },
      { key: "buttonText", description: "Specific action, 2-4 words", maxWords: 4, required: true },
      { key: "imageSubject", description: "Exterior or interior at the best moment of day — warm light, inviting. No people.", maxWords: 35, required: true },
    ],
    "hero-cinematic": [],
    "hero-editorial-luxury": [],
    "hero-athletic": [],
    "hero-product-saas": [],
    "stats-band": [],
    "feature-asymmetric": [],
    "editorial-mosaic": [],
  },
};

// ─── Foundation 5: creator-media ─────────────────────────────────────────────
// Portfolio before pitch. Range as the argument. Voice as the differentiator.
// Studied from: creative agency pacing, editorial photography layout logic, studio identity restraint.
const creatorMedia: Foundation = {
  id: "creator-media",
  name: "Creator Media",
  bestFor: [
    "creative agency", "photography", "film", "videography", "design studio", "portfolio",
    "freelance", "media", "artist", "illustrator", "brand studio", "content creator",
    "copywriter", "consultant", "strategist", "creative director", "production",
  ],
  layoutArchetype: "editorial-dominant",
  typographyPersonality: "editorial-serif",
  lightingModel: "studio flash on matte surfaces, sharp editorial contrast, texture visible in every shadow, deliberate negative space, controlled restraint",
  palette: {
    background: "#0d0d0d",
    foreground: "#f0ede8",
    accentColor: "#e8d5b0",
    meshFrom: "#161412",
    meshTo: "#0d0d0d",
  },
  motion: {
    enter: "reveal",
    duration: 0.8,
    stagger: 0.1,
    scroll: "drift",
  },
  spacing: {
    sectionGap: 160,
    contentMax: 1100,
    rhythm: 10,
  },
  sectionSequence: [
    "hero-editorial-luxury",
    "editorial-mosaic",
    "feature-asymmetric",
    "proof-gallery",
    "cta-immersive",
  ],
  contentSlots: {
    "hero-editorial-luxury": [
      { key: "eyebrow", description: "Discipline + location, 3-5 words", maxWords: 5, required: false },
      { key: "headline", description: "Point of view, not what you do — what you believe about the work, 5-10 words", maxWords: 10, required: true },
      { key: "subheadline", description: "Who you work with and what you deliver, 15-25 words", maxWords: 25, required: true },
      { key: "ctaPrimary", description: "View work or start a project, 2-4 words", maxWords: 4, required: true },
      { key: "imageSubject", description: "Studio environment — light falling on a working surface, equipment at rest, material mid-process. No people.", maxWords: 35, required: true },
    ],
    "editorial-mosaic": [
      { key: "headline", description: "The range of the work, 6-10 words", maxWords: 10, required: true },
      { key: "body", description: "What the portfolio represents, 25-40 words", maxWords: 40, required: true },
      { key: "imageSubject1", description: "First mosaic scene — environment, material, light. Different angle from hero.", maxWords: 35, required: true },
      { key: "imageSubject2", description: "Second mosaic scene — contrasting mood", maxWords: 35, required: true },
      { key: "imageSubject3", description: "Third mosaic scene — atmospheric detail", maxWords: 35, required: true },
    ],
    "feature-asymmetric": [
      { key: "headline", description: "Service or capability as an editorial statement, 6-10 words", maxWords: 10, required: true },
      { key: "body", description: "Process, approach, or what you deliver specifically, 25-40 words", maxWords: 40, required: true },
      { key: "imageSubject", description: "Physical creative process — material, tool, surface, light. No tech or literal product descriptions.", maxWords: 35, required: true },
    ],
    "proof-gallery": [
      { key: "sectionTitle", description: "What clients and collaborators say, 5-8 words", maxWords: 8, required: true },
      { key: "quote1", description: "Collaboration experience, specific and professional, 20-35 words", maxWords: 35, required: true },
      { key: "name1", description: "First name + last initial", maxWords: 4, required: true },
      { key: "role1", description: "Company + context, 4-6 words", maxWords: 6, required: true },
      { key: "quote2", description: "Different project angle", maxWords: 35, required: true },
      { key: "name2", description: "First name + last initial", maxWords: 4, required: true },
      { key: "role2", description: "Company + context", maxWords: 6, required: true },
      { key: "quote3", description: "Third voice, outcome-focused", maxWords: 35, required: false },
      { key: "name3", description: "First name + last initial", maxWords: 4, required: false },
      { key: "role3", description: "Company + context", maxWords: 6, required: false },
    ],
    "cta-immersive": [
      { key: "headline", description: "Start of a collaboration, 5-8 words, direct", maxWords: 8, required: true },
      { key: "subheadline", description: "Who to reach out, timeline, how you work, 15-25 words", maxWords: 25, required: true },
      { key: "buttonText", description: "Contact or project start action, 2-4 words", maxWords: 4, required: true },
      { key: "imageSubject", description: "Studio or workspace at its most atmospheric — end of session, golden hour, quiet. No people.", maxWords: 35, required: true },
    ],
    "hero-cinematic": [],
    "hero-split-kinetic": [],
    "hero-athletic": [],
    "hero-product-saas": [],
    "stats-band": [],
    "story-editorial": [],
    "testimonial-float": [],
  },
};

// ─── Foundation 6: ecommerce-clean ───────────────────────────────────────────
// Product as the character. Breadth before depth. Purchase confidence before commitment.
// Studied from: DTC product launch pacing, editorial product photography hierarchy, clean commerce conversion flow.
const ecommerceClean: Foundation = {
  id: "ecommerce-clean",
  name: "Ecommerce Clean",
  bestFor: [
    "shop", "store", "retail", "fashion", "accessories", "merchandise", "DTC", "brand",
    "apparel", "jewelry", "skincare product", "food product", "home goods", "furniture",
    "marketplace", "clothing", "sneakers", "bags", "ceramics shop", "print shop",
  ],
  layoutArchetype: "product-forward",
  typographyPersonality: "modern-sans",
  lightingModel: "clean white product light with directional fill, precise material rendering, minimal cast shadow, textural surface detail",
  palette: {
    background: "#fafafa",
    foreground: "#111111",
    accentColor: "#111111",
    meshFrom: "#f5f5f5",
    meshTo: "#fafafa",
  },
  motion: {
    enter: "fade",
    duration: 0.55,
    stagger: 0.09,
    scroll: "float",
  },
  spacing: {
    sectionGap: 100,
    contentMax: 1200,
    rhythm: 8,
  },
  sectionSequence: [
    "hero-split-kinetic",
    "editorial-mosaic",
    "feature-asymmetric",
    "proof-gallery",
    "cta-immersive",
  ],
  contentSlots: {
    "hero-split-kinetic": [
      { key: "eyebrow", description: "Collection name or brand category, 2-4 words", maxWords: 4, required: false },
      { key: "headline", description: "Product promise or collection statement, 4-8 words", maxWords: 8, required: true },
      { key: "subheadline", description: "What you make, for whom, what makes it different, 15-25 words", maxWords: 25, required: true },
      { key: "ctaPrimary", description: "Shop action, 2-4 words", maxWords: 4, required: true },
      { key: "ctaSecondary", description: "Explore or browse action, 2-4 words", maxWords: 4, required: false },
      { key: "imageSubject", description: "Product material or environment — textile, surface, object in context. No people, no price tags.", maxWords: 35, required: true },
    ],
    "editorial-mosaic": [
      { key: "headline", description: "The range of what you make, 5-8 words", maxWords: 8, required: true },
      { key: "body", description: "What the collection is, craft or ethos, 25-40 words", maxWords: 40, required: true },
      { key: "imageSubject1", description: "Product in natural context — surface, light, material. Not a product shot.", maxWords: 35, required: true },
      { key: "imageSubject2", description: "Different angle of the material world. Contrasting scale or texture.", maxWords: 35, required: true },
      { key: "imageSubject3", description: "Detail or atmospheric close-up. Same world, different focus.", maxWords: 35, required: true },
    ],
    "feature-asymmetric": [
      { key: "headline", description: "Product quality or craft differentiator, 5-9 words", maxWords: 9, required: true },
      { key: "body", description: "Materials, process, or what makes this different, 20-35 words", maxWords: 35, required: true },
      { key: "imageSubject", description: "Physical material or craft process — texture, making, finish. No people, no explicit product names.", maxWords: 35, required: true },
    ],
    "proof-gallery": [
      { key: "sectionTitle", description: "Who buys this and why, 5-8 words", maxWords: 8, required: true },
      { key: "quote1", description: "Customer experience with the product, 20-35 words, specific", maxWords: 35, required: true },
      { key: "name1", description: "First name", maxWords: 3, required: true },
      { key: "role1", description: "How they use it, 2-5 words", maxWords: 5, required: false },
      { key: "quote2", description: "Different product or use case", maxWords: 35, required: true },
      { key: "name2", description: "First name", maxWords: 3, required: true },
      { key: "role2", description: "How they use it", maxWords: 5, required: false },
      { key: "quote3", description: "Gift or repeat buyer voice", maxWords: 35, required: false },
      { key: "name3", description: "First name", maxWords: 3, required: false },
      { key: "role3", description: "How they use it", maxWords: 5, required: false },
    ],
    "cta-immersive": [
      { key: "headline", description: "Shop invitation, specific and warm, 4-8 words", maxWords: 8, required: true },
      { key: "subheadline", description: "Shipping, returns, or what makes buying easy, 15-25 words", maxWords: 25, required: true },
      { key: "buttonText", description: "Shop action, 2-4 words", maxWords: 4, required: true },
      { key: "imageSubject", description: "Product lifestyle environment — the moment of use or the shelf it belongs on. No people.", maxWords: 35, required: true },
    ],
    "hero-cinematic": [],
    "hero-editorial-luxury": [],
    "hero-athletic": [],
    "hero-product-saas": [],
    "stats-band": [],
    "story-editorial": [],
    "testimonial-float": [],
  },
};

// ─── Foundation #1 — Aethera ─────────────────────────────────────────────────
// Cinematic hero with looping video background. Fullscreen, white/black palette,
// Instrument Serif display + Inter body. Structure is FIXED — only content slots swap.
const foundation1: Foundation = {
  id: "foundation-1",
  name: "Foundation 1 — Cinematic Hero",
  componentId: "foundation-1",
  bestFor: [
    "luxury", "premium", "sound", "music", "studio", "architecture", "florist", "flowers",
    "editorial", "art", "gallery", "fashion", "boutique", "atelier", "bespoke",
    "creative", "film", "production", "brand", "identity", "high-end", "timeless",
    "design studio", "composer", "producer", "sculptor", "jeweler", "perfume",
  ],
  layoutArchetype: "editorial-dominant",
  typographyPersonality: "editorial-serif",
  lightingModel: "diffused white studio light, minimal shadow, clean surfaces, cinematic restraint",
  palette: {
    background: "#ffffff",
    foreground: "#000000",
    accentColor: "#6F6F6F",
    meshFrom: "#f5f5f5",
    meshTo: "#ffffff",
  },
  motion: {
    enter: "fade-up",
    duration: 0.8,
    stagger: 0.2,
    scroll: "drift",
  },
  spacing: {
    sectionGap: 160,
    contentMax: 1280,
    rhythm: 8,
  },
  sectionSequence: [],
  contentSlots: {
    "hero-cinematic": [],
    "hero-editorial-luxury": [],
    "hero-split-kinetic": [],
    "hero-athletic": [],
    "hero-product-saas": [],
    "stats-band": [],
    "story-editorial": [],
    "feature-asymmetric": [],
    "testimonial-float": [],
    "editorial-mosaic": [],
    "proof-gallery": [],
    "cta-immersive": [],
  },
};

// ─── Registry + Selection ─────────────────────────────────────────────────────

export const FOUNDATIONS: Foundation[] = [
  foundation1,
  luxuryEditorial,
  productSaas,
  kineticBold,
  localTrust,
  creatorMedia,
  ecommerceClean,
];

export function getFoundation(id: string): Foundation {
  return FOUNDATIONS.find((f) => f.id === id) ?? luxuryEditorial;
}

/**
 * Score a foundation against brief signals. Returns the highest-scoring match.
 * Scoring is keyword frequency across brief text fields — no category fallback.
 */
export function selectFoundation(brief: StartupBrief): Foundation {
  const text = [
    brief.startupCategory ?? "",
    brief.brandPersonality ?? "",
    brief.founderMission ?? "",
    brief.audience ?? "",
    brief.brandTone ?? "",
    brief.description ?? "",
    brief.marketPositioning ?? "",
  ]
    .join(" ")
    .toLowerCase();

  let best = FOUNDATIONS[0];
  let bestScore = 0;

  for (const foundation of FOUNDATIONS) {
    const score = foundation.bestFor.reduce(
      (acc, keyword) => acc + (text.includes(keyword.toLowerCase()) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = foundation;
    }
  }

  return best;
}

export type { Foundation, LayoutArchetype, FoundationMotion, FoundationSpacing, ContentSlot } from "./types";
