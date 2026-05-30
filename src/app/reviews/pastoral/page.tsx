import Link from "next/link";
import { listReviewsByKind, getContent } from "@/lib/store";
import { decideReview, addPastoralFlag } from "@/lib/actions";
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

const FLAG_PRESETS: { label: string; flag: Omit<ReviewFlag, never> }[] = [
  {
    label: "Emotional disclosure",
    flag: {
      area: "Emotional disclosure",
      severity: "caution",
      note: "Discussion may surface anxiety or distress.",
      leaderGuidance:
        "Listen, do not counsel; offer to connect them with a pastor.",
    },
  },
  {
    label: "Mental health mention",
    flag: {
      area: "Mental health mention",
      severity: "high",
      note: "Possible mental-health disclosure.",
      leaderGuidance:
        "Do not diagnose. Provide the care-referral card and involve a pastor.",
    },
  },
  {
    label: "Family conflict",
    flag: {
      area: "Family conflict",
      severity: "caution",
      note: "Family tension may surface.",
      leaderGuidance: "Stay neutral and caring; refer to pastoral care.",
    },
  },
];

export default async function PastoralReviewQueuePage() {
  const reviews = listReviewsByKind("pastoral_safety");
  const sorted = [...reviews].sort((a, b) => {
    const aPending = a.decision === "pending" ? 0 : 1;
    const bPending = b.decision === "pending" ? 0 : 1;
    if (aPending !== bPending) return aPending - bPending;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pastoral Safety Review Queue"
        subtitle="Flag sensitive areas and add leader guidance. Never diagnose or counsel."
      />

      {sorted.length === 0 ? (
        <EmptyState
          title="No pastoral safety reviews in the queue"
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
                            className={`rounded-md border-l-4 p-3 ${
                              flag.severity === "high"
                                ? "border-red-400 bg-red-50"
                                : flag.severity === "caution"
                                  ? "border-amber-400 bg-amber-50"
                                  : "border-blue-400 bg-blue-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Badge tone={severityTone(flag.severity)}>
                                {titleCase(flag.severity)}
                              </Badge>
                              <span className="text-sm font-semibold text-gray-800">
                                {flag.area}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-700">
                              {flag.note}
                            </p>
                            {flag.leaderGuidance ? (
                              <p className="mt-2 text-sm text-gray-600">
                                <span className="font-semibold">
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

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Quick flags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {FLAG_PRESETS.map((preset) => (
                        <form
                          key={preset.label}
                          action={async () => {
                            "use server";
                            await addPastoralFlag(review.id, preset.flag);
                          }}
                        >
                          <SubmitButton
                            variant="secondary"
                            pendingLabel="Adding..."
                          >
                            {preset.label}
                          </SubmitButton>
                        </form>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
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
