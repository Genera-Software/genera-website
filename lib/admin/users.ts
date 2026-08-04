import "server-only";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { sendPostmarkEmail } from "@/lib/forms/delivery";
import { MUST_CHANGE_PASSWORD_CLAIM } from "./auth";
import { countAdminUsers, normaliseEmail } from "./allowlist";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.generasoftware.com";

/**
 * Temporary password for a new admin. Long and random — it only has to survive
 * one sign-in, after which `must_change_password` forces a replacement.
 */
function generateTempPassword(): string {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "A").replace(/\//g, "B").replace(/=/g, "");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function findAuthUserByEmail(email: string) {
  const supabase = getAdminSupabase();
  const target = normaliseEmail(email);
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw new Error(error.message);
    const hit = data.users.find((u) => u.email?.toLowerCase() === target);
    if (hit) return hit;
    if (data.users.length < 200) return null;
  }
  return null;
}

async function sendTempPasswordEmail(opts: {
  to: string;
  tempPassword: string;
  invitedBy: string;
  isReset: boolean;
}) {
  const loginUrl = `${SITE_URL.replace(/\/$/, "")}/admin/login`;
  const heading = opts.isReset
    ? "Your Genera CMS password has been reset"
    : "You've been given access to the Genera CMS";
  const lead = opts.isReset
    ? `${escapeHtml(opts.invitedBy)} reset your password. Sign in with the temporary password below — you'll be asked to choose a new one straight away.`
    : `${escapeHtml(opts.invitedBy)} added you to the Genera CMS. Sign in with the temporary password below — you'll be asked to choose a new one straight away.`;

  const htmlBody = `
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:520px;color:#1c2b2d;line-height:1.55">
      <h1 style="font-size:20px;margin:0 0 16px">${escapeHtml(heading)}</h1>
      <p style="margin:0 0 16px">${lead}</p>
      <p style="margin:0 0 8px"><strong>Email</strong><br>${escapeHtml(opts.to)}</p>
      <p style="margin:0 0 20px"><strong>Temporary password</strong><br>
        <code style="display:inline-block;margin-top:4px;padding:10px 14px;background:#f4f1e8;border-radius:8px;font-size:16px;letter-spacing:0.5px">${escapeHtml(opts.tempPassword)}</code>
      </p>
      <p style="margin:0 0 24px">
        <a href="${loginUrl}" style="display:inline-block;background:#f0a830;color:#1c2b2d;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:8px">Sign in to the CMS</a>
      </p>
      <p style="margin:0;font-size:13px;color:#5c6b6d">This password only works until you set your own. If you weren't expecting this email, ignore it and let us know.</p>
    </div>
  `.trim();

  const textBody = [
    heading,
    "",
    opts.isReset
      ? `${opts.invitedBy} reset your password.`
      : `${opts.invitedBy} added you to the Genera CMS.`,
    "Sign in with the temporary password below — you'll be asked to choose a new one straight away.",
    "",
    `Email: ${opts.to}`,
    `Temporary password: ${opts.tempPassword}`,
    "",
    `Sign in: ${loginUrl}`,
    "",
    "This password only works until you set your own.",
  ].join("\n");

  return sendPostmarkEmail({
    to: opts.to,
    subject: heading,
    htmlBody,
    textBody,
  });
}

export type InviteResult = {
  email: string;
  emailed: boolean;
  emailError: string | null;
  /** Only populated when the email could not be sent, so the inviter can pass it on. */
  tempPassword: string | null;
};

/**
 * Adds an admin: creates (or resets) their Supabase Auth account with a
 * temporary password, adds them to the allowlist, and emails the password.
 */
export async function inviteAdminUser(opts: {
  email: string;
  invitedBy: string;
}): Promise<InviteResult> {
  const email = normaliseEmail(opts.email);
  const supabase = getAdminSupabase();
  const tempPassword = generateTempPassword();

  const existing = await findAuthUserByEmail(email);
  if (existing) {
    // Address already has a Supabase account — reuse it rather than failing, so
    // re-adding someone who was previously removed just works.
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      password: tempPassword,
      app_metadata: {
        ...existing.app_metadata,
        [MUST_CHANGE_PASSWORD_CLAIM]: true,
      },
    });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      app_metadata: { [MUST_CHANGE_PASSWORD_CLAIM]: true },
    });
    if (error) throw new Error(error.message);
  }

  const { error: rowError } = await supabase.from("admin_users").upsert(
    {
      email,
      invited_by: opts.invitedBy,
      last_invited_at: new Date().toISOString(),
    },
    { onConflict: "email" },
  );
  if (rowError) throw new Error(rowError.message);

  const sent = await sendTempPasswordEmail({
    to: email,
    tempPassword,
    invitedBy: opts.invitedBy,
    isReset: Boolean(existing),
  });

  return {
    email,
    emailed: sent.ok,
    emailError: sent.error,
    tempPassword: sent.ok ? null : tempPassword,
  };
}

/**
 * Removes an admin. Deletes the allowlist row — which locks them out on their
 * next request — and deletes the Supabase Auth account so a stale password
 * can't be reused if they're re-added later.
 */
export async function removeAdminUser(email: string): Promise<void> {
  const target = normaliseEmail(email);

  if ((await countAdminUsers()) <= 1) {
    throw new Error(
      "Cannot remove the last admin — add someone else first, or you'll be locked out.",
    );
  }

  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("admin_users")
    .delete()
    .eq("email", target);
  if (error) throw new Error(error.message);

  // Hand their open tickets back to the pool rather than leaving them assigned
  // to someone who can no longer sign in. Completed tickets keep the name as a
  // record of who handled them.
  const { error: unassignError } = await supabase
    .from("support_tickets")
    .update({ assigned_to: null })
    .eq("assigned_to", target)
    .neq("status", "completed");
  if (unassignError) throw new Error(unassignError.message);

  const authUser = await findAuthUserByEmail(target);
  if (authUser) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      authUser.id,
    );
    if (deleteError) throw new Error(deleteError.message);
  }
}

/** Clears the forced-password-change flag once someone has set their own. */
export async function clearMustChangePassword(userId: string): Promise<void> {
  const supabase = getAdminSupabase();
  const { data, error: readError } =
    await supabase.auth.admin.getUserById(userId);
  if (readError) throw new Error(readError.message);

  const appMetadata = { ...(data.user?.app_metadata ?? {}) };
  delete appMetadata[MUST_CHANGE_PASSWORD_CLAIM];

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: { ...appMetadata, [MUST_CHANGE_PASSWORD_CLAIM]: false },
  });
  if (error) throw new Error(error.message);
}
