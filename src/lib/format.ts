/** Human-readable label helpers shared across screens. */

export function titleCase(s: string): string {
  return s
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatDate(iso?: string): string {
  if (!iso) return "TBD";
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso?: string): string {
  if (!iso) return "TBD";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const STATUS_TONE: Record<string, "gray" | "blue" | "amber" | "green" | "red"> = {
  draft: "gray",
  planning: "blue",
  content_review: "amber",
  needs_theology_review: "amber",
  needs_pastoral_review: "amber",
  changes_requested: "red",
  ready: "green",
  scheduled: "blue",
  completed: "green",
  cancelled: "red",
  approved: "green",
  archived: "gray",
  active: "green",
  paused: "amber",
  pending: "amber",
  rejected: "red",
};
