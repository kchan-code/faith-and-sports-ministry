"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSpeaker, createPartner } from "@/lib/actions";
import type {
  SpeakerStatus,
  PartnerType,
  PartnerStatus,
} from "@/lib/types";
import { Card, CardHeader, CardBody, Button, Field, inputClass } from "@/components/ui";

const SPEAKER_STATUSES: SpeakerStatus[] = [
  "prospect",
  "invited",
  "confirmed",
  "declined",
  "completed",
];

const PARTNER_TYPES: PartnerType[] = [
  "school",
  "club",
  "league",
  "nonprofit",
  "business",
  "ministry",
];

const PARTNER_STATUSES: PartnerStatus[] = [
  "prospect",
  "contacted",
  "engaged",
  "declined",
];

export function SpeakerPartnerForms({
  initiatives,
}: {
  initiatives: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const firstInitiative = initiatives[0]?.id ?? "";

  // Speaker form state
  const [sInitiative, setSInitiative] = useState(firstInitiative);
  const [sName, setSName] = useState("");
  const [sOrganization, setSOrganization] = useState("");
  const [sTopicAreas, setSTopicAreas] = useState("");
  const [sBio, setSBio] = useState("");
  const [sContactEmail, setSContactEmail] = useState("");
  const [sStatus, setSStatus] = useState<SpeakerStatus>("prospect");
  const [sVettingNotes, setSVettingNotes] = useState("");

  // Partner form state
  const [pInitiative, setPInitiative] = useState(firstInitiative);
  const [pName, setPName] = useState("");
  const [pType, setPType] = useState<PartnerType>("school");
  const [pContactName, setPContactName] = useState("");
  const [pContactEmail, setPContactEmail] = useState("");
  const [pStatus, setPStatus] = useState<PartnerStatus>("prospect");
  const [pCollaborationIdea, setPCollaborationIdea] = useState("");

  function handleSpeakerSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!sInitiative || !sName.trim()) return;
    const topicAreas = sTopicAreas
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    startTransition(async () => {
      await createSpeaker({
        initiativeId: sInitiative,
        name: sName.trim(),
        topicAreas,
        bio: sBio,
        organization: sOrganization.trim() ? sOrganization.trim() : undefined,
        contactEmail: sContactEmail.trim() ? sContactEmail.trim() : undefined,
        status: sStatus,
        vettingNotes: sVettingNotes.trim() ? sVettingNotes.trim() : undefined,
      });
      setSName("");
      setSOrganization("");
      setSTopicAreas("");
      setSBio("");
      setSContactEmail("");
      setSStatus("prospect");
      setSVettingNotes("");
      router.refresh();
    });
  }

  function handlePartnerSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pInitiative || !pName.trim()) return;
    startTransition(async () => {
      await createPartner({
        initiativeId: pInitiative,
        name: pName.trim(),
        type: pType,
        contactName: pContactName.trim() ? pContactName.trim() : undefined,
        contactEmail: pContactEmail.trim() ? pContactEmail.trim() : undefined,
        status: pStatus,
        collaborationIdea: pCollaborationIdea,
      });
      setPName("");
      setPType("school");
      setPContactName("");
      setPContactEmail("");
      setPStatus("prospect");
      setPCollaborationIdea("");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader title="Add speaker" subtitle="Vet and track speaker prospects" />
        <CardBody>
          <form onSubmit={handleSpeakerSubmit} className="space-y-4">
            <Field label="Initiative">
              <select
                className={inputClass}
                value={sInitiative}
                onChange={(e) => setSInitiative(e.target.value)}
                required
              >
                {initiatives.length === 0 ? (
                  <option value="">No initiatives</option>
                ) : (
                  initiatives.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))
                )}
              </select>
            </Field>
            <Field label="Name">
              <input
                className={inputClass}
                value={sName}
                onChange={(e) => setSName(e.target.value)}
                required
              />
            </Field>
            <Field label="Organization">
              <input
                className={inputClass}
                value={sOrganization}
                onChange={(e) => setSOrganization(e.target.value)}
              />
            </Field>
            <Field label="Topic areas" hint="Comma-separated">
              <input
                className={inputClass}
                value={sTopicAreas}
                onChange={(e) => setSTopicAreas(e.target.value)}
                placeholder="resilience, identity, mental health"
              />
            </Field>
            <Field label="Bio">
              <textarea
                className={inputClass}
                rows={3}
                value={sBio}
                onChange={(e) => setSBio(e.target.value)}
              />
            </Field>
            <Field label="Contact email">
              <input
                type="email"
                className={inputClass}
                value={sContactEmail}
                onChange={(e) => setSContactEmail(e.target.value)}
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                value={sStatus}
                onChange={(e) => setSStatus(e.target.value as SpeakerStatus)}
              >
                {SPEAKER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Vetting notes">
              <textarea
                className={inputClass}
                rows={3}
                value={sVettingNotes}
                onChange={(e) => setSVettingNotes(e.target.value)}
              />
            </Field>
            <Button type="submit" variant="primary">
              {isPending ? "Saving..." : "Add speaker"}
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Add partner" subtitle="Track community collaborations" />
        <CardBody>
          <form onSubmit={handlePartnerSubmit} className="space-y-4">
            <Field label="Initiative">
              <select
                className={inputClass}
                value={pInitiative}
                onChange={(e) => setPInitiative(e.target.value)}
                required
              >
                {initiatives.length === 0 ? (
                  <option value="">No initiatives</option>
                ) : (
                  initiatives.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))
                )}
              </select>
            </Field>
            <Field label="Name">
              <input
                className={inputClass}
                value={pName}
                onChange={(e) => setPName(e.target.value)}
                required
              />
            </Field>
            <Field label="Type">
              <select
                className={inputClass}
                value={pType}
                onChange={(e) => setPType(e.target.value as PartnerType)}
              >
                {PARTNER_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Contact name">
              <input
                className={inputClass}
                value={pContactName}
                onChange={(e) => setPContactName(e.target.value)}
              />
            </Field>
            <Field label="Contact email">
              <input
                type="email"
                className={inputClass}
                value={pContactEmail}
                onChange={(e) => setPContactEmail(e.target.value)}
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                value={pStatus}
                onChange={(e) => setPStatus(e.target.value as PartnerStatus)}
              >
                {PARTNER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Collaboration idea">
              <textarea
                className={inputClass}
                rows={3}
                value={pCollaborationIdea}
                onChange={(e) => setPCollaborationIdea(e.target.value)}
              />
            </Field>
            <Button type="submit" variant="primary">
              {isPending ? "Saving..." : "Add partner"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
