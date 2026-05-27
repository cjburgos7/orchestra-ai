/**
 * Run: npx tsx --tsconfig tsconfig.json scripts/run-generation-compare.ts
 * Generates fresh startups across multiple categories and prints diversity report (no dev server required).
 */
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import { resolve } from "path";

try {
  const envPath = resolve(process.cwd(), ".env.local");
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim();
  }
} catch {
  // .env.local optional
}

import { runGenerateStartupPipeline } from "../lib/orchestration/pipelines/generate-startup";
import { runGenerateSectionsPipeline } from "../lib/orchestration/pipelines/generate-sections";
import { DEFAULT_DIRECTION } from "../lib/cinematic";
import { urlToId } from "../lib/pipeline-trace";

const IDEAS = [
  "AI-powered workflow automation for enterprise sales teams — SOC2 compliant",
  "Neobank for Gen Z with gamified savings goals and instant transfers",
  "Luxury streetwear drop platform — limited sneaker releases, urban energy",
  "Meditation retreat booking for burned-out tech workers — sanctuary in nature",
  "Weekly exotic dragon fruit subscription for Miami fitness enthusiasts",
];

async function httpOk(url: string): Promise<string> {
  const base = url.split("?")[0] + "?w=400";
  try {
    const res = await fetch(base, { method: "GET", signal: AbortSignal.timeout(8000) });
    return String(res.status);
  } catch {
    return "ERR";
  }
}

async function main() {
  const worlds = [];

  for (let i = 0; i < IDEAS.length; i++) {
    const idea = IDEAS[i];
    const seed = randomUUID();
    console.log(`\n[${i + 1}/${IDEAS.length}] Generating: ${idea.slice(0, 55)}…`);
    const { brief } = await runGenerateStartupPipeline(idea);
    const sections = await runGenerateSectionsPipeline({
      brief,
      direction: DEFAULT_DIRECTION,
      seed,
    });
    const v = sections.visuals!;
    const trace = v.imagery?.artDirection?.pipelineTrace;
    const heroStatus = v.imagery?.hero ? await httpOk(v.imagery.hero) : "—";
    worlds.push({ brief, seed, sections, v, trace, heroStatus });
  }

  console.log("\n══════════════════════════════════════════");
  console.log("  CROSS-CATEGORY GENERATION COMPARISON");
  console.log("══════════════════════════════════════════\n");

  for (const [i, w] of worlds.entries()) {
    const cd = w.v.creativeDirection;
    const vd = cd?.visualDNA;
    console.log(`${i + 1}. ${w.brief.name}`);
    console.log(`   category: ${cd?.category}`);
    console.log(`   idea seed: ${w.seed.slice(0, 8)}…`);
    console.log(`   tagline: ${w.brief.tagline}`);
    console.log(`   conceptKey: ${cd?.conceptKey}`);
    console.log(`   variant: ${cd?.variantLabel} (score ${cd?.rotationScore})`);
    console.log(`   accent: ${w.v.accentColor}`);
    console.log(`   visualDNA emotion: ${vd?.concept.emotion}`);
    console.log(`   visualDNA spacing: ${vd?.layout.sectionSpacing} | scroll: ${vd?.pacing.scrollFeel}`);
    console.log(`   hero id: ${urlToId(w.v.imagery?.hero ?? "")} (HTTP ${w.heroStatus})`);
    console.log(`   unique photos: ${w.trace?.uniqueImageIds.length ?? 0}`);
    console.log(`   sectionOrder: ${w.v.layout.sectionOrder.join(" → ")}`);
    console.log(`   worldDnaId: ${w.v.worldDnaId}`);
    console.log();
  }

  const names = worlds.map((w) => w.brief.name);
  const categories = worlds.map((w) => w.v.creativeDirection?.category);
  const conceptKeys = worlds.map((w) => w.v.creativeDirection?.conceptKey);
  const emotions = worlds.map((w) => w.v.creativeDirection?.visualDNA?.concept.emotion);
  const heroIds = worlds.map((w) => urlToId(w.v.imagery?.hero ?? ""));
  const allIds = new Set(worlds.flatMap((w) => w.trace?.uniqueImageIds ?? []));

  console.log("── DIVERSITY VERDICT ──");
  console.log(`Categories unique: ${new Set(categories).size}/${IDEAS.length} → ${[...new Set(categories)].join(", ")}`);
  console.log(`Names unique: ${new Set(names).size === IDEAS.length} → ${names.join(" | ")}`);
  console.log(`Concept keys: ${[...new Set(conceptKeys)].join(", ")}`);
  console.log(`Variant labels: ${worlds.map((w) => w.v.creativeDirection?.variantLabel).join(" | ")}`);
  console.log(`Emotions: ${emotions.join(" | ")}`);
  console.log(`Emotions unique: ${new Set(emotions).size}/${IDEAS.length}`);
  console.log(`Hero IDs unique: ${new Set(heroIds).size}/${IDEAS.length} → ${heroIds.join(", ")}`);
  console.log(`Total unique photos (pool): ${allIds.size} across ${IDEAS.length} runs`);
  console.log(
    `VisualDNA coreIdea identical: ${worlds.every((w) => w.v.creativeDirection?.visualDNA?.concept.coreIdea === worlds[0].v.creativeDirection?.visualDNA?.concept.coreIdea)}`
  );
  console.log(
    `Section orders identical: ${worlds.every((w) => w.v.layout.sectionOrder.join() === worlds[0].v.layout.sectionOrder.join())}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
