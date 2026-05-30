import type { GrowthStep } from "../types";

/**
 * The default "start small, then expand" growth path the Ministry Strategy Agent
 * recommends. Phases are deliberately ordered so a church launches ONE small,
 * high-impact meeting before scaling into a series, athlete workshops, outside
 * speakers, and finally recurring tracks.
 */
export const GROWTH_PATH_TEMPLATE: GrowthStep[] = [
  {
    phase: "phase_1_one_event",
    title: "Phase 1 — Start with one meeting",
    summary:
      "Launch a single, practical parents' night for sports families. Keep it small and warm. The win is trust and one useful takeaway, not attendance numbers.",
    suggestedEvents: ["Parents' workshop on sideline pressure", "Coach breakfast (informal)"],
    readyWhen: "You've hosted one event and collected feedback from leaders.",
  },
  {
    phase: "phase_2_series",
    title: "Phase 2 — Expand into a short series",
    summary:
      "Turn the strongest theme into a 3-part series for the same audience. Consistency builds relationships and lets families come back.",
    suggestedEvents: [
      "Series: Raising grounded athletes (3 parent nights)",
      "Seminar: Identity, pressure, and character",
    ],
    readyWhen: "Your first event drew repeat interest and you have volunteers who can carry a series.",
  },
  {
    phase: "phase_3_athlete_workshop",
    title: "Phase 3 — Add an athlete workshop",
    summary:
      "Serve the athletes directly with a practical, character-focused workshop such as \"Reset: How to Move Forward After Mistakes.\"",
    suggestedEvents: [
      "Athlete workshop: Reset — How to Move Forward After Mistakes",
      "Athlete workshop: Handling pressure and identity",
    ],
    readyWhen: "Parents trust you enough to send their athletes, and you have trained, screened leaders.",
  },
  {
    phase: "phase_4_speakers_partners",
    title: "Phase 4 — Invite external speakers and partners",
    summary:
      "Bring in vetted guest speakers (coaches, athletes, counselors) and partner with local schools, clubs, and leagues to widen reach.",
    suggestedEvents: [
      "Speaker event with a local coach or pro athlete",
      "Partner night co-hosted with a club or league",
    ],
    readyWhen: "You have a repeatable event format and capacity to host larger gatherings well.",
  },
  {
    phase: "phase_5_recurring_tracks",
    title: "Phase 5 — Build recurring tracks",
    summary:
      "Establish ongoing parent, athlete, coach, and whole-family tracks with follow-up groups — an enduring sports-family ministry.",
    suggestedEvents: [
      "Recurring parent track",
      "Recurring athlete track",
      "Coach breakfast series",
      "Family follow-up groups",
    ],
    readyWhen: "Demand is steady across audiences and you have a volunteer team that can sustain rhythm.",
  },
];
