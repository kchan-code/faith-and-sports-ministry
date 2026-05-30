import Link from "next/link";
import {
  listInitiatives,
  listEvents,
  listReviews,
  listEventsByInitiative,
} from "@/lib/store";
import { formatDateTime } from "@/lib/format";
import { PageHeader, Card, CardBody, Badge } from "@/components/ui";

// One big, obvious action. The whole card is tappable (good on a phone).
function ActionCard({
  href,
  title,
  text,
  badge,
}: {
  href: string;
  title: string;
  text: string;
  badge?: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="h-full transition hover:border-brand-300 hover:shadow">
        <CardBody className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
            {badge ? <Badge tone="amber">{badge}</Badge> : null}
          </div>
          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted">{text}</p>
          <div className="mt-4 text-sm font-semibold text-brand-700">Go →</div>
        </CardBody>
      </Card>
    </Link>
  );
}

export default async function DashboardPage() {
  const initiative = listInitiatives()[0];
  const pending = listReviews().filter((r) => r.decision === "pending").length;

  const events = initiative ? listEventsByInitiative(initiative.id) : listEvents();
  const upcoming = [...events]
    .filter((e) => e.date)
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""))[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome"
        subtitle="What would you like to do today? Pick one — you can always come back here."
      />

      {/* Start here — the few main things, big and obvious */}
      <div className="grid gap-4 sm:grid-cols-2">
        <ActionCard
          href="/roadmap"
          title="Build your ministry plan"
          text="Lay out the events and steps for serving sports families. Start from an example and make it your own."
        />
        <ActionCard
          href="/events"
          title="Plan an event"
          text="Set up a parents' night, athlete workshop, or coach breakfast — with an agenda, handouts, and follow-up."
        />
        <ActionCard
          href="/reviews"
          title="Review content"
          text="Give faith content and sensitive topics a second look before they go out."
          badge={pending > 0 ? `${pending} waiting` : undefined}
        />
        <ActionCard
          href="/library"
          title="Saved materials"
          text="Reuse talks, handouts, and emails your team has already approved."
        />
      </div>

      {/* Light at-a-glance — not a wall of numbers */}
      {initiative ? (
        <Card>
          <CardBody className="space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Your ministry
              </div>
              <Link
                href={`/initiatives/${initiative.id}`}
                className="mt-0.5 inline-block text-base font-semibold text-ink hover:text-brand-700"
              >
                {initiative.name}
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-100 p-3">
                <div className="text-xs font-medium text-slate-500">Next event</div>
                {upcoming ? (
                  <Link href={`/events/${upcoming.id}`} className="mt-1 block">
                    <div className="font-medium text-ink hover:text-brand-700">{upcoming.title}</div>
                    <div className="mt-0.5 text-sm text-slate-500">{formatDateTime(upcoming.date)}</div>
                  </Link>
                ) : (
                  <div className="mt-1 text-sm text-slate-500">
                    Nothing scheduled yet —{" "}
                    <Link href="/events" className="text-brand-700 hover:underline">plan one</Link>.
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-slate-100 p-3">
                <div className="text-xs font-medium text-slate-500">Waiting on you</div>
                {pending > 0 ? (
                  <Link href="/reviews" className="mt-1 block font-medium text-ink hover:text-brand-700">
                    {pending} item{pending === 1 ? "" : "s"} to review →
                  </Link>
                ) : (
                  <div className="mt-1 text-sm text-emerald-600">Nothing — you&apos;re all caught up.</div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
