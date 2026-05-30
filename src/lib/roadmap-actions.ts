"use server";

import { revalidatePath } from "next/cache";
import { getRoadmap, saveRoadmap } from "./roadmap-store";
import { cardFromBlock, blankCard, type Roadmap } from "./roadmap-board";
import type { Agenda } from "./roadmap-agendas";
import type { RoadmapBlockCategory } from "./roadmap-library";

/** Persist and revalidate, returning the updated roadmap so the client can sync. */
async function commit(roadmap: Roadmap): Promise<Roadmap> {
  await saveRoadmap(roadmap);
  revalidatePath("/roadmap");
  return roadmap;
}

export async function addSuggestedCard(blockId: string): Promise<Roadmap> {
  const r = await getRoadmap();
  r.cards.push(cardFromBlock(blockId));
  return commit(r);
}

export async function addBlankCard(): Promise<Roadmap> {
  const r = await getRoadmap();
  r.cards.push(blankCard());
  return commit(r);
}

export async function removeCard(cardId: string): Promise<Roadmap> {
  const r = await getRoadmap();
  r.cards = r.cards.filter((c) => c.id !== cardId);
  return commit(r);
}

export async function moveCard(cardId: string, dir: "up" | "down"): Promise<Roadmap> {
  const r = await getRoadmap();
  const i = r.cards.findIndex((c) => c.id === cardId);
  if (i < 0) return r;
  const j = dir === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= r.cards.length) return r;
  [r.cards[i], r.cards[j]] = [r.cards[j], r.cards[i]];
  return commit(r);
}

export async function updateRoadmapTitle(title: string): Promise<Roadmap> {
  const r = await getRoadmap();
  r.title = title;
  return commit(r);
}

/** Save a card's editable fields — the allow-list: title, category, agenda. */
export async function saveCard(
  cardId: string,
  patch: { title: string; category: RoadmapBlockCategory; agenda: Agenda }
): Promise<Roadmap> {
  const r = await getRoadmap();
  const card = r.cards.find((c) => c.id === cardId);
  if (!card) return r;
  card.title = patch.title;
  card.category = patch.category;
  card.agenda = patch.agenda;
  return commit(r);
}
