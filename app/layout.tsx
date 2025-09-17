import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ClauseCraft — AI Contracts & E-Sign for SMEs",
  description:
    "Generate, edit, and e-sign SME-friendly documents with an AI copilot. Start free; upgrade for advanced features and unlimited storage.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B1020] text-white">
        <header className="border-b border-white/10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-semibold">
              ClauseCraft
            </Link>

            <nav className="flex items-center gap-6 text-white/80">
              <Link href="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
              <Link href="/pricing" className="hover:text-white">
                Pricing
              </Link>
              <Link href="/account" className="hover:text-white">
                Account
              </Link>
              <Link href="/login" className="hover:text-white">
                Login
              </Link>
              <Link
                href="/pricing#pro"
                className="rounded-lg bg-violet-500 px-4 py-2 font-medium text-white hover:bg-violet-600"
              >
                Upgrade
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
