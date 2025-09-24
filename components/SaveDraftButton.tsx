"use client";

import React, { useState } from "react";
import {
  writeLocalDraft,
  postDraftToApi,
  type DraftItem,
} from "@/lib/save-draft";

type Props = {
  content: string;
  title?: string;
  sector?: string;
  className?: string;
  children?: React.ReactNode;
};

function deriveSafeTitle(rawTitle: string | undefined, body: string): string {
  if (rawTitle && rawTitle.trim().length > 0) return rawTitle.trim();
  const firstLine =
    body
      ?.split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l.length > 0) ?? "";
  if (firstLine.length > 0) return firstLine.slice(0, 80);
  return "Untitled";
}

function makeId() {
  try {
    return crypto.randomUUID();
  } catch {
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
    const now = Date.now(); // <-- numeric timestamps

    const draft: DraftItem = {
      id: makeId(),
      title: safeTitle,
      content,
      sector, // optional
      createdAt: now,   // <-- numbers, not ISO strings
      updatedAt: now,   // <-- numbers, not ISO strings
    };

    setSaving(true);
    try {
      const saved = writeLocalDraft(draft);
      // fire-and-forget; ok if your API is a no-op for now
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
