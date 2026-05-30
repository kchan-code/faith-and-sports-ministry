import Link from "next/link";
import { listReviewsByKind } from "@/lib/store";
import { PageHeader, Card, CardBody, Badge } from "@/components/ui";

function pendingCount(kind: "theology" | "pastoral_safety"): number {
  return listReviewsByKind(kind).filter((r) => r.decision === "pending").length;
}

function ReviewCard({
  href,
  title,
  text,
  count,
}: {
  href: string;
  title: string;
  text: string;
  count: number;
}) {
  return (
    <Link href={href} className="block">
      <Card className="h-full transition hover:border-brand-300 hover:shadow">
        <CardBody className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
            {count > 0 ? (
              <Badge tone="amber">{count} waiting</Badge>
            ) : (
              <Badge tone="green">All clear</Badge>
            )}
          </div>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{text}</p>
          <div className="mt-4 text-sm font-medium text-brand-700">Open →</div>
        </CardBody>
      </Card>
    </Link>
  );
}

export default async function ReviewsHubPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        subtitle="A second set of eyes before anything goes out. Pick the kind of review you need to do."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <ReviewCard
          href="/reviews/theology"
          title="Faith content"
          text="Check that anything mentioning faith or Scripture is Christ-centered and handled well. A person always makes the final call."
          count={pendingCount("theology")}
        />
        <ReviewCard
          href="/reviews/pastoral"
          title="Sensitive topics"
          text="Flag anything tender — pressure, mental health, family, or gym safety with kids — and add guidance for the leaders running the event."
          count={pendingCount("pastoral_safety")}
        />
      </div>
    </div>
  );
}
