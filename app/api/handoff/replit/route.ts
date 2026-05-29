import { NextRequest, NextResponse } from "next/server";
import { getProjectFromDb } from "@/lib/db/projects";
import { buildReplitHandoff } from "@/lib/integrations/replit";
import type { StartupProject } from "@/lib/types/startup";

export async function POST(req: NextRequest) {
  let body: { slug?: string; project?: StartupProject };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Accept either a slug (DB lookup) or a full project object (client-passed, works without Supabase)
  let project: StartupProject | null = body.project ?? null;
  if (!project && body.slug) {
    project = await getProjectFromDb(body.slug);
  }

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  if (!project.generatedSections) {
    return NextResponse.json({ error: "Project world not generated yet" }, { status: 422 });
  }

  const payload = buildReplitHandoff(project);
  return NextResponse.json({ payload });
}
