import { TrasteDivider } from "@/shared/music";
import { SECCIONES_TERMINOS } from "../contenido";

/** Lectura editorial: una columna ≤ 68 caracteres, secciones separadas como trastes. */
export default function TerminosPage() {
  return (
    <main className="mx-auto max-w-[68ch] px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-paper">Términos y condiciones</h1>
      <p className="mt-2 text-sm text-muted">
        Lo que aceptas al crear tu cuenta en SIPE-SOUND y cómo cuidamos tus datos.
      </p>
      {SECCIONES_TERMINOS.map((seccion) => (
        <section
          key={seccion.numero}
          aria-labelledby={`termino-${seccion.numero}`}
          className="mt-8"
        >
          <TrasteDivider numero={seccion.numero} className="mb-4" />
          <h2
            id={`termino-${seccion.numero}`}
            className="font-display text-xl font-semibold text-paper"
          >
            {seccion.titulo}
          </h2>
          <p className="mt-2 leading-relaxed text-muted">{seccion.texto}</p>
        </section>
      ))}
    </main>
  );
}
