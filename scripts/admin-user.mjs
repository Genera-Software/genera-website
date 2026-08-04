#!/usr/bin/env node
// Break-glass CLI for the /admin allowlist.
//
// Day to day you should manage admins from the CMS itself, at /admin/users —
// that flow also emails the person their temporary password. This script exists
// for the cases the UI can't help with: seeding the very first admin, or getting
// back in when everyone has been locked out.
//
//   npm run admin:user -- add <email> [password]     # allowlist + account
//   npm run admin:user -- password <email> [password]
//   npm run admin:user -- list
//   npm run admin:user -- remove <email>
//
// Omit the password and one is generated and printed. Unlike /admin/users, this
// script does NOT send email — it prints the password for you to pass on.
//
// ⚠ This writes to the LIVE database. It uses NEXT_PUBLIC_SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY from .env to call the Supabase Admin API and the
// public.admin_users table, so `add` and `remove` create and permanently delete
// rows on whichever project those vars point at. There is no staging project.

import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

// Minimal .env loader so the script matches how the app is configured locally.
try {
  for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split("\n")) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    const value = match[2].trim().replace(/^["']|["']$/g, "");
    if (!process.env[match[1]]) process.env[match[1]] = value;
  }
} catch {
  // No .env — fall back to the ambient environment.
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function generatePassword() {
  return randomBytes(18).toString("base64url");
}

function normalise(email) {
  return email.trim().toLowerCase();
}

async function findAuthUser(email) {
  const target = normalise(email);
  // listUsers is paginated; admin counts here are tiny, but page anyway.
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === target);
    if (hit) return hit;
    if (data.users.length < 200) return null;
  }
  return null;
}

async function loadAllowlist() {
  const { data, error } = await supabase
    .from("admin_users")
    .select("email, invited_by, created_at")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

const [command, emailArg, passwordArg] = process.argv.slice(2);

switch (command) {
  case "add": {
    if (!emailArg) throw new Error("Usage: add <email> [password]");
    const email = normalise(emailArg);
    const password = passwordArg || generatePassword();
    const existing = await findAuthUser(email);

    if (existing) {
      const { error } = await supabase.auth.admin.updateUserById(existing.id, {
        password,
        app_metadata: { ...existing.app_metadata, must_change_password: true },
      });
      if (error) throw error;
      console.log(`Reset the existing account for ${email}`);
    } else {
      const { error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { must_change_password: true },
      });
      if (error) throw error;
      console.log(`Created account for ${email}`);
    }

    const { error: rowError } = await supabase
      .from("admin_users")
      .upsert(
        { email, invited_by: "cli", last_invited_at: new Date().toISOString() },
        { onConflict: "email" },
      );
    if (rowError) throw rowError;

    console.log(`Allowlisted ${email}`);
    if (!passwordArg) console.log(`Temporary password: ${password}`);
    console.log("They'll be asked to choose their own password on first sign-in.");
    break;
  }

  case "password": {
    if (!emailArg) throw new Error("Usage: password <email> [password]");
    const email = normalise(emailArg);
    const user = await findAuthUser(email);
    if (!user) {
      console.error(`No account for ${email}`);
      process.exit(1);
    }
    const password = passwordArg || generatePassword();
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password,
      app_metadata: { ...user.app_metadata, must_change_password: true },
    });
    if (error) throw error;
    console.log(`Password reset for ${email}`);
    if (!passwordArg) console.log(`Temporary password: ${password}`);
    break;
  }

  case "remove": {
    if (!emailArg) throw new Error("Usage: remove <email>");
    const email = normalise(emailArg);
    const allowlist = await loadAllowlist();
    if (allowlist.length <= 1 && allowlist.some((row) => row.email === email)) {
      console.error("Refusing to remove the last admin — you'd be locked out.");
      process.exit(1);
    }

    const { error } = await supabase.from("admin_users").delete().eq("email", email);
    if (error) throw error;

    const user = await findAuthUser(email);
    if (user) {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      if (deleteError) throw deleteError;
    }
    console.log(`Removed ${email} from the allowlist and deleted their account.`);
    break;
  }

  case "list": {
    const allowlist = await loadAllowlist();
    if (allowlist.length === 0) {
      console.log("No admins yet — nobody can sign in. Add one with `add`.");
      break;
    }
    const { data: authData, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (error) throw error;

    console.log("Admins (✓ = has a Supabase Auth account):\n");
    for (const row of allowlist) {
      const account = authData.users.find(
        (u) => u.email?.toLowerCase() === row.email,
      );
      const lastSignIn = account?.last_sign_in_at
        ? new Date(account.last_sign_in_at).toISOString().slice(0, 10)
        : "never";
      const temp = account?.app_metadata?.must_change_password === true;
      console.log(
        `  ${account ? "✓" : "✗"} ${row.email}  (added by ${row.invited_by ?? "?"}, last sign-in: ${lastSignIn})${
          temp ? "  [temporary password]" : ""
        }`,
      );
    }

    const orphaned = authData.users.filter(
      (u) => u.email && !allowlist.some((row) => row.email === u.email.toLowerCase()),
    );
    if (orphaned.length > 0) {
      console.log(
        `\nSupabase accounts NOT on the allowlist (cannot sign in): ${orphaned
          .map((u) => u.email)
          .join(", ")}`,
      );
    }
    break;
  }

  default:
    console.error(
      [
        "Break-glass CLI — day to day, manage admins at /admin/users instead.",
        "",
        "Usage:",
        "  npm run admin:user -- add <email> [password]",
        "  npm run admin:user -- password <email> [password]",
        "  npm run admin:user -- list",
        "  npm run admin:user -- remove <email>",
      ].join("\n"),
    );
    process.exit(1);
}
