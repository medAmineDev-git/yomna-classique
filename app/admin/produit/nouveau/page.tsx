import { ProductForm } from "@/components/product-form";

export const metadata = { title: "Nouveau produit" };

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-extrabold">Nouveau produit</h1>
      <ProductForm />
    </div>
  );
}
