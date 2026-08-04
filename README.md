# Genera Website

Marketing website for Genera Software, plus a Supabase-backed CMS at `/admin` that
drives most of the page content, a support-ticket inbox, and a lightweight content
planning tool at `/command-centre`.

## Tech Stack

- Next.js 15 (App Router) + Turbopack
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase (Postgres) — content, forms, support tickets
- Postmark — transactional and support email
- Google Analytics Data API (GA4) — admin analytics
- Anthropic Managed Agents — "Ask Claude" ticket analysis
- c15t — cookie consent

## Prerequisites

- Node.js 20+
- npm
- A Supabase project (URL, anon key, service role key)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root — see [Environment Variables](#environment-variables).

3. Apply the migrations in `supabase/migrations/` to your Supabase project
   (Supabase CLI, or paste them into the SQL editor in filename order).

4. Create the first admin account — `/admin` has no sign-up flow, so without this
   there is no way in. This one has to be the CLI; everyone after can be added
   from `/admin/users`. See [Managing admin accounts](#managing-admin-accounts).

   ```bash
   npm run admin:user -- add you@example.com   # allowlists you and prints a password
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000). The CMS lives at
   [http://localhost:3000/admin](http://localhost:3000/admin).

## Scripts

- `npm run dev` — dev server with Turbopack
- `npm run build` — production build
- `npm run start` — start the production server
- `npm run lint` — Next.js lint checks
- `npm run typecheck` — `tsc --noEmit`
- `npm run badges` — regenerate badge images (`scripts/generate-badges.mjs`, puppeteer-core)
- `npm run admin:user` — break-glass CLI for `/admin` accounts
  (`scripts/admin-user.mjs`) — **writes to the live Supabase project**. Normally
  use `/admin/users` instead; see
  [Managing admin accounts](#managing-admin-accounts)

## Routes

### Public site — `app/(site)/`

Home, `features`, `faqs`, `contact`, `blog` (+ `blog/[slug]`), `our-story`,
`founding100`, `community`, `badge-kit`, `privacy-policy`, `terms-of-service`,
`gdpr`. These read from Supabase with `revalidate = 60`, so content edits go live
within a minute without a redeploy.

### Docs — `app/docs/`

Product documentation rendered from `app/docs/_data/sections.ts`.

### Legacy static pages

`/setup`, `/setup-guide`, `/customerportal` are route handlers that serve
pre-built HTML out of `public/`.

### Public API — `app/api/`

| Route                      | Purpose                                                    |
| -------------------------- | ---------------------------------------------------------- |
| `POST /api/book-demo`      | Demo request form → Postmark                                |
| `GET /api/forms/[slug]`    | Fetch a published form definition                           |
| `POST /api/forms/[slug]/submit` | Store a form submission                                |
| `POST /api/support/public` | Ticket creation from the embedded support widget            |
| `GET /api/support/tickets` | Ticket lookup for the widget                                |
| `POST /api/support/inbound`| Postmark inbound webhook — customer replies onto a ticket   |
| `GET /api/badge/[id]`      | Serves badge images and records `badge_events`              |
| `/api/command-centre/state`| Content Command Centre state (auth-gated)                   |

## The `/admin` CMS

### Access

Per-user accounts via **Supabase Auth** (email + password). Two gates, both of
which must pass:

1. **A valid Supabase session** — `middleware.ts` calls `supabase.auth.getUser()`
   on every `/admin` request (also refreshing the tokens), and redirects to
   `/admin/login?from=…` if there isn't one.
2. **The allowlist** — the `admin_users` table lists the only addresses permitted
   to sign in, and is managed from **`/admin/users`**. A Supabase account on its
   own is **not** enough. This matters: public sign-up is enabled on the project,
   so anyone can create a Supabase account — the allowlist is what stops that
   being a way in.

The allowlist is enforced in the middleware *and* re-checked server-side in
`app/admin/(authed)/layout.tsx` via `requireAdminUser()`, so removing someone
locks them out on their next request even if their Supabase session is still
valid. Sign-out posts to `/admin/logout`. The signed-in address at the bottom of
the sidebar links to `/admin/account`.

The middleware can't hold the service-role key (it runs on the Edge runtime), so
it checks membership through the `is_current_user_admin()` security-definer
function. That function takes no arguments and answers only for the calling JWT,
so it can't be used to probe other addresses or read the list back. Server-side
code uses the service-role client directly.

Key files: `lib/admin/allowlist.ts` (table reads), `lib/admin/auth.ts`
(Node/server helpers), `lib/admin/middleware-auth.ts` (Edge),
`lib/admin/users.ts` (invite/remove + the temp-password email),
`lib/supabase/auth.ts` (shared client factory).

Data access is unchanged — pages still read and write through the service-role
client (`lib/supabase/admin.ts`) once the session check has passed.

#### Managing admin accounts

Day to day this is done in the CMS at **`/admin/users`** — no redeploy, no env
var, no CLI.

**Adding someone.** Enter their email and hit *Send invite*. That one action:

1. creates their Supabase Auth account with a generated temporary password
   (or resets the password, if the address already had an account),
2. adds them to the `admin_users` allowlist,
3. emails them the temporary password via Postmark,
4. flags the account `must_change_password` in `app_metadata`.

That flag is service-role-only, so the user cannot clear it themselves. Until
they replace the password, the middleware pins them to `/admin/account` — every
other admin page redirects there. Setting a new password (12+ characters) clears
the flag and releases the rest of the CMS.

If Postmark fails, the invite still succeeds and the page shows you the
temporary password so you can pass it on yourself — it is not lost.

**Removing someone.** The *Remove* button deletes both their allowlist row and
their Supabase Auth account. They lose access on their very next request, even
mid-session. Two guards: you cannot remove yourself, and you cannot remove the
last remaining admin.

**Changing your own password.** `/admin/account`, reachable from the signed-in
address at the bottom of the sidebar. There is no self-serve "forgot password"
flow — another admin re-invites you, which issues a fresh temporary password.

#### Break-glass CLI

`npm run admin:user` does the same jobs from the terminal, for the two cases the
UI can't cover: seeding the very first admin on a fresh database, and getting
back in if everyone is locked out. Unlike `/admin/users` it does **not** send
email — it prints the temporary password for you to pass on.

> **⚠ This writes to the live database.** It reads `NEXT_PUBLIC_SUPABASE_URL` and
> `SUPABASE_SERVICE_ROLE_KEY` from `.env` and calls the Supabase Admin API plus
> the `admin_users` table on whichever project those point at. There is no
> staging project and no dry run — `remove` is immediate and permanent.

```bash
npm run admin:user -- list                       # allowlist + account status
npm run admin:user -- add <email> [password]     # allowlist AND create the account
npm run admin:user -- password <email> [password]
npm run admin:user -- remove <email>             # deletes the row and the account
```

The `--` is required: it stops npm from eating the arguments. `list` marks
allowlisted addresses that have no Supabase account, and flags Supabase accounts
that are not allowlisted (those cannot sign in):

```
Admins (✓ = has a Supabase Auth account):

  ✓ dihan.algama@gmail.com  (added by migration, last sign-in: 2026-08-04)
  ✗ duncan@example.com      (added by dihan.algama@gmail.com, last sign-in: never)
```

Layout lives in `app/admin/(authed)/` — a dark sidebar (`_components/Sidebar.tsx`)
with unread-count badges, and everything inside the `(authed)` route group sits
behind the middleware check.

### Pages

**Dashboard** — `/admin`
Overview tiles (visitors, open tickets, form submissions, blog posts) plus recent
tickets, recent submissions and recent posts.

**Analytics** — `/admin/analytics`
GA4 metrics split into **Website** and **App** properties, pulled server-side via
the Google Analytics Data API using a service account. Helper code in
`lib/analytics/ga-client.ts`.

**Badge Kit** — `/admin/badges`
Usage stats for the shareable customer badges served from `/api/badge/[id]`,
backed by the `badge_events` table. Badge artwork is generated by `npm run badges`.

**Forms** — `/admin/forms`
Form builder: create a form, add questions (including multi-select), publish it,
and read responses at `/admin/forms/submissions`. Forms are consumed publicly via
`/api/forms/[slug]`. Tables: `forms`, `form_questions`, `form_submissions`.

**Support** — `/admin/support`
Ticket inbox with a detail view at `/admin/support/[id]` and a drag-and-drop board
at `/admin/support/board`. Threaded replies go out through Postmark and customer
replies land back via the inbound webhook; unread messages are flagged in the
sidebar. Each ticket has an **Ask Claude** button that starts a read-only
Anthropic Managed Agent session against the app repo and writes a diagnosis back
onto the ticket — see [`anthropic/README.md`](anthropic/README.md). The section
greys itself out until all five Anthropic/repo variables are set.
Tables: `support_tickets`, `support_ticket_messages`, `support_notify_emails`.

*Assignment* — tickets can be assigned to any admin from
[`/admin/users`](#managing-admin-accounts). `support_tickets.assigned_to` holds
the assignee's **email** rather than a foreign key, so a ticket stays readable as
a historical record if that person later leaves.

- **Ticket detail** — an *Assigned to* picker in the sidebar, with an
  *Assign to me* shortcut.
- **List view** — an Assignee column, plus filter chips for *Anyone*,
  *My tickets*, *Unassigned* and each admin. Combines with the existing status,
  priority and category filters.
- **Board view** — the assignee avatar on each card doubles as a picker.
- Assignment is validated against the allowlist server-side, so a stale form
  cannot park work on someone who no longer has access.
- Removing an admin **unassigns their open tickets** back to the pool.
  Completed tickets keep the name, as a record of who handled them.

**Content section**

| Page                  | Manages                                              | Table                                          |
| --------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| `/admin/founding-spots` | Remaining Founding 100 spots counter               | `founding_spots`                               |
| `/admin/logos`        | Trust / customer logo strip                          | `trust_logos`                                  |
| `/admin/blog`         | Blog posts (TipTap rich-text editor, draft/publish)  | `blog_posts`                                   |
| `/admin/faqs`         | FAQ entries                                          | `faqs`                                         |
| `/admin/our-story`    | Story timeline entries                               | `story_timeline`                               |
| `/admin/help-centre`  | Help centre sections and subsections                 | `help_centre_sections`, `help_centre_subsections` |

Most content pages follow the same shape: list → `new` → `[id]/edit`.

**Settings section**

| Page             | Manages                                                        | Table         |
| ---------------- | -------------------------------------------------------------- | ------------- |
| `/admin/users`   | Who can sign in — invite by email, remove access. Also the pool of people tickets can be assigned to | `admin_users` |
| `/admin/account` | Your own password (not in the nav — linked from the sidebar footer) | —         |

See [Managing admin accounts](#managing-admin-accounts) for what an invite
actually does.

**Image uploads** — `POST /admin/api/upload-image` pushes into Supabase Storage
and is used by the TipTap editor and the logo/blog forms.

## Content Command Centre — `/command-centre`

A separate, separately-passworded planning dashboard (shared outside the team, so
it deliberately does not use the admin password). Guarded by the same middleware
with its own cookie and secret; state persists in `command_centre_state`.

## Support Widget

`support-widget/` holds the embeddable widget that posts into
`/api/support/public`. See [`support-widget/README.md`](support-widget/README.md).

## Environment Variables

Set these in `.env.local` locally and in Netlify → Site configuration →
Environment variables for production.

### Supabase (required)

| Variable                        | Notes                                                     |
| ------------------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Project URL                                               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key                                           |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-only — never expose to the browser                 |

### Admin auth (required for `/admin`)

**No env vars.** Sessions are handled by Supabase Auth using the Supabase vars
above, and the allowlist lives in the `admin_users` table, managed at
`/admin/users`. Invite emails go through the Postmark vars below.

Three variables were used by earlier versions and are no longer read anywhere —
delete them from Netlify if they are still set: `ADMIN_PASSWORD` and
`ADMIN_SESSION_SECRET` (the original shared-password scheme) and
`ADMIN_ALLOWED_EMAILS` (the env-based allowlist that the `admin_users` table
replaced).

### Email — Postmark

| Variable                   | Notes                                             |
| -------------------------- | ------------------------------------------------- |
| `POSTMARK_API_KEY`         | Required for demo requests and support email      |
| `POSTMARK_FROM_EMAIL`      | Default `info@generasoftware.com`                 |
| `POSTMARK_TO_EMAIL`        | Default `info@generasoftware.com`                 |
| `POSTMARK_MESSAGE_STREAM`  | Default `outbound`                                |
| `SUPPORT_FROM_EMAIL`       | Sender for support replies                        |
| `SUPPORT_FROM_NAME`        | Display name for support replies                  |
| `SUPPORT_INGEST_TOKEN`     | Shared secret for widget ticket creation          |
| `SUPPORT_INBOUND_SECRET`   | Verifies the Postmark inbound webhook             |
| `SUPPORT_NOTIFY_EMAIL`     | Where new-ticket notifications go                 |

### Analytics — GA4 service account

| Variable          | Notes                                                       |
| ----------------- | ----------------------------------------------------------- |
| `GA4_PROPERTY_ID` | GA4 property to report on                                   |
| `GA_PROJECT_ID`   | Google Cloud project id                                     |
| `GA_CLIENT_EMAIL` | Service account email (grant it Viewer on the GA4 property) |
| `GA_PRIVATE_KEY`  | Service account private key — keep the `\n` escapes         |

### Ask Claude (optional — the feature hides itself if unset)

| Variable                     | Notes                                                    |
| ---------------------------- | -------------------------------------------------------- |
| `ANTHROPIC_API_KEY`          | Anthropic API key                                        |
| `ANTHROPIC_SUPPORT_AGENT_ID` | `agent_…`, created once via the Anthropic CLI            |
| `ANTHROPIC_SUPPORT_ENV_ID`   | `env_…`, created once via the Anthropic CLI              |
| `SUPPORT_REPO_URL`           | `https://github.com/<owner>/genera` — the **app** repo   |
| `SUPPORT_REPO_TOKEN`         | GitHub fine-grained PAT, that repo only, `Contents: Read` |
| `SUPPORT_REPO_BRANCH`        | Optional, defaults to `main`                             |

`SUPPORT_REPO_TOKEN` is minted at GitHub → Settings → Developer settings →
Personal access tokens → Fine-grained tokens: resource owner = the org owning the
app repo, repository access = only that repo, permissions = **Contents: Read-only**
and nothing else. Note the expiry date — the Ask Claude panel simply greys out once
the token lapses. Full setup steps are in [`anthropic/README.md`](anthropic/README.md).

## Database

Migrations live in `supabase/migrations/`, applied in filename order. Generated
types are in `lib/supabase/types.ts` — regenerate them after a schema change
rather than editing by hand. `scripts/seed-help-centre.ts` seeds initial help
centre content.

`admin_users` is the one table with no RLS policies at all: it is reachable only
through the service-role key on the server, plus the `is_current_user_admin()`
security-definer function the Edge middleware calls. Do not add a policy that
lets `anon` or `authenticated` read it — the list of who can administer the site
should not be public.

## Deployment

Netlify, configured by `netlify.toml` — `npm run build`, Node 20,
`@netlify/plugin-nextjs`. CDN caching is set to `no-store` so CMS edits are not
served stale on top of the 60-second ISR revalidation.

## Project Structure

- `app/` — App Router pages, layouts, route handlers
  - `app/(site)/` — public marketing pages
  - `app/admin/` — CMS (login, `(authed)` route group, upload endpoint)
  - `app/command-centre/` — content planning tool
  - `app/api/` — public API routes
  - `app/docs/` — product documentation
- `components/` — shared UI (Navbar, Footer, modals, 404 content)
- `lib/` — `admin/`, `analytics/`, `command-centre/`, `consent/`, `forms/`,
  `supabase/`, `support/`
- `public/` — static assets, images, legacy HTML pages
- `supabase/migrations/` — schema
- `anthropic/` — Ask Claude agent + environment YAML and setup docs
- `support-widget/` — embeddable support widget
- `scripts/` — badge generation, help centre seeding
- `legacy/` — the previous static HTML site, kept for reference

## Notes

- Registration and login links point to `app.generasoftware.com` via `lib/urls.ts`.
- Branded 404 and error boundaries exist for both the site and admin areas
  (`app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`,
  `app/admin/(authed)/not-found.tsx`, `app/admin/(authed)/error.tsx`).
