import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { firmaValida, obtenerPago } from "@/lib/mercadopago";
import type { EstadoInscripcion } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Mercado Pago avisa acá cuando cambia un pago. No confiamos en lo que trae el aviso:
 * verificamos la firma y después consultamos el pago a Mercado Pago con nuestro token.
 */
export async function POST(req: NextRequest) {
  const url = req.nextUrl;
  let body: { type?: string; action?: string; data?: { id?: string | number } } = {};
  try {
    body = await req.json();
  } catch {
    // Algunos avisos llegan solo con parámetros en la URL.
  }

  const tipo = url.searchParams.get("type") ?? body.type ?? url.searchParams.get("topic");
  const dataId = url.searchParams.get("data.id") ?? (body.data?.id != null ? String(body.data.id) : null);

  if (tipo !== "payment" || !dataId) {
    return NextResponse.json({ ok: true, ignorado: true });
  }

  if (!firmaValida({ xSignature: req.headers.get("x-signature"), xRequestId: req.headers.get("x-request-id"), dataId })) {
    return NextResponse.json({ ok: false, error: "firma inválida" }, { status: 401 });
  }

  try {
    const pago = await obtenerPago(dataId);
    const inscripcionId = pago.external_reference;
    if (!inscripcionId) return NextResponse.json({ ok: true, sinReferencia: true });

    const db = createAdminClient();
    const { data: insc } = await db
      .from("inscripciones")
      .select("id, estado, monto")
      .eq("id", inscripcionId)
      .maybeSingle();
    if (!insc) return NextResponse.json({ ok: true, inscripcionInexistente: true });

    let estado: EstadoInscripcion = insc.estado as EstadoInscripcion;
    let notas: string | undefined;
    if (pago.status === "approved") {
      const coincide = pago.currency_id === "ARS" && Number(insc.monto) === Number(pago.transaction_amount);
      if (coincide) {
        estado = "confirmada";
      } else {
        notas = `Revisar: el pago aprobado (${pago.transaction_amount} ${pago.currency_id}) no coincide con el monto esperado (${insc.monto}).`;
      }
    } else if (["refunded", "charged_back"].includes(pago.status)) {
      estado = "cancelada";
    } else if (["rejected", "cancelled"].includes(pago.status) && insc.estado === "pendiente_pago") {
      // Un intento rechazado no pisa una inscripción ya confirmada por otro intento aprobado.
      estado = "rechazada";
    }

    if (insc.estado === "confirmada" && estado === "confirmada" && pago.status !== "approved") {
      return NextResponse.json({ ok: true });
    }

    await db
      .from("inscripciones")
      .update({ estado, mp_payment_id: String(pago.id), mp_status: pago.status, ...(notas ? { notas } : {}) })
      .eq("id", inscripcionId);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Webhook de Mercado Pago:", e);
    // 500 hace que Mercado Pago reintente más tarde.
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
