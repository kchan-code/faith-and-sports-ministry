import { getEvent, listFollowUpsByEvent } from "@/lib/store";
import { buildFollowUp } from "@/lib/actions";
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
import { titleCase } from "@/lib/format";

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
        <PageHeader title="Follow-Up Planner" />
        <EmptyState
          title="Event not found"
          hint="This event may have been removed."
          action={<LinkButton href="/events">Back to events</LinkButton>}
        />
      </div>
    );
  }

  const followUps = listFollowUpsByEvent(id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Follow-Up Planner"
        subtitle={event.title}
        action={
          <LinkButton href={`/events/${id}`} variant="secondary">
            Back to event
          </LinkButton>
        }
      />

      <Card>
        <CardHeader
          title="Generate follow-up plan"
          subtitle="Draft a sequence of follow-up touchpoints and next-step pathways."
        />
        <CardBody>
          <form
            action={async () => {
              "use server";
              await buildFollowUp(id);
            }}
          >
            <SubmitButton pendingLabel="Building...">
              Build follow-up plan
            </SubmitButton>
          </form>
        </CardBody>
      </Card>

      {followUps.length === 0 ? (
        <EmptyState
          title="No follow-up plans yet"
          hint="Build a follow-up plan to map the steps that keep people connected after this event."
        />
      ) : (
        <div className="space-y-6">
          {followUps.map((plan) => (
            <Card key={plan.id}>
              <CardHeader title="Follow-up plan" />
              <CardBody className="space-y-6">
                {plan.summary && (
                  <p className="text-sm text-gray-700">{plan.summary}</p>
                )}

                {plan.steps.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Steps
                    </h3>
                    <ol className="space-y-4">
                      {[...plan.steps]
                        .sort((a, b) => a.order - b.order)
                        .map((step) => (
                          <li
                            key={step.order}
                            className="border-l-2 border-gray-200 pl-4"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium text-gray-500">
                                {step.order}.
                              </span>
                              <Badge tone="blue">
                                {titleCase(step.channel)}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {step.timing}
                              </span>
                            </div>
                            <h4 className="mt-1 text-sm font-semibold text-gray-900">
                              {step.title}
                            </h4>
                            <p className="mt-1 whitespace-pre-line text-sm text-gray-700">
                              {step.body}
                            </p>
                          </li>
                        ))}
                    </ol>
                  </div>
                )}

                {plan.nextStepPathways.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Next-step pathways
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {plan.nextStepPathways.map((pathway, index) => (
                        <Badge key={index} tone="green">
                          {pathway}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {plan.optionalResources.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Optional resources
                    </h3>
                    <p className="text-xs text-amber-700">
                      Sharing a path toward From Victory is OPTIONAL only — never
                      required as a follow-up step.
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                      {plan.optionalResources.map((resource, index) => (
                        <li key={index}>{resource}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
