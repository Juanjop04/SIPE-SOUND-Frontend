import {
  useWatch,
  type Control,
  type FieldErrors,
  type Path,
  type PathValue,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { enlaceDeVideo, extraerVideo, formatearInicio, leerInicio } from "@/shared/lib/youtube";
import { Button, Field, Input, VideoGuia } from "@/shared/ui";
import { VIDEO_URL_MAX } from "@/shared/lib/youtube";
import type { VideoGuiaDatos } from "@/shared/lib/youtube";

/** Lo mínimo que debe tener un formulario para llevar un video guía. */
export interface CamposDeVideo {
  video_url: string;
  video_inicio: string;
}

/** Valores del formulario para un video ya guardado (la API solo guarda el id y el inicio). */
export function valoresDeVideo(video: VideoGuiaDatos | null | undefined): CamposDeVideo {
  return {
    video_url: video ? enlaceDeVideo(video.youtube_id) : "",
    video_inicio: video?.inicio_seg ? formatearInicio(video.inicio_seg) : "",
  };
}

/** El video que muestra la vista previa: el del enlace y su inicio (el campo manda sobre el `t=`). */
export function videoDeCampos(
  url: string | undefined,
  inicio: string | undefined,
): VideoGuiaDatos | null {
  const extraido = extraerVideo(url ?? "");
  if (!extraido) return null;
  return {
    youtube_id: extraido.id,
    inicio_seg: leerInicio(inicio ?? "") ?? extraido.inicioSeg,
  };
}

interface CampoVideoProps<T extends CamposDeVideo> {
  register: UseFormRegister<T>;
  // El formulario transforma sus valores al validar (video_inicio no llega a la API): TTransformedValues no importa aquí.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any, any>;
  errors: FieldErrors<T>;
  setValue: UseFormSetValue<T>;
  /** Nombre del contenido: titula la vista previa. */
  titulo: string;
}

/** "Video guía (opcional)": enlace de YouTube, inicio opcional, vista previa con fachada y "Quitar video". */
export function CampoVideo<T extends CamposDeVideo>({
  register,
  control,
  errors,
  setValue,
  titulo,
}: CampoVideoProps<T>) {
  const url = useWatch({ control, name: "video_url" as Path<T> }) as string | undefined;
  const inicio = useWatch({ control, name: "video_inicio" as Path<T> }) as string | undefined;
  const mensajes = errors as FieldErrors<CamposDeVideo>;
  const video = videoDeCampos(url, inicio);

  function quitar() {
    for (const campo of ["video_url", "video_inicio"] as const) {
      setValue(campo as Path<T>, "" as PathValue<T, Path<T>>, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-5 sm:grid-cols-[1fr_9rem]">
        <Field
          etiqueta="Video guía (opcional)"
          ayuda="Pega el enlace de un video de YouTube, por ejemplo https://youtu.be/…"
          error={mensajes.video_url?.message}
        >
          {(c) => (
            <Input
              {...c}
              {...register("video_url" as Path<T>)}
              type="url"
              inputMode="url"
              maxLength={VIDEO_URL_MAX}
              autoComplete="off"
              spellCheck={false}
            />
          )}
        </Field>
        <Field etiqueta="Empieza en" ayuda="m:ss, opcional" error={mensajes.video_inicio?.message}>
          {(c) => (
            <Input
              {...c}
              {...register("video_inicio" as Path<T>)}
              inputMode="numeric"
              maxLength={8}
              placeholder="0:42"
              autoComplete="off"
              className="font-mono"
            />
          )}
        </Field>
      </div>
      {video && (
        <div className="flex flex-col gap-3">
          <VideoGuia
            key={`${video.youtube_id}-${video.inicio_seg ?? 0}`}
            video={video}
            titulo={titulo || "Video guía"}
          />
          <div>
            <Button variante="secundario" tamano="sm" onClick={quitar}>
              Quitar video
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
