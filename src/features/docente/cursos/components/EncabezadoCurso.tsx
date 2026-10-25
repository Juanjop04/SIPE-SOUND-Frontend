import { useState } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { Tablatura } from "@/shared/music";
import { Button, Dialog, MensajeError, useAviso } from "@/shared/ui";
import type { CursoDetalle } from "../datos";
import { useRegenerarCodigo } from "../hooks/useCursos";
import { BotonCopiar } from "./BotonCopiar";

/** Nombre, datos y el código grande en mono con Copiar y Regenerar (con confirmación). */
export function EncabezadoCurso({ curso }: { curso: CursoDetalle }) {
  const regenerar = useRegenerarCodigo(curso.id);
  const { avisar } = useAviso();
  const [confirmando, setConfirmando] = useState(false);
  const archivado = curso.archivado_en !== null;

  async function confirmar() {
    const { message } = await regenerar.mutateAsync(undefined);
    avisar({ mensaje: message });
    setConfirmando(false);
  }

  return (
    <header className="flex flex-col gap-4">
      <Link
        to={paths.docente.cursos}
        className="font-mono text-sm text-accent underline underline-offset-2 hover:decoration-2"
      >
        ← Cursos
      </Link>
      <h1 className="font-display text-3xl font-semibold text-paper">{curso.nombre}</h1>
      <Tablatura
        datos={[
          { clave: "nivel", valor: curso.nivel },
          { clave: "estudiantes", valor: `${curso.estudiantes} estudiantes` },
          { clave: "estado", valor: archivado ? "archivado" : "activo" },
        ]}
      />
      {!archivado && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-3xl tracking-[0.3em] text-paper">
            {curso.codigo_invitacion}
          </span>
          <BotonCopiar
            texto={curso.codigo_invitacion}
            etiqueta="Copiar el código del curso"
            tamano="md"
          />
          <Button variante="secundario" onClick={() => setConfirmando(true)}>
            Regenerar
          </Button>
        </div>
      )}
      <Dialog
        abierto={confirmando}
        onCerrar={() => setConfirmando(false)}
        titulo="¿Regenerar el código?"
        descripcion="Los estudiantes que aún no se unen necesitarán el código nuevo."
        acciones={
          <>
            <Button variante="fantasma" onClick={() => setConfirmando(false)}>
              Cancelar
            </Button>
            <Button cargando={regenerar.isPending} onClick={() => confirmar().catch(() => null)}>
              Regenerar
            </Button>
          </>
        }
      >
        {regenerar.error && <MensajeError mensaje={regenerar.error.message} />}
      </Dialog>
    </header>
  );
}
