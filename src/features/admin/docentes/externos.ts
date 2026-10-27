// Punto de acceso de docentes/ a lo que viene de cursos/ y usuarios/: evita imports ../../.
export { cursosAdminApi, cursosAdminKeys } from "../cursos/api";
export {
  DialogoQuitarDocente,
  type DocentePorQuitar,
} from "../cursos/components/DialogoQuitarDocente";
export { DialogoReasignar, type CursoPorReasignar } from "../cursos/components/DialogoReasignar";
export { useCursosDeDocente, useReasignarCurso } from "../cursos/hooks";
export type { CursoDeDocente, EstudianteDeCurso } from "../cursos/tipos";
export { useDetalleUsuario } from "../usuarios/hooks";
