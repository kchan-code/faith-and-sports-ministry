import { listEvents, getInitiative, listContentByEvent } from "@/lib/store";
import { PageHeader, Card, CardHeader, CardBody, EmptyState } from "@/components/ui";

export default async function ExportPage() {
  const events = listEvents();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Export Center"
        subtitle="Export event packets as Markdown / PDF-ready."
      />

      {events.length === 0 ? (
        <EmptyState
          title="No events to export"
          hint="Create events and content to build exportable packets."
        />
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const initiativeName = getInitiative(event.initiativeId)?.name;
            const contentCount = listContentByEvent(event.id).length;
            return (
              <Card key={event.id}>
                <CardHeader title={event.title} subtitle={initiativeName} />
                <CardBody className="space-y-3">
                  <p className="text-sm text-gray-600">
                    {contentCount} content {contentCount === 1 ? "item" : "items"}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`/api/export/${event.id}?format=md`}
                      className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                    >
                      Download Markdown
                    </a>
                    <a
                      href={`/api/export/${event.id}?format=print`}
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      PDF-ready view
                    </a>
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
