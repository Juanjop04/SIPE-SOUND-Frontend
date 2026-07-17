from flask import Flask, jsonify
from flask_cors import CORS
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Carga las variables del archivo .env
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
CORS(app)  # permite que tu frontend (otro origen) haga peticiones a este backend


# ---------------------------------------------------------
# Ruta de prueba: confirma que el servidor está vivo
# ---------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "mensaje": "Backend funcionando"})


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


if __name__ == "__main__":
    app.run(debug=True, port=5000)
