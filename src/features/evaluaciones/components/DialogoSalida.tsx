import { ConfirmarSalida } from "@/shared/ui";

/** Si hay respuestas sin enviar, pregunta antes de salir de la evaluación. */
export function DialogoSalida({ bloquear }: { bloquear: boolean }) {
  return (
    <ConfirmarSalida
      bloquear={bloquear}
      titulo="¿Salir sin enviar?"
      descripcion="Tus respuestas no se guardan hasta que envíes la evaluación."
      textoSalir="Salir sin enviar"
      textoQuedarse="Seguir respondiendo"
    />
  );
}
