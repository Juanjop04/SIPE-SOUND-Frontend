# HU-F-507 · Barra superior con perfil y menú lateral contraíble

| Campo | Valor |
|---|---|
| Fase | 5 · Experiencia y visualización |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-F-303, HU-F-403, HU-F-407 |
| Rama | `hu/HU-F-507-barra-superior-menu-contraible` |

## Historia
**Como** docente o administrador
**quiero** mi perfil y "Cerrar sesión" arriba a la derecha y un menú lateral que pueda contraer
**para** tener más espacio de trabajo y encontrar mi cuenta donde se espera.

## Contexto
- `PanelAtril` mezcla las secciones con el nombre, el tema y "Cerrar sesión" al pie del menú.
- El estudiante ya tiene su cuenta arriba a la derecha (`MenuCuenta`); el atril no.
- Corrección ya aplicada fuera de HU (2026-10-25): el modo "Tema del sistema" comparte una sola preferencia.

## Alcance
**Incluye**
1. **Barra superior del atril** (docente y admin), fija, con a la derecha: selector de tema,
   **campana/Mensajes** con el contador de HU-F-407 y el **menú de la cuenta** (nombre y rol;
   "Mi cuenta", "Ver como estudiante", "Cerrar sesión"). Reutiliza `MenuCuenta` en vez de duplicarlo.
2. **Se quitan del menú lateral** el nombre, el tema y "Cerrar sesión": queda solo la navegación.
3. **Menú lateral contraíble**:
   - Botón de contraer/expandir (lucide `PanelLeftClose` / `PanelLeftOpen`) arriba del menú y
     atajo de teclado `[`; `aria-expanded` y `aria-label` ("Contraer menú").
   - Contraído (≈ 64 px): solo íconos con `title` y tooltip al enfocar, y el contador de mensajes
     como punto con texto accesible. Expandido: 240 px como hoy.
   - **Se recuerda**: la preferencia se guarda en `localStorage` (clave `sipe-menu`) con
     `useSyncExternalStore` (como el tema) y se aplica **antes de pintar** (script de `index.html`
     o clase en `<html>`) para que no parpadee.
   - Debajo de 1024 px sigue el `Drawer` actual; la preferencia solo vale en escritorio.
4. Ícono y etiqueta por sección del atril (Resumen, Cursos, Progreso, Contenido, Evaluaciones,
   Mensajes y, en admin, Usuarios, Todos los cursos, Docentes) con la marca activa de 2 px.
5. El mismo patrón de barra superior y menú contraíble para el layout del estudiante (la barra
   lateral de HU-F-318 también se contrae y se recuerda).
6. Enmienda de 05 §5 (atril) y 04-consumo-api no cambia.

**No incluye**
- Cambiar las secciones ni sus rutas.

## Diseño
- **Composición**: barra superior de 56 px sobre el contenido; el menú lateral a su izquierda,
  con la marca arriba y el botón de contraer. La transición de ancho de 150 ms respeta
  `prefers-reduced-motion`.
- **Estados**: menú contraído/expandido, cuenta abierta/cerrada; sin sesión no aplica.

## Prompt de ejecución
```text
Ejecuta HU-F-507 en SIPE-SOUND-FULLSTACK. Agrega una barra superior al atril con tema, mensajes
y el menú de la cuenta (perfil, Mi cuenta, Ver como estudiante, Cerrar sesión) reutilizando
MenuCuenta, y quita esos elementos del menú lateral. Haz el menú lateral contraíble (íconos con
tooltip al contraer), con botón y atajo "[", y recuerda la elección en localStorage con
useSyncExternalStore y aplicándola antes de pintar. Mismo patrón en el layout del estudiante.
Antes de escribir JSX describe la composición y espera confirmación. Solo tokens. Sin pruebas
unitarias.
```

## Pasos
1. Almacén de la preferencia del menú (`src/shared/lib/menu.ts`) y aplicación previa al pintado.
2. Barra superior del atril con `MenuCuenta`.
3. Menú contraíble con íconos, tooltips y atajo.
4. Mismo patrón en el estudiante; documentos.

## Criterios de aceptación (Gherkin)
```gherkin
Escenario: Cuenta arriba a la derecha
  Dado que soy docente o administrador
  Entonces veo mi nombre y, al abrirlo, "Mi cuenta" y "Cerrar sesión" en la esquina superior derecha
  Y el menú lateral ya no los muestra

Escenario: Contraer
  Cuando pulso "Contraer menú"
  Entonces el menú muestra solo íconos y cada uno tiene su nombre al enfocarlo

Escenario: Se recuerda
  Dado que contraje el menú
  Cuando recargo la página o vuelvo otro día
  Entonces el menú sigue contraído desde el primer pintado, sin parpadeo

Escenario: Teclado
  Cuando pulso "[" fuera de un campo de texto
  Entonces el menú cambia entre contraído y expandido

Escenario: Móvil
  Dado un ancho de 375 px
  Entonces el menú sigue siendo un panel que se abre con el botón "Menú"
```

## Verificación manual
- Docente, admin y estudiante; teclado y lector de pantalla; capturas en 1280 px y 375 px.
- Con `prefers-reduced-motion`: sin transición.

## Definición de hecho específica
- [ ] No hay un segundo menú de cuenta: se reutiliza `MenuCuenta`.
- [ ] Revisé los anti-patrones de 05 §6: ninguno presente.
