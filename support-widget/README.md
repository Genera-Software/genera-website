# Support widget — for app.generasoftware.com

Two files to copy into the app.generasoftware.com repo:

| File | Where it goes in the app repo |
| --- | --- |
| `SupportWidget.tsx` | `components/SupportWidget.tsx` (client component) |
| `supportProxyRoute.ts` | `app/api/support/proxy/route.ts` (server route) |

## App repo env vars

```
SUPPORT_INGEST_URL=https://generasoftware.com/api/support/tickets
SUPPORT_INGEST_TOKEN=<same value as on the admin>
NEXT_PUBLIC_APP_VERSION=<git sha or release tag>
```

The `NEXT_PUBLIC_APP_VERSION` is what appears on the ticket as "App version".
Wire it into your build (Vercel: `process.env.VERCEL_GIT_COMMIT_SHA`, or set it
in `next.config.js` from `git rev-parse --short HEAD`).

## Mount in layout

```tsx
// app/layout.tsx (app.generasoftware.com)
import SupportWidget from "@/components/SupportWidget";
import { getCurrentUser } from "@/lib/auth"; // however you load the user

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();
  return (
    <html>
      <body>
        {children}
        <SupportWidget
          appVersion={process.env.NEXT_PUBLIC_APP_VERSION ?? "dev"}
          account={
            user
              ? {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  metadata: { plan: user.plan },
                }
              : undefined
          }
        />
      </body>
    </html>
  );
}
```

## Docs suggestions ("this might already answer it")

As the customer types their subject and description, the widget looks for a
Help Centre page that already answers the question and shows up to three above
the send button. The aim is deflection: a lot of tickets are "how do I…", and
the answer is usually already written down.

- Fires on a 450 ms pause once there are 12+ characters, not per keystroke, and
  aborts in-flight requests so a slow response can't overwrite a newer one.
- Calls `GET {docsOrigin}/api/support/suggest?q=…` **directly**, not through the
  proxy — it is public, read-only and CORS-open, and returns nothing but links
  to pages already published at `/docs`. No token, no ticket data.
- Suggestions never block submitting. If the request fails, is blocked, or the
  customer is offline, the form behaves exactly as before.
- "None of these — carry on with my ticket" hides the panel for the rest of that
  ticket, so it can't keep reappearing over the send button.
- The send button reads "Still need help — send ticket" while suggestions are
  showing, which frames sending as the fallback rather than the default.

Set `docsOrigin` if the marketing site is somewhere other than
`https://www.generasoftware.com`, or pass `docsOrigin=""` to turn the feature
off entirely:

```tsx
<SupportWidget appVersion={…} account={…} docsOrigin="https://www.generasoftware.com" />
```

To try it before copying anything into this repo, run the admin site and open
**`/admin/support/preview`** — the same component, mounted with a stubbed submit
endpoint and a set of sample questions. Matching quality is covered by
`npm run check:suggestions` there too.

## What it captures automatically

- Page URL at submission time
- App version (from prop)
- User agent, derived browser + OS
- Viewport size
- Last 10 `window.error` and `unhandledrejection` events (technical tickets only)

## Admin env vars (this repo)

```
SUPPORT_INGEST_TOKEN=<long random string>
SUPPORT_NOTIFY_EMAIL=<your email>          # optional — Postmark notification on new ticket
```

Generate a token: `openssl rand -hex 32`
