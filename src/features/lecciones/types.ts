/** GET /lecciones y /lecciones/{id} (contrato del backend §5, LeccionOut). */
export interface Leccion {
  id: number;
  bloque_id: number | null;
  numero: number;
  titulo: string;
  descripcion: string | null;
  contenido: string | null;
  nivel: string;
  duracion_min: number | null;
  acordes: string[] | null;
  temas: string[] | null;
}
