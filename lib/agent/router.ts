/**
 * Orchestra Agent — Tool Router
 *
 * The router maps founder intent to the right tool(s).
 * The founder never needs to know which tool handles a request.
 * They express what they want; the agent decides how to accomplish it.
 */

import type {
  AgentIntent,
  ToolRoute,
  ToolCapability,
  StartupContext,
} from "./types";

// ─── Tool Registry ───────────────────────────────────────────────────────────

export const TOOL_CAPABILITIES: ToolCapability[] = [
  {
    id: "claude",
    name: "Claude",
    description: "Business reasoning, strategy, copywriting, analysis",
    handles: [
      "generate-startup-identity",
      "write-copy",
      "analyze-business",
      "plan-launch",
      "plan-growth",
      "recommend-next",
    ],
    requiresConfig: false,
  },
  {
    id: "lovable",
    name: "Lovable",
    description: "Website and UI generation from natural language",
    handles: ["generate-website"],
    requiresConfig: true,
    configKey: "LOVABLE_API_KEY",
  },
  {
    id: "higgsfield",
    name: "Higgsfield",
    description: "Cinematic video and visual generation",
    handles: ["generate-visuals"],
    requiresConfig: true,
    configKey: "HIGGSFIELD_API_KEY",
  },
  {
    id: "flux",
    name: "Flux (Replicate)",
    description: "High-quality still image generation",
    handles: ["generate-visuals"],
    requiresConfig: true,
    configKey: "REPLICATE_API_TOKEN",
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Database, auth, and persistent memory",
    handles: ["set-up-integration", "capture-leads"],
    requiresConfig: true,
    configKey: "NEXT_PUBLIC_SUPABASE_URL",
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Production deployment and hosting",
    handles: ["deploy-website"],
    requiresConfig: true,
    configKey: "VERCEL_API_TOKEN",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Payment processing and billing",
    handles: ["set-up-integration"],
    requiresConfig: true,
    configKey: "STRIPE_SECRET_KEY",
  },
  {
    id: "resend",
    name: "Resend",
    description: "Transactional and campaign email",
    handles: ["send-campaign", "set-up-integration"],
    requiresConfig: true,
    configKey: "RESEND_API_KEY",
  },
];

// ─── Route Table ─────────────────────────────────────────────────────────────

export const TOOL_ROUTES: Record<AgentIntent, ToolRoute> = {
  "generate-startup-identity": {
    intent: "generate-startup-identity",
    primaryTool: "claude",
    secondaryTools: [],
    description: "Claude reasons about the founder's idea and generates a complete startup brief",
    requiresStartup: false,
    estimatedDuration: "30–60 seconds",
  },
  "generate-website": {
    intent: "generate-website",
    primaryTool: "lovable",
    secondaryTools: ["claude"],
    description: "Claude produces a Lovable brief; Lovable generates the website",
    requiresStartup: true,
    requiresIntegration: "lovable",
    estimatedDuration: "2–5 minutes",
  },
  "generate-visuals": {
    intent: "generate-visuals",
    primaryTool: "higgsfield",
    secondaryTools: ["flux", "claude"],
    description: "Claude writes the visual brief; Higgsfield/Flux generates the assets",
    requiresStartup: true,
    requiresIntegration: "higgsfield",
    estimatedDuration: "1–3 minutes",
  },
  "write-copy": {
    intent: "write-copy",
    primaryTool: "claude",
    secondaryTools: [],
    description: "Claude writes copy for any surface: homepage, emails, ads, pitches",
    requiresStartup: false,
    estimatedDuration: "10–30 seconds",
  },
  "analyze-business": {
    intent: "analyze-business",
    primaryTool: "claude",
    secondaryTools: [],
    description: "Claude analyzes the business model, positioning, and competitive landscape",
    requiresStartup: true,
    estimatedDuration: "15–45 seconds",
  },
  "plan-launch": {
    intent: "plan-launch",
    primaryTool: "claude",
    secondaryTools: [],
    description: "Claude creates a prioritized launch roadmap based on startup context",
    requiresStartup: true,
    estimatedDuration: "15–30 seconds",
  },
  "plan-growth": {
    intent: "plan-growth",
    primaryTool: "claude",
    secondaryTools: [],
    description: "Claude identifies growth opportunities and recommends experiments",
    requiresStartup: true,
    estimatedDuration: "15–30 seconds",
  },
  "set-up-integration": {
    intent: "set-up-integration",
    primaryTool: "orchestra",
    secondaryTools: ["supabase", "stripe", "resend"],
    description: "Orchestra guides the founder through connecting a new tool",
    requiresStartup: false,
    estimatedDuration: "5–15 minutes",
  },
  "capture-leads": {
    intent: "capture-leads",
    primaryTool: "supabase",
    secondaryTools: [],
    description: "Store and manage leads in the Supabase database",
    requiresStartup: true,
    requiresIntegration: "supabase",
    estimatedDuration: "Instant",
  },
  "send-campaign": {
    intent: "send-campaign",
    primaryTool: "resend",
    secondaryTools: ["claude"],
    description: "Claude writes the campaign; Resend delivers it",
    requiresStartup: true,
    requiresIntegration: "resend",
    estimatedDuration: "2–10 minutes",
  },
  "review-analytics": {
    intent: "review-analytics",
    primaryTool: "orchestra",
    secondaryTools: [],
    description: "Orchestra surfaces key metrics from connected analytics tools",
    requiresStartup: true,
    estimatedDuration: "Instant",
  },
  "deploy-website": {
    intent: "deploy-website",
    primaryTool: "vercel",
    secondaryTools: ["lovable"],
    description: "Deploy the generated website to a production URL",
    requiresStartup: true,
    requiresIntegration: "vercel",
    estimatedDuration: "1–3 minutes",
  },
  "recommend-next": {
    intent: "recommend-next",
    primaryTool: "orchestra",
    secondaryTools: ["claude"],
    description: "Orchestra synthesizes context and recommends the highest-impact next action",
    requiresStartup: false,
    estimatedDuration: "Instant",
  },
};

// ─── Routing Logic ───────────────────────────────────────────────────────────

export function resolveRoute(intent: AgentIntent): ToolRoute {
  return TOOL_ROUTES[intent];
}

/**
 * Determine if a route is executable given current startup + integration state.
 * Returns null if executable, or a string explaining why it's blocked.
 */
export function getBlockReason(
  route: ToolRoute,
  startup: StartupContext | null
): string | null {
  if (route.requiresStartup && !startup) {
    return "Create your startup first";
  }

  if (route.requiresIntegration) {
    const integration = startup?.integrations.find(
      (i) => i.id === route.requiresIntegration
    );
    if (!integration?.connected) {
      const tool = TOOL_CAPABILITIES.find((t) => t.id === route.requiresIntegration);
      return `Connect ${tool?.name ?? route.requiresIntegration} to continue`;
    }
  }

  return null;
}

/**
 * Parse natural language intent from founder input.
 * This is a lightweight heuristic — Claude handles ambiguous cases.
 */
export function inferIntent(input: string): AgentIntent {
  const lower = input.toLowerCase();

  if (lower.match(/website|landing page|site|lovable/)) return "generate-website";
  if (lower.match(/image|visual|photo|video|higgsfield|flux/)) return "generate-visuals";
  if (lower.match(/email|campaign|newsletter|outreach/)) return "send-campaign";
  if (lower.match(/lead|contact|prospect|crm/)) return "capture-leads";
  if (lower.match(/launch|ship|go live|release/)) return "plan-launch";
  if (lower.match(/grow|growth|acquisition|channel|marketing/)) return "plan-growth";
  if (lower.match(/analytic|metric|data|track|insight/)) return "review-analytics";
  if (lower.match(/payment|stripe|billing|revenue/)) return "set-up-integration";
  if (lower.match(/deploy|vercel|domain|dns|hosting/)) return "deploy-website";
  if (lower.match(/write|copy|content|headline|tagline/)) return "write-copy";
  if (lower.match(/analyz|audit|review|assess|competitive|position/)) return "analyze-business";

  return "recommend-next";
}
