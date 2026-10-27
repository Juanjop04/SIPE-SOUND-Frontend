import { useCallback, useState } from "react";
import { Trash2 } from "lucide-react";
import { formatearFecha } from "@/shared/lib/formato";
import { Button, Dialog, MensajeError, Table, useAviso, type ColumnaTabla } from "@/shared/ui";
import { useRetirarPreautorizacion } from "../hooks/usePreautorizaciones";
import type { EstadoPreautorizacion, Preautorizacion } from "../types";

// Pendiente (aún no se registra) en aviso · Aplicada (ya es docente) en verde: texto en color.
const ESTADOS: Record<EstadoPreautorizacion, { texto: string; clase: string }> = {
  pendiente: { texto: "Pendiente", clase: "text-aviso" },
  aplicada: { texto: "Aplicada", clase: "text-success" },
};

function Estado({ estado }: { estado: EstadoPreautorizacion }) {
  const { texto, clase } = ESTADOS[estado];
  return <span className={`font-semibold ${clase}`}>{texto}</span>;
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
    {
      id: "email",
      encabezado: "Correo",
      celda: (f) => <span className="font-mono text-[13px]">{f.email}</span>,
      valorOrden: (f) => f.email,
    },
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
          <button
            type="button"
            aria-label={`Revocar la autorización de ${f.email}`}
            title="Revocar autorización"
            onClick={() => setPorRetirar(f.email)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-accent transition-colors duration-rapida hover:bg-peligro-texto/10 hover:text-peligro-texto"
          >
            <Trash2 size={17} aria-hidden="true" />
          </button>
        ) : (
          <span className="text-xs text-muted">Ya registrado</span>
        ),
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
        titulo="¿Revocar esta autorización?"
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
              Sí, revocar
            </Button>
          </>
        }
      >
        {retirar.error && <MensajeError mensaje={retirar.error.message} />}
      </Dialog>
    </>
  );
}
