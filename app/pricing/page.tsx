export default function Pricing() {
  return (
    <main className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Pricing</h1>
      <p className="text-white/70 mb-10">
        Start free. Upgrade to Pro for unlimited power-features.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-2xl font-semibold mb-2">Free</h2>
          <p className="text-white/70 mb-4">Great for trying things out.</p>
          <ul className="text-white/80 space-y-2 mb-6 list-disc ml-5">
            <li>AI generate (short docs)</li>
            <li>3 generates/day</li>
            <li>Basic templates</li>
            <li>Ad-supported</li>
          </ul>
          <a href="/dashboard" className="px-4 py-2 rounded-2xl border border-white/15">
            Get started
          </a>
        </div>

        <div className="card border-brand-500/40">
          <h2 className="text-2xl font-semibold mb-2">Pro</h2>
          <p className="text-white/70 mb-4">For businesses and power users.</p>
          <ul className="text-white/80 space-y-2 mb-6 list-disc ml-5">
            <li>Longer documents</li>
            <li>Save & version history</li>
            <li>PDF export</li>
            <li>Lightweight e-sign</li>
            <li>Priority processing</li>
          </ul>
          <form action="/api/checkout" method="POST">
            <button className="btn">Upgrade to Pro</button>
          </form>
          <p className="text-xs text-white/50 mt-3">No risk—cancel anytime.</p>
        </div>
      </div>
    </main>
  );
}
