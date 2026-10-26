import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { perfilKeys, puedeUsarAtril, useSession } from "@/features/auth";
import { paths } from "@/shared/config/paths.js";
import { Button, Markdown, MensajeError, Skeleton } from "@/shared/ui";
import { terminosApi, useTerminosVigentes } from "../api";

/** Solo rutas internas ("/algo"): nunca un destino externo ni "//otro-sitio". */
function destinoSeguro(volver: string | null, porDefecto: string): string {
  return volver?.startsWith("/") && !volver.startsWith("//") ? volver : porDefecto;
}

/**
 * Pantalla obligatoria cuando el administrador publica una versión nueva (HU-F-510): se lee el
 * texto completo y, solo al aceptarlo, se sigue. También se puede cerrar la sesión.
 */
export default function AceptarTerminosPage() {
  const { perfil, rol, cerrarSesion } = useSession();
  const { data, isPending, error, refetch } = useTerminosVigentes();
  const [parametros] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [leido, setLeido] = useState(false);
  const inicio = puedeUsarAtril(rol) ? paths.docente.inicio : paths.inicio;

  const aceptar = useMutation({
    mutationFn: (version: number) => terminosApi.aceptar(version),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: perfilKeys.actual() });
      navigate(destinoSeguro(parametros.get("volver"), inicio), { replace: true });
    },
  });

  // Quien no tiene nada pendiente no debe quedarse aquí.
  if (perfil && !perfil.terminos_pendientes && !aceptar.isPending && !aceptar.isSuccess) {
    return <Navigate to={inicio} replace />;
  }

  return (
    <main className="mx-auto max-w-[68ch] px-4 py-8 sm:px-6">
      <p className="font-mono text-sm text-muted">Antes de continuar</p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-paper">
        Actualizamos los términos y condiciones
      </h1>
      <p className="mt-2 text-sm text-muted">
        Léelos completos y acéptalos para seguir usando SIPE-SOUND. Si no estás de acuerdo, puedes
        cerrar tu sesión.
      </p>
      <div
        className="mt-6 max-h-[55dvh] overflow-y-auto rounded-caja border border-linea p-4"
        // Región con scroll: debe poder enfocarse para leerla con el teclado.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        aria-label="Texto de los términos y condiciones"
      >
        {isPending && (
          <div aria-busy="true">
            <Skeleton lineas={8} className="h-6 w-full" />
          </div>
        )}
        {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
        {data && <Markdown texto={data.contenido} nivelInicial={2} />}
      </div>
      {data && <p className="mt-2 font-mono text-xs text-muted">Versión {data.version}</p>}
      <label className="mt-6 flex items-start gap-3 text-sm text-paper">
        <input
          type="checkbox"
          checked={leido}
          onChange={(e) => setLeido(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
        />
        Leí los términos y condiciones y los acepto.
      </label>
      {aceptar.error && <MensajeError mensaje={aceptar.error.message} />}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          disabled={!leido || !data}
          cargando={aceptar.isPending}
          onClick={() => data && aceptar.mutate(data.version)}
        >
          Aceptar y continuar
        </Button>
        <Button variante="secundario" onClick={() => void cerrarSesion()}>
          Cerrar sesión
        </Button>
      </div>
    </main>
  );
}
