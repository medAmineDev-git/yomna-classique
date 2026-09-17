"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, signIn, signOut } from "@/lib/auth";
import { parseList, slugify } from "@/lib/format";
import { createProduct, deleteProduct, updateProduct } from "@/lib/products";
import type { Category, Color } from "@/lib/types";

export type FormState = { message: string };

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const ok = await signIn(String(formData.get("password") ?? ""));
  if (!ok) return { message: "Mot de passe incorrect." };
  redirect("/admin");
}

export async function logoutAction() {
  await signOut();
  redirect("/connexion");
}

/** "Noir #111111, Beige #d9c7ae" → [{label, hex}] — hex facultatif. */
function parseColors(input: string): Color[] {
  return parseList(input).map((entry) => {
    const match = entry.match(/^(.*?)\s*(#[0-9a-fA-F]{3,8})?$/);
    return {
      label: (match?.[1] ?? entry).trim(),
      hex: match?.[2] ?? "#cccccc",
    };
  });
}

function readForm(formData: FormData) {
  const get = (key: string) => String(formData.get(key) ?? "").trim();
  const name = get("name");
  const oldPrice = Number(get("old_price"));

  return {
    name,
    slug: get("slug") || slugify(name),
    category: get("category") as Category,
    price: Number(get("price")),
    old_price: Number.isFinite(oldPrice) && oldPrice > 0 ? oldPrice : null,
    description: get("description"),
    images: parseList(get("images")),
    sizes: parseList(get("sizes")),
    colors: parseColors(get("colors")),
    featured: formData.get("featured") === "on",
  };
}

export async function saveProductAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const input = readForm(formData);

  if (!input.name) return { message: "Le nom est obligatoire." };
  if (!Number.isFinite(input.price) || input.price <= 0)
    return { message: "Le prix doit être un nombre supérieur à 0." };
  if (input.images.length === 0)
    return { message: "Ajoutez au moins une URL d’image." };

  try {
    if (id) await updateProduct(id, input);
    else await createProduct(input);
  } catch (error) {
    return { message: error instanceof Error ? error.message : "Enregistrement impossible." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  await deleteProduct(String(formData.get("id") ?? ""));
  revalidatePath("/admin");
  revalidatePath("/");
}
