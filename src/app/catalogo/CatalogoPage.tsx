import { SeccionBotones, SeccionCampos } from "./SeccionesControles";
import { SeccionEstados, SeccionPaneles, SeccionTabla } from "./SeccionesDatos";
import { SeccionGraficos } from "./SeccionGraficos";
import { SeccionIlustraciones } from "./SeccionIlustraciones";
import { SeccionMusica } from "./SeccionesMusica";

// Catálogo interno de componentes (HU-F-302). Solo existe con `npm run dev`:
// el router no registra /_componentes en producción.
export default function CatalogoPage() {
  return (
    <main className="mx-auto flex max-w-[68ch] flex-col gap-12 px-4 py-8 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-semibold text-paper">Componentes</h1>
        <p className="mt-2 text-sm text-muted">
          shared/ui y shared/music en todos sus estados. Recórrelos con el teclado.
        </p>
      </header>
      <SeccionBotones />
      <SeccionCampos />
      <SeccionTabla />
      <SeccionPaneles />
      <SeccionEstados />
      <SeccionMusica />
      <SeccionIlustraciones />
      <SeccionGraficos />
    </main>
  );
}
