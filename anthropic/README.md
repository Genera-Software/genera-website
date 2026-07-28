# Ask Claude — support ticket repo analysis

An admin viewing a support ticket can press **Ask Claude**. That clones the
Genera app repo into an Anthropic-hosted sandbox and has a read-only agent trace
the reported problem through the real source, then writes the diagnosis back
onto the ticket for internal eyes only.

Nothing runs on this server and nothing runs on anyone's laptop.

## How it fits together

```
admin presses "Ask Claude"
  └─ askClaude()                      app/admin/(authed)/support/actions.ts
      └─ startTicketAnalysis()        lib/support/ai-analysis.ts
          ├─ redacts the ticket       (customer identity dropped, free text scrubbed)
          └─ POST /v1/sessions        agent + environment + github_repository resource
                                      → stores session id, returns in ~1s

  … agent works for a few minutes on Anthropic's side …

admin (or the page's own poll) loads the ticket
  └─ reconcileTicketAnalysis()        lib/support/ai-analysis.ts
      └─ session idle? → read final agent message → save to support_tickets.ai_suggestion
```

The reconcile-on-view design means there is **no webhook to register and no cron
to run**. If the admin closes the tab mid-run, the result simply lands the next
time anyone opens that ticket.

## One-time setup

### 1. Install the Anthropic CLI

```sh
brew install anthropics/tap/ant
xattr -d com.apple.quarantine "$(brew --prefix)/bin/ant"
ant auth login
```

### 2. Create the agent and environment

These are persistent, versioned resources — create them **once** and reuse the
IDs forever. Never create them per request.

```sh
cd anthropic

AGENT_ID=$(ant beta:agents create < support-analyst.agent.yaml --transform id -r)
ENV_ID=$(ant beta:environments create < support-analyst.environment.yaml --transform id -r)

echo "ANTHROPIC_SUPPORT_AGENT_ID=$AGENT_ID"
echo "ANTHROPIC_SUPPORT_ENV_ID=$ENV_ID"
```

To change the prompt or tools later, edit the YAML and **update** rather than
creating a second agent (each update is a new immutable version):

```sh
ant beta:agents retrieve --agent-id "$AGENT_ID" --transform version -r   # current version
ant beta:agents update --agent-id "$AGENT_ID" --version <N> < support-analyst.agent.yaml
```

### 3. Mint a read-only GitHub token

A **fine-grained** personal access token, scoped to the `genera` repository
only, with a single permission:

- `Contents: Read`

Nothing more. The agent explains fixes; it does not open pull requests. The
token is never placed inside the sandbox — Anthropic injects it at an
outbound git proxy, so code running in the container cannot read it.

### 4. Set the environment variables

On Netlify (Site configuration → Environment variables), and in `.env.local` for
local development:

| Variable                     | Value                                                |
| ---------------------------- | ---------------------------------------------------- |
| `ANTHROPIC_API_KEY`          | Anthropic API key                                    |
| `ANTHROPIC_SUPPORT_AGENT_ID` | `agent_…` from step 2                                |
| `ANTHROPIC_SUPPORT_ENV_ID`   | `env_…` from step 2                                  |
| `SUPPORT_REPO_URL`           | `https://github.com/<owner>/genera`                  |
| `SUPPORT_REPO_TOKEN`         | the read-only PAT from step 3                        |
| `SUPPORT_REPO_BRANCH`        | optional, defaults to `main`                         |

Until all five required variables are present the ticket page shows the section
greyed out with a note, rather than failing at click time.

### 5. Apply the migration

`supabase/migrations/20260726120000_support_ticket_ai_analysis.sql` — adds the
`ai_*` columns to `support_tickets`.

## What gets sent to Anthropic

Redaction lives in `redactTicket()` in `lib/support/ai-analysis.ts`.

**Dropped entirely:** `account_email`, `account_name`, `account_id`, the whole
email conversation thread, internal notes, and any `account_metadata` key whose
name matches `email|phone|name|address|token|secret|key|password`.

**Scrubbed** (in subject, description, metadata values and console errors):
email addresses, phone numbers, and any token-like string of 40+ characters —
API keys, JWTs, session cookies. The 40-character floor deliberately preserves
UUIDs, which are useful identifiers rather than secrets. Query strings are
stripped from `page_url` since they can carry tokens.

**Sent:** the scrubbed subject and description, category, page path, app
version, browser/OS/viewport, non-sensitive account configuration, and captured
console errors.

A personal name typed into free text cannot be caught by pattern, so the prompt
also instructs the agent to ignore any personal detail it encounters and keep it
out of the report. Treat that as defence in depth, not a guarantee — the
redaction functions have unit-test-shaped behaviour and are the place to tighten
if a new field starts carrying customer data.

Note that Anthropic's Managed Agents run under standard API data-retention
terms; the repository contents pass through their infrastructure for the life of
the session.

## Cost and safety

- **Per-ticket, admin-triggered.** Deliberately not automatic on ticket
  creation — a repo-exploring session at `effort: high` is a real cost, in the
  region of tens of cents to a couple of dollars depending on how much it reads.
  Lower `effort` to `medium` in the agent YAML if that adds up.
- **Internal only.** The suggestion renders in the admin UI with a warning and
  is never included in a customer reply. Keep it that way.
- **Read-only, twice over.** `write` and `edit` are disabled on the agent, and
  the GitHub token cannot write.
- **Prompt injection.** A ticket is untrusted text written by a customer. The
  sandbox has no egress and no write access, so the worst case is a wasted run
  and a misleading report — which is why the UI tells the admin to verify before
  acting.

## Alternatives considered

- **GitHub Actions + `claude-code-action`** — cheaper (uses Actions minutes) and
  can open a PR, but needs a workflow file, a `repository_dispatch` round trip
  and a callback endpoint. Worth revisiting if "suggest a fix" ever becomes
  "open the fix".
- **Messages API + GitHub MCP connector** — no clone, no sandbox, cheapest; but
  materially weaker at anything needing multi-file tracing, which is most real
  tickets.
- **Anthropic webhooks** (`session.status_idled`) instead of reconcile-on-view —
  would land results instantly rather than on next view. Endpoint registration
  is Console-only, so it was skipped as configuration that buys little here.
  Drop-in later if the wait becomes annoying.
