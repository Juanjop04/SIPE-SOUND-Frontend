import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { ENLACE_EN_TEXTO } from "@/shared/ui";

/**
 * Pie del registro. Si la cuenta ya se creó pero el código no llegó (o el registro devolvió 429),
 * "Pedir otro código" lleva a /verificar con el correo escrito.
 */
export function EnlacesRegistro({ email }: { email: string }) {
  return (
    <div className="mt-8 flex flex-col gap-2 text-sm text-muted">
      <p>
        ¿Ya te registraste y no te llegó el código?{" "}
        <Link to={paths.verificar} state={{ email }} className={`font-medium ${ENLACE_EN_TEXTO}`}>
          Pedir otro código
        </Link>
      </p>
      <p>
        ¿Ya tienes cuenta?{" "}
        <Link to={paths.login} className={`font-medium ${ENLACE_EN_TEXTO}`}>
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
