// Única fuente de las URLs de la app (contrato 02 §3: nada de "/leccion/" + id suelto).
// Vive en shared y no en app/router: las páginas de features la usan para sus enlaces y
// features no puede importar de app (app → features → shared).
export const paths = Object.freeze({
  inicio: "/",
  login: "/login",
  registro: "/registro",
  terminos: "/terminos",
  acordes: "/acordes",
  ejercicios: "/ejercicios",
  progreso: "/progreso",
  /** @param {string | number} [id] */
  leccion: (id = ":id") => `/leccion/${id}`,
  /** @param {string | number} [bloqueId] */
  quiz: (bloqueId = ":bloqueId") => `/quiz/${bloqueId}`,
  catalogo: "/_componentes",
  // Atril del docente (HU-F-303).
  docente: Object.freeze({
    inicio: "/docente",
    cursos: "/docente/cursos",
    contenido: "/docente/contenido",
    evaluaciones: "/docente/evaluaciones",
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
