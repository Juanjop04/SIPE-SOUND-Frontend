import { useSession } from "@/features/auth";
import { formatearFecha } from "@/shared/lib/formato";

/** Quién creó y quién modificó por última vez algo del panel (HU-B-412); nombres, nunca correos. */
export interface DatosDeAutoria {
  autor_id: string | null;
  autor: string | null;
  /** null = nadie lo ha modificado desde que se creó. */
  modificado_por: string | null;
  actualizado_en: string;
}

/** "Creado por Ana Ríos · Modificado por Luis Gómez el 25 oct 2026"; vacío si no hay nada que decir. */
export function textoDeAutoria(
  d: Pick<DatosDeAutoria, "autor" | "modificado_por" | "actualizado_en">,
) {
  const partes = [];
  if (d.autor) partes.push(`Creado por ${d.autor}`);
  if (d.modificado_por) {
    partes.push(`Modificado por ${d.modificado_por} el ${formatearFecha(d.actualizado_en)}`);
  }
  return partes.join(" · ");
}

/** Solo quien lo creó (o un administrador) borra: el resto edita, publica y archiva o cierra. */
export function usePuedeBorrar(autorId: string | null | undefined): boolean {
  const { perfil, rol } = useSession();
  return rol === "admin" || (autorId != null && autorId === perfil?.id);
}
