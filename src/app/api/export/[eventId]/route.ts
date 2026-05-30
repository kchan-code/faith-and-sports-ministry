import { getEvent, getInitiative, listContentByEvent } from "@/lib/store";
import { eventExportMarkdown } from "@/lib/export";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  const event = getEvent(eventId);
  if (!event) {
    return new Response("Not found", { status: 404 });
  }

  const initiative = getInitiative(event.initiativeId);
  if (!initiative) {
    return new Response("Not found", { status: 404 });
  }

  const items = listContentByEvent(eventId);
  const markdown = eventExportMarkdown(initiative, event, items);

  const format = new URL(req.url).searchParams.get("format");

  if (format === "print") {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(event.title)} — Event Packet</title>
<style>
  body { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; margin: 2rem; color: #111827; line-height: 1.5; }
  pre { white-space: pre-wrap; word-wrap: break-word; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.9rem; }
  .toolbar { margin-bottom: 1.5rem; }
  button { font-size: 0.95rem; padding: 0.5rem 1rem; border-radius: 0.375rem; border: 1px solid #d1d5db; background: #ffffff; cursor: pointer; }
  button:hover { background: #f9fafb; }
  @media print { .toolbar { display: none; } body { margin: 0; } }
</style>
</head>
<body>
<div class="toolbar"><button onclick="window.print()">Print</button></div>
<pre>${escapeHtml(markdown)}</pre>
</body>
</html>`;

    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  return new Response(markdown, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-disposition": `attachment; filename="event-${eventId}.md"`,
    },
  });
}
