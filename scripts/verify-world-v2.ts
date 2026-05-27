/**
 * Quick V2 category lock + semantic retrieval verification.
 * Run: npx tsx --tsconfig tsconfig.json scripts/verify-world-v2.ts
 */
import { buildWorldV2, resolveCategoryV2 } from "../lib/world-v2";

const gymBrief = {
  name: "IronPulse",
  tagline: "Train smarter",
  description: "AI-powered gym and fitness coaching for serious athletes.",
  features: ["Workout plans", "Form tracking", "Progress analytics"],
  pricing: { summary: "", tiers: [{ name: "Pro", price: "$29", detail: "Monthly" }] },
  audience: "gym members and personal trainers",
  startupCategory: "Fitness",
};

const floralBrief = {
  name: "FloraFi",
  tagline: "Blooms delivered",
  description: "Luxury floral arrangements and subscription bouquets.",
  features: ["Weekly bouquets", "Event florals", "Same-day delivery"],
  pricing: { summary: "", tiers: [{ name: "Bloom", price: "$48", detail: "Weekly" }] },
  audience: "flower lovers",
  startupCategory: "Floral",
};

const gym = buildWorldV2(gymBrief, "test-gym-seed");
const floral = buildWorldV2(floralBrief, "test-floral-seed");

console.log("Gym category:", gym.category, resolveCategoryV2(gymBrief).label);
console.log("Gym hero ID:", gym.heroImage.id);
console.log("Gym image IDs:", gym.allImageIds.join(", "));
console.log("Floral category:", floral.category);
console.log("Floral hero ID:", floral.heroImage.id);

console.log("\n── SEMANTIC RETRIEVAL (gym) ──");
console.log("Universe:", gym.imageRetrieval.universe);
console.log("Scene queries:", gym.imageRetrieval.sceneQueries.slice(0, 3).join(" | "));
console.log(
  "Top picks:",
  gym.imageRetrieval.picks
    .slice(0, 4)
    .map((p) => `${p.id.slice(0, 12)}… score=${p.score} scene=${p.sceneQuery}`)
    .join("\n  ")
);
console.log("Rejected candidates:", gym.imageRetrieval.rejectedCount);

console.log("\n── SEMANTIC RETRIEVAL (floral) ──");
console.log("Universe:", floral.imageRetrieval.universe);
console.log(
  "Top picks:",
  floral.imageRetrieval.picks
    .slice(0, 3)
    .map((p) => `${p.id.slice(0, 12)}… score=${p.score}`)
    .join(", ")
);

const fruitIds = new Set([
  "1732959409019-b5979266d02d",
  "1498579397066-22750a3cb424",
  "1464965911861-746a04b4bca6",
]);

const gymHasFruit = gym.allImageIds.some((id) => fruitIds.has(id));
const gymUsesSceneQueries = gym.imageRetrieval.sceneQueries.some((q) =>
  /cinematic|editorial|campaign|aesthetic/i.test(q)
);
const gymHasScoredPicks = gym.imageRetrieval.picks.every((p) => p.score >= 50);

console.log("\n── VERDICT ──");
console.log("Gym resolved to fitness:", gym.category === "fitness" ? "✓" : "✗ FAIL");
console.log("Gym has NO fruit images:", !gymHasFruit ? "✓" : "✗ FAIL");
console.log("Floral resolved to floral:", floral.category === "floral" ? "✓" : "✗ FAIL");
console.log("Scene-level queries (not nouns):", gymUsesSceneQueries ? "✓" : "✗ FAIL");
console.log("Aesthetic scoring active:", gymHasScoredPicks ? "✓" : "✗ FAIL");
console.log("Gym variant:", gym.variantLabel);
console.log("Floral variant:", floral.variantLabel);

if (
  gym.category !== "fitness" ||
  gymHasFruit ||
  floral.category !== "floral" ||
  !gymUsesSceneQueries ||
  !gymHasScoredPicks
) {
  process.exit(1);
}
