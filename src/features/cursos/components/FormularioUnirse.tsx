import { useId, useState, type FormEvent } from "react";
import { ApiError } from "@/shared/api/ApiError.js";
import { useEnfriamiento } from "@/shared/hooks/useEnfriamiento";
import { Button, useAviso } from "@/shared/ui";
import { esDemasiadasSolicitudes } from "@/shared/validacion";
import { useUnirse } from "../api";
import { errorDeCodigo } from "../validarCodigo";
import { CampoCodigo } from "./CampoCodigo";

const HTTP_NO_ENCONTRADO = 404;
const NO_EXISTE = "El código no existe o el curso ya cerró. Pídele a tu docente un código nuevo.";

/** "Unirme" con el código que comparte el docente; mensajes con la voz del sistema de diseño. */
export function FormularioUnirse() {
  const id = useId();
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const unirse = useUnirse();
  const { avisar } = useAviso();
  const { enfriando, iniciar } = useEnfriamiento();
  const idError = `${id}-error`;
  const describe = error ? `${id}-ayuda ${idError}` : `${id}-ayuda`;

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    const invalido = errorDeCodigo(codigo);
    if (invalido) return setError(invalido);
    setError(null);
    try {
      const curso = await unirse.mutateAsync(codigo);
      avisar({ mensaje: `Te uniste a ${curso.nombre}.` });
      setCodigo("");
    } catch (e) {
      if (esDemasiadasSolicitudes(e)) {
        iniciar();
        setError("Hiciste muchos intentos seguidos. Espera un minuto y vuelve a probar.");
      } else if (e instanceof ApiError && e.statusCode === HTTP_NO_ENCONTRADO) {
        setError(NO_EXISTE);
      } else {
        setError(e instanceof Error ? e.message : NO_EXISTE);
      }
    }
  }

  return (
    <form onSubmit={(e) => enviar(e).catch(() => null)} noValidate className="flex flex-col gap-3">
      <label htmlFor={id} className="text-sm font-medium text-paper">
        Código del curso
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <CampoCodigo
          id={id}
          valor={codigo}
          onCambiar={(nuevo) => {
            setCodigo(nuevo);
            setError(null);
          }}
          invalido={Boolean(error)}
          aria-describedby={describe}
        />
        <Button type="submit" cargando={unirse.isPending} disabled={enfriando}>
          Unirme
        </Button>
      </div>
      <p id={`${id}-ayuda`} className="text-sm text-muted">
        Tu docente te lo comparte: 8 letras y números, sin 0, O, 1, I ni L.
      </p>
      {error && (
        <p id={idError} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
