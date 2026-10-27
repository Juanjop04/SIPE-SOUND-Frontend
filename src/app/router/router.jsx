import { createBrowserRouter } from "react-router-dom";
import { cargarAcordesPage } from "@/features/acordes";
import { cargarCuentaPage } from "@/features/cuenta";
import { cargarCatalogoPage, cargarMisCursosPage, GuardiaCurso } from "@/features/cursos";
import {
  cargarCursosAdminPage,
  cargarDocenteDetallePage,
  cargarDocentesPage,
  cargarSolicitudesNombrePage,
  cargarTerminosAdminPage,
  cargarUsuariosPage,
} from "@/features/admin";
import {
  cargarLoginPage,
  cargarRecuperarPage,
  cargarRegistroPage,
  cargarRestablecerPage,
  cargarVerificarPage,
  ROLES_ADMIN,
  ROLES_ATRIL,
} from "@/features/auth";
import {
  cargarContenidoPage,
  cargarCursoDetallePage,
  cargarCursosPage,
  cargarEditorEjercicioPage,
  cargarEditorEvaluacionPage,
  cargarEditorLeccionPage,
  cargarEvaluacionesPage,
  cargarProgresoDocentePage,
  cargarSolicitudesPage,
  cargarResultadosEvaluacionPage,
  cargarResumenPage,
} from "@/features/docente";
import { cargarMensajesPage } from "@/features/mensajes";
import { cargarEjercicioDetallePage, cargarEjerciciosPage } from "@/features/ejercicios";
import { cargarEvaluacionPage, cargarRedireccionQuizPage } from "@/features/evaluaciones";
import { cargarLeccionDetallePage } from "@/features/lecciones";
import { cargarAceptarTerminosPage, cargarTerminosPage, GuardiaTerminos } from "@/features/legal";
import { cargarProgresoPage } from "@/features/progreso";
import { cargarRutaPage } from "@/features/ruta";
import { env } from "@/shared/config/env.js";
import { paths } from "@/shared/config/paths.js";
import AuthLayout from "@/app/layouts/AuthLayout.jsx";
import { EstudianteLayout } from "@/app/layouts/EstudianteLayout";
import { LayoutDeCuenta } from "@/app/layouts/LayoutDeCuenta";
import { ErrorDeRuta, ErrorEnPagina } from "./ErrorDeRuta.jsx";
import { NoEncontradoPage } from "./PaginasDeError";
import { PaginaRaiz } from "./PaginaRaiz";
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
    element: <GuardiaTerminos />,
    errorElement: <ErrorDeRuta />,
    children: [
      {
        // Sin menú: quien debe aceptar los términos solo ve esto (HU-F-510).
        element: <RequireAuth />,
        children: [{ path: paths.aceptarTerminos, lazy: pagina(cargarAceptarTerminosPage) }],
      },
      {
        element: <EstudianteLayout />,
        children: [
          {
            errorElement: <ErrorEnPagina />,
            children: [
              // Con sesión de estudiante, el inicio; si no, la ruta pública (HU-F-315).
              { path: paths.inicio, element: <PaginaRaiz /> },
              { path: paths.acordes, lazy: pagina(cargarAcordesPage) },
              {
                // Solo con un curso aceptado (HU-F-513): sin él, el camino es el catálogo.
                element: <GuardiaCurso />,
                children: [
                  { path: paths.ruta, lazy: pagina(cargarRutaPage) },
                  { path: paths.leccion(), lazy: pagina(cargarLeccionDetallePage) },
                  { path: paths.ejercicios, lazy: pagina(cargarEjerciciosPage) },
                  { path: paths.ejercicio(), lazy: pagina(cargarEjercicioDetallePage) },
                ],
              },
              { path: paths.terminos, lazy: pagina(cargarTerminosPage) },
              {
                element: <RequireAuth />,
                children: [
                  { path: paths.progreso, lazy: pagina(cargarProgresoPage) },
                  { path: paths.cursos, lazy: pagina(cargarMisCursosPage) },
                  { path: paths.cursosDisponibles, lazy: pagina(cargarCatalogoPage) },
                  { path: paths.mensajes, lazy: pagina(cargarMensajesPage) },
                  { path: paths.mensaje(), lazy: pagina(cargarMensajesPage) },
                  { path: paths.evaluacion(), lazy: pagina(cargarEvaluacionPage) },
                  { path: paths.quiz(), lazy: pagina(cargarRedireccionQuizPage) },
                ],
              },
              ...rutasDeDesarrollo,
              { path: "*", element: <NoEncontradoPage /> },
            ],
          },
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
                  {
                    errorElement: <ErrorEnPagina />,
                    children: [
                      { path: paths.docente.inicio, lazy: pagina(cargarResumenPage) },
                      { path: paths.docente.cursos, lazy: pagina(cargarCursosPage) },
                      { path: paths.docente.curso(), lazy: pagina(cargarCursoDetallePage) },
                      { path: paths.docente.progreso, lazy: pagina(cargarProgresoDocentePage) },
                      { path: paths.docente.solicitudes, lazy: pagina(cargarSolicitudesPage) },
                      { path: paths.docente.mensajes, lazy: pagina(cargarMensajesPage) },
                      { path: paths.docente.mensaje(), lazy: pagina(cargarMensajesPage) },
                      { path: paths.docente.contenido, lazy: pagina(cargarContenidoPage) },
                      { path: paths.docente.leccion(), lazy: pagina(cargarEditorLeccionPage) },
                      { path: paths.docente.ejercicio(), lazy: pagina(cargarEditorEjercicioPage) },
                      { path: paths.docente.evaluaciones, lazy: pagina(cargarEvaluacionesPage) },
                      {
                        path: paths.docente.evaluacion(),
                        lazy: pagina(cargarEditorEvaluacionPage),
                      },
                      {
                        path: paths.docente.resultados(),
                        lazy: pagina(cargarResultadosEvaluacionPage),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            // Mi cuenta (HU-F-403): cualquier rol, con el layout de su rol.
            element: <LayoutDeCuenta />,
            children: [{ path: paths.cuenta, lazy: pagina(cargarCuentaPage) }],
          },
          {
            // Administración: solo rol admin, dentro del mismo atril.
            element: <RequireRole roles={ROLES_ADMIN} />,
            children: [
              {
                lazy: cargarDocenteLayout,
                children: [
                  {
                    errorElement: <ErrorEnPagina />,
                    children: [
                      { path: paths.admin.usuarios, lazy: pagina(cargarUsuariosPage) },
                      { path: paths.admin.cursos, lazy: pagina(cargarCursosAdminPage) },
                      { path: paths.admin.docentes, lazy: pagina(cargarDocentesPage) },
                      { path: paths.admin.docente(), lazy: pagina(cargarDocenteDetallePage) },
                      { path: paths.admin.terminos, lazy: pagina(cargarTerminosAdminPage) },
                      {
                        path: paths.admin.solicitudesNombre,
                        lazy: pagina(cargarSolicitudesNombrePage),
                      },
                    ],
                  },
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
                "Practica acordes, completa ejercicios y aprueba cada bloque para desbloquear el siguiente.",
            },
          },
          {
            path: paths.registro,
            lazy: pagina(cargarRegistroPage),
            handle: {
              titulo: "Tocar guitarra está al alcance de tu mano",
              descripcion:
                "Crea tu cuenta gratis: cada lección trae acordes, ejercicios con metrónomo y una evaluación al final del bloque.",
            },
          },
          {
            path: paths.recuperar,
            lazy: pagina(cargarRecuperarPage),
            handle: {
              titulo: "Todos olvidamos algo alguna vez",
              descripcion:
                "Te enviamos un enlace para elegir otra contraseña. Tus lecciones y tu progreso siguen intactos.",
            },
          },
          {
            path: paths.restablecer,
            lazy: pagina(cargarRestablecerPage),
            handle: {
              titulo: "Casi listo para volver a tocar",
              descripcion:
                "Elige una contraseña nueva. Al guardarla, cerramos tus sesiones abiertas en otros equipos.",
            },
          },
          {
            path: paths.verificar,
            lazy: pagina(cargarVerificarPage),
            handle: {
              titulo: "Un paso más y empiezas a practicar",
              descripcion:
                "Confirmamos tu correo con un código para proteger tu cuenta. Solo toma un minuto.",
            },
          },
        ],
      },
    ],
  },
]);
