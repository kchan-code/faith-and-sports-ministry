import { listInitiatives } from "@/lib/store";
import { PageHeader } from "@/components/ui";
import { CreateEventForm } from "./CreateEventForm";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ initiativeId?: string }>;
}) {
  const { initiativeId } = await searchParams;
  const initiatives = listInitiatives().map((i) => ({
    id: i.id,
    name: i.name,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Event"
        subtitle="Set up a new ministry event and its planning details."
      />
      <CreateEventForm initiatives={initiatives} preselected={initiativeId} />
    </div>
  );
}
