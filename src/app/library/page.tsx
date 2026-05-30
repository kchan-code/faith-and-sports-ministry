import { listResources, getInitiative } from "@/lib/store";
import { titleCase } from "@/lib/format";
import { PageHeader, Card, CardHeader, CardBody, Badge, EmptyState } from "@/components/ui";
import { Markdown } from "@/components/Markdown";

export default async function LibraryPage() {
  const resources = listResources();

  return (
    <div className="space-y-6">
      <PageHeader title="Content Library" subtitle="Approved, reusable materials." />

      {resources.length === 0 ? (
        <EmptyState
          title="No library content yet"
          hint="Approve content and add it to the library to see it here."
        />
      ) : (
        <div className="space-y-4">
          {resources.map((resource) => {
            const initiativeName = getInitiative(resource.initiativeId)?.name;
            return (
              <Card key={resource.id}>
                <CardHeader
                  title={resource.title}
                  subtitle={initiativeName}
                  action={<Badge tone="blue">{titleCase(resource.type)}</Badge>}
                />
                <CardBody className="space-y-3">
                  {resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag) => (
                        <Badge key={tag} tone="gray">
                          {titleCase(tag)}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Markdown source={resource.body} />
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
