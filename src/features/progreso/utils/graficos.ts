// Datos y frases de los gráficos de "Mi progreso" (HU-F-502). Funciones puras: el backend ya decidió
// el estado de cada bloque y de cada curso; aquí solo se traduce a lo que dibuja el gráfico.
import type { MiCurso } from "@/features/cursos";
import type { BloqueRuta } from "@/features/ruta";
import type { BarraHorizontal, EstadoGrafico, PuntoEvaluacion } from "@/shared/ui/graficos";

/** Puntaje para aprobar una evaluación (el mismo que usa el historial de intentos). */
export const APROBACION = 80;

export const RANGOS_ACTIVIDAD = [7, 28, 90] as const;
export type RangoActividad = (typeof RANGOS_ACTIVIDAD)[number];

export function rangoDe(valor: string | null): RangoActividad {
  return RANGOS_ACTIVIDAD.find((r) => String(r) === valor) ?? 28;
}

function completadas(bloque: BloqueRuta): number {
  return bloque.lecciones.filter((l) => l.completado).length;
}

/** Avance 0–100 del bloque: lecciones completadas; un bloque aprobado cuenta como completo. */
export function avanceDelBloque(bloque: BloqueRuta): number {
  if (bloque.estado === "aprobado") return 100;
  const total = bloque.lecciones.length;
  return total === 0 ? 0 : Math.round((completadas(bloque) / total) * 100);
}

function estadoDelBloque(bloque: BloqueRuta): EstadoGrafico {
  if (bloque.estado === "aprobado") return "aprobado";
  if (bloque.estado === "bloqueado") return "bloqueado";
  return completadas(bloque) > 0 ? "en_curso" : "sin_iniciar";
}

export function barrasDeBloques(bloques: BloqueRuta[]): BarraHorizontal[] {
  return bloques.map((b) => ({
    id: b.id,
    nombre: `Bloque ${b.numero} · ${b.titulo}`,
    valor: avanceDelBloque(b),
    estado: estadoDelBloque(b),
  }));
}

export function barrasDeCursos(cursos: MiCurso[]): BarraHorizontal[] {
  return cursos.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    valor: c.avance.pct,
    estado: c.estado,
  }));
}

export function puntosDeEvaluaciones(bloques: BloqueRuta[]): PuntoEvaluacion[] {
  return bloques
    .filter((b) => b.mejor_puntaje !== null)
    .map((b) => ({
      id: b.id,
      numero: b.numero,
      nombre: b.titulo,
      valor: b.mejor_puntaje ?? 0,
      aprobado: b.estado === "aprobado",
    }));
}

/** "Llevas 40 % del bloque 3." / "Aprobaste los 4 bloques." / "Empieza por el bloque 1." */
export function lecturaDeBloques(bloques: BloqueRuta[]): string {
  if (bloques.length === 0) return "";
  const enCurso = bloques.find((b) => estadoDelBloque(b) === "en_curso");
  if (enCurso) return `Llevas ${avanceDelBloque(enCurso)} % del bloque ${enCurso.numero}.`;
  if (bloques.every((b) => b.estado === "aprobado")) {
    return `Aprobaste los ${bloques.length} bloques.`;
  }
  const siguiente = bloques.find((b) => b.estado === "disponible");
  return siguiente ? `Empieza por el bloque ${siguiente.numero}.` : "";
}

export function lecturaDeCursos(cursos: MiCurso[]): string {
  const enCurso = cursos.filter((c) => c.estado === "en_curso").length;
  const finalizados = cursos.filter((c) => c.estado === "finalizado").length;
  return `${cursos.length} ${cursos.length === 1 ? "curso" : "cursos"}: ${enCurso} en curso y ${finalizados} finalizado${finalizados === 1 ? "" : "s"}.`;
}

export function lecturaDeActividad(diasConPractica: number, rango: number): string {
  return `Practicaste ${diasConPractica} de los últimos ${rango} días.`;
}

export function lecturaDePuntajes(puntos: PuntoEvaluacion[]): string {
  if (puntos.length === 0) return "";
  const mejor = puntos.reduce((a, b) => (b.valor > a.valor ? b : a));
  return `Tu mejor puntaje es ${mejor.valor} % en el bloque ${mejor.numero}.`;
}

/** Sin ningún avance todavía: en vez de gráficos vacíos se invita a empezar. */
export function sinAvances(bloques: BloqueRuta[], lecciones: number, ejercicios: number): boolean {
  return lecciones === 0 && ejercicios === 0 && puntosDeEvaluaciones(bloques).length === 0;
}
