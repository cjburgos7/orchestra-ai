"use client";

import { useEffect, useState } from "react";
import type { DirectionId, ImagerySet, ProductCategory, StartupBrief } from "@/lib/types/startup";
import { buildStartupWorld, resolveWorldPreview, worldNavLabel } from "@/lib/orchestration/world-pipeline";
import { getCategoryWorld } from "@/lib/orchestration/category-worlds";
import SafeImage, { preloadImages } from "./SafeImage";

type Props = {
  direction: DirectionId;
  brief: StartupBrief;
  seed: string;
  slug: string;
  assembled: boolean;
};

function PreviewImg({
  src,
  fallback,
  chain,
  imagery,
  category,
  seed,
  className = "",
  priority,
}: {
  src: string;
  fallback?: string;
  chain?: string[];
  imagery?: ImagerySet;
  category: ProductCategory;
  seed: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <SafeImage
      src={src}
      fallback={fallback}
      chain={chain}
      imagery={imagery}
      category={category}
      seed={seed}
      className={className}
      priority={priority}
    />
  );
}

export default function DirectionPreviewEngine({ direction, brief, seed, slug, assembled }: Props) {
  const world = buildStartupWorld(brief, seed, direction);
  const [imagery, setImagery] = useState<ImagerySet>(world.imagery);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/rebuild-visuals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brief, seed: `${seed}:${direction}`, direction }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data.imagery) setImagery(data.imagery);
      } catch {
        // keep gradient placeholder until pipeline succeeds
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [brief, seed, direction]);

  const { resolution, category, accentColor: accent } = world;
  const composition = resolveWorldPreview(resolution, direction, seed, brief);
  const navLabel = worldNavLabel(resolution);
  const categoryLabel = resolution.visualWorld.split("·")[0]?.trim() ?? getCategoryWorld(category).label;
  const opacity = assembled ? "opacity-100" : "opacity-60";
  const anim = assembled ? "translate-y-0" : "translate-y-2";

  useEffect(() => {
    preloadImages([
      imagery.hero,
      ...imagery.heroChain,
      ...imagery.lifestyle,
      ...imagery.products.map((p) => p.image),
      ...imagery.products.flatMap((p) => p.imageChain ?? []),
    ]);
  }, [imagery]);

  const name = brief.name.split(" ")[0];

  if (composition === "sports-analytics") {
    const stats = [
      { label: "FG%", value: "47.2" },
      { label: "PPG", value: "112.4" },
      { label: "Live", value: "●" },
    ];
    const heat = [0.9, 0.5, 0.3, 0.8, 0.6, 0.4, 0.85, 0.55, 0.35, 0.75, 0.65, 0.45];
    return (
      <div className={`bg-[#0a0f1a] overflow-hidden transition-all duration-700 ${opacity} ${anim}`}>
        <div className="px-3 py-1.5 flex justify-between items-center bg-black/80 border-b border-white/10">
          <span className="text-[7px] font-bold tracking-wide text-white uppercase">{name}</span>
          <span className="text-[6px] font-semibold orch-scoreboard-live" style={{ color: accent }}>
            {navLabel}
          </span>
        </div>
        <div className="relative h-[100px] overflow-hidden">
          <PreviewImg src={imagery.hero} fallback={imagery.heroFallback} chain={imagery.heroChain} imagery={imagery} category={category} seed="hero" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-black/40 to-transparent z-[2]" />
          <div className="absolute bottom-2 left-3 right-3 z-[4]">
            <p className="text-[5px] uppercase tracking-widest text-white/50">{categoryLabel}</p>
            <h4 className="text-[10px] font-black text-white leading-tight">{brief.name}</h4>
          </div>
          <div className="absolute top-2 right-2 z-[4] flex gap-1">
            {stats.map((s) => (
              <span key={s.label} className="text-[5px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white border border-white/10">
                {s.label} <span style={{ color: accent }}>{s.value}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-1 p-2">
          <div className="col-span-7 grid grid-cols-4 gap-0.5 p-1.5 rounded-lg bg-black/50 border border-white/10">
            {heat.map((o, i) => (
              <div key={i} className="aspect-square rounded-sm" style={{ backgroundColor: accent, opacity: 0.15 + o * 0.7 }} />
            ))}
          </div>
          <div className="col-span-5 space-y-1">
            <div className="rounded-lg p-2 bg-white/5 border border-white/10">
              <p className="text-[5px] uppercase tracking-widest text-white/40 mb-0.5">Scouting</p>
              <p className="text-[7px] font-bold text-white">AI Player Report</p>
            </div>
            <div className="rounded-lg p-2 bg-white/5 border border-white/10">
              <p className="text-[5px] uppercase tracking-widest text-white/40 mb-0.5">Prediction</p>
              <p className="text-[7px] font-bold text-white" style={{ color: accent }}>94.2% accuracy</p>
            </div>
            <div className="grid grid-cols-3 gap-0.5">
              {["Track", "Scout", "Win"].map((l) => (
                <div key={l} className="text-[5px] font-bold text-center py-1 rounded bg-white/5 text-white/70">{l}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (composition === "pet-lifestyle") {
    return (
      <div className={`bg-[#fffbeb] overflow-hidden transition-all duration-700 ${opacity} ${anim}`}>
        <div className="px-3 py-1.5 flex justify-between items-center bg-white/90 border-b border-amber-100">
          <span className="text-[7px] font-bold tracking-wide text-amber-900 uppercase">{name}</span>
          <span className="text-[6px] font-semibold text-amber-700">{navLabel}</span>
        </div>
        <div className="relative h-[130px] overflow-hidden">
          <PreviewImg src={imagery.hero} fallback={imagery.heroFallback} chain={imagery.heroChain} imagery={imagery} category={category} seed="hero" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/60 to-transparent z-[3]" />
          <div className="absolute bottom-2 left-3 right-3 z-[4]">
            <p className="text-[6px] uppercase tracking-widest text-amber-100/80">{categoryLabel}</p>
            <h4 className="text-[11px] font-bold text-white leading-tight">{brief.name}</h4>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1 p-2 bg-white">
          {imagery.products.map((p, i) => (
            <div key={p.name} className="rounded-lg overflow-hidden border border-amber-50">
              <div className="relative aspect-square">
                <PreviewImg src={p.image} fallback={p.imageFallback} chain={p.imageChain} imagery={imagery} category={category} seed={`prod-${i}`} />
              </div>
              <p className="text-[5px] font-bold text-center py-1 truncate px-0.5 text-amber-950">{p.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (composition === "orchestra-clean") {
    return (
      <div className={`bg-white overflow-hidden transition-all duration-700 ${opacity} ${anim}`}>
        <div className="px-3 py-1.5 flex justify-between items-center bg-white/95 border-b border-slate-100">
          <span className="text-[7px] font-bold tracking-wide text-slate-800 uppercase">{name}</span>
          <span className="text-[6px] font-semibold text-slate-500">{navLabel}</span>
        </div>
        <div className="grid grid-cols-5 gap-0 min-h-[220px]">
          <div className="col-span-2 p-3 flex flex-col justify-center bg-slate-50">
            <p className="text-[6px] uppercase tracking-widest text-slate-500 mb-1">{categoryLabel}</p>
            <h4 className="text-[10px] font-semibold text-slate-900 leading-tight mb-2">{brief.name}</h4>
            <p className="text-[6px] text-slate-500 line-clamp-3 mb-2">{brief.tagline}</p>
            <span className="text-[6px] font-bold text-white bg-slate-900 px-2 py-1 rounded-full w-fit">Get started</span>
          </div>
          <div className="col-span-3 relative overflow-hidden min-h-[140px]">
            <PreviewImg
              src={imagery.hero}
              fallback={imagery.heroFallback}
              chain={imagery.heroChain}
              imagery={imagery}
              category={category}
              seed="hero"
              className="orch-ken-burns"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-slate-50/30 z-[3]" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1 p-2 bg-white border-t border-slate-50">
          {imagery.products.map((p, i) => (
            <div key={p.name} className="rounded-lg overflow-hidden border border-slate-100">
              <div className="relative aspect-square">
                <PreviewImg src={p.image} fallback={p.imageFallback} chain={p.imageChain} imagery={imagery} category={category} seed={`prod-${i}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (composition === "minimal-clean") {
    return (
      <div className={`bg-white overflow-hidden transition-all duration-500 ${opacity}`}>
        <div className="px-4 py-2 border-b border-slate-200 flex justify-between">
          <span className="text-[8px] font-medium">{brief.name}</span>
          <span className="text-[7px] text-slate-400">Log in</span>
        </div>
        <div className="relative h-[100px] overflow-hidden">
          <PreviewImg src={imagery.hero} fallback={imagery.heroFallback} chain={imagery.heroChain} imagery={imagery} category={category} seed="hero" priority />
          <div className="absolute inset-0 bg-white/70 z-[3]" />
        </div>
        <div className="px-4 py-6">
          <h4 className="text-[11px] font-medium text-slate-900 mb-2 leading-snug">{brief.tagline}</h4>
          <span className="text-[7px] underline text-slate-900">Get started →</span>
        </div>
      </div>
    );
  }

  if (composition === "editorial-commerce") {
    return (
      <div className={`bg-[#f0f7f4] overflow-hidden transition-all duration-700 ${opacity} ${anim}`}>
        <div className="px-3 py-1.5 flex justify-between items-center bg-white/80 border-b border-emerald-100/50">
          <span className="text-[7px] font-serif tracking-widest text-emerald-800 uppercase">{name}</span>
          <span className="text-[6px] text-emerald-600">Shop</span>
        </div>
        <div className="grid grid-cols-2 gap-0 min-h-[200px]">
          <div className="p-3 flex flex-col justify-center bg-[#e8f3ef]">
            <p className="text-[6px] uppercase tracking-widest text-emerald-700 mb-1">New collection</p>
            <h4 className="text-[11px] font-serif font-light text-slate-900 leading-tight mb-2">{brief.tagline.slice(0, 40)}</h4>
            <span className="text-[6px] font-bold bg-emerald-800 text-white px-2 py-1 rounded-full w-fit">Shop now</span>
          </div>
          <div className="relative overflow-hidden min-h-[120px]">
            <PreviewImg
              src={imagery.hero}
              fallback={imagery.heroFallback}
              chain={imagery.heroChain}
              imagery={imagery}
              category={category}
              seed="hero"
              className="scale-110 orch-ken-burns"
              priority
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1 p-2 bg-white">
          {imagery.products.map((p, i) => (
            <div key={p.name} className="rounded-lg overflow-hidden border border-emerald-50">
              <div className="relative aspect-square">
                <PreviewImg
                  src={p.image}
                  fallback={p.imageFallback}
                  chain={p.imageChain}
                  imagery={imagery}
                  category={category}
                  seed={`prod-${i}`}
                />
              </div>
              <p className="text-[5px] font-bold text-center py-1 truncate px-0.5">{p.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (composition === "fullscreen-hero") {
    return (
      <div className={`relative overflow-hidden min-h-[260px] transition-all duration-700 ${opacity}`}>
        <PreviewImg
          src={imagery.hero}
          fallback={imagery.heroFallback}
          chain={imagery.heroChain}
          imagery={imagery}
          category={category}
          seed="hero"
          className="orch-ken-burns scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 z-[3]" />
        <div className="absolute inset-0 orch-vignette z-[3] pointer-events-none opacity-60" />
        <div className="relative z-10 p-4 flex flex-col justify-end min-h-[260px]">
          <p className="text-[6px] uppercase tracking-[0.25em] text-white/75 mb-1">{categoryLabel}</p>
          <h4 className="text-[14px] font-serif font-light text-white leading-tight mb-2 max-w-[90%]">{brief.name}</h4>
          <p className="text-[7px] text-white/80 line-clamp-2 mb-3 max-w-[85%]">{brief.tagline}</p>
          <span className="text-[7px] font-bold text-slate-900 bg-white px-3 py-1 rounded-full w-fit">{brief.features[0]?.slice(0, 24) ?? "Shop now"}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 flex gap-1 p-2 translate-y-full opacity-0" aria-hidden />
        <div className="relative z-10 grid grid-cols-3 gap-1 px-2 pb-2 -mt-12">
          {imagery.products.map((p, i) => (
            <div key={p.name} className="relative aspect-[4/5] rounded-lg overflow-hidden border border-white/20 shadow-lg">
              <PreviewImg src={p.image} fallback={p.imageFallback} chain={p.imageChain} imagery={imagery} category={category} seed={`thumb-prod-${i}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (composition === "dark-cinematic") {
    return (
      <div className={`bg-[#0a0a0c] overflow-hidden transition-all duration-700 ${opacity}`}>
        <div className="relative h-[140px] overflow-hidden">
          <PreviewImg
            src={imagery.hero}
            fallback={imagery.heroFallback}
            chain={imagery.heroChain}
            imagery={imagery}
            category={category}
            seed="hero"
            className="opacity-60 orch-ken-burns"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-[3]" />
          <div className="relative z-10 p-4 h-full flex flex-col justify-end">
            <p className="text-[6px] uppercase tracking-[0.25em] text-slate-500 mb-1">Introducing</p>
            <h4 className="text-[12px] font-light text-white leading-tight">{brief.name}</h4>
          </div>
        </div>
        <div className="px-3 py-2 grid grid-cols-3 gap-1">
          {imagery.lifestyle.map((src, i) => (
            <div key={i} className="relative rounded-md overflow-hidden h-12 opacity-80">
              <PreviewImg
                src={src}
                fallback={imagery.lifestyleFallbacks[i]}
                imagery={imagery}
                category={category}
                seed={`life-${i}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (composition === "bold-collage") {
    return (
      <div className={`overflow-hidden transition-all duration-500 ${opacity}`}>
        <div className="grid grid-cols-3 grid-rows-2 gap-0.5 h-[220px]">
          <div className="col-span-2 row-span-2 relative overflow-hidden">
            <PreviewImg src={imagery.hero} fallback={imagery.heroFallback} chain={imagery.heroChain} imagery={imagery} category={category} seed="hero" className="orch-ken-burns" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent z-[3]" />
            <div className="absolute bottom-2 left-2 right-2 z-[4]">
              <p className="text-[6px] uppercase tracking-widest text-white/70 mb-0.5">{categoryLabel}</p>
              <p className="text-[10px] font-black text-white drop-shadow-lg leading-none">{brief.name}</p>
            </div>
          </div>
          {imagery.lifestyle.slice(0, 2).map((src, i) => (
            <div key={i} className="relative overflow-hidden">
              <PreviewImg src={src} fallback={imagery.lifestyleFallbacks[i]} imagery={imagery} category={category} seed={`life-${i}`} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1 p-2 bg-white">
          {imagery.products.map((p, i) => (
            <div key={p.name} className="relative aspect-[4/5] rounded-md overflow-hidden border border-slate-100">
              <PreviewImg src={p.image} fallback={p.imageFallback} chain={p.imageChain} imagery={imagery} category={category} seed={`prod-${i}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (composition === "luxury-editorial") {
    return (
      <div className={`bg-[#FAF8F5] overflow-hidden transition-all duration-700 ${opacity}`}>
        <div className="px-4 py-2 border-b border-stone-200 flex justify-between">
          <span className="text-[7px] font-serif tracking-[0.2em] text-stone-600 uppercase">{name}</span>
        </div>
        <div className="relative h-[120px] overflow-hidden">
          <PreviewImg src={imagery.hero} fallback={imagery.heroFallback} chain={imagery.heroChain} imagery={imagery} category={category} seed="hero" priority />
        </div>
        <div className="px-4 py-3 text-center">
          <h4 className="text-[10px] font-serif font-light text-stone-900 mb-1">{brief.tagline.slice(0, 35)}</h4>
          <div className="flex justify-center gap-2 mt-2">
            {imagery.products.slice(0, 2).map((p, i) => (
              <div key={p.name} className="relative w-12 h-14 rounded overflow-hidden border border-stone-200">
                <PreviewImg src={p.image} fallback={p.imageFallback} chain={p.imageChain} imagery={imagery} category={category} seed={`prod-${i}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (composition === "glass-futuristic") {
    return (
      <div className={`bg-slate-950 overflow-hidden transition-all duration-700 ${opacity}`}>
        <div className="relative h-[160px]">
          <PreviewImg src={imagery.hero} fallback={imagery.heroFallback} chain={imagery.heroChain} imagery={imagery} category={category} seed="hero" className="opacity-90 orch-ken-burns" priority />
          <div className="absolute inset-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-3 flex flex-col justify-end z-[3]">
            <h4 className="text-[10px] font-semibold text-white mb-1">{brief.name}</h4>
            <p className="text-[6px] text-cyan-200/80 line-clamp-2">{brief.tagline}</p>
          </div>
        </div>
        <div className="px-2 pb-2 flex gap-1">
          {imagery.lifestyle.map((src, i) => (
            <div key={i} className="relative flex-1 h-10 rounded-lg overflow-hidden border border-cyan-500/20">
              <PreviewImg src={src} fallback={imagery.lifestyleFallbacks[i]} imagery={imagery} category={category} seed={`life-${i}`} className="opacity-70" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (composition === "creator-vibrant") {
    return (
      <div className={`overflow-hidden transition-all duration-500 ${opacity}`}>
        <div className="relative h-[130px]">
          <PreviewImg src={imagery.hero} fallback={imagery.heroFallback} chain={imagery.heroChain} imagery={imagery} category={category} seed="hero" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-600/80 to-violet-600/40 z-[3]" />
          <div className="absolute bottom-3 left-3 right-3 z-[4]">
            <h4 className="text-[11px] font-black text-white">{brief.name}</h4>
          </div>
        </div>
        <div className="bg-pink-50 px-2 py-2 flex gap-1 overflow-hidden">
          {imagery.lifestyle.map((src, i) => (
            <div key={i} className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
              <PreviewImg src={src} fallback={imagery.lifestyleFallbacks[i]} imagery={imagery} category={category} seed={`life-${i}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white overflow-hidden transition-all duration-700 ${opacity} ${anim}`}>
      <div className="relative h-[100px] overflow-hidden">
        <PreviewImg src={imagery.hero} fallback={imagery.heroFallback} chain={imagery.heroChain} imagery={imagery} category={category} seed="hero" className="orch-ken-burns" priority />
        <div className="absolute inset-0 bg-black/30 flex items-end p-3 z-[3]">
          <h4 className="text-[10px] font-bold text-white">{brief.name}</h4>
        </div>
      </div>
      <div className="p-2 grid grid-cols-3 gap-1">
        {imagery.products.map((p, i) => (
          <div key={p.name} className="rounded-lg overflow-hidden border border-slate-100 shadow-sm">
            <div className="relative aspect-[3/4]">
              <PreviewImg src={p.image} fallback={p.imageFallback} chain={p.imageChain} imagery={imagery} category={category} seed={`prod-${i}`} />
            </div>
            <p className="text-[5px] font-bold text-center py-0.5 text-slate-800">{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DirectionPreviewFooter({ slug }: { slug: string }) {
  return (
    <div className="px-2 py-1 border-t border-slate-50 text-[7px] text-slate-300 text-center truncate">
      {slug}.orchestra.app
    </div>
  );
}
