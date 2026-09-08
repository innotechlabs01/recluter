# Local Supabase for testing (Docker)

The repo has no `docker-compose.yml`; local Supabase is managed by the
Supabase CLI (`supabase/config.toml`), which starts its own containers.

## Why non-default ports

The default Supabase range (54321–54327) is already taken on this machine
by another local project (`cf-re-app`). This project uses the 544xx range
in `supabase/config.toml`:

| Service | URL |
|---|---|
| PostgreSQL | `postgresql://postgres:postgres@127.0.0.1:54422/postgres` |
| API / REST | `http://127.0.0.1:54421` |
| Studio | `http://127.0.0.1:54423` |
| Mailpit | `http://127.0.0.1:54424` |
| Analytics | port 54427, shadow DB 54420 |

## Commands

```bash
supabase start          # start the local stack
supabase status         # URLs + keys (anon publishable / secret)
supabase migration up   # apply pending migrations in supabase/migrations/
supabase stop           # stop the stack (frees the 544xx ports)
```

Use `.env.local` overrides for tests (copy from `.env.example`):

```bash
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54422/postgres
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54421
```

Get the local keys with `supabase status` (they are shared local dev
defaults — never use them in production).

## Migrations

- `20260819000000_initial_schema.sql` — base schema.
- `20260904000000_chat_cron_metrics.sql` — delta: `chat_threads`,
  `chat_messages`, publishing columns on `job_requests`, `max_concurrent`
  on `recruiters`, plus `interviews`, `documents`, `testimonials`.
  This covers the content of `src/lib/db/migrations/0003_zippy_colossus.sql`
  (drizzle-kit journal, same chat/publishing/capacity delta) and extends it
  with the `interviews`/`documents`/`testimonials` tables from the current
  `src/lib/db/schema.ts`. For local Docker testing, `supabase/migrations/`
  is authoritative — do not apply the drizzle journal against the same DB
  (objects already exist).

Verify tables:

```bash
node -e "
const postgres = require('postgres');
const sql = postgres('postgresql://postgres:postgres@127.0.0.1:54422/postgres');
sql\`select tablename from pg_tables where schemaname='public' order by tablename\`
  .then((r) => console.log(r.map((x) => x.tablename).join('\n')))
  .finally(() => sql.end());
"
```
