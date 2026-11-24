-- Bifröst · Servicios e imágenes desde el panel
-- Pegalo en Supabase > SQL Editor y ejecutalo una vez.

-- Imágenes de talleres y eventos (links a las fotos que sube el equipo).
alter table public.talleres add column if not exists imagenes text[] not null default '{}';
alter table public.eventos add column if not exists imagen text not null default '';

-- Servicios directos de Bifröst (aparte de los talleres).
create table if not exists public.servicios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  bajada text not null default '',
  descripcion text not null default '',
  para_quien text not null default '',
  modalidad text not null default '',
  precio_texto text not null default '',
  imagenes text[] not null default '{}',
  publicado boolean not null default false,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.servicios enable row level security;
drop policy if exists "servicios publicados" on public.servicios;
create policy "servicios publicados" on public.servicios for select using (publicado or public.es_equipo());
drop policy if exists "equipo edita servicios" on public.servicios;
create policy "equipo edita servicios" on public.servicios for all using (public.es_equipo()) with check (public.es_equipo());

grant select on public.servicios to anon;
grant select, insert, update, delete on public.servicios to authenticated;
grant all on public.servicios to service_role;

-- Carpeta pública para las fotos. Se pueden ver desde el sitio; solo el servidor del sitio puede subir o borrar.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imagenes', 'imagenes', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
