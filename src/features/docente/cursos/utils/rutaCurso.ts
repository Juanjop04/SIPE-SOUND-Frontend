// Funciones puras del editor de la ruta del curso.
export interface BloqueEnEdicion {
  bloque_id: number;
  numero: number;
  titulo: string;
}

/** Mueve el elemento `indice` un lugar arriba (-1) o abajo (+1); fuera de rango no cambia. */
export function mover<T>(lista: T[], indice: number, direccion: -1 | 1): T[] {
  const destino = indice + direccion;
  if (destino < 0 || destino >= lista.length) return lista;
  const copia = [...lista];
  [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
  return copia;
}

/** Cuerpo de PUT /docente/cursos/{id}/bloques: orden 1, 2, 3… según la posición. */
export function aCuerpoRuta(lista: BloqueEnEdicion[]): { bloque_id: number; orden: number }[] {
  return lista.map((bloque, i) => ({ bloque_id: bloque.bloque_id, orden: i + 1 }));
}

/** ¿La ruta editada difiere de la guardada? (para habilitar "Guardar ruta"). */
export function rutaCambio(guardada: BloqueEnEdicion[], editada: BloqueEnEdicion[]): boolean {
  return (
    guardada.length !== editada.length ||
    guardada.some((bloque, i) => bloque.bloque_id !== editada[i].bloque_id)
  );
}
