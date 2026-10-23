// Espejo de SIPE-SOUND-BACKEND/app/core/longitudes.py (contrato 08 §4, contrato del backend §7).
// Cada límite existe tres veces: aquí, en la API y en la base (CHECK). Si cambia uno, cambian
// los tres en PRs enlazados. Ningún formulario escribe números sueltos.
export const LIMITES = {
  nombrePersona: { min: 2, max: 80 },
  email: { max: 254 },
  password: { min: 8, max: 72 },
  titulo: { min: 3, max: 120 },
  // app/schemas/contenido.py (LeccionCrear.numero)
  numeroLeccion: { min: 1, max: 9999 },
  descripcion: { max: 2000 },
  contenidoLeccion: { max: 20000 },
  mensajeRetroalimentacion: { min: 1, max: 1000 },
  nombreAcorde: { min: 1, max: 20 },
  descripcionAcorde: { max: 500 },
  bpm: { min: 20, max: 300 },
  duracionMin: { min: 1, max: 600 },
  codigoCurso: { largo: 8, alfabeto: "ABCDEFGHJKMNPQRSTUVWXYZ23456789" },
  maximoAcordes: 24,
  maximoTemas: 20,
  maximoPasos: 30,
  tema: { max: 60 },
  paso: { max: 300 },
  enunciado: { min: 3, max: 300 },
  opcion: { min: 1, max: 120 },
  opciones: { min: 2, max: 6 },
  preguntas: { min: 1, max: 50 },
  aprobacion: { min: 50, max: 100 },
  intentosMax: { min: 1, max: 10 },
  busqueda: { max: 80 },
  // app/schemas/curso.py (MAXIMO_BLOQUES_EN_RUTA)
  bloquesEnRuta: { max: 100 },
} as const;
