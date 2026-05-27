"use client";

import { useMemo } from "react";
import type { DirectionId, StartupBrief } from "@/lib/types/startup";
import { buildStartupWorld } from "@/lib/orchestration/world-pipeline";
import {
  createWorldDNA,
  toDirectionKey,
  briefToRawInput,
  imagesFromImagerySet,
} from "@/lib/world-intelligence";
import { ThumbnailCard } from "./ThumbnailCompositor";

type Props = {
  direction: DirectionId;
  brief: StartupBrief;
  seed: string;
  isSelected: boolean;
  onSelect: () => void;
  assembled: boolean;
};

/** Direction preview card — uses ThumbnailCompositor (replaces DirectionPreviewEngine) */
export default function DirectionThumbnailCard({
  direction,
  brief,
  seed,
  isSelected,
  onSelect,
  assembled,
}: Props) {
  const dna = useMemo(
    () => createWorldDNA(brief.name, briefToRawInput(brief), `${seed}:${direction}`),
    [brief, seed, direction]
  );

  const dirKey = toDirectionKey(direction);

  const images = useMemo(() => {
    if (!assembled) return {};
    const world = buildStartupWorld(brief, seed, direction);
    return imagesFromImagerySet(world.imagery);
  }, [assembled, brief, seed, direction]);

  return (
    <div className="relative w-full cursor-pointer" onClick={onSelect} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onSelect()}>
      <ThumbnailCard
        dna={dna}
        direction={dirKey}
        images={images}
        isSelected={isSelected}
        onSelect={onSelect}
        width={300}
        height={280}
      />
    </div>
  );
}
