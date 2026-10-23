#!/usr/bin/env bash
# Convierte las fotografías originales a AVIF y WebP (HU-F-321).
# Uso: scripts/optimizar-fotos.sh <carpeta-con-originales>
# La carpeta debe tener <nombre>.jpg por cada foto de docs/recursos/licencias.md.
# Recorte fijo 3:2 (object-cover en el componente Foto) y dos anchos: 640 y 1280 px.
# Sin dependencias en package.json: sharp-cli se ejecuta con npx a una versión fija.
set -euo pipefail

ORIGEN="${1:?Indica la carpeta con los originales}"
DESTINO="$(dirname "$0")/../src/assets/fotos"
SHARP="npx -y sharp-cli@5.2.0"
mkdir -p "$DESTINO"

# Calidad AVIF/WebP; las fotos con mucha textura bajan para cumplir ≤ 60 kB (≤ 120 kB el encabezado).
calidad() {
  case "$1" in
    diapason) echo "30 24" ;;
    *) echo "50 72" ;;
  esac
}

for original in "$ORIGEN"/*.jpg; do
  nombre="$(basename "$original" .jpg)"
  read -r q_avif q_webp <<<"$(calidad "$nombre")"
  for ancho in 640 1280; do
    alto=$((ancho * 2 / 3))
    $SHARP -i "$original" -o "$DESTINO/$nombre-$ancho.avif" -f avif -q "$q_avif" \
      resize "$ancho" "$alto" --fit cover --position attention
    $SHARP -i "$original" -o "$DESTINO/$nombre-$ancho.webp" -f webp -q "$q_webp" \
      resize "$ancho" "$alto" --fit cover --position attention
  done
done

ls -l "$DESTINO"
