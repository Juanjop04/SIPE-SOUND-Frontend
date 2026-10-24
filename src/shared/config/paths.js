// Única fuente de las URLs de la app (contrato 02 §3: nada de "/leccion/" + id suelto).
// Vive en shared y no en app/router: las páginas de features la usan para sus enlaces y
// features no puede importar de app (app → features → shared).
export const paths = Object.freeze({
  inicio: "/",
  /** Ruta de aprendizaje (HU-F-315: con sesión de estudiante, "/" es el inicio). */
  ruta: "/ruta",
  login: "/login",
  registro: "/registro",
  terminos: "/terminos",
  acordes: "/acordes",
  ejercicios: "/ejercicios",
  /** @param {string | number} [id] */
  ejercicio: (id = ":id") => `/ejercicios/${id}`,
  progreso: "/progreso",
  /** @param {string | number} [id] */
  leccion: (id = ":id") => `/leccion/${id}`,
  /** @param {string | number} [id] */
  evaluacion: (id = ":id") => `/evaluacion/${id}`,
  /** URL anterior: redirige a evaluacion() con el evaluacion_id del bloque. */
  /** @param {string | number} [bloqueId] */
  quiz: (bloqueId = ":bloqueId") => `/quiz/${bloqueId}`,
  catalogo: "/_componentes",
  // Atril del docente (HU-F-303).
  docente: Object.freeze({
    inicio: "/docente",
    cursos: "/docente/cursos",
    /** @param {string | number} [id] */
    curso: (id = ":id") => `/docente/cursos/${id}`,
    contenido: "/docente/contenido",
    /** @param {string | number} [id] "nueva" para crear */
    leccion: (id = ":id") => `/docente/contenido/lecciones/${id}`,
    /** @param {string | number} [id] "nuevo" para crear */
    ejercicio: (id = ":id") => `/docente/contenido/ejercicios/${id}`,
    evaluaciones: "/docente/evaluaciones",
    /** "nueva" para crear (HU-F-310). @param {string | number} [id] */
    evaluacion: (id = ":id") => `/docente/evaluaciones/${id}`,
    /** @param {string | number} [id] */
    resultados: (id = ":id") => `/docente/evaluaciones/${id}/resultados`,
  }),
  // Administración (solo rol admin, HU-F-313).
  admin: Object.freeze({
    docentes: "/admin/docentes",
  }),
});

/** /login?volver=<ruta actual>, para regresar tras iniciar sesión. */
export function loginConRegreso(volver) {
  return `${paths.login}?volver=${encodeURIComponent(volver)}`;
}
