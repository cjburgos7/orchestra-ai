"use client";

import type { BackgroundStyle, DirectionId, ImagerySet, ProductCategory } from "@/lib/types/startup";
import { resolvePhotoTreatment, scrimGradient } from "@/lib/orchestration/art-direction";
import { hydratedProducts } from "@/lib/slot-hydration";
import SafeImage from "./SafeImage";

type Props = {
  imagery: ImagerySet;
  accent: string;
  mode?: "hero" | "background" | "card";
  className?: string;
  alt?: string;
  category?: ProductCategory;
  seed?: string;
  direction?: DirectionId;
};

function PhotoScrim({
  treatment,
  accent,
  meshFrom,
  meshTo,
}: {
  treatment: ReturnType<typeof resolvePhotoTreatment>;
  accent: string;
  meshFrom: string;
  meshTo: string;
}) {
  return (
    <>
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: scrimGradient(treatment, accent) }}
      />
      {treatment.meshOpacity > 0 && (
        <div
          className="absolute inset-0 z-[2] pointer-events-none mix-blend-soft-light"
          style={{
            opacity: treatment.meshOpacity,
            background: `linear-gradient(120deg, ${meshFrom}, transparent 50%, ${meshTo})`,
          }}
        />
      )}
      {treatment.vignette && (
        <div
          className="absolute inset-0 z-[2] pointer-events-none orch-vignette"
          aria-hidden
        />
      )}
      {treatment.grain && (
        <div className="absolute inset-0 z-[2] pointer-events-none orch-film-grain opacity-[0.35]" aria-hidden />
      )}
    </>
  );
}

export function HeroImagery({
  imagery,
  accent,
  mode = "hero",
  className = "",
  alt,
  category = "generic",
  seed = "hero",
  direction = "orchestra",
}: Props) {
  const label = alt ?? imagery.heroAlt;
  const treatment = resolvePhotoTreatment(direction);
  const kenBurns = treatment.kenBurns ? "orch-ken-burns" : "";

  if (mode === "background") {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <SafeImage
          src={imagery.hero}
          fallback={imagery.heroFallback}
          chain={imagery.heroChain}
          imagery={imagery}
          category={category}
          seed={seed}
          alt=""
          className={`absolute inset-0 scale-[1.03] ${kenBurns}`}
          priority
        />
        <PhotoScrim treatment={treatment} accent={accent} meshFrom={imagery.meshFrom} meshTo={imagery.meshTo} />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl min-h-[360px] md:min-h-[480px] lg:min-h-[560px] ${className}`}>
      <SafeImage
        src={imagery.hero}
        fallback={imagery.heroFallback}
        chain={imagery.heroChain}
        imagery={imagery}
        category={category}
        seed={seed}
        alt={label}
        className={`min-h-[360px] md:min-h-[480px] lg:min-h-[560px] ${kenBurns}`}
        priority
      />
      <PhotoScrim treatment={treatment} accent={accent} meshFrom={imagery.meshFrom} meshTo={imagery.meshTo} />
    </div>
  );
}

export function LifestyleGrid({
  imagery,
  theme,
  compact,
  category = "generic",
  direction = "orchestra" as DirectionId,
}: {
  imagery: ImagerySet;
  theme: { border: string; cardTitle: string; cardBody: string };
  compact?: boolean;
  category?: ProductCategory;
  direction?: DirectionId;
}) {
  const imgs = imagery.lifestyle.slice(0, 6);
  const isEditorial = direction === "luxury-editorial" || direction === "minimal-luxury" || direction === "fashion-ai";

  if (isEditorial) {
    return (
      <div className={`grid grid-cols-12 gap-2 md:gap-3 ${compact ? "max-w-lg" : "max-w-5xl mx-auto"}`}>
        {imgs.slice(0, 4).map((src, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl border ${theme.border} orch-hover-lift orch-reveal ${
              i === 0 ? "col-span-7 row-span-2 aspect-[4/5]" : i === 1 ? "col-span-5 aspect-square" : i === 2 ? "col-span-5 aspect-[3/4]" : "col-span-7 aspect-[16/9]"
            }`}
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <SafeImage src={src} fallback={imagery.lifestyleFallbacks[i] ?? imagery.heroFallback} imagery={imagery} category={category} seed={`life-${i}`} className="absolute inset-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 ${compact ? "max-w-lg" : "max-w-5xl mx-auto"}`}>
      {imgs.map((src, i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-xl border ${theme.border} orch-hover-lift orch-reveal ${
            i === 0 ? "col-span-2 row-span-2 aspect-[4/5] md:col-span-2" : "aspect-square"
          }`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <SafeImage
            src={src}
            fallback={imagery.lifestyleFallbacks[i] ?? imagery.heroFallback}
            imagery={imagery}
            category={category}
            seed={`life-${i}`}
            className="absolute inset-0"
          />
        </div>
      ))}
    </div>
  );
}

export function ImageCollageHero({
  imagery,
  className = "",
  category = "generic",
}: {
  imagery: ImagerySet;
  className?: string;
  category?: ProductCategory;
}) {
  const imgs = [imagery.hero, ...imagery.lifestyle.slice(0, 3)];
  const fallbacks = [imagery.heroFallback, ...imagery.lifestyleFallbacks.slice(0, 3)];

  return (
    <div className={`grid grid-cols-4 grid-rows-2 gap-1 h-[320px] md:h-[420px] ${className}`}>
      <div className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl min-h-[160px]">
        <SafeImage
          src={imgs[0]}
          fallback={fallbacks[0]}
          chain={imagery.heroChain}
          imagery={imagery}
          category={category}
          seed="collage-0"
          className="absolute inset-0 orch-ken-burns"
          priority
        />
      </div>
      {imgs.slice(1).map((src, i) => (
        <div key={i} className="relative overflow-hidden rounded-xl min-h-[80px] orch-reveal" style={{ animationDelay: `${i * 100}ms` }}>
          <SafeImage
            src={src}
            fallback={fallbacks[i + 1] ?? imagery.heroFallback}
            imagery={imagery}
            category={category}
            seed={`collage-${i + 1}`}
            className="absolute inset-0"
          />
        </div>
      ))}
    </div>
  );
}

export function CollectionCardsGrid({
  imagery,
  theme,
  accent,
  labels = ["Valentine's", "New arrivals", "Best sellers"],
  category = "generic",
}: {
  imagery: ImagerySet;
  theme: { border: string; cardTitle: string; cardBody: string };
  accent: string;
  labels?: string[];
  category?: ProductCategory;
}) {
  const imgs = [imagery.hero, ...imagery.lifestyle.slice(0, 2)];
  const fallbacks = [imagery.heroFallback, ...imagery.lifestyleFallbacks.slice(0, 2)];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
      {imgs.map((src, i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-2xl min-h-[220px] orch-hover-lift orch-reveal border ${theme.border}`}
          style={{ animationDelay: `${i * 90}ms`, backgroundColor: `${accent}12` }}
        >
          <SafeImage
            src={src}
            fallback={fallbacks[i] ?? imagery.heroFallback}
            imagery={imagery}
            category={category}
            seed={`collection-${i}`}
            className="absolute inset-0 opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-[2]" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-center z-[3]">
            <p className="text-[10px] uppercase tracking-widest text-white/70 mb-1">Shop collection</p>
            <p className="text-lg font-serif font-light text-white mb-3">{labels[i] ?? "Explore"}</p>
            <span className="text-xs font-bold text-slate-900 bg-white px-4 py-2 rounded-full">Shop now</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ImageFeatureCards({
  items,
  imagery,
  theme,
  accent,
  category = "generic",
}: {
  items: { title: string; description: string }[];
  imagery: ImagerySet;
  theme: { border: string; card: string; cardTitle: string; cardBody: string };
  accent: string;
  category?: ProductCategory;
}) {
  const imgs = [...imagery.lifestyle, imagery.hero];
  const fallbacks = [...imagery.lifestyleFallbacks, imagery.heroFallback];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
      {items.map((item, i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-2xl min-h-[200px] border ${theme.border} orch-hover-lift orch-reveal`}
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <SafeImage
            src={imgs[i % imgs.length]}
            fallback={fallbacks[i % fallbacks.length] ?? imagery.heroFallback}
            imagery={imagery}
            category={category}
            seed={`feature-${i}`}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent z-[2]" />
          <div className="absolute bottom-0 left-0 right-0 p-4 z-[3]">
            <p className="text-sm font-bold text-white mb-1">{item.title}</p>
            <p className="text-xs text-white/80 leading-relaxed line-clamp-2">{item.description}</p>
          </div>
          <div
            className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white z-[3]"
            style={{ backgroundColor: accent }}
          >
            {i + 1}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductShowcaseGrid({
  products,
  theme,
  accent,
  category = "generic",
}: {
  products: ImagerySet["products"];
  theme: { border: string; card: string; cardTitle: string; cardBody: string };
  accent: string;
  category?: ProductCategory;
}) {
  const displayProducts = hydratedProducts(products);

  if (!displayProducts.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {displayProducts.map((p, i) => (
        <div
          key={p.name}
          className={`rounded-2xl overflow-hidden border ${theme.border} ${theme.card} orch-hover-lift orch-reveal`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <SafeImage
              src={p.image}
              fallback={p.imageFallback}
              chain={p.imageChain}
              category={category}
              seed={`product-${i}`}
            />
            <span
              className="absolute top-3 right-3 z-[3] text-[10px] font-bold px-2 py-1 rounded-full bg-white/90"
              style={{ color: accent }}
            >
              New
            </span>
          </div>
          <div className="p-4">
            <p className={`text-sm font-bold ${theme.cardTitle}`}>{p.name}</p>
            <p className={`text-xs mt-1 ${theme.cardBody}`} style={{ color: accent }}>
              {p.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PromoBannerStrip({
  imagery,
  theme,
  accent,
  headline,
  subline,
  category = "generic",
}: {
  imagery: ImagerySet;
  theme: { border: string; cardTitle: string; cardBody: string };
  accent: string;
  headline: string;
  subline?: string;
  category?: ProductCategory;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl min-h-[200px] md:min-h-[280px] border ${theme.border} orch-reveal`}>
      <SafeImage
        src={imagery.lifestyle[0] ?? imagery.hero}
        fallback={imagery.lifestyleFallbacks[0] ?? imagery.heroFallback}
        imagery={imagery}
        category={category}
        seed="promo"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent z-[3]" />
      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 z-[4] max-w-xl">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/70 mb-2">Limited offer</p>
        <h3 className="text-2xl md:text-3xl font-serif font-light text-white mb-2 leading-tight">{headline}</h3>
        {subline && <p className="text-sm text-white/80 mb-4">{subline}</p>}
        <span className="text-xs font-bold text-slate-900 bg-white px-5 py-2.5 rounded-full w-fit">Shop the edit</span>
      </div>
      <div
        className="absolute top-4 right-4 z-[4] text-[10px] font-bold px-3 py-1 rounded-full"
        style={{ backgroundColor: accent, color: "#fff" }}
      >
        New
      </div>
    </div>
  );
}

export function CategoryBrowseRow({
  imagery,
  theme,
  accent,
  labels,
  category = "generic",
}: {
  imagery: ImagerySet;
  theme: { border: string; cardTitle: string };
  accent: string;
  labels: string[];
  category?: ProductCategory;
}) {
  const imgs = [...imagery.lifestyle, imagery.hero];
  const fallbacks = [...imagery.lifestyleFallbacks, imagery.heroFallback];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-5xl mx-auto">
      {labels.slice(0, 4).map((label, i) => (
        <div
          key={label}
          className={`relative overflow-hidden rounded-2xl min-h-[140px] md:min-h-[180px] border ${theme.border} orch-hover-lift orch-reveal cursor-pointer group`}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <SafeImage
            src={imgs[i % imgs.length]}
            fallback={fallbacks[i % fallbacks.length] ?? imagery.heroFallback}
            imagery={imagery}
            category={category}
            seed={`cat-${i}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent z-[3] group-hover:from-black/75 transition-colors" />
          <div className="absolute bottom-0 left-0 right-0 p-4 z-[4]">
            <p className="text-sm font-bold text-white">{label}</p>
            <p className="text-[10px] text-white/70 mt-0.5" style={{ color: `${accent}` }}>
              Browse →
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SourcingStoryStrip({
  imagery,
  theme,
  accent,
  headline,
  body,
  category = "generic",
}: {
  imagery: ImagerySet;
  theme: { border: string; cardTitle: string; cardBody: string; heroText: string };
  accent: string;
  headline: string;
  body: string;
  category?: ProductCategory;
}) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 max-w-6xl mx-auto`}>
      <div className={`lg:col-span-5 relative overflow-hidden rounded-2xl min-h-[320px] border ${theme.border} orch-reveal`}>
        <SafeImage
          src={imagery.lifestyle[2] ?? imagery.hero}
          fallback={imagery.lifestyleFallbacks[2] ?? imagery.heroFallback}
          imagery={imagery}
          category={category}
          seed="sourcing-a"
          className="absolute inset-0 orch-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-[2]" />
      </div>
      <div className={`lg:col-span-7 flex flex-col justify-center p-6 md:p-10 rounded-2xl border ${theme.border} orch-reveal`} style={{ animationDelay: "120ms" }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: accent }}>
          From farm to table
        </p>
        <h3 className={`text-2xl md:text-3xl font-serif font-light leading-tight mb-4 ${theme.heroText}`}>{headline}</h3>
        <p className={`text-sm leading-relaxed mb-6 ${theme.cardBody}`}>{body}</p>
        <div className="grid grid-cols-3 gap-2">
          {[imagery.lifestyle[3], imagery.lifestyle[4], imagery.products[0]?.image].filter(Boolean).map((src, i) => (
            <div key={i} className={`relative aspect-square rounded-xl overflow-hidden border ${theme.border}`}>
              <SafeImage
                src={src as string}
                fallback={imagery.lifestyleFallbacks[i + 3] ?? imagery.heroFallback}
                imagery={imagery}
                category={category}
                seed={`sourcing-${i}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SubscriptionShowcase({
  products,
  imagery,
  theme,
  accent,
  category = "generic",
}: {
  products: ImagerySet["products"];
  imagery: ImagerySet;
  theme: { border: string; card: string; cardTitle: string; cardBody: string; heroText: string };
  accent: string;
  category?: ProductCategory;
}) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6`}>
        {products.map((p, i) => (
          <div
            key={p.name}
            className={`rounded-2xl overflow-hidden border ${theme.border} ${theme.card} orch-hover-lift orch-reveal`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <SafeImage
                src={p.image}
                fallback={p.imageFallback}
                chain={p.imageChain}
                imagery={imagery}
                category={category}
                seed={`sub-${i}`}
              />
              {i === 1 && (
                <span
                  className="absolute top-3 left-3 z-[3] text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-white/95"
                  style={{ color: accent }}
                >
                  Most popular
                </span>
              )}
            </div>
            <div className="p-5">
              <p className={`text-xs uppercase tracking-widest mb-1 ${theme.cardBody}`} style={{ color: accent }}>
                Subscription
              </p>
              <p className={`text-base font-bold mb-1 ${theme.cardTitle}`}>{p.name}</p>
              <p className={`text-sm font-semibold mb-3 ${theme.cardBody}`} style={{ color: accent }}>
                {p.price}
              </p>
              <span className="text-xs font-bold underline underline-offset-4" style={{ color: accent }}>
                Build your box →
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={`mt-6 relative overflow-hidden rounded-2xl min-h-[160px] border ${theme.border} orch-reveal`}>
        <SafeImage
          src={imagery.lifestyle[5] ?? imagery.lifestyle[0]}
          fallback={imagery.lifestyleFallbacks[5] ?? imagery.heroFallback}
          imagery={imagery}
          category={category}
          seed="sub-banner"
        />
        <div className="absolute inset-0 bg-black/40 z-[2]" />
        <div className="absolute inset-0 flex items-center justify-center z-[3] px-6 text-center">
          <p className="text-sm md:text-base font-serif font-light text-white max-w-md">
            Delivered fresh. Curated weekly. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}

export function CinematicBackground({
  style,
  accent,
  meshFrom,
  meshTo,
}: {
  style: BackgroundStyle;
  accent: string;
  meshFrom: string;
  meshTo: string;
}) {
  if (style === "none") return null;

  const base = "absolute inset-0 pointer-events-none overflow-hidden";

  if (style === "space") {
    return (
      <div className={base}>
        <div className="absolute inset-0 bg-[#030712]" />
        <div className="orch-aurora-drift absolute -top-1/2 -left-1/4 w-[150%] h-[150%] opacity-40 rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 60%)` }} />
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full orch-twinkle"
            style={{
              top: `${(i * 17) % 100}%`,
              left: `${(i * 23) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.3 + (i % 5) * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  if (style === "photo") {
    return null;
  }

  if (style === "editorial") {
    return (
      <div className={base}>
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-white to-stone-50 opacity-80" />
        <div className="orch-gradient-drift absolute inset-0 opacity-30" style={{ background: `linear-gradient(120deg, ${meshFrom}22, transparent 40%, ${meshTo}18)` }} />
      </div>
    );
  }

  if (style === "soft") {
    return (
      <div className={base}>
        <div className="orch-gradient-drift absolute inset-0 opacity-50" style={{ background: `linear-gradient(135deg, ${meshFrom}18, ${meshTo}12, transparent 70%)` }} />
      </div>
    );
  }

  if (style === "aurora") {
    return (
      <div className={base}>
        <div className="orch-aurora-drift absolute -top-1/3 left-0 w-full h-2/3 opacity-35 blur-3xl" style={{ background: `linear-gradient(90deg, ${meshFrom}, ${accent}, ${meshTo})` }} />
      </div>
    );
  }

  if (style === "gradient-drift") {
    return (
      <div className={base}>
        <div className="orch-gradient-drift absolute inset-0 opacity-40" style={{ background: `linear-gradient(135deg, ${meshFrom}30, ${accent}20, ${meshTo}25)` }} />
      </div>
    );
  }

  return (
    <div className={base}>
      <div className="orch-mesh-drift absolute inset-0 opacity-35" style={{ background: `radial-gradient(ellipse at 20% 30%, ${meshFrom}40, transparent 50%), radial-gradient(ellipse at 80% 70%, ${meshTo}35, transparent 45%)` }} />
    </div>
  );
}
