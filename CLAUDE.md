@AGENTS.md

# Orchestra AI — Creative Stack & Generation Hierarchy

## Identity

Orchestra is NOT a generic SaaS platform.
It is a cinematic startup-world generation engine.

Every interface should feel: cinematic · immersive · atmospheric · luxurious · editorial · sculptural.

Reference aesthetic: Interstellar + Apple product films + A24 atmosphere + luxury editorial + unseen.studio

## Active Skills (always invoke for relevant tasks)

- `/orchestra-scene-prompt` — use for ALL Flux/Replicate image generation in this project
- `/orchestra-world-design` — consult for ALL layout, motion, and visual identity decisions
- `/ui-ux-pro-max` — consult for component design, palettes, typography, animation

## Generation Hierarchy (strictly enforced)

When generating any Orchestra UI, visual, or cinematic asset, prioritize in this order:

1. **Premium cinematic composition** — object dominance, editorial negative space, intentional hierarchy
2. **Environmental integration** — objects must feel embedded in atmosphere, not pasted on backgrounds
3. **Luxury material rendering** — chrome, graphite, matte, metallic, reflective surfaces; premium CGI quality
4. **Reference fidelity** — match the locked Synthera/V2 visual direction exactly; do NOT reinterpret
5. **Motion as atmosphere** — ultra-subtle, imperceptible motion that feels cinematic not CSS-animated
6. **Atmospheric depth** — multi-layer glow systems, volumetric fog, reflective floor planes, bloom
7. **Sculptural minimalism** — fewer elements, more intentional; Apple-level restraint

## What NOT to Do (never default to these)

- Generic SaaS scaffolding or dashboard layouts
- Placeholder CSS gradients instead of premium compositing
- Stock motion (bounce, spring, obvious loop) instead of cinematic easing
- Flat backgrounds without atmospheric layering
- Objects floating in darkness without environmental grounding
- Reinterpreting or redesigning locked visual directions
- Generating new concepts when the brief says "polish and execute"

## V2 Hero — Locked Direction

The hero aesthetic is LOCKED. Do not redesign. Polish only.

North star: `orch home v3.png` — premium minimal cinematic object showcase.
Object: Synthera ribbon sculpture (stacked metallic bands + 3 chrome spheres).
File: `public/hero-object.webp` — never replace without explicit approval.
Blend: `mix-blend-mode: screen` + `filter: saturate(0.18) contrast(1.06)`.
Environment: 5-layer atmospheric system in `CinematicHero()` in `app/v2/page.tsx`.

See memory: `v2-hero-system.md` for full technical spec.

## MCP Tools Available

- Replicate MCP — `black-forest-labs/flux-1.1-pro` for still imagery
- Computer Use MCP — for visual verification (request screen recording permission first)

## Flux Prompting

Always use `/orchestra-scene-prompt` skill to structure prompts.
Never use bare category nouns (fitness, flowers, finance).
Always use scene-level queries from `lib/world-v2/visual-universe.ts`.
Always enforce category purity tokens and reject contamination tokens.
