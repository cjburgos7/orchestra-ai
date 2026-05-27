import type { HomeSectionId } from "@/lib/types/startup";
import type { DirectionKey } from "./world-intelligence";
import { STORY_ARCS } from "./world-intelligence";
import type { CategoryKey } from "./world-intelligence";

const BEAT_TO_SECTION: Record<string, HomeSectionId> = {
  atmosphere: "story",
  product: "showcase",
  proof: "features",
  cta: "cta",
};

/** Map world-intelligence story arc → Orchestra section order */
export function storyArcToSectionOrder(
  category: CategoryKey,
  direction: DirectionKey
): HomeSectionId[] | null {
  const arc = STORY_ARCS[category]?.[direction];
  if (!arc?.length) return null;

  const order: HomeSectionId[] = [];
  for (const beat of arc) {
    const section = BEAT_TO_SECTION[beat.densityLayer];
    if (section && !order.includes(section)) order.push(section);
  }

  // Enrich with commerce-native sections when arc is sparse
  if (!order.includes("lifestyle")) order.splice(Math.min(1, order.length), 0, "lifestyle");
  if (!order.includes("sourcing") && category === "fresh-produce") {
    order.splice(Math.min(2, order.length), 0, "sourcing");
  }
  if (!order.includes("collections") && category === "fresh-produce") {
    order.push("collections");
  }
  if (!order.includes("testimonials")) order.push("testimonials");
  if (!order.includes("pricing")) order.push("pricing");

  return order;
}
