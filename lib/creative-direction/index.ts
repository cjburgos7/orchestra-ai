export {
  compileVisualDNA,
  CREATIVE_CONCEPTS,
  resolveConceptKey,
} from "./engine";

export type {
  ConceptKey,
  CreativeConcept,
  DensityBeat,
  VisualDNA,
} from "./engine";

export { buildCreativeDirection } from "./creative-direction-bridge";

export {
  buildPremiumDarkCreativeDirection,
  creativeMotionProfile,
} from "./premium-dark-bridge";

export { buildOrchestraCreativeDirection } from "./orchestra-bridge";

export type { CreativeDirectionPackage } from "./premium-dark-bridge";

export {
  resolveCreativeVariant,
  CONCEPT_ROTATION_POOLS,
  listConceptPool,
} from "./concept-rotation";

export type { ConceptRotationEntry, ResolvedCreativeVariant } from "./concept-rotation";

export {
  heroAlignClass,
  heroContentMaxWidth,
  heroMinVhFromDNA,
  heroTextAlign,
  pacingForSection,
  sectionEnterDurationMs,
  sectionIndexForId,
  sectionTransition,
} from "./apply-premium-dark";
