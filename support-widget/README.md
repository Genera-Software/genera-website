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
