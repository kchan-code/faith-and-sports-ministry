"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitFeedback } from "@/lib/actions";
import { Field, Button, inputClass } from "@/components/ui";

export default function FeedbackForm({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [attendance, setAttendance] = useState<number>(0);
  const [overallRating, setOverallRating] = useState<number>(5);
  const [whatWorked, setWhatWorked] = useState<string>("");
  const [whatToImprove, setWhatToImprove] = useState<string>("");
  const [audienceResonance, setAudienceResonance] = useState<string>("");
  const [followUpInterest, setFollowUpInterest] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [notableMoments, setNotableMoments] = useState<string>("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      await submitFeedback({
        eventId,
        attendance,
        overallRating,
        whatWorked,
        whatToImprove,
        audienceResonance,
        followUpInterest,
        notableMoments: notableMoments.trim() ? notableMoments : undefined,
      });
      router.push(`/events/${eventId}/next-steps`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Attendance">
          <input
            type="number"
            min={0}
            required
            className={inputClass}
            value={attendance}
            onChange={(e) => setAttendance(Number(e.target.value))}
          />
        </Field>
        <Field label="Overall rating">
          <select
            className={inputClass}
            value={overallRating}
            onChange={(e) => setOverallRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} / 5
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="What worked">
        <textarea
          required
          rows={3}
          className={inputClass}
          value={whatWorked}
          onChange={(e) => setWhatWorked(e.target.value)}
        />
      </Field>

      <Field label="What to improve">
        <textarea
          required
          rows={3}
          className={inputClass}
          value={whatToImprove}
          onChange={(e) => setWhatToImprove(e.target.value)}
        />
      </Field>

      <Field label="Audience resonance">
        <textarea
          required
          rows={3}
          className={inputClass}
          value={audienceResonance}
          onChange={(e) => setAudienceResonance(e.target.value)}
        />
      </Field>

      <Field label="Follow-up interest">
        <select
          className={inputClass}
          value={followUpInterest}
          onChange={(e) =>
            setFollowUpInterest(e.target.value as "low" | "medium" | "high")
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </Field>

      <Field label="Notable moments" hint="Optional">
        <textarea
          rows={3}
          className={inputClass}
          value={notableMoments}
          onChange={(e) => setNotableMoments(e.target.value)}
        />
      </Field>

      <Button type="submit" variant="primary">
        {isPending ? "Submitting..." : "Submit feedback"}
      </Button>
    </form>
  );
}
