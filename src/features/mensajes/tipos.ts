// Forma de /mensajes (HU-B-409). El backend nunca devuelve correos.
import type { MetaPaginacion } from "@/shared/ui";

export type RolPersona = "estudiante" | "docente" | "admin";

export type Alcance =
  | "usuario"
  | "curso"
  | "estudiantes_docente"
  | "rol_estudiante"
  | "rol_docente"
  | "rol_admin"
  | "todos";

/** Remitente: null en el mensaje si su cuenta ya no existe. */
export interface Persona {
  nombre: string;
  apellido: string | null;
  rol: RolPersona;
}

export interface HiloDeBandeja {
  hilo_id: string;
  asunto: string;
  alcance: Alcance;
  curso: string | null;
  no_leidos: number;
  archivado: boolean;
  ultimo: {
    remitente: Persona | null;
    propio: boolean;
    extracto: string;
    creado_en: string;
  };
}

export interface PaginaBandeja {
  data: HiloDeBandeja[];
  meta: MetaPaginacion;
}

export interface MensajeDeHilo {
  id: string;
  propio: boolean;
  remitente: Persona | null;
  /** Texto plano: se muestra tal cual, nunca como HTML. */
  cuerpo: string;
  alcance: Alcance;
  curso: string | null;
  creado_en: string;
  /** No lo había leído antes de abrir el hilo. */
  nuevo: boolean;
}

export interface Hilo {
  hilo_id: string;
  asunto: string;
  puede_responder: boolean;
  /** `id` del mensaje al que se responde (respuesta_a_id). */
  responder_a: string | null;
  mensajes: MensajeDeHilo[];
}

export interface Destinatario {
  tipo: "usuario" | "curso" | "grupo";
  id: string | number;
  etiqueta: string;
  detalle: string | null;
}

export type FiltroBandeja = "recibidos" | "enviados" | "no_leidos" | "archivados";

/** Lo que vive en la URL de la bandeja. */
export interface FiltrosBandeja {
  filtro: FiltroBandeja;
  q?: string;
  pagina: number;
}

export type NuevoMensaje =
  | {
      alcance: Alcance;
      destinatario_id?: string;
      curso_id?: number;
      asunto: string;
      cuerpo: string;
    }
  | { respuesta_a_id: string; cuerpo: string };

export interface MensajeEnviado {
  id: string;
  hilo_id: string;
  destinatarios: number;
}
