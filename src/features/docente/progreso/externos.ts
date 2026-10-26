// Punto de acceso de progreso/ a lo que ya existe en cursos/ y estudiantes/ (HU-F-309):
// evita imports ../../ desde sus componentes.
export { useCurso } from "../cursos/hooks/useCursos";
export { ORDENES, descargar, ordenDe } from "../estudiantes/utils";
export type { BloqueSeguido, IntentoSeguido, Retroalimentacion } from "../estudiantes/tipos";
export { evaluacionesApi, evaluacionesKeys } from "../evaluaciones/api";
