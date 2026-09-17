# Yomna Fashion — boutique en ligne

Boutique de vêtements avec commande par e-mail (pas de paiement en ligne, pas de
panier) et un dashboard pour gérer le catalogue.

- **Front** : Next.js 16 (App Router) + Tailwind 4
- **Base** : Supabase (Postgres) — facultatif, catalogue de démo sinon
- **Mail** : Resend — facultatif, log serveur sinon
- **Hébergement** : Cloudflare Workers via `@opennextjs/cloudflare`

## Démarrer

```bash
npm install
npm run dev
```

→ http://localhost:3000 — le site tourne **sans aucune clé**, sur le catalogue de
démo (41 produits, images libres de droits). Dashboard :
http://localhost:3000/connexion, mot de passe `admin`.

## Les parcours

| Parcours | Chemin |
|---|---|
| Accueil → rayon → fiche produit → commande | `/` → `/categorie/femme` → `/produit/robe-sophie` |
| Gestion : liste → ajouter / modifier / supprimer | `/connexion` → `/admin` |

La commande ne demande rien d'autre que : taille, couleur, quantité, nom,
téléphone, ville, adresse. Elle est enregistrée en base **puis** envoyée par
e-mail au propriétaire. Le prix est toujours relu en base, jamais pris dans le
formulaire.

## Passer en production

### 1. Supabase

Créez un projet, puis collez `supabase/schema.sql` dans le SQL Editor.
Renseignez `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` et
`SUPABASE_SERVICE_ROLE_KEY` — le site bascule automatiquement sur la base.

Pour les images : bucket public `products` dans Supabase Storage, puis collez les
URLs publiques dans le champ « Images » du dashboard.

### 2. Resend

Vérifiez votre domaine dans Resend (quelques enregistrements DNS), puis
renseignez `RESEND_API_KEY`, `OWNER_EMAIL` et `RESEND_FROM`.
Sans domaine vérifié, les mails de commande partent en spam.

### 3. Cloudflare

```bash
npx wrangler login
npm run preview   # teste le build Workers en local
npm run deploy
```

Les secrets ne vont pas dans `wrangler.jsonc` :

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put OWNER_EMAIL
```

Les variables `NEXT_PUBLIC_*` sont inlinées au build : mettez-les dans
`.env.local` (ou dans la config du projet Cloudflare) avant `npm run deploy`.

Enfin, branchez votre nom de domaine : Workers & Pages → le worker `boutique` →
Settings → Domains & Routes → Add custom domain.

## Coûts

Supabase free + Resend free (3 000 mails/mois) + Cloudflare Workers free =
**0 €/mois** jusqu'à un volume déjà confortable.
