import { Fragment } from "react";
import { Cuerda } from "@/shared/music";
import type { Cifra } from "../utils/calculos";

/** Franja de cifras en mono separadas por trastes (no tarjetas KPI) y "Tu cuerda". */
export function FranjaCifras({ cifras, avance }: { cifras: Cifra[]; avance: number }) {
  return (
    <section aria-label="Resumen de tu avance" className="flex flex-col gap-6">
      <dl className="flex flex-wrap items-stretch gap-x-6 gap-y-3">
        {cifras.map((cifra, indice) => (
          <Fragment key={cifra.clave}>
            {indice > 0 && <span aria-hidden="true" className="w-px self-stretch bg-linea" />}
            <div className="flex flex-col">
              <dt className="font-mono text-xs text-muted">{cifra.etiqueta}</dt>
              <dd className="font-mono text-3xl tabular-nums text-paper">
                {cifra.hecho}
                <span className="text-lg text-muted">/{cifra.total}</span>
              </dd>
            </div>
          </Fragment>
        ))}
      </dl>
      <div className="flex flex-col gap-2">
        <p className="flex justify-between font-mono text-xs text-muted">
          <span>Tu cuerda</span>
          <span>{avance} %</span>
        </p>
        <Cuerda valor={avance} grosor={5} sonando={avance === 100} etiqueta="Avance global" />
      </div>
    </section>
  );
}
