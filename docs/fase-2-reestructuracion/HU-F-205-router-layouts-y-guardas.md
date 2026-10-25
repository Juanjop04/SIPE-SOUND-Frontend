# HU-F-205 · Centralizar rutas, layouts y guardas de acceso

| Campo | Valor |
|---|---|
| Fase | 2 · Reestructuración |
| Prioridad | Must |
| Estimación | 3 puntos |
| Depende de | HU-F-204 |
| Rama | `hu/HU-F-205-router` |

## Historia
**Como** estudiante
**quiero** que al entrar a una página privada sin sesión me lleve al login y luego me regrese a donde iba
**para** no perder el hilo de lo que estaba practicando.

## Contexto
- `App.jsx` declara rutas con strings sueltos; cada página repite `<Header />` y `<div className="min-h-screen bg-ink">`.
- `Progreso` muestra un mensaje "Necesitas iniciar sesión" en lugar de redirigir; `QuizBloque` falla al enviar.
- Todas las páginas se cargan en el bundle inicial.

## Alcance
**Incluye**
- `app/router/paths.js` con constantes y constructores (`paths.leccion(id)`).
- `app/router/router.jsx` con `createBrowserRouter`, `lazy()` por página y `errorElement` propio (404).
- `app/layouts/PublicLayout.jsx` (Header + `<Outlet />`), `AuthLayout` como layout de `/login` y `/registro`.
- `RequireAuth` → redirige a `/login?volver=<ruta>`; Login respeta `volver` (solo rutas internas que empiezan por `/`).
- `RequireRole` creado pero aún sin uso (HU-F-303).
- Reemplazar strings de ruta por `paths` en todo el proyecto.

**No incluye**: cambiar URLs ni estilos.

## Prompt de ejecución
```text
Ejecuta HU-F-205 en SIPE-SOUND-FULLSTACK. Mantén exactamente las mismas URLs.
Valida el parámetro "volver" para evitar redirecciones abiertas (solo rutas
que empiecen por "/" y no por "//"). Cada página exporta default para lazy().
Quita <Header /> y el contenedor repetido de cada página: ahora vienen del layout.
```

## Criterios de aceptación
```gherkin
Escenario: Redirección con regreso
  Dado que no tengo sesión
  Cuando abro /progreso
  Entonces llego a /login?volver=/progreso
  Y tras iniciar sesión vuelvo a /progreso

Escenario: Redirección abierta bloqueada
  Cuando abro /login?volver=//sitio-malicioso.test
  Y inicio sesión
  Entonces llego a /

Escenario: División de código
  Cuando ejecuto npm run build
  Entonces cada página genera su propio chunk
```

## Verificación manual
```bash
npm run build   # revisar chunks por página en la salida
grep -rnE "to=\"/|navigate\(\"/" src | grep -v paths || echo "OK"
```

## Definición de hecho específica
- [ ] Ninguna página importa `Header`.
