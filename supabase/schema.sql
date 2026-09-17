-- À coller dans Supabase > SQL Editor, une seule fois.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('femme', 'homme', 'enfant', 'accessoires')),
  price numeric(10, 3) not null,
  old_price numeric(10, 3),
  description text not null default '',
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  -- [{"label": "Noir", "hex": "#111111"}]
  colors jsonb not null default '[]',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products (id) on delete set null,
  product_name text not null,
  size text,
  color text,
  quantity int not null default 1,
  price numeric(10, 3) not null,
  customer_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  note text,
  status text not null default 'nouvelle',
  created_at timestamptz not null default now()
);

-- Sécurité : la boutique lit les produits avec la clé anon, rien d'autre.
-- Les écritures (admin, commandes) passent par la clé service_role côté serveur,
-- qui contourne RLS.
alter table products enable row level security;
alter table orders enable row level security;

create policy "produits visibles par tous"
  on products for select
  using (true);

-- Aucune policy sur `orders` : personne ne peut les lire ni les écrire
-- depuis le navigateur.
