type ChatMessage = { role: "system" | "user"; content: string };

type ChatOptions = {
  messages: ChatMessage[];
  temperature?: number;
  json?: boolean;
};

export class OrchestrationError extends Error {
  constructor(
    message: string,
    public status: number = 500
  ) {
    super(message);
    this.name = "OrchestrationError";
  }
}

export function getOpenAIKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new OrchestrationError(
      "OpenAI API key is missing. Add OPENAI_API_KEY to your .env.local file and restart the dev server.",
      500
    );
  }
  return key;
}

export async function chatCompletionJSON<T>(options: ChatOptions): Promise<T> {
  const apiKey = getOpenAIKey();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: options.temperature ?? 0.8,
      response_format: { type: "json_object" },
      messages: options.messages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("OpenAI error:", res.status, errText);
    throw new OrchestrationError(
      "OpenAI could not generate a response. Check your API key and billing.",
      502
    );
  }

  const completion = await res.json();
  const content = completion.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new OrchestrationError("Empty response from OpenAI.", 502);
  }

  return JSON.parse(content) as T;
}
