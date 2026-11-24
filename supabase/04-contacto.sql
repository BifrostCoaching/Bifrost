-- Bifröst · Datos de contacto editables desde el panel
-- Pegalo en Supabase > SQL Editor y ejecutalo una vez.

create table if not exists public.ajustes (
  clave text primary key,
  valor text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.ajustes enable row level security;

drop policy if exists "ajustes visibles" on public.ajustes;
create policy "ajustes visibles" on public.ajustes for select using (true);
drop policy if exists "equipo edita ajustes" on public.ajustes;
create policy "equipo edita ajustes" on public.ajustes for all using (public.es_equipo()) with check (public.es_equipo());

revoke all on public.ajustes from anon;
grant select (clave, valor) on public.ajustes to anon;
grant select, insert, update, delete on public.ajustes to authenticated;
grant all on public.ajustes to service_role;

insert into public.ajustes (clave, valor) values
  ('email', ''), ('whatsapp', ''), ('instagram', ''), ('linkedin', '')
on conflict (clave) do nothing;
