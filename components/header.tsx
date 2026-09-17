import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

const PHONE = "+216 55 123 456";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="overflow-hidden bg-ink py-2 text-[11px] tracking-[0.18em] text-white uppercase">
        <div className="marquee flex w-max gap-12 whitespace-nowrap pr-12">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-12" aria-hidden={copy === 1}>
              <span>Livraison 24 h partout en Tunisie</span>
              <span>Paiement à la livraison</span>
              <span>Échange sous 7 jours</span>
              <span>Livraison offerte dès 150 DT</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
          <Link href="/" className="shrink-0 text-xl font-extrabold tracking-[0.15em] whitespace-nowrap uppercase sm:text-2xl">
            Yomna <span className="font-light">Fashion</span>
          </Link>

          <nav className="hidden gap-8 text-sm font-medium md:flex">
            <Link href="/" className="hover:text-promo">
              Accueil
            </Link>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={`/categorie/${c.slug}`} className="hover:text-promo">
                {c.label}
              </Link>
            ))}
            <Link href="/contact" className="hover:text-promo">
              Contact
            </Link>
          </nav>

          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            className="hidden text-sm font-semibold text-muted sm:block hover:text-ink"
          >
            {PHONE}
          </a>

          {/* Menu mobile sans JavaScript */}
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none p-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 w-48 border border-line bg-white p-2 shadow-lg">
              <Link href="/" className="block px-3 py-2 text-sm hover:bg-sand">
                Accueil
              </Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/categorie/${c.slug}`}
                  className="block px-3 py-2 text-sm hover:bg-sand"
                >
                  {c.label}
                </Link>
              ))}
              <Link href="/contact" className="block px-3 py-2 text-sm hover:bg-sand">
                Contact
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
