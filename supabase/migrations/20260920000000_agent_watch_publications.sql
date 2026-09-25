create table if not exists public.agent_watch_publications (
  slug text not null,
  revision integer not null check (revision > 0),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  content_sha256 text not null check (content_sha256 ~ '^[0-9a-f]{64}$'),
  approved_by text not null check (char_length(approved_by) between 2 and 120),
  approval_note text not null check (char_length(approval_note) between 2 and 500),
  approved_at timestamptz not null,
  published_at timestamptz not null default now(),
  primary key (slug, revision),
  check (payload ->> 'slug' = slug)
);

comment on table public.agent_watch_publications is
  'Append-only Agent Watch items that a person explicitly approved for public release.';

alter table public.agent_watch_publications enable row level security;
revoke all on table public.agent_watch_publications from anon, authenticated;
grant select, insert on table public.agent_watch_publications to service_role;

create index if not exists agent_watch_publications_latest_idx
  on public.agent_watch_publications (slug, revision desc);
