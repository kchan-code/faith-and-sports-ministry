import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sports Family Ministry — Long Hill Chapel",
  description:
    "A church-led ministry at Long Hill Chapel (Chatham, NJ) serving sports families with wisdom, grace, and practical care.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
