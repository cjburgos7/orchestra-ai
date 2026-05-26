/**
 * Strict category validation for imagery queries and search results.
 * Prevents VR, gaming, tech, and unrelated human imagery from leaking into category worlds.
 */

import type { SlotType } from "@/lib/category-vocab";

/** Global ban — never acceptable in any category world */
const GLOBAL_BANNED: RegExp[] = [
  /\bvr\b/i,
  /virtual reality/i,
  /headset/i,
  /\besports\b/i,
  /video game/i,
  /gaming setup/i,
  /rgb lighting/i,
  /startup office/i,
  /open plan office/i,
  /\blaptop\b/i,
  /macbook/i,
  /dashboard/i,
  /saas/i,
  /abstract shape/i,
  /\bblob\b/i,
  /network diagram/i,
  /futuristic interface/i,
  /hologram/i,
  /metaverse/i,
];

type CategoryRule = {
  /** At least one must match query or alt when present */
  requiredSignals: RegExp[];
  banned: RegExp[];
  /** If false, reject queries/alts that imply human subjects */
  allowPeople: boolean;
  /** When people allowed, query must match one of these */
  peopleContext?: RegExp[];
};

const RULES: Record<string, CategoryRule> = {
  "fresh produce": {
    requiredSignals: [
      /fruit/i,
      /produce/i,
      /orchard/i,
      /citrus/i,
      /berry/i,
      /harvest/i,
      /market/i,
      /juice/i,
      /smoothie/i,
      /vegetable/i,
      /farm/i,
      /basket/i,
      /crate/i,
      /mango/i,
      /apple/i,
      /orange/i,
      /strawberr/i,
    ],
    banned: [
      /basketball/i,
      /soccer/i,
      /\bgym\b/i,
      /\bdog\b/i,
      /\bcat\b/i,
      /pet(?!ite)/i,
      /vr/i,
      /headset/i,
      /gaming/i,
      /esports/i,
      /laptop/i,
      /office worker/i,
      /business suit/i,
      /conference room/i,
    ],
    allowPeople: true,
    peopleContext: [/farmer/i, /market/i, /harvest/i, /chef/i, /kitchen/i, /vendor/i, /pick/i],
  },
  "food & beverage": {
    requiredSignals: [/food/i, /restaurant/i, /coffee/i, /meal/i, /kitchen/i, /dining/i, /drink/i, /beverage/i],
    banned: [/vr/i, /gaming/i, /basketball/i, /laptop/i, /startup/i],
    allowPeople: true,
    peopleContext: [/chef/i, /barista/i, /dining/i, /kitchen/i, /server/i],
  },
  "sports & athletics": {
    requiredSignals: [/sport/i, /athlete/i, /basketball/i, /court/i, /training/i, /gym/i, /fitness/i, /stadium/i],
    banned: [/vr/i, /gaming/i, /esports/i, /laptop/i, /fruit/i, /produce/i, /dog/i, /cat/i],
    allowPeople: true,
    peopleContext: [/athlete/i, /player/i, /coach/i, /training/i, /team/i],
  },
  "pets & animals": {
    requiredSignals: [/dog/i, /cat/i, /pet/i, /puppy/i, /kitten/i, /animal/i, /canine/i, /feline/i],
    banned: [/vr/i, /gaming/i, /basketball/i, /fruit/i, /produce/i, /laptop/i],
    allowPeople: true,
    peopleContext: [/owner/i, /walking dog/i, /groom/i, /vet/i, /park/i],
  },
};

const PEOPLE_SIGNALS = [
  /\bman\b/i,
  /\bwoman\b/i,
  /\bperson\b/i,
  /\bpeople\b/i,
  /\bportrait\b/i,
  /headshot/i,
  /\bface\b/i,
  /selfie/i,
  /crowd/i,
];

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

function normalizeCategoryKey(category: string): string {
  const key = category.toLowerCase().trim();
  if (RULES[key]) return key;
  if (key.includes("produce") || key.includes("fruit")) return "fresh produce";
  if (key.includes("sport") || key.includes("basketball") || key.includes("athletic")) return "sports & athletics";
  if (key.includes("pet") || key.includes("dog") || key.includes("cat")) return "pets & animals";
  if (key.includes("food") || key.includes("beverage") || key.includes("restaurant")) return "food & beverage";
  return key;
}

export function passesCategoryGuard(
  category: string,
  query: string,
  alt = "",
  slot: SlotType = "hero"
): { ok: boolean; reason?: string } {
  const text = `${query} ${alt} ${slot}`.toLowerCase();
  const key = normalizeCategoryKey(category);
  const rule = RULES[key];

  if (matchesAny(text, GLOBAL_BANNED)) {
    return { ok: false, reason: "global banned subject" };
  }

  if (!rule) {
    // Unknown category — still block global contamination, require non-empty query
    if (!query.trim()) return { ok: false, reason: "empty query" };
    return { ok: true };
  }

  if (matchesAny(text, rule.banned)) {
    return { ok: false, reason: "category banned subject" };
  }

  const hasPeople = matchesAny(text, PEOPLE_SIGNALS);
  if (hasPeople && !rule.allowPeople) {
    return { ok: false, reason: "people not allowed for category" };
  }

  if (hasPeople && rule.allowPeople && rule.peopleContext?.length) {
    if (!matchesAny(text, rule.peopleContext)) {
      return { ok: false, reason: "human imagery out of category context" };
    }
  }

  // API queries must signal category; curated queries use curated: prefix and skip strict signal check
  if (!query.startsWith("curated:") && !matchesAny(`${query} ${alt}`, rule.requiredSignals)) {
    return { ok: false, reason: "missing category signal in query" };
  }

  return { ok: true };
}

/** Extract stable Unsplash photo id for dedup across crops */
export function extractPhotoId(url: string): string {
  const match = url.match(/photo-([\d]+-[a-f0-9]+)/i);
  if (match) return match[1];
  return url.split("?")[0];
}

export function isPhotoSeen(registry: Set<string>, url: string): boolean {
  return registry.has(extractPhotoId(url));
}

export function registerPhoto(registry: Set<string>, url: string): void {
  registry.add(extractPhotoId(url));
}
