"use client";

import type { DirectionId, StartupBrief, WildcardDirectionId } from "@/lib/types/startup";
import { DIRECTION_THEMES } from "@/lib/orchestration/direction-themes";
import { generateLogo } from "@/lib/orchestration/generate-logo";
import StartupLogoMark from "./StartupLogoMark";

type MockProps = {
  brief: StartupBrief;
  slug: string;
  assembled: boolean;
  variant: WildcardDirectionId;
};

export function WildcardDirectionMock({ variant, brief, slug, assembled }: MockProps) {
  const theme = DIRECTION_THEMES[variant];
  const logo = generateLogo(brief, variant, "#6366f1", brief.name);
  const opacity = assembled ? "opacity-100" : "opacity-50";

  switch (variant) {
    case "luxury-editorial":
      return (
        <div className={`bg-[#FAF8F5] ${opacity} transition-opacity duration-500`}>
          <div className={`px-4 py-3 border-b ${theme.border} flex justify-between items-center`}>
            <StartupLogoMark logo={{ ...logo, fontStyle: "serif" }} size="sm" />
            <span className={`text-[7px] uppercase tracking-widest px-3 py-1 ${theme.navCta}`}>Join</span>
          </div>
          <div className="px-5 py-8 text-center max-h-[320px]">
            <p className="text-[8px] uppercase tracking-[0.25em] text-stone-400 mb-4">Est. 2026</p>
            <h4 className="text-[16px] font-serif font-light text-stone-900 mb-3 leading-snug">{brief.name}</h4>
            <p className="text-[8px] text-stone-500 leading-relaxed max-w-[200px] mx-auto mb-5">{brief.tagline}</p>
            <div className="grid grid-cols-2 gap-3 max-w-[220px] mx-auto">
              {brief.features.slice(0, 2).map((f, i) => (
                <div key={i} className="border-t border-stone-200 pt-3 text-left">
                  <p className="text-[7px] font-serif text-stone-800 mb-1">0{i + 1}</p>
                  <p className="text-[6px] text-stone-500 line-clamp-2">{f}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="px-2 py-1 border-t border-stone-200 text-[7px] text-stone-400 text-center">{slug}.studio</div>
        </div>
      );

    case "glass-futuristic":
      return (
        <div className={`bg-gradient-to-br from-slate-900 to-indigo-950 ${opacity} transition-opacity duration-500`}>
          <div className={`px-3 py-2 border-b border-white/10 flex justify-between`}>
            <span className="text-[8px] text-cyan-300 font-medium">{brief.name.split(" ")[0]}</span>
            <span className="text-[7px] text-cyan-400/80 border border-cyan-400/30 px-2 py-0.5 rounded-lg backdrop-blur">Launch</span>
          </div>
          <div className="px-4 py-6 max-h-[320px]">
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 mb-3">
              <h4 className="text-[14px] text-white font-medium mb-2">{brief.tagline}</h4>
              <div className="h-16 rounded-lg bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-white/5" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["847", "98%", "24h"].map((v) => (
                <div key={v} className="rounded-lg bg-white/5 border border-white/10 p-2 text-center">
                  <p className="text-[10px] font-bold text-white">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[7px] text-center text-slate-600 py-1 border-t border-white/5">{slug}.io</div>
        </div>
      );

    case "creator-playful":
      return (
        <div className={`bg-gradient-to-b from-pink-50 to-white ${opacity}`}>
          <div className="bg-gradient-to-r from-pink-500 to-violet-500 px-3 py-2 flex justify-between items-center">
            <span className="text-[9px] font-black text-white">{brief.name.split(" ")[0]}</span>
            <span className="text-[7px] font-bold bg-white text-pink-600 px-2 py-0.5 rounded-full">Go ✦</span>
          </div>
          <div className="px-4 py-5 max-h-[320px]">
            <h4 className="text-[15px] font-black text-slate-900 mb-1">{brief.name}</h4>
            <p className="text-[8px] text-slate-600 mb-4">{brief.tagline}</p>
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`rounded-2xl p-2 ${i === 0 ? "col-span-2 bg-gradient-to-r from-pink-100 to-violet-100" : "bg-white border border-pink-100"}`}>
                  <p className="text-[7px] font-bold text-slate-800 line-clamp-2">{brief.features[i] ?? brief.tagline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "apple-modern":
      return (
        <div className={`bg-[#FBFBFD] ${opacity}`}>
          <div className="px-4 py-2.5 flex justify-between border-b border-slate-200/60">
            <span className="text-[9px] font-semibold text-slate-900">{brief.name}</span>
            <span className="text-[7px] text-blue-600 font-medium">Learn more ›</span>
          </div>
          <div className="px-5 py-8 text-center max-h-[320px]">
            <h4 className="text-[13px] font-semibold text-slate-900 mb-2 tracking-tight">{brief.tagline}</h4>
            <div className="mx-auto w-32 h-20 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 shadow-xl mb-4" />
            <span className="text-[8px] font-medium text-blue-600">Get started →</span>
          </div>
        </div>
      );

    case "retro-tech":
      return (
        <div className={`bg-[#2D4A3E] ${opacity}`}>
          <div className="px-3 py-1.5 border-b border-emerald-900 font-mono text-[7px] text-emerald-400 flex gap-2">
            <span>~/apps/{slug}</span>
          </div>
          <div className="px-4 py-5 font-mono max-h-[320px]">
            <p className="text-emerald-400 text-[8px] mb-1">&gt; init {brief.name.toLowerCase()}</p>
            <h4 className="text-[13px] text-emerald-50 mb-2">{brief.name}</h4>
            <p className="text-[7px] text-emerald-300/70 mb-4 leading-relaxed">{brief.tagline}</p>
            {brief.features.slice(0, 2).map((f, i) => (
              <p key={i} className="text-[6px] text-emerald-400/80 py-1 border-b border-emerald-800/50">[✓] {f.slice(0, 40)}</p>
            ))}
          </div>
        </div>
      );

    case "creative-agency":
      return (
        <div className={`bg-violet-600 ${opacity}`}>
          <div className="px-3 py-2 flex justify-between items-center border-b border-violet-500">
            <span className="text-[10px] font-black text-white uppercase">{brief.name.split(" ")[0]}</span>
            <span className="text-[7px] font-black bg-yellow-400 text-violet-900 px-2 py-0.5">WORK</span>
          </div>
          <div className="px-3 py-5 max-h-[320px]">
            <h4 className="text-[18px] font-black text-white uppercase leading-none mb-2">{brief.name}</h4>
            <p className="text-[8px] text-violet-200 mb-4 uppercase tracking-wide">{brief.tagline}</p>
            <div className="space-y-2">
              {brief.features.slice(0, 2).map((f, i) => (
                <div key={i} className="border-l-4 border-yellow-400 pl-2 py-1 bg-violet-700/50">
                  <p className="text-[7px] text-white font-bold line-clamp-2">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "fashion-ai":
      return (
        <div className={`bg-black ${opacity}`}>
          <div className="px-4 py-3 flex justify-between border-b border-white/10">
            <span className="text-[8px] text-white uppercase tracking-[0.3em]">{brief.name.split(" ")[0]}</span>
            <span className="text-[7px] text-white border border-white/30 px-3 uppercase tracking-widest">Shop</span>
          </div>
          <div className="px-5 py-10 text-center max-h-[320px]">
            <p className="text-[8px] text-rose-400 uppercase tracking-[0.2em] mb-4">New collection</p>
            <h4 className="text-[14px] font-light text-white mb-3">{brief.tagline}</h4>
            <div className="w-full h-24 bg-gradient-to-t from-neutral-900 to-neutral-700 mb-3" />
          </div>
        </div>
      );

    case "genz-vibrant":
      return (
        <div className={`bg-lime-400 ${opacity}`}>
          <div className="bg-black px-3 py-2 flex justify-between">
            <span className="text-[9px] font-black text-lime-400">{brief.name.toUpperCase()}</span>
            <span className="text-[7px] font-black bg-lime-400 text-black px-2">LET&apos;S GO</span>
          </div>
          <div className="px-3 py-4 max-h-[320px]">
            <h4 className="text-[16px] font-black text-black leading-tight mb-2">{brief.tagline}</h4>
            <div className="bg-black text-lime-400 text-[8px] font-black text-center py-3 border-4 border-black shadow-[4px_4px_0_0_#000]">
              START FREE →
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {brief.features.slice(0, 2).map((f, i) => (
                <div key={i} className="bg-white border-2 border-black p-2 shadow-[3px_3px_0_0_#000]">
                  <p className="text-[6px] font-bold line-clamp-2">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "cinematic-ai":
      return (
        <div className={`bg-[#0f0f12] ${opacity}`}>
          <div className="px-3 py-2 border-b border-indigo-900/40 flex justify-between">
            <span className="text-[8px] text-indigo-300">{brief.name}</span>
            <span className="text-[7px] text-white bg-indigo-600/50 px-2 py-0.5 rounded">Access</span>
          </div>
          <div className="relative px-4 py-8 max-h-[320px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 to-transparent" />
            <h4 className="relative text-[15px] font-light text-white mb-2">{brief.name}</h4>
            <p className="relative text-[8px] text-indigo-300/70 mb-5">{brief.tagline}</p>
            <div className="relative grid grid-cols-3 gap-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded bg-indigo-950/40 border border-indigo-800/30" />
              ))}
            </div>
          </div>
        </div>
      );

    case "minimal-luxury":
      return (
        <div className={`bg-[#F7F6F3] ${opacity}`}>
          <div className="px-5 py-3 flex justify-between border-b border-stone-200/80">
            <span className="text-[8px] font-light text-stone-600 tracking-wide">{brief.name}</span>
            <span className="text-[7px] text-stone-500">Menu</span>
          </div>
          <div className="px-6 py-12 text-center max-h-[320px]">
            <h4 className="text-[12px] font-light text-stone-800 mb-4 tracking-tight leading-relaxed">{brief.tagline}</h4>
            <span className="text-[7px] uppercase tracking-[0.2em] text-stone-400 border-b border-stone-300 pb-0.5">Discover</span>
            <div className="mt-8 space-y-3">
              {brief.pricing.tiers.slice(0, 2).map((t) => (
                <div key={t.name} className="flex justify-between text-[7px] text-stone-500 border-b border-stone-100 pb-2">
                  <span>{t.name}</span>
                  <span className="text-stone-800">{t.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
  }
}

export function isWildcardId(id: DirectionId): id is WildcardDirectionId {
  return [
    "luxury-editorial",
    "glass-futuristic",
    "creator-playful",
    "apple-modern",
    "retro-tech",
    "creative-agency",
    "fashion-ai",
    "genz-vibrant",
    "cinematic-ai",
    "minimal-luxury",
  ].includes(id as WildcardDirectionId);
}
