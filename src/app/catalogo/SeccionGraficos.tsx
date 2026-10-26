import {
  BarraApilada,
  BarrasHorizontales,
  BarrasPorDia,
  type BarraDia,
  type BarraHorizontal,
} from "@/shared/ui/graficos";
import { Seccion } from "./Seccion";

const BLOQUES: BarraHorizontal[] = [
  { id: 1, nombre: "Bloque 1 · Primeros acordes", valor: 100, estado: "aprobado" },
  { id: 2, nombre: "Bloque 2 · Ritmo básico", valor: 100, estado: "aprobado" },
  { id: 3, nombre: "Bloque 3 · Cambios de acorde", valor: 40, estado: "en_curso" },
  { id: 4, nombre: "Bloque 4 · Rasgueos", valor: 0, estado: "bloqueado" },
];

function actividad(): { hoy: string; datos: BarraDia[] } {
  const base = Date.UTC(2026, 9, 25);
  const datos = Array.from({ length: 28 }, (_, i) => {
    const fecha = new Date(base - (27 - i) * 86_400_000).toISOString().slice(0, 10);
    return { fecha, valor: i % 3 === 0 ? 0 : (i * 7) % 6 };
  });
  return { hoy: datos[27].fecha, datos };
}

// Datos de ejemplo del catálogo (HU-F-502/HU-F-506): cada gráfico lleva título, unidad, lectura y tabla.
export function SeccionGraficos() {
  const { hoy, datos } = actividad();
  return (
    <Seccion numero={8} titulo="Gráficos (Recharts)">
      <BarrasHorizontales
        titulo="Avance por bloque"
        unidad="Porcentaje de avance en cada bloque de la ruta"
        lectura="Llevas 40 % del bloque 3."
        datos={BLOQUES}
        onElegir={() => undefined}
      />
      <BarrasPorDia
        titulo="Actividad"
        unidad="Registros de avance por día, últimos 28 días"
        lectura="Practicaste 18 de los últimos 28 días."
        datos={datos}
        hoy={hoy}
        etiquetaValor="registros"
      />
      <BarraApilada
        titulo="Estados del grupo"
        unidad="Estudiantes por estado de avance"
        lectura="14 de 28 estudiantes están en curso."
        tramos={[
          { estado: "sin_iniciar", cantidad: 6 },
          { estado: "en_curso", cantidad: 14 },
          { estado: "finalizado", cantidad: 8 },
        ]}
      />
    </Seccion>
  );
}
