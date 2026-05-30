import { z } from "zod";
import { runAgent } from "./runner";
import { GROWTH_PATH_TEMPLATE } from "./strategy-templates";
import { id, now } from "../id";
import {
  saveEvent,
  saveContent,
  saveReview,
  getContent,
  saveVolunteerRole,
  saveOutreach,
  saveFollowUp,
  saveInitiative,
} from "../store";
import type {
  Initiative,
  Event,
  ContentItem,
  ContentType,
  Review,
  VolunteerRole,
  OutreachCampaign,
  FollowUpPlan,
  FeedbackEntry,
  Session,
  SessionKind,
} from "../types";

// ---------------------------------------------------------------------------
// 1. Ministry Strategy — recommend the launch plan
// ---------------------------------------------------------------------------

const launchPlanSchema = z.object({
  recommendation: z.string(),
  firstEvent: z.object({
    title: z.string(),
    type: z.string(),
    goal: z.string(),
    audience: z.string(),
    whyThisFirst: z.string(),
  }),
  growthPath: z.array(
    z.object({ title: z.string(), summary: z.string(), readyWhen: z.string() })
  ),
});
export type LaunchPlan = z.infer<typeof launchPlanSchema>;

export async function recommendLaunchPlan(initiative: Initiative) {
  const result = await runAgent("ministry_strategy", {
    context: { initiativeId: initiative.id },
    schema: launchPlanSchema,
    summarize: (d) => `Recommended first event: ${d.firstEvent.title}`,
    prompt: `Church initiative: ${initiative.name}.
Vision: ${initiative.visionStatement}
Community context: ${initiative.communityContext}
Focus areas: ${initiative.focusAreas.join(", ")}
Audience: ${initiative.targetAudience.join(", ")}

Recommend ONE small high-impact first event, why it should be first, and the phased growth path.`,
    offlineDraft: (): LaunchPlan => ({
      recommendation:
        "Start with one small parents' workshop. The goal of the first event is trust and one practical takeaway — not attendance. Learn from it, then expand.",
      firstEvent: {
        title: "When the Game Gets Loud: A Parents' Night for Sports Families",
        type: "parent_workshop",
        goal: "Give sports parents one practical, grace-filled tool for lowering pressure at home and on the sideline.",
        audience: "parents",
        whyThisFirst:
          "Parents are the easiest first audience to reach, the most stressed, and the gateway to serving athletes and whole families later.",
      },
      growthPath: GROWTH_PATH_TEMPLATE.map((g) => ({
        title: g.title,
        summary: g.summary,
        readyWhen: g.readyWhen,
      })),
    }),
  });

  // Persist the growth path back onto the initiative.
  const updated: Initiative = {
    ...initiative,
    growthPath: GROWTH_PATH_TEMPLATE,
    updatedAt: now(),
  };
  saveInitiative(updated);
  return result;
}

// ---------------------------------------------------------------------------
// 2. Event Planning — generate the agenda / run-of-show
// ---------------------------------------------------------------------------

const agendaSchema = z.object({
  sessions: z.array(
    z.object({
      kind: z.string(),
      title: z.string(),
      durationMinutes: z.number(),
      description: z.string(),
      owner: z.string().optional(),
    })
  ),
});

const SESSION_KINDS: SessionKind[] = [
  "welcome", "icebreaker", "talk", "panel", "discussion",
  "activity", "q_and_a", "prayer", "next_steps", "break",
];
function coerceKind(k: string): SessionKind {
  return (SESSION_KINDS as string[]).includes(k) ? (k as SessionKind) : "activity";
}

export async function generateAgenda(event: Event, initiative: Initiative) {
  const result = await runAgent("event_planning", {
    context: { initiativeId: initiative.id, eventId: event.id },
    schema: agendaSchema,
    summarize: (d) => `Generated a ${d.sessions.length}-part run-of-show`,
    prompt: `Build a warm, easy-to-run run-of-show for this event.
Title: ${event.title}
Type: ${event.type}
Goal: ${event.goal}
Audience: ${event.audience.join(", ")}
Focus: ${event.focusAreas.join(", ")}
Keep a first event to roughly 60-75 minutes.`,
    offlineDraft: () => ({
      sessions: [
        { kind: "welcome", title: "Welcome & Why We're Here", durationMinutes: 10, description: "Warm welcome, set a no-pressure tone of practical care.", owner: "Ministry Leader" },
        { kind: "icebreaker", title: "Sideline Stories", durationMinutes: 10, description: "Table groups share a sideline moment to break the ice.", owner: "Event Director" },
        { kind: "talk", title: `Talk: ${event.focusAreas[0] ?? "identity"} bigger than the scoreboard`, durationMinutes: 20, description: "Short, practical talk tied to the event goal.", owner: "Pastor" },
        { kind: "discussion", title: "Table Discussion", durationMinutes: 20, description: "Guided table questions from the discussion guide.", owner: "Table hosts" },
        { kind: "next_steps", title: "One Small Step Home", durationMinutes: 10, description: "Each guest leaves with one tool and a warm invite to follow up.", owner: "Ministry Leader" },
      ],
    }),
  });

  const sessions: Session[] = result.data.sessions.map((s, i) => ({
    id: id("sess"),
    order: i + 1,
    kind: coerceKind(s.kind),
    title: s.title,
    durationMinutes: s.durationMinutes,
    description: s.description,
    owner: s.owner,
  }));

  const updated: Event = { ...event, sessions, status: "planning", updatedAt: now() };
  saveEvent(updated);
  return { ...result, event: updated };
}

// ---------------------------------------------------------------------------
// 3. Content Creation — talk, handout, discussion guide, emails, guides
// ---------------------------------------------------------------------------

const contentSchema = z.object({
  title: z.string(),
  body: z.string(),
  requiresTheologyReview: z.boolean(),
  requiresPastoralReview: z.boolean(),
  tags: z.array(z.string()),
});

const CONTENT_LABEL: Record<ContentType, string> = {
  talk_outline: "talk outline",
  handout: "one-page handout",
  discussion_guide: "table discussion guide",
  promo_email: "promotional invitation email",
  invitation: "community invitation",
  social_post: "short social post",
  volunteer_guide: "volunteer leader guide",
  follow_up_email: "warm follow-up email",
  intake_form: "structured intake form (no AI counseling)",
  feedback_form: "post-event feedback form",
  leader_guide: "leader guide",
};

export async function generateContent(
  type: ContentType,
  event: Event,
  initiative: Initiative
) {
  const result = await runAgent("content_creation", {
    context: { initiativeId: initiative.id, eventId: event.id },
    schema: contentSchema,
    summarize: (d) => `Drafted ${type}: ${d.title}`,
    prompt: `Write a ${CONTENT_LABEL[type]} in Markdown for this event.
Event: ${event.title}
Goal: ${event.goal}
Audience: ${event.audience.join(", ")}
Focus: ${event.focusAreas.join(", ")}
Tone: warm, practical, non-preachy, welcoming to non-churchgoers.
Decide whether it needs theology review (any faith claim) and pastoral safety review (any sensitive topic).`,
    offlineDraft: () => offlineContentDraft(type, event),
  });

  const c = result.data;
  const item: ContentItem = {
    id: id("content"),
    eventId: event.id,
    initiativeId: initiative.id,
    type,
    title: c.title,
    body: c.body,
    status: c.requiresTheologyReview
      ? "needs_theology_review"
      : c.requiresPastoralReview
      ? "needs_pastoral_review"
      : "draft",
    requiresTheologyReview: c.requiresTheologyReview,
    requiresPastoralReview: c.requiresPastoralReview,
    reviewIds: [],
    generatedByAgent: "content_creation",
    inLibrary: false,
    tags: c.tags,
    createdAt: now(),
    updatedAt: now(),
  };
  saveContent(item);
  return { ...result, content: item };
}

function offlineContentDraft(type: ContentType, event: Event) {
  const base = { tags: [...event.audience, ...event.focusAreas] as string[] };
  switch (type) {
    case "talk_outline":
      return {
        title: `Talk Outline: ${event.title}`,
        body: `# ${event.title}\n\n**Audience:** ${event.audience.join(", ")} · **Tone:** warm, practical\n\n## Open (3 min)\n- A relatable sports-family moment.\n\n## Core idea (8 min)\n- Identity and worth are bigger than the scoreboard.\n\n## One practical tool (6 min)\n- A simple, repeatable habit families can try this week.\n\n## Close & invite (3 min)\n- One small step. Warm, no-pressure invite to follow up.`,
        requiresTheologyReview: true,
        requiresPastoralReview: true,
        ...base,
      };
    case "handout":
      return {
        title: `Handout: ${event.title}`,
        body: `# ${event.title}\n\n**Try this week:** one small, concrete tool.\n\n## Why it works\nA short, plain explanation.\n\n## This week\n- [ ] One small step\n- [ ] Notice what changes\n\n_You're welcome at our follow-up group — no pressure._`,
        requiresTheologyReview: true,
        requiresPastoralReview: false,
        ...base,
      };
    case "discussion_guide":
      return {
        title: `Discussion Guide: ${event.title}`,
        body: `# Table Discussion Guide\n\n**For table hosts.** Keep it relaxed. Listen more than you talk.\n\n1. What's the most stressful part of your sports-family week?\n2. Where does your child seem to feel their worth is on the line?\n3. What's one small thing you could try this week?\n\n**Host note:** If someone shares something heavy, listen and offer to connect them with a pastor. Do not counsel.`,
        requiresTheologyReview: false,
        requiresPastoralReview: true,
        ...base,
      };
    case "promo_email":
    case "invitation":
      return {
        title: `Invitation: ${event.title}`,
        body: `**Subject:** A relaxed night for sports families\n\nHi there,\n\nYouth sports can be a lot — the schedules, the pressure, the car rides home. Join us for **${event.title}**, a warm, practical evening for sports families. You'll leave with one simple tool and good company.\n\nNo cost, no pressure, all are welcome.\n\n📍 ${event.location ?? "TBD"}\n🗓️ ${event.date ? new Date(event.date).toLocaleString() : "TBD"}\n\nHope to see you there,\nThe team`,
        requiresTheologyReview: false,
        requiresPastoralReview: false,
        ...base,
      };
    case "social_post":
      return {
        title: `Social Post: ${event.title}`,
        body: `Sports parents — the car ride home doesn't have to be tense. Join us for ${event.title}: one practical tool, a relaxed evening, all welcome. 🏟️ Details + RSVP below.`,
        requiresTheologyReview: false,
        requiresPastoralReview: false,
        ...base,
      };
    case "volunteer_guide":
    case "leader_guide":
      return {
        title: `Leader Guide: ${event.title}`,
        body: `# Leader Guide\n\n**Your job:** create a warm, no-pressure space.\n\n- Greet everyone by name.\n- Listen more than you talk.\n- If someone shares something heavy, listen, thank them, and offer to connect them with a pastor. **Do not counsel or diagnose.**\n- Hand out the care-referral card if needed.\n- Close on time and invite people back.`,
        requiresTheologyReview: false,
        requiresPastoralReview: true,
        ...base,
      };
    case "follow_up_email":
      return {
        title: `Follow-Up Email: ${event.title}`,
        body: `**Subject:** Thanks for coming — one small next step\n\nHi,\n\nThank you for being part of ${event.title}. Here's the one tool we talked about, plus a relaxed way to keep going if you'd like.\n\n- The takeaway, in one line.\n- An optional resource if it's helpful: the *From Victory* app for youth athletes.\n- An open invite to our next gathering.\n\nNo pressure at all — we're glad you came.\n\nWarmly,\nThe team`,
        requiresTheologyReview: false,
        requiresPastoralReview: false,
        ...base,
      };
    case "intake_form":
      return {
        title: `Intake Form: ${event.title}`,
        body: `# Sign-Up\n\n_This is a simple form. No AI counseling — a real person reads every response._\n\n- Name\n- Email\n- Your sport(s) and kids' ages\n- Anything you're hoping to get out of the night? (optional)`,
        requiresTheologyReview: false,
        requiresPastoralReview: false,
        ...base,
      };
    case "feedback_form":
      return {
        title: `Feedback Form: ${event.title}`,
        body: `# Leader Feedback\n\n- Attendance\n- Overall (1-5)\n- What worked?\n- What would you improve?\n- How did the audience respond?\n- Follow-up interest (low/med/high)`,
        requiresTheologyReview: false,
        requiresPastoralReview: false,
        ...base,
      };
  }
}

// ---------------------------------------------------------------------------
// 4 & 8. Theology + Pastoral Safety — automated first-pass reviews
// ---------------------------------------------------------------------------

const reviewSchema = z.object({
  agentNotes: z.string(),
  flags: z.array(
    z.object({
      area: z.string(),
      severity: z.enum(["info", "caution", "high"]),
      note: z.string(),
      leaderGuidance: z.string().optional(),
    })
  ),
});

type Flag = { area: string; severity: "info" | "caution" | "high"; note: string; leaderGuidance?: string };

/**
 * Deterministic pastoral-theology first pass used when offline. Scans content
 * for the canonical-passage misuses and prohibited phrases defined in the
 * church's pastoral-theology spec, returns a verdict-style note plus flags.
 * A human reviewer always makes the final call.
 */
function pastoralTheologyOfflineReview(body: string): { agentNotes: string; flags: Flag[] } {
  const text = body.toLowerCase();
  const flags: Flag[] = [];

  // Misuse of canonical passages.
  const passages: { test: RegExp; area: string; note: string; guidance: string }[] = [
    { test: /romans\s*8:?\s*37|more than conquerors/, area: "Romans 8:37", note: "'More than conquerors' must not read as a sports-victory slogan.", guidance: "Frame it as: loss does not get the final word and cannot separate us from God's love in Christ." },
    { test: /philippians\s*4:?\s*13/, area: "Philippians 4:13", note: "This is contentment in all circumstances, not guaranteed athletic achievement.", guidance: "Use for endurance and dependence, never 'I can win because Christ strengthens me.'" },
    { test: /jeremiah\s*29:?\s*11/, area: "Jeremiah 29:11", note: "Written to exiles — not a promise of athletic success, scholarships, or an easy future.", guidance: "Handle carefully; avoid implying guaranteed outcomes." },
    { test: /romans\s*8:?\s*28|everything happens for a reason/, area: "Romans 8:28 / grief", note: "Do not use to rush past grief or as a quick fix.", guidance: "Apply with pastoral care around injury, being cut, or disappointment. Let lament be real." },
  ];
  for (const p of passages) {
    if (p.test.test(text)) flags.push({ area: p.area, severity: "caution", note: p.note, leaderGuidance: p.guidance });
  }

  // Prohibited / high-risk phrasing.
  const banned: { test: RegExp; note: string }[] = [
    { test: /god wants you to win|god is on (our|your) side|honor god.*honor you/, note: "Prosperity / triumphalist framing: faith does not guarantee winning." },
    { test: /pray harder|more faith|real christians (do not|don't) feel/, note: "Shame-based or transactional faith framing." },
    { test: /speak victory|claim your roster|declare the win/, note: "Word-of-faith / declaration language to remove." },
    { test: /crush it for jesus|champion for christ/, note: "Slogan language that subordinates the gospel to performance." },
    { test: /winning proves|losing means you (lacked|lack)/, note: "Implies results measure faith — remove." },
  ];
  for (const b of banned) {
    if (b.test.test(text)) flags.push({ area: "Prohibited framing", severity: "high", note: b.note, leaderGuidance: "Replace with received-identity language: worth is secure before the game; the scoreboard cannot name who you are." });
  }

  const verdict = flags.some((f) => f.severity === "high")
    ? "FLAG_CONCERN"
    : flags.length > 0
    ? "SUGGEST_REVISION"
    : "APPROVED";

  return {
    agentNotes:
      `Verdict: ${verdict}. Automated pastoral-theology first pass. ` +
      (verdict === "APPROVED"
        ? "No prohibited framing detected; tone reads gospel-of-grace with identity before performance. Confirm Scripture (if any) stays in context. A human reviewer must give final approval."
        : "Address the flagged items so identity precedes performance and Scripture is handled in context. A human reviewer must give final approval."),
    flags,
  };
}

export async function runTheologyReview(content: ContentItem) {
  const result = await runAgent("pastoral_theology", {
    context: { initiativeId: content.initiativeId, eventId: content.eventId },
    schema: reviewSchema,
    summarize: (d) => `Pastoral theology review: ${d.flags.length} flag(s)`,
    prompt: `Do a pastoral-theology review of this ${content.type}. A human still decides.\n\n---\n${content.body}\n---\n\nGive a verdict (APPROVED / SUGGEST_REVISION / FLAG_CONCERN). Check Scripture is in context and doing one job, that identity precedes performance, and that there is no prosperity-gospel, triumphalist, or shame-based framing. Flag any misuse of canonical passages (Romans 8:37, Philippians 4:13, Jeremiah 29:11, Romans 8:28) and provide concrete leader guidance.`,
    offlineDraft: () => pastoralTheologyOfflineReview(content.body),
  });

  const review: Review = {
    id: id("review"),
    contentItemId: content.id,
    kind: "theology",
    decision: "pending",
    agentNotes: result.data.agentNotes,
    flags: result.data.flags,
    createdAt: now(),
    updatedAt: now(),
  };
  saveReview(review);
  saveContent({
    ...content,
    status: "needs_theology_review",
    reviewIds: [...content.reviewIds, review.id],
    updatedAt: now(),
  });
  return { ...result, review };
}

export async function runPastoralReview(content: ContentItem) {
  const result = await runAgent("pastoral_safety", {
    context: { initiativeId: content.initiativeId, eventId: content.eventId },
    schema: reviewSchema,
    summarize: (d) => `Pastoral safety first-pass: ${d.flags.length} flag(s)`,
    prompt: `Do an automated first-pass pastoral safety review of this ${content.type}. A human still decides.\n\n---\n${content.body}\n---\n\nIdentify sensitive areas and add leader guidance (listen, don't counsel, refer to a pastor). Never instruct anyone to diagnose or provide therapy.`,
    offlineDraft: () => ({
      agentNotes:
        "Automated first pass. Content may surface emotional or family stress. Ensure leaders are coached to listen and refer rather than counsel. A human reviewer must give final approval.",
      flags: [
        {
          area: "Emotional disclosure",
          severity: "caution" as const,
          note: "Discussion may surface anxiety, family conflict, or pressure-related distress.",
          leaderGuidance: "Listen, thank them, and offer to connect them with a pastor. Provide the care-referral card. Do not counsel or diagnose.",
        },
      ],
    }),
  });

  const review: Review = {
    id: id("review"),
    contentItemId: content.id,
    kind: "pastoral_safety",
    decision: "pending",
    agentNotes: result.data.agentNotes,
    flags: result.data.flags,
    createdAt: now(),
    updatedAt: now(),
  };
  saveReview(review);
  saveContent({
    ...content,
    reviewIds: [...content.reviewIds, review.id],
    updatedAt: now(),
  });
  return { ...result, review };
}

// ---------------------------------------------------------------------------
// 6. Community Outreach — campaign assets
// ---------------------------------------------------------------------------

export async function generateOutreach(event: Event, initiative: Initiative) {
  const invite = await generateContent("invitation", event, initiative);
  const social = await generateContent("social_post", event, initiative);

  const campaign: OutreachCampaign = {
    id: id("outreach"),
    eventId: event.id,
    name: `${event.title} — Outreach`,
    channels: ["email", "social", "partner_network"],
    assetIds: [invite.content.id, social.content.id],
    audienceNote: `Reach non-churchgoing sports families. Lead with practical value. Focus: ${event.focusAreas.join(", ")}.`,
    status: "draft",
    createdAt: now(),
  };
  saveOutreach(campaign);
  return { campaign, assets: [invite.content, social.content], offline: invite.offline };
}

// ---------------------------------------------------------------------------
// 7. Volunteer Coordination — roles + leader guides
// ---------------------------------------------------------------------------

const volunteerSchema = z.object({
  roles: z.array(
    z.object({
      title: z.string(),
      responsibilities: z.array(z.string()),
      count: z.number(),
      leaderGuide: z.string(),
    })
  ),
});

export async function generateVolunteerPlan(event: Event, initiative: Initiative) {
  const result = await runAgent("volunteer_coordination", {
    context: { initiativeId: initiative.id, eventId: event.id },
    schema: volunteerSchema,
    summarize: (d) => `Defined ${d.roles.length} volunteer role(s)`,
    prompt: `Define the minimum viable volunteer roles for this event with responsibilities, counts, and a short leader guide each.\nEvent: ${event.title} (${event.type}), expected attendance ${event.expectedAttendance ?? "unknown"}.`,
    offlineDraft: () => ({
      roles: [
        { title: "Greeter / Welcome", responsibilities: ["Welcome every guest by name", "Hand out name tags", "Point to refreshments and seating"], count: 2, leaderGuide: "Set a warm, no-pressure tone. You are the first impression of the church." },
        { title: "Table Host", responsibilities: ["Lead a table through the discussion guide", "Keep it relaxed and inclusive", "Watch the clock"], count: 4, leaderGuide: "Listen more than you talk. If someone shares something heavy, listen and offer to connect them with a pastor. Do not counsel." },
        { title: "Logistics / Setup", responsibilities: ["Set up room and refreshments", "Manage A/V", "Reset the space afterward"], count: 2, leaderGuide: "Have everything ready 30 minutes early so leaders can focus on people." },
        { title: "Follow-Up Coordinator", responsibilities: ["Collect contact cards", "Note follow-up interest", "Hand off to the Follow-Up Agent plan"], count: 1, leaderGuide: "Be light-touch. Capture interest without pressure." },
      ],
    }),
  });

  const roles: VolunteerRole[] = result.data.roles.map((r) => ({
    id: id("vol"),
    eventId: event.id,
    title: r.title,
    responsibilities: r.responsibilities,
    count: r.count,
    filledBy: [],
    leaderGuide: r.leaderGuide,
    createdAt: now(),
  }));
  roles.forEach(saveVolunteerRole);
  return { ...result, roles };
}

// ---------------------------------------------------------------------------
// 9. Follow-Up — email sequence + next-step pathways
// ---------------------------------------------------------------------------

const followUpSchema = z.object({
  summary: z.string(),
  steps: z.array(
    z.object({
      channel: z.enum(["email", "group", "call", "resource"]),
      timing: z.string(),
      title: z.string(),
      body: z.string(),
    })
  ),
  nextStepPathways: z.array(z.string()),
  optionalResources: z.array(z.string()),
});

export async function generateFollowUp(event: Event, initiative: Initiative) {
  const result = await runAgent("follow_up", {
    context: { initiativeId: initiative.id, eventId: event.id },
    schema: followUpSchema,
    summarize: (d) => `Built a ${d.steps.length}-step follow-up sequence`,
    prompt: `Create a short, warm follow-up plan after this event: an email sequence plus clear next-step pathways.\nEvent: ${event.title}. Audience: ${event.audience.join(", ")}.\nFrom Victory may be offered as ONE optional resource, never the headline.`,
    offlineDraft: () => ({
      summary: "A light-touch, 3-step follow-up that thanks guests, reinforces the one tool, and offers a relaxed next step.",
      steps: [
        { channel: "email" as const, timing: "Within 24 hours", title: "Thanks for coming", body: "Warm thank-you, the one tool restated in a sentence, and an open door to reply." },
        { channel: "email" as const, timing: "Day 5", title: "How did it go?", body: "Ask how the one small step went. Offer an optional resource (e.g. the From Victory app) and the next gathering." },
        { channel: "group" as const, timing: "Week 2-3", title: "Invite to the follow-up group", body: "Personal, no-pressure invite to a relaxed table group for sports families." },
      ],
      nextStepPathways: [
        "Follow-up table group for sports parents",
        "Next event in the series",
        "One-on-one coffee with a leader (optional)",
      ],
      optionalResources: ["From Victory app (optional, for youth athletes)", "Recommended reading list"],
    }),
  });

  const plan: FollowUpPlan = {
    id: id("followup"),
    eventId: event.id,
    initiativeId: initiative.id,
    summary: result.data.summary,
    steps: result.data.steps.map((s, i) => ({ order: i + 1, ...s })),
    nextStepPathways: result.data.nextStepPathways,
    optionalResources: result.data.optionalResources,
    createdAt: now(),
  };
  saveFollowUp(plan);
  return { ...result, plan };
}

// ---------------------------------------------------------------------------
// 10. Learning & Improvement — recommend the next event from feedback
// ---------------------------------------------------------------------------

const nextStepSchema = z.object({
  headline: z.string(),
  rationale: z.string(),
  recommendedNext: z.object({
    title: z.string(),
    type: z.string(),
    audience: z.string(),
    whyNow: z.string(),
  }),
  alternativeOptions: z.array(z.string()),
  suggestedPhase: z.string(),
});
export type NextStepRecommendation = z.infer<typeof nextStepSchema>;

export async function recommendNextEvent(
  event: Event,
  initiative: Initiative,
  feedback: FeedbackEntry[]
) {
  const avg =
    feedback.length > 0
      ? feedback.reduce((s, f) => s + f.overallRating, 0) / feedback.length
      : 0;
  const highInterest = feedback.filter((f) => f.followUpInterest === "high").length;

  return runAgent("learning_improvement", {
    context: { initiativeId: initiative.id, eventId: event.id },
    schema: nextStepSchema,
    summarize: (d) => `Next step: ${d.recommendedNext.title}`,
    prompt: `Based on this event's feedback, recommend the next best step. Respect start-small philosophy.
Event: ${event.title} (${event.type}), current phase ${initiative.currentPhase}.
Feedback count: ${feedback.length}, avg rating: ${avg.toFixed(1)}/5, high follow-up interest: ${highInterest}.
Notes: ${feedback.map((f) => `worked="${f.whatWorked}"; improve="${f.whatToImprove}"; resonance="${f.audienceResonance}"`).join(" | ") || "none yet"}.`,
    offlineDraft: (): NextStepRecommendation => {
      const strong = avg >= 4 || highInterest >= 2;
      return {
        headline: strong
          ? "Strong response — expand into a short series."
          : "Good first step — repeat and refine before expanding.",
        rationale: strong
          ? `Average rating ${avg.toFixed(1)}/5 with ${highInterest} families wanting more follow-up signals real demand. Convert your strongest theme into a 3-part series for the same audience.`
          : `Feedback is encouraging but early. Run a similar event again, apply the improvement notes, and build a small volunteer core before scaling.`,
        recommendedNext: strong
          ? { title: "Raising Grounded Athletes — a 3-part parent series", type: "seminar", audience: "parents", whyNow: "Repeat interest is high; a series deepens relationships." }
          : { title: `${event.title} (round 2, refined)`, type: event.type, audience: event.audience.join(", "), whyNow: "Lock in the format and grow the volunteer team first." },
        alternativeOptions: strong
          ? ["Add an athlete workshop: 'Reset — How to Move Forward After Mistakes'", "Host a coach breakfast", "Invite a vetted guest speaker"]
          : ["Invite a partner school or club to co-host", "Add a follow-up table group"],
        suggestedPhase: strong ? "phase_2_series" : "phase_1_one_event",
      };
    },
  });
}
