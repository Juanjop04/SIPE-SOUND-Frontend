import { useState } from "react";
import { useForm, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBusquedaDiferida } from "@/shared/hooks/useBusquedaDiferida";
import {
  Button,
  Dialog,
  Drawer,
  Field,
  Input,
  MensajeError,
  Select,
  Textarea,
  useAviso,
} from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { useDestinatarios, useEnviarMensaje } from "../hooks";
import { esquemaRedactar, type DatosRedactar } from "../schemas";
import type { Destinatario } from "../tipos";
import { confirmacionDeGrupo, mensajeParaDestino, textoDeEnvio, valorDestino } from "../utils";

const TITULOS_GRUPO: Record<Destinatario["tipo"], string> = {
  grupo: "Grupos",
  curso: "Cursos",
  usuario: "Personas",
};
const ORDEN_TIPOS: Destinatario["tipo"][] = ["grupo", "curso", "usuario"];

interface Pendiente {
  destino: Destinatario;
  datos: DatosRedactar;
}

function Opciones({ lista }: { lista: Destinatario[] }) {
  return (
    <>
      <option value="">Elige a quién le escribes…</option>
      {ORDEN_TIPOS.map((tipo) => {
        const items = lista.filter((d) => d.tipo === tipo);
        if (items.length === 0) return null;
        return (
          <optgroup key={tipo} label={TITULOS_GRUPO[tipo]}>
            {items.map((d) => (
              <option key={valorDestino(d)} value={valorDestino(d)}>
                {d.etiqueta}
                {d.detalle ? ` · ${d.detalle}` : ""}
              </option>
            ))}
          </optgroup>
        );
      })}
    </>
  );
}

function BuscadorPersona({ valor, onCambiar }: { valor: string; onCambiar: (v: string) => void }) {
  return (
    <Field etiqueta="Buscar persona" ayuda="Escribe al menos 2 letras del nombre (no del correo).">
      {(campo) => (
        <Input
          {...campo}
          type="search"
          value={valor}
          maxLength={LIMITES.busqueda.max}
          autoComplete="off"
          onChange={(e) => onCambiar(e.target.value)}
        />
      )}
    </Field>
  );
}

/** Antes de mandar un grupo: a quiénes llegará. Una persona sola no pasa por aquí. */
function ConfirmarAviso({
  pendiente,
  enviando,
  onConfirmar,
  onCerrar,
}: {
  pendiente: Pendiente | null;
  enviando: boolean;
  onConfirmar: (destino: Destinatario, datos: DatosRedactar) => void;
  onCerrar: () => void;
}) {
  return (
    <Dialog
      abierto={pendiente !== null}
      onCerrar={onCerrar}
      titulo="Enviar aviso"
      descripcion={pendiente ? (confirmacionDeGrupo(pendiente.destino) ?? undefined) : undefined}
    >
      <div className="flex justify-end gap-3">
        <Button variante="fantasma" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button
          cargando={enviando}
          onClick={() => pendiente && onConfirmar(pendiente.destino, pendiente.datos)}
        >
          Enviar aviso
        </Button>
      </div>
    </Dialog>
  );
}

function CamposMensaje({
  register,
  errors,
}: {
  register: UseFormRegister<DatosRedactar>;
  errors: FieldErrors<DatosRedactar>;
}) {
  return (
    <>
      <Field etiqueta="Asunto" error={errors.asunto?.message}>
        {(campo) => (
          <Input
            {...campo}
            {...register("asunto")}
            maxLength={LIMITES.asunto.max}
            autoComplete="off"
          />
        )}
      </Field>
      <Field etiqueta="Mensaje" error={errors.cuerpo?.message}>
        {(campo) => (
          <Textarea
            {...campo}
            {...register("cuerpo")}
            rows={6}
            maxLength={LIMITES.cuerpoMensaje.max}
            contador
          />
        )}
      </Field>
    </>
  );
}

interface FormularioProps {
  soloDocentes: boolean;
  onCerrar: () => void;
  para?: Destinatario;
}

function Formulario({ soloDocentes, onCerrar, para }: FormularioProps) {
  const { avisar } = useAviso();
  const enviar = useEnviarMensaje();
  // El texto se escribe al instante; la consulta espera a que se deje de escribir.
  const [aplicada, setAplicada] = useState<string | undefined>(undefined);
  const [busqueda, setBusqueda] = useBusquedaDiferida(aplicada, (valor) =>
    setAplicada(valor ?? undefined),
  );
  const q = aplicada && aplicada.length >= 2 ? aplicada : undefined;
  const destinatarios = useDestinatarios(q);
  const [pendiente, setPendiente] = useState<Pendiente | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosRedactar>({
    resolver: zodResolver(esquemaRedactar),
    mode: "onTouched",
    defaultValues: { destino: para ? valorDestino(para) : "", asunto: "", cuerpo: "" },
  });
  // La persona elegida desde fuera ("Escribirle") siempre es una opción, aunque la búsqueda no la traiga.
  const encontrados = destinatarios.data ?? [];
  const lista =
    para && !encontrados.some((d) => valorDestino(d) === valorDestino(para))
      ? [para, ...encontrados]
      : encontrados;

  function mandar(destino: Destinatario, datos: DatosRedactar) {
    enviar.mutate(mensajeParaDestino(destino, datos.asunto, datos.cuerpo), {
      onSuccess: ({ data }) => {
        avisar({ mensaje: textoDeEnvio(destino, data.destinatarios) });
        onCerrar();
      },
      onSettled: () => setPendiente(null),
    });
  }

  function alEnviar(datos: DatosRedactar) {
    const destino = lista.find((d) => valorDestino(d) === datos.destino);
    if (!destino) return;
    // Un grupo pide confirmación con a quiénes llegará; una persona, no.
    if (confirmacionDeGrupo(destino)) setPendiente({ destino, datos });
    else mandar(destino, datos);
  }

  return (
    <form noValidate onSubmit={handleSubmit(alEnviar)} className="flex flex-col gap-4">
      {!soloDocentes && <BuscadorPersona valor={busqueda} onCambiar={setBusqueda} />}
      <Field etiqueta="Para" error={errors.destino?.message}>
        {(campo) => (
          <Select {...campo} {...register("destino")}>
            <Opciones lista={lista} />
          </Select>
        )}
      </Field>
      {destinatarios.isSuccess && lista.length === 0 && (
        <p className="text-sm text-muted">
          {soloDocentes
            ? "Aún no tienes docentes: únete a un curso para escribirle a tu docente."
            : "No hay nadie con esa búsqueda."}
        </p>
      )}
      <CamposMensaje register={register} errors={errors} />
      {enviar.error && <MensajeError mensaje={enviar.error.message} />}
      <div className="flex justify-end gap-3">
        <Button variante="fantasma" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" cargando={enviar.isPending}>
          Enviar
        </Button>
      </div>
      <ConfirmarAviso
        pendiente={pendiente}
        enviando={enviar.isPending}
        onConfirmar={mandar}
        onCerrar={() => setPendiente(null)}
      />
    </form>
  );
}

interface RedactorProps {
  abierto: boolean;
  onCerrar: () => void;
  /** El estudiante solo elige entre sus docentes: sin búsqueda de personas. */
  soloDocentes: boolean;
  /** Persona con la que se abre el redactor (p. ej. desde "Necesitan apoyo"). */
  para?: Destinatario;
}

/** Redactar un mensaje en un Drawer. El backend decide a quién se puede escribir. */
export function Redactor({ abierto, onCerrar, soloDocentes, para }: RedactorProps) {
  return (
    <Drawer abierto={abierto} onCerrar={onCerrar} titulo="Nuevo mensaje">
      <Formulario
        key={para ? valorDestino(para) : "nuevo"}
        soloDocentes={soloDocentes}
        onCerrar={onCerrar}
        para={para}
      />
    </Drawer>
  );
}
