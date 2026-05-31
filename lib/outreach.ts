/**
 * Client acquisition engine.
 *
 * Generates ICP, research checklist, outreach drafts, and 7-day action plan
 * from a business niche or specific lead name. Persists to Supabase when
 * configured; falls back to localStorage.
 *
 * Used by the "Land a Client" tab in AgentPanel.
 */

import { claudeCompletionJSON } from "@/lib/orchestration/claude-client";
import { isDbConfigured, createSupabaseClient } from "@/lib/db/supabase";

export type OutreachPlan = {
  id: string;
  niche: string;
  createdAt: string;
  icp: {
    businessType: string;
    painPoints: string[];
    idealTriggers: string[];
    budgetSignals: string[];
  };
  researchChecklist: Array<{
    task: string;
    sources: string[];
  }>;
  outreachDrafts: {
    emailSubject: string;
    email: string;
    dm: string;
    inPerson: string;
  };
  actionPlan: Array<{
    day: number;
    label: string;
    tasks: string[];
  }>;
};

export type PipelineLead = {
  id: string;
  name: string;
  business: string;
  stage: "lead" | "contacted" | "demo" | "closed";
  notes: string;
  planId?: string;
  createdAt: string;
  updatedAt: string;
};

const SYSTEM_PROMPT = `You are helping a solo web designer land their first local business clients from their personal network and community.

Their situation:
- Just starting, no sales experience
- Targets: local businesses with no website, or a site that looks like it was built before 2016
- They know these owners through family, school, or their neighborhood
- They are NOT a salesperson — they want to feel genuine, not pushy

Given a business type or specific lead, produce a complete client acquisition package.

HARD RULES for all outreach drafts:
- Email: under 100 words total including subject. No generic openers.
- DM (Instagram/Facebook/LinkedIn): under 70 words. Casual and human.
- In-person: under 50 words spoken. A natural conversation starter, not a pitch.
- Never say: "I noticed", "I'd love to help", "digital presence", "user experience", "optimize", "conversion rate", "online visibility"
- Never use jargon the business owner wouldn't say themselves
- Reference something specific and real about this type of business

RULES for research checklist:
- 5-6 items
- Each item names a specific, searchable source (not just "Google")
- Include Google Maps, Yelp, Facebook Business, local Facebook groups, neighborhood apps (Nextdoor), local directories

RULES for action plan:
- Exactly 7 days
- Each day has 2-3 tasks completable in 30-40 minutes
- Tasks must be concrete actions, not vague goals ("List 10 pizza restaurants within 3 miles on Google Maps" not "research leads")

RULES for ICP:
- Pain points must be things the business owner would recognize and name themselves
- Triggers must be observable business events (new location, new staff, seasonal push, bad review streak)
- Budget signals must be observable from the outside (branded menu, paid Facebook ads, multiple employees)

Return ONLY valid JSON:
{
  "icp": {
    "businessType": "specific business type",
    "painPoints": ["string", "string", "string"],
    "idealTriggers": ["string", "string", "string"],
    "budgetSignals": ["string", "string", "string"]
  },
  "researchChecklist": [
    { "task": "specific task", "sources": ["source 1", "source 2"] }
  ],
  "outreachDrafts": {
    "emailSubject": "subject line under 8 words",
    "email": "full email body",
    "dm": "DM message",
    "inPerson": "what to say in person"
  },
  "actionPlan": [
    { "day": 1, "label": "day theme", "tasks": ["task 1", "task 2"] }
  ]
}`;

function isValidOutreachPlan(raw: unknown): raw is Omit<OutreachPlan, "id" | "niche" | "createdAt"> {
  if (!raw || typeof raw !== "object") return false;
  const obj = raw as Record<string, unknown>;
  return (
    obj.icp !== undefined &&
    Array.isArray((obj.icp as Record<string, unknown>).painPoints) &&
    Array.isArray(obj.researchChecklist) &&
    obj.outreachDrafts !== undefined &&
    Array.isArray(obj.actionPlan) &&
    (obj.actionPlan as unknown[]).length === 7
  );
}

export async function generateOutreachPlan(niche: string): Promise<OutreachPlan> {
  const raw = await claudeCompletionJSON<unknown>({
    temperature: 0.75,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Generate a complete client acquisition package for: ${niche}`,
      },
    ],
  });

  if (!isValidOutreachPlan(raw)) {
    throw new Error("Invalid outreach plan response from Claude");
  }

  const plan: OutreachPlan = {
    id: `plan-${Date.now()}`,
    niche,
    createdAt: new Date().toISOString(),
    ...(raw as Omit<OutreachPlan, "id" | "niche" | "createdAt">),
  };

  await saveOutreachPlan(plan);
  return plan;
}

// ─── Persistence ──────────────────────────────────────────────────────────────

const LS_PLANS_KEY = "orchestra_outreach_plans";
const LS_PIPELINE_KEY = "orchestra_outreach_pipeline";

export async function saveOutreachPlan(plan: OutreachPlan): Promise<void> {
  if (isDbConfigured()) {
    try {
      const sb = createSupabaseClient();
      await sb.from("outreach_plans").upsert({ id: plan.id, niche: plan.niche, data: plan, created_at: plan.createdAt });
      return;
    } catch {
      // fall through to localStorage
    }
  }
  if (typeof window === "undefined") return;
  const existing = loadOutreachPlans();
  const updated = [plan, ...existing.filter((p) => p.id !== plan.id)].slice(0, 50);
  localStorage.setItem(LS_PLANS_KEY, JSON.stringify(updated));
}

export function loadOutreachPlans(): OutreachPlan[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_PLANS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function savePipelineLeads(leads: PipelineLead[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_PIPELINE_KEY, JSON.stringify(leads));
}

export function loadPipelineLeads(): PipelineLead[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_PIPELINE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addPipelineLead(name: string, business: string, planId?: string): PipelineLead {
  const lead: PipelineLead = {
    id: `lead-${Date.now()}`,
    name,
    business,
    stage: "lead",
    notes: "",
    planId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const existing = loadPipelineLeads();
  savePipelineLeads([lead, ...existing]);
  return lead;
}

export function updateLeadStage(id: string, stage: PipelineLead["stage"]): void {
  const leads = loadPipelineLeads();
  const updated = leads.map((l) =>
    l.id === id ? { ...l, stage, updatedAt: new Date().toISOString() } : l
  );
  savePipelineLeads(updated);
}

export const STAGES: { id: PipelineLead["stage"]; label: string; color: string }[] = [
  { id: "lead", label: "Lead", color: "oklch(55% .08 270)" },
  { id: "contacted", label: "Contacted", color: "oklch(65% .14 250)" },
  { id: "demo", label: "Demo", color: "oklch(70% .16 200)" },
  { id: "closed", label: "Closed", color: "oklch(65% .15 150)" },
];
