import { Button, Field, Input, Select } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import type { FiltrosUsuarios as Filtros, TotalesPorRol } from "../tipos";
import { useBusquedaDiferida } from "@/shared/hooks/useBusquedaDiferida";

interface FiltrosUsuariosProps {
  filtros: Filtros;
  /** Cuentas por rol (para mostrar el conteo en cada opción). */
  roles: TotalesPorRol | undefined;
  hayFiltros: boolean;
  onCambiar: (cambios: Record<string, string | null>) => void;
  onQuitar: () => void;
}

const conteo = (n: number | undefined) => (n === undefined ? "" : ` (${n})`);

/** Búsqueda, rol, cambio de nombre y orden. Todo se escribe en la URL. */
export function FiltrosUsuarios({
  filtros,
  roles,
  hayFiltros,
  onCambiar,
  onQuitar,
}: FiltrosUsuariosProps) {
  const [texto, setTexto] = useBusquedaDiferida(filtros.q, (q) => onCambiar({ q }));

  return (
    <div className="grid gap-3 min-[561px]:grid-cols-2 min-[1101px]:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] min-[1101px]:items-end">
      <Field etiqueta="Buscar" className="min-[561px]:col-span-2 min-[1101px]:col-span-1">
        {(campo) => (
          <Input
            {...campo}
            type="search"
            placeholder="Nombre, apellido o correo"
            value={texto}
            maxLength={LIMITES.busqueda.max}
            autoComplete="off"
            onChange={(evento) => setTexto(evento.target.value)}
          />
        )}
      </Field>
      <Field etiqueta="Rol">
        {(campo) => (
          <Select
            {...campo}
            value={filtros.rol ?? ""}
            onChange={(e) => onCambiar({ rol: e.target.value || null })}
          >
            <option value="">Todos los roles</option>
            <option value="estudiante">Estudiantes{conteo(roles?.estudiante)}</option>
            <option value="docente">Docentes{conteo(roles?.docente)}</option>
            <option value="admin">Administradores{conteo(roles?.admin)}</option>
          </Select>
        )}
      </Field>
      <Field etiqueta="Cambio de nombre">
        {(campo) => (
          <Select
            {...campo}
            value={filtros.permiso ?? ""}
            onChange={(e) => onCambiar({ permiso: e.target.value || null })}
          >
            <option value="">Cualquiera</option>
            <option value="si">Permitido</option>
            <option value="no">Bloqueado</option>
          </Select>
        )}
      </Field>
      <Field etiqueta="Ordenar por">
        {(campo) => (
          <Select
            {...campo}
            value={filtros.orden}
            onChange={(e) => onCambiar({ orden: e.target.value })}
          >
            <option value="nombre">Nombre</option>
            <option value="apellido">Apellido</option>
            <option value="-ultimo_acceso">Último acceso</option>
            <option value="rol">Rol</option>
          </Select>
        )}
      </Field>
      {hayFiltros && (
        <Button
          variante="fantasma"
          onClick={onQuitar}
          className="min-[561px]:col-span-2 min-[1101px]:col-span-4 min-[1101px]:w-fit"
        >
          Quitar filtros
        </Button>
      )}
    </div>
  );
}
