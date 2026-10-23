# HU-F-321 · Incorporar fotografías de guitarra con licencia

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Should |
| Estimación | 3 puntos |
| Depende de | HU-F-320 |
| Rama | `hu/HU-F-321-fotografias` |

## Historia
**Como** estudiante que empieza
**quiero** ver guitarras reales y personas tocando en la plataforma
**para** sentir cerca lo que voy a aprender y querer practicar.

## Contexto
La maqueta aprobada usa una foto de guitarra en el encabezado del inicio y fotos en "Continuar
aprendiendo" y en los bloques. El repositorio solo tiene `src/assets/brand/logo.png`.

Limitación real: **la base no guarda una imagen por bloque o lección**. Una foto no puede presentarse
como "la foto de esta lección" si no lo es. Por eso las fotos se asignan **por tipo de contenido**, no
por lección concreta (una HU de backend futura podría añadir `imagen` a bloques y lecciones).

## Alcance
**Incluye**
- 4 fotografías en `src/assets/fotos/`:

  | Archivo | Motivo | Uso |
  |---|---|---|
  | `guitarra-acustica` | Guitarra acústica, primer plano de la boca y las cuerdas | Encabezado del inicio (HU-F-315) |
  | `manos-acorde` | Mano formando un acorde en el mástil | "Continuar aprendiendo" cuando el siguiente paso es una lección |
  | `practica-ritmo` | Persona rasgueando | Tarjeta del siguiente paso cuando es un ejercicio; encabezado de `/ejercicios` |
  | `diapason` | Detalle del diapasón y trastes | Encabezado de `/acordes` y estado vacío |

- **Origen y licencia**: Unsplash o Pexels (licencias que permiten uso comercial sin atribución
  obligatoria). Cada foto se registra en `docs/recursos/licencias.md`: autor, URL de origen, licencia,
  fecha de descarga y recorte aplicado. Ninguna foto se carga desde una URL externa.
- **Formato y peso**: AVIF con respaldo WebP (`<picture>`), 2 anchos (640 y 1280 px), ≤ 120 kB la
  del encabezado y ≤ 60 kB las demás; `width`/`height` declarados; `loading="lazy"` salvo la del
  encabezado (`fetchpriority="high"`).
- Componente `shared/ui/Foto.tsx`: `<picture>` con `alt` obligatorio (`alt=""` si es decorativa) y
  recorte `object-cover` con proporción fija.
- **Texto sobre foto**: solo con un fondo sólido `ink`/`surface` debajo del texto o la foto a un lado;
  sin degradados. El contraste se mide sobre el fondo real.
- Script de optimización en `scripts/` usando `npx` (sin dependencias nuevas en `package.json`).

**No incluye**: subida de imágenes por el docente, campo `imagen` en la base, fotos de personas
identificables sin licencia de modelo (se eligen manos o personas de espaldas).

## Prompt de ejecución
```text
Ejecuta HU-F-321 en SIPE-SOUND-FULLSTACK. Propón 2 candidatas por motivo
(URL de Unsplash/Pexels + por qué encaja con la paleta) y espera
confirmación antes de descargar. Verifica la licencia de cada una en su
página. Convierte con npx (sharp-cli o squoosh) a AVIF y WebP en 640 y
1280 px. Registra todo en docs/recursos/licencias.md.
```

## Criterios de aceptación
```gherkin
Escenario: Origen trazable
  Entonces cada archivo de src/assets/fotos aparece en docs/recursos/licencias.md con su autor y licencia

Escenario: Sin saltos de diseño
  Cuando carga el inicio con conexión lenta
  Entonces el espacio de la foto está reservado y el texto no se mueve

Escenario: Texto legible
  Entonces ningún texto queda sobre la foto sin un fondo sólido que dé 4.5:1
```

## Verificación manual
Lighthouse móvil del inicio (LCP con la foto), 375 px, red "Slow 4G".

## Definición de hecho específica
- [ ] Tabla de pesos por archivo en el PR.
- [ ] `docs/recursos/licencias.md` completo.
