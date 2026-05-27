"use client";

import { useEffect, useMemo, useState } from "react";
import type { DirectionId, StartupBrief } from "@/lib/types/startup";
import { buildDirectionOptions } from "@/lib/orchestration/directions";
import { pickWildcards } from "@/lib/orchestration/wildcards";
import DirectionThumbnailCard from "./DirectionThumbnailCard";

const EXPLORE_LABELS = [
  "Exploring creative directions…",
  "Composing core styles…",
  "Discovering wildcard identities…",
  "Rendering premium layouts…",
  "Polishing creative variations…",
  "Directions ready",
];

type Props = {
  brief: StartupBrief;
  seed: string;
  wildcardDirections?: DirectionId[];
  onContinue?: (direction: DirectionId) => void;
  continuing?: boolean;
};

export default function LandingPagePreview({ brief, seed, wildcardDirections, onContinue, continuing }: Props) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<DirectionId>("orchestra");
  const [visibleCards, setVisibleCards] = useState(0);

  const directions = useMemo(() => {
    const wildcards = wildcardDirections?.length ? wildcardDirections : pickWildcards(seed);
    return buildDirectionOptions(wildcards);
  }, [seed, wildcardDirections]);

  const slug = brief.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const exploring = step < 5;
  const totalCards = directions.length;

  useEffect(() => {
    setStep(0);
    setVisibleCards(0);
    setSelected("orchestra");

    const stepTimers = [350, 900, 1500, 2100, 2700, 3400].map((ms, i) =>
      setTimeout(() => setStep(i + 1), ms)
    );
    const cardTimers = directions.map((_, i) =>
      setTimeout(() => setVisibleCards(i + 1), 1000 + i * 450)
    );

    return () => {
      stepTimers.forEach(clearTimeout);
      cardTimers.forEach(clearTimeout);
    };
  }, [brief, directions]);

  return (
    <div className="animate-fade-up" style={{ animationDelay: "360ms" }}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8">
            {exploring && (
              <span className="absolute inset-0 rounded-lg bg-violet-200 animate-pulse-soft" />
            )}
            <span className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-400 flex items-center justify-center text-white text-xs font-bold">
              O
            </span>
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-900">Choose your direction</p>
            <p className="text-[12px] text-blue-600 font-medium transition-all duration-300 min-h-[18px]">
              {exploring
                ? EXPLORE_LABELS[Math.min(step, EXPLORE_LABELS.length - 2)]
                : `${totalCards} creative interpretations · incl. wildcards`}
            </p>
          </div>
        </div>
        {!exploring && (
          <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 border border-violet-100 rounded-full px-3 py-1 self-start sm:self-auto">
            4 core + {directions.length - 4} wildcard ✦
          </span>
        )}
      </div>

      <div
        className={`mb-5 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-white to-violet-50/50 px-4 py-3.5 transition-all duration-500 ${
          exploring ? "opacity-70" : "opacity-100"
        }`}
      >
        <p className="text-[13px] text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-800">Starting directions, not final sites.</span>{" "}
          All content, colors, layout, branding, and copy can be customized inside Orchestra before
          launch.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 px-1">
        {directions.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSelected(d.id)}
            disabled={visibleCards < directions.findIndex((x) => x.id === d.id) + 1}
            className={`text-[11px] sm:text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
              selected === d.id
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {d.label}
            {d.isWildcard && " ✦"}
          </button>
        ))}
      </div>

      <div className="relative -mx-2 px-2">
        <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory direction-scroll">
          {directions.map((direction, index) => {
            const isVisible = visibleCards > index;
            const isSelected = selected === direction.id;

            return (
              <div
                key={direction.id}
                className={`flex-shrink-0 w-[min(100%,320px)] sm:w-[300px] snap-center transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
                }`}
              >
                <div
                  className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? "border-blue-400 shadow-xl shadow-blue-100/60 ring-2 ring-blue-100 scale-[1.02] bg-white"
                      : `${direction.accent} shadow-md hover:shadow-lg hover:-translate-y-0.5 bg-white`
                  }`}
                >
                  <DirectionThumbnailCard
                    direction={direction.id}
                    brief={brief}
                    seed={seed}
                    isSelected={isSelected}
                    onSelect={() => setSelected(direction.id)}
                    assembled={isVisible && step >= Math.min(index + 2, 5)}
                  />
                  <p className="text-[10px] text-slate-400 text-center py-2 border-t border-slate-100 bg-slate-50/80">
                    {slug}.orchestra.app
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-400 text-center mt-2 sm:hidden">
          Swipe to compare directions →
        </p>
      </div>

      {!exploring && (
        <div className="mt-5 space-y-3 animate-fade-up">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onContinue?.(selected)}
              disabled={continuing || !onContinue}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-[14px] shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-wait"
            >
              {continuing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Building your page…
                </>
              ) : (
                <>
                  Continue with {directions.find((d) => d.id === selected)?.label}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
          <p className="text-center text-[12px] text-slate-400 leading-relaxed max-w-md mx-auto">
            Preview only. Pick a direction, then refine every detail in Orchestra before you launch.
          </p>
        </div>
      )}
    </div>
  );
}
