// app/policies/terms/page.tsx
export const metadata = {
  title: "Terms of Service · ClauseCraft",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-white/70">
        These are sample terms for demonstration only. Replace with your own counsel‑approved terms.
      </p>
      <ol className="list-decimal pl-6 space-y-2 text-white/80">
        <li>Service provided “as is”.</li>
        <li>Fair use and acceptable use policies apply.</li>
        <li>Subscriptions managed via Stripe; non‑payment may result in suspension.</li>
        <li>Governing law: England & Wales.</li>
      </ol>
    </main>
  );
}
