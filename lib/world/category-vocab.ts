/**
 * Literal category vocabulary — every term is a photographable noun or noun phrase.
 * No abstract brand words (innovation, energy, playful, etc.).
 */

export type CategoryCluster = "fresh produce" | "basketball" | "pets";

export type CategoryVocabulary = {
  /** Canonical cluster id */
  cluster: CategoryCluster;
  /** Hero / foreground subjects — must read instantly in a photograph */
  imageryPrimary: string[];
  /** Supporting products, props, and merchandising objects */
  imagerySecondary: string[];
  /** Environments, surfaces, and background scenes */
  imageryAmbient: string[];
  /** Brand palette anchors (hex) */
  paletteHex: string[];
  /** Literal scene descriptors visible in-frame — not abstract mood adjectives */
  moodWords: string[];
  /** Single literal photography direction string */
  photographyStyle: string;
};

export const CATEGORY_VOCABULARY: Record<CategoryCluster, CategoryVocabulary> = {
  "fresh produce": {
    cluster: "fresh produce",
    imageryPrimary: [
      "oranges",
      "apples",
      "bananas",
      "strawberries",
      "grapes",
      "kiwis",
      "lemons",
      "limes",
      "blueberries",
      "raspberries",
      "peaches",
      "watermelon slices",
      "pineapple",
      "mango",
      "pomegranate",
      "avocado halves",
      "citrus slices",
      "mixed berry bowl",
      "fruit basket",
      "wooden produce crate",
    ],
    imagerySecondary: [
      "cold-pressed juice bottles",
      "smoothie glasses",
      "produce delivery box",
      "paper fruit bag",
      "glass jam jars",
      "farmers market tote",
      "subscription fruit box",
      "recycled cardboard packaging",
      "linen produce wrap",
      "handwritten market price tags",
      "kitchen cutting board",
      "ceramic fruit bowl",
    ],
    imageryAmbient: [
      "apple orchard rows",
      "citrus grove trees",
      "farmers market stall",
      "wooden farm table",
      "produce aisle shelves",
      "farm stand canopy",
      "harvest field",
      "morning market tables",
      "greenhouse interior",
      "country kitchen counter",
    ],
    paletteHex: ["#EA580C", "#CA8A04", "#65A30D", "#15803D", "#92400E", "#FEF9EE"],
    moodWords: [
      "sunlit orchard rows",
      "market stall display",
      "kitchen counter fruit spread",
      "overhead produce flat lay",
      "farm table harvest pile",
      "grocery produce section",
      "juice bar counter",
      "wood crate packing scene",
    ],
    photographyStyle: "macro fruit closeup and overhead produce flat lay photography",
  },

  basketball: {
    cluster: "basketball",
    imageryPrimary: [
      "basketballs",
      "basketball hoops",
      "basketball nets",
      "basketball courts",
      "basketball players",
      "sneakers",
      "team jerseys",
      "coach clipboard",
      "scoreboard digits",
      "court lines",
      "dribbling hands",
      "slam dunk silhouette",
      "free throw line",
      "three-point arc",
      "bench players",
    ],
    imagerySecondary: [
      "training cones",
      "water bottles",
      "gym towels",
      "stopwatch",
      "playbook pages",
      "ankle braces",
      "compression sleeves",
      "team bench chairs",
      "locker room lockers",
      "sports duffel bag",
      "whistle",
      "clipboard plays diagram",
    ],
    imageryAmbient: [
      "indoor basketball arena",
      "outdoor neighborhood court",
      "gymnasium hardwood floor",
      "bleacher seats",
      "arena tunnel walkway",
      "training facility court",
      "school gym rafters",
      "street court chain-link fence",
      "arena spotlight rigging",
      "locker room benches",
    ],
    paletteHex: ["#EA580C", "#DC2626", "#2563EB", "#0F172A", "#F97316", "#FFF7ED"],
    moodWords: [
      "arena spotlight court",
      "outdoor asphalt court",
      "gymnasium hardwood floor",
      "bench huddle circle",
      "pre-game tunnel walk",
      "empty court overhead view",
      "crowd-filled bleachers",
      "sideline coach stance",
    ],
    photographyStyle: "sports action and arena wide-angle basketball photography",
  },

  pets: {
    cluster: "pets",
    imageryPrimary: [
      "dogs",
      "puppies",
      "golden retrievers",
      "labrador retrievers",
      "dog collars",
      "dog leashes",
      "dog toys",
      "tennis balls",
      "rope chew toys",
      "dog treats",
      "dog food bowls",
      "pet grooming brush",
      "dog beds",
      "dog harnesses",
      "pet ID tags",
    ],
    imagerySecondary: [
      "shampoo bottles",
      "grooming scissors",
      "nail clippers",
      "pet carrier bag",
      "treat jars",
      "dog waste bags",
      "pet subscription box",
      "bandanas",
      "rain jackets for dogs",
      "pet first aid kit",
      "dog toothbrush",
      "pet water fountain",
    ],
    imageryAmbient: [
      "dog park grass field",
      "suburban backyard fence",
      "living room rug",
      "grooming salon table",
      "pet store aisle",
      "neighborhood sidewalk walk",
      "couch pet nap spot",
      "kitchen tile floor",
      "park bench rest stop",
      "car backseat pet travel",
    ],
    paletteHex: ["#D97706", "#EA580C", "#F59E0B", "#92400E", "#78716C", "#FFFBEB"],
    moodWords: [
      "dog park fetch scene",
      "living room couch nap",
      "grooming table closeup",
      "backyard grass play",
      "leash walk sidewalk",
      "pet store shelf display",
      "kitchen bowl feeding time",
      "car window travel shot",
    ],
    photographyStyle: "natural-light pet lifestyle and grooming salon photography",
  },
};

export function getCategoryVocabulary(cluster: CategoryCluster): CategoryVocabulary {
  return CATEGORY_VOCABULARY[cluster];
}

export const CATEGORY_CLUSTERS = Object.keys(CATEGORY_VOCABULARY) as CategoryCluster[];
