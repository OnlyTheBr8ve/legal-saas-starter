
-- Documents & Templates (basic draft)
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  content text not null,
  jurisdiction text default 'generic',
  created_at timestamp with time zone default now()
);

-- RLS (enable if you connect auth; replace with your auth uid column)
alter table public.documents enable row level security;
create policy "documents are private" on public.documents
  for select using (true);

create policy "insert documents" on public.documents
  for insert with check (true);

create policy "update own documents" on public.documents
  for update using (true);
