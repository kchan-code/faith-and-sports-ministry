/**
 * Starter agendas for every block in BLOCK_LIBRARY, keyed by block id.
 *
 * These are EDITABLE seed content — a first-pass draft so a "suggested" card is
 * useful the moment it's added. Voice: warm, plain, ~7th-grade, no emoji, no
 * hype, no exclamation marks; Christ-centered and non-triumphalist (identity is
 * received, not earned). Faith and sensitive content is a first pass only — a
 * human (and a pastor, for faith/sensitive topics) reviews before use; the UI
 * shows that reminder, so it isn't repeated in every line here.
 */

export interface Agenda {
  /** One sentence: what this gathering is for. */
  goal: string;
  /** The single practical takeaway people leave with. */
  takeaway: string;
  /** The single clear next step people are invited to take. */
  nextStep: string;
  /** 4–7 short run-of-show lines. */
  runOfShow: string[];
}

export function blankAgenda(): Agenda {
  return { goal: "", takeaway: "", nextStep: "", runOfShow: [""] };
}

export const STARTER_AGENDAS: Record<string, Agenda> = {
  parent_night: {
    goal: "Give sports parents one practical way to lower pressure at home and on the sideline.",
    takeaway: "Lead with delight, not analysis — your child hears your first words as the verdict.",
    nextStep: "Try one game where the first thing you say afterward is, I love watching you play.",
    runOfShow: [
      "Welcome and why we're here (10 min)",
      "Table icebreaker: a sideline moment (10 min)",
      "Short talk: identity bigger than the scoreboard (15 min)",
      "Table discussion from the guide (20 min)",
      "One small step and a warm invite to keep going (10 min)",
    ],
  },
  beyond_the_scoreboard: {
    goal: "Help parents see how pressure, mistakes, and identity shape their athlete and their home.",
    takeaway: "A child's worth is settled before the game starts; the scoreboard cannot name who they are.",
    nextStep: "Name one place pressure shows up in your family and one small change to try this week.",
    runOfShow: [
      "Welcome and the honest reality of youth sports (10 min)",
      "Story: the car ride home (5 min)",
      "Talk: worth that is received, not earned (15 min)",
      "Table discussion (20 min)",
      "Close, one small step, and an invite (10 min)",
    ],
  },
  the_ride_home: {
    goal: "Give parents words for after the game that lower pressure and build trust.",
    takeaway: "Five words can change the ride home: I love watching you play.",
    nextStep: "For the next two games, save the coaching for another day and lead with delight.",
    runOfShow: [
      "Welcome (5 min)",
      "Why the first words matter (10 min)",
      "The five-word tool and why it works (10 min)",
      "Practice and table talk (15 min)",
      "Commit to one ride home (10 min)",
    ],
  },
  parent_night_athlete_track: {
    goal: "Serve parents and athletes at once — teaching for parents, a supervised reset session for athletes.",
    takeaway: "Parents and athletes learn the same thing from different rooms: worth is bigger than performance.",
    nextStep: "Pick one phrase to use at home this week that separates love from results.",
    runOfShow: [
      "Welcome together, then split (10 min)",
      "Parents: talk on pressure and identity (20 min)",
      "Athletes in the gym: movement and a reset tool (20 min)",
      "Come back together: one shared takeaway (10 min)",
      "Invite to the next gathering (5 min)",
    ],
  },
  athlete_reset_workshop: {
    goal: "Give athletes practical tools to recover after mistakes and compete from a settled identity.",
    takeaway: "The mistake is real; it is not your identity. Reset and take the next faithful step.",
    nextStep: "Choose your reset cue — a breath, a word, a small action — and use it at your next practice.",
    runOfShow: [
      "Welcome and ground rules (5 min)",
      "The mistake spiral and how to break it (10 min)",
      "A simple reset routine (10 min)",
      "Practice the reset together (15 min)",
      "Close: who you are does not change with the score (10 min)",
    ],
  },
  movement_mindset_clinic: {
    goal: "Connect body, mind, and identity through movement, breathing, and a short reflection.",
    takeaway: "Calm is trainable, and your worth is steady even when the pressure is not.",
    nextStep: "Use the breathing reset once before your next game or big moment.",
    runOfShow: [
      "Warm-up and welcome (10 min)",
      "Movement and breathing basics (15 min)",
      "Reset drill under mild pressure (15 min)",
      "Short reflection: steady identity (10 min)",
      "Cool down and one takeaway (10 min)",
    ],
  },
  preseason_family_reset: {
    goal: "Help families set expectations, rhythms, and priorities before the season begins.",
    takeaway: "Decide what matters before the season decides for you.",
    nextStep: "Agree on one family rhythm to protect this season — a shared meal, a rest day, or worship.",
    runOfShow: [
      "Welcome and the season ahead (10 min)",
      "Naming the pressures before they hit (10 min)",
      "Setting priorities and rhythms (15 min)",
      "Family conversation time (15 min)",
      "Write one commitment down (10 min)",
    ],
  },
  parent_athlete_family_night: {
    goal: "Give parents and athletes shared language about pressure, faith, and sports.",
    takeaway: "We are on the same team; performance does not set the price of belonging.",
    nextStep: "Have one calm conversation this week using a prompt from tonight.",
    runOfShow: [
      "Welcome and a light shared activity (10 min)",
      "Short talk for both (10 min)",
      "Guided parent-athlete prompts (20 min)",
      "Share one thing you heard (10 min)",
      "Close and next step (10 min)",
    ],
  },
  coach_breakfast: {
    goal: "Build relationships with local coaches around team culture and athlete formation.",
    takeaway: "You can correct performance without condemning identity.",
    nextStep: "Pick one practice this week to affirm a player's effort before correcting the play.",
    runOfShow: [
      "Welcome and food (10 min)",
      "Round-table: what is hard right now (15 min)",
      "Short input: culture without shame (15 min)",
      "Practical swaps to try (10 min)",
      "Thanks and an open door to keep talking (10 min)",
    ],
  },
  coach_culture_roundtable: {
    goal: "Help coaches and sports leaders build resilient teams without fear or shame.",
    takeaway: "Culture is set by what you celebrate and how you respond to failure.",
    nextStep: "Name one culture habit to start and one to stop with your team.",
    runOfShow: [
      "Welcome (5 min)",
      "What shapes a team's culture (15 min)",
      "Shame versus formation in correction (15 min)",
      "Case discussion (15 min)",
      "Each leader names one change (10 min)",
    ],
  },
  guest_sports_leader_event: {
    goal: "Host a trusted NY/NJ sports leader to help families keep sports in their right place.",
    takeaway: "Wisdom from someone who has been there: sports are a gift, not the goal.",
    nextStep: "Write down one thing the speaker said that you want to live out this month.",
    runOfShow: [
      "Welcome and introduce the guest (10 min)",
      "Guest talk (20 min)",
      "Moderated questions (15 min)",
      "Audience questions (10 min)",
      "Close and invite to follow up (5 min)",
    ],
  },
  community_sports_panel: {
    goal: "Bring sports leaders, parents, and church leaders together on the pressures families face.",
    takeaway: "We are not alone in this, and the church can be a steady help.",
    nextStep: "Invite one sports family you know to the next gathering.",
    runOfShow: [
      "Welcome and frame the night (10 min)",
      "Panel introductions (10 min)",
      "Moderated questions (25 min)",
      "Audience questions (10 min)",
      "Close and a clear next step (5 min)",
    ],
  },
  injury_resilience_seminar: {
    goal: "Help families respond to injury with wisdom, patience, and steady identity.",
    takeaway: "An injury changes the season, not your worth.",
    nextStep: "If your athlete is hurting, plan one act of care that is not about getting back to play.",
    runOfShow: [
      "Welcome (5 min)",
      "The hidden weight of injury (10 min)",
      "Practical input from a trainer or counselor (15 min)",
      "Honest table conversation (15 min)",
      "Close with hope and a next step (10 min)",
    ],
  },
  sports_parent_prayer_night: {
    goal: "Bring the pressures, fears, and hopes of youth sports to God together.",
    takeaway: "We do not carry this alone; God meets us in the pressure.",
    nextStep: "Keep praying for one specific thing you named tonight.",
    runOfShow: [
      "Welcome and quiet to begin (10 min)",
      "Short reflection (10 min)",
      "Guided prayer in small groups (20 min)",
      "Open prayer (10 min)",
      "Close and how to ask for ongoing prayer (10 min)",
    ],
  },
  parent_discussion_group: {
    goal: "Give parents a relaxed space to process sports pressure, faith, and next steps together.",
    takeaway: "Small, honest conversation is where change actually sticks.",
    nextStep: "Commit to coming back once more and bringing what you tried.",
    runOfShow: [
      "Welcome and check-in (10 min)",
      "One question to open up (10 min)",
      "Group discussion (25 min)",
      "What will you try this week (10 min)",
      "Close (5 min)",
    ],
  },
  pastoral_care_follow_up: {
    goal: "Define how leaders follow up with families who want prayer, conversation, or support.",
    takeaway: "Care continues after the event; people are not a one-time audience.",
    nextStep: "Assign a leader to personally reach out to anyone who asked for follow-up.",
    runOfShow: [
      "Review who asked for follow-up (10 min)",
      "Match each family to a caring leader (10 min)",
      "Agree on first contact within a week (5 min)",
      "When to involve a pastor (10 min)",
      "Pray for the families (10 min)",
    ],
  },
  volunteer_leader_training: {
    goal: "Prepare volunteers to create a warm, no-pressure space and to care well.",
    takeaway: "Your job is presence: greet by name, and listen more than you talk.",
    nextStep: "Each volunteer picks their role and reads the short leader guide.",
    runOfShow: [
      "Welcome and the heart of this (10 min)",
      "Roles and what each one does (15 min)",
      "Listen, do not counsel — when to involve a pastor (15 min)",
      "Walk the room and logistics (10 min)",
      "Pray and send (10 min)",
    ],
  },
  gym_volunteer_safety_briefing: {
    goal: "Make sure every gym event is safe for kids and clear for volunteers.",
    takeaway: "Safety is care: supervision, check-in and check-out, and clear boundaries protect families' trust.",
    nextStep: "Confirm the child-safety checklist and who owns each part before the event.",
    runOfShow: [
      "Why safety is part of care (5 min)",
      "Supervision and adult-to-minor boundaries (10 min)",
      "Check-in and check-out process (10 min)",
      "Injury and emergency response (10 min)",
      "Screening, waivers, and questions (10 min)",
    ],
  },
  youth_group_integration: {
    goal: "Weave athlete themes — identity, pressure, comparison — into existing youth ministry.",
    takeaway: "You do not need a new program; you need a thread through what you already do.",
    nextStep: "Pick one upcoming youth night to focus on identity beyond performance.",
    runOfShow: [
      "Where sports already shows up for your students (10 min)",
      "Themes worth naming (10 min)",
      "One series or night idea (15 min)",
      "Who leads and when (10 min)",
      "Pray for the students (5 min)",
    ],
  },
  leadership_briefing: {
    goal: "Help pastors and leaders see the opportunity and how the church can serve sports families.",
    takeaway: "Youth sports is one of the most active discipleship spaces in our families' weeks.",
    nextStep: "Decide whether to run one first gathering, and who will lead it.",
    runOfShow: [
      "The reality for sports families (10 min)",
      "Why Long Hill Chapel is positioned for this (10 min)",
      "What a first, small event could look like (15 min)",
      "Questions and concerns (10 min)",
      "Decide the next step (10 min)",
    ],
  },
  open_gym_conversation_night: {
    goal: "Combine relaxed gym time with a short, real conversation for families.",
    takeaway: "Low pressure, open doors — belonging can come before believing.",
    nextStep: "Invite one family who would not usually walk into a church.",
    runOfShow: [
      "Open gym and welcome (20 min)",
      "Gather for a short talk (10 min)",
      "One question at tables or as families (15 min)",
      "Back to play or head home (10 min)",
      "Warm invite to the next thing (5 min)",
    ],
  },
  annual_community_event: {
    goal: "Gather parents, athletes, coaches, and partners around sports, faith, and family.",
    takeaway: "A bigger front door — once a year the whole community is welcome.",
    nextStep: "Set a date and recruit one partner to help host.",
    runOfShow: [
      "Welcome and the heart of the day (10 min)",
      "Activity or clinic time (30 min)",
      "Short main message (15 min)",
      "Food and connection (20 min)",
      "A clear invite to keep going (10 min)",
    ],
  },
  custom_event: {
    goal: "Describe what you want this gathering to accomplish, in one sentence.",
    takeaway: "Name the one thing people should leave knowing or able to do.",
    nextStep: "Name the one next step you will invite people to take.",
    runOfShow: ["Welcome", "Main moment", "Conversation or activity", "One takeaway", "One next step and invite"],
  },
};
