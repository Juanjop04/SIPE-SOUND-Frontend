import { Fragment, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn.js";
import { ENLACE_EN_TEXTO } from "./enlace";

// Lector de Markdown mínimo y seguro (HU-F-510): construye elementos de React, nunca HTML, así que
// un texto con <script> o con "javascript:" no ejecuta nada. Admite títulos (#), listas (- y 1.),
// citas (>), separador (---), **negrita**, *cursiva*, `código` y [enlaces](https://…). Se lee a
// mano, carácter a carácter, para no depender de expresiones regulares con retroceso.

const PREFIJOS_SEGUROS = ["https://", "http://", "mailto:"];
const MAX_NIVEL = 4;

function esEnlaceSeguro(url: string): boolean {
  const minuscula = url.toLowerCase();
  return (
    PREFIJOS_SEGUROS.some((p) => minuscula.startsWith(p)) ||
    (url.startsWith("/") && !url.startsWith("//"))
  );
}

/** Texto con negrita, cursiva, código y enlaces como elementos de React. */
export function enLinea(texto: string, clave: string): ReactNode[] {
  const salida: ReactNode[] = [];
  let suelto = "";
  let i = 0;
  const soltar = () => {
    if (suelto) salida.push(<Fragment key={`${clave}-t${salida.length}`}>{suelto}</Fragment>);
    suelto = "";
  };
  const marcado = (delimitador: string): boolean => {
    const largo = delimitador.length;
    const fin = texto.indexOf(delimitador, i + largo);
    if (fin <= i + largo) return false;
    const dentro = texto.slice(i + largo, fin);
    soltar();
    const k = `${clave}-m${salida.length}`;
    if (delimitador === "**") salida.push(<strong key={k}>{dentro}</strong>);
    else if (delimitador === "*") salida.push(<em key={k}>{dentro}</em>);
    else {
      salida.push(
        <code key={k} className="rounded bg-surface px-1 font-mono text-sm text-paper">
          {dentro}
        </code>,
      );
    }
    i = fin + largo;
    return true;
  };
  const enlace = (): boolean => {
    const cierre = texto.indexOf("](", i);
    const fin = cierre === -1 ? -1 : texto.indexOf(")", cierre + 2);
    if (fin === -1) return false;
    const etiqueta = texto.slice(i + 1, cierre);
    const url = texto.slice(cierre + 2, fin);
    if (!etiqueta || etiqueta.includes("]") || /\s/.test(url) || !esEnlaceSeguro(url)) return false;
    soltar();
    const externo = !url.startsWith("/");
    salida.push(
      <a
        key={`${clave}-a${salida.length}`}
        href={url}
        className={ENLACE_EN_TEXTO}
        {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {etiqueta}
      </a>,
    );
    i = fin + 1;
    return true;
  };

  while (i < texto.length) {
    const c = texto[i];
    const consumido =
      (c === "*" && texto.startsWith("**", i) && marcado("**")) ||
      (c === "*" && marcado("*")) ||
      (c === "`" && marcado("`")) ||
      (c === "[" && enlace());
    if (!consumido) {
      suelto += c;
      i += 1;
    }
  }
  soltar();
  return salida;
}

type Bloque =
  | { tipo: "titulo"; nivel: number; texto: string }
  | { tipo: "parrafo"; texto: string }
  | { tipo: "lista"; ordenada: boolean; items: string[] }
  | { tipo: "cita"; texto: string }
  | { tipo: "separador" };

/** "## Sección" → { nivel: 2, texto: "Sección" }; otra cosa → null. */
function comoTitulo(linea: string): { nivel: number; texto: string } | null {
  let nivel = 0;
  while (linea[nivel] === "#") nivel += 1;
  if (nivel === 0 || nivel > MAX_NIVEL || linea[nivel] !== " ") return null;
  return { nivel, texto: linea.slice(nivel + 1).trim() };
}

/** "- uno" o "* uno" → viñeta; "1. uno" o "1) uno" → numerada; otra cosa → null. */
function comoItem(linea: string): { ordenada: boolean; texto: string } | null {
  if (linea.startsWith("- ") || linea.startsWith("* ")) {
    return { ordenada: false, texto: linea.slice(2).trim() };
  }
  let digitos = 0;
  while (digitos < linea.length && linea[digitos] >= "0" && linea[digitos] <= "9") digitos += 1;
  const cierre = linea[digitos];
  if (digitos > 0 && (cierre === "." || cierre === ")") && linea[digitos + 1] === " ") {
    return { ordenada: true, texto: linea.slice(digitos + 2).trim() };
  }
  return null;
}

const esSeparador = (linea: string) =>
  linea.length >= 3 && (linea.split("-").join("") === "" || linea.split("*").join("") === "");

interface ListaEnCurso {
  ordenada: boolean;
  items: string[];
}

/** Del texto a bloques: cada línea en blanco cierra el bloque en curso. */
export function aBloques(markdown: string): Bloque[] {
  const bloques: Bloque[] = [];
  const curso = { parrafo: [] as string[], lista: null as ListaEnCurso | null };
  const cerrar = () => {
    if (curso.parrafo.length > 0) bloques.push({ tipo: "parrafo", texto: curso.parrafo.join(" ") });
    if (curso.lista) bloques.push({ tipo: "lista", ...curso.lista });
    curso.parrafo = [];
    curso.lista = null;
  };
  for (const cruda of markdown.replaceAll("\r\n", "\n").split("\n")) {
    const linea = cruda.trim();
    const titulo = comoTitulo(linea);
    const item = comoItem(linea);
    if (linea === "") cerrar();
    else if (titulo) {
      cerrar();
      bloques.push({ tipo: "titulo", ...titulo });
    } else if (esSeparador(linea)) {
      cerrar();
      bloques.push({ tipo: "separador" });
    } else if (item) {
      if (curso.lista && curso.lista.ordenada !== item.ordenada) cerrar();
      curso.lista ??= { ordenada: item.ordenada, items: [] };
      curso.lista.items.push(item.texto);
    } else if (linea.startsWith(">")) {
      cerrar();
      bloques.push({ tipo: "cita", texto: linea.slice(1).trim() });
    } else {
      if (curso.lista) cerrar();
      curso.parrafo.push(linea);
    }
  }
  cerrar();
  return bloques;
}

const CLASE_TITULO: Record<number, string> = {
  1: "font-display text-3xl font-semibold text-paper",
  2: "mt-8 font-display text-xl font-semibold text-paper",
  3: "mt-6 font-display text-lg font-semibold text-paper",
  4: "mt-4 font-display text-base font-semibold text-paper",
};

export interface MarkdownProps {
  texto: string;
  /** Nivel del `#` (1 = h1). En una vista previa dentro de otra página se baja para no repetir h1. */
  nivelInicial?: 1 | 2 | 3;
  className?: string;
}

interface BloqueMarkdownProps {
  bloque: Bloque;
  clave: string;
  nivelInicial: number;
}

function BloqueMarkdown({ bloque, clave, nivelInicial }: BloqueMarkdownProps) {
  if (bloque.tipo === "titulo") {
    const Etiqueta = `h${Math.min(6, bloque.nivel + nivelInicial - 1)}` as "h1";
    return (
      <Etiqueta className={CLASE_TITULO[bloque.nivel]}>{enLinea(bloque.texto, clave)}</Etiqueta>
    );
  }
  if (bloque.tipo === "lista") {
    const Lista = bloque.ordenada ? "ol" : "ul";
    return (
      <Lista className={cn("mt-3 space-y-1 pl-6", bloque.ordenada ? "list-decimal" : "list-disc")}>
        {bloque.items.map((item, j) => (
          <li key={`${clave}-${j}`}>{enLinea(item, `${clave}-${j}`)}</li>
        ))}
      </Lista>
    );
  }
  if (bloque.tipo === "cita") {
    return (
      <blockquote className="mt-3 border-l-2 border-accent pl-4 text-paper">
        {enLinea(bloque.texto, clave)}
      </blockquote>
    );
  }
  if (bloque.tipo === "separador") return <hr className="my-6 border-linea" />;
  return <p className="mt-3">{enLinea(bloque.texto, clave)}</p>;
}

/** Texto en Markdown como lectura editorial: una columna ≤ 68 caracteres, sin HTML. */
export function Markdown({ texto, nivelInicial = 1, className }: MarkdownProps) {
  return (
    <div className={cn("max-w-[68ch] leading-relaxed text-muted", className)}>
      {aBloques(texto).map((bloque, i) => (
        // El texto no tiene ids: el orden de los bloques es estable para un mismo texto.
        <BloqueMarkdown key={`b${i}`} bloque={bloque} clave={`b${i}`} nivelInicial={nivelInicial} />
      ))}
    </div>
  );
}
