/**
 * GPT Image 2 generation for Orchestra Foundation templates.
 *
 * Uses OpenAI gpt-image-2 for hero images in Foundation 2/3 templates.
 * Returns a base64 data URL on success, undefined on failure.
 *
 * Server-side only. Never import from client components.
 */

import OpenAI from "openai";

let _client: OpenAI | undefined;

function getClient(): OpenAI | undefined {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return undefined;
  _client ??= new OpenAI({ apiKey: key });
  return _client;
}

type ImageSize =
  | "1024x1024"
  | "1536x1024"
  | "1024x1536"
  | "2048x2048"
  | "1792x1024"
  | "1024x1792";

type ImageQuality = "low" | "medium" | "high";

/**
 * Generate an image with gpt-image-2.
 * Returns a base64 data URL (data:image/png;base64,...) or undefined on failure.
 */
export async function generateGPTImage(
  prompt: string,
  {
    size = "1536x1024",
    quality = "medium",
    timeoutMs = 90_000,
  }: {
    size?: ImageSize;
    quality?: ImageQuality;
    timeoutMs?: number;
  } = {},
): Promise<string | undefined> {
  const client = getClient();
  if (!client) return undefined;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const result = await client.images.generate(
      {
        model: "gpt-image-2",
        prompt,
        size,
        quality,
        n: 1,
        response_format: "b64_json",
      },
      { signal: controller.signal },
    );

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) return undefined;

    return `data:image/webp;base64,${b64}`;
  } catch (err) {
    const msg = (err as Error)?.message ?? String(err);
    if (!msg.includes("AbortError") && !msg.includes("aborted")) {
      console.warn("[gpt-image] generation error:", msg);
    }
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Generate 3 variations of an image from the same prompt.
 * Uses 3 parallel single requests — gpt-image-2 works most reliably with n=1.
 */
export async function generateGPTImageVariations(
  prompt: string,
  quality: ImageQuality = "low",
): Promise<string[]> {
  const client = getClient();
  if (!client) return [];

  const makeOne = async (): Promise<string | undefined> => {
    try {
      const result = await client.images.generate({
        model: "gpt-image-2",
        prompt,
        size: "1024x1024",
        quality,
        n: 1,
        response_format: "b64_json",
      });
      const b64 = result.data?.[0]?.b64_json;
      return b64 ? `data:image/png;base64,${b64}` : undefined;
    } catch {
      return undefined;
    }
  };

  const results = await Promise.all([makeOne(), makeOne(), makeOne()]);
  return results.filter((r): r is string => !!r);
}
