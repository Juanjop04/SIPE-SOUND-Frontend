import { useId, useState } from "react";
import { CampoNuevo, FilaLista } from "./FilaListaEditable";

export interface ListaEditableProps {
  /** "Temas", "Pasos"… también da nombre accesible a cada fila. */
  etiqueta: string;
  /** Singular para anunciar cambios: "tema", "paso". */
  singular: string;
  elementos: string[];
  onCambiar: (elementos: string[]) => void;
  /** Máximo de elementos (contrato 08 §2): "Agregar" se deshabilita y se explica por qué. */
  maximo: number;
  largoMaximo: number;
  /** Pasos: se ordenan con Subir/Bajar. */
  ordenable?: boolean;
  error?: string;
}

/** Lista de textos editable: agregar, editar, ordenar y quitar, todo con teclado. */
export function ListaEditable(props: ListaEditableProps) {
  const { etiqueta, singular, elementos, onCambiar, maximo, largoMaximo, ordenable, error } = props;
  const id = useId();
  const [nuevo, setNuevo] = useState("");
  const [anuncio, setAnuncio] = useState("");
  const lleno = elementos.length >= maximo;

  function agregar() {
    const texto = nuevo.trim();
    if (!texto || lleno) return;
    onCambiar([...elementos, texto]);
    setNuevo("");
    setAnuncio(`${singular} agregado en la posición ${elementos.length + 1}.`);
  }

  function mover(indice: number, direccion: -1 | 1) {
    const copia = [...elementos];
    [copia[indice], copia[indice + direccion]] = [copia[indice + direccion], copia[indice]];
    onCambiar(copia);
    setAnuncio(`${singular} ${indice + 1} movido a la posición ${indice + direccion + 1}.`);
  }

  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined} className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-medium text-paper">
        {etiqueta}{" "}
        <span className="font-mono text-xs text-muted">
          {elementos.length}/{maximo}
        </span>
      </legend>
      <ol className="flex flex-col gap-2">
        {elementos.map((elemento, i) => (
          // La posición es la identidad del elemento mientras se edita la lista.
          <FilaLista
            key={`${id}-${i}`}
            indice={i}
            total={elementos.length}
            valor={elemento}
            singular={singular}
            largoMaximo={largoMaximo}
            ordenable={Boolean(ordenable)}
            onEditar={(valor) => onCambiar(elementos.map((v, j) => (j === i ? valor : v)))}
            onMover={(direccion) => mover(i, direccion)}
            onQuitar={() => {
              onCambiar(elementos.filter((_, j) => j !== i));
              setAnuncio(`${singular} ${i + 1} quitado.`);
            }}
          />
        ))}
      </ol>
      <CampoNuevo
        singular={singular}
        valor={nuevo}
        largoMaximo={largoMaximo}
        lleno={lleno}
        onCambiar={setNuevo}
        onAgregar={agregar}
      />
      {lleno && <p className="pl-8 text-xs text-muted">Llegaste al máximo de {maximo}.</p>}
      {error && (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
      <p aria-live="polite" className="sr-only">
        {anuncio}
      </p>
    </fieldset>
  );
}
