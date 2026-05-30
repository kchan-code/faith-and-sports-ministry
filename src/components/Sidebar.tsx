"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Plain, task-based primary menu — the few things a leader does most.
const MAIN: { href: string; label: string }[] = [
  { href: "/dashboard", label: "Home" },
  { href: "/roadmap", label: "Ministry Plan" },
  { href: "/events", label: "Events" },
  { href: "/reviews", label: "Reviews" },
  { href: "/library", label: "Saved Materials" },
];

// Everything else is here, visually lighter, so it's available but not in the way.
const MORE: { href: string; label: string }[] = [
  { href: "/speakers", label: "People" },
  { href: "/export", label: "Print & Export" },
  { href: "/purpose", label: "About this tool" },
  { href: "/agents", label: "Behind the scenes" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white px-3 py-5 lg:block print:!hidden">
      <Link href="/" className="mb-6 block px-2">
        <div className="text-sm font-bold leading-tight text-brand-700">Long Hill Chapel</div>
        <div className="text-xs text-ink-muted">Sports Family Ministry</div>
      </Link>

      <nav className="space-y-1">
        {MAIN.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2.5 text-[15px] transition ${
                active
                  ? "bg-brand-50 font-semibold text-brand-700"
                  : "text-ink hover:bg-slate-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <div className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">More</div>
        <nav className="mt-1 space-y-0.5">
          {MORE.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-brand-50 font-medium text-brand-700"
                    : "text-ink-muted hover:bg-slate-50 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
