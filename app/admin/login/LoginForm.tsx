"use client";

import { useActionState } from "react";
import { AdminBusyButton } from "../(authed)/_components/AdminBusyButton";
import { loginAction } from "./actions";

export default function LoginForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="from" value={from} />
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-cream-dark"
        >
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="w-full rounded-lg border border-forest-mid bg-forest-dark px-4 py-3 text-base text-white placeholder-ink-soft outline-none ring-0 focus:border-gold focus:ring-2 focus:ring-gold-soft/40"
        />
      </div>
      {state?.error && (
        <p className="rounded-md border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      <AdminBusyButton
        type="submit"
        variant="goldLg"
        pending={pending}
        pendingLabel="Signing in…"
      >
        Sign in
      </AdminBusyButton>
    </form>
  );
}
