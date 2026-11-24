-- Bifröst · Blog y Comunidad
-- Pegalo en Supabase > SQL Editor y ejecutalo una vez (después de schema.sql).

-- ───────── Blog: artículos que escribe el equipo ─────────
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  tema text not null default 'Lenguaje',
  resumen text not null default '',
  texto text not null default '',
  publicado boolean not null default false,
  fecha date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ───────── Comunidad ─────────
-- autor: un código anónimo del navegador de quien publicó, para que pueda borrar lo suyo.
-- estado: 'publicado' se ve en el sitio; 'pendiente' espera revisión del equipo; 'oculto' lo retiró el equipo.

-- Yggdrasil: los sueños colgados en el árbol
create table if not exists public.suenos (
  id uuid primary key default gen_random_uuid(),
  texto text not null check (char_length(texto) <= 60),
  autor text not null default '',
  estado text not null default 'publicado' check (estado in ('publicado', 'pendiente', 'oculto')),
  created_at timestamptz not null default now()
);

-- El pozo de Urd: experiencias de los talleres
create table if not exists public.experiencias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null default '',
  taller text not null default '',
  tipo text not null default 'Lo que me llevé',
  texto text not null check (char_length(texto) <= 220),
  autor text not null default '',
  estado text not null default 'publicado' check (estado in ('publicado', 'pendiente', 'oculto')),
  created_at timestamptz not null default now()
);

-- El pozo de Mímir: reflexiones (siempre pasan por revisión)
create table if not exists public.reflexiones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null default '',
  titulo text not null default '',
  texto text not null check (char_length(texto) <= 3000),
  autor text not null default '',
  estado text not null default 'pendiente' check (estado in ('publicado', 'pendiente', 'oculto')),
  created_at timestamptz not null default now()
);

-- Hvergelmir: temas del foro
create table if not exists public.foro (
  id uuid primary key default gen_random_uuid(),
  tema text not null default 'General',
  nombre text not null default '',
  titulo text not null check (char_length(titulo) <= 70),
  texto text not null default '',
  autor text not null default '',
  estado text not null default 'publicado' check (estado in ('publicado', 'pendiente', 'oculto')),
  created_at timestamptz not null default now()
);

drop trigger if exists posts_updated on public.posts;
create trigger posts_updated before update on public.posts
  for each row execute function public.tocar_updated_at();

alter table public.posts enable row level security;
alter table public.suenos enable row level security;
alter table public.experiencias enable row level security;
alter table public.reflexiones enable row level security;
alter table public.foro enable row level security;

-- El público lee solo lo publicado (sin el código de autor). El equipo ve y edita todo.
drop policy if exists "posts publicados" on public.posts;
create policy "posts publicados" on public.posts for select using (publicado or public.es_equipo());
drop policy if exists "equipo edita posts" on public.posts;
create policy "equipo edita posts" on public.posts for all using (public.es_equipo()) with check (public.es_equipo());

drop policy if exists "suenos visibles" on public.suenos;
create policy "suenos visibles" on public.suenos for select using (estado = 'publicado' or public.es_equipo());
drop policy if exists "equipo modera suenos" on public.suenos;
create policy "equipo modera suenos" on public.suenos for all using (public.es_equipo()) with check (public.es_equipo());

drop policy if exists "experiencias visibles" on public.experiencias;
create policy "experiencias visibles" on public.experiencias for select using (estado = 'publicado' or public.es_equipo());
drop policy if exists "equipo modera experiencias" on public.experiencias;
create policy "equipo modera experiencias" on public.experiencias for all using (public.es_equipo()) with check (public.es_equipo());

drop policy if exists "reflexiones visibles" on public.reflexiones;
create policy "reflexiones visibles" on public.reflexiones for select using (estado = 'publicado' or public.es_equipo());
drop policy if exists "equipo modera reflexiones" on public.reflexiones;
create policy "equipo modera reflexiones" on public.reflexiones for all using (public.es_equipo()) with check (public.es_equipo());

drop policy if exists "foro visible" on public.foro;
create policy "foro visible" on public.foro for select using (estado = 'publicado' or public.es_equipo());
drop policy if exists "equipo modera foro" on public.foro;
create policy "equipo modera foro" on public.foro for all using (public.es_equipo()) with check (public.es_equipo());

-- Permisos: el público solo puede leer. Lo que manda la gente lo guarda el servidor del sitio.
revoke all on public.suenos, public.experiencias, public.reflexiones, public.foro from anon;
grant select (id, texto, estado, created_at) on public.suenos to anon;
grant select (id, nombre, taller, tipo, texto, estado, created_at) on public.experiencias to anon;
grant select (id, nombre, titulo, texto, estado, created_at) on public.reflexiones to anon;
grant select (id, tema, nombre, titulo, texto, estado, created_at) on public.foro to anon;
grant select on public.posts to anon;
grant select, insert, update, delete on public.posts, public.suenos, public.experiencias, public.reflexiones, public.foro to authenticated;
grant all on public.posts, public.suenos, public.experiencias, public.reflexiones, public.foro to service_role;

-- Artículos de ejemplo (quedan sin publicar: los publicás desde el panel cuando tengan texto)
insert into public.posts (slug, titulo, tema, resumen, publicado) values
  ('el-lenguaje-no-describe-genera', 'El lenguaje no describe: genera', 'Lenguaje', '[PENDIENTE] Resumen del artículo.', false),
  ('lo-que-la-emocion-hace-posible', 'Lo que la emoción hace posible', 'Emociones', '[PENDIENTE] Resumen del artículo.', false),
  ('liderar-es-abrir-posibilidades', 'Liderar es abrir posibilidades', 'Liderazgo', '[PENDIENTE] Resumen del artículo.', false),
  ('todo-comunica-incluso-el-silencio', 'Todo comunica, incluso el silencio', 'Sistemas', '[PENDIENTE] Resumen del artículo.', false),
  ('lo-que-tu-ropa-dice-antes-que-vos', 'Lo que tu ropa dice antes que vos', 'Imagen', '[PENDIENTE] Resumen del artículo.', false),
  ('un-presupuesto-tambien-es-una-conversacion', 'Un presupuesto también es una conversación', 'Presupuesto', '[PENDIENTE] Resumen del artículo.', false)
on conflict (slug) do nothing;
