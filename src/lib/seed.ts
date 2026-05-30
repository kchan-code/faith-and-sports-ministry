import type { DB } from "./store";
import type {
  Church,
  User,
  Initiative,
  Event,
  ContentItem,
  Review,
  Speaker,
  Roadmap,
} from "./types";
import { GROWTH_PATH_TEMPLATE } from "./agents/strategy-templates";
import { TEMPLATE_BY_ID, BLOCK_BY_ID } from "./roadmap-library";

/**
 * Seeds a believable starting state: one church, a few leaders, one initiative
 * still in Phase 1, and a first event mid-planning with some content + reviews.
 * This lets every screen render meaningful data on first load.
 */
export function seed(db: DB): void {
  const t = "2026-05-01T12:00:00.000Z";

  const church: Church = {
    id: "church_lhc",
    name: "Long Hill Chapel",
    city: "Chatham",
    state: "NJ",
    size: "medium",
    denomination: "Non-denominational evangelical",
    doctrineNotes:
      "Evangelical, gospel-centered. Identity in Christ precedes performance. Avoid prosperity-gospel framing. Key assets: a gym for practical/embodied events, and member relationships with sports leaders across the NY/NJ area. The gym is a formation space, not a performance clinic.",
    createdAt: t,
  };
  db.churches.set(church.id, church);

  const users: User[] = [
    { id: "user_pastor", churchId: church.id, name: "Pastor David Reyes", email: "david@longhillchapel.org", role: "pastor", createdAt: t },
    { id: "user_admin", churchId: church.id, name: "Karen Liu", email: "karen@longhillchapel.org", role: "church_admin", createdAt: t },
    { id: "user_lead", churchId: church.id, name: "Marcus Bell", email: "marcus@longhillchapel.org", role: "ministry_leader", createdAt: t },
    { id: "user_director", churchId: church.id, name: "Tasha Owens", email: "tasha@longhillchapel.org", role: "event_director", createdAt: t },
    { id: "user_reviewer", churchId: church.id, name: "Pastor Anne Cole", email: "anne@longhillchapel.org", role: "content_reviewer", createdAt: t },
    { id: "user_vol", churchId: church.id, name: "Greg Park", email: "greg@longhillchapel.org", role: "volunteer_coordinator", createdAt: t },
    { id: "user_speaker", churchId: church.id, name: "Nina Cruz", email: "nina@longhillchapel.org", role: "speaker_manager", createdAt: t },
  ];
  users.forEach((u) => db.users.set(u.id, u));

  const initiative: Initiative = {
    id: "init_sportsfamilies",
    churchId: church.id,
    name: "Long Hill Chapel Sports Family Ministry",
    visionStatement:
      "Long Hill Chapel can become a trusted place where sports families receive practical support, biblical hope, and relational care in the real pressures of youth sports — using the church's pastoral trust, its gym, and access to NY/NJ sports leaders.",
    focusAreas: ["pressure", "identity", "parenting", "faith", "character"],
    targetAudience: ["parents", "athletes", "coaches", "whole_families"],
    communityContext:
      "Chatham and the surrounding NY/NJ suburbs have an intense competitive youth-sports culture (soccer, basketball, baseball, lacrosse, hockey). Long Hill Chapel has a gym for practical, family-friendly events and member relationships with coaches, trainers, and former athletes across the region.",
    status: "active",
    currentPhase: "phase_1_one_event",
    growthPath: GROWTH_PATH_TEMPLATE,
    createdBy: "user_lead",
    createdAt: t,
    updatedAt: t,
  };
  db.initiatives.set(initiative.id, initiative);

  const event: Event = {
    id: "event_firstparent",
    initiativeId: initiative.id,
    title: "When the Game Gets Loud: A Parents' Night for Sports Families",
    type: "parent_workshop",
    audience: ["parents"],
    focusAreas: ["pressure", "identity", "parenting"],
    goal:
      "Give sports parents one practical, grace-filled tool for lowering pressure at home and on the sideline — and a warm first experience of our church.",
    date: "2026-06-20T18:30:00.000Z",
    location: "Long Hill Chapel — Gym",
    expectedAttendance: 40,
    status: "content_review",
    sessions: [
      { id: "sess_1", order: 1, kind: "welcome", title: "Welcome & Why We're Here", durationMinutes: 10, description: "Warm welcome, no pressure, set the tone of practical care.", owner: "Marcus Bell" },
      { id: "sess_2", order: 2, kind: "icebreaker", title: "Sideline Stories", durationMinutes: 10, description: "Table groups share a funny or stressful sideline moment.", owner: "Tasha Owens" },
      { id: "sess_3", order: 3, kind: "talk", title: "Identity Bigger Than the Scoreboard", durationMinutes: 20, description: "Short talk: helping kids (and parents) find worth beyond performance.", owner: "Pastor David Reyes" },
      { id: "sess_4", order: 4, kind: "discussion", title: "Table Discussion", durationMinutes: 20, description: "Guided table questions from the discussion guide.", owner: "Table hosts" },
      { id: "sess_5", order: 5, kind: "next_steps", title: "One Small Step Home", durationMinutes: 10, description: "Each parent leaves with one tool + an invite to the follow-up group.", owner: "Marcus Bell" },
    ],
    createdBy: "user_director",
    createdAt: t,
    updatedAt: t,
  };
  db.events.set(event.id, event);

  const talk: ContentItem = {
    id: "content_talk1",
    eventId: event.id,
    initiativeId: initiative.id,
    type: "talk_outline",
    title: "Talk Outline: Identity Bigger Than the Scoreboard",
    body: [
      "# Identity Bigger Than the Scoreboard",
      "",
      "**Audience:** Sports parents · **Length:** ~20 min · **Tone:** Warm, practical, non-preachy",
      "",
      "## Open — the sideline moment (3 min)",
      "- A story every sports parent knows: the car ride home after a tough game.",
      "- Name the pressure honestly. We're not here to add guilt.",
      "",
      "## Core idea (8 min)",
      "- Our kids absorb where they think their worth comes from.",
      "- When worth = performance, every game becomes a verdict on the child.",
      "- A bigger story: worth that is received, not earned (Romans 8:37 — we operate *from* victory, not *for* it).",
      "",
      "## One practical tool (6 min)",
      "- The 5-word car-ride sentence: \"I love watching you play.\" No analysis.",
      "- Why it works: separates love from results.",
      "",
      "## Close & invite (3 min)",
      "- One small step this week.",
      "- Warm invite to the follow-up table group — no pressure.",
    ].join("\n"),
    status: "needs_theology_review",
    requiresTheologyReview: true,
    requiresPastoralReview: true,
    reviewIds: ["review_theo1", "review_past1"],
    generatedByAgent: "content_creation",
    inLibrary: false,
    tags: ["parents", "identity", "pressure"],
    createdAt: t,
    updatedAt: t,
  };
  db.content.set(talk.id, talk);

  const handout: ContentItem = {
    id: "content_handout1",
    eventId: event.id,
    initiativeId: initiative.id,
    type: "handout",
    title: "Handout: The Car-Ride Home",
    body: [
      "# The Car-Ride Home",
      "*One small tool for sports families*",
      "",
      "**Try this:** After the next game, lead with five words — \"I love watching you play.\"",
      "",
      "Then let silence do the work. Save the coaching for another day.",
      "",
      "## Why",
      "Kids hear our first words as the verdict. Leading with delight tells them your love isn't on the scoreboard.",
      "",
      "## This week",
      "- [ ] One car ride with no performance talk",
      "- [ ] Notice what your child brings up on their own",
      "",
      "_You're welcome at our follow-up table group — a relaxed space for sports parents. No pressure, no agenda._",
    ].join("\n"),
    status: "approved",
    requiresTheologyReview: true,
    requiresPastoralReview: false,
    reviewIds: ["review_theo2"],
    generatedByAgent: "content_creation",
    inLibrary: true,
    tags: ["parents", "handout", "pressure"],
    createdAt: t,
    updatedAt: t,
  };
  db.content.set(handout.id, handout);

  const reviews: Review[] = [
    {
      id: "review_theo1",
      contentItemId: talk.id,
      kind: "theology",
      decision: "pending",
      agentNotes:
        "Romans 8:37 reference is used to ground identity, not to promise winning. Confirm framing avoids prosperity-gospel overtones before approval.",
      flags: [
        { area: "Scripture use", severity: "caution", note: "Romans 8:37 invoked around sports victory — verify it points to identity in Christ, not athletic success.", leaderGuidance: "If a parent hears 'God will help us win,' gently reframe to worth beyond outcomes." },
      ],
      createdAt: t,
      updatedAt: t,
    },
    {
      id: "review_past1",
      contentItemId: talk.id,
      kind: "pastoral_safety",
      decision: "pending",
      agentNotes:
        "Topic touches parent-child pressure and potential shame. No diagnosis or therapy language present. Add leader guidance for parents who disclose deeper struggle.",
      flags: [
        { area: "Emotional disclosure", severity: "caution", note: "Parents may surface anxiety or family conflict during discussion.", leaderGuidance: "Listen, do not counsel. Offer to connect them with a pastor; provide the care-referral card." },
      ],
      createdAt: t,
      updatedAt: t,
    },
    {
      id: "review_theo2",
      contentItemId: handout.id,
      kind: "theology",
      decision: "approved",
      reviewerId: "user_reviewer",
      agentNotes: "No direct scripture claims; tone aligns with gospel of grace.",
      flags: [],
      reviewerComment: "Approved — warm and on-message.",
      createdAt: t,
      updatedAt: t,
    },
  ];
  reviews.forEach((r) => db.reviews.set(r.id, r));

  // A starter roadmap (Parent-First Path) so the Roadmap Builder shows content
  // on first load. Fully editable by leaders.
  const template = TEMPLATE_BY_ID["parent_first"];
  const roadmap: Roadmap = {
    id: "roadmap_lhc",
    initiativeId: initiative.id,
    templateName: template.name,
    blocks: template.blockIds.map((bid, i) => {
      const lib = BLOCK_BY_ID[bid];
      return {
        id: `rb_${i + 1}`,
        sourceId: lib.id,
        title: lib.title,
        description: lib.description,
        category: lib.category,
        custom: false,
      };
    }),
    notes: "Drafted from the Parent-First template. Reorder, edit, add, or remove blocks to fit Long Hill Chapel's relationships, leadership capacity, gym availability, and community needs.",
    updatedAt: t,
  };
  db.roadmaps.set(roadmap.id, roadmap);

  // One vetted NY/NJ sports-leader example.
  const speaker: Speaker = {
    id: "speaker_sample",
    initiativeId: initiative.id,
    name: "Coach Mike Donnelly",
    topicAreas: ["team culture", "pressure", "identity"],
    bio: "Former Division I soccer player; now a high school coach in Morris County known for building resilient, low-shame team cultures.",
    organization: "Chatham HS Athletics",
    contactEmail: "",
    status: "prospect",
    role: "High school coach",
    sport: "Soccer",
    relationshipSource: "Introduced by a Long Hill Chapel parent on the team",
    eventFit: "Coach Breakfast, Community Sports Panel",
    faithAlignment: "Believer; comfortable keeping the mission Christ-centered without hype.",
    topicFit: "Team culture, correction without shame, athlete formation",
    availability: "Weekday mornings; off-season preferred",
    vettingNotes: "Member-referred; needs a vetting conversation before confirming.",
    riskConcerns: "Confirm boundaries if athletes/minors attend; no recruiting talk.",
    followUpOwner: "Nina Cruz",
    createdAt: t,
  };
  db.speakers.set(speaker.id, speaker);
}
