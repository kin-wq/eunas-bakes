/**
 * Phase 7 — admin authentication primitives.
 * Password gate with HMAC-signed session cookies. WebCrypto only, so the same
 * verify function runs in `src/proxy.ts` and in Server Actions.
 */

export const ADMIN_COOKIE = "eunas_admin";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function adaptiveEquals(a: string, b: string): boolean {
  // Constant-time comparison over the shared length; length itself is not secret.
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hmacHex(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export type AdminConfig = {
  enabled: boolean;
  password: string;
  secret: string;
};

/**
 * Reads admin credentials from the environment. Admin is DISABLED unless
 * EUNAS_ADMIN_PASSWORD is set. Set both vars in hosting env; use .env.local
 * for local development only (never commit it).
 */
export function getAdminConfig(): AdminConfig {
  const password = process.env.EUNAS_ADMIN_PASSWORD ?? "";
  const secret = process.env.EUNAS_ADMIN_SECRET ?? "";
  return {
    enabled: password.length >= 8,
    password,
    // Fallback keeps dev usable; production must set EUNAS_ADMIN_SECRET.
    secret: secret || `dev-only:${password}`,
  };
}

export async function hashPassword(password: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`eunas-bakes-admin:${password}`)
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(
  password: string,
  config: AdminConfig
): Promise<boolean> {
  if (!config.enabled) return false;
  const [a, b] = await Promise.all([
    hashPassword(password),
    hashPassword(config.password),
  ]);
  return adaptiveEquals(a, b);
}

/** Create a signed session token: "<expiryMs>.<hmac>". */
export async function createSessionToken(secret: string): Promise<string> {
  const exp = String(Date.now() + SESSION_TTL_MS);
  const sig = await hmacHex(secret, exp);
  return `${exp}.${sig}`;
}

/** Validate a session token's signature and expiry. */
export async function verifySessionToken(
  token: string,
  secret: string
): Promise<boolean> {
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp)) return false;
  if (Number(exp) < Date.now()) return false;
  const expected = await hmacHex(secret, exp);
  return adaptiveEquals(sig, expected);
}
