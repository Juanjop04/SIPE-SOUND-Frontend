import { useState } from "react";
import { Button, Field, Input, Select, Textarea } from "@/shared/ui";
import { Fila, Seccion } from "./Seccion";

const DESCRIPCION_LARGA = "Practica el cambio de Em a Am con el metrónomo. ".repeat(8).trim();

export function SeccionBotones() {
  return (
    <Seccion numero={1} titulo="Button">
      <Fila etiqueta="variantes">
        <Button>Presentar evaluación</Button>
        <Button variante="secundario">Guardar borrador</Button>
        <Button variante="fantasma">Cancelar</Button>
        <Button variante="peligro">Retirar del curso</Button>
      </Fila>
      <Fila etiqueta="tamaño sm">
        <Button tamano="sm">Primario</Button>
        <Button tamano="sm" variante="secundario">
          Secundario
        </Button>
      </Fila>
      <Fila etiqueta="cargando · disabled">
        <Button cargando>Enviando…</Button>
        <Button disabled variante="secundario">
          Sin cambios
        </Button>
      </Fila>
    </Seccion>
  );
}

export function SeccionCampos() {
  const [nombre, setNombre] = useState("");
  return (
    <Seccion numero={2} titulo="Field · Input · Textarea · Select">
      <Field etiqueta="Nombre del curso" ayuda="Entre 3 y 120 caracteres.">
        {(control) => (
          <Input
            {...control}
            value={nombre}
            maxLength={120}
            onChange={(e) => setNombre(e.target.value)}
          />
        )}
      </Field>
      <Field etiqueta="Correo" error="El correo no es válido.">
        {(control) => <Input {...control} type="email" defaultValue="ana@colegio" />}
      </Field>
      <Field etiqueta="Descripción" ayuda="El contador aparece desde el 80 % del límite.">
        {(control) => (
          <Textarea
            {...control}
            contador
            maxLength={500}
            rows={4}
            defaultValue={DESCRIPCION_LARGA}
          />
        )}
      </Field>
      <Field etiqueta="Nivel">
        {(control) => (
          <Select {...control} defaultValue="principiante">
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </Select>
        )}
      </Field>
    </Seccion>
  );
}
