#!/usr/bin/env bash
# Logo liviano para la marca (HU-F-312): el PNG original (674×539, ~29 kB) se muestra a 32–40 px.
# Se recorta el margen transparente (el dibujo ocupa ~28 % del lienzo) y se genera un WebP con
# transparencia a 120 px (3× los 40 px del acceso), ~8 kB.
# Sin dependencias en package.json: sharp-cli se ejecuta con npx a una versión fija.
set -euo pipefail

CARPETA="$(dirname "$0")/../src/assets/brand"
npx -y sharp-cli@5.2.0 -i "$CARPETA/logo.png" -o "$CARPETA/logo-120.webp" -f webp -q 85 \
  trim -- resize 120 120 --fit inside
ls -l "$CARPETA"
