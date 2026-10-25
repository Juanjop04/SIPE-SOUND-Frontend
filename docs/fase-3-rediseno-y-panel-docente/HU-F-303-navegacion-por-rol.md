# HU-F-303 · Navegación y layouts por rol (estudiante y docente)

| Campo | Valor |
|---|---|
| Fase | 3 · Rediseño |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-F-302, **HU-B-304** (`GET /me`) |
| Rama | `hu/HU-F-303-navegacion-rol` |

## Historia
**Como** docente
**quiero** entrar directamente a mi atril de trabajo y poder ver la app como la ven mis estudiantes
**para** gestionar mis cursos sin mezclar herramientas con el contenido del estudiante.

## Diseño
- **EstudianteLayout**: barra superior delgada (56 px) con logo + "SIPE-SOUND" en `font-display`, navegación de texto (Ruta · Acordes · Ejercicios · Mi progreso), menú de cuenta a la derecha. Debajo, un `TrasteDivider` en lugar de sombra. En móvil, la navegación pasa a una barra inferior fija con 4 destinos (texto + ícono lucide de línea).
- **DocenteLayout ("Atril")**: barra lateral `ink-2` de 240 px con Resumen · Cursos · Contenido · Evaluaciones; al pie, "Ver como estudiante" y la cuenta. Contenido sobre `ink`. En móvil, la barra lateral es un `Drawer`.
- Selección actual: texto `paper` + marca `accent` de 2 px a la izquierda (no fondo relleno).

## Alcance
**Incluye**
- `features/auth/api/authService` + hook `usePerfil()` (`GET /me`, `staleTime` 10 min) expuesto desde `AuthProvider` (`rol`).
- `RequireRole roles={["docente","admin"]}` activo sobre `/docente/*`.
- Redirección tras login: docente → `/docente`, estudiante → `/`.
- `paths.docente.*`.
- Página `SinPermisoPage` (403) y `NoEncontradoPage` (404) con la voz del sistema de diseño.

**No incluye**: contenido de las páginas docentes (HU-F-307 en adelante).

## Prompt de ejecución
```text
Ejecuta HU-F-303 en SIPE-SOUND-FULLSTACK. El rol SIEMPRE viene de GET /api/v1/me,
nunca de user_metadata. Describe primero la composición de ambos layouts en
viñetas y espera confirmación. Usa solo componentes de shared/ui y shared/music.
```

## Criterios de aceptación
```gherkin
Escenario: Docente entra a su atril
  Dado un usuario con rol docente
  Cuando inicia sesión
  Entonces llega a /docente con la barra lateral visible

Escenario: Estudiante no accede al atril
  Dado un estudiante
  Cuando abre /docente/cursos
  Entonces ve la página "No tienes acceso a esta sección"

Escenario: Navegación móvil del estudiante
  Dado un ancho de 375 px
  Entonces la navegación principal está en una barra inferior fija con 4 destinos
```

## Verificación manual
Iniciar sesión con un estudiante y un docente; recorrer en 1280 px y 375 px; navegación completa con teclado.

## Definición de hecho específica
- [ ] Revisión de anti-patrones declarada en el PR.
