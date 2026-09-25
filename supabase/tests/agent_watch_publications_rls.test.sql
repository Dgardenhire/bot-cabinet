begin;
select plan(4);

select ok(
  not has_table_privilege('anon', 'public.agent_watch_publications', 'select,insert,update,delete'),
  'anonymous visitors cannot read or write the publication ledger directly'
);
select ok(
  not has_table_privilege('authenticated', 'public.agent_watch_publications', 'select,insert,update,delete'),
  'signed-in visitors cannot read or write the publication ledger directly'
);
select ok(
  has_table_privilege('service_role', 'public.agent_watch_publications', 'select,insert'),
  'the server-side service role can read and append publications'
);
select ok(
  not has_table_privilege('service_role', 'public.agent_watch_publications', 'update,delete'),
  'published revisions cannot be changed or deleted through the API role'
);

select * from finish();
rollback;
