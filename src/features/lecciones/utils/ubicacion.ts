import type { BloqueRuta, LeccionRuta } from "@/features/ruta";

export interface UbicacionLeccion {
  bloque?: BloqueRuta;
  /** La lección tal como la ve el estudiante en la ruta (incluye `completado`). */
  enRuta?: LeccionRuta;
  anterior?: LeccionRuta;
  siguiente?: LeccionRuta;
}

/** Función pura: bloque, anterior y siguiente de una lección en el orden de la ruta. */
export function ubicarLeccion(bloques: BloqueRuta[] | undefined, id: number): UbicacionLeccion {
  if (!bloques) return {};
  const enOrden = bloques.flatMap((bloque) =>
    bloque.lecciones.map((leccion) => ({ bloque, leccion })),
  );
  const indice = enOrden.findIndex(({ leccion }) => leccion.id === id);
  if (indice < 0) return {};
  return {
    bloque: enOrden[indice].bloque,
    enRuta: enOrden[indice].leccion,
    anterior: enOrden[indice - 1]?.leccion,
    siguiente: enOrden[indice + 1]?.leccion,
  };
}

/** El contenido llega como texto: los párrafos se separan con una línea en blanco. */
export function parrafos(contenido: string | null): string[] {
  return (contenido ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export type Continuidad =
  { tipo: "leccion"; leccion: LeccionRuta } | { tipo: "evaluacion"; evaluacionId: number } | null;

/**
 * Qué sigue al practicar una lección (HU-F-318): la primera lección pendiente del mismo bloque
 * (sin contar la actual) o, si ya no queda ninguna, la evaluación del bloque.
 */
export function continuidad(bloque: BloqueRuta | undefined, leccionId: number): Continuidad {
  if (!bloque) return null;
  const pendiente = [...bloque.lecciones]
    .sort((a, b) => a.numero - b.numero)
    .find((l) => l.id !== leccionId && !l.completado);
  if (pendiente) return { tipo: "leccion", leccion: pendiente };
  return bloque.evaluacion_id === null
    ? null
    : { tipo: "evaluacion", evaluacionId: bloque.evaluacion_id };
}
