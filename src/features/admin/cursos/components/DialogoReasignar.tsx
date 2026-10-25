import { useState } from "react";
import { Button, Dialog, Field, Input, MensajeError, Select, Skeleton } from "@/shared/ui";
import { useDocentesParaElegir, useReasignarCurso } from "../hooks";
import type { DocenteAdmin } from "../tipos";

export interface CursoPorReasignar {
  id: number;
  nombre: string;
  estudiantes: number;
  docenteId: string;
  /** Nombre completo de quien lo tiene hoy. */
  docente: string;
}

const nombreDe = (d: Pick<DocenteAdmin, "nombre" | "apellido">) =>
  [d.nombre, d.apellido].filter(Boolean).join(" ");

function Formulario({ curso, onCerrar }: { curso: CursoPorReasignar; onCerrar: () => void }) {
  const { data, isPending, error, refetch } = useDocentesParaElegir();
  const reasignar = useReasignarCurso();
  const [busqueda, setBusqueda] = useState("");
  const [elegido, setElegido] = useState("");

  if (isPending) return <Skeleton lineas={3} />;
  if (error) return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;

  // El backend solo acepta docentes con la cuenta activa y distintos del actual.
  const candidatos = data.data.filter(
    (d) =>
      d.estado === "activa" &&
      d.id !== curso.docenteId &&
      `${nombreDe(d)} ${d.email}`.toLowerCase().includes(busqueda.trim().toLowerCase()),
  );
  const destino = data.data.find((d) => d.id === elegido);
  const resumen = destino
    ? `El curso ${curso.nombre} pasa de ${curso.docente} a ${nombreDe(destino)}. Sus ${curso.estudiantes} estudiantes y evaluaciones se mantienen.`
    : null;

  return (
    <form
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault();
        if (!destino || !resumen) return;
        reasignar.mutate(
          { cursoId: curso.id, docenteId: destino.id, resumen },
          { onSuccess: onCerrar },
        );
      }}
      className="flex flex-col gap-4"
    >
      <Field etiqueta="Buscar docente" ayuda="Solo aparecen docentes con la cuenta activa.">
        {(campo) => (
          <Input
            {...campo}
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            autoComplete="off"
          />
        )}
      </Field>
      <Field etiqueta="Nuevo docente">
        {(campo) => (
          <Select {...campo} value={elegido} onChange={(e) => setElegido(e.target.value)}>
            <option value="">Elige un docente…</option>
            {candidatos.map((d) => (
              <option key={d.id} value={d.id}>
                {nombreDe(d)} · {d.email}
              </option>
            ))}
          </Select>
        )}
      </Field>
      {candidatos.length === 0 && (
        <p className="text-sm text-muted">No hay docentes activos con esa búsqueda.</p>
      )}
      {resumen && (
        <p role="status" className="text-sm text-paper">
          {resumen}
        </p>
      )}
      {reasignar.error && <MensajeError mensaje={reasignar.error.message} />}
      <div className="flex justify-end gap-3">
        <Button variante="fantasma" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!destino} cargando={reasignar.isPending}>
          Reasignar curso
        </Button>
      </div>
    </form>
  );
}

interface DialogoReasignarProps {
  /** null = cerrado. */
  curso: CursoPorReasignar | null;
  onCerrar: () => void;
}

/** Reasignar un curso a otro docente: el resumen nombra el curso y a las dos personas. */
export function DialogoReasignar({ curso, onCerrar }: DialogoReasignarProps) {
  return (
    <Dialog
      abierto={curso !== null}
      onCerrar={onCerrar}
      titulo={curso ? `Reasignar ${curso.nombre}` : "Reasignar curso"}
    >
      {curso && <Formulario curso={curso} onCerrar={onCerrar} />}
    </Dialog>
  );
}
