export type Taller = {
  id: string;
  slug: string;
  nombre: string;
  bajada: string;
  descripcion: string;
  detalle: string;
  inicio: string | null;
  fin: string | null;
  modalidad: string;
  encuentros: number | null;
  tipo: "pago" | "gratuito";
  precio_texto: string;
  monto_online: number | null;
  concepto_online: string;
  cupo: number | null;
  publicado: boolean;
  orden: number;
};

export type Evento = {
  id: string;
  titulo: string;
  organiza: string;
  inicio: string | null;
  fin: string | null;
  modalidad: string;
  tipo: "pago" | "gratuito";
  precio_texto: string;
  descripcion: string;
  publicado: boolean;
};

export type EstadoInscripcion = "pendiente_pago" | "confirmada" | "rechazada" | "cancelada";

export type Inscripcion = {
  id: string;
  taller_id: string;
  nombre: string;
  email: string;
  telefono: string;
  estado: EstadoInscripcion;
  monto: number | null;
  mp_payment_id: string | null;
  mp_status: string | null;
  notas: string;
  created_at: string;
  talleres?: { nombre: string } | null;
};

export type Consulta = {
  id: string;
  nombre: string;
  email: string;
  motivo: string;
  mensaje: string;
  leida: boolean;
  created_at: string;
};
