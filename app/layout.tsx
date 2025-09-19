// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://legal-saas-starter.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ClauseCraft — AI Contracts & E-Sign for SMEs",
    template: "%s · ClauseCraft",
  },
  description:
    "Generate, edit, and e-sign SME-friendly documents with an AI copilot. Start free, upgrade for advanced features and unlimited storage.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "ClauseCraft",
    title: "ClauseCraft — AI Contracts & E-Sign for SMEs",
    description:
      "Generate, edit, and e-sign SME-friendly documents with an AI copilot.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClauseCraft — AI Contracts & E-Sign for SMEs",
    description:
      "Generate, edit, and e-sign SME-friendly documents with an AI copilot.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-zinc-950 text-white">
        <header className="border-b border-white/10">
          <nav className="mx-auto max-w-5xl flex items-center justify-between p-4">
            <Link href="/" className="font-semibold tracking-tight">
              ClauseCraft
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/pricing" className="text-white/80 hover:text-white">
                Pricing
              </Link>
              <Link href="/dashboard" className="text-white/80 hover:text-white">
                Dashboard
              </Link>
              <Link href="/login" className="text-white/80 hover:text-white">
                Login
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-5xl p-4">{children}</main>

        <footer className="mt-16 border-t border-white/10">
          <div className="mx-auto max-w-5xl p-4 text-xs text-white/60">
            © {new Date().getFullYear()} ClauseCraft. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
