import type { ReactNode } from "react";

/**
 * Minimal, dependency-free Markdown renderer for the subset our agents emit
 * (headings, lists, blockquotes, bold, inline code, hr, checkboxes).
 * Good enough for previewing planning content without pulling in a parser.
 */
function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    else nodes.push(<code key={key++}>{token.slice(1, -1)}</code>);
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let key = 0;

  const flush = () => {
    if (!list) return;
    const items = list.items.map((it, i) => <li key={i}>{inline(it)}</li>);
    blocks.push(list.ordered ? <ol key={key++}>{items}</ol> : <ul key={key++}>{items}</ul>);
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flush();
      continue;
    }
    if (/^#{1,3}\s/.test(line)) {
      flush();
      const level = line.match(/^#+/)![0].length;
      const text = line.replace(/^#+\s/, "");
      if (level === 1) blocks.push(<h1 key={key++}>{inline(text)}</h1>);
      else if (level === 2) blocks.push(<h2 key={key++}>{inline(text)}</h2>);
      else blocks.push(<h3 key={key++}>{inline(text)}</h3>);
    } else if (/^>\s?/.test(line)) {
      flush();
      blocks.push(<blockquote key={key++}>{inline(line.replace(/^>\s?/, ""))}</blockquote>);
    } else if (/^---+$/.test(line)) {
      flush();
      blocks.push(<hr key={key++} />);
    } else if (/^\d+\.\s/.test(line)) {
      if (!list || !list.ordered) {
        flush();
        list = { ordered: true, items: [] };
      }
      list.items.push(line.replace(/^\d+\.\s/, ""));
    } else if (/^[-*]\s/.test(line)) {
      if (!list || list.ordered) {
        flush();
        list = { ordered: false, items: [] };
      }
      list.items.push(line.replace(/^[-*]\s(\[[ x]\]\s)?/, (_, cb) => (cb ? (cb.includes("x") ? "☑ " : "☐ ") : "")));
    } else {
      flush();
      blocks.push(<p key={key++}>{inline(line)}</p>);
    }
  }
  flush();

  return <div className="prose-ministry text-sm text-ink">{blocks}</div>;
}
