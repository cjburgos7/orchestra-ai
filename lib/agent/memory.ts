/**
 * Orchestra Agent — Memory System
 *
 * Current: localStorage (client-side persistence across sessions)
 * Future: Supabase (cross-device, server-side, searchable)
 *
 * The memory system intentionally abstracts the storage backend
 * so the Supabase migration is a drop-in replacement.
 */

import type { AgentMemory, AgentMessage, RecommendedAction, StartupContext, FounderContext } from "./types";
import { createFounderContext } from "./context";

const MEMORY_KEY = "orchestra-agent-memory-v1";
const MAX_HISTORY = 100;
const CURRENT_VERSION = 1;

// ─── Read / Write ────────────────────────────────────────────────────────────

export function loadMemory(): AgentMemory {
  if (typeof window === "undefined") return createEmptyMemory();

  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (!raw) return createEmptyMemory();

    const parsed = JSON.parse(raw) as AgentMemory;

    // Version migration hook (add cases as the schema evolves)
    if (parsed.version !== CURRENT_VERSION) {
      return createEmptyMemory();
    }

    return parsed;
  } catch {
    return createEmptyMemory();
  }
}

export function saveMemory(memory: AgentMemory): void {
  if (typeof window === "undefined") return;

  const trimmed: AgentMemory = {
    ...memory,
    conversationHistory: memory.conversationHistory.slice(-MAX_HISTORY),
    persistedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage quota exceeded — clear old history and retry
    const minimal: AgentMemory = {
      ...trimmed,
      conversationHistory: trimmed.conversationHistory.slice(-10),
    };
    localStorage.setItem(MEMORY_KEY, JSON.stringify(minimal));
  }
}

export function clearMemory(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(MEMORY_KEY);
  }
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function appendMessage(
  memory: AgentMemory,
  message: Omit<AgentMessage, "id" | "timestamp">
): AgentMemory {
  const full: AgentMessage = {
    ...message,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  return {
    ...memory,
    conversationHistory: [...memory.conversationHistory, full],
  };
}

export function updateStartupContext(
  memory: AgentMemory,
  context: StartupContext | null
): AgentMemory {
  return { ...memory, startupContext: context };
}

export function updateFounderContext(
  memory: AgentMemory,
  context: FounderContext
): AgentMemory {
  return { ...memory, founderContext: context };
}

export function updateRecommendations(
  memory: AgentMemory,
  recommendations: RecommendedAction[]
): AgentMemory {
  return { ...memory, cachedRecommendations: recommendations };
}

// ─── Factory ─────────────────────────────────────────────────────────────────

export function createEmptyMemory(): AgentMemory {
  return {
    version: CURRENT_VERSION,
    startupContext: null,
    founderContext: createFounderContext(null),
    conversationHistory: [],
    cachedRecommendations: [],
    persistedAt: null,
  };
}

// ─── Future: Supabase adapter (stub) ─────────────────────────────────────────
//
// When Supabase is configured, these functions will replace the localStorage
// implementations above. The interface is identical — callers don't change.
//
// export async function loadMemoryFromSupabase(userId: string): Promise<AgentMemory>
// export async function saveMemoryToSupabase(userId: string, memory: AgentMemory): Promise<void>
//
// Migration path:
// 1. Add Supabase table: agent_memory (user_id, memory_json, updated_at)
// 2. On auth: load from Supabase, merge with localStorage
// 3. On save: write to both (localStorage as offline cache)
// 4. Eventually: localStorage only as offline cache, Supabase as source of truth
