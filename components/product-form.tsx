"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProductAction, type FormState } from "@/app/admin/actions";
import { CATEGORIES, type Product } from "@/lib/types";

const initialState: FormState = { message: "" };

export function ProductForm({ product }: { product?: Product }) {
  const [state, formAction, pending] = useActionState(saveProductAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      <Row>
        <Text name="name" label="Nom du produit" defaultValue={product?.name} required />
        <Select name="category" label="Catégorie" defaultValue={product?.category}>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </Select>
      </Row>

      <Row>
        <Text
          name="price"
          label="Prix (DT)"
          type="number"
          step="0.1"
          min="0"
          defaultValue={product?.price}
          required
        />
        <Text
          name="old_price"
          label="Prix barré (DT) — vide si pas de promo"
          type="number"
          step="0.1"
          min="0"
          defaultValue={product?.old_price ?? ""}
        />
      </Row>

      <Area
        name="description"
        label="Description"
        rows={4}
        defaultValue={product?.description}
      />

      <Area
        name="images"
        label="Images"
        hint="Une URL par ligne. La première sert de photo principale."
        rows={4}
        defaultValue={product?.images.join("\n")}
        required
      />

      <Row>
        <Area
          name="sizes"
          label="Tailles"
          hint="Champ libre, séparé par des virgules : S, M, L — ou 38, 40, 42"
          rows={2}
          defaultValue={product?.sizes.join(", ")}
        />
        <Area
          name="colors"
          label="Couleurs"
          hint="Nom + code couleur facultatif : Noir #111111, Beige #d9c7ae"
          rows={2}
          defaultValue={product?.colors.map((c) => `${c.label} ${c.hex}`).join(", ")}
        />
      </Row>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={product?.featured}
          className="size-4"
        />
        Mettre en avant sur la page d’accueil
      </label>

      {state.message && (
        <p role="alert" className="border-l-4 border-promo bg-promo/5 px-3 py-2 text-sm text-promo">
          {state.message}
        </p>
      )}

      <div className="flex gap-3 border-t border-line pt-6">
        <button
          type="submit"
          disabled={pending}
          className="bg-ink px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        <Link href="/admin" className="border border-line px-6 py-3 text-sm font-semibold">
          Annuler
        </Link>
      </div>
    </form>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 sm:grid-cols-2">{children}</div>;
}

function Label({ label, hint }: { label: string; hint?: string }) {
  return (
    <>
      <span className="text-xs font-semibold text-muted">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-muted/80">{hint}</span>}
    </>
  );
}

const field = "mt-1 w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink";

function Text({
  name,
  label,
  ...rest
}: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <Label label={label} />
      <input name={name} className={field} {...rest} />
    </label>
  );
}

function Area({
  name,
  label,
  hint,
  ...rest
}: { name: string; label: string; hint?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <Label label={label} hint={hint} />
      <textarea name={name} className={field} {...rest} />
    </label>
  );
}

function Select({
  name,
  label,
  children,
  ...rest
}: { name: string; label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <Label label={label} />
      <select name={name} className={field} {...rest}>
        {children}
      </select>
    </label>
  );
}
