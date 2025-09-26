// app/dashboard/page.tsx
import DashboardClient from "./DashboardClient";

export const runtime = "nodejs";

export default function Page() {
  // Server component wrapper – the client UI lives in DashboardClient
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-zinc-400 mt-2">
        Select a sector below, draft your text, and save it to Supabase.
      </p>

      <div className="mt-8">
        <DashboardClient />
      </div>
    </main>
  );
}
