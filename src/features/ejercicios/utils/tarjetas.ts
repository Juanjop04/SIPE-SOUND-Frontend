// Funciones puras de la lista de ejercicios en tarjetas (HU-F-503). El estado de avance lo calcula el
// backend (mi_progreso, HU-B-501): aquí solo se cuentan, filtran y ordenan.
import type { EstadoEjercicio, Ejercicio } from "../types";

export const ESTADOS: {
  valor: EstadoEjercicio;
  etiqueta: string;
  plural: string;
  simbolo: string;
}[] = [
  { valor: "sin_iniciar", etiqueta: "Sin iniciar", plural: "Sin iniciar", simbolo: "○" },
  { valor: "en_curso", etiqueta: "En curso", plural: "En curso", simbolo: "◐" },
  { valor: "finalizado", etiqueta: "Finalizado", plural: "Finalizados", simbolo: "●" },
];

export type FiltroEstado = EstadoEjercicio | "todos";
export type OrdenEjercicios = "recomendado" | "bpm" | "duracion" | "ultimo";

export const ORDENES: { valor: OrdenEjercicios; etiqueta: string }[] = [
  { valor: "recomendado", etiqueta: "Recomendado" },
  { valor: "bpm", etiqueta: "BPM" },
  { valor: "duracion", etiqueta: "Duración" },
  { valor: "ultimo", etiqueta: "Último registro" },
];

export interface FiltrosEjercicios {
  estado: FiltroEstado;
  nivel: string;
  /** id de la lección o "" (todas). */
  leccion: string;
  acorde: string;
  q: string;
  orden: OrdenEjercicios;
}

export function estadoDe(valor: string | null): FiltroEstado {
  return ESTADOS.find((e) => e.valor === valor)?.valor ?? "todos";
}

export function ordenDe(valor: string | null): OrdenEjercicios {
  return ORDENES.find((o) => o.valor === valor)?.valor ?? "recomendado";
}

export const estadoDelEjercicio = (e: Ejercicio): EstadoEjercicio | null =>
  e.mi_progreso?.estado ?? null;

function coincide(e: Ejercicio, f: FiltrosEjercicios): boolean {
  const busqueda = f.q.trim().toLocaleLowerCase("es");
  return (
    (!f.nivel || e.nivel === f.nivel) &&
    (!f.leccion || String(e.leccion_id) === f.leccion) &&
    (!f.acorde || (e.acordes ?? []).includes(f.acorde)) &&
    (!busqueda || e.nombre.toLocaleLowerCase("es").includes(busqueda))
  );
}

/** Los ejercicios que cumplen todos los filtros MENOS el de estado (de ahí salen los conteos). */
export function sinFiltroDeEstado(ejercicios: Ejercicio[], f: FiltrosEjercicios): Ejercicio[] {
  return ejercicios.filter((e) => coincide(e, f));
}

/** "Todos 18 · Sin iniciar 9 · En curso 4 · Finalizados 5" sobre lo que dejan los demás filtros. */
export function contarPorEstado(ejercicios: Ejercicio[]): Record<FiltroEstado, number> {
  const conteo: Record<FiltroEstado, number> = {
    todos: ejercicios.length,
    sin_iniciar: 0,
    en_curso: 0,
    finalizado: 0,
  };
  for (const e of ejercicios) {
    const estado = estadoDelEjercicio(e);
    if (estado) conteo[estado] += 1;
  }
  return conteo;
}

// Primero lo que sigue en curso, luego lo que falta empezar y al final lo ya terminado.
const PRIORIDAD: Record<EstadoEjercicio, number> = { en_curso: 0, sin_iniciar: 1, finalizado: 2 };

function porRegistro(a: Ejercicio, b: Ejercicio): number {
  const x = a.mi_progreso?.ultimo_registro ?? "";
  const y = b.mi_progreso?.ultimo_registro ?? "";
  return y.localeCompare(x);
}

/** Orden de la lista; "recomendado" sube los que están en curso (sin sesión, el del catálogo). */
export function ordenar(ejercicios: Ejercicio[], orden: OrdenEjercicios): Ejercicio[] {
  const copia = [...ejercicios];
  const porNombre = (a: Ejercicio, b: Ejercicio) => a.nombre.localeCompare(b.nombre, "es");
  if (orden === "bpm")
    return copia.sort(
      (a, b) => (a.bpm_recomendado ?? 0) - (b.bpm_recomendado ?? 0) || porNombre(a, b),
    );
  if (orden === "duracion")
    return copia.sort((a, b) => (a.duracion_min ?? 0) - (b.duracion_min ?? 0) || porNombre(a, b));
  if (orden === "ultimo") return copia.sort((a, b) => porRegistro(a, b) || porNombre(a, b));
  return copia.sort((a, b) => {
    const pa = PRIORIDAD[estadoDelEjercicio(a) ?? "sin_iniciar"];
    const pb = PRIORIDAD[estadoDelEjercicio(b) ?? "sin_iniciar"];
    return pa - pb || a.id - b.id;
  });
}

export function filtrarYOrdenar(ejercicios: Ejercicio[], f: FiltrosEjercicios): Ejercicio[] {
  const visibles = sinFiltroDeEstado(ejercicios, f).filter(
    (e) => f.estado === "todos" || estadoDelEjercicio(e) === f.estado,
  );
  return ordenar(visibles, f.orden);
}

/** Tempo logrado frente al recomendado, 0–100 (puede pasar de 100 con un tempo mayor). */
export function avanceDeTempo(e: Ejercicio): number | null {
  const mejor = e.mi_progreso?.mejor_bpm;
  if (!mejor || !e.bpm_recomendado) return null;
  return Math.min(100, Math.round((mejor / e.bpm_recomendado) * 100));
}

export function acordesDisponibles(ejercicios: Ejercicio[]): string[] {
  return [...new Set(ejercicios.flatMap((e) => e.acordes ?? []))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}

export const hayFiltros = (f: FiltrosEjercicios): boolean =>
  Boolean(f.estado !== "todos" || f.nivel || f.leccion || f.acorde || f.q.trim());

/** Solo el estado está filtrado: el mensaje vacío puede decir "No hay ejercicios en curso.". */
export const soloPorEstado = (f: FiltrosEjercicios): boolean =>
  !f.nivel && !f.leccion && !f.acorde && !f.q.trim();
