import { Button, Field, Input, Select } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import type { FiltrosUsuarios as Filtros } from "../tipos";
import { useBusquedaDiferida } from "@/shared/hooks/useBusquedaDiferida";

interface FiltrosUsuariosProps {
  filtros: Filtros;
  hayFiltros: boolean;
  onCambiar: (cambios: Record<string, string | null>) => void;
  onQuitar: () => void;
}

/** Búsqueda, rol, permiso de nombre y orden. Todo se escribe en la URL. */
export function FiltrosUsuarios({
  filtros,
  hayFiltros,
  onCambiar,
  onQuitar,
}: FiltrosUsuariosProps) {
  const [texto, setTexto] = useBusquedaDiferida(filtros.q, (q) => onCambiar({ q }));

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end">
      <Field etiqueta="Buscar" ayuda="Nombre, apellido o correo.">
        {(campo) => (
          <Input
            {...campo}
            type="search"
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
            <option value="">Todos</option>
            <option value="estudiante">Estudiantes</option>
            <option value="docente">Docentes</option>
            <option value="admin">Administradores</option>
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
            <option value="si">Puede cambiarlo</option>
            <option value="no">No puede</option>
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
            <option value="-creado_en">Más recientes</option>
            <option value="-ultimo_acceso">Último acceso</option>
          </Select>
        )}
      </Field>
      {hayFiltros && (
        <Button variante="fantasma" onClick={onQuitar}>
          Quitar filtros
        </Button>
      )}
    </div>
  );
}
