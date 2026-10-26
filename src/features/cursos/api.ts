import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/features/auth";
import { http } from "@/shared/api/httpClient.js";

export type EstadoDeCurso = "sin_iniciar" | "en_curso" | "finalizado";

/** Avance en la ruta del curso (HU-B-502): el backend lo calcula, aquí solo se muestra. */
export interface AvanceDeCurso {
  /** 0 a 100: lecciones completadas de la ruta del curso. */
  pct: number;
  lecciones: { completadas: number; total: number };
  ejercicios: { completados: number; total: number };
  bloques_aprobados: number;
  bloques_total: number;
}

/** Fila de GET /cursos (HU-B-307, HU-B-502): mis cursos activos con docente, avance y estado. */
export interface MiCurso {
  id: number;
  nombre: string;
  descripcion: string | null;
  nivel: string;
  /** null si el curso quedó sin docente (HU-B-413). */
  docente_nombre: string | null;
  docente: { nombre: string | null; apellido: string | null };
  inscrito_en: string;
  retroalimentaciones_sin_leer: number;
  avance: AvanceDeCurso;
  estado: EstadoDeCurso;
  /** En la ruta de este curso; null si aún no registra nada. */
  ultimo_avance: string | null;
}

/** GET /cursos/{id}/retroalimentaciones (HU-B-312): al consultarlas quedan leídas. */
export interface Comentario {
  id: string;
  mensaje: string;
  creado_en: string;
  docente: string | null;
  /** No la había leído antes de esta consulta. */
  nueva: boolean;
}

/** Bloque de GET /ruta?curso_id= (lo que necesita "Continuar": la primera lección pendiente). */
export interface BloqueDeCurso {
  id: number;
  numero: number;
  titulo: string;
  estado: "bloqueado" | "disponible" | "aprobado";
  lecciones: { id: number; numero: number; completado: boolean }[];
}

/** Relación del estudiante con un curso del catálogo (HU-B-414). */
export type EstadoDeSolicitud = "inscrito" | "pendiente" | "rechazada" | null;

/** Fila de GET /cursos/catalogo: todos los cursos activos para pedir inscripción. */
export interface CursoDelCatalogo {
  id: number;
  nombre: string;
  descripcion: string | null;
  nivel: string;
  docente_nombre: string | null;
  docente_apellido: string | null;
  estudiantes: number;
  bloques_en_ruta: number;
  mi_estado: EstadoDeSolicitud;
}

export const cursosApi = {
  catalogo: (): Promise<CursoDelCatalogo[]> => http.get("/cursos/catalogo"),
  solicitar: (cursoId: number) => http.conMensaje("POST", `/cursos/${cursoId}/solicitudes`),
  cancelarSolicitud: (cursoId: number) =>
    http.conMensaje("DELETE", `/cursos/${cursoId}/solicitudes`),
  misCursos: (): Promise<MiCurso[]> => http.get("/cursos"),
  unirse: (codigo: string): Promise<MiCurso> => http.post("/cursos/unirse", { codigo }),
  comentarios: (cursoId: number): Promise<Comentario[]> =>
    http.get(`/cursos/${cursoId}/retroalimentaciones`),
  ruta: (cursoId: number): Promise<BloqueDeCurso[]> => http.get("/ruta", { curso_id: cursoId }),
};

export const cursosKeys = {
  todo: ["mis-cursos"] as const,
  lista: () => [...cursosKeys.todo, "lista"] as const,
  catalogo: () => [...cursosKeys.todo, "catalogo"] as const,
  comentarios: (id: number) => [...cursosKeys.todo, "comentarios", id] as const,
  ruta: (id: number) => [...cursosKeys.todo, "ruta", id] as const,
};

/** Solo con sesión: el visitante no tiene cursos. */
export function useMisCursos() {
  const { sesion } = useSession();
  return useQuery({
    queryKey: cursosKeys.lista(),
    queryFn: cursosApi.misCursos,
    enabled: Boolean(sesion),
  });
}

export function useUnirse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cursosApi.unirse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cursosKeys.lista() });
      // Clave de features/ruta (rutaKeys.todas): sin importarla para no crear un ciclo ruta ↔ cursos.
      queryClient.invalidateQueries({ queryKey: ["ruta"] });
    },
  });
}

/**
 * Leer los comentarios los marca como leídos: después se refresca el contador de la lista.
 * En el inicio no se refresca de inmediato, para que la sección no desaparezca al mostrarse.
 */
export function useComentarios(cursoId: number | null, { refrescarLista = true } = {}) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: cursosKeys.comentarios(cursoId ?? 0),
    queryFn: async () => {
      const comentarios = await cursosApi.comentarios(cursoId ?? 0);
      if (refrescarLista) queryClient.invalidateQueries({ queryKey: cursosKeys.lista() });
      return comentarios;
    },
    enabled: cursoId !== null,
    // Una vez leídos no cambian hasta que el docente escriba: sin recargas automáticas.
    staleTime: 5 * 60_000,
  });
}

export function useRutaDeUnCurso(cursoId: number) {
  return useQuery({ queryKey: cursosKeys.ruta(cursoId), queryFn: () => cursosApi.ruta(cursoId) });
}

/** Todos los cursos activos con mi estado en cada uno (inscrito, pendiente, rechazada). */
export function useCatalogo() {
  const { sesion } = useSession();
  return useQuery({
    queryKey: cursosKeys.catalogo(),
    queryFn: cursosApi.catalogo,
    enabled: Boolean(sesion),
  });
}

/** Pedir o retirar una solicitud: el catálogo cambia el estado de esa tarjeta. */
export function useSolicitudDeInscripcion() {
  const queryClient = useQueryClient();
  const refrescar = () => queryClient.invalidateQueries({ queryKey: cursosKeys.catalogo() });
  const solicitar = useMutation({ mutationFn: cursosApi.solicitar, onSuccess: refrescar });
  const cancelar = useMutation({ mutationFn: cursosApi.cancelarSolicitud, onSuccess: refrescar });
  return { solicitar, cancelar };
}
