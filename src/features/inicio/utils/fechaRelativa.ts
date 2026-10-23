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
