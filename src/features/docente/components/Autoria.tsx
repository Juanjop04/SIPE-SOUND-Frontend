/** Quién creó algo y, si alguien más lo tocó, quién lo modificó por última vez (HU-B-412). */
export function Autoria({
  autor,
  modificadoPor,
}: {
  autor: string | null | undefined;
  modificadoPor: string | null | undefined;
}) {
  return (
    <span className="flex flex-col text-sm">
      <span className="text-paper">{autor ?? "—"}</span>
      {modificadoPor && <span className="text-xs text-muted">Modificó: {modificadoPor}</span>}
    </span>
  );
}
