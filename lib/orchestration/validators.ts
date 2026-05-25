import type { GeneratedSections, StartupBrief } from "@/lib/types/startup";

export function isStartupBrief(data: unknown): data is StartupBrief {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  const pricing = d.pricing as Record<string, unknown> | undefined;
  return (
    typeof d.name === "string" &&
    typeof d.tagline === "string" &&
    typeof d.description === "string" &&
    Array.isArray(d.features) &&
    d.features.every((f) => typeof f === "string") &&
    pricing !== null &&
    typeof pricing === "object" &&
    typeof pricing.summary === "string" &&
    Array.isArray(pricing.tiers) &&
    pricing.tiers.every(
      (t) =>
        t &&
        typeof t === "object" &&
        typeof (t as Record<string, unknown>).name === "string" &&
        typeof (t as Record<string, unknown>).price === "string" &&
        typeof (t as Record<string, unknown>).detail === "string"
    )
  );
}

export function isGeneratedSections(data: unknown): data is GeneratedSections {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  const hero = d.hero as Record<string, unknown> | undefined;
  const features = d.features as Record<string, unknown> | undefined;
  return (
    hero !== null &&
    typeof hero === "object" &&
    typeof hero.headline === "string" &&
    typeof features === "object" &&
    features !== null &&
    Array.isArray(features.items) &&
    Array.isArray(d.testimonials) &&
    Array.isArray(d.faq)
  );
}

export function validateIdea(idea: unknown): string {
  if (typeof idea !== "string") {
    throw new Error("Idea must be a string.");
  }
  const trimmed = idea.trim();
  if (trimmed.length < 8) {
    throw new Error("Please describe your startup idea in at least a few words.");
  }
  if (trimmed.length > 600) {
    throw new Error("Please keep your idea under 600 characters.");
  }
  return trimmed;
}
