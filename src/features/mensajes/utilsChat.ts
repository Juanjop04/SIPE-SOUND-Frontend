// Funciones puras del chat (HU-F-501): agrupación por remitente, separadores de día, iniciales y
// textos de los avisos. Sin React ni red.
import type { Hilo, MensajeDeHilo, Persona } from "./tipos";
import { nombreDe } from "./utils";

const DIA_MS = 86_400_000;
const HORA = new Intl.DateTimeFormat("es-CO", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const PARTES_DE_DIA = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** "12 oct" o "12 oct 2025": sin el "de" que pone Intl en español ("12 de oct"). */
function diaCorto(fecha: Date, conAno: boolean): string {
  const partes = Object.fromEntries(
    PARTES_DE_DIA.formatToParts(fecha).map((p) => [p.type, p.value]),
  );
  const base = `${partes.day} ${partes.month}`;
  return conAno ? `${base} ${partes.year}` : base;
}

/** "MR" para Marta Ríos; "?" si la cuenta ya no existe. */
export function iniciales(persona: Persona | null): string {
  if (!persona) return "?";
  const letras = [persona.nombre, persona.apellido]
    .filter(Boolean)
    .map((p) => (p ?? "").trim().charAt(0).toLocaleUpperCase("es"));
  return letras.join("") || "?";
}

/** Inicio del día local como número (para comparar días sin horas). */
function inicioDelDia(fecha: Date): number {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()).getTime();
}

function diasDeDiferencia(iso: string, ahora: number): number {
  return Math.round((inicioDelDia(new Date(ahora)) - inicioDelDia(new Date(iso))) / DIA_MS);
}

/** "Hoy", "Ayer", "12 oct" (o "12 oct 2025" si es de otro año). */
export function etiquetaDeDia(iso: string, ahora: number = Date.now()): string {
  const dias = diasDeDiferencia(iso, ahora);
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Ayer";
  const fecha = new Date(iso);
  return diaCorto(fecha, fecha.getFullYear() !== new Date(ahora).getFullYear());
}

/** La hora si es de hoy ("14:05"); si no, "Ayer" o "12 oct": para la lista de conversaciones. */
export function horaCorta(iso: string, ahora: number = Date.now()): string {
  return diasDeDiferencia(iso, ahora) === 0
    ? HORA.format(new Date(iso))
    : etiquetaDeDia(iso, ahora);
}

export const horaDelMensaje = (iso: string): string => HORA.format(new Date(iso));

export type ItemDelChat =
  | { tipo: "dia"; clave: string; etiqueta: string }
  | { tipo: "nuevos"; clave: string }
  | { tipo: "aviso"; clave: string; mensaje: MensajeDeHilo }
  | { tipo: "mensaje"; clave: string; mensaje: MensajeDeHilo; primero: boolean };

const esAviso = (m: MensajeDeHilo) => m.alcance !== "usuario";

function quienEscribe(m: MensajeDeHilo): string {
  return m.propio ? "yo" : `${nombreDe(m.remitente)}|${m.remitente?.rol ?? ""}`;
}

function claveDeDia(iso: string): string {
  const f = new Date(iso);
  return `${f.getFullYear()}-${f.getMonth()}-${f.getDate()}`;
}

/**
 * Mensajes en orden cronológico → lo que se dibuja: separadores de día, un "Mensajes nuevos" antes
 * del primero sin leer, avisos de grupo como tarjetas y burbujas agrupadas por remitente (el
 * nombre y la hora solo salen en la primera de cada racha).
 */
export function agruparMensajes(
  mensajes: MensajeDeHilo[],
  ahora: number = Date.now(),
): ItemDelChat[] {
  const items: ItemDelChat[] = [];
  let diaActual = "";
  let anterior: MensajeDeHilo | null = null;
  let marcoNuevos = false;
  for (const m of mensajes) {
    const dia = claveDeDia(m.creado_en);
    const cambioDeDia = dia !== diaActual;
    if (cambioDeDia) {
      items.push({ tipo: "dia", clave: `dia-${dia}`, etiqueta: etiquetaDeDia(m.creado_en, ahora) });
      diaActual = dia;
    }
    if (m.nuevo && !marcoNuevos && !m.propio) {
      items.push({ tipo: "nuevos", clave: `nuevos-${m.id}` });
      marcoNuevos = true;
    }
    if (esAviso(m)) {
      items.push({ tipo: "aviso", clave: m.id, mensaje: m });
      anterior = null;
      continue;
    }
    const primero = cambioDeDia || anterior === null || quienEscribe(anterior) !== quienEscribe(m);
    items.push({ tipo: "mensaje", clave: m.id, mensaje: m, primero });
    anterior = m;
  }
  return items;
}

/** "Aviso a Guitarra 7A", "Aviso a todos los docentes"… para la tarjeta y el encabezado. */
export function textoDeAviso(m: MensajeDeHilo): string {
  if (m.alcance === "curso") return `Aviso a ${m.curso ?? "un curso"}`;
  const destinos: Partial<Record<MensajeDeHilo["alcance"], string>> = {
    estudiantes_docente: "todos mis estudiantes",
    rol_estudiante: "todos los estudiantes",
    rol_docente: "todos los docentes",
    rol_admin: "los administradores",
    todos: "todas las cuentas",
  };
  return `Aviso a ${destinos[m.alcance] ?? "un grupo"}`;
}

/** Título del chat: el nombre de la otra persona (sin rol ni curso); si no hay, el asunto. */
export function tituloDelChat(hilo: Hilo): string {
  const ajeno = hilo.mensajes.find((m) => !m.propio && m.remitente);
  return ajeno ? nombreDe(ajeno.remitente) : hilo.asunto;
}

/** Solo un aviso a un grupo dice a quiénes llegó; en una conversación de dos no hay subtítulo. */
export function subtituloDelChat(hilo: Hilo): string {
  if (hilo.mensajes.some((m) => !m.propio && m.remitente)) return "";
  const aviso = hilo.mensajes.find(esAviso);
  return aviso ? textoDeAviso(aviso) : "";
}
