import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { claseBoton } from "@/shared/ui";

/** Éxito de /verificar: el correo quedó confirmado y se puede iniciar sesión. */
export function CorreoConfirmado({ mensaje, email }: { mensaje: string; email: string }) {
  return (
    <div role="status" className="flex flex-col gap-4">
      <h1 className="font-display text-3xl font-semibold">Correo confirmado</h1>
      <p className="text-paper">{mensaje}</p>
      <p className="font-mono text-sm text-muted">{email}</p>
      <Link to={paths.login} state={{ email }} className={claseBoton({ className: "mt-2 w-full" })}>
        Iniciar sesión
      </Link>
    </div>
  );
}
