// Funciones puras de "Mi progreso": cifras, avance global y actividad reciente.
import type { Intento } from "@/features/evaluaciones";
import type { BloqueRuta } from "@/features/ruta";
import type { ResumenProgreso } from "../hooks/useResumenProgreso";

export interface Cifra {
  clave: string;
  etiqueta: string;
  hecho: number;
  total: number;
}

export function cifrasDeProgreso(resumen: ResumenProgreso, totalBloques: number): Cifra[] {
  return [
    {
      clave: "bloques",
      etiqueta: "bloques",
      hecho: resumen.bloques_aprobados,
      total: totalBloques,
    },
    {
      clave: "lecciones",
      etiqueta: "lecciones",
      hecho: resumen.lecciones.completadas,
      total: resumen.lecciones.total,
    },
    {
      clave: "ejercicios",
      etiqueta: "ejercicios",
      hecho: resumen.ejercicios.completados,
      total: resumen.ejercicios.total,
    },
  ];
}

/** Avance global 0–100: todo lo completado sobre todo lo que hay. */
export function avanceGlobal(cifras: Cifra[]): number {
  const total = cifras.reduce((suma, c) => suma + c.total, 0);
  const hecho = cifras.reduce((suma, c) => suma + Math.min(c.hecho, c.total), 0);
  return total === 0 ? 0 : Math.round((hecho / total) * 100);
}

/** Bloques con al menos un intento (los únicos con historial que pedir). */
export function bloquesConIntentos(
  bloques: BloqueRuta[],
): (BloqueRuta & { evaluacion_id: number })[] {
  return bloques.filter(
    (b): b is BloqueRuta & { evaluacion_id: number } =>
      b.evaluacion_id !== null && b.mejor_puntaje !== null,
  );
}

export interface Actividad {
  id: string;
  fecha: string;
  bloque: BloqueRuta;
  intento: Intento;
}

/** Los intentos de todas las evaluaciones, del más reciente al más antiguo. */
export function actividadReciente(
  bloques: BloqueRuta[],
  historiales: (Intento[] | undefined)[],
  limite = 10,
): Actividad[] {
  return bloques
    .flatMap((bloque, i) =>
      (historiales[i] ?? []).map((intento) => ({
        id: intento.id,
        fecha: intento.creado_en,
        bloque,
        intento,
      })),
    )
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, limite);
}
