"use client";

import type { DirectionId, GeneratedSections, StartupBrief, StartupLogo } from "@/lib/types/startup";
import type { DirectionTheme } from "@/lib/orchestration/direction-themes";
import { getDirectionLayout } from "@/lib/orchestration/direction-layouts";
import WebsiteVisuals, { ImmersionStrip } from "./WebsiteVisuals";

type Props = {
  brief: StartupBrief;
  sections: GeneratedSections;
  theme: DirectionTheme;
  direction: DirectionId;
  isPreview: boolean;
  accentColor: string;
  logo?: StartupLogo | null;
};

export function LayoutHomePage({
  brief,
  sections,
  theme,
  direction,
  isPreview,
  accentColor,
  logo,
}: Props) {
  const layout = getDirectionLayout(direction);
  const visuals = sections.visuals;
  const pad = isPreview ? "px-6 py-10" : `px-6 ${layout.heroPadding}`;
  const gap = isPreview ? "px-6 py-8" : `px-6 ${layout.sectionGap}`;
  const scale = isPreview ? "text-2xl" : layout.headlineScale;
  const round = layout.ctaRounded;

  const heroVisual = visuals?.heroVisual ?? "dashboard";
  const secondary = visuals?.secondaryVisual;

  const ctas = (
    <div
      className={`flex flex-wrap gap-3 ${
        layout.hero === "centered" || layout.hero === "minimal" || layout.hero === "cinematic"
          ? "justify-center"
          : "justify-start"
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

  const heroVisualEl = visuals && (
    <WebsiteVisuals
      type={heroVisual}
      theme={theme}
      accentColor={accentColor}
      compact={isPreview}
    />
  );

  function HeroBlock() {
    const eyebrow = (
      <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${theme.eyebrow}`}>
        {sections.hero.eyebrow}
      </span>
    );
    const headline = (
      <h1 className={`${scale} mb-4 leading-tight ${theme.heroText}`}>{sections.hero.headline}</h1>
    );
    const sub = (
      <p
        className={`${isPreview ? "text-sm" : "text-lg"} max-w-xl mb-8 leading-relaxed ${theme.heroSub} ${
          layout.hero === "centered" || layout.hero === "minimal" || layout.hero === "cinematic"
            ? "mx-auto text-center"
            : ""
        }`}
      >
        {sections.hero.subheadline}
      </p>
    );

    if (layout.hero === "split") {
      return (
        <div className={`${pad} border-b ${theme.hero} ${theme.border}`}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              {eyebrow}
              {headline}
              {sub}
              {ctas}
            </div>
            <div>{heroVisualEl}</div>
          </div>
        </div>
      );
    }

    if (layout.hero === "left") {
      return (
        <div className={`${pad} border-b text-left ${theme.hero} ${theme.border}`}>
          <div className="max-w-3xl">
            {eyebrow}
            {headline}
            {sub}
            {ctas}
          </div>
          {heroVisualEl && <div className="max-w-2xl mt-10">{heroVisualEl}</div>}
        </div>
      );
    }

    if (layout.hero === "cinematic") {
      return (
        <div className={`${pad} border-b relative overflow-hidden ${theme.hero} ${theme.border}`}>
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${accentColor}, transparent 70%)`,
            }}
          />
          <div className="relative text-center max-w-4xl mx-auto">
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
            {logo && <p className={`text-xs uppercase tracking-[0.3em] mb-6 opacity-40 ${theme.heroSub}`}>{logo.wordmark}</p>}
            {headline}
            {sub}
            {ctas}
          </div>
        </div>
      );
    }

    return (
      <div className={`${pad} border-b text-center ${theme.hero} ${theme.border}`}>
        {eyebrow}
        {headline}
        {sub}
        {ctas}
        {heroVisualEl}
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

    if (layout.features === "list") {
      return (
        <section id="section-features" className={`${gap} scroll-mt-28 ${theme.section}`}>
          <div className="max-w-3xl mx-auto">
            {title}
            <div className="space-y-0">
              {sections.features.items.map((item, i) => (
                <div key={i} className={`flex gap-6 py-6 border-b ${theme.border}`}>
                  <span className={`text-2xl font-black opacity-15 ${theme.cardTitle}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className={`text-base font-bold mb-1 ${theme.cardTitle}`}>{item.title}</p>
                    <p className={`text-sm leading-relaxed ${theme.cardBody}`}>{item.description}</p>
                  </div>
                </div>
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
          <div className="max-w-4xl mx-auto space-y-4">
            {sections.features.items.map((item, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 ${theme.card}`}
                style={{ marginLeft: i % 2 === 1 ? "2rem" : 0 }}
              >
                <p className={`text-lg font-bold mb-2 ${theme.cardTitle}`}>{item.title}</p>
                <p className={`text-sm ${theme.cardBody}`}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (layout.features === "bento") {
      return (
        <section id="section-features" className={`${gap} scroll-mt-28 ${theme.section}`}>
          {title}
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3">
            {sections.features.items.map((item, i) => (
              <div
                key={i}
                className={`rounded-2xl p-5 ${theme.card} ${i === 0 ? "col-span-2" : ""}`}
              >
                <p className={`text-sm font-bold mb-2 ${theme.cardTitle}`}>{item.title}</p>
                <p className={`text-xs leading-relaxed ${theme.cardBody}`}>{item.description}</p>
              </div>
            ))}
          </div>
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
            <div key={i} className={`rounded-2xl p-5 ${theme.card}`}>
              <p className={`text-sm font-bold mb-2 ${theme.cardTitle}`}>{item.title}</p>
              <p className={`text-xs leading-relaxed ${theme.cardBody}`}>{item.description}</p>
            </div>
          ))}
        </div>
        {secondary && (
          <div className="max-w-4xl mx-auto mt-10">
            <ImmersionStrip type={secondary} theme={theme} accent={accentColor} />
          </div>
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
            <div key={i} className={`rounded-2xl p-5 ${theme.card}`}>
              <p className={`text-sm italic leading-relaxed mb-4 ${theme.cardBody}`}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className={`text-xs font-bold ${theme.cardTitle}`}>{t.name}</p>
              <p className={`text-[11px] ${theme.cardBody}`}>{t.role}</p>
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
            <h2 className={`text-2xl md:text-3xl font-extrabold mb-3`}>{sections.cta.headline}</h2>
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

  return (
    <>
      <HeroBlock />
      <FeaturesBlock />
      <TestimonialsBlock />
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
            <div
              key={tier.name}
              className={`rounded-2xl p-6 text-center border ${
                i === 1 ? theme.pricingHighlight : theme.pricingDefault
              }`}
            >
              <p className="text-xs font-bold uppercase opacity-70 mb-1">{tier.name}</p>
              <p className="text-2xl font-black mb-2">{tier.price}</p>
              <p className="text-xs opacity-70 leading-snug">{tier.detail}</p>
            </div>
          ))}
        </div>
      </section>
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
      <CtaBlock />
    </>
  );
}
