// Funciones puras del panel de progreso (HU-F-406).
import type { EstadoBloque } from "@/shared/music";
import type {
  BloqueDelCurso,
  ColumnaMatriz,
  CursoProgreso,
  EstadoDeEvaluacion,
  EvaluacionDelPanel,
  FilaMatriz,
  NecesitaApoyo,
  SeriesProgreso,
} from "./tipos";

const DIA = 86_400_000;

export const nombreCompleto = (p: { nombre: string; apellido: string | null }) =>
  [p.nombre, p.apellido].filter(Boolean).join(" ");

export interface Cifras {
  /** Evaluaciones publicadas (abiertas); solo cuando ya llegaron las series. */
  evaluacionesAbiertas?: number;
  estudiantes: number;
  avancePromedio: number;
  alDia: number;
  sinActividad: number;
}

/** Cifras de un curso o, sin curso elegido, de todos (el promedio se pondera por estudiantes). */
export function cifrasDe(cursos: CursoProgreso[]): Cifras {
  const estudiantes = cursos.reduce((suma, c) => suma + c.estudiantes, 0);
  const ponderado = cursos.reduce((suma, c) => suma + c.avance_promedio * c.estudiantes, 0);
  return {
    estudiantes,
    avancePromedio: estudiantes === 0 ? 0 : Math.round(ponderado / estudiantes),
    alDia: cursos.reduce((suma, c) => suma + c.estudiantes_al_dia, 0),
    sinActividad: cursos.reduce((suma, c) => suma + c.sin_actividad_14_dias, 0),
  };
}

/** Motivos de "Necesitan apoyo" en texto: el backend solo manda códigos. */
export function textoMotivos(fila: NecesitaApoyo, ahora: number = Date.now()): string[] {
  return fila.motivos.map((motivo) => {
    if (motivo === "reprobo_bloque" && fila.bloque_reprobado) {
      const { intentos_reprobados: veces, titulo } = fila.bloque_reprobado;
      return `Reprobó ${veces} ${veces === 1 ? "vez" : "veces"} el bloque «${titulo}»`;
    }
    if (!fila.ultimo_avance) return "Aún no registra avances";
    const dias = Math.max(1, Math.floor((ahora - new Date(fila.ultimo_avance).getTime()) / DIA));
    return `Sin avances desde hace ${dias} ${dias === 1 ? "día" : "días"}`;
  });
}

const ETIQUETA_ESTADO: Record<EstadoBloque, string> = {
  bloqueado: "Bloqueado",
  disponible: "Disponible",
  aprobado: "Aprobado",
};

/** Lo que lee el lector de pantalla en una celda: "Ana Gómez, bloque 3, Aprobado, mejor puntaje 90". */
export function textoCelda(
  fila: FilaMatriz,
  columna: ColumnaMatriz,
  estado: EstadoBloque,
  puntaje: number | null,
): string {
  const base = `${nombreCompleto(fila)}, bloque ${columna.numero}, ${ETIQUETA_ESTADO[estado]}`;
  return puntaje === null ? base : `${base}, mejor puntaje ${puntaje}`;
}

// Excel en es-CO usa ";"; el BOM hace que lea bien las tildes (igual que HU-F-309).
const SEPARADOR = ";";
const BOM = "﻿";

function celdaCsv(valor: string | number): string {
  const texto = String(valor);
  return /[";\n\r]/.test(texto) ? `"${texto.replaceAll('"', '""')}"` : texto;
}

/** CSV de la matriz visible: sin correos, un bloque por columna ("Aprobado (90)"). */
export function matrizACsv(filas: FilaMatriz[], columnas: ColumnaMatriz[]): string {
  const encabezado = [
    "Nombre",
    "Avance (%)",
    ...columnas.map((c) => `Bloque ${c.numero} · ${c.titulo}`),
  ];
  const lineas = filas.map((f) => {
    const celdas = columnas.map((c) => {
      const celda = f.bloques.find((b) => b.bloque_id === c.bloque_id);
      if (!celda) return "";
      const puntaje = celda.mejor_puntaje === null ? "" : ` (${celda.mejor_puntaje})`;
      return `${ETIQUETA_ESTADO[celda.estado]}${puntaje}`;
    });
    return [nombreCompleto(f), f.avance_pct, ...celdas].map(celdaCsv).join(SEPARADOR);
  });
  return BOM + [encabezado.map(celdaCsv).join(SEPARADOR), ...lineas].join("\r\n");
}

// ---- Gráficas y evaluaciones (HU-F-506) ----------------------------------------------------

export const ETIQUETA_EVALUACION: Record<EstadoDeEvaluacion, string> = {
  borrador: "Borrador",
  publicada: "Abierta",
  cerrada: "Cerrada",
};

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

export const totalEstudiantes = ({ estados }: SeriesProgreso) =>
  estados.sin_iniciar + estados.en_curso + estados.finalizado;

export function lecturaEstados(series: SeriesProgreso): string {
  const { estados } = series;
  const total = plural(totalEstudiantes(series), "inscripción", "inscripciones");
  return `${estados.finalizado} de ${total} finalizaron; ${estados.en_curso} van en curso y ${estados.sin_iniciar} no han empezado.`;
}

export function lecturaDistribucion({ distribucion_avance: tramos }: SeriesProgreso): string {
  const mayor = tramos.reduce((m, t) => (t.estudiantes > m.estudiantes ? t : m), tramos[0]);
  if (!mayor || mayor.estudiantes === 0) return "Nadie tiene avance con estos filtros.";
  return `El grupo más grande (${plural(mayor.estudiantes, "estudiante", "estudiantes")}) está entre ${mayor.desde} y ${mayor.hasta} % de avance.`;
}

export function lecturaActividad({ actividad_por_dia: dias }: SeriesProgreso): string {
  const conActividad = dias.filter((d) => d.registros > 0).length;
  if (conActividad === 0) return `Sin actividad en los últimos ${dias.length} días.`;
  const pico = dias.reduce((m, d) => (d.estudiantes_activos > m.estudiantes_activos ? d : m));
  const activos = plural(pico.estudiantes_activos, "estudiante activo", "estudiantes activos");
  return `Hubo actividad en ${conActividad} de ${dias.length} días; el máximo fue de ${activos}.`;
}

const TODOS = 100;

/** Nadie, parte o todos aprobaron: el estado de la barra de "Aprobación por bloque". */
export function estadoDeAprobacion(valor: number): "sin_iniciar" | "en_curso" | "aprobado" {
  if (valor === 0) return "sin_iniciar";
  return valor >= TODOS ? "aprobado" : "en_curso";
}

/** Porcentaje de estudiantes del curso que aprobaron cada bloque (0 a 100). */
export function aprobacionPorBloque(curso: CursoProgreso) {
  return curso.bloques.map((b) => ({
    id: b.bloque_id,
    nombre: `Bloque ${b.numero} · ${b.titulo}`,
    valor: curso.estudiantes === 0 ? 0 : Math.round((b.aprobados * 100) / curso.estudiantes),
    aprobados: b.aprobados,
  }));
}

export function lecturaAprobacion(curso: CursoProgreso): string {
  const filas = aprobacionPorBloque(curso);
  if (filas.length === 0 || curso.estudiantes === 0) return "Aún no hay aprobaciones que mostrar.";
  const menor = filas.reduce((m, f) => (f.valor < m.valor ? f : m));
  const de = plural(curso.estudiantes, "estudiante", "estudiantes");
  return `${menor.nombre} tiene la menor aprobación: ${menor.aprobados} de ${de}.`;
}

/** Solo las evaluaciones con algún intento: sin intentos no hay promedio ni aprobación que graficar. */
export function categoriasDeEvaluaciones(evaluaciones: EvaluacionDelPanel[], estudiantes: number) {
  return evaluaciones
    .filter((e) => e.intentos > 0)
    .map((e) => ({
      id: e.evaluacion_id,
      nombre: e.titulo,
      valores: {
        promedio: e.promedio_puntaje,
        aprobacion:
          estudiantes === 0 ? null : Math.min(100, Math.round((e.aprobados * 100) / estudiantes)),
      },
    }));
}

/** CSV de la tabla de evaluaciones: sin correos ni respuestas. */
export function evaluacionesACsv(
  evaluaciones: EvaluacionDelPanel[],
  bloques: BloqueDelCurso[],
): string {
  const encabezado = ["Evaluación", "Bloque", "Estado", "Intentos", "Aprobados", "Promedio (%)"];
  const lineas = evaluaciones.map((e) => {
    const bloque = bloques.find((b) => b.bloque_id === e.bloque_id);
    return [
      e.titulo,
      bloque ? `Bloque ${bloque.numero}` : "",
      ETIQUETA_EVALUACION[e.estado],
      e.intentos,
      e.aprobados,
      e.promedio_puntaje ?? "",
    ]
      .map(celdaCsv)
      .join(SEPARADOR);
  });
  return BOM + [encabezado.map(celdaCsv).join(SEPARADOR), ...lineas].join("\r\n");
}
