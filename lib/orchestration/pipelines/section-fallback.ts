import type { GeneratedSections, StartupBrief } from "@/lib/types/startup";

export function fallbackSections(
  brief: StartupBrief,
  directionLabel: string
): GeneratedSections {
  return {
    navbar: {
      brandLabel: brief.name,
      ctaLabel: "Get started",
    },
    hero: {
      eyebrow: `${brief.startupCategory ?? "AI startup"} · ${directionLabel}`,
      headline: brief.name,
      subheadline: brief.tagline,
      ctaPrimary: "Get started free",
      ctaSecondary: "See how it works",
    },
    features: {
      sectionTitle: "Built for the way you work",
      items: brief.features.map((f, i) => ({
        title: ["Simple setup", "Smart automation", "Clear insights", "Room to grow"][i] ?? "Feature",
        description: f,
      })),
    },
    testimonials: [
      {
        quote: `${brief.name} made our launch feel effortless. We went from idea to live product faster than we thought possible.`,
        name: "Alex Rivera",
        role: "Founder",
      },
      {
        quote: `The ${directionLabel} direction felt exactly right for our brand. Everything was editable before we launched.`,
        name: "Jordan Lee",
        role: "Product lead",
      },
      {
        quote: brief.description.slice(0, 120) + (brief.description.length > 120 ? "…" : ""),
        name: "Sam Okonkwo",
        role: "Early customer",
      },
    ],
    pricing: {
      sectionTitle: "Plans that grow with you",
      subtitle: brief.pricing.summary,
    },
    faq: [
      {
        question: "Can I customize everything before launch?",
        answer:
          "Yes. All content, colors, layout, branding, and copy can be refined inside Orchestra before you go live.",
      },
      {
        question: "Who is this built for?",
        answer:
          brief.audience ??
          "Founders and teams who want to ship an AI startup without heavy technical setup.",
      },
      {
        question: "Is this a final website?",
        answer:
          "This is your Orchestra workspace. Keep iterating until you're ready to launch for real.",
      },
    ],
    cta: {
      headline: "Ready to launch your startup?",
      subheadline: "Continue refining in Orchestra — your progress is saved.",
      buttonText: "Continue building",
    },
    footer: {
      tagline: `${brief.name} · Crafted with Orchestra`,
    },
  };
}
