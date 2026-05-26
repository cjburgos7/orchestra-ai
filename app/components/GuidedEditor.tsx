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
  const [openPanelLocal, setOpenPanelLocal] = useState("brand");
  const openPanel = openPanelProp ?? openPanelLocal;
  const setOpenPanel = onPanelChange ?? setOpenPanelLocal;
  const abortRef = useRef<AbortController | null>(null);
  const projectRef = useRef(project);
  projectRef.current = project;

  const brief = briefFromProject(project);
  const sections = project.generatedSections!;
  const direction = project.selectedDirection ?? "orchestra";
  const wildcards = project.wildcardDirections ?? pickWildcards(project.id);
  const directionOptions = buildDirectionOptions(wildcards);

  const persist = useCallback(
    (next: StartupProject) => {
      const saved = saveProject(next);
      onUpdate(saved);
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
    const currentDirection = current.selectedDirection ?? "orchestra";

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
    { id: "brand", label: "Brand" },
    { id: "hero", label: "Hero" },
    { id: "features", label: "Features" },
    { id: "social", label: "Social proof" },
    { id: "pricing", label: "Pricing" },
    { id: "cta", label: "CTA" },
    { id: "style", label: "Style" },
  ];

  return (
    <aside className="mb-6 rounded-2xl border border-blue-100 bg-white shadow-sm animate-fade-up overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <p className="text-[13px] font-bold text-slate-900">Guided editing</p>
        <p className="text-[12px] text-slate-500">
          Refine copy, regenerate sections, or switch direction. Auto-saved.
        </p>
      </div>

      <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b border-slate-50">
        {panels.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpenPanel(p.id)}
            className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              openPanel === p.id ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto">
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
              <div key={i} className="rounded-xl border border-slate-100 p-3 space-y-2">
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
              <div key={i} className="rounded-xl border border-slate-100 p-3 space-y-2">
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
              <div key={i} className="rounded-xl border border-slate-100 p-3 space-y-2">
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
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">FAQ</span>
              {sections.faq.map((item, i) => (
                <div key={i} className="mt-2 rounded-xl border border-slate-100 p-3 space-y-2">
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
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Visual direction
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {directionOptions.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => switchDirection(d.id as DirectionId)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all ${
                      direction === d.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {d.label}
                    {d.isWildcard && " ✦"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Accent color
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {ACCENT_SWATCHES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAccent(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      sections.visuals?.accentColor === c ? "border-blue-600 scale-110" : "border-white shadow-sm"
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Accent ${c}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Preview page
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {(["home", "features", "pricing", "about", "dashboard", "login"] as SitePageId[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={`text-[11px] font-medium px-3 py-1.5 rounded-lg border capitalize ${
                      activePage === p
                        ? "border-blue-300 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
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
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
      className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 disabled:opacity-50"
    >
      {regenerating === section ? "Regenerating…" : `Regenerate ${section}`}
    </button>
  );
}
