"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Badge } from "@/components/ui";
import { CATEGORY_LABELS, CATEGORY_TONE } from "@/lib/roadmap-library";
import type { RoadmapBlockCategory } from "@/lib/roadmap-library";
import type { Roadmap } from "@/lib/roadmap-board";
import {
  addSuggestedCard,
  addBlankCard,
  removeCard,
  moveCard,
  updateRoadmapTitle,
  saveCard,
} from "@/lib/roadmap-actions";

const INPUT =
  "w-full rounded-lg border border-white/[0.1] bg-surface1 px-3 py-2 text-[15px] text-clean placeholder:text-white/[0.3] focus:border-navy-bright focus:outline-none focus:ring-1 focus:ring-navy-bright";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as RoadmapBlockCategory[];

type LibraryItem = { id: string; title: string; category: RoadmapBlockCategory };

export function RoadmapBoard({ initial, library }: { initial: Roadmap; library: LibraryItem[] }) {
  const [roadmap, setRoadmap] = useState<Roadmap>(initial);
  const roadmapRef = useRef(roadmap);
  useEffect(() => {
    roadmapRef.current = roadmap;
  }, [roadmap]);

  const [openId, setOpenId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const stamp = () =>
    setSavedAt(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));

  // Structural change: trust the server's returned doc as the new state.
  const runStructural = (p: Promise<Roadmap>, after?: (r: Roadmap) => void) =>
    startTransition(async () => {
      const r = await p;
      setRoadmap(r);
      roadmapRef.current = r;
      stamp();
      after?.(r);
    });

  // Field edit: we already hold the value locally; just persist it.
  const persist = (p: Promise<Roadmap>) =>
    startTransition(async () => {
      await p;
      stamp();
    });

  const patchCard = (cardId: string, fn: (c: Roadmap["cards"][number]) => Roadmap["cards"][number]) =>
    setRoadmap((r) => ({ ...r, cards: r.cards.map((c) => (c.id === cardId ? fn(c) : c)) }));

  const saveCardNow = (cardId: string) => {
    const c = roadmapRef.current.cards.find((x) => x.id === cardId);
    if (!c) return;
    persist(saveCard(cardId, { title: c.title, category: c.category, agenda: c.agenda }));
  };

  const status = pending ? "Saving…" : savedAt ? `Saved ${savedAt}` : "Changes save automatically";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-navy-ink">
          Long Hill Chapel · Ministry planning
        </div>
        <input
          aria-label="Roadmap title"
          value={roadmap.title}
          onChange={(e) => setRoadmap((r) => ({ ...r, title: e.target.value }))}
          onBlur={() => persist(updateRoadmapTitle(roadmapRef.current.title))}
          className="mt-2 w-full border-0 bg-transparent p-0 font-heading text-2xl font-semibold text-clean focus:outline-none sm:text-3xl"
        />
        <div className="mt-2 flex items-center gap-2 text-[13px] text-white/[0.5]">
          <span className={`inline-block h-2 w-2 rounded-full ${pending ? "bg-amber-400" : "bg-emerald-500"}`} />
          <span>{status}</span>
          <span className="text-white/[0.25]">·</span>
          <span>Shared — anyone with the link edits the same plan</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setPickerOpen((v) => !v)}
          className="rounded-full bg-navy px-4 py-2 text-[14px] font-semibold text-clean transition hover:bg-navy-600"
        >
          {pickerOpen ? "Close list" : "Add a suggested event"}
        </button>
        <button
          onClick={() => runStructural(addBlankCard(), (r) => setOpenId(r.cards[r.cards.length - 1]?.id ?? null))}
          className="rounded-full border border-white/[0.14] px-4 py-2 text-[14px] font-semibold text-clean transition hover:border-white/[0.28]"
        >
          Add a blank card
        </button>
      </div>

      {/* Picker */}
      {pickerOpen && (
        <div className="rounded-[14px] border border-white/[0.08] bg-charcoal p-3">
          <p className="px-1 pb-2 text-[13px] text-white/[0.5]">
            Suggested events arrive with a starter agenda you can edit. Options, not a required order.
          </p>
          <ul className="max-h-80 space-y-1.5 overflow-y-auto">
            {library.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] px-3 py-2">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-[14px] text-clean">{b.title}</span>
                  <Badge tone={CATEGORY_TONE[b.category]}>{CATEGORY_LABELS[b.category]}</Badge>
                </span>
                <button
                  onClick={() => runStructural(addSuggestedCard(b.id), (r) => { setOpenId(r.cards[r.cards.length - 1]?.id ?? null); setPickerOpen(false); })}
                  className="shrink-0 rounded-md bg-navy-bright/[0.15] px-3 py-1 text-[13px] font-medium text-navy-ink hover:bg-navy-bright/[0.25]"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* The ordered path of cards */}
      {roadmap.cards.length === 0 ? (
        <div className="rounded-[14px] border border-white/[0.08] bg-charcoal p-6 text-[15px] text-white/[0.6]">
          No events yet. Add a suggested event or a blank card to start shaping the path.
        </div>
      ) : (
        <ol className="space-y-3">
          {roadmap.cards.map((card, i) => {
            const open = openId === card.id;
            return (
              <li key={card.id} className="rounded-[14px] border border-white/[0.08] bg-charcoal">
                {/* Card face — title + category tag only */}
                <div className="flex items-center gap-3 p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-bright/[0.15] font-mono text-[13px] text-navy-ink">
                    {i + 1}
                  </span>
                  <button
                    onClick={() => setOpenId(open ? null : card.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <span className="truncate font-heading text-[16px] font-semibold text-clean">
                      {card.title || "Untitled event"}
                    </span>
                    <Badge tone={CATEGORY_TONE[card.category]}>{CATEGORY_LABELS[card.category]}</Badge>
                  </button>
                  <div className="flex shrink-0 items-center gap-0.5 text-[13px]">
                    <button onClick={() => runStructural(moveCard(card.id, "up"))} disabled={i === 0} className="rounded px-2 py-1 text-white/[0.5] hover:bg-white/[0.06] disabled:opacity-25">Up</button>
                    <button onClick={() => runStructural(moveCard(card.id, "down"))} disabled={i === roadmap.cards.length - 1} className="rounded px-2 py-1 text-white/[0.5] hover:bg-white/[0.06] disabled:opacity-25">Down</button>
                    <button onClick={() => setOpenId(open ? null : card.id)} className="rounded px-2 py-1 font-medium text-navy-ink hover:bg-white/[0.06]">{open ? "Close" : "Open"}</button>
                  </div>
                </div>

                {/* Agenda editor — behind the expand */}
                {open && (
                  <div className="space-y-4 border-t border-white/[0.08] p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-[12px] font-medium text-white/[0.5]">Event name</span>
                        <input
                          value={card.title}
                          placeholder="e.g. Parents' Night"
                          onChange={(e) => patchCard(card.id, (c) => ({ ...c, title: e.target.value }))}
                          onBlur={() => saveCardNow(card.id)}
                          className={INPUT}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[12px] font-medium text-white/[0.5]">Type</span>
                        <select
                          value={card.category}
                          onChange={(e) => { patchCard(card.id, (c) => ({ ...c, category: e.target.value as RoadmapBlockCategory })); requestAnimationFrame(() => saveCardNow(card.id)); }}
                          className={INPUT}
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <AgendaField label="Goal — one sentence" value={card.agenda.goal}
                      onChange={(v) => patchCard(card.id, (c) => ({ ...c, agenda: { ...c.agenda, goal: v } }))}
                      onBlur={() => saveCardNow(card.id)} />
                    <AgendaField label="One practical takeaway" value={card.agenda.takeaway}
                      onChange={(v) => patchCard(card.id, (c) => ({ ...c, agenda: { ...c.agenda, takeaway: v } }))}
                      onBlur={() => saveCardNow(card.id)} />
                    <AgendaField label="One clear next step" value={card.agenda.nextStep}
                      onChange={(v) => patchCard(card.id, (c) => ({ ...c, agenda: { ...c.agenda, nextStep: v } }))}
                      onBlur={() => saveCardNow(card.id)} />

                    {/* Run of show */}
                    <div>
                      <span className="mb-1 block text-[12px] font-medium text-white/[0.5]">Run of show</span>
                      <div className="space-y-1.5">
                        {card.agenda.runOfShow.map((line, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="font-mono text-[12px] text-white/[0.3]">{idx + 1}</span>
                            <input
                              value={line}
                              placeholder="Short line (e.g. Welcome — 10 min)"
                              onChange={(e) => patchCard(card.id, (c) => ({ ...c, agenda: { ...c.agenda, runOfShow: c.agenda.runOfShow.map((l, k) => (k === idx ? e.target.value : l)) } }))}
                              onBlur={() => saveCardNow(card.id)}
                              className={INPUT}
                            />
                            <button
                              onClick={() => { patchCard(card.id, (c) => ({ ...c, agenda: { ...c.agenda, runOfShow: c.agenda.runOfShow.filter((_, k) => k !== idx) } })); requestAnimationFrame(() => saveCardNow(card.id)); }}
                              className="shrink-0 rounded px-2 py-1 text-[12px] text-white/[0.4] hover:bg-white/[0.06] hover:text-rose-300"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => { patchCard(card.id, (c) => ({ ...c, agenda: { ...c.agenda, runOfShow: [...c.agenda.runOfShow, ""] } })); requestAnimationFrame(() => saveCardNow(card.id)); }}
                        className="mt-2 rounded-md border border-white/[0.12] px-3 py-1 text-[13px] text-white/[0.7] hover:border-white/[0.24]"
                      >
                        Add a line
                      </button>
                    </div>

                    {/* Fixed reminders (derived, non-editable) */}
                    {card.category === "gym_based" && (
                      <p className="rounded-lg border border-amber-400/30 bg-amber-400/[0.08] px-3 py-2 text-[13px] leading-relaxed text-amber-200">
                        Gym event: confirm the child-safety protocol — supervision, check-in and
                        check-out, screening, and waivers — with church leadership before this event.
                        This is guidance, not legal advice.
                      </p>
                    )}
                    <p className="text-[12px] leading-relaxed text-white/[0.4]">
                      This is a starting draft. Have a leader review it — and a pastor for faith or
                      sensitive topics — before it is used.
                    </p>

                    <div className="flex justify-end border-t border-white/[0.06] pt-3">
                      <button
                        onClick={() => { if (confirm("Remove this card from the path?")) runStructural(removeCard(card.id)); }}
                        className="rounded-md px-3 py-1.5 text-[13px] font-medium text-rose-300 hover:bg-rose-500/[0.1]"
                      >
                        Remove card
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function AgendaField({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-medium text-white/[0.5]">{label}</span>
      <textarea
        value={value}
        rows={2}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`${INPUT} resize-y`}
      />
    </label>
  );
}
