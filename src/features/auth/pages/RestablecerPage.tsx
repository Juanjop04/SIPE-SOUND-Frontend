import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { useReferrerNulo } from "@/shared/hooks/useReferrerNulo";
import { Button, claseBoton, MensajeError } from "@/shared/ui";
import { CamposPassword } from "../components/CamposPassword";
import { useRestablecer } from "../hooks/useRestablecer";

export default function RestablecerPage() {
  useReferrerNulo();
  const { formulario, enviar, enviando, enfriando, errorGeneral, enlaceInvalido, listo } =
    useRestablecer();
  const {
    register,
    control,
    formState: { errors },
  } = formulario;

  if (listo) {
    return (
      <div role="status" className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-semibold">Contraseña cambiada</h1>
        <p className="text-paper">{listo}</p>
        <Link to={paths.login} className={claseBoton({ className: "mt-2 w-full" })}>
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (enlaceInvalido) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-semibold">Este enlace ya no sirve</h1>
        <p role="alert" className="text-paper">
          {enlaceInvalido}
        </p>
        <Link to={paths.recuperar} className={claseBoton({ className: "mt-2 w-full" })}>
          Pedir otro enlace
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-3xl font-semibold">Elige una contraseña nueva</h1>
      <p className="mt-2 text-muted">
        Al guardarla cerramos tus sesiones abiertas en otros equipos.
      </p>

      <form onSubmit={enviar} noValidate className="mt-8 flex flex-col gap-5">
        <CamposPassword register={register} control={control} errors={errors} />

        {errorGeneral && <MensajeError mensaje={errorGeneral} />}

        <Button type="submit" className="w-full" cargando={enviando} disabled={enfriando}>
          {enviando ? "Guardando…" : "Guardar contraseña"}
        </Button>
      </form>
    </>
  );
}
