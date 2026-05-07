
create schema if not exists extensions;
grant usage on schema extensions to postgres, anon, authenticated, service_role;
drop extension if exists pg_net;
create extension pg_net with schema extensions;
