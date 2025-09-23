// app/dashboard/page.tsx (SERVER COMPONENT)
import { Suspense } from "react";
import DashboardClient from "./dashboard-client";

export const revalidate = 0; // disable ISR here
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading document…</div>}>
      <DashboardClient />
    </Suspense>
  );
}
