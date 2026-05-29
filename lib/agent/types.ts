/**
 * Orchestra Agent — Core Type System
 *
 * The Agent is the orchestration layer between the founder and all tools.
 * It maintains awareness of the startup, the founder, and available capabilities.
 * It routes founder intent to the right tool and recommends next actions.
 */

// ─── Startup Awareness ──────────────────────────────────────────────────────

export type StartupStatus =
  | "draft"       // idea captured, no generation yet
  | "generating"  // generation in progress
  | "ready"       // generated, not yet launched
  | "launched";   // publicly live

export type IntegrationId =
  | "lovable"     // website generation
  | "higgsfield"  // video/visual generation
  | "flux"        // image generation (Replicate)
  | "supabase"    // database + auth
  | "vercel"      // deployment
  | "stripe"      // payments
  | "resend"      // email
  | "posthog";    // analytics

export type IntegrationStatus = {
  id: IntegrationId;
  connected: boolean;
  label: string;
  lastSynced?: string;
  error?: string;
};

export type LaunchProgress = {
  identityComplete: boolean;     // name, tagline, category defined
  websiteGenerated: boolean;     // Lovable site exists
  imagesGenerated: boolean;      // hero/visual assets exist
  domainConnected: boolean;      // custom domain live
  emailConfigured: boolean;      // outreach email set up
  paymentEnabled: boolean;       // Stripe connected
  analyticsActive: boolean;      // PostHog / analytics connected
  firstLeadCaptured: boolean;    // at least one lead in system
  firstCampaignSent: boolean;    // at least one email campaign sent
  completedSteps: number;
  totalSteps: number;
  percentComplete: number;
};

export type StartupContext = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  audience: string;
  businessModel: string;
  status: StartupStatus;
  integrations: IntegrationStatus[];
  launchProgress: LaunchProgress;
  hasWebsite: boolean;
  hasVisuals: boolean;
  hasLeads: boolean;
  hasCampaigns: boolean;
  createdAt: string;
  updatedAt: string;
};

// ─── Founder Awareness ──────────────────────────────────────────────────────

export type FounderFocus =
  | "identity"     // working on startup identity/brand
  | "website"      // generating or editing website
  | "visuals"      // generating images or videos
  | "launch"       // working toward launch
  | "growth"       // post-launch growth activities
  | "operations"   // running the business
  | null;

export type FounderAction = {
  type: string;
  label: string;
  timestamp: string;
  context?: Record<string, unknown>;
};

export type FounderPreferences = {
  communicationStyle: "brief" | "detailed";
  focusAreas: string[];
  notificationsEnabled: boolean;
};

export type FounderContext = {
  sessionStart: string;
  activeStartupId: string | null;
  currentFocus: FounderFocus;
  recentActions: FounderAction[];
  preferences: FounderPreferences;
};

// ─── Tool Routing ───────────────────────────────────────────────────────────

/**
 * AgentIntent captures what the founder is trying to accomplish.
 * The router maps each intent to the appropriate tool.
 */
export type AgentIntent =
  | "generate-startup-identity"   // Claude → create name/tagline/brief
  | "generate-website"            // Claude + Lovable → create/update website
  | "generate-visuals"            // Higgsfield/Flux → create images/video
  | "write-copy"                  // Claude → copywriting for any surface
  | "analyze-business"            // Claude → strategic analysis
  | "plan-launch"                 // Claude → launch roadmap
  | "plan-growth"                 // Claude → growth strategy
  | "set-up-integration"          // Supabase/Stripe/etc. → configure tool
  | "capture-leads"               // Supabase → lead management
  | "send-campaign"               // Resend → email campaign
  | "review-analytics"            // PostHog → metrics review
  | "deploy-website"              // Vercel → deploy to production
  | "recommend-next";             // Agent → synthesize recommended action

export type ToolCapability = {
  id: IntegrationId | "claude" | "orchestra";
  name: string;
  description: string;
  handles: AgentIntent[];
  requiresConfig: boolean;
  configKey?: string;
};

export type ToolRoute = {
  intent: AgentIntent;
  primaryTool: IntegrationId | "claude" | "orchestra";
  secondaryTools: (IntegrationId | "claude" | "orchestra")[];
  description: string;
  requiresStartup: boolean;
  requiresIntegration?: IntegrationId;
  estimatedDuration?: string;
};

// ─── Recommended Actions ────────────────────────────────────────────────────

export type ActionPriority = "critical" | "high" | "medium" | "low";

export type RecommendedAction = {
  id: string;
  priority: ActionPriority;
  category: "setup" | "launch" | "growth" | "operations" | "insight";
  label: string;
  description: string;
  intent: AgentIntent;
  primaryTool: IntegrationId | "claude" | "orchestra";
  ctaLabel: string;
  ctaHref?: string;
  blocked?: boolean;
  blockReason?: string;
};

// ─── Agent Memory ───────────────────────────────────────────────────────────

export type MessageRole = "agent" | "founder";

export type AgentMessage = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  intent?: AgentIntent;
  toolUsed?: IntegrationId | "claude" | "orchestra";
  actions?: RecommendedAction[];
};

/**
 * AgentMemory is the full state the agent holds about a session.
 * Short-term: React state
 * Long-term: localStorage (now) → Supabase (future)
 */
export type AgentMemory = {
  version: number;
  startupContext: StartupContext | null;
  founderContext: FounderContext;
  conversationHistory: AgentMessage[];
  cachedRecommendations: RecommendedAction[];
  persistedAt: string | null;
};

// ─── Agent State (UI layer) ─────────────────────────────────────────────────

export type AgentUIState = {
  panelOpen: boolean;
  composing: boolean;
  inputDraft: string;
  activeTab: "overview" | "actions" | "history";
};
