import { NextResponse } from "next/server";
import { OrchestrationError } from "@/lib/orchestration/openai-client";
import { runGenerateStartupPipeline } from "@/lib/orchestration/pipelines/generate-startup";
import { validateIdea } from "@/lib/orchestration/validators";
import { createSlug } from "@/lib/utils/slug";
import { saveProjectToDb } from "@/lib/db/projects";

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

    // Assign a stable slug server-side (base name + first 6 chars of UUID)
    const slug = `${createSlug(project.startupName)}-${project.id.slice(0, 6)}`;
    const projectWithSlug = { ...project, slug };

    // Persist to Supabase — non-blocking, never fails the request
    saveProjectToDb(projectWithSlug).catch((err) =>
      console.error("[orchestra] db save failed:", err)
    );

    return NextResponse.json({ project: projectWithSlug, brief });
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
