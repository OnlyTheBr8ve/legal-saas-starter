// app/dashboard/page.tsx
import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

// Ensure this page isn’t pre-rendered in a way that trips CSR bailout checks
export const dynamic = "force-dynamic";
export const revalidate = 0; // disable ISR for this page
export const runtime = "nodejs";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-zinc-500">Loading dashboard…</div>}>
      <DashboardClient />
    </Suspense>
  );
}
