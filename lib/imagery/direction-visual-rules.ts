import type { DirectionId } from "@/lib/types/startup";
import type { DirectionVisualRules, ImageRole } from "./image-types";

const RULES: Partial<Record<DirectionId, DirectionVisualRules>> = {
  "premium-dark": {
    id: "premium-dark",
    preferredRoles: ["hero", "editorial", "ambient", "macro"],
    preferredMood: ["cinematic", "dramatic", "moody", "dark", "arena"],
    saturation: -4,
    contrast: 8,
    spacingStyle: "layered",
    compositionStyle: "cinematic",
  },
  "minimal-clean": {
    id: "minimal-clean",
    preferredRoles: ["product", "macro", "hero"],
    preferredMood: ["clean", "premium", "soft", "calm", "fresh"],
    saturation: -5,
    contrast: 8,
    spacingStyle: "airy",
    compositionStyle: "isolated",
  },
  "bold-experimental": {
    id: "bold-experimental",
    preferredRoles: ["macro", "editorial", "lifestyle", "hero"],
    preferredMood: ["vivid", "kinetic", "bold", "colorful", "dynamic"],
    saturation: 15,
    contrast: 22,
    spacingStyle: "dense",
    compositionStyle: "collage",
  },
  "luxury-editorial": {
    id: "luxury-editorial",
    preferredRoles: ["hero", "editorial", "lifestyle", "macro"],
    preferredMood: ["editorial", "cinematic", "warm", "premium", "documentary"],
    saturation: -8,
    contrast: 12,
    spacingStyle: "balanced",
    compositionStyle: "magazine",
  },
  orchestra: {
    id: "orchestra",
    preferredRoles: ["hero", "product", "editorial", "lifestyle"],
    preferredMood: ["fresh", "premium", "editorial", "warm", "dynamic", "vivid"],
    saturation: 8,
    contrast: 12,
    spacingStyle: "balanced",
    compositionStyle: "cinematic",
  },
  "genz-vibrant": {
    id: "genz-vibrant",
    preferredRoles: ["lifestyle", "macro", "hero", "editorial"],
    preferredMood: ["bright", "energetic", "vivid", "social"],
    saturation: 20,
    contrast: 16,
    spacingStyle: "dense",
    compositionStyle: "collage",
  },
  "cinematic-ai": {
    id: "cinematic-ai",
    preferredRoles: ["hero", "ambient", "editorial", "macro"],
    preferredMood: ["cinematic", "dramatic", "atmospheric", "moody"],
    saturation: -10,
    contrast: 20,
    spacingStyle: "layered",
    compositionStyle: "cinematic",
  },
};

const DEFAULT_RULES: DirectionVisualRules = {
  id: "default",
  preferredRoles: ["hero", "product", "editorial", "lifestyle", "ambient"],
  preferredMood: ["fresh", "premium", "editorial"],
  saturation: 0,
  contrast: 10,
  spacingStyle: "balanced",
  compositionStyle: "cinematic",
};

export function getDirectionVisualRules(direction: DirectionId): DirectionVisualRules {
  return RULES[direction] ?? DEFAULT_RULES;
}

export function scoreImageForDirection(image: { mood: string[]; role: ImageRole }, rules: DirectionVisualRules): number {
  let score = 0;
  if (rules.preferredRoles.includes(image.role)) score += 2;
  for (const m of image.mood) {
    if (rules.preferredMood.some((pm) => m.toLowerCase().includes(pm.toLowerCase()))) score += 1;
  }
  return score;
}

export function applyDirectionTreatment(url: string, rules: DirectionVisualRules, salt = 0): string {
  if (!url.startsWith("http")) return url;
  const base = url.split("?")[0];
  const params = new URLSearchParams(url.includes("?") ? url.split("?")[1] : "");
  const width = parseInt(params.get("w") ?? "1200", 10);
  const height = parseInt(params.get("h") ?? "800", 10);
  params.set("ixlib", "rb-4.0.3");
  params.set("auto", "format");
  params.set("fit", "crop");
  params.set("q", "80");
  const wobble = salt > 0 ? (Math.abs(salt) % 6) * 32 : 0;
  params.set("w", String(Math.min(width + wobble, 2400)));
  if (height) params.set("h", String(height));
  if (rules.saturation !== 0) params.set("sat", String(rules.saturation));
  if (rules.contrast !== 0) params.set("con", String(rules.contrast));
  return `${base}?${params.toString()}`;
}
