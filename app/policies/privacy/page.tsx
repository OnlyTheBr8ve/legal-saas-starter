// app/policies/privacy/page.tsx
export const metadata = {
  title: "Privacy Policy · ClauseCraft",
  description: "How we collect and process your data.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-white/70">
        This generic privacy policy is a placeholder. Replace with your own policy before launch.
      </p>
      <h2 className="text-xl font-semibold mt-6">What we collect</h2>
      <ul className="list-disc pl-6 space-y-1 text-white/80">
        <li>Account details (name, email)</li>
        <li>Billing info (via Stripe)</li>
        <li>Usage analytics (aggregate)</li>
      </ul>
      <p className="text-sm text-white/60">
        For questions, contact: privacy@example.com
      </p>
    </main>
  );
}
