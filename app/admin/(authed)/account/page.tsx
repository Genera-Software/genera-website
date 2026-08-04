import { requireAdminUser } from "@/lib/admin/auth";
import PageHeader from "../_components/PageHeader";
import ChangePasswordForm from "./_components/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireAdminUser();

  return (
    <div>
      <PageHeader
        title="Your account"
        description={`Signed in as ${user.email}.`}
      />

      {user.mustChangePassword && (
        <div className="mb-6 rounded-2xl border border-gold/50 bg-gold/10 px-5 py-4">
          <p className="font-semibold text-ink">Choose your own password</p>
          <p className="mt-1 text-sm text-ink-soft">
            You&rsquo;re signed in with the temporary password we emailed you.
            Set your own to carry on — the rest of the CMS is locked until you
            do.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-teal-mid bg-white p-5">
        <h2 className="mb-4 font-semibold text-ink">Change password</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
