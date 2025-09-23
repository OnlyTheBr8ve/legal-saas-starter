// components/SaveDraftButton.tsx
"use client";

import { useState } from "react";

type Props = {
  title: string;
  content: string;
  prompt?: string;
  templateSlug?: string;
  sector?: string;
  className?: string;
};

export default function SaveDraftButton({
  title,
  content,
  prompt,
  templateSlug,
  sector,
  className,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSave() {
    setSaving(true);
    setError(null);
    setSavedId(null);
    try {
      const res = await fetch("/api/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, prompt, templateSlug, sector }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to save");
      setSavedId(json.id || "ok");
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="px-4 py-2 rounded-md bg-white text-black font-medium border border-white/10 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save to Library"}
      </button>
      {savedId && <p className="text-green-400 text-sm mt-2">Saved ✓</p>}
      {error && <p className="text-red-400 text-sm mt-2">Error: {error}</p>}
    </div>
  );
}
