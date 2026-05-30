"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/actions";
import { FOCUS_AREAS, AUDIENCE_SEGMENTS } from "@/lib/types";
import type { EventType, AudienceSegment, FocusArea } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Field,
  inputClass,
} from "@/components/ui";
import { titleCase } from "@/lib/format";

const EVENT_TYPES: EventType[] = [
  "meeting",
  "seminar",
  "speaker_event",
  "parent_workshop",
  "athlete_workshop",
  "coach_breakfast",
  "follow_up_group",
];

export function CreateEventForm({
  initiatives,
  preselected,
}: {
  initiatives: { id: string; name: string }[];
  preselected?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [initiativeId, setInitiativeId] = useState<string>(
    preselected ?? initiatives[0]?.id ?? "",
  );
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("meeting");
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState<AudienceSegment[]>([]);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [expectedAttendance, setExpectedAttendance] = useState("");

  function toggleAudience(segment: AudienceSegment) {
    setAudience((prev) =>
      prev.includes(segment)
        ? prev.filter((s) => s !== segment)
        : [...prev, segment],
    );
  }

  function toggleFocus(area: FocusArea) {
    setFocusAreas((prev) =>
      prev.includes(area)
        ? prev.filter((a) => a !== area)
        : [...prev, area],
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const id = await createEvent({
        initiativeId,
        title,
        type,
        goal,
        audience,
        focusAreas,
        date: date ? new Date(date).toISOString() : undefined,
        location: location || undefined,
        expectedAttendance: expectedAttendance
          ? Number(expectedAttendance)
          : undefined,
      });
      router.push(`/events/${id}`);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader title="Event Details" />
        <CardBody className="space-y-5">
          <Field label="Initiative">
            <select
              className={inputClass}
              value={initiativeId}
              onChange={(e) => setInitiativeId(e.target.value)}
              required
            >
              {initiatives.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Title" hint="Required">
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Parents' Night at the Gym"
              required
            />
          </Field>

          <Field label="Type">
            <select
              className={inputClass}
              value={type}
              onChange={(e) => setType(e.target.value as EventType)}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {titleCase(t)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Goal" hint="Required — what is the one thing people take home?">
            <textarea
              className={inputClass}
              rows={3}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Give parents one simple way to lower pressure on the car ride home."
              required
            />
          </Field>

          <Field label="Who is it for?" hint="Choose all that apply">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {AUDIENCE_SEGMENTS.map((segment) => (
                <label key={segment} className="flex items-center gap-2 text-base text-gray-700">
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={audience.includes(segment)}
                    onChange={() => toggleAudience(segment)}
                  />
                  {titleCase(segment)}
                </label>
              ))}
            </div>
          </Field>

          <Field label="What is it about?" hint="Choose all that apply">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {FOCUS_AREAS.map((area) => (
                <label key={area} className="flex items-center gap-2 text-base text-gray-700">
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={focusAreas.includes(area)}
                    onChange={() => toggleFocus(area)}
                  />
                  {titleCase(area)}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Date & Time" hint="Optional">
            <input
              type="datetime-local"
              className={inputClass}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>

          <Field label="Location" hint="Optional — e.g. Long Hill Chapel gym">
            <input
              className={inputClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Field>

          <Field label="Expected Attendance" hint="Optional">
            <input
              type="number"
              min={0}
              className={inputClass}
              value={expectedAttendance}
              onChange={(e) => setExpectedAttendance(e.target.value)}
            />
          </Field>

          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              {isPending ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  );
}
