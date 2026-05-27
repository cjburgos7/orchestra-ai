import type { RegistryId, StoryBeat, StorySection, ImageRole } from "./image-types";

const FRUIT_STORY: StoryBeat[] = [
  { section: "hero", role: "hero", label: "Cinematic orchard" },
  { section: "products", role: "product", label: "Subscription boxes" },
  { section: "products", role: "product", label: "Juice & smoothie packs" },
  { section: "products", role: "product", label: "Seasonal crates" },
  { section: "ingredients", role: "macro", label: "Macro fruit closeups" },
  { section: "ingredients", role: "macro", label: "Citrus & berry detail" },
  { section: "editorial", role: "editorial", label: "Farm sourcing story" },
  { section: "editorial", role: "editorial", label: "Market & harvest" },
  { section: "lifestyle", role: "lifestyle", label: "Healthy eating" },
  { section: "lifestyle", role: "lifestyle", label: "Wellness moments" },
  { section: "cta", role: "product", label: "Premium packaging" },
];

const BASKETBALL_STORY: StoryBeat[] = [
  { section: "hero", role: "hero", label: "Arena court cinematic" },
  { section: "products", role: "product", label: "Analytics dashboard" },
  { section: "products", role: "product", label: "Player tracking" },
  { section: "products", role: "product", label: "Team intelligence" },
  { section: "ingredients", role: "macro", label: "Ball texture detail" },
  { section: "editorial", role: "editorial", label: "Game night atmosphere" },
  { section: "editorial", role: "editorial", label: "Scoreboard energy" },
  { section: "lifestyle", role: "lifestyle", label: "Training intensity" },
  { section: "social-proof", role: "ambient", label: "Arena ambient" },
  { section: "cta", role: "ambient", label: "Spotlight finish" },
];

const SPORTS_STORY: StoryBeat[] = [
  { section: "hero", role: "hero", label: "Athletic hero" },
  { section: "products", role: "product", label: "Training gear" },
  { section: "products", role: "product", label: "Performance plan" },
  { section: "editorial", role: "editorial", label: "Game energy" },
  { section: "lifestyle", role: "lifestyle", label: "Court lifestyle" },
  { section: "cta", role: "ambient", label: "Ambient close" },
];

const PETS_STORY: StoryBeat[] = [
  { section: "hero", role: "hero", label: "Pet hero" },
  { section: "products", role: "product", label: "Pet products" },
  { section: "editorial", role: "editorial", label: "Pet lifestyle" },
  { section: "lifestyle", role: "lifestyle", label: "Cozy moments" },
  { section: "cta", role: "macro", label: "Detail close" },
];

const STORY_BY_REGISTRY: Record<RegistryId, StoryBeat[]> = {
  fruit: FRUIT_STORY,
  "basketball-analytics": BASKETBALL_STORY,
  "sports-athletics": SPORTS_STORY,
  pets: PETS_STORY,
};

export function getStoryFlow(registryId: RegistryId): StoryBeat[] {
  return STORY_BY_REGISTRY[registryId] ?? FRUIT_STORY;
}

export function storyRoleForSlot(
  registryId: RegistryId,
  slotKey: string
): { role: ImageRole; section: StorySection } | null {
  const flow = getStoryFlow(registryId);
  const slotMap: Record<string, number> = {
    "hero-0": 0,
    "product-0": 1,
    "product-1": 2,
    "product-2": 3,
    "feature-0": 4,
    "feature-1": 5,
    "feature-2": 6,
    "ambient-0": 8,
    "ambient-1": 9,
  };
  const idx = slotMap[slotKey];
  if (idx === undefined || !flow[idx]) return null;
  return { role: flow[idx].role, section: flow[idx].section };
}
