import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn.js";
import { fechaRelativa } from "@/shared/lib/formato";
import { Button, Field, Input, Interruptor } from "@/shared/ui";
import type { DetalleUsuario as Detalle, RolCuenta } from "../tipos";
import { DESCRIPCION_ROL, ETIQUETA_ROL } from "../utils";
import type { AccionUsuario } from "./AccionesFila";

/** Lo que el administrador edita en el panel. */
export interface Borrador {
  nombre: string;
  apellido: string;
  email: string;
  rol: RolCuenta;
  activa: boolean;
  puedeEditarNombre: boolean;
}

export type ErroresBorrador = Partial<Record<"nombre" | "apellido" | "email", string>>;

const ROLES: RolCuenta[] = ["estudiante", "docente", "admin"];

export function Seccion({
  titulo,
  children,
  tono,
}: {
  titulo: string;
  children: ReactNode;
  tono?: string;
}) {
  return (
    <section aria-label={titulo} className="flex flex-col gap-3 border-t border-linea py-5">
      <h3 className={cn("text-sm font-semibold text-accent", tono)}>{titulo}</h3>
      {children}
    </section>
  );
}

function FilaDeAcceso({
  titulo,
  ayuda,
  children,
}: {
  titulo: string;
  ayuda: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-linea py-3 last:border-b-0">
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-paper">{titulo}</span>
        <span className="text-sm text-muted">{ayuda}</span>
      </span>
      {children}
    </div>
  );
}

function ayudaDelCorreo(propia: boolean, cambia: boolean, hayError: boolean): string | undefined {
  if (propia) return "Tu correo se cambia desde Mi cuenta, con tu contraseña.";
  if (cambia && !hayError) return "Al guardar se enviará un código para verificar el correo nuevo.";
  return undefined;
}

interface DatosProps {
  borrador: Borrador;
  errores: ErroresBorrador;
  /** El correo escrito ya no es el de la cuenta. */
  correoCambia: boolean;
  propia: boolean;
  onCambiar: (cambios: Partial<Borrador>) => void;
}

export function SeccionDatos({
  borrador: b,
  errores,
  correoCambia,
  propia,
  onCambiar,
}: DatosProps) {
  return (
    <Seccion titulo="Datos personales">
      <div className="grid gap-3 min-[561px]:grid-cols-2">
        <Field etiqueta="Nombre" error={errores.nombre}>
          {(campo) => (
            <Input
              {...campo}
              value={b.nombre}
              autoComplete="given-name"
              onChange={(e) => onCambiar({ nombre: e.target.value })}
            />
          )}
        </Field>
        <Field etiqueta="Apellido" error={errores.apellido}>
          {(campo) => (
            <Input
              {...campo}
              value={b.apellido}
              autoComplete="family-name"
              onChange={(e) => onCambiar({ apellido: e.target.value })}
            />
          )}
        </Field>
      </div>
      <Field
        etiqueta="Correo electrónico"
        error={errores.email}
        ayuda={ayudaDelCorreo(propia, correoCambia, Boolean(errores.email))}
      >
        {(campo) => (
          <Input
            {...campo}
            type="email"
            value={b.email}
            disabled={propia}
            className="font-mono text-[13px]"
            onChange={(e) => onCambiar({ email: e.target.value })}
          />
        )}
      </Field>
    </Seccion>
  );
}

function claseOpcionDeRol(propia: boolean, elegida: boolean): string {
  const base = "flex items-start gap-3 rounded-md border p-3";
  const uso = propia ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:border-linea-fuerte";
  return cn(base, uso, elegida ? "border-primary bg-primary/10" : "border-linea");
}

interface RolProps {
  rolActual: RolCuenta;
  elegido: RolCuenta;
  propia: boolean;
  onElegir: (rol: RolCuenta) => void;
}

export function SeccionRol({ rolActual, elegido, propia, onElegir }: RolProps) {
  return (
    <Seccion titulo="Rol">
      <div role="radiogroup" aria-label="Rol" className="flex flex-col gap-2">
        {ROLES.map((rol) => (
          <div key={rol} className={claseOpcionDeRol(propia, elegido === rol)}>
            <input
              id={`rol-edicion-${rol}`}
              type="radio"
              name="rol-edicion"
              checked={elegido === rol}
              disabled={propia}
              onChange={() => onElegir(rol)}
              className="mt-1 h-4 w-4 accent-primary"
            />
            <label
              htmlFor={`rol-edicion-${rol}`}
              className={cn("flex flex-1 flex-col gap-0.5", !propia && "cursor-pointer")}
            >
              <span className="text-sm font-semibold text-paper">{ETIQUETA_ROL[rol]}</span>
              <span className="text-sm text-muted">{DESCRIPCION_ROL[rol]}</span>
            </label>
          </div>
        ))}
      </div>
      {elegido !== rolActual && (
        <p className="text-sm text-aviso">Te pediremos confirmar el cambio de rol al guardar.</p>
      )}
    </Seccion>
  );
}

function tituloCuentaActiva(propia: boolean, esAdmin: boolean): string | undefined {
  if (propia) return "No puedes suspender tu propia cuenta";
  if (esAdmin) return "Los administradores no se suspenden";
  return undefined;
}

interface AccesoProps {
  borrador: Borrador;
  /** El rol que tiene hoy la cuenta (un administrador no se suspende). */
  esAdminHoy: boolean;
  propia: boolean;
  onCambiar: (cambios: Partial<Borrador>) => void;
}

export function SeccionAcceso({ borrador: b, esAdminHoy, propia, onCambiar }: AccesoProps) {
  const seraAdmin = b.rol === "admin";
  return (
    <Seccion titulo="Acceso">
      <div>
        <FilaDeAcceso
          titulo="Cuenta activa"
          ayuda="Apagada, la cuenta queda suspendida y no puede entrar."
        >
          <Interruptor
            activo={b.activa}
            etiqueta="Cuenta activa"
            texto=""
            disabled={propia || esAdminHoy}
            titulo={tituloCuentaActiva(propia, esAdminHoy)}
            onCambiar={() => onCambiar({ activa: !b.activa })}
          />
        </FilaDeAcceso>
        <FilaDeAcceso
          titulo="Permitir cambio de nombre"
          ayuda={
            seraAdmin
              ? "Los administradores siempre pueden cambiar su nombre."
              : "El usuario podrá corregir su nombre y apellido."
          }
        >
          <Interruptor
            activo={seraAdmin || b.puedeEditarNombre}
            etiqueta="Permitir cambio de nombre"
            texto=""
            disabled={seraAdmin}
            onCambiar={() => onCambiar({ puedeEditarNombre: !b.puedeEditarNombre })}
          />
        </FilaDeAcceso>
      </div>
    </Seccion>
  );
}

interface PendienteProps {
  usuario: Detalle;
  onAccion: (accion: AccionUsuario, usuario: Detalle) => void;
}

/** Solo para cuentas pendientes: reenviar el código o verificar a mano. */
export function SeccionCorreoPendiente({ usuario: u, onAccion }: PendienteProps) {
  const envio = u.ultimo_envio_verificacion;
  return (
    <Seccion titulo="Correo sin verificar" tono="text-aviso">
      <p className="text-sm text-paper">
        {envio
          ? `Último código enviado ${fechaRelativa(envio.creado_en)}.`
          : "Todavía no se envió ningún código."}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variante="fantasma" tamano="sm" onClick={() => onAccion("reenviar", u)}>
          Reenviar código
        </Button>
        <Button variante="fantasma" tamano="sm" onClick={() => onAccion("verificar", u)}>
          Verificar manualmente
        </Button>
      </div>
    </Seccion>
  );
}

export function SeccionEliminar({
  propia,
  onEliminar,
}: {
  propia: boolean;
  onEliminar: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-linea py-5">
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-paper">Eliminar cuenta</span>
        <span className="text-sm text-muted">Borra la cuenta y todo su progreso.</span>
      </span>
      <Button
        variante="fantasma"
        tamano="sm"
        disabled={propia}
        onClick={onEliminar}
        className="border-danger/50 text-danger hover:border-danger hover:bg-danger/10"
      >
        Eliminar
      </Button>
    </div>
  );
}
