from flask import Flask, jsonify, request, g
from flask_cors import CORS
from supabase import create_client, Client
from functools import wraps
import os
import requests
from dotenv import load_dotenv

# Carga las variables del archivo .env
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
CORS(app)  # permite que tu frontend (otro origen) haga peticiones a este backend


# ---------------------------------------------------------
# Petición directa a la API REST de Supabase, usando el
# token del usuario (no la anon key) para que las políticas
# de RLS reconozcan quién es auth.uid().
# ---------------------------------------------------------
def supabase_rest(method, tabla, token, params=None, json_body=None):
    url = f"{SUPABASE_URL}/rest/v1/{tabla}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    if method == "POST":
        # Para que el upsert devuelva la fila guardada y actualice si ya existía
        headers["Prefer"] = "resolution=merge-duplicates,return=representation"

    return requests.request(method, url, headers=headers, params=params, json=json_body)


# ---------------------------------------------------------
# Verificación de usuario (autenticación)
# ---------------------------------------------------------
# El frontend, después de hacer login con Supabase, recibe un
# "access_token" (JWT). Debe enviarlo en cada petición protegida
# así: Authorization: Bearer <token>
#
# Esta función le pregunta a Supabase "¿de quién es este token?"
# y si es válido, guarda el id del usuario en `g.user_id` y el
# propio token en `g.token` (para usarlo luego contra la tabla
# de progreso, respetando RLS).
def auth_required(f):
    @wraps(f)
    def decorador(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Falta el token de autenticación"}), 401

        token = auth_header.split(" ")[1]

        try:
            usuario_response = supabase.auth.get_user(token)
            if not usuario_response or not usuario_response.user:
                return jsonify({"error": "Token inválido o expirado"}), 401

            g.user_id = usuario_response.user.id
            g.token = token

        except Exception as e:
            return jsonify({"error": "Token inválido o expirado"}), 401

        return f(*args, **kwargs)

    return decorador


# ---------------------------------------------------------
# Ruta de prueba: confirma que el servidor está vivo
# ---------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "mensaje": "Backend funcionando"})
# -------------------------------------------------------
# Buscar email por nombre de usuario
# (para login con nombre de usuario en vez de email)
# -------------------------------------------------------
@app.route("/api/buscar-usuario", methods=["POST"])
def buscar_usuario():
    datos = request.get_json(silent=True)
    if not datos:
        return jsonify({"error": "Cuerpo vacío"}), 400

    nombre = datos.get("nombre", "").strip()
    if not nombre:
        return jsonify({"error": "El nombre es obligatorio"}), 400

    # Busca en la tabla profiles por nombre
    resultado = supabase.table("profiles") \
        .select("email") \
        .eq("nombre", nombre) \
        .execute()

    if not resultado.data:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify({"email": resultado.data[0]["email"]}), 200

# ---------------------------------------------------------
# Traer todas las lecciones
# ---------------------------------------------------------
@app.route("/api/lecciones", methods=["GET"])
def get_lecciones():
    response = supabase.table("lecciones").select("*").order("numero").execute()
    return jsonify(response.data)


# ---------------------------------------------------------
# Traer una lección por id
# ---------------------------------------------------------
@app.route("/api/lecciones/<int:leccion_id>", methods=["GET"])
def get_leccion(leccion_id):
    response = supabase.table("lecciones").select("*").eq("id", leccion_id).single().execute()
    return jsonify(response.data)


# ---------------------------------------------------------
# Traer todos los acordes
# ---------------------------------------------------------
@app.route("/api/acordes", methods=["GET"])
def get_acordes():
    response = supabase.table("acordes").select("*").execute()
    return jsonify(response.data)


# ---------------------------------------------------------
# Traer ejercicios (opcionalmente filtrados por lección)
# ---------------------------------------------------------
@app.route("/api/ejercicios", methods=["GET"])
def get_ejercicios():
    response = supabase.table("ejercicios").select("*").execute()
    return jsonify(response.data)


# ---------------------------------------------------------
# Consultar el progreso del usuario autenticado
# ---------------------------------------------------------
@app.route("/api/progreso", methods=["GET"])
@auth_required
def get_progreso():
    resp = supabase_rest(
        "GET", "progreso", g.token,
        params={"usuario_id": f"eq.{g.user_id}"}
    )
    if resp.status_code >= 400:
        return jsonify({"error": resp.text}), resp.status_code
    return jsonify(resp.json())


# ---------------------------------------------------------
# Guardar / actualizar el progreso del usuario autenticado
# ---------------------------------------------------------
# Body esperado (JSON):
# {
#   "tipo": "leccion" | "ejercicio",
#   "contenido_id": 1,
#   "porcentaje": 100,      (opcional, default 0)
#   "completado": true      (opcional, default false)
# }
@app.route("/api/progreso", methods=["POST"])
@auth_required
def guardar_progreso():
    datos = request.get_json(silent=True)

    if not datos:
        return jsonify({"error": "Cuerpo de la petición vacío o inválido"}), 400

    tipo = datos.get("tipo")
    contenido_id = datos.get("contenido_id")
    porcentaje = datos.get("porcentaje", 0)
    completado = datos.get("completado", False)

    # --- Validaciones básicas ---
    if tipo not in ("leccion", "ejercicio"):
        return jsonify({"error": "El campo 'tipo' debe ser 'leccion' o 'ejercicio'"}), 400

    if not isinstance(contenido_id, int):
        return jsonify({"error": "El campo 'contenido_id' es obligatorio y debe ser un número"}), 400

    if not isinstance(porcentaje, int) or porcentaje < 0 or porcentaje > 100:
        return jsonify({"error": "El campo 'porcentaje' debe ser un número entre 0 y 100"}), 400

    # Confirmamos que el contenido exista antes de guardar el progreso
    tabla = "lecciones" if tipo == "leccion" else "ejercicios"
    existe = supabase.table(tabla).select("id").eq("id", contenido_id).execute()
    if not existe.data:
        return jsonify({"error": f"No existe {tipo} con id {contenido_id}"}), 404

    # --- Guardar (insertar o actualizar si ya existía) ---
    registro = {
        "usuario_id": g.user_id,
        "tipo": tipo,
        "contenido_id": contenido_id,
        "porcentaje": porcentaje,
        "completado": completado,
    }

    resp = supabase_rest(
        "POST", "progreso", g.token,
        params={"on_conflict": "usuario_id,tipo,contenido_id"},
        json_body=registro
    )

    if resp.status_code >= 400:
        return jsonify({"error": resp.text}), resp.status_code

    return jsonify(resp.json()), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000, threaded=True)
