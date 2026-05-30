import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Faith & Sports Ministry — Planning",
  description:
    "Internal AI-assisted planning tool for church leaders launching a community-facing sports-family initiative.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1">
            <header className="border-b border-slate-200 bg-white px-6 py-3 lg:hidden">
              <span className="text-sm font-bold text-brand-700">Faith &amp; Sports Ministry</span>
            </header>
            <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
