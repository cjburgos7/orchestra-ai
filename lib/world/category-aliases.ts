import type { CategoryCluster } from "@/lib/world/category-vocab";

export type CategoryAliasMatch = {
  /** The alias phrase that matched, if any */
  categoryRaw: string;
  /** Resolved canonical cluster */
  categoryCluster: CategoryCluster;
};

type AliasRule = {
  /** Substrings or patterns matched against normalized prompt text */
  phrases: string[];
  cluster: CategoryCluster;
  /** Label stored as categoryRaw when this rule wins */
  rawLabel: string;
};

/**
 * Longer / more specific phrases first so "fruit subscription" beats bare "fruit".
 */
const ALIAS_RULES: AliasRule[] = [
  {
    phrases: [
      "fruit subscription",
      "produce delivery",
      "fruit box",
      "fruit company",
      "fruit startup",
      "organic fruit",
      "farm box",
      "farmers market",
      "juice delivery",
      "smoothie delivery",
      "produce box",
      "fruit delivery",
    ],
    cluster: "fresh produce",
    rawLabel: "fresh produce",
  },
  {
    phrases: [
      "basketball coaching",
      "basketball training",
      "basketball app",
      "basketball startup",
      "hoops app",
      "basketball team",
      "youth basketball",
      "basketball skills",
      "court finder",
      "basketball analytics",
    ],
    cluster: "basketball",
    rawLabel: "basketball",
  },
  {
    phrases: [
      "dog grooming",
      "dog startup",
      "pet company",
      "pet startup",
      "dog walking",
      "puppy training",
      "pet subscription",
      "dog treats",
      "pet grooming",
      "dog food",
    ],
    cluster: "pets",
    rawLabel: "pets",
  },
  // Single-token fallbacks (after multi-word rules)
  {
    phrases: [
      "fruit",
      "fruits",
      "produce",
      "orchard",
      "citrus",
      "berries",
      "smoothie",
      "juice",
      "harvest",
      "farmbox",
    ],
    cluster: "fresh produce",
    rawLabel: "fresh produce",
  },
  {
    phrases: [
      "basketball",
      "hoops",
      "nba",
      "wnba",
      "dunk",
      "court",
      "backboard",
    ],
    cluster: "basketball",
    rawLabel: "basketball",
  },
  {
    phrases: [
      "dog",
      "dogs",
      "puppy",
      "puppies",
      "pet",
      "pets",
      "canine",
      "grooming",
      "collar",
      "leash",
    ],
    cluster: "pets",
    rawLabel: "pets",
  },
];

const DEFAULT_CLUSTER: CategoryCluster = "fresh produce";

function normalizePrompt(prompt: string): string {
  return prompt.toLowerCase().replace(/[^\w\s-]/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Resolve a startup prompt to a canonical category cluster via alias table.
 * No AI — deterministic substring matching only.
 */
export function resolveCategoryAlias(prompt: string): CategoryAliasMatch {
  const normalized = normalizePrompt(prompt);

  for (const rule of ALIAS_RULES) {
    for (const phrase of rule.phrases) {
      if (normalized.includes(phrase)) {
        return {
          categoryRaw: phrase,
          categoryCluster: rule.cluster,
        };
      }
    }
  }

  return {
    categoryRaw: normalized.slice(0, 80) || "unknown",
    categoryCluster: DEFAULT_CLUSTER,
  };
}
