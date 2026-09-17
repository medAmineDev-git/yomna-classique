import { Resend } from "resend";
import { getSupabaseAdmin, getSupabase } from "./supabase";
import type { OrderInput } from "./types";

const OWNER_EMAIL = process.env.OWNER_EMAIL;
const FROM_EMAIL = process.env.RESEND_FROM ?? "commandes@exemple.tn";

/**
 * Une commande fait deux choses, dans cet ordre :
 *  1. elle est enregistrée (table `orders`) — le filet de sécurité si le mail se perd ;
 *  2. elle est envoyée par mail au propriétaire — la notification.
 * Sans clés configurées, les deux étapes se contentent d'un log serveur, ce qui
 * permet de tester le parcours de bout en bout sans aucun compte.
 */
export async function submitOrder(order: OrderInput): Promise<void> {
  await saveOrder(order);
  await mailOrder(order);
}

async function saveOrder(order: OrderInput) {
  const db = getSupabaseAdmin() ?? getSupabase();
  if (!db) {
    console.info("[commande] Supabase non configuré, commande non enregistrée :", order);
    return;
  }

  const { error } = await db.from("orders").insert({ ...order, status: "nouvelle" });
  // On ne bloque pas le client si l'enregistrement échoue : le mail reste sa preuve.
  if (error) console.error("[commande] enregistrement échoué :", error.message);
}

async function mailOrder(order: OrderInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !OWNER_EMAIL) {
    console.info("[commande] Resend non configuré, mail non envoyé :\n" + orderText(order));
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    replyTo: OWNER_EMAIL,
    subject: `Nouvelle commande — ${order.product_name} (${order.customer_name})`,
    text: orderText(order),
  });

  if (error) throw new Error(`Envoi du mail impossible : ${error.message}`);
}

function orderText(o: OrderInput) {
  const total = (o.price * o.quantity).toFixed(2);
  return [
    "NOUVELLE COMMANDE",
    "",
    `Produit   : ${o.product_name}`,
    `Taille    : ${o.size}`,
    `Couleur   : ${o.color}`,
    `Quantité  : ${o.quantity}`,
    `Total     : ${total} DT (paiement à la livraison)`,
    "",
    "CLIENT",
    `Nom       : ${o.customer_name}`,
    `Téléphone : ${o.phone}`,
    `Ville     : ${o.city}`,
    `Adresse   : ${o.address}`,
    o.note ? `Remarque  : ${o.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
