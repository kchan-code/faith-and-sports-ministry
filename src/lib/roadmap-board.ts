/**
 * The agenda-first roadmap data model. One shared, ordered roadmap of cards;
 * each card opens to a simple editable agenda. No fields beyond the allow-list:
 * a card is { title, category, agenda } (+ identity/source), and an agenda is
 * { goal, takeaway, nextStep, runOfShow }. Do not add more.
 */
import type { RoadmapBlockCategory } from "./roadmap-library";
import { BLOCK_BY_ID } from "./roadmap-library";
import { STARTER_AGENDAS, blankAgenda, type Agenda } from "./roadmap-agendas";
import { id } from "./id";

export type { Agenda };

export interface Card {
  id: string;
  source: "suggested" | "custom";
  /** Set when source = "suggested". */
  libraryBlockId?: string;
  title: string;
  category: RoadmapBlockCategory;
  agenda: Agenda;
}

export interface Roadmap {
  id: string;
  title: string;
  cards: Card[];
}

function cloneAgenda(a: Agenda): Agenda {
  return { goal: a.goal, takeaway: a.takeaway, nextStep: a.nextStep, runOfShow: [...a.runOfShow] };
}

/** Build a suggested card from a library block, with its starter agenda pre-filled. */
export function cardFromBlock(blockId: string): Card {
  const block = BLOCK_BY_ID[blockId];
  const agenda = STARTER_AGENDAS[blockId] ?? blankAgenda();
  return {
    id: id("card"),
    source: "suggested",
    libraryBlockId: block?.id ?? blockId,
    title: block?.title ?? "Untitled event",
    category: block?.category ?? "custom",
    agenda: cloneAgenda(agenda),
  };
}

/** Build an empty custom card the user titles themselves. */
export function blankCard(): Card {
  return { id: id("card"), source: "custom", title: "", category: "custom", agenda: blankAgenda() };
}

/** The seed roadmap used on first load when nothing is stored yet. */
export function defaultRoadmap(): Roadmap {
  const starters = ["leadership_briefing", "beyond_the_scoreboard", "the_ride_home", "parent_discussion_group"];
  return {
    id: "default",
    title: "Long Hill Chapel — Sports Family Ministry Roadmap",
    cards: starters.map(cardFromBlock),
  };
}
