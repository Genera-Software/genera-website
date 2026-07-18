// Web Crypto–based session helpers for the Content Command Centre login.
// Deliberately separate from lib/admin/session.ts: this password is shared
// with Duncan for content planning, and should not also unlock the website
// CMS (blog/FAQ/logo editing).

const COOKIE_NAME = "genera_ccc_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const ALGO = { name: "HMAC", hash: "SHA-256" } as const;

function getSecret(): string {
  const secret = process.env.CCC_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "CCC_SESSION_SECRET env var is missing or too short (min 16 chars)",
    );
  }
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromBase64Url(input: string): Uint8Array {
  const padded = input + "=".repeat((4 - (input.length % 4)) % 4);
  const std = padded.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(std);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function strToBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    strToBytes(getSecret()),
    ALGO,
    false,
    ["sign", "verify"],
  );
}

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a[i] ^ b[i];
  return result === 0;
}

export type CccSession = {
  iat: number;
  exp: number;
  jti: string;
};

export async function createSessionToken(): Promise<{
  value: string;
  maxAge: number;
}> {
  const now = Math.floor(Date.now() / 1000);
  const jtiBytes = new Uint8Array(8);
  crypto.getRandomValues(jtiBytes);
  const session: CccSession = {
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
    jti: toBase64Url(jtiBytes),
  };
  const payload = toBase64Url(strToBytes(JSON.stringify(session)));
  const key = await getKey();
  const sigBytes = new Uint8Array(
    await crypto.subtle.sign(ALGO, key, strToBytes(payload)),
  );
  return {
    value: `${payload}.${toBase64Url(sigBytes)}`,
    maxAge: SESSION_TTL_SECONDS,
  };
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;

  const key = await getKey();
  const expected = new Uint8Array(
    await crypto.subtle.sign(ALGO, key, strToBytes(payload)),
  );
  const provided = fromBase64Url(signature);
  if (!timingSafeEqualBytes(expected, provided)) return false;

  try {
    const json = new TextDecoder().decode(fromBase64Url(payload));
    const session = JSON.parse(json) as CccSession;
    if (typeof session.exp !== "number") return false;
    return session.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.CCC_PASSWORD;
  if (!expected) {
    throw new Error("CCC_PASSWORD env var is not set");
  }
  const a = strToBytes(input);
  const b = strToBytes(expected);
  return timingSafeEqualBytes(a, b);
}

export const CCC_COOKIE_NAME = COOKIE_NAME;
