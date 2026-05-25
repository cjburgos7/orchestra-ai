import type {
  DirectionId,
  GeneratedSections,
  SectionKey,
  StartupBrief,
} from "@/lib/types/startup";
import { getDirectionLabel } from "@/lib/orchestration/directions";
import { chatCompletionJSON, OrchestrationError } from "@/lib/orchestration/openai-client";
import { isGeneratedSections } from "@/lib/orchestration/validators";
import { fallbackSections } from "@/lib/orchestration/pipelines/section-fallback";
import { generateVisuals } from "@/lib/orchestration/pipelines/generate-pages";

type Input = {
  brief: StartupBrief;
  direction: DirectionId;
};

/** Generates website sections in modular steps for cleaner orchestration */
export async function runGenerateSectionsPipeline(input: Input): Promise<GeneratedSections> {
  const directionLabel = getDirectionLabel(input.direction);

  try {
    const [blockA, blockB, blockC] = await Promise.all([
      chatCompletionJSON<Pick<GeneratedSections, "navbar" | "hero">>({
        temperature: 0.75,
        messages: [
          {
            role: "system",
            content: `Return JSON: { "navbar": { "brandLabel": "string", "ctaLabel": "string" }, "hero": { "eyebrow": "string", "headline": "string", "subheadline": "string", "ctaPrimary": "string", "ctaSecondary": "string" } }`,
          },
          {
            role: "user",
            content: buildPrompt(input.brief, directionLabel, "navbar and hero"),
          },
        ],
      }),
      chatCompletionJSON<Pick<GeneratedSections, "features" | "testimonials">>({
        temperature: 0.75,
        messages: [
          {
            role: "system",
            content: `Return JSON: { "features": { "sectionTitle": "string", "items": [{ "title": "string", "description": "string" }] x4 }, "testimonials": [{ "quote", "name", "role" }] x3 }`,
          },
          {
            role: "user",
            content: buildPrompt(input.brief, directionLabel, "features and testimonials"),
          },
        ],
      }),
      chatCompletionJSON<
        Pick<GeneratedSections, "pricing" | "faq" | "cta" | "footer">
      >({
        temperature: 0.75,
        messages: [
          {
            role: "system",
            content: `Return JSON: { "pricing": { "sectionTitle": "string", "subtitle": "string" }, "faq": [{ "question", "answer" }] x3, "cta": { "headline", "subheadline", "buttonText" }, "footer": { "tagline": "string" } }`,
          },
          {
            role: "user",
            content: buildPrompt(input.brief, directionLabel, "pricing, FAQ, CTA, and footer"),
          },
        ],
      }),
    ]);

    const merged: GeneratedSections = {
      navbar: blockA.navbar,
      hero: blockA.hero,
      features: blockB.features,
      testimonials: blockB.testimonials,
      pricing: blockC.pricing,
      faq: blockC.faq,
      cta: blockC.cta,
      footer: blockC.footer,
    };

    if (isGeneratedSections(merged)) {
      return {
        ...merged,
        visuals: generateVisuals(input.brief, input.direction, input.direction),
      };
    }
  } catch (err) {
    if (err instanceof OrchestrationError && err.status !== 502) throw err;
    console.warn("Modular generation fallback:", err);
  }

  return {
    ...fallbackSections(input.brief, directionLabel),
    visuals: generateVisuals(input.brief, input.direction, input.direction),
  };
}

export async function runRegenerateSectionPipeline(
  input: Input & { section: SectionKey; current: GeneratedSections }
): Promise<GeneratedSections> {
  const directionLabel = getDirectionLabel(input.direction);

  try {
    const block = await chatCompletionJSON<Partial<GeneratedSections>>({
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: `Regenerate ONLY the "${input.section}" portion of a startup landing page. Return JSON with just that key and its value.`,
        },
        {
          role: "user",
          content: `${buildPrompt(input.brief, directionLabel, input.section)}\nCurrent page context: ${JSON.stringify(input.current[input.section])}`,
        },
      ],
    });

    if (block[input.section]) {
      return {
        ...input.current,
        [input.section]: block[input.section]!,
        visuals: input.current.visuals,
      };
    }
  } catch (err) {
    console.warn("Section regenerate fallback:", err);
  }

  const fresh = fallbackSections(input.brief, directionLabel);
  return { ...input.current, [input.section]: fresh[input.section] };
}

function buildPrompt(brief: StartupBrief, directionLabel: string, focus: string) {
  return `Startup: ${brief.name}
Tagline: ${brief.tagline}
Description: ${brief.description}
Features: ${brief.features.join("; ")}
Direction: ${directionLabel}
Focus: ${focus}
Write believable, premium copy. No markdown.`;
}
