# Licencias de recursos gráficos

Registro obligatorio de toda imagen de terceros del repositorio (HU-F-321). Una foto que no esté en
esta tabla no puede estar en `src/assets/`.

## Fotografías (`src/assets/fotos/`)

Licencia de todas: **Unsplash License** (<https://unsplash.com/license>): uso gratuito, comercial y no
comercial, sin permiso ni atribución obligatoria; no permite vender la foto sin modificarla ni
recopilarla para un servicio de imágenes competidor. Se verificó en la página de cada foto
("Free to use under the Unsplash License"), no Unsplash+.

| Archivo | Autor | Origen | Publicada | Descargada | Recorte y formato |
|---|---|---|---|---|---|
| `guitarra-acustica-{640,1280}.{avif,webp}` | Chris Hardy (@chrishardyphotography) | <https://unsplash.com/photos/kXK4dYneOpo> | 2020-05-05 | 2026-10-23 | 3:2, `attention`; AVIF q50 · WebP q72 |
| `manos-acorde-{640,1280}.{avif,webp}` | Scott Gruber (@scottgruber) | <https://unsplash.com/photos/IaA_5KNVAR4> | 2015-10-25 | 2026-10-23 | 3:2, `attention`; AVIF q50 · WebP q72 |
| `practica-ritmo-{640,1280}.{avif,webp}` | Katherine Hanlon (@tinymountain) | <https://unsplash.com/photos/pOraJAwCFRo> | 2020-08-31 | 2026-10-23 | 3:2, `attention`; AVIF q50 · WebP q72 |
| `diapason-{640,1280}.{avif,webp}` | Rombo (@rombo_guitar_picks) | <https://unsplash.com/photos/tNrHQPSbmdw> | 2024-07-13 | 2026-10-23 | 3:2, `attention`; AVIF q30 · WebP q24 (mucha textura) |

Observaciones:
- En `guitarra-acustica` se ve la etiqueta del fabricante dentro de la boca, y en `diapason` la púa
  lleva un logo pequeño. Son incidentales; la licencia de Unsplash no cubre marcas, así que no se usan
  en material que sugiera patrocinio.
- Ninguna muestra rostros (solo manos o el instrumento): no se requiere licencia de modelo.

## Cómo añadir o regenerar una foto
1. Verifica en su página que dice "Free to use under the Unsplash License" (no Unsplash+).
2. Descarga el original (`https://unsplash.com/photos/<id>/download?w=2400`) como `<nombre>.jpg` en
   una carpeta fuera del repositorio.
3. Ejecuta `scripts/optimizar-fotos.sh <carpeta>` (sharp-cli por `npx`, sin dependencias nuevas).
4. Añade el nombre a `NombreFoto` en `src/shared/ui/Foto.tsx` y una fila a esta tabla.
