// app/wizard/page.tsx (SERVER component)
import { Suspense } from "react";
import WizardClient from "./wizard-client";

export const revalidate = 0;            // no ISR for the wizard
export const dynamic = "force-dynamic"; // keep this CSR-only

export default function WizardPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading wizard…</div>}>
      <WizardClient />
    </Suspense>
  );
}
