import type { Cifras } from "../utils";

/** Cifras del curso (o de todos) en una sola línea: valor en mono y su nombre al lado, sin tarjetas. */
export function FranjaProgreso({ cifras }: { cifras: Cifras }) {
  const datos = [
    { etiqueta: "Estudiantes", valor: cifras.estudiantes },
    { etiqueta: "Avance promedio", valor: `${cifras.avancePromedio} %` },
    { etiqueta: "Al día (7 días)", valor: cifras.alDia },
    { etiqueta: "Sin actividad (14 días)", valor: cifras.sinActividad },
  ];
  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-3">
      {datos.map(({ etiqueta, valor }) => (
        <div key={etiqueta} className="flex items-baseline gap-2">
          <dd className="font-mono text-2xl font-semibold tabular-nums text-paper">{valor}</dd>
          <dt className="text-sm text-muted">{etiqueta}</dt>
        </div>
      ))}
    </dl>
  );
}
