/** Core visual direction presets */
export type CoreDirectionId =
  | "orchestra"
  | "premium-dark"
  | "bold-experimental"
  | "minimal-clean";

/** Rotating creative wildcard directions */
export type WildcardDirectionId =
  | "luxury-editorial"
  | "glass-futuristic"
  | "creator-playful"
  | "apple-modern"
  | "retro-tech"
  | "creative-agency"
  | "fashion-ai"
  | "genz-vibrant"
  | "cinematic-ai"
  | "minimal-luxury";

export type DirectionId = CoreDirectionId | WildcardDirectionId;

export type SitePageId =
  | "home"
  | "features"
  | "pricing"
  | "about"
  | "contact"
  | "blog"
  | "dashboard"
  | "login";

export type PricingTier = {
  name: string;
  price: string;
  detail: string;
};

export type Pricing = {
  summary: string;
  tiers: PricingTier[];
};

/** Core AI-generated startup content (stable API shape) */
export type StartupBrief = {
  name: string;
  tagline: string;
  description: string;
  features: string[];
  pricing: Pricing;
  audience?: string;
  brandTone?: string;
  startupCategory?: string;
};

export type StartupLogo = {
  monogram: string;
  wordmark: string;
  shape: "rounded" | "circle" | "squircle" | "sharp";
  style: "gradient" | "solid" | "outline" | "glass";
  fontStyle: "sans" | "serif" | "mono" | "display";
  accentColor: string;
  secondaryColor: string;
};

export type SiteVisuals = {
  heroVisual: "dashboard" | "device" | "analytics" | "workflow" | "creator" | "onboarding" | "saas-panel";
  secondaryVisual?: "onboarding" | "analytics" | "saas-panel";
  accentColor: string;
  logo?: StartupLogo;
};

/** Modular website sections (home page) */
export type GeneratedSections = {
  navbar: {
    brandLabel: string;
    ctaLabel: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  features: {
    sectionTitle: string;
    items: { title: string; description: string }[];
  };
  testimonials: { quote: string; name: string; role: string }[];
  pricing: { sectionTitle: string; subtitle: string };
  faq: { question: string; answer: string }[];
  cta: { headline: string; subheadline: string; buttonText: string };
  footer: { tagline: string };
  visuals?: SiteVisuals;
};

export type AboutPage = {
  headline: string;
  story: string;
  mission: string;
  values: { title: string; description: string }[];
};

export type ContactPage = {
  headline: string;
  subheadline: string;
  email: string;
  ctaLabel: string;
};

export type BlogPage = {
  headline: string;
  posts: { title: string; excerpt: string; date: string; tag: string }[];
};

export type DashboardPage = {
  headline: string;
  welcome: string;
  stats: { label: string; value: string; change: string }[];
};

export type LoginPage = {
  headline: string;
  subheadline: string;
  buttonLabel: string;
  footerNote: string;
};

export type GeneratedPages = {
  about: AboutPage;
  contact: ContactPage;
  blog: BlogPage;
  dashboard: DashboardPage;
  login: LoginPage;
};

export type StartupProjectStatus =
  | "idle"
  | "generating"
  | "ready"
  | "expanding"
  | "complete";

export type SectionKey = keyof GeneratedSections;

/** Structured startup object — foundation for save/load, auth, launch */
export type StartupProject = {
  id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  idea: string;
  startupName: string;
  tagline: string;
  description: string;
  audience: string;
  brandTone: string;
  startupCategory: string;
  features: string[];
  pricing: Pricing;
  directions: DirectionId[];
  wildcardDirections?: WildcardDirectionId[];
  selectedDirection: DirectionId | null;
  generatedSections: GeneratedSections | null;
  generatedPages?: GeneratedPages | null;
  status: StartupProjectStatus;
};

export function briefFromProject(project: StartupProject): StartupBrief {
  return {
    name: project.startupName,
    tagline: project.tagline,
    description: project.description,
    features: project.features,
    pricing: project.pricing,
    audience: project.audience,
    brandTone: project.brandTone,
    startupCategory: project.startupCategory,
  };
}

export function createEmptyProject(idea: string): StartupProject {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    slug: "",
    createdAt: now,
    updatedAt: now,
    idea,
    startupName: "",
    tagline: "",
    description: "",
    audience: "",
    brandTone: "",
    startupCategory: "",
    features: [],
    pricing: { summary: "", tiers: [] },
    directions: ["orchestra", "premium-dark", "bold-experimental", "minimal-clean"],
    wildcardDirections: [],
    selectedDirection: null,
    generatedSections: null,
    generatedPages: null,
    status: "idle",
  };
}

export const CORE_DIRECTIONS: CoreDirectionId[] = [
  "orchestra",
  "premium-dark",
  "bold-experimental",
  "minimal-clean",
];

export const SITE_PAGES: { id: SitePageId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "blog", label: "Blog" },
  { id: "dashboard", label: "Dashboard" },
  { id: "login", label: "Login" },
];
