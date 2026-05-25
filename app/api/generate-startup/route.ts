import { NextResponse } from "next/server";
import { OrchestrationError } from "@/lib/orchestration/openai-client";
import { runGenerateStartupPipeline } from "@/lib/orchestration/pipelines/generate-startup";
import { validateIdea } from "@/lib/orchestration/validators";

export async function POST(request: Request) {
  let body: { idea?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
  }

  try {
    const idea = validateIdea(body.idea);
    const { project, brief } = await runGenerateStartupPipeline(idea);
    return NextResponse.json({ project, brief });
  } catch (err) {
    if (err instanceof OrchestrationError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    if (err instanceof Error && err.message.startsWith("Please")) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("generate-startup route error:", err);
    return NextResponse.json(
      { error: "Something went wrong while generating your startup." },
      { status: 500 }
    );
  }
}
