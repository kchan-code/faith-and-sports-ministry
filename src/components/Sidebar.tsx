"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV: { group: string; items: { href: string; label: string }[] }[] = [
  {
    group: "Plan",
    items: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/roadmap", label: "Ministry Plan" },
      { href: "/initiatives", label: "Initiatives" },
      { href: "/events", label: "Events" },
    ],
  },
  {
    group: "Create & Review",
    items: [
      { href: "/reviews/theology", label: "Theology Review" },
      { href: "/reviews/pastoral", label: "Pastoral Safety Review" },
      { href: "/library", label: "Content Library" },
    ],
  },
  {
    group: "Engage",
    items: [
      { href: "/speakers", label: "Speakers & Partners" },
      { href: "/purpose", label: "Purpose" },
      { href: "/agents", label: "Agents" },
      { href: "/export", label: "Export Center" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white px-3 py-5 lg:block print:!hidden">
      <Link href="/" className="mb-6 block px-2">
        <div className="text-sm font-bold leading-tight text-brand-700">Long Hill Chapel</div>
        <div className="text-xs text-ink-muted">Sports Family Ministry</div>
      </Link>
      <nav className="space-y-5">
        {NAV.map((section) => (
          <div key={section.group}>
            <div className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {section.group}
            </div>
            <ul className="mt-1.5 space-y-0.5">
              {section.items.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-lg px-2 py-1.5 text-sm transition ${
                        active
                          ? "bg-brand-50 font-medium text-brand-700"
                          : "text-ink-muted hover:bg-slate-50 hover:text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
