import { useState } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { Button, Dialog, ENLACE_EN_TEXTO, Field, Input, MensajeError } from "@/shared/ui";
import type { Usuario } from "../tipos";
import { nombreCompleto } from "../utils";

interface DialogoEliminarProps {
  /** null = cerrado. */
  usuario: Usuario | null;
  onEliminar: (usuario: Usuario, alExito: () => void) => void;
  enviando: boolean;
  error: string | null;
  /** 409: el docente aún tiene cursos a cargo. */
  conflicto: boolean;
  onCerrar: () => void;
}

interface FormularioProps extends Omit<DialogoEliminarProps, "usuario"> {
  usuario: Usuario;
}

function Formulario({
  usuario,
  onEliminar,
  enviando,
  error,
  conflicto,
  onCerrar,
}: FormularioProps) {
  const [escrito, setEscrito] = useState("");
  // Solo se habilita con el correo exacto de la cuenta (sin importar mayúsculas).
  const coincide = escrito.trim().toLowerCase() === usuario.email.toLowerCase();

  return (
    <form
      noValidate
      onSubmit={(evento) => {
        evento.preventDefault();
        if (coincide) onEliminar(usuario, onCerrar);
      }}
      className="flex flex-col gap-4"
    >
      <p className="text-sm text-paper">
        Se borran su progreso, intentos e inscripciones. No se puede deshacer.
      </p>
      <Field etiqueta="Escribe el correo de la cuenta para confirmar" ayuda={usuario.email}>
        {(campo) => (
          <Input
            {...campo}
            value={escrito}
            onChange={(evento) => setEscrito(evento.target.value)}
            autoComplete="off"
            spellCheck={false}
            autoCapitalize="none"
            className="font-mono"
          />
        )}
      </Field>
      {error && <MensajeError mensaje={error} />}
      {conflicto && (
        <p className="text-sm text-muted">
          Antes de eliminarla,{" "}
          <Link to={`${paths.admin.cursos}?docente=${usuario.id}`} className={ENLACE_EN_TEXTO}>
            reasigna sus cursos
          </Link>
          .
        </p>
      )}
      <div className="flex justify-end gap-3">
        <Button variante="fantasma" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" variante="peligro" cargando={enviando} disabled={!coincide}>
          Eliminar cuenta
        </Button>
      </div>
    </form>
  );
}

/** Eliminar una cuenta: consecuencias concretas y el botón se habilita al escribir su correo. */
export function DialogoEliminar({ usuario, ...resto }: DialogoEliminarProps) {
  return (
    <Dialog
      abierto={usuario !== null}
      onCerrar={resto.onCerrar}
      titulo={usuario ? `Eliminar a ${nombreCompleto(usuario)}` : "Eliminar cuenta"}
    >
      {usuario && <Formulario usuario={usuario} {...resto} />}
    </Dialog>
  );
}
