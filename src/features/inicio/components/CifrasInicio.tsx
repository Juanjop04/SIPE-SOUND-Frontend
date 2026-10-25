import { BookOpen, CalendarDays, Layers, Timer } from "lucide-react";
import type { Actividad, ResumenProgreso } from "@/features/progreso";
import { TarjetaCifra } from "@/shared/ui";

export interface CifrasInicioProps {
  resumen: ResumenProgreso;
  /** Total de bloques de la ruta; null si la ruta no cargó (la tarjeta no se muestra). */
  totalBloques: number | null;
  /** Con HU-B-324: días con avance en el rango; sin ella, se muestran los ejercicios. */
  actividad: Actividad | null;
}

/** Tres cifras reales del avance; nunca tiempo de práctica (la API no lo registra). */
export function CifrasInicio({ resumen, totalBloques, actividad }: CifrasInicioProps) {
  return (
    <section aria-label="Tu avance en cifras" className="grid gap-4 sm:grid-cols-3">
      <TarjetaCifra
        icono={BookOpen}
        etiqueta="Lecciones completadas"
        hecho={resumen.lecciones.completadas}
        total={resumen.lecciones.total}
      />
      {totalBloques !== null && (
        <TarjetaCifra
          icono={Layers}
          etiqueta="Bloques aprobados"
          hecho={resumen.bloques_aprobados}
          total={totalBloques}
        />
      )}
      {actividad ? (
        <TarjetaCifra
          icono={CalendarDays}
          etiqueta={`Días con avance (últimos ${actividad.por_dia.length})`}
          hecho={actividad.dias_con_practica}
          total={actividad.por_dia.length}
        />
      ) : (
        <TarjetaCifra
          icono={Timer}
          etiqueta="Ejercicios completados"
          hecho={resumen.ejercicios.completados}
          total={resumen.ejercicios.total}
        />
      )}
    </section>
  );
}
