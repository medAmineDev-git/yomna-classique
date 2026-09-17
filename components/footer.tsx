import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xl font-extrabold tracking-[0.15em] uppercase">
            Yomna <span className="font-light">Fashion</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            La mode simple, livrée chez vous en 24 h. Vous ne payez qu&apos;à la réception.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Boutique</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/categorie/${c.slug}`} className="hover:text-ink">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Aide</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/contact" className="hover:text-ink">
                Nous contacter
              </Link>
            </li>
            <li>Livraison &amp; retours</li>
            <li>Guide des tailles</li>
            <li>Questions fréquentes</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>+216 55 123 456</li>
            <li>contact@yomna-fashion.tn</li>
            <li>Tous les jours, 9 h – 19 h</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Yomna Fashion. Tous droits réservés.</p>
          <p>Paiement à la livraison · Livraison 24 h</p>
        </div>
      </div>
    </footer>
  );
}
