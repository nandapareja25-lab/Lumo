/**
 * Gate temporal del panel /admin mientras no existe auth real (26-AUTH-MODERNO.md, Sesión 4/6).
 * Un solo password compartido en ADMIN_PASSWORD — reemplazar por Supabase Auth + rol admin
 * cuando se conecten los servicios externos. No usar este patrón para nada que no sea
 * este panel interno de un solo administrador (el dueño de la app).
 *
 * Usa Web Crypto (SubtleCrypto) en vez de el módulo `crypto` de Node porque el middleware
 * corre en Edge Runtime, que no soporta módulos nativos de Node.
 */

export const ADMIN_COOKIE = "lumo_admin_session";

function adminSecret(): string | null {
  return process.env.ADMIN_PASSWORD ?? null;
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function sessionTokenFor(password: string): Promise<string> {
  return hmacSha256Hex(password, "lumo-admin");
}

export async function isCorrectPassword(candidate: string): Promise<boolean> {
  const secret = adminSecret();
  if (!secret) return false;
  const expected = await sessionTokenFor(secret);
  const actual = await sessionTokenFor(candidate);
  return expected === actual;
}

/** null si ADMIN_PASSWORD no está configurado — el middleware lo trata como "sin acceso". */
export async function validSessionToken(): Promise<string | null> {
  const secret = adminSecret();
  return secret ? sessionTokenFor(secret) : null;
}
