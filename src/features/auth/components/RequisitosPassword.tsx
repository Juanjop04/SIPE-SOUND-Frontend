import { REQUISITOS_PASSWORD } from "../schemas";

/**
 * Lista de requisitos que se marca mientras se escribe: símbolo + texto (no solo color).
 * ○ pendiente · ● cumplido (ámbar = logro, contrato 05 §2.2).
 */
export function RequisitosPassword({ id, password }: { id: string; password: string }) {
  return (
    <ul id={id} className="flex flex-col gap-1 text-xs" aria-label="Requisitos de la contraseña">
      {REQUISITOS_PASSWORD.map((requisito) => {
        const cumple = requisito.cumple(password);
        return (
          <li key={requisito.id} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`w-3 font-mono ${cumple ? "text-success" : "text-muted"}`}
            >
              {cumple ? "●" : "○"}
            </span>
            <span className={cumple ? "text-paper" : "text-muted"}>{requisito.texto}</span>
            <span className="sr-only">{cumple ? "cumplido" : "pendiente"}</span>
          </li>
        );
      })}
    </ul>
  );
}
