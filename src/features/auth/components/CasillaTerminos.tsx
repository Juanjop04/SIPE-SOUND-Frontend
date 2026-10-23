import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";

interface CasillaTerminosProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: string;
}

/** Casilla de términos. El enlace abre otra pestaña para no perder lo escrito. */
export const CasillaTerminos = forwardRef<HTMLInputElement, CasillaTerminosProps>(
  function CasillaTerminos({ error, ...props }, ref) {
    const idError = useId();
    return (
      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-3 text-sm text-paper">
          <input
            ref={ref}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? idError : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            {...props}
          />
          <span>
            Acepto los{" "}
            <Link
              to={paths.terminos}
              target="_blank"
              rel="noreferrer"
              className="text-accent underline-offset-2 hover:underline"
            >
              términos y condiciones
            </Link>{" "}
            y el tratamiento de mis datos.
          </span>
        </label>
        {error && (
          <p id={idError} className="text-xs text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);
