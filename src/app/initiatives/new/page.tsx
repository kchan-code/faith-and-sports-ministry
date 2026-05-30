import { PageHeader, Card, CardBody } from "@/components/ui";
import CreateInitiativeForm from "./CreateInitiativeForm";

export default async function NewInitiativePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Initiative"
        subtitle="Set the vision and focus for a new Faith & Sports Ministry effort"
      />

      <Card>
        <CardBody>
          <p className="text-sm text-slate-600">
            The system recommends starting small with a single meeting. You can
            grow the initiative phase by phase as momentum builds, so there is no
            need to plan everything up front.
          </p>
        </CardBody>
      </Card>

      <CreateInitiativeForm />
    </div>
  );
}
