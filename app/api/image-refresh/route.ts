/**
 * On-demand image refresh.
 * Returns a category-specific Pexels CDN URL (permanent, no API key needed for display).
 */
import { NextResponse } from "next/server";
import type { V2CategoryKey } from "@/lib/world-v2/types";

const VALID_CATEGORIES = new Set<V2CategoryKey>([
  "floral", "fitness", "finance", "fashion", "food", "wellness",
  "travel", "home", "education", "health", "creator", "sports",
  "music", "science", "saas",
]);

/** Curated Pexels photo IDs — verified 200, category-specific, landscape orientation */
const HERO_PHOTOS: Record<V2CategoryKey, number> = {
  floral:    56866,    // pink roses close-up
  fitness:   1552242,  // athlete training
  finance:   351264,   // financial charts/office
  fashion:   1648377,  // fashion editorial
  food:      1640777,  // vibrant food spread
  wellness:  3756165,  // spa / calm wellness
  travel:    346885,   // dramatic landscape
  home:      1571463,  // Scandinavian interior
  education: 256490,   // books / study space
  health:    4386467,  // clean health aesthetic
  creator:   3379934,  // creative studio
  sports:    248547,   // sports action
  music:     1626481,  // music studio / vinyl
  science:   2280571,  // laboratory
  saas:      3861969,  // tech workspace
};

function pexelsUrl(id: number): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("category") ?? "creator";
  const category: V2CategoryKey = VALID_CATEGORIES.has(raw as V2CategoryKey)
    ? (raw as V2CategoryKey)
    : "creator";

  const photoId = HERO_PHOTOS[category] ?? HERO_PHOTOS.creator;
  return NextResponse.json({ url: pexelsUrl(photoId) });
}
