import { listAgentOutputs } from "@/lib/store";
import { titleCase, formatDateTime } from "@/lib/format";
import { AGENT_LIST } from "@/lib/agents/registry";
import { PageHeader, Card, CardHeader, CardBody, Badge, EmptyState } from "@/components/ui";

export default async function AgentsPage() {
  const outputs = [...listAgentOutputs()]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 20);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agents"
        subtitle="12 specialized agents that help leaders plan, create, review, and follow up."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {AGENT_LIST.map((agent) => (
          <Card key={agent.id}>
            <CardHeader
              title={agent.name}
              action={<Badge tone="brand">{titleCase(agent.role)}</Badge>}
            />
            <CardBody>
              <p className="text-sm text-gray-600">{agent.blurb}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Recent agent activity" />
        <CardBody>
          {outputs.length === 0 ? (
            <EmptyState
              title="No agent activity yet"
              hint="Run agents from events and initiatives to see their output here."
            />
          ) : (
            <div className="space-y-4">
              {outputs.map((output) => (
                <div
                  key={output.id}
                  className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {titleCase(output.agentId)}
                    </span>
                    {output.offline ? (
                      <Badge tone="amber">offline draft</Badge>
                    ) : (
                      <Badge tone="green">live</Badge>
                    )}
                    <span className="text-xs text-gray-400">{output.model}</span>
                    <span className="ml-auto text-xs text-gray-400">
                      {formatDateTime(output.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{output.summary}</p>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
