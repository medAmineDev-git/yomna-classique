import { cookies } from "next/headers";

export const SESSION_COOKIE = "yomna_admin";

/**
 * Authentification volontairement minimale : un seul mot de passe, stocké dans
 * ADMIN_PASSWORD, et un cookie httpOnly qui contient sa signature. Suffisant
 * pour un dashboard à un seul utilisateur ; à remplacer par Supabase Auth le
 * jour où plusieurs personnes doivent y accéder.
 */
async function token(): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD ?? "admin";
  const bytes = new TextEncoder().encode(`yomna:${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signIn(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD ?? "admin";
  if (password !== expected) return false;

  const store = await cookies();
  store.set(SESSION_COOKIE, await token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return true;
}

export async function signOut() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === (await token());
}

/**
 * À appeler au début de CHAQUE Server Action du dashboard : le layout protège
 * les pages, pas les actions, qui restent joignables par un POST direct.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Accès refusé.");
}
