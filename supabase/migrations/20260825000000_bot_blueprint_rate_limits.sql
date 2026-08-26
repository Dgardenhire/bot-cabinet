create table if not exists public.bot_blueprint_rate_limits (
  rate_date date not null,
  requester_hash text not null check (char_length(requester_hash) = 64),
  request_count integer not null default 1 check (request_count > 0),
  updated_at timestamptz not null default now(),
  primary key (rate_date, requester_hash)
);

create table if not exists public.bot_blueprint_daily_totals (
  rate_date date primary key,
  request_count integer not null default 1 check (request_count > 0),
  updated_at timestamptz not null default now()
);

alter table public.bot_blueprint_rate_limits enable row level security;
alter table public.bot_blueprint_daily_totals enable row level security;

revoke all on table public.bot_blueprint_rate_limits from public, anon, authenticated;
revoke all on table public.bot_blueprint_daily_totals from public, anon, authenticated;

create or replace function public.consume_bot_blueprint_rate_limit(
  p_requester_hash text,
  p_requester_daily_limit integer,
  p_global_daily_limit integer
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  requester_count integer;
  global_count integer;
begin
  if p_requester_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid requester hash';
  end if;
  if p_requester_daily_limit < 1 or p_requester_daily_limit > 100 then
    raise exception 'invalid requester limit';
  end if;
  if p_global_daily_limit < 1 or p_global_daily_limit > 10000 then
    raise exception 'invalid global limit';
  end if;

  delete from public.bot_blueprint_rate_limits
  where rate_date < current_date - 7;

  delete from public.bot_blueprint_daily_totals
  where rate_date < current_date - 7;

  insert into public.bot_blueprint_rate_limits (
    rate_date,
    requester_hash,
    request_count,
    updated_at
  )
  values (current_date, p_requester_hash, 1, now())
  on conflict (rate_date, requester_hash)
  do update set
    request_count = public.bot_blueprint_rate_limits.request_count + 1,
    updated_at = now()
  returning request_count into requester_count;

  if requester_count > p_requester_daily_limit then
    return false;
  end if;

  insert into public.bot_blueprint_daily_totals (
    rate_date,
    request_count,
    updated_at
  )
  values (current_date, 1, now())
  on conflict (rate_date)
  do update set
    request_count = public.bot_blueprint_daily_totals.request_count + 1,
    updated_at = now()
  returning request_count into global_count;

  return global_count <= p_global_daily_limit;
end;
$$;

revoke all on function public.consume_bot_blueprint_rate_limit(text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_bot_blueprint_rate_limit(text, integer, integer)
  to service_role;

comment on function public.consume_bot_blueprint_rate_limit(text, integer, integer) is
  'Enforces per-requester and site-wide daily limits for Bot Lab AI generation and removes rate records older than seven days.';
