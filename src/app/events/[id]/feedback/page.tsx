import Link from "next/link";
import { getEvent, listFeedbackByEvent } from "@/lib/store";
import {
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  Badge,
  EmptyState,
  LinkButton,
} from "@/components/ui";
import { titleCase, formatDateTime, STATUS_TONE } from "@/lib/format";
import FeedbackForm from "./FeedbackForm";

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
        <PageHeader title="Event Feedback" />
        <EmptyState
          title="Event not found"
          hint="This event may have been removed."
          action={<LinkButton href="/events">Back to events</LinkButton>}
        />
      </div>
    );
  }

  const feedback = listFeedbackByEvent(id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Feedback"
        subtitle={event.title}
        action={
          <LinkButton href={`/events/${id}/next-steps`} variant="secondary">
            View next steps
          </LinkButton>
        }
      />

      <Card>
        <CardHeader
          title="Submitted feedback"
          subtitle={`${feedback.length} ${
            feedback.length === 1 ? "entry" : "entries"
          }`}
        />
        <CardBody className="space-y-4">
          {feedback.length === 0 ? (
            <EmptyState
              title="No feedback yet"
              hint="Capture the first round of feedback below."
            />
          ) : (
            feedback.map((f) => (
              <div
                key={f.id}
                className="rounded-lg border border-gray-200 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">
                    Attendance: {f.attendance}
                  </span>
                  <Badge tone="blue">{f.overallRating} / 5</Badge>
                  <Badge tone={STATUS_TONE[f.followUpInterest] ?? "gray"}>
                    {titleCase(f.followUpInterest)} follow-up interest
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatDateTime(f.createdAt)}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      What worked
                    </p>
                    <p className="text-sm text-gray-700">{f.whatWorked}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      What to improve
                    </p>
                    <p className="text-sm text-gray-700">{f.whatToImprove}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      Audience resonance
                    </p>
                    <p className="text-sm text-gray-700">
                      {f.audienceResonance}
                    </p>
                  </div>
                  {f.notableMoments ? (
                    <div>
                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Notable moments
                      </p>
                      <p className="text-sm text-gray-700">
                        {f.notableMoments}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Add feedback"
          subtitle="Submitting will complete the event and compute next steps."
        />
        <CardBody>
          <FeedbackForm eventId={id} />
        </CardBody>
      </Card>

      <div>
        <Link
          href={`/events/${id}/next-steps`}
          className="text-sm text-blue-600 hover:underline"
        >
          Skip to next-step recommendations
        </Link>
      </div>
    </div>
  );
}
