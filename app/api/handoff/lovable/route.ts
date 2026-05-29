import { NextRequest, NextResponse } from "next/server";
import { getProjectFromDb } from "@/lib/db/projects";
import {
  buildLovablePrompt,
  resolveHandoffTechStack,
  type LovableHandoffPayload,
} from "@/lib/integrations/lovable";
import type { StartupProject } from "@/lib/types/startup";

export const dynamic = "force-dynamic";

// POST /api/handoff/lovable
// Body: { slug?: string, project?: StartupProject }
// Accepts a slug (DB lookup) or full project object (client-passed — works without Supabase)
export async function POST(req: NextRequest) {
  let body: { slug?: string; project?: StartupProject };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Prefer client-passed project object; fall back to DB lookup by slug
  let project: StartupProject | null = body.project ?? null;
  if (!project && body.slug) {
    project = await getProjectFromDb(body.slug);
  }

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  if (!project.generatedSections) {
    return NextResponse.json(
      { error: "Project must be fully generated before handoff" },
      { status: 422 }
    );
  }

  const payload: LovableHandoffPayload = {
    projectName: project.startupName,
    prompt: buildLovablePrompt(project),
    techStack: resolveHandoffTechStack(project),
  };

  return NextResponse.json({ payload });
}
