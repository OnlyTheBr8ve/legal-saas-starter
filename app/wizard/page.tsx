// app/wizard/page.tsx
import { Suspense } from "react";
import WizardClient from "./WizardClient";

// Keep this page server-side and wrap the client in Suspense.
// WizardClient should read search params itself via useSearchParams.
export default function WizardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-zinc-400">Loading…</div>}>
      <WizardClient />
    </Suspense>
  );
}
