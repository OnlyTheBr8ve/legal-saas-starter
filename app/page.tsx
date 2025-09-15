
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4">Contracts & E‑Sign for SMEs — in minutes</h1>
        <p className="text-white/80 max-w-2xl mx-auto mb-8">
          Generate, edit, and e‑sign documents with an AI copilot. Start for free, upgrade for advanced features and unlimited storage.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/dashboard" className="btn">Open Dashboard</Link>
          <a href="#how" className="px-4 py-2 rounded-2xl border border-white/15">See how it works</a>
        </div>
      </section>

      <section id="how" className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Pick a template", desc: "Employment, NDAs, freelancer agreements, policies and more." },
          { title: "Describe changes", desc: "Ask in plain English—AI adjusts clauses and fills variables." },
          { title: "Send to sign", desc: "Lightweight e‑sign with audit trail (premium)." },
        ].map((c, i) => (
          <div key={i} className="card">
            <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
            <p className="text-white/70">{c.desc}</p>
          </div>
        ))}
      </section>

      <footer className="mt-16 text-center text-xs text-white/50">
        © {new Date().getFullYear()} ClauseCraft. Not legal advice.
      </footer>
    </main>
  );
}
