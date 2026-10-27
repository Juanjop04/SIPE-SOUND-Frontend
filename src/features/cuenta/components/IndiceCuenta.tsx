const SECCIONES = [
  { id: "datos", etiqueta: "Datos personales" },
  { id: "correo", etiqueta: "Correo" },
  { id: "clave", etiqueta: "Contraseña" },
  { id: "apariencia", etiqueta: "Apariencia" },
  { id: "sesion", etiqueta: "Sesión" },
] as const;

/** Índice de secciones: columna a la izquierda; por debajo de 1100 px, una fila desplazable. */
export function IndiceCuenta() {
  return (
    <nav
      aria-label="Secciones de la cuenta"
      className="flex gap-0.5 overflow-x-auto border-b border-linea pb-2 min-[1101px]:sticky min-[1101px]:top-6 min-[1101px]:flex-col min-[1101px]:overflow-visible min-[1101px]:border-b-0 min-[1101px]:pb-0"
    >
      {SECCIONES.map(({ id, etiqueta }) => (
        <a
          key={id}
          href={`#${id}`}
          className="whitespace-nowrap rounded-md px-2.5 py-2 text-sm text-muted transition-colors duration-rapida hover:bg-surface hover:text-paper"
        >
          {etiqueta}
        </a>
      ))}
    </nav>
  );
}
