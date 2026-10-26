import { useId, useState } from "react";
import { useActividad } from "@/features/progreso";
import { Button, EstadoVacio, Select } from "@/shared/ui";
import { resumenEvolucion } from "../utils/evolucion";
import { GraficoEvolucion, TablaEvolucion } from "./GraficoEvolucion";
import { PanelInicio } from "./PanelInicio";

export const RANGOS = [7, 28] as const;
export type Rango = (typeof RANGOS)[number];

interface TuEvolucionProps {
  dias: Rango;
  onCambiarDias: (dias: Rango) => void;
  className?: string;
}

/** "Tu evolución" (HU-F-317): registros de avance por día; cuenta avance, no minutos tocados. */
export function TuEvolucion({ dias, onCambiarDias, className }: TuEvolucionProps) {
  const idRango = useId();
  const [comoTabla, setComoTabla] = useState(false);
  const actividad = useActividad(dias);
  // Sin HU-B-324 en el backend (404) la sección no se muestra.
  if (actividad.noDisponible) return null;
  const porDia = actividad.data?.por_dia ?? [];
  const sinAvance = porDia.every((d) => d.registros === 0);

  return (
    <PanelInicio
      titulo="Tu evolución"
      className={className}
      cargando={actividad.isPending}
      error={actividad.error}
      onReintentar={() => actividad.refetch()}
      accion={
        <>
          <label htmlFor={idRango} className="sr-only">
            Rango del gráfico
          </label>
          <Select
            id={idRango}
            value={dias}
            className="w-auto py-1"
            onChange={(e) => onCambiarDias(Number(e.target.value) as Rango)}
          >
            {RANGOS.map((rango) => (
              <option key={rango} value={rango}>
                Últimos {rango} días
              </option>
            ))}
          </Select>
        </>
      }
    >
      {actividad.data && sinAvance && (
        <EstadoVacio
          titulo={`En los últimos ${dias} días no hay avance registrado.`}
          descripcion="Una lección corta hoy ya cuenta."
        />
      )}
      {actividad.data && !sinAvance && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-sm text-muted">{resumenEvolucion(porDia)}</p>
            <Button variante="fantasma" tamano="sm" onClick={() => setComoTabla((t) => !t)}>
              {comoTabla ? "Ver como gráfico" : "Ver como tabla"}
            </Button>
          </div>
          {!comoTabla && <GraficoEvolucion dias={porDia} />}
          <TablaEvolucion dias={porDia} oculta={!comoTabla} />
        </>
      )}
    </PanelInicio>
  );
}
