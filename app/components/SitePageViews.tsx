"use client";

import type { ReactNode } from "react";
import type { DirectionTheme } from "@/lib/orchestration/direction-themes";
import type {
  GeneratedPages,
  GeneratedSections,
  SitePageId,
  StartupBrief,
} from "@/lib/types/startup";
import type { DirectionId } from "@/lib/types/startup";
import { LayoutHomePage } from "./LayoutHomePage";
import { InlineDashboardPreview, ImmersionStrip, VisualGallery } from "./WebsiteVisuals";

type PageProps = {
  brief: StartupBrief;
  sections: GeneratedSections;
  pages: GeneratedPages;
  theme: DirectionTheme;
  direction: DirectionId;
  isPreview: boolean;
  accentColor: string;
  onSectionJump?: (id: string) => void;
  seed?: string;
};

export function HomePageContent({
  brief,
  sections,
  theme,
  direction,
  isPreview,
  accentColor,
  seed,
}: PageProps) {
  return (
    <LayoutHomePage
      brief={brief}
      sections={sections}
      theme={theme}
      direction={direction}
      isPreview={isPreview}
      accentColor={accentColor}
      logo={sections.visuals?.logo}
      seed={seed}
    />
  );
}

export function FeaturesPageContent({
  sections,
  theme,
  isPreview,
  accentColor,
}: Pick<PageProps, "sections" | "theme" | "isPreview" | "accentColor">) {
  return (
    <section className={`${isPreview ? "px-6 py-10" : "px-6 py-16 md:py-20"} ${theme.section}`}>
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className={`text-3xl md:text-4xl font-extrabold mb-4 ${theme.heroText}`}>
          {sections.features.sectionTitle}
        </h1>
        <p className={`text-lg ${theme.heroSub}`}>Everything you need to succeed — built in from day one.</p>
      </div>
      {sections.visuals && (
        <div className="mb-12">
          <VisualGallery visuals={sections.visuals} theme={theme} accentColor={accentColor} compact={isPreview} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {sections.features.items.map((item, i) => (
          <div key={i} className={`rounded-2xl p-6 ${theme.card}`}>
            <span className="text-2xl font-black opacity-20 mb-3 block">{String(i + 1).padStart(2, "0")}</span>
            <p className={`text-lg font-bold mb-2 ${theme.cardTitle}`}>{item.title}</p>
            <p className={`text-sm leading-relaxed ${theme.cardBody}`}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PricingPageContent({ brief, sections, theme, isPreview }: PageProps) {
  return (
    <section className={`${isPreview ? "px-6 py-10" : "px-6 py-16 md:py-20"} ${theme.section}`}>
      <div className="max-w-lg mx-auto text-center mb-12">
        <h1 className={`text-3xl md:text-4xl font-extrabold mb-4 ${theme.heroText}`}>
          {sections.pricing.sectionTitle}
        </h1>
        <p className={`text-lg ${theme.heroSub}`}>{sections.pricing.subtitle}</p>
        <p className={`text-sm mt-4 ${theme.cardBody}`}>{brief.pricing.summary}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {brief.pricing.tiers.map((tier, i) => (
          <div
            key={tier.name}
            className={`rounded-2xl p-8 text-center border ${
              i === 1 ? theme.pricingHighlight : theme.pricingDefault
            }`}
          >
            <p className="text-xs font-bold uppercase opacity-70 mb-2">{tier.name}</p>
            <p className="text-3xl font-black mb-3">{tier.price}</p>
            <p className="text-sm opacity-70 leading-relaxed mb-6">{tier.detail}</p>
            <span className={`inline-block text-sm font-bold px-5 py-2.5 rounded-xl ${theme.ctaPrimary}`}>
              Get started
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AboutPageContent({ pages, theme, isPreview }: Pick<PageProps, "pages" | "theme" | "isPreview">) {
  const { about } = pages;
  return (
    <section className={`${isPreview ? "px-6 py-10" : "px-6 py-16 md:py-20"} ${theme.section}`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-3xl md:text-4xl font-extrabold mb-6 ${theme.heroText}`}>{about.headline}</h1>
        <p className={`text-lg leading-relaxed mb-8 ${theme.heroSub}`}>{about.story}</p>
        <div className={`rounded-2xl p-6 mb-10 ${theme.ctaBlock}`}>
          <p className="text-sm font-medium opacity-90">{about.mission}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {about.values.map((v) => (
            <div key={v.title} className={`rounded-2xl p-5 ${theme.card}`}>
              <p className={`text-sm font-bold mb-2 ${theme.cardTitle}`}>{v.title}</p>
              <p className={`text-xs leading-relaxed ${theme.cardBody}`}>{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactPageContent({ pages, theme, isPreview }: Pick<PageProps, "pages" | "theme" | "isPreview">) {
  const { contact } = pages;
  return (
    <section className={`${isPreview ? "px-6 py-10" : "px-6 py-16 md:py-20"} ${theme.section}`}>
      <div className="max-w-md mx-auto text-center">
        <h1 className={`text-3xl font-extrabold mb-4 ${theme.heroText}`}>{contact.headline}</h1>
        <p className={`text-sm mb-8 ${theme.heroSub}`}>{contact.subheadline}</p>
        <div className={`rounded-2xl p-6 text-left space-y-4 ${theme.card}`}>
          <div>
            <label className={`text-[10px] font-bold uppercase tracking-widest ${theme.cardBody}`}>Email</label>
            <p className={`text-sm font-medium mt-1 ${theme.cardTitle}`}>{contact.email}</p>
          </div>
          <div className={`h-24 rounded-xl border ${theme.border} opacity-40`} />
          <span className={`block text-center text-sm font-bold py-3 rounded-xl ${theme.ctaPrimary}`}>
            {contact.ctaLabel}
          </span>
        </div>
      </div>
    </section>
  );
}

export function BlogPageContent({ pages, theme, isPreview }: Pick<PageProps, "pages" | "theme" | "isPreview">) {
  return (
    <section className={`${isPreview ? "px-6 py-10" : "px-6 py-16 md:py-20"} ${theme.section}`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-3xl font-extrabold mb-8 ${theme.heroText}`}>{pages.blog.headline}</h1>
        <div className="space-y-4">
          {pages.blog.posts.map((post) => (
            <article key={post.title} className={`rounded-2xl p-5 ${theme.card}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.cardBody}`}>
                  {post.tag}
                </span>
                <span className={`text-[10px] ${theme.cardBody}`}>{post.date}</span>
              </div>
              <h2 className={`text-lg font-bold mb-2 ${theme.cardTitle}`}>{post.title}</h2>
              <p className={`text-sm ${theme.cardBody}`}>{post.excerpt}</p>
            </article>
          ))}
        </div>
        <p className={`text-center text-xs mt-8 ${theme.cardBody}`}>More posts coming soon</p>
      </div>
    </section>
  );
}

export function DashboardPageContent({
  pages,
  sections,
  theme,
  accentColor,
  isPreview,
}: Pick<PageProps, "pages" | "sections" | "theme" | "accentColor" | "isPreview">) {
  const visuals = sections.visuals;
  const stats = visuals?.dashboardStats ?? pages.dashboard.stats;

  return (
    <section className={`${isPreview ? "px-6 py-10" : "px-6 py-16 md:py-20"} ${theme.section}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-2xl font-bold mb-1 ${theme.heroText}`}>{pages.dashboard.headline}</h1>
        <p className={`text-sm mb-8 ${theme.heroSub}`}>{pages.dashboard.welcome}</p>
        <InlineDashboardPreview theme={theme} stats={stats} accent={accentColor} />
        {visuals && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImmersionStrip visualId={visuals.featureVisual} theme={theme} accent={accentColor} />
            <ImmersionStrip visualId={visuals.secondaryVisual} theme={theme} accent={accentColor} />
          </div>
        )}
      </div>
    </section>
  );
}

export function LoginPageContent({ pages, theme, isPreview }: Pick<PageProps, "pages" | "theme" | "isPreview">) {
  const { login } = pages;
  return (
    <section className={`${isPreview ? "px-6 py-10" : "px-6 py-16 md:py-24"} ${theme.section} min-h-[60vh] flex items-center`}>
      <div className={`max-w-sm mx-auto w-full rounded-2xl p-8 ${theme.card}`}>
        <h1 className={`text-xl font-bold mb-2 text-center ${theme.cardTitle}`}>{login.headline}</h1>
        <p className={`text-sm text-center mb-6 ${theme.cardBody}`}>{login.subheadline}</p>
        <div className="space-y-3 mb-4">
          <div className={`h-10 rounded-xl border ${theme.border} opacity-40`} />
          <div className={`h-10 rounded-xl border ${theme.border} opacity-40`} />
        </div>
        <span className={`block text-center text-sm font-bold py-3 rounded-xl ${theme.ctaPrimary}`}>
          {login.buttonLabel}
        </span>
        <p className={`text-xs text-center mt-4 ${theme.cardBody}`}>{login.footerNote}</p>
      </div>
    </section>
  );
}

export function renderSitePage(
  pageId: SitePageId,
  props: PageProps
): ReactNode {
  switch (pageId) {
    case "home":
      return <HomePageContent {...props} />;
    case "features":
      return (
        <FeaturesPageContent
          sections={props.sections}
          theme={props.theme}
          isPreview={props.isPreview}
          accentColor={props.accentColor}
        />
      );
    case "pricing":
      return <PricingPageContent {...props} />;
    case "about":
      return <AboutPageContent pages={props.pages} theme={props.theme} isPreview={props.isPreview} />;
    case "contact":
      return <ContactPageContent pages={props.pages} theme={props.theme} isPreview={props.isPreview} />;
    case "blog":
      return <BlogPageContent pages={props.pages} theme={props.theme} isPreview={props.isPreview} />;
    case "dashboard":
      return (
        <DashboardPageContent
          pages={props.pages}
          sections={props.sections}
          theme={props.theme}
          accentColor={props.accentColor}
          isPreview={props.isPreview}
        />
      );
    case "login":
      return <LoginPageContent pages={props.pages} theme={props.theme} isPreview={props.isPreview} />;
  }
}
