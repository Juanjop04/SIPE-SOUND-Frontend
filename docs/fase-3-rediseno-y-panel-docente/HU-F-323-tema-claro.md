# HU-F-323 · Ofrecer un tema claro con la paleta institucional

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Should |
| Estimación | 5 puntos |
| Depende de | HU-F-320, HU-F-322 |
| Rama | `hu/HU-F-323-tema-claro` |

## Historia
**Como** estudiante o docente que usa la plataforma de día o en un aula con mucha luz
**quiero** elegir entre un tema claro y uno oscuro (o que siga al de mi dispositivo)
**para** leer cómodo en cualquier entorno.

## Contexto
El equipo compartió la paleta institucional clara (2026-10-23): morado `#211B50` (menú lateral),
blanco `#FFFFFF` (tarjetas), lavanda `#F3F1FF` (fondos), violeta `#5B3DEB` (botones), lavanda
`#C9C1FF` (íconos), azul violáceo `#334078` (textos) y verde `#19B981` (logros). Se decidió ofrecerla
como **tema opcional**; el oscuro (HU-F-320) se mantiene.

Ajustes AA sobre la paleta propuesta:

| Propuesta | Problema | Ajuste |
|---|---|---|
| Verde `#19B981` para logros | Como texto sobre blanco: 2.53:1 | `success` `#08714D` (≥ 4.82); `#19B981`-`#0E8A5F` solo en el degradado de barras |
| Violeta `#5B3DEB` como texto | 5.07 sobre las filas lavanda (cumple) | Texto violeta `#4A2DD4` (≥ 6.41) para más margen; botones `#5B3DEB` con texto blanco (6.34) |
| Lavanda `#C9C1FF` para gráficos | 1.34:1 frente a la pista | Solo como texto secundario sobre el menú morado (9.39) |

## Alcance
**Incluye**
- `tokens.css`: el tema oscuro sigue en `:root`; el claro en `:root[data-tema="claro"]`, con
  `color-scheme` para que los controles nativos (selects, barras de desplazamiento) sigan el tema.
- Tokens semánticos nuevos para que ningún componente dependa de que el fondo sea oscuro:
  `sobre-primary` (texto de botón), `relleno-inicio/fin` y `logro-inicio/fin` (degradado de
  `Cuerda` y `Boca`), `barra`, `barra-texto`, `barra-texto-2`, `barra-hover` (menú lateral) y
  `sombra`.
- Menú lateral del estudiante y del atril en `barra` (morado institucional en el tema claro).
  `PanelAtril` tiene un modo `enBarra`: en el Drawer móvil usa los colores normales de superficie.
- `SelectorTema` (`shared/ui`): Sistema · Claro · Oscuro con `aria-pressed`. Está en la barra
  superior del estudiante, en el panel del atril y en las páginas de acceso. Guarda la elección en
  `localStorage` (`sipe-tema`); con "Sistema" sigue los cambios del dispositivo.
- `index.html`: script mínimo que aplica el tema antes de pintar (sin destello del tema contrario).

**No incluye**: un tema por curso o por institución.

## Contraste del tema claro (WCAG 2.2 AA)

| Combinación | `ink` #F3F1FF | `ink-2` #E7E3FB | `surface` #FFFFFF |
|---|---|---|---|
| `paper` #211B50 | 14.09 | 12.55 | 15.70 |
| `muted` #4F5880 | 6.20 | 5.52 | 6.91 |
| `accent` #4C33C9 (enlaces, foco) | 7.18 | 6.39 | 8.00 |
| `primary-claro` #4A2DD4 | 7.20 | 6.41 | 8.02 |
| `success` #08714D | 5.41 | 4.82 | 6.04 |
| `danger` #B82B36 | 5.48 | 4.88 | 6.11 |
| `linea-fuerte` #7B75A8 (controles) | 3.80 | 3.39 | 4.24 |

Botón primario: blanco sobre `#5B3DEB` 6.34 (hover `#4A2DD4` 8.02). Menú lateral `#211B50`: blanco
15.70, lavanda 9.39. Degradado de barras frente a la pista `ink-2`: violeta 5.07 → 3.83, verde
3.48 → 4.82. Cuerda que suena `#A86C05`: 3.91.

## Criterios de aceptación
```gherkin
Escenario: Sigue al dispositivo
  Dado que no elegí tema y mi dispositivo está en modo claro
  Cuando abro SIPE-SOUND
  Entonces veo el tema claro sin un destello del oscuro

Escenario: Elegir tema
  Cuando pulso "Tema oscuro"
  Entonces la página cambia al instante y al volver sigue en oscuro

Escenario: Sin regresiones de contraste
  Entonces todas las combinaciones de la tabla cumplen 4.5:1 en texto y 3:1 en componentes
```

## Verificación manual
Inicio, ruta, lección, evaluación, *Mi progreso*, acceso y atril en ambos temas, a 1280 y 375 px;
cambio de preferencia del sistema con la página abierta.
