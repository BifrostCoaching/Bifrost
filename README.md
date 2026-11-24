# Bifröst · sitio web

Sitio de Bifröst: un puente entre donde estás y donde querés llegar.

Esta primera etapa incluye **Inicio**, **Talleres** (con inscripción y cobro por Mercado Pago), **Calendario** (con el calendario de Google de Bifröst) y **Hliðskjálf**, el panel del equipo con login. Comunidad y Campus vienen en la etapa siguiente.

Hecho con Next.js (se publica en Vercel) y Supabase (login y base de datos).

---

## Cómo se protege el dinero y los datos

- **Los datos de tarjeta nunca pasan por este sitio.** Usamos Mercado Pago Checkout Pro: cuando alguien se inscribe, el sitio lo manda a la página de Mercado Pago, paga ahí y vuelve. Bifröst nunca ve ni guarda números de tarjeta.
- **Las claves van en variables de entorno, nunca en el código.** El Access Token de Mercado Pago y la clave de servicio de Supabase se cargan en Vercel. El archivo `.gitignore` impide subir archivos `.env` al repositorio.
- **Una inscripción se confirma solo cuando Mercado Pago lo dice.** El aviso de pago se verifica con la firma secreta de Mercado Pago y, además, el sitio le consulta el pago directamente a Mercado Pago y controla que el monto coincida.
- **El panel solo lo usa el equipo.** Hace falta iniciar sesión y que el email esté en la tabla `equipo`. La base tiene reglas de seguridad por filas: el público solo puede leer talleres y eventos publicados.
- **Los formularios tienen protección básica contra robots** (un campo trampa invisible).

Recomendaciones: activá la verificación en dos pasos en Mercado Pago, GitHub, Vercel y Supabase, y no compartas las claves por chat ni por email.

---

## Puesta en marcha (una sola vez)

### 1. Supabase (base de datos y login)

1. Creá un proyecto en [supabase.com](https://supabase.com) (región São Paulo).
2. En **SQL Editor**, pegá el contenido de [`supabase/schema.sql`](supabase/schema.sql) y ejecutalo. Crea las tablas, las reglas de seguridad y carga los dos talleres.
   - El script agrega `bifrost1203@gmail.com` como integrante del equipo. Para sumar a alguien más: `insert into equipo (email, nombre) values ('email@ejemplo.com', 'Nombre');`
3. En **Authentication > Sign In / Providers**, desactivá **Allow new users to sign up** (así nadie puede crearse una cuenta solo).
4. En **Authentication > Users > Add user**, creá el usuario `bifrost1203@gmail.com` con una contraseña fuerte. Con ese email y contraseña entrás al panel.
5. En **Project Settings > API** copiá: `Project URL`, la clave `anon public` y la clave `service_role` (esta última es secreta).

### 2. Mercado Pago

1. Entrá a [Tus integraciones](https://www.mercadopago.com.ar/developers/panel/app) y creá una aplicación (tipo: pagos online, Checkout Pro).
2. En **Credenciales de producción**, copiá el **Access Token** (es secreto).
3. En **Webhooks > Configurar notificaciones**:
   - URL de producción: `https://TU-DOMINIO/api/mercadopago/webhook`
   - Evento: **Pagos**
   - Guardá y copiá la **clave secreta** que te muestra.

> Para probar sin plata real, Mercado Pago ofrece credenciales de prueba y usuarios de prueba en el mismo panel.

### 3. Vercel (publicación)

1. Entrá a [vercel.com](https://vercel.com) con tu cuenta de GitHub e importá el repositorio `BifrostCoaching/Bifrost`.
2. En **Settings > Environment Variables** cargá las variables de [`.env.example`](.env.example):

   | Variable | De dónde sale |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | La dirección del sitio, por ejemplo `https://bifrost.vercel.app` (sin barra final) |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase · Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase · anon public |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase · service_role (secreta) |
   | `MP_ACCESS_TOKEN` | Mercado Pago · Access Token de producción (secreto) |
   | `MP_WEBHOOK_SECRET` | Mercado Pago · clave secreta de Webhooks (secreta) |
   | `NEXT_PUBLIC_GOOGLE_CALENDAR_ID` | Ya viene cargado con el calendario de Bifröst |

3. Publicá (**Deploy**). Si después cambiás alguna variable, volvé a publicar.

### 4. Google Calendar

El calendario de Bifröst tiene que estar **público** para que se vea en el sitio: en Google Calendar, Configuración del calendario > Permisos de acceso > **Hacer que esté disponible públicamente**.

---

## Cómo se usa el panel Hliðskjálf

Entrás desde el pie del sitio (**Ingreso del equipo**) o en `/hlidskjalf`.

- **Talleres**: creás o editás talleres. Para habilitar la inscripción online de un taller pago, completá **Monto a cobrar con Mercado Pago** (por ejemplo, la seña) y **Qué se cobra** (por ejemplo, "Seña del 30%"). Si lo dejás vacío, el taller se ve pero invita a escribir por el formulario de contacto.
- **Eventos**: actividades sueltas que aparecen en el Calendario.
- **Inscripciones**: quién se anotó y en qué estado está el pago. Las pagas con Mercado Pago se confirman solas; las que te pagan por transferencia o en efectivo las confirmás a mano.
- **Consultas**: los mensajes del formulario de contacto.

---

## Para desarrollar

```bash
cp .env.example .env.local   # y completá los valores
npm install
npm run dev                  # http://localhost:3000
```

## Datos pendientes

- Email, WhatsApp e Instagram de contacto de Bifröst: [PENDIENTE] (en `src/lib/site.ts`).
- Monto a cobrar online para "Vestirse también es comunicar" (seña o total): [PENDIENTE], se carga desde el panel.
- Fechas, modalidad y precio de "El presupuesto como conversación": [PENDIENTE].
