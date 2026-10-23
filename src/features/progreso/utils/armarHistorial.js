// Función pura: arma la lista de "Mi progreso" a partir de la ruta (GET /ruta).
// El backend ya no expone el historial por elemento (GET /progreso se retiró en HU-B-319):
// salen los bloques con quiz presentado y las lecciones completadas, en el orden de la ruta.
export function armarHistorial(bloques = []) {
  return bloques.flatMap((bloque) => {
    const tienePuntaje = bloque.mejor_puntaje !== null && bloque.mejor_puntaje !== undefined;
    const quiz = tienePuntaje
      ? [
          {
            id: `bloque-${bloque.id}`,
            tipo: "bloque",
            titulo: bloque.titulo,
            completado: bloque.estado === "aprobado",
            porcentaje: bloque.mejor_puntaje,
          },
        ]
      : [];
    const lecciones = (bloque.lecciones ?? [])
      .filter((leccion) => leccion.completado)
      .map((leccion) => ({
        id: `leccion-${leccion.id}`,
        tipo: "leccion",
        titulo: leccion.titulo,
        completado: true,
        porcentaje: 100,
      }));
    return [...quiz, ...lecciones];
  });
}
