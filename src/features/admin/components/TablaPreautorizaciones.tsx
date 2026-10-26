import { useCallback, useState } from "react";
import { formatearFecha } from "@/shared/lib/formato";
import { Button, Dialog, MensajeError, Table, useAviso, type ColumnaTabla } from "@/shared/ui";
import { useRetirarPreautorizacion } from "../hooks/usePreautorizaciones";
import type { EstadoPreautorizacion, Preautorizacion } from "../types";

// ○ pendiente (aún no se registra) · ● aplicada (ya es docente): símbolo + texto.
const ESTADOS: Record<EstadoPreautorizacion, { simbolo: string; clase: string }> = {
  pendiente: { simbolo: "○", clase: "text-muted" },
  aplicada: { simbolo: "●", clase: "text-success" },
};

function Estado({ estado }: { estado: EstadoPreautorizacion }) {
  const { simbolo, clase } = ESTADOS[estado];
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className={`font-mono ${clase}`}>
        {simbolo}
      </span>
      {estado}
    </span>
  );
}

export function TablaPreautorizaciones({ filas }: { filas: Preautorizacion[] }) {
  const retirar = useRetirarPreautorizacion();
  const { avisar } = useAviso();
  const [porRetirar, setPorRetirar] = useState<string | null>(null);
  const reiniciar = retirar.reset;
  const cerrar = useCallback(() => {
    setPorRetirar(null);
    reiniciar();
  }, [reiniciar]);

  async function confirmar() {
    if (!porRetirar) return;
    const { message } = await retirar.mutateAsync(porRetirar);
    avisar({ mensaje: message });
    setPorRetirar(null);
  }

  const columnas: ColumnaTabla<Preautorizacion>[] = [
    { id: "email", encabezado: "Correo", celda: (f) => f.email, valorOrden: (f) => f.email },
    {
      id: "estado",
      encabezado: "Estado",
      celda: (f) => <Estado estado={f.estado} />,
      valorOrden: (f) => f.estado,
    },
    {
      id: "creado",
      encabezado: "Autorizado",
      numerica: true,
      celda: (f) => formatearFecha(f.creado_en),
      valorOrden: (f) => f.creado_en,
    },
    {
      id: "acciones",
      encabezado: "Acciones",
      celda: (f) =>
        f.estado === "pendiente" ? (
          <Button variante="fantasma" tamano="sm" onClick={() => setPorRetirar(f.email)}>
            Retirar
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      <Table
        etiqueta="Correos autorizados como docente"
        filas={filas}
        columnas={columnas}
        obtenerId={(f) => f.email}
      />
      <Dialog
        abierto={porRetirar !== null}
        onCerrar={cerrar}
        titulo="¿Retirar esta autorización?"
        descripcion={`${porRetirar ?? ""} ya no recibirá el rol docente al registrarse.`}
        acciones={
          <>
            <Button variante="fantasma" onClick={cerrar}>
              Cancelar
            </Button>
            <Button
              variante="peligro"
              cargando={retirar.isPending}
              onClick={() => confirmar().catch(() => null)}
            >
              Retirar
            </Button>
          </>
        }
      >
        {retirar.error && <MensajeError mensaje={retirar.error.message} />}
      </Dialog>
    </>
  );
}
