import { useState } from "react";
import {
  Button,
  Dialog,
  Drawer,
  EstadoVacio,
  Field,
  Input,
  MensajeError,
  Skeleton,
  Table,
  Tabs,
  useAviso,
  type ColumnaTabla,
} from "@/shared/ui";
import { Cuerda } from "@/shared/music";
import { Fila, Seccion } from "./Seccion";

interface Estudiante {
  id: string;
  nombre: string;
  avance: number;
  bloques: number;
}

const ESTUDIANTES: Estudiante[] = [
  { id: "a", nombre: "Ana Torres", avance: 72, bloques: 3 },
  { id: "b", nombre: "Bruno Díaz", avance: 18, bloques: 1 },
  { id: "c", nombre: "Carla Ruiz", avance: 100, bloques: 5 },
];

const COLUMNAS: ColumnaTabla<Estudiante>[] = [
  { id: "nombre", encabezado: "Estudiante", celda: (e) => e.nombre, valorOrden: (e) => e.nombre },
  {
    id: "avance",
    encabezado: "Avance",
    numerica: true,
    valorOrden: (e) => e.avance,
    celda: (e) => (
      <span className="inline-flex w-32 items-center gap-2">
        <Cuerda
          valor={e.avance}
          etiqueta={`Avance de ${e.nombre}`}
          grosor={1}
          sonando={e.avance === 100}
        />
        {e.avance} %
      </span>
    ),
  },
  { id: "bloques", encabezado: "Bloques", numerica: true, celda: (e) => e.bloques },
];

export function SeccionTabla() {
  const { avisar } = useAviso();
  return (
    <Seccion numero={3} titulo="Table">
      <Table
        etiqueta="Estudiantes del curso"
        filas={ESTUDIANTES}
        columnas={COLUMNAS}
        obtenerId={(e) => e.id}
        onFilaClick={(e) => avisar({ mensaje: `Abrirías el detalle de ${e.nombre}.` })}
      />
    </Seccion>
  );
}

export function SeccionPaneles() {
  const [dialogo, setDialogo] = useState(false);
  const [panel, setPanel] = useState(false);
  const cerrarDialogo = () => setDialogo(false);
  const cerrarPanel = () => setPanel(false);
  return (
    <Seccion numero={4} titulo="Dialog · Drawer">
      <Fila etiqueta="abrir">
        <Button variante="secundario" onClick={() => setDialogo(true)}>
          Retirar estudiante
        </Button>
        <Button variante="secundario" onClick={() => setPanel(true)}>
          Editar lección
        </Button>
      </Fila>
      <Dialog
        abierto={dialogo}
        onCerrar={cerrarDialogo}
        titulo="¿Retirar a Bruno del curso?"
        descripcion="Su progreso se conserva, pero dejará de ver la ruta del curso."
        acciones={
          <>
            <Button variante="fantasma" onClick={cerrarDialogo}>
              Cancelar
            </Button>
            <Button variante="peligro" onClick={cerrarDialogo}>
              Retirar
            </Button>
          </>
        }
      />
      <Drawer
        abierto={panel}
        onCerrar={cerrarPanel}
        titulo="Editar lección"
        acciones={<Button onClick={cerrarPanel}>Guardar</Button>}
      >
        <Field etiqueta="Título">
          {(c) => <Input {...c} defaultValue="Acordes mayores C y G" />}
        </Field>
      </Drawer>
    </Seccion>
  );
}

export function SeccionEstados() {
  const { avisar } = useAviso();
  const pestanas = [
    { id: "carga", etiqueta: "Carga", contenido: <Skeleton lineas={3} /> },
    {
      id: "vacio",
      etiqueta: "Vacío",
      contenido: (
        <EstadoVacio
          titulo="Aún no tienes estudiantes."
          descripcion="Comparte el código K7M2Q9XA con tu grupo."
        />
      ),
    },
    {
      id: "error",
      etiqueta: "Error",
      contenido: <MensajeError mensaje="No pudimos conectar." onReintentar={() => undefined} />,
    },
  ];
  return (
    <Seccion numero={5} titulo="Tabs · Skeleton · EstadoVacio · MensajeError · Aviso">
      <Tabs etiqueta="Estados de una vista" pestanas={pestanas} />
      <Fila etiqueta="aviso">
        <Button variante="secundario" onClick={() => avisar({ mensaje: "Lección guardada." })}>
          Aviso de éxito
        </Button>
        <Button
          variante="secundario"
          onClick={() => avisar({ mensaje: "No se pudo guardar.", tipo: "error" })}
        >
          Aviso de error
        </Button>
      </Fila>
    </Seccion>
  );
}
