import { useQueryClient } from "@tanstack/react-query";
import { perfilKeys, usePerfil } from "@/features/auth";
import { MensajeError, Skeleton } from "@/shared/ui";
import { EncabezadoCuenta } from "../components/EncabezadoCuenta";
import { IndiceCuenta } from "../components/IndiceCuenta";
import { SeccionDatosPersonales } from "../components/SeccionDatosPersonales";
import { SeccionesCorreoYClave } from "../components/SeccionesCorreoYClave";
import { SeccionApariencia, SeccionSesion } from "../components/SeccionesAparienciaYSesion";

function Cargando() {
  return (
    <div aria-busy="true" className="flex flex-col gap-10">
      <Skeleton lineas={3} />
      <Skeleton lineas={2} />
      <Skeleton lineas={2} />
    </div>
  );
}

/** Mi cuenta (HU-F-403, rediseño HU-F-521): identidad arriba, índice y secciones debajo. */
export default function CuentaPage() {
  const queryClient = useQueryClient();
  const { perfil, estaCargando, error } = usePerfil();

  return (
    <main className="mx-auto flex max-w-[67.5rem] flex-col gap-8 px-4 py-8 sm:px-8 sm:py-9">
      {estaCargando && <Cargando />}
      {!estaCargando && !perfil && (
        <MensajeError
          mensaje={error?.message ?? "No pudimos cargar tu cuenta."}
          onReintentar={() => void queryClient.invalidateQueries({ queryKey: perfilKeys.todo })}
        />
      )}
      {perfil && (
        <>
          <EncabezadoCuenta perfil={perfil} />
          <div className="grid items-start gap-5 min-[1101px]:grid-cols-[11.5rem_minmax(0,1fr)] min-[1101px]:gap-10">
            <IndiceCuenta />
            <div className="flex min-w-0 flex-col">
              <SeccionDatosPersonales perfil={perfil} />
              <SeccionesCorreoYClave perfil={perfil} />
              <SeccionApariencia />
              <SeccionSesion />
            </div>
          </div>
        </>
      )}
    </main>
  );
}
