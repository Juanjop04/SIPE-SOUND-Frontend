import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";

/** Tras registrarse. Mismo mensaje exista o no el correo (no se revela qué cuentas existen). */
export function ExitoRegistro({ mensaje, email }: { mensaje: string; email: string }) {
  return (
    <div role="status" className="flex flex-col gap-4">
      <h1 className="font-display text-3xl font-semibold">Revisa tu correo</h1>
      <p className="text-paper">{mensaje}</p>
      <p className="font-mono text-sm text-muted">{email}</p>
      <p className="text-sm text-muted">
        Abre el enlace del mensaje y luego{" "}
        <Link to={paths.login} className="font-medium text-accent hover:underline">
          inicia sesión
        </Link>
        .
      </p>
    </div>
  );
}
