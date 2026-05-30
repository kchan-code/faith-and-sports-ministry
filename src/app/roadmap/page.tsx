import { listInitiatives, getRoadmapByInitiative } from "@/lib/store";
import { PageHeader, EmptyState, LinkButton } from "@/components/ui";
import { RoadmapBuilder } from "./RoadmapBuilder";

export default async function RoadmapPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initiative = listInitiatives()[0];

  if (!initiative) {
    return (
      <div className="space-y-6">
        <PageHeader title="Roadmap Builder" />
        <EmptyState
          title="No initiative yet"
          hint="Create an initiative first, then build its ministry roadmap."
          action={<LinkButton href="/initiatives/new">Create initiative</LinkButton>}
        />
      </div>
    );
  }

  const roadmap = getRoadmapByInitiative(initiative.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ministry Roadmap Builder"
        subtitle="Reorderable, editable building blocks for Long Hill Chapel. Choose a starter template, then customize it — there is no single required path."
        action={
          <LinkButton href="/roadmap/print" variant="secondary">
            Print / Export PDF
          </LinkButton>
        }
      />
      <RoadmapBuilder
        initiativeId={initiative.id}
        initialBlocks={roadmap?.blocks ?? []}
        initialTemplateName={roadmap?.templateName}
        initialNotes={roadmap?.notes ?? ""}
        initialCategory={category ?? "all"}
      />
    </div>
  );
}
