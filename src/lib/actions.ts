"use server";

import { revalidatePath } from "next/cache";
import { id, now } from "./id";
import {
  saveInitiative,
  saveEvent,
  getEvent,
  getInitiative,
  getContent,
  saveContent,
  getReview,
  saveReview,
  saveResource,
  saveSpeaker,
  savePartner,
  saveFeedback,
  getRoadmapByInitiative,
  saveRoadmap,
} from "./store";
import {
  recommendLaunchPlan,
  generateAgenda,
  generateContent,
  runTheologyReview,
  runPastoralReview,
  generateOutreach,
  generateVolunteerPlan,
  generateFollowUp,
  recommendNextEvent,
} from "./agents/operations";
import { GROWTH_PATH_TEMPLATE } from "./agents/strategy-templates";
import type {
  Initiative,
  Event,
  ContentType,
  ReviewDecision,
  FocusArea,
  AudienceSegment,
  EventType,
  Speaker,
  Partner,
  FeedbackEntry,
  RoadmapBlock,
} from "./types";
import { listFeedbackByEvent, listContentByEvent } from "./store";

const DEFAULT_CHURCH = "church_lhc";
const DEFAULT_USER = "user_lead";

// --- Initiatives ------------------------------------------------------------

export async function createInitiative(input: {
  name: string;
  visionStatement: string;
  communityContext: string;
  focusAreas: FocusArea[];
  targetAudience: AudienceSegment[];
}): Promise<string> {
  const initiative: Initiative = {
    id: id("init"),
    churchId: DEFAULT_CHURCH,
    name: input.name,
    visionStatement: input.visionStatement,
    communityContext: input.communityContext,
    focusAreas: input.focusAreas,
    targetAudience: input.targetAudience,
    status: "planning",
    currentPhase: "phase_1_one_event",
    growthPath: GROWTH_PATH_TEMPLATE,
    createdBy: DEFAULT_USER,
    createdAt: now(),
    updatedAt: now(),
  };
  saveInitiative(initiative);
  // Immediately produce the recommended start-small launch plan.
  await recommendLaunchPlan(initiative);
  revalidatePath("/");
  revalidatePath("/initiatives");
  return initiative.id;
}

export async function regenerateLaunchPlan(initiativeId: string) {
  const initiative = getInitiative(initiativeId);
  if (!initiative) throw new Error("Initiative not found");
  await recommendLaunchPlan(initiative);
  revalidatePath(`/initiatives/${initiativeId}`);
}

// --- Events -----------------------------------------------------------------

export async function createEvent(input: {
  initiativeId: string;
  title: string;
  type: EventType;
  goal: string;
  audience: AudienceSegment[];
  focusAreas: FocusArea[];
  date?: string;
  location?: string;
  expectedAttendance?: number;
}): Promise<string> {
  const event: Event = {
    id: id("event"),
    initiativeId: input.initiativeId,
    title: input.title,
    type: input.type,
    goal: input.goal,
    audience: input.audience,
    focusAreas: input.focusAreas,
    date: input.date,
    location: input.location,
    expectedAttendance: input.expectedAttendance,
    status: "draft",
    sessions: [],
    createdBy: DEFAULT_USER,
    createdAt: now(),
    updatedAt: now(),
  };
  saveEvent(event);
  revalidatePath("/events");
  revalidatePath(`/initiatives/${input.initiativeId}`);
  return event.id;
}

export async function buildAgenda(eventId: string) {
  const event = getEvent(eventId);
  if (!event) throw new Error("Event not found");
  const initiative = getInitiative(event.initiativeId)!;
  await generateAgenda(event, initiative);
  revalidatePath(`/events/${eventId}`);
}

// --- Content ----------------------------------------------------------------

export async function createContent(eventId: string, type: ContentType) {
  const event = getEvent(eventId);
  if (!event) throw new Error("Event not found");
  const initiative = getInitiative(event.initiativeId)!;
  const { content } = await generateContent(type, event, initiative);
  // Auto-queue first-pass reviews where required.
  if (content.requiresTheologyReview) await runTheologyReview(getContent(content.id)!);
  if (content.requiresPastoralReview) await runPastoralReview(getContent(content.id)!);
  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/events/${eventId}/content`);
  revalidatePath("/reviews/theology");
  revalidatePath("/reviews/pastoral");
  return content.id;
}

/** Generates the full first-event content set in one click (acceptance criteria). */
export async function generateFullContentSet(eventId: string) {
  const types: ContentType[] = [
    "talk_outline",
    "handout",
    "discussion_guide",
    "promo_email",
    "volunteer_guide",
    "follow_up_email",
  ];
  for (const t of types) {
    await createContent(eventId, t);
  }
  revalidatePath(`/events/${eventId}`);
}

export async function updateContentBody(contentId: string, body: string) {
  const c = getContent(contentId);
  if (!c) throw new Error("Content not found");
  saveContent({ ...c, body, updatedAt: now() });
  revalidatePath(`/content/${contentId}`);
}

// --- Reviews ----------------------------------------------------------------

export async function decideReview(
  reviewId: string,
  decision: ReviewDecision,
  reviewerComment?: string
) {
  const review = getReview(reviewId);
  if (!review) throw new Error("Review not found");
  saveReview({ ...review, decision, reviewerComment, reviewerId: DEFAULT_USER, updatedAt: now() });

  const content = getContent(review.contentItemId);
  if (content) {
    let status = content.status;
    if (decision === "approved") status = "approved";
    else if (decision === "rejected") status = "archived";
    else if (decision === "changes_requested") status = "changes_requested";
    saveContent({ ...content, status, updatedAt: now() });
  }
  revalidatePath("/reviews/theology");
  revalidatePath("/reviews/pastoral");
  revalidatePath(`/content/${review.contentItemId}`);
}

/** Pastoral reviewer adds a flag + leader guidance to a content item's review. */
export async function addPastoralFlag(
  reviewId: string,
  flag: { area: string; severity: "info" | "caution" | "high"; note: string; leaderGuidance?: string }
) {
  const review = getReview(reviewId);
  if (!review) throw new Error("Review not found");
  saveReview({ ...review, flags: [...review.flags, flag], updatedAt: now() });
  revalidatePath("/reviews/pastoral");
}

// --- Library ----------------------------------------------------------------

export async function promoteToLibrary(contentId: string) {
  const c = getContent(contentId);
  if (!c) throw new Error("Content not found");
  if (c.status !== "approved") throw new Error("Only approved content can enter the library");
  saveContent({ ...c, inLibrary: true, updatedAt: now() });
  saveResource({
    id: id("res"),
    initiativeId: c.initiativeId,
    title: c.title,
    type: c.type,
    body: c.body,
    tags: c.tags,
    sourceContentId: c.id,
    approvedReviewIds: c.reviewIds,
    createdAt: now(),
  });
  revalidatePath("/library");
  revalidatePath(`/content/${contentId}`);
}

// --- Outreach / Volunteers / Follow-up --------------------------------------

export async function buildOutreach(eventId: string) {
  const event = getEvent(eventId);
  if (!event) throw new Error("Event not found");
  await generateOutreach(event, getInitiative(event.initiativeId)!);
  revalidatePath(`/events/${eventId}/outreach`);
}

export async function buildVolunteerPlan(eventId: string) {
  const event = getEvent(eventId);
  if (!event) throw new Error("Event not found");
  await generateVolunteerPlan(event, getInitiative(event.initiativeId)!);
  revalidatePath(`/events/${eventId}/volunteers`);
}

export async function buildFollowUp(eventId: string) {
  const event = getEvent(eventId);
  if (!event) throw new Error("Event not found");
  await generateFollowUp(event, getInitiative(event.initiativeId)!);
  revalidatePath(`/events/${eventId}/follow-up`);
}

// --- Speakers & Partners ----------------------------------------------------

export async function createSpeaker(input: Omit<Speaker, "id" | "createdAt">) {
  const speaker: Speaker = { ...input, id: id("speaker"), createdAt: now() };
  saveSpeaker(speaker);
  revalidatePath("/speakers");
}

export async function createPartner(input: Omit<Partner, "id" | "createdAt">) {
  const partner: Partner = { ...input, id: id("partner"), createdAt: now() };
  savePartner(partner);
  revalidatePath("/speakers");
}

// --- Feedback + next step ---------------------------------------------------

export async function submitFeedback(
  input: Omit<FeedbackEntry, "id" | "createdAt" | "submittedBy">
): Promise<void> {
  const entry: FeedbackEntry = {
    ...input,
    id: id("fb"),
    submittedBy: DEFAULT_USER,
    createdAt: now(),
  };
  saveFeedback(entry);

  // Immediately mark the event complete and compute the next-step recommendation.
  const event = getEvent(input.eventId);
  if (event) {
    saveEvent({ ...event, status: "completed", updatedAt: now() });
    const initiative = getInitiative(event.initiativeId)!;
    await recommendNextEvent(event, initiative, listFeedbackByEvent(event.id));
  }
  revalidatePath(`/events/${input.eventId}`);
  revalidatePath(`/events/${input.eventId}/feedback`);
  revalidatePath(`/events/${input.eventId}/next-steps`);
}

export async function computeNextSteps(eventId: string) {
  const event = getEvent(eventId);
  if (!event) throw new Error("Event not found");
  const initiative = getInitiative(event.initiativeId)!;
  await recommendNextEvent(event, initiative, listFeedbackByEvent(eventId));
  revalidatePath(`/events/${eventId}/next-steps`);
}

// --- Roadmap Builder --------------------------------------------------------

/**
 * Persists the leader's working roadmap (full ordered block list + notes). The
 * client owns add/reorder/edit/remove/template/custom interactions and sends
 * the complete state here. No required sequence is enforced.
 */
export async function persistRoadmap(input: {
  initiativeId: string;
  templateName?: string;
  notes?: string;
  blocks: RoadmapBlock[];
}): Promise<void> {
  const existing = getRoadmapByInitiative(input.initiativeId);
  saveRoadmap({
    id: existing?.id ?? id("roadmap"),
    initiativeId: input.initiativeId,
    templateName: input.templateName,
    notes: input.notes,
    blocks: input.blocks,
    updatedAt: now(),
  });
  revalidatePath("/roadmap");
  revalidatePath("/roadmap/print");
}

// Re-export read helpers used by export route.
export { listContentByEvent };
