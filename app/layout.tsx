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
    "Generate, edit, and e-sign documents with an AI copilot. Start free, then upgrade for advanced features and unlimited storage.",
  alternates: { canonical: "/", sitemap: "/sitemap.xml" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "ClauseCraft",
    title: "ClauseCraft — AI Contracts & E-Sign for SMEs",
    description:
      "Generate, edit, and e-sign documents with an AI copilot. Start free, then upgrade for advanced features and unlimited storage.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClauseCraft — AI Contracts & E-Sign for SMEs",
    description:
      "Generate, edit, and e-sign documents with an AI copilot. Start free, then upgrade for advanced features and unlimited storage.",
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
      <body className="min-h-screen bg-[#0B0F1A] text-white antialiased">
        <header className="border-b border-white/10">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold">
              ClauseCraft
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/dashboard" className="text-white/80 hover:text-white">
                Dashboard
              </Link>
              <Link href="/pricing" className="text-white/80 hover:text-white">
                Pricing
              </Link>
              <Link href="/account" className="text-white/80 hover:text-white">
                Account
              </Link>
              <Link href="/login" className="text-white/80 hover:text-white">
                Login
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl bg-indigo-500 px-4 py-2 font-medium hover:bg-indigo-400"
              >
                Upgrade
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
