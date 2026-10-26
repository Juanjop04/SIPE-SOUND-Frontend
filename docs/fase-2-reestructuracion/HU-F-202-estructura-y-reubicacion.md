# HU-F-202 · Crear la estructura por features y reubicar los archivos existentes

| Campo | Valor |
|---|---|
| Fase | 2 · Reestructuración |
| Prioridad | Must |
| Estimación | 5 puntos |
| Depende de | HU-F-201 |
| Rama | `hu/HU-F-202-estructura` |

## Historia
**Como** desarrollador que construirá el panel docente
**quiero** que cada archivo viva en la feature a la que pertenece
**para** encontrar y modificar código sin recorrer carpetas genéricas como `pages/` y `components/`.

## Mapa de reubicación

| Origen | Destino | Notas |
|---|---|---|
| `src/App.jsx` | `src/app/App.jsx` | |
| `src/index.css` | `src/styles/index.css` | |
| `src/assets/logo.png` | `src/assets/brand/logo.png` | |
| `src/lib/utils.js` | `src/shared/lib/cn.js` | Export `cn` sin cambios. |
| `src/lib/supabaseClient.js` (createClient) | `src/shared/lib/supabase.js` | Solo `supabase`. |
| `src/lib/supabaseClient.js` (`registrarUsuario`, `iniciarSesion`, `cerrarSesion`) | `src/features/auth/api/authService.js` | |
| `src/lib/api.js` → `obtenerLecciones`, `obtenerLeccion` | `src/features/lecciones/api/leccionesApi.js` | Se reescribe sobre `httpClient` en HU-F-203. |
| `src/lib/api.js` → `obtenerAcordes` | `src/features/acordes/api/acordesApi.js` | |
| `src/lib/api.js` → `obtenerEjercicios` | `src/features/ejercicios/api/ejerciciosApi.js` | |
| `src/lib/api.js` → `obtenerBloques` | `src/features/ruta/api/rutaApi.js` | |
| `src/lib/api.js` → `obtenerQuiz`, `verificarQuiz` | `src/features/evaluaciones/api/evaluacionesApi.js` | |
| `src/lib/api.js` → `obtenerProgreso`, `guardarProgreso` | `src/features/progreso/api/progresoApi.js` | |
| `src/lib/api.js` → `obtenerToken` | `src/shared/api/obtenerToken.js` | Temporal hasta HU-F-203. |
| `src/components/ui/button.jsx` | `src/shared/ui/Button.jsx` | PascalCase. |
| `src/components/ui/card.jsx` | `src/shared/ui/Card.jsx` | |
| `src/components/ui/input.jsx` | `src/shared/ui/Input.jsx` | |
| `src/components/ChordDiagram.jsx` | `src/shared/music/ChordDiagram.jsx` | Lo usan acordes y lecciones. |
| `src/components/AuthLayout.jsx` → `Fretboard` | `src/shared/music/Fretboard.jsx` | Extraer con sus constantes. |
| `src/components/AuthLayout.jsx` → layout | `src/app/layouts/AuthLayout.jsx` | Importa `Fretboard`. |
| `src/components/Header.jsx` | `src/app/layouts/components/Header.jsx` | |
| `src/pages/Home.jsx` | `src/features/ruta/pages/RutaPage.jsx` | |
| `src/pages/Login.jsx` | `src/features/auth/pages/LoginPage.jsx` | `IconoOjo` → `features/auth/components/IconoOjo.jsx`; `traducirError` → `features/auth/utils/traducirErrorAuth.js`. |
| `src/pages/Registro.jsx` | `src/features/auth/pages/RegistroPage.jsx` | Reutilizar `IconoOjo` y `traducirErrorAuth` si están duplicados. |
| `src/pages/LeccionDetalle.jsx` | `src/features/lecciones/pages/LeccionDetallePage.jsx` | |
| `src/pages/Acordes.jsx` | `src/features/acordes/pages/AcordesPage.jsx` | |
| `src/pages/Ejercicios.jsx` | `src/features/ejercicios/pages/EjerciciosPage.jsx` | |
| `src/pages/Progreso.jsx` | `src/features/progreso/pages/ProgresoPage.jsx` | |
| `src/pages/QuizBloque.jsx` | `src/features/evaluaciones/pages/QuizBloquePage.jsx` | |
| — | `src/features/*/index.js` | Exporta páginas y lo público de cada feature. |
| `src/lib/`, `src/components/`, `src/pages/` | **eliminadas** | |

## Alcance
**Incluye** el mapa completo, `index.js` por feature y actualización de imports a `@/`.
**No incluye** cambios de lógica, estilos ni rutas (las URLs siguen iguales).

## Prompt de ejecución
```text
Ejecuta HU-F-202 en SIPE-SOUND-FULLSTACK siguiendo el "Mapa de reubicación"
al pie de la letra.
- Usa `git mv` para archivos que se mueven completos (conserva historial).
- Cuando un archivo se divide, crea los nuevos y elimina el original en el mismo commit.
- Actualiza todos los imports a alias "@/". Entre features, importa solo desde index.js.
- Si Login y Registro duplican IconoOjo o traducirError, deja una sola copia.
- No cambies clases CSS, textos, lógica ni rutas. Capturas antes/después en el PR.
```

## Pasos
1. Capturas de todas las pantallas (antes).
2. Crear carpetas.
3. Mover en este orden con un commit por grupo: `shared/lib` → `shared/ui` → `shared/music` → `app/layouts` → una feature por commit.
4. Crear `index.js` por feature.
5. Eliminar carpetas antiguas.
6. `npm run lint && npm run build`; capturas (después).

## Criterios de aceptación
```gherkin
Escenario: Estructura limpia
  Cuando listo src/
  Entonces solo existen app/, features/, shared/, assets/, styles/ y main.jsx

Escenario: Sin regresiones
  Cuando recorro todas las rutas de la aplicación
  Entonces se ven y funcionan exactamente igual

Escenario: Fronteras respetadas
  Cuando ejecuto npm run lint
  Entonces no hay errores de no-restricted-imports
```

## Verificación manual
```bash
ls src
grep -rn "from \"\.\./\.\./" src || echo "sin imports relativos profundos"
npm run lint && npm run build
```

## Definición de hecho específica
- [ ] `git log --follow` conserva la historia de los archivos movidos.
