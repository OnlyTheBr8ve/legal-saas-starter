export default function Pricing() {
  return (
    <main className="space-y-8">
      <h1 className="text-4xl font-extrabold">Pricing</h1>
      <p className="text-white/70">Start free. Upgrade when you need more.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-2xl font-semibold mb-2">Free</h2>
          <p className="text-white/70 mb-4">
            Basic generate, 3 runs/day, no storage.
          </p>
          <ul className="list-disc list-inside text-white/70 mb-6">
            <li>AI generate (short docs)</li>
            <li>No login required</li>
            <li>Ad-supported</li>
          </ul>
          <a href="/dashboard" className="px-4 py-2 rounded-2xl border border-white/15">
            Continue free
          </a>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-2">Pro</h2>
          <p className="text-white/70 mb-4">
            Longer docs, saving, priority speed, e-sign (coming soon).
          </p>
          <ul className="list-disc list-inside text-white/70 mb-6">
            <li>Higher limits</li>
            <li>Save & export</li>
            <li>Priority processing</li>
          </ul>

          {/* Monthly */}
          <form action="/api/checkout" method="POST" className="mb-3">
            <input type="hidden" name="plan" value="monthly" />
            <button className="btn w-full">Upgrade — Monthly</button>
          </form>

          {/* Annual */}
          <form action="/api/checkout" method="POST">
            <input type="hidden" name="plan" value="annual" />
            <button className="px-4 py-2 rounded-2xl border border-white/15 w-full">
              Upgrade — Annual
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
