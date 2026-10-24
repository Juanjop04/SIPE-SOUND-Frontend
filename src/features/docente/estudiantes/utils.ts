// Funciones puras de la pestaña Estudiantes (HU-F-309).
import type { EstudianteCurso, OrdenEstudiantes } from "./tipos";

export const DIAS_SIN_ACTIVIDAD = 14;
const DIA = 86_400_000;

/** Sin actividad: nunca registró avance o el último fue hace más de 14 días (como el resumen). */
export function sinActividad(ultimoAvance: string | null, ahora: number = Date.now()): boolean {
  if (!ultimoAvance) return true;
  return ahora - new Date(ultimoAvance).getTime() > DIAS_SIN_ACTIVIDAD * DIA;
}

export const ORDENES: { valor: OrdenEstudiantes; etiqueta: string }[] = [
  { valor: "nombre", etiqueta: "Nombre" },
  { valor: "-avance_pct", etiqueta: "Avance" },
  { valor: "-ultimo_avance", etiqueta: "Último avance" },
];

export function ordenDe(valor: string | null): OrdenEstudiantes {
  return ORDENES.find((o) => o.valor === valor)?.valor ?? "nombre";
}

// Excel en es-CO usa ";" como separador; el BOM hace que lea bien las tildes.
const SEPARADOR = ";";
const BOM = "﻿";

function celda(valor: string | number): string {
  const texto = String(valor);
  return /[";\n\r]/.test(texto) ? `"${texto.replaceAll('"', '""')}"` : texto;
}

/** CSV de la vista actual. El correo va enmascarado, como lo entrega la API. */
export function aCsv(filas: EstudianteCurso[], totalBloques: number): string {
  const encabezado = ["Nombre", "Correo", "Avance (%)", "Bloques aprobados", "Último avance"];
  const lineas = filas.map((f) =>
    [
      f.nombre,
      f.email ?? "",
      f.avance_pct,
      `${f.bloques_aprobados}/${totalBloques}`,
      f.ultimo_avance ? f.ultimo_avance.slice(0, 10) : "sin actividad",
    ]
      .map(celda)
      .join(SEPARADOR),
  );
  return BOM + [encabezado.join(SEPARADOR), ...lineas].join("\r\n");
}

/** Descarga un texto como archivo, generado en el navegador (sin librería). */
export function descargar(nombre: string, contenido: string): void {
  const url = URL.createObjectURL(new Blob([contenido], { type: "text/csv;charset=utf-8" }));
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
}
