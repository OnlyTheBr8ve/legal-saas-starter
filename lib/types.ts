// lib/types.ts

// Minimal shape for rows in the `drafts` table.
// Adjust fields if your schema differs.
export type DraftRow = {
  id: string;
  title: string;
  content: string;
  sector: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};
