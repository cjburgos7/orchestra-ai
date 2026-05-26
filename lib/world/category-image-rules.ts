import type { CategoryCluster } from "@/lib/world/category-vocab";
import { getCategoryVocabulary } from "@/lib/world/category-vocab";
import type { WorldDNA } from "@/lib/world/world-dna";

export type CategoryImageRules = {
  approved: string[];
  banned: string[];
};

/** Keyword validation rules per cluster — literal terms only */
export const CATEGORY_IMAGE_RULES: Record<CategoryCluster, CategoryImageRules> = {
  "fresh produce": {
    approved: [
      "fruit",
      "produce",
      "orange",
      "apple",
      "banana",
      "berry",
      "citrus",
      "juice",
      "smoothie",
      "orchard",
      "market",
      "farm",
      "harvest",
      "basket",
      "crate",
      "grocery",
    ],
    banned: [
      "gaming",
      "esports",
      "keyboard",
      "rgb",
      "streaming",
      "rock",
      "architecture",
      "skyscraper",
      "gym",
      "weight",
      "basketball",
      "dog",
      "abstract",
      "geometric",
      "gradient blob",
    ],
  },
  basketball: {
    approved: [
      "basketball",
      "court",
      "hoop",
      "arena",
      "sneaker",
      "jersey",
      "player",
      "coach",
      "dribble",
      "dunk",
      "gymnasium",
      "bleacher",
      "training",
      "sports",
      "athlete",
    ],
    banned: [
      "gaming",
      "esports",
      "keyboard",
      "rgb",
      "streaming",
      "monitor",
      "desk setup",
      "fruit",
      "produce",
      "dog",
      "pet",
      "abstract",
      "geometric",
    ],
  },
  pets: {
    approved: [
      "dog",
      "puppy",
      "pet",
      "collar",
      "leash",
      "grooming",
      "toy",
      "treat",
      "park",
      "kennel",
      "canine",
      "labrador",
      "retriever",
    ],
    banned: [
      "gaming",
      "esports",
      "keyboard",
      "rgb",
      "gym",
      "weight",
      "fruit",
      "produce",
      "basketball",
      "abstract",
      "geometric",
      "architecture",
    ],
  },
};

export type ImageCategoryValidation = {
  valid: boolean;
  reasons: string[];
};

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, " ");
}

/**
 * Validate image query/metadata against cluster vocabulary rules.
 * Rejects banned terms; requires at least one approved signal.
 */
export function validateImageCategory(
  worldDNA: WorldDNA,
  queryOrMetadata: string
): ImageCategoryValidation {
  const cluster = worldDNA.categoryCluster as CategoryCluster;
  const rules = CATEGORY_IMAGE_RULES[cluster];
  const vocab = getCategoryVocabulary(cluster);
  const text = normalizeText(queryOrMetadata);
  const reasons: string[] = [];

  for (const banned of rules.banned) {
    if (text.includes(banned.toLowerCase())) {
      reasons.push(`banned term: ${banned}`);
    }
  }

  const approvedSignals = [
    ...rules.approved,
    ...vocab.imageryPrimary,
    ...vocab.imagerySecondary,
    ...vocab.imageryAmbient,
    ...worldDNA.imageryPrimary,
    ...worldDNA.imagerySecondary,
    ...worldDNA.imageryAmbient,
  ];

  const hasApproved = approvedSignals.some((term) => {
    const t = term.toLowerCase();
    return t.length > 2 && text.includes(t);
  });

  if (!hasApproved) {
    reasons.push("missing approved category vocabulary signal");
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}
