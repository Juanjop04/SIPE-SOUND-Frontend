import { forwardRef, useState } from "react";
import { Input, type InputProps } from "@/shared/ui";
import { IconoOjo } from "./IconoOjo.jsx";

/** Input de contraseña con botón mostrar/ocultar. Reenvía ref para React Hook Form. */
export const CampoPassword = forwardRef<HTMLInputElement, Omit<InputProps, "type">>(
  function CampoPassword({ className, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          className={`pr-11 ${className ?? ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition-colors duration-rapida hover:text-paper"
        >
          <IconoOjo visible={visible} />
        </button>
      </div>
    );
  },
);
