import { fechaRelativa } from "@/shared/lib/formato";
import type { EstadoCuenta, RolCuenta, Usuario } from "./tipos";

export const ETIQUETA_ESTADO: Record<EstadoCuenta, string> = {
  pendiente_verificacion: "Pendiente",
  activa: "Activa",
  suspendida: "Suspendida",
};

export const ETIQUETA_ROL: Record<RolCuenta, string> = {
  estudiante: "Estudiante",
  docente: "Docente",
  admin: "Admin",
};

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
};

export function nombreCompleto(usuario: Pick<Usuario, "nombre" | "apellido">): string {
  return [usuario.nombre, usuario.apellido].filter(Boolean).join(" ");
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
