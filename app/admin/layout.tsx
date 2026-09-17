import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

/**
 * Seule porte d'entrée du dashboard. Chaque Server Action revérifie de son côté
 * avec `requireAdmin()` : une action reste joignable par un POST direct, sans
 * jamais passer par ce layout.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/connexion");
  return <>{children}</>;
}
