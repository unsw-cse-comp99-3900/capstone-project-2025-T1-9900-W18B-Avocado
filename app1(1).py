from flask import Flask, request, jsonify
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash  # 添加密码哈希库

app = Flask(__name__)

# MySQL 连接配置
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "123456",
    "database": "demo_db"
}

# 连接 MySQL
def get_db_connection():
    conn = mysql.connector.connect(**DB_CONFIG)
    return conn

# ... (保留原有的测试接口和获取用户接口) ...

# 修改注册接口：添加密码字段和哈希处理
@app.route('/addUser', methods=['POST'])
def add_user():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    age = data.get("age")
    password = data.get("password")  # 新增密码字段

    # 检查所有字段是否填写
    if not name or not email or not age or not password:
        return jsonify({"error": "All fields must be filled in."}), 400

    try:
        # 对密码进行哈希处理
        hashed_password = generate_password_hash(password)
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM demo_user WHERE email = %s",
            [email]
        )
        records = cursor.fetchall()
        # 检查邮箱是否已存在
        if len(records) > 0 :
            return jsonify({"error": "Email already exists."}), 400
        
        # 插入包含密码的SQL语句
        cursor.execute(
            "INSERT INTO demo_user (name, email, age, password) VALUES (%s, %s, %s, %s)",
            (name, email, age, hashed_password)
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "User added successfully."}), 201
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500

# 登录接口
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # 查询用户邮箱
        cursor.execute("SELECT id, password FROM demo_user WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            # 返回 401 错误，表示未授权
            return jsonify({"error": "Invalid email or password."}), 401
        
        user_id, hashed_password = user[0], user[1]
        # 验证密码是否匹配
        if check_password_hash(hashed_password, password):
            return jsonify({"message": "Login successful", "user_id": user_id}), 200
        else:
            return jsonify({"error": "Invalid email or password."}), 401
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)