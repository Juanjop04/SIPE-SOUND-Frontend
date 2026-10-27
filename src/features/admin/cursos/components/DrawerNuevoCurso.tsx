import { useState } from "react";
import { FormularioCurso } from "@/features/docente";
import { Drawer, Field, Select } from "@/shared/ui";
import { useCrearCursoAdmin, useDocentesParaElegir } from "../hooks";

/**
 * Crear un curso desde el panel del administrador (HU-F-516). Sin docente queda disponible hasta
 * que el administrador le asigne uno (HU-F-518); sus estudiantes pueden pedir entrar desde ya.
 */
export function DrawerNuevoCurso({
  abierto,
  onCerrar,
}: {
  abierto: boolean;
  onCerrar: () => void;
}) {
  const [docenteId, setDocenteId] = useState("");
  const docentes = useDocentesParaElegir();
  const crear = useCrearCursoAdmin();
  const activos = (docentes.data?.data ?? []).filter((d) => d.estado === "activa");

  return (
    <Drawer abierto={abierto} onCerrar={onCerrar} titulo="Nuevo curso">
      <div className="flex flex-col gap-5">
        <Field etiqueta="Docente (opcional)" ayuda="Si eliges un docente, le llegará un correo.">
          {(campo) => (
            <Select {...campo} value={docenteId} onChange={(e) => setDocenteId(e.target.value)}>
              <option value="">Sin docente (disponible)</option>
              {activos.map((d) => (
                <option key={d.id} value={d.id}>
                  {[d.nombre, d.apellido].filter(Boolean).join(" ")}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <FormularioCurso
          textoEnviar="Crear curso"
          deshabilitado={crear.isPending}
          onGuardar={async (datos) => {
            await crear.mutateAsync({ ...datos, docente_id: docenteId || null });
            setDocenteId("");
            onCerrar();
          }}
        />
      </div>
    </Drawer>
  );
}
