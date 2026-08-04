"use client";

import { useActionState } from "react";
import { AdminBusyButton } from "../../_components/AdminBusyButton";
import { removeAdminAction } from "../actions";

export default function RemoveAdminButton({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(removeAdminAction, null);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (
          !confirm(
            `Remove ${email}? They lose access immediately and their account is deleted.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="email" value={email} />
      <AdminBusyButton
        type="submit"
        variant="outlineDangerSm"
        pending={pending}
        pendingLabel="Removing…"
      >
        Remove
      </AdminBusyButton>
      {state?.error && (
        <p className="mt-1 text-xs text-red-700">{state.error}</p>
      )}
    </form>
  );
}
