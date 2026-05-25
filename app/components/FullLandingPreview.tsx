"use client";

import type { DirectionId, GeneratedSections, StartupBrief } from "@/lib/types/startup";
import { getDirectionLabel } from "@/lib/orchestration/directions";
import ProjectWebsite from "./ProjectWebsite";

type Props = {
  brief: StartupBrief;
  sections: GeneratedSections;
  direction: DirectionId;
};

/** Compact preview wrapper — used during homepage generation flow */
export default function FullLandingPreview({ brief, sections, direction }: Props) {
  return (
    <div id="full-preview" className="animate-fade-up mt-8">
      <div className="flex items-center gap-2.5 mb-4 px-1">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-400 flex items-center justify-center text-white text-xs font-bold">
          O
        </div>
        <div>
          <p className="text-[13px] font-bold text-slate-900">Your startup is taking shape</p>
          <p className="text-[12px] text-blue-600 font-medium">
            Full preview · {getDirectionLabel(direction)}
          </p>
        </div>
      </div>
      <ProjectWebsite brief={brief} sections={sections} direction={direction} variant="preview" />
      <p className="text-center text-[12px] text-slate-400 mt-4 leading-relaxed max-w-lg mx-auto">
        Opening your dedicated project page…
      </p>
    </div>
  );
}
