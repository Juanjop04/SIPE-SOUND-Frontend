import { cn } from "@/shared/lib/cn.js";
import { formatearFecha } from "@/shared/lib/formato";
import { Interruptor } from "@/shared/ui";
import type { EstadoCuenta, RolCuenta, Usuario } from "../tipos";
import {
  ETIQUETA_ESTADO,
  ETIQUETA_ROL,
  lineaDeActividad,
  nombreCompleto,
  textoEnvio,
} from "../utils";
import { AccionesFila, type AccionUsuario } from "./AccionesFila";

const COLOR_ESTADO: Record<EstadoCuenta, string> = {
  pendiente_verificacion: "text-aviso",
  activa: "text-success",
  suspendida: "text-danger",
};

const COLOR_ROL: Record<RolCuenta, string> = {
  estudiante: "border-linea-fuerte text-paper",
  docente: "border-accent/50 text-accent",
  admin: "border-primary text-primary-claro",
};

const ROLES = Object.keys(ETIQUETA_ROL) as RolCuenta[];

interface FilaProps {
  usuario: Usuario;
  propia: boolean;
  marcada: boolean;
  editando: boolean;
  enviando: boolean;
  onAlternar: (usuario: Usuario) => void;
  onAccion: (accion: AccionUsuario, usuario: Usuario) => void;
  onCambiarRol: (usuario: Usuario, rol: RolCuenta) => void;
}

function CeldaNombre({ usuario: u, onAccion }: Pick<FilaProps, "usuario" | "onAccion">) {
  const sinApellido = !u.apellido?.trim();
  return (
    <div role="cell" data-celda="who" className="flex min-w-0 flex-col gap-0.5">
      <span className="flex min-w-0 items-baseline">
        <button
          type="button"
          onClick={() => onAccion("detalle", u)}
          className="truncate text-left text-sm font-semibold text-paper underline-offset-4 hover:underline"
        >
          {nombreCompleto(u)}
        </button>
        {sinApellido && <span className="ml-2 text-xs font-semibold text-aviso">Sin apellido</span>}
      </span>
      <span className="truncate font-mono text-xs text-muted">{u.email}</span>
    </div>
  );
}

function CeldaRol({
  usuario: u,
  propia,
  onCambiarRol,
}: Pick<FilaProps, "usuario" | "propia" | "onCambiarRol">) {
  return (
    <div role="cell" data-celda="rol" data-label="Rol">
      {/* Controlado: si el diálogo se cancela, el selector vuelve al rol que tiene la cuenta. */}
      <select
        value={u.rol}
        disabled={propia}
        onChange={(e) => onCambiarRol(u, e.target.value as RolCuenta)}
        aria-label={`Rol de ${nombreCompleto(u)}`}
        title={propia ? "No puedes cambiar tu propio rol" : undefined}
        className={cn(
          "h-9 w-full rounded-md border bg-surface px-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60",
          COLOR_ROL[u.rol],
        )}
      >
        {ROLES.map((rol) => (
          <option key={rol} value={rol}>
            {ETIQUETA_ROL[rol]}
          </option>
        ))}
      </select>
    </div>
  );
}

function CeldaActividad({ usuario: u, enviando }: Pick<FilaProps, "usuario" | "enviando">) {
  const envio = textoEnvio(u, enviando);
  const hayEnvio = u.estado === "pendiente_verificacion" && (enviando || envio.fallo);
  return (
    <div role="cell" data-celda="acty" data-label="Actividad" className="flex flex-col gap-0.5">
      <span className="font-mono text-xs text-paper">
        {u.ultimo_acceso ? formatearFecha(u.ultimo_acceso) : "Sin accesos"}
      </span>
      <span className={cn("text-xs", envio.fallo ? "text-danger" : "text-muted")}>
        {hayEnvio ? envio.texto : lineaDeActividad(u)}
      </span>
    </div>
  );
}

function tituloCuenta(propia: boolean, esAdmin: boolean, suspendida: boolean): string {
  if (propia) return "No puedes suspender tu propia cuenta";
  if (esAdmin) return "Los administradores no se suspenden";
  return suspendida
    ? "Cuenta suspendida: enciéndela para reactivarla"
    : "Cuenta activa: apágala para suspenderla";
}

function textoNombre(esAdmin: boolean, editable: boolean): string {
  if (esAdmin) return "Nombre editable";
  return editable ? "Cambio de nombre" : "Nombre bloqueado";
}

function tituloNombre(esAdmin: boolean, editable: boolean): string {
  if (esAdmin) return "Los administradores siempre pueden cambiar su nombre";
  return editable
    ? "Puede cambiar su nombre: apágalo para bloquearlo"
    : "No puede cambiar su nombre: enciéndelo para permitirlo";
}

function CeldaPermisos({
  usuario: u,
  propia,
  onAccion,
}: Pick<FilaProps, "usuario" | "propia" | "onAccion">) {
  const nombre = nombreCompleto(u);
  const esAdmin = u.rol === "admin";
  const suspendida = u.estado === "suspendida";
  return (
    <div
      role="cell"
      data-celda="perm"
      data-label="Permisos"
      className="flex flex-col gap-2 max-[820px]:flex-row max-[820px]:flex-wrap max-[820px]:gap-x-6"
    >
      <Interruptor
        activo={!suspendida}
        etiqueta={`Cuenta activa de ${nombre}`}
        texto="Cuenta activa"
        titulo={tituloCuenta(propia, esAdmin, suspendida)}
        disabled={propia || esAdmin}
        onCambiar={() => onAccion(suspendida ? "reactivar" : "suspender", u)}
      />
      <Interruptor
        activo={u.puede_editar_nombre}
        etiqueta={`Permitir cambio de nombre a ${nombre}`}
        texto={textoNombre(esAdmin, u.puede_editar_nombre)}
        titulo={tituloNombre(esAdmin, u.puede_editar_nombre)}
        disabled={esAdmin}
        onCambiar={() => onAccion(u.puede_editar_nombre ? "bloquear" : "permitir", u)}
      />
    </div>
  );
}

function Fila(props: FilaProps) {
  const { usuario: u, propia, marcada, editando, onAlternar, onAccion } = props;
  return (
    <div
      role="row"
      className={cn(
        "fila-cuenta transition-colors duration-rapida hover:bg-surface",
        marcada && "bg-primary/5",
        editando && "bg-primary/10",
      )}
    >
      <div role="cell" data-celda="cb">
        <input
          type="checkbox"
          checked={marcada}
          disabled={propia}
          onChange={() => onAlternar(u)}
          aria-label={`Elegir a ${nombreCompleto(u)}`}
          className="h-[18px] w-[18px] accent-primary"
        />
      </div>
      <CeldaNombre usuario={u} onAccion={onAccion} />
      <CeldaRol usuario={u} propia={propia} onCambiarRol={props.onCambiarRol} />
      <div role="cell" data-celda="st">
        <span className={cn("text-sm font-semibold", COLOR_ESTADO[u.estado])}>
          {ETIQUETA_ESTADO[u.estado]}
        </span>
      </div>
      <CeldaActividad usuario={u} enviando={props.enviando} />
      <CeldaPermisos usuario={u} propia={propia} onAccion={onAccion} />
      <div role="cell" data-celda="act">
        <AccionesFila usuario={u} propia={propia} onAccion={onAccion} />
      </div>
    </div>
  );
}

interface TablaUsuariosProps {
  usuarios: Usuario[];
  seleccion: ReadonlyMap<string, Usuario>;
  /** Id del administrador conectado: su fila no cambia de rol, no se suspende ni se elimina. */
  miId: string | undefined;
  /** Cuenta abierta en el panel (resaltada). */
  editandoId: string | null;
  /** Cuentas cuyo código se está reenviando ("Enviando…"). */
  enviando: ReadonlySet<string>;
  onAlternar: (usuario: Usuario) => void;
  onElegirPagina: (usuarios: Usuario[], marcar: boolean) => void;
  onAccion: (accion: AccionUsuario, usuario: Usuario) => void;
  onCambiarRol: (usuario: Usuario, rol: RolCuenta) => void;
}

function Cabecera({ todas, onElegir }: { todas: boolean; onElegir: () => void }) {
  return (
    <div
      role="row"
      className="fila-cuenta fila-cabecera border-t-0 bg-ink-2 py-2.5 text-xs font-semibold text-muted"
    >
      <div role="columnheader">
        <input
          type="checkbox"
          checked={todas}
          onChange={onElegir}
          aria-label="Elegir todas las cuentas visibles"
          className="h-[18px] w-[18px] accent-primary"
        />
      </div>
      <div role="columnheader">Nombre y correo</div>
      <div role="columnheader">Rol</div>
      <div role="columnheader">Estado</div>
      <div role="columnheader">Actividad</div>
      <div role="columnheader">Permisos</div>
      <div role="columnheader" className="text-right">
        Acciones
      </div>
    </div>
  );
}

/**
 * Tabla de cuentas en rejilla (patrón "Atril"): columnas fijas en escritorio y una tarjeta por
 * cuenta en pantallas angostas (ver .fila-cuenta en styles/index.css).
 */
export function TablaUsuarios({
  usuarios,
  seleccion,
  miId,
  editandoId,
  enviando,
  onAlternar,
  onElegirPagina,
  onAccion,
  onCambiarRol,
}: TablaUsuariosProps) {
  const elegibles = usuarios.filter((u) => u.id !== miId);
  const todas = elegibles.length > 0 && elegibles.every((u) => seleccion.has(u.id));

  return (
    <div className="overflow-x-auto">
      <div role="table" aria-label="Cuentas de usuario" className="tabla-cuentas">
        <Cabecera todas={todas} onElegir={() => onElegirPagina(elegibles, !todas)} />
        {usuarios.map((u) => (
          <Fila
            key={u.id}
            usuario={u}
            propia={u.id === miId}
            marcada={seleccion.has(u.id)}
            editando={u.id === editandoId}
            enviando={enviando.has(u.id)}
            onAlternar={onAlternar}
            onAccion={onAccion}
            onCambiarRol={onCambiarRol}
          />
        ))}
      </div>
    </div>
  );
}
