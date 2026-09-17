import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product-card";
import { listProducts } from "@/lib/products";
import { CATEGORIES, type Category } from "@/lib/types";

export const dynamic = "force-dynamic";

function findCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = findCategory(slug);
  return { title: category ? category.label : "Catégorie" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = findCategory(slug);
  if (!category) notFound();

  const products = await listProducts(slug as Category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-extrabold sm:text-3xl">{category.label}</h1>
      <p className="mt-1 mb-10 text-sm text-muted">
        {products.length} article{products.length > 1 ? "s" : ""}
      </p>
      <ProductGrid products={products} />
    </div>
  );
}
