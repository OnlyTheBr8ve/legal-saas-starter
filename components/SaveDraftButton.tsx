"use client";

import React, { useState } from "react";
import {
  writeLocalDraft,
  postDraftToApi,
  type DraftItem,
} from "@/lib/save-draft";

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

// Small helper to generate a UUID across browsers/environments
function makeId() {
  try {
    // modern browsers / Node 19+
    return crypto.randomUUID();
  } catch {
    // fallback
    return `draft_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  }
}

export default function SaveDraftButton({
  content,
  title,
  sector,
  className = "inline-flex items-center rounded-md bg-white/10 hover:bg-white/20 px-4 py-2 border border-white/15",
  children = "Save to Drafts",
}: Props) {
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!content || content.trim().length === 0) {
      alert("Nothing to save — the content is empty.");
      return;
    }

    const safeTitle = deriveSafeTitle(title, content);
    const nowIso = new Date().toISOString();

    // Build a full DraftItem to satisfy writeLocalDraft’s signature
    const draft: DraftItem = {
      id: makeId(),
      title: safeTitle,
      content,
      sector, // can be undefined
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    setSaving(true);
    try {
      const saved = writeLocalDraft(draft);

      // Fire-and-forget (ok if your API is a no-op for now)
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
