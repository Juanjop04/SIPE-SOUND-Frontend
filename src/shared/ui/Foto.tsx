import { cn } from "@/shared/lib/cn.js";

// Fotografías con licencia (HU-F-321, docs/recursos/licencias.md). Cada una existe en AVIF y WebP,
// en 640 y 1280 px de ancho, recortada a 3:2 por scripts/optimizar-fotos.sh.
const ARCHIVOS = import.meta.glob<string>("../../assets/fotos/*.{avif,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

export type NombreFoto = "guitarra-acustica" | "manos-acorde" | "practica-ritmo" | "diapason";

const ANCHOS = [640, 1280] as const;
const ANCHO = 1280;
const ALTO = 853;

type Formato = "avif" | "webp";

const archivo = (nombre: NombreFoto, ancho: number, formato: Formato) =>
  ARCHIVOS[`../../assets/fotos/${nombre}-${ancho}.${formato}`];

function srcset(nombre: NombreFoto, formato: Formato): string {
  return ANCHOS.map((a) => `${archivo(nombre, a, formato)} ${a}w`).join(", ");
}

export interface FotoProps {
  nombre: NombreFoto;
  /** Texto alternativo; "" si la foto es decorativa (el texto de al lado ya lo dice). */
  alt: string;
  /** Ancho que ocupará la foto en pantalla, para que el navegador elija 640 o 1280. */
  sizes?: string;
  /** true solo para la foto principal visible al cargar (no diferida, prioridad alta). */
  prioridad?: boolean;
  className?: string;
}

/** Foto 3:2 con AVIF y respaldo WebP; el espacio queda reservado antes de cargar (sin saltos). */
export function Foto({
  nombre,
  alt,
  sizes = "(min-width: 1024px) 40vw, 100vw",
  prioridad = false,
  className,
}: FotoProps) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcset(nombre, "avif")} sizes={sizes} />
      <img
        src={archivo(nombre, 640, "webp")}
        srcSet={srcset(nombre, "webp")}
        sizes={sizes}
        width={ANCHO}
        height={ALTO}
        alt={alt}
        loading={prioridad ? "eager" : "lazy"}
        fetchPriority={prioridad ? "high" : "auto"}
        decoding="async"
        className={cn("aspect-[3/2] h-auto w-full object-cover", className)}
      />
    </picture>
  );
}
