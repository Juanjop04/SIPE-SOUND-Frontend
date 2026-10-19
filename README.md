# GuitarApp 🎸

App web para aprender guitarra de forma progresiva: lecciones, acordes, ejercicios prácticos y partituras.

## Stack

- **Frontend:** HTML + CSS + JavaScript vanilla
- **Backend:** Python (Flask)
- **Base de datos:** Supabase (Postgres) — incluye autenticación

## Estructura del proyecto

```
guitarapp/
├── backend/              → Servidor Flask (API)
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
├── database/
│   └── schema.sql        → Script SQL para crear todas las tablas en Supabase
├── frontend/
│   ├── index.html         → Dashboard con lista de lecciones
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── supabaseClient.js  → Login/registro (habla directo con Supabase)
│   │   └── api.js             → Consultas de datos (habla con el backend Flask)
│   └── pages/
│       └── login.html
└── .gitignore
```

## Cómo levantar el proyecto (primera vez)

### 1. Base de datos (Supabase)
1. Crea un proyecto en https://supabase.com
2. Ve a **SQL Editor** y ejecuta el contenido de `database/schema.sql`
3. Ve a **Settings → API** y copia tu `Project URL` y `anon public key`

### 2. Backend (Flask)
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux

pip install -r requirements.txt
cp .env.example .env           # y pega ahí tus credenciales de Supabase
python app.py
```
El backend queda corriendo en `http://localhost:5000`

### 3. Frontend
1. Abre `frontend/js/supabaseClient.js` y pega tu `SUPABASE_URL` y `SUPABASE_ANON_KEY`
2. Abre `frontend/index.html` con la extensión **Live Server** de VS Code (clic derecho → "Open with Live Server")

## Estado actual del proyecto

- [x] Base de datos diseñada y con RLS (seguridad)
- [x] Backend Flask con rutas GET para lecciones, acordes, ejercicios
- [x] Frontend base: dashboard + login
- [ ] Registro de usuario (frontend)
- [ ] Guardar progreso del usuario (backend + frontend)
- [ ] Vista de detalle de lección con acordes
- [ ] Ejercicios interactivos (quiz)
- [ ] (Opcional / fase 2) Notación musical real, afinador, reconocimiento de audio

## Notas para la tesis

- La autenticación (registro/login/contraseñas) la maneja Supabase Auth, no código propio — es más seguro y evita reinventar el manejo de contraseñas.
- Las políticas de Row Level Security (RLS) garantizan que cada usuario solo pueda ver/modificar su propio progreso.
- Arquitectura de 3 capas: Frontend (HTML/JS) → Backend (Flask/Python) → Base de datos (Supabase/Postgres)
