import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { claseBoton } from "@/shared/ui";

/** Tras registrarse. Mismo mensaje exista o no el correo (no se revela qué cuentas existen). */
export function ExitoRegistro({ mensaje, email }: { mensaje: string; email: string }) {
  return (
    <div role="status" className="flex flex-col gap-4">
      <h1 className="font-display text-3xl font-semibold">Revisa tu correo</h1>
      <p className="text-paper">{mensaje}</p>
      <p className="font-mono text-sm text-muted">{email}</p>
      <Link
        to={paths.verificar}
        state={{ email, recienEnviado: true }}
        className={claseBoton({ className: "mt-2 w-full" })}
      >
        Escribir el código
      </Link>
      <p className="text-sm text-muted">
        Si no lo ves en unos minutos, revisa el correo no deseado.
      </p>
    </div>
  );
}
