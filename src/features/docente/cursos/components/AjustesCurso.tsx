import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { Button, Dialog, Input, MensajeError, useAviso } from "@/shared/ui";
import type { CursoDetalle } from "../datos";
import { useArchivarCurso, useEditarCurso } from "../hooks/useCursos";
import { FormularioCurso } from "./FormularioCurso";

/** Editar datos y, al final, la zona de peligro: archivar escribiendo el nombre del curso. */
export function AjustesCurso({ curso }: { curso: CursoDetalle }) {
  const editar = useEditarCurso(curso.id);
  const archivar = useArchivarCurso(curso.id);
  const { avisar } = useAviso();
  const navigate = useNavigate();
  const idConfirmacion = useId();
  const [confirmando, setConfirmando] = useState(false);
  const [escrito, setEscrito] = useState("");
  const archivado = curso.archivado_en !== null;

  async function confirmarArchivo() {
    const { message } = await archivar.mutateAsync(undefined);
    avisar({ mensaje: message });
    navigate(`${paths.docente.cursos}?estado=archivado`);
  }

  return (
    <div className="flex max-w-xl flex-col gap-12">
      <FormularioCurso
        inicial={curso}
        textoEnviar="Guardar cambios"
        deshabilitado={archivado}
        onGuardar={async (datos) => avisar({ mensaje: (await editar.mutateAsync(datos)).message })}
      />
      {!archivado && (
        <section aria-labelledby="zona-peligro" className="border-t border-danger/40 pt-6">
          <h3 id="zona-peligro" className="font-display text-lg font-semibold text-danger">
            Archivar curso
          </h3>
          <p className="mt-1 text-sm text-muted">
            Los estudiantes conservan su historial, pero el código deja de servir y el curso sale de
            tu lista de activos.
          </p>
          <Button variante="peligro" className="mt-4" onClick={() => setConfirmando(true)}>
            Archivar curso
          </Button>
        </section>
      )}
      <Dialog
        abierto={confirmando}
        onCerrar={() => {
          setConfirmando(false);
          setEscrito("");
        }}
        titulo="¿Archivar este curso?"
        descripcion={`Escribe «${curso.nombre}» para confirmar.`}
        acciones={
          <Button
            variante="peligro"
            cargando={archivar.isPending}
            disabled={escrito.trim() !== curso.nombre}
            onClick={() => confirmarArchivo().catch(() => null)}
          >
            Archivar
          </Button>
        }
      >
        <label htmlFor={idConfirmacion} className="sr-only">
          Nombre del curso
        </label>
        <Input
          id={idConfirmacion}
          value={escrito}
          onChange={(e) => setEscrito(e.target.value)}
          autoComplete="off"
        />
        {archivar.error && <MensajeError className="mt-3" mensaje={archivar.error.message} />}
      </Dialog>
    </div>
  );
}
