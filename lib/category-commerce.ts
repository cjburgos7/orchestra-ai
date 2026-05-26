/**
 * Category-locked commerce catalogs — believable products per startup world.
 * No generic "Starter / Pro / Team" cards.
 */

import type { DirectionId, StartupBrief } from "@/lib/types/startup";
import type { CategoryResolution, SecondaryCategory } from "@/lib/orchestration/category-resolution";
import { resolveCategory } from "@/lib/orchestration/category-resolution";

export type CategoryProduct = {
  name: string;
  price: string;
  /** Maps to imagery slot key product-0, product-1, product-2 */
  slotKey: string;
  category: string;
  subscription?: boolean;
};

type ProductSet = CategoryProduct[];

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return Math.abs(h);
}

const CATALOGS: Partial<Record<SecondaryCategory, ProductSet[]>> = {
  fruit: [
    [
      { name: "Citrus Harvest Box", price: "$42", slotKey: "product-0", category: "Seasonal citrus", subscription: false },
      { name: "Organic Berry Mix", price: "$28", slotKey: "product-1", category: "Berries", subscription: false },
      { name: "Weekly Fruit Subscription", price: "$45/mo", slotKey: "product-2", category: "Subscription", subscription: true },
    ],
    [
      { name: "Cold-Pressed Orange Juice", price: "$18", slotKey: "product-0", category: "Juice", subscription: false },
      { name: "Farmers Market Bundle", price: "$38", slotKey: "product-1", category: "Mixed produce", subscription: false },
      { name: "Tropical Smoothie Pack", price: "$24", slotKey: "product-2", category: "Smoothies", subscription: false },
    ],
    [
      { name: "Apple Harvest Crate", price: "$38", slotKey: "product-0", category: "Apples", subscription: false },
      { name: "Seasonal Citrus Box", price: "$42", slotKey: "product-1", category: "Citrus", subscription: false },
      { name: "Produce Curation Plan", price: "$52/mo", slotKey: "product-2", category: "Subscription", subscription: true },
    ],
  ],
  produce: [
    [
      { name: "Farmers Market Bundle", price: "$36", slotKey: "product-0", category: "Mixed produce", subscription: false },
      { name: "Organic Berry Mix", price: "$28", slotKey: "product-1", category: "Berries", subscription: false },
      { name: "Weekly Produce Box", price: "$48/mo", slotKey: "product-2", category: "Subscription", subscription: true },
    ],
  ],
  basketball: [
    [
      { name: "Skills Training Plan", price: "$29/mo", slotKey: "product-0", category: "Training", subscription: true },
      { name: "Pro Ball Handling Course", price: "$48", slotKey: "product-1", category: "Skills", subscription: false },
      { name: "Team Analytics Suite", price: "$79/mo", slotKey: "product-2", category: "Analytics", subscription: true },
    ],
    [
      { name: "Shooting Workout Pack", price: "$39", slotKey: "product-0", category: "Training", subscription: false },
      { name: "Court Finder Pro", price: "$19/mo", slotKey: "product-1", category: "Discovery", subscription: true },
      { name: "Elite Performance Plan", price: "$99/mo", slotKey: "product-2", category: "Coaching", subscription: true },
    ],
  ],
  dogs: [
    [
      { name: "Premium Collar Collection", price: "$34", slotKey: "product-0", category: "Accessories", subscription: false },
      { name: "Grooming Essentials Kit", price: "$48", slotKey: "product-1", category: "Grooming", subscription: false },
      { name: "Monthly Treat Box", price: "$29/mo", slotKey: "product-2", category: "Subscription", subscription: true },
    ],
    [
      { name: "Organic Treat Box", price: "$29", slotKey: "product-0", category: "Treats", subscription: false },
      { name: "Adventure Leash Set", price: "$42", slotKey: "product-1", category: "Accessories", subscription: false },
      { name: "Grooming Pass", price: "$59/mo", slotKey: "product-2", category: "Grooming", subscription: true },
    ],
  ],
  cats: [
    [
      { name: "Premium Cat Food Plan", price: "$32/mo", slotKey: "product-0", category: "Nutrition", subscription: true },
      { name: "Enrichment Toy Bundle", price: "$36", slotKey: "product-1", category: "Toys", subscription: false },
      { name: "Litter + Care Kit", price: "$44", slotKey: "product-2", category: "Care", subscription: false },
    ],
  ],
};

/** Brief-aware product selection — subscription startups prefer subscription SKUs */
function scoreProductSet(brief: StartupBrief, set: ProductSet): number {
  const text = `${brief.name} ${brief.tagline} ${brief.description} ${brief.features.join(" ")}`.toLowerCase();
  let score = 0;
  if (/subscription|weekly|monthly|box|delivery|curat/i.test(text)) {
    score += set.filter((p) => p.subscription).length * 2;
  }
  if (/juice|smoothie|cold-pressed/i.test(text) && set.some((p) => /juice|smoothie/i.test(p.name))) score += 3;
  if (/organic|farm|harvest|market/i.test(text) && set.some((p) => /farm|harvest|organic/i.test(p.name))) score += 2;
  return score;
}

export function pickCategoryProducts(
  brief: StartupBrief,
  resolution: CategoryResolution,
  seed: string,
  direction: DirectionId
): CategoryProduct[] {
  const sets = CATALOGS[resolution.secondary];
  if (!sets?.length) {
    return fallbackProducts(brief, resolution);
  }

  const scored = sets
    .map((set, idx) => ({ set, idx, score: scoreProductSet(brief, set) }))
    .sort((a, b) => b.score - a.score || a.idx - b.idx);

  const pickIdx =
    (hashSeed(`${seed}:${direction}:${resolution.secondary}`) + scored[0].score) % sets.length;
  const chosen = sets[pickIdx] ?? sets[0];

  return chosen.map((p) => ({
    ...p,
    name: personalizeName(p.name, brief),
  }));
}

function personalizeName(base: string, brief: StartupBrief): string {
  const brand = brief.name.split(" ")[0];
  if (/subscription/i.test(brief.tagline) && base.includes("Subscription")) {
    return `${brand} ${base}`;
  }
  return base;
}

function fallbackProducts(brief: StartupBrief, resolution: CategoryResolution): CategoryProduct[] {
  const cat = resolution.secondary.replace(/-/g, " ");
  return [
    { name: `${brief.name.split(" ")[0]} ${cat} Starter`, price: "$29", slotKey: "product-0", category: cat },
    { name: `${brief.name.split(" ")[0]} ${cat} Plus`, price: "$59", slotKey: "product-1", category: cat },
    { name: `${brief.name.split(" ")[0]} ${cat} Pro`, price: "$99/mo", slotKey: "product-2", category: cat, subscription: true },
  ];
}

export function pickCategoryProductsFromBrief(
  brief: StartupBrief,
  seed: string,
  direction: DirectionId
): CategoryProduct[] {
  return pickCategoryProducts(brief, resolveCategory(brief), seed, direction);
}
