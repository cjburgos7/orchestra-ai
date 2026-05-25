/** @deprecated Import from @/lib/types/startup — kept for backward compatibility */
export type {
  StartupBrief,
  StartupProject,
  GeneratedSections,
  DirectionId,
  Pricing,
  PricingTier,
} from "@/lib/types/startup";

export {
  briefFromProject,
  createEmptyProject,
} from "@/lib/types/startup";

export const STARTUP_BRIEF_EXAMPLE = {
  name: "CampusMentor AI",
  tagline: "Your personal study coach, available 24/7.",
  description:
    "An AI tutor that helps college students understand coursework, plan study sessions, and stay on track — without replacing human professors.",
  features: [
    "Upload syllabi and get a personalized study plan",
    "Chat with an AI tutor that explains concepts step-by-step",
    "Practice quizzes generated from your class materials",
    "Progress dashboard for students and study groups",
  ],
  pricing: {
    summary: "Freemium with a student-friendly Pro tier.",
    tiers: [
      { name: "Free", price: "$0", detail: "5 tutoring sessions / month" },
      { name: "Pro", price: "$12/mo", detail: "Unlimited sessions + quiz generator" },
      { name: "Campus", price: "Custom", detail: "Department-wide licenses" },
    ],
  },
};
