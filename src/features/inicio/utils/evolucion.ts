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

type Punto = { x: number; y: number };

/** Pendientes de Fritsch–Carlson: la curva pasa por los puntos sin sobrepasarlos. */
function pendientes(p: Punto[]): number[] {
  const d = p.slice(1).map((q, i) => (q.y - p[i].y) / (q.x - p[i].x));
  const m = p.map((_, i) => {
    if (i === 0) return d[0];
    if (i === p.length - 1) return d[i - 1];
    return d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  });
  d.forEach((di, i) => {
    if (di === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      return;
    }
    const a = m[i] / di;
    const b = m[i + 1] / di;
    const h = Math.hypot(a, b);
    if (h > 3) {
      m[i] = (3 * a * di) / h;
      m[i + 1] = (3 * b * di) / h;
    }
  });
  return m;
}

/** Trazo suave y monótono (HU-F-322): nunca baja de 0 ni supera el máximo de los datos. */
export function trazoSuave(p: Punto[]): string {
  if (p.length === 0) return "";
  if (p.length === 1) return `M${p[0].x},${p[0].y}`;
  const m = pendientes(p);
  const tramos = p.slice(1).map((q, i) => {
    const t = (q.x - p[i].x) / 3;
    return `C${p[i].x + t},${p[i].y + m[i] * t} ${q.x - t},${q.y - m[i + 1] * t} ${q.x},${q.y}`;
  });
  return `M${p[0].x},${p[0].y}${tramos.join("")}`;
}

/** Área bajo la curva, cerrada sobre la línea de base (para el relleno que se desvanece). */
export function areaBajo(p: Punto[], base: number): string {
  if (p.length < 2) return "";
  return `${trazoSuave(p)}L${p[p.length - 1].x},${base}L${p[0].x},${base}Z`;
}
