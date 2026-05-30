import { getContent, getReview } from "@/lib/store";
import { promoteToLibrary } from "@/lib/actions";
import type { Review } from "@/lib/types";
import {
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  Badge,
  EmptyState,
  LinkButton,
} from "@/components/ui";
import { Markdown } from "@/components/Markdown";
import { SubmitButton } from "@/components/SubmitButton";
import { titleCase, STATUS_TONE } from "@/lib/format";
import EditContent from "./EditContent";

const SEVERITY_TONE: Record<string, "blue" | "amber" | "red"> = {
  info: "blue",
  caution: "amber",
  high: "red",
};

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = getContent(id);

  if (!content) {
    return (
      <div className="space-y-6">
        <PageHeader title="Content" />
        <EmptyState title="Content not found" hint="This item may have been removed." />
      </div>
    );
  }

  const reviews: Review[] = content.reviewIds
    .map((rid) => getReview(rid))
    .filter(Boolean) as Review[];

  return (
    <div className="space-y-6">
      <PageHeader
        title={content.title}
        action={
          content.eventId ? (
            <LinkButton href={`/events/${content.eventId}/content`} variant="secondary">
              Back to content workspace
            </LinkButton>
          ) : undefined
        }
      />

      <Card>
        <CardBody>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="blue">{titleCase(content.type)}</Badge>
            <Badge tone={STATUS_TONE[content.status] ?? "gray"}>
              {titleCase(content.status)}
            </Badge>
            {content.inLibrary && <Badge tone="green">In library</Badge>}
            {content.requiresTheologyReview && (
              <Badge tone="amber">Theology review</Badge>
            )}
            {content.requiresPastoralReview && (
              <Badge tone="amber">Pastoral review</Badge>
            )}
          </div>
          {content.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {content.tags.map((tag) => (
                <Badge key={tag} tone="gray">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {!content.inLibrary && content.status === "approved" && (
            <div className="mt-4">
              <form
                action={async () => {
                  "use server";
                  await promoteToLibrary(content.id);
                }}
              >
                <SubmitButton pendingLabel="Adding...">Add to library</SubmitButton>
              </form>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Content body" />
        <CardBody>
          <Markdown source={content.body} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Reviews" subtitle={`${reviews.length} review(s)`} />
        <CardBody>
          {reviews.length === 0 ? (
            <EmptyState title="No reviews yet" hint="Reviews are queued when content is created." />
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="brand">{titleCase(review.kind)}</Badge>
                    <Badge tone={STATUS_TONE[review.decision] ?? "gray"}>
                      {titleCase(review.decision)}
                    </Badge>
                  </div>
                  {review.agentNotes && (
                    <p className="mt-3 text-sm text-gray-700">{review.agentNotes}</p>
                  )}
                  {review.flags.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {review.flags.map((flag, idx) => (
                        <div
                          key={idx}
                          className="rounded-md border border-gray-200 bg-gray-50 p-3"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge tone={SEVERITY_TONE[flag.severity] ?? "gray"}>
                              {titleCase(flag.severity)}
                            </Badge>
                            <span className="text-sm font-medium text-ink">
                              {titleCase(flag.area)}
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm text-gray-700">{flag.note}</p>
                          {flag.leaderGuidance && (
                            <p className="mt-1.5 text-sm text-gray-600">
                              <span className="font-medium">Leader guidance: </span>
                              {flag.leaderGuidance}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {review.reviewerComment && (
                    <p className="mt-3 text-sm text-gray-700">
                      <span className="font-medium">Reviewer comment: </span>
                      {review.reviewerComment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Edit content" />
        <CardBody>
          <EditContent content={{ id: content.id, body: content.body }} />
        </CardBody>
      </Card>
    </div>
  );
}
