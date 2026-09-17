/**
 * Remplit la table `products` de Supabase avec le catalogue de démo.
 *
 *   node --env-file=.env.local scripts/seed.mjs
 *
 * Relançable sans risque : les produits sont écrasés sur leur `slug`.
 * Supprimez-les ensuite un par un depuis /admin quand vous ajoutez les vrais.
 */
import { createClient } from "@supabase/supabase-js";
import { MOCK_PRODUCTS } from "../lib/mock-products.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont nécessaires.\n" +
      "Renseignez-les dans .env.local, puis :\n" +
      "  node --env-file=.env.local scripts/seed.mjs",
  );
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

// `id` est généré par Postgres : on ne pousse pas ceux du catalogue de démo.
const rows = MOCK_PRODUCTS.map(({ id, ...product }) => product);

const { data, error } = await db
  .from("products")
  .upsert(rows, { onConflict: "slug" })
  .select("slug");

if (error) {
  console.error("Échec :", error.message);
  process.exit(1);
}

console.log(`${data.length} produits insérés ou mis à jour.`);
