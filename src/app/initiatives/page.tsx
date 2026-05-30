import Link from "next/link";
import { listInitiatives, listEventsByInitiative } from "@/lib/store";
import {
  PageHeader,
  Card,
  CardBody,
  Badge,
  LinkButton,
  EmptyState,
} from "@/components/ui";
import { titleCase } from "@/lib/format";
import { STATUS_TONE } from "@/lib/format";

export default async function InitiativesPage() {
  const initiatives = listInitiatives();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Initiatives"
        subtitle="Faith & Sports Ministry planning workspaces"
        action={
          <LinkButton href="/initiatives/new" variant="primary">
            New Initiative
          </LinkButton>
        }
      />

      {initiatives.length === 0 ? (
        <EmptyState
          title="No initiatives yet"
          hint="Start by creating an initiative. The system recommends beginning small with a single meeting."
          action={
            <LinkButton href="/initiatives/new" variant="primary">
              Create Initiative
            </LinkButton>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {initiatives.map((initiative) => {
            const eventCount = listEventsByInitiative(initiative.id).length;
            return (
              <Card key={initiative.id}>
                <CardBody className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/initiatives/${initiative.id}`}
                      className="text-lg font-semibold text-slate-900 hover:underline"
                    >
                      {initiative.name}
                    </Link>
                    <Badge tone={STATUS_TONE[initiative.status] ?? "gray"}>
                      {titleCase(initiative.status)}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600">
                    {initiative.visionStatement}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span className="font-medium text-slate-700">Phase:</span>
                    <Badge tone="blue">
                      {titleCase(initiative.currentPhase)}
                    </Badge>
                    <span className="font-medium text-slate-700">Events:</span>
                    <Badge tone="gray">{eventCount}</Badge>
                  </div>

                  {initiative.focusAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {initiative.focusAreas.map((area) => (
                        <Badge key={area} tone="brand">
                          {titleCase(area)}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {initiative.targetAudience.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {initiative.targetAudience.map((aud) => (
                        <Badge key={aud} tone="amber">
                          {titleCase(aud)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
