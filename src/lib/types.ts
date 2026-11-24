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
  publicado: boolean;
  orden: number;
  imagenes?: string[];
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
  imagen?: string;
};

export type EstadoInteresado = "nuevo" | "contactado" | "inscripto" | "descartado";

export type Interesado = {
  id: string;
  taller_id: string | null;
  nombre: string;
  email: string;
  telefono: string;
  comentario: string;
  estado: EstadoInteresado;
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

export type Post = {
  id: string;
  slug: string;
  titulo: string;
  tema: string;
  resumen: string;
  texto: string;
  publicado: boolean;
  fecha: string;
};

export type EstadoComunidad = "publicado" | "pendiente" | "oculto";
export type Sueno = { id: string; texto: string; estado: EstadoComunidad; created_at: string; autor?: string };
export type Experiencia = { id: string; nombre: string; taller: string; tipo: string; texto: string; estado: EstadoComunidad; created_at: string; autor?: string };
export type Reflexion = { id: string; nombre: string; titulo: string; texto: string; estado: EstadoComunidad; created_at: string; autor?: string };
export type TemaForo = { id: string; tema: string; nombre: string; titulo: string; texto: string; estado: EstadoComunidad; created_at: string; autor?: string };

// ───────── Dar por dar ─────────
export type Espacio = { id: string; nombre: string; tipo: string; zona: string; contacto: string; descripcion: string; estado: EstadoComunidad; created_at: string };
export type Convocatoria = { id: string; espacio_id: string; titulo: string; inicio: string | null; fin: string | null; necesita: string; publicado: boolean };

// ───────── Campus ─────────
export type EstadoInscripcion = "pendiente" | "confirmada" | "cancelada";
export type Participante = { id: string; email: string; nombre: string; created_at: string };
export type Inscripcion = { id: string; participante_id: string; taller_id: string; estado: EstadoInscripcion; created_at: string };
export type Modulo = { id: string; taller_id: string; numero: number; titulo: string; clases: string; materiales: string };
export type Cuando = "semana" | "mes" | "anio" | "largo";
export type ItemAgenda = { id: string; texto: string; cuando: Cuando; created_at: string };

export type Profesional = {
  id: string;
  nombre: string;
  oficio: string;
  descripcion: string;
  contacto: string;
  imagen: string;
  publicado: boolean;
  orden: number;
};

export type Servicio = {
  id: string;
  nombre: string;
  bajada: string;
  descripcion: string;
  para_quien: string;
  modalidad: string;
  precio_texto: string;
  imagenes: string[];
  publicado: boolean;
  orden: number;
};
