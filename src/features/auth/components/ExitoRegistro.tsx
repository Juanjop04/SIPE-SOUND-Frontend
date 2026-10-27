import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { claseBoton } from "@/shared/ui";

interface ExitoRegistroProps {
  mensaje: string;
  email: string;
  /** El correo ya había empezado a registrarse: no se creó otra cuenta. */
  enCurso: boolean;
  /** Segundos que le quedan al código; /verificar sigue la cuenta regresiva desde ahí. */
  venceEnSegundos: number;
}

/** Tras registrarse, o al toparse con un registro que ya estaba en curso. */
export function ExitoRegistro({ mensaje, email, enCurso, venceEnSegundos }: ExitoRegistroProps) {
  return (
    <div role="status" className="flex flex-col gap-4">
      <h1 className="font-display text-3xl font-semibold">
        {enCurso ? "Ya tienes un registro en curso" : "Revisa tu correo"}
      </h1>
      <p className="text-paper">{mensaje}</p>
      <p className="font-mono text-sm text-muted">{email}</p>
      <Link
        to={paths.verificar}
        state={{ email, venceEnSegundos, enCurso }}
        className={claseBoton({ className: "mt-2 w-full" })}
      >
        Escribir el código
      </Link>
      <p className="text-sm text-muted">
        {enCurso
          ? "Si tu código ya venció, en la siguiente pantalla puedes pedir otro."
          : "Si no lo ves, revisa el correo no deseado. El código dura un minuto."}
      </p>
    </div>
  );
}
