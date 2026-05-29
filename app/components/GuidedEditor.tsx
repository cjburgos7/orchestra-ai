"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  DirectionId,
  GeneratedSections,
  PricingTier,
  SectionKey,
  SitePageId,
  StartupProject,
} from "@/lib/types/startup";
import { briefFromProject } from "@/lib/types/startup";
import { buildDirectionOptions } from "@/lib/orchestration/directions";
import { pickWildcards } from "@/lib/orchestration/wildcards";
import { buildProductVisualsSync } from "@/lib/orchestration/product-visuals";
import { saveProject } from "@/lib/persistence/projects";
import { saveProjectToDb } from "@/lib/db/projects";
import { CINEMATIC_DIRECTION, isCinematicEngineActive, resolveRenderDirection } from "@/lib/cinematic";

const ACCENT_SWATCHES = ["#2563eb", "#7c3aed", "#0891b2", "#db2777", "#059669", "#ea580c", "#0f172a"];

type Props = {
  project: StartupProject;
  onUpdate: (next: StartupProject) => void;
  activePage: SitePageId;
  onPageChange: (page: SitePageId) => void;
  openPanel?: string;
  onPanelChange?: (panel: string) => void;
};

export default function GuidedEditor({
  project,
  onUpdate,
  activePage,
  onPageChange,
  openPanel: openPanelProp,
  onPanelChange,
}: Props) {
  const [regenerating, setRegenerating] = useState<SectionKey | null>(null);
  const [openPanelLocal, setOpenPanelLocal] = useState(() =>
    project.founderMission ? "world" : "brand"
  );
  const openPanel = openPanelProp ?? openPanelLocal;
  const setOpenPanel = onPanelChange ?? setOpenPanelLocal;
  const abortRef = useRef<AbortController | null>(null);
  const projectRef = useRef(project);
  projectRef.current = project;

  const brief = briefFromProject(project);
  const sections = project.generatedSections!;
  const direction = resolveRenderDirection(project.selectedDirection);
  const wildcards = project.wildcardDirections ?? pickWildcards(project.id);
  const directionOptions = buildDirectionOptions(wildcards);

  const persist = useCallback(
    (next: StartupProject) => {
      const saved = saveProject(next);
      onUpdate(saved);
      saveProjectToDb(saved).catch(() => {});
      return saved;
    },
    [onUpdate]
  );

  const updateSections = useCallback(
    (nextSections: GeneratedSections) => {
      const current = projectRef.current;
      persist({ ...current, generatedSections: nextSections, status: "complete" });
    },
    [persist]
  );

  function patchSections(patch: Partial<GeneratedSections>) {
    const current = projectRef.current;
    const sections = current.generatedSections!;
    updateSections({ ...sections, ...patch });
  }

  function updatePricingTier(index: number, field: keyof PricingTier, value: string) {
    const current = projectRef.current;
    const tiers = [...current.pricing.tiers];
    tiers[index] = { ...tiers[index], [field]: value };
    persist({ ...current, pricing: { ...current.pricing, tiers } });
  }

  async function regenerateSection(section: SectionKey) {
    if (regenerating) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const current = projectRef.current;
    const currentSections = current.generatedSections!;
    const currentBrief = briefFromProject(current);
    const currentDirection = resolveRenderDirection(current.selectedDirection);

    setRegenerating(section);
    try {
      const res = await fetch("/api/regenerate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief: currentBrief,
          direction: currentDirection,
          section,
          current: currentSections,
        }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (res.ok && data.sections) updateSections(data.sections);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
    } finally {
      if (abortRef.current === controller) {
        setRegenerating(null);
        abortRef.current = null;
      }
    }
  }

  async function switchDirection(d: DirectionId) {
    const current = projectRef.current;
    const secs = current.generatedSections!;
    const currentBrief = briefFromProject(current);

    try {
      const res = await fetch("/api/rebuild-visuals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: currentBrief, seed: current.id, direction: d }),
      });
      const data = await res.json();
      if (res.ok && data.visuals) {
        persist({
          ...current,
          selectedDirection: d,
          generatedSections: { ...secs, visuals: data.visuals },
        });
        return;
      }
    } catch {
      // fall through to sync gradient placeholder
    }

    persist({
      ...current,
      selectedDirection: d,
      generatedSections: {
        ...secs,
        visuals: buildProductVisualsSync(currentBrief, current.id, d),
      },
    });
  }

  function setAccent(color: string) {
    const current = projectRef.current;
    const secs = current.generatedSections!;
    if (!secs.visuals) {
      const visuals = buildProductVisualsSync(brief, current.id, direction);
      patchSections({ visuals: { ...visuals, accentColor: color } });
      return;
    }
    patchSections({
      visuals: { ...secs.visuals, accentColor: color },
    });
  }

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const panels = [
    { id: "world", label: "World" },
    { id: "brand", label: "Brand" },
    { id: "hero", label: "Hero" },
    { id: "features", label: "Features" },
    { id: "social", label: "Social proof" },
    { id: "pricing", label: "Pricing" },
    { id: "cta", label: "CTA" },
    { id: "style", label: "Style" },
  ];

  return (
    <aside
      className="mb-5 rounded-2xl overflow-hidden"
      style={{ background: "oklch(99.5% .001 270)", border: "1px solid oklch(91% .005 270 / 0.9)", boxShadow: "0 1px 2px oklch(20% .01 270 / 0.04), 0 4px 16px -4px oklch(20% .01 270 / 0.06)" }}
    >
      <div className="px-5 py-4" style={{ borderBottom: "1px solid oklch(91% .005 270 / 0.6)" }}>
        <p className="text-[13px] font-medium" style={{ color: "oklch(22% .012 270)", letterSpacing: "-0.02em" }}>
          Guided editing
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: "oklch(52% .012 270)" }}>
          Refine copy, regenerate sections, or switch direction. Auto-saved.
        </p>
      </div>

      <div className="flex gap-1 px-3 py-2 overflow-x-auto" style={{ borderBottom: "1px solid oklch(91% .005 270 / 0.5)", background: "oklch(98% .001 270)" }}>
        {panels.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpenPanel(p.id)}
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-all"
            style={{
              background: openPanel === p.id ? "oklch(90% .04 295)" : "transparent",
              color: openPanel === p.id ? "oklch(38% .095 295)" : "oklch(52% .012 270)",
              border: openPanel === p.id ? "1px solid oklch(82% .06 295)" : "1px solid transparent",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto">
        {openPanel === "world" && (
          <>
            <div className="rounded-xl px-4 py-3 mb-1" style={{ background: "oklch(94% .03 295)", border: "1px solid oklch(86% .05 295)" }}>
              <p className="text-[11px] leading-relaxed" style={{ color: "oklch(42% .08 295)" }}>
                Your startup's world — the strategic context behind the brand. Changes here sharpen all generated copy.
              </p>
            </div>
            <TextareaField
              label="Founder Mission"
              value={project.founderMission ?? ""}
              onChange={(v) => persist({ ...project, founderMission: v })}
              placeholder="Why does this company exist? The founder's real conviction."
            />
            <TextareaField
              label="Market Positioning"
              value={project.marketPositioning ?? ""}
              onChange={(v) => persist({ ...project, marketPositioning: v })}
              placeholder="Who is this for vs. existing alternatives?"
            />
            <TextareaField
              label="Brand Personality"
              value={project.brandPersonality ?? ""}
              onChange={(v) => persist({ ...project, brandPersonality: v })}
              placeholder="What would this brand be like as a person?"
            />
            <TextareaField
              label="Business Model"
              value={project.businessModel ?? ""}
              onChange={(v) => persist({ ...project, businessModel: v })}
              placeholder="How does money flow? Revenue model and pricing strategy."
            />
            <TextareaField
              label="Launch Strategy"
              value={project.launchStrategy ?? ""}
              onChange={(v) => persist({ ...project, launchStrategy: v })}
              placeholder="First customers, go-to-market wedge, acquisition channel."
            />
            <TextareaField
              label="Competitive Edge"
              value={project.competitiveEdge ?? ""}
              onChange={(v) => persist({ ...project, competitiveEdge: v })}
              placeholder="The unfair advantage that can't be easily copied."
            />
            <TextareaField
              label="Why Now"
              value={project.whyNow ?? ""}
              onChange={(v) => persist({ ...project, whyNow: v })}
              placeholder="The market timing or technology shift that makes this the moment."
            />
            <TextareaField
              label="Growth Opportunities"
              value={project.growthOpportunities ?? ""}
              onChange={(v) => persist({ ...project, growthOpportunities: v })}
              placeholder="Adjacent markets, network effects, platform potential."
            />
          </>
        )}

        {openPanel === "brand" && (
          <>
            <Field
              label="Startup name"
              value={project.startupName}
              onChange={(v) => {
                persist({
                  ...project,
                  startupName: v,
                  generatedSections: {
                    ...sections,
                    navbar: { ...sections.navbar, brandLabel: v },
                    hero: { ...sections.hero, headline: v },
                    footer: { ...sections.footer, tagline: `${v} · Crafted with Orchestra` },
                  },
                });
              }}
            />
            <Field
              label="Tagline"
              value={project.tagline}
              onChange={(v) => {
                persist({
                  ...project,
                  tagline: v,
                  generatedSections: {
                    ...sections,
                    hero: { ...sections.hero, subheadline: v },
                  },
                });
              }}
            />
            <Field
              label="Nav CTA"
              value={sections.navbar.ctaLabel}
              onChange={(v) => patchSections({ navbar: { ...sections.navbar, ctaLabel: v } })}
            />
          </>
        )}

        {openPanel === "hero" && (
          <>
            <Field label="Eyebrow" value={sections.hero.eyebrow} onChange={(v) =>
              patchSections({ hero: { ...sections.hero, eyebrow: v } })
            } />
            <Field label="Headline" value={sections.hero.headline} onChange={(v) =>
              patchSections({ hero: { ...sections.hero, headline: v } })
            } />
            <Field label="Subheadline" value={sections.hero.subheadline} onChange={(v) =>
              patchSections({ hero: { ...sections.hero, subheadline: v } })
            } />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Primary CTA" value={sections.hero.ctaPrimary} onChange={(v) =>
                patchSections({ hero: { ...sections.hero, ctaPrimary: v } })
              } />
              <Field label="Secondary CTA" value={sections.hero.ctaSecondary} onChange={(v) =>
                patchSections({ hero: { ...sections.hero, ctaSecondary: v } })
              } />
            </div>
            <RegenButton section="hero" regenerating={regenerating} onRegen={regenerateSection} />
          </>
        )}

        {openPanel === "features" && (
          <>
            <Field label="Section title" value={sections.features.sectionTitle} onChange={(v) =>
              patchSections({ features: { ...sections.features, sectionTitle: v } })
            } />
            {sections.features.items.map((item, i) => (
              <div key={i} className="rounded-xl p-3 space-y-2" style={{ background: "oklch(97% .001 270)", border: "1px solid oklch(90% .005 270 / 0.8)" }}>
                <Field label={`Feature ${i + 1} title`} value={item.title} onChange={(v) => {
                  const items = [...sections.features.items];
                  items[i] = { ...items[i], title: v };
                  patchSections({ features: { ...sections.features, items } });
                }} />
                <Field label="Description" value={item.description} onChange={(v) => {
                  const items = [...sections.features.items];
                  items[i] = { ...items[i], description: v };
                  patchSections({ features: { ...sections.features, items } });
                }} />
              </div>
            ))}
            <RegenButton section="features" regenerating={regenerating} onRegen={regenerateSection} />
          </>
        )}

        {openPanel === "social" && (
          <>
            {sections.testimonials.map((t, i) => (
              <div key={i} className="rounded-xl p-3 space-y-2" style={{ background: "oklch(97% .001 270)", border: "1px solid oklch(90% .005 270 / 0.8)" }}>
                <Field label={`Quote ${i + 1}`} value={t.quote} onChange={(v) => {
                  const testimonials = [...sections.testimonials];
                  testimonials[i] = { ...t, quote: v };
                  patchSections({ testimonials });
                }} />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Name" value={t.name} onChange={(v) => {
                    const testimonials = [...sections.testimonials];
                    testimonials[i] = { ...t, name: v };
                    patchSections({ testimonials });
                  }} />
                  <Field label="Role" value={t.role} onChange={(v) => {
                    const testimonials = [...sections.testimonials];
                    testimonials[i] = { ...t, role: v };
                    patchSections({ testimonials });
                  }} />
                </div>
              </div>
            ))}
            <RegenButton section="testimonials" regenerating={regenerating} onRegen={regenerateSection} />
          </>
        )}

        {openPanel === "pricing" && (
          <>
            <Field label="Section title" value={sections.pricing.sectionTitle} onChange={(v) =>
              patchSections({ pricing: { ...sections.pricing, sectionTitle: v } })
            } />
            <Field label="Subtitle" value={sections.pricing.subtitle} onChange={(v) =>
              patchSections({ pricing: { ...sections.pricing, subtitle: v } })
            } />
            {project.pricing.tiers.map((tier, i) => (
              <div key={i} className="rounded-xl p-3 space-y-2" style={{ background: "oklch(97% .001 270)", border: "1px solid oklch(90% .005 270 / 0.8)" }}>
                <Field label={`${tier.name} — name`} value={tier.name} onChange={(v) => updatePricingTier(i, "name", v)} />
                <Field label="Price" value={tier.price} onChange={(v) => updatePricingTier(i, "price", v)} />
                <Field label="Detail" value={tier.detail} onChange={(v) => updatePricingTier(i, "detail", v)} />
              </div>
            ))}
            <RegenButton section="pricing" regenerating={regenerating} onRegen={regenerateSection} />
          </>
        )}

        {openPanel === "cta" && (
          <>
            <Field label="Headline" value={sections.cta.headline} onChange={(v) =>
              patchSections({ cta: { ...sections.cta, headline: v } })
            } />
            <Field label="Subheadline" value={sections.cta.subheadline} onChange={(v) =>
              patchSections({ cta: { ...sections.cta, subheadline: v } })
            } />
            <Field label="Button text" value={sections.cta.buttonText} onChange={(v) =>
              patchSections({ cta: { ...sections.cta, buttonText: v } })
            } />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "oklch(58% .010 270)" }}>FAQ</span>
              {sections.faq.map((item, i) => (
                <div key={i} className="mt-2 rounded-xl p-3 space-y-2" style={{ background: "oklch(97% .001 270)", border: "1px solid oklch(90% .005 270 / 0.8)" }}>
                  <Field label="Question" value={item.question} onChange={(v) => {
                    const faq = [...sections.faq];
                    faq[i] = { ...item, question: v };
                    patchSections({ faq });
                  }} />
                  <Field label="Answer" value={item.answer} onChange={(v) => {
                    const faq = [...sections.faq];
                    faq[i] = { ...item, answer: v };
                    patchSections({ faq });
                  }} />
                </div>
              ))}
            </div>
            <RegenButton section="faq" regenerating={regenerating} onRegen={regenerateSection} />
            <RegenButton section="cta" regenerating={regenerating} onRegen={regenerateSection} />
          </>
        )}

        {openPanel === "style" && (
          <>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "oklch(58% .010 270)" }}>
                Visual direction
              </span>
              {isCinematicEngineActive() ? (
                <p
                  className="mt-2 text-[12px] leading-relaxed rounded-xl px-3 py-2.5"
                  style={{ background: "oklch(94% .03 295)", border: "1px solid oklch(86% .05 295)", color: "oklch(42% .08 295)" }}
                >
                  <span style={{ fontWeight: 600, color: "oklch(32% .012 275)" }}>Cinematic engine</span> — direction styles
                  are paused while Orchestra concentrates on one image-led world. Accent color still applies.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {directionOptions.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => switchDirection(d.id as DirectionId)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all"
                      style={{
                        background: direction === d.id ? "oklch(28% .015 280)" : "oklch(96% .002 270)",
                        color: direction === d.id ? "oklch(98% .003 270)" : "oklch(42% .012 270)",
                        border: direction === d.id ? "1px solid oklch(28% .015 280)" : "1px solid oklch(88% .006 270)",
                      }}
                    >
                      {d.label}
                      {d.isWildcard && " ✦"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "oklch(58% .010 270)" }}>
                Accent color
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {ACCENT_SWATCHES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAccent(c)}
                    className="w-8 h-8 rounded-full border-2 transition-all"
                    style={{ backgroundColor: c, borderColor: sections.visuals?.accentColor === c ? "oklch(28% .015 280)" : "oklch(86% .006 270)", transform: sections.visuals?.accentColor === c ? "scale(1.15)" : "scale(1)" }}
                    aria-label={`Accent ${c}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "oklch(58% .010 270)" }}>
                Preview page
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {(["home", "features", "pricing", "about", "dashboard", "login"] as SitePageId[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onPageChange(p)}
                    className="text-[11px] font-medium px-3 py-1.5 rounded-lg capitalize transition-all"
                    style={{
                      background: activePage === p ? "oklch(90% .04 295)" : "transparent",
                      color: activePage === p ? "oklch(38% .095 295)" : "oklch(52% .012 270)",
                      border: activePage === p ? "1px solid oklch(82% .06 295)" : "1px solid oklch(90% .005 270)",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span
        className="text-[10px] font-bold uppercase tracking-[0.16em] block mb-1"
        style={{ color: "oklch(58% .010 270)" }}
      >
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
        style={{
          background: "oklch(97% .001 270)",
          border: "1px solid oklch(89% .005 270)",
          color: "oklch(22% .012 270)",
        }}
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span
        className="text-[10px] font-bold uppercase tracking-[0.16em] block mb-1"
        style={{ color: "oklch(58% .010 270)" }}
      >
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none resize-none"
        style={{
          background: "oklch(97% .001 270)",
          border: "1px solid oklch(89% .005 270)",
          color: "oklch(22% .012 270)",
          lineHeight: "1.55",
        }}
      />
    </label>
  );
}

function RegenButton({
  section,
  regenerating,
  onRegen,
}: {
  section: SectionKey;
  regenerating: SectionKey | null;
  onRegen: (s: SectionKey) => void;
}) {
  return (
    <button
      type="button"
      disabled={regenerating !== null}
      onClick={() => onRegen(section)}
      className="text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
      style={{ border: "1px solid oklch(86% .05 295)", color: "oklch(38% .095 295)", background: "oklch(94% .03 295)" }}
    >
      {regenerating === section ? "Regenerating…" : `Regenerate ${section}`}
    </button>
  );
}
