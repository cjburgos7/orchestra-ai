import { NextResponse } from "next/server";
import type { StartupProject } from "@/lib/types/startup";
import { getOpenAIKey } from "@/lib/orchestration/openai-client";

type ChatMessage = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(project: StartupProject | null): string {
  if (!project) {
    return `You are Orchestra, an AI operating partner for founders building startups.
Your job is to help founders articulate their startup idea and generate a world around it.
Ask one focused question to understand their vision. Keep responses under 100 words.
Never use bullet points. Never say "certainly", "absolutely", or generic filler.`;
  }

  const world = project.generatedSections?.worldV2;
  const brief = project.generatedSections?.hero
    ? `${project.generatedSections.hero.headline}. ${project.generatedSections.hero.subheadline}`
    : project.startupName;

  const tiers = project.pricing?.tiers ?? [];
  const hasPricing = tiers.length > 0 && tiers[0]?.price !== "Free";
  const hasImages = (project.generatedSections?.worldV2?.sections?.filter(s => s.images?.length > 0).length ?? 0) > 0;

  const launchScore = [
    hasPricing,
    hasImages,
    !!project.startupName,
    !!project.generatedSections?.hero?.headline,
    !!project.generatedSections?.testimonials?.[0],
  ].filter(Boolean).length;
  const launchPct = Math.round((launchScore / 5) * 100);

  return `You are Orchestra, an AI operating partner embedded in a startup generation platform.

CURRENT STARTUP: "${project.startupName}"
CATEGORY: ${world?.category ?? project.selectedDirection ?? "unknown"}
WORLD: ${world?.categoryLabel ?? "undefined"} · ${world?.variantLabel ?? "undefined"}
BRIEF: ${brief}
PRICING: ${tiers.map(t => `${t.name} ${t.price}`).join(", ") || "not set"}
LAUNCH PROGRESS: ${launchPct}% ready
IMAGES: ${hasImages ? "generated" : "not yet generated"}

YOUR ROLE:
You are a thoughtful, experienced operating partner — part senior designer, part strategist, part founder. You know this specific startup deeply.

YOUR JOB:
- Help the founder understand and deepen their generated startup world
- Think about what the BEST version of this specific startup would look like in the real world
- Ask strategic questions that reveal brand identity, not just product features
- Suggest specific improvements grounded in this startup's category and story
- Guide toward launch with concrete, specific next steps
- Occasionally challenge assumptions when the direction seems weak

YOUR TONE:
- Concise and direct (under 120 words per response)
- Thoughtful and specific — always reference the actual startup name and category
- Editorial, confident, not corporate
- End every message with ONE specific question or ONE concrete action

NEVER:
- Use bullet points in conversational replies
- Say "certainly", "absolutely", "sure", "great question", or any filler
- Give generic advice that applies to any startup
- Pretend the startup is further along than it is

CONTEXT:
The founder can see their generated startup world. You are their operating partner, not a generic AI assistant. Treat them like a serious founder building something real.`;
}

export async function POST(request: Request) {
  let body: { message: string; project: StartupProject | null; history: ChatMessage[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { message, project, history = [] } = body;
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const apiKey = getOpenAIKey();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.88,
      max_tokens: 300,
      messages: [
        { role: "system", content: buildSystemPrompt(project) },
        ...history.slice(-12), // keep last 12 turns
        { role: "user", content: message },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[agent-chat] OpenAI error:", res.status, errText);
    return NextResponse.json({ error: "Agent unavailable. Check your API key." }, { status: 502 });
  }

  const data = await res.json();
  const response = data.choices?.[0]?.message?.content ?? "";

  return NextResponse.json({ response });
}
