// app/privacy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ClauseCraft",
  description:
    "How ClauseCraft collects, uses, and protects your data. Learn about cookies, analytics, and your rights.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-white/70 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <section className="space-y-4">
        <p>
          This Privacy Policy explains how <strong>ClauseCraft</strong> (“we”, “us”) collects,
          uses, and protects information when you use our website and services.
        </p>

        <h2 className="text-xl font-semibold">1. Information we collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Usage data:</strong> page views, buttons clicked, basic device info (via
            analytics).
          </li>
          <li>
            <strong>Billing data:</strong> handled securely by Stripe. We do not store full card
            numbers.
          </li>
          <li>
            <strong>Content you provide:</strong> prompts or text you enter to generate documents.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">2. How we use information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide and improve the service (e.g., generate documents, fix bugs).</li>
          <li>Communicate important updates and respond to support requests.</li>
          <li>Detect abuse and ensure fair use of free and paid features.</li>
        </ul>

        <h2 className="text-xl font-semibold">3. Cookies & analytics</h2>
        <p>
          We may use essential cookies for functionality and privacy-friendly analytics to
          understand product usage. You can adjust your browser settings to disable cookies.
        </p>

        <h2 className="text-xl font-semibold">4. Data processors</h2>
        <p>
          We use trusted vendors to operate the service (e.g., hosting, payments). These
          providers only process data on our behalf and under contract.
        </p>

        <h2 className="text-xl font-semibold">5. Data retention</h2>
        <p>
          We keep data only as long as needed for the purposes above or as required by law. You
          can request deletion of your account-associated data.
        </p>

        <h2 className="text-xl font-semibold">6. Your rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct, export, or delete
          your personal data. Contact us to exercise these rights.
        </p>

        <h2 className="text-xl font-semibold">7. Contact</h2>
        <p>
          Questions? Email <a href="mailto:support@yourdomain.com" className="underline">support@yourdomain.com</a>.
          (Replace this with your real support email.)
        </p>

        <h2 className="text-xl font-semibold">8. Changes</h2>
        <p>
          We may update this policy. Material changes will be highlighted on this page and the
          “Last updated” date will be revised.
        </p>
      </section>
    </main>
  );
}
