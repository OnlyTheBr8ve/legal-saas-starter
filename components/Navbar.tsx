
'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between mb-8">
      <Link href="/" className="text-xl font-semibold">
        ClauseCraft
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-sm text-white/80 hover:text-white">Dashboard</Link>
        <a href="https://stripe.com" target="_blank" className="btn text-sm">Upgrade</a>
      </div>
    </nav>
  )
}
