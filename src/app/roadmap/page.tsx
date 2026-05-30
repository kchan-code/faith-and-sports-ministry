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
        title="Build Your Ministry Plan"
        subtitle="A simple, flexible plan for Long Hill Chapel — pick a starting plan, then add, edit, reorder, or remove steps. There is no single required path, and your work saves automatically."
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
