"use client";

import { useEffect, useMemo, useState } from "react";
import type { DirectionId, StartupBrief } from "@/lib/types/startup";
import { buildDirectionOptions } from "@/lib/orchestration/directions";
import { pickWildcards } from "@/lib/orchestration/wildcards";
import { WildcardDirectionMock, isWildcardId } from "./WildcardDirectionMocks";

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
  onContinue?: (direction: DirectionId) => void;
  continuing?: boolean;
};

export default function LandingPagePreview({ brief, seed, onContinue, continuing }: Props) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<DirectionId>("orchestra");
  const [visibleCards, setVisibleCards] = useState(0);

  const directions = useMemo(() => {
    const wildcards = pickWildcards(seed);
    return buildDirectionOptions(wildcards);
  }, [seed]);

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

      {/* Customization messaging */}
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
                <button
                  type="button"
                  onClick={() => setSelected(direction.id)}
                  className={`w-full text-left rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? "border-blue-400 shadow-xl shadow-blue-100/60 ring-2 ring-blue-100 scale-[1.02] bg-white"
                      : `${direction.accent} shadow-md hover:shadow-lg hover:-translate-y-0.5 bg-white`
                  }`}
                >
                  <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 truncate">
                        {direction.label}
                        {direction.isWildcard && " ✦"}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{direction.tagline}</p>
                    </div>
                    {isSelected && (
                      <span className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wide text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
                        Selected
                      </span>
                    )}
                  </div>

                  <DirectionMock
                    variant={direction.id}
                    brief={brief}
                    slug={slug}
                    assembled={isVisible && step >= Math.min(index + 2, 5)}
                  />
                </button>
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

function DirectionMock({
  variant,
  brief,
  slug,
  assembled,
}: {
  variant: DirectionId;
  brief: StartupBrief;
  slug: string;
  assembled: boolean;
}) {
  if (isWildcardId(variant)) {
    return (
      <WildcardDirectionMock
        variant={variant}
        brief={brief}
        slug={slug}
        assembled={assembled}
      />
    );
  }

  switch (variant) {
    case "orchestra":
      return <OrchestraStyleMock brief={brief} slug={slug} assembled={assembled} />;
    case "premium-dark":
      return <PremiumDarkMock brief={brief} slug={slug} assembled={assembled} />;
    case "bold-experimental":
      return <BoldExperimentalMock brief={brief} slug={slug} assembled={assembled} />;
    case "minimal-clean":
      return <MinimalCleanMock brief={brief} slug={slug} assembled={assembled} />;
  }
}

/* ─── Orchestra Style ─────────────────────────────────────────────────────────
   Layout: nav → centered hero → 3-col feature cards → highlighted pricing
   Feel: trustworthy Orchestra branding, soft blue + violet, generous radius
──────────────────────────────────────────────────────────────────────────── */

function OrchestraStyleMock({
  brief,
  slug,
  assembled,
}: {
  brief: StartupBrief;
  slug: string;
  assembled: boolean;
}) {
  return (
    <div className={`bg-white transition-opacity duration-500 ${assembled ? "opacity-100" : "opacity-50"}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-gradient-to-br from-blue-500 to-violet-400" />
          <span className="text-[8px] font-bold text-slate-800">{brief.name.split(" ")[0]}</span>
        </div>
        <span className="text-[7px] font-semibold text-white bg-blue-600 px-2 py-0.5 rounded-lg">
          Get started
        </span>
      </div>

      <div className="max-h-[360px] overflow-hidden">
        <div
          className={`px-4 pt-6 pb-5 text-center bg-gradient-to-b from-blue-50/40 to-white transition-all duration-500 ${
            assembled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full px-2.5 py-0.5 text-[7px] font-semibold mb-3">
            <span className="w-1 h-1 bg-green-500 rounded-full" />
            Trusted by founders
          </span>
          <h4 className="text-[15px] font-extrabold text-slate-900 tracking-tight mb-1.5 leading-tight">
            {brief.name}
          </h4>
          <p className="text-[8px] text-slate-500 mb-4 leading-relaxed max-w-[200px] mx-auto">
            {brief.tagline}
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="bg-blue-600 text-white text-[8px] font-bold px-3 py-1.5 rounded-xl shadow-sm shadow-blue-200">
              Start free
            </span>
            <span className="text-[8px] font-semibold text-slate-500 border border-slate-200 px-3 py-1.5 rounded-xl">
              Demo
            </span>
          </div>
        </div>

        <div
          className={`px-3 py-4 bg-[#FAFBFC] transition-all duration-500 delay-100 ${
            assembled ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-[7px] font-bold uppercase tracking-widest text-slate-400 text-center mb-2.5">
            Why teams choose us
          </p>
          <div className="grid grid-cols-3 gap-2">
            {brief.features.slice(0, 3).map((f, i) => {
              const styles = [
                "bg-blue-50 border-blue-100",
                "bg-green-50 border-green-100",
                "bg-violet-50 border-violet-100",
              ];
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-2 ${styles[i]}`}
                >
                  <p className="text-[7px] font-bold text-slate-800 mb-1 line-clamp-1">
                    {["Simple", "Smart", "Secure"][i]}
                  </p>
                  <p className="text-[6px] text-slate-500 leading-snug line-clamp-3">{f}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`px-3 pb-4 transition-all duration-500 delay-200 ${
            assembled ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex gap-1.5 justify-center">
            {brief.pricing.tiers.map((t, i) => (
              <div
                key={t.name}
                className={`flex-1 rounded-xl p-2 text-center border ${
                  i === 1
                    ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-200/50 -mt-1 pt-3"
                    : "bg-white border-slate-100"
                }`}
              >
                <p className={`text-[6px] font-bold uppercase ${i === 1 ? "text-blue-200" : "text-slate-400"}`}>
                  {t.name}
                </p>
                <p className={`text-[11px] font-black ${i === 1 ? "text-white" : "text-slate-900"}`}>
                  {t.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-2 py-1 border-t border-slate-50 text-[7px] text-slate-300 text-center truncate">
        {slug}.orchestra.app
      </div>
    </div>
  );
}

/* ─── Premium Dark ────────────────────────────────────────────────────────────
   Layout: cinematic full-bleed hero → accent-line feature list → elegant pricing rows
   Feel: luxury tech, charcoal, soft glows — NOT cyberpunk
──────────────────────────────────────────────────────────────────────────── */

function PremiumDarkMock({
  brief,
  slug,
  assembled,
}: {
  brief: StartupBrief;
  slug: string;
  assembled: boolean;
}) {
  return (
    <div className={`bg-[#0c0c0e] transition-opacity duration-500 ${assembled ? "opacity-100" : "opacity-50"}`}>
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
        </div>
        <span className="flex-1 text-center text-[7px] text-slate-600 truncate">{slug}.io</span>
      </div>

      <div className="max-h-[360px] overflow-hidden">
        <div
          className={`relative px-4 pt-8 pb-6 text-left overflow-hidden transition-all duration-700 ${
            assembled ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/[0.08] rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-violet-500/[0.06] rounded-full blur-xl pointer-events-none" />
          <p className="relative text-[7px] uppercase tracking-[0.3em] text-slate-500 mb-3">
            Introducing
          </p>
          <h4 className="relative text-[16px] font-light text-white tracking-tight mb-2 leading-[1.15]">
            {brief.name}
          </h4>
          <p className="relative text-[8px] text-slate-400 leading-relaxed mb-5 max-w-[90%] font-light">
            {brief.tagline}
          </p>
          <span className="relative inline-block text-[8px] font-medium text-white border border-white/20 bg-white/[0.04] backdrop-blur px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
            Request early access
          </span>
        </div>

        <div
          className={`px-4 py-3 border-t border-white/[0.06] space-y-0 transition-all duration-500 delay-150 ${
            assembled ? "opacity-100" : "opacity-0"
          }`}
        >
          {brief.features.slice(0, 3).map((f, i) => (
            <div
              key={i}
              className="flex gap-3 py-2.5 border-b border-white/[0.04] last:border-0"
            >
              <div className="w-px bg-gradient-to-b from-blue-400/60 to-violet-400/40 flex-shrink-0" />
              <div>
                <p className="text-[7px] font-medium text-slate-300 mb-0.5">Capability {i + 1}</p>
                <p className="text-[6px] text-slate-500 leading-relaxed line-clamp-2">{f}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`px-4 pb-4 transition-all duration-500 delay-300 ${
            assembled ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-[6px] uppercase tracking-[0.2em] text-slate-600 mb-2">Membership</p>
          {brief.pricing.tiers.map((t, i) => (
            <div
              key={t.name}
              className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0"
            >
              <span className="text-[7px] text-slate-400">{t.name}</span>
              <span className={`text-[9px] font-medium ${i === 1 ? "text-white" : "text-slate-500"}`}>
                {t.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Bold Experimental ───────────────────────────────────────────────────────
   Layout: diagonal gradient hero (large type) → stacked offset feature blocks → banner pricing
   Feel: breakout startup, vibrant, dynamic asymmetry
──────────────────────────────────────────────────────────────────────────── */

function BoldExperimentalMock({
  brief,
  slug,
  assembled,
}: {
  brief: StartupBrief;
  slug: string;
  assembled: boolean;
}) {
  const featureColors = [
    "border-l-orange-400 bg-orange-50/80",
    "border-l-fuchsia-400 bg-fuchsia-50/80",
    "border-l-cyan-400 bg-cyan-50/80",
  ];

  return (
    <div className={`bg-white transition-opacity duration-500 ${assembled ? "opacity-100" : "opacity-50"}`}>
      <div className="px-3 py-1.5 flex items-center justify-between bg-slate-900">
        <span className="text-[8px] font-black text-white tracking-tight">{brief.name.split(" ")[0]?.toUpperCase()}</span>
        <span className="text-[7px] font-bold text-slate-900 bg-gradient-to-r from-orange-400 to-fuchsia-400 px-2 py-0.5 rounded-md">
          GO →
        </span>
      </div>

      <div className="max-h-[360px] overflow-hidden">
        <div
          className={`relative px-3 pt-5 pb-4 overflow-hidden transition-all duration-500 ${
            assembled ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-fuchsia-50 to-cyan-100 opacity-80" />
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-400 to-fuchsia-500 rounded-full blur-2xl opacity-30" />
          <p className="relative text-[7px] font-black uppercase tracking-wider text-fuchsia-600 mb-1">
            The future of your category
          </p>
          <h4 className="relative text-[18px] font-black text-slate-900 leading-[0.95] tracking-tighter mb-2 max-w-[85%]">
            {brief.name}
          </h4>
          <p className="relative text-[8px] text-slate-700 font-medium mb-3 line-clamp-2 max-w-[90%]">
            {brief.tagline}
          </p>
          <div className="relative w-full bg-gradient-to-r from-orange-500 via-fuchsia-500 to-cyan-500 text-white text-center text-[9px] font-black py-2 rounded-lg shadow-lg shadow-fuchsia-200/50">
            Start building today
          </div>
        </div>

        <div
          className={`px-3 py-3 space-y-2 transition-all duration-500 delay-100 ${
            assembled ? "opacity-100" : "opacity-0"
          }`}
        >
          {brief.features.slice(0, 3).map((f, i) => (
            <div
              key={i}
              className={`border-l-[3px] pl-2.5 py-2 rounded-r-lg ${featureColors[i]}`}
              style={{ marginLeft: i === 1 ? "8px" : i === 2 ? "4px" : "0" }}
            >
              <p className="text-[8px] font-black text-slate-900 mb-0.5">
                {["Move fast", "Stand out", "Scale up"][i]}
              </p>
              <p className="text-[6px] text-slate-600 leading-snug line-clamp-2">{f}</p>
            </div>
          ))}
        </div>

        <div
          className={`px-3 pb-4 transition-all duration-500 delay-200 ${
            assembled ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="rounded-xl bg-slate-900 p-3 text-center mb-2">
            <p className="text-[7px] text-slate-400 mb-0.5">Most popular</p>
            <p className="text-[14px] font-black text-white">{brief.pricing.tiers[1]?.price ?? "$49"}</p>
            <p className="text-[6px] text-slate-500">{brief.pricing.tiers[1]?.name ?? "Growth"}</p>
          </div>
          <div className="flex justify-center gap-2">
            {brief.pricing.tiers.map((t) => (
              <span
                key={t.name}
                className="text-[6px] font-bold text-slate-500 border border-slate-200 rounded-full px-2 py-0.5"
              >
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Minimal Clean ───────────────────────────────────────────────────────────
   Layout: sparse hero (text link CTA) → numbered feature rows → pricing table
   Feel: Notion / Linear — black & white, thin rules, maximum whitespace
──────────────────────────────────────────────────────────────────────────── */

function MinimalCleanMock({
  brief,
  slug,
  assembled,
}: {
  brief: StartupBrief;
  slug: string;
  assembled: boolean;
}) {
  return (
    <div className={`bg-white transition-opacity duration-500 ${assembled ? "opacity-100" : "opacity-50"}`}>
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
        <span className="text-[8px] font-medium text-slate-900 tracking-tight">{brief.name}</span>
        <span className="text-[7px] text-slate-400">Log in</span>
      </div>

      <div className="max-h-[360px] overflow-hidden px-4">
        <div
          className={`pt-8 pb-10 transition-all duration-500 ${
            assembled ? "opacity-100" : "opacity-0"
          }`}
        >
          <h4 className="text-[13px] font-medium text-slate-900 tracking-tight mb-2 leading-snug">
            {brief.tagline}
          </h4>
          <p className="text-[7px] text-slate-400 leading-relaxed mb-6 max-w-[90%] line-clamp-2">
            {brief.description}
          </p>
          <span className="text-[8px] font-medium text-slate-900 underline underline-offset-2 decoration-slate-300">
            Get started →
          </span>
        </div>

        <div
          className={`pb-6 transition-all duration-500 delay-100 ${
            assembled ? "opacity-100" : "opacity-0"
          }`}
        >
          {brief.features.slice(0, 3).map((f, i) => (
            <div key={i}>
              <div className="flex gap-4 py-3">
                <span className="text-[8px] font-mono text-slate-300 tabular-nums w-4 flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[7px] text-slate-600 leading-relaxed line-clamp-2">{f}</p>
              </div>
              {i < 2 && <div className="h-px bg-slate-100" />}
            </div>
          ))}
        </div>

        <div
          className={`pb-5 transition-all duration-500 delay-200 ${
            assembled ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="h-px bg-slate-200 mb-4" />
          <p className="text-[6px] uppercase tracking-[0.25em] text-slate-400 mb-3">Plans</p>
          <div className="space-y-2">
            {brief.pricing.tiers.map((t) => (
              <div key={t.name} className="flex items-baseline justify-between gap-2">
                <span className="text-[7px] text-slate-500">{t.name}</span>
                <span className="text-[8px] font-medium text-slate-900 tabular-nums">{t.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 py-1.5 border-t border-slate-100 text-[6px] text-slate-300">{slug}.app</div>
    </div>
  );
}
