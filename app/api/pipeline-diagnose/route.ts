/**
 * POST /api/pipeline-diagnose
 * Runs the live art-directed imagery pipeline and returns full trace diagnostics.
 * Dev-only — use to verify image selection without theorizing.
 */

import { NextResponse } from "next/server";
import { buildArtDirectedImagery } from "@/lib/imagery/art-directed-pipeline";
import { resolveCategory } from "@/lib/orchestration/category-resolution";
import { DEFAULT_DIRECTION } from "@/lib/cinematic";
import type { StartupBrief } from "@/lib/types/startup";
import { urlToId } from "@/lib/pipeline-trace";

const DEFAULT_FRUIT_BRIEF: StartupBrief = {
  name: "Orchard & Grove",
  tagline: "Farm-fresh fruit delivered weekly",
  description: "A subscription fruit box startup sourcing from local orchards and farmers markets.",
  audience: "health-conscious families",
  startupCategory: "fruit subscription",
  features: ["Seasonal crates", "Farm-to-door delivery", "Organic produce", "Juice add-ons"],
  pricing: {
    summary: "Weekly fruit boxes from $29",
    tiers: [
      { name: "Starter", price: "$29", detail: "8–10 lbs seasonal fruit" },
      { name: "Family", price: "$49", detail: "15–18 lbs + juice add-on" },
    ],
  },
};

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "pipeline-diagnose is dev-only" }, { status: 403 });
  }

  let brief = DEFAULT_FRUIT_BRIEF;
  let seed = "diagnose:fruit:premium-dark";
  let direction = DEFAULT_DIRECTION;

  try {
    const body = await request.json();
    if (body.brief) brief = body.brief as StartupBrief;
    if (body.seed) seed = String(body.seed);
    if (body.direction) direction = body.direction;
  } catch {
    // use defaults
  }

  const resolution = resolveCategory(brief);
  const { imagery, meta } = buildArtDirectedImagery(
    brief,
    seed,
    direction,
    "#c2410c",
    resolution
  );

  const trace = meta.pipelineTrace;
  const allUrls = [
    imagery.hero,
    ...imagery.heroChain,
    ...imagery.lifestyle,
    ...imagery.products.map((p) => p.image),
  ].filter((u) => u.startsWith("http"));

  const urlReport = allUrls.map((url) => ({
    id: urlToId(url),
    url,
  }));

  const idCounts = new Map<string, number>();
  for (const { id } of urlReport) {
    if (id) idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
  }

  return NextResponse.json({
    brief: { name: brief.name, category: resolution.primary, secondary: resolution.secondary },
    registryId: meta.registryId,
    direction,
    seed,
    resolution,
    trace,
    summary: {
      uniquePhotoIds: trace?.uniqueImageIds ?? [],
      duplicateIds: trace?.duplicateIds ?? [],
      httpPhotoCount: trace?.httpPhotoCount ?? 0,
      warnings: trace?.warnings ?? [],
      slotCount: trace?.slots.length ?? 0,
      lifestyleCount: imagery.lifestyle.length,
      productCount: imagery.products.length,
      repeatedInOutput: [...idCounts.entries()]
        .filter(([, n]) => n > 1)
        .map(([id, count]) => ({ id, count })),
    },
    finalUrls: {
      hero: imagery.hero,
      heroChain: imagery.heroChain,
      lifestyle: imagery.lifestyle,
      products: imagery.products.map((p) => ({
        name: p.name,
        image: p.image,
        fallback: p.imageFallback,
      })),
    },
    urlReport,
  });
}
