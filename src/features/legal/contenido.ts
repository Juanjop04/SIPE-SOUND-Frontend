// Términos y condiciones redactados por el equipo (commit 128fa7a, retirado de Registro en 25f676a).
// ⚠️ Borrador: el propio texto pide revisarlo con un instructor o un abogado antes de publicarlo.

/** Correo para ejercer los derechos de la Ley 1581. Pendiente: el equipo debe definirlo. */
export const CORREO_CONTACTO = "[correo de contacto pendiente de publicar]";

export interface SeccionTerminos {
  numero: number;
  titulo: string;
  texto: string;
}

export const SECCIONES_TERMINOS: SeccionTerminos[] = [
  {
    numero: 1,
    titulo: "Sobre SIPE SOUND",
    texto:
      "SIPE SOUND es una plataforma educativa para aprender guitarra, desarrollada como proyecto de tesis en el marco del SENA. Actualmente se encuentra en fase de desarrollo académico (MVP) y aún no tiene registro mercantil. Sus funciones pueden cambiar o interrumpirse mientras se mejora.",
  },
  {
    numero: 2,
    titulo: "Uso de la plataforma",
    texto:
      "Tu cuenta es personal y eres responsable de mantener tu contraseña en secreto. Te comprometes a usar la plataforma solo con fines de aprendizaje, sin copiar, distribuir ni vender sus contenidos, y sin intentar acceder a cuentas o datos de otras personas.",
  },
  {
    numero: 3,
    titulo: "Tratamiento de datos personales",
    texto: `Conforme a la Ley 1581 de 2012, te informamos que guardamos tu nombre, tu correo electrónico y tu progreso (lecciones, ejercicios y quizzes). Usamos estos datos para crear tu cuenta, guardar tu avance y mejorar la plataforma. Se almacenan mediante el servicio Supabase y no se venden a terceros. Tienes derecho a conocer, actualizar, rectificar y solicitar la eliminación de tus datos, o a revocar tu autorización, escribiendo a ${CORREO_CONTACTO}.`,
  },
  {
    numero: 4,
    titulo: "Propiedad intelectual",
    texto:
      "De acuerdo con la Ley 23 de 1982 sobre derechos de autor, el diseño, el código, los textos, los ejercicios y la marca SIPE SOUND pertenecen a sus autores. Al registrarte no adquieres derechos sobre ellos, solo un permiso personal de uso.",
  },
  {
    numero: 5,
    titulo: "Aceptación electrónica",
    texto:
      "Al marcar la casilla de aceptación y crear tu cuenta, manifiestas de forma electrónica que leíste y aceptas estos términos, lo cual tiene validez según la Ley 527 de 1999 sobre comercio electrónico y mensajes de datos.",
  },
  {
    numero: 6,
    titulo: "Alcance del servicio",
    texto:
      "Por ser un proyecto académico, el servicio se ofrece tal como está, sin garantía de disponibilidad continua. El contenido es de apoyo para el aprendizaje y no reemplaza la enseñanza de un profesor presencial.",
  },
  {
    numero: 7,
    titulo: "Cambios",
    texto:
      "Podemos actualizar estos términos cuando el proyecto evolucione. Si el cambio es importante, te lo avisaremos en la plataforma.",
  },
];
