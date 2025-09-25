// app/wizard/page.tsx
import { Suspense } from "react";
import WizardClient from "./WizardClient";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function Page({ searchParams }: Props) {
  const templateSlug =
    typeof searchParams?.type === "string" ? searchParams!.type : undefined;
  const initialSector =
    typeof searchParams?.sector === "string" ? searchParams!.sector : "";

  return (
    <Suspense fallback={<div className="p-6 text-zinc-400">Loading…</div>}>
      <WizardClient templateSlug={templateSlug} initialSector={initialSector} />
    </Suspense>
  );
}
