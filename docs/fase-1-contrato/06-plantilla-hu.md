# 06 · Plantilla de Historia de Usuario (HU-prompt)

Cada HU es a la vez **historia de usuario** y **prompt ejecutable** por un agente.

- Identificador: `HU-F-<fase><consecutivo>` → `HU-F-309`.
- Archivo: `docs/<carpeta-fase>/HU-F-309-titulo-corto.md`.
- Estimación Fibonacci (1, 2, 3, 5, 8). Si es > 8, se divide.
- Si la HU consume un endpoint, nombra la **HU de backend** que lo provee.

---

````markdown
# HU-F-XXX · <Título en infinitivo>

| Campo | Valor |
|---|---|
| Fase | 2 · Reestructuración / 3 · Rediseño |
| Prioridad | Must · Should · Could |
| Estimación | N puntos |
| Depende de | HU-F-YYY, HU-B-ZZZ |
| Rama | `hu/HU-F-XXX-<slug>` |

## Historia
**Como** <rol> **quiero** <capacidad> **para** <beneficio>.

## Contexto
<Estado actual con rutas reales de archivos.>

## Alcance
**Incluye** / **No incluye**

## Diseño (solo HU visuales)
- Composición (escritorio / móvil)
- Metáfora del sistema de diseño usada
- Estados: carga, vacío, error, éxito

## Prompt de ejecución
```text
<Instrucción autocontenida.>
```

## Pasos
## Criterios de aceptación (Gherkin)
## Verificación manual
## Definición de hecho específica
````

---

## Buenas prácticas

- **INVEST** y criterios observables (lo que ve o hace el usuario).
- Las HU visuales describen la composición con palabras; **no** adjuntan mockups generados por IA como referencia obligatoria (empujan hacia lo genérico).
- Cada HU visual incluye los cuatro estados: carga, vacío, error y éxito.
