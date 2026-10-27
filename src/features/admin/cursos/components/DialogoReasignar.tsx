import { useState } from "react";
import { Button, Dialog, Field, Input, MensajeError, Select, Skeleton } from "@/shared/ui";
import { useDocentesParaElegir, useReasignarCurso } from "../hooks";
import type { DocenteAdmin } from "../tipos";

export interface CursoPorReasignar {
  id: number;
  nombre: string;
  estudiantes: number;
  /** null = el curso no tiene docente: se asigna en vez de reasignar (HU-F-518). */
  docenteId: string | null;
  /** Nombre completo de quien lo tiene hoy; null si no tiene. */
  docente: string | null;
}

const nombreDe = (d: Pick<DocenteAdmin, "nombre" | "apellido">) =>
  [d.nombre, d.apellido].filter(Boolean).join(" ");

interface PropsFormulario {
  curso: CursoPorReasignar;
  onCerrar: () => void;
  /** Tras asignar o reasignar con éxito (p. ej. cerrar el panel que mostraba el curso). */
  onHecho?: () => void;
}

/** Texto del aviso tras confirmar: nombra el curso y a las personas. */
function textoResumen(curso: CursoPorReasignar, destino: string): string {
  const aviso = `${destino} recibirá un correo con el curso asignado.`;
  if (!curso.docente) return `El curso ${curso.nombre} queda a cargo de ${destino}. ${aviso}`;
  return `El curso ${curso.nombre} pasa de ${curso.docente} a ${destino}. Sus ${curso.estudiantes} estudiantes y evaluaciones se mantienen. ${aviso}`;
}

function tituloDe(curso: CursoPorReasignar | null): string {
  if (!curso) return "Asignar curso";
  return `${curso.docente ? "Reasignar" : "Asignar docente a"} ${curso.nombre}`;
}

/** Resumen visible antes de confirmar. */
function ResumenDestino({ curso, destino }: { curso: CursoPorReasignar; destino: string }) {
  return (
    <p role="status" className="text-sm text-paper">
      {curso.docente ? (
        <>
          El curso <strong>{curso.nombre}</strong> pasa de <strong>{curso.docente}</strong> a{" "}
          <strong>{destino}</strong>. Sus {curso.estudiantes} estudiantes y evaluaciones se
          mantienen.{" "}
        </>
      ) : (
        <>
          El curso <strong>{curso.nombre}</strong> queda a cargo de <strong>{destino}</strong>.{" "}
        </>
      )}
      <strong>{destino}</strong> recibirá un correo con el curso asignado.
    </p>
  );
}

function Formulario({ curso, onCerrar, onHecho }: PropsFormulario) {
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
  const resumen = destino ? textoResumen(curso, nombreDe(destino)) : null;

  return (
    <form
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault();
        if (!destino || !resumen) return;
        reasignar.mutate(
          { cursoId: curso.id, docenteId: destino.id, resumen },
          {
            onSuccess: () => {
              onCerrar();
              onHecho?.();
            },
          },
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
      <Field etiqueta={curso.docente ? "Nuevo docente" : "Docente"}>
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
      {destino && <ResumenDestino curso={curso} destino={nombreDe(destino)} />}
      {reasignar.error && <MensajeError mensaje={reasignar.error.message} />}
      <div className="flex justify-end gap-3">
        <Button variante="fantasma" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!destino} cargando={reasignar.isPending}>
          {curso.docente ? "Reasignar curso" : "Asignar curso"}
        </Button>
      </div>
    </form>
  );
}

interface DialogoReasignarProps {
  /** null = cerrado. */
  curso: CursoPorReasignar | null;
  onCerrar: () => void;
  onHecho?: () => void;
}

/** Asignar un curso sin docente o reasignarlo: el resumen nombra el curso y a las personas. */
export function DialogoReasignar({ curso, onCerrar, onHecho }: DialogoReasignarProps) {
  return (
    <Dialog abierto={curso !== null} onCerrar={onCerrar} titulo={tituloDe(curso)}>
      {curso && <Formulario curso={curso} onCerrar={onCerrar} onHecho={onHecho} />}
    </Dialog>
  );
}
