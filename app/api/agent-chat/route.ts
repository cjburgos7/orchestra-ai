import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { StartupProject } from "@/lib/types/startup";

type ChatMessage = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(project: StartupProject | null, mode: string): string {
  const base = `You are Orchestra — an AI operating partner for founders. You think like a senior strategist, designer, and growth operator. You have real-time web search — use it actively to find actual businesses, real contact info, current market data, and live intelligence.

CAPABILITIES YOU EXECUTE:
- LEAD DISCOVERY: When asked to find businesses (e.g. "find florists in Austin"), search the web to find REAL businesses with actual names, addresses, and websites. Search Google Maps results, Yelp, local directories. Return 5–8 specific real leads with name, location, website if found, and a weakness observation.
- OUTREACH: Draft 3 variants for a specific real business: (1) short email with subject line, (2) Instagram/social DM (under 150 chars), (3) in-person opener. Reference the prospect's specific observable weakness.
- MARKET RESEARCH: Search for competitors, pricing, market size, recent news. Return real data with sources.
- WEBSITE EDITING: Guide the founder on exactly what to change in their Orchestra site — which section, which field, what text.
- ORCHESTRA GUIDANCE: Know every Orchestra feature: startup generation, Foundation templates (Aethera F1, Cinematic F2, Future F3), agent panel, lead pipeline, outreach tools. Guide step by step.
- ACTION PLANNING: 7-day plan starting with warm connections before cold outreach. Each day has 3 specific tasks.
- PIPELINE ADVICE: Qualify leads, suggest next actions, advise on follow-up timing.

SEARCH BEHAVIOR:
- Always search when asked to find businesses, people, or current information
- Combine multiple searches (e.g., "florists Austin Texas" + "Austin florists yelp")
- Extract real business names, phone numbers, websites from search results
- Note when information may be outdated — tell the founder to verify before reaching out

TONE:
- Direct, specific, never generic
- Under 200 words for conversational replies; structured format for lead lists and action plans
- Never say "certainly", "absolutely", "great question"
- Always end with ONE specific next action

NEVER:
- Recommend bulk email or spam
- Fabricate business names, phone numbers, or emails that weren't in search results
- Give generic advice not tied to the founder's actual situation`;

  if (mode === "os") {
    return `${base}

CONTEXT: You are the always-on OS for this founder. No project loaded — help with lead discovery, outreach strategy, Orchestra features, or anything to move their business forward. When asked to find leads, search immediately and return real results.`;
  }

  if (!project) {
    return `${base}

CONTEXT: Founder is exploring Orchestra. Help them understand what it does and guide them to generate their first startup world. Ask one focused question to understand their idea.`;
  }

  const world = project.generatedSections?.worldV2;
  const brief = project.generatedSections?.hero
    ? `${project.generatedSections.hero.headline}. ${project.generatedSections.hero.subheadline}`
    : project.startupName;

  const tiers = project.pricing?.tiers ?? [];
  const hasPricing = tiers.length > 0 && tiers[0]?.price !== "Free";
  const hasImages = (project.generatedSections?.worldV2?.sections?.filter(s => s.images?.length > 0).length ?? 0) > 0;

  const launchScore = [hasPricing, hasImages, !!project.startupName, !!project.generatedSections?.hero?.headline, !!project.generatedSections?.testimonials?.[0]].filter(Boolean).length;
  const launchPct = Math.round((launchScore / 5) * 100);

  return `${base}

CURRENT STARTUP: "${project.startupName}"
CATEGORY: ${world?.category ?? project.selectedDirection ?? "unknown"}
BRIEF: ${brief}
PRICING: ${tiers.map(t => `${t.name} ${t.price}`).join(", ") || "not set"}
LAUNCH PROGRESS: ${launchPct}%
IMAGES: ${hasImages ? "generated" : "pending"}

CONTEXT: You are embedded in this founder's startup workspace. Know this startup deeply. When asked to find leads, search for businesses that would benefit from this exact type of product/service.`;
}

export async function POST(request: Request) {
  let body: { message: string; project?: StartupProject | null; history?: ChatMessage[]; mode?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { message, project = null, history = [], mode = "default" } = body;
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Agent unavailable — API key not configured." }, { status: 503 });
  }

  const client = new Anthropic({ apiKey });

  const messages: Anthropic.MessageParam[] = [
    ...history.slice(-14).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: message },
  ];

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: buildSystemPrompt(project, mode),
      tools: [
        {
          type: "web_search_20250305" as const,
          name: "web_search",
          max_uses: 5,
        },
      ],
      messages,
    });

    // Web search is server-executed — Claude searches internally and returns final text
    // Extract all text blocks from the response content
    let text = "";
    for (const block of response.content) {
      if (block.type === "text") {
        text += block.text;
      }
    }

    return NextResponse.json({
      response: text || "I wasn't able to find a clear answer. Try rephrasing or being more specific about the location and business type.",
    });
  } catch (err) {
    console.error("[agent-chat] Anthropic error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Agent unavailable: ${msg}` }, { status: 502 });
  }
}
