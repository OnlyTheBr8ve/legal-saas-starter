"use client";

import React, { useState } from "react";
import { writeLocalDraft, postDraftToApi } from "@/lib/save-draft";

type Props = {
  /** The markdown/text to save */
  content: string;
  /** Optional display title; if omitted, we derive one */
  title?: string;
  /** Optional sector key (used for grouping/filtering) */
  sector?: string;
  /** Optional className for the button */
  className?: string;
  /** Optional children; defaults to “Save to Drafts” */
  children?: React.ReactNode;
};

export default function SaveDraftButton({
  content,
  title,
  sector,
  className = "inline-flex items-center rounded-md bg-white/10 hover:bg-white/20 px-4 py-2 border border-white/15",
  children = "Save to Drafts",
}: Props) {
  const [saving, setSaving] = useState(false);

  function deriveSafeTitle(rawTitle: string | undefined, body: string): string {
    // Prefer explicit title
    if (rawTitle && rawTitle.trim().length > 0) return rawTitle.trim();

    // Otherwise, try the first non-empty line of the content (up to 80 chars)
    const firstLine =
      body
        ?.split(/\r?\n/)
        .map((l) => l.trim())
        .find((l) => l.length > 0) ?? "";

    if (firstLine.length > 0) return firstLine.slice(0, 80);

    // Final fallback
    return "Untitled";
  }

  async function handleSave() {
    if (!content || content.trim().length === 0) {
      alert("Nothing to save — the content is empty.");
      return;
    }

    const safeTitle = deriveSafeTitle(title, content);

    setSaving(true);
    try {
      // Persist locally (authoritative source for the Drafts panel)
      const saved = writeLocalDraft({
        content,
        title: safeTitle, // now guaranteed string
        sector, // optional; your lib layer supports this
      });

      // Fire-and-forget network call (e.g., to echo or real persistence later)
      postDraftToApi(saved).catch(() => {});

      alert(`Saved “${saved.title || "Untitled"}” to Drafts.`);
    } catch (err) {
      console.error(err);
      alert("Sorry, we couldn't save your draft. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={saving}
      className={className}
      aria-busy={saving}
      title={saving ? "Saving…" : "Save to Drafts"}
    >
      {saving ? "Saving…" : children}
    </button>
  );
}
