import { Link } from "react-router-dom";
import { ApiError } from "@/shared/api/ApiError.js";
import { paths } from "@/shared/config/paths.js";
import { ENLACE_EN_TEXTO } from "@/shared/ui";
import { useCambiarRol, useEliminarCuenta, useEnLote, useSuspender } from "../hooks";
import type { RolCuenta, Usuario } from "../tipos";
import { cambiosDeRol, ETIQUETA_ROL, listaDeNombres, nombreCompleto } from "../utils";
import { DialogoConfirmar, SujetoDelDialogo } from "./DialogoConfirmar";

/** Qué pide confirmación. `alConfirmar` reemplaza la acción simple (guardar desde el panel). */
export type Pendiente =
  | {
      accion: "rol";
      usuarios: Usuario[];
      rol: RolCuenta;
      /** Al guardar el panel con la cuenta apagada: el aviso también la suspende. */
      tambienSuspende?: boolean;
      alConfirmar?: (avisar: boolean) => Promise<void>;
    }
  | {
      accion: "suspender";
      usuarios: Usuario[];
      alConfirmar?: (avisar: boolean) => Promise<void>;
    }
  | { accion: "eliminar"; usuario: Usuario };

const HTTP_CONFLICTO = 409;

interface DialogosUsuariosProps {
  pendiente: Pendiente | null;
  onCerrar: () => void;
  /** Una acción sobre una selección terminó: se vacía la selección. */
  onTerminarLote: () => void;
  /** Una cuenta se eliminó: se cierra su panel. */
  onEliminada: (usuario: Usuario) => void;
}

function DialogoRol({
  pendiente,
  onCerrar,
  onTerminarLote,
}: Pick<DialogosUsuariosProps, "onCerrar" | "onTerminarLote"> & {
  pendiente: Extract<Pendiente, { accion: "rol" }> | null;
}) {
  const cambiarRol = useCambiarRol();
  const enLote = useEnLote();
  const usuarios = pendiente?.usuarios ?? [];
  const rol = pendiente?.rol ?? "estudiante";
  const uno = usuarios.length === 1 ? usuarios[0] : null;
  const eraAdmin = usuarios.some((u) => u.rol === "admin");
  const cambios = cambiosDeRol(rol, eraAdmin);
  if (pendiente?.tambienSuspende) cambios.push("La cuenta también quedará suspendida.");

  async function confirmar(avisar: boolean) {
    if (!pendiente) return;
    if (pendiente.alConfirmar) {
      await pendiente.alConfirmar(avisar);
    } else if (uno) {
      await cambiarRol.mutateAsync({ usuario: uno, rol, notificar: avisar });
    } else {
      await enLote.mutateAsync({
        ids: usuarios.map((u) => u.id),
        accion: "rol",
        rol,
        notificar: avisar,
      });
      onTerminarLote();
    }
  }

  return (
    <DialogoConfirmar
      abierto={pendiente !== null}
      titulo={uno ? "Confirmar cambio de rol" : `Cambiar el rol de ${usuarios.length} cuentas`}
      cta={rol === "admin" ? "Sí, hacer administrador" : "Confirmar cambio"}
      etiquetaAviso="Avisar por correo del cambio"
      onConfirmar={confirmar}
      onCerrar={onCerrar}
    >
      {uno ? (
        <>
          <SujetoDelDialogo nombre={nombreCompleto(uno)} detalle={uno.email} />
          <p className="flex flex-wrap items-center gap-2 text-sm text-paper">
            <span className="rounded bg-surface px-2.5 py-1 font-semibold text-muted">
              {ETIQUETA_ROL[uno.rol]}
            </span>
            <span className="text-muted">pasa a</span>
            <span className="rounded bg-primary px-2.5 py-1 font-semibold text-sobre-primary">
              {ETIQUETA_ROL[rol]}
            </span>
          </p>
        </>
      ) : (
        <>
          <p className="text-sm text-paper">
            <span className="font-mono">{usuarios.length}</span> cuentas pasarán a{" "}
            <strong>{ETIQUETA_ROL[rol]}</strong>
          </p>
          <p className="text-sm text-muted">{listaDeNombres(usuarios)}</p>
        </>
      )}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-accent">Qué cambia</span>
        <ul className="flex flex-col gap-1.5 text-sm text-paper">
          {cambios.map((c) => (
            <li key={c} className="flex gap-2">
              <span aria-hidden="true" className="text-muted">
                —
              </span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </DialogoConfirmar>
  );
}

function DialogoSuspender({
  pendiente,
  onCerrar,
  onTerminarLote,
}: Pick<DialogosUsuariosProps, "onCerrar" | "onTerminarLote"> & {
  pendiente: Extract<Pendiente, { accion: "suspender" }> | null;
}) {
  const suspender = useSuspender();
  const enLote = useEnLote();
  const usuarios = pendiente?.usuarios ?? [];
  const uno = usuarios.length === 1 ? usuarios[0] : null;

  async function confirmar(avisar: boolean) {
    if (!pendiente) return;
    if (pendiente.alConfirmar) {
      await pendiente.alConfirmar(avisar);
    } else if (uno) {
      await suspender.mutateAsync({ usuario: uno, notificar: avisar });
    } else {
      await enLote.mutateAsync({
        ids: usuarios.map((u) => u.id),
        accion: "suspender",
        notificar: avisar,
      });
      onTerminarLote();
    }
  }

  return (
    <DialogoConfirmar
      abierto={pendiente !== null}
      titulo={uno ? "¿Suspender esta cuenta?" : `¿Suspender ${usuarios.length} cuentas?`}
      cta="Sí, suspender"
      peligro
      etiquetaAviso="Avisar por correo de la suspensión"
      onConfirmar={confirmar}
      onCerrar={onCerrar}
    >
      {uno ? (
        <SujetoDelDialogo nombre={nombreCompleto(uno)} detalle={uno.email} />
      ) : (
        <p className="text-sm text-muted">{listaDeNombres(usuarios)}</p>
      )}
      <p className="text-sm text-paper">
        No podrá iniciar sesión ni ver sus cursos hasta que la reactives. Su progreso se conserva.
      </p>
    </DialogoConfirmar>
  );
}

function DialogoEliminar({
  usuario,
  onCerrar,
  onEliminada,
}: Pick<DialogosUsuariosProps, "onCerrar" | "onEliminada"> & { usuario: Usuario | null }) {
  const eliminar = useEliminarCuenta();
  const conflicto =
    eliminar.error instanceof ApiError && eliminar.error.statusCode === HTTP_CONFLICTO;

  function cerrar() {
    eliminar.reset();
    onCerrar();
  }

  return (
    <DialogoConfirmar
      abierto={usuario !== null}
      titulo="¿Eliminar esta cuenta?"
      cta="Sí, eliminar cuenta"
      peligro
      onConfirmar={async () => {
        if (!usuario) return;
        await eliminar.mutateAsync(usuario);
        onEliminada(usuario);
      }}
      error={
        eliminar.error && (
          <>
            {eliminar.error.message}
            {conflicto && usuario && (
              <>
                {" "}
                <Link
                  to={`${paths.admin.cursos}?docente=${usuario.id}`}
                  className={ENLACE_EN_TEXTO}
                >
                  Reasigna sus cursos
                </Link>
                .
              </>
            )}
          </>
        )
      }
      onCerrar={cerrar}
    >
      {usuario && (
        <>
          <SujetoDelDialogo
            nombre={nombreCompleto(usuario)}
            detalle={`${usuario.email} · ${ETIQUETA_ROL[usuario.rol]}`}
          />
          <p className="text-sm text-paper">
            Se borrará la cuenta con su progreso, evaluaciones y mensajes. Esta acción no se puede
            deshacer.
          </p>
        </>
      )}
    </DialogoConfirmar>
  );
}

/** Los tres diálogos de la página (rol, suspensión y eliminación). Solo uno está abierto. */
export function DialogosUsuarios({
  pendiente,
  onCerrar,
  onTerminarLote,
  onEliminada,
}: DialogosUsuariosProps) {
  return (
    <>
      <DialogoRol
        pendiente={pendiente?.accion === "rol" ? pendiente : null}
        onCerrar={onCerrar}
        onTerminarLote={onTerminarLote}
      />
      <DialogoSuspender
        pendiente={pendiente?.accion === "suspender" ? pendiente : null}
        onCerrar={onCerrar}
        onTerminarLote={onTerminarLote}
      />
      <DialogoEliminar
        usuario={pendiente?.accion === "eliminar" ? pendiente.usuario : null}
        onCerrar={onCerrar}
        onEliminada={onEliminada}
      />
    </>
  );
}
