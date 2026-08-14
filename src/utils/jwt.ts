// src/utils/jwt.ts
//
// Minimal, dependency-free JWT payload reader. We never verify the
// signature client-side (the backend already did that) — this only reads
// claims already trusted because they came back on our own auth token, to
// avoid a second round trip for data the token already carries (e.g. the
// school's own row id as `organization_id`, needed by endpoints that take
// that id in the URL rather than inferring it from the bearer token alone).

/** Decodes a JWT's payload (base64url) into a plain object. Returns null on any malformed/non-JWT input — never throws. */
export function decodeJwtPayload<T = Record<string, unknown>>(token: string | null | undefined): T | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64url = parts[1];
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/** The school's own row id (a.k.a. `organization_id`) baked into every tenant-user's auth token. */
export function getOrganizationIdFromToken(token: string | null | undefined): string | null {
  const payload = decodeJwtPayload<{ organization_id?: string }>(token);
  return payload?.organization_id ?? null;
}
