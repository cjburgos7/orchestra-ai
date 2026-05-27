/**
 * POST /api/generation-compare — dev-only: generate N fresh worlds across categories and diff them.
 * Proves naming, imagery, layout, and visualDNA diversity (or lack thereof).
 */

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { runGenerateStartupPipeline } from "@/lib/orchestration/pipelines/generate-startup";
import { runGenerateSectionsPipeline } from "@/lib/orchestration/pipelines/generate-sections";
import { DEFAULT_DIRECTION } from "@/lib/cinematic";
import { urlToId } from "@/lib/pipeline-trace";

const DEFAULT_IDEAS = [
  "AI-powered workflow automation for enterprise sales teams — SOC2 compliant",
  "Neobank for Gen Z with gamified savings goals and instant transfers",
  "Luxury streetwear drop platform — limited sneaker releases, urban energy",
  "Meditation retreat booking for burned-out tech workers — sanctuary in nature",
  "Weekly exotic dragon fruit subscription for Miami fitness enthusiasts",
];

type WorldReport = {
  index: number;
  idea: string;
  seed: string;
  name: string;
  tagline: string;
  startupCategory: string;
  conceptKey: string;
  variantLabel: string;
  rotationScore: number;
  category: string;
  accentColor: string;
  visualDNA: {
    emotion: string;
    coreIdea: string;
    heroHeight: string;
    sectionSpacing: string;
    imageDominance: number;
    scrollFeel: string;
    imageFilter: string;
    background: string;
  };
  layout: {
    sectionOrder: string[];
    sectionGap: string;
    showLifestyle: boolean;
    showShowcase: boolean;
    headlineScale: string;
  };
  imagery: {
    heroId: string | null;
    uniquePhotoIds: string[];
    duplicateIds: string[];
    httpPhotoCount: number;
    lifestyleCount: number;
    productCount: number;
    hero: string;
    lifestyle: string[];
    products: string[];
    warnings: string[];
  };
  motion: string;
  worldDnaId: string;
};

function summarizeWorld(
  index: number,
  idea: string,
  seed: string,
  name: string,
  tagline: string,
  startupCategory: string,
  sections: Awaited<ReturnType<typeof runGenerateSectionsPipeline>>
): WorldReport {
  const v = sections.visuals!;
  const cd = v.creativeDirection;
  const vd = cd?.visualDNA;
  const trace = v.imagery?.artDirection?.pipelineTrace;
  const productUrls = v.imagery?.products.map((p) => p.image) ?? [];

  return {
    index,
    idea,
    seed,
    name,
    tagline,
    startupCategory,
    conceptKey: cd?.conceptKey ?? "—",
    variantLabel: cd?.variantLabel ?? "—",
    rotationScore: cd?.rotationScore ?? 0,
    category: cd?.category ?? "—",
    accentColor: v.accentColor,
    visualDNA: {
      emotion: vd?.concept.emotion ?? "—",
      coreIdea: vd?.concept.coreIdea ?? "—",
      heroHeight: vd?.layout.heroHeight ?? "—",
      sectionSpacing: vd?.layout.sectionSpacing ?? "—",
      imageDominance: vd?.layout.imageDominance ?? 0,
      scrollFeel: vd?.pacing.scrollFeel ?? "—",
      imageFilter: vd?.atmosphere.imageFilter ?? "—",
      background: vd?.color.background ?? "—",
    },
    layout: {
      sectionOrder: v.layout.sectionOrder,
      sectionGap: v.layout.sectionGap,
      showLifestyle: v.layout.showLifestyle ?? false,
      showShowcase: v.layout.showShowcase ?? false,
      headlineScale: v.layout.headlineScale,
    },
    imagery: {
      heroId: urlToId(v.imagery?.hero ?? ""),
      uniquePhotoIds: trace?.uniqueImageIds ?? [],
      duplicateIds: trace?.duplicateIds ?? [],
      httpPhotoCount: trace?.httpPhotoCount ?? 0,
      lifestyleCount: v.imagery?.lifestyle.length ?? 0,
      productCount: v.imagery?.products.length ?? 0,
      hero: v.imagery?.hero ?? "",
      lifestyle: v.imagery?.lifestyle ?? [],
      products: productUrls,
      warnings: trace?.warnings ?? [],
    },
    motion: v.motion,
    worldDnaId: v.worldDnaId ?? "—",
  };
}

function diversityAnalysis(worlds: WorldReport[]) {
  const names = worlds.map((w) => w.name);
  const conceptKeys = worlds.map((w) => w.conceptKey);
  const categories = worlds.map((w) => w.category);
  const heroIds = worlds.map((w) => w.imagery.heroId);
  const accents = worlds.map((w) => w.accentColor);
  const sectionOrders = worlds.map((w) => w.layout.sectionOrder.join("|"));
  const allPhotoIds = worlds.flatMap((w) => w.imagery.uniquePhotoIds);
  const uniqueAcrossRuns = new Set(allPhotoIds);

  return {
    namesUnique: new Set(names).size === names.length,
    names,
    conceptKeysUnique: new Set(conceptKeys).size,
    conceptKeys,
    categories,
    categoriesUnique: new Set(categories).size,
    variantLabels: worlds.map((w) => w.variantLabel),
    emotions: worlds.map((w) => w.visualDNA.emotion),
    heroIdsUnique: new Set(heroIds).size,
    heroIds,
    accentsUnique: new Set(accents).size,
    accents,
    sectionOrdersUnique: new Set(sectionOrders).size,
    sectionOrders: worlds.map((w) => w.layout.sectionOrder),
    totalUniquePhotosAcrossRuns: uniqueAcrossRuns.size,
    photoOverlapMatrix: worlds.map((a, i) =>
      worlds.map((b, j) => {
        if (i === j) return 1;
        const setA = new Set(a.imagery.uniquePhotoIds);
        const shared = b.imagery.uniquePhotoIds.filter((id) => setA.has(id)).length;
        return shared;
      })
    ),
    visualDNAIdentical: worlds.every(
      (w) =>
        w.visualDNA.emotion === worlds[0].visualDNA.emotion &&
        w.visualDNA.coreIdea === worlds[0].visualDNA.coreIdea &&
        w.visualDNA.scrollFeel === worlds[0].visualDNA.scrollFeel
    ),
    findings: [
      new Set(categories).size === worlds.length
        ? "✓ each run resolved to a distinct category"
        : `⚠ category overlap — ${new Set(categories).size} unique across ${worlds.length} runs`,
      new Set(conceptKeys).size === worlds.length
        ? "✓ conceptKey unique per run"
        : new Set(conceptKeys).size > 1
          ? `⚠ ${new Set(conceptKeys).size} distinct concept keys across ${worlds.length} runs`
          : "⚠ conceptKey collapsed — check rotation pool",
      new Set(worlds.map((w) => w.visualDNA.emotion)).size > 1
        ? "✓ emotional tone varies"
        : "⚠ same emotion across all runs",
      new Set(names).size === names.length
        ? "✓ startup names are unique"
        : "⚠ duplicate startup names detected",
      new Set(heroIds).size === worlds.length
        ? "✓ hero photo IDs differ per run"
        : "⚠ same hero photo selected across runs",
      uniqueAcrossRuns.size >= worlds.length * 8
        ? "✓ strong cross-run photo diversity"
        : `⚠ limited photo pool rotation (${uniqueAcrossRuns.size} unique IDs across ${worlds.length} runs)`,
    ],
  };
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "generation-compare is dev-only" }, { status: 403 });
  }

  let ideas = DEFAULT_IDEAS;
  try {
    const body = await request.json();
    if (Array.isArray(body.ideas) && body.ideas.length) ideas = body.ideas.map(String);
  } catch {
    // defaults
  }

  const worlds: WorldReport[] = [];

  for (let i = 0; i < ideas.length; i++) {
    const idea = ideas[i];
    const seed = randomUUID();
    const { brief } = await runGenerateStartupPipeline(idea);
    const sections = await runGenerateSectionsPipeline({
      brief,
      direction: DEFAULT_DIRECTION,
      seed,
    });
    worlds.push(
      summarizeWorld(i + 1, idea, seed, brief.name, brief.tagline, brief.startupCategory ?? "—", sections)
    );
  }

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    direction: DEFAULT_DIRECTION,
    worlds,
    diversity: diversityAnalysis(worlds),
  });
}
