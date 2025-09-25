// app/dashboard/page.tsx
import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic"; // avoid SSG complaining around client hooks

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-zinc-400">Loading…</div>}>
      <DashboardClient />
    </Suspense>
  );
}
