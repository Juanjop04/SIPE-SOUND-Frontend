import { useState } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { aplicarErroresServidor } from "@/shared/validacion";
import type { TipoContenido } from "./tipos";
import { useEditorContenido } from "./useEditorContenido";

interface OpcionesFormulario<E extends FieldValues> {
  tipo: TipoContenido;
  id: number | null;
  esquema: ZodType;
  valoresIniciales: E;
  /** Campos que el backend puede señalar en un 400 (van con setError). */
  campos: readonly Path<E>[];
}

/** Formulario de lección o ejercicio: validación, guardar/publicar y errores del servidor. */
export function useFormularioContenido<E extends FieldValues, D extends object>(
  opciones: OpcionesFormulario<E>,
) {
  const { tipo, id, esquema, valoresIniciales, campos } = opciones;
  const editor = useEditorContenido(tipo, id);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const formulario = useForm<E, unknown, D>({
    resolver: zodResolver(esquema as never) as unknown as Resolver<E, unknown, D>,
    mode: "onTouched",
    defaultValues: valoresIniciales as DefaultValues<E>,
  });

  async function enviar(datos: D, publicar: boolean) {
    setErrorGeneral(null);
    try {
      await editor.guardarDatos(datos, publicar);
      // Lo guardado pasa a ser el nuevo punto de partida: ya no hay cambios pendientes.
      formulario.reset(formulario.getValues());
    } catch (error) {
      setErrorGeneral(aplicarErroresServidor(error, formulario.setError, campos));
    }
  }

  return {
    formulario,
    editor,
    errorGeneral,
    guardar: formulario.handleSubmit((datos) => enviar(datos, false)),
    publicar: formulario.handleSubmit((datos) => enviar(datos, true)),
  };
}
