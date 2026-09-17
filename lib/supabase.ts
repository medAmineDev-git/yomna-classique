import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Supabase n'est pas obligatoire pour faire tourner le site : sans variables
 * d'environnement, tout le catalogue vient de `mock-products.ts`. Dès que les
 * deux clés sont renseignées, la boutique bascule automatiquement sur la base.
 */
export const supabaseEnabled = Boolean(url && anonKey);

export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/** Client avec la service_role key : à n'utiliser QUE côté serveur (admin). */
export function getSupabaseAdmin(): SupabaseClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
