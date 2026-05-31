/**
 * Category-specific DALL-E 3 prompts and Unsplash query terms.
 * Shared between buildWorldSpec (generation) and image-refresh (on-demand refresh).
 */

import type { V2CategoryKey } from "@/lib/world-v2/types";

/** Vivid editorial scene prompts for DALL-E 3 — no people, no faces */
export const DALLE_PROMPTS: Record<V2CategoryKey, string> = {
  floral:    "a lush arrangement of seasonal wildflowers — peonies, ranunculus, eucalyptus — in a handmade ceramic vase, soft morning window light, botanical editorial photography, shallow depth of field, no people",
  fitness:   "athlete's hands gripping a barbell at sunrise, dramatic low-angle shot, long shadows on polished gym floor, editorial sports photography, no faces",
  finance:   "sleek white marble desk with stacked gold coins and folded documents, warm directional office light, luxury financial aesthetic, editorial still life, no people",
  fashion:   "draped silk garment cascading over a clean white studio surface, directional tungsten light, high fashion editorial photography, no people",
  food:      "vibrant abundance of fresh tropical fruits — sliced mangoes, citrus halves, ripe berries — arranged on sun-drenched white marble, editorial food photography, saturated color, no people",
  wellness:  "minimalist spa room at dawn, steam rising from a carved stone bath, soft candlelight, natural linen and bamboo textures, tranquil atmosphere, no people",
  travel:    "dramatic mountain range at golden hour, vast aerial cinematic perspective, sweeping clouds, epic natural scale, travel editorial photography, no people",
  home:      "sun-drenched Scandinavian living room, floor-to-ceiling windows, premium white oak furniture, architectural interior editorial, no people",
  education: "open leather-bound books arranged on a dark oak desk, warm afternoon library light, brass desk lamp, contemplative scholarly atmosphere, no people",
  health:    "clean clinical workspace with soft green botanical accents, diffuse white light, calming medical aesthetic, minimal editorial still life, no people",
  creator:   "moody film studio setup with warm tungsten practicals, vintage 16mm camera, exposed brick background, creative workspace editorial, no people",
  sports:    "empty outdoor sports field at golden hour, dramatic overcast sky, long shadows across turf, atmospheric editorial landscape, no people",
  music:     "vintage vinyl record spinning on a warm-lit turntable, amber bokeh background, analog warmth, music studio editorial, no people",
  science:   "laboratory bench with glowing test tubes and precision glass instruments, clean white directional light, scientific editorial still life, no people",
  saas:      "minimal standing desk with dual monitors showing abstract geometric visuals, warm desk lamp, clean architectural interior, productivity editorial, no people",
};
