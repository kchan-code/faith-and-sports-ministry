import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Long Hill Chapel — Sports Family Ministry Planning",
  description:
    "Internal planning tool for Long Hill Chapel leaders serving sports families.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1">
            <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3 lg:hidden print:hidden">
              <Link href="/dashboard" className="text-sm font-bold text-brand-700">
                Long Hill Chapel — Sports Family Ministry
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-brand-700">
                Home
              </Link>
            </header>
            <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
