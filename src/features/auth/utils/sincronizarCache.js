// Mantiene la caché de TanStack Query coherente con quien tiene la sesión.
// `anterior` undefined = primera carga: no hay nada que limpiar.
export function sincronizarCache(queryClient, anterior, actual) {
  if (anterior === undefined || anterior === actual) return;
  if (anterior !== null) {
    // Cerró sesión (o entró otra persona): no puede quedar ningún dato del usuario anterior.
    queryClient.clear();
    return;
  }
  // Inició sesión: lo cargado como visitante (ruta sin estados) se vuelve a pedir.
  queryClient.invalidateQueries();
}
