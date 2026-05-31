import { NextResponse } from "next/server";
import { generateOutreachPlan } from "@/lib/outreach";

export async function POST(request: Request) {
  let body: { niche?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const niche = typeof body.niche === "string" ? body.niche.trim() : "";
  if (!niche) {
    return NextResponse.json({ error: "Niche is required" }, { status: 400 });
  }

  try {
    const plan = await generateOutreachPlan(niche);
    return NextResponse.json({ plan });
  } catch (err) {
    console.error("[outreach/generate]", err);
    return NextResponse.json(
      { error: "Generation failed. Check ANTHROPIC_API_KEY and try again." },
      { status: 500 }
    );
  }
}
