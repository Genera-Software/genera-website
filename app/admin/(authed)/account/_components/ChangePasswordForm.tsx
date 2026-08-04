"use client";

import { useActionState } from "react";
import { AdminBusyButton } from "../../_components/AdminBusyButton";
import { changePasswordAction } from "../actions";

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePasswordAction,
    null,
  );

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          className="w-full rounded-lg border border-cream-dark bg-cream px-4 py-2.5 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/40"
        />
        <p className="mt-1 text-xs text-ink-soft">At least 12 characters.</p>
      </div>

      <div>
        <label
          htmlFor="confirm"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Confirm new password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          className="w-full rounded-lg border border-cream-dark bg-cream px-4 py-2.5 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/40"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <AdminBusyButton
        type="submit"
        variant="gold"
        pending={pending}
        pendingLabel="Saving…"
      >
        Save password
      </AdminBusyButton>
    </form>
  );
}
