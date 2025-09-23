// lib/save-draft.ts
"use client";

export function saveDraftAndGo(markdown: string, to: string = "/dashboard") {
  try {
    sessionStorage.setItem("lastContractMarkdown", markdown);
  } catch {}
  // Use a hard navigation so the dashboard mounts fresh
  window.location.assign(to);
}
