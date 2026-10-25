import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { TrasteDivider } from "@/shared/music";

interface PaginaDeErrorProps {
  /** Código en mono, como un número de traste. */
  codigo: string;
  titulo: string;
  /** Qué pasó + qué hacer (contrato 05 §7). */
  descripcion: string;
  /** A dónde lleva el enlace de salida; por defecto, la ruta de aprendizaje. */
  volverA?: string;
}

function PaginaDeError({
  codigo,
  titulo,
  descripcion,
  volverA = paths.inicio,
}: PaginaDeErrorProps) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="font-mono text-sm text-muted">{codigo}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-paper">{titulo}</h1>
      <p className="mt-3 max-w-prose text-muted">{descripcion}</p>
      <TrasteDivider className="my-8" />
      <Link to={volverA} className="text-sm text-accent hover:underline">
        {volverA === paths.inicio
          ? "Volver a la ruta de aprendizaje"
          : "Volver al inicio del atril"}
      </Link>
    </main>
  );
}

const DESCRIPCION_404 = "Revisa la dirección o vuelve a la ruta para seguir practicando.";

/** 404 propio. `descripcion` permite explicar otros errores al abrir una página. */
export function NoEncontradoPage({
  descripcion = DESCRIPCION_404,
  volverA,
}: {
  descripcion?: string;
  volverA?: string;
}) {
  return (
    <PaginaDeError
      codigo="404"
      titulo="No encontramos esta página."
      descripcion={descripcion}
      volverA={volverA}
    />
  );
}

/** 403: la sección existe, pero el rol del usuario no la incluye. */
export function SinPermisoPage() {
  return (
    <PaginaDeError
      codigo="403"
      titulo="No tienes acceso a esta sección."
      descripcion="Esta parte es el atril de los docentes. Si das clase, pídele al administrador que active tu rol de docente."
    />
  );
}
