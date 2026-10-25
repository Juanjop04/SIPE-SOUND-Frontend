import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { Cuerda } from "@/shared/music";
import { claseBoton } from "@/shared/ui";
import { nombreCompleto } from "../datos";
import {
  APOYO_EN_TARJETA,
  enlaceDeCurso,
  motivoPrincipal,
  type CursoConProgreso,
} from "../utils/tarjetas";
import { BotonCopiar } from "./BotonCopiar";

function Cifras({ datos }: { datos: CursoConProgreso }) {
  const { curso, progreso } = datos;
  if (!progreso) {
    return (
      <p className="font-mono text-sm text-muted">
        {curso.estudiantes} {curso.estudiantes === 1 ? "estudiante" : "estudiantes"}
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-baseline gap-2">
        <span className="font-mono text-4xl font-semibold tabular-nums text-paper">
          {progreso.estudiantes}
        </span>
        <span className="text-sm text-muted">
          {progreso.estudiantes === 1 ? "estudiante" : "estudiantes"}
        </span>
      </p>
      {progreso.estudiantes > 0 && (
        <>
          <div className="flex items-center gap-3">
            <Cuerda
              grosor={4}
              valor={progreso.avance_promedio}
              etiqueta={`Avance promedio de ${curso.nombre}`}
              sonando={progreso.avance_promedio === 100}
              className="flex-1"
            />
            <span className="shrink-0 whitespace-nowrap text-right font-mono text-sm tabular-nums text-paper">
              {progreso.avance_promedio}% promedio
            </span>
          </div>
          <p className="font-mono text-xs text-muted">
            Al día {progreso.estudiantes_al_dia} · Sin actividad {progreso.sin_actividad_14_dias}
          </p>
        </>
      )}
    </div>
  );
}

/** Quién necesita atención: nombre y motivo en texto; el nombre abre su progreso (2.º clic). */
function Atencion({ datos }: { datos: CursoConProgreso }) {
  const { apoyo, curso } = datos;
  if (apoyo.length === 0) return null;
  const base = paths.docente.curso(curso.id);
  const resto = apoyo.length - APOYO_EN_TARJETA;
  return (
    <div className="border-t border-linea pt-3">
      <p className="text-sm text-paper">
        {apoyo.length} {apoyo.length === 1 ? "necesita apoyo" : "necesitan apoyo"}
      </p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {apoyo.slice(0, APOYO_EN_TARJETA).map((a) => (
          <li key={a.estudiante_id} className="text-sm">
            <Link
              to={enlaceDeCurso(base, "estudiantes", a.estudiante_id)}
              className="text-accent hover:underline"
            >
              {nombreCompleto(a)}
            </Link>
            <span className="text-muted"> · {motivoPrincipal(a)}</span>
          </li>
        ))}
      </ul>
      {resto > 0 && <p className="mt-1 text-xs text-muted">y {resto} más en Estudiantes</p>}
    </div>
  );
}

/** Un curso: código copiable, avance promedio, a quién escribirle y una sola acción primaria. */
export function TarjetaCursoDocente({ datos }: { datos: CursoConProgreso }) {
  const { curso } = datos;
  const base = paths.docente.curso(curso.id);
  const archivado = curso.archivado_en !== null;
  return (
    <li className="flex flex-col gap-4 rounded-caja border border-linea bg-surface p-5">
      <div>
        <h2 className="font-display text-xl font-semibold text-paper">{curso.nombre}</h2>
        <p className="text-sm text-muted">
          {curso.nivel} · {curso.bloques_en_ruta}{" "}
          {curso.bloques_en_ruta === 1 ? "bloque" : "bloques"} en ruta
        </p>
        <p className="mt-2 flex items-center gap-2">
          <span className="font-mono tracking-widest text-paper">{curso.codigo_invitacion}</span>
          <BotonCopiar
            texto={curso.codigo_invitacion}
            etiqueta={`Copiar el código de ${curso.nombre}`}
          />
        </p>
      </div>
      <Cifras datos={datos} />
      <Atencion datos={datos} />
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <Link
          to={enlaceDeCurso(base, "estudiantes")}
          className={claseBoton()}
          aria-label={`Estudiantes de ${curso.nombre}`}
        >
          Estudiantes
        </Link>
        {!archivado && (
          <Link
            to={`${paths.docente.progreso}?curso=${curso.id}`}
            className={claseBoton({ variante: "secundario" })}
            aria-label={`Progreso de ${curso.nombre}`}
          >
            Progreso
          </Link>
        )}
        <Link
          to={enlaceDeCurso(base, "ruta")}
          className="text-sm text-accent hover:underline"
          aria-label={`Ruta y evaluaciones de ${curso.nombre}`}
        >
          Ruta y evaluaciones
        </Link>
        <Link
          to={enlaceDeCurso(base, "ajustes")}
          className="text-sm text-accent hover:underline"
          aria-label={`Ajustes de ${curso.nombre}`}
        >
          Ajustes
        </Link>
      </div>
    </li>
  );
}
