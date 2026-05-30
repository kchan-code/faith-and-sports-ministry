"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  FOCUS_AREAS,
  AUDIENCE_SEGMENTS,
  type FocusArea,
  type AudienceSegment,
} from "@/lib/types";
import { createInitiative } from "@/lib/actions";
import { Card, CardBody, Field, Button, inputClass } from "@/components/ui";
import { titleCase } from "@/lib/format";

export default function CreateInitiativeForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [visionStatement, setVisionStatement] = useState("");
  const [communityContext, setCommunityContext] = useState("");
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [targetAudience, setTargetAudience] = useState<AudienceSegment[]>([]);

  function toggleFocusArea(area: FocusArea) {
    setFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

  function toggleAudience(aud: AudienceSegment) {
    setTargetAudience((prev) =>
      prev.includes(aud) ? prev.filter((a) => a !== aud) : [...prev, aud]
    );
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const id = await createInitiative({
        name,
        visionStatement,
        communityContext,
        focusAreas,
        targetAudience,
      });
      router.push(`/initiatives/${id}`);
    });
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Name">
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Friday Night Athletes Gathering"
              required
            />
          </Field>

          <Field
            label="Vision Statement"
            hint="What do you hope this initiative accomplishes?"
          >
            <textarea
              className={inputClass}
              value={visionStatement}
              onChange={(e) => setVisionStatement(e.target.value)}
              rows={3}
              required
            />
          </Field>

          <Field
            label="Community Context"
            hint="Describe the community, teams, or families you are serving."
          >
            <textarea
              className={inputClass}
              value={communityContext}
              onChange={(e) => setCommunityContext(e.target.value)}
              rows={3}
              required
            />
          </Field>

          <Field label="Focus Areas">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {FOCUS_AREAS.map((area) => (
                <label
                  key={area}
                  className="flex items-center gap-2 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={focusAreas.includes(area)}
                    onChange={() => toggleFocusArea(area)}
                  />
                  {titleCase(area)}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Target Audience">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {AUDIENCE_SEGMENTS.map((aud) => (
                <label
                  key={aud}
                  className="flex items-center gap-2 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={targetAudience.includes(aud)}
                    onChange={() => toggleAudience(aud)}
                  />
                  {titleCase(aud)}
                </label>
              ))}
            </div>
          </Field>

          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              {isPending ? "Creating..." : "Create Initiative"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
