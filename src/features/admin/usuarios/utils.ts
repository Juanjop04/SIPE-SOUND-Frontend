import { fechaRelativa, formatearFecha } from "@/shared/lib/formato";
import type { EstadoCuenta, RolCuenta, Usuario } from "./tipos";

export const ETIQUETA_ESTADO: Record<EstadoCuenta, string> = {
  pendiente_verificacion: "Pendiente",
  activa: "Activa",
  suspendida: "Suspendida",
};

export const ETIQUETA_ROL: Record<RolCuenta, string> = {
  estudiante: "Estudiante",
  docente: "Docente",
  admin: "Administrador",
};

export const DESCRIPCION_ROL: Record<RolCuenta, string> = {
  estudiante: "Toma cursos, presenta evaluaciones y ve su progreso.",
  docente: "Crea contenido y califica en los cursos que tiene a cargo.",
  admin: "Gestiona usuarios, roles, cursos y configuración.",
};

/** "Qué cambia" al pasar a un rol (y, si era administrador, lo que pierde). */
export function cambiosDeRol(destino: RolCuenta, eraAdmin: boolean): string[] {
  const base: Record<RolCuenta, string[]> = {
    admin: [
      "Podrá gestionar usuarios, cambiar roles y suspender cuentas.",
      "Tendrá acceso a todos los cursos, contenidos y a la configuración.",
      "Podrá cambiar su nombre sin pedir permiso.",
    ],
    docente: [
      "Podrá crear contenido y calificar evaluaciones en sus cursos.",
      "No podrá gestionar usuarios ni la configuración.",
    ],
    estudiante: [
      "Solo verá los cursos en los que esté inscrito.",
      "Pierde la creación de contenido y las calificaciones.",
    ],
  };
  if (!eraAdmin) return base[destino];
  return [
    ...base[destino],
    "Dejará de ver el panel de administración.",
    "El cambio de nombre quedará bloqueado; puedes permitirlo de nuevo después.",
  ];
}

/** Hasta 5 nombres y "y N más": para los diálogos de acciones en lote. */
export function listaDeNombres(usuarios: Pick<Usuario, "nombre" | "apellido">[]): string {
  const nombres = usuarios.slice(0, 5).map(nombreCompleto).join(", ");
  return usuarios.length > 5 ? `${nombres} y ${usuarios.length - 5} más` : nombres;
}

/** Texto de la acción del admin tal como queda en la historia de la cuenta. */
export const ETIQUETA_ACCION: Record<string, string> = {
  reenviar_verificacion: "Reenvió el código de verificación",
  verificar_manual: "Verificó el correo manualmente",
  suspender: "Suspendió la cuenta",
  reactivar: "Reactivó la cuenta",
  eliminar: "Eliminó la cuenta",
  cambiar_rol: "Cambió el rol",
  revocar_curso: "Revocó el acceso a un curso",
  reasignar_curso: "Reasignó un curso",
  permiso_nombre: "Cambió el permiso para editar el nombre",
  editar_cuenta: "Editó los datos de la cuenta",
};

export function nombreCompleto(usuario: Pick<Usuario, "nombre" | "apellido">): string {
  return [usuario.nombre, usuario.apellido].filter(Boolean).join(" ");
}

/** Segunda línea de la columna Actividad según el estado de la cuenta. */
export function lineaDeActividad(usuario: Usuario): string {
  if (usuario.estado === "suspendida") {
    return usuario.suspendido_en
      ? `Suspendida el ${formatearFecha(usuario.suspendido_en)}`
      : "Suspendida";
  }
  if (usuario.estado === "activa") return "Correo verificado";
  const envio = usuario.ultimo_envio_verificacion;
  return envio ? `Código ${fechaRelativa(envio.creado_en)}` : "Sin código enviado";
}

export interface TextoEnvio {
  texto: string;
  fallo: boolean;
}

/** "Último envío del código": solo importa en cuentas pendientes (en las demás, "—"). */
export function textoEnvio(usuario: Usuario, enviando: boolean): TextoEnvio {
  if (usuario.estado !== "pendiente_verificacion") return { texto: "—", fallo: false };
  if (enviando) return { texto: "Enviando…", fallo: false };
  const envio = usuario.ultimo_envio_verificacion;
  if (!envio) return { texto: "Sin envíos", fallo: false };
  if (envio.estado === "fallido") return { texto: "No se pudo enviar", fallo: true };
  return { texto: `Enviado ${fechaRelativa(envio.creado_en)}`, fallo: false };
}
