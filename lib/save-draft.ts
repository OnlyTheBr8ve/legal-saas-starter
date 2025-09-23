// lib/save-draft.ts

// Keep this file platform-agnostic (works on server and client).
// Local persistence uses localStorage guarded behind `typeof window !== "undefined"`.

export type DraftItem = {
  id: string;              // uuid or timestamp id
  title: string;
  sector?: string;         // keep as string to avoid imports/cycles
  content: string;
  tags?: string[];
  createdAt: number;       // epoch ms
  updatedAt: number;       // epoch ms
};

const LS_KEY = "cc__drafts_v1";

// ---------- Local (browser) helpers ----------

function safeReadAll(): DraftItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // very light validation
    return parsed.filter((d) => d && typeof d.id === "string" && typeof d.content === "string");
  } catch {
    return [];
  }
}

function safeWriteAll(list: DraftItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {
    // ignore quota errors etc.
  }
}

/** Read all drafts from localStorage (client only). */
export function readLocalDrafts(): DraftItem[] {
  return safeReadAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

/** Read a single draft by id (client only). */
export function readLocalDraft(id: string): DraftItem | undefined {
  return safeReadAll().find((d) => d.id === id);
}

/** Create or update a draft in localStorage (client only). */
export function writeLocalDraft(draft: DraftItem): DraftItem {
  const list = safeReadAll();
  const now = Date.now();
  const idx = list.findIndex((d) => d.id === draft.id);

  const toSave: DraftItem = {
    ...draft,
    createdAt: idx >= 0 ? list[idx].createdAt : draft.createdAt ?? now,
    updatedAt: now,
  };

  if (idx >= 0) list[idx] = toSave;
  else list.unshift(toSave);

  safeWriteAll(list);
  return toSave;
}

/** Delete a draft from localStorage (client only). */
export function deleteLocalDraft(id: string): void {
  const list = safeReadAll().filter((d) => d.id !== id);
  safeWriteAll(list);
}

// ---------- Server-side placeholder (API-compatible) ----------
// On Vercel without a DB, we provide a noop server save that simply echoes success.
// Later we can swap this to Supabase/DB/KV without touching callers.

/**
 * Server-safe placeholder save. Does not persist on the server.
 * Keep the signature stable so API route code can call it.
 */
export async function saveDraft(draft: DraftItem): Promise<{ ok: true }> {
  // In the future, persist to DB/KV here.
  return { ok: true };
}
