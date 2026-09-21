# =========================================================
# "Application factory": arma la app Flask y conecta cada
# modulo de rutas (blueprint). Si agregan un recurso nuevo
# (ej. partituras), solo crean app/routes/partituras.py y lo
# registran aqui, sin tocar nada mas.
# =========================================================
from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)

    from .routes.health import bp as health_bp
    from .routes.lecciones import bp as lecciones_bp
    from .routes.acordes import bp as acordes_bp
    from .routes.ejercicios import bp as ejercicios_bp
    from .routes.progreso import bp as progreso_bp

    app.register_blueprint(health_bp)
    app.register_blueprint(lecciones_bp)
    app.register_blueprint(acordes_bp)
    app.register_blueprint(ejercicios_bp)
    app.register_blueprint(progreso_bp)

    return app
