import Link from "next/link";
import { getEvent } from "@/lib/store";
import { buildAgenda, generateFullContentSet } from "@/lib/actions";
import {
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  Badge,
  EmptyState,
  LinkButton,
} from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { titleCase, formatDateTime, STATUS_TONE } from "@/lib/format";
import type { Session } from "@/lib/types";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = getEvent(id);

  if (!event) {
    return (
      <div className="space-y-6">
        <PageHeader title="Event not found" />
        <EmptyState
          title="This event could not be found"
          hint="It may have been removed or the link is incorrect."
          action={<LinkButton href="/events" variant="secondary">Back to events</LinkButton>}
        />
      </div>
    );
  }

  const sessions: Session[] = [...event.sessions].sort((a, b) => a.order - b.order);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  const subNav: { label: string; href: string }[] = [
    { label: "Content", href: `/events/${id}/content` },
    { label: "Outreach", href: `/events/${id}/outreach` },
    { label: "Volunteers", href: `/events/${id}/volunteers` },
    { label: "Follow-up", href: `/events/${id}/follow-up` },
    { label: "Feedback", href: `/events/${id}/feedback` },
    { label: "Next steps", href: `/events/${id}/next-steps` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={event.title}
        subtitle={titleCase(event.type)}
        action={
          <LinkButton href={`/initiatives/${event.initiativeId}`} variant="secondary">
            View initiative
          </LinkButton>
        }
      />

      <Card>
        <CardHeader title="Overview" />
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="blue">{titleCase(event.type)}</Badge>
            <Badge tone={STATUS_TONE[event.status] ?? "gray"}>
              {titleCase(event.status)}
            </Badge>
          </div>

          {event.audience.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Audience
              </p>
              <div className="flex flex-wrap gap-2">
                {event.audience.map((a) => (
                  <Badge key={a} tone="brand">
                    {titleCase(a)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {event.focusAreas.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Focus areas
              </p>
              <div className="flex flex-wrap gap-2">
                {event.focusAreas.map((f) => (
                  <Badge key={f} tone="amber">
                    {titleCase(f)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Goal
            </p>
            <p className="text-sm text-gray-700">{event.goal}</p>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Date
              </dt>
              <dd className="text-sm text-gray-700">{formatDateTime(event.date)}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Location
              </dt>
              <dd className="text-sm text-gray-700">{event.location ?? "—"}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Expected attendance
              </dt>
              <dd className="text-sm text-gray-700">
                {event.expectedAttendance ?? "—"}
              </dd>
            </div>
          </dl>

          <div>
            <Link
              href={`/initiatives/${event.initiativeId}`}
              className="text-sm font-medium text-brand-700 underline-offset-2 hover:underline"
            >
              View parent initiative →
            </Link>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Sections" subtitle="Manage every part of this event" />
        <CardBody>
          <div className="flex flex-wrap gap-2">
            {subNav.map((item) => (
              <LinkButton key={item.href} href={item.href} variant="secondary">
                {item.label}
              </LinkButton>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Run of show"
          subtitle={
            sessions.length > 0 ? `${totalMinutes} minutes total` : undefined
          }
          action={
            <form
              action={async () => {
                "use server";
                await buildAgenda(id);
              }}
            >
              <SubmitButton pendingLabel="Building...">
                Generate agenda (Event Planning Agent)
              </SubmitButton>
            </form>
          }
        />
        <CardBody>
          {sessions.length > 0 ? (
            <ol className="space-y-4">
              {sessions.map((session) => (
                <li
                  key={session.id}
                  className="relative rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                          {session.order}
                        </span>
                        <p className="text-sm font-semibold text-gray-900">
                          {session.title}
                        </p>
                      </div>
                      {session.owner && (
                        <p className="text-xs text-gray-500">
                          Owner: {session.owner}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="blue">{session.durationMinutes} min</Badge>
                      <Badge tone="gray">{titleCase(session.kind)}</Badge>
                    </div>
                  </div>
                  {session.description && (
                    <p className="mt-3 text-sm text-gray-700">
                      {session.description}
                    </p>
                  )}
                  {session.notes && (
                    <p className="mt-2 text-xs italic text-gray-500">
                      {session.notes}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState
              title="No agenda yet"
              hint="Generate a run-of-show with the Event Planning Agent to map out sessions and timing."
            />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Content set"
          subtitle="Generate a full set of materials for this event"
        />
        <CardBody className="space-y-3">
          <p className="text-sm text-gray-600">
            This generates a talk outline, handout, discussion guide, promo email,
            volunteer guide, and follow-up email. All generated content flows to the
            theology and pastoral safety review queues before it can be used.
          </p>
          <form
            action={async () => {
              "use server";
              await generateFullContentSet(id);
            }}
          >
            <SubmitButton pendingLabel="Generating...">
              Generate full content set
            </SubmitButton>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
