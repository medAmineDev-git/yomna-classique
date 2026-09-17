/** 29.9 → "29,900 DT" (les prix tunisiens s'affichent avec 3 décimales). */
export function dt(value: number): string {
  return `${value.toFixed(3).replace(".", ",")} DT`;
}

/** 29.9 et 47.8 → "-37%" */
export function discount(price: number, oldPrice: number | null): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round((1 - price / oldPrice) * 100);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** "S, M, L" → ["S", "M", "L"] — champ libre côté admin. */
export function parseList(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
