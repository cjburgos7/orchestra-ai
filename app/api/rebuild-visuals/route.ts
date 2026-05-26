import { NextResponse } from "next/server";
import type { DirectionId } from "@/lib/types/startup";
import { isValidDirection } from "@/lib/orchestration/directions";
import { buildProductVisuals } from "@/lib/orchestration/product-visuals";
import { isStartupBrief } from "@/lib/orchestration/validators";

export async function POST(request: Request) {
  let body: { brief?: unknown; seed?: string; direction?: string };
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
    const visuals = await buildProductVisuals(
      body.brief,
      typeof body.seed === "string" ? body.seed : body.brief.name,
      direction
    );
    return NextResponse.json({ visuals, imagery: visuals.imagery });
  } catch (err) {
    console.error("rebuild-visuals route error:", err);
    return NextResponse.json({ error: "Failed to rebuild visuals." }, { status: 500 });
  }
}
