import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClauseCraft — AI Contracts & E-Sign for SMEs",
  description:
    "Generate, edit, and e-sign SME-friendly documents with an AI copilot.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Header */}
        <header className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="font-semibold">ClauseCraft</a>
          <nav className="flex items-center gap-6">
            <a href="/dashboard" className="text-white/80 hover:text-white">Dashboard</a>
            <a href="/pricing" className="text-white/80 hover:text-white">Pricing</a>
            {/* For now, Upgrade points to Pricing. We'll wire Stripe next. */}
            <a href="/pricing" className="btn">Upgrade</a>
            import Link from 'next/link';

// …inside the nav
<Link href="/login" className="text-white/80 hover:text-white">Login</Link>

          </nav>
        </header>

        {/* Page content */}
        <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
      </body>
    </html>
  );
}
