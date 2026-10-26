import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { EstudianteLayout } from "@/app/layouts/EstudianteLayout";
import { puedeUsarAtril, usePerfil } from "@/features/auth";
import { paths } from "@/shared/config/paths.js";
import { NoEncontradoPage } from "./PaginasDeError";

const HTTP_NO_ENCONTRADO = 404;
const MENSAJE_INESPERADO =
  "Ocurrió un error inesperado al abrir esta página. Recarga e inténtalo de nuevo.";

function descripcionDe(error) {
  const noEncontrada = isRouteErrorResponse(error) && error.status === HTTP_NO_ENCONTRADO;
  return noEncontrada ? undefined : MENSAJE_INESPERADO;
}

// errorElement de la raíz: lo que falla ANTES de que haya un layout (p. ej. el propio layout).
export function ErrorDeRuta() {
  const error = useRouteError();
  console.error("[ruta]", error);
  return (
    <EstudianteLayout>
      <NoEncontradoPage descripcion={descripcionDe(error)} />
    </EstudianteLayout>
  );
}

// errorElement de cada grupo de páginas: el error se muestra DENTRO del layout del rol (un docente
// conserva su menú del atril) y "Volver" lleva al inicio de su rol. La causa queda en la consola.
export function ErrorEnPagina() {
  const error = useRouteError();
  const { rol } = usePerfil();
  console.error("[página]", error);
  return (
    <NoEncontradoPage
      descripcion={descripcionDe(error)}
      volverA={puedeUsarAtril(rol) ? paths.docente.inicio : paths.inicio}
    />
  );
}
