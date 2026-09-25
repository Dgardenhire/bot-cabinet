begin;
select plan(4);

select ok(
  not has_table_privilege('anon', 'public.keeper_status_publications', 'select,insert,update,delete'),
  'anonymous visitors cannot read or write the Keeper status ledger directly'
);
select ok(
  not has_table_privilege('authenticated', 'public.keeper_status_publications', 'select,insert,update,delete'),
  'signed-in visitors cannot read or write the Keeper status ledger directly'
);
select ok(
  has_table_privilege('service_role', 'public.keeper_status_publications', 'select,insert'),
  'the server-side service role can read and append reviewed status records'
);
select ok(
  not has_table_privilege('service_role', 'public.keeper_status_publications', 'update,delete'),
  'reviewed status revisions cannot be changed or deleted through the API role'
);

select * from finish();
rollback;
