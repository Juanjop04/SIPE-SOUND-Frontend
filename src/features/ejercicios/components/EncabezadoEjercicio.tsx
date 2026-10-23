import { Tablatura, type DatoTablatura } from "@/shared/music";
import type { Ejercicio } from "../types";

/** Lo que se ve de un ejercicio arriba de sus pasos (estudiante y vista previa del atril). */
export type VistaEjercicio = Pick<
  Ejercicio,
  "nombre" | "nivel" | "bpm_recomendado" | "compas" | "duracion_min" | "acordes" | "descripcion"
>;

const COMPAS_POR_DEFECTO = "4/4";

function datos(e: VistaEjercicio): DatoTablatura[] {
  const lista: DatoTablatura[] = [{ clave: "nivel", valor: e.nivel }];
  if (e.bpm_recomendado) lista.push({ clave: "bpm", valor: `♩ ${e.bpm_recomendado} BPM` });
  lista.push({ clave: "compas", valor: e.compas ?? COMPAS_POR_DEFECTO });
  if (e.duracion_min) lista.push({ clave: "duracion", valor: `${e.duracion_min} min` });
  if (e.acordes?.length) lista.push({ clave: "acordes", valor: e.acordes.join(" · ") });
  return lista;
}

export function EncabezadoEjercicio({ ejercicio }: { ejercicio: VistaEjercicio }) {
  return (
    <>
      <h1 className="mt-2 font-display text-[2.5rem] font-semibold leading-tight text-paper">
        {ejercicio.nombre}
      </h1>
      <Tablatura datos={datos(ejercicio)} className="mt-3" />
      {ejercicio.descripcion && (
        <p className="mt-4 max-w-prose leading-relaxed text-muted">{ejercicio.descripcion}</p>
      )}
    </>
  );
}
