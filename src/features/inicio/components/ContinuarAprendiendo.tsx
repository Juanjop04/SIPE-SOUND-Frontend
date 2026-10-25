import { Link } from "react-router-dom";
import { paths } from "@/shared/config/paths.js";
import { Tablatura } from "@/shared/music";
import { EstucheAbierto } from "@/shared/music/ilustraciones";
import { claseBoton, EstadoVacio, Foto, type NombreFoto } from "@/shared/ui";
import type { SiguientePaso } from "../utils/siguientePaso";

interface Destino {
  foto: NombreFoto;
  kicker: string;
  titulo: string;
  datos: { clave: string; valor: string }[];
  accion: string;
  enlace: string;
}

function destinoDe(paso: Extract<SiguientePaso, { tipo: "leccion" | "evaluacion" }>): Destino {
  const bloque = `Bloque ${paso.bloque.numero}`;
  if (paso.tipo === "evaluacion") {
    return {
      foto: "diapason",
      kicker: bloque,
      titulo: `Evaluación: ${paso.bloque.titulo}`,
      datos: [{ clave: "requisito", valor: "aprueba con 80 %" }],
      accion: "Presentar evaluación",
      enlace: paths.evaluacion(paso.bloque.evaluacion_id ?? ""),
    };
  }
  const { leccion } = paso;
  return {
    foto: "manos-acorde",
    kicker: `${bloque} · ${paso.bloque.titulo}`,
    titulo: leccion.titulo,
    datos: [
      { clave: "posicion", valor: `lección ${paso.posicion} de ${paso.total}` },
      ...(leccion.duracion_min
        ? [{ clave: "duracion", valor: `${leccion.duracion_min} min` }]
        : []),
    ],
    accion: paso.comenzar ? "Comenzar lección" : "Continuar",
    enlace: paths.leccion(leccion.id),
  };
}

/** El siguiente paso de la ruta con la única acción primaria de la pantalla. */
export function ContinuarAprendiendo({ paso }: { paso: SiguientePaso }) {
  if (paso.tipo === "sin-contenido") {
    return (
      <EstadoVacio
        titulo="Aún no hay bloques publicados."
        descripcion="Cuando tu docente publique el primero, lo verás aquí."
        accion={<EstucheAbierto className="h-auto w-40" />}
      />
    );
  }
  if (paso.tipo === "completa") {
    return (
      <EstadoVacio
        titulo="Terminaste la ruta."
        descripcion="Repasa tus bloques favoritos o pídele a tu docente un curso nuevo."
        accion={
          <Link to={paths.ruta} className={claseBoton({ variante: "secundario" })}>
            Ver la ruta
          </Link>
        }
      />
    );
  }
  const destino = destinoDe(paso);
  return (
    <div className="grid overflow-hidden rounded-caja border border-linea bg-ink-2 sm:grid-cols-[12rem_1fr]">
      <Foto
        nombre={destino.foto}
        alt=""
        sizes="(min-width: 640px) 12rem, 100vw"
        className="h-full"
      />
      <div className="flex flex-col gap-3 p-5">
        <p className="text-sm text-primary-claro">{destino.kicker}</p>
        <p className="font-display text-xl font-semibold text-paper">{destino.titulo}</p>
        <Tablatura datos={destino.datos} />
        <Link to={destino.enlace} className={claseBoton({ className: "mt-2 w-fit" })}>
          {destino.accion}
        </Link>
      </div>
    </div>
  );
}
