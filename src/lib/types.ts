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
