import {
  getEvent,
  listFeedbackByEvent,
  listAgentOutputs,
} from "@/lib/store";
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
import { computeNextSteps } from "@/lib/actions";
import { titleCase, formatDateTime } from "@/lib/format";

type NextStepPayload = {
  headline: string;
  rationale: string;
  recommendedNext: {
    title: string;
    type: string;
    audience: string;
    whyNow: string;
  };
  alternativeOptions: string[];
  suggestedPhase: string;
};

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
        <PageHeader title="Next-Step Recommendations" />
        <EmptyState
          title="Event not found"
          hint="This event may have been removed."
          action={<LinkButton href="/events">Back to events</LinkButton>}
        />
      </div>
    );
  }

  const feedback = listFeedbackByEvent(id);

  const latestOutput = listAgentOutputs()
    .filter((o) => o.agentId === "learning_improvement" && o.eventId === id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

  const payload = latestOutput
    ? (latestOutput.payload as NextStepPayload)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Next-Step Recommendations"
        subtitle={event.title}
        action={
          <LinkButton
            href={`/events/new?initiativeId=${event.initiativeId}`}
            variant="primary"
          >
            Plan the next event
          </LinkButton>
        }
      />

      {feedback.length === 0 ? (
        <EmptyState
          title="No feedback captured yet"
          hint="Add event feedback so we can recommend a thoughtful next step."
          action={
            <LinkButton href={`/events/${id}/feedback`} variant="secondary">
              Add feedback
            </LinkButton>
          }
        />
      ) : null}

      {payload ? (
        <Card className="border-2 border-blue-200 bg-blue-50/40">
          <CardHeader
            title={payload.headline}
            subtitle={
              latestOutput
                ? `Generated ${formatDateTime(latestOutput.createdAt)}`
                : undefined
            }
            action={<Badge tone="brand">{titleCase(payload.suggestedPhase)}</Badge>}
          />
          <CardBody className="space-y-5">
            <p className="text-sm text-gray-700">{payload.rationale}</p>

            <div className="rounded-lg border border-blue-200 bg-white p-4 space-y-3">
              <p className="text-xs font-semibold uppercase text-gray-500">
                Recommended next
              </p>
              <p className="text-base font-semibold text-gray-900">
                {payload.recommendedNext.title}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge tone="blue">
                  {titleCase(payload.recommendedNext.type)}
                </Badge>
                <Badge tone="gray">
                  {titleCase(payload.recommendedNext.audience)}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Why now
                </p>
                <p className="text-sm text-gray-700">
                  {payload.recommendedNext.whyNow}
                </p>
              </div>
            </div>

            {payload.alternativeOptions.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Alternative options
                </p>
                <div className="flex flex-wrap gap-2">
                  {payload.alternativeOptions.map((opt, i) => (
                    <Badge key={i} tone="amber">
                      {opt}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-700">
                Suggested phase:{" "}
                <span className="font-medium">
                  {titleCase(payload.suggestedPhase)}
                </span>
              </span>
            </div>
          </CardBody>
        </Card>
      ) : feedback.length > 0 ? (
        <EmptyState
          title="No recommendation yet"
          hint="Recompute a recommendation from the latest feedback."
        />
      ) : null}

      <Card>
        <CardHeader
          title="Recompute"
          subtitle="Re-run the Learning & Improvement agent on this event's feedback."
        />
        <CardBody>
          <form
            action={async () => {
              "use server";
              await computeNextSteps(id);
            }}
          >
            <SubmitButton pendingLabel="Recomputing...">
              Recompute recommendation
            </SubmitButton>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
