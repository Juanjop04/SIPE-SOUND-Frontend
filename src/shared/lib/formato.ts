// Formatos de datos para la interfaz (contrato 02: shared/lib/formato).
const FECHA = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" });

/** "2026-10-22T06:00:13Z" → "22 oct 2026". Vacío o inválido → "—". */
export function formatearFecha(iso: string | null | undefined): string {
  if (!iso) return "—";
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime()) ? "—" : FECHA.format(fecha);
}

const RELATIVA = new Intl.RelativeTimeFormat("es-CO", { numeric: "auto" });
const MINUTO = 60_000;
const HORA = 60 * MINUTO;
const DIA = 24 * HORA;

/** "hace 3 horas", "ayer", "hace 5 días". Fecha inválida → "". */
export function fechaRelativa(iso: string, ahora: number = Date.now()): string {
  const momento = new Date(iso).getTime();
  if (Number.isNaN(momento)) return "";
  const diferencia = momento - ahora;
  if (Math.abs(diferencia) < HORA)
    return RELATIVA.format(Math.round(diferencia / MINUTO), "minute");
  if (Math.abs(diferencia) < DIA) return RELATIVA.format(Math.round(diferencia / HORA), "hour");
  return RELATIVA.format(Math.round(diferencia / DIA), "day");
}
