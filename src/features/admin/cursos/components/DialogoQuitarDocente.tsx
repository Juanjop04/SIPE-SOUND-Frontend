import { Button, Dialog, MensajeError } from "@/shared/ui";
import { useQuitarDocente } from "../hooks";

export interface DocentePorQuitar {
  cursoId: number;
  curso: string;
  estudiantes: number;
  /** Nombre completo de quien lo tiene hoy. */
  docente: string;
}

function Contenido({
  quitar,
  onCerrar,
  onHecho,
}: {
  quitar: DocentePorQuitar;
  onCerrar: () => void;
  onHecho?: () => void;
}) {
  const accion = useQuitarDocente();
  const resumen = `${quitar.curso} quedó sin docente y disponible. Sus ${quitar.estudiantes} estudiantes siguen inscritos.`;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-paper">
        <strong>{quitar.curso}</strong> queda sin docente y disponible. Sus {quitar.estudiantes}{" "}
        estudiantes siguen inscritos, y su ruta y evaluaciones se conservan. {quitar.docente} deja
        de ver el curso.
      </p>
      {accion.error && <MensajeError mensaje={accion.error.message} />}
      <div className="flex justify-end gap-3">
        <Button variante="fantasma" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button
          variante="peligro"
          cargando={accion.isPending}
          onClick={() =>
            accion.mutate(
              { cursoId: quitar.cursoId, resumen },
              {
                onSuccess: () => {
                  onCerrar();
                  onHecho?.();
                },
              },
            )
          }
        >
          Quitar docente
        </Button>
      </div>
    </div>
  );
}

/** Quitar al docente de un curso: nombra el curso y aclara que los estudiantes siguen inscritos. */
export function DialogoQuitarDocente({
  quitar,
  onCerrar,
  onHecho,
}: {
  /** null = cerrado. */
  quitar: DocentePorQuitar | null;
  onCerrar: () => void;
  onHecho?: () => void;
}) {
  return (
    <Dialog
      abierto={quitar !== null}
      onCerrar={onCerrar}
      titulo={quitar ? `Quitar a ${quitar.docente} de ${quitar.curso}` : "Quitar docente"}
    >
      {quitar && <Contenido quitar={quitar} onCerrar={onCerrar} onHecho={onHecho} />}
    </Dialog>
  );
}
