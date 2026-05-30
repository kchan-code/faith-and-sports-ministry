import { getEvent, listVolunteerRolesByEvent } from "@/lib/store";
import { buildVolunteerPlan } from "@/lib/actions";
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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = getEvent(id);

  if (!event) {
    return (
      <div className="space-y-6">
        <PageHeader title="Volunteer Plan" />
        <EmptyState
          title="Event not found"
          hint="This event may have been removed."
          action={<LinkButton href="/events">Back to events</LinkButton>}
        />
      </div>
    );
  }

  const roles = listVolunteerRolesByEvent(id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Volunteer Plan"
        subtitle={event.title}
        action={
          <LinkButton href={`/events/${id}`} variant="secondary">
            Back to event
          </LinkButton>
        }
      />

      <Card>
        <CardHeader
          title="Generate volunteer plan"
          subtitle="Draft volunteer roles and leader guides for this event."
        />
        <CardBody>
          <form
            action={async () => {
              "use server";
              await buildVolunteerPlan(id);
            }}
          >
            <SubmitButton pendingLabel="Building...">
              Build volunteer plan
            </SubmitButton>
          </form>
        </CardBody>
      </Card>

      {roles.length === 0 ? (
        <EmptyState
          title="No volunteer roles yet"
          hint="Build a volunteer plan to define roles, counts, and leader guidance."
        />
      ) : (
        <div className="space-y-6">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardHeader
                title={role.title}
                action={<Badge tone="blue">{role.count} needed</Badge>}
              />
              <CardBody className="space-y-4">
                {role.responsibilities.length > 0 && (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                    {role.responsibilities.map((responsibility, index) => (
                      <li key={index}>{responsibility}</li>
                    ))}
                  </ul>
                )}

                {role.leaderGuide && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Leader guide
                    </h3>
                    <Markdown source={role.leaderGuide} />
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
