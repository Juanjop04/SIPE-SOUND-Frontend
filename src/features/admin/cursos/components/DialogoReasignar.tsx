import { useState } from "react";
import { Button, Dialog, MensajeError } from "@/shared/ui";
import { SelectorDocente, type DocenteActividad } from "../externos";
import { useReasignarCurso } from "../hooks";

export interface CursoPorReasignar {
  id: number;
  nombre: string;
  estudiantes: number;
  /** null = el curso no tiene docente: se asigna en vez de reasignar (HU-F-518). */
  docenteId: string | null;
  /** Destino ya decidido (asignar desde el detalle del docente): no se muestra el selector. */
  destino?: { id: string; nombre: string };
  /** Nombre completo de quien lo tiene hoy; null si no tiene. */
  docente: string | null;
}

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
  const reasignar = useReasignarCurso();
  const [elegido, setElegido] = useState<DocenteActividad | null>(null);
  const destino = curso.destino
    ? { docente_id: curso.destino.id, nombre: curso.destino.nombre }
    : elegido;
  const resumen = destino ? textoResumen(curso, destino.nombre) : null;

  return (
    <form
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault();
        if (!destino || !resumen) return;
        reasignar.mutate(
          { cursoId: curso.id, docenteId: destino.docente_id, resumen },
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
      {!curso.destino && (
        <SelectorDocente
          valor={destino?.docente_id ?? ""}
          onElegir={setElegido}
          excluir={curso.docenteId}
        />
      )}
      {destino && <ResumenDestino curso={curso} destino={destino.nombre} />}
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
