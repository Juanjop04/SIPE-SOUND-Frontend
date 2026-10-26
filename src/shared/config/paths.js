// Única fuente de las URLs de la app (contrato 02 §3: nada de "/leccion/" + id suelto).
// Vive en shared y no en app/router: las páginas de features la usan para sus enlaces y
// features no puede importar de app (app → features → shared).
export const paths = Object.freeze({
  inicio: "/",
  /** Ruta de aprendizaje (HU-F-315: con sesión de estudiante, "/" es el inicio). */
  ruta: "/ruta",
  login: "/login",
  registro: "/registro",
  /** Escribir el código de 6 dígitos que llegó al correo (HU-F-401). */
  verificar: "/verificar",
  /** Pedir el enlace para crear otra contraseña (HU-F-402). */
  recuperar: "/recuperar",
  /** Destino del enlace del correo: `/restablecer#token=…` (el token va en el fragmento). */
  restablecer: "/restablecer",
  /** Mensajes del estudiante (HU-F-407); el hilo abierto va en /mensajes/:hiloId. */
  mensajes: "/mensajes",
  /** @param {string} [hiloId] */
  mensaje: (hiloId = ":hiloId") => `/mensajes/${hiloId}`,
  /** Mi cuenta: nombre, correo y contraseña (HU-F-403). */
  cuenta: "/cuenta",
  terminos: "/terminos",
  /** Pantalla obligatoria cuando hay una versión nueva de los términos (HU-F-510). */
  aceptarTerminos: "/aceptar-terminos",
  acordes: "/acordes",
  ejercicios: "/ejercicios",
  /** @param {string | number} [id] */
  ejercicio: (id = ":id") => `/ejercicios/${id}`,
  progreso: "/progreso",
  /** Mis cursos: unirme con código y leer comentarios (HU-F-311). */
  cursos: "/cursos",
  /** Catálogo de todos los cursos para pedir inscripción (HU-F-513). */
  cursosDisponibles: "/cursos/disponibles",
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
    /** Estudiantes × bloques del curso y quién necesita apoyo (HU-F-406). */
    progreso: "/docente/progreso",
    /** Mensajes del docente y del admin (HU-F-407). */
    mensajes: "/docente/mensajes",
    /** @param {string} [hiloId] */
    mensaje: (hiloId = ":hiloId") => `/docente/mensajes/${hiloId}`,
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
    /** Cuentas: estado, verificación, suspensión y permisos (HU-F-404). */
    usuarios: "/admin/usuarios",
    /** Todos los cursos y sus estudiantes inscritos (HU-F-405). */
    cursos: "/admin/cursos",
    /** Editor Markdown de los términos y condiciones (HU-F-510). */
    terminos: "/admin/terminos",
  }),
});

/** /login?volver=<ruta actual>, para regresar tras iniciar sesión. */
export function loginConRegreso(volver) {
  return `${paths.login}?volver=${encodeURIComponent(volver)}`;
}
