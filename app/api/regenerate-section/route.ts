import { NextResponse } from "next/server";
import type { DirectionId, SectionKey } from "@/lib/types/startup";
import { isValidDirection } from "@/lib/orchestration/directions";
import { OrchestrationError } from "@/lib/orchestration/openai-client";
import { runRegenerateSectionPipeline } from "@/lib/orchestration/pipelines/generate-sections";
import { isGeneratedSections, isStartupBrief } from "@/lib/orchestration/validators";

const VALID_SECTIONS: SectionKey[] = [
  "navbar",
  "hero",
  "features",
  "testimonials",
  "pricing",
  "faq",
  "cta",
  "footer",
];

export async function POST(request: Request) {
  let body: {
    brief?: unknown;
    direction?: string;
    section?: string;
    current?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!isStartupBrief(body.brief) || !isGeneratedSections(body.current)) {
    return NextResponse.json({ error: "Valid brief and current sections required." }, { status: 400 });
  }

  const direction = body.direction as DirectionId;
  const section = body.section as SectionKey;

  if (!isValidDirection(direction) || !VALID_SECTIONS.includes(section)) {
    return NextResponse.json({ error: "Invalid direction or section." }, { status: 400 });
  }

  try {
    const sections = await runRegenerateSectionPipeline({
      brief: body.brief,
      direction,
      section,
      current: body.current,
    });
    return NextResponse.json({ sections });
  } catch (err) {
    if (err instanceof OrchestrationError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Could not regenerate section." }, { status: 500 });
  }
}
