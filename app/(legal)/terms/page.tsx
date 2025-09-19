export const metadata = { title: "Terms of Service" };

export default function Terms() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-white/70">
        Placeholder terms—swap for your final legal content before launch.
      </p>
      <ol className="list-decimal pl-6 space-y-2 text-white/80">
        <li>Service provided “as is”; no legal advice.</li>
        <li>Acceptable use & fair usage limits.</li>
        <li>Billing, refunds, and cancellations.</li>
        <li>Liability cap and governing law (England & Wales suggested).</li>
      </ol>
    </main>
  );
}
