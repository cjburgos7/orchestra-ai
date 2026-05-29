import type { StartupBrief, StartupProject } from "@/lib/types/startup";
import { createEmptyProject } from "@/lib/types/startup";
import { chatCompletionJSON, OrchestrationError } from "@/lib/orchestration/openai-client";
import { pickWildcards } from "@/lib/orchestration/wildcards";
import { isStartupBrief } from "@/lib/orchestration/validators";

const SYSTEM_PROMPT = `You are Orchestra AI — a world-builder for founders who turn startup ideas into living, breathing business worlds.

Given a startup idea, return ONLY valid JSON creating a complete startup world with this exact shape:
{
  "name": "string (memorable, specific startup name — not generic)",
  "tagline": "string (one bold sentence under 100 chars — makes you want to learn more)",
  "description": "string (2-3 sentences. What it is, who it's for, what makes it different.)",
  "audience": "string (specific human description — not 'users' or 'businesses'. Who exactly, and what's their situation.)",
  "brandTone": "string (personality + register, e.g. 'Warm and precise — like a trusted friend who knows the data')",
  "startupCategory": "string — MUST be one of exactly these values: fitness, floral, finance, fashion, food, saas, wellness, sports, travel, home, education, health, creator, music, science. Pick the single best match for the startup domain.",
  "founderMission": "string (1-2 sentences. WHY this exists. The founder's conviction. Specific, human, not corporate.)",
  "marketPositioning": "string (1 sentence. Positioned against what alternative. Specific differentiation, not vague benefit.)",
  "brandPersonality": "string (2-3 sentences. Character, voice, visual feel. What would this brand be like as a person in a room?)",
  "businessModel": "string (2-3 sentences. How money flows. Revenue model, pricing lever, what drives LTV.)",
  "launchStrategy": "string (2-3 sentences. First customers, go-to-market wedge, which channel and why.)",
  "growthOpportunities": "string (2-3 sentences. Adjacent markets, expansion plays, network effects, platform potential.)",
  "competitiveEdge": "string (1-2 sentences. The specific unfair advantage — what can't be easily copied.)",
  "whyNow": "string (1-2 sentences. The market timing, technology unlock, or behavior shift that makes this the right moment.)",
  "features": ["string", "string", "string", "string"] (exactly 4 specific product capabilities — concrete, not marketing slogans),
  "pricing": {
    "summary": "string (pricing philosophy in one sentence — what's the model and why)",
    "tiers": [
      { "name": "string", "price": "string", "detail": "string" },
      { "name": "string", "price": "string", "detail": "string" },
      { "name": "string", "price": "string", "detail": "string" }
    ]
  }
}

Rules:
- Be SPECIFIC to this exact idea — no generic startup language
- The world fields (mission, positioning, personality, etc.) should feel like a founder wrote them with real conviction
- Features describe what the product actually does, not abstract benefits
- Pricing tiers should have realistic, specific prices
- No markdown, no commentary, pure JSON`;

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
    founderMission: brief.founderMission,
    marketPositioning: brief.marketPositioning,
    brandPersonality: brief.brandPersonality,
    businessModel: brief.businessModel,
    launchStrategy: brief.launchStrategy,
    growthOpportunities: brief.growthOpportunities,
    competitiveEdge: brief.competitiveEdge,
    whyNow: brief.whyNow,
    status: "ready",
  };
}
