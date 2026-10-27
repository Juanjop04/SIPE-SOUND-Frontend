import { Check, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { puedeUsarAtril } from "@/features/auth";
import { paths } from "@/shared/config/paths.js";
import { formatearFecha } from "@/shared/lib/formato";
import { claseBoton } from "@/shared/ui";
import type { PerfilCuenta } from "../types";

const ETIQUETA_ROL = {
  estudiante: "Estudiante",
  docente: "Docente",
  admin: "Administrador",
} as const;

/** Línea "Verificado el 28 jul 2026" (o "Sin verificar"). */
export function lineaVerificado(perfil: PerfilCuenta): string {
  return perfil.correo_verificado_en
    ? `Verificado el ${formatearFecha(perfil.correo_verificado_en)}`
    : "Sin verificar";
}

function iniciales(perfil: PerfilCuenta): string {
  const letras = `${perfil.nombre[0] ?? ""}${perfil.apellido?.[0] ?? ""}`.toUpperCase();
  return letras || "?";
}

/** Identidad: iniciales, nombre completo, rol, correo y desde cuándo está verificado. */
export function EncabezadoCuenta({ perfil }: { perfil: PerfilCuenta }) {
  const nombre = [perfil.nombre, perfil.apellido].filter(Boolean).join(" ");
  return (
    <section
      aria-label="Resumen de tu cuenta"
      className="flex flex-wrap items-center gap-5 border-b border-linea pb-7"
    >
      <span
        aria-hidden="true"
        className="flex h-[60px] w-[60px] flex-none items-center justify-center rounded-caja bg-accent text-xl font-bold text-ink sm:h-[76px] sm:w-[76px] sm:text-3xl"
      >
        {iniciales(perfil)}
      </span>
      <div className="flex min-w-0 flex-1 basis-64 flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold text-paper">{nombre}</h1>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span className="font-semibold text-primary-claro">{ETIQUETA_ROL[perfil.rol]}</span>
          <span className="break-all font-mono text-xs">{perfil.email ?? "—"}</span>
          {perfil.correo_verificado_en && (
            <span className="inline-flex items-center gap-1.5 text-success">
              <Check size={14} aria-hidden="true" />
              {lineaVerificado(perfil)}
            </span>
          )}
        </p>
      </div>
      {puedeUsarAtril(perfil.rol) && (
        <Link
          to={paths.inicio}
          className={claseBoton({ variante: "secundario", className: "max-sm:w-full" })}
        >
          <Eye size={16} aria-hidden="true" />
          Ver como estudiante
        </Link>
      )}
    </section>
  );
}
