/**
 * Domain types for the Faith & Sports Ministry planning system.
 *
 * This is an INTERNAL tool for church leaders. None of these entities represent
 * a family-facing chatbot or AI counselor — families only ever see exported,
 * human-reviewed materials and structured forms.
 */

// ---------------------------------------------------------------------------
// Roles & users
// ---------------------------------------------------------------------------

export const USER_ROLES = [
  "church_admin",
  "pastor",
  "ministry_leader",
  "event_director",
  "content_reviewer",
  "volunteer_coordinator",
  "speaker_manager",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  church_admin: "Church Admin",
  pastor: "Pastor",
  ministry_leader: "Ministry Leader",
  event_director: "Event Director",
  content_reviewer: "Content Reviewer",
  volunteer_coordinator: "Volunteer Coordinator",
  speaker_manager: "Speaker Manager",
};

export interface User {
  id: string;
  churchId: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Church {
  id: string;
  name: string;
  city: string;
  state: string;
  size: "small" | "medium" | "large";
  denomination?: string;
  doctrineNotes?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Initiative & growth path
// ---------------------------------------------------------------------------

export type InitiativeStatus = "draft" | "planning" | "active" | "paused" | "archived";

export type GrowthPhase =
  | "phase_1_one_event"
  | "phase_2_series"
  | "phase_3_athlete_workshop"
  | "phase_4_speakers_partners"
  | "phase_5_recurring_tracks";

export interface GrowthStep {
  phase: GrowthPhase;
  title: string;
  summary: string;
  suggestedEvents: string[];
  readyWhen: string;
}

export interface Initiative {
  id: string;
  churchId: string;
  name: string;
  /** The community problem this initiative serves. */
  visionStatement: string;
  /** Sports families navigate pressure, identity, parenting, faith, character. */
  focusAreas: FocusArea[];
  targetAudience: AudienceSegment[];
  communityContext: string;
  status: InitiativeStatus;
  currentPhase: GrowthPhase;
  /** Recommended growth path from the Ministry Strategy Agent. */
  growthPath: GrowthStep[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const FOCUS_AREAS = [
  "pressure",
  "identity",
  "parenting",
  "faith",
  "character",
  "team_culture",
  "mental_health_awareness",
  "transitions",
] as const;
export type FocusArea = (typeof FOCUS_AREAS)[number];

export const AUDIENCE_SEGMENTS = [
  "parents",
  "athletes",
  "coaches",
  "whole_families",
  "team_leaders",
] as const;
export type AudienceSegment = (typeof AUDIENCE_SEGMENTS)[number];

// ---------------------------------------------------------------------------
// Event & sessions
// ---------------------------------------------------------------------------

export type EventType =
  | "meeting"
  | "seminar"
  | "speaker_event"
  | "parent_workshop"
  | "athlete_workshop"
  | "coach_breakfast"
  | "follow_up_group";

export type EventStatus =
  | "draft"
  | "planning"
  | "content_review"
  | "ready"
  | "scheduled"
  | "completed"
  | "cancelled";

export interface Event {
  id: string;
  initiativeId: string;
  title: string;
  type: EventType;
  audience: AudienceSegment[];
  focusAreas: FocusArea[];
  goal: string;
  date?: string;
  location?: string;
  expectedAttendance?: number;
  status: EventStatus;
  /** Ordered run-of-show. */
  sessions: Session[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type SessionKind =
  | "welcome"
  | "icebreaker"
  | "talk"
  | "panel"
  | "discussion"
  | "activity"
  | "q_and_a"
  | "prayer"
  | "next_steps"
  | "break";

export interface Session {
  id: string;
  order: number;
  kind: SessionKind;
  title: string;
  durationMinutes: number;
  description: string;
  /** Who runs this part of the run-of-show. */
  owner?: string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

export type ContentType =
  | "talk_outline"
  | "handout"
  | "discussion_guide"
  | "promo_email"
  | "invitation"
  | "social_post"
  | "volunteer_guide"
  | "follow_up_email"
  | "intake_form"
  | "feedback_form"
  | "leader_guide";

export type ContentStatus =
  | "draft"
  | "needs_theology_review"
  | "needs_pastoral_review"
  | "changes_requested"
  | "approved"
  | "archived";

export interface ContentItem {
  id: string;
  eventId?: string;
  initiativeId: string;
  type: ContentType;
  title: string;
  /** Markdown body — every family-facing artifact is exported from this. */
  body: string;
  status: ContentStatus;
  /** Whether this content makes faith claims and therefore needs theology review. */
  requiresTheologyReview: boolean;
  /** Whether this content touches sensitive topics and needs pastoral safety review. */
  requiresPastoralReview: boolean;
  reviewIds: string[];
  generatedByAgent?: AgentId;
  inLibrary: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Reviews (Theology + Pastoral Safety)
// ---------------------------------------------------------------------------

export type ReviewKind = "theology" | "pastoral_safety";
export type ReviewDecision = "pending" | "approved" | "rejected" | "changes_requested";

export interface ReviewFlag {
  area: string;
  severity: "info" | "caution" | "high";
  note: string;
  /** Guidance the reviewer/agent adds for the leader running the event. */
  leaderGuidance?: string;
}

export interface Review {
  id: string;
  contentItemId: string;
  kind: ReviewKind;
  decision: ReviewDecision;
  reviewerId?: string;
  /** Automated first-pass notes from the corresponding review agent. */
  agentNotes?: string;
  flags: ReviewFlag[];
  reviewerComment?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Speakers & Partners
// ---------------------------------------------------------------------------

export type SpeakerStatus = "prospect" | "invited" | "confirmed" | "declined" | "completed";

export interface Speaker {
  id: string;
  initiativeId: string;
  name: string;
  topicAreas: string[];
  bio: string;
  organization?: string;
  contactEmail?: string;
  status: SpeakerStatus;
  /** Vetting notes — alignment with church doctrine and tone. */
  vettingNotes?: string;
  createdAt: string;
}

export type PartnerType = "school" | "club" | "league" | "nonprofit" | "business" | "ministry";
export type PartnerStatus = "prospect" | "contacted" | "engaged" | "declined";

export interface Partner {
  id: string;
  initiativeId: string;
  name: string;
  type: PartnerType;
  contactName?: string;
  contactEmail?: string;
  status: PartnerStatus;
  collaborationIdea: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Volunteers
// ---------------------------------------------------------------------------

export interface VolunteerRole {
  id: string;
  eventId: string;
  title: string;
  responsibilities: string[];
  count: number;
  filledBy: string[];
  /** Short leader guide for the role. */
  leaderGuide: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Outreach
// ---------------------------------------------------------------------------

export type OutreachChannel = "email" | "social" | "flyer" | "text" | "partner_network" | "word_of_mouth";

export interface OutreachCampaign {
  id: string;
  eventId: string;
  name: string;
  channels: OutreachChannel[];
  /** ContentItem ids for the invitation / promo assets. */
  assetIds: string[];
  audienceNote: string;
  status: "draft" | "scheduled" | "sent";
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Feedback & follow-up
// ---------------------------------------------------------------------------

export interface FeedbackEntry {
  id: string;
  eventId: string;
  submittedBy: string;
  attendance: number;
  /** 1-5 overall. */
  overallRating: number;
  whatWorked: string;
  whatToImprove: string;
  audienceResonance: string;
  followUpInterest: "low" | "medium" | "high";
  notableMoments?: string;
  createdAt: string;
}

export interface FollowUpStep {
  order: number;
  channel: "email" | "group" | "call" | "resource";
  timing: string;
  title: string;
  body: string;
}

export interface FollowUpPlan {
  id: string;
  eventId: string;
  initiativeId: string;
  summary: string;
  /** Email sequence + next-step pathways. */
  steps: FollowUpStep[];
  nextStepPathways: string[];
  /** From Victory may appear here as an OPTIONAL resource, never the brand. */
  optionalResources: string[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Resources (Content Library)
// ---------------------------------------------------------------------------

export interface Resource {
  id: string;
  initiativeId: string;
  title: string;
  type: ContentType;
  body: string;
  tags: string[];
  /** Pointer back to the approved ContentItem this was promoted from. */
  sourceContentId?: string;
  approvedReviewIds: string[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Agent outputs (audit trail)
// ---------------------------------------------------------------------------

export const AGENT_IDS = [
  "ministry_strategy",
  "event_planning",
  "content_creation",
  "theology_review",
  "pastoral_theology",
  "community_outreach",
  "speaker_partner",
  "volunteer_coordination",
  "pastoral_safety",
  "follow_up",
  "learning_improvement",
  "brand_voice",
  "content_librarian",
] as const;

export type AgentId = (typeof AGENT_IDS)[number];

export interface AgentOutput {
  id: string;
  agentId: AgentId;
  initiativeId?: string;
  eventId?: string;
  /** Free-form summary of what the agent produced. */
  summary: string;
  /** Raw structured payload returned by the agent. */
  payload: unknown;
  model: string;
  offline: boolean;
  createdAt: string;
}
