import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { EncabezadoEjercicio, PasosEjercicio } from "@/features/ejercicios";
import { useLecciones } from "@/features/lecciones";
import { TrasteDivider } from "@/shared/music";
import { Field, ListaEditable, Select, VideoGuia } from "@/shared/ui";
import { LIMITES } from "@/shared/validacion";
import { COMPASES, esquemaEjercicio, type DatosEjercicio, type EntradaEjercicio } from "../schemas";
import type { EjercicioDocente } from "../tipos";
import { useFormularioContenido } from "../useFormularioContenido";
import {
  CampoDescripcion,
  CampoDuracion,
  CampoEntero,
  CampoNivel,
  CampoTitulo,
} from "./CamposComunes";
import { CampoVideo, valoresDeVideo, videoDeCampos } from "./CampoVideo";
import { textoDeAutoria } from "../externos";
import { MarcoEditor } from "./MarcoEditor";
import { PieEditor } from "./PieEditor";
import { SelectorAcordes } from "./SelectorAcordes";

const CAMPOS = [
  "leccion_id",
  "nombre",
  "descripcion",
  "nivel",
  "bpm_recomendado",
  "compas",
  "duracion_min",
  "acordes",
  "pasos",
  "video_url",
  "video_inicio",
] as const;
const BPM_INICIAL = 60;

function valoresDe(e: EjercicioDocente | null): EntradaEjercicio {
  return {
    leccion_id: e?.leccion_id ? String(e.leccion_id) : "",
    nombre: e?.nombre ?? "",
    descripcion: e?.descripcion ?? "",
    nivel: e?.nivel ?? "principiante",
    bpm_recomendado: String(e?.bpm_recomendado ?? BPM_INICIAL),
    compas: (e?.compas as EntradaEjercicio["compas"]) ?? "4/4",
    duracion_min: e?.duracion_min ? String(e.duracion_min) : "",
    acordes: e?.acordes ?? [],
    pasos: e?.pasos ?? [],
    ...valoresDeVideo(e?.video),
  };
}

interface CamposProps {
  register: UseFormRegister<EntradaEjercicio>;
  control: Control<EntradaEjercicio, unknown, DatosEjercicio>;
  errors: FieldErrors<EntradaEjercicio>;
  setValue: UseFormSetValue<EntradaEjercicio>;
}

/** El título de la vista previa del video es el del ejercicio que se está escribiendo. */
function VideoDeEjercicio({ register, control, errors, setValue }: CamposProps) {
  const titulo = useWatch({ control, name: "nombre" });
  return (
    <CampoVideo
      register={register}
      control={control}
      errors={errors}
      setValue={setValue}
      titulo={titulo}
    />
  );
}

function CamposEjercicio({ register, control, errors, setValue }: CamposProps) {
  // Lecciones publicadas del catálogo (las del estudiante): a ellas se asocia el ejercicio.
  const lecciones = useLecciones();
  return (
    <>
      <Field etiqueta="Lección (opcional)" error={errors.leccion_id?.message}>
        {(c) => (
          <Select {...c} {...register("leccion_id")}>
            <option value="">Sin lección</option>
            {(lecciones.data ?? []).map((l) => (
              <option key={l.id} value={l.id}>
                {String(l.numero).padStart(2, "0")}. {l.titulo}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <CampoTitulo registro={register("nombre")} error={errors.nombre?.message} etiqueta="Nombre" />
      <CampoDescripcion registro={register("descripcion")} error={errors.descripcion?.message} />
      <div className="grid gap-5 sm:grid-cols-2">
        <CampoNivel registro={register("nivel")} error={errors.nivel?.message} />
        <CampoDuracion registro={register("duracion_min")} error={errors.duracion_min?.message} />
        <CampoEntero
          registro={register("bpm_recomendado")}
          error={errors.bpm_recomendado?.message}
          etiqueta="BPM recomendado"
          min={LIMITES.bpm.min}
          max={LIMITES.bpm.max}
        />
        <Field etiqueta="Compás" error={errors.compas?.message}>
          {(c) => (
            <Select {...c} {...register("compas")}>
              {COMPASES.map((compas) => (
                <option key={compas} value={compas}>
                  {compas}
                </option>
              ))}
            </Select>
          )}
        </Field>
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
        name="pasos"
        render={({ field }) => (
          <ListaEditable
            etiqueta="Pasos"
            singular="paso"
            ordenable
            elementos={field.value ?? []}
            onCambiar={field.onChange}
            maximo={LIMITES.maximoPasos}
            largoMaximo={LIMITES.paso.max}
            error={errors.pasos?.message}
          />
        )}
      />
      <VideoDeEjercicio register={register} control={control} errors={errors} setValue={setValue} />
    </>
  );
}

/** Vista previa en vivo con los mismos componentes que ve el estudiante (HU-F-305). */
function PreviaEjercicio({
  control,
}: {
  control: Control<EntradaEjercicio, unknown, DatosEjercicio>;
}) {
  const v = useWatch({ control });
  const video = videoDeCampos(v.video_url, v.video_inicio);
  return (
    <>
      <EncabezadoEjercicio
        ejercicio={{
          nombre: v.nombre || "Nombre del ejercicio",
          nivel: v.nivel ?? "principiante",
          bpm_recomendado: Number(v.bpm_recomendado) || null,
          compas: v.compas ?? "4/4",
          duracion_min: Number(v.duracion_min) || null,
          acordes: (v.acordes ?? []).filter((a): a is string => Boolean(a)),
          descripcion: v.descripcion || null,
        }}
      />
      <TrasteDivider className="my-6" />
      {video && <VideoGuia video={video} titulo={v.nombre || "Video guía"} className="mb-6" />}
      <PasosEjercicio pasos={(v.pasos ?? []).filter((p): p is string => Boolean(p?.trim()))} />
    </>
  );
}

export function FormularioEjercicio({ inicial }: { inicial: EjercicioDocente | null }) {
  const { formulario, editor, errorGeneral, guardar, publicar } = useFormularioContenido<
    EntradaEjercicio,
    DatosEjercicio
  >({
    tipo: "ejercicios",
    id: inicial?.id ?? null,
    esquema: esquemaEjercicio,
    valoresIniciales: valoresDe(inicial),
    campos: CAMPOS,
  });
  const { register, control, formState, setValue } = formulario;

  return (
    <MarcoEditor
      titulo={inicial ? "Editar ejercicio" : "Nuevo ejercicio"}
      autoria={
        inicial
          ? textoDeAutoria({
              autor: inicial.autor ?? null,
              modificado_por: inicial.modificado_por ?? null,
              actualizado_en: inicial.actualizado_en,
            })
          : undefined
      }
      previa={<PreviaEjercicio control={control} />}
      formulario={
        <form onSubmit={guardar} noValidate className="flex flex-col gap-5">
          <CamposEjercicio
            register={register}
            control={control}
            errors={formState.errors}
            setValue={setValue}
          />
          <PieEditor
            editor={editor}
            estado={inicial?.estado ?? null}
            errorGeneral={errorGeneral}
            hayCambios={formState.isDirty}
            onPublicar={publicar}
            autorId={inicial?.autor_id}
          />
        </form>
      }
    />
  );
}
