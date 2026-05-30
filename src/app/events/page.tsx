import Link from "next/link";
import { listEvents, getInitiative } from "@/lib/store";
import {
  PageHeader,
  LinkButton,
  Card,
  CardHeader,
  CardBody,
  Badge,
  EmptyState,
} from "@/components/ui";
import { titleCase, formatDateTime, STATUS_TONE } from "@/lib/format";

export default async function EventsPage() {
  const events = [...listEvents()].sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : Number.POSITIVE_INFINITY;
    const db = b.date ? new Date(b.date).getTime() : Number.POSITIVE_INFINITY;
    return da - db;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        subtitle="Plan and track ministry events across initiatives."
        action={<LinkButton href="/events/new">New Event</LinkButton>}
      />

      {events.length === 0 ? (
        <EmptyState
          title="No events yet"
          hint="Create your first event to start planning sessions, content, and outreach."
          action={<LinkButton href="/events/new">New Event</LinkButton>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => {
            const initiative = getInitiative(event.initiativeId);
            return (
              <Card key={event.id}>
                <CardHeader
                  title={
                    <Link
                      href={`/events/${event.id}`}
                      className="hover:underline"
                    >
                      {event.title}
                    </Link>
                  }
                  subtitle={initiative?.name}
                  action={
                    <Badge tone={STATUS_TONE[event.status] ?? "gray"}>
                      {titleCase(event.status)}
                    </Badge>
                  }
                />
                <CardBody className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="blue">{titleCase(event.type)}</Badge>
                    {event.audience.map((segment) => (
                      <Badge key={segment} tone="gray">
                        {titleCase(segment)}
                      </Badge>
                    ))}
                  </div>
                  <dl className="grid grid-cols-1 gap-1 text-sm text-gray-600">
                    <div className="flex gap-2">
                      <dt className="font-medium text-gray-700">When:</dt>
                      <dd>{formatDateTime(event.date)}</dd>
                    </div>
                    {event.location ? (
                      <div className="flex gap-2">
                        <dt className="font-medium text-gray-700">Where:</dt>
                        <dd>{event.location}</dd>
                      </div>
                    ) : null}
                    <div className="flex gap-2">
                      <dt className="font-medium text-gray-700">Sessions:</dt>
                      <dd>{event.sessions.length}</dd>
                    </div>
                  </dl>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
