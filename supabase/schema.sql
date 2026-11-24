-- Bifröst · esquema de la base de datos
-- Pegalo entero en Supabase > SQL Editor y ejecutalo una sola vez.

-- ───────────────────────── Equipo ─────────────────────────
-- Solo los emails de esta tabla pueden usar el panel Hliðskjálf.
create table if not exists public.equipo (
  email text primary key,
  nombre text not null default '',
  created_at timestamptz not null default now()
);

create or replace function public.es_equipo()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.equipo
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ───────────────────────── Talleres ─────────────────────────
create table if not exists public.talleres (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre text not null,
  bajada text not null default '',
  descripcion text not null default '',
  detalle text not null default '',
  inicio date,
  fin date,
  modalidad text not null default '',
  encuentros integer,
  tipo text not null default 'pago' check (tipo in ('pago', 'gratuito')),
  precio_texto text not null default '',
  publicado boolean not null default false,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ───────────────────────── Eventos ─────────────────────────
create table if not exists public.eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  organiza text not null default 'Bifröst',
  inicio date,
  fin date,
  modalidad text not null default '',
  tipo text not null default 'gratuito' check (tipo in ('pago', 'gratuito')),
  precio_texto text not null default '',
  descripcion text not null default '',
  publicado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ───────────────────────── Interesados ─────────────────────────
-- Personas que dejaron sus datos en "Me interesa". El equipo de ventas las contacta.
create table if not exists public.interesados (
  id uuid primary key default gen_random_uuid(),
  taller_id uuid references public.talleres (id) on delete set null,
  nombre text not null,
  email text not null,
  telefono text not null default '',
  comentario text not null default '',
  estado text not null default 'nuevo'
    check (estado in ('nuevo', 'contactado', 'inscripto', 'descartado')),
  notas text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists interesados_taller_idx on public.interesados (taller_id);

-- ───────────────────────── Consultas (formulario de contacto) ─────────────────────────
create table if not exists public.consultas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  motivo text not null default '',
  mensaje text not null,
  leida boolean not null default false,
  created_at timestamptz not null default now()
);

-- ───────────────────────── updated_at automático ─────────────────────────
create or replace function public.tocar_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists talleres_updated on public.talleres;
create trigger talleres_updated before update on public.talleres
  for each row execute function public.tocar_updated_at();
drop trigger if exists eventos_updated on public.eventos;
create trigger eventos_updated before update on public.eventos
  for each row execute function public.tocar_updated_at();
drop trigger if exists interesados_updated on public.interesados;
create trigger interesados_updated before update on public.interesados
  for each row execute function public.tocar_updated_at();

-- ───────────────────────── Seguridad por filas (RLS) ─────────────────────────
-- El público solo puede LEER talleres y eventos publicados.
-- Interesados y consultas los escribe el servidor del sitio; solo el equipo las lee.
alter table public.equipo enable row level security;
alter table public.talleres enable row level security;
alter table public.eventos enable row level security;
alter table public.interesados enable row level security;
alter table public.consultas enable row level security;

drop policy if exists "equipo se ve a sí mismo" on public.equipo;
create policy "equipo se ve a sí mismo" on public.equipo
  for select using (public.es_equipo());

drop policy if exists "talleres publicados" on public.talleres;
create policy "talleres publicados" on public.talleres
  for select using (publicado or public.es_equipo());
drop policy if exists "equipo edita talleres" on public.talleres;
create policy "equipo edita talleres" on public.talleres
  for all using (public.es_equipo()) with check (public.es_equipo());

drop policy if exists "eventos publicados" on public.eventos;
create policy "eventos publicados" on public.eventos
  for select using (publicado or public.es_equipo());
drop policy if exists "equipo edita eventos" on public.eventos;
create policy "equipo edita eventos" on public.eventos
  for all using (public.es_equipo()) with check (public.es_equipo());

drop policy if exists "equipo gestiona interesados" on public.interesados;
create policy "equipo gestiona interesados" on public.interesados
  for all using (public.es_equipo()) with check (public.es_equipo());

drop policy if exists "equipo gestiona consultas" on public.consultas;
create policy "equipo gestiona consultas" on public.consultas
  for all using (public.es_equipo()) with check (public.es_equipo());

-- ───────────────────────── Datos iniciales ─────────────────────────
-- El email del equipo: cambialo o sumá más filas si hace falta.
insert into public.equipo (email, nombre) values
  ('bifrost1203@gmail.com', 'Marcos')
on conflict (email) do nothing;

insert into public.talleres
  (slug, nombre, bajada, descripcion, detalle, inicio, fin, modalidad, encuentros, tipo, precio_texto, publicado, orden)
values
  (
    'vestirse-tambien-es-comunicar',
    'Vestirse también es comunicar',
    'Taller de imagen y coaching · en alianza con Benaroma',
    'La forma en que nos vestimos habla antes que nosotros. Juntamos imagen y coaching para descubrir por qué tu ropa te abre o te cierra puertas, y para que tu imagen muestre quién querés ser, sin reglas rígidas.',
    E'Mar 15/12 · Apreciatividad\nMié 16/12 · Los bordes\nJue 17/12 · Seguridad\nSáb 19/12 · Creatividad y autenticidad (presencial)\n\nLo dictan Silvia (Benaroma) y Marcos.',
    '2026-12-15', '2026-12-19',
    '3 encuentros virtuales por Zoom, de 19 a 21:30 h, y 1 presencial con brunch',
    4, 'pago',
    '$115.000 transferencia o efectivo · $127.000 con tarjeta, hasta 3 cuotas sin interés',
    true, 1
  ),
  (
    'el-presupuesto-como-conversacion',
    'El presupuesto como conversación',
    'La importancia del presupuesto',
    'Un presupuesto no es solo una planilla: refleja prioridades, decisiones y compromisos. Aprendemos a armarlo, sostenerlo y usarlo para decidir con más claridad, tanto en lo personal como en lo empresarial.',
    E'Vas a trabajar:\n· Cómo ordenar ingresos, gastos y prioridades.\n· Cómo convertir el presupuesto en una herramienta para decidir.\n· Las conversaciones (con vos, tu familia o tu equipo) que hacen que se cumpla.',
    null, null, '', null, 'pago', '',
    true, 2
  )
on conflict (slug) do nothing;
