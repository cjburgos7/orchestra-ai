import type { GeneratedPages, GeneratedSections, StartupBrief } from "@/lib/types/startup";
import type { DirectionId } from "@/lib/types/startup";
import { buildProductVisualsSync } from "@/lib/orchestration/product-visuals";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** @deprecated use buildProductVisuals */
export function generateVisuals(brief: StartupBrief, seed: string, direction: DirectionId = "orchestra") {
  return buildProductVisualsSync(brief, seed, direction);
}

export function generatePages(brief: StartupBrief, sections: GeneratedSections): GeneratedPages {
  const slug = slugify(brief.name);
  const email = `hello@${slug || "startup"}.com`;
  const stats = sections.visuals?.dashboardStats ?? [
    { label: "Active users", value: "2,847", change: "+12%" },
    { label: "Tasks completed", value: "18.4k", change: "+8%" },
    { label: "Time saved", value: "340h", change: "+24%" },
  ];

  return {
    about: {
      headline: `About ${brief.name}`,
      story: brief.description,
      mission: `We're building ${brief.name} to help ${brief.audience ?? "founders and teams"} move faster with AI — without sacrificing quality or control.`,
      values: sections.features.items.slice(0, 3).map((item) => ({
        title: item.title,
        description: item.description,
      })),
    },
    contact: {
      headline: "Get in touch",
      subheadline: `Questions about ${brief.name}? Our team typically responds within one business day.`,
      email,
      ctaLabel: "Send message",
    },
    blog: {
      headline: "Latest from the team",
      posts: [
        {
          title: `Why we built ${brief.name}`,
          excerpt: brief.description.slice(0, 140) + (brief.description.length > 140 ? "…" : ""),
          date: "Mar 12, 2026",
          tag: "Product",
        },
        {
          title: sections.features.items[0]?.title ?? "What's new",
          excerpt: sections.features.items[0]?.description ?? brief.tagline,
          date: "Feb 28, 2026",
          tag: "Updates",
        },
        {
          title: "Customer stories",
          excerpt:
            (sections.testimonials[0]?.quote.slice(0, 120) ?? brief.tagline) +
            (sections.testimonials[0]?.quote && sections.testimonials[0].quote.length > 120 ? "…" : ""),
          date: "Feb 14, 2026",
          tag: "Stories",
        },
      ],
    },
    dashboard: {
      headline: "Dashboard",
      welcome: `Welcome back — here's your ${brief.name} overview`,
      stats,
    },
    login: {
      headline: `Sign in to ${brief.name}`,
      subheadline: brief.tagline,
      buttonLabel: "Continue",
      footerNote: "Don't have an account? Start free →",
    },
  };
}
