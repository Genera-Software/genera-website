-- Read-only role for the support assistant (lib/support/app-db.ts).
--
-- Run this once in the SQL editor of the **app's** Supabase project (not this
-- website's), then set SUPPORT_DB_URL on the website deployment to the
-- transaction pooler connection string with this role's name and password:
--
--   postgres://support_reader.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
--
-- Pick a strong password and keep it only in the deployment's env vars.

create role support_reader with login password 'CHANGE-ME' bypassrls;

-- Belt and braces: even a session that forgets to open a read-only transaction
-- cannot write, and no query can run long enough to hurt production.
alter role support_reader set default_transaction_read_only = on;
alter role support_reader set statement_timeout = '5s';
alter role support_reader set idle_in_transaction_session_timeout = '10s';

grant usage on schema public to support_reader;
grant select on all tables in schema public to support_reader;
alter default privileges in schema public grant select on tables to support_reader;

-- `bypassrls` above lets the role see every business's rows, which is the point
-- for support. To keep a table out of the assistant's reach entirely, revoke it:
--
--   revoke select on public.<sensitive_table> from support_reader;
