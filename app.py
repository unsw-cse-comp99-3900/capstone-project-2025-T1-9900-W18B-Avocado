import nacos
import socket
import threading
from flask import Flask, request, jsonify
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from config import *

app = Flask(__name__)
CORS(app)

# 获取本机 IP 地址
def get_host_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

host_ip = get_host_ip()
port = 5000  # Flask 运行端口

# 创建 Nacos 客户端
nacos_client = nacos.NacosClient(
    NACOS_SERVER,
    namespace=NACOS_NAMESPACE,
)

# 注册服务到 Nacos
def register_service():
    nacos_client.add_naming_instance(NACOS_SERVICE_NAME, host_ip, port)
    print(f"✅ 服务 {NACOS_SERVICE_NAME} 已注册到 Nacos，地址: {host_ip}:{port}")

# 启动 Nacos 注册线程
def start_nacos_registration():
    thread = threading.Thread(target=register_service)
    thread.daemon = True
    thread.start()

# 从 Nacos 获取 MySQL 配置
def get_mysql_config():
    try:
        config_str = nacos_client.get_config(NACOS_DATA_ID, NACOS_GROUP)
        if config_str:
            return eval(config_str)  # 解析 JSON
        return {}
    except Exception as e:
        print(f"⚠️ 获取 Nacos 配置失败: {e}")
        return {}

# 加载 MySQL 配置
mysql_config = get_mysql_config()
DB_CONFIG = {
    "host": mysql_config.get("host", "localhost"),
    "user": mysql_config.get("user", "root"),
    "password": mysql_config.get("password", "123456"),
    "database": mysql_config.get("database", "demo_db")
}

# 连接 MySQL
def get_db_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except mysql.connector.Error as e:
        print("⚠️ 数据库连接失败:", str(e))
        return None

# 健康检查接口
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "UP"}), 200

# 用户注册 API （未修改）
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    studentID = data.get("studentID")
    email = data.get("email")
    name = data.get("name")
    faculty = data.get("faculty")
    degree = data.get("degree")
    citizenship = data.get("citizenship")
    isArcMember = data.get("isArcMember")  # 可能是 True/False
    graduationYear = data.get("graduationYear")
    role = data.get("role")
    password = data.get("password")  # 存储密码

    # 检查所有字段是否完整
    if not studentID or not email or not name or not faculty or not degree or not citizenship \
            or isArcMember is None or not graduationYear or not role or not password:
        return jsonify({"error": "All fields must be filled in."}), 400

    # 校验 graduationYear 是否为整数
    try:
        graduationYear = int(graduationYear)
    except ValueError:
        return jsonify({"error": "Graduation Year must be an integer."}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed."}), 500

    cursor = conn.cursor()
    try:
        # 1️⃣ 检查 email 是否已注册
        cursor.execute("SELECT studentID FROM demo_userData WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "Email already exists."}), 400

        # 2️⃣ 处理密码哈希
        hashed_password = generate_password_hash(password)

        # 3️⃣ 插入 `demo_studentData`（不存密码）
        cursor.execute("""
            INSERT INTO demo_studentData (studentID, email, name, faculty, degree, citizenship, 
                                          isArcMember, graduationYear, role)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (studentID, email, name, faculty, degree, citizenship, isArcMember, graduationYear, role))

        # 4️⃣ 插入 `demo_userData`（存储密码）
        cursor.execute("""
            INSERT INTO demo_userData (studentID, email, password, role)
            VALUES (%s, %s, %s, %s)
        """, (studentID, email, hashed_password, role))

        # 提交数据库更改
        conn.commit()
        return jsonify({"message": "User registered successfully."}), 201

    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# 用户登录 API （未修改）
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed."}), 500

    cursor = conn.cursor()
    try:
        # 查询 `demo_userData` 中的用户信息
        cursor.execute("SELECT studentID, password, role FROM demo_userData WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"error": "Invalid email or password."}), 401

        studentID, hashed_password, role = user
        # 校验密码
        if check_password_hash(hashed_password, password):
            return jsonify({"message": "Login successful", "studentID": studentID, "role": role}), 200
        else:
            return jsonify({"error": "Invalid email or password."}), 401
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# 启动 Flask
if __name__ == '__main__':
    start_nacos_registration()
    app.run(host="0.0.0.0", port=port, debug=True)
