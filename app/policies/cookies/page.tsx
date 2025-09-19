// app/policies/cookies/page.tsx
export const metadata = {
  title: "Cookies · ClauseCraft",
};

export default function CookiesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Cookies</h1>
      <p className="text-white/70">
        We use essential and analytics cookies to run the service and improve performance.
      </p>
      <h2 className="text-xl font-semibold">Managing cookies</h2>
      <p className="text-white/80">
        You can control cookies in your browser settings. Certain features may not work if cookies are disabled.
      </p>
    </main>
  );
}
