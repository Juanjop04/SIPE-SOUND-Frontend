// Formatos de datos para la interfaz (contrato 02: shared/lib/formato).
const FECHA = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" });

/** "2026-10-22T06:00:13Z" → "22 oct 2026". Vacío o inválido → "—". */
export function formatearFecha(iso: string | null | undefined): string {
  if (!iso) return "—";
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime()) ? "—" : FECHA.format(fecha);
}
