"use client";

import type { DirectionId, StartupBrief, WildcardDirectionId } from "@/lib/types/startup";
import { isWildcardDirection } from "@/lib/orchestration/wildcards";
import DirectionPreviewEngine from "./DirectionPreviewEngine";

type MockProps = {
  brief: StartupBrief;
  slug: string;
  assembled: boolean;
  variant: WildcardDirectionId;
  seed?: string;
};

/** @deprecated use DirectionPreviewEngine directly */
export function WildcardDirectionMock({ variant, brief, slug, assembled, seed = brief.name }: MockProps) {
  return (
    <DirectionPreviewEngine
      direction={variant}
      brief={brief}
      seed={seed}
      slug={slug}
      assembled={assembled}
    />
  );
}

export function isWildcardId(id: DirectionId): id is WildcardDirectionId {
  return isWildcardDirection(id);
}
