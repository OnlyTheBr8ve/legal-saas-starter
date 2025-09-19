import { Suspense } from "react";
import Client from "./page.client";

export default function DashboardPage() {
  return (
    <Suspense>
      <Client />
    </Suspense>
  );
}
