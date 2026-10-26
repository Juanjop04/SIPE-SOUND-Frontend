// Funciones puras de "Mis cursos" (HU-F-504). El backend decide el estado y el porcentaje: aquí solo
// se cuentan, filtran y ordenan.
import type { BloqueDeCurso, EstadoDeCurso, MiCurso } from "./api";

export const ESTADOS: { valor: EstadoDeCurso; etiqueta: string; simbolo: string }[] = [
  { valor: "sin_iniciar", etiqueta: "Sin iniciar", simbolo: "○" },
  { valor: "en_curso", etiqueta: "En curso", simbolo: "◐" },
  { valor: "finalizado", etiqueta: "Finalizado", simbolo: "●" },
];

export type FiltroEstado = EstadoDeCurso | "todos";
export type OrdenCursos = "ultimo_avance" | "nombre" | "avance";

export const ORDENES: { valor: OrdenCursos; etiqueta: string }[] = [
  { valor: "ultimo_avance", etiqueta: "Último avance" },
  { valor: "nombre", etiqueta: "Nombre" },
  { valor: "avance", etiqueta: "Mayor avance" },
];

export function filtroDe(valor: string | null): FiltroEstado {
  return ESTADOS.find((e) => e.valor === valor)?.valor ?? "todos";
}

export function ordenDe(valor: string | null): OrdenCursos {
  return ORDENES.find((o) => o.valor === valor)?.valor ?? "ultimo_avance";
}

/** "Todos 3 · Sin iniciar 1 · En curso 1 · Finalizado 1": el conteo de cada pestaña. */
export function contarPorEstado(cursos: MiCurso[]): Record<FiltroEstado, number> {
  const conteo: Record<FiltroEstado, number> = {
    todos: cursos.length,
    sin_iniciar: 0,
    en_curso: 0,
    finalizado: 0,
  };
  for (const curso of cursos) conteo[curso.estado] += 1;
  return conteo;
}

export function filtrarYOrdenar(
  cursos: MiCurso[],
  filtro: FiltroEstado,
  orden: OrdenCursos,
): MiCurso[] {
  const visibles = cursos.filter((c) => filtro === "todos" || c.estado === filtro);
  const porNombre = (a: MiCurso, b: MiCurso) => a.nombre.localeCompare(b.nombre, "es");
  if (orden === "nombre") return [...visibles].sort(porNombre);
  if (orden === "avance") {
    return [...visibles].sort((a, b) => b.avance.pct - a.avance.pct || porNombre(a, b));
  }
  // Más reciente primero; los que no empezaron, al final.
  return [...visibles].sort((a, b) => {
    if (a.ultimo_avance === b.ultimo_avance) return porNombre(a, b);
    if (!a.ultimo_avance) return 1;
    if (!b.ultimo_avance) return -1;
    return b.ultimo_avance.localeCompare(a.ultimo_avance);
  });
}

/** Primera lección sin completar de un bloque que no esté bloqueado, en el orden de la ruta. */
export function primeraLeccionPendiente(bloques: BloqueDeCurso[]): number | null {
  for (const bloque of bloques) {
    if (bloque.estado === "bloqueado") continue;
    const pendiente = [...bloque.lecciones]
      .sort((a, b) => a.numero - b.numero)
      .find((l) => !l.completado);
    if (pendiente) return pendiente.id;
  }
  return null;
}

/** La acción principal de la tarjeta según el estado (una sola, contrato 05 §2). */
export function accionPrincipal(estado: EstadoDeCurso): string {
  if (estado === "sin_iniciar") return "Empezar";
  return estado === "en_curso" ? "Continuar" : "Repasar";
}
