"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { DirectionId, StartupBrief, StartupProject, GeneratedSections } from "@/lib/types/startup";
import { briefFromProject } from "@/lib/types/startup";
import { assignSlug, saveProject } from "@/lib/persistence/projects";
import { generatePages } from "@/lib/orchestration/pipelines/generate-pages";
import { pickWildcards } from "@/lib/orchestration/wildcards";
import LandingPagePreview from "./LandingPagePreview";

const LOADING_STEPS = [
  "Reading your idea…",
  "Naming your startup…",
  "Crafting your tagline…",
  "Designing features…",
  "Shaping pricing…",
  "Almost ready…",
];

const EXPAND_STEPS = [
  "Orchestra is continuing to build…",
  "Expanding your landing page…",
  "Writing testimonials…",
  "Polishing sections…",
];

const PLACEHOLDER = "I want an AI tutor for college students.";

export default function StartupGenerator() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<StartupProject | null>(null);
  const [reveal, setReveal] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const [expandStep, setExpandStep] = useState(0);

  const brief: StartupBrief | null = project ? briefFromProject(project) : null;

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStep((s) => (s + 1) % LOADING_STEPS.length);
    }, 900);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (!continuing) return;
    const interval = setInterval(() => {
      setExpandStep((s) => (s + 1) % EXPAND_STEPS.length);
    }, 900);
    return () => clearInterval(interval);
  }, [continuing]);

  useEffect(() => {
    if (brief) {
      const t = requestAnimationFrame(() => setReveal(true));
      return () => cancelAnimationFrame(t);
    }
    setReveal(false);
  }, [brief]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setProject(null);
    setReveal(false);
    setLoading(true);
    setLoadingStep(0);

    try {
      const res = await fetch("/api/generate-startup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() || PLACEHOLDER }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setProject(data.project as StartupProject);
    } catch {
      setError("Could not reach the server. Is your dev server running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleContinue(direction: DirectionId) {
    if (!brief || !project) return;
    setContinuing(true);
    setExpandStep(0);
    setError(null);

    try {
      const res = await fetch("/api/generate-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, direction }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not expand your landing page.");
        return;
      }

      const sections = data.sections as GeneratedSections;
      const wildcards = project.wildcardDirections ?? pickWildcards(project.id);
      const pages = generatePages(brief, sections);
      const withDirection: StartupProject = {
        ...project,
        wildcardDirections: wildcards,
        selectedDirection: direction,
        generatedSections: sections,
        generatedPages: pages,
        status: "complete",
      };
      const withSlug = assignSlug(withDirection);
      saveProject(withSlug);

      router.push(`/projects/${withSlug.slug}`);
    } catch {
      setError("Could not reach the server. Is your dev server running?");
    } finally {
      setContinuing(false);
    }
  }

  return (
    <section id="generate" className="py-28 bg-[#F8FAFC] border-t border-slate-100 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-100 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse-soft" />
            AI-powered · try it now
          </div>
          <h2 className="text-[42px] font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
            Describe your idea. Watch Orchestra build it.
          </h2>
          <p className="text-[16px] text-slate-500 max-w-lg mx-auto leading-relaxed">
            Type a sentence about the startup you want. We&apos;ll generate a name, pitch, features,
            and pricing — instantly.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="relative">
          <div
            className={`rounded-3xl border bg-white p-2 shadow-lg transition-all duration-500 ${
              loading
                ? "border-blue-200 shadow-blue-100/80 magic-glow"
                : "border-slate-200 shadow-slate-200/60"
            }`}
          >
            <label htmlFor="startup-idea" className="sr-only">
              Your startup idea
            </label>
            <textarea
              id="startup-idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={PLACEHOLDER}
              rows={3}
              disabled={loading || continuing}
              className="w-full resize-none rounded-2xl border-0 bg-transparent px-5 py-4 text-[16px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 disabled:opacity-60"
            />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-3 pb-3 pt-1">
              <p className="text-[12px] text-slate-400 px-2 hidden sm:block">
                Press Generate — results appear in seconds
              </p>
              <button
                type="submit"
                disabled={loading || continuing}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold text-[15px] shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-80 disabled:hover:translate-y-0 disabled:cursor-wait min-w-[200px]"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    Generate my startup
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {loading && (
          <div className="mt-8 rounded-3xl border border-blue-100 bg-white p-8 shadow-sm animate-fade-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-400 opacity-20 animate-pulse-soft" />
                <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-blue-500 to-violet-400 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">O</span>
                </div>
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900">Orchestra is thinking…</p>
                <p className="text-[13px] text-blue-600 font-medium transition-all duration-300">
                  {LOADING_STEPS[loadingStep]}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {[88, 72, 94, 60].map((w, i) => (
                <div
                  key={i}
                  className="h-3 rounded-full bg-slate-100 overflow-hidden"
                  style={{ width: `${w}%` }}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-100 via-violet-100 to-green-100 shimmer-bar"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {continuing && (
          <div className="mt-8 rounded-3xl border border-violet-100 bg-white p-8 shadow-sm animate-fade-up">
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
              <div>
                <p className="text-[14px] font-bold text-slate-900">Orchestra is continuing to build your startup</p>
                <p className="text-[13px] text-violet-600 font-medium">{EXPAND_STEPS[expandStep]}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-[14px] text-red-700 font-medium animate-fade-up">
            {error}
          </div>
        )}

        {brief && !loading && (
          <div
            className={`mt-10 space-y-4 transition-all duration-700 ${
              reveal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div
              className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-violet-50/40 p-8 shadow-md shadow-blue-100/30 animate-fade-up"
              style={{ animationDelay: "0ms" }}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-400 flex items-center justify-center shadow-lg shadow-blue-200 flex-shrink-0">
                  <span className="text-white text-xl font-black">{brief.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-green-600 mb-1">
                    ✓ Startup generated
                  </p>
                  <h3 className="text-[28px] font-extrabold text-slate-900 tracking-tight mb-2">
                    {brief.name}
                  </h3>
                  <p className="text-[16px] text-blue-700 font-semibold mb-3">{brief.tagline}</p>
                  <p className="text-[15px] text-slate-600 leading-relaxed mb-3">{brief.description}</p>
                  {project?.audience && (
                    <p className="text-[12px] text-slate-400">
                      <span className="font-semibold text-slate-500">Audience:</span> {project.audience}
                      {project.startupCategory && (
                        <>
                          {" "}
                          · <span className="font-semibold text-slate-500">Category:</span>{" "}
                          {project.startupCategory}
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div
              className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm animate-fade-up"
              style={{ animationDelay: "120ms" }}
            >
              <h4 className="text-[13px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                Product features
              </h4>
              <ul className="space-y-3">
                {brief.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600 text-[11px] font-bold">
                      {i + 1}
                    </span>
                    <span className="text-[14px] text-slate-600 leading-relaxed pt-0.5">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm animate-fade-up"
              style={{ animationDelay: "240ms" }}
            >
              <h4 className="text-[13px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Pricing idea
              </h4>
              <p className="text-[14px] text-slate-500 mb-5">{brief.pricing.summary}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {brief.pricing.tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className="rounded-2xl border border-slate-100 bg-[#FAFBFC] p-4 text-center"
                  >
                    <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                      {tier.name}
                    </div>
                    <div className="text-[20px] font-black text-slate-900 mb-1">{tier.price}</div>
                    <div className="text-[12px] text-slate-500 leading-snug">{tier.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-5xl mx-auto pt-4 -mx-2 px-2">
              <LandingPagePreview
                brief={brief}
                seed={project?.id ?? brief.name}
                onContinue={handleContinue}
                continuing={continuing}
              />
            </div>

            <p className="text-center text-[13px] text-slate-400 pt-2">
              Pick a direction — Orchestra will open your dedicated project page.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
