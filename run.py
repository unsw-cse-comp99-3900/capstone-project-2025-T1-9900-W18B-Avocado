from flask_jwt_extended import JWTManager
from app import create_app
from app.nacos.client import start_nacos_registration
from datetime import timedelta
app = create_app()
app.config["JWT_SECRET_KEY"] = "here-is-the-secret"  # 修改为你自己的密钥
app.config["JWT_VERIFY_SUB"]=False

# 设置 access token 过期时间（比如 30 分钟）
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)

jwt = JWTManager(app)

if __name__ == "__main__":
    start_nacos_registration()
    app.run(host="0.0.0.0", port=5000, debug=True)
