import type { GeneratedSections, StartupBrief } from "@/lib/types/startup";
import { resolveCategory } from "@/lib/orchestration/category-resolution";
import { resolveWorldDNA, pickFeatureArchetypes } from "@/lib/orchestration/world-dna";

function testimonialRoles(dnaId: string): string[] {
  if (dnaId.includes("basketball") || dnaId.includes("analytics")) {
    return ["Head Coach", "Director of Scouting", "Performance Director", "GM", "Analytics Lead"];
  }
  if (dnaId.includes("fruit") || dnaId.includes("commerce")) {
    return ["Subscriber", "Nutritionist", "Farm partner", "Chef", "Operations lead"];
  }
  if (dnaId.includes("creator")) {
    return ["Content creator", "Brand manager", "Agency lead", "Influencer", "Growth lead"];
  }
  return ["Founder", "Product lead", "Early customer", "Operations", "Director"];
}

export function fallbackSections(
  brief: StartupBrief,
  directionLabel: string
): GeneratedSections {
  const resolution = resolveCategory(brief);
  const dna = resolveWorldDNA(brief, resolution);
  const archetypes = pickFeatureArchetypes(dna, 4);
  const roles = testimonialRoles(dna.id);

  const featureSectionTitle =
    dna.mode === "analytics-platform"
      ? "Intelligence that wins games"
      : dna.mode === "creator-platform"
        ? "Built for creator growth"
        : dna.mode === "commerce-editorial"
          ? "Why subscribers stay"
          : "Built for the way you work";

  return {
    navbar: {
      brandLabel: brief.name,
      ctaLabel: dna.mode === "analytics-platform" ? "Request demo" : dna.showCommerceSections ? "Shop now" : "Get started",
    },
    hero: {
      eyebrow: `${resolution.visualWorld.split("·")[0]?.trim() ?? brief.startupCategory ?? "Startup"} · ${directionLabel}`,
      headline: brief.name,
      subheadline: brief.tagline,
      ctaPrimary: dna.mode === "analytics-platform" ? "See live demo" : "Get started free",
      ctaSecondary: dna.mode === "analytics-platform" ? "View sample report" : "See how it works",
    },
    features: {
      sectionTitle: featureSectionTitle,
      items: archetypes.map((a, i) => ({
        title: a.title,
        description: brief.features[i] ?? a.descriptionHint,
      })),
    },
    testimonials: [
      {
        quote: `${brief.name} changed how our team prepares for every game. The scouting reports alone saved us dozens of hours per week.`,
        name: "Marcus Chen",
        role: roles[0] ?? "Head Coach",
      },
      {
        quote: `The ${directionLabel} experience feels purpose-built for our category — not a generic template with our logo pasted on.`,
        name: "Jordan Lee",
        role: roles[1] ?? "Director",
      },
      {
        quote: brief.description.slice(0, 140) + (brief.description.length > 140 ? "…" : ""),
        name: "Sam Okonkwo",
        role: roles[2] ?? "Early customer",
      },
    ],
    pricing: {
      sectionTitle: dna.mode === "analytics-platform" ? "Plans for every program" : "Plans that grow with you",
      subtitle: brief.pricing.summary,
    },
    faq: [
      {
        question: dna.mode === "analytics-platform" ? "How does live tracking integrate with our film?" : "Can I customize everything before launch?",
        answer:
          dna.mode === "analytics-platform"
            ? "Our platform syncs with major camera systems and uploads game film automatically — tracking data appears within minutes of tip-off."
            : "Yes. All content, colors, layout, branding, and copy can be refined inside Orchestra before you go live.",
      },
      {
        question: "Who is this built for?",
        answer: brief.audience ?? dna.emotionalTone,
      },
      {
        question: "Is this a final website?",
        answer: "This is your Orchestra workspace. Keep iterating until you're ready to launch for real.",
      },
    ],
    cta: {
      headline: dna.mode === "analytics-platform" ? "Ready to elevate your program?" : "Ready to launch your startup?",
      subheadline: "Continue refining in Orchestra — your progress is saved.",
      buttonText: dna.mode === "analytics-platform" ? "Book a demo" : "Continue building",
    },
    footer: {
      tagline: `${brief.name} · Crafted with Orchestra`,
    },
  };
}
