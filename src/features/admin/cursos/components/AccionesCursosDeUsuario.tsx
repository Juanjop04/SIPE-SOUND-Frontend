import { useState } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { Button, Dialog, ENLACE_EN_TEXTO, MensajeError } from "@/shared/ui";
import { useRetirarDeTodosLosCursos } from "../hooks";

interface AccionesCursosDeUsuarioProps {
  usuario: { id: string; nombre: string; rol: string; inscripciones: number };
}

function Confirmar({
  usuario,
  onCerrar,
}: {
  usuario: AccionesCursosDeUsuarioProps["usuario"];
  onCerrar: () => void;
}) {
  const retirar = useRetirarDeTodosLosCursos();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-paper">
        {usuario.nombre} deja de ver sus {usuario.inscripciones} cursos activos. Su progreso se
        conserva.
      </p>
      {retirar.error && <MensajeError mensaje={retirar.error.message} />}
      <div className="flex justify-end gap-3">
        <Button variante="fantasma" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button
          variante="peligro"
          cargando={retirar.isPending}
          onClick={() => retirar.mutate(usuario.id, { onSuccess: onCerrar })}
        >
          Retirar de todos los cursos
        </Button>
      </div>
    </div>
  );
}

/**
 * En el detalle de una cuenta: a un estudiante se le retira de todos sus cursos; de un docente se
 * enlaza la lista de sus cursos a cargo (donde se reasignan).
 */
export function AccionesCursosDeUsuario({ usuario }: AccionesCursosDeUsuarioProps) {
  const [abierto, setAbierto] = useState(false);
  if (usuario.rol === "docente") {
    return (
      <p className="text-sm">
        <Link to={`${paths.admin.cursos}?docente=${usuario.id}`} className={ENLACE_EN_TEXTO}>
          Ver los cursos de {usuario.nombre}
        </Link>
      </p>
    );
  }
  if (usuario.rol !== "estudiante" || usuario.inscripciones === 0) return null;
  return (
    <>
      <div>
        <Button variante="secundario" tamano="sm" onClick={() => setAbierto(true)}>
          Retirar de todos los cursos
        </Button>
      </div>
      <Dialog
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        titulo="Retirar de todos los cursos"
        descripcion="Si compartió el código de algún curso, el docente debe regenerarlo."
      >
        <Confirmar usuario={usuario} onCerrar={() => setAbierto(false)} />
      </Dialog>
    </>
  );
}
