import type { ContentItem, Event, Initiative } from "./types";

/** Builds a clean Markdown document for a single content item. */
export function contentToMarkdown(item: ContentItem): string {
  const meta = [
    `> **Type:** ${item.type.replace(/_/g, " ")}`,
    `> **Status:** ${item.status.replace(/_/g, " ")}`,
    item.tags.length ? `> **Tags:** ${item.tags.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  return `${meta}\n\n${item.body}\n`;
}

/**
 * Bundles every content item for an event into one export-ready Markdown doc.
 * This is the source for both Markdown download and PDF-ready printing.
 */
export function eventExportMarkdown(
  initiative: Initiative,
  event: Event,
  items: ContentItem[]
): string {
  const header = [
    `# ${event.title}`,
    "",
    `*${initiative.name} — exported planning packet*`,
    "",
    `**Goal:** ${event.goal}`,
    `**Audience:** ${event.audience.join(", ")}`,
    event.date ? `**Date:** ${new Date(event.date).toLocaleString()}` : "",
    event.location ? `**Location:** ${event.location}` : "",
    "",
    "## Run of Show",
    "",
    ...event.sessions
      .sort((a, b) => a.order - b.order)
      .map(
        (s) =>
          `${s.order}. **${s.title}** (${s.durationMinutes} min${s.owner ? `, ${s.owner}` : ""}) — ${s.description}`
      ),
    "",
    "---",
    "",
  ].join("\n");

  const body = items
    .map((item) => `## ${item.title}\n\n${contentToMarkdown(item)}\n\n---\n`)
    .join("\n");

  return `${header}\n${body}`.trim() + "\n";
}
