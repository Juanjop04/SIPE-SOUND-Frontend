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
