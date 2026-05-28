---
name: orchestra-scene-prompt
description: Convert Orchestra V2 VisualUniverse scene queries into cinematic Flux-ready prompts for Replicate. Use when generating startup-world imagery, hero environments, editorial atmospheres, or motion-aware scene prompts. Enforces category purity and premium editorial composition — never generic AI art or noun keywords.
---

# Orchestra Scene Prompt Skill

**Principle:** Every startup deserves its own world.

Orchestra generates **visual universes**, not category nouns. This skill converts `VisualUniverse` scene queries from `lib/world-v2/visual-universe.ts` into **Flux 1.1 Pro** prompts via Replicate MCP.

## When to use

- User asks for cinematic hero / environmental imagery for a startup category
- User wants Flux prompts from Orchestra briefs or scene queries
- User is preparing V2 world assets (still images; motion hints for future img2video)
- User mentions Replicate, Flux, Hailuo, or "generate world imagery"

## When NOT to use

- Generic AI art, memes, avatars, logos, UI mockups only
- Requests that violate category purity (e.g. fruit imagery for fitness)
- Production runtime wiring (Phase B+) — this skill is **prompt + MCP dev workflow only**

## Source of truth

Read category data from:

- `lib/world-v2/visual-universe.ts` — `sceneQueries`, `moods`, `aesthetics`, `compositions`, `lighting`, `purityTokens`, `contaminationTokens`
- `lib/media-v2/types.ts` — `ScenePrompt`, `MediaGenerationRole`, `WorldMediaDNA`
- `.claude/skills/orchestra-world-design/SKILL.md` — cinematic identity

**Never** search Unsplash with bare nouns (`fitness`, `fruit`, `flowers`). Always start from **scene-level queries**.

## Replicate MCP (required for generation)

1. Ensure Replicate MCP is installed:
   ```bash
   claude mcp add replicate https://mcp.replicate.com/sse --transport sse --scope user
   ```
2. In Claude Code, run `/mcp` and authenticate with your Replicate API token.
3. Primary still model: `black-forest-labs/flux-1.1-pro`
4. Draft / fast iteration: `black-forest-labs/flux-schnell`

Use MCP tools to search models and create predictions — do not invent custom API clients in Phase A.

## 5-layer prompt structure (Flux editorial)

Build every prompt from these layers:

| Layer | Purpose | Example tokens |
|-------|---------|----------------|
| **1. Environment** | World / space / atmosphere | cinematic gym interior, botanical studio, fintech workspace at dusk |
| **2. Subject** | Category-pure focal element | athlete mid-motion, luxury bouquet, data-forward desk — never off-category |
| **3. Lighting** | From universe `lighting[]` | rim light, soft diffused, dramatic high-contrast, screen glow |
| **4. Composition** | From universe `compositions[]` | environmental wide, editorial portrait, macro detail, asymmetric negative space |
| **5. Technical / grade** | Premium finish | shot on ARRI Alexa, 35mm, shallow depth of field, editorial campaign, 8K, film grain subtle |

### Motion-aware hint (for future img2video)

Append a separate **motion hint** (not always in still prompt):

- `slow atmospheric drift, subtle parallax, ambient particles, gentle camera push`
- Avoid: chaotic motion, bounce, meme energy, hyper-fast cuts

## Category → scene query mapping (examples)

| Category | Scene query (input) | NOT this |
|----------|---------------------|----------|
| fitness | cinematic athlete training editorial | "fitness", "gym stock photo" |
| floral | luxury floral editorial, airy floral studio | "flowers", "bouquet png" |
| finance | premium fintech dashboard aesthetic | "finance", "money" |
| saas | premium SaaS product campaign | "software", "laptop stock" |
| food | premium food editorial photography | "fruit", "food blog" |

Pick the **best-matching** `sceneQuery` from the universe for the requested `MediaGenerationRole`:

- `hero-environment` — wide environmental storytelling, 16:9
- `hero-subject` — subject in environment, 16:9 or 4:5
- `editorial-mosaic` — varied crops, 3:4 and 1:1
- `ambient-layer` — soft, low-contrast atmosphere for overlays
- `motion-background` — minimal subject, loop-friendly composition

## Category purity rules (mandatory)

Before finalizing any prompt:

1. **Include** semantic alignment with at least one `purityToken` for the category
2. **Exclude** all `contaminationTokens` — rewrite if any appear
3. **Reject** globally: recipe blog, meme, clipart, watermark, generic stock smile, ecommerce grid
4. **Never** cross categories (no produce in fitness, no gym in floral, no dashboards in wellness)

If the user brief conflicts with category, **prefer category lock** from `resolveCategoryV2` / visual universe.

## Output format

Return a structured `ScenePrompt`-aligned block:

```markdown
## Scene Prompt — {Category} / {Role}

**Scene query:** {from VisualUniverse.sceneQueries}
**Aspect ratio:** 16:9 | 4:5 | 3:4 | 1:1
**Motion hint (optional):** {for future Hailuo I2V}

### Positive (Flux)
{single paragraph, 80–180 words, cinematic editorial}

### Negative
{contamination + quality rejects}

### Replicate input (flux-1.1-pro)
- model: black-forest-labs/flux-1.1-pro
- aspect_ratio: {ratio}
- output_format: webp or png
- prompt: {positive}
```

Then invoke Replicate MCP to create a prediction when the user wants an actual image.

## Aesthetic guardrails

**Prefer:**

- Interstellar / A24 / Apple film still energy
- Luxury editorial, unseen.studio, atmospheric depth
- Environmental storytelling, negative space, cinematic grade
- Believable startup worlds — alive, distinct, premium

**Avoid:**

- Generic SaaS stock, dashboard clichés (unless finance/saas universe)
- Crypto/neon bro aesthetics, chaotic maximalism
- Over-lit corporate headshots, template landing page energy
- Text-in-image (Flux Pro is poor at text)

## Workflow checklist

1. Identify `V2CategoryKey` and load universe from `visual-universe.ts`
2. Select `sceneQuery` + `MediaGenerationRole`
3. Compose 5-layer Flux prompt with purity check
4. Output `ScenePrompt` structure
5. If generating: use Replicate MCP → `flux-1.1-pro` → share result URL
6. Do **not** wire into `buildWorldV2` or legacy `image-pipeline.ts` in Phase A

## Related skills

- `orchestra-world-design` — layout, motion, and world identity
- Phase B (future): `lib/media-v2/providers/replicate-flux.ts` runtime
