"use client";

import type { DirectionId, GeneratedSections, HomeSectionId, StartupBrief, StartupLogo } from "@/lib/types/startup";
import type { DirectionTheme } from "@/lib/orchestration/direction-themes";
import { resolveCreativeLayout } from "@/lib/orchestration/creative-layouts";
import { resolvePhotoTreatment } from "@/lib/orchestration/art-direction";
import { getCategoryLabel } from "@/lib/orchestration/product-visuals";
import WebsiteVisuals, { VisualGallery } from "./WebsiteVisuals";
import { CinematicBackground, HeroImagery, ImageCollageHero, ImageFeatureCards } from "./CreativeImagery";
import { LifestyleSection, ProductShowcaseSection, StorySection, CollectionSection, PromoSection, CategoriesSection, SourcingSection, SubscriptionSection } from "./CreativeSections";
import { AnalyticsDashboardSection, PlatformShowcaseSection, MetricsBandSection, SeasonalDropsSection } from "./CategoryNativeSections";
import SafeImage from "./SafeImage";
import { MotionRoot, Reveal, HoverLift, StaggerSection } from "./VisualMotion";
import CinematicWorld from "./cinematic/CinematicWorld";
import { isPremiumDarkDirection } from "@/lib/cinematic";
import { hasDirectionEngine } from "@/lib/direction-engine/registry";

type Props = {
  brief: StartupBrief;
  sections: GeneratedSections;
  theme: DirectionTheme;
  direction: DirectionId;
  isPreview: boolean;
  accentColor: string;
  logo?: StartupLogo | null;
  seed?: string;
};

export function LayoutHomePage({
  brief,
  sections,
  theme,
  direction,
  isPreview,
  accentColor,
  logo,
  seed = brief.name,
}: Props) {
  const visuals = sections.visuals;
  const layout = visuals?.layout ?? resolveCreativeLayout(brief, direction, seed);
  const imagery = visuals?.imagery;
  const productCategory = visuals?.productCategory ?? "generic";
  const pad = isPreview ? "px-6 py-10" : `px-6 ${layout.heroPadding}`;
  const gap = isPreview ? "px-6 py-8" : `px-6 ${layout.sectionGap}`;
  const scale = isPreview ? "text-2xl" : `${layout.headlineScale} ${layout.typographyModifier}`;
  const round = layout.ctaRounded;
  const heroVisual = visuals?.heroVisual ?? "dashboard";
  const motion = visuals?.motion ?? "calm";
  const imageryOnly = visuals?.imageryOnly ?? false;
  const treatment = resolvePhotoTreatment(direction);

  // Premium Dark is an opt-in cinematic flavor — default orchestra uses the rich layout below
  if (isPremiumDarkDirection(direction) && hasDirectionEngine(direction)) {
    return (
      <CinematicWorld
        brief={brief}
        sections={sections}
        theme={theme}
        direction={direction}
        isPreview={isPreview}
        accentColor={accentColor}
        logo={logo}
        seed={seed}
      />
    );
  }

  const showProductUI = !imageryOnly;

  const centeredHeroes = [
    "centered", "minimal", "cinematic", "editorial", "immersive", "visual-first", "fullscreen", "collage", "product-first",
  ];

  const ctas = (
    <div
      className={`flex flex-wrap gap-3 ${
        centeredHeroes.includes(layout.hero) ? "justify-center" : "justify-start"
      }`}
    >
      <span className={`text-sm font-bold px-6 py-3 ${round} ${theme.ctaPrimary}`}>
        {sections.hero.ctaPrimary}
      </span>
      <span className={`text-sm font-semibold px-6 py-3 ${round} ${theme.ctaSecondary}`}>
        {sections.hero.ctaSecondary}
      </span>
    </div>
  );

  const heroVisualEl =
    visuals &&
    showProductUI && (
      <Reveal delay={200}>
        <WebsiteVisuals
          visualId={heroVisual}
          theme={theme}
          accentColor={accentColor}
          compact={isPreview}
          animate
          label
        />
      </Reveal>
    );

  const heroImageryEl = imagery && layout.heroImagery !== "minimal" && (
    <Reveal delay={100}>
      <HeroImagery
        imagery={imagery}
        accent={accentColor}
        mode={layout.heroImagery === "background" ? "background" : "hero"}
        className={layout.heroImagery === "full" ? "h-full min-h-[280px]" : ""}
        category={productCategory}
        seed={seed}
        direction={direction}
      />
    </Reveal>
  );

  function HeroBlock() {
    const categoryLabel = visuals ? getCategoryLabel(visuals.productCategory) : null;
    const eyebrow = (
      <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${theme.eyebrow}`}>
        {categoryLabel ? `${categoryLabel} · ${sections.hero.eyebrow}` : sections.hero.eyebrow}
      </span>
    );
    const headline = (
      <h1 className={`${scale} mb-4 leading-tight ${theme.heroText}`}>{sections.hero.headline}</h1>
    );
    const sub = (
      <p
        className={`${isPreview ? "text-sm" : "text-lg"} max-w-xl mb-8 leading-relaxed ${theme.heroSub} ${
          centeredHeroes.includes(layout.hero) ? "mx-auto text-center" : ""
        }`}
      >
        {sections.hero.subheadline}
      </p>
    );

    const bg =
      imagery && layout.backgroundStyle !== "none" ? (
        <CinematicBackground
          style={layout.backgroundStyle}
          accent={accentColor}
          meshFrom={imagery.meshFrom}
          meshTo={imagery.meshTo}
        />
      ) : null;

    if (layout.hero === "fullscreen" && imagery) {
      return (
        <div className={`relative border-b overflow-hidden flex items-end ${treatment.heroMinHeight} ${theme.border}`}>
          <HeroImagery imagery={imagery} accent={accentColor} mode="background" direction={direction} />
          <div className={`relative z-10 w-full ${pad}`}>
            <div className={`max-w-2xl ${treatment.headlineTracking}`}>
              {eyebrow}
              {headline}
              {sub}
              {ctas}
            </div>
          </div>
        </div>
      );
    }

    if (layout.hero === "collage" && imagery) {
      return (
        <div className={`border-b ${theme.hero} ${theme.border}`}>
          <div className={`${isPreview ? "px-4 py-6" : "px-6 py-10"} max-w-6xl mx-auto`}>
            <ImageCollageHero imagery={imagery} category={productCategory} />
          </div>
          <div className={`${pad} text-center max-w-3xl mx-auto`}>
            {eyebrow}
            {headline}
            {sub}
            {ctas}
          </div>
        </div>
      );
    }

    if (layout.hero === "editorial-split" && imagery) {
      return (
        <div className={`border-b grid grid-cols-1 lg:grid-cols-2 min-h-[420px] ${theme.border}`}>
          <div className={`${pad} flex flex-col justify-center`} style={{ backgroundColor: `${accentColor}12` }}>
            {eyebrow}
            {headline}
            {sub}
            {ctas}
          </div>
          <div className="relative min-h-[280px] lg:min-h-full overflow-hidden">
            <SafeImage
              src={imagery.hero}
              fallback={imagery.heroFallback}
              chain={imagery.heroChain}
              imagery={imagery}
              category={productCategory}
              seed={`${seed}-hero`}
              alt={imagery.heroAlt}
              className="orch-ken-burns"
              priority
            />
          </div>
        </div>
      );
    }

    if (layout.hero === "product-first" && imagery) {
      return (
        <div className={`border-b ${theme.hero} ${theme.border}`}>
          <div className={`${pad} max-w-6xl mx-auto`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
              <div>
                {eyebrow}
                {headline}
                {sub}
                {ctas}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {imagery.products.map((p, i) => (
                  <div key={p.name} className="rounded-xl overflow-hidden orch-hover-lift">
                    <div className="relative aspect-[3/4]">
                      <SafeImage
                        src={p.image}
                        fallback={p.imageFallback}
                        chain={p.imageChain}
                        imagery={imagery}
                        category={productCategory}
                        seed={`${seed}-prod-${i}`}
                        alt={p.name}
                      />
                    </div>
                    <p className={`text-[10px] font-bold text-center py-1 ${theme.cardTitle}`}>{p.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (layout.hero === "editorial" && imagery) {
      return (
        <div className={`${pad} border-b relative overflow-hidden min-h-[420px] flex items-end ${theme.hero} ${theme.border}`}>
          <HeroImagery imagery={imagery} accent={accentColor} mode="background" />
          <div className="relative z-10 max-w-2xl pb-4">
            {eyebrow}
            {headline}
            {sub}
            {ctas}
          </div>
        </div>
      );
    }

    if (layout.hero === "immersive" && imagery) {
      return (
        <div className={`${pad} border-b relative overflow-hidden ${theme.hero} ${theme.border}`}>
          {bg}
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                {eyebrow}
                {headline}
                {sub}
                {ctas}
              </div>
              <div className="relative">
                {heroImageryEl}
                <div className="absolute -bottom-4 -right-4 w-3/4 max-w-xs">{heroVisualEl}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (layout.hero === "visual-first") {
      return (
        <div className={`border-b ${theme.hero} ${theme.border}`}>
          {imagery && (
            <div className="relative max-h-[420px] overflow-hidden">
              {heroImageryEl}
            </div>
          )}
          <div className={`${pad} text-center max-w-3xl mx-auto`}>
            {eyebrow}
            {headline}
            {sub}
            {ctas}
            {heroVisualEl && <div className="mt-8">{heroVisualEl}</div>}
          </div>
        </div>
      );
    }

    if (layout.hero === "asymmetrical") {
      return (
        <div className={`${pad} border-b relative overflow-hidden ${theme.hero} ${theme.border}`}>
          {bg}
          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 lg:col-start-2">
              {eyebrow}
              {headline}
              {sub}
              {ctas}
            </div>
            <div className="lg:col-span-5 lg:col-start-7 space-y-4">
              {heroImageryEl ?? heroVisualEl}
            </div>
          </div>
        </div>
      );
    }

    if (layout.hero === "split") {
      return (
        <div className={`${pad} border-b relative overflow-hidden ${theme.hero} ${theme.border}`}>
          {bg}
          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              {eyebrow}
              {headline}
              {sub}
              {ctas}
            </div>
            <div>{heroImageryEl ?? heroVisualEl}</div>
          </div>
        </div>
      );
    }

    if (layout.hero === "left") {
      return (
        <div className={`${pad} border-b text-left relative overflow-hidden ${theme.hero} ${theme.border}`}>
          {bg}
          <div className="relative z-10 max-w-3xl">
            {eyebrow}
            {headline}
            {sub}
            {ctas}
          </div>
          {(heroImageryEl || heroVisualEl) && (
            <div className="relative z-10 max-w-2xl mt-10">{heroImageryEl ?? heroVisualEl}</div>
          )}
        </div>
      );
    }

    if (layout.hero === "cinematic") {
      if (imagery) {
        return (
          <div className={`relative border-b overflow-hidden flex items-end ${treatment.heroMinHeight} ${theme.border}`}>
            <HeroImagery imagery={imagery} accent={accentColor} mode="background" direction={direction} />
            <div className={`relative z-10 w-full ${pad}`}>
              <div className={`max-w-3xl mx-auto text-center ${treatment.headlineTracking}`}>
                {eyebrow}
                {headline}
                {sub}
                {ctas}
              </div>
            </div>
          </div>
        );
      }
      return (
        <div className={`${pad} border-b relative overflow-hidden ${theme.hero} ${theme.border}`}>
          {bg ?? (
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 0%, ${accentColor}, transparent 70%)` }}
            />
          )}
          <div className="relative text-center max-w-4xl mx-auto z-10">
            {eyebrow}
            {headline}
            {sub}
            {ctas}
            {heroVisualEl}
          </div>
        </div>
      );
    }

    if (layout.hero === "minimal") {
      return (
        <div className={`${pad} border-b ${theme.hero} ${theme.border}`}>
          <div className="max-w-2xl mx-auto text-center">
            {logo && (
              <p className={`text-xs uppercase tracking-[0.3em] mb-6 opacity-40 ${theme.heroSub}`}>
                {logo.wordmark}
              </p>
            )}
            {headline}
            {sub}
            {ctas}
          </div>
        </div>
      );
    }

    return (
      <div className={`${pad} border-b text-center relative overflow-hidden ${theme.hero} ${theme.border}`}>
        {bg}
        <div className="relative z-10">
          {eyebrow}
          {headline}
          {sub}
          {ctas}
          {heroImageryEl ?? heroVisualEl}
        </div>
      </div>
    );
  }

  function FeaturesBlock() {
    const title = (
      <h2
        className={`text-xs font-bold uppercase tracking-widest mb-8 ${
          layout.features === "list" ? "text-left" : "text-center"
        } ${theme.cardBody}`}
      >
        {sections.features.sectionTitle}
      </h2>
    );

    if (layout.imageFeatures && imagery) {
      return (
        <section id="section-features" className={`${gap} scroll-mt-28 ${theme.section}`}>
          {title}
          <ImageFeatureCards
            items={sections.features.items}
            imagery={imagery}
            theme={theme}
            accent={accentColor}
            category={productCategory}
          />
        </section>
      );
    }

    if (layout.features === "list") {
      return (
        <section id="section-features" className={`${gap} scroll-mt-28 ${theme.section}`}>
          <div className="max-w-3xl mx-auto">
            {title}
            <div className="space-y-0">
              {sections.features.items.map((item, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className={`flex gap-6 py-6 border-b ${theme.border}`}>
                    <span className={`text-2xl font-black opacity-15 ${theme.cardTitle}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className={`text-base font-bold mb-1 ${theme.cardTitle}`}>{item.title}</p>
                      <p className={`text-sm leading-relaxed ${theme.cardBody}`}>{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (layout.features === "staggered") {
      return (
        <section id="section-features" className={`${gap} scroll-mt-28 ${theme.section}`}>
          {title}
          <StaggerSection className="max-w-4xl mx-auto space-y-4">
            {sections.features.items.map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <HoverLift>
                  <div
                    className={`rounded-2xl p-6 ${theme.card}`}
                    style={{ marginLeft: i % 2 === 1 ? "2rem" : 0 }}
                  >
                    <p className={`text-lg font-bold mb-2 ${theme.cardTitle}`}>{item.title}</p>
                    <p className={`text-sm ${theme.cardBody}`}>{item.description}</p>
                  </div>
                </HoverLift>
              </Reveal>
            ))}
          </StaggerSection>
        </section>
      );
    }

    if (layout.features === "bento") {
      return (
        <section id="section-features" className={`${gap} scroll-mt-28 ${theme.section}`}>
          {title}
          <StaggerSection className="max-w-4xl mx-auto grid grid-cols-2 gap-3">
            {sections.features.items.map((item, i) => (
              <Reveal key={i} delay={i * 60} className={i === 0 ? "col-span-2" : ""}>
                <HoverLift>
                  <div className={`rounded-2xl p-5 h-full ${theme.card}`}>
                    <p className={`text-sm font-bold mb-2 ${theme.cardTitle}`}>{item.title}</p>
                    <p className={`text-xs leading-relaxed ${theme.cardBody}`}>{item.description}</p>
                  </div>
                </HoverLift>
              </Reveal>
            ))}
          </StaggerSection>
        </section>
      );
    }

    const cols =
      layout.features === "grid-2"
        ? "grid-cols-1 sm:grid-cols-2 max-w-3xl"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl";

    return (
      <section id="section-features" className={`${gap} scroll-mt-28 ${theme.section}`}>
        {title}
        <div className={`grid gap-4 mx-auto ${cols}`}>
          {sections.features.items.map((item, i) => (
            <HoverLift key={i}>
              <div className={`rounded-2xl p-5 h-full ${theme.card}`}>
                <p className={`text-sm font-bold mb-2 ${theme.cardTitle}`}>{item.title}</p>
                <p className={`text-xs leading-relaxed ${theme.cardBody}`}>{item.description}</p>
              </div>
            </HoverLift>
          ))}
        </div>
        {visuals && showProductUI && (
          <Reveal delay={300}>
            <VisualGallery visuals={visuals} theme={theme} accentColor={accentColor} compact={isPreview} />
          </Reveal>
        )}
      </section>
    );
  }

  function TestimonialsBlock() {
    if (layout.testimonials === "featured") {
      const t = sections.testimonials[0];
      return (
        <section className={`${gap} border-t ${theme.section} ${theme.border}`}>
          <div className={`max-w-3xl mx-auto text-center rounded-3xl p-10 ${theme.card}`}>
            <p className={`text-xl md:text-2xl italic leading-relaxed mb-6 ${theme.cardBody}`}>
              &ldquo;{t?.quote}&rdquo;
            </p>
            <p className={`text-sm font-bold ${theme.cardTitle}`}>{t?.name}</p>
            <p className={`text-xs ${theme.cardBody}`}>{t?.role}</p>
          </div>
        </section>
      );
    }

    if (layout.testimonials === "minimal") {
      return (
        <section className={`${gap} border-t ${theme.section} ${theme.border}`}>
          <div className="max-w-xl mx-auto text-center">
            <p className={`text-lg italic ${theme.cardBody}`}>
              &ldquo;{sections.testimonials[0]?.quote}&rdquo;
            </p>
            <p className={`text-xs mt-4 ${theme.cardTitle}`}>— {sections.testimonials[0]?.name}</p>
          </div>
        </section>
      );
    }

    return (
      <section className={`${gap} border-t ${theme.section} ${theme.border}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {sections.testimonials.map((t, i) => (
            <HoverLift key={i}>
              <div className={`rounded-2xl p-5 h-full ${theme.card}`}>
                <p className={`text-sm italic leading-relaxed mb-4 ${theme.cardBody}`}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className={`text-xs font-bold ${theme.cardTitle}`}>{t.name}</p>
                <p className={`text-[11px] ${theme.cardBody}`}>{t.role}</p>
              </div>
            </HoverLift>
          ))}
        </div>
      </section>
    );
  }

  function PricingBlock() {
    return (
      <section
        id="section-pricing"
        className={`${gap} border-t scroll-mt-28 ${theme.section} ${theme.border}`}
      >
        <div className="text-center mb-8 max-w-lg mx-auto">
          <h2 className={`text-lg font-bold mb-2 ${theme.cardTitle}`}>{sections.pricing.sectionTitle}</h2>
          <p className={`text-sm ${theme.cardBody}`}>{sections.pricing.subtitle}</p>
        </div>
        <div
          className={`grid gap-4 max-w-3xl mx-auto ${
            layout.features === "list" ? "grid-cols-1 max-w-md" : "grid-cols-1 sm:grid-cols-3"
          }`}
        >
          {brief.pricing.tiers.map((tier, i) => (
            <HoverLift key={tier.name}>
              <div
                className={`rounded-2xl p-6 text-center border h-full ${
                  i === 1 ? theme.pricingHighlight : theme.pricingDefault
                }`}
              >
                <p className="text-xs font-bold uppercase opacity-70 mb-1">{tier.name}</p>
                <p className="text-2xl font-black mb-2">{tier.price}</p>
                <p className="text-xs opacity-70 leading-snug">{tier.detail}</p>
              </div>
            </HoverLift>
          ))}
        </div>
      </section>
    );
  }

  function FaqBlock() {
    return (
      <section id="section-faq" className={`${gap} border-t scroll-mt-28 ${theme.section} ${theme.border}`}>
        <div className="max-w-2xl mx-auto space-y-4">
          {sections.faq.map((item, i) => (
            <div key={i} className={`rounded-xl p-4 ${theme.card}`}>
              <p className={`text-sm font-bold mb-1 ${theme.cardTitle}`}>{item.question}</p>
              <p className={`text-xs leading-relaxed ${theme.cardBody}`}>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function CtaBlock() {
    if (layout.cta === "banner") {
      return (
        <section className={gap}>
          <div
            className={`py-12 px-8 text-center ${theme.ctaBlock}`}
            style={{ borderRadius: layout.ctaRounded === "rounded-none" ? 0 : undefined }}
          >
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">{sections.cta.headline}</h2>
            <p className="text-sm opacity-80 mb-6 max-w-md mx-auto">{sections.cta.subheadline}</p>
            <span className={`inline-block text-sm font-bold px-8 py-3 ${round} bg-white/20 border border-white/30`}>
              {sections.cta.buttonText}
            </span>
          </div>
        </section>
      );
    }

    if (layout.cta === "inline") {
      return (
        <section className={`${gap} text-center border-t ${theme.border}`}>
          <h2 className={`text-xl font-bold mb-2 ${theme.cardTitle}`}>{sections.cta.headline}</h2>
          <p className={`text-sm mb-4 ${theme.cardBody}`}>{sections.cta.subheadline}</p>
          <span className={`inline-block text-sm font-bold px-6 py-3 ${round} ${theme.ctaPrimary}`}>
            {sections.cta.buttonText}
          </span>
        </section>
      );
    }

    return (
      <section className={gap}>
        <div className={`rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto ${theme.ctaBlock}`}>
          <h2 className={`${isPreview ? "text-lg" : "text-2xl md:text-3xl"} font-extrabold mb-3`}>
            {sections.cta.headline}
          </h2>
          <p className="text-sm opacity-80 mb-6 max-w-md mx-auto">{sections.cta.subheadline}</p>
          <span className={`inline-block text-sm font-bold px-6 py-3 ${round} bg-white/20 border border-white/30`}>
            {sections.cta.buttonText}
          </span>
        </div>
      </section>
    );
  }

  function renderSection(id: HomeSectionId) {
    switch (id) {
      case "features":
        return <FeaturesBlock key="features" />;
      case "showcase":
        return layout.showShowcase && imagery ? (
          <ProductShowcaseSection
            key="showcase"
            imagery={imagery}
            theme={theme}
            gap={gap}
            accent={accentColor}
            category={productCategory}
          />
        ) : null;
      case "collections":
        return layout.showCollections && imagery ? (
          <CollectionSection
            key="collections"
            imagery={imagery}
            theme={theme}
            gap={gap}
            accent={accentColor}
            brief={brief}
            category={productCategory}
          />
        ) : null;
      case "promo":
        return layout.showPromo && imagery ? (
          <PromoSection
            key="promo"
            imagery={imagery}
            theme={theme}
            gap={gap}
            accent={accentColor}
            brief={brief}
            category={productCategory}
          />
        ) : null;
      case "categories":
        return layout.showCategories && imagery ? (
          <CategoriesSection
            key="categories"
            imagery={imagery}
            theme={theme}
            gap={gap}
            accent={accentColor}
            brief={brief}
            category={productCategory}
          />
        ) : null;
      case "story":
        return layout.showStory ? (
          <StorySection
            key="story"
            brief={brief}
            sections={sections}
            theme={theme}
            gap={gap}
            accent={accentColor}
            imagery={imagery ?? undefined}
            category={productCategory}
          />
        ) : null;
      case "seasonal":
        return imagery && (visuals?.worldMode === "commerce-editorial" || productCategory === "food") ? (
          <SeasonalDropsSection
            key="seasonal"
            brief={brief}
            imagery={imagery}
            theme={theme}
            gap={gap}
            accent={accentColor}
          />
        ) : null;
      case "analytics":
        return visuals?.worldMode === "analytics-platform" ? (
          <AnalyticsDashboardSection
            key="analytics"
            brief={brief}
            sections={sections}
            imagery={imagery ?? undefined}
            theme={theme}
            gap={gap}
            accent={accentColor}
            stats={visuals?.dashboardStats ?? []}
            heroVisual={visuals?.heroVisual ?? "analytics"}
          />
        ) : null;
      case "platform":
        return visuals?.worldMode === "analytics-platform" || visuals?.worldMode === "creator-platform" ? (
          <PlatformShowcaseSection
            key="platform"
            sections={sections}
            theme={theme}
            gap={gap}
            accent={accentColor}
            heroVisual={visuals?.heroVisual ?? "dashboard"}
            secondaryVisual={visuals?.secondaryVisual ?? "analytics"}
          />
        ) : null;
      case "metrics":
        return visuals?.worldMode === "analytics-platform" || visuals?.worldMode === "creator-platform" ? (
          <MetricsBandSection
            key="metrics"
            theme={theme}
            gap={gap}
            accent={accentColor}
            stats={visuals?.dashboardStats ?? []}
            headline="By the numbers"
          />
        ) : null;
      case "sourcing":
        return imagery && layout.sectionOrder.includes("sourcing") ? (
          <SourcingSection
            key="sourcing"
            imagery={imagery}
            theme={theme}
            gap={gap}
            accent={accentColor}
            brief={brief}
            category={productCategory}
          />
        ) : null;
      case "subscription":
        return imagery && layout.sectionOrder.includes("subscription") ? (
          <SubscriptionSection
            key="subscription"
            imagery={imagery}
            theme={theme}
            gap={gap}
            accent={accentColor}
            category={productCategory}
          />
        ) : null;
      case "lifestyle":
        return layout.showLifestyle && imagery ? (
          <LifestyleSection
            key="lifestyle"
            imagery={imagery}
            theme={theme}
            gap={gap}
            accent={accentColor}
            compact={isPreview}
            category={productCategory}
            direction={direction}
          />
        ) : null;
      case "testimonials":
        return <TestimonialsBlock key="testimonials" />;
      case "pricing":
        return <PricingBlock key="pricing" />;
      case "faq":
        return <FaqBlock key="faq" />;
      case "cta":
        return <CtaBlock key="cta" />;
    }
  }

  const sectionOrder =
    layout.sectionOrder.length > 0
      ? layout.sectionOrder
      : (["features", "testimonials", "pricing", "faq", "cta"] as HomeSectionId[]);

  return (
    <MotionRoot profile={motion}>
      <HeroBlock />
      {sectionOrder.map((id) => renderSection(id))}
    </MotionRoot>
  );
}
