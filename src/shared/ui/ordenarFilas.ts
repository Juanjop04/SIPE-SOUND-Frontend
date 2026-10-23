export type DireccionOrden = "asc" | "desc";

export interface OrdenTabla {
  columna: string;
  direccion: DireccionOrden;
}

const comparador = new Intl.Collator("es", { numeric: true, sensitivity: "base" });

/** Función pura: devuelve una copia ordenada; sin orden o sin valor de orden, la misma lista. */
export function ordenarFilas<T>(
  filas: T[],
  valorOrden: ((fila: T) => string | number) | undefined,
  direccion: DireccionOrden,
): T[] {
  if (!valorOrden) return filas;
  const signo = direccion === "asc" ? 1 : -1;
  return [...filas].sort((a, b) => {
    const va = valorOrden(a);
    const vb = valorOrden(b);
    const diferencia =
      typeof va === "number" && typeof vb === "number"
        ? va - vb
        : comparador.compare(String(va), String(vb));
    return diferencia * signo;
  });
}

/** Al activar una cabecera: misma columna invierte la dirección; otra columna empieza en asc. */
export function siguienteOrden(actual: OrdenTabla | null, columna: string): OrdenTabla {
  if (actual?.columna !== columna) return { columna, direccion: "asc" };
  return { columna, direccion: actual.direccion === "asc" ? "desc" : "asc" };
}
