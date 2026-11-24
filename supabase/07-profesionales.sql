-- Bifröst · Profesionales (los Vanir)
-- Pegalo en Supabase > SQL Editor y ejecutalo una vez.

create table if not exists public.profesionales (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  oficio text not null default '',
  descripcion text not null default '',
  contacto text not null default '',
  imagen text not null default '',
  publicado boolean not null default false,
  orden int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profesionales enable row level security;
drop policy if exists "profesionales publicados" on public.profesionales;
create policy "profesionales publicados" on public.profesionales for select using (publicado or public.es_equipo());
drop policy if exists "equipo edita profesionales" on public.profesionales;
create policy "equipo edita profesionales" on public.profesionales for all using (public.es_equipo()) with check (public.es_equipo());

grant select on public.profesionales to anon;
grant select, insert, update, delete on public.profesionales to authenticated;
grant all on public.profesionales to service_role;
