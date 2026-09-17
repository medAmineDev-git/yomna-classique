import { MOCK_PRODUCTS } from "./mock-products";
import { getSupabase, getSupabaseAdmin, supabaseEnabled } from "./supabase";
import type { Category, Product } from "./types";

/**
 * Accès au catalogue.
 *
 * Sans Supabase configuré, on travaille sur une copie en mémoire du catalogue
 * de démo : la boutique et le dashboard sont entièrement utilisables tout de
 * suite, mais les ajouts/suppressions repartent à zéro au redémarrage du
 * serveur. Avec Supabase, tout passe par la table `products`.
 */
const memory: Product[] = MOCK_PRODUCTS.map((p) => ({ ...p }));

const TABLE = "products";

export async function listProducts(category?: Category): Promise<Product[]> {
  const db = getSupabase();
  if (!db) {
    const rows = category ? memory.filter((p) => p.category === category) : memory;
    return rows.map((p) => ({ ...p }));
  }

  let query = db.from(TABLE).select("*").order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw new Error(`Lecture des produits impossible : ${error.message}`);
  return (data ?? []) as Product[];
}

export async function getProduct(slug: string): Promise<Product | null> {
  const db = getSupabase();
  if (!db) return memory.find((p) => p.slug === slug) ?? null;

  const { data, error } = await db.from(TABLE).select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Lecture du produit impossible : ${error.message}`);
  return (data as Product) ?? null;
}

export async function getFeatured(limit = 8): Promise<Product[]> {
  const all = await listProducts();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

/** Produits en promo (prix barré renseigné). */
export async function getOnSale(limit = 8): Promise<Product[]> {
  const all = await listProducts();
  return all.filter((p) => p.old_price && p.old_price > p.price).slice(0, limit);
}

export async function createProduct(input: Omit<Product, "id">): Promise<Product> {
  const db = getSupabaseAdmin() ?? getSupabase();
  if (!db) {
    const product: Product = { ...input, id: crypto.randomUUID() };
    memory.unshift(product);
    return product;
  }

  const { data, error } = await db.from(TABLE).insert(input).select().single();
  if (error) throw new Error(`Création impossible : ${error.message}`);
  return data as Product;
}

export async function updateProduct(id: string, input: Partial<Product>): Promise<void> {
  const db = getSupabaseAdmin() ?? getSupabase();
  if (!db) {
    const index = memory.findIndex((p) => p.id === id);
    if (index !== -1) memory[index] = { ...memory[index], ...input };
    return;
  }

  const { error } = await db.from(TABLE).update(input).eq("id", id);
  if (error) throw new Error(`Modification impossible : ${error.message}`);
}

export async function deleteProduct(id: string): Promise<void> {
  const db = getSupabaseAdmin() ?? getSupabase();
  if (!db) {
    const index = memory.findIndex((p) => p.id === id);
    if (index !== -1) memory.splice(index, 1);
    return;
  }

  const { error } = await db.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(`Suppression impossible : ${error.message}`);
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = getSupabase();
  if (!db) return memory.find((p) => p.id === id) ?? null;

  const { data, error } = await db.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Lecture du produit impossible : ${error.message}`);
  return (data as Product) ?? null;
}

export { supabaseEnabled };
