/**
 * Literal photography pools — real category objects only.
 * Direction selects different photo subsets, crops, and indices.
 * NO abstract/SVG/symbolic fallbacks.
 */

import type { DirectionId, StartupBrief } from "@/lib/types/startup";
import type { CategoryResolution, SecondaryCategory } from "@/lib/orchestration/category-resolution";
import { pickCategoryProducts } from "@/lib/category-commerce";

export type ImageryMap = {
  approved: string[];
  banned: string[];
  environments: string[];
  subjects: string[];
  photoStyles: string[];
  hero: string[];
  lifestyle: string[];
  products: string[];
};

/** Literal fruit photography — oranges, apples, berries, juice, orchards, markets */
const FRUIT_LITERAL: ImageryMap = {
  approved: [
    "oranges", "apples", "bananas", "strawberries", "grapes", "kiwi", "berries",
    "citrus", "fruit baskets", "juice bottles", "smoothies", "orchards",
    "farmers market", "sliced fruit", "produce packaging", "food photography",
  ],
  banned: ["abstract shapes", "circles", "blobs", "gradients", "gaming", "gym", "architecture"],
  environments: ["orchard", "farmers market", "kitchen", "farm", "produce aisle"],
  subjects: ["oranges", "apples", "bananas", "strawberries", "grapes", "juice", "fruit basket", "smoothie"],
  photoStyles: ["food editorial", "farm fresh", "product still life", "market lifestyle"],
  hero: [
    "1610879246508-63206585852", // oranges
    "1568702846-36c088f08209", // apples
    "1464459320601-8db2bc1a6b7e", // strawberries
    "1519996529221-4a0f8c4d7d6e", // grapes
    "1610837524703-040399967cf0", // fruit basket
    "1540423133010-7117160ca44c", // sliced fruit
    "1487700174473-bd5a8d0b4723", // farmers market
    "1563564126-d4d5a1629f0f", // juice
    "1622595424935-535a5979a177", // juice bottles
    "1502749568464-9a18e3196a7a", // orchard
    "1498837167922-ddd27545d399", // produce spread
    "145225367794-56f7e41b1257", // berries closeup
    "1542838132-92c227a848d6", // grocery produce
    "1587049352247-c34689e16604", // apples still life
    "1566385101042-f4671190a963", // mixed produce
  ],
  lifestyle: [
    "1487700174473-bd5a8d0b4723",
    "1502749568464-9a18e3196a7a",
    "1519996529221-4a0f8c4d7d6e",
    "1464459320601-8db2bc1a6b7e",
    "1610879246508-63206585852",
    "1563564126-d4d5a1629f0f",
    "1498837167922-ddd27545d399",
    "1546548970-f6a0c97ca1e6",
    "145225367794-56f7e41b1257",
    "1542838132-92c227a848d6",
    "1610837524703-040399967cf0",
  ],
  products: [
    "1610837524703-040399967cf0",
    "1622595424935-535a5979a177",
    "1464459320601-8db2bc1a6b7e",
    "1610879246508-63206585852",
    "1568702846-36c088f08209",
    "1563564126-d4d5a1629f0f",
    "1587049352247-c34689e16604",
    "145225367794-56f7e41b1257",
    "1540423133010-7117160ca44c",
    "1487700174473-bd5a8d0b4723",
  ],
};

const MAPS: Record<SecondaryCategory, ImageryMap> = {
  basketball: {
    approved: ["basketball", "basketball court", "players", "sneakers", "arena", "hoop", "training"],
    banned: ["gaming", "esports", "RGB", "abstract shapes"],
    environments: ["indoor court", "arena", "outdoor court", "gymnasium"],
    subjects: ["basketball", "player", "sneakers", "hoop", "team"],
    photoStyles: ["sports action", "arena", "training"],
    hero: [
      "1546519638-828a4eca42b7",
      "1574623452841-47d1422096b9",
      "1577223533437-68b5977d51b8",
      "1511407617-872519128c22",
      "1461896836932-ffe607005bea",
      "1551958219-4c546c4f992f",
      "1546519638-828a4eca42b7",
    ],
    lifestyle: [
      "1574623452841-47d1422096b9",
      "1511407617-872519128c22",
      "1577223533437-68b5977d51b8",
      "1461896836932-ffe607005bea",
      "1551958219-4c546c4f992f",
      "1546519638-828a4eca42b7",
    ],
    products: [
      "1546519638-828a4eca42b7",
      "1574623452841-47d1422096b9",
      "1511407617-872519128c22",
      "1577223533437-68b5977d51b8",
      "1461896836932-ffe607005bea",
      "1551958219-4c546c4f992f",
    ],
  },
  soccer: {
    approved: ["soccer field", "soccer player", "cleats", "match"],
    banned: ["gaming", "abstract"],
    environments: ["pitch", "stadium"],
    subjects: ["soccer ball", "player", "cleats"],
    photoStyles: ["match action"],
    hero: ["1579952363879-27f3bade8701", "1431324155629-2a1806e8439c", "1522778119026-d179bd122a4d", "1574623452841-47d1422096b9"],
    lifestyle: ["1579952363879-27f3bade8701", "1431324155629-2a1806e8439c", "1522778119026-d179bd122a4d"],
    products: ["1579952363879-27f3bade8701", "1431324155629-2a1806e8439c", "1522778119026-d179bd122a4d"],
  },
  running: {
    approved: ["runner", "marathon", "trail", "race shoes"],
    banned: ["gaming", "abstract"],
    environments: ["trail", "track"],
    subjects: ["runner", "shoes"],
    photoStyles: ["motion"],
    hero: ["1476480862126-209bf9298ae5", "1552674605-db6ffd4facb5", "1571008889439-8843bb39b2a5", "1571019613454-829cb2de8382"],
    lifestyle: ["1476480862126-209bf9298ae5", "1552674605-db6ffd4facb5", "1571008889439-8843bb39b2a5"],
    products: ["1476480862126-209bf9298ae5", "1552674605-db6ffd4facb5", "1571008889439-8843bb39b2a5"],
  },
  "gym-fitness": {
    approved: ["gym", "weights", "workout", "athlete"],
    banned: ["gaming", "abstract"],
    environments: ["gym"],
    subjects: ["weights", "athlete"],
    photoStyles: ["fitness"],
    hero: ["1571019613454-829cb2de8382", "1517836357463-d25dfeac3438", "1534438327276-14e5300c3a48", "1583454110551-21f2a2b72b8e"],
    lifestyle: ["1517836357463-d25dfeac3438", "1534438327276-14e5300c3a48", "1571019613454-829cb2de8382"],
    products: ["1571019613454-829cb2de8382", "1517836357463-d25dfeac3438", "1534438327276-14e5300c3a48"],
  },
  dogs: {
    approved: ["dogs", "puppies", "pet owners", "collars", "toys", "grooming", "parks"],
    banned: ["gym", "abstract shapes", "cats only"],
    environments: ["park", "home", "grooming studio"],
    subjects: ["dog", "puppy", "collar", "toys", "owner"],
    photoStyles: ["pet lifestyle"],
    hero: [
      "158730019-474c3a6a2f5a",
      "1548199973-03cce0cbc710",
      "1516738901171-8eb4fc13bd20",
      "1530284520547-3ffa630fa651",
      "1583512603405-09989976d522",
      "1534361960057-19889d3627ae",
    ],
    lifestyle: [
      "1548199973-03cce0cbc710",
      "1530284520547-3ffa630fa651",
      "158730019-474c3a6a2f5a",
      "1516738901171-8eb4fc13bd20",
      "1583512603405-09989976d522",
      "1534361960057-19889d3627ae",
    ],
    products: [
      "158730019-474c3a6a2f5a",
      "1548199973-03cce0cbc710",
      "1583512603405-09989976d522",
      "1516738901171-8eb4fc13bd20",
      "1534361960057-19889d3627ae",
      "1530284520547-3ffa630fa651",
    ],
  },
  cats: {
    approved: ["cats", "kittens", "pet lifestyle"],
    banned: ["gym", "abstract"],
    environments: ["home"],
    subjects: ["cat", "kitten"],
    photoStyles: ["cozy pet"],
    hero: ["1450778869180-41d6031a2b0c", "1514881244717-49e8a9643f4c", "1518791841217-8f162f1e1131", "1533731099148-489b9a7d1a8e"],
    lifestyle: ["1450778869180-41d6031a2b0c", "1514881244717-49e8a9643f4c", "1518791841217-8f162f1e1131"],
    products: ["1450778869180-41d6031a2b0c", "1514881244717-49e8a9643f4c", "1518791841217-8f162f1e1131"],
  },
  fruit: FRUIT_LITERAL,
  produce: {
    ...FRUIT_LITERAL,
    approved: ["vegetables", "produce", "farm harvest", "farmers market", "organic food"],
    subjects: ["vegetables", "harvest", "farm box"],
  },
  flowers: {
    approved: ["flowers", "bouquets", "botanical"],
    banned: ["gaming", "abstract"],
    environments: ["garden", "studio"],
    subjects: ["bouquet", "roses"],
    photoStyles: ["botanical"],
    hero: ["1490759847868-88d4476a2101", "1462275646964-a0e3380e5e53", "1519378058454-4c037754bdbd", "1561181286-5df0a41f7b99"],
    lifestyle: ["1462275646964-a0e3380e5e53", "1519378058454-4c037754bdbd", "1490759847868-88d4476a2101"],
    products: ["1490759847868-88d4476a2101", "1462275646964-a0e3380e5e53", "1519378058454-4c037754bdbd"],
  },
  "fashion-apparel": {
    approved: ["fashion photography", "models", "clothing", "editorial shoots", "lookbook"],
    banned: ["gaming", "produce", "abstract"],
    environments: ["studio", "street", "runway"],
    subjects: ["model", "apparel", "accessories"],
    photoStyles: ["editorial fashion"],
    hero: ["1515886657613-9f3515b0c78f", "1483986768404-267d3f66a780", "1469334031218-e8a3771781f5", "1490481651871-ab68de25d43d"],
    lifestyle: ["1469334031218-e8a3771781f5", "1483986768404-267d3f66a780", "1515886657613-9f3515b0c78f"],
    products: ["1515886657613-9f3515b0c78f", "1483986768404-267d3f66a780", "1469334031218-e8a3771781f5"],
  },
  "luxury-retail": {
    approved: ["luxury products", "designer retail"],
    banned: ["gaming", "abstract"],
    environments: ["boutique"],
    subjects: ["luxury object"],
    photoStyles: ["quiet luxury"],
    hero: ["1515886657613-9f3515b0c78f", "1483986768404-267d3f66a780", "1490481651871-ab68de25d43d", "1469334031218-e8a3771781f5"],
    lifestyle: ["1483986768404-267d3f66a780", "1490481651871-ab68de25d43d", "1515886657613-9f3515b0c78f"],
    products: ["1469334031218-e8a3771781f5", "1483986768404-267d3f66a780", "1515886657613-9f3515b0c78f"],
  },
  esports: {
    approved: ["esports", "tournament", "gaming team"],
    banned: ["basketball", "fruit", "abstract"],
    environments: ["arena"],
    subjects: ["competitive player"],
    photoStyles: ["arena"],
    hero: ["1493711668535-e49d8a12619f", "1542751371-adc38448a05e", "1511511419751-e720554ff2ec"],
    lifestyle: ["1542751371-adc38448a05e", "1493711668535-e49d8a12619f", "1511511419751-e720554ff2ec"],
    products: ["1511511419751-e720554ff2ec", "1542751371-adc38448a05e", "1493711668535-e49d8a12619f"],
  },
  "video-games": {
    approved: ["video games", "controller", "gaming setup"],
    banned: ["basketball", "fruit"],
    environments: ["gaming desk"],
    subjects: ["controller", "headset"],
    photoStyles: ["gaming product"],
    hero: ["1542751371-adc38448a05e", "1511511419751-e720554ff2ec", "1552820728-8d192c2271a2"],
    lifestyle: ["1511511419751-e720554ff2ec", "1542751371-adc38448a05e", "1552820728-8d192c2271a2"],
    products: ["1511511419751-e720554ff2ec", "1542751371-adc38448a05e", "1552820728-8d192c2271a2"],
  },
  "music-artist": {
    approved: ["music studio", "concert", "vinyl", "live performance"],
    banned: ["abstract"],
    environments: ["studio", "stage"],
    subjects: ["instrument", "artist"],
    photoStyles: ["concert"],
    hero: ["1511379936477-cc88bdf6827e", "1493225457124-a3eb161ffa5f", "1516286737714-aa376389d5aa"],
    lifestyle: ["1493225457124-a3eb161ffa5f", "1516286737714-aa376389d5aa", "1511379936477-cc88bdf6827e"],
    products: ["1516286737714-aa376389d5aa", "1511379936477-cc88bdf6827e", "1493225457124-a3eb161ffa5f"],
  },
  "creator-media": {
    approved: ["creator studio", "camera", "community"],
    banned: ["abstract"],
    environments: ["studio"],
    subjects: ["creator", "camera"],
    photoStyles: ["creator"],
    hero: ["1611162616475-9bc9dcdc2a1a", "1492691527719-9d1e07256c48", "1616530947822-4b676653247e"],
    lifestyle: ["1492691527719-9d1e07256c48", "1616530947822-4b676653247e", "1611162616475-9bc9dcdc2a1a"],
    products: ["1611162616475-9bc9dcdc2a1a", "1492691527719-9d1e07256c48", "1616530947822-4b676653247e"],
  },
  "science-space": {
    approved: ["space", "laboratory", "research"],
    banned: ["fruit", "abstract blobs"],
    environments: ["lab", "space"],
    subjects: ["scientist", "cosmos"],
    photoStyles: ["cinematic science"],
    hero: ["1451187583691-34ca1684c9b6", "1446776811953-b4dadb1c7639", "1614726365727-4a44a21f5f9f"],
    lifestyle: ["1446776811953-b4dadb1c7639", "1614726365727-4a44a21f5f9f", "1451187583691-34ca1684c9b6"],
    products: ["1451187583691-34ca1684c9b6", "1446776811953-b4dadb1c7639", "1614726365727-4a44a21f5f9f"],
  },
  fintech: {
    approved: ["finance", "banking", "professional"],
    banned: ["fruit", "abstract"],
    environments: ["office", "city"],
    subjects: ["professional", "technology"],
    photoStyles: ["corporate"],
    hero: ["1551288049-bebda4e38f71", "1460925895917-afdab827c52f", "1553729459-efe14ef6055d"],
    lifestyle: ["1460925895917-afdab827c52f", "1553729459-efe14ef6055d", "1551288049-bebda4e38f71"],
    products: ["1551288049-bebda4e38f71", "1460925895917-afdab827c52f", "1553729459-efe14ef6055d"],
  },
  education: {
    approved: ["education", "students", "learning"],
    banned: ["abstract"],
    environments: ["classroom"],
    subjects: ["student", "books"],
    photoStyles: ["learning"],
    hero: ["1523240795612-9a054b0db644", "1503676260728-1c00da094a0b", "1434030216411-6b793f109b23"],
    lifestyle: ["1503676260728-1c00da094a0b", "1434030216411-6b793f109b23", "1523240795612-9a054b0db644"],
    products: ["1523240795612-9a054b0db644", "1503676260728-1c00da094a0b", "1434030216411-6b793f109b23"],
  },
  "wellness-ritual": {
    approved: ["wellness", "spa", "meditation"],
    banned: ["gaming", "abstract"],
    environments: ["spa"],
    subjects: ["ritual", "calm space"],
    photoStyles: ["calm"],
    hero: ["1544367567-0f2fcb009e0b", "1506126613408-eca07ce68773", "1512621776951-a57141f2eefd"],
    lifestyle: ["1506126613408-eca07ce68773", "1512621776951-a57141f2eefd", "1544367567-0f2fcb009e0b"],
    products: ["1544367567-0f2fcb009e0b", "1506126613408-eca07ce68773", "1512621776951-a57141f2eefd"],
  },
  healthcare: {
    approved: ["healthcare", "medical", "patient care"],
    banned: ["fashion runway", "abstract"],
    environments: ["clinic"],
    subjects: ["caregiver", "patient"],
    photoStyles: ["clinical"],
    hero: ["1576091160399-112ba8d25d1f", "1579684385127-1ef15d508118", "1631217868264-e5b165cc02ba"],
    lifestyle: ["1579684385127-1ef15d508118", "1631217868264-e5b165cc02ba", "1576091160399-112ba8d25d1f"],
    products: ["1576091160399-112ba8d25d1f", "1579684385127-1ef15d508118", "1631217868264-e5b165cc02ba"],
  },
  "saas-tool": {
    approved: ["software", "workspace", "team"],
    banned: ["fruit", "abstract shapes"],
    environments: ["office"],
    subjects: ["laptop", "team"],
    photoStyles: ["saas"],
    hero: ["1551434678-e076c223a692", "1498050108023-c5249f4df085", "1522071820081-009f0129c71c", "1600887297204-112d174d3b3e"],
    lifestyle: ["1498050108023-c5249f4df085", "1522071820081-009f0129c71c", "1551434678-e076c223a692"],
    products: ["1551434678-e076c223a692", "1498050108023-c5249f4df085", "1522071820081-009f0129c71c"],
  },
  "ecommerce-retail": {
    approved: ["product photography", "retail", "shopping"],
    banned: ["abstract"],
    environments: ["retail", "studio"],
    subjects: ["product", "merchandise"],
    photoStyles: ["retail"],
    hero: ["1441986300917-6466bd776357", "1472851294608-062f8241c779", "1523275335684-37898b6baf30"],
    lifestyle: ["1472851294608-062f8241c779", "1523275335684-37898b6baf30", "1441986300917-6466bd776357"],
    products: ["1523275335684-37898b6baf30", "1472851294608-062f8241c779", "1441986300917-6466bd776357"],
  },
  generic: {
    approved: ["product", "team", "workspace"],
    banned: ["abstract shapes", "random unrelated"],
    environments: ["studio"],
    subjects: ["product", "team"],
    photoStyles: ["modern"],
    hero: ["1551434678-e076c223a692", "1498050108023-c5249f4df085", "1522071820081-009f0129c71c"],
    lifestyle: ["1498050108023-c5249f4df085", "1522071820081-009f0129c71c", "1551434678-e076c223a692"],
    products: ["1551434678-e076c223a692", "1498050108023-c5249f4df085", "1522071820081-009f0129c71c"],
  },
};

/** Direction-specific literal photo subsets — each direction feels like a different studio */
type SlotPools = Partial<Record<ImageSlot, string[]>>;
type SecondaryPools = Partial<Record<SecondaryCategory, SlotPools>>;
type DirectionPools = Partial<Record<DirectionId, SecondaryPools>>;

const DIRECTION_LITERAL_POOLS: DirectionPools = {
  "luxury-editorial": {
    fruit: {
      hero: ["1540423133010-7117160ca44c", "1487700174473-bd5a8d0b4723", "1610837524703-040399967cf0", "1519996529221-4a0f8c4d7d6e"],
      lifestyle: ["1502749568464-9a18e3196a7a", "1540423133010-7117160ca44c", "1487700174473-bd5a8d0b4723"],
      product: ["1610837524703-040399967cf0", "1622595424935-535a5979a177", "1540423133010-7117160ca44c"],
    },
  },
  "premium-dark": {
    fruit: {
      hero: ["1540423133010-7117160ca44c", "1487700174473-bd5a8d0b4723", "1566385101042-f4671190a963", "1610837524703-040399967cf0"],
      lifestyle: ["1540423133010-7117160ca44c", "1502749568464-9a18e3196a7a", "1498837167922-ddd27545d399"],
      product: ["1622595424935-535a5979a177", "1563564126-d4d5a1629f0f", "1540423133010-7117160ca44c"],
    },
  },
  "cinematic-ai": {
    fruit: {
      hero: ["1502749568464-9a18e3196a7a", "1487700174473-bd5a8d0b4723", "1540423133010-7117160ca44c", "1519996529221-4a0f8c4d7d6e"],
      lifestyle: ["1502749568464-9a18e3196a7a", "1487700174473-bd5a8d0b4723", "1610837524703-040399967cf0"],
      product: ["1610837524703-040399967cf0", "1540423133010-7117160ca44c", "1622595424935-535a5979a177"],
    },
  },
  "genz-vibrant": {
    fruit: {
      hero: ["1464459320601-8db2bc1a6b7e", "145225367794-56f7e41b1257", "1619560669181-d72360947df1", "1610879246508-63206585852"],
      lifestyle: ["1464459320601-8db2bc1a6b7e", "145225367794-56f7e41b1257", "1498837167922-ddd27545d399", "1619560669181-d72360947df1"],
      product: ["1610879246508-63206585852", "1464459320601-8db2bc1a6b7e", "1563564126-d4d5a1629f0f"],
    },
  },
  "creator-playful": {
    fruit: {
      hero: ["145225367794-56f7e41b1257", "1619560669181-d72360947df1", "1464459320601-8db2bc1a6b7e", "1563564126-d4d5a1629f0f"],
      lifestyle: ["145225367794-56f7e41b1257", "1619560669181-d72360947df1", "1498837167922-ddd27545d399"],
      product: ["1563564126-d4d5a1629f0f", "145225367794-56f7e41b1257", "1610879246508-63206585852"],
    },
  },
  "bold-experimental": {
    fruit: {
      hero: ["1464459320601-8db2bc1a6b7e", "1610879246508-63206585852", "1619560669181-d72360947df1", "1519996529221-4a0f8c4d7d6e", "145225367794-56f7e41b1257"],
      lifestyle: ["1610879246508-63206585852", "1464459320601-8db2bc1a6b7e", "1563564126-d4d5a1629f0f", "145225367794-56f7e41b1257"],
      product: ["145225367794-56f7e41b1257", "1610879246508-63206585852", "1563564126-d4d5a1629f0f"],
    },
  },
  "minimal-clean": {
    fruit: {
      hero: ["1610879246508-63206585852", "1568702846-36c088f08209", "1587049352247-c34689e16604", "1610837524703-040399967cf0"],
      lifestyle: ["1587049352247-c34689e16604", "1568702846-36c088f08209", "1610879246508-63206585852"],
      product: ["1610837524703-040399967cf0", "1587049352247-c34689e16604", "1568702846-36c088f08209"],
    },
  },
  "apple-modern": {
    fruit: {
      hero: ["1587049352247-c34689e16604", "1568702846-36c088f08209", "1610879246508-63206585852", "1610837524703-040399967cf0"],
      lifestyle: ["1568702846-36c088f08209", "1587049352247-c34689e16604", "1610879246508-63206585852"],
      product: ["1610837524703-040399967cf0", "1568702846-36c088f08209", "1587049352247-c34689e16604"],
    },
  },
  "minimal-luxury": {
    fruit: {
      hero: ["1587049352247-c34689e16604", "1610837524703-040399967cf0", "1568702846-36c088f08209", "1622595424935-535a5979a177"],
      lifestyle: ["1610837524703-040399967cf0", "1587049352247-c34689e16604", "1502749568464-9a18e3196a7a"],
      product: ["1622595424935-535a5979a177", "1610837524703-040399967cf0", "1587049352247-c34689e16604"],
    },
  },
  orchestra: {
    fruit: {
      hero: ["1610837524703-040399967cf0", "1487700174473-bd5a8d0b4723", "1610879246508-63206585852", "1566385101042-f4671190a963"],
      lifestyle: ["1487700174473-bd5a8d0b4723", "1498837167922-ddd27545d399", "1610837524703-040399967cf0"],
      product: ["1610837524703-040399967cf0", "1563564126-d4d5a1629f0f", "1464459320601-8db2bc1a6b7e"],
    },
    dogs: {
      hero: ["158730019-474c3a6a2f5a", "1548199973-03cce0cbc710", "1516738901171-8eb4fc13bd20"],
      lifestyle: ["1530284520547-3ffa630fa651", "1583512603405-09989976d522", "1534361960057-19889d3627ae"],
      product: ["1583512603405-09989976d522", "158730019-474c3a6a2f5a", "1548199973-03cce0cbc710"],
    },
    basketball: {
      hero: ["1546519638-828a4eca42b7", "1574623452841-47d1422096b9", "1511407617-872519128c22"],
      lifestyle: ["1461896836932-ffe607005bea", "1577223533437-68b5977d51b8", "1551958219-4c546c4f992f"],
      product: ["1546519638-828a4eca42b7", "1574623452841-47d1422096b9", "1551958219-4c546c4f992f"],
    },
  },
  "creative-agency": {
    fruit: {
      hero: ["1464459320601-8db2bc1a6b7e", "1519996529221-4a0f8c4d7d6e", "1619560669181-d72360947df1", "1563564126-d4d5a1629f0f"],
      lifestyle: ["1464459320601-8db2bc1a6b7e", "1519996529221-4a0f8c4d7d6e", "145225367794-56f7e41b1257"],
      product: ["1563564126-d4d5a1629f0f", "1464459320601-8db2bc1a6b7e", "145225367794-56f7e41b1257"],
    },
  },
};

const DIRECTION_OFFSET: Partial<Record<DirectionId, number>> = {
  orchestra: 0,
  "minimal-clean": 7,
  "premium-dark": 13,
  "bold-experimental": 19,
  "luxury-editorial": 23,
  "fashion-ai": 23,
  "minimal-luxury": 29,
  "cinematic-ai": 31,
  "genz-vibrant": 37,
  "creative-agency": 41,
  "creator-playful": 43,
  "apple-modern": 47,
  "glass-futuristic": 53,
  "retro-tech": 59,
};

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return Math.abs(h);
}

export function getImageryMap(resolution: CategoryResolution): ImageryMap {
  return MAPS[resolution.secondary] ?? MAPS.generic;
}

export type ImageSlot = "hero" | "lifestyle" | "product";

function slotPool(map: ImageryMap, slot: ImageSlot): string[] {
  if (slot === "hero") return map.hero;
  if (slot === "lifestyle") return map.lifestyle;
  return map.products;
}

/** Merged pool: direction-specific literals first, then category literals — never abstract */
export function getLiteralPhotoPool(
  resolution: CategoryResolution,
  slot: ImageSlot,
  direction: DirectionId
): string[] {
  const map = getImageryMap(resolution);
  const base = slotPool(map, slot);
  const directionSlice = DIRECTION_LITERAL_POOLS[direction]?.[resolution.secondary]?.[slot];
  if (!directionSlice?.length) return [...new Set(base)];
  return [...new Set([...directionSlice, ...base])];
}

/** Select N unique literal photo IDs — direction + seed + index produce distinct sets per template */
export function selectPhotoIds(
  resolution: CategoryResolution,
  slot: ImageSlot,
  seed: string,
  direction: DirectionId,
  startIndex: number,
  count: number
): string[] {
  const pool = getLiteralPhotoPool(resolution, slot, direction);
  const dirOffset = DIRECTION_OFFSET[direction] ?? hashSeed(direction);
  const results: string[] = [];
  let step = 0;

  while (results.length < count && step < pool.length * 3) {
    const idx =
      (hashSeed(`${seed}:${resolution.secondary}:${direction}:${slot}:${startIndex}`) +
        dirOffset +
        step * 7 +
        startIndex * 11) %
      pool.length;
    const id = pool[idx];
    if (!results.includes(id)) results.push(id);
    step++;
  }

  return results.length ? results : pool.slice(0, count);
}

export function selectPhotoId(
  resolution: CategoryResolution,
  slot: ImageSlot,
  seed: string,
  direction: DirectionId,
  index: number
): string {
  return selectPhotoIds(resolution, slot, seed, direction, index, 1)[0];
}

/** Direction-specific Unsplash processing — different studios, different treatment */
export function directionImageParams(direction: DirectionId): string {
  if (direction === "minimal-clean" || direction === "apple-modern" || direction === "minimal-luxury") {
    return "&fit=crop&crop=entropy&w=1600&q=90&bright=5";
  }
  if (direction === "luxury-editorial" || direction === "fashion-ai") {
    return "&fit=crop&crop=focalpoint&fp-y=0.35&w=1600&q=90&sat=-10&con=10";
  }
  if (direction === "premium-dark" || direction === "cinematic-ai") {
    return "&fit=crop&crop=entropy&w=1600&q=90&sat=-25&bri=-8&con=15";
  }
  if (direction === "bold-experimental" || direction === "creative-agency") {
    return "&fit=crop&crop=focalpoint&fp-y=0.5&w=1400&q=88&sat=15&con=20";
  }
  if (direction === "genz-vibrant" || direction === "creator-playful") {
    return "&fit=crop&crop=focalpoint&fp-x=0.45&w=1400&q=88&sat=25&con=10";
  }
  if (direction === "glass-futuristic" || direction === "retro-tech") {
    return "&fit=crop&crop=entropy&w=1500&q=85&sat=10&bri=-5";
  }
  return "&fit=crop&crop=entropy&w=1500&q=88";
}

/** @deprecated use directionImageParams */
export function directionCropParams(direction: DirectionId): string {
  return directionImageParams(direction);
}

export function imageryCopyGuard(resolution: CategoryResolution): string {
  const map = getImageryMap(resolution);
  return `LITERAL imagery ONLY — show real ${map.subjects.join(", ")}. Never abstract shapes, circles, blobs, or symbolic geometry.
Approved: ${map.approved.join(", ")}
BANNED: ${map.banned.join(", ")}`;
}

export type SecondaryProduct = { name: string; price: string; imageIndex: number };

const SECONDARY_PRODUCTS: Partial<Record<SecondaryCategory, SecondaryProduct[][]>> = {
  basketball: [
    [
      { name: "Skills Training Plan", price: "$29/mo", imageIndex: 0 },
      { name: "Pro Ball Handling", price: "$48", imageIndex: 2 },
      { name: "Team Analytics", price: "$79/mo", imageIndex: 4 },
    ],
    [
      { name: "Shooting Workout Pack", price: "$39", imageIndex: 1 },
      { name: "Court Finder Pro", price: "$19/mo", imageIndex: 3 },
      { name: "Elite Sneaker Drop", price: "$120", imageIndex: 5 },
    ],
  ],
  dogs: [
    [
      { name: "Premium Collar", price: "$34", imageIndex: 0 },
      { name: "Grooming Kit", price: "$48", imageIndex: 2 },
      { name: "Organic Treat Box", price: "$29", imageIndex: 4 },
    ],
    [
      { name: "Adventure Leash", price: "$42", imageIndex: 1 },
      { name: "Monthly Toy Box", price: "$35/mo", imageIndex: 3 },
      { name: "Grooming Pass", price: "$59/mo", imageIndex: 5 },
    ],
  ],
  fruit: [
    [
      { name: "Seasonal Citrus Box", price: "$42", imageIndex: 0 },
      { name: "Cold-Pressed Orange Juice", price: "$18", imageIndex: 3 },
      { name: "Organic Berry Mix", price: "$28", imageIndex: 5 },
    ],
    [
      { name: "Apple Harvest Crate", price: "$38", imageIndex: 1 },
      { name: "Strawberry Smoothie Pack", price: "$24", imageIndex: 4 },
      { name: "Weekly Fruit Subscription", price: "$45/mo", imageIndex: 7 },
    ],
  ],
};

export function pickSecondaryProducts(resolution: CategoryResolution, seed: string, direction: DirectionId): SecondaryProduct[] {
  const brief: StartupBrief = {
    name: resolution.visualWorld.split("·")[0]?.trim() ?? "Startup",
    tagline: resolution.visualWorld,
    description: resolution.visualWorld,
    features: resolution.visualWorldKeywords,
    pricing: {
      summary: "",
      tiers: [
        { name: "A", price: "$1", detail: "" },
        { name: "B", price: "$2", detail: "" },
        { name: "C", price: "$3", detail: "" },
      ],
    },
  };
  return pickCategoryProducts(brief, resolution, seed, direction).map((p, i) => ({
    name: p.name,
    price: p.price,
    imageIndex: i,
  }));
}
