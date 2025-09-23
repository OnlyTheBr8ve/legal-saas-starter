// lib/save-draft.ts

export type Draft = {
  id: string;
  title: string;
  content: string;
  sector?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

const STORAGE_KEY = "drafts:v1";

function load(): Draft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as Draft[]) : [];
  } catch {
    return [];
  }
}

function save(drafts: Draft[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

/**
 * Write (upsert) a draft to localStorage.
 * Returns the saved Draft.
 */
export function writeLocalDraft(input: {
  id?: string;
  title?: string;
  content: string;
  sector?: string;
}): Draft {
  const now = new Date().toISOString();
  const id = input.id ?? (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`);
  const nextDraft: Draft = {
    id,
    title: input.title?.trim() || "Untitled",
    content: input.content,
    sector: input.sector,
    createdAt: now,
    updatedAt: now,
  };

  const drafts = load();
  const idx = drafts.findIndex((d) => d.id === id);
  if (idx >= 0) {
    drafts[idx] = { ...drafts[idx], ...nextDraft, createdAt: drafts[idx].createdAt, updatedAt: now };
  } else {
    drafts.unshift(nextDraft);
  }
  save(drafts);
  // broadcast to other tabs
  try {
    localStorage.setItem(`${STORAGE_KEY}:touch`, now);
  } catch {}
  return idx >= 0 ? drafts[idx] : nextDraft;
}

export function readLocalDrafts(): Draft[] {
  return load();
}

export function deleteLocalDraft(id: string) {
  const drafts = load().filter((d) => d.id !== id);
  save(drafts);
}

export function clearLocalDrafts() {
  save([]);
}

/**
 * Optional helper to call the API (no-op server persistence for now).
 * We won't import this on the server—client-only convenience.
 */
export async function postDraftToApi(draft: { id?: string; title?: string; content: string; sector?: string }) {
  try {
    await fetch("/api/save-draft", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft),
    });
  } catch {
    // ignore network errors; local save already succeeded
  }
}
