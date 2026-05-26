/**
 * Category-aware cinematic texture fallbacks — CSS only, never logo/SVG blocks.
 */

import { resolveCategory as resolveVocabCategory } from "@/lib/category-vocab";

export type TexturePreset = {
  css: string;
  /** Optional subtle grain overlay via CSS */
  overlay?: string;
};

const TEXTURES: Record<string, TexturePreset> = {
  "fresh produce": {
    css: "linear-gradient(145deg, #1a0f08 0%, #c8501a 35%, #f5a623 70%, #2d5016 100%)",
    overlay: "radial-gradient(ellipse at 30% 20%, rgba(255,200,100,0.25) 0%, transparent 55%)",
  },
  "food & beverage": {
    css: "linear-gradient(160deg, #1c1410 0%, #8b4513 40%, #d4a574 100%)",
    overlay: "radial-gradient(circle at 70% 80%, rgba(255,180,80,0.15) 0%, transparent 50%)",
  },
  "sports & athletics": {
    css: "linear-gradient(155deg, #0a1628 0%, #1b3a5c 45%, #c8501a 100%)",
    overlay: "radial-gradient(ellipse at 50% 100%, rgba(245,200,66,0.12) 0%, transparent 60%)",
  },
  "pets & animals": {
    css: "linear-gradient(150deg, #292018 0%, #92400e 50%, #fffbec 100%)",
    overlay: "radial-gradient(circle at 40% 60%, rgba(255,220,150,0.18) 0%, transparent 50%)",
  },
};

function normalizeCategory(category: string): string {
  const key = category.toLowerCase();
  if (TEXTURES[key]) return key;
  if (key.includes("produce") || key.includes("fruit")) return "fresh produce";
  if (key.includes("sport") || key.includes("basketball")) return "sports & athletics";
  if (key.includes("pet") || key.includes("dog") || key.includes("cat")) return "pets & animals";
  if (key.includes("food") || key.includes("beverage")) return "food & beverage";
  return "fresh produce";
}

export function categoryTexture(category: string, palette: string[]): TexturePreset {
  const normalized = normalizeCategory(category);
  const preset = TEXTURES[normalized];
  if (preset) return preset;

  const [primary = "#3B82F6", secondary = "#8B5CF6"] = palette;
  return {
    css: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
  };
}

export function categoryTextureCss(category: string, palette: string[]): string {
  return categoryTexture(category, palette).css;
}

export function resolveCategoryFromBrief(briefText: string): string {
  return normalizeCategory(resolveVocabCategory(briefText));
}
