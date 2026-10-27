import { useState } from "react";
import type { Borrador } from "./components/DetalleUsuario";
import type { Pendiente } from "./components/DialogosUsuarios";
import {
  useCambiarRol,
  useEditarUsuario,
  usePermisoNombre,
  useReactivar,
  useSuspender,
} from "./hooks";
import type { DetalleUsuario } from "./tipos";

/** Avisos por correo que se eligen en los diálogos al guardar desde el panel. */
interface Avisos {
  rol: boolean;
  suspension: boolean;
}

/**
 * Guardar desde el panel de edición: el rol y la suspensión pasan por su diálogo de confirmación
 * antes de aplicarse; el resto (datos, permiso de nombre, reactivar) se aplica al instante.
 */
export function useGuardarCuenta(
  miId: string | undefined,
  pedirConfirmacion: (pendiente: Pendiente) => void,
  alTerminar: () => void,
) {
  const editar = useEditarUsuario();
  const cambiarRol = useCambiarRol();
  const suspender = useSuspender();
  const reactivar = useReactivar();
  const permiso = usePermisoNombre();
  const [guardando, setGuardando] = useState(false);

  async function aplicar(u: DetalleUsuario, b: Borrador, avisos: Avisos) {
    const nombre = b.nombre.trim();
    const apellido = b.apellido.trim();
    const email = b.email.trim().toLowerCase();
    const rolCambia = b.rol !== u.rol;
    // El rol primero: si falla (p. ej. un docente con cursos), no se aplica nada más.
    if (rolCambia) {
      await cambiarRol.mutateAsync({ usuario: u, rol: b.rol, notificar: avisos.rol });
    }
    if (nombre !== u.nombre || apellido !== (u.apellido ?? "") || email !== u.email.toLowerCase()) {
      await editar.mutateAsync({ usuario: u, nombre, apellido, email });
    }
    // Al cambiar de rol el backend ya fijó el permiso de nombre (administrador: siempre sí).
    if (!rolCambia && b.rol !== "admin" && b.puedeEditarNombre !== u.puede_editar_nombre) {
      await permiso.mutateAsync({ usuario: u, permitir: b.puedeEditarNombre });
    }
    const estabaActiva = u.estado !== "suspendida";
    if (b.activa && !estabaActiva) await reactivar.mutateAsync(u);
    if (!b.activa && estabaActiva) {
      await suspender.mutateAsync({ usuario: u, notificar: avisos.suspension });
    }
    alTerminar();
  }

  async function guardar(u: DetalleUsuario, b: Borrador) {
    const rolCambia = b.rol !== u.rol && u.id !== miId;
    const apaga = !b.activa && u.estado !== "suspendida" && u.id !== miId;
    if (rolCambia) {
      pedirConfirmacion({
        accion: "rol",
        usuarios: [u],
        rol: b.rol,
        tambienSuspende: apaga,
        alConfirmar: (avisar) => aplicar(u, b, { rol: avisar, suspension: avisar }),
      });
    } else if (apaga) {
      pedirConfirmacion({
        accion: "suspender",
        usuarios: [u],
        alConfirmar: (avisar) => aplicar(u, b, { rol: false, suspension: avisar }),
      });
    } else {
      setGuardando(true);
      try {
        await aplicar(u, b, { rol: false, suspension: false });
      } catch {
        // El aviso de error ya salió; el panel queda abierto con lo escrito.
      } finally {
        setGuardando(false);
      }
    }
  }

  return { guardar, guardando };
}
