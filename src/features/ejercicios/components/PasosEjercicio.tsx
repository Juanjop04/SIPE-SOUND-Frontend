/** Pasos numerados en mono (01, 02…), en una columna de lectura. */
export function PasosEjercicio({ pasos }: { pasos: string[] }) {
  if (pasos.length === 0) {
    return <p className="text-sm text-muted">Este ejercicio aún no tiene pasos escritos.</p>;
  }
  return (
    <section aria-labelledby="pasos-titulo">
      <h2 id="pasos-titulo" className="font-display text-xl font-semibold text-paper">
        Pasos
      </h2>
      <ol className="mt-4 flex max-w-prose flex-col">
        {pasos.map((paso, indice) => (
          // El orden es la identidad del paso (la lista no se reordena en el cliente).
          <li
            key={`paso-${indice + 1}`}
            className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-linea py-3"
          >
            <span className="font-mono text-sm text-muted">
              {String(indice + 1).padStart(2, "0")}
            </span>
            <span className="leading-relaxed text-paper">{paso}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
