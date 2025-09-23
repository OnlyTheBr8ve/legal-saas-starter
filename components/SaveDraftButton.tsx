// components/SaveDraftButton.tsx
"use client";

import { useState } from "react";
import { writeLocalDraft } from "@/components/DraftLibraryPanel";

type Props = {
  title: string;
  content: string;
  prompt?: string;
  sector?: string;
  templateSlug?: string;
  className?: string;
  // toggle local mirroring if needed (defaults to true)
  alsoLocal?: boolean;
};

export default function SaveDraftButton({
  title,
  content,
  prompt,
  sector,
  templateSlug,
  className,
  alsoLocal = true,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onClick() {
    setSaving(true);
    setMsg(null);
    setErr(null);

    const nowIso = new Date().toISOString();

    // First: try server save (non-blocking UX even if it fails)
    let serverId: string | undefined;
    try {
      const res = await fetch("/api/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Untitled draft",
          content: content || "",
          prompt: prompt || "",
          sector: sector || "",
          templateSlug: templateSlug || "",
        }),
      });

      const json = await res
        .json()
        .catch(() => ({} as any)); // tolerate non-JSON responses

      if (!res.ok) {
        throw new Error(json?.error || "Failed to save on server");
      }

      // many handlers return { id }, but tolerate if missing
      serverId = json?.id || undefined;
      setMsg("Saved to server ✅");
    } catch (e: any) {
      // Soft-fail: still mirror to local below
      setErr(e?.message || "Server save failed — saved locally instead");
    }

    // Second: mirror to local so Library shows it immediately
    if (alsoLocal) {
      try {
        writeLocalDraft({
          id: serverId || crypto.randomUUID(),
          title: title || "Untitled draft",
          content: content || "",
          prompt: prompt || "",
          sector: sector || "",
          templateSlug: templateSlug || "",
          updatedAt: nowIso,
          source: "local",
        });
        setMsg((m) => (m ? `${m} · Local copy saved ✅` : "Saved locally ✅"));
      } catch {
        // extremely unlikely (e.g., storage full), keep silent
      }
    }

    setSaving(false);
    // small transient message
    setTimeout(() => setMsg(null), 3000);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onClick}
        disabled={saving}
        className={
          className ??
          "px-4 py-2 rounded-md bg-white text-black font-medium border border-white/10 disabled:opacity-60"
        }
      >
        {saving ? "Saving…" : "Save to Library"}
      </button>

      {msg && <span className="text-xs text-emerald-400">{msg}</span>}
      {err && <span className="text-xs text-yellow-400">{err}</span>}
    </div>
  );
}
