import Image from "next/image";
import Link from "next/link";
import { dt, discount } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const off = discount(product.price, product.old_price);

  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {off !== null && (
          <span className="absolute top-3 left-3 bg-promo px-2 py-1 text-[11px] font-bold text-white">
            −{off}%
          </span>
        )}
      </div>

      <div className="pt-3">
        <h3 className="text-sm font-medium">{product.name}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-bold">{dt(product.price)}</span>
          {off !== null && (
            <span className="text-xs text-muted line-through">{dt(product.old_price!)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="py-16 text-center text-sm text-muted">Aucun produit pour le moment.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
