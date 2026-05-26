import { NextResponse } from "next/server";
import type { DirectionId } from "@/lib/types/startup";
import { isValidDirection } from "@/lib/orchestration/directions";
import { OrchestrationError } from "@/lib/orchestration/openai-client";
import { runGenerateSectionsPipeline } from "@/lib/orchestration/pipelines/generate-sections";
import { isStartupBrief } from "@/lib/orchestration/validators";

export async function POST(request: Request) {
  let body: { brief?: unknown; direction?: string; seed?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
  }

  if (!isStartupBrief(body.brief)) {
    return NextResponse.json({ error: "Valid startup brief is required." }, { status: 400 });
  }

  const direction = body.direction as DirectionId;
  if (!direction || !isValidDirection(direction)) {
    return NextResponse.json({ error: "Valid visual direction is required." }, { status: 400 });
  }

  try {
    const sections = await runGenerateSectionsPipeline({
      brief: body.brief,
      direction,
      seed: typeof body.seed === "string" ? body.seed : undefined,
    });
    return NextResponse.json({ sections });
  } catch (err) {
    if (err instanceof OrchestrationError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("generate-sections route error:", err);
    return NextResponse.json(
      { error: "Something went wrong while expanding your landing page." },
      { status: 500 }
    );
  }
}
