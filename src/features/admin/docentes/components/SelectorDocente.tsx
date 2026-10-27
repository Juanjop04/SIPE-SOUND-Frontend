import { useId, useState } from "react";
import { Field, Input, MensajeError, Skeleton } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { useDocentesParaAsignar } from "../hooks";
import type { DocenteActividad } from "../tipos";
import { EstadoDeActividad } from "./EstadoDeActividad";

interface SelectorDocenteProps {
  /** Docente elegido (docente_id) o "". */
  valor: string;
  onElegir: (docente: DocenteActividad) => void;
  /** Docente que ya tiene el curso: no se ofrece. */
  excluir?: string | null;
}

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/**
 * Elegir un docente con contexto para decidir (HU-F-519): sus cursos, sus estudiantes y su estado
 * de actividad. Un docente sin actividad se ofrece igual, con la advertencia a la vista.
 */
export function SelectorDocente({ valor, onElegir, excluir = null }: SelectorDocenteProps) {
  const { data, isPending, error, refetch } = useDocentesParaAsignar();
  const [busqueda, setBusqueda] = useState("");
  const grupo = useId();

  if (isPending) return <Skeleton lineas={3} />;
  if (error) return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;

  const texto = busqueda.trim().toLowerCase();
  const candidatos = data.data.filter(
    (d) => d.docente_id !== excluir && d.nombre.toLowerCase().includes(texto),
  );

  return (
    <div className="flex flex-col gap-3">
      <Field etiqueta="Buscar docente" ayuda="Solo aparecen docentes con la cuenta activa.">
        {(campo) => (
          <Input
            {...campo}
            type="search"
            value={busqueda}
            maxLength={LIMITES.busqueda.max}
            onChange={(e) => setBusqueda(e.target.value)}
            autoComplete="off"
          />
        )}
      </Field>
      {candidatos.length === 0 ? (
        <p className="text-sm text-muted">No hay docentes activos con esa búsqueda.</p>
      ) : (
        <fieldset className="max-h-72 overflow-auto rounded-caja border border-linea">
          <legend className="sr-only">Docente</legend>
          <ul className="divide-y divide-linea">
            {candidatos.map((d) => (
              <li key={d.docente_id}>
                <label className="flex cursor-pointer items-start gap-3 p-3 hover:bg-surface has-[:checked]:bg-surface">
                  <input
                    type="radio"
                    name={grupo}
                    value={d.docente_id}
                    checked={valor === d.docente_id}
                    onChange={() => onElegir(d)}
                    className="mt-1 accent-accent"
                  />
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-medium text-paper">{d.nombre}</span>
                    <span className="text-sm text-muted">
                      {plural(d.cursos_asignados, "curso", "cursos")} ·{" "}
                      {plural(d.estudiantes, "estudiante", "estudiantes")}
                    </span>
                    <span className="text-sm text-paper">
                      <EstadoDeActividad estado={d.estado_actividad} />
                    </span>
                    {d.estado_actividad === "sin_actividad" && (
                      <span className="text-sm text-peligro-texto">Sin actividad hace más de 30 días</span>
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}
    </div>
  );
}
