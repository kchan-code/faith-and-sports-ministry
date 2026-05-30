import Link from "next/link";
import { getEvent, listContentByEvent } from "@/lib/store";
import {
  createContent,
  generateFullContentSet,
} from "@/lib/actions";
import type { ContentType } from "@/lib/types";
import { PageHeader, Card, CardHeader, CardBody, Badge, EmptyState } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { titleCase, STATUS_TONE } from "@/lib/format";

const CONTENT_TYPES: ContentType[] = [
  "talk_outline",
  "handout",
  "discussion_guide",
  "promo_email",
  "social_post",
  "invitation",
  "volunteer_guide",
  "follow_up_email",
  "intake_form",
  "feedback_form",
  "leader_guide",
];

export default async function EventContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = getEvent(id);

  if (!event) {
    return (
      <div className="space-y-6">
        <PageHeader title="Content Workspace" />
        <EmptyState title="Event not found" hint="This event may have been removed." />
      </div>
    );
  }

  const items = listContentByEvent(id);

  return (
    <div className="space-y-6">
      <PageHeader title="Content Workspace" subtitle={event.title} />

      <Card>
        <CardHeader
          title="Generate a full content set"
          subtitle="Talk outline, handout, discussion guide, promo email, volunteer guide, and follow-up email."
        />
        <CardBody>
          <form
            action={async () => {
              "use server";
              await generateFullContentSet(id);
            }}
          >
            <SubmitButton pendingLabel="Generating...">Generate full content set</SubmitButton>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Add a single content item" />
        <CardBody>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {CONTENT_TYPES.map((type) => (
              <form
                key={type}
                action={async () => {
                  "use server";
                  await createContent(id, type);
                }}
              >
                <SubmitButton pendingLabel="Adding..." variant="secondary">
                  {`+ ${titleCase(type)}`}
                </SubmitButton>
              </form>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Content items" subtitle={`${items.length} item(s)`} />
        <CardBody>
          {items.length === 0 ? (
            <EmptyState
              title="No content yet"
              hint="Generate a full set or add individual items above."
            />
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/content/${item.id}`}
                      className="font-medium text-brand-700 hover:underline"
                    >
                      {item.title}
                    </Link>
                    <Badge tone="blue">{titleCase(item.type)}</Badge>
                    <Badge tone={STATUS_TONE[item.status] ?? "gray"}>
                      {titleCase(item.status)}
                    </Badge>
                    {item.requiresTheologyReview && (
                      <Badge tone="amber">Theology review</Badge>
                    )}
                    {item.requiresPastoralReview && (
                      <Badge tone="amber">Pastoral review</Badge>
                    )}
                  </div>
                  {item.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <Badge key={tag} tone="gray">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
