import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { PublicLayout } from "@/app/layouts/PublicLayout.jsx";
import { PaginaNoEncontrada } from "./PaginaNoEncontrada.jsx";

const HTTP_NO_ENCONTRADO = 404;
const MENSAJE_INESPERADO =
  "Ocurrió un error inesperado al abrir esta página. Recarga e inténtalo de nuevo.";

// errorElement de la raíz: errores al cargar una página (chunk caído, excepción en render).
export function ErrorDeRuta() {
  const error = useRouteError();
  const noEncontrada = isRouteErrorResponse(error) && error.status === HTTP_NO_ENCONTRADO;
  return (
    <PublicLayout>
      <PaginaNoEncontrada mensaje={noEncontrada ? undefined : MENSAJE_INESPERADO} />
    </PublicLayout>
  );
}
