import type { V2SectionType } from "@/lib/world-v2/types";

export type LayoutArchetype =
  | "editorial-dominant"   // text and atmosphere lead; image supports
  | "product-forward"      // interface or product object is the primary visual argument
  | "kinetic-statement";   // motion and scale carry the brand energy

export type FoundationMotion = {
  enter: "fade-up" | "fade" | "slide-up" | "reveal";
  duration: number;       // seconds
  stagger: number;        // seconds between children
  scroll: "drift" | "reveal" | "parallax" | "float";
};

export type FoundationSpacing = {
  sectionGap: number;     // px between sections
  contentMax: number;     // px max-width of content column
  rhythm: number;         // base spacing unit (px) — all internal gaps are multiples
};

export type ContentSlot = {
  key: string;
  description: string;
  maxWords: number;
  required: boolean;
};

export type Foundation = {
  id: string;
  name: string;
  bestFor: string[];       // signal keywords for selection scoring
  layoutArchetype: LayoutArchetype;
  typographyPersonality: "editorial-serif" | "bold-sans" | "precision-mono" | "modern-sans";
  lightingModel: string;  // natural-language description for Flux anchoring
  palette: {
    background: string;
    foreground: string;
    accentColor: string;
    meshFrom: string;
    meshTo: string;
  };
  motion: FoundationMotion;
  spacing: FoundationSpacing;
  sectionSequence: V2SectionType[];
  contentSlots: Record<V2SectionType, ContentSlot[]>;
  /** When set, selects the standalone Foundation component renderer instead of GeneratedWorldV2 */
  componentId?: "foundation-1";
};
