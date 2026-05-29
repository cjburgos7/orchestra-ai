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
import type { WorldV2Package } from "@/lib/world-v2";
import { WORLD_V2_ENABLED } from "@/lib/world-v2";
import GeneratedWorldV2 from "./world-v2/GeneratedWorldV2";
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
  if (WORLD_V2_ENABLED && sections.worldV2) {
    return (
      <>
        {process.env.NODE_ENV === "development" && (
          <div
            style={{
              position: "fixed",
              bottom: 12,
              right: 12,
              zIndex: 9999,
              background: "#06090f",
              color: "#4ade80",
              fontFamily: "monospace",
              fontSize: 10,
              padding: "4px 10px",
              borderRadius: 6,
              pointerEvents: "none",
              border: "1px solid #166534",
            }}
          >
            WorldV2 · {sections.worldV2.category} · {sections.worldV2.variantKey}
          </div>
        )}
        <GeneratedWorldV2
          brief={brief}
          sections={sections}
          world={sections.worldV2}
          isPreview={isPreview}
        />
      </>
    );
  }

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

// ─── World V2 subpage components ────────────────────────────────────────────
// These use inline styles from the WorldV2Package so subpages match the V2 home.

function V2SubpageShell({
  world,
  children,
}: {
  world: WorldV2Package;
  children: ReactNode;
}) {
  return (
    <div style={{ background: world.background, color: world.foreground, minHeight: "100vh" }}>
      {/* Accent top edge */}
      <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${world.accentColor}60, transparent)` }} />
      {children}
    </div>
  );
}

function V2SectionLabel({ world, label }: { world: WorldV2Package; label: string }) {
  return (
    <p style={{
      fontSize: "10px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.25em",
      color: world.accentColor,
      marginBottom: "1.25rem",
    }}>
      {label}
    </p>
  );
}

function V2DisplayHeading({ world, children }: { world: WorldV2Package; children: ReactNode }) {
  return (
    <h1 style={{
      fontFamily: world.typography.displayFamily,
      fontWeight: world.typography.displayWeight,
      letterSpacing: world.typography.displayTracking,
      fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
      lineHeight: 1.05,
      color: world.foreground,
      marginBottom: "1.5rem",
    }}>
      {children}
    </h1>
  );
}

function V2AccentRule({ world }: { world: WorldV2Package }) {
  return <div style={{ width: 48, height: 2, background: world.accentColor, marginBottom: "2rem" }} />;
}

function FeaturesV2({ world, sections }: { world: WorldV2Package; sections: GeneratedSections }) {
  return (
    <V2SubpageShell world={world}>
      <div style={{ padding: "5rem 2rem 4rem", maxWidth: "960px", margin: "0 auto" }}>
        <V2SectionLabel world={world} label="Features" />
        <V2DisplayHeading world={world}>{sections.features.sectionTitle}</V2DisplayHeading>
        <V2AccentRule world={world} />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.25rem",
          marginTop: "1rem",
        }}>
          {sections.features.items.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "1.75rem",
                border: `1px solid ${world.foreground}14`,
                borderRadius: "14px",
                background: `${world.foreground}04`,
              }}
            >
              <span style={{
                display: "block",
                fontSize: "2.2rem",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                opacity: 0.12,
                marginBottom: "1rem",
                color: world.accentColor,
                lineHeight: 1,
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.6rem", color: world.foreground }}>
                {item.title}
              </p>
              <p style={{ fontSize: "0.875rem", opacity: 0.62, lineHeight: 1.65, color: world.foreground }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </V2SubpageShell>
  );
}

function PricingV2Subpage({ world, brief, sections }: { world: WorldV2Package; brief: StartupBrief; sections: GeneratedSections }) {
  return (
    <V2SubpageShell world={world}>
      <div style={{ padding: "5rem 2rem 4rem", maxWidth: "900px", margin: "0 auto" }}>
        <V2SectionLabel world={world} label="Pricing" />
        <V2DisplayHeading world={world}>{sections.pricing.sectionTitle}</V2DisplayHeading>
        <p style={{ opacity: 0.55, maxWidth: "42ch", marginBottom: "0.75rem", fontSize: "1rem" }}>
          {sections.pricing.subtitle}
        </p>
        <p style={{ opacity: 0.4, fontSize: "0.875rem", marginBottom: "3rem" }}>{brief.pricing.summary}</p>
        <V2AccentRule world={world} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {brief.pricing.tiers.map((tier, i) => {
            const isFeatured = i === 1;
            return (
              <div
                key={tier.name}
                style={{
                  padding: isFeatured ? "2.5rem 2rem" : "2rem",
                  background: isFeatured ? world.accentColor : `${world.foreground}06`,
                  color: isFeatured ? "#fff" : world.foreground,
                  border: isFeatured ? "none" : `1px solid ${world.foreground}12`,
                  borderRadius: "16px",
                  position: "relative",
                }}
              >
                {isFeatured && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: "rgba(255,255,255,0.4)",
                    borderRadius: "16px 16px 0 0",
                  }} />
                )}
                <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", opacity: isFeatured ? 0.8 : 0.45, marginBottom: "0.75rem" }}>
                  {tier.name}
                </p>
                <p style={{ fontSize: isFeatured ? "3.2rem" : "2.4rem", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "0.75rem" }}>
                  {tier.price}
                </p>
                <p style={{ fontSize: "0.875rem", opacity: isFeatured ? 0.8 : 0.55, lineHeight: 1.6 }}>
                  {tier.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </V2SubpageShell>
  );
}

function AboutV2({ world, pages }: { world: WorldV2Package; pages: GeneratedPages }) {
  const { about } = pages;
  return (
    <V2SubpageShell world={world}>
      <div style={{ padding: "5rem 2rem 4rem", maxWidth: "800px", margin: "0 auto" }}>
        <V2SectionLabel world={world} label="About" />
        <V2DisplayHeading world={world}>{about.headline}</V2DisplayHeading>
        <V2AccentRule world={world} />
        <p style={{ fontSize: "1.1rem", lineHeight: 1.75, opacity: 0.72, maxWidth: "55ch", marginBottom: "2.5rem" }}>
          {about.story}
        </p>
        <div style={{
          background: `${world.accentColor}18`,
          border: `1px solid ${world.accentColor}35`,
          borderRadius: "12px",
          padding: "1.5rem 1.75rem",
          marginBottom: "2.5rem",
        }}>
          <p style={{ fontSize: "0.9rem", opacity: 0.88, lineHeight: 1.65 }}>{about.mission}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          {about.values.map((v) => (
            <div
              key={v.title}
              style={{
                padding: "1.25rem",
                border: `1px solid ${world.foreground}12`,
                borderRadius: "10px",
                background: `${world.foreground}04`,
              }}
            >
              <p style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>{v.title}</p>
              <p style={{ fontSize: "0.8rem", opacity: 0.55, lineHeight: 1.6 }}>{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </V2SubpageShell>
  );
}

function ContactV2({ world, pages }: { world: WorldV2Package; pages: GeneratedPages }) {
  const { contact } = pages;
  return (
    <V2SubpageShell world={world}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 2rem", minHeight: "80vh" }}>
        <div style={{ width: "100%", maxWidth: "460px" }}>
          <V2SectionLabel world={world} label="Contact" />
          <V2DisplayHeading world={world}>{contact.headline}</V2DisplayHeading>
          <p style={{ opacity: 0.55, marginBottom: "2.5rem", fontSize: "0.95rem" }}>{contact.subheadline}</p>
          <div style={{
            background: `${world.foreground}06`,
            border: `1px solid ${world.foreground}12`,
            borderRadius: "16px",
            padding: "2rem",
          }}>
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.45, marginBottom: "0.35rem" }}>
                Email
              </p>
              <p style={{ fontSize: "0.95rem", fontWeight: 500, color: world.accentColor }}>{contact.email}</p>
            </div>
            <div style={{
              height: "80px",
              borderRadius: "10px",
              border: `1px solid ${world.foreground}18`,
              marginBottom: "1.25rem",
              background: `${world.foreground}04`,
            }} />
            <div
              style={{
                display: "block",
                textAlign: "center",
                fontSize: "0.875rem",
                fontWeight: 700,
                padding: "0.85rem 1.5rem",
                borderRadius: "10px",
                background: world.accentColor,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {contact.ctaLabel}
            </div>
          </div>
        </div>
      </div>
    </V2SubpageShell>
  );
}

function BlogV2({ world, pages }: { world: WorldV2Package; pages: GeneratedPages }) {
  return (
    <V2SubpageShell world={world}>
      <div style={{ padding: "5rem 2rem 4rem", maxWidth: "800px", margin: "0 auto" }}>
        <V2SectionLabel world={world} label="Blog" />
        <V2DisplayHeading world={world}>{pages.blog.headline}</V2DisplayHeading>
        <V2AccentRule world={world} />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {pages.blog.posts.map((post) => (
            <article
              key={post.title}
              style={{
                padding: "1.5rem 1.75rem",
                border: `1px solid ${world.foreground}12`,
                borderRadius: "12px",
                background: `${world.foreground}04`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: world.accentColor }}>
                  {post.tag}
                </span>
                <span style={{ fontSize: "10px", opacity: 0.35 }}>{post.date}</span>
              </div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{post.title}</h2>
              <p style={{ fontSize: "0.875rem", opacity: 0.58, lineHeight: 1.65 }}>{post.excerpt}</p>
            </article>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: "12px", opacity: 0.3, marginTop: "2rem" }}>More posts coming soon</p>
      </div>
    </V2SubpageShell>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export function FeaturesPageContent({
  sections,
  theme,
  isPreview,
  accentColor,
}: Pick<PageProps, "sections" | "theme" | "isPreview" | "accentColor">) {
  if (sections.worldV2) return <FeaturesV2 world={sections.worldV2} sections={sections} />;

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
  if (sections.worldV2) return <PricingV2Subpage world={sections.worldV2} brief={brief} sections={sections} />;

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

export function AboutPageContent({ pages, sections, theme, isPreview }: Pick<PageProps, "pages" | "sections" | "theme" | "isPreview">) {
  if (sections?.worldV2) return <AboutV2 world={sections.worldV2} pages={pages} />;

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

export function ContactPageContent({ pages, sections, theme, isPreview }: Pick<PageProps, "pages" | "sections" | "theme" | "isPreview">) {
  if (sections?.worldV2) return <ContactV2 world={sections.worldV2} pages={pages} />;

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

export function BlogPageContent({ pages, sections, theme, isPreview }: Pick<PageProps, "pages" | "sections" | "theme" | "isPreview">) {
  if (sections?.worldV2) return <BlogV2 world={sections.worldV2} pages={pages} />;

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
      return <AboutPageContent pages={props.pages} sections={props.sections} theme={props.theme} isPreview={props.isPreview} />;
    case "contact":
      return <ContactPageContent pages={props.pages} sections={props.sections} theme={props.theme} isPreview={props.isPreview} />;
    case "blog":
      return <BlogPageContent pages={props.pages} sections={props.sections} theme={props.theme} isPreview={props.isPreview} />;
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
