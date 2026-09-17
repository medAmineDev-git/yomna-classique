import Image from "next/image";
import Link from "next/link";
import { deleteProductAction, logoutAction } from "./actions";
import { dt } from "@/lib/format";
import { listProducts, supabaseEnabled } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata = { title: "Gestion des produits" };

export default async function AdminPage() {
  const products = await listProducts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Produits</h1>
          <p className="mt-1 text-sm text-muted">{products.length} article(s) en ligne</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/produit/nouveau" className="bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-promo">
            Ajouter un produit
          </Link>
          <form action={logoutAction}>
            <button className="border border-line px-4 py-2.5 text-sm hover:border-ink">
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      {!supabaseEnabled && (
        <p className="mt-6 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Mode démo : Supabase n’est pas configuré. Vos ajouts et suppressions fonctionnent, mais
          disparaissent au redémarrage du serveur.
        </p>
      )}

      <div className="mt-8 divide-y divide-line border-y border-line">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 py-4">
            <div className="relative size-16 shrink-0 overflow-hidden bg-sand">
              {p.images[0] && (
                <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.name}</p>
              <p className="mt-0.5 text-xs text-muted">
                {p.category} · {dt(p.price)} · {p.sizes.length} taille(s) · {p.colors.length}{" "}
                couleur(s)
              </p>
            </div>

            <Link
              href={`/admin/produit/${p.id}`}
              className="border border-line px-3 py-1.5 text-xs font-semibold hover:border-ink"
            >
              Modifier
            </Link>

            <form action={deleteProductAction}>
              <input type="hidden" name="id" value={p.id} />
              <button className="border border-line px-3 py-1.5 text-xs font-semibold text-promo hover:border-promo">
                Supprimer
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
