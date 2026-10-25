import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useSession } from "@/features/auth";
import { useMisCursos } from "./api";

const PARAMETRO = "curso";
const clave = (usuarioId: string) => `sipe-ruta-curso:${usuarioId}`;

function leer(usuarioId: string | undefined): string | null {
  if (!usuarioId) return null;
  try {
    return localStorage.getItem(clave(usuarioId));
  } catch {
    return null;
  }
}

function guardar(usuarioId: string | undefined, cursoId: number | null): void {
  if (!usuarioId) return;
  try {
    if (cursoId === null) localStorage.removeItem(clave(usuarioId));
    else localStorage.setItem(clave(usuarioId), String(cursoId));
  } catch {
    // Sin almacenamiento: la elección vale para esta visita (queda en la URL).
  }
}

/**
 * Ruta general o la de uno de mis cursos (HU-F-311): ?curso= en la URL o, si no está, la última
 * elección de este estudiante. Un curso del que ya no soy parte vuelve a la ruta general.
 */
export function useRutaDeCurso() {
  const { usuario } = useSession();
  const { data: cursos } = useMisCursos();
  const [parametros, setParametros] = useSearchParams();
  const pedido = parametros.get(PARAMETRO) ?? leer(usuario?.id);
  const cursoId = cursos?.find((c) => String(c.id) === pedido)?.id ?? null;

  const elegir = useCallback(
    (nuevo: number | null) => {
      guardar(usuario?.id, nuevo);
      setParametros(
        (p) => {
          const siguientes = new URLSearchParams(p);
          if (nuevo === null) siguientes.delete(PARAMETRO);
          else siguientes.set(PARAMETRO, String(nuevo));
          siguientes.delete("bloque");
          return siguientes;
        },
        { replace: true },
      );
    },
    [usuario?.id, setParametros],
  );

  return { cursoId, cursos: cursos ?? [], elegir };
}
