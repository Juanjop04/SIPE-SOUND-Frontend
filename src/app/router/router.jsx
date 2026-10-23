import { createBrowserRouter } from "react-router-dom";
import { cargarAcordesPage } from "@/features/acordes";
import { cargarLoginPage, cargarRegistroPage, ROLES_ATRIL } from "@/features/auth";
import {
  cargarContenidoPage,
  cargarCursosPage,
  cargarEvaluacionesPage,
  cargarResumenPage,
} from "@/features/docente";
import { cargarEjerciciosPage } from "@/features/ejercicios";
import { cargarQuizBloquePage } from "@/features/evaluaciones";
import { cargarLeccionDetallePage } from "@/features/lecciones";
import { cargarProgresoPage } from "@/features/progreso";
import { cargarRutaPage } from "@/features/ruta";
import { env } from "@/shared/config/env.js";
import { paths } from "@/shared/config/paths.js";
import AuthLayout from "@/app/layouts/AuthLayout.jsx";
import { EstudianteLayout } from "@/app/layouts/EstudianteLayout";
import { ErrorDeRuta } from "./ErrorDeRuta.jsx";
import { NoEncontradoPage } from "./PaginasDeError";
import { RequireAuth } from "./RequireAuth.jsx";
import { RequireRole } from "./RequireRole";

// Cada página se descarga al visitarla (un chunk por página, conectividad baja).
const pagina = (cargar) => async () => ({ Component: (await cargar()).default });

// El atril solo lo descarga quien entra a /docente (los estudiantes nunca lo cargan).
const cargarDocenteLayout = async () => ({
  Component: (await import("@/app/layouts/DocenteLayout")).DocenteLayout,
});

// Catálogo de componentes: solo en `npm run dev`; en producción /_componentes da 404.
const rutasDeDesarrollo = env.esDesarrollo
  ? [{ path: paths.catalogo, lazy: pagina(() => import("@/app/catalogo/CatalogoPage")) }]
  : [];

export const router = createBrowserRouter([
  {
    errorElement: <ErrorDeRuta />,
    children: [
      {
        element: <EstudianteLayout />,
        children: [
          { path: paths.inicio, lazy: pagina(cargarRutaPage) },
          { path: paths.leccion(), lazy: pagina(cargarLeccionDetallePage) },
          { path: paths.acordes, lazy: pagina(cargarAcordesPage) },
          { path: paths.ejercicios, lazy: pagina(cargarEjerciciosPage) },
          {
            element: <RequireAuth />,
            children: [
              { path: paths.progreso, lazy: pagina(cargarProgresoPage) },
              { path: paths.quiz(), lazy: pagina(cargarQuizBloquePage) },
            ],
          },
          ...rutasDeDesarrollo,
          { path: "*", element: <NoEncontradoPage /> },
        ],
      },
      {
        // Atril del docente (HU-F-303): sesión + rol docente o admin (de GET /me).
        element: <RequireAuth />,
        children: [
          {
            element: <RequireRole roles={ROLES_ATRIL} />,
            children: [
              {
                lazy: cargarDocenteLayout,
                children: [
                  { path: paths.docente.inicio, lazy: pagina(cargarResumenPage) },
                  { path: paths.docente.cursos, lazy: pagina(cargarCursosPage) },
                  { path: paths.docente.contenido, lazy: pagina(cargarContenidoPage) },
                  { path: paths.docente.evaluaciones, lazy: pagina(cargarEvaluacionesPage) },
                ],
              },
            ],
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: paths.login,
            lazy: pagina(cargarLoginPage),
            handle: {
              titulo: "Aprende guitarra a tu ritmo",
              descripcion:
                "Practica acordes, completa ejercicios y SUPERATE para desbloquear el siguiente nivel.",
            },
          },
          {
            path: paths.registro,
            lazy: pagina(cargarRegistroPage),
            handle: {
              titulo: "Tocar guitarra esta al alcance de tu mano",
              descripcion:
                "Crea tu cuenta gratis y preparate para los retos de cada leccion que te haran un mejor aprendiz.",
            },
          },
        ],
      },
    ],
  },
]);
