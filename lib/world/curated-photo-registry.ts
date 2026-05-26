import type { CategoryCluster } from "@/lib/world/category-vocab";

/**
 * Curated Unsplash photo IDs keyed by literal vocabulary nouns.
 * Used when search API keys are unavailable — stable, category-locked photography.
 */
export const CURATED_PHOTOS: Record<CategoryCluster, Record<string, string[]>> = {
  "fresh produce": {
    oranges: ["1610879246508-63206585852", "1547514703-084286630f27"],
    apples: ["1568702846-36c088f08209", "1587049352247-c34689e16604"],
    bananas: ["1571771894821-ce9b6d11b08e"],
    strawberries: ["1464459320601-8db2bc1a6b7e", "145225367794-56f7e41b1257"],
    grapes: ["1519996529221-4a0f8c4d7d6e"],
    kiwis: ["1610837524703-040399967cf0"],
    lemons: ["1610879246508-63206585852"],
    limes: ["1487700174473-bd5a8d0b4723"],
    blueberries: ["145225367794-56f7e41b1257"],
    raspberries: ["1464459320601-8db2bc1a6b7e"],
    peaches: ["1540423133010-7117160ca44c"],
    "watermelon slices": ["1498837167922-ddd27545d399"],
    pineapple: ["1566385101042-f4671190a963"],
    mango: ["1540423133010-7117160ca44c"],
    pomegranate: ["1610837524703-040399967cf0"],
    "avocado halves": ["1546548970-f6a0c97ca1e6"],
    "citrus slices": ["1610879246508-63206585852"],
    "mixed berry bowl": ["145225367794-56f7e41b1257"],
    "fruit basket": ["1610837524703-040399967cf0"],
    "wooden produce crate": ["1487700174473-bd5a8d0b4723"],
    "cold-pressed juice bottles": ["1622595424935-535a5979a177", "1563564126-d4d5a1629f0f"],
    "smoothie glasses": ["1563564126-d4d5a1629f0f"],
    "produce delivery box": ["1610837524703-040399967cf0"],
    "farmers market stall": ["1487700174473-bd5a8d0b4723"],
    "apple orchard rows": ["1502749568464-9a18e3196a7a"],
    "citrus grove trees": ["1502749568464-9a18e3196a7a"],
    "wooden farm table": ["1498837167922-ddd27545d399"],
    default: [
      "1610837524703-040399967cf0",
      "1610879246508-63206585852",
      "1464459320601-8db2bc1a6b7e",
      "1487700174473-bd5a8d0b4723",
      "1540423133010-7117160ca44c",
      "1563564126-d4d5a1629f0f",
      "1502749568464-9a18e3196a7a",
      "145225367794-56f7e41b1257",
    ],
  },
  basketball: {
    basketballs: ["1546519638-828a4eca42b7"],
    "basketball hoops": ["1577223533437-68b5977d51b8"],
    "basketball courts": ["1574623452841-47d1422096b9", "1511407617-872519128c22"],
    "basketball players": ["1461896836932-ffe607005bea"],
    sneakers: ["1546519638-828a4eca42b7"],
    "indoor basketball arena": ["1511407617-872519128c22"],
    "outdoor neighborhood court": ["1574623452841-47d1422096b9"],
    default: [
      "1546519638-828a4eca42b7",
      "1574623452841-47d1422096b9",
      "1577223533437-68b5977d51b8",
      "1511407617-872519128c22",
      "1461896836932-ffe607005bea",
      "1551958219-4c546c4f992f",
    ],
  },
  pets: {
    dogs: ["158730019-474c3a6a2f5a", "1548199973-03cce0cbc710"],
    puppies: ["1516738901171-8eb4fc13bd20", "1530284520547-3ffa630fa651"],
    "dog collars": ["1583512603405-09989976d522"],
    "dog toys": ["158730019-474c3a6a2f5a"],
    "dog park grass field": ["1530284520547-3ffa630fa651"],
    "grooming salon table": ["1548199973-03cce0cbc710"],
    default: [
      "158730019-474c3a6a2f5a",
      "1548199973-03cce0cbc710",
      "1516738901171-8eb4fc13bd20",
      "1530284520547-3ffa630fa651",
      "1583512603405-09989976d522",
      "1534361960057-19889d3627ae",
    ],
  },
};

export function lookupCuratedPhotoId(
  cluster: CategoryCluster,
  noun: string,
  index: number
): string {
  const registry = CURATED_PHOTOS[cluster];
  const key = noun.toLowerCase();
  const exact = registry[key] ?? registry[key.split(" ")[0] ?? ""];
  const pool = exact ?? registry.default ?? [];
  return pool[index % pool.length];
}

export function buildUnsplashPhotoUrl(
  photoId: string,
  width: number,
  height: number,
  params = ""
): string {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=88${params}`;
}
