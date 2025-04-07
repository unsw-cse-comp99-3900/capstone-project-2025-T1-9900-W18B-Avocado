from flask import Flask
from app.routes.event_routes import event_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(event_bp)
    return app
