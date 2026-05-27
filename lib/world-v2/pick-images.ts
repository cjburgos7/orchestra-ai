import type { StartupBrief } from "@/lib/types/startup";
import type { MotionProfile } from "@/lib/types/startup";
import type { V2CategoryKey, V2ImageSlot, V2Section } from "./types";
import { getRegistry, toImageSlot } from "./registries";
import {
  retrieveSemanticImages,
  countRejected,
  type RetrievalPick,
} from "./semantic-retrieval";

type SectionDraft = {
  id: string;
  type: V2Section["type"];
  heightVh: number;
  motion: V2Section["motion"];
  density: V2Section["density"];
  featureIndex?: number;
  imageRoles: V2ImageSlot["role"][];
};

export type SectionImageAssignment = {
  sections: V2Section[];
  retrievalPicks: RetrievalPick[];
  rejectedCount: number;
};

/** Scene-level semantic retrieval — aesthetic scoring, strict category purity */
export function assignSectionImages(
  category: V2CategoryKey,
  brief: StartupBrief,
  seed: string,
  variantMotion: MotionProfile,
  sections: SectionDraft[]
): SectionImageAssignment {
  const used = new Set<string>();
  const retrievalPicks: RetrievalPick[] = [];

  const pickForRoles = (roles: V2ImageSlot["role"][], salt: string): V2ImageSlot[] => {
    const imgs: V2ImageSlot[] = [];
    for (const role of roles) {
      const batch = retrieveSemanticImages(
        category,
        brief,
        `${seed}:${salt}:${role}`,
        role,
        1,
        used,
        variantMotion,
        retrievalPicks
      );
      if (batch[0]) {
        imgs.push(batch[0]);
        continue;
      }

      // Last resort: category registry only (never cross-category)
      // Try exact role first, then adjacent roles, then any unused image
      const ADJACENT: Record<string, string[]> = {
        hero: ["editorial", "feature"],
        editorial: ["hero", "feature"],
        feature: ["editorial", "ambient", "hero"],
        ambient: ["feature", "detail"],
        detail: ["ambient", "feature"],
      };
      const allImages = getRegistry(category).images;
      const registry =
        allImages.find((e) => e.role === role && !used.has(e.id)) ??
        (ADJACENT[role] ?? []).reduce<typeof allImages[number] | undefined>(
          (found, r) => found ?? allImages.find((e) => e.role === r && !used.has(e.id)),
          undefined
        ) ??
        allImages.find((e) => !used.has(e.id));
      if (registry) {
        used.add(registry.id);
        imgs.push(toImageSlot(registry));
      }
    }
    return imgs;
  };

  const built = sections.map((s, i) => ({
    id: s.id,
    type: s.type,
    heightVh: s.heightVh,
    motion: s.motion,
    density: s.density,
    featureIndex: s.featureIndex,
    images: pickForRoles(s.imageRoles, `sec-${i}`),
  }));

  const rejectedCount = countRejected(category, brief, seed, variantMotion);

  return { sections: built, retrievalPicks, rejectedCount };
}
