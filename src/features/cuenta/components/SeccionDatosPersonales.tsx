import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DialogoSolicitudNombre } from "./DialogoSolicitudNombre";
import type { PerfilCuenta } from "../types";
import { Button, Field, Input, MensajeError } from "@/shared/ui";
import { claveSolicitudDeNombre, miSolicitudDeNombre } from "../api/cuentaApi";
import { useDatosPersonales } from "../hooks/useDatosPersonales";
import { SeccionCuenta } from "./SeccionCuenta";

const TEXTO_BLOQUEADO =
  "Para cambiar tu nombre, pídele al administrador que lo habilite: puedes escribirle desde aquí.";

function SoloLectura({ perfil }: { perfil: PerfilCuenta }) {
  const [pidiendo, setPidiendo] = useState(false);
  const cerrar = useCallback(() => setPidiendo(false), []);
  // HU-B-415: si ya hay una pendiente no se puede enviar otra; si la rechazaron, se avisa.
  const ultima = useQuery({ queryKey: claveSolicitudDeNombre, queryFn: miSolicitudDeNombre });
  const pendiente = ultima.data?.estado === "pendiente";
  const rechazada = ultima.data?.estado === "rechazada";
  return (
    <>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted">Nombre</dt>
          <dd className="text-paper">{perfil.nombre}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Apellido</dt>
          <dd className="text-paper">{perfil.apellido ?? "—"}</dd>
        </div>
      </dl>
      <p className="text-sm text-muted">{TEXTO_BLOQUEADO}</p>
      {pendiente && (
        <p role="status" className="text-sm text-paper">
          Tu solicitud está pendiente: un administrador la responderá pronto.
        </p>
      )}
      {rechazada && (
        <p role="status" className="text-sm text-paper">
          Tu última solicitud fue rechazada. Puedes enviar otra explicando mejor el motivo.
        </p>
      )}
      <div>
        <Button variante="secundario" disabled={pendiente} onClick={() => setPidiendo(true)}>
          Solicitar cambio de nombre
        </Button>
      </div>
      <DialogoSolicitudNombre abierto={pidiendo} onCerrar={cerrar} />
    </>
  );
}

function Editable({ perfil }: { perfil: PerfilCuenta }) {
  const { formulario, enviar, guardando, enfriando, errorGeneral, exito } =
    useDatosPersonales(perfil);
  const {
    register,
    formState: { errors, isDirty },
  } = formulario;

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      {exito && (
        <p role="status" className="text-sm text-paper">
          {exito}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field etiqueta="Nombre" error={errors.nombre?.message}>
          {(campo) => <Input {...campo} {...register("nombre")} autoComplete="given-name" />}
        </Field>
        <Field etiqueta="Apellido" error={errors.apellido?.message}>
          {(campo) => <Input {...campo} {...register("apellido")} autoComplete="family-name" />}
        </Field>
      </div>
      {errorGeneral && <MensajeError mensaje={errorGeneral} />}
      {/* Un solo botón primario, y solo cuando hay algo que guardar. */}
      {isDirty && (
        <div>
          <Button type="submit" cargando={guardando} disabled={enfriando}>
            Guardar
          </Button>
        </div>
      )}
    </form>
  );
}

/** Nombre y apellido: editables solo si el administrador lo habilitó (los admins siempre pueden). */
export function SeccionDatosPersonales({ perfil }: { perfil: PerfilCuenta }) {
  const puedeEditar = perfil.puede_editar_nombre || perfil.rol === "admin";
  return (
    <SeccionCuenta titulo="Datos personales">
      {puedeEditar ? <Editable perfil={perfil} /> : <SoloLectura perfil={perfil} />}
    </SeccionCuenta>
  );
}
