import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-card";
import { getFeatured, getOnSale, listProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/types";

// Le catalogue est lu en base à chaque visite : pas de page figée au build.
export const dynamic = "force-dynamic";

const CATEGORY_COVERS: Record<string, string> = {
  femme: "https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/1.webp",
  homme: "https://cdn.dummyjson.com/product-images/mens-shirts/blue-%26-black-check-shirt/1.webp",
  enfant: "https://cdn.dummyjson.com/product-images/tops/tartan-dress/1.webp",
  accessoires: "https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/1.webp",
};

export default async function HomePage() {
  const [featured, onSale, all] = await Promise.all([
    getFeatured(8),
    getOnSale(8),
    listProducts(),
  ]);

  return (
    <>
      <Hero />

      <Section title="Nos rayons">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/categorie/${c.slug}`} className="group relative block">
              <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                <Image
                  src={CATEGORY_COVERS[c.slug]}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-4">
                  <span className="text-lg font-bold text-white">{c.label}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        title="Nouveautés"
        link={{ href: "/categorie/femme", label: "Tout voir" }}
      >
        <ProductGrid products={featured} />
      </Section>

      <div id="promos" className="scroll-mt-24 bg-sand py-2">
        <Section
          title="Jusqu’à −50 %"
          subtitle="Une sélection à prix cassé, tant qu’il y en a."
        >
          <ProductGrid products={onSale} />
        </Section>
      </div>

      <Section title="Tout le catalogue">
        <ProductGrid products={all.slice(0, 12)} />
      </Section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3">
          {[
            ["Livraison 24 h", "Partout en Tunisie, colis suivi et livreur qui appelle avant de passer."],
            ["Paiement à la livraison", "Vous payez au facteur, une fois le colis entre vos mains."],
            ["Échange sous 7 jours", "Mauvaise taille ? On repasse l’échanger, sans discussion."],
          ].map(([title, text]) => (
            <div key={title}>
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Section({
  title,
  subtitle,
  link,
  children,
}: {
  title: string;
  subtitle?: string;
  link?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {link && (
          <Link href={link.href} className="text-sm font-semibold underline underline-offset-4">
            {link.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
