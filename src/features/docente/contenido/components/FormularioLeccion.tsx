import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { ContenidoLeccion } from "@/features/lecciones";
import { Field, ListaEditable, Select, Textarea } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { useBloques } from "../api";
import { esquemaLeccion, type DatosLeccion, type EntradaLeccion } from "../schemas";
import type { LeccionDocente } from "../tipos";
import { useFormularioContenido } from "../useFormularioContenido";
import {
  CampoDescripcion,
  CampoDuracion,
  CampoEntero,
  CampoNivel,
  CampoTitulo,
} from "./CamposComunes";
import { MarcoEditor } from "./MarcoEditor";
import { PieEditor } from "./PieEditor";
import { SelectorAcordes } from "./SelectorAcordes";

const CAMPOS = [
  "bloque_id",
  "numero",
  "titulo",
  "descripcion",
  "contenido",
  "nivel",
  "duracion_min",
  "acordes",
  "temas",
] as const;

function valoresDe(l: LeccionDocente | null): EntradaLeccion {
  return {
    bloque_id: l ? String(l.bloque_id) : "",
    numero: l ? String(l.numero) : "1",
    titulo: l?.titulo ?? "",
    descripcion: l?.descripcion ?? "",
    contenido: l?.contenido ?? "",
    nivel: l?.nivel ?? "principiante",
    duracion_min: l?.duracion_min ? String(l.duracion_min) : "",
    acordes: l?.acordes ?? [],
    temas: l?.temas ?? [],
  };
}

interface CamposProps {
  register: UseFormRegister<EntradaLeccion>;
  control: Control<EntradaLeccion, unknown, DatosLeccion>;
  errors: FieldErrors<EntradaLeccion>;
}

function CamposLeccion({ register, control, errors }: CamposProps) {
  const bloques = useBloques();
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
        <Field etiqueta="Bloque" error={errors.bloque_id?.message}>
          {(c) => (
            <Select {...c} {...register("bloque_id")}>
              <option value="">Elige un bloque</option>
              {(bloques.data ?? []).map((b) => (
                <option key={b.id} value={b.id}>
                  {b.numero}. {b.titulo}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <CampoEntero
          registro={register("numero")}
          error={errors.numero?.message}
          etiqueta="Número"
          min={LIMITES.numeroLeccion.min}
          max={LIMITES.numeroLeccion.max}
        />
      </div>
      <CampoTitulo registro={register("titulo")} error={errors.titulo?.message} etiqueta="Título" />
      <CampoDescripcion registro={register("descripcion")} error={errors.descripcion?.message} />
      <Field
        etiqueta="Contenido"
        ayuda="Separa los párrafos con una línea en blanco."
        error={errors.contenido?.message}
      >
        {(c) => (
          <Textarea
            {...c}
            {...register("contenido")}
            rows={10}
            maxLength={LIMITES.contenidoLeccion.max}
            contador
          />
        )}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <CampoNivel registro={register("nivel")} error={errors.nivel?.message} />
        <CampoDuracion registro={register("duracion_min")} error={errors.duracion_min?.message} />
      </div>
      <Controller
        control={control}
        name="acordes"
        render={({ field }) => (
          <SelectorAcordes
            valor={field.value ?? []}
            onCambiar={field.onChange}
            error={errors.acordes?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="temas"
        render={({ field }) => (
          <ListaEditable
            etiqueta="Temas"
            singular="tema"
            elementos={field.value ?? []}
            onCambiar={field.onChange}
            maximo={LIMITES.maximoTemas}
            largoMaximo={LIMITES.tema.max}
            error={errors.temas?.message}
          />
        )}
      />
    </>
  );
}

/** Vista previa en vivo con el mismo componente que ve el estudiante (HU-F-305). */
function PreviaLeccion({ control }: { control: Control<EntradaLeccion, unknown, DatosLeccion> }) {
  const v = useWatch({ control });
  return (
    <ContenidoLeccion
      leccion={{
        titulo: v.titulo || "Título de la lección",
        nivel: v.nivel ?? "principiante",
        duracion_min: Number(v.duracion_min) || null,
        acordes: (v.acordes ?? []).filter((a): a is string => Boolean(a)),
        temas: (v.temas ?? []).filter((t): t is string => Boolean(t?.trim())),
        descripcion: v.descripcion || null,
        contenido: v.contenido || null,
      }}
    />
  );
}

export function FormularioLeccion({ inicial }: { inicial: LeccionDocente | null }) {
  const { formulario, editor, errorGeneral, guardar, publicar } = useFormularioContenido<
    EntradaLeccion,
    DatosLeccion
  >({
    tipo: "lecciones",
    id: inicial?.id ?? null,
    esquema: esquemaLeccion,
    valoresIniciales: valoresDe(inicial),
    campos: CAMPOS,
  });
  const { register, control, formState } = formulario;

  return (
    <MarcoEditor
      titulo={inicial ? "Editar lección" : "Nueva lección"}
      previa={<PreviaLeccion control={control} />}
      formulario={
        <form onSubmit={guardar} noValidate className="flex flex-col gap-5">
          <CamposLeccion register={register} control={control} errors={formState.errors} />
          <PieEditor
            editor={editor}
            estado={inicial?.estado ?? null}
            errorGeneral={errorGeneral}
            hayCambios={formState.isDirty}
            onPublicar={publicar}
          />
        </form>
      }
    />
  );
}
