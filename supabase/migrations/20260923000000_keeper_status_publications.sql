create table if not exists public.keeper_status_publications (
  revision integer primary key check (revision > 0),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  content_sha256 text not null check (content_sha256 ~ '^[0-9a-f]{64}$'),
  approved_by text not null check (char_length(approved_by) between 2 and 120),
  approval_note text not null check (char_length(approval_note) between 2 and 500),
  approved_at timestamptz not null,
  published_at timestamptz not null default now(),
  check (payload ->> 'schema' = 'bot-cabinet-trust-status-candidate/v1'),
  check (payload ->> 'publication_status' = 'private-candidate'),
  check ((payload ->> 'approval_required')::boolean = true)
);

comment on table public.keeper_status_publications is
  'Append-only Keeper status candidates that a person explicitly approved for the public Trust dashboard.';

alter table public.keeper_status_publications enable row level security;
revoke all on table public.keeper_status_publications from anon, authenticated;
grant select, insert on table public.keeper_status_publications to service_role;
