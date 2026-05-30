"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateContentBody } from "@/lib/actions";
import { inputClass } from "@/components/ui";

export default function EditContent({
  content,
}: {
  content: { id: string; body: string };
}) {
  const router = useRouter();
  const [body, setBody] = useState(content.body);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateContentBody(content.id, body);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <textarea
        className={inputClass}
        rows={16}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
