# CLAUDE.md — Faith &amp; Sports Ministry Planning System

Internal, AI-assisted planning tool for **church leaders** launching a community-facing
sports-family ministry. Behind-the-scenes only — never family-facing.

The canonical charter is [`docs/global-system.md`](docs/global-system.md), encoded as
`SHARED_GUARDRAILS` in `src/lib/agents/registry.ts` and appended to every agent's system prompt.
Keep both in sync. The church is the **host and trusted guide**; the system serves leaders behind
the scenes.

## Non-negotiable constraints (read before changing anything)

1. **Church leaders only.** No direct AI counseling to parents, athletes, or minors. Structured
   intake/feedback forms are fine; an AI counselor is not.
2. **No agent diagnoses, gives therapy, or replaces pastoral care.** Reviews and guidance always
   say *listen, do not counsel, refer to a pastor*.
3. **All faith content → theology review. All sensitive topics → pastoral safety review.**
   AI reviews are an automated *first pass*; a human always makes the final decision.
4. **From Victory** (`/Users/kinnychanhome/Claude/FromVictory`) may appear only as an *optional*
   supportive resource — never the theme, brand, or center.
5. The system **always encourages starting with one small meeting** before expanding
   (Phase 1 → series → athlete workshop → speakers/partners → recurring tracks).
6. **Every event must have one practical takeaway and one clear next step.** Faith content must be
   Christ-centered and biblically responsible; sports are a gift and formation ground, not
   ultimate identity. All content stays practical, warm, truthful, and clear.

## Conventions

- Next.js 15 App Router, strict TS, Tailwind. Server Components by default; `"use client"` only
  for small interactive forms.
- All reads go through `src/lib/store.ts`; all mutations through the `"use server"` actions in
  `src/lib/actions.ts`. The store is in-memory + seeded — swap the `db` object for a real
  database without touching screens.
- Agents run via `src/lib/agents/runner.ts`. With no `AI_GATEWAY_API_KEY` they return
  deterministic offline drafts, so the whole app works with zero config. Every run is recorded as
  an `AgentOutput` for the audit trail (`/agents`).
- UI kit in `src/components/ui.tsx`; Markdown via `src/components/Markdown.tsx`.

## Commands

```bash
npm run dev        # local dev
npm run build      # production build
npm run typecheck  # tsc --noEmit
```
