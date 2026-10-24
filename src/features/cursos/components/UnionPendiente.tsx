import { useEffect } from "react";
import { useSession } from "@/features/auth";
import { useAviso } from "@/shared/ui";
import { useUnirse } from "../api";
import { tomarCodigoPendiente } from "../codigo";

/**
 * Enlace compartido por el docente (/registro?codigo=…, HU-F-311): al haber sesión, une al
 * estudiante una sola vez y lo confirma. No pinta nada.
 */
export function UnionPendiente() {
  const { sesion, rol } = useSession();
  const { mutateAsync } = useUnirse();
  const { avisar } = useAviso();

  // Sincroniza con un sistema externo (sessionStorage + API) cuando ya hay sesión de estudiante.
  useEffect(() => {
    if (!sesion || rol !== "estudiante") return;
    const codigo = tomarCodigoPendiente();
    if (!codigo) return;
    mutateAsync(codigo)
      .then((curso) => avisar({ mensaje: `Te uniste a ${curso.nombre}.` }))
      .catch(() =>
        avisar({
          tipo: "error",
          mensaje: "No pudimos unirte con el enlace. Escribe el código en Mis cursos.",
        }),
      );
  }, [sesion, rol, mutateAsync, avisar]);

  return null;
}
