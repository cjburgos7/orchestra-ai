/**
 * Orchestra Agent — Context Builder
 *
 * Transforms raw StartupProject data into the structured context
 * the agent uses for awareness, reasoning, and recommendations.
 */

import type { StartupProject } from "@/lib/types/startup";
import type {
  StartupContext,
  FounderContext,
  LaunchProgress,
  IntegrationStatus,
  FounderAction,
} from "./types";

// ─── Startup Context ────────────────────────────────────────────────────────

export function buildStartupContext(project: StartupProject): StartupContext {
  const progress = buildLaunchProgress(project);
  const integrations = buildIntegrationStatus();

  return {
    id: project.id,
    name: project.startupName,
    tagline: project.tagline,
    category: project.startupCategory || "Startup",
    description: project.description,
    audience: project.audience || "",
    businessModel: project.businessModel || "",
    status: deriveStartupStatus(project),
    integrations,
    launchProgress: progress,
    hasWebsite: !!project.generatedSections,
    hasVisuals: !!(project.generatedSections?.visuals?.imagery?.hero),
    hasLeads: false,    // future: query from Supabase
    hasCampaigns: false, // future: query from Supabase
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

function deriveStartupStatus(
  project: StartupProject
): StartupContext["status"] {
  if (project.status === "generating") return "generating";
  if (!project.generatedSections) return "draft";
  // future: check if deployed to custom domain → "launched"
  return "ready";
}

export function buildLaunchProgress(project: StartupProject): LaunchProgress {
  const hasWebsite = !!project.generatedSections;
  const hasVisuals = !!(project.generatedSections?.visuals?.imagery?.hero);

  const steps = {
    identityComplete: true, // always true when project exists
    websiteGenerated: hasWebsite,
    imagesGenerated: hasVisuals,
    domainConnected: false,   // future
    emailConfigured: false,   // future
    paymentEnabled: false,    // future
    analyticsActive: false,   // future
    firstLeadCaptured: false, // future
    firstCampaignSent: false, // future
  };

  const completed = Object.values(steps).filter(Boolean).length;
  const total = Object.keys(steps).length;

  return {
    ...steps,
    completedSteps: completed,
    totalSteps: total,
    percentComplete: Math.round((completed / total) * 100),
  };
}

function buildIntegrationStatus(): IntegrationStatus[] {
  // These will eventually be populated from Supabase user config.
  // For now, return the full registry with connected=false.
  return [
    { id: "lovable",    label: "Lovable",    connected: false },
    { id: "higgsfield", label: "Higgsfield", connected: false },
    { id: "supabase",   label: "Supabase",   connected: false },
    { id: "vercel",     label: "Vercel",     connected: false },
    { id: "stripe",     label: "Stripe",     connected: false },
    { id: "resend",     label: "Resend",     connected: false },
    { id: "posthog",    label: "PostHog",    connected: false },
  ];
}

// ─── Founder Context ────────────────────────────────────────────────────────

export function createFounderContext(
  activeStartupId: string | null = null
): FounderContext {
  return {
    sessionStart: new Date().toISOString(),
    activeStartupId,
    currentFocus: null,
    recentActions: [],
    preferences: {
      communicationStyle: "brief",
      focusAreas: [],
      notificationsEnabled: true,
    },
  };
}

export function recordFounderAction(
  context: FounderContext,
  action: Omit<FounderAction, "timestamp">
): FounderContext {
  const newAction: FounderAction = {
    ...action,
    timestamp: new Date().toISOString(),
  };

  return {
    ...context,
    recentActions: [newAction, ...context.recentActions].slice(0, 20),
  };
}

// ─── Context Summary ────────────────────────────────────────────────────────

/**
 * Returns a human-readable summary of startup context for the agent prompt.
 * Used when passing context to Claude for reasoning.
 */
export function formatContextForPrompt(
  startup: StartupContext | null,
  founder: FounderContext
): string {
  if (!startup) {
    return `The founder has not yet created a startup. They should be prompted to describe their idea.`;
  }

  const progress = startup.launchProgress;
  const completedItems = [];
  if (progress.identityComplete) completedItems.push("identity");
  if (progress.websiteGenerated) completedItems.push("website");
  if (progress.imagesGenerated) completedItems.push("visuals");

  const pendingItems = [];
  if (!progress.domainConnected) pendingItems.push("custom domain");
  if (!progress.emailConfigured) pendingItems.push("email setup");
  if (!progress.paymentEnabled) pendingItems.push("payment integration");
  if (!progress.analyticsActive) pendingItems.push("analytics");
  if (!progress.firstLeadCaptured) pendingItems.push("first lead capture");

  return [
    `Startup: ${startup.name}`,
    `Category: ${startup.category}`,
    `Tagline: "${startup.tagline}"`,
    `Audience: ${startup.audience}`,
    `Business model: ${startup.businessModel}`,
    `Status: ${startup.status} (${progress.percentComplete}% launch complete)`,
    `Completed: ${completedItems.join(", ") || "nothing yet"}`,
    `Remaining: ${pendingItems.slice(0, 3).join(", ") || "all core steps done"}`,
    founder.currentFocus ? `Current focus: ${founder.currentFocus}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
