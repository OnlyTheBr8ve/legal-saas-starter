export default function Home() {
  return (
    <main>
      <section className="text-center py-16">
        <h1 className="text-5xl font-extrabold mb-4">
          Contracts & E-Sign for SMEs — in minutes
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto mb-8">
          Generate, edit, and e-sign documents with an AI copilot. Start for free,
          upgrade for advanced features and unlimited storage.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a href="/dashboard" className="btn">Open Dashboard</a>
          <a href="/pricing" className="px-4 py-2 rounded-2xl border border-white/15">
            See how it works
          </a>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">Pick a template</h3>
          <p className="text-white/70">
            Employment, NDAs, freelancer agreements, policies and more.
          </p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">Describe changes</h3>
          <p className="text-white/70">
            Ask in plain English—AI adjusts clauses and fills variables.
          </p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">Send to sign</h3>
          <p className="text-white/70">
            Lightweight e-sign with audit trail (premium).
          </p>
        </div>
      </section>
    </main>
  );
}
