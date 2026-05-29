/**
 * Orchestra Agent — Public API
 *
 * Import from this file, not from individual modules.
 */

export type {
  StartupContext,
  FounderContext,
  LaunchProgress,
  IntegrationStatus,
  IntegrationId,
  AgentIntent,
  AgentMessage,
  AgentMemory,
  RecommendedAction,
  ActionPriority,
  ToolRoute,
  ToolCapability,
  AgentUIState,
} from "./types";

export {
  buildStartupContext,
  buildLaunchProgress,
  createFounderContext,
  recordFounderAction,
  formatContextForPrompt,
} from "./context";

export {
  loadMemory,
  saveMemory,
  clearMemory,
  appendMessage,
  updateStartupContext,
  updateFounderContext,
  updateRecommendations,
  createEmptyMemory,
} from "./memory";

export {
  TOOL_CAPABILITIES,
  TOOL_ROUTES,
  resolveRoute,
  getBlockReason,
  inferIntent,
} from "./router";

export {
  buildRecommendations,
  getTopRecommendation,
  getAgentStatusMessage,
} from "./recommendations";
