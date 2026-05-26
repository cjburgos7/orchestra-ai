/**
 * Stable image slot definitions — each slot requests imagery differently.
 */

export type ImageSlot =
  | "hero"
  | "feature"
  | "gallery"
  | "ambient"
  | "product"
  | "thumbnail";

export type ImageryPool = "primary" | "secondary" | "ambient";

export type SlotPriority =
  | "cinematic"
  | "object"
  | "texture"
  | "ecommerce"
  | "preview";

export type SlotConfig = {
  /** Which WorldDNA imagery arrays to pull nouns from */
  sourcePools: ImageryPool[];
  /** Photographic intent appended to every query for this slot */
  querySuffix: string;
  defaultWidth: number;
  defaultHeight: number;
  priority: SlotPriority;
};

export const IMAGE_SLOT_CONFIG: Record<ImageSlot, SlotConfig> = {
  hero: {
    sourcePools: ["primary", "ambient"],
    querySuffix: "cinematic editorial photography high quality composition",
    defaultWidth: 1600,
    defaultHeight: 900,
    priority: "cinematic",
  },
  feature: {
    sourcePools: ["primary", "secondary"],
    querySuffix: "detailed lifestyle editorial photography",
    defaultWidth: 1200,
    defaultHeight: 800,
    priority: "cinematic",
  },
  gallery: {
    sourcePools: ["primary", "secondary", "ambient"],
    querySuffix: "photography gallery composition",
    defaultWidth: 1000,
    defaultHeight: 1000,
    priority: "cinematic",
  },
  ambient: {
    sourcePools: ["ambient", "secondary"],
    querySuffix: "texture detail lifestyle background photography",
    defaultWidth: 1400,
    defaultHeight: 900,
    priority: "texture",
  },
  product: {
    sourcePools: ["secondary", "primary"],
    querySuffix: "object focused premium product photography ecommerce",
    defaultWidth: 800,
    defaultHeight: 1000,
    priority: "ecommerce",
  },
  thumbnail: {
    sourcePools: ["primary", "secondary"],
    querySuffix: "startup brand preview photography composition",
    defaultWidth: 800,
    defaultHeight: 600,
    priority: "preview",
  },
};

export const ALL_IMAGE_SLOTS: ImageSlot[] = [
  "hero",
  "feature",
  "gallery",
  "ambient",
  "product",
  "thumbnail",
];
