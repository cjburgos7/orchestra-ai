/**
 * Role-based image architecture — strict pools, no flat mixed arrays.
 */

export type ImageRole =
  | "hero"
  | "product"
  | "editorial"
  | "ambient"
  | "macro"
  | "background"
  | "lifestyle"
  | "motion"
  | "texture";

export type ImageOrientation = "portrait" | "landscape" | "square";

export interface CategorizedImage {
  id: string;
  url: string;
  category: string;
  role: ImageRole;
  tags: string[];
  orientation: ImageOrientation;
  mood: string[];
  source: string;
  /** Dominant color hint for similarity scoring (hex without #) */
  dominantColor?: string;
  /** Composition hint: wide | tight | overhead | detail */
  composition?: string;
}

export interface CategoryImageRegistry {
  hero: CategorizedImage[];
  product: CategorizedImage[];
  editorial: CategorizedImage[];
  ambient: CategorizedImage[];
  macro: CategorizedImage[];
  background: CategorizedImage[];
  lifestyle: CategorizedImage[];
  motion: CategorizedImage[];
  texture: CategorizedImage[];
}

export type RegistryId = "fruit" | "basketball-analytics" | "sports-athletics" | "pets";

export type StorySection =
  | "hero"
  | "products"
  | "ingredients"
  | "social-proof"
  | "editorial"
  | "lifestyle"
  | "cta";

export interface StoryBeat {
  section: StorySection;
  role: ImageRole;
  label: string;
}

export interface DirectionVisualRules {
  id: string;
  preferredRoles: ImageRole[];
  preferredMood: string[];
  saturation: number;
  contrast: number;
  spacingStyle: "airy" | "balanced" | "dense" | "layered";
  compositionStyle: "cinematic" | "isolated" | "collage" | "magazine" | "dashboard";
}

export interface LayoutDensityRules {
  minVisualCoverage: number;
  maxEmptyVerticalSpace: number;
  sectionSpacingScale: number;
}

export interface MotionLayer {
  type: "video" | "gradient" | "particle" | "parallax";
  intensity: number;
}

export interface ArtDirectedImageryMeta {
  registryId: RegistryId;
  storyFlow: StoryBeat[];
  directionRules: DirectionVisualRules;
  densityRules: LayoutDensityRules;
  motionLayers: MotionLayer[];
  selectedImageIds: string[];
  /** Dev diagnostics — full slot pick trace */
  pipelineTrace?: import("@/lib/pipeline-trace").PipelineTrace;
}
