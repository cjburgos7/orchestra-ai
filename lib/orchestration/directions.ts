import type { CoreDirectionId, DirectionId } from "@/lib/types/startup";
import { getWildcardMeta, isWildcardDirection } from "@/lib/orchestration/wildcards";

export type DirectionMeta = {
  id: DirectionId;
  label: string;
  tagline: string;
  accent: string;
  isWildcard?: boolean;
};

export const CORE_DIRECTIONS: DirectionMeta[] = [
  {
    id: "orchestra",
    label: "Orchestra Style",
    tagline: "Calm, premium, trustworthy SaaS",
    accent: "border-blue-100 hover:border-blue-200",
  },
  {
    id: "premium-dark",
    label: "Premium Dark",
    tagline: "Luxury AI · cinematic contrast",
    accent: "border-slate-700 hover:border-slate-600",
  },
  {
    id: "bold-experimental",
    label: "Bold Experimental",
    tagline: "Breakout energy · expressive layout",
    accent: "border-orange-200 hover:border-orange-300",
  },
  {
    id: "minimal-clean",
    label: "Minimal Clean",
    tagline: "Notion-like · quiet productivity",
    accent: "border-slate-200 hover:border-slate-300",
  },
];

/** @deprecated use CORE_DIRECTIONS */
export const DIRECTIONS = CORE_DIRECTIONS;

export function getDirectionLabel(id: DirectionId): string {
  const core = CORE_DIRECTIONS.find((d) => d.id === id);
  if (core) return core.label;
  if (isWildcardDirection(id)) return getWildcardMeta(id)?.label ?? id;
  return id;
}

export function getDirectionMeta(id: DirectionId): DirectionMeta {
  const core = CORE_DIRECTIONS.find((d) => d.id === id);
  if (core) return core;
  const wild = isWildcardDirection(id) ? getWildcardMeta(id) : undefined;
  if (wild) return { ...wild, isWildcard: true };
  return CORE_DIRECTIONS[0];
}

export function buildDirectionOptions(wildcardIds: DirectionId[]): DirectionMeta[] {
  const wildcards = wildcardIds
    .filter(isWildcardDirection)
    .map((id) => {
      const m = getWildcardMeta(id)!;
      return { ...m, isWildcard: true as const };
    });
  return [...CORE_DIRECTIONS, ...wildcards];
}
