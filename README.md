# Bifröst · sitio web

Sitio de Bifröst: un puente entre donde estás y donde querés llegar.

Incluye **Inicio**, **Servicios** (Heimdall), **Talleres** (con el botón "Me interesa" para dejar los datos), **Blog**, **Calendario** (con el calendario de Google de Bifröst), **Comunidad** (Yggdrasil y sus tres pozos) y **Hliðskjálf**, el panel del equipo con login. También **Campus** (el espacio de cada participante, con acceso por invitación del equipo) y **Dar por dar** (espacios comunitarios).

Hecho con Next.js (se publica en Vercel) y Supabase (login y base de datos).

---

## Cómo se cuidan los datos

- **El sitio no cobra.** Quien quiere anotarse deja su nombre, email y teléfono en "Me interesa", y el equipo de ventas lo contacta. El cobro online queda para más adelante, cuando esté resuelto lo fiscal.
- **Las claves van en variables de entorno, nunca en el código.** La clave de servicio de Supabase se carga en Vercel. El archivo `.gitignore` impide subir archivos `.env` al repositorio.
- **El panel solo lo usa el equipo.** Hace falta iniciar sesión y que el email esté en la tabla `equipo`. La base tiene reglas de seguridad por filas: el público solo puede leer talleres y eventos publicados.
- **Los formularios tienen protección básica contra robots** (un campo trampa invisible).

Recomendación: activá la verificación en dos pasos en GitHub, Vercel y Supabase.

---

## Puesta en marcha (una sola vez)

### 1. Supabase (base de datos y login)

1. Creá un proyecto en [supabase.com](https://supabase.com) (región São Paulo).
2. En **SQL Editor**, pegá el contenido de [`supabase/schema.sql`](supabase/schema.sql) y ejecutalo. Crea las tablas, las reglas de seguridad y carga los dos talleres.
   - Después, pegá y ejecutá también [`supabase/02-blog-comunidad.sql`](supabase/02-blog-comunidad.sql). Crea las tablas del Blog y de la Comunidad. Y por último [`supabase/03-frases-ratatoskr.sql`](supabase/03-frases-ratatoskr.sql), para editar las frases de la ardilla, y [`supabase/04-contacto.sql`](supabase/04-contacto.sql), para cargar los datos de contacto desde el panel, [`supabase/05-dar-por-dar-y-campus.sql`](supabase/05-dar-por-dar-y-campus.sql), para Dar por dar y el Campus, y [`supabase/06-servicios-e-imagenes.sql`](supabase/06-servicios-e-imagenes.sql), para Servicios y las fotos que se suben desde el panel.
   - Para el Campus, en **Authentication > URL Configuration** poné como **Site URL** la dirección del sitio (por ejemplo `https://bifrostcoaching.vercel.app`) y sumá en **Redirect URLs** `https://bifrostcoaching.vercel.app/campus/bienvenida`.
   - El script agrega `bifrost1203@gmail.com` como integrante del equipo. Para sumar a alguien más: `insert into equipo (email, nombre) values ('email@ejemplo.com', 'Nombre');`
3. En **Authentication > Sign In / Providers**, desactivá **Allow new users to sign up** (así nadie puede crearse una cuenta solo).
4. En **Authentication > Users > Add user**, creá el usuario `bifrost1203@gmail.com` con una contraseña fuerte. Con ese email y contraseña entrás al panel.
5. En **Project Settings > API** copiá: `Project URL`, la clave `anon public` y la clave `service_role` (esta última es secreta).

### 2. Vercel (publicación)

1. Entrá a [vercel.com](https://vercel.com) con tu cuenta de GitHub e importá el repositorio `BifrostCoaching/Bifrost`.
2. En **Settings > Environment Variables** cargá las variables de [`.env.example`](.env.example):

   | Variable | De dónde sale |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | La dirección del sitio, por ejemplo `https://bifrost.vercel.app` (sin barra final) |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase · Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase · anon public |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase · service_role (secreta) |
   | `NEXT_PUBLIC_GOOGLE_CALENDAR_ID` | Ya viene cargado con el calendario de Bifröst |

3. Publicá (**Deploy**). Si después cambiás alguna variable, volvé a publicar.

### 3. Google Calendar

El calendario de Bifröst tiene que estar **público** para que se vea en el sitio: en Google Calendar, Configuración del calendario > Permisos de acceso > **Hacer que esté disponible públicamente**.

---

## Cómo se usa el panel Hliðskjálf

Entrás desde el pie del sitio (**Ingreso del equipo**) o en `/hlidskjalf`.

- **Servicios**: los servicios directos de Bifröst, aparte de los talleres, con sus fotos.
- **Talleres**: creás o editás talleres, subís, ordenás o quitás sus fotos y elegís cuáles se ven en el sitio.
- **Eventos**: actividades sueltas que aparecen en el Calendario, con una foto opcional.
- **Interesados**: quién tocó "Me interesa" y en qué taller. El equipo de ventas marca a cada persona como contactada, inscripta o descartada, y puede dejar notas.
- **Consultas**: los mensajes del formulario de contacto.
- **Contacto**: el email, WhatsApp, Instagram y LinkedIn que aparecen en "¿Hablamos?".
- **Campus**: das acceso a cada participante (se genera un link para mandarle por WhatsApp o email), confirmás inscripciones y cargás los módulos de cada taller con sus clases y materiales. Desde **Interesados** también hay un atajo "Dar acceso al campus".
- **Dar por dar**: publicás los espacios comunitarios que llegan por el formulario y cargás sus convocatorias.
- **Blog**: escribís artículos. Quedan como borrador hasta que tildás "Publicado en el sitio".
- **Comunidad**: lo que deja la gente en Yggdrasil, el pozo de Urd y Hvergelmir se publica enseguida; desde acá lo retirás si no respeta las normas. Las reflexiones del pozo de Mímir esperan que las apruebes. Ahí también está **Frases de Ratatoskr**, para cambiar lo que dice la ardilla.
- **Respaldo**: descarga un archivo con todos los datos del sitio. Conviene bajarlo una vez por mes y guardarlo en un Drive privado (tiene datos personales).

Las fotos se achican solas en el navegador antes de subirse (JPG, PNG o WEBP). Se guardan en la carpeta pública `imagenes` de Supabase Storage; solo el servidor del sitio puede subir o borrar ahí, y lo hace después de comprobar que quien lo pide es del equipo. Los textos de Inicio y Qué hacemos, y las fotos de portada, todavía se cambian en el código.

---

## Para desarrollar

```bash
cp .env.example .env.local   # y completá los valores
npm install
npm run dev                  # http://localhost:3000
```

## Datos pendientes

- Email, WhatsApp e Instagram de contacto de Bifröst: [PENDIENTE] (en `src/lib/site.ts`).
- Cobro online con Mercado Pago: para más adelante, cuando esté resuelto lo fiscal.
- Fechas, modalidad y precio de "El presupuesto como conversación": [PENDIENTE].
