// Funciones puras del panel de progreso (HU-F-406).
import type { EstadoBloque } from "@/shared/music";
import type { ColumnaMatriz, CursoProgreso, FilaMatriz, NecesitaApoyo } from "./tipos";

const DIA = 86_400_000;

export const nombreCompleto = (p: { nombre: string; apellido: string | null }) =>
  [p.nombre, p.apellido].filter(Boolean).join(" ");

export interface Cifras {
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
