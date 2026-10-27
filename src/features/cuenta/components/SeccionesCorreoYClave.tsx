import { useCallback, useState } from "react";
import { Button } from "@/shared/ui";
import type { PerfilCuenta } from "../types";
import type { Motivo } from "../utils/pasosIdentidad";
import { lineaVerificado } from "./EncabezadoCuenta";
import { PanelIdentidad } from "./PanelIdentidad";
import { SeccionCuenta } from "./SeccionCuenta";

/**
 * Correo y contraseña: cada uno abre su panel de confirmación de identidad. El resultado se
 * escribe encima de la sección y el panel se cierra (se destruye el token).
 */
export function SeccionesCorreoYClave({ perfil }: { perfil: PerfilCuenta }) {
  const [motivo, setMotivo] = useState<Motivo | null>(null);
  const [exitos, setExitos] = useState<Partial<Record<Motivo, string>>>({});
  const cerrar = useCallback(() => setMotivo(null), []);
  const alTerminar = useCallback((hecho: Motivo, mensaje: string) => {
    setExitos((antes) => ({ ...antes, [hecho]: mensaje }));
    setMotivo(null);
  }, []);

  return (
    <>
      <SeccionCuenta
        id="correo"
        titulo="Correo"
        descripcion="Lo usas para entrar y para recibir avisos. Para cambiarlo te pedimos tu contraseña y un código."
        exito={exitos.correo}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex flex-col gap-1">
            <span className="break-all font-mono text-sm text-paper">{perfil.email ?? "—"}</span>
            <span className="text-xs text-muted">{lineaVerificado(perfil)}</span>
          </span>
          {motivo !== "correo" && (
            <Button variante="secundario" onClick={() => setMotivo("correo")}>
              Cambiar correo
            </Button>
          )}
        </div>
        {motivo === "correo" && (
          <PanelIdentidad motivo="correo" onCerrar={cerrar} alTerminar={alTerminar} />
        )}
      </SeccionCuenta>
      <SeccionCuenta
        id="clave"
        titulo="Contraseña"
        descripcion="Al cambiarla se cierran tus sesiones en otros dispositivos."
        exito={exitos.contrasena}
      >
        {motivo !== "contrasena" && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span aria-hidden="true" className="font-mono text-sm tracking-[0.2em] text-muted">
              ••••••••••
            </span>
            <Button variante="secundario" onClick={() => setMotivo("contrasena")}>
              Cambiar contraseña
            </Button>
          </div>
        )}
        {motivo === "contrasena" && (
          <PanelIdentidad motivo="contrasena" onCerrar={cerrar} alTerminar={alTerminar} />
        )}
      </SeccionCuenta>
    </>
  );
}
