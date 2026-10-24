// Funciones puras del inicio. NO deciden qué está desbloqueado: eso lo hace el backend (GET /ruta).
import type { BloqueRuta, LeccionRuta } from "@/features/ruta";

export type SiguientePaso =
  | {
      tipo: "leccion";
      bloque: BloqueRuta;
      leccion: LeccionRuta;
      /** true si aún no completó ninguna lección del bloque ("Comenzar" en vez de "Continuar"). */
      comenzar: boolean;
      posicion: number;
      total: number;
    }
  | { tipo: "evaluacion"; bloque: BloqueRuta }
  | { tipo: "completa" }
  | { tipo: "sin-contenido" };

/**
 * Primer bloque disponible (en el orden de la ruta) con algo pendiente: su primera lección sin
 * completar o, si ya las completó, su evaluación. Un bloque disponible sin lecciones pendientes ni
 * evaluación ya está superado (regla del backend) y se salta.
 */
export function siguientePaso(bloques: BloqueRuta[]): SiguientePaso {
  if (bloques.length === 0) return { tipo: "sin-contenido" };
  for (const bloque of bloques) {
    if (bloque.estado !== "disponible") continue;
    const lecciones = [...bloque.lecciones].sort((a, b) => a.numero - b.numero);
    const indice = lecciones.findIndex((l) => !l.completado);
    if (indice >= 0) {
      return {
        tipo: "leccion",
        bloque,
        leccion: lecciones[indice],
        comenzar: !lecciones.some((l) => l.completado),
        posicion: indice + 1,
        total: lecciones.length,
      };
    }
    if (bloque.evaluacion_id !== null) return { tipo: "evaluacion", bloque };
  }
  return { tipo: "completa" };
}

export type EstadoVisible = "completado" | "en-curso" | "disponible" | "bloqueado";

/** Estado del bloque para el estudiante, con lecciones completadas sobre el total. */
export function estadoVisible(bloque: BloqueRuta): {
  estado: EstadoVisible;
  completadas: number;
  total: number;
} {
  const total = bloque.lecciones.length;
  const completadas = bloque.lecciones.filter((l) => l.completado).length;
  if (bloque.estado === "aprobado") return { estado: "completado", completadas, total };
  if (bloque.estado === "bloqueado") return { estado: "bloqueado", completadas, total };
  return { estado: completadas > 0 ? "en-curso" : "disponible", completadas, total };
}

/** Avance del bloque 0–100 (lecciones completadas); null si el bloque no tiene lecciones. */
export function avanceDeBloque(bloque: BloqueRuta): number | null {
  const { completadas, total } = estadoVisible(bloque);
  return total === 0 ? null : Math.round((completadas / total) * 100);
}

/** "Ana María" → "Ana". */
export function primerNombre(nombre: string | null | undefined): string | null {
  const limpio = nombre?.trim();
  return limpio ? limpio.split(/\s+/)[0] : null;
}

/** Frase concreta del saludo, con los datos del siguiente paso (contrato 05 §7). */
export function fraseDeInicio(paso: SiguientePaso, sinAvance: boolean): string {
  switch (paso.tipo) {
    case "sin-contenido":
      return "Aún no hay bloques publicados en la ruta.";
    case "completa":
      return "Terminaste la ruta. Repasa tus bloques cuando quieras.";
    case "evaluacion":
      return `Te falta la evaluación del bloque ${paso.bloque.numero} · ${paso.bloque.titulo}.`;
    default:
      return sinAvance
        ? `Tu primera lección te espera: ${paso.leccion.titulo}.`
        : `Vas en el bloque ${paso.bloque.numero} · ${paso.bloque.titulo}.`;
  }
}
