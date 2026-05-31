import { NextRequest, NextResponse } from "next/server";
import { generateGPTImageVariations } from "@/lib/world-v2/gpt-image-generation";

export async function POST(req: NextRequest) {
  try {
    const { prompt, quality } = await req.json() as { prompt: string; quality?: "low" | "medium" | "high" };

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Image generation not configured" }, { status: 503 });
    }

    const images = await generateGPTImageVariations(prompt.trim(), quality ?? "low");

    if (!images.length) {
      return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
    }

    return NextResponse.json({ images });
  } catch (err) {
    console.error("[generate-image-ideas]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
