import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { EstudianteLayout } from "@/app/layouts/EstudianteLayout";
import { NoEncontradoPage } from "./PaginasDeError";

const HTTP_NO_ENCONTRADO = 404;
const MENSAJE_INESPERADO =
  "Ocurrió un error inesperado al abrir esta página. Recarga e inténtalo de nuevo.";

// errorElement de la raíz: errores al cargar una página (chunk caído, excepción en render).
export function ErrorDeRuta() {
  const error = useRouteError();
  const noEncontrada = isRouteErrorResponse(error) && error.status === HTTP_NO_ENCONTRADO;
  return (
    <EstudianteLayout>
      <NoEncontradoPage descripcion={noEncontrada ? undefined : MENSAJE_INESPERADO} />
    </EstudianteLayout>
  );
}
