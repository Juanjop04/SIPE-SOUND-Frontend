import { useState } from "react";
import { useForm, useWatch, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { VideoGuia, Button, Drawer, Field, Input, MensajeError, useAviso } from "@/shared/ui";
import {
  VIDEO_URL_MAX,
  type VideoGuiaDatos,
  enlaceDeVideo,
  extraerVideo,
  formatearInicio,
  leerInicio,
} from "@/shared/lib/youtube";
import { aplicarErroresServidor, inicioDeVideo, videoYoutube } from "@/shared/validacion";
import { acordesApi } from "../api/acordesApi.js";
import { acordesKeys } from "../api/keys.js";
import type { Acorde } from "../types";

const esquema = z.object({ video_url: videoYoutube(), video_inicio: inicioDeVideo() });
type Datos = z.output<typeof esquema>;

function CamposDeVideo({
  register,
  errors,
}: {
  register: UseFormRegister<Datos>;
  errors: FieldErrors<Datos>;
}) {
  return (
    <>
      <Field
        etiqueta="Video guía (opcional)"
        ayuda="Pega el enlace de un video de YouTube, por ejemplo https://youtu.be/…"
        error={errors.video_url?.message}
      >
        {(c) => (
          <Input
            {...c}
            {...register("video_url")}
            type="url"
            inputMode="url"
            maxLength={VIDEO_URL_MAX}
            autoComplete="off"
            spellCheck={false}
          />
        )}
      </Field>
      <Field etiqueta="Empieza en" ayuda="m:ss, opcional" error={errors.video_inicio?.message}>
        {(c) => (
          <Input
            {...c}
            {...register("video_inicio")}
            inputMode="numeric"
            maxLength={8}
            placeholder="0:42"
            autoComplete="off"
            className="w-32 font-mono"
          />
        )}
      </Field>
    </>
  );
}

function PreviaDeVideo({
  video,
  titulo,
  onQuitar,
}: {
  video: VideoGuiaDatos;
  titulo: string;
  onQuitar: () => void;
}) {
  return (
    <>
      <VideoGuia
        key={video.youtube_id + "-" + (video.inicio_seg ?? 0)}
        video={video}
        titulo={titulo}
      />
      <div>
        <Button variante="secundario" tamano="sm" onClick={onQuitar}>
          Quitar video
        </Button>
      </div>
    </>
  );
}

function Formulario({ acorde, onCerrar }: { acorde: Acorde; onCerrar: () => void }) {
  const queryClient = useQueryClient();
  const { avisar } = useAviso();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    control,
    setValue,
    formState: { errors },
  } = useForm<Datos>({
    resolver: zodResolver(esquema),
    mode: "onTouched",
    defaultValues: {
      video_url: acorde.video ? enlaceDeVideo(acorde.video.youtube_id) : "",
      video_inicio: acorde.video?.inicio_seg ? formatearInicio(acorde.video.inicio_seg) : "",
    },
  });

  const guardar = useMutation({
    mutationFn: (datos: Datos) =>
      datos.video_url === ""
        ? acordesApi.quitarVideo(acorde.id)
        : acordesApi.ponerVideo(acorde.id, {
            video_url: datos.video_url,
            video_inicio_seg: leerInicio(datos.video_inicio),
          }),
    onSuccess: ({ message }) => {
      void queryClient.invalidateQueries({ queryKey: acordesKeys.todos });
      avisar({ mensaje: message });
      onCerrar();
    },
    onError: (error) => setErrorGeneral(aplicarErroresServidor(error, setError, ["video_url"])),
  });

  function quitar() {
    setValue("video_url", "", { shouldDirty: true });
    setValue("video_inicio", "", { shouldDirty: true });
  }

  const url = useWatch({ control, name: "video_url" });
  const textoInicio = useWatch({ control, name: "video_inicio" });
  const extraido = extraerVideo(url);
  const inicio = leerInicio(textoInicio) ?? extraido?.inicioSeg ?? null;

  return (
    <form
      noValidate
      onSubmit={handleSubmit((datos) => {
        setErrorGeneral(null);
        guardar.mutate(datos);
      })}
      className="flex flex-col gap-4"
    >
      <CamposDeVideo register={register} errors={errors} />
      {extraido && (
        <PreviaDeVideo
          video={{ youtube_id: extraido.id, inicio_seg: inicio }}
          titulo={"Acorde " + acorde.nombre}
          onQuitar={quitar}
        />
      )}
      {errorGeneral && <MensajeError mensaje={errorGeneral} />}
      <div className="flex justify-end gap-3">
        <Button variante="fantasma" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" cargando={guardar.isPending}>
          {url === "" && acorde.video ? "Quitar video guía" : "Guardar video guía"}
        </Button>
      </div>
    </form>
  );
}

/** Administrador: poner, cambiar o quitar el video guía de un acorde (el catálogo es global). */
export function EditorVideoAcorde({
  acorde,
  onCerrar,
}: {
  /** null = cerrado. */
  acorde: Acorde | null;
  onCerrar: () => void;
}) {
  return (
    <Drawer
      abierto={acorde !== null}
      onCerrar={onCerrar}
      titulo={acorde ? `Video guía de ${acorde.nombre}` : "Video guía"}
    >
      {acorde && <Formulario acorde={acorde} onCerrar={onCerrar} />}
    </Drawer>
  );
}
