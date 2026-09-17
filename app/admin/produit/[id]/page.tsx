import { notFound } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { getProductById } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata = { title: "Modifier un produit" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-extrabold">{product.name}</h1>
      <ProductForm product={product} />
    </div>
  );
}
