
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClauseCraft — AI Contracts & E‑Sign for SMEs",
  description: "Generate, edit, and e‑sign SME‑friendly documents with an AI copilot.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
      </body>
    </html>
  );
}
