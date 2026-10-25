import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { perfilKeys } from "@/features/auth";
import type { PerfilCuenta } from "../types";
import { aplicarErroresServidor, esDemasiadasSolicitudes } from "@/shared/validacion";
import { useEnfriamiento } from "@/shared/hooks/useEnfriamiento";
import { editarNombre } from "../api/cuentaApi";
import {
  esquemaDatosPersonales,
  type DatosPersonales,
  type EntradaDatosPersonales,
} from "../schemas";

const CAMPOS = ["nombre", "apellido"] as const;

function valoresDe(perfil: PerfilCuenta): EntradaDatosPersonales {
  return { nombre: perfil.nombre, apellido: perfil.apellido ?? "" };
}

/** Estado de "Datos personales": PATCH /me con solo lo que cambió. */
export function useDatosPersonales(perfil: PerfilCuenta) {
  const queryClient = useQueryClient();
  const { enfriando, iniciar } = useEnfriamiento();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const formulario = useForm<EntradaDatosPersonales, unknown, DatosPersonales>({
    resolver: zodResolver(esquemaDatosPersonales),
    mode: "onTouched",
    defaultValues: valoresDe(perfil),
  });

  const guardar = useMutation({
    mutationFn: editarNombre,
    onSuccess: ({ data, message }) => {
      // El menú toma el nombre de GET /me: se actualiza al instante y se confirma con el servidor.
      queryClient.setQueryData(perfilKeys.actual(), data);
      void queryClient.invalidateQueries({ queryKey: perfilKeys.todo });
      formulario.reset(valoresDe(data));
      setExito(message);
    },
    onError: (error) => {
      if (esDemasiadasSolicitudes(error)) iniciar();
      setErrorGeneral(aplicarErroresServidor(error, formulario.setError, CAMPOS));
    },
  });

  function enviar(datos: DatosPersonales) {
    setErrorGeneral(null);
    setExito(null);
    const cambios: { nombre?: string; apellido?: string } = {};
    if (datos.nombre !== perfil.nombre) cambios.nombre = datos.nombre;
    if (datos.apellido !== "" && datos.apellido !== (perfil.apellido ?? "")) {
      cambios.apellido = datos.apellido;
    }
    if (Object.keys(cambios).length === 0) return;
    guardar.mutate(cambios);
  }

  return {
    formulario,
    enviar: formulario.handleSubmit(enviar),
    guardando: guardar.isPending,
    enfriando,
    errorGeneral,
    exito,
  };
}
