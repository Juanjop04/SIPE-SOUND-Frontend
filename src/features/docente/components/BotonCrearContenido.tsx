import { useId, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button, claseBoton } from "@/shared/ui";
import { useTieneCursoAsignado } from "../cursos/hooks/useCursos";

export const MOTIVO_SIN_CURSO = "Necesitas un curso asignado.";

/**
 * Botón de crear lección, ejercicio o evaluación. Sin un curso activo asignado queda desactivado
 * (no oculto) y la razón se ve junto a él (HU-F-518).
 */
export function BotonCrearContenido({ to, children }: { to: string; children: ReactNode }) {
  const { cargando, puede } = useTieneCursoAsignado();
  const idMotivo = useId();
  if (puede) {
    return (
      <Link to={to} className={claseBoton()}>
        {children}
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-3">
      {!cargando && (
        <p id={idMotivo} className="text-sm text-muted">
          {MOTIVO_SIN_CURSO}
        </p>
      )}
      <Button disabled aria-describedby={cargando ? undefined : idMotivo}>
        {children}
      </Button>
    </div>
  );
}
