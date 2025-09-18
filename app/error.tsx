"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <main className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-6">
          <h1 className="text-4xl font-extrabold">Something went wrong</h1>
          <p className="text-white/70 max-w-xl">
            A temporary error occurred. You can try again, or head back home.
          </p>

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="rounded-xl px-4 py-2 bg-indigo-500 hover:bg-indigo-400 transition"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/20 transition"
            >
              Home
            </a>
          </div>

          {process.env.NODE_ENV !== "production" && (
            <p className="text-xs text-white/40 mt-6">
              {error.message} {error.digest ? `• ${error.digest}` : ""}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
