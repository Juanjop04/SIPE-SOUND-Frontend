import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { ROL, useSession } from "@/features/auth";
import { loginConRegreso, paths } from "@/shared/config/paths.js";
import { EstadoVacio, MensajeError, Skeleton, claseBoton } from "@/shared/ui";
import { useMisCursos } from "../api";

/** Lo que ve un estudiante sin un curso aceptado: el camino es el catálogo (HU-F-513). */
export function SinCurso() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <EstadoVacio
        titulo="Aún no tienes un curso."
        descripcion="Para ver la ruta pide entrar a un curso: cuando tu docente o un administrador te acepte, aparecerá aquí. Si tu docente te dio un código, úsalo en Mis cursos."
        accion={
          <div className="flex flex-wrap justify-center gap-3">
            <Link to={paths.cursosDisponibles} className={claseBoton()}>
              Ver cursos disponibles
            </Link>
            <Link to={paths.cursos} className={claseBoton({ variante: "secundario" })}>
              Tengo un código
            </Link>
          </div>
        }
      />
    </main>
  );
}

/**
 * Envuelve lo que solo ve quien tiene un curso (HU-F-513): la ruta, las lecciones y los ejercicios.
 * Sin sesión → login; docentes y administradores pasan; un estudiante sin inscripción aceptada ve
 * el camino al catálogo.
 */
export function GuardiaCurso() {
  const { usuario, rol, estaCargando } = useSession();
  const { pathname, search } = useLocation();
  const cursos = useMisCursos();
  const esEstudiante = rol === ROL.estudiante;

  if (estaCargando) return <Skeleton lineas={3} className="mx-auto mt-8 h-10 max-w-2xl" />;
  if (!usuario) return <Navigate to={loginConRegreso(pathname + search)} replace />;
  if (rol !== null && !esEstudiante) return <Outlet />;
  if (cursos.isPending) return <Skeleton lineas={3} className="mx-auto mt-8 h-10 max-w-2xl" />;
  if (cursos.error) {
    return <MensajeError mensaje={cursos.error.message} onReintentar={() => cursos.refetch()} />;
  }
  if (cursos.data.length === 0) return <SinCurso />;
  return <Outlet />;
}
