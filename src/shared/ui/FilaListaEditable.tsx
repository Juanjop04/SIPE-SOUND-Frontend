import type { KeyboardEvent } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";

// Piezas de ListaEditable: una fila editable y el campo para agregar.

interface FilaListaProps {
  indice: number;
  total: number;
  valor: string;
  singular: string;
  largoMaximo: number;
  ordenable: boolean;
  onEditar: (valor: string) => void;
  onMover: (direccion: -1 | 1) => void;
  onQuitar: () => void;
}

export function FilaLista(props: FilaListaProps) {
  const { indice, total, valor, singular, largoMaximo, ordenable, onEditar, onMover, onQuitar } =
    props;
  const nombre = `${singular} ${indice + 1}`;
  return (
    <li className="flex items-center gap-2">
      <span className="w-6 font-mono text-xs text-muted">
        {String(indice + 1).padStart(2, "0")}
      </span>
      <Input
        aria-label={nombre}
        value={valor}
        maxLength={largoMaximo}
        onChange={(e) => onEditar(e.target.value)}
      />
      {ordenable && (
        <>
          <Button
            variante="fantasma"
            tamano="sm"
            aria-label={`Subir ${nombre}`}
            disabled={indice === 0}
            onClick={() => onMover(-1)}
          >
            <ArrowUp size={16} aria-hidden="true" />
          </Button>
          <Button
            variante="fantasma"
            tamano="sm"
            aria-label={`Bajar ${nombre}`}
            disabled={indice === total - 1}
            onClick={() => onMover(1)}
          >
            <ArrowDown size={16} aria-hidden="true" />
          </Button>
        </>
      )}
      <Button variante="fantasma" tamano="sm" aria-label={`Quitar ${nombre}`} onClick={onQuitar}>
        <X size={16} aria-hidden="true" />
      </Button>
    </li>
  );
}

interface CampoNuevoProps {
  singular: string;
  valor: string;
  largoMaximo: number;
  lleno: boolean;
  onCambiar: (valor: string) => void;
  onAgregar: () => void;
}

/** Campo para agregar (Enter o botón); deshabilitado al llegar al máximo. */
export function CampoNuevo({
  singular,
  valor,
  largoMaximo,
  lleno,
  onCambiar,
  onAgregar,
}: CampoNuevoProps) {
  function alTeclear(evento: KeyboardEvent<HTMLInputElement>) {
    if (evento.key !== "Enter") return;
    evento.preventDefault();
    onAgregar();
  }
  return (
    <div className="flex items-center gap-2 pl-8">
      <Input
        aria-label={`Nuevo ${singular}`}
        value={valor}
        maxLength={largoMaximo}
        disabled={lleno}
        onChange={(e) => onCambiar(e.target.value)}
        onKeyDown={alTeclear}
        placeholder={lleno ? "" : `Escribe un ${singular} y pulsa Enter`}
      />
      <Button
        variante="secundario"
        tamano="sm"
        disabled={lleno || !valor.trim()}
        onClick={onAgregar}
      >
        <Plus size={16} aria-hidden="true" />
        Agregar
      </Button>
    </div>
  );
}
