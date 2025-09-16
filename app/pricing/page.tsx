export default function Pricing() {
  return (
    <main className="space-y-8">
      <h1 className="text-4xl font-extrabold">Pricing</h1>
      <p className="text-white/70">Start free. Upgrade when you need more.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">Free</h2>
          <p className="mt-2 text-white/70">Basic generate, 3 runs/day, no storage.</p>
          <ul className="mt-4 space-y-2 text-white/80">
            <li>AI generate (short docs)</li>
            <li>No login required</li>
            <li>Ad-supported</li>
          </ul>
          <a href="/dashboard" className="btn mt-6 inline-block">Continue free</a>
        </section>

        {/* Pro */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">Pro</h2>
          <p className="mt-2 text-white/70">
            Longer docs, saving, priority speed, e-sign (coming soon).
          </p>
          <ul className="mt-4 space-y-2 text-white/80">
            <li>Higher limits</li>
            <li>Save &amp; export</li>
            <li>Priority processing</li>
          </ul>

          {/* Monthly */}
          <form action="/api/checkout" method="POST" className="mt-6 space-y-3">
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              className="input w-full"
            />
            <input type="hidden" name="plan" value="monthly" />
            <button className="btn w-full" type="submit">Upgrade — Monthly</button>
          </form>

          {/* Annual */}
          <form action="/api/checkout" method="POST" className="mt-3 space-y-3">
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              className="input w-full"
            />
            <input type="hidden" name="plan" value="annual" />
            <button
              className="w-full rounded-2xl border border-white/15 px-4 py-2"
              type="submit"
            >
              Upgrade — Annual
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
