import { createBrowserRouter } from "react-router-dom";
import { cargarAcordesPage } from "@/features/acordes";
import { cargarLoginPage, cargarRegistroPage } from "@/features/auth";
import { cargarEjerciciosPage } from "@/features/ejercicios";
import { cargarQuizBloquePage } from "@/features/evaluaciones";
import { cargarLeccionDetallePage } from "@/features/lecciones";
import { cargarProgresoPage } from "@/features/progreso";
import { cargarRutaPage } from "@/features/ruta";
import { env } from "@/shared/config/env.js";
import { paths } from "@/shared/config/paths.js";
import AuthLayout from "@/app/layouts/AuthLayout.jsx";
import { PublicLayout } from "@/app/layouts/PublicLayout.jsx";
import { ErrorDeRuta } from "./ErrorDeRuta.jsx";
import { PaginaNoEncontrada } from "./PaginaNoEncontrada.jsx";
import { RequireAuth } from "./RequireAuth.jsx";

// Cada página se descarga al visitarla (un chunk por página, conectividad baja).
const pagina = (cargar) => async () => ({ Component: (await cargar()).default });

// Catálogo de componentes: solo en `npm run dev`; en producción /_componentes da 404.
const rutasDeDesarrollo = env.esDesarrollo
  ? [{ path: paths.catalogo, lazy: pagina(() => import("@/app/catalogo/CatalogoPage")) }]
  : [];

export const router = createBrowserRouter([
  {
    errorElement: <ErrorDeRuta />,
    children: [
      {
        element: <PublicLayout />,
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
          { path: "*", element: <PaginaNoEncontrada /> },
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
