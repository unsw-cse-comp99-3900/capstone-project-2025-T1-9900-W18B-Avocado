from flask import Flask
from flask_cors import CORS
from app.routes.analysis_routes import analysis_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(analysis_bp)
    return app
