/**
 * Orchestra Agent — Recommendation Engine
 *
 * Generates prioritized next actions based on startup context and launch progress.
 * Actions are ranked by: (1) unblock critical path, (2) unlock revenue, (3) reduce risk.
 *
 * This is pure logic — no AI calls. Claude is invoked separately for strategic advice.
 */

import type { StartupContext, RecommendedAction } from "./types";

export function buildRecommendations(
  startup: StartupContext | null
): RecommendedAction[] {
  if (!startup) {
    return [
      {
        id: "no-startup-create",
        priority: "critical",
        category: "setup",
        label: "Create your startup",
        description:
          "Describe your idea in one sentence. Orchestra will name it, brand it, and generate your launch page.",
        intent: "generate-startup-identity",
        primaryTool: "claude",
        ctaLabel: "Start building →",
        ctaHref: "/app?generate=1",
      },
    ];
  }

  const actions: RecommendedAction[] = [];
  const p = startup.launchProgress;

  // ── Critical path: website ──────────────────────────────────────────────
  if (!p.websiteGenerated) {
    actions.push({
      id: "generate-website",
      priority: "critical",
      category: "setup",
      label: "Generate your launch page",
      description:
        `${startup.name} needs a website. Orchestra will produce a brief and generate it via Lovable.`,
      intent: "generate-website",
      primaryTool: "lovable",
      ctaLabel: "Generate website",
      blocked: !startup.integrations.find((i) => i.id === "lovable")?.connected,
      blockReason: "Connect Lovable to generate your website",
    });
  }

  // ── Visuals ─────────────────────────────────────────────────────────────
  if (p.websiteGenerated && !p.imagesGenerated) {
    actions.push({
      id: "generate-visuals",
      priority: "high",
      category: "setup",
      label: "Generate visual assets",
      description:
        "Create cinematic product imagery and brand visuals for your launch page.",
      intent: "generate-visuals",
      primaryTool: "higgsfield",
      ctaLabel: "Generate visuals",
    });
  }

  // ── Domain ──────────────────────────────────────────────────────────────
  if (p.websiteGenerated && !p.domainConnected) {
    actions.push({
      id: "connect-domain",
      priority: "high",
      category: "launch",
      label: "Connect your domain",
      description: "Deploy your site to a real URL. Vercel makes this one command.",
      intent: "deploy-website",
      primaryTool: "vercel",
      ctaLabel: "Set up domain",
      ctaHref: "/app/launch",
    });
  }

  // ── Email ───────────────────────────────────────────────────────────────
  if (!p.emailConfigured) {
    actions.push({
      id: "configure-email",
      priority: p.domainConnected ? "high" : "medium",
      category: "launch",
      label: "Set up outreach email",
      description:
        "Connect Resend to send campaigns, waitlist confirmations, and founder outreach.",
      intent: "set-up-integration",
      primaryTool: "resend",
      ctaLabel: "Connect Resend",
      ctaHref: "/app/campaigns",
    });
  }

  // ── First campaign ──────────────────────────────────────────────────────
  if (p.emailConfigured && !p.firstCampaignSent) {
    actions.push({
      id: "first-campaign",
      priority: "high",
      category: "growth",
      label: "Send your first campaign",
      description:
        "Claude will write it. Resend will deliver it. One campaign gets your first signal.",
      intent: "send-campaign",
      primaryTool: "resend",
      ctaLabel: "Create campaign →",
      ctaHref: "/app/campaigns",
    });
  }

  // ── Payment ─────────────────────────────────────────────────────────────
  if (!p.paymentEnabled && p.websiteGenerated) {
    actions.push({
      id: "enable-payments",
      priority: "medium",
      category: "operations",
      label: "Enable payments",
      description: "Connect Stripe to start accepting revenue from day one.",
      intent: "set-up-integration",
      primaryTool: "stripe",
      ctaLabel: "Connect Stripe",
      ctaHref: "/app/payments",
    });
  }

  // ── Analytics ───────────────────────────────────────────────────────────
  if (!p.analyticsActive && p.domainConnected) {
    actions.push({
      id: "connect-analytics",
      priority: "medium",
      category: "operations",
      label: "Track your first visitors",
      description: "PostHog gives you real-time insight into who's visiting and what they do.",
      intent: "set-up-integration",
      primaryTool: "orchestra",
      ctaLabel: "Set up analytics",
      ctaHref: "/app/analytics",
    });
  }

  // ── Strategic advice (always available) ────────────────────────────────
  actions.push({
    id: "analyze-business",
    priority: "low",
    category: "insight",
    label: "Analyze your business",
    description:
      "Claude will audit your positioning, competitive edge, and recommend strategic moves.",
    intent: "analyze-business",
    primaryTool: "claude",
    ctaLabel: "Get analysis",
  });

  // Sort: critical → high → medium → low, then by category (setup first)
  const priorityOrder: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return actions.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );
}

/**
 * Returns the single most important action the founder should take right now.
 */
export function getTopRecommendation(
  startup: StartupContext | null
): RecommendedAction | null {
  const all = buildRecommendations(startup);
  return all[0] ?? null;
}

/**
 * Returns a short contextual message from the agent based on launch progress.
 */
export function getAgentStatusMessage(startup: StartupContext | null): string {
  if (!startup) {
    return "Ready to help you build. Describe your idea to get started.";
  }

  const p = startup.launchProgress;

  if (!p.websiteGenerated) {
    return `${startup.name} has an identity. Next: generate the launch page.`;
  }
  if (!p.domainConnected) {
    return `Website is ready. Connect a domain to go live.`;
  }
  if (!p.firstLeadCaptured) {
    return `You're live. Time to capture your first lead.`;
  }
  if (!p.firstCampaignSent) {
    return `First lead in. Send your first campaign.`;
  }
  if (!p.paymentEnabled) {
    return `Campaigns running. Enable payments to generate revenue.`;
  }

  return `${startup.name} is operating. Review your metrics and plan your next growth move.`;
}
