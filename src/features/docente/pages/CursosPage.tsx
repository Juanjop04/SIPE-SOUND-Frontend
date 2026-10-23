import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button, Drawer, EstadoVacio, MensajeError, Skeleton, Tabs, useAviso } from "@/shared/ui";
import { PaginaAtril } from "../components/PaginaAtril";
import { FormularioCurso } from "../cursos/components/FormularioCurso";
import { TablaCursos } from "../cursos/components/TablaCursos";
import { useCrearCurso, useCursos, type EstadoCursos } from "../cursos/hooks/useCursos";
import type { DatosCurso } from "../types";

function ListaCursos({ estado }: { estado: EstadoCursos }) {
  const { data, isPending, error, refetch } = useCursos(estado);
  if (isPending) return <Skeleton lineas={4} className="h-11 w-full" />;
  if (error) return <MensajeError mensaje={error.message} onReintentar={() => refetch()} />;
  if (data.length === 0) {
    return estado === "activo" ? (
      <EstadoVacio
        titulo="Aún no tienes cursos."
        descripcion="Crea uno con «Nuevo curso» y comparte el código con tu grupo."
      />
    ) : (
      <EstadoVacio titulo="No tienes cursos archivados." />
    );
  }
  return <TablaCursos cursos={data} />;
}

export default function CursosPage() {
  const [parametros, setParametros] = useSearchParams();
  const estado: EstadoCursos = parametros.get("estado") === "archivado" ? "archivado" : "activo";
  const [creando, setCreando] = useState(false);
  const crear = useCrearCurso();
  const { avisar } = useAviso();

  async function guardar(datos: DatosCurso) {
    const { message } = await crear.mutateAsync(datos);
    avisar({ mensaje: message });
    setCreando(false);
    setParametros({}, { replace: true });
  }

  return (
    <PaginaAtril titulo="Cursos" descripcion="Tus grupos, cada uno con su código de ingreso.">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreando(true)}>
          <Plus size={16} aria-hidden="true" />
          Nuevo curso
        </Button>
      </div>
      <Tabs
        etiqueta="Estado de los cursos"
        activa={estado}
        onCambiar={(id) =>
          setParametros(id === "archivado" ? { estado: id } : {}, { replace: true })
        }
        pestanas={[
          { id: "activo", etiqueta: "Activos", contenido: <ListaCursos estado="activo" /> },
          {
            id: "archivado",
            etiqueta: "Archivados",
            contenido: <ListaCursos estado="archivado" />,
          },
        ]}
      />
      <Drawer abierto={creando} onCerrar={() => setCreando(false)} titulo="Nuevo curso">
        <FormularioCurso textoEnviar="Crear curso" onGuardar={guardar} />
      </Drawer>
    </PaginaAtril>
  );
}
