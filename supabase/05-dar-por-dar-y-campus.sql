-- Bifröst · Dar por dar (Gefn) y Campus (Midgard)
-- Pegalo en Supabase > SQL Editor y ejecutalo una vez.

-- ═════════ Dar por dar ═════════

-- Espacios comunitarios. Los que llegan por el formulario quedan 'pendiente' hasta que el equipo los publica.
create table if not exists public.espacios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 1 and 120),
  tipo text not null default 'Otro',
  zona text not null default '',
  contacto text not null default '',
  descripcion text not null default '',
  estado text not null default 'pendiente' check (estado in ('publicado', 'pendiente', 'oculto')),
  created_at timestamptz not null default now()
);

-- Convocatorias: jornadas, colectas y actividades de cada espacio. Las carga el equipo.
create table if not exists public.convocatorias (
  id uuid primary key default gen_random_uuid(),
  espacio_id uuid not null references public.espacios(id) on delete cascade,
  titulo text not null,
  inicio date,
  fin date,
  necesita text not null default '',
  publicado boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.espacios enable row level security;
alter table public.convocatorias enable row level security;

drop policy if exists "espacios visibles" on public.espacios;
create policy "espacios visibles" on public.espacios for select using (estado = 'publicado' or public.es_equipo());
drop policy if exists "equipo edita espacios" on public.espacios;
create policy "equipo edita espacios" on public.espacios for all using (public.es_equipo()) with check (public.es_equipo());

drop policy if exists "convocatorias visibles" on public.convocatorias;
create policy "convocatorias visibles" on public.convocatorias for select using (
  (publicado and exists (select 1 from public.espacios e where e.id = espacio_id and e.estado = 'publicado')) or public.es_equipo()
);
drop policy if exists "equipo edita convocatorias" on public.convocatorias;
create policy "equipo edita convocatorias" on public.convocatorias for all using (public.es_equipo()) with check (public.es_equipo());

revoke all on public.espacios, public.convocatorias from anon;
grant select (id, nombre, tipo, zona, contacto, descripcion, estado, created_at) on public.espacios to anon;
grant select on public.convocatorias to anon;
grant select, insert, update, delete on public.espacios, public.convocatorias to authenticated;
grant all on public.espacios, public.convocatorias to service_role;

-- ═════════ Campus ═════════

-- Participantes: personas que el equipo invitó al campus (su id es el de su usuario).
create table if not exists public.participantes (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  nombre text not null default '',
  created_at timestamptz not null default now()
);

-- Inscripciones a talleres: 'pendiente' hasta que el equipo confirma (el pago, si corresponde).
create table if not exists public.inscripciones (
  id uuid primary key default gen_random_uuid(),
  participante_id uuid not null references public.participantes(id) on delete cascade,
  taller_id uuid not null references public.talleres(id) on delete cascade,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'confirmada', 'cancelada')),
  created_at timestamptz not null default now(),
  unique (participante_id, taller_id)
);

-- Módulos de cada taller, con sus clases y materiales (uno por línea).
create table if not exists public.modulos (
  id uuid primary key default gen_random_uuid(),
  taller_id uuid not null references public.talleres(id) on delete cascade,
  numero int not null default 1,
  titulo text not null,
  clases text not null default '',
  materiales text not null default '',
  created_at timestamptz not null default now()
);

-- Módulos que cada participante marcó como completados (hacen crecer su árbol).
create table if not exists public.avances (
  participante_id uuid not null references public.participantes(id) on delete cascade,
  modulo_id uuid not null references public.modulos(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (participante_id, modulo_id)
);

-- Agenda personal.
create table if not exists public.agenda (
  id uuid primary key default gen_random_uuid(),
  participante_id uuid not null references public.participantes(id) on delete cascade,
  texto text not null check (char_length(texto) between 1 and 80),
  cuando text not null default 'semana' check (cuando in ('semana', 'mes', 'anio', 'largo')),
  created_at timestamptz not null default now()
);

alter table public.participantes enable row level security;
alter table public.inscripciones enable row level security;
alter table public.modulos enable row level security;
alter table public.avances enable row level security;
alter table public.agenda enable row level security;

-- Cada participante ve solo lo suyo; el equipo ve todo. Lo que cambia la gente lo guarda el servidor.
drop policy if exists "participante se ve" on public.participantes;
create policy "participante se ve" on public.participantes for select using (id = auth.uid() or public.es_equipo());
drop policy if exists "equipo edita participantes" on public.participantes;
create policy "equipo edita participantes" on public.participantes for all using (public.es_equipo()) with check (public.es_equipo());

drop policy if exists "inscripciones propias" on public.inscripciones;
create policy "inscripciones propias" on public.inscripciones for select using (participante_id = auth.uid() or public.es_equipo());
drop policy if exists "equipo edita inscripciones" on public.inscripciones;
create policy "equipo edita inscripciones" on public.inscripciones for all using (public.es_equipo()) with check (public.es_equipo());

-- Los módulos los ve quien tiene la inscripción confirmada a ese taller.
drop policy if exists "modulos de mis talleres" on public.modulos;
create policy "modulos de mis talleres" on public.modulos for select using (
  public.es_equipo() or exists (
    select 1 from public.inscripciones i
    where i.taller_id = modulos.taller_id and i.participante_id = auth.uid() and i.estado = 'confirmada'
  )
);
drop policy if exists "equipo edita modulos" on public.modulos;
create policy "equipo edita modulos" on public.modulos for all using (public.es_equipo()) with check (public.es_equipo());

drop policy if exists "avances propios" on public.avances;
create policy "avances propios" on public.avances for select using (participante_id = auth.uid() or public.es_equipo());
drop policy if exists "agenda propia" on public.agenda;
create policy "agenda propia" on public.agenda for select using (participante_id = auth.uid());

revoke all on public.participantes, public.inscripciones, public.modulos, public.avances, public.agenda from anon;
grant select on public.participantes, public.inscripciones, public.modulos, public.avances, public.agenda to authenticated;
grant insert, update, delete on public.participantes, public.inscripciones, public.modulos to authenticated;
grant all on public.participantes, public.inscripciones, public.modulos, public.avances, public.agenda to service_role;
