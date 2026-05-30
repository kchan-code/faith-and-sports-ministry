import { listSpeakers, listPartners, listInitiatives } from "@/lib/store";
import { PageHeader, Card, CardHeader, CardBody, Badge, EmptyState } from "@/components/ui";
import { titleCase, STATUS_TONE } from "@/lib/format";
import { SUGGESTED_SPEAKER_TYPES, SPEAKER_VETTING_CRITERIA } from "@/lib/types";
import { SpeakerPartnerForms } from "./SpeakerPartnerForms";

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <p className="text-sm text-gray-700">
      <span className="font-medium text-gray-500">{label}: </span>
      {value}
    </p>
  );
}

export default async function SpeakersPage() {
  const speakers = listSpeakers();
  const partners = listPartners();
  const initiatives = listInitiatives().map((i) => ({ id: i.id, name: i.name }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Speakers & Partners"
        subtitle="Convene trusted NY/NJ sports leaders and community partners — practical wisdom and family health, not hype or performance idolatry."
      />

      {/* Suggested types + vetting filter */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader title="Suggested sports-leader types" subtitle="NY/NJ relationships to draw on" />
          <CardBody>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_SPEAKER_TYPES.map((t) => (
                <Badge key={t} tone="blue">{t}</Badge>
              ))}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Speaker vetting filter" subtitle="Evaluate every prospect against these" />
          <CardBody>
            <ul className="space-y-1 text-sm text-gray-700">
              {SPEAKER_VETTING_CRITERIA.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-brand-500">✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Speakers" subtitle="Prospects and confirmed voices" />
        <CardBody>
          {speakers.length === 0 ? (
            <EmptyState title="No speakers yet" hint="Add a speaker prospect using the form below." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {speakers.map((s) => (
                <div key={s.id} className="rounded-lg border border-gray-200 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{s.name}</h3>
                      <p className="text-sm text-gray-600">
                        {[s.role, s.organization].filter(Boolean).join(" · ") || null}
                      </p>
                    </div>
                    <Badge tone={STATUS_TONE[s.status] ?? "gray"}>{titleCase(s.status)}</Badge>
                  </div>
                  {s.topicAreas.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {s.topicAreas.map((t) => (
                        <Badge key={t} tone="blue">{titleCase(t)}</Badge>
                      ))}
                    </div>
                  ) : null}
                  {s.bio ? <p className="text-sm text-gray-700 whitespace-pre-line">{s.bio}</p> : null}
                  <div className="space-y-1">
                    <Detail label="Sport" value={s.sport} />
                    <Detail label="Relationship source" value={s.relationshipSource} />
                    <Detail label="Event fit" value={s.eventFit} />
                    <Detail label="Topic fit" value={s.topicFit} />
                    <Detail label="Faith alignment" value={s.faithAlignment} />
                    <Detail label="Availability" value={s.availability} />
                    <Detail label="Follow-up owner" value={s.followUpOwner} />
                  </div>
                  {s.vettingNotes ? (
                    <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                      <span className="font-medium">Vetting notes: </span>
                      {s.vettingNotes}
                    </div>
                  ) : null}
                  {s.riskConcerns ? (
                    <div className="rounded-md bg-rose-50 p-3 text-sm text-rose-900">
                      <span className="font-medium">Risk concerns: </span>
                      {s.riskConcerns}
                    </div>
                  ) : null}
                  {s.notes ? <p className="text-sm text-gray-600">{s.notes}</p> : null}
                  {s.contactEmail ? <p className="text-sm text-gray-500">{s.contactEmail}</p> : null}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Partners" subtitle="Community organizations and collaborations" />
        <CardBody>
          {partners.length === 0 ? (
            <EmptyState title="No partners yet" hint="Add a community partner using the form below." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {partners.map((p) => (
                <div key={p.id} className="rounded-lg border border-gray-200 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{p.name}</h3>
                      <Badge tone="brand">{titleCase(p.type)}</Badge>
                    </div>
                    <Badge tone={STATUS_TONE[p.status] ?? "gray"}>{titleCase(p.status)}</Badge>
                  </div>
                  {p.collaborationIdea ? (
                    <p className="text-sm text-gray-700 whitespace-pre-line">{p.collaborationIdea}</p>
                  ) : null}
                  {p.contactName || p.contactEmail ? (
                    <p className="text-sm text-gray-500">
                      {p.contactName ? p.contactName : null}
                      {p.contactName && p.contactEmail ? " · " : null}
                      {p.contactEmail ? p.contactEmail : null}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <SpeakerPartnerForms initiatives={initiatives} />
    </div>
  );
}
