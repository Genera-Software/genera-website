"use client";

import { useActionState, useEffect, useRef } from "react";
import { AdminBusyButton } from "../../_components/AdminBusyButton";
import { inviteAdminAction } from "../actions";

export default function InviteAdminForm() {
  const [state, formAction, pending] = useActionState(inviteAdminAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state?.success]);

  return (
    <div className="mb-8 rounded-2xl border border-teal-mid bg-white p-5">
      <h2 className="mb-1 font-semibold text-ink">Add an admin</h2>
      <p className="mb-4 text-sm text-ink-soft">
        They get a temporary password by email and are asked to choose their own
        the first time they sign in.
      </p>

      <form ref={formRef} action={formAction} className="flex flex-wrap gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="name@example.com"
          aria-label="Email address"
          className="min-w-[16rem] flex-1 rounded-lg border border-cream-dark bg-cream px-4 py-2.5 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft/40"
        />
        <AdminBusyButton
          type="submit"
          variant="gold"
          pending={pending}
          pendingLabel="Sending…"
        >
          Send invite
        </AdminBusyButton>
      </form>

      {state?.error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p>{state.error}</p>
          {state.tempPassword && (
            <code className="mt-2 inline-block rounded bg-white px-3 py-2 font-mono text-sm text-ink">
              {state.tempPassword}
            </code>
          )}
        </div>
      )}
      {state?.success && (
        <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {state.success}
        </p>
      )}
    </div>
  );
}
