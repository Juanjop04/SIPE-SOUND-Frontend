// Funciones puras del gráfico "Tu evolución" (HU-F-317). Las fechas de por_dia son días de
// America/Bogota en formato AAAA-MM-DD (HU-B-324): se leen a mediodía UTC para no correr el día.
export interface Dia {
  fecha: string;
  registros: number;
}

export interface Marco {
  ancho: number;
  alto: number;
  izquierda: number;
  abajo: number;
  arriba: number;
}

const DIA_CORTO = new Intl.DateTimeFormat("es-CO", { weekday: "short", timeZone: "UTC" });
const FECHA_CORTA = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const FECHA_LARGA = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

const aFecha = (dia: string) => new Date(`${dia}T12:00:00Z`);

/** Escala entera del eje Y: tope ≥ 2 y como mucho 5 marcas (0, 1, 2… o 0, 2, 4…). */
export function escalaY(dias: Dia[]): { tope: number; marcas: number[] } {
  const maximo = Math.max(0, ...dias.map((d) => d.registros));
  const paso = Math.max(1, Math.ceil(maximo / 4));
  const tope = Math.max(2, Math.ceil(maximo / paso) * paso);
  const marcas = Array.from({ length: tope / paso + 1 }, (_, i) => i * paso);
  return { tope, marcas };
}

/** Coordenadas de cada día dentro del marco del SVG. */
export function puntos(dias: Dia[], marco: Marco, tope: number): { x: number; y: number }[] {
  const util = marco.ancho - marco.izquierda - 8;
  const paso = dias.length > 1 ? util / (dias.length - 1) : 0;
  return dias.map((d, i) => ({
    x: marco.izquierda + i * paso,
    y: yDe(d.registros, marco, tope),
  }));
}

export function yDe(valor: number, marco: Marco, tope: number): number {
  const util = marco.alto - marco.arriba - marco.abajo;
  return marco.arriba + util - (valor / tope) * util;
}

/** Etiqueta del eje X: con pocos días, el nombre del día; si no, la fecha cada `cada` días. */
export function etiquetaX(dia: string, indice: number, total: number, cada: number): string | null {
  if (total <= 7) return DIA_CORTO.format(aFecha(dia)).replace(".", "");
  const ultimo = indice === total - 1;
  if (indice % cada !== 0 && !ultimo) return null;
  return FECHA_CORTA.format(aFecha(dia)).replace(" de ", " ").replace(".", "");
}

/** "jueves, 23 de octubre" para la tabla y el título de cada punto. */
export function fechaLarga(dia: string): string {
  return FECHA_LARGA.format(aFecha(dia));
}

/** "9 de 28 días con avance". */
export function resumenEvolucion(dias: Dia[]): string {
  const conAvance = dias.filter((d) => d.registros > 0).length;
  return `${conAvance} de ${dias.length} días con avance`;
}
