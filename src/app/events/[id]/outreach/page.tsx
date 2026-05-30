import Link from "next/link";
import { getEvent, listOutreachByEvent, getContent } from "@/lib/store";
import { buildOutreach } from "@/lib/actions";
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
import { titleCase, STATUS_TONE } from "@/lib/format";

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
        <PageHeader title="Outreach Materials" />
        <EmptyState
          title="Event not found"
          hint="This event may have been removed."
          action={<LinkButton href="/events">Back to events</LinkButton>}
        />
      </div>
    );
  }

  const campaigns = listOutreachByEvent(id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outreach Materials"
        subtitle={event.title}
        action={
          <LinkButton href={`/events/${id}`} variant="secondary">
            Back to event
          </LinkButton>
        }
      />

      <Card>
        <CardHeader
          title="Generate outreach"
          subtitle="Community Outreach Agent assembles channels and promo assets."
        />
        <CardBody>
          <form
            action={async () => {
              "use server";
              await buildOutreach(id);
            }}
          >
            <SubmitButton pendingLabel="Generating...">
              Generate outreach (Community Outreach Agent)
            </SubmitButton>
          </form>
        </CardBody>
      </Card>

      {campaigns.length === 0 ? (
        <EmptyState
          title="No outreach campaigns yet"
          hint="Generate outreach to draft channels and promotional assets for this event."
        />
      ) : (
        <div className="space-y-6">
          {campaigns.map((campaign) => {
            const assets = campaign.assetIds
              .map((assetId) => getContent(assetId))
              .filter((asset): asset is NonNullable<typeof asset> =>
                Boolean(asset),
              );

            return (
              <Card key={campaign.id}>
                <CardHeader
                  title={campaign.name}
                  action={
                    <Badge tone={STATUS_TONE[campaign.status] ?? "gray"}>
                      {titleCase(campaign.status)}
                    </Badge>
                  }
                />
                <CardBody className="space-y-4">
                  {campaign.channels.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {campaign.channels.map((channel) => (
                        <Badge key={channel} tone="blue">
                          {titleCase(channel)}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {campaign.audienceNote && (
                    <p className="text-sm text-gray-600">
                      {campaign.audienceNote}
                    </p>
                  )}

                  {assets.length > 0 && (
                    <div className="space-y-3">
                      {assets.map((asset) => (
                        <Card key={asset.id}>
                          <CardHeader
                            title={asset.title}
                            subtitle={titleCase(asset.type)}
                          />
                          <CardBody>
                            <Markdown source={asset.body} />
                          </CardBody>
                        </Card>
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
