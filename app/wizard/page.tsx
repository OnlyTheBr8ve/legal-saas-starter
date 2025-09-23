// app/wizard/page.tsx (SERVER COMPONENT)
import { Suspense } from "react";
import WizardClient from "./wizard-client";

// Force no caching for this segment (valid values: 0 or false)
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function WizardPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading wizard…</div>}>
      <WizardClient />
    </Suspense>
  );
}
