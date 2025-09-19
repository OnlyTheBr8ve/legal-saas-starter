export const metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-white/70">
        This is a lightweight placeholder so you can go live; replace with your counsel’s text.
      </p>
      <ul className="list-disc pl-6 space-y-2 text-white/80">
        <li>What data we collect (account email, payment status, documents).</li>
        <li>How we use it (provide the service, support, billing).</li>
        <li>Your rights and how to contact us.</li>
      </ul>
    </main>
  );
}
