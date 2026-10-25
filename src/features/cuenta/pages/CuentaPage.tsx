import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { perfilKeys, usePerfil } from "@/features/auth";
import { formatearFecha } from "@/shared/lib/formato";
import { TrasteDivider } from "@/shared/music";
import { Button, MensajeError, Skeleton } from "@/shared/ui";
import { DialogoIdentidad } from "../components/DialogoIdentidad";
import { SeccionCuenta } from "../components/SeccionCuenta";
import { SeccionDatosPersonales } from "../components/SeccionDatosPersonales";
import type { Motivo } from "../utils/pasosIdentidad";

type Exitos = Partial<Record<Motivo, string>>;

function Cargando() {
  return (
    <div aria-busy="true" className="flex flex-col gap-10">
      <Skeleton lineas={3} />
      <Skeleton lineas={2} />
      <Skeleton lineas={2} />
    </div>
  );
}

export default function CuentaPage() {
  const queryClient = useQueryClient();
  const { perfil, estaCargando, error } = usePerfil();
  const [motivo, setMotivo] = useState<Motivo | null>(null);
  const [exitos, setExitos] = useState<Exitos>({});
  const cerrar = useCallback(() => setMotivo(null), []);
  const alTerminar = useCallback(
    (hecho: Motivo, mensaje: string) => setExitos((antes) => ({ ...antes, [hecho]: mensaje })),
    [],
  );

  return (
    <main className="mx-auto max-w-prose px-4 py-8 sm:px-8">
      <h1 className="font-display text-3xl font-semibold text-paper">Mi cuenta</h1>
      <p className="mt-2 text-sm text-muted">
        Tus datos, tu correo y tu contraseña. Para cambiar el correo o la contraseña te pedimos
        confirmar que eres tú.
      </p>
      <TrasteDivider className="my-8" />

      {estaCargando && <Cargando />}
      {!estaCargando && !perfil && (
        <MensajeError
          mensaje={error?.message ?? "No pudimos cargar tu cuenta."}
          onReintentar={() => void queryClient.invalidateQueries({ queryKey: perfilKeys.todo })}
        />
      )}
      {perfil && (
        <div className="flex flex-col gap-10">
          <SeccionDatosPersonales perfil={perfil} />
          <TrasteDivider />
          <SeccionCuenta
            titulo="Correo"
            exito={exitos.correo}
            accion={
              <Button variante="secundario" onClick={() => setMotivo("correo")}>
                Cambiar correo
              </Button>
            }
          >
            <p className="break-all font-mono text-paper">{perfil.email ?? "—"}</p>
            <p className="font-mono text-sm text-muted">
              {perfil.correo_verificado_en
                ? `Verificado el ${formatearFecha(perfil.correo_verificado_en)}`
                : "Sin verificar"}
            </p>
          </SeccionCuenta>
          <TrasteDivider />
          <SeccionCuenta
            titulo="Contraseña"
            exito={exitos.contrasena}
            accion={
              <Button variante="secundario" onClick={() => setMotivo("contrasena")}>
                Cambiar contraseña
              </Button>
            }
          />
        </div>
      )}

      <DialogoIdentidad motivo={motivo} onCerrar={cerrar} alTerminar={alTerminar} />
    </main>
  );
}
