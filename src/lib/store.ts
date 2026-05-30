import type {
  Church,
  User,
  Initiative,
  Event,
  ContentItem,
  Review,
  Speaker,
  Partner,
  VolunteerRole,
  OutreachCampaign,
  FeedbackEntry,
  FollowUpPlan,
  Resource,
  Roadmap,
  AgentOutput,
} from "./types";
import { seed } from "./seed";

/**
 * In-memory data layer. Every entity lives in a Map keyed by id.
 *
 * This is intentionally behind a single `db` object so it can be swapped for a
 * real database (e.g. Supabase Postgres) without touching the app — the route
 * handlers and server actions only ever call the exported repository helpers.
 *
 * A global singleton keeps data stable across Next.js hot reloads in dev.
 */
export interface DB {
  churches: Map<string, Church>;
  users: Map<string, User>;
  initiatives: Map<string, Initiative>;
  events: Map<string, Event>;
  content: Map<string, ContentItem>;
  reviews: Map<string, Review>;
  speakers: Map<string, Speaker>;
  partners: Map<string, Partner>;
  volunteerRoles: Map<string, VolunteerRole>;
  outreach: Map<string, OutreachCampaign>;
  feedback: Map<string, FeedbackEntry>;
  followUps: Map<string, FollowUpPlan>;
  resources: Map<string, Resource>;
  roadmaps: Map<string, Roadmap>;
  agentOutputs: Map<string, AgentOutput>;
}

function freshDB(): DB {
  return {
    churches: new Map(),
    users: new Map(),
    initiatives: new Map(),
    events: new Map(),
    content: new Map(),
    reviews: new Map(),
    speakers: new Map(),
    partners: new Map(),
    volunteerRoles: new Map(),
    outreach: new Map(),
    feedback: new Map(),
    followUps: new Map(),
    resources: new Map(),
    roadmaps: new Map(),
    agentOutputs: new Map(),
  };
}

const globalForDB = globalThis as unknown as { __ministryDB?: DB };

export const db: DB =
  globalForDB.__ministryDB ??
  (() => {
    const fresh = freshDB();
    seed(fresh);
    globalForDB.__ministryDB = fresh;
    return fresh;
  })();

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

function all<T>(map: Map<string, T>): T[] {
  return Array.from(map.values());
}

// Churches & users -----------------------------------------------------------
export const getChurch = (id: string) => db.churches.get(id);
export const listUsers = () => all(db.users);
export const getUser = (id: string) => db.users.get(id);

// Initiatives ----------------------------------------------------------------
export const listInitiatives = () => all(db.initiatives);
export const getInitiative = (id: string) => db.initiatives.get(id);
export const saveInitiative = (i: Initiative) => {
  db.initiatives.set(i.id, i);
  return i;
};

// Events ---------------------------------------------------------------------
export const listEvents = () => all(db.events);
export const listEventsByInitiative = (initiativeId: string) =>
  all(db.events).filter((e) => e.initiativeId === initiativeId);
export const getEvent = (id: string) => db.events.get(id);
export const saveEvent = (e: Event) => {
  db.events.set(e.id, e);
  return e;
};

// Content --------------------------------------------------------------------
export const listContent = () => all(db.content);
export const listContentByEvent = (eventId: string) =>
  all(db.content).filter((c) => c.eventId === eventId);
export const listContentByInitiative = (initiativeId: string) =>
  all(db.content).filter((c) => c.initiativeId === initiativeId);
export const getContent = (id: string) => db.content.get(id);
export const saveContent = (c: ContentItem) => {
  db.content.set(c.id, c);
  return c;
};

// Reviews --------------------------------------------------------------------
export const listReviews = () => all(db.reviews);
export const listReviewsByKind = (kind: Review["kind"]) =>
  all(db.reviews).filter((r) => r.kind === kind);
export const getReview = (id: string) => db.reviews.get(id);
export const saveReview = (r: Review) => {
  db.reviews.set(r.id, r);
  return r;
};

// Speakers & partners --------------------------------------------------------
export const listSpeakers = () => all(db.speakers);
export const getSpeaker = (id: string) => db.speakers.get(id);
export const saveSpeaker = (s: Speaker) => {
  db.speakers.set(s.id, s);
  return s;
};
export const listPartners = () => all(db.partners);
export const savePartner = (p: Partner) => {
  db.partners.set(p.id, p);
  return p;
};

// Volunteers -----------------------------------------------------------------
export const listVolunteerRoles = () => all(db.volunteerRoles);
export const listVolunteerRolesByEvent = (eventId: string) =>
  all(db.volunteerRoles).filter((v) => v.eventId === eventId);
export const saveVolunteerRole = (v: VolunteerRole) => {
  db.volunteerRoles.set(v.id, v);
  return v;
};

// Outreach -------------------------------------------------------------------
export const listOutreach = () => all(db.outreach);
export const listOutreachByEvent = (eventId: string) =>
  all(db.outreach).filter((o) => o.eventId === eventId);
export const saveOutreach = (o: OutreachCampaign) => {
  db.outreach.set(o.id, o);
  return o;
};

// Feedback -------------------------------------------------------------------
export const listFeedback = () => all(db.feedback);
export const listFeedbackByEvent = (eventId: string) =>
  all(db.feedback).filter((f) => f.eventId === eventId);
export const saveFeedback = (f: FeedbackEntry) => {
  db.feedback.set(f.id, f);
  return f;
};

// Follow-up ------------------------------------------------------------------
export const listFollowUps = () => all(db.followUps);
export const listFollowUpsByEvent = (eventId: string) =>
  all(db.followUps).filter((f) => f.eventId === eventId);
export const saveFollowUp = (f: FollowUpPlan) => {
  db.followUps.set(f.id, f);
  return f;
};

// Resources (library) --------------------------------------------------------
export const listResources = () => all(db.resources);
export const saveResource = (r: Resource) => {
  db.resources.set(r.id, r);
  return r;
};

// Roadmaps -------------------------------------------------------------------
export const getRoadmapByInitiative = (initiativeId: string) =>
  all(db.roadmaps).find((r) => r.initiativeId === initiativeId);
export const saveRoadmap = (r: Roadmap) => {
  db.roadmaps.set(r.id, r);
  return r;
};

// Agent outputs --------------------------------------------------------------
export const listAgentOutputs = () => all(db.agentOutputs);
export const saveAgentOutput = (o: AgentOutput) => {
  db.agentOutputs.set(o.id, o);
  return o;
};
