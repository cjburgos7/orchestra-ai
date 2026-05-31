# Generation Engine — Future Architecture

**Status:** Architecture design (not yet implemented)  
**Current state:** Generates websites. Target state: Generates businesses.

---

## Vision

The generation engine should produce a **business package**, not a website.

A website is one output of the business package.
So are images, emails, lead magnets, pricing pages, and growth strategies.

The founder describes an idea. The engine produces everything needed to run a company.

---

## Current Output (v1)

```typescript
type StartupProject = {
  // Identity
  startupName: string;
  tagline: string;
  description: string;
  audience: string;
  brandTone: string;
  startupCategory: string;
  features: string[];
  pricing: Pricing;

  // World-depth (exists but underutilized)
  founderMission: string;
  marketPositioning: string;
  brandPersonality: string;
  businessModel: string;
  launchStrategy: string;
  growthOpportunities: string;
  competitiveEdge: string;
  whyNow: string;

  // Website
  generatedSections: GeneratedSections;  // homepage content
  generatedPages: GeneratedPages;        // about, pricing, contact, etc.
}
```

**Problems with v1:**
- Output is shaped for website generation, not business operation
- `launchStrategy` is a paragraph — should be structured milestones
- No website generation prompt (for Lovable)
- No visual generation prompt (for Higgsfield/Flux)
- No operational recommendations
- No success metrics or KPIs
- No go-to-market tactics (specific channels, not just strategy)

---

## Target Output (v2)

```typescript
type BusinessPackage = {
  // ── Identity Layer ──────────────────────────────────────────────
  identity: {
    name: string;
    tagline: string;
    description: string;           // 2-3 sentences, founder voice
    missionStatement: string;      // why this exists
    brandPersonality: string;      // character, voice, visual feel
    brandTone: string;             // communication register
    logoDirection: string;         // described for Flux generation
  };

  // ── Market Layer ────────────────────────────────────────────────
  market: {
    category: string;              // "B2B SaaS", "Consumer AI", etc.
    audience: AudienceProfile;
    positioning: string;           // vs. what alternative, specific
    competitiveEdge: string;       // unfair advantage
    whyNow: string;                // market timing / technology unlock
  };

  // ── Business Model Layer ────────────────────────────────────────
  business: {
    model: string;                 // how money flows
    revenueStreams: RevenueStream[];
    pricing: Pricing;              // tiers with specific prices
    unitEconomics: UnitEconomics;  // estimated CAC, LTV, margin
    successMetrics: Metric[];      // what "working" looks like at 30/90/180 days
  };

  // ── Launch Layer ────────────────────────────────────────────────
  launch: {
    strategy: string;              // high-level approach
    roadmap: LaunchMilestone[];    // structured week-by-week
    firstChannel: string;          // the one channel to bet on first
    firstAction: string;           // the single thing to do today
    earlyAdopters: string;         // who to talk to first, specifically
  };

  // ── Growth Layer ────────────────────────────────────────────────
  growth: {
    opportunities: GrowthOpportunity[];
    experiments: GrowthExperiment[];  // 3 testable hypotheses
    networkEffects: string | null;    // if applicable
    expansionPath: string;            // adjacent markets or audiences
  };

  // ── Operational Layer ───────────────────────────────────────────
  operations: {
    recommendations: OperationalRecommendation[];
    toolStack: ToolRecommendation[];   // specific tools for specific jobs
    riskFactors: RiskFactor[];         // what could go wrong and mitigations
  };

  // ── Generation Briefs (for tool routing) ───────────────────────
  briefs: {
    website: WebsiteGenerationBrief;   // → Lovable
    hero: VisualGenerationBrief;       // → Flux / Higgsfield (hero image)
    product: VisualGenerationBrief;    // → Flux (product imagery)
    brand: VisualGenerationBrief;      // → Flux (brand assets)
    video: VideoGenerationBrief;       // → Higgsfield (cinematic launch video)
  };
};
```

---

## Supporting Types

```typescript
type AudienceProfile = {
  description: string;       // specific human, not "users"
  painPoint: string;         // what they're struggling with today
  currentSolution: string;   // what they're using now (and why it fails)
  motivation: string;        // what they want to achieve
  demographicHint: string;   // industry, role, company size, etc.
};

type RevenueStream = {
  name: string;
  type: "subscription" | "one-time" | "usage" | "marketplace" | "services";
  percentage: number;        // estimated % of total revenue at scale
};

type UnitEconomics = {
  estimatedCAC: string;      // estimated cost to acquire one customer
  estimatedLTV: string;      // estimated lifetime value
  estimatedMargin: string;   // gross margin estimate
  paybackPeriod: string;     // months to recover CAC
};

type Metric = {
  name: string;
  description: string;
  target30d: string;
  target90d: string;
  target180d: string;
};

type LaunchMilestone = {
  week: number;              // 1, 2, 3, 4, 8, 12, 24
  focus: string;             // single sentence objective
  actions: string[];         // 3-5 specific tasks
  successCriteria: string;   // how to know it's done
};

type GrowthOpportunity = {
  name: string;
  description: string;
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  timeframe: "immediate" | "30d" | "90d" | "6m+";
};

type GrowthExperiment = {
  hypothesis: string;
  test: string;              // how to test it
  successSignal: string;     // what you'd see if it works
  failSignal: string;        // what you'd see if it fails
  timeBox: string;           // how long to run it
};

type OperationalRecommendation = {
  category: "tools" | "process" | "people" | "legal" | "financial";
  priority: "immediate" | "30d" | "90d";
  recommendation: string;
  rationale: string;
};

type ToolRecommendation = {
  category: string;          // "CRM", "email", "analytics", etc.
  tool: string;              // specific product name
  reason: string;            // why this one for this startup
  alternativeIfBudgetConstrained: string;
};

type RiskFactor = {
  risk: string;
  likelihood: "low" | "medium" | "high";
  mitigation: string;
};

// ── Generation Briefs ──────────────────────────────────────────────────────

type WebsiteGenerationBrief = {
  lovablePrompt: string;     // natural language prompt for Lovable
  sections: string[];        // ordered list of sections to generate
  styleTokens: {
    primaryColor: string;
    secondaryColor: string;
    font: string;
    tone: string;
  };
  copyContext: {             // context for headline/copy generation
    headline: string;
    subheadline: string;
    cta: string;
    valueProps: string[];
  };
};

type VisualGenerationBrief = {
  fluxPrompt: string;        // structured Flux 1.1 Pro prompt
  style: string;             // "cinematic", "editorial", "product", etc.
  mood: string;
  lighting: string;
  colorPalette: string;
  avoidTokens: string[];     // contamination prevention
  dimensions: { width: number; height: number };
};

type VideoGenerationBrief = {
  higgsfieldPrompt: string;
  duration: number;          // seconds
  style: string;
  motionType: string;        // "dolly in", "orbit", "static", etc.
  atmosphere: string;
};
```

---

## Pipeline Architecture

### v1 (current)

```
idea → generate-startup (Claude) → StartupProject
     → generate-sections (Claude) → GeneratedSections
```

Two API calls, two Claude responses.  
Output: website content.

### v2 (target)

```
idea → phase-1-identity (Claude, fast model)
     → phase-2-market (Claude)
     → phase-3-business (Claude)
     → phase-4-launch (Claude)
     → phase-5-briefs (Claude, using context from phases 1-4)
     → [parallel] website-brief → Lovable
     → [parallel] visual-briefs → Flux
     → [parallel] video-brief → Higgsfield
```

**Key changes:**
- Phases run sequentially to let each inform the next
- Briefs run in parallel after phase 5
- Each phase has a focused prompt → higher quality output
- Total time: ~30s for business package, then parallel generation

### Implementation path

1. Add `BusinessPackage` type to `lib/types/startup.ts`
2. Create `lib/orchestration/pipelines/generate-business.ts` (new pipeline)
3. Add phase-specific prompts in `lib/orchestration/prompts/`
4. Update `/api/generate-startup` to return `BusinessPackage` alongside current `StartupProject`
5. Update `StartupProject` to embed `businessPackage?: BusinessPackage`
6. Route briefs to tool handlers (Lovable API, Flux via Replicate MCP, Higgsfield)

### Backward compatibility

`StartupProject` stays intact — the `BusinessPackage` is additive.  
Old generated projects continue to work as-is.  
New generations produce both.

---

## Prompting Strategy

Each phase uses a focused Claude prompt. Key principles:

- **Specificity over generality**: The output must be specific to this exact idea
- **Structured output**: Always JSON with the exact schema defined above
- **Founder voice**: Mission, positioning, personality should sound like a real founder wrote it
- **No generic startup language**: Every output must be defensible and specific

### Prompt file structure

```
lib/orchestration/prompts/
├── identity.ts        # Phase 1
├── market.ts          # Phase 2
├── business.ts        # Phase 3
├── launch.ts          # Phase 4
├── briefs.ts          # Phase 5
└── index.ts           # Assembled pipeline
```

---

## Claude Model Selection

| Phase | Model | Reason |
|-------|-------|--------|
| Identity | claude-haiku-4-5 | Fast, structured, good at naming |
| Market | claude-sonnet-4-6 | Nuanced positioning analysis |
| Business | claude-sonnet-4-6 | Complex multi-part output |
| Launch | claude-sonnet-4-6 | Tactical, specific recommendations |
| Briefs | claude-sonnet-4-6 | Creative prompt generation |

Orchestra itself (real-time agent responses) should use **claude-haiku-4-5** for sub-second latency.  
Strategic analysis requests use **claude-sonnet-4-6**.

---

## Implementation Priority

1. Add type definitions (no breaking changes)
2. Build `generate-business.ts` pipeline (new file)
3. Wire to a new `/api/generate-business` endpoint
4. Test output quality extensively before replacing v1 pipeline
5. Migrate `/app` workspace hub to use the richer output
6. Build tool routing for Lovable brief
7. Build tool routing for visual briefs
