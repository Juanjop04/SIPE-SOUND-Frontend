import { useEffect, useReducer } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { perfilKeys } from "@/features/auth";
import { Button } from "@/shared/ui";
import { confirmarCambioDeCorreo, confirmarIdentidad } from "../api/cuentaApi";
import {
  estadoInicial,
  reducirIdentidad,
  VIGENCIA_TOKEN_MS,
  type Motivo,
} from "../utils/pasosIdentidad";
import { PasoCodigo } from "./PasoCodigo";
import { PasoContrasenaActual } from "./PasoContrasenaActual";
import { PasoContrasenaNueva } from "./PasoContrasenaNueva";
import { PasoCorreoNuevo } from "./PasoCorreoNuevo";

interface PasosIdentidadProps {
  motivo: Motivo;
  onCerrar: () => void;
  /** Avisa a la página para que muestre el resultado encima de su sección. */
  alTerminar: (motivo: Motivo, mensaje: string) => void;
}

/**
 * Pasos del diálogo de confirmación de identidad. Vive dentro del Dialog, que solo monta sus hijos
 * mientras está abierto: al cerrarlo el estado (y con él el token) se destruye.
 */
export function PasosIdentidad({ motivo, onCerrar, alTerminar }: PasosIdentidadProps) {
  const queryClient = useQueryClient();
  const [estado, dispatch] = useReducer(reducirIdentidad, motivo, estadoInicial);
  const { paso, token, venceEn, resultado } = estado;

  // El token dura 5 minutos: si se agota, vuelve al paso 1 en vez de fallar al enviar.
  useEffect(() => {
    if (venceEn === null) return undefined;
    const temporizador = setTimeout(
      () => dispatch({ tipo: "vencio" }),
      Math.max(venceEn - Date.now(), 0),
    );
    return () => clearTimeout(temporizador);
  }, [venceEn]);

  // Sincroniza con la página (resultado del flujo) cuando termina.
  useEffect(() => {
    if (paso === "listo" && resultado) alTerminar(motivo, resultado);
  }, [paso, resultado, motivo, alTerminar]);

  if (paso === "actual") {
    return <PasoContrasenaActual aviso={estado.aviso} dispatch={dispatch} onCancelar={onCerrar} />;
  }
  if (paso === "codigo") {
    return (
      <PasoCodigo
        instruccion={`Escribe el código que enviamos a ${estado.enviadoA}. Vence en 10 minutos.`}
        etiqueta="Confirmar"
        confirmar={confirmarIdentidad}
        alConfirmar={({ data }) =>
          dispatch({
            tipo: "identidadConfirmada",
            token: data.token_reautenticacion,
            venceEn: Date.now() + VIGENCIA_TOKEN_MS,
          })
        }
        onCancelar={onCerrar}
      />
    );
  }
  if (paso === "nueva" && token) {
    const Paso = motivo === "contrasena" ? PasoContrasenaNueva : PasoCorreoNuevo;
    return <Paso token={token} dispatch={dispatch} onCancelar={onCerrar} />;
  }
  if (paso === "codigoNuevo") {
    return (
      <PasoCodigo
        instruccion={`Escribe el código que enviamos a ${estado.correoNuevo}. Vence en 15 minutos.`}
        etiqueta="Cambiar correo"
        confirmar={confirmarCambioDeCorreo}
        alConfirmar={({ data }) => {
          void queryClient.invalidateQueries({ queryKey: perfilKeys.todo });
          dispatch({ tipo: "terminado", resultado: `Tu correo ahora es ${data.email}.` });
        }}
        onCancelar={onCerrar}
      />
    );
  }
  return (
    <div role="status" className="flex flex-col gap-4">
      <p className="text-paper">{resultado}</p>
      <div className="flex justify-end">
        <Button onClick={onCerrar}>Listo</Button>
      </div>
    </div>
  );
}
