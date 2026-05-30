# Faith &amp; Sports Ministry — Planning System

> 🧭 **Coordinating this ministry with an LLM?** Start with [`HANDOFF.md`](HANDOFF.md) — it tells a
> fresh model what we're trying to do and how to help drive what's next.

An **internal, AI-assisted ministry planning tool** for **Long Hill Chapel (Chatham, NJ)** to
launch a community-facing **sports-family ministry**. It is *not* a family-facing chatbot — it is a
behind-the-scenes planning, content, logistics, and follow-up workspace for church staff and
volunteers.

The system is shaped around Long Hill Chapel's three assets: **pastoral and relational trust**, a
**gym** for practical/embodied events, and member **access to NY/NJ sports leaders**. Its
centerpiece is a flexible **Roadmap Builder** — reorderable, editable building blocks and multiple
starter templates (no single required path) that export to a PDF for leadership discussion.

> The goal: help a church **start from zero, launch one small high-impact meeting, learn from
> it, and expand** into an ongoing sports-family ministry that serves families navigating
> pressure, identity, parenting, faith, and character.

## What it does

A church leader creates an initiative → the system recommends **starting small with one
meeting** → specialized agents draft the agenda, content, outreach, volunteer plan, and
follow-up → faith content goes through **theology review**, sensitive topics through
**pastoral safety review** → leaders run the event, enter feedback → the system recommends the
**next event** and stores approved materials in a reusable **library**.

## Tech stack

- **Next.js 15** (App Router) · **TypeScript** (strict) · **Tailwind CSS**
- **AI SDK** through the **Vercel AI Gateway** (`provider/model` strings)
- In-memory data layer (seeded) behind a single repository module — swappable for a Marketplace
  database (e.g. Neon Postgres / Supabase) with no UI changes
- Deploys on **Vercel**

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

The app is **fully usable with zero configuration**: with no `AI_GATEWAY_API_KEY`, every agent
runs in deterministic **offline-draft mode** so you can click through the entire workflow. To
use live models, set the env vars in `.env.example` (copy to `.env.local`).

```bash
cp .env.example .env.local
# AI_GATEWAY_API_KEY=...           # from the Vercel dashboard → AI Gateway
# MINISTRY_MODEL=anthropic/claude-sonnet-4-6
```

## Deployment

- **Live (production):** https://faith-and-sports-ministry.vercel.app
- **Repo:** https://github.com/kchan-code/faith-and-sports-ministry (public)
- **Vercel project:** `kchan-8826s-projects/faith-and-sports-ministry` — the GitHub repo is
  connected, so pushes to `main` auto-deploy (production), and PRs get preview URLs.

Deploys run with **zero env vars** (offline-draft mode). To enable live AI generation, add the
gateway key to the project:

```bash
vercel env add AI_GATEWAY_API_KEY production
vercel env add MINISTRY_THEOLOGY_MODEL production   # optional, e.g. anthropic/claude-opus-4-8
vercel --prod                                       # redeploy to pick them up
```

> Deployment-specific URLs are protected by Vercel Authentication; the production domain above is
> public. If you want the whole tool behind login (reasonable for an internal church tool), enable
> Deployment Protection for production in the Vercel project settings.

## The agents

| Agent | Role |
|---|---|
| Ministry Strategy | Recommends the first event and the start-small growth path |
| Event Planning | Builds the agenda / run-of-show |
| Content Creation | Talk outlines, handouts, discussion guides, emails |
| Theology Review | Lightweight first-pass triage that routes to Pastoral Theology |
| Pastoral Theology | Scripture & gospel-foundation specialist — grounds and reviews all faith content (Keller/Lewis/Stott voice, canonical-passage guardrails, opus-tier) |
| Pastoral Safety | Flags sensitive areas, adds leader guidance |
| Community Outreach | Invitations and promotional content |
| Speaker &amp; Partner | Speaker invites, partner ideas, vetting prompts |
| Volunteer Coordination | Roles and short leader guides |
| Follow-Up | Email sequences and next-step pathways |
| Learning &amp; Improvement | Reads feedback, recommends the next event |
| Brand Voice | Keeps content warm, practical, on-message |
| Content Librarian | Organizes approved content for reuse |

## Modules / screens

Landing page · Dashboard · **Roadmap Builder** (+ PDF print/export) · Purpose · Create Initiative ·
Recommended Launch Plan · Create Event · Event Agenda Builder · Content Workspace · Theology Review
Queue · Pastoral Safety Review Queue (with gym & child-safety checklist) · Outreach Materials ·
Volunteer Plan · Speaker/Partner Tracker (NY/NJ sports-leader vetting) · Event Feedback Form ·
Next-Step Recommendations · Content Library · Export Center.

## Guardrails (non-negotiable)

The canonical charter lives in [`docs/global-system.md`](docs/global-system.md) and is encoded as
`SHARED_GUARDRAILS` (appended to every agent prompt). In short — the church is the **host and
trusted guide**, and:

- For **church leaders only** — no direct AI counseling to parents, athletes, or minors.
- The system may generate **structured** intake/feedback forms, but families never interact with
  an AI counselor.
- No agent diagnoses, provides therapy, or replaces pastoral care.
- All faith content requires **theology review**; all sensitive topics require **pastoral
  safety review**.
- Faith content is **Christ-centered and biblically responsible**; sports are a gift and
  formation ground, not ultimate identity. All content stays practical, warm, truthful, and clear.
- The **From Victory** app may appear only as an *optional* supportive resource — never the theme,
  brand, or center.
- **Every event must have one practical takeaway and one clear next step.**
- The system always encourages launching **one small meeting** before expanding.

## Data models

Church · User · Initiative · Event · Session · ContentItem · Review · Speaker · Partner ·
VolunteerRole · OutreachCampaign · FeedbackEntry · FollowUpPlan · Resource · AgentOutput.

## Architecture

```
src/
  lib/
    types.ts            # all domain models, roles, enums
    store.ts            # in-memory repository (swappable) + read helpers
    seed.ts             # believable starting data
    actions.ts          # "use server" mutation surface every screen calls
    export.ts           # event packet -> Markdown / PDF-ready
    format.ts           # label + status-tone helpers
    agents/
      registry.ts       # 12 agents + shared guardrails
      runner.ts         # online (AI Gateway) / offline execution + audit trail
      operations.ts     # concrete agent capabilities (strategy, agenda, content, reviews, …)
      strategy-templates.ts
  components/            # UI kit, Markdown renderer, Sidebar
  app/                  # App Router screens + /api/export
```
