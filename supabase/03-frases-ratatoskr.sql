-- Bifröst · Frases de Ratatoskr (la ardilla de Yggdrasil)
-- Pegalo en Supabase > SQL Editor y ejecutalo una vez (después de 02-blog-comunidad.sql).

create table if not exists public.frases_ratatoskr (
  id uuid primary key default gen_random_uuid(),
  texto text not null check (char_length(texto) between 1 and 140),
  orden int not null default 0,
  activa boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.frases_ratatoskr enable row level security;

drop policy if exists "frases visibles" on public.frases_ratatoskr;
create policy "frases visibles" on public.frases_ratatoskr for select using (activa or public.es_equipo());
drop policy if exists "equipo edita frases" on public.frases_ratatoskr;
create policy "equipo edita frases" on public.frases_ratatoskr for all using (public.es_equipo()) with check (public.es_equipo());

revoke all on public.frases_ratatoskr from anon;
grant select (texto, orden, activa, created_at) on public.frases_ratatoskr to anon;
grant select, insert, update, delete on public.frases_ratatoskr to authenticated;
grant all on public.frases_ratatoskr to service_role;

-- Las frases de la maqueta, para arrancar (solo si la tabla está vacía)
insert into public.frases_ratatoskr (texto, orden)
select texto, orden from (values
  ('No hay sueños ni muy grandes ni muy chicos.', 1),
  ('Cada hoja empezó siendo una pregunta.', 2),
  ('Lo que nombrás empieza a existir.', 3),
  ('Las raíces sostienen lo que las ramas sueñan.', 4),
  ('Un sueño compartido llega más lejos.', 5),
  ('Sin apuro: el árbol crece de a poco.', 6),
  ('Soñar también es un compromiso con vos.', 7)
) as v(texto, orden)
where not exists (select 1 from public.frases_ratatoskr);
