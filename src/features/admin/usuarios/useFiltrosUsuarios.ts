import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type {
  EstadoCuenta,
  FiltrosUsuarios,
  FiltroPermiso,
  OrdenUsuarios,
  RolCuenta,
} from "./tipos";
import { LIMITES } from "@/shared/validacion";

const ESTADOS: readonly EstadoCuenta[] = ["pendiente_verificacion", "activa", "suspendida"];
const ROLES: readonly RolCuenta[] = ["estudiante", "docente", "admin"];
const PERMISOS: readonly FiltroPermiso[] = ["si", "no"];
const ORDENES: readonly OrdenUsuarios[] = [
  "nombre",
  "apellido",
  "-ultimo_acceso",
  "rol",
  "-creado_en",
];

// Un valor de la URL que no es de la lista (enlace viejo o escrito a mano) se ignora.
function dentroDe<T extends string>(opciones: readonly T[], valor: string | null): T | undefined {
  return opciones.find((opcion) => opcion === valor);
}

/** Estado, rol, permiso, búsqueda, orden, página y cuenta abierta viven en la URL. */
export function useFiltrosUsuarios() {
  const [parametros, setParametros] = useSearchParams();
  const filtros: FiltrosUsuarios = {
    estado: dentroDe(ESTADOS, parametros.get("estado")),
    rol: dentroDe(ROLES, parametros.get("rol")),
    permiso: dentroDe(PERMISOS, parametros.get("permiso")),
    q: parametros.get("q")?.slice(0, LIMITES.busqueda.max) || undefined,
    orden: dentroDe(ORDENES, parametros.get("orden")) ?? "nombre",
    pagina: Math.max(1, Number(parametros.get("pagina")) || 1),
  };

  /** Cambia solo las claves indicadas (null las quita). Un filtro nuevo vuelve a la página 1. */
  const cambiar = useCallback(
    (cambios: Record<string, string | null>) =>
      setParametros(
        (previos) => {
          const nuevos = new URLSearchParams(previos);
          Object.entries(cambios).forEach(([clave, valor]) =>
            valor ? nuevos.set(clave, valor) : nuevos.delete(clave),
          );
          if (!("pagina" in cambios) && !("usuario" in cambios)) nuevos.delete("pagina");
          return nuevos;
        },
        { replace: true },
      ),
    [setParametros],
  );

  const hayFiltros = Boolean(filtros.estado || filtros.rol || filtros.permiso || filtros.q);
  const quitarFiltros = useCallback(
    () => cambiar({ estado: null, rol: null, permiso: null, q: null }),
    [cambiar],
  );

  return { filtros, usuarioId: parametros.get("usuario"), cambiar, hayFiltros, quitarFiltros };
}
