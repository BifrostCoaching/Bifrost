import "server-only";
import nodemailer from "nodemailer";

/** Hay mail automático solo si están cargadas las dos variables (ver README). */
export function hayMail(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Manda a la persona el link para entrar al campus. Devuelve un error en texto si no se pudo. */
export async function mandarAccesoCampus(para: string, nombre: string, link: string, taller: string): Promise<string | null> {
  if (!hayMail()) return "El envío automático todavía no está configurado.";
  const transporte = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
  const saludo = nombre ? `Hola, ${nombre}:` : "Hola:";
  const cuerpo = taller ? `Ya tenés tu lugar en el campus de Bifröst para el taller ${taller}.` : "Ya tenés tu lugar en el campus de Bifröst.";
  const texto = `${saludo}

${cuerpo} Entrá con este link y elegí tu contraseña:

${link}

El link sirve una sola vez y vence en 24 horas. Si vence, escribinos y te mandamos otro.

Equipo Bifröst`;
  const html = `<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#14213D;max-width:520px">
<p>${esc(saludo)}</p>
<p>${esc(cuerpo)} Entrá con este botón y elegí tu contraseña:</p>
<p><a href="${esc(link)}" style="display:inline-block;background:#8E2433;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Entrar al campus</a></p>
<p style="font-size:14px;color:#555">El link sirve una sola vez y vence en 24 horas. Si vence, escribinos y te mandamos otro.</p>
<p>Equipo Bifröst</p>
</div>`;
  try {
    await transporte.sendMail({ from: `Bifröst <${process.env.GMAIL_USER}>`, to: para, subject: "Tu acceso al campus de Bifröst", text: texto, html });
    return null;
  } catch (e) {
    console.error("mail campus:", e);
    return "No se pudo mandar el mail.";
  }
}
