/**
 * Anthropic Messages API client — plain fetch, no SDK.
 * Parses JSON from the first text content block.
 * Strips markdown fencing that models sometimes emit around JSON.
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-4-6";
const DEFAULT_MAX_TOKENS = 4096;

export type ClaudeMessage = { role: "user" | "assistant"; content: string };

type ClaudeClientOptions = {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  system?: string;
  messages: ClaudeMessage[];
};

function stripMarkdownFencing(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
}

export async function claudeCompletionJSON<T>(options: ClaudeClientOptions): Promise<T> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const body: Record<string, unknown> = {
    model: options.model ?? DEFAULT_MODEL,
    max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
    messages: options.messages,
  };
  if (options.system) body.system = options.system;
  if (options.temperature !== undefined) body.temperature = options.temperature;

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Anthropic API ${res.status}: ${err}`);
  }

  const data = (await res.json()) as {
    content: Array<{ type: string; text: string }>;
  };

  const textBlock = data.content.find((b) => b.type === "text");
  if (!textBlock) throw new Error("No text content in Anthropic response");

  const cleaned = stripMarkdownFencing(textBlock.text);
  return JSON.parse(cleaned) as T;
}
