import type { StartupProject } from "@/lib/types/startup";

// ── Types ──────────────────────────────────────────────────────────────────

export type LovableTechStack = "classic" | "modern";

export type LovableHandoffPayload = {
  projectName: string;
  prompt: string;
  techStack: LovableTechStack;
};

export type LovableHandoffResult = {
  projectId: string;
  editorUrl: string;
  previewUrl: string;
};

// ── Direction → visual identity mapping ──────────────────────────────────

const DIRECTION_STYLE: Record<string, string> = {
  "orchestra":           "Dark cinematic: deep navy/near-black backgrounds, purple-violet accents, atmospheric depth, premium glassmorphism",
  "premium-dark":        "Premium dark: rich midnight backgrounds, gold or platinum accents, editorial typography, luxury texture",
  "bold-experimental":   "Bold experimental: high contrast, vivid accent colors, asymmetric layouts, oversized typography",
  "minimal-clean":       "Minimal clean: white or off-white backgrounds, single accent color, generous whitespace, refined typography",
  "luxury-editorial":    "Luxury editorial: muted palette, serif headlines, editorial grid, refined luxury aesthetic",
  "glass-futuristic":    "Glass futuristic: dark backgrounds, frosted glass panels, neon glow effects, holographic accents",
  "creator-playful":     "Creator playful: bright saturated colors, rounded corners, friendly illustrations, approachable UI",
  "apple-modern":        "Apple modern: ultra-minimal, smooth animations, SF Pro-style typography, monochrome with single accent",
  "retro-tech":          "Retro tech: terminal green on dark, monospace fonts, grid lines, nostalgic computing aesthetic",
  "creative-agency":     "Creative agency: bold typography, high-contrast color blocking, portfolio-style composition",
  "fashion-ai":          "Fashion AI: clean editorial, model-forward imagery, cool neutral palette, high-end fashion aesthetic",
  "genz-vibrant":        "Gen-Z vibrant: hot pink/electric blue/lime, 3D elements, glassmorphism, maximalist energy",
  "cinematic-ai":        "Cinematic AI: photorealistic scenes, wide-format hero imagery, film-grade color grading, dramatic lighting",
  "minimal-luxury":      "Minimal luxury: cream/ivory backgrounds, matte black accents, generous spacing, premium sans-serif",
};

// ── Prompt builder ─────────────────────────────────────────────────────────

export function buildLovablePrompt(project: StartupProject): string {
  const direction = project.selectedDirection ?? project.directions[0] ?? "minimal-clean";
  const style = DIRECTION_STYLE[direction] ?? "Modern, clean, professional SaaS aesthetic";
  const featureList = project.features.slice(0, 6).map((f, i) => `  ${i + 1}. ${f}`).join("\n");
  const pricingTiers = project.pricing.tiers
    .map((t) => `  - **${t.name}**: ${t.price} — ${t.detail}`)
    .join("\n");

  return `Build a complete, production-ready SaaS landing page and app scaffold for **${project.startupName}**.

## Product Overview
**Tagline**: ${project.tagline}
**Description**: ${project.description}
**Target audience**: ${project.audience || "modern professionals"}
**Brand tone**: ${project.brandTone || "professional, forward-thinking"}
**Category**: ${project.startupCategory || "technology"}

## Visual Identity
${style}

Use this as the visual north star for all design decisions: component styling, color tokens, typography scale, spacing, and motion.

## Pages to Build

### 1. Landing Page (/)
- Hero section: large impactful headline using the tagline, compelling subheadline from description, primary CTA ("Get Started" or "Start Free Trial")
- Features section: grid or alternating layout showcasing these 6 key features:
${featureList}
- Social proof section: placeholder testimonials and logos (3 testimonials, 5 company logos)
- Pricing section: ${project.pricing.summary}
${pricingTiers}
- Final CTA section: "Ready to get started?" with email capture
- Footer: links, copyright

### 2. Dashboard (/dashboard)
- Authenticated view after signup
- Welcome state with quick-start checklist
- Primary action cards for the top 3 features
- Usage/stats widgets (placeholder data)
- Navigation sidebar

### 3. Auth pages (/login, /signup)
- Clean, minimal auth forms
- Email + password fields
- OAuth placeholders (Google, GitHub)
- Match landing page visual style

## Technical Requirements
- Use Supabase for authentication and database
- Implement dark mode support using CSS variables / Tailwind dark: prefix
- All forms should have real validation with error states
- Mobile-first responsive design (breakpoints: sm, md, lg, xl)
- Smooth page transitions and micro-animations
- TypeScript throughout, strict mode
- Component architecture: shared UI components in /components/ui

## Quality Bar
This is a premium product. Every detail matters:
- Typography must be intentional — clear hierarchy, proper line-height
- Spacing must be consistent — use an 8px base grid
- Colors must have sufficient contrast — WCAG AA minimum
- Animations must be subtle and purposeful — 200–400ms easing
- Loading states for all async operations

Generate the complete implementation. Start with the landing page, then the auth pages, then the dashboard shell.`;
}

// ── Helpers ───────────────────────────────────────────────────────────────

export function resolveHandoffTechStack(project: StartupProject): LovableTechStack {
  const direction = project.selectedDirection ?? project.directions[0];
  // SSR-benefiting directions (SEO-heavy, marketing sites) use modern stack
  const ssrDirections = ["minimal-clean", "luxury-editorial", "apple-modern", "minimal-luxury"];
  return ssrDirections.includes(direction ?? "") ? "modern" : "classic";
}
