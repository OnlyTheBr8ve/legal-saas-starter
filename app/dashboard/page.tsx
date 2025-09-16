// app/dashboard/page.tsx
import Link from "next/link";
import Editor from "@/components/Editor";

type SearchParams = { upgraded?: string; canceled?: string };

export default function Dashboard({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const upgraded = searchParams?.upgraded === "1";
  const canceled = searchParams?.canceled === "1";

  return (
    <main className="space-y-6">
      {/* Stripe return banners */}
      {(upgraded || canceled) && (
        <div
          className={
            "rounded-xl border p-4 text-sm " +
            (upgraded
              ? "border-green-500/30 bg-green-500/10 text-green-200"
              : "border-yellow-500/30 bg-yellow-500/10 text-yellow-200")
          }
          role="status"
        >
          {upgraded ? (
            <div className="flex items-center justify-between gap-3">
              <p>
                <strong>Thanks!</strong> Your upgrade succeeded. Pro features are
                now enabled. 🎉
              </p>
              <Link
                href="/pricing"
                className="shrink-0 rounded-md bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20"
              >
                Manage plan
              </Link>
            </div>
          ) : (
            <p>
              Checkout was cancelled. You can upgrade any time from the{" "}
              <Link href="/pricing" className="underline">
                pricing page
              </Link>
              .
            </p>
          )}
        </div>
      )}

      {/* Your dashboard UI */}
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-white/70">
          Generate and edit your documents below. (Pro increases limits and
          speed.)
        </p>
      </section>

      {/* Editor (keeps your existing flow) */}
      <Editor />
    </main>
  );
}
