"use client";

import { useActionState, useState } from "react";
import { placeOrder, type OrderState } from "@/app/actions";
import { dt } from "@/lib/format";
import type { Product } from "@/lib/types";

const initialState: OrderState = { ok: false, message: "" };

export function OrderForm({ product }: { product: Product }) {
  const [state, formAction, pending] = useActionState(placeOrder, initialState);
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0]?.label ?? "");
  const [quantity, setQuantity] = useState(1);

  if (state.ok) {
    return (
      <div className="border border-ink bg-sand p-8 text-center">
        <p className="text-lg font-bold">Merci !</p>
        <p className="mt-2 text-sm text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="product_id" value={product.id} />

      {product.sizes.length > 0 && (
        <Field label="Taille">
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`min-w-14 border px-3 py-2 text-sm ${
                  s === size ? "border-ink bg-ink text-white" : "border-line hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <input type="hidden" name="size" value={size} />
        </Field>
      )}

      {product.colors.length > 0 && (
        <Field label={`Couleur : ${color}`}>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => setColor(c.label)}
                title={c.label}
                aria-label={c.label}
                className={`size-9 rounded-full border-2 ${
                  c.label === color ? "border-ink" : "border-line"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <input type="hidden" name="color" value={color} />
        </Field>
      )}

      <Field label="Quantité">
        <div className="flex w-32 items-center border border-line">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-2 text-lg leading-none hover:bg-sand"
            aria-label="Retirer un article"
          >
            −
          </button>
          <span className="flex-1 text-center text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="px-4 py-2 text-lg leading-none hover:bg-sand"
            aria-label="Ajouter un article"
          >
            +
          </button>
        </div>
        <input type="hidden" name="quantity" value={quantity} />
      </Field>

      <div className="border-t border-line pt-6">
        <p className="text-sm font-bold">Vos coordonnées</p>
        <p className="mt-1 text-xs text-muted">
          Pas de compte à créer. Vous payez au livreur, à la réception.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input name="customer_name" label="Nom et prénom" required autoComplete="name" />
          <Input
            name="phone"
            label="Téléphone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="55 123 456"
          />
          <Input name="city" label="Ville" required autoComplete="address-level2" />
          <Input name="address" label="Adresse complète" required autoComplete="street-address" />
        </div>

        <label className="mt-4 block">
          <span className="text-xs font-semibold text-muted">Remarque (facultatif)</span>
          <textarea
            name="note"
            rows={2}
            className="mt-1 w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink"
          />
        </label>
      </div>

      {state.message && !state.ok && (
        <p role="alert" className="border-l-4 border-promo bg-promo/5 px-3 py-2 text-sm text-promo">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ink py-4 text-sm font-bold tracking-wide text-white uppercase hover:bg-promo disabled:opacity-50"
      >
        {pending ? "Envoi…" : `Commander — ${dt(product.price * quantity)}`}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted uppercase">{label}</p>
      {children}
    </div>
  );
}

function Input({
  name,
  label,
  ...rest
}: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted">{label}</span>
      <input
        name={name}
        className="mt-1 w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink"
        {...rest}
      />
    </label>
  );
}
