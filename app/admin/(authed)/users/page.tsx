import { listAdminUsers } from "@/lib/admin/allowlist";
import { requireAdminUser } from "@/lib/admin/auth";
import PageHeader from "../_components/PageHeader";
import InviteAdminForm from "./_components/InviteAdminForm";
import RemoveAdminButton from "./_components/RemoveAdminButton";

export const dynamic = "force-dynamic";

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminUsersPage() {
  const [currentUser, admins] = await Promise.all([
    requireAdminUser(),
    listAdminUsers(),
  ]);

  return (
    <div>
      <PageHeader
        title="Admin users"
        description="Everyone who can sign in to this CMS. Removing someone here locks them out on their next request."
      />

      <InviteAdminForm />

      <div className="overflow-hidden rounded-2xl border border-teal-mid bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Added by</th>
              <th className="px-5 py-3">Added</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {admins.map((admin) => {
              const isSelf =
                admin.email.toLowerCase() === currentUser.email.toLowerCase();
              return (
                <tr key={admin.id} className="hover:bg-cream">
                  <td className="px-5 py-3 align-middle font-medium text-ink">
                    {admin.email}
                    {isSelf && (
                      <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink">
                        You
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 align-middle text-ink-soft">
                    {admin.invited_by ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 align-middle text-ink-soft">
                    {formatDate(admin.created_at)}
                  </td>
                  <td className="px-5 py-3 text-right align-middle">
                    {isSelf ? (
                      <span className="text-xs text-ink-soft/70">
                        Can&rsquo;t remove yourself
                      </span>
                    ) : (
                      <div className="flex justify-end">
                        <RemoveAdminButton email={admin.email} />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-ink-soft">
        Adding someone creates their Supabase Auth account and emails a temporary
        password. Removing someone deletes both their allowlist entry and their
        account. The last remaining admin can&rsquo;t be removed.
      </p>
    </div>
  );
}
