import type { StartupProject } from "@/lib/types/startup";

// Higgsfield AI — cinematic launch video generation
// API docs: https://higgsfield.ai/api
// Env var needed: HIGGSFIELD_API_KEY

export type HiggsfieldScene = {
  prompt: string;       // Scene description sent to Higgsfield
  style: string;        // Cinematic style preset
  duration: number;     // Seconds (3, 6, or 10)
  aspectRatio: string;  // "16:9" | "9:16" | "1:1"
};

export type HiggsfieldHandoffPayload = {
  projectName: string;
  scene: HiggsfieldScene;
  deepLink: string;     // URL to open Higgsfield with pre-filled prompt
};

// Maps Orchestra directions to Higgsfield cinematic styles
const DIRECTION_TO_CINEMATIC: Record<string, string> = {
  "orchestra":           "dark sci-fi cinematic",
  "premium-dark":        "luxury noir",
  "cinematic-ai":        "photorealistic cinematic",
  "glass-futuristic":    "holographic futurism",
  "minimal-clean":       "minimal corporate reveal",
  "apple-modern":        "product reveal cinematic",
  "luxury-editorial":    "editorial fashion film",
  "fashion-ai":          "high fashion editorial",
  "creator-playful":     "vibrant creator reel",
  "bold-experimental":   "kinetic experimental",
  "genz-vibrant":        "gen-z energy reel",
  "retro-tech":          "retro tech aesthetic",
  "creative-agency":     "agency showreel",
  "minimal-luxury":      "minimal luxury reveal",
};

export function buildHiggsfieldScene(project: StartupProject): HiggsfieldScene {
  const direction = project.selectedDirection ?? project.directions?.[0] ?? "orchestra";
  const style = DIRECTION_TO_CINEMATIC[direction] ?? "cinematic product reveal";

  const prompt = `Cinematic launch reveal for ${project.startupName}: "${project.tagline}". \
${project.description} \
Visual style: ${style}. \
Open on sweeping camera move across atmospheric environment, product identity revealed with light leak and lens flare, \
title card fades in with elegant typography, closes on brand mark. \
Color grade: ${direction.includes("dark") || direction === "orchestra" ? "dark, deep shadows, purple-violet highlights" : "clean, bright, premium"}. \
No voiceover. Cinematic score implied.`;

  return {
    prompt,
    style,
    duration: 6,
    aspectRatio: "16:9",
  };
}

export function buildHiggsfieldHandoff(project: StartupProject): HiggsfieldHandoffPayload {
  const scene = buildHiggsfieldScene(project);
  // Higgsfield doesn't have a public deep-link URL format yet — link to homepage
  const deepLink = "https://higgsfield.ai";
  return { projectName: project.startupName, scene, deepLink };
}
