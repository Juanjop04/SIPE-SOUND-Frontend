// Única fuente de las URLs de la app (contrato 02 §3: nada de "/leccion/" + id suelto).
// Vive en shared y no en app/router: las páginas de features la usan para sus enlaces y
// features no puede importar de app (app → features → shared).
export const paths = Object.freeze({
  inicio: "/",
  login: "/login",
  registro: "/registro",
  recuperar: "/recuperar",
  acordes: "/acordes",
  ejercicios: "/ejercicios",
  progreso: "/progreso",
  leccion: (id = ":id") => `/leccion/${id}`,
  quiz: (bloqueId = ":bloqueId") => `/quiz/${bloqueId}`,
  catalogo: "/_componentes",
});

/** /login?volver=<ruta actual>, para regresar tras iniciar sesión. */
export function loginConRegreso(volver) {
  return `${paths.login}?volver=${encodeURIComponent(volver)}`;
}
