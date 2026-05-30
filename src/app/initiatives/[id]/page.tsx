import Link from "next/link";
import { getInitiative, listEventsByInitiative } from "@/lib/store";
import { regenerateLaunchPlan } from "@/lib/actions";
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
import type { GrowthStep } from "@/lib/types";

export default async function InitiativeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initiative = getInitiative(id);

  if (!initiative) {
    return (
      <div className="space-y-6">
        <PageHeader title="Initiative" />
        <EmptyState
          title="Initiative not found"
          hint="This initiative may have been removed or the link is incorrect."
          action={<LinkButton href="/initiatives" variant="secondary">Back to initiatives</LinkButton>}
        />
      </div>
    );
  }

  const events = listEventsByInitiative(initiative.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={initiative.name}
        subtitle={initiative.visionStatement}
      />

      <Card>
        <CardHeader title="Overview" />
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={STATUS_TONE[initiative.status] ?? "gray"}>
              {titleCase(initiative.status)}
            </Badge>
            <Badge tone="brand">{`Phase: ${titleCase(initiative.currentPhase)}`}</Badge>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700">Community context</h3>
            <p className="mt-1 text-sm text-gray-600">{initiative.communityContext}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Focus areas</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {initiative.focusAreas.length > 0 ? (
                  initiative.focusAreas.map((area) => (
                    <Badge key={area} tone="blue">
                      {titleCase(area)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">None specified</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Target audience</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {initiative.targetAudience.length > 0 ? (
                  initiative.targetAudience.map((seg) => (
                    <Badge key={seg} tone="amber">
                      {titleCase(seg)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">None specified</span>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Recommended launch plan"
          subtitle="Start small. Build momentum one step at a time before scaling up."
          action={
            <form
              action={async () => {
                "use server";
                await regenerateLaunchPlan(initiative.id);
              }}
            >
              <SubmitButton pendingLabel="Regenerating..." variant="secondary">
                Regenerate plan
              </SubmitButton>
            </form>
          }
        />
        <CardBody>
          {initiative.growthPath.length > 0 ? (
            <ol className="space-y-4">
              {initiative.growthPath.map((step: GrowthStep, index: number) => {
                const isCurrent = step.phase === initiative.currentPhase;
                return (
                  <li
                    key={`${step.phase}-${index}`}
                    className={`relative rounded-lg border p-4 ${
                      isCurrent
                        ? "border-brand-500 bg-brand-50 ring-1 ring-brand-200"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                          isCurrent
                            ? "bg-brand-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
                          <Badge tone="gray">{titleCase(step.phase)}</Badge>
                          {isCurrent && <Badge tone="brand">Current</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">{step.summary}</p>
                        {step.suggestedEvents.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Suggested events
                            </span>
                            {step.suggestedEvents.map((evt, i) => (
                              <Badge key={`${evt}-${i}`} tone="blue">
                                {titleCase(evt)}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-700">Ready when:</span>{" "}
                          {step.readyWhen}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <EmptyState
              title="No launch plan yet"
              hint="Regenerate the plan to get a recommended step-by-step path."
            />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Events"
          subtitle="Gatherings planned under this initiative."
          action={
            <LinkButton href={`/events/new?initiativeId=${initiative.id}`} variant="primary">
              {events.length > 0 ? "Create event" : "Create first event"}
            </LinkButton>
          }
        />
        <CardBody>
          {events.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {events.map((event) => (
                <li key={event.id} className="py-3">
                  <Link
                    href={`/events/${event.id}`}
                    className="group flex flex-wrap items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-brand-700">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500">{formatDateTime(event.date)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="gray">{titleCase(event.type)}</Badge>
                      <Badge tone={STATUS_TONE[event.status] ?? "gray"}>
                        {titleCase(event.status)}
                      </Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No events yet"
              hint="Start small with a single gathering to build momentum."
              action={
                <LinkButton href={`/events/new?initiativeId=${initiative.id}`} variant="primary">
                  Create first event
                </LinkButton>
              }
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
