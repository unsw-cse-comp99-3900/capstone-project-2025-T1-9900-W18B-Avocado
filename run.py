from app import create_app
from app.nacos.client import start_nacos_registration
from flask_jwt_extended import JWTManager

app = create_app()
app.config["JWT_SECRET_KEY"] = "here-is-the-secret"  # 修改为你自己的密钥
app.config["JWT_VERIFY_SUB"]=False
jwt = JWTManager(app)

if __name__ == "__main__":
    start_nacos_registration()
    app.run(host="0.0.0.0", port=7000, debug=True)
