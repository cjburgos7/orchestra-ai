import type { CategorizedImage } from "./image-types";

type SemanticRule = {
  allowedTags: RegExp[];
  rejectedTags: RegExp[];
  rejectedSubjects: RegExp[];
  /** If set, human subjects require matching context tags */
  peopleContext?: RegExp[];
};

const PEOPLE_SIGNALS = [
  /\bman\b/i,
  /\bwoman\b/i,
  /\bmen\b/i,
  /\bwomen\b/i,
  /\bperson\b/i,
  /\bpeople\b/i,
  /\bportrait\b/i,
  /headshot/i,
  /\bface\b/i,
  /selfie/i,
  /business suit/i,
  /office worker/i,
  /startup founder/i,
];

const RULES: Record<string, SemanticRule> = {
  fruit: {
    allowedTags: [
      /produce/i, /orchard/i, /citrus/i, /berry/i, /berries/i, /strawberr/i, /apple/i, /banana/i,
      /grape/i, /watermelon/i, /smoothie/i, /juice/i, /market/i, /harvest/i, /farm/i,
      /subscription box/i, /fruit box/i, /packaging/i, /macro/i, /crate/i, /mango/i,
      /fruit/i, /bowl/i, /breakfast/i, /wellness/i, /assortment/i, /flat lay/i, /golden hour/i,
    ],
    rejectedTags: [
      /vr/i, /gaming/i, /esports/i, /office/i, /laptop/i, /basketball/i, /yoga/i,
      /fashion/i, /portrait/i, /headshot/i, /startup/i, /tech photography/i,
    ],
    rejectedSubjects: [
      /vr/i, /virtual reality/i, /headset/i, /gaming/i, /office worker/i,
      /startup founder/i, /random portrait/i, /basketball/i, /court/i, /arena/i,
      /business meeting/i, /conference/i,
    ],
    peopleContext: [/chef/i, /farmer/i, /vendor/i, /harvest/i, /market vendor/i],
  },
  "basketball-analytics": {
    allowedTags: [
      /basketball/i, /court/i, /arena/i, /player/i, /team/i, /coaching/i,
      /analytics/i, /stats/i, /scoreboard/i, /training/i, /game/i, /hardwood/i,
    ],
    rejectedTags: [/fruit/i, /produce/i, /yoga/i, /fashion/i, /office/i, /vr/i, /smoothie/i, /orchard/i],
    rejectedSubjects: [/yoga/i, /fruit/i, /produce/i, /office worker/i, /vr/i, /headset/i],
    peopleContext: [/player/i, /athlete/i, /coach/i, /team/i],
  },
  "sports-athletics": {
    allowedTags: [/sport/i, /athlete/i, /training/i, /team/i, /court/i, /arena/i, /gear/i],
    rejectedTags: [/fruit/i, /produce/i, /vr/i, /office/i, /yoga/i],
    rejectedSubjects: [/fruit/i, /produce/i, /office worker/i, /vr/i],
    peopleContext: [/athlete/i, /player/i, /coach/i, /training/i],
  },
  pets: {
    allowedTags: [/dog/i, /cat/i, /pet/i, /puppy/i, /kitten/i, /animal/i, /groom/i, /toy/i],
    rejectedTags: [/basketball/i, /fruit/i, /vr/i, /office/i],
    rejectedSubjects: [/basketball/i, /fruit/i, /office worker/i, /vr/i],
    peopleContext: [/owner/i, /park/i, /groom/i],
  },
};

function normalizeCategory(startupCategory: string): string {
  const key = startupCategory.toLowerCase();
  if (RULES[key]) return key;
  if (key.includes("fruit") || key.includes("produce")) return "fruit";
  if (key.includes("basketball")) return "basketball-analytics";
  if (key.includes("sport")) return "sports-athletics";
  if (key.includes("pet")) return "pets";
  return key;
}

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

function imageText(image: CategorizedImage): string {
  return [image.category, image.role, ...image.tags, ...image.mood, image.composition ?? ""].join(" ");
}

/** Semantic rejection — category-native imagery only */
export function validateImageSemanticFit(startupCategory: string, image: CategorizedImage): boolean {
  const key = normalizeCategory(startupCategory);
  const rule = RULES[key];
  if (!rule) return image.category === startupCategory;

  const text = imageText(image);

  if (matchesAny(text, rule.rejectedTags) || matchesAny(text, rule.rejectedSubjects)) {
    return false;
  }

  const hasPeople = matchesAny(text, PEOPLE_SIGNALS);
  if (hasPeople && rule.peopleContext) {
    if (!matchesAny(text, rule.peopleContext)) {
      return false;
    }
  }

  return matchesAny(text, rule.allowedTags);
}

export function filterSemanticallyValid(
  startupCategory: string,
  images: CategorizedImage[]
): CategorizedImage[] {
  return images.filter((img) => validateImageSemanticFit(startupCategory, img));
}
