import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "./site";

const API = "https://api.mercadopago.com";

function token(): string {
  const t = process.env.MP_ACCESS_TOKEN;
  if (!t) throw new Error("Falta la variable de entorno MP_ACCESS_TOKEN.");
  return t;
}

type Preferencia = { id: string; init_point: string };

/**
 * Crea una preferencia de Checkout Pro. La persona paga en la página de Mercado Pago:
 * los datos de la tarjeta nunca pasan por el sitio de Bifröst.
 */
export async function crearPreferencia(args: {
  inscripcionId: string;
  tallerId: string;
  titulo: string;
  monto: number;
  nombre: string;
  email: string;
}): Promise<Preferencia> {
  const volver = `${SITE_URL}/inscripcion/resultado`;
  const res = await fetch(`${API}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": args.inscripcionId,
    },
    body: JSON.stringify({
      items: [
        {
          id: args.tallerId,
          title: args.titulo,
          quantity: 1,
          unit_price: args.monto,
          currency_id: "ARS",
        },
      ],
      payer: { name: args.nombre, email: args.email },
      external_reference: args.inscripcionId,
      back_urls: { success: volver, pending: volver, failure: volver },
      auto_return: "approved",
      notification_url: `${SITE_URL}/api/mercadopago/webhook`,
      statement_descriptor: "BIFROST",
      payment_methods: { installments: 3 },
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const detalle = await res.text();
    throw new Error(`Mercado Pago respondió ${res.status}: ${detalle.slice(0, 300)}`);
  }
  const data = (await res.json()) as Preferencia;
  return { id: data.id, init_point: data.init_point };
}

export type Pago = {
  id: number;
  status: string;
  external_reference: string | null;
  transaction_amount: number;
  currency_id: string;
};

/** Consulta el pago directamente a Mercado Pago: es la única fuente que se toma como cierta. */
export async function obtenerPago(id: string): Promise<Pago> {
  const res = await fetch(`${API}/v1/payments/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token()}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`No se pudo leer el pago ${id}: ${res.status}`);
  return (await res.json()) as Pago;
}

/**
 * Verifica la firma de la notificación (encabezado x-signature) con la clave secreta
 * que da Mercado Pago al configurar los webhooks.
 */
export function firmaValida(args: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
}): boolean {
  const secreto = process.env.MP_WEBHOOK_SECRET;
  if (!secreto || !args.xSignature) return false;

  let ts = "";
  let v1 = "";
  for (const parte of args.xSignature.split(",")) {
    const [k, v] = parte.split("=").map((s) => s.trim());
    if (k === "ts") ts = v ?? "";
    if (k === "v1") v1 = v ?? "";
  }
  if (!ts || !v1) return false;

  let manifest = "";
  if (args.dataId) {
    const id = /^[a-z0-9]+$/i.test(args.dataId) ? args.dataId.toLowerCase() : args.dataId;
    manifest += `id:${id};`;
  }
  if (args.xRequestId) manifest += `request-id:${args.xRequestId};`;
  manifest += `ts:${ts};`;

  const esperado = createHmac("sha256", secreto).update(manifest).digest("hex");
  const a = Buffer.from(esperado, "hex");
  const b = Buffer.from(v1, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
