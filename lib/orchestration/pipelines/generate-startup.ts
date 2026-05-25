import type { StartupBrief, StartupProject } from "@/lib/types/startup";
import { createEmptyProject } from "@/lib/types/startup";
import { chatCompletionJSON, OrchestrationError } from "@/lib/orchestration/openai-client";
import { pickWildcards } from "@/lib/orchestration/wildcards";
import { isStartupBrief } from "@/lib/orchestration/validators";

const SYSTEM_PROMPT = `You are Orchestra AI, a friendly startup strategist for non-technical founders.
Given a short startup idea, return ONLY valid JSON with this exact shape:
{
  "name": "string (catchy startup name)",
  "tagline": "string (one sentence, under 120 chars)",
  "description": "string (2-3 sentences, clear and approachable)",
  "audience": "string (who this startup serves, one sentence)",
  "brandTone": "string (e.g. calm and premium, bold and energetic)",
  "startupCategory": "string (e.g. EdTech, B2B SaaS, Consumer AI)",
  "features": ["string", "string", "string", "string"] (exactly 4 product features),
  "pricing": {
    "summary": "string (one sentence pricing strategy)",
    "tiers": [
      { "name": "string", "price": "string", "detail": "string" },
      { "name": "string", "price": "string", "detail": "string" },
      { "name": "string", "price": "string", "detail": "string" }
    ]
  }
}
Be specific to the idea. Keep language simple, premium, and encouraging. No markdown.`;

type GenerateStartupResult = {
  project: StartupProject;
  brief: StartupBrief;
};

export async function runGenerateStartupPipeline(idea: string): Promise<GenerateStartupResult> {
  const parsed = await chatCompletionJSON<Record<string, unknown>>({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Startup idea: ${idea}` },
    ],
  });

  if (!isStartupBrief(parsed)) {
    throw new OrchestrationError("AI returned an unexpected format.", 502);
  }

  const project = briefToProject(parsed, idea);
  project.wildcardDirections = pickWildcards(project.id);
  project.status = "ready";

  return { project, brief: parsed };
}

function briefToProject(brief: StartupBrief, idea: string): StartupProject {
  const base = createEmptyProject(idea);
  return {
    ...base,
    startupName: brief.name,
    tagline: brief.tagline,
    description: brief.description,
    audience: brief.audience ?? "Early adopters and growing teams",
    brandTone: brief.brandTone ?? "Calm, premium, and approachable",
    startupCategory: brief.startupCategory ?? "AI SaaS",
    features: brief.features,
    pricing: brief.pricing,
    status: "ready",
  };
}
