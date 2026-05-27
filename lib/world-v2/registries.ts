/**
 * Category-isolated image registries — ZERO shared pools between categories.
 */

import { buildUnsplashUrl } from "@/lib/curated-stock-photos";
import type { V2CategoryKey, V2ImageSlot } from "./types";

type RegistryEntry = { id: string; role: V2ImageSlot["role"]; alt: string };

type CategoryRegistry = {
  category: V2CategoryKey;
  accents: string[];
  mesh: { from: string; to: string };
  images: RegistryEntry[];
};

const REGISTRIES: Record<V2CategoryKey, CategoryRegistry> = {
  fitness: {
    category: "fitness",
    accents: ["#ef4444", "#f97316", "#dc2626", "#ea580c"],
    mesh: { from: "#fff7ed", to: "#fed7aa" },
    images: [
      // Basketball-specific IDs moved to sports registry — no cross-category duplicates
      { id: "1571019613454-1cb2f99b2d8b", role: "hero", alt: "Athlete training in gym" },
      { id: "1552674020-e9e9edfa3e0e", role: "hero", alt: "Fitness workout intensity" },
      { id: "1517841905240-472988babdf9", role: "feature", alt: "Athletic performance focus" },
      { id: "1551958219-ac7e8c2a0a0a", role: "detail", alt: "Training gear detail" },
      { id: "1576678926808-4b39654d5990", role: "feature", alt: "Team training huddle" },
      { id: "1472099645785-5658abf4ff4e", role: "editorial", alt: "Coaching sideline" },
      { id: "1571909809596-4117b7f4465e", role: "detail", alt: "Equipment macro" },
      { id: "1461896836932-ffe607005bea", role: "ambient", alt: "Arena energy" },
      { id: "1599058945006-7009db1e36fd", role: "editorial", alt: "High intensity gym session" },
      { id: "1604480133090-94e1a3e0a7a4", role: "feature", alt: "Strength training precision" },
      { id: "1526506118085-60ce8714f8c5", role: "ambient", alt: "Gym atmosphere" },
    ],
  },
  floral: {
    category: "floral",
    accents: ["#6b9080", "#52796f", "#a4c3b2", "#354f52"],
    mesh: { from: "#e8f3ef", to: "#cce3de" },
    images: [
      { id: "1490759847868-88d4476a2101", role: "hero", alt: "Luxury rose bouquet" },
      { id: "1462275646964-a0e3380e5e53", role: "hero", alt: "Botanical floral arrangement" },
      { id: "1519378058454-4c037754bdbd", role: "editorial", alt: "Studio floral editorial" },
      { id: "1561181286-5df0a41f7b99", role: "feature", alt: "Peony arrangement detail" },
      { id: "1525310072747-51e63c6e6c83", role: "ambient", alt: "Soft botanical window light" },
      { id: "1508610048994-1f5a6c8fbd57", role: "feature", alt: "Delicate spring blooms" },
      { id: "1457296898958-3831bab6b5a7", role: "editorial", alt: "Garden floral arrangement" },
      { id: "1544723501-3eb7d72ee0a6", role: "detail", alt: "Macro petal texture" },
    ],
  },
  finance: {
    category: "finance",
    accents: ["#2563eb", "#1e40af", "#3b82f6", "#059669"],
    mesh: { from: "#eff6ff", to: "#dbeafe" },
    images: [
      // "1556761175-5973dc0f32bd" removed — same ID used in old creator registry (cross-contamination)
      { id: "1551288049-bebda4e38f71", role: "hero", alt: "Financial analytics dashboard" },
      { id: "1460925895917-afdab827c52f", role: "feature", alt: "Data visualization charts" },
      { id: "1579624475797-6d2c9c0d2c0e", role: "editorial", alt: "Professional finance workspace" },
      { id: "1563013544-824ae1b704d3", role: "detail", alt: "Payment interface detail" },
      { id: "1554224155-6726b3ff858f", role: "ambient", alt: "Modern office atmosphere" },
      { id: "1553877522-43269d4ea984", role: "editorial", alt: "Growth metrics overview" },
      { id: "1590283603385-50f0d3c26001", role: "feature", alt: "Fintech executive workspace" },
      { id: "1611974789855-9c702a4b0d53", role: "hero", alt: "Financial technology interface" },
      { id: "1624953587793-e1f49ba1862e", role: "ambient", alt: "Banking app modern design" },
    ],
  },
  fashion: {
    category: "fashion",
    accents: ["#be185d", "#78716c", "#0f172a", "#a855f7"],
    mesh: { from: "#fdf2f8", to: "#fce7f3" },
    images: [
      { id: "1490481651871-ab68de25d43d", role: "hero", alt: "Fashion editorial portrait" },
      { id: "1515886657611-9f3515b0c78f", role: "editorial", alt: "Runway style editorial" },
      { id: "1529139578956-16a0843f4c05", role: "feature", alt: "Streetwear detail" },
      { id: "1483986760166-99e0e49b0a0c", role: "detail", alt: "Fabric texture macro" },
      { id: "1509631179640-318270371d9b", role: "ambient", alt: "Studio fashion atmosphere" },
      { id: "1469334031218-e382a71b716b", role: "feature", alt: "Collection lookbook" },
    ],
  },
  food: {
    category: "food",
    accents: ["#65a30d", "#ea580c", "#c2410c", "#ca8a04"],
    mesh: { from: "#fef9c3", to: "#fde68a" },
    images: [
      // Only IDs from VERIFIED_FRUIT_PHOTO_IDS — "Breakfast spread" removed (too ambiguous)
      { id: "1732959409019-b5979266d02d", role: "hero", alt: "Fresh citrus market display" },
      { id: "1498579397066-22750a3cb424", role: "hero", alt: "Produce harvest display" },
      { id: "1565299624946-b28f40a0ae38", role: "editorial", alt: "Farm fresh produce assortment" },
      { id: "1487376480913-24046456a727", role: "feature", alt: "Citrus flat lay editorial" },
      { id: "1464965911861-746a04b4bca6", role: "detail", alt: "Berry harvest macro" },
      { id: "1512621776951-a57141f2eefd", role: "detail", alt: "Citrus slice close-up" },
      { id: "1542838132-92c53300491e", role: "ambient", alt: "Morning fruit bowl arrangement" },
      { id: "1416879595882-3373a0480b5b", role: "editorial", alt: "Colorful fresh produce market" },
      { id: "1511546865855-fe4788edf4b6", role: "feature", alt: "Artisan harvest selection" },
      { id: "1535227798054-e4373ef3795a", role: "ambient", alt: "Sunlit fruit market atmosphere" },
      { id: "1558618666-fcd25c85cd64", role: "hero", alt: "Fresh market citrus abundance" },
      { id: "1560761098-21f5722ecb14", role: "detail", alt: "Vibrant produce macro close-up" },
      { id: "1580691155297-c6dfa3ca61c4", role: "editorial", alt: "Harvest abundance farm editorial" },
      { id: "1610832958506-aa56368176cf", role: "hero", alt: "Organic farm market display" },
      { id: "1619566636858-adf3ef46400b", role: "ambient", alt: "Farm table produce spread" },
      { id: "1628689469838-524a4a973b8e", role: "editorial", alt: "Sunlit citrus still life" },
      { id: "1665589048355-579bc80169d1", role: "feature", alt: "Fresh harvest photography" },
    ],
  },
  saas: {
    category: "saas",
    accents: ["#2563eb", "#7c3aed", "#0891b2", "#0ea5e9"],
    mesh: { from: "#f0f9ff", to: "#e0e7ff" },
    images: [
      { id: "1531297484001-80022131f5a1", role: "hero", alt: "Dark tech workspace cinematic" },
      { id: "1488190211105-8b0e65b80b4e", role: "hero", alt: "Focused developer workstation" },
      { id: "1461749236054-2eefbf4f4c66", role: "editorial", alt: "Code on screen close-up" },
      { id: "1504384308090-c5d1a93ba1ed", role: "feature", alt: "Startup team workspace" },
      { id: "1496181133206-80ce9b88a853", role: "feature", alt: "Laptop screen glow workspace" },
      { id: "1517430816741-1ae6f76c43b5", role: "detail", alt: "Programmer deep in flow" },
      { id: "1542744094-24638eff58bb", role: "ambient", alt: "Dark creative workstation" },
      { id: "1573496359142-b8d87734a5a2", role: "editorial", alt: "Tech product development" },
      { id: "1603366615917-79610274e3e3", role: "feature", alt: "Modern team collaboration" },
      { id: "1586953208448-b90a07a15695", role: "ambient", alt: "Minimal desk setup" },
      { id: "1519389950473-47ba0277781c", role: "hero", alt: "Developer with laptop morning" },
      { id: "1498758536662-35b82cd15e29", role: "detail", alt: "Focused workspace laptop" },
    ],
  },
  wellness: {
    category: "wellness",
    accents: ["#059669", "#0d9488", "#6366f1", "#84cc16"],
    mesh: { from: "#ecfdf5", to: "#d1fae5" },
    images: [
      { id: "1506126613408-eca07ce68773", role: "hero", alt: "Meditation retreat in nature" },
      { id: "1544367567-0f2fcb009e68", role: "feature", alt: "Yoga wellness morning practice" },
      { id: "1515377905704-8a1396ce2f9e", role: "ambient", alt: "Calm spa sanctuary atmosphere" },
      { id: "1540555705-8a2b5a96bc46", role: "editorial", alt: "Wellness retreat landscape" },
      { id: "1491555103944-7c647fd857e6", role: "hero", alt: "Mindfulness yoga outdoor" },
      { id: "1536623975707-c4b3b2af565d", role: "editorial", alt: "Serene meditation space" },
      { id: "1552196563-2338b1e09048", role: "feature", alt: "Spa wellness treatment" },
      { id: "1531685250863-d9c4ec30c2cd", role: "ambient", alt: "Calm nature wellness" },
    ],
  },
  sports: {
    category: "sports",
    accents: ["#2563eb", "#ea580c", "#1e40af", "#dc2626"],
    mesh: { from: "#eff6ff", to: "#dbeafe" },
    images: [
      // Athlete training moved to fitness only — sports gets arena/court/game-specific IDs
      { id: "1574623452841-47d1422096b9", role: "hero", alt: "Basketball court arena cinematic" },
      { id: "1546519638-828a4eca42b7", role: "editorial", alt: "Basketball game action" },
      { id: "1511407617-872519128c22", role: "ambient", alt: "Court hardwood flooring" },
      { id: "1577223533437-68b5977d51b8", role: "feature", alt: "Sports analytics scoreboard" },
      { id: "1552318965-81f0f6c3de63", role: "hero", alt: "Stadium arena night atmosphere" },
      { id: "1517649763962-0c623066013b", role: "editorial", alt: "Sports team strategy" },
      { id: "1535131323-cf9c1d58d86f", role: "feature", alt: "Athletic performance data" },
    ],
  },
  travel: {
    category: "travel",
    accents: ["#0284c7", "#0891b2", "#f59e0b", "#0f766e"],
    mesh: { from: "#f0fdfa", to: "#ccfbf1" },
    images: [
      { id: "1501785888141-09822f0d2a03", role: "hero", alt: "Travel destination panoramic vista" },
      { id: "1469859678122-406a0d8c126f", role: "editorial", alt: "Adventure landscape journey" },
      { id: "1476514529935-07be3d397ebf", role: "feature", alt: "Luxury travel destination escape" },
      { id: "1488646953012-85ce44e25828", role: "ambient", alt: "Golden hour journey light" },
      { id: "1506812574058-fc3877c90a8d", role: "hero", alt: "Cinematic travel landscape" },
      { id: "1507003211169-0a1dd7228f2d", role: "editorial", alt: "Wanderlust destination editorial" },
      { id: "1452421822248-d4c2b47f0c81", role: "feature", alt: "Hotel destination atmosphere" },
      { id: "1530521954074-e0a103ceff5e", role: "ambient", alt: "Travel horizon golden light" },
    ],
  },
  home: {
    category: "home",
    accents: ["#78716c", "#a8a29e", "#92400e", "#57534e"],
    mesh: { from: "#fafaf9", to: "#e7e5e4" },
    images: [
      { id: "1618221195710-dd6b41faaea6", role: "hero", alt: "Interior living room editorial" },
      { id: "1616486332812-6d6750edf117", role: "feature", alt: "Modern furniture detail" },
      { id: "1615529328331-f8913977a3f5", role: "editorial", alt: "Cozy home interior atmosphere" },
      { id: "1615876307210-2f571e3909ea", role: "ambient", alt: "Warm interior natural light" },
      { id: "1600210492486-724a5b4f74d2", role: "hero", alt: "Modern living space design" },
      { id: "1586023492125-27272f1563bd", role: "editorial", alt: "Scandinavian home interior" },
      { id: "1555041469-db74088f8097", role: "feature", alt: "Contemporary furniture living" },
      { id: "1560448806-e78e3e06c9e5", role: "ambient", alt: "Warm home interior ambiance" },
    ],
  },
  education: {
    category: "education",
    accents: ["#6366f1", "#2563eb", "#7c3aed", "#0ea5e9"],
    mesh: { from: "#eef2ff", to: "#e0e7ff" },
    images: [
      { id: "1523240795610-84a872fd2e3d", role: "hero", alt: "Student learning focused study" },
      { id: "1503676260728-1c00da094a0b", role: "feature", alt: "Education workspace desk" },
      { id: "1434030216411-6b793f2a8257", role: "editorial", alt: "University campus atmosphere" },
      { id: "1524178232363-cf187dbb9b90", role: "ambient", alt: "Library study environment" },
      { id: "1522202176988-66273c1fd9a4", role: "hero", alt: "Students collaborative learning" },
      { id: "1427556149-5c38e8d9b7c3", role: "editorial", alt: "Digital learning workspace" },
      { id: "1456406644174-8ddd4cd52a06", role: "feature", alt: "Academic knowledge discovery" },
      { id: "1580582932707-520afc5f3c8b", role: "ambient", alt: "Campus education atmosphere" },
    ],
  },
  health: {
    category: "health",
    accents: ["#0284c7", "#059669", "#6366f1", "#0d9488"],
    mesh: { from: "#f0fdfa", to: "#ccfbf1" },
    images: [
      { id: "1576091160399-112ba8d25d1f", role: "hero", alt: "Healthcare professional compassionate care" },
      { id: "1579684385127-15fb6a743a28", role: "feature", alt: "Medical technology innovation" },
      { id: "1559757175-0eb30b788c9c", role: "editorial", alt: "Clinical environment professional" },
      { id: "1584515937757-775e85b1b4c4", role: "ambient", alt: "Compassionate healthcare atmosphere" },
      { id: "1551190822-a9333d879b1f", role: "hero", alt: "Doctor patient consultation" },
      { id: "1532938911079-1346d97d905a", role: "editorial", alt: "Medical research laboratory" },
      { id: "1559839914-17aae19cec71", role: "feature", alt: "Health technology device" },
      { id: "1587854692152-cbe660dbde88", role: "ambient", alt: "Clinic healing environment" },
    ],
  },
  creator: {
    category: "creator",
    accents: ["#a855f7", "#ec4899", "#f97316", "#6366f1"],
    mesh: { from: "#fdf4ff", to: "#fae8ff" },
    images: [
      // Removed "1556761175-5973dc0f32bd" — same ID used in finance registry (cross-contamination)
      { id: "1611162616475-24b06b280874", role: "hero", alt: "Creator studio professional setup" },
      { id: "1611220235120-9a4840c126a0", role: "editorial", alt: "Creator analytics dashboard" },
      { id: "1516325978725-50f385173281", role: "ambient", alt: "Creative studio workspace" },
      { id: "1598488035343-3e79de7e8a9c", role: "feature", alt: "Content creator filming setup" },
      { id: "1559028012-181c8a8a8a8a", role: "hero", alt: "Podcast recording studio" },
      { id: "1580894732444-8ecbd2af9b9c", role: "editorial", alt: "Influencer creative workflow" },
      { id: "1612459966-c4e4f8e6a17c", role: "feature", alt: "Creator tech setup workspace" },
      { id: "1614624235073-5f9745ffa5ae", role: "ambient", alt: "Ring light studio creator" },
    ],
  },
  music: {
    category: "music",
    accents: ["#7c3aed", "#4f46e5", "#a855f7", "#06b6d4"],
    mesh: { from: "#0d0a1f", to: "#1a1040" },
    images: [
      { id: "1493225457124-a3eb161ffa5f", role: "hero", alt: "Concert and music editorial cinematic" },
      { id: "1510915361894-db8d60106cb1", role: "hero", alt: "Stage performance dramatic light" },
      { id: "1493225457124-a3eb161ffa5f", role: "editorial", alt: "Headphones music focus" },
      { id: "1571330735066-03aaa9429d89", role: "feature", alt: "DJ production studio" },
      { id: "1528360983277-13d401cdc186", role: "ambient", alt: "Recording studio atmosphere" },
      { id: "1516223725307-6f76b9ec8742", role: "detail", alt: "Stage lights dramatic" },
      { id: "1459749411175-04bf5292ceea", role: "feature", alt: "Piano musician performance" },
      { id: "1511379938547-c1f69419868d", role: "editorial", alt: "Guitar strings detail" },
    ],
  },
  science: {
    category: "science",
    accents: ["#0891b2", "#06b6d4", "#3b82f6", "#0284c7"],
    mesh: { from: "#020817", to: "#0a1628" },
    images: [
      { id: "1462331940025-496dfbfc7564", role: "hero", alt: "Space nebula cinematic" },
      { id: "1446776811953-b23d57bd21d3", role: "hero", alt: "Observatory telescope night" },
      { id: "1614728423169-3f65fd722b7e", role: "editorial", alt: "Clean lab environment" },
      { id: "1507413545067-0f35e9b3c487", role: "feature", alt: "Research workspace precision" },
      { id: "1532094349884-32f4e6ae2498", role: "ambient", alt: "Satellite dish technology" },
      { id: "1564053489775-b09cf6e3a7dc", role: "detail", alt: "Microscope scientific detail" },
      { id: "1614726365723-8b30ed56f2ec", role: "feature", alt: "Data visualization science" },
      { id: "1582719508461-905c673771f7", role: "editorial", alt: "Scientific discovery aesthetic" },
    ],
  },
};

export function getRegistry(category: V2CategoryKey): CategoryRegistry {
  return REGISTRIES[category];
}

export function toImageSlot(entry: RegistryEntry, width = 1400, height?: number): V2ImageSlot {
  const h = height ?? (entry.role === "hero" ? 900 : entry.role === "detail" ? 800 : 1000);
  return {
    id: entry.id,
    url: buildUnsplashUrl(entry.id, width, h),
    alt: entry.alt,
    role: entry.role,
  };
}

export function listRegistryImages(category: V2CategoryKey): V2ImageSlot[] {
  return getRegistry(category).images.map((e) => toImageSlot(e));
}
