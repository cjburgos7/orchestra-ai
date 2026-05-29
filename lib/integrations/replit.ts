import type { StartupProject } from "@/lib/types/startup";

// Replit Agent — rapid functional prototype generation
// Use case: quick backend logic, APIs, or tools that Lovable doesn't cover
// Replit Agent API: https://docs.replit.com/replit-agent/api-overview
// Env var needed: REPLIT_API_KEY (for automated creation)

export type ReplitHandoffPayload = {
  projectName: string;
  prompt: string;
  templateUrl: string;  // Replit new-repl URL
};

// Maps Orchestra category/direction to best Replit template
function resolveReplitTemplate(project: StartupProject): string {
  const cat = project.startupCategory?.toLowerCase() ?? "";
  if (cat.includes("ai") || cat.includes("ml")) return "https://replit.com/new?template=python-fastapi";
  if (cat.includes("saas") || cat.includes("web")) return "https://replit.com/new?template=nodejs-express";
  if (cat.includes("mobile")) return "https://replit.com/new?template=react-native";
  return "https://replit.com/new?template=nodejs-express";
}

export function buildReplitPrompt(project: StartupProject): string {
  const featureList = project.features.slice(0, 4).map((f, i) => `${i + 1}. ${f}`).join("\n");

  return `Build a rapid functional prototype for **${project.startupName}**.

## What this is
${project.tagline}
${project.description}

## Core features to prototype
${featureList}

## What to build
Create a minimal but functional backend with:
- REST API endpoints for the core user flows
- Simple data models (use in-memory store or SQLite for speed)
- A basic HTML interface or API documentation page
- Health check endpoint at GET /health

## Tech stack
Node.js + Express (or Python + FastAPI if AI-heavy)
No auth needed for prototype — focus on core functionality

## Goal
This is a proof-of-concept to validate the product mechanics before full build in Lovable.
Keep it simple, working, and demonstrable in under 30 minutes.`;
}

export function buildReplitHandoff(project: StartupProject): ReplitHandoffPayload {
  return {
    projectName: project.startupName,
    prompt: buildReplitPrompt(project),
    templateUrl: resolveReplitTemplate(project),
  };
}
