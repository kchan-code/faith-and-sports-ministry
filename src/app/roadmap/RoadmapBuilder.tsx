"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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

let counter = 0;
function newId(): string {
  counter += 1;
  return `rb_${Date.now().toString(36)}_${counter}`;
}

function blocksFromTemplate(templateId: string): RoadmapBlock[] {
  const t = TEMPLATE_BY_ID[templateId];
  return t.blockIds.map((bid) => {
    const lib = BLOCK_BY_ID[bid];
    return {
      id: newId(),
      sourceId: lib.id,
      title: lib.title,
      description: lib.description,
      category: lib.category,
      custom: false,
    };
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
  const router = useRouter();
  const [blocks, setBlocks] = useState<RoadmapBlock[]>(initialBlocks);
  const [templateName, setTemplateName] = useState<string | undefined>(initialTemplateName);
  const [notes, setNotes] = useState(initialNotes);
  const [filter, setFilter] = useState<string>(initialCategory || "all");
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const mutate = (next: RoadmapBlock[]) => {
    setBlocks(next);
    setDirty(true);
  };

  const applyTemplate = (templateId: string) => {
    const t = TEMPLATE_BY_ID[templateId];
    setTemplateName(t.name);
    mutate(blocksFromTemplate(templateId));
  };

  const addLibraryBlock = (bid: string) => {
    const lib = BLOCK_BY_ID[bid];
    mutate([
      ...blocks,
      { id: newId(), sourceId: lib.id, title: lib.title, description: lib.description, category: lib.category, custom: false },
    ]);
  };

  const addCustomBlock = () => {
    mutate([
      ...blocks,
      { id: newId(), title: "New Custom Block", description: "Describe this event, meeting, training, or follow-up step.", category: "custom", custom: true },
    ]);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    mutate(next);
  };

  const update = (id: string, patch: Partial<RoadmapBlock>) => {
    mutate(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const remove = (id: string) => mutate(blocks.filter((b) => b.id !== id));

  const reset = () => {
    if (!confirm("Reset to the suggested starter roadmap? Your current blocks will be replaced.")) return;
    setTemplateName(TEMPLATE_BY_ID[STARTER_TEMPLATE_ID].name);
    mutate(blocksFromTemplate(STARTER_TEMPLATE_ID));
  };

  const save = (then?: () => void) => {
    startTransition(async () => {
      await persistRoadmap({ initiativeId, templateName, notes, blocks });
      setDirty(false);
      setSavedAt(new Date().toLocaleTimeString());
      router.refresh();
      then?.();
    });
  };

  const exportPdf = () => save(() => window.open("/roadmap/print", "_blank"));

  const filteredLibrary =
    filter === "all" ? BLOCK_LIBRARY : BLOCK_LIBRARY.filter((b) => b.category === filter);
  const categories = Array.from(new Set(BLOCK_LIBRARY.map((b) => b.category)));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Canvas */}
      <div className="space-y-5">
        {/* Templates */}
        <Card>
          <CardBody>
            <h2 className="font-semibold text-ink">Choose a starting template, then customize it</h2>
            <p className="mt-1 text-sm text-ink-muted">
              These are examples, not required paths. Select the one that best fits Long Hill
              Chapel&apos;s relationships, leadership capacity, gym availability, and community needs.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {ROADMAP_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t.id)}
                  className={`rounded-lg border p-3 text-left text-sm transition hover:border-brand-400 hover:bg-brand-50 ${
                    templateName === t.name ? "border-brand-500 bg-brand-50" : "border-slate-200"
                  }`}
                >
                  <div className="font-medium text-ink">{t.name}</div>
                  <div className="mt-0.5 text-xs text-ink-muted">{t.summary}</div>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Header / actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-ink-muted">
            {blocks.length} block{blocks.length === 1 ? "" : "s"}
            {templateName ? <> · based on <span className="font-medium text-ink">{templateName}</span></> : null}
            {dirty ? <span className="ml-2 text-amber-600">● unsaved changes</span> : savedAt ? <span className="ml-2 text-emerald-600">saved {savedAt}</span> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={addCustomBlock}>+ Custom block</Button>
            <Button variant="secondary" onClick={reset}>Reset to starter</Button>
            <Button variant="secondary" onClick={exportPdf}>Export PDF</Button>
            <Button onClick={() => save()} disabled={pending || !dirty}>{pending ? "Saving…" : "Save roadmap"}</Button>
          </div>
        </div>

        {/* Blocks */}
        {blocks.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-sm text-ink-muted">
                Your roadmap is empty. Pick a starter template above, add blocks from the library, or
                add a custom block.
              </p>
            </CardBody>
          </Card>
        ) : (
          <ol className="space-y-3">
            {blocks.map((b, i) => (
              <li key={b.id}>
                <Card>
                  <CardBody className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">{i + 1}</span>
                        <button onClick={() => move(i, -1)} disabled={i === 0} className="text-slate-400 hover:text-brand-600 disabled:opacity-30" aria-label="Move up">▲</button>
                        <button onClick={() => move(i, 1)} disabled={i === blocks.length - 1} className="text-slate-400 hover:text-brand-600 disabled:opacity-30" aria-label="Move down">▼</button>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            value={b.title}
                            onChange={(e) => update(b.id, { title: e.target.value })}
                            className={`${inputClass} flex-1 font-medium`}
                          />
                          <select
                            value={b.category}
                            onChange={(e) => update(b.id, { category: e.target.value as RoadmapBlockCategory })}
                            className={`${inputClass} w-auto`}
                          >
                            {(Object.keys(CATEGORY_LABELS) as RoadmapBlockCategory[]).map((c) => (
                              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                            ))}
                          </select>
                          {b.custom && <Badge tone="gray">Custom</Badge>}
                          <button onClick={() => remove(b.id)} className="ml-auto rounded px-2 py-1 text-xs text-rose-600 hover:bg-rose-50" aria-label="Remove block">Remove</button>
                        </div>
                        <textarea
                          value={b.description}
                          onChange={(e) => update(b.id, { description: e.target.value })}
                          rows={2}
                          className={`${inputClass} resize-y`}
                        />
                        <input
                          value={b.notes ?? ""}
                          onChange={(e) => update(b.id, { notes: e.target.value })}
                          placeholder="Optional leader notes for this block…"
                          className={`${inputClass} text-sm`}
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ol>
        )}

        {/* Notes */}
        <Card>
          <CardBody>
            <label className="mb-1 block text-sm font-medium text-ink">Roadmap notes</label>
            <textarea
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setDirty(true); }}
              rows={3}
              placeholder="Planning notes for leadership discussion…"
              className={`${inputClass} resize-y`}
            />
          </CardBody>
        </Card>
      </div>

      {/* Library sidebar */}
      <div className="space-y-3">
        <Card>
          <CardBody>
            <h2 className="font-semibold text-ink">Suggested building blocks</h2>
            <p className="mt-1 text-xs text-ink-muted">Add any block to your roadmap. Options, not a required order.</p>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${inputClass} mt-3`}>
              <option value="all">All categories</option>
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
                  <button onClick={() => addLibraryBlock(lib.id)} className="mt-2 rounded-md bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100">
                    + Add to roadmap
                  </button>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
