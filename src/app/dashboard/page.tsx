import Link from "next/link";
import {
  listInitiatives,
  listEvents,
  listContent,
  listReviews,
  listEventsByInitiative,
  getContent,
} from "@/lib/store";
import { titleCase, formatDateTime, STATUS_TONE } from "@/lib/format";
import {
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  Badge,
  LinkButton,
  EmptyState,
} from "@/components/ui";

function phaseLabel(phase: string): string {
  return titleCase(phase.replace(/^phase_\d+_/, ""));
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardBody>
        <div className="text-3xl font-semibold text-slate-900">{value}</div>
        <div className="mt-1 text-sm text-slate-500">{label}</div>
      </CardBody>
    </Card>
  );
}

function AssetCard({
  title,
  text,
  cta,
  href,
}: {
  title: string;
  text: string;
  cta: string;
  href: string;
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardBody className="flex flex-1 flex-col">
        <h3 className="font-semibold text-ink">{title}</h3>
        <p className="mt-1.5 flex-1 text-sm text-ink-muted">{text}</p>
        <div className="mt-4">
          <LinkButton href={href} variant="secondary">
            {cta}
          </LinkButton>
        </div>
      </CardBody>
    </Card>
  );
}

export default async function DashboardPage() {
  const initiatives = listInitiatives();
  const events = listEvents();
  const content = listContent();
  const pendingReviews = listReviews().filter((r) => r.decision === "pending");

  const upcomingEvents = [...events].sort((a, b) => {
    const da = a.date ?? "";
    const db = b.date ?? "";
    if (da && db) return da.localeCompare(db);
    if (da) return -1;
    if (db) return 1;
    return 0;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Long Hill Chapel — Planning Dashboard"
        subtitle="Plan a sports-family ministry using the church's pastoral trust, its gym, and access to NY/NJ sports leaders. Start with one small meeting, then let it grow."
        action={<LinkButton href="/roadmap">Open Roadmap Builder</LinkButton>}
      />

      {/* Long Hill Chapel unique-asset cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <AssetCard
          title="Use Long Hill Chapel's unique assets"
          text="Build a ministry roadmap that reflects the church's gym, local relationships, pastoral care, and access to NY/NJ sports leaders. Start with a template, customize the boxes, and export a PDF for leadership discussion."
          cta="Open Roadmap Builder"
          href="/roadmap"
        />
        <AssetCard
          title="Gym-enabled ministry ideas"
          text="Use the gym for athlete reset workshops, parent-athlete nights, open gym conversation events, coach gatherings, and movement-and-mindset clinics."
          cta="View Gym-Based Blocks"
          href="/roadmap?category=gym_based"
        />
        <AssetCard
          title="Invite trusted sports leaders"
          text="Use local NY/NJ sports relationships to bring credibility and practical wisdom while keeping the ministry centered on faith, family, and formation."
          cta="View Speaker & Partner Ideas"
          href="/speakers"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Initiatives" value={initiatives.length} />
        <StatCard label="Events" value={events.length} />
        <StatCard label="Content items" value={content.length} />
        <StatCard label="Pending reviews" value={pendingReviews.length} />
      </div>

      <Card>
        <CardHeader title="Your initiatives" />
        <CardBody>
          {initiatives.length === 0 ? (
            <EmptyState
              title="No initiatives yet"
              hint="Begin with one small meeting and grow from there."
              action={<LinkButton href="/initiatives/new">Create your first initiative</LinkButton>}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {initiatives.map((initiative) => {
                const eventCount = listEventsByInitiative(initiative.id).length;
                return (
                  <Link
                    key={initiative.id}
                    href={`/initiatives/${initiative.id}`}
                    className="block rounded-lg border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">{initiative.name}</h3>
                      <Badge tone={STATUS_TONE[initiative.status] ?? "gray"}>
                        {titleCase(initiative.status)}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-slate-500">
                      {phaseLabel(initiative.currentPhase)}
                    </div>
                    {initiative.focusAreas.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {initiative.focusAreas.map((area) => (
                          <Badge key={area} tone="brand">
                            {titleCase(area)}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 text-xs text-slate-400">
                      {eventCount} {eventCount === 1 ? "event" : "events"}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Upcoming & recent events" />
        <CardBody>
          {upcomingEvents.length === 0 ? (
            <EmptyState title="No events yet" hint="Plan a meeting or workshop from within an initiative." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {upcomingEvents.map((event) => (
                <li key={event.id}>
                  <Link
                    href={`/events/${event.id}`}
                    className="flex items-center justify-between gap-3 py-3 transition hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium text-slate-900">{event.title}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <Badge tone="gray">{titleCase(event.type)}</Badge>
                        <Badge tone={STATUS_TONE[event.status] ?? "gray"}>
                          {titleCase(event.status)}
                        </Badge>
                      </div>
                    </div>
                    <div className="shrink-0 text-sm text-slate-500">{formatDateTime(event.date)}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Needs your attention" subtitle="Content awaiting review" />
        <CardBody>
          {pendingReviews.length === 0 ? (
            <EmptyState title="Nothing pending" hint="All reviews are up to date." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {pendingReviews.map((review) => {
                const item = getContent(review.contentItemId);
                const href = review.kind === "theology" ? "/reviews/theology" : "/reviews/pastoral";
                return (
                  <li key={review.id}>
                    <Link
                      href={href}
                      className="flex items-center justify-between gap-3 py-3 transition hover:bg-slate-50"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <Badge tone={review.kind === "theology" ? "blue" : "amber"}>
                          {titleCase(review.kind)}
                        </Badge>
                        <span className="truncate font-medium text-slate-900">
                          {item ? item.title : "Untitled content"}
                        </span>
                      </div>
                      <span className="shrink-0 text-sm text-slate-500">Review</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
