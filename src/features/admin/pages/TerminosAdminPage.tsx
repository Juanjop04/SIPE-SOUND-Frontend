import { useState } from "react";
import { PaginaAtril } from "@/features/docente";
import { formatearFecha } from "@/shared/lib/formato";
import {
  Button,
  Dialog,
  Field,
  Markdown,
  MensajeError,
  Skeleton,
  Textarea,
  useAviso,
} from "@/shared/ui";
import { useGuardarTerminos, useTerminosAdmin, type TerminosAdmin } from "../terminos/api";

const MAXIMO = 60000;

function OpcionVersionNueva({
  activa,
  onCambiar,
}: {
  activa: boolean;
  onCambiar: (valor: boolean) => void;
}) {
  return (
    <label className="mt-6 flex items-start gap-3 text-sm text-paper">
      <input
        type="checkbox"
        checked={activa}
        onChange={(e) => onCambiar(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-primary"
      />
      <span>
        Es una versión nueva: todas las cuentas deberán leerla y aceptarla para seguir.
        <span className="block text-muted">
          Sin marcar, el cambio se guarda como una corrección y nadie tiene que hacer nada.
        </span>
      </span>
    </label>
  );
}

function MetaVersion({ actual }: { actual: TerminosAdmin }) {
  return (
    <p className="font-mono text-sm text-muted">
      Versión {actual.version} · Modificado por {actual.actualizado_por ?? "una cuenta eliminada"}{" "}
      el {formatearFecha(actual.actualizado_en)}
    </p>
  );
}

function Editor({ actual }: { actual: TerminosAdmin }) {
  const { avisar } = useAviso();
  const guardar = useGuardarTerminos();
  const [texto, setTexto] = useState(actual.contenido);
  const [nueva, setNueva] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const sinCambios = texto.trim() === actual.contenido.trim();

  const enviar = () =>
    guardar.mutate(
      { contenido: texto, nueva_version: nueva },
      {
        onSuccess: ({ message }) => {
          avisar({ mensaje: message });
          setNueva(false);
        },
        onSettled: () => setConfirmando(false),
      },
    );

  return (
    <>
      <MetaVersion actual={actual} />
      <div className="mt-6 grid gap-8 xl:grid-cols-2">
        <Field
          etiqueta="Texto en Markdown"
          ayuda="# Título · ## Sección · **negrita** · *cursiva* · - lista"
        >
          {(campo) => (
            <Textarea
              {...campo}
              value={texto}
              rows={22}
              maxLength={MAXIMO}
              contador
              onChange={(e) => setTexto(e.target.value)}
              className="font-mono text-sm"
            />
          )}
        </Field>
        <section aria-labelledby="vista-previa">
          <h2 id="vista-previa" className="mb-2 text-sm font-medium text-paper">
            Vista previa
          </h2>
          <div className="max-h-[34rem] overflow-y-auto rounded-caja border border-linea p-4">
            <Markdown texto={texto || "_Sin texto_"} nivelInicial={2} />
          </div>
        </section>
      </div>
      <OpcionVersionNueva activa={nueva} onCambiar={setNueva} />
      {guardar.error && <MensajeError mensaje={guardar.error.message} />}
      <div className="mt-6">
        <Button
          disabled={sinCambios && !nueva}
          cargando={guardar.isPending}
          onClick={() => (nueva ? setConfirmando(true) : enviar())}
        >
          {nueva ? "Publicar versión nueva" : "Guardar corrección"}
        </Button>
      </div>
      <Dialog
        abierto={confirmando}
        onCerrar={() => setConfirmando(false)}
        titulo={`¿Publicar la versión ${actual.version + 1}?`}
        descripcion="Todas las cuentas, también la tuya, verán el texto completo y deberán aceptarlo al iniciar sesión antes de seguir."
      >
        <div className="flex justify-end gap-3">
          <Button variante="fantasma" onClick={() => setConfirmando(false)}>
            Cancelar
          </Button>
          <Button cargando={guardar.isPending} onClick={enviar}>
            Publicar
          </Button>
        </div>
      </Dialog>
    </>
  );
}

/** Edición de los términos y condiciones con vista previa (HU-F-510). */
export default function TerminosAdminPage() {
  const { data, isPending, error, refetch } = useTerminosAdmin();
  return (
    <PaginaAtril
      titulo="Términos y condiciones"
      descripcion="Edita el texto que aceptan las personas al registrarse. Una versión nueva se les pide al iniciar sesión."
    >
      {isPending && (
        <div aria-busy="true">
          <Skeleton lineas={8} className="h-6 w-full" />
        </div>
      )}
      {error && <MensajeError mensaje={error.message} onReintentar={() => refetch()} />}
      {data && <Editor key={data.version + data.actualizado_en} actual={data} />}
    </PaginaAtril>
  );
}
