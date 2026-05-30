import Link from "next/link";
import { listInitiatives, getRoadmapByInitiative } from "@/lib/store";
import { CATEGORY_LABELS, MINISTRY_ASSETS } from "@/lib/roadmap-library";
import { formatDate } from "@/lib/format";
import { PrintButton } from "./PrintButton";

export default async function RoadmapPrintPage() {
  const initiative = listInitiatives()[0];
  const roadmap = initiative ? getRoadmapByInitiative(initiative.id) : undefined;
  const blocks = roadmap?.blocks ?? [];
  const today = formatDate(new Date().toISOString());

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-3 print:hidden">
        <Link href="/roadmap" className="text-sm text-brand-700 hover:underline">
          ← Back to your plan
        </Link>
        <PrintButton />
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-8 print:border-0 print:p-0">
        <header className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-ink">
            Long Hill Chapel Sports Family Ministry Roadmap
          </h1>
          <div className="mt-1 text-sm text-ink-muted">
            Church: Long Hill Chapel, Chatham, NJ · Exported {today}
            {roadmap?.templateName ? ` · Based on the ${roadmap.templateName}` : ""}
          </div>
        </header>

        <section className="mt-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Purpose</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink">
            Long Hill Chapel can become a trusted place where sports families receive practical
            support, biblical hope, and relational care in the real pressures of youth sports — using
            the church&apos;s pastoral trust, its gym, and access to NY/NJ sports leaders. This
            roadmap is a flexible planning tool, not a required program.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Roadmap blocks
          </h2>
          {blocks.length === 0 ? (
            <p className="mt-2 text-sm text-ink-muted">
              No blocks yet. Build the roadmap first, then export.
            </p>
          ) : (
            <ol className="mt-2 space-y-3">
              {blocks.map((b, i) => (
                <li key={b.id} className="rounded-lg border border-slate-200 p-3 print:break-inside-avoid">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-semibold text-ink">
                      {i + 1}. {b.title}
                    </h3>
                    <span className="text-xs font-medium text-slate-500">
                      {CATEGORY_LABELS[b.category]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{b.description}</p>
                  {b.notes ? (
                    <p className="mt-1 text-xs italic text-slate-500">Notes: {b.notes}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Assets to leverage
          </h2>
          <ul className="mt-2 grid grid-cols-2 gap-1 text-sm text-ink">
            {MINISTRY_ASSETS.map((a) => (
              <li key={a}>☐ {a}</li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Notes</h2>
          <p className="mt-1 min-h-[3rem] whitespace-pre-wrap text-sm text-ink">
            {roadmap?.notes || "—"}
          </p>
        </section>

        <footer className="mt-8 border-t border-slate-200 pt-4 text-sm italic text-ink-muted">
          This roadmap is a planning tool. Adjust it as the ministry learns from families, leaders,
          volunteers, and community partners.
        </footer>
      </article>
    </div>
  );
}
