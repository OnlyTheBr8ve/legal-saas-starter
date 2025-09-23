"use client";

import { useState } from "react";
import { postDraftToApi, writeLocalDraft } from "@/lib/save-draft";

type Props = {
  getContent: () => string;       // supply current generated/edited text
  title?: string;                  // optional title
  sector?: string;                 // optional sector
  className?: string;
  label?: string;
};

export default function SaveDraftButton({
  getContent,
  title,
  sector,
  className,
  label = "Save draft",
}: Props) {
  const [saving, setSaving] = useState(false);

  async function onClick() {
    const content = (getContent?.() ?? "").trim();
    if (!content) {
      alert("Nothing to save yet.");
      return;
    }
    setSaving(true);
    try {
      const saved = writeLocalDraft({ content, title, sector });
      // fire-and-forget API call (currently echo route)
      postDraftToApi(saved).catch(() => {});
      alert(`Saved “${saved.title || "Untitled"}” to Drafts.`);
    } catch (e: any) {
      alert(`Could not save: ${e?.message ?? "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className={className ?? "rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm hover:bg-black/40 disabled:opacity-50"}
    >
      {saving ? "Saving…" : label}
    </button>
  );
}
