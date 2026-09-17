export type Category = "femme" | "homme" | "enfant" | "accessoires";

export const CATEGORIES: { slug: Category; label: string }[] = [
  { slug: "femme", label: "Femme" },
  { slug: "homme", label: "Homme" },
  { slug: "enfant", label: "Enfant" },
  { slug: "accessoires", label: "Accessoires" },
];

export type Color = { label: string; hex: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  /** Prix de vente, en dinars. */
  price: number;
  /** Prix barré. `null` = pas de promo. */
  old_price: number | null;
  description: string;
  images: string[];
  /** Champ libre : "S, M, L" ou "38, 40, 42" ou "Taille unique". */
  sizes: string[];
  colors: Color[];
  featured: boolean;
};

export type OrderInput = {
  product_id: string;
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  note: string;
};
