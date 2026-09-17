import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { OrderForm } from "@/components/order-form";
import { ProductGrid } from "@/components/product-card";
import { dt, discount } from "@/lib/format";
import { getProduct, listProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product?.name ?? "Produit" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const off = discount(product.price, product.old_price);
  const category = CATEGORIES.find((c) => c.slug === product.category);
  const siblings = (await listProducts(product.category))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-xs text-muted">
        <Link href="/" className="hover:text-ink">
          Accueil
        </Link>
        {category && (
          <>
            {" / "}
            <Link href={`/categorie/${category.slug}`} className="hover:text-ink">
              {category.label}
            </Link>
          </>
        )}
        {" / "}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <Gallery images={product.images} alt={product.name} />

        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{product.name}</h1>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{dt(product.price)}</span>
            {off !== null && (
              <>
                <span className="text-base text-muted line-through">{dt(product.old_price!)}</span>
                <span className="bg-promo px-2 py-0.5 text-xs font-bold text-white">−{off}%</span>
              </>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted">{product.description}</p>

          <ul className="mt-5 space-y-1 text-xs text-muted">
            <li>✓ Livraison sous 24 h partout en Tunisie</li>
            <li>✓ Paiement à la livraison</li>
            <li>✓ Échange sous 7 jours</li>
          </ul>

          <div className="mt-8">
            <OrderForm product={product} />
          </div>
        </div>
      </div>

      {siblings.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-xl font-extrabold">Ça peut vous plaire</h2>
          <ProductGrid products={siblings} />
        </section>
      )}
    </div>
  );
}
