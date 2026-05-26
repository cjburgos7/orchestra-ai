"use client";

import type { DirectionTheme } from "@/lib/orchestration/direction-themes";
import type { DirectionId, GeneratedSections, ImagerySet, StartupBrief } from "@/lib/types/startup";
import { LifestyleGrid, ProductShowcaseGrid, CollectionCardsGrid, PromoBannerStrip, CategoryBrowseRow, SourcingStoryStrip, SubscriptionShowcase } from "./CreativeImagery";
import SafeImage from "./SafeImage";
import { getWorldCollectionLabels, getWorldCategoryLabels } from "@/lib/orchestration/creative-imagery";
import { resolveCategory } from "@/lib/orchestration/category-resolution";
import { hydratedProducts } from "@/lib/slot-hydration";
import { Reveal } from "./VisualMotion";

export function StorySection({
  brief,
  sections,
  theme,
  gap,
  accent,
  imagery,
  category,
}: {
  brief: StartupBrief;
  sections: GeneratedSections;
  theme: DirectionTheme;
  gap: string;
  accent: string;
  imagery?: ImagerySet;
  category?: import("@/lib/types/startup").ProductCategory;
}) {
  return (
    <section className={`${gap} border-t scroll-mt-28 ${theme.section} ${theme.border}`}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {imagery ? (
          <Reveal>
            <div className={`relative overflow-hidden rounded-2xl min-h-[360px] md:min-h-[440px] border ${theme.border}`}>
              <SafeImage
                src={imagery.lifestyle[1] ?? imagery.hero}
                fallback={imagery.lifestyleFallbacks[1] ?? imagery.heroFallback}
                chain={imagery.heroChain}
                category={category ?? "generic"}
                seed="story"
                className="orch-ken-burns"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent z-[2]" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-[3]">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/75 mb-1">Our story</p>
                <p className="text-lg font-serif font-light text-white leading-snug line-clamp-2">{brief.tagline}</p>
              </div>
            </div>
          </Reveal>
        ) : null}
        <Reveal delay={imagery ? 150 : 0}>
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${theme.cardBody}`} style={{ color: accent }}>
              Our story
            </p>
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 leading-tight ${theme.heroText}`}>
              Built for {brief.audience || "founders who move fast"}
            </h2>
            <p className={`text-sm leading-relaxed mb-4 ${theme.cardBody}`}>{brief.description}</p>
            <p className={`text-sm italic ${theme.cardBody}`}>
              &ldquo;{sections.testimonials[0]?.quote}&rdquo;
            </p>
            <p className={`text-xs font-bold mt-3 ${theme.cardTitle}`}>
              — {sections.testimonials[0]?.name}, {sections.testimonials[0]?.role}
            </p>
          </div>
        </Reveal>
      </div>
      <Reveal delay={200}>
        <div className={`mt-10 rounded-2xl p-8 max-w-3xl mx-auto ${theme.card} border ${theme.border}`}>
          <div className="space-y-6">
            {sections.features.items.slice(0, 3).map((item, i) => (
              <div key={i} className={`flex gap-4 ${i < 2 ? `pb-6 border-b ${theme.border}` : ""}`}>
                <span className="text-2xl font-black opacity-20" style={{ color: accent }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className={`text-sm font-bold mb-1 ${theme.cardTitle}`}>{item.title}</p>
                  <p className={`text-xs leading-relaxed ${theme.cardBody}`}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function LifestyleSection({
  imagery,
  theme,
  gap,
  accent,
  compact,
  category,
  direction = "orchestra",
}: {
  imagery: ImagerySet;
  theme: DirectionTheme;
  gap: string;
  accent: string;
  compact?: boolean;
  category?: import("@/lib/types/startup").ProductCategory;
  direction?: DirectionId;
}) {
  return (
    <section className={`${gap} border-t scroll-mt-28 ${theme.section} ${theme.border}`}>
      <div className="text-center mb-10 max-w-xl mx-auto">
        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme.cardBody}`} style={{ color: accent }}>
          Lifestyle
        </p>
        <h2 className={`text-2xl md:text-3xl font-serif font-light ${theme.heroText}`}>Designed for real life</h2>
        <p className={`text-sm mt-3 ${theme.cardBody}`}>Editorial photography from our community and kitchens.</p>
      </div>
      <LifestyleGrid imagery={imagery} theme={theme} compact={compact} category={category} direction={direction} />
    </section>
  );
}

export function SourcingSection({
  imagery,
  theme,
  gap,
  accent,
  brief,
  category,
}: {
  imagery: ImagerySet;
  theme: DirectionTheme;
  gap: string;
  accent: string;
  brief: StartupBrief;
  category?: import("@/lib/types/startup").ProductCategory;
}) {
  return (
    <section id="section-sourcing" className={`${gap} border-t scroll-mt-28 ${theme.section} ${theme.border}`}>
      <SourcingStoryStrip
        imagery={imagery}
        theme={theme}
        accent={accent}
        headline={`Sourced with care for ${brief.audience || "every table"}`}
        body={brief.description || brief.tagline}
        category={category}
      />
    </section>
  );
}

export function SubscriptionSection({
  imagery,
  theme,
  gap,
  accent,
  category,
}: {
  imagery: ImagerySet;
  theme: DirectionTheme;
  gap: string;
  accent: string;
  category?: import("@/lib/types/startup").ProductCategory;
}) {
  return (
    <section id="section-subscription" className={`${gap} border-t scroll-mt-28 ${theme.section} ${theme.border}`}>
      <div className="text-center mb-10 max-w-lg mx-auto">
        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme.cardBody}`} style={{ color: accent }}>
          Subscribe
        </p>
        <h2 className={`text-2xl md:text-3xl font-serif font-light ${theme.heroText}`}>Build your weekly box</h2>
      </div>
      <SubscriptionShowcase products={imagery.products} imagery={imagery} theme={theme} accent={accent} category={category} />
    </section>
  );
}

export function ProductShowcaseSection({
  imagery,
  theme,
  gap,
  accent,
  title,
  category,
}: {
  imagery: ImagerySet;
  theme: DirectionTheme;
  gap: string;
  accent: string;
  title?: string;
  category?: import("@/lib/types/startup").ProductCategory;
}) {
  const products = hydratedProducts(imagery.products);
  if (!products.length) return null;

  return (
    <section id="section-showcase" className={`${gap} border-t scroll-mt-28 ${theme.section} ${theme.border}`}>
      <div className="text-center mb-10 max-w-lg mx-auto">
        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme.cardBody}`} style={{ color: accent }}>
          Collection
        </p>
        <h2 className={`text-xl md:text-2xl font-bold ${theme.heroText}`}>{title ?? "Featured products"}</h2>
      </div>
      <ProductShowcaseGrid products={products} theme={theme} accent={accent} category={category} />
    </section>
  );
}

export function CollectionSection({
  imagery,
  theme,
  gap,
  accent,
  brief,
  category = "generic",
}: {
  imagery: ImagerySet;
  theme: DirectionTheme;
  gap: string;
  accent: string;
  brief: StartupBrief;
  category?: import("@/lib/types/startup").ProductCategory;
}) {
  const labels = getWorldCollectionLabels(resolveCategory(brief), brief);
  return (
    <section id="section-collections" className={`${gap} border-t scroll-mt-28 ${theme.section} ${theme.border}`}>
      <div className="text-center mb-10 max-w-lg mx-auto">
        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme.cardBody}`} style={{ color: accent }}>
          Collections
        </p>
        <h2 className={`text-xl md:text-2xl font-bold ${theme.heroText}`}>Curated for every moment</h2>
      </div>
      <CollectionCardsGrid imagery={imagery} theme={theme} accent={accent} labels={labels} category={category} />
    </section>
  );
}

export function PromoSection({
  imagery,
  theme,
  gap,
  accent,
  brief,
  category,
}: {
  imagery: ImagerySet;
  theme: DirectionTheme;
  gap: string;
  accent: string;
  brief: StartupBrief;
  category?: import("@/lib/types/startup").ProductCategory;
}) {
  return (
    <section id="section-promo" className={`${gap} border-t scroll-mt-28 ${theme.section} ${theme.border}`}>
      <div className="max-w-5xl mx-auto">
        <PromoBannerStrip
          imagery={imagery}
          theme={theme}
          accent={accent}
          headline={brief.features[0] ?? "Discover the new collection"}
          subline={brief.tagline}
          category={category}
        />
      </div>
    </section>
  );
}

export function CategoriesSection({
  imagery,
  theme,
  gap,
  accent,
  brief,
  category,
}: {
  imagery: ImagerySet;
  theme: DirectionTheme;
  gap: string;
  accent: string;
  brief: StartupBrief;
  category?: import("@/lib/types/startup").ProductCategory;
}) {
  const labels = getWorldCategoryLabels(resolveCategory(brief), brief);

  return (
    <section id="section-categories" className={`${gap} border-t scroll-mt-28 ${theme.section} ${theme.border}`}>
      <div className="text-center mb-8 max-w-lg mx-auto">
        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme.cardBody}`} style={{ color: accent }}>
          Shop by category
        </p>
        <h2 className={`text-xl md:text-2xl font-bold ${theme.heroText}`}>Find your perfect match</h2>
      </div>
      <CategoryBrowseRow imagery={imagery} theme={theme} accent={accent} labels={labels} category={category} />
    </section>
  );
}
