import { cn } from "@/shared/lib/cn.js";
import { formatearFecha } from "@/shared/lib/formato";
import { ESCRITORIO_MEDIO, useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { Table, type ColumnaTabla } from "@/shared/ui";
import type { EstadoCuenta, Usuario } from "../tipos";
import { ETIQUETA_ESTADO, ETIQUETA_ROL, nombreCompleto, textoEnvio } from "../utils";
import { AccionesFila, type AccionUsuario } from "./AccionesFila";

const COLOR_ESTADO: Record<EstadoCuenta, string> = {
  pendiente_verificacion: "border-linea-fuerte text-muted",
  activa: "border-success text-success",
  suspendida: "border-danger text-danger",
};

/** Estado de la cuenta: siempre con texto, nunca solo color (contrato 05 §6). */
function PildoraEstado({ estado }: { estado: EstadoCuenta }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit rounded-full border px-2 py-0.5 text-xs",
        COLOR_ESTADO[estado],
      )}
    >
      {ETIQUETA_ESTADO[estado]}
    </span>
  );
}

function Envio({ usuario, enviando }: { usuario: Usuario; enviando: boolean }) {
  const { texto, fallo } = textoEnvio(usuario, enviando);
  return <span className={fallo ? "text-danger" : "text-muted"}>{texto}</span>;
}

interface TablaUsuariosProps {
  usuarios: Usuario[];
  seleccion: ReadonlySet<string>;
  /** Cuentas cuyo código se está reenviando ("Enviando…"). */
  enviando: ReadonlySet<string>;
  onAlternar: (id: string) => void;
  onAccion: (accion: AccionUsuario, usuario: Usuario) => void;
}

function Casilla({
  usuario,
  marcada,
  onAlternar,
}: {
  usuario: Usuario;
  marcada: boolean;
  onAlternar: (id: string) => void;
}) {
  return (
    <input
      type="checkbox"
      checked={marcada}
      onChange={() => onAlternar(usuario.id)}
      aria-label={`Elegir a ${nombreCompleto(usuario)}`}
      className="h-4 w-4 accent-primary"
    />
  );
}

function columnasDe({
  seleccion,
  enviando,
  onAlternar,
  onAccion,
}: Omit<TablaUsuariosProps, "usuarios">): ColumnaTabla<Usuario>[] {
  return [
    {
      id: "elegir",
      encabezado: "Elegir",
      celda: (u) => <Casilla usuario={u} marcada={seleccion.has(u.id)} onAlternar={onAlternar} />,
    },
    {
      id: "nombre",
      encabezado: "Nombre y correo",
      celda: (u) => (
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => onAccion("detalle", u)}
            className="whitespace-nowrap text-left underline decoration-linea-fuerte underline-offset-2 hover:decoration-accent"
          >
            {nombreCompleto(u)}
          </button>
          <span className="whitespace-nowrap font-mono text-xs">{u.email}</span>
          <span className="text-xs text-muted">{ETIQUETA_ROL[u.rol]}</span>
        </div>
      ),
    },
    { id: "estado", encabezado: "Estado", celda: (u) => <PildoraEstado estado={u.estado} /> },
    {
      id: "envio",
      encabezado: "Último envío del código",
      celda: (u) => <Envio usuario={u} enviando={enviando.has(u.id)} />,
    },
    {
      id: "acceso",
      encabezado: "Último acceso",
      celda: (u) => (
        <span className="whitespace-nowrap font-mono text-xs">
          {formatearFecha(u.ultimo_acceso)}
        </span>
      ),
    },
    {
      id: "acciones",
      encabezado: "Acciones",
      celda: (u) => <AccionesFila usuario={u} onAccion={onAccion} />,
    },
  ];
}

/** Menos de 768 px: cada cuenta es un bloque apilado (nombre y estado, correo, menú). */
function ListaApilada(props: TablaUsuariosProps) {
  const { usuarios, seleccion, enviando, onAlternar, onAccion } = props;
  return (
    <ul className="divide-y divide-linea rounded-caja border border-linea">
      {usuarios.map((u) => (
        <li key={u.id} className="flex items-start gap-3 p-3">
          <Casilla usuario={u} marcada={seleccion.has(u.id)} onAlternar={onAlternar} />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onAccion("detalle", u)}
                className="text-left font-medium text-paper underline decoration-linea-fuerte underline-offset-2 hover:decoration-accent"
              >
                {nombreCompleto(u)}
              </button>
              <PildoraEstado estado={u.estado} />
            </div>
            <p className="break-all font-mono text-xs text-muted">{u.email}</p>
            <p className="text-xs">
              {ETIQUETA_ROL[u.rol]} · <Envio usuario={u} enviando={enviando.has(u.id)} />
            </p>
            <AccionesFila usuario={u} onAccion={onAccion} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Tabla densa de cuentas (patrón "Atril"); apilada en pantallas angostas. */
export function TablaUsuarios(props: TablaUsuariosProps) {
  const ancha = useMediaQuery(ESCRITORIO_MEDIO);
  if (!ancha) return <ListaApilada {...props} />;
  return (
    <Table
      etiqueta="Cuentas de usuario"
      filas={props.usuarios}
      columnas={columnasDe(props)}
      obtenerId={(u) => u.id}
    />
  );
}
