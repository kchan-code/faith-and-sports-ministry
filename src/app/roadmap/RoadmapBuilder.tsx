"use client";

import { useEffect, useState, useTransition } from "react";
import type { RoadmapBlock, RoadmapBlockCategory } from "@/lib/types";
import {
  BLOCK_LIBRARY,
  ROADMAP_TEMPLATES,
  TEMPLATE_BY_ID,
  BLOCK_BY_ID,
  CATEGORY_LABELS,
  CATEGORY_TONE,
} from "@/lib/roadmap-library";
import { persistRoadmap } from "@/lib/actions";
import { Card, CardBody, Badge, Button, inputClass } from "@/components/ui";

const STARTER_TEMPLATE_ID = "parent_first";
const bigInput = `${inputClass} !text-base`;

let counter = 0;
function newId(): string {
  counter += 1;
  return `rb_${Date.now().toString(36)}_${counter}`;
}

function blocksFromTemplate(templateId: string): RoadmapBlock[] {
  const t = TEMPLATE_BY_ID[templateId];
  return t.blockIds.map((bid) => {
    const lib = BLOCK_BY_ID[bid];
    return { id: newId(), sourceId: lib.id, title: lib.title, description: lib.description, category: lib.category, custom: false };
  });
}

export function RoadmapBuilder({
  initiativeId,
  initialBlocks,
  initialTemplateName,
  initialNotes,
  initialCategory,
}: {
  initiativeId: string;
  initialBlocks: RoadmapBlock[];
  initialTemplateName?: string;
  initialNotes: string;
  initialCategory: string;
}) {
  const [blocks, setBlocks] = useState<RoadmapBlock[]>(initialBlocks);
  const [templateName, setTemplateName] = useState<string | undefined>(initialTemplateName);
  const [notes, setNotes] = useState(initialNotes);
  const [filter, setFilter] = useState<string>(initialCategory || "all");
  const [editing, setEditing] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const mutate = (next: RoadmapBlock[]) => {
    setBlocks(next);
    setDirty(true);
  };

  // Auto-save: persist a short moment after the person stops making changes,
  // so a non-technical volunteer never has to remember to click "Save" and
  // never loses work. We do NOT refresh the page (that would steal focus).
  useEffect(() => {
    if (!dirty) return;
    const handle = setTimeout(() => {
      startTransition(async () => {
        await persistRoadmap({ initiativeId, templateName, notes, blocks });
        setDirty(false);
        setSavedAt(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
      });
    }, 1000);
    return () => clearTimeout(handle);
  }, [blocks, notes, templateName, dirty, initiativeId]);

  // Belt-and-suspenders: warn if they somehow leave before an auto-save lands.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty || pending) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, pending]);

  const saveNow = (then?: () => void) => {
    startTransition(async () => {
      await persistRoadmap({ initiativeId, templateName, notes, blocks });
      setDirty(false);
      setSavedAt(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
      then?.();
    });
  };

  const applyTemplate = (templateId: string) => {
    const t = TEMPLATE_BY_ID[templateId];
    setTemplateName(t.name);
    setEditing(new Set());
    mutate(blocksFromTemplate(templateId));
  };

  const addLibraryBlock = (bid: string) => {
    const lib = BLOCK_BY_ID[bid];
    mutate([...blocks, { id: newId(), sourceId: lib.id, title: lib.title, description: lib.description, category: lib.category, custom: false }]);
  };

  const addCustomBlock = () => {
    const nid = newId();
    mutate([...blocks, { id: nid, title: "", description: "", category: "custom", custom: true }]);
    setEditing((s) => new Set(s).add(nid)); // open the new step for editing right away
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    mutate(next);
  };

  const update = (id: string, patch: Partial<RoadmapBlock>) =>
    mutate(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const remove = (id: string) => {
    if (!confirm("Remove this step from your plan?")) return;
    mutate(blocks.filter((b) => b.id !== id));
  };

  const toggleEdit = (id: string) =>
    setEditing((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const startOver = () => {
    if (!confirm("Start over with the example plan? This replaces your current steps.")) return;
    setTemplateName(TEMPLATE_BY_ID[STARTER_TEMPLATE_ID].name);
    setEditing(new Set());
    mutate(blocksFromTemplate(STARTER_TEMPLATE_ID));
  };

  const printPlan = () => saveNow(() => window.open("/roadmap/print", "_blank"));

  const filteredLibrary = filter === "all" ? BLOCK_LIBRARY : BLOCK_LIBRARY.filter((b) => b.category === filter);
  const categories = Array.from(new Set(BLOCK_LIBRARY.map((b) => b.category)));

  const statusText = pending
    ? "Saving…"
    : dirty
    ? "Saving…"
    : savedAt
    ? `Saved automatically at ${savedAt}`
    : "Your changes save automatically";

  return (
    <div className="space-y-6">
      {/* How this works */}
      <Card className="border-brand-200 bg-brand-50">
        <CardBody>
          <h2 className="text-base font-semibold text-ink">How this works</h2>
          <ol className="mt-2 space-y-1 text-sm text-ink">
            <li><span className="font-semibold">1.</span> Pick a starting plan below — these are just examples.</li>
            <li><span className="font-semibold">2.</span> Add, edit, reorder, or remove the steps to fit Long Hill Chapel.</li>
            <li><span className="font-semibold">3.</span> When it looks right, tap <span className="font-semibold">Print</span> to share it with your team.</li>
          </ol>
          <p className="mt-2 text-xs text-ink-muted">Everything you do saves automatically — you don&apos;t need to click a save button.</p>
        </CardBody>
      </Card>

      {/* Starter plans */}
      <Card>
        <CardBody>
          <h2 className="font-semibold text-ink">Choose a starting plan, then make it yours</h2>
          <p className="mt-1 text-sm text-ink-muted">
            These are examples, not required paths. Pick the one closest to what fits Long Hill
            Chapel&apos;s people, gym, and community — you can change everything afterward.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {ROADMAP_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => applyTemplate(t.id)}
                className={`rounded-lg border p-4 text-left transition hover:border-brand-400 hover:bg-brand-50 ${
                  templateName === t.name ? "border-brand-500 bg-brand-50 ring-1 ring-brand-200" : "border-slate-200"
                }`}
              >
                <div className="font-medium text-ink">{t.name}</div>
                <div className="mt-0.5 text-sm text-ink-muted">{t.summary}</div>
                {templateName === t.name && <div className="mt-2 text-xs font-semibold text-brand-700">✓ Selected</div>}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Status + actions bar */}
      <div className="sticky top-0 z-10 -mx-1 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur">
        <div className="flex items-center gap-2 text-sm">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${pending || dirty ? "bg-amber-400" : "bg-emerald-500"}`} />
          <span className="text-ink-muted">{statusText}</span>
          <span className="text-slate-300">·</span>
          <span className="text-ink-muted">{blocks.length} step{blocks.length === 1 ? "" : "s"}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={addCustomBlock}>+ Add your own step</Button>
          <Button variant="secondary" onClick={startOver}>Start over</Button>
          <Button onClick={printPlan} disabled={pending}>{pending ? "Preparing…" : "Print"}</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Plan (read-first, edit on demand) */}
        <div className="space-y-3">
          {blocks.length === 0 ? (
            <Card>
              <CardBody>
                <p className="text-sm text-ink">
                  Your plan is empty. Pick a starting plan above, or add steps from the
                  <span className="font-semibold"> &ldquo;Steps you can add&rdquo;</span> list
                  {" "}(below on phones, to the right on a computer).
                </p>
              </CardBody>
            </Card>
          ) : (
            <ol className="space-y-3">
              {blocks.map((b, i) => {
                const isEditing = editing.has(b.id);
                return (
                  <li key={b.id}>
                    <Card>
                      <CardBody>
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                            {i + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            {isEditing ? (
                              <div className="space-y-2">
                                <label className="block text-xs font-medium text-ink-muted">Step name</label>
                                <input value={b.title} onChange={(e) => update(b.id, { title: e.target.value })} placeholder="e.g. Parent Night" className={bigInput} />
                                <label className="block text-xs font-medium text-ink-muted">What is it?</label>
                                <textarea value={b.description} onChange={(e) => update(b.id, { description: e.target.value })} rows={3} placeholder="Describe this event, meeting, or step in plain words." className={`${bigInput} resize-y`} />
                                <div className="flex flex-wrap items-center gap-2">
                                  <label className="text-xs font-medium text-ink-muted">Type</label>
                                  <select value={b.category} onChange={(e) => update(b.id, { category: e.target.value as RoadmapBlockCategory })} className={`${inputClass} w-auto !text-base`}>
                                    {(Object.keys(CATEGORY_LABELS) as RoadmapBlockCategory[]).map((c) => (
                                      <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                                    ))}
                                  </select>
                                </div>
                                <input value={b.notes ?? ""} onChange={(e) => update(b.id, { notes: e.target.value })} placeholder="Optional note to your team…" className={bigInput} />
                                <div>
                                  <Button variant="primary" onClick={() => toggleEdit(b.id)}>Done</Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-semibold text-ink">{b.title || "Untitled step"}</h3>
                                  <Badge tone={CATEGORY_TONE[b.category]}>{CATEGORY_LABELS[b.category]}</Badge>
                                </div>
                                {b.description && <p className="mt-1 text-sm leading-relaxed text-ink-muted">{b.description}</p>}
                                {b.notes && <p className="mt-1 text-xs italic text-slate-500">Note: {b.notes}</p>}
                              </>
                            )}

                            {/* Controls */}
                            <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-slate-100 pt-2 text-sm">
                              <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded-md px-2.5 py-1.5 font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30">↑ Move up</button>
                              <button onClick={() => move(i, 1)} disabled={i === blocks.length - 1} className="rounded-md px-2.5 py-1.5 font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30">↓ Move down</button>
                              {!isEditing && (
                                <button onClick={() => toggleEdit(b.id)} className="rounded-md px-2.5 py-1.5 font-medium text-brand-700 hover:bg-brand-50">Edit</button>
                              )}
                              <button onClick={() => remove(b.id)} className="ml-auto rounded-md px-2.5 py-1.5 font-medium text-rose-600 hover:bg-rose-50">Remove</button>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </li>
                );
              })}
            </ol>
          )}

          {/* Notes */}
          <Card>
            <CardBody>
              <label className="mb-1 block text-sm font-medium text-ink">Notes for your team</label>
              <textarea
                value={notes}
                onChange={(e) => { setNotes(e.target.value); setDirty(true); }}
                rows={3}
                placeholder="Anything you want leadership to know when they read this plan…"
                className={`${bigInput} resize-y`}
              />
            </CardBody>
          </Card>
        </div>

        {/* Steps you can add */}
        <div className="space-y-3">
          <Card>
            <CardBody>
              <h2 className="font-semibold text-ink">Steps you can add</h2>
              <p className="mt-1 text-xs text-ink-muted">Tap &ldquo;Add to plan&rdquo; on any idea. These are options, not a required order.</p>
              <label className="mt-3 block text-xs font-medium text-ink-muted">Show</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${inputClass} mt-1 !text-base`}>
                <option value="all">All kinds of steps</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
              <ul className="mt-3 space-y-2">
                {filteredLibrary.map((lib) => (
                  <li key={lib.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-sm text-ink">{lib.title}</div>
                      <Badge tone={CATEGORY_TONE[lib.category]}>{CATEGORY_LABELS[lib.category]}</Badge>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">{lib.description}</p>
                    <button onClick={() => addLibraryBlock(lib.id)} className="mt-2 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700">
                      + Add to plan
                    </button>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
