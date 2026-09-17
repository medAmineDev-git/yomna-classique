"use server";

import { getProductById } from "@/lib/products";
import { submitOrder } from "@/lib/orders";

export type OrderState = { ok: boolean; message: string };

const PHONE_RE = /^[0-9+\s]{8,15}$/;

export async function placeOrder(
  _prev: OrderState,
  formData: FormData,
): Promise<OrderState> {
  const get = (key: string) => String(formData.get(key) ?? "").trim();

  const productId = get("product_id");
  // Le prix vient toujours de la base, jamais du formulaire : sinon n'importe
  // qui peut commander à 1 DT en modifiant le HTML.
  const product = await getProductById(productId);
  if (!product) return { ok: false, message: "Produit introuvable." };

  const customer_name = get("customer_name");
  const phone = get("phone");
  const city = get("city");
  const address = get("address");
  const size = get("size");
  const color = get("color");
  const quantity = Math.min(Math.max(Number(get("quantity")) || 1, 1), 20);

  if (customer_name.length < 3) return { ok: false, message: "Merci d’indiquer votre nom complet." };
  if (!PHONE_RE.test(phone)) return { ok: false, message: "Numéro de téléphone invalide." };
  if (!city) return { ok: false, message: "Merci d’indiquer votre ville." };
  if (address.length < 8) return { ok: false, message: "Adresse trop courte pour le livreur." };
  if (product.sizes.length > 0 && !product.sizes.includes(size))
    return { ok: false, message: "Merci de choisir une taille." };
  if (product.colors.length > 0 && !product.colors.some((c) => c.label === color))
    return { ok: false, message: "Merci de choisir une couleur." };

  try {
    await submitOrder({
      product_id: product.id,
      product_name: product.name,
      size,
      color,
      quantity,
      price: product.price,
      customer_name,
      phone,
      city,
      address,
      note: get("note"),
    });
  } catch (error) {
    console.error("[commande] échec :", error);
    return {
      ok: false,
      message: "Impossible d’enregistrer la commande. Appelez-nous au +216 55 123 456.",
    };
  }

  return {
    ok: true,
    message: "Commande reçue ! Nous vous appelons dans l’heure pour confirmer.",
  };
}
