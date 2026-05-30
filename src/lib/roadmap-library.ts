import type { RoadmapBlockCategory } from "./types";

/**
 * Suggested ministry building blocks for Long Hill Chapel. These are OPTIONS,
 * not a required sequence. Leaders pick, reorder, edit, add to, and remove them
 * in the Roadmap Builder.
 */
export interface LibraryBlock {
  id: string;
  title: string;
  description: string;
  category: RoadmapBlockCategory;
}

export const CATEGORY_LABELS: Record<RoadmapBlockCategory, string> = {
  parent_event: "Parent Event",
  athlete_event: "Athlete Event",
  coach_event: "Coach Event",
  family_event: "Family Event",
  gym_based: "Gym-Based",
  sports_leader: "Sports Leader",
  church_leadership: "Church Leadership",
  volunteer_training: "Volunteer Training",
  pastoral_care: "Pastoral Care",
  community_outreach: "Community Outreach",
  follow_up: "Follow-Up",
  custom: "Custom",
};

export const CATEGORY_TONE: Record<RoadmapBlockCategory, "gray" | "blue" | "amber" | "green" | "red" | "brand"> = {
  parent_event: "blue",
  athlete_event: "green",
  coach_event: "amber",
  family_event: "brand",
  gym_based: "brand",
  sports_leader: "blue",
  church_leadership: "gray",
  volunteer_training: "amber",
  pastoral_care: "green",
  community_outreach: "blue",
  follow_up: "gray",
  custom: "gray",
};

export const BLOCK_LIBRARY: LibraryBlock[] = [
  {
    id: "parent_night",
    title: "Parent Night",
    description:
      "A practical evening for sports parents focused on pressure, identity, communication, and how to support athletes without making performance ultimate.",
    category: "parent_event",
  },
  {
    id: "beyond_the_scoreboard",
    title: "Beyond the Scoreboard",
    description:
      "A first meeting that helps parents understand how pressure, mistakes, and identity affect athletes and family life.",
    category: "parent_event",
  },
  {
    id: "the_ride_home",
    title: "The Ride Home",
    description:
      "A focused session on how parents can speak after games in ways that reduce pressure, build trust, and support growth.",
    category: "parent_event",
  },
  {
    id: "parent_night_athlete_track",
    title: "Parent Night with Athlete Activity Track",
    description:
      "A gym-enabled event where parents attend a practical teaching session while athletes participate in a supervised activity, reset, or movement-based workshop.",
    category: "gym_based",
  },
  {
    id: "athlete_reset_workshop",
    title: "Athlete Reset Workshop",
    description:
      "A gym-based or classroom-based workshop that gives athletes practical tools for recovering after mistakes, handling pressure, and competing from secure identity.",
    category: "athlete_event",
  },
  {
    id: "movement_mindset_clinic",
    title: "Movement and Mindset Clinic",
    description:
      "A gym-based clinic combining movement, breathing, reset tools, and short faith-centered reflection to help athletes connect body, mind, and identity.",
    category: "gym_based",
  },
  {
    id: "preseason_family_reset",
    title: "Preseason Sports Family Reset",
    description:
      "A seasonal event helping families set expectations, communication rhythms, spiritual priorities, and healthy sports goals before a season begins.",
    category: "family_event",
  },
  {
    id: "parent_athlete_family_night",
    title: "Parent-Athlete Family Night",
    description:
      "An interactive event where parents and athletes work through communication prompts, reset tools, and shared reflection around pressure, faith, and sports.",
    category: "family_event",
  },
  {
    id: "coach_breakfast",
    title: "Coach Breakfast",
    description:
      "A relationship-building gathering for local coaches focused on team culture, communication, correction without shame, and athlete formation.",
    category: "coach_event",
  },
  {
    id: "coach_culture_roundtable",
    title: "Coach Culture Roundtable",
    description:
      "A smaller discussion with coaches and sports leaders about how to build resilient team cultures without shame, fear, or performance-based identity.",
    category: "coach_event",
  },
  {
    id: "guest_sports_leader_event",
    title: "Guest Sports Leader Event",
    description:
      "An event featuring a trusted NY/NJ sports leader such as a coach, counselor, mental performance expert, former athlete, athletic trainer, or pastor with sports-family experience.",
    category: "sports_leader",
  },
  {
    id: "community_sports_panel",
    title: "Community Sports Panel",
    description:
      "A panel conversation with sports leaders, parents, coaches, counselors, trainers, and church leaders about the pressures facing youth sports families.",
    category: "community_outreach",
  },
  {
    id: "injury_resilience_seminar",
    title: "Injury Resilience Seminar",
    description:
      "A seminar with an athletic trainer, physical therapist, coach, or counselor helping families respond to injury with wisdom, patience, and identity security.",
    category: "sports_leader",
  },
  {
    id: "sports_parent_prayer_night",
    title: "Sports Parent Prayer Night",
    description:
      "A prayer-focused gathering where parents bring the pressures, fears, hopes, and burdens of youth sports before God together.",
    category: "pastoral_care",
  },
  {
    id: "parent_discussion_group",
    title: "Parent Discussion Group",
    description:
      "A short follow-up group where parents process sports pressure, family rhythms, faith, and practical next steps together.",
    category: "follow_up",
  },
  {
    id: "pastoral_care_follow_up",
    title: "Pastoral Care Follow-Up",
    description:
      "A defined pathway for ministry leaders to follow up with families who request prayer, conversation, counseling referrals, or additional support.",
    category: "pastoral_care",
  },
  {
    id: "volunteer_leader_training",
    title: "Volunteer Leader Training",
    description:
      "A preparation session for table leaders, hospitality volunteers, youth leaders, gym volunteers, and pastoral care volunteers who will help run the ministry.",
    category: "volunteer_training",
  },
  {
    id: "gym_volunteer_safety_briefing",
    title: "Gym Volunteer Safety Briefing",
    description:
      "A required preparation step for any event using the gym, covering supervision, boundaries, injury response, check-in/check-out, and child safety procedures.",
    category: "volunteer_training",
  },
  {
    id: "youth_group_integration",
    title: "Youth Group Integration",
    description:
      "A way to connect athlete-facing themes like identity, pressure, discipline, and comparison into existing youth ministry rhythms.",
    category: "church_leadership",
  },
  {
    id: "leadership_briefing",
    title: "Leadership Briefing",
    description:
      "A session for pastors, elders, ministry staff, and volunteers explaining why sports families are a ministry opportunity and how Long Hill Chapel can serve them.",
    category: "church_leadership",
  },
  {
    id: "open_gym_conversation_night",
    title: "Open Gym and Conversation Night",
    description:
      "A low-pressure gym-based gathering that combines supervised sports activity with a short parent or family conversation around pressure, identity, and healthy rhythms.",
    category: "gym_based",
  },
  {
    id: "annual_community_event",
    title: "Annual Community Event",
    description:
      "A larger gathering that brings together parents, athletes, coaches, speakers, and community partners around sports, faith, family, and formation.",
    category: "community_outreach",
  },
  {
    id: "custom_event",
    title: "Custom Event",
    description:
      "Add your own event, meeting, training, or follow-up step based on the needs of Long Hill Chapel and the local community.",
    category: "custom",
  },
];

export const BLOCK_BY_ID: Record<string, LibraryBlock> = Object.fromEntries(
  BLOCK_LIBRARY.map((b) => [b.id, b])
);

/**
 * Starter templates — multiple editable example paths, NOT a single required
 * progression. Selecting one populates the roadmap canvas; the leader then
 * reorders, edits, adds, and removes blocks freely.
 */
export interface RoadmapTemplate {
  id: string;
  name: string;
  summary: string;
  /** Ordered library block ids. */
  blockIds: string[];
}

export const ROADMAP_TEMPLATES: RoadmapTemplate[] = [
  {
    id: "parent_first",
    name: "Parent-First Path",
    summary: "Begin with parents — the easiest first audience and the gateway to serving athletes and families.",
    blockIds: ["leadership_briefing", "beyond_the_scoreboard", "the_ride_home", "parent_discussion_group", "parent_athlete_family_night"],
  },
  {
    id: "gym_enabled_family",
    name: "Gym-Enabled Family Path",
    summary: "Lean into the gym for embodied, family-friendly events from the start.",
    blockIds: ["leadership_briefing", "parent_night_athlete_track", "movement_mindset_clinic", "parent_athlete_family_night", "preseason_family_reset"],
  },
  {
    id: "sports_leader_network",
    name: "Sports Leader Network Path",
    summary: "Convene trusted NY/NJ sports voices to build credibility and reach.",
    blockIds: ["leadership_briefing", "guest_sports_leader_event", "community_sports_panel", "coach_breakfast", "parent_discussion_group"],
  },
  {
    id: "coach_and_culture",
    name: "Coach and Culture Path",
    summary: "Start with coaches and team culture, then serve athletes and the wider community.",
    blockIds: ["leadership_briefing", "coach_breakfast", "coach_culture_roundtable", "athlete_reset_workshop", "community_sports_panel"],
  },
  {
    id: "pastoral_care",
    name: "Pastoral Care Path",
    summary: "Lead with prayer and care, building trust before larger gatherings.",
    blockIds: ["leadership_briefing", "sports_parent_prayer_night", "beyond_the_scoreboard", "parent_discussion_group", "pastoral_care_follow_up"],
  },
];

export const TEMPLATE_BY_ID: Record<string, RoadmapTemplate> = Object.fromEntries(
  ROADMAP_TEMPLATES.map((t) => [t.id, t])
);

/** Long Hill Chapel assets to leverage — shown on the export. */
export const MINISTRY_ASSETS = [
  "Gym availability",
  "Church leadership support",
  "Volunteer team",
  "NY/NJ sports leader relationships",
  "Parent networks",
  "Youth ministry",
  "Pastoral care pathway",
  "Community partners",
];

/** Gym-enabled ministry ideas surfaced on the landing page and dashboard. */
export const GYM_ENABLED_IDEAS = [
  "Parent Night with Athlete Activity Track",
  "Athlete Reset Workshop",
  "Parent-Athlete Family Night",
  "Preseason Sports Family Reset",
  "Coach Culture Breakfast",
  "Movement and Mindset Clinic",
  "Injury Resilience Seminar",
  "Team Leadership Night",
  "Youth Group Sports Night",
  "Volunteer-Led Open Gym and Discussion",
];
