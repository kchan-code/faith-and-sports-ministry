import Link from "next/link";
import { listReviewsByKind, getContent } from "@/lib/store";
import { decideReview } from "@/lib/actions";
import type { Review, ReviewFlag } from "@/lib/types";
import {
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  Badge,
  EmptyState,
} from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { STATUS_TONE, titleCase, formatDateTime } from "@/lib/format";

function severityTone(
  severity: ReviewFlag["severity"],
): "gray" | "blue" | "amber" | "green" | "red" | "brand" {
  if (severity === "high") return "red";
  if (severity === "caution") return "amber";
  return "blue";
}

export default async function TheologyReviewQueuePage() {
  const reviews = listReviewsByKind("theology");
  const sorted = [...reviews].sort((a, b) => {
    const aPending = a.decision === "pending" ? 0 : 1;
    const bPending = b.decision === "pending" ? 0 : 1;
    if (aPending !== bPending) return aPending - bPending;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Theology Review Queue"
        subtitle="First-pass AI notes — a human always decides."
      />

      {sorted.length === 0 ? (
        <EmptyState
          title="No theology reviews in the queue"
          hint="Reviews are queued automatically when content is created."
        />
      ) : (
        <div className="space-y-4">
          {sorted.map((review: Review) => {
            const content = getContent(review.contentItemId);
            const title = content?.title ?? "Untitled content";
            return (
              <Card key={review.id}>
                <CardHeader
                  title={
                    content ? (
                      <Link
                        href={`/content/${content.id}`}
                        className="text-brand-700 hover:underline"
                      >
                        {title}
                      </Link>
                    ) : (
                      title
                    )
                  }
                  subtitle={`Updated ${formatDateTime(review.updatedAt)}`}
                  action={
                    <Badge tone={STATUS_TONE[review.decision] ?? "gray"}>
                      {titleCase(review.decision)}
                    </Badge>
                  }
                />
                <CardBody className="space-y-4">
                  {review.agentNotes ? (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700">
                        Agent notes
                      </h3>
                      <p className="mt-1 whitespace-pre-line text-sm text-gray-600">
                        {review.agentNotes}
                      </p>
                    </div>
                  ) : null}

                  {review.flags.length > 0 ? (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Flags
                      </h3>
                      <ul className="space-y-2">
                        {review.flags.map((flag, i) => (
                          <li
                            key={i}
                            className="rounded-md border border-gray-200 p-3"
                          >
                            <div className="flex items-center gap-2">
                              <Badge tone={severityTone(flag.severity)}>
                                {titleCase(flag.severity)}
                              </Badge>
                              <span className="text-sm font-medium text-gray-800">
                                {flag.area}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              {flag.note}
                            </p>
                            {flag.leaderGuidance ? (
                              <p className="mt-1 text-sm text-gray-500">
                                <span className="font-medium">
                                  Leader guidance:
                                </span>{" "}
                                {flag.leaderGuidance}
                              </p>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <form
                      action={async () => {
                        "use server";
                        await decideReview(review.id, "approved");
                      }}
                    >
                      <SubmitButton variant="primary" pendingLabel="Saving...">
                        Approve
                      </SubmitButton>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await decideReview(review.id, "changes_requested");
                      }}
                    >
                      <SubmitButton variant="secondary" pendingLabel="Saving...">
                        Request changes
                      </SubmitButton>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await decideReview(review.id, "rejected");
                      }}
                    >
                      <SubmitButton variant="danger" pendingLabel="Saving...">
                        Reject
                      </SubmitButton>
                    </form>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
