import { NextRequest, NextResponse } from "next/server";
import { saveProjectToDb } from "@/lib/db/projects";
import type { StartupProject } from "@/lib/types/startup";

export async function POST(req: NextRequest) {
  let body: { project?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const project = body.project as StartupProject;
  if (!project?.slug || !project?.id) {
    return NextResponse.json({ error: "project.slug and project.id are required" }, { status: 400 });
  }

  try {
    await saveProjectToDb(project);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[save-project]", err);
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}
