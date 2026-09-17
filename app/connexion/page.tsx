"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/app/admin/actions";

const initialState: FormState = { message: "" };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-xl font-extrabold">Espace gestion</h1>
      <p className="mt-1 text-sm text-muted">Réservé au propriétaire de la boutique.</p>

      <form action={formAction} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-xs font-semibold text-muted">Mot de passe</span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            className="mt-1 w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink"
          />
        </label>

        {state.message && (
          <p role="alert" className="text-sm text-promo">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-ink py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
